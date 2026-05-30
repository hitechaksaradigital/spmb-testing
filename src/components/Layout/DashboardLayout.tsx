import { Outlet, Navigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import type { UserRole } from '../../types';

interface DashboardLayoutProps {
  allowedRoles: UserRole[];
}

export default function DashboardLayout({ allowedRoles }: DashboardLayoutProps) {
  const { currentUser, isAuthenticated } = useStore();

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    // Redirect to appropriate dashboard based on role
    switch (currentUser.role) {
      case 'siswa':
        return <Navigate to="/siswa/dashboard" replace />;
      case 'panitia':
        return <Navigate to="/admin/dashboard" replace />;
      case 'kepala_sekolah':
        return <Navigate to="/kepsek/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
