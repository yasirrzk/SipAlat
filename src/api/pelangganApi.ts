import axiosInstance from './axiosInstance';
import type { Pelanggan } from '../types/pelanggan.types';
import { mockPelanggans } from './mockData';

export const pelangganApi = {
  getAll: async () => {
    return new Promise<Pelanggan[]>((resolve) => {
      setTimeout(() => {
        resolve(mockPelanggans);
      }, 500);
    });
  },
  create: async (data: Omit<Pelanggan, 'id'>) => {
    return new Promise<Pelanggan>((resolve) => {
      setTimeout(() => {
        const newPelanggan = { ...data, id: Math.random().toString(36).substr(2, 9) };
        mockPelanggans.push(newPelanggan);
        resolve(newPelanggan);
      }, 500);
    });
  },
  update: async (id: string, data: Partial<Pelanggan>) => {
    return new Promise<Pelanggan>((resolve, reject) => {
      setTimeout(() => {
        const index = mockPelanggans.findIndex(p => p.id === id);
        if (index !== -1) {
          mockPelanggans[index] = { ...mockPelanggans[index], ...data };
          resolve(mockPelanggans[index]);
        } else {
          reject(new Error('Pelanggan not found'));
        }
      }, 500);
    });
  },
  delete: async (id: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const index = mockPelanggans.findIndex(p => p.id === id);
        if (index !== -1) {
          mockPelanggans.splice(index, 1);
        }
        resolve();
      }, 500);
    });
  }
};
