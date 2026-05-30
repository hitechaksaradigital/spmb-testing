import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import Navbar from '../../components/Layout/Navbar';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import { GraduationCap, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok!');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter!');
      return;
    }

    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const result = register(formData.name, formData.email, formData.phone, formData.password);

    if (result.success) {
      toast.success(result.message, { duration: 5000 });
      navigate('/siswa/dashboard');
    } else {
      setError(result.message);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                <GraduationCap className="h-8 w-8" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Registrasi PPDB</h1>
              <p className="text-gray-600 mt-2">
                Buat akun untuk memulai pendaftaran
              </p>
            </div>

            {/* Info Box */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Setelah registrasi, Anda akan mendapatkan:</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-700">
                    <li>Nomor Pendaftaran Unik (PPDB-YYYY-XXXX)</li>
                    <li>Akses ke dashboard pendaftaran</li>
                    <li>Panduan langkah selanjutnya</li>
                  </ul>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Nama Lengkap"
                type="text"
                placeholder="Masukkan nama lengkap"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <Input
                label="Email"
                type="email"
                placeholder="nama@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                helper="Email akan digunakan untuk login"
              />

              <Input
                label="Nomor WhatsApp"
                type="tel"
                placeholder="08xxxxxxxxxx"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                helper="Untuk notifikasi status pendaftaran"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Password"
                  type="password"
                  placeholder="Min. 6 karakter"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />

                <Input
                  label="Konfirmasi Password"
                  type="password"
                  placeholder="Ulangi password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="agree"
                  required
                  className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="agree" className="text-sm text-gray-600">
                  Saya menyetujui{' '}
                  <span className="text-blue-600 hover:underline cursor-pointer">
                    syarat dan ketentuan
                  </span>{' '}
                  yang berlaku
                </label>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isLoading}
                icon={<UserPlus className="h-5 w-5" />}
              >
                Daftar Sekarang
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Sudah punya akun?{' '}
                <Link to="/login" className="text-blue-600 font-medium hover:underline">
                  Masuk di sini
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
