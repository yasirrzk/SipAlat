import axiosInstance from './axiosInstance';
import type { Unit } from '../types/unit.types';

export const unitApi = {
  getAll: async () => {
    const response = await axiosInstance.get<Unit[]>('/units');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await axiosInstance.get<Unit>(`/units/${id}`);
    return response.data;
  },
  
  create: async (unit: Omit<Unit, 'id'>) => {
    const response = await axiosInstance.post<Unit>('/units', unit);
    return response.data;
  },
  
  update: async (id: string, unit: Partial<Unit>) => {
    const response = await axiosInstance.patch<Unit>(`/units/${id}`, unit);
    return response.data;
  },
  
  delete: async (id: string) => {
    await axiosInstance.delete(`/units/${id}`);
  },
};
