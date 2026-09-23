import type { UserRole } from './UserRole';

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}
