import React from 'react';
import { Bell, Search, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const Navbar: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 z-40 ml-64">
      <div className="flex items-center gap-4 bg-slate-800/50 px-4 py-2 rounded-full w-96 border border-slate-700">
        <Search size={18} className="text-slate-400" />
        <input 
          type="text" 
          placeholder="Cari unit atau transaksi..." 
          className="bg-transparent border-none outline-none text-sm text-slate-200 placeholder:text-slate-500 w-full"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-slate-900"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-6 border-l border-slate-800">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-200">{user?.nama || 'Guest'}</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{user?.role || 'User'}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
            <UserIcon size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};
