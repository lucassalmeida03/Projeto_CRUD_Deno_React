import { IBaseInterface } from '../../base/IBaseInterface.ts'

export enum userRole {
  ADMIN = 'admin',
  USER = 'user'
}

export interface IUser extends IBaseInterface {

  name: string,
  email: string,
  password: string,
  role?: userRole
  
}