import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { penyewaanApi } from '../api/penyewaanApi';
import toast from 'react-hot-toast';

export const usePenyewaan = () => {
  const queryClient = useQueryClient();

  const useGetPenyewaans = () => {
    return useQuery({
      queryKey: ['penyewaans'],
      queryFn: penyewaanApi.getAll,
    });
  };

  const useCreatePenyewaan = () => {
    return useMutation({
      mutationFn: penyewaanApi.create,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['penyewaans'] });
        toast.success('Penyewaan berhasil dibuat');
      },
      onError: () => {
        toast.error('Gagal membuat penyewaan');
      },
    });
  };

  return {
    useGetPenyewaans,
    useCreatePenyewaan,
  };
};
