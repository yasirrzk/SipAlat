import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Truck, 
  ClipboardList, 
  MapPin, 
  Users, 
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../store/authStore';

interface MenuItem {
  icon: any;
  label: string;
  path: string;
  roles: string[];
}

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/', roles: ['admin', 'operator'] },
  { icon: Truck, label: 'Unit Alat Berat', path: '/unit', roles: ['admin', 'operator', 'pelanggan'] },
  { icon: ClipboardList, label: 'Penyewaan', path: '/penyewaan', roles: ['admin', 'operator', 'pelanggan'] },
  { icon: MapPin, label: 'Tracking', path: '/tracking', roles: ['admin', 'operator', 'pelanggan'] },
  { icon: Users, label: 'Pelanggan', path: '/pelanggan', roles: ['admin'] },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredMenu = menuItems.filter(item => 
    user?.role ? item.roles.includes(user.role) : false
  );

  return (
    <aside className="w-64 h-screen bg-slate-900 border-r border-slate-800 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck size={24} className="text-indigo-500" />
          <h1 className="text-xl font-bold text-white tracking-tight">SipAlat</h1>
        </div>
        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest px-1">Sistem Informasi Alat</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <p className="px-4 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Main Menu</p>
        {filteredMenu.map((item) => {
          const isActive = location.pathname === item.path || 
                          (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon size={20} className={cn(isActive ? "text-white" : "text-slate-500 group-hover:text-indigo-400")} />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-red-900/20 hover:text-red-400 transition-all duration-200 group"
        >
          <LogOut size={20} className="text-slate-500 group-hover:text-red-400" />
          <span className="font-medium text-sm">Keluar Sesi</span>
        </button>
      </div>
    </aside>
  );
};

