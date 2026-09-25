import { Types } from "mongoose";

declare namespace Express {
  export interface Request {
    user?: {
      _id: Types.ObjectId | string;
      role: string;
    };
  }
}
