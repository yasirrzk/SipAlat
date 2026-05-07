import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, ClipboardList, TrendingUp, AlertCircle, RefreshCcw } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { useDashboard } from '../../hooks/useDashboard';
import { usePenyewaan } from '../../hooks/usePenyewaan';
import { formatCurrency } from '../../utils/formatCurrency';
import { getPenyewaanStatusVariant } from '../../utils/statusColor';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading, isError, refetch } = useDashboard();
  const { useGetPenyewaans } = usePenyewaan();
  const { data: penyewaans, isLoading: isLoadingRentals } = useGetPenyewaans();

  // Dynamic Ending Soon Logic
  const endingSoonCount = useMemo(() => {
    if (!penyewaans) return 0;
    const now = new Date('2026-05-07'); 
    const twoDaysFromNow = new Date('2026-05-07');
    twoDaysFromNow.setDate(now.getDate() + 2);
    
    return penyewaans.filter(p => {
      if (p.status !== 'aktif') return false;
      const end = new Date(p.tanggalSelesai);
      return end <= twoDaysFromNow && end >= now;
    }).length;
  }, [penyewaans]);

  if (isError) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <p className="text-red-400 font-medium">Gagal memuat data dashboard.</p>
        <Button variant="outline" onClick={() => refetch()} className="gap-2">
          <RefreshCcw size={18} />
          Coba Lagi
        </Button>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Unit', value: stats?.totalUnits ?? 0, icon: Truck, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Unit Tersedia', value: stats?.availableUnits ?? 0, icon: Truck, color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'Unit Disewa', value: stats?.rentedUnits ?? 0, icon: ClipboardList, color: 'text-orange-400', bg: 'bg-orange-400/10' },
    { label: 'Pendapatan (Mei)', value: formatCurrency(stats?.revenueThisMonth ?? 0), icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
          <p className="text-slate-400">Ringkasan operasional SipAlat hari ini.</p>
        </div>
        {endingSoonCount > 0 && (
          <Badge variant="warning" className="flex gap-2 py-1.5 px-3">
            <AlertCircle size={14} />
            {endingSoonCount} Unit Segera Selesai Sewa (H-2)
          </Badge>
        )}
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading 
          ? [...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)
          : statCards.map((stat, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-indigo-500/30 transition-all">
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                  <h3 className="text-xl font-bold text-slate-100">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-[10px] text-green-400 font-bold gap-1 uppercase tracking-tighter">
                <TrendingUp size={12} />
                <span>+12% dari bulan lalu</span>
              </div>
            </div>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-200">Volume Penyewaan 2026</h3>
            <select className="bg-slate-900 border border-slate-800 text-xs text-slate-400 rounded-lg px-3 py-1.5 outline-none">
              <option>Per Bulan</option>
              <option>Per Minggu</option>
            </select>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-[400px]">
            {isLoading ? (
              <Skeleton className="w-full h-full rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.monthlyStats} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    stroke="#64748b" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={10}
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip 
                    cursor={{ fill: '#1e293b', opacity: 0.4 }}
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderColor: '#1e293b', 
                      borderRadius: '12px',
                      color: '#f1f5f9' 
                    }}
                    itemStyle={{ color: '#6366f1' }}
                  />
                  <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                    {stats?.monthlyStats.map((_, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === (stats?.monthlyStats?.length ?? 0) - 1 ? '#6366f1' : '#312e81'} 
                        className="transition-all duration-300 hover:fill-indigo-400"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-200">Aktivitas Terbaru</h3>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            {isLoading 
              ? [...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)
              : stats?.recentActivities.map((activity) => (
                <div key={activity.id} className="flex gap-4 items-start group">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-slate-200 group-hover:text-indigo-400 transition-colors">
                      {activity.description}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                      {activity.customer} • {activity.timeAgo}
                    </p>
                  </div>
                </div>
              ))}
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs font-bold uppercase tracking-widest border-slate-800 text-slate-400 hover:bg-slate-800"
              onClick={() => navigate('/penyewaan')}
            >
              Log Selengkapnya
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-200">Penyewaan Aktif Terbaru</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-indigo-400 text-xs font-bold uppercase tracking-wider hover:bg-indigo-600/10"
            onClick={() => navigate('/penyewaan')}
          >
            Lihat Semua
          </Button>
        </div>
        <Table headers={['Pelanggan', 'Unit Alat Berat', 'Mulai', 'Selesai', 'Status', 'Aksi']}>
          {isLoadingRentals ? (
            [...Array(3)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                <TableCell><Skeleton className="h-6 w-40" /></TableCell>
                <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                <TableCell><Skeleton className="h-6 w-16" /></TableCell>
              </TableRow>
            ))
          ) : (
            penyewaans?.slice(0, 5).map((sewa) => (
              <TableRow key={sewa.id}>
                <TableCell className="font-bold text-slate-200">{sewa.pelanggan?.perusahaan}</TableCell>
                <TableCell>{sewa.unit?.nama}</TableCell>
                <TableCell className="text-xs text-slate-400">{sewa.tanggalMulai}</TableCell>
                <TableCell className="text-xs text-slate-400">{sewa.tanggalSelesai}</TableCell>
                <TableCell>
                  <Badge variant={getPenyewaanStatusVariant(sewa.status)}>
                    {sewa.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300"
                    onClick={() => navigate(`/penyewaan/${sewa.id}`)}
                  >
                    Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </Table>
      </div>
    </div>
  );
};

export default DashboardPage;
