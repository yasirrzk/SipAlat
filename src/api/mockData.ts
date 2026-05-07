import { DashboardStats } from './dashboardApi';
import { Unit } from '../types/unit.types';
import { Pelanggan } from '../types/pelanggan.types';
import { Penyewaan } from '../types/penyewaan.types';
import { TrackingData } from './trackingApi';

export const mockDashboardStats: DashboardStats = {
  totalUnits: 24,
  availableUnits: 15,
  rentedUnits: 7,
  revenueThisMonth: 450000000,
  recentActivities: [
    { id: '1', description: 'Penyewaan Excavator CAT 320D', customer: 'PT. Maju Jaya', timeAgo: '2 jam yang lalu' },
    { id: '2', description: 'Pengembalian Bulldozer D6R', customer: 'CV. Sumber Alam', timeAgo: '5 jam yang lalu' },
    { id: '3', description: 'Maintenance Crane Tadano GR-500EX', customer: 'Internal', timeAgo: '1 hari yang lalu' },
    { id: '4', description: 'Penyewaan Dump Truck Hino 700', customer: 'PT. Bangun Negeri', timeAgo: '2 hari yang lalu' },
    { id: '5', description: 'Pendaftaran Pelanggan Baru', customer: 'PT. Citra Konstruksi', timeAgo: '3 hari yang lalu' },
  ],
  monthlyStats: [
    { month: 'Jan', total: 12 },
    { month: 'Feb', total: 18 },
    { month: 'Mar', total: 15 },
    { month: 'Apr', total: 22 },
    { month: 'Mei', total: 30 },
  ],
};

export const mockUnits: Unit[] = [
  { id: '1', nama: 'Excavator CAT 320D', kode: 'EXC-001', kategori: 'Excavator', status: 'disewa', hargaSewaPerHari: 3500000, lokasi: 'Proyek Bendungan Ciawi' },
  { id: '2', nama: 'Excavator CAT 320D', kode: 'EXC-002', kategori: 'Excavator', status: 'tersedia', hargaSewaPerHari: 3500000, lokasi: 'Workshop Jakarta' },
  { id: '3', nama: 'Bulldozer D6R', kode: 'BULL-001', kategori: 'Bulldozer', status: 'tersedia', hargaSewaPerHari: 4200000, lokasi: 'Workshop Jakarta' },
  { id: '4', nama: 'Crane Tadano GR-500EX', kode: 'CRN-001', kategori: 'Crane', status: 'perawatan', hargaSewaPerHari: 7500000, lokasi: 'Workshop Jakarta' },
  { id: '5', nama: 'Dump Truck Hino 700', kode: 'TRK-001', kategori: 'Dump Truck', status: 'disewa', hargaSewaPerHari: 2500000, lokasi: 'Proyek Tol Trans Sumatera' },
  { id: '6', nama: 'Vibratory Roller CA250', kode: 'ROL-001', kategori: 'Compactor', status: 'tersedia', hargaSewaPerHari: 1800000, lokasi: 'Workshop Jakarta' },
  { id: '7', nama: 'Motor Grader 120K', kode: 'GRD-001', kategori: 'Grader', status: 'disewa', hargaSewaPerHari: 3800000, lokasi: 'Proyek Kalimantan' },
  { id: '8', nama: 'Wheel Loader Komatsu WA380', kode: 'LOAD-001', kategori: 'Loader', status: 'tersedia', hargaSewaPerHari: 2800000, lokasi: 'Workshop Surabaya' },
  { id: '9', nama: 'Excavator Hitachi ZX200', kode: 'EXC-003', kategori: 'Excavator', status: 'tersedia', hargaSewaPerHari: 3200000, lokasi: 'Workshop Jakarta' },
  { id: '10', nama: 'Concrete Pump Isuzu', kode: 'PMP-001', kategori: 'Concrete Pump', status: 'tersedia', hargaSewaPerHari: 4500000, lokasi: 'Site BSD' },
];

