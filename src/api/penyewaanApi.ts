import axiosInstance from './axiosInstance';
import type { Penyewaan } from '../types/penyewaan.types';
import { mockPenyewaans, mockUnits, mockPelanggans } from './mockData';

export const penyewaanApi = {
  getAll: async () => {
    return new Promise<Penyewaan[]>((resolve) => {
      setTimeout(() => {
        const enriched = mockPenyewaans.map(p => ({
          ...p,
          unit: mockUnits.find(u => u.id === p.unitId),
          pelanggan: mockPelanggans.find(c => c.id === p.pelangganId)
        }));
        resolve(enriched);
      }, 500);
    });
  },

  getById: async (id: string) => {
    return new Promise<Penyewaan>((resolve, reject) => {
      setTimeout(() => {
        const item = mockPenyewaans.find(p => p.id === id);
        if (item) {
          const enriched = {
            ...item,
            unit: mockUnits.find(u => u.id === item.unitId),
            pelanggan: mockPelanggans.find(c => c.id === item.pelangganId)
          };
          resolve(enriched);
        } else {
          reject(new Error('Penyewaan not found'));
        }
      }, 500);
    });
  },

  create: async (data: Omit<Penyewaan, 'id'>) => {
    return new Promise<Penyewaan>((resolve) => {
      setTimeout(() => {
        const newItem = { ...data, id: Math.random().toString(36).substr(2, 9) };
        mockPenyewaans.push(newItem as Penyewaan);
        resolve(newItem as Penyewaan);
      }, 500);
    });
  },
  
  updateStatus: async (id: string, status: string) => {
    return new Promise<Penyewaan>((resolve, reject) => {
      setTimeout(() => {
        const index = mockPenyewaans.findIndex(p => p.id === id);
        if (index !== -1) {
          mockPenyewaans[index] = { ...mockPenyewaans[index], status: status as any };
          resolve(mockPenyewaans[index]);
        } else {
          reject(new Error('Penyewaan not found'));
        }
      }, 500);
    });
  },
  delete: async (id: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const index = mockPenyewaans.findIndex(p => p.id === id);
        if (index !== -1) {
          mockPenyewaans.splice(index, 1);
        }
        resolve();
      }, 500);
    });
  }
};
