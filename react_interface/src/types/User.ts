import type { UserRole } from './UserRole';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}
