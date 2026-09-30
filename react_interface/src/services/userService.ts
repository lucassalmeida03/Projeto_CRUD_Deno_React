import { api } from './api';
import type { CreateUserData, User } from '../types/User';

export async function createUser(userData: CreateUserData) {
  return api.post('/users', userData);
}

export interface UserPagination {
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserPage {
  users: User[];
  pagination: UserPagination;
}

export async function getUsers(page = 1, limit = 7): Promise<UserPage> {
  const response = await api.get<{ data: UserPage }>('/users', {
    params: { page, limit },
  });
  return response.data.data;
}

export async function deleteUser(userId: string): Promise<void> {
  await api.delete(`/users/${userId}`);
}
