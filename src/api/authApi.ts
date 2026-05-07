import axiosInstance from './axiosInstance';
import { User, LoginCredentials } from '../types/auth.types';

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    return new Promise<{ user: User; token: string }>((resolve, reject) => {
      setTimeout(() => {
        // Simple mock check
        if (credentials.email && credentials.password.length >= 6) {
          resolve({
            user: {
              id: '1',
              nama: 'Administrator SipAlat',
              email: credentials.email,
              role: 'admin',
            },
            token: 'mock-jwt-token-for-sipalat',
          });
        } else {
          reject(new Error('Email atau password salah'));
        }
      }, 1000);
    });
  },
};
