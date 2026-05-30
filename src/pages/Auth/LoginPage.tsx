import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useSupabase';
import { useStore } from '../../store/useStore';
import Navbar from '../../components/Layout/Navbar';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import { GraduationCap, LogIn, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      toast.success('Login berhasil!');
      const user = useStore.getState().currentUser;
      if (user) {
        switch (user.role) {
          case 'siswa':
            navigate('/siswa/dashboard');
            break;
          case 'panitia':
            navigate('/admin/dashboard');
            break;
          case 'kepala_sekolah':
            navigate('/kepsek/dashboard');
            break;
        }
      }
    } else {
      setError(result.message);
    }

    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);

    try {
      const result = await loginWithGoogle();
      // Note: If successful, the page will redirect to Google
      // After OAuth callback, it will return to the app
      if (!result.success) {
        setError(result.message || 'Google login failed');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                <GraduationCap className="h-8 w-8" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Masuk ke Akun</h1>
              <p className="text-gray-600 mt-2">
                Silakan masuk untuk melanjutkan pendaftaran
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email"
                type="email"
                placeholder="nama@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="Masukkan password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />

              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isLoading}
                icon={<LogIn className="h-5 w-5" />}
              >
                Masuk
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Belum punya akun?{' '}
                <Link to="/register" className="text-blue-600 font-medium hover:underline">
                  Daftar Sekarang
                </Link>
              </p>
            </div>

            {/* Divider */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center mb-4">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-4 text-sm text-gray-500">atau</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* Google Login Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-medium text-gray-700">Masuk dengan Google</span>
              </button>
            </div>

            {/* Demo Accounts */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center mb-3">Akun Demo:</p>
              <div className="space-y-2 text-xs text-gray-600">
<button
                   type="button"
                   onClick={() => setFormData({ email: 'budi@gmail.com', password: 'siswa123' })}
                   className="w-full p-2 bg-gray-50 hover:bg-gray-100 rounded text-left"
                 >
                   <strong>Siswa:</strong> budi@gmail.com / siswa123
                 </button>
                 <button
                   type="button"
                   onClick={() => setFormData({ email: 'panitia@sekolah.sch.id', password: 'admin123' })}
                   className="w-full p-2 bg-gray-50 hover:bg-gray-100 rounded text-left"
                 >
                   <strong>Panitia:</strong> panitia@sekolah.sch.id / admin123
                 </button>
                 <button
                   type="button"
                   onClick={() => setFormData({ email: 'kepsek@sekolah.sch.id', password: 'admin123' })}
                   className="w-full p-2 bg-gray-50 hover:bg-gray-100 rounded text-left"
                 >
                   <strong>Kepsek:</strong> kepsek@sekolah.sch.id / admin123
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
