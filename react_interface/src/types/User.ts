import type { UserRole } from './UserRole';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}
