import axiosInstance from './axiosInstance';
import type { Unit } from '../types/unit.types';
import { mockUnits } from './mockData';

export const unitApi = {
  getAll: async () => {
    return new Promise<Unit[]>((resolve) => {
      setTimeout(() => {
        resolve(mockUnits);
      }, 500);
    });
  },
  
  getById: async (id: string) => {
    return new Promise<Unit>((resolve, reject) => {
      setTimeout(() => {
        const unit = mockUnits.find(u => u.id === id);
        if (unit) resolve(unit);
        else reject(new Error('Unit not found'));
      }, 500);
    });
  },
  
  create: async (unit: Omit<Unit, 'id'>) => {
    return new Promise<Unit>((resolve) => {
      setTimeout(() => {
        const newUnit = { ...unit, id: Math.random().toString(36).substr(2, 9) };
        mockUnits.push(newUnit);
        resolve(newUnit);
      }, 500);
    });
  },
  
  update: async (id: string, unit: Partial<Unit>) => {
    return new Promise<Unit>((resolve, reject) => {
      setTimeout(() => {
        const index = mockUnits.findIndex(u => u.id === id);
        if (index !== -1) {
          mockUnits[index] = { ...mockUnits[index], ...unit };
          resolve(mockUnits[index]);
        } else {
          reject(new Error('Unit not found'));
        }
      }, 500);
    });
  },
  
  delete: async (id: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const index = mockUnits.findIndex(u => u.id === id);
        if (index !== -1) {
          mockUnits.splice(index, 1);
        }
        resolve();
      }, 500);
    });
  },
};
