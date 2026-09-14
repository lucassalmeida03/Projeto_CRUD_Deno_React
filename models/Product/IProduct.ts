import { IBaseInterface } from "../../base/IBaseInterface.ts";

export interface IProduct extends IBaseInterface {
  title: string;
  description?: string;
  price: number;
  stock: number;
}