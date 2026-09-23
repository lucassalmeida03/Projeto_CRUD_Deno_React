import { api } from './api';
import type { LoginData, LoginResponse } from '../types/Auth';

export async function createSession(loginData: LoginData): Promise<LoginResponse> {
  const response = await api.post<{ data: LoginResponse }>('/sessions', loginData);
  return response.data.data;
}
