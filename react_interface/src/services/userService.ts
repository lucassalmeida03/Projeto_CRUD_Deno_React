import { api } from './api';
import type { CreateUserData } from '../types/User';

export async function createUser(userData: CreateUserData) {
  return api.post('/users', userData);
}
