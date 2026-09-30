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

export interface ProductPagination {
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductPage {
  products: Product[];
  pagination: ProductPagination;
}

export async function getMyProducts(): Promise<Product[]> {
  const response = await api.get<{ data: { products: Product[] } }>(
    '/products/my-products'
  );
  return response.data.data.products;
}

export async function getProducts(page = 1, limit = 12): Promise<ProductPage> {
  const response = await api.get<{ data: ProductPage }>('/products', {
    params: { page, limit },
  });
  return response.data.data;
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
