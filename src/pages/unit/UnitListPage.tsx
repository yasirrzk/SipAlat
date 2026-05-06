import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../../components/ui/Button';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Skeleton } from '../../components/ui/Skeleton';
import { Plus, Search, Filter, RefreshCcw } from 'lucide-react';
import type { UnitStatus } from '../../types/unit.types';
import { useUnit } from '../../hooks/useUnit';

const unitSchema = z.object({
  nama: z.string().min(3, 'Nama unit minimal 3 karakter'),
  kode: z.string().min(3, 'Kode unit minimal 3 karakter'),
  kategori: z.string().min(2, 'Kategori wajib diisi'),
  hargaSewaPerHari: z.coerce.number().min(1000, 'Harga sewa minimal Rp 1.000'),
  lokasi: z.string().min(2, 'Lokasi wajib diisi'),
});

type UnitFormValues = z.infer<typeof unitSchema>;

const UnitListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { useGetUnits, useCreateUnit } = useUnit();
  const { data: units, isLoading, isError, refetch } = useGetUnits();
  const { mutate: createUnit, isPending: isCreating } = useCreateUnit();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UnitFormValues>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      hargaSewaPerHari: 0,
    }
  });

  const getStatusVariant = (status: UnitStatus) => {
    switch (status) {
      case 'tersedia': return 'success';
      case 'disewa': return 'warning';
      case 'perawatan': return 'danger';
      default: return 'neutral';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  const onAddUnit = (data: UnitFormValues) => {
    createUnit({
      ...data,
      status: 'tersedia',
    }, {
      onSuccess: () => {
        setIsModalOpen(false);
        reset();
      }
    });
  };

  if (isError) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <p className="text-red-400 font-medium">Gagal memuat data unit.</p>
        <Button variant="outline" onClick={() => refetch()} className="gap-2">
          <RefreshCcw size={18} />
          Coba Lagi
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Unit Alat Berat</h1>
          <p className="text-slate-400">Manajemen armada dan status ketersediaan unit.</p>
        </div>
        <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Tambah Unit
        </Button>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-80 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <Input 
            placeholder="Cari unit atau kode..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter size={18} />
            Filter
          </Button>
        </div>
      </div>

      <Table headers={['Unit', 'Kategori', 'Status', 'Harga / Hari', 'Lokasi', 'Aksi']}>
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-10 w-48" /></TableCell>
              <TableCell><Skeleton className="h-6 w-24" /></TableCell>
              <TableCell><Skeleton className="h-6 w-20" /></TableCell>
              <TableCell><Skeleton className="h-6 w-32" /></TableCell>
              <TableCell><Skeleton className="h-6 w-32" /></TableCell>
              <TableCell><Skeleton className="h-8 w-24" /></TableCell>
            </TableRow>
          ))
        ) : (
          units?.filter(u => 
            u.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
            u.kode.toLowerCase().includes(searchTerm.toLowerCase())
          ).map((unit) => (
            <TableRow key={unit.id}>
              <TableCell>
                <div>
                  <p className="font-bold text-slate-200">{unit.nama}</p>
                  <p className="text-xs text-slate-500 font-mono">{unit.kode}</p>
                </div>
              </TableCell>
              <TableCell>{unit.kategori}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(unit.status)}>
                  {unit.status}
                </Badge>
              </TableCell>
              <TableCell>{formatCurrency(unit.hargaSewaPerHari)}</TableCell>
              <TableCell>{unit.lokasi}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate(`/unit/${unit.id}`)}
                  >
                    Detail
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-900/20">Hapus</Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </Table>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          reset();
        }} 
        title="Tambah Unit Baru"
        footer={
          <>
            <Button variant="outline" onClick={() => {
              setIsModalOpen(false);
              reset();
            }} disabled={isCreating}>Batal</Button>
            <Button onClick={handleSubmit(onAddUnit)} isLoading={isCreating}>Simpan Unit</Button>
          </>
        }
      >
        <form className="space-y-4">
          <Input 
            label="Nama Unit" 
            placeholder="Contoh: Excavator CAT 320D" 
            error={errors.nama?.message}
            {...register('nama')}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Kode Unit" 
              placeholder="Contoh: EXC-001" 
              error={errors.kode?.message}
              {...register('kode')}
            />
            <Input 
              label="Kategori" 
              placeholder="Contoh: Excavator" 
              error={errors.kategori?.message}
              {...register('kategori')}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Harga Sewa / Hari" 
              type="number" 
              placeholder="0" 
              error={errors.hargaSewaPerHari?.message}
              {...register('hargaSewaPerHari')}
            />
            <Input 
              label="Lokasi Awal" 
              placeholder="Contoh: Workshop A" 
              error={errors.lokasi?.message}
              {...register('lokasi')}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UnitListPage;
