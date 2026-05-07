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

  const useGetPenyewaan = (id: string) => {
    return useQuery({
      queryKey: ['penyewaan', id],
      queryFn: () => penyewaanApi.getById(id),
      enabled: !!id,
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

  const useDeletePenyewaan = () => {
    return useMutation({
      mutationFn: penyewaanApi.delete,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['penyewaans'] });
        toast.success('Transaksi berhasil dihapus');
      },
      onError: () => {
        toast.error('Gagal menghapus transaksi');
      },
    });
  };

  return {
    useGetPenyewaans,
    useGetPenyewaan,
    useCreatePenyewaan,
    useDeletePenyewaan,
  };
};
