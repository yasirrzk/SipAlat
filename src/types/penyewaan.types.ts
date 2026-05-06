import type { Unit } from './unit.types';
import type { Pelanggan } from './pelanggan.types';

export type PenyewaanStatus = 'draft' | 'konfirmasi' | 'aktif' | 'selesai' | 'dibatalkan';

export interface Penyewaan {
  id: string;
  unitId: string;
  pelangganId: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  totalBiaya: number;
  status: PenyewaanStatus;
  unit?: Unit;
  pelanggan?: Pelanggan;
}
