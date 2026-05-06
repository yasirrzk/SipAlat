import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import UnitListPage from './pages/unit/UnitListPage';
import UnitDetailPage from './pages/unit/UnitDetailPage';
import PenyewaanListPage from './pages/penyewaan/PenyewaanListPage';
import PenyewaanFormPage from './pages/penyewaan/PenyewaanFormPage';
import PenyewaanDetailPage from './pages/penyewaan/PenyewaanDetailPage';
import TrackingPage from './pages/tracking/TrackingPage';
import PelangganListPage from './pages/pelanggan/PelangganListPage';
import { useAuthStore } from './store/authStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} 
          />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardPage />} />
            
            {/* Unit Routes */}
            <Route path="/unit" element={<UnitListPage />} />
            <Route path="/unit/:id" element={<UnitDetailPage />} />
            
            {/* Penyewaan Routes */}
            <Route path="/penyewaan" element={<PenyewaanListPage />} />
            <Route path="/penyewaan/baru" element={<PenyewaanFormPage />} />
            <Route path="/penyewaan/:id" element={<PenyewaanDetailPage />} />
            
            {/* Other Routes */}
            <Route path="/tracking" element={<TrackingPage />} />
            <Route path="/pelanggan" element={<PelangganListPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;
