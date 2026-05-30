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
  const { login } = useAuth();
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
      // Get user from store after successful login
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
