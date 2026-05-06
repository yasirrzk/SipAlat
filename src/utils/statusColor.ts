export type StatusVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export const getUnitStatusVariant = (status: string): StatusVariant => {
  switch (status.toLowerCase()) {
    case 'tersedia': return 'success';
    case 'disewa': return 'warning';
    case 'perawatan': return 'danger';
    case 'rusak': return 'danger';
    default: return 'neutral';
  }
};

export const getPenyewaanStatusVariant = (status: string): StatusVariant => {
  switch (status.toLowerCase()) {
    case 'aktif': return 'success';
    case 'konfirmasi': return 'info';
    case 'selesai': return 'neutral';
    case 'dibatalkan': return 'danger';
    case 'draft': return 'warning';
    default: return 'neutral';
  }
};
