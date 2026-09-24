import { api } from './api';
import type { CreateProduct, Product } from '../types/Product';

export async function createProduct(
  productData: CreateProduct
): Promise<Product> {
  const response = await api.post<{ data: { data: Product } }>(
    '/products',
    productData
  );
  return response.data.data.data;
}

export async function getMyProducts(): Promise<Product[]> {
  const response = await api.get<{ data: { products: Product[] } }>(
    '/products/my-products'
  );
  return response.data.data.products;
}

export async function getProducts(): Promise<Product[]> {
  const response = await api.get<{ data: { products: Product[] } }>(
    '/products'
  );
  return response.data.data.products;
}

export async function deleteProduct(productId: string): Promise<void> {
  await api.delete(`/products/${productId}`);
}

export async function updateProduct(
  productId: string,
  productData: CreateProduct
): Promise<Product> {
  const response = await api.put<{ data: { updatedProduct: Product } }>(
    `/products/${productId}`,
    productData
  );
  return response.data.data.updatedProduct;
}
