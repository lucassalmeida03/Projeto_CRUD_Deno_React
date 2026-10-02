import { model, Schema } from "mongoose";
import { IProduct } from "./IProduct.ts";

export class ProductClass implements IProduct {
  title: IProduct["title"];
  description?: IProduct["description"];
  price: IProduct["price"];
  stock: IProduct["stock"];
  seller: IProduct["seller"];
  _id?: Schema.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(product: IProduct) {
    this.title = product.title;
    this.description = product.description;
    this.price = product.price;
    this.stock = product.stock;
    this._id = product._id;
    this.seller = product.seller;
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
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  },
);

ProductSchema.index({ seller: 1, createdAt: -1, _id: 1 });
ProductSchema.index({ createdAt: -1, _id: 1 });

ProductSchema.loadClass(ProductClass);

export const ProductModel = model<IProduct>("Product", ProductSchema);
export { ProductSchema };
