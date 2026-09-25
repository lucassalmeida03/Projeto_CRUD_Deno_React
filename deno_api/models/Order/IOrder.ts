import { Types } from "mongoose";
import { IBaseInterface } from "../../base/IBaseInterface.ts";
import { IUser } from "../User/IUser.ts";
import { IProduct } from "../Product/IProduct.ts";

export type OrderStatus = "pending" | "paid" | "canceled";

export interface IOrder extends IBaseInterface {
  customer: Types.ObjectId | IUser;
  product: Types.ObjectId | IProduct;
  seller: Types.ObjectId | IUser;
  quantity: number;
  status: OrderStatus;
  totalAmount: number;
}
