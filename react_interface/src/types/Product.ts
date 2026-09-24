export interface Product {
  id?: string;
  _id?: string;
  title: string;
  description?: string;
  stock: number;
  price: number;
}

export interface CreateProduct {
  title: string;
  description?: string;
  stock: number;
  price: number;
}
