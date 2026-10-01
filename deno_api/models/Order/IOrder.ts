import { Schema } from "mongoose";
import { IBaseInterface } from "../../base/IBaseInterface.ts";

export type OrderStatus = "pending" | "paid" | "canceled";

export interface IOrder extends IBaseInterface {
  customer: {
    _id: Schema.Types.ObjectId | string;
    name: string;
    email: string;
  };
  product: {
    _id: Schema.Types.ObjectId;
    title: string;
    price: number;
  };
  seller: {
    _id: Schema.Types.ObjectId | string;
    name: string;
    email: string;
  };
  quantity: number;
  status: OrderStatus;
  totalAmount: number;
}
