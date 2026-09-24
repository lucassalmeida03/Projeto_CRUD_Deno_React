import { api } from './api';
import type { CreateUserData, User } from '../types/User';

export async function createUser(userData: CreateUserData) {
  return api.post('/users', userData);
}

export async function getUsers(): Promise<User[]> {
  const response = await api.get<{ data: { users: User[] } }>('/users');
  return response.data.data.users;
}

export async function deleteUser(userId: string): Promise<void> {
  await api.delete(`/users/${userId}`);
}
