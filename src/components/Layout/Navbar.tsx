import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import {
  GraduationCap,
  Menu,
  X,
  LogOut,
  User,
  LayoutDashboard,
  ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const { currentUser, isAuthenticated, logout } = useStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const getDashboardPath = () => {
    if (!currentUser) return '/login';
    switch (currentUser.role) {
      case 'siswa':
        return '/siswa/dashboard';
      case 'panitia':
        return '/admin/dashboard';
      case 'kepala_sekolah':
        return '/kepsek/dashboard';
      default:
        return '/';
    }
  };

  const getRoleName = () => {
    if (!currentUser) return '';
    switch (currentUser.role) {
      case 'siswa':
        return 'Calon Siswa';
      case 'panitia':
        return 'Panitia PPDB';
      case 'kepala_sekolah':
        return 'Kepala Sekolah';
      default:
        return '';
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition">
            <GraduationCap className="h-8 w-8" />
            <div>
              <span className="font-bold text-lg">PPDB Online</span>
              <span className="hidden sm:inline text-xs block text-blue-200">Sekolah Swasta Unggulan</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 hover:bg-white/10 rounded-lg transition"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition"
                >
                  Daftar Sekarang
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-lg transition"
                >
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium">{currentUser?.name}</div>
                    <div className="text-xs text-blue-200">{getRoleName()}</div>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 text-gray-700">
                    <Link
                      to={getDashboardPath()}
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600"
                    >
                      <LogOut className="h-4 w-4" />
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-white/10 rounded-lg"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-800 border-t border-blue-600">
          <div className="px-4 py-4 space-y-2">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 hover:bg-white/10 rounded-lg"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 bg-white text-blue-700 font-semibold rounded-lg text-center"
                >
                  Daftar Sekarang
                </Link>
              </>
            ) : (
              <>
                <div className="px-4 py-2 border-b border-blue-600">
                  <div className="font-medium">{currentUser?.name}</div>
                  <div className="text-sm text-blue-200">{getRoleName()}</div>
                </div>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-lg"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-lg w-full text-left text-red-300"
                >
                  <LogOut className="h-4 w-4" />
                  Keluar
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
