import { api } from './api';
import type { CreateOrderData, Order } from '../types/Order';

export async function createOrder(orderData: CreateOrderData): Promise<Order> {
  const response = await api.post<{ data: { data: Order } }>(
    '/orders',
    orderData
  );
  return response.data.data.data;
}

export interface SalesPage {
  sales: Order[];
  pagination: OrderPagination;
}

export async function getSales(page = 1, limit = 7): Promise<SalesPage> {
  const response = await api.get<{ data: SalesPage }>('/orders/my-sales', {
    params: { page, limit },
  });
  return response.data.data;
}

export interface OrderPagination {
  page: number;
  limit: number;
  totalPages: number;
}

export interface CustomerOrdersPage {
  orders: Order[];
  pagination: OrderPagination;
}

export async function getCustomerOrders(
  page = 1,
  limit = 7
): Promise<CustomerOrdersPage> {
  const response = await api.get<{ data: CustomerOrdersPage }>(
    '/orders/my-orders',
    { params: { page, limit } }
  );
  return response.data.data;
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
