import { api } from './api';
import type { CreateOrderData, Order } from '../types/Order';

export async function createOrder(orderData: CreateOrderData): Promise<Order> {
  const response = await api.post<{ data: { data: Order } }>(
    '/orders',
    orderData
  );
  return response.data.data.data;
}

export async function getSales(): Promise<Order[]> {
  const response = await api.get<{ data: { sales: Order[] } }>(
    '/orders/my-sales'
  );
  return response.data.data.sales;
}

export async function getCustomerOrders(): Promise<Order[]> {
  const response = await api.get<{ data: { data: Order[] } }>(
    '/orders/my-orders'
  );
  return response.data.data.data;
}

export async function cancelOrder(orderId: string): Promise<Order> {
  const response = await api.patch<{ data: { data: Order } }>(
    `/orders/${orderId}/cancel`
  );
  return response.data.data.data;
}

export async function deleteOrder(orderId: string): Promise<void> {
  await api.delete(`/orders/${orderId}/delete`);
}

export async function markOrderAsPaid(orderId: string): Promise<Order> {
  const response = await api.patch<{ data: { data: Order } }>(
    `/orders/${orderId}/pay`
  );
  return response.data.data.data;
}
