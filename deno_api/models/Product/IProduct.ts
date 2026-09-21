import { IBaseInterface } from "../../base/IBaseInterface.ts";
import { Types } from "mongoose";
import { IUser } from "../User/IUser.ts";

export interface IProduct extends IBaseInterface {
  title: string;
  description?: string;
  price: number;
  stock: number;
  user: Types.ObjectId | IUser
}