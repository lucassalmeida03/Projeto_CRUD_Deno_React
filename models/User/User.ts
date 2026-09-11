import { IUser } from "./IUser.ts";
import { Types } from "mongoose";


export class UserClass implements IUser {
    name: IUser["name"];
    email: IUser["email"];
    password: IUser["password"];
    _id?: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(user: IUser) {
        this.name = user.name;
        this.email = user.email;
        this.password = user.password;
        this._id = user._id;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }
}