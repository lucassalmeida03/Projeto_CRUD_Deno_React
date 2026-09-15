import { IBaseInterface } from '../../base/IBaseInterface.ts'

export enum userRole {
  ADMIN = 'admin',
  SELLER = 'seller',
  CUSTOMER= "customer"
}

export interface IUser extends IBaseInterface {

  name: string,
  email: string,
  password: string,
  role?: userRole
  
}