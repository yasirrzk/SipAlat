import axiosInstance from './axiosInstance';
import { UnitStatus } from '../types/unit.types';
import { mockTrackingData } from './mockData';

export interface TrackingData {
  id: string;
  unitId: string;
  status: UnitStatus;
  lokasi: string;
  kondisi: number;
  jamOperasi: string;
  lastUpdate: string;
  lat: number;
  lng: number;
  unit?: {
    nama: string;
    kode: string;
  };
}

export const trackingApi = {
  getLiveStatus: async () => {
    return new Promise<TrackingData[]>((resolve) => {
      setTimeout(() => {
        resolve(mockTrackingData);
      }, 500);
    });
  },
  
  getHistory: async (unitId: string) => {
    return new Promise<TrackingData[]>((resolve) => {
      setTimeout(() => {
        // Just return the same data as history for now
        resolve(mockTrackingData.filter(t => t.unitId === unitId));
      }, 500);
    });
  },
  
  updateStatus: async (unitId: string, data: Partial<TrackingData>) => {
    return new Promise<TrackingData>((resolve, reject) => {
      setTimeout(() => {
        const index = mockTrackingData.findIndex(t => t.unitId === unitId);
        if (index !== -1) {
          mockTrackingData[index] = { ...mockTrackingData[index], ...data };
          resolve(mockTrackingData[index]);
        } else {
          reject(new Error('Unit not found'));
        }
      }, 500);
    });
  }
};
