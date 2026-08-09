import { api } from '../api/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await api.post('/auth/login', {
      email: credentials.email,
      senha: credentials.password,
    });

    return response.data;
  },
};