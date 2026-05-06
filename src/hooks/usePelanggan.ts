import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pelangganApi } from '../api/pelangganApi';
import { Pelanggan } from '../types/pelanggan.types';
import toast from 'react-hot-toast';

export const usePelanggan = () => {
  const queryClient = useQueryClient();

  const useGetPelanggans = () => {
    return useQuery({
      queryKey: ['pelanggans'],
      queryFn: pelangganApi.getAll,
    });
  };

  const useCreatePelanggan = () => {
    return useMutation({
      mutationFn: pelangganApi.create,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['pelanggans'] });
        toast.success('Pelanggan berhasil ditambahkan');
      },
      onError: () => {
        toast.error('Gagal menambahkan pelanggan');
      },
    });
  };

  return {
    useGetPelanggans,
    useCreatePelanggan,
  };
};
