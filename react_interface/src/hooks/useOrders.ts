import { useEffect, useState } from 'react';
import {
  createOrder,
  getSales,
  markOrderAsPaid,
} from '../services/orderService';
import type { CreateOrderData, Order } from '../types/Order';

interface OrderError {
  response?: { data?: { message?: string } };
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadSales() {
      try {
        setOrders(await getSales());
      } catch (error) {
        setErrorMessage(
          (error as OrderError).response?.data?.message ??
            'Não foi possível carregar os pedidos.'
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadSales();
  }, []);

  async function saveOrder(orderData: CreateOrderData): Promise<Order> {
    setIsCreating(true);
    setErrorMessage('');

    try {
      return await createOrder(orderData);
    } catch (error) {
      setErrorMessage(
        (error as OrderError).response?.data?.message ??
          'Não foi possível criar o pedido.'
      );
      throw error;
    } finally {
      setIsCreating(false);
    }
  }

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
    isLoading,
    isCreating,
    payingOrderId,
    errorMessage,
    saveOrder,
    payOrder,
  };
}
