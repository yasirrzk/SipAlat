import axiosInstance from './axiosInstance';
import { UnitStatus } from '../types/unit.types';

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
    const response = await axiosInstance.get<TrackingData[]>('/tracking/live');
    return response.data;
  },
  
  getHistory: async (unitId: string) => {
    const response = await axiosInstance.get<TrackingData[]>(`/tracking/history/${unitId}`);
    return response.data;
  },
  
  updateStatus: async (unitId: string, data: Partial<TrackingData>) => {
    const response = await axiosInstance.post<TrackingData>(`/tracking/${unitId}`, data);
    return response.data;
  }
};
