import api from './axios';
import { ApiResponse, User } from '@/types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'sales';
}

export interface AuthData {
  token: string;
  user: User;
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthData> => {
    const { data } = await api.post<ApiResponse<AuthData>>('/auth/login', payload);
    if (!data.data) throw new Error('No auth data received');
    return data.data;
  },

  register: async (payload: RegisterPayload): Promise<AuthData> => {
    const { data } = await api.post<ApiResponse<AuthData>>('/auth/register', payload);
    if (!data.data) throw new Error('No auth data received');
    return data.data;
  },

  getMe: async (): Promise<User> => {
    const { data } = await api.get<ApiResponse<User>>('/auth/me');
    if (!data.data) throw new Error('No user data received');
    return data.data;
  },
};
