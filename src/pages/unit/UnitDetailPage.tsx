import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Truck, MapPin, Activity, History, Settings, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { useUnit } from '../../hooks/useUnit';
import { usePenyewaan } from '../../hooks/usePenyewaan';
import { Skeleton } from '../../components/ui/Skeleton';
import { formatCurrency } from '../../utils/formatCurrency';

const UnitDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { useGetUnit } = useUnit();
  const { useGetPenyewaans } = usePenyewaan();
  
  const { data: unit, isLoading, isError } = useGetUnit(id || '');
  const { data: penyewaans, isLoading: isLoadingRentals } = useGetPenyewaans();

  const unitRentals = penyewaans?.filter(p => p.unitId === id) || [];

  if (isLoading) return (
    <div className="space-y-8">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Skeleton className="h-96 lg:col-span-1 rounded-2xl" />
        <Skeleton className="h-96 lg:col-span-2 rounded-2xl" />
      </div>
    </div>
  );

  if (isError || !unit) return (
    <div className="text-center py-20">
      <p className="text-red-400">Unit tidak ditemukan.</p>
      <Button variant="ghost" onClick={() => navigate('/unit')} className="mt-4">Kembali ke Daftar</Button>
    </div>
  );

  return (
    <div className="space-y-8 pb-12">
      <header className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/unit')} className="p-2 h-auto rounded-full">
          <ArrowLeft size={20} />
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-100">{unit.nama}</h1>
            <Badge variant={unit.status === 'tersedia' ? 'success' : unit.status === 'disewa' ? 'warning' : 'danger'}>
              {unit.status}
            </Badge>
          </div>
          <p className="text-slate-500 font-mono text-sm tracking-wider uppercase">{unit.kode}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Info Card */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="h-48 bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 border border-slate-700/50">
              <Truck size={48} className="opacity-20" />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-sm text-slate-500 font-medium">Kategori</span>
                <span className="text-sm text-slate-200 font-bold">{unit.kategori}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-sm text-slate-500 font-medium">Harga Sewa</span>
                <span className="text-sm text-indigo-400 font-bold">{formatCurrency(unit.hargaSewaPerHari)} / hari</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-sm text-slate-500 font-medium">Lokasi Saat Ini</span>
                <div className="flex items-center gap-1.5 text-slate-200">
                  <MapPin size={14} className="text-indigo-500" />
                  <span className="text-sm font-bold">{unit.lokasi}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 gap-2" variant="secondary">
                <Settings size={16} />
                Edit Unit
              </Button>
              <Button className="flex-1 gap-2">
                <Calendar size={16} />
                Jadwal Sewa
              </Button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-slate-200 flex items-center gap-2">
              <Activity size={18} className="text-indigo-500" />
              Kesehatan Unit
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                  <span>Kondisi Mesin</span>
                  <span className="text-green-500">95%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full">
                  <div className="h-full w-[95%] bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                </div>
              </div>
              <div className="pt-2 text-xs text-slate-500 italic">
                Pemeriksaan terakhir: 12 April 2026 oleh Budi (Teknisi)
              </div>
            </div>
          </div>
        </div>

        {/* Tabs / Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-slate-200 flex items-center gap-2">
                <History size={18} className="text-indigo-500" />
                Riwayat Penyewaan
              </h3>
              <Button variant="ghost" size="sm" className="text-xs font-bold uppercase tracking-widest text-indigo-400">Download Log</Button>
            </div>
            
            <Table headers={['Pelanggan', 'Periode', 'Total Biaya', 'Status']}>
              {isLoadingRentals ? (
                [...Array(3)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  </TableRow>
                ))
              ) : unitRentals.length > 0 ? (
                unitRentals.map((sewa) => (
                  <TableRow key={sewa.id}>
                    <TableCell>
                      <p className="font-bold text-slate-200">{sewa.pelanggan?.perusahaan}</p>
                      <p className="text-[10px] text-slate-500">Ref: SEWA-{sewa.id}</p>
                    </TableCell>
                    <TableCell className="text-xs">
                      {sewa.tanggalMulai} - {sewa.tanggalSelesai}
                    </TableCell>
                    <TableCell className="font-medium text-slate-300">{formatCurrency(sewa.totalBiaya)}</TableCell>
                    <TableCell>
                      <Badge variant={sewa.status === 'aktif' ? 'success' : sewa.status === 'selesai' ? 'neutral' : 'warning'}>
                        {sewa.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-slate-500 italic">Belum ada riwayat penyewaan untuk unit ini.</TableCell>
                </TableRow>
              )}
            </Table>
            <div className="p-4 text-center border-t border-slate-800">
              <Button variant="ghost" size="sm" className="text-slate-500">Tampilkan lebih banyak</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitDetailPage;
