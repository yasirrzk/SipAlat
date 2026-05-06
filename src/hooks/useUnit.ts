import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { unitApi } from '../api/unitApi';
import type { Unit } from '../types/unit.types';
import toast from 'react-hot-toast';

export const useUnit = () => {
  const queryClient = useQueryClient();

  const useGetUnits = () => {
    return useQuery({
      queryKey: ['units'],
      queryFn: unitApi.getAll,
    });
  };

  const useGetUnit = (id: string) => {
    return useQuery({
      queryKey: ['units', id],
      queryFn: () => unitApi.getById(id),
      enabled: !!id,
    });
  };

  const useCreateUnit = () => {
    return useMutation({
      mutationFn: unitApi.create,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['units'] });
        toast.success('Unit berhasil ditambahkan');
      },
      onError: () => {
        toast.error('Gagal menambahkan unit');
      },
    });
  };

  const useUpdateUnit = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<Unit> }) =>
        unitApi.update(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['units'] });
        toast.success('Unit berhasil diperbarui');
      },
      onError: () => {
        toast.error('Gagal memperbarui unit');
      },
    });
  };

  const useDeleteUnit = () => {
    return useMutation({
      mutationFn: unitApi.delete,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['units'] });
        toast.success('Unit berhasil dihapus');
      },
      onError: () => {
        toast.error('Gagal menghapus unit');
      },
    });
  };

  return {
    useGetUnits,
    useGetUnit,
    useCreateUnit,
    useUpdateUnit,
    useDeleteUnit,
  };
};
