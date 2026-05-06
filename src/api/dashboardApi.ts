import axiosInstance from './axiosInstance';

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
    const response = await axiosInstance.get<DashboardStats>('/dashboard/stats');
    return response.data;
  },
};
