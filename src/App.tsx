import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { authService } from './services/supabaseService';
import { isSupabaseConfigured } from './lib/supabase';
import { useStore } from './store/useStore';

// Layouts
import DashboardLayout from './components/Layout/DashboardLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';

// Siswa Pages
import SiswaDashboard from './pages/Siswa/Dashboard';
import PembayaranPage from './pages/Siswa/Pembayaran';
import FormulirPage from './pages/Siswa/Formulir';
import BerkasPage from './pages/Siswa/Berkas';
import UjianPage from './pages/Siswa/Ujian';
import PengumumanPage from './pages/Siswa/Pengumuman';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import PendaftarPage from './pages/Admin/Pendaftar';
import VerifikasiPembayaranPage from './pages/Admin/VerifikasiPembayaran';
import VerifikasiBerkasPage from './pages/Admin/VerifikasiBerkas';
import KelulusanPage from './pages/Admin/Kelulusan';
import ManajemenSoalPage from './pages/Admin/ManajemenSoal';
import HasilUjianPage from './pages/Admin/HasilUjian';

// Kepsek Pages
import KepsekDashboard from './pages/Kepsek/Dashboard';
import LaporanPage from './pages/Kepsek/Laporan';
import PengaturanPage from './pages/Kepsek/Pengaturan';

function App() {
  // Check for existing Supabase session on app load
  useEffect(() => {
    const checkSession = async () => {
      if (isSupabaseConfigured()) {
        const session = await authService.getSession();
        if (session?.user) {
          const user = await authService.getCurrentUser();
          if (user) {
            useStore.setState({ currentUser: user as any, isAuthenticated: true });
          }
        }
      }
    };
    checkSession();
  }, []);

  return (
    <BrowserRouter>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#333',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            borderRadius: '8px',
            padding: '12px 16px',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Siswa Routes */}
        <Route element={<DashboardLayout allowedRoles={['siswa']} />}>
          <Route path="/siswa/dashboard" element={<SiswaDashboard />} />
          <Route path="/siswa/pembayaran" element={<PembayaranPage />} />
          <Route path="/siswa/formulir" element={<FormulirPage />} />
          <Route path="/siswa/berkas" element={<BerkasPage />} />
          <Route path="/siswa/ujian" element={<UjianPage />} />
          <Route path="/siswa/pengumuman" element={<PengumumanPage />} />
        </Route>

        {/* Admin/Panitia Routes */}
        <Route element={<DashboardLayout allowedRoles={['panitia']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/pendaftar" element={<PendaftarPage />} />
          <Route path="/admin/verifikasi-berkas" element={<VerifikasiBerkasPage />} />
          <Route path="/admin/verifikasi-pembayaran" element={<VerifikasiPembayaranPage />} />
          <Route path="/admin/soal" element={<ManajemenSoalPage />} />
          <Route path="/admin/hasil-ujian" element={<HasilUjianPage />} />
          <Route path="/admin/kelulusan" element={<KelulusanPage />} />
        </Route>

        {/* Kepala Sekolah Routes */}
        <Route element={<DashboardLayout allowedRoles={['kepala_sekolah']} />}>
          <Route path="/kepsek/dashboard" element={<KepsekDashboard />} />
          <Route path="/kepsek/statistik" element={<KepsekDashboard />} />
          <Route path="/kepsek/laporan" element={<LaporanPage />} />
          <Route path="/kepsek/pengaturan" element={<PengaturanPage />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
