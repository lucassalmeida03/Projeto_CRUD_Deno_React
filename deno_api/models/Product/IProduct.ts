import { IBaseInterface } from "../../base/IBaseInterface.ts";
import { Schema } from "mongoose";

export interface IProduct extends IBaseInterface {
  title: string;
  description?: string;
  price: number;
  stock: number;
  seller: Schema.Types.ObjectId | string
}
