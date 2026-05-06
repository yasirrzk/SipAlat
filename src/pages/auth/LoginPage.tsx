import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Lock, Mail, Eye, EyeOff, Truck } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      // Mock Login API Call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const mockUser = {
        id: '1',
        nama: 'Admin SipAlat',
        email: data.email,
        role: 'admin' as const,
      };
      const mockToken = 'mock-jwt-token';

      setAuth(mockUser, mockToken);
      toast.success('Selamat datang kembali!');
      navigate('/');
    } catch (error) {
      toast.error('Email atau password salah');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex p-4 rounded-2xl bg-indigo-600/10 text-indigo-500 mb-4">
            <Truck size={40} />
          </div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight">SipAlat</h1>
          <p className="text-slate-400">Masuk ke dashboard manajemen penyewaan</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-3 top-[38px] text-slate-500" size={18} />
              <Input
                label="Email"
                type="email"
                placeholder="admin@sipalat.com"
                className="pl-10"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-[38px] text-slate-500" size={18} />
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  error={errors.password?.message}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-800 bg-slate-900 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-slate-900" />
                <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Ingat saya</span>
              </label>
              <a href="#" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">Lupa password?</a>
            </div>

            <Button
              type="submit"
              className="w-full py-6 text-base font-bold shadow-lg shadow-indigo-600/20"
              isLoading={isLoading}
            >
              Masuk Sekarang
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500">
          Belum punya akun? <a href="#" className="text-indigo-400 hover:text-indigo-300 font-medium">Hubungi Admin</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
