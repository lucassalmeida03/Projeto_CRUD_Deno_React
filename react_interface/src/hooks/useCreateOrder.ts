import { useState } from 'react';
import type { CreateOrderData, Order } from '../types/Order';
import { createOrder } from '../services/orderService';

interface OrderError {
  response?: { data?: { message?: string } };
}

export function useCreateOrder() {
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

  return {
    isCreating,
    saveOrder,
    errorMessage,
  };
}