export const mockPelanggans: Pelanggan[] = [
  { id: '1', nama: 'Budi Santoso', perusahaan: 'PT. Maju Jaya', email: 'budi@majujaya.com', telepon: '081234567890', alamat: 'Jl. Sudirman No. 123, Jakarta', totalSewa: 5 },
  { id: '2', nama: 'Siti Aminah', perusahaan: 'CV. Sumber Alam', email: 'siti@sumberalam.com', telepon: '081345678901', alamat: 'Jl. Gatot Subroto No. 45, Bandung', totalSewa: 3 },
  { id: '3', nama: 'Andi Wijaya', perusahaan: 'PT. Bangun Negeri', email: 'andi@bangunnegeri.com', telepon: '081456789012', alamat: 'Jl. Rasuna Said No. 88, Jakarta', totalSewa: 8 },
  { id: '4', nama: 'Dewi Lestari', perusahaan: 'PT. Citra Konstruksi', email: 'dewi@citrakonstruksi.com', telepon: '081567890123', alamat: 'Jl. Ahmad Yani No. 10, Surabaya', totalSewa: 2 },
  { id: '5', nama: 'Hendra Putra', perusahaan: 'PT. Infrastruktur Utama', email: 'hendra@inframaju.co.id', telepon: '081678901234', alamat: 'Kawasan Industri Jababeka, Cikarang', totalSewa: 12 },
];

export const mockPenyewaans: Penyewaan[] = [
  { 
    id: '1', 
    unitId: '1', 
    pelangganId: '1', 
    tanggalMulai: '2026-05-01', 
    tanggalSelesai: '2026-05-15', 
    totalBiaya: 52500000, 
    status: 'aktif',
    unit: mockUnits[0],
    pelanggan: mockPelanggans[0]
  },
  { 
    id: '2', 
    unitId: '5', 
    pelangganId: '3', 
    tanggalMulai: '2026-04-20', 
    tanggalSelesai: '2026-05-20', 
    totalBiaya: 75000000, 
    status: 'aktif',
    unit: mockUnits[4],
    pelanggan: mockPelanggans[2]
  },
  { 
    id: '3', 
    unitId: '7', 
    pelangganId: '4', 
    tanggalMulai: '2026-05-05', 
    tanggalSelesai: '2026-05-09', 
    totalBiaya: 26600000, 
    status: 'aktif',
    unit: mockUnits[6],
    pelanggan: mockPelanggans[3]
  },
  { 
    id: '4', 
    unitId: '2', 
    pelangganId: '2', 
    tanggalMulai: '2026-03-01', 
    tanggalSelesai: '2026-03-10', 
    totalBiaya: 35000000, 
    status: 'selesai',
    unit: mockUnits[1],
    pelanggan: mockPelanggans[1]
  },
  { 
    id: '5', 
    unitId: '9', 
    pelangganId: '5', 
    tanggalMulai: '2026-05-01', 
    tanggalSelesai: '2026-05-30', 
    totalBiaya: 96000000, 
    status: 'aktif',
    unit: mockUnits[8],
    pelanggan: mockPelanggans[4]
  },
  { 
    id: '6', 
    unitId: '1', 
    pelangganId: '2', 
    tanggalMulai: '2026-01-10', 
    tanggalSelesai: '2026-01-20', 
    totalBiaya: 35000000, 
    status: 'selesai',
    unit: mockUnits[0],
    pelanggan: mockPelanggans[1]
  },
];

export const mockTrackingData: TrackingData[] = [
  { 
    id: '1', 
    unitId: '1', 
    status: 'disewa', 
    lokasi: 'Proyek Bendungan Ciawi, Bogor', 
    kondisi: 85, 
    jamOperasi: '1,240 Jam', 
    lastUpdate: '2 menit yang lalu', 
    lat: -6.6542, 
    lng: 106.8452,
    unit: { nama: 'Excavator CAT 320D', kode: 'EXC-001' }
  },
  { 
    id: '2', 
    unitId: '5', 
    status: 'disewa', 
    lokasi: 'Pematang Siantar, Sumatera Utara', 
    kondisi: 92, 
    jamOperasi: '850 Jam', 
    lastUpdate: '5 menit yang lalu', 
    lat: 2.9649, 
    lng: 99.0601,
    unit: { nama: 'Dump Truck Hino 700', kode: 'TRK-001' }
  },
  { 
    id: '3', 
    unitId: '7', 
    status: 'disewa', 
    lokasi: 'Balikpapan, Kalimantan Timur', 
    kondisi: 78, 
    jamOperasi: '2,100 Jam', 
    lastUpdate: '10 menit yang lalu', 
    lat: -1.2692, 
    lng: 116.8307,
    unit: { nama: 'Motor Grader 120K', kode: 'GRD-001' }
  },
  { 
    id: '4', 
    unitId: '9', 
    status: 'disewa', 
    lokasi: 'Cikarang, Jawa Barat', 
    kondisi: 95, 
    jamOperasi: '450 Jam', 
    lastUpdate: '1 menit yang lalu', 
    lat: -6.2848, 
    lng: 107.1706,
    unit: { nama: 'Excavator Hitachi ZX200', kode: 'EXC-003' }
  },
];
