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

  const useUpdatePelanggan = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<Pelanggan> }) => pelangganApi.update(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['pelanggans'] });
        toast.success('Pelanggan berhasil diperbarui');
      },
      onError: () => {
        toast.error('Gagal memperbarui pelanggan');
      },
    });
  };

  const useDeletePelanggan = () => {
    return useMutation({
      mutationFn: pelangganApi.delete,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['pelanggans'] });
        toast.success('Pelanggan berhasil dihapus');
      },
      onError: () => {
        toast.error('Gagal menghapus pelanggan');
      },
    });
  };

  return {
    useGetPelanggans,
    useCreatePelanggan,
    useUpdatePelanggan,
    useDeletePelanggan,
  };
};
