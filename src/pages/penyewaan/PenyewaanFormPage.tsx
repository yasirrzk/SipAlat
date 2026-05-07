import React, { useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { differenceInDays, parseISO } from 'date-fns';
import { ArrowLeft, Info, Save, X, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { usePenyewaan } from '../../hooks/usePenyewaan';
import { useUnit } from '../../hooks/useUnit';
import { usePelanggan } from '../../hooks/usePelanggan';
import { formatCurrency } from '../../utils/formatCurrency';

const penyewaanSchema = z.object({
  unitId: z.string().min(1, 'Pilih unit'),
  pelangganId: z.string().min(1, 'Pilih pelanggan'),
  tanggalMulai: z.string().min(1, 'Pilih tanggal mulai'),
  tanggalSelesai: z.string().min(1, 'Pilih tanggal selesai'),
}).refine((data) => {
  if (data.tanggalMulai && data.tanggalSelesai) {
    return parseISO(data.tanggalSelesai) >= parseISO(data.tanggalMulai);
  }
  return true;
}, {
  message: "Tanggal selesai tidak boleh sebelum tanggal mulai",
  path: ["tanggalSelesai"],
});

type PenyewaanFormValues = z.infer<typeof penyewaanSchema>;

const PenyewaanFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { useCreatePenyewaan } = usePenyewaan();
  const { mutate: createPenyewaan, isPending: isCreating } = useCreatePenyewaan();
  
  const { useGetUnits } = useUnit();
  const { data: units } = useGetUnits();
  const availableUnits = useMemo(() => units?.filter(u => u.status === 'tersedia') || [], [units]);
  
  const { useGetPelanggans } = usePelanggan();
  const { data: pelanggans } = useGetPelanggans();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PenyewaanFormValues>({
    resolver: zodResolver(penyewaanSchema),
  });

  const selectedUnitId = useWatch({ control, name: 'unitId' });
  const tanggalMulai = useWatch({ control, name: 'tanggalMulai' });
  const tanggalSelesai = useWatch({ control, name: 'tanggalSelesai' });

  const calculation = useMemo(() => {
    if (!selectedUnitId || !tanggalMulai || !tanggalSelesai) return null;
    const unit = units?.find(u => u.id === selectedUnitId);
    if (!unit) return null;
    const days = Math.max(1, differenceInDays(parseISO(tanggalSelesai), parseISO(tanggalMulai)) + 1);
    const total = days * unit.hargaSewaPerHari;
    return { days, total, pricePerDay: unit.hargaSewaPerHari };
  }, [selectedUnitId, tanggalMulai, tanggalSelesai, units]);

  const onSubmit = (data: PenyewaanFormValues) => {
    if (!calculation) return;
    createPenyewaan({
      ...data,
      totalBiaya: calculation.total,
      status: 'konfirmasi',
    }, {
      onSuccess: () => navigate('/penyewaan'),
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <header className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/penyewaan')} className="p-2 h-auto rounded-full">
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Buat Penyewaan Baru</h1>
          <p className="text-slate-400">Silakan lengkapi formulir untuk membuat kontrak sewa baru.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-8">
            <form id="rental-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300 ml-1">Pelanggan / Perusahaan</label>
                  <select 
                    {...register('pelangganId')}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                  >
                    <option value="">-- Pilih Pelanggan --</option>
                    {pelanggans?.map(p => (
                      <option key={p.id} value={p.id}>{p.perusahaan} ({p.nama})</option>
                    ))}
                  </select>
                  {errors.pelangganId && <p className="text-xs text-red-500 ml-1 mt-1">{errors.pelangganId.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300 ml-1">Pilih Unit Alat Berat</label>
                  <select 
                    {...register('unitId')}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                  >
                    <option value="">-- Pilih Unit --</option>
                    {availableUnits.map(u => (
                      <option key={u.id} value={u.id}>{u.nama} - {formatCurrency(u.hargaSewaPerHari)}/hari</option>
                    ))}
                  </select>
                  {errors.unitId && <p className="text-xs text-red-500 ml-1 mt-1">{errors.unitId.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    label="Tanggal Mulai Sewa" 
                    type="date" 
                    error={errors.tanggalMulai?.message}
                    {...register('tanggalMulai')}
                  />
                  <Input 
                    label="Tanggal Selesai Sewa" 
                    type="date" 
                    error={errors.tanggalSelesai?.message}
                    {...register('tanggalSelesai')}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 sticky top-24">
            <h3 className="font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Info size={18} className="text-indigo-500" />
              Ringkasan Biaya
            </h3>
            
            {calculation ? (
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Tarif Harian</span>
                  <span className="text-slate-200 font-medium">{formatCurrency(calculation.pricePerDay)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Durasi</span>
                  <span className="text-slate-200 font-medium">{calculation.days} Hari</span>
                </div>
                <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-slate-100 font-bold">Total Estimasi</span>
                  <span className="text-xl font-bold text-indigo-400">{formatCurrency(calculation.total)}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 space-y-2">
                <Calendar size={32} className="mx-auto opacity-10" />
                <p className="text-xs">Lengkapi data unit dan tanggal untuk melihat estimasi biaya.</p>
              </div>
            )}

            <div className="pt-4 space-y-3">
              <Button 
                form="rental-form" 
                type="submit" 
                className="w-full gap-2 py-6 text-base shadow-lg shadow-indigo-600/20"
                isLoading={isCreating}
                disabled={!calculation}
              >
                <Save size={20} />
                Simpan Transaksi
              </Button>
              <Button 
                variant="outline" 
                className="w-full gap-2 border-slate-800 text-slate-400"
                onClick={() => navigate('/penyewaan')}
                disabled={isCreating}
              >
                <X size={18} />
                Batalkan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PenyewaanFormPage;
