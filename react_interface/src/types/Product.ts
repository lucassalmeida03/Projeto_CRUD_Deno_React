export interface Product {
  id?: string;
  title: string;
  description: string;
  stock: number;
  price: string;
}

export interface CreateProduct {
  title: string;
  description?: string;
  stock: number;
  price: string;
}