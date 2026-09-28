import { IBaseInterface } from "../../base/IBaseInterface.ts";
import { Schema } from "mongoose";
import { IProduct } from "../Product/IProduct.ts";

export enum userRole {
  ADMIN = "admin",
  SELLER = "seller",
  CUSTOMER = "customer",
}

export interface IUser extends IBaseInterface {
  name: string;
  email: string;
  password: string;
  role?: userRole;
  products?: Schema.Types.ObjectId[] | IProduct[];
}
