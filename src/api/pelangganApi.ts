import axiosInstance from './axiosInstance';
import type { Pelanggan } from '../types/pelanggan.types';

export const pelangganApi = {
  getAll: async () => {
    const response = await axiosInstance.get<Pelanggan[]>('/pelanggan');
    return response.data;
  },
  create: async (data: Omit<Pelanggan, 'id'>) => {
    const response = await axiosInstance.post<Pelanggan>('/pelanggan', data);
    return response.data;
  }
};
