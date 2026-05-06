export type UnitStatus = 'tersedia' | 'disewa' | 'perawatan' | 'rusak';

export interface Unit {
  id: string;
  nama: string;
  kode: string;
  kategori: string;
  status: UnitStatus;
  hargaSewaPerHari: number;
  lokasi: string;
  lastMaintenance?: string;
}
