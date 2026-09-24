import { useEffect, useState } from 'react';
import {
  cancelOrder,
  deleteOrder,
  getCustomerOrders,
} from '../services/orderService';
import type { Order } from '../types/Order';

interface OrderError {
  response?: { data?: { message?: string } };
}

function getErrorMessage(error: unknown, fallback: string) {
  return (error as OrderError).response?.data?.message ?? fallback;
}

export function useCustomerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadOrders() {
      try {
        setOrders(await getCustomerOrders());
      } catch (error) {
        setErrorMessage(
          getErrorMessage(error, 'Não foi possível carregar seus pedidos.')
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadOrders();
  }, []);

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
      setOrders((current) => current.filter((order) => order._id !== orderId));
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
    isLoading,
    processingOrderId,
    errorMessage,
    handleCancelOrder,
    handleDeleteOrder,
  };
}
