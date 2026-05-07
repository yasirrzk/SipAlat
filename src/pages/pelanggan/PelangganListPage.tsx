import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../../components/ui/Button';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Skeleton } from '../../components/ui/Skeleton';
import { Plus, Search, Mail, Phone, ExternalLink, RefreshCcw, Edit, Trash2 } from 'lucide-react';
import { usePelanggan } from '../../hooks/usePelanggan';
import { Pelanggan } from '../../types/pelanggan.types';

const pelangganSchema = z.object({
  nama: z.string().min(3, 'Nama minimal 3 karakter'),
  perusahaan: z.string().min(2, 'Nama perusahaan wajib diisi'),
  email: z.string().email('Format email tidak valid'),
  telepon: z.string().min(10, 'Nomor telepon minimal 10 digit'),
  alamat: z.string().min(5, 'Alamat wajib diisi'),
});

type PelangganFormValues = z.infer<typeof pelangganSchema>;

const PelangganListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPelanggan, setSelectedPelanggan] = useState<Pelanggan | null>(null);
  
  const { useGetPelanggans, useCreatePelanggan, useUpdatePelanggan, useDeletePelanggan } = usePelanggan();
  const { data: pelanggans, isLoading, isError, refetch } = useGetPelanggans();
  const { mutate: createPelanggan, isPending: isCreating } = useCreatePelanggan();
  const { mutate: updatePelanggan, isPending: isUpdating } = useUpdatePelanggan();
  const { mutate: deletePelanggan } = useDeletePelanggan();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PelangganFormValues>({
    resolver: zodResolver(pelangganSchema),
  });

  const onOpenAdd = () => {
    setSelectedPelanggan(null);
    reset({
      nama: '',
      perusahaan: '',
      email: '',
      telepon: '',
      alamat: '',
    });
    setIsModalOpen(true);
  };

  const onOpenEdit = (p: Pelanggan) => {
    setSelectedPelanggan(p);
    reset({
      nama: p.nama,
      perusahaan: p.perusahaan,
      email: p.email,
      telepon: p.telepon,
      alamat: p.alamat,
    });
    setIsModalOpen(true);
  };

  const onSubmit = (data: PelangganFormValues) => {
    if (selectedPelanggan) {
      updatePelanggan({ id: selectedPelanggan.id, data }, {
        onSuccess: () => {
          setIsModalOpen(false);
          reset();
        }
      });
    } else {
      createPelanggan({
        ...data,
        totalSewa: 0,
      }, {
        onSuccess: () => {
          setIsModalOpen(false);
          reset();
        }
      });
    }
  };

  const onDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pelanggan ini?')) {
      deletePelanggan(id);
    }
  };

  if (isError) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <p className="text-red-400 font-medium">Gagal memuat data pelanggan.</p>
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
          <h1 className="text-2xl font-bold text-slate-100">Data Pelanggan</h1>
          <p className="text-slate-400">Manajemen basis data penyewa dan riwayat kerjasama.</p>
        </div>
        <Button className="gap-2" onClick={onOpenAdd}>
          <Plus size={18} />
          Tambah Pelanggan
        </Button>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-80 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <Input 
            placeholder="Cari pelanggan atau perusahaan..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Table headers={['Perusahaan / Kontak', 'Email & Telepon', 'Alamat', 'Total Sewa', 'Aksi']}>
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-10 w-48" /></TableCell>
              <TableCell><Skeleton className="h-10 w-40" /></TableCell>
              <TableCell><Skeleton className="h-6 w-56" /></TableCell>
              <TableCell><Skeleton className="h-6 w-20" /></TableCell>
              <TableCell><Skeleton className="h-8 w-24" /></TableCell>
            </TableRow>
          ))
        ) : (
          pelanggans?.filter(p => 
            p.perusahaan.toLowerCase().includes(searchTerm.toLowerCase()) || 
            p.nama.toLowerCase().includes(searchTerm.toLowerCase())
          ).map((p) => (
            <TableRow key={p.id}>
              <TableCell>
                <div>
                  <p className="font-bold text-slate-200">{p.perusahaan}</p>
                  <p className="text-xs text-slate-500">{p.nama}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Mail size={12} className="text-indigo-400" />
                    <span>{p.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Phone size={12} className="text-green-400" />
                    <span>{p.telepon}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <p className="text-xs text-slate-400 max-w-[200px] truncate" title={p.alamat}>
                  {p.alamat}
                </p>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-200">{p.totalSewa}</span>
                  <span className="text-[10px] text-slate-500 uppercase">Transaksi</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" title="Lihat Profil">
                    <ExternalLink size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onOpenEdit(p)}>
                    <Edit size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    onClick={() => onDelete(p.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
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
        title={selectedPelanggan ? "Edit Pelanggan" : "Tambah Pelanggan Baru"}
        footer={
          <>
            <Button variant="outline" onClick={() => {
              setIsModalOpen(false);
              reset();
            }} disabled={isCreating || isUpdating}>Batal</Button>
            <Button onClick={handleSubmit(onSubmit)} isLoading={isCreating || isUpdating}>
              {selectedPelanggan ? "Simpan Perubahan" : "Simpan Pelanggan"}
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Input 
            label="Nama Perusahaan" 
            placeholder="Contoh: PT. Maju Bersama" 
            error={errors.perusahaan?.message}
            {...register('perusahaan')}
          />
          <Input 
            label="Nama Kontak Person" 
            placeholder="Nama Lengkap" 
            error={errors.nama?.message}
            {...register('nama')}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Email" 
              type="email" 
              placeholder="email@perusahaan.com" 
              error={errors.email?.message}
              {...register('email')}
            />
            <Input 
              label="Nomor Telepon" 
              placeholder="0812..." 
              error={errors.telepon?.message}
              {...register('telepon')}
            />
          </div>
          <Input 
            label="Alamat Kantor" 
            placeholder="Alamat Lengkap" 
            error={errors.alamat?.message}
            {...register('alamat')}
          />
        </form>
      </Modal>
    </div>
  );
};

export default PelangganListPage;
