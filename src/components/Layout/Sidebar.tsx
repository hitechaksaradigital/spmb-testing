import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  Upload,
  PenTool,
  Award,
  Users,
  ClipboardCheck,
  Settings,
  BarChart3,
  FileSpreadsheet,
  BookOpen,
  UserCheck,
  DollarSign
} from 'lucide-react';

interface MenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export default function Sidebar() {
  const { currentUser } = useStore();
  const location = useLocation();

  const siswaMenu: MenuItem[] = [
    { label: 'Dashboard', path: '/siswa/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: 'Pembayaran', path: '/siswa/pembayaran', icon: <CreditCard className="h-5 w-5" /> },
    { label: 'Formulir Data', path: '/siswa/formulir', icon: <FileText className="h-5 w-5" /> },
    { label: 'Upload Berkas', path: '/siswa/berkas', icon: <Upload className="h-5 w-5" /> },
    { label: 'Ujian Seleksi', path: '/siswa/ujian', icon: <PenTool className="h-5 w-5" /> },
    { label: 'Pengumuman', path: '/siswa/pengumuman', icon: <Award className="h-5 w-5" /> },
  ];

  const panitiaMenu: MenuItem[] = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: 'Data Pendaftar', path: '/admin/pendaftar', icon: <Users className="h-5 w-5" /> },
    { label: 'Verifikasi Berkas', path: '/admin/verifikasi-berkas', icon: <ClipboardCheck className="h-5 w-5" /> },
    { label: 'Verifikasi Pembayaran', path: '/admin/verifikasi-pembayaran', icon: <DollarSign className="h-5 w-5" /> },
    { label: 'Manajemen Soal', path: '/admin/soal', icon: <BookOpen className="h-5 w-5" /> },
    { label: 'Hasil Ujian', path: '/admin/hasil-ujian', icon: <FileSpreadsheet className="h-5 w-5" /> },
    { label: 'Kelulusan', path: '/admin/kelulusan', icon: <UserCheck className="h-5 w-5" /> },
  ];

  const kepsekMenu: MenuItem[] = [
    { label: 'Dashboard', path: '/kepsek/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: 'Statistik', path: '/kepsek/statistik', icon: <BarChart3 className="h-5 w-5" /> },
    { label: 'Laporan', path: '/kepsek/laporan', icon: <FileSpreadsheet className="h-5 w-5" /> },
    { label: 'Pengaturan', path: '/kepsek/pengaturan', icon: <Settings className="h-5 w-5" /> },
  ];

  const getMenu = () => {
    switch (currentUser?.role) {
      case 'siswa':
        return siswaMenu;
      case 'panitia':
        return panitiaMenu;
      case 'kepala_sekolah':
        return kepsekMenu;
      default:
        return [];
    }
  };

  const menu = getMenu();

  return (
    <aside className="w-64 bg-white shadow-lg min-h-[calc(100vh-4rem)] hidden lg:block">
      <nav className="p-4">
        <ul className="space-y-1">
          {menu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
