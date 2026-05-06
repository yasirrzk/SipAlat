import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trackingApi } from '../api/trackingApi';
import toast from 'react-hot-toast';

export const useTracking = () => {
  const queryClient = useQueryClient();

  const useLiveTracking = () => {
    return useQuery({
      queryKey: ['tracking', 'live'],
      queryFn: trackingApi.getLiveStatus,
      refetchInterval: 30000, // Poll every 30 seconds as per SOP
      refetchIntervalInBackground: true,
    });
  };

  const useTrackingHistory = (unitId: string) => {
    return useQuery({
      queryKey: ['tracking', 'history', unitId],
      queryFn: () => trackingApi.getHistory(unitId),
      enabled: !!unitId,
    });
  };

  const useUpdateTracking = () => {
    return useMutation({
      mutationFn: ({ unitId, data }: { unitId: string; data: any }) => 
        trackingApi.updateStatus(unitId, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tracking', 'live'] });
        toast.success('Status unit berhasil diperbarui');
      },
      onError: () => {
        toast.error('Gagal memperbarui status unit');
      }
    });
  };

  return {
    useLiveTracking,
    useTrackingHistory,
    useUpdateTracking,
  };
};
