import { model, Schema, Types } from "mongoose";
import { IUser } from "./IUser.ts";

export class UserClass implements IUser {
  name: IUser["name"];
  email: IUser["email"];
  password: IUser["password"];
  role?: IUser["role"];
  products?: IUser["products"];
  _id?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(user: IUser) {
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
    this.role = user.role;
    this.products = user.products;
    this._id = user._id;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, required: true },
  products: [
    {
      type: Types.ObjectId,
      ref: "Product",
    },
  ],
}, {
  timestamps: true,
});

UserSchema.loadClass(UserClass);

export const UserModel = model<IUser>("User", UserSchema);
export { UserSchema };
