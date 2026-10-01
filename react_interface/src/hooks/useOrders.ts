import { useEffect, useState } from 'react';
import { getSales, markOrderAsPaid } from '../services/orderService';
import type { OrderPagination } from '../services/orderService';
import type { Order } from '../types/Order';

const PAGE_SIZE = 7;

interface OrderError {
  response?: { data?: { message?: string } };
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<OrderPagination>({
    page: 1,
    limit: PAGE_SIZE,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isCurrentRequest = true;

    async function loadSales() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const result = await getSales(page, PAGE_SIZE);
        if (isCurrentRequest) {
          setOrders(result.sales);
          setPagination(result.pagination);
        }
      } catch (error) {
        if (isCurrentRequest) {
          setErrorMessage(
            (error as OrderError).response?.data?.message ??
              'Não foi possível carregar os pedidos.'
          );
        }
      } finally {
        if (isCurrentRequest) setIsLoading(false);
      }
    }

    void loadSales();
    return () => {
      isCurrentRequest = false;
    };
  }, [page]);

  async function payOrder(orderId: string) {
    setErrorMessage('');
    setPayingOrderId(orderId);

    try {
      const updatedOrder = await markOrderAsPaid(orderId);
      setOrders((current) =>
        current.map((order) =>
          order._id === orderId
            ? { ...order, status: updatedOrder.status }
            : order
        )
      );
    } catch (error) {
      setErrorMessage(
        (error as OrderError).response?.data?.message ??
          'Não foi possível marcar o pedido como pago.'
      );
    } finally {
      setPayingOrderId(null);
    }
  }

  return {
    orders,
    page,
    setPage,
    pagination,
    isLoading,
    payingOrderId,
    errorMessage,
    payOrder,
  };
}
