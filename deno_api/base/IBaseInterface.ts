import { Schema } from "mongoose";

export interface IBaseInterface {
  _id?: Schema.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
