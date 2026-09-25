import { IOrder } from "./IOrder.ts";
import { model, Schema, Types } from "mongoose";

export class OrderClass implements IOrder {
  customer: IOrder["customer"];
  product: IOrder["product"];
  seller: IOrder["seller"];
  totalAmount: IOrder["totalAmount"];
  quantity: IOrder["quantity"];
  status: IOrder["status"];
  _id?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(order: IOrder) {
    this.customer = order.customer;
    this.product = order.product;
    this.seller = order.seller;
    this.totalAmount = order.totalAmount || 0;
    this.quantity = order.quantity || 1;
    this.status = order.status || "pending";
  }
}

const OrderSchema = new Schema<IOrder>(
  {
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
    totalAmount: { type: Number, required: true },
    quantity: {
      type: Number,
      required: [true, "A quantidade é obrigatória."],
      min: [1, "A quantidade mínima permitida é 1."],
      default: 1,
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "paid", "canceled"],
        message: "Status inválido: {VALUE}",
      },
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

OrderSchema.loadClass(OrderClass);

export const OrderModel = model<IOrder>("Order", OrderSchema);
