import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Skeleton } from '../../components/ui/Skeleton';
import { Plus, Search, Download, RefreshCcw, Trash2, Eye } from 'lucide-react';
import { usePenyewaan } from '../../hooks/usePenyewaan';
import type { PenyewaanStatus } from '../../types/penyewaan.types';
import { formatCurrency } from '../../utils/formatCurrency';
import { getPenyewaanStatusVariant } from '../../utils/statusColor';

const PenyewaanListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const { useGetPenyewaans, useDeletePenyewaan } = usePenyewaan();
  const { data: penyewaans, isLoading, isError, refetch } = useGetPenyewaans();
  const { mutate: deletePenyewaan } = useDeletePenyewaan();

  const onDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus riwayat transaksi ini?')) {
      deletePenyewaan(id);
    }
  };

  if (isError) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <p className="text-red-400 font-medium">Gagal memuat data penyewaan.</p>
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
          <h1 className="text-2xl font-bold text-slate-100">Manajemen Penyewaan</h1>
          <p className="text-slate-400">Kelola transaksi, jadwal, and invoice penyewaan.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download size={18} />
            Export
          </Button>
          <Button className="gap-2" onClick={() => navigate('/penyewaan/baru')}>
            <Plus size={18} />
            Buat Penyewaan
          </Button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-80 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <Input 
            placeholder="Cari transaksi atau pelanggan..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Table headers={['Pelanggan / Perusahaan', 'Unit', 'Periode Sewa', 'Total Biaya', 'Status', 'Aksi']}>
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-10 w-48" /></TableCell>
              <TableCell><Skeleton className="h-10 w-32" /></TableCell>
              <TableCell><Skeleton className="h-12 w-32" /></TableCell>
              <TableCell><Skeleton className="h-6 w-24" /></TableCell>
              <TableCell><Skeleton className="h-6 w-20" /></TableCell>
              <TableCell><Skeleton className="h-8 w-16" /></TableCell>
            </TableRow>
          ))
        ) : (
          penyewaans?.filter(p => 
            p.pelanggan?.perusahaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.unit?.nama.toLowerCase().includes(searchTerm.toLowerCase())
          ).map((sewa) => (
            <TableRow key={sewa.id}>
              <TableCell>
                <div>
                  <p className="font-bold text-slate-200">{sewa.pelanggan?.perusahaan}</p>
                  <p className="text-xs text-slate-500">{sewa.pelanggan?.nama}</p>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="text-sm text-slate-300">{sewa.unit?.nama}</p>
                  <p className="text-[10px] text-slate-500 font-mono uppercase">{sewa.unit?.kode}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-xs space-y-0.5">
                  <p className="text-slate-400">{sewa.tanggalMulai}</p>
                  <p className="text-slate-600 font-bold">s/d</p>
                  <p className="text-slate-400">{sewa.tanggalSelesai}</p>
                </div>
              </TableCell>
              <TableCell className="font-bold text-indigo-400">{formatCurrency(sewa.totalBiaya)}</TableCell>
              <TableCell>
                <Badge variant={getPenyewaanStatusVariant(sewa.status)}>{sewa.status}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    title="Detail"
                    onClick={() => navigate(`/penyewaan/${sewa.id}`)}
                  >
                    <Eye size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    onClick={() => onDelete(sewa.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </Table>
    </div>
  );
};

export default PenyewaanListPage;
