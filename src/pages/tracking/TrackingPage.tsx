import React, { useState } from 'react';
import { MapPin, Battery, Activity, Search, Filter, RefreshCw, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Skeleton } from '../../components/ui/Skeleton';
import { Modal } from '../../components/ui/Modal';
import { UnitStatus } from '../../types/unit.types';
import { useTracking, TrackingData } from '../../hooks/useTracking';
import { cn } from '../../utils/cn';
import { getUnitStatusVariant } from '../../utils/statusColor';
import { useAuthStore } from '../../store/authStore';

const trackingSchema = z.object({
  lokasi: z.string().min(2, 'Lokasi wajib diisi'),
  kondisi: z.coerce.number().min(0).max(100, 'Kondisi 0-100%'),
  jamOperasi: z.string().min(1, 'Jam operasi wajib diisi'),
});

type TrackingFormValues = z.infer<typeof trackingSchema>;

const TrackingPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<any | null>(null);
  const user = useAuthStore((state) => state.user);
  
  const { useLiveTracking, useUpdateTracking } = useTracking();
  const { data: trackingUnits, isLoading, isFetching, isError, refetch } = useLiveTracking();
  const { mutate: updateTracking, isPending: isUpdating } = useUpdateTracking();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TrackingFormValues>();

  const onOpenUpdate = (unit: any) => {
    setSelectedUnit(unit);
    reset({
      lokasi: unit.lokasi,
      kondisi: unit.kondisi,
      jamOperasi: unit.jamOperasi,
    });
  };

  const onSaveUpdate = (data: TrackingFormValues) => {
    if (!selectedUnit) return;
    updateTracking({
      unitId: selectedUnit.unitId,
      data: data,
    }, {
      onSuccess: () => {
        setSelectedUnit(null);
      }
    });
  };

  if (isError) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4 text-center">
        <p className="text-red-400 font-medium text-lg">Gagal memuat data tracking.</p>
        <Button variant="outline" onClick={() => refetch()} className="gap-2">
          <RefreshCw size={18} />
          Coba Lagi
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Tracking Ketersediaan</h1>
          <p className="text-slate-400">Monitoring status, lokasi, dan kondisi unit secara real-time.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-900/20 rounded-full border border-indigo-500/30">
            <div className={cn("w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]", isFetching && "animate-pulse")}></div>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Live Polling</span>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-80 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <Input 
            placeholder="Cari unit atau lokasi..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [...Array(6)].map((_, i) => <Skeleton key={i} className="h-96 w-full rounded-2xl" />)
        ) : (
          trackingUnits?.filter(u => 
            u.unit?.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
            u.unit?.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.lokasi.toLowerCase().includes(searchTerm.toLowerCase())
          ).map((unit) => (
            <div key={unit.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 hover:border-indigo-500/50 transition-all group relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">{unit.unit?.nama}</h3>
                  <p className="text-xs text-slate-500 font-mono tracking-wider uppercase">{unit.unit?.kode}</p>
                </div>
                <Badge variant={getUnitStatusVariant(unit.status)}>{unit.status}</Badge>
              </div>

              <div className="h-40 bg-slate-800/30 rounded-xl relative overflow-hidden flex items-center justify-center border border-slate-800/50 group-hover:border-indigo-500/30 transition-colors">
                <div className="absolute inset-0 bg-[url('https://www.google.com/maps/vt/pb=!1m4!1m3!1i12!2i10!3i10!2m3!1e0!2sm!3i420120488!3m7!2sen!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1f2!6m8!1e1!2b1!3be1!3f0.9')] opacity-10 grayscale group-hover:opacity-20 transition-opacity"></div>
                <MapPin className={cn(
                  "relative z-10 transition-transform duration-500",
                  unit.status === 'tersedia' ? "text-green-500" : "text-indigo-500",
                  "group-hover:scale-110"
                )} size={32} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Kondisi Mesin</p>
                  <div className="flex items-center gap-2">
                    <Activity size={14} className={cn(unit.kondisi > 90 ? "text-green-500" : "text-orange-500")} />
                    <span className="text-sm font-bold text-slate-200">{unit.kondisi}%</span>
                  </div>
                  <div className="w-full h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${unit.kondisi}%` }}></div>
                  </div>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Jam Operasi</p>
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-sm font-bold text-slate-200">{unit.jamOperasi}</span>
                    <Battery size={14} className="text-blue-500" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400 overflow-hidden">
                  <MapPin size={14} className="shrink-0" />
                  <span className="text-xs truncate">{unit.lokasi}</span>
                </div>
                {(user?.role === 'admin' || user?.role === 'operator') && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-[10px] h-8 font-bold uppercase tracking-wider hover:bg-indigo-600 hover:text-white border-slate-700"
                    onClick={() => onOpenUpdate(unit)}
                  >
                    Update Log
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={!!selectedUnit}
        onClose={() => setSelectedUnit(null)}
        title={`Update Status: ${selectedUnit?.unit?.nama}`}
        footer={
          <>
            <Button variant="outline" onClick={() => setSelectedUnit(null)}>Batal</Button>
            <Button onClick={handleSubmit(onSaveUpdate)} isLoading={isUpdating}>
              <Save size={18} className="mr-2" />
              Simpan Perubahan
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Input 
            label="Lokasi Terkini" 
            placeholder="Contoh: Workshop Utama / Site A" 
            error={errors.lokasi?.message}
            {...register('lokasi')}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Kondisi (%)" 
              type="number" 
              placeholder="0-100" 
              error={errors.kondisi?.message}
              {...register('kondisi')}
            />
            <Input 
              label="Total Jam Operasi" 
              placeholder="Contoh: 1,240h" 
              error={errors.jamOperasi?.message}
              {...register('jamOperasi')}
            />
          </div>
          <div className="p-4 bg-indigo-600/10 rounded-xl border border-indigo-500/20">
            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mb-1">Catatan Operator</p>
            <p className="text-xs text-slate-400 italic">Pastikan data yang diinput sesuai dengan pemeriksaan fisik di lapangan.</p>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TrackingPage;
