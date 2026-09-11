import { Types } from 'mongoose'

export interface IBaseInterface {
  _id?: Types.ObjectId
  createdAt?: Date
  updatedAt?: Date
}