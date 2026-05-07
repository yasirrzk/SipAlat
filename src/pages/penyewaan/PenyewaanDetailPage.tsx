import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Truck, Calendar, CreditCard, Clock, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { usePenyewaan } from '../../hooks/usePenyewaan';
import { Skeleton } from '../../components/ui/Skeleton';
import { cn } from '../../utils/cn';
import { formatCurrency } from '../../utils/formatCurrency';

const PenyewaanDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { useGetPenyewaan } = usePenyewaan();
  const { data: sewa, isLoading } = useGetPenyewaan(id || '');

  if (isLoading) return <Skeleton className="h-96 w-full rounded-2xl" />;

  if (!sewa) return (
    <div className="text-center py-20">
      <p className="text-red-400">Transaksi tidak ditemukan.</p>
      <Button variant="ghost" onClick={() => navigate('/penyewaan')} className="mt-4">Kembali</Button>
    </div>
  );

  const timeline = [
    { status: 'Draft', date: '10 Mei 2026', done: true },
    { status: 'Konfirmasi', date: '11 Mei 2026', done: true },
    { status: 'Aktif', date: '12 Mei 2026', done: sewa.status === 'aktif' || sewa.status === 'selesai' },
    { status: 'Selesai', date: '-', done: sewa.status === 'selesai' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/penyewaan')} className="p-2 h-auto rounded-full">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Detail Penyewaan</h1>
            <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">ID: SEWA-2026-{sewa.id.padStart(3, '0')}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <FileText size={18} />
            Cetak Invoice
          </Button>
          {sewa.status === 'konfirmasi' && (
            <Button className="gap-2">
              <CheckCircle2 size={18} />
              Aktifkan Sewa
            </Button>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <h3 className="font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
                <User size={18} className="text-indigo-500" />
                Informasi Pelanggan
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Perusahaan</p>
                  <p className="text-slate-100 font-bold">{sewa.pelanggan?.perusahaan}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Kontak Person</p>
                  <p className="text-slate-300">{sewa.pelanggan?.nama}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <h3 className="font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
                <Truck size={18} className="text-indigo-500" />
                Informasi Unit
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Nama Unit</p>
                  <p className="text-slate-100 font-bold">{sewa.unit?.nama}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Kode Unit</p>
                  <p className="text-slate-300 font-mono">{sewa.unit?.kode}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rental Details */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-8">
            <h3 className="font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-4">
              <Calendar size={18} className="text-indigo-500" />
              Detail Transaksi
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="space-y-1">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Mulai Sewa</p>
                <p className="text-slate-200 font-medium">{sewa.tanggalMulai}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Selesai Sewa</p>
                <p className="text-slate-200 font-medium">{sewa.tanggalSelesai}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Durasi</p>
                <p className="text-slate-200 font-medium">7 Hari</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Status</p>
                <Badge variant={sewa.status === 'aktif' ? 'success' : 'info'}>{sewa.status}</Badge>
              </div>
            </div>

            <div className="bg-indigo-600/5 border border-indigo-500/10 rounded-xl p-6 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-600/20 rounded-xl text-indigo-400">
                  <CreditCard size={24} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Pembayaran</p>
                  <p className="text-2xl font-bold text-indigo-400">{formatCurrency(sewa.totalBiaya)}</p>
                </div>
              </div>
              <Badge variant="success" className="h-fit">Lunas</Badge>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Clock size={18} className="text-indigo-500" />
            Timeline Status
          </h3>
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-3 before:h-full before:w-0.5 before:bg-slate-800">
            {timeline.map((item, i) => (
              <div key={i} className="relative flex items-center gap-6 pl-8">
                <div className={cn(
                  "absolute left-0 w-6 h-6 rounded-full border-4 border-slate-950 flex items-center justify-center transition-colors z-10",
                  item.done ? "bg-indigo-500" : "bg-slate-800"
                )}>
                  {item.done && <CheckCircle2 size={12} className="text-white" />}
                </div>
                <div>
                  <p className={cn("text-sm font-bold", item.done ? "text-slate-200" : "text-slate-600")}>{item.status}</p>
                  <p className="text-[10px] text-slate-500">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PenyewaanDetailPage;
