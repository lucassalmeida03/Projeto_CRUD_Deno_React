import { model, Schema } from "mongoose";
import { IProduct } from "./IProduct.ts";

export class ProductClass implements IProduct {
  title: IProduct["title"];
  description?: IProduct["description"];
  price: IProduct["price"];
  stock: IProduct["stock"];
  user: IProduct["user"];
  _id?: Schema.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(product: IProduct) {
    this.title = product.title;
    this.description = product.description;
    this.price = product.price;
    this.stock = product.stock;
    this._id = product._id;
    this.user = product.user;
    this.createdAt = product.createdAt;
    this.updatedAt = product.updatedAt;
  }
}

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    user: {
      _id: { type: Schema.Types.ObjectId, ref: "User", required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
  },
  {
    timestamps: true,
  },
);

ProductSchema.loadClass(ProductClass);

export const ProductModel = model<IProduct>("Product", ProductSchema);
export { ProductSchema };
