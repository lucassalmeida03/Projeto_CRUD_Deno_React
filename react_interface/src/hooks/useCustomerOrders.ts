import { useEffect, useState } from 'react';
import {
  cancelOrder,
  deleteOrder,
  getCustomerOrders,
} from '../services/orderService';
import type { Order } from '../types/Order';

const PAGE_SIZE = 7;

interface OrderError {
  response?: { data?: { message?: string } };
}

function getErrorMessage(error: unknown, fallback: string) {
  return (error as OrderError).response?.data?.message ?? fallback;
}

export function useCustomerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isCurrentRequest = true;

    async function loadOrders() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const result = await getCustomerOrders(page, PAGE_SIZE);
        if (isCurrentRequest) {
          setOrders(result.orders);
          setPagination(result.pagination);
        }
      } catch (error) {
        if (isCurrentRequest) {
          setErrorMessage(
            getErrorMessage(error, 'Não foi possível carregar seus pedidos.')
          );
        }
      } finally {
        if (isCurrentRequest) setIsLoading(false);
      }
    }

    void loadOrders();
    return () => {
      isCurrentRequest = false;
    };
  }, [page]);

  async function handleCancelOrder(orderId: string) {
    setErrorMessage('');
    setProcessingOrderId(orderId);

    try {
      const updatedOrder = await cancelOrder(orderId);
      setOrders((current) =>
        current.map((order) =>
          order._id === orderId
            ? { ...order, status: updatedOrder.status }
            : order
        )
      );
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, 'Não foi possível cancelar o pedido.')
      );
    } finally {
      setProcessingOrderId(null);
    }
  }

  async function handleDeleteOrder(orderId: string) {
    setErrorMessage('');
    setProcessingOrderId(orderId);

    try {
      await deleteOrder(orderId);
      if (orders.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      } else {
        const result = await getCustomerOrders(page, PAGE_SIZE);
        setOrders(result.orders);
        setPagination(result.pagination);
      }
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, 'Não foi possível excluir o pedido.')
      );
    } finally {
      setProcessingOrderId(null);
    }
  }

  return {
    orders,
    page,
    setPage,
    pagination,
    isLoading,
    processingOrderId,
    errorMessage,
    handleCancelOrder,
    handleDeleteOrder,
  };
}
