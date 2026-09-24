import type { Product } from './Product';
import type { User } from './User';

export interface CreateOrderData {
  productId: string;
  quantity: number;
}

export interface Order {
  _id?: string;
  product: Product | string | null;
  customer?: User | string;
  seller?: User | string;
  quantity: number;
  totalAmount: number;
  status: 'pending' | 'paid' | 'canceled';
}
