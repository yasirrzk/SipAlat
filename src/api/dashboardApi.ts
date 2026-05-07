import axiosInstance from './axiosInstance';
import { mockDashboardStats, mockUnits, mockPenyewaans, mockPelanggans } from './mockData';

export interface DashboardStats {
  totalUnits: number;
  availableUnits: number;
  rentedUnits: number;
  revenueThisMonth: number;
  recentActivities: {
    id: string;
    description: string;
    customer: string;
    timeAgo: string;
  }[];
  monthlyStats: {
    month: string;
    total: number;
  }[];
}

export const dashboardApi = {
  getStats: async () => {
    // Simulating API call and calculating live stats from mock data
    return new Promise<DashboardStats>((resolve) => {
      setTimeout(() => {
        const totalUnits = mockUnits.length;
        const availableUnits = mockUnits.filter(u => u.status === 'tersedia').length;
        const rentedUnits = mockUnits.filter(u => u.status === 'disewa').length;
        
        // Calculate revenue from active rentals this month
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();
        
        const recentActivities = [
          { id: '1', description: `Penyewaan ${mockUnits[0].nama}`, customer: mockPelanggans[0].perusahaan, timeAgo: '2 jam yang lalu' },
          { id: '2', description: `Pengembalian ${mockUnits[2].nama}`, customer: mockPelanggans[1].perusahaan, timeAgo: '5 jam yang lalu' },
          { id: '3', description: `Maintenance ${mockUnits[3].nama}`, customer: 'Internal', timeAgo: '1 hari yang lalu' },
          { id: '4', description: `Penyewaan ${mockUnits[4].nama}`, customer: mockPelanggans[2].perusahaan, timeAgo: '2 hari yang lalu' },
          { id: '5', description: 'Pendaftaran Pelanggan Baru', customer: mockPelanggans[4].perusahaan, timeAgo: '3 hari yang lalu' },
        ];

        resolve({
          ...mockDashboardStats,
          totalUnits,
          availableUnits,
          rentedUnits,
          revenueThisMonth:  mockDashboardStats.revenueThisMonth, 
          recentActivities,
        });
      }, 500);
    });
  },
};
