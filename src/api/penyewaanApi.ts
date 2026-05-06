import axiosInstance from './axiosInstance';
import type { Penyewaan } from '../types/penyewaan.types';

export const penyewaanApi = {
  getAll: async () => {
    const response = await axiosInstance.get<Penyewaan[]>('/penyewaan');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await axiosInstance.get<Penyewaan>(`/penyewaan/${id}`);
    return response.data;
  },
  
  create: async (data: Omit<Penyewaan, 'id'>) => {
    const response = await axiosInstance.post<Penyewaan>('/penyewaan', data);
    return response.data;
  },
  
  updateStatus: async (id: string, status: string) => {
    const response = await axiosInstance.patch<Penyewaan>(`/penyewaan/${id}/status`, { status });
    return response.data;
  }
};
