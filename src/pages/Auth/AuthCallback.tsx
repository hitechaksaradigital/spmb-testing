import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useSupabase';
import { authService } from '../../services/supabaseService';
import toast from 'react-hot-toast';
import { GraduationCap } from 'lucide-react';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function handleCallback() {
      try {
        const result = await authService.handleOAuthCallback();
        if (result.user) {
          toast.success('Login dengan Google berhasil!');
          // Redirect based on role
          switch (result.user.role) {
            case 'siswa':
              navigate('/siswa/dashboard');
              break;
            case 'panitia':
              navigate('/admin/dashboard');
              break;
            case 'kepala_sekolah':
              navigate('/kepsek/dashboard');
              break;
            default:
              navigate('/');
          }
        }
      } catch (err: any) {
        console.error('OAuth callback error:', err);
        setError(err.message || 'Authentication failed');
        toast.error('Login dengan Google gagal');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } finally {
        setIsProcessing(false);
      }
    }

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        {isProcessing ? (
          <>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 text-blue-600 rounded-full mb-6 animate-pulse">
              <GraduationCap className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Memproses Login...</h2>
            <p className="text-gray-600">Mohon tunggu sebentar</p>
          </>
        ) : (
          <>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 text-red-600 rounded-full mb-6">
              <GraduationCap className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Gagal</h2>
            <p className="text-gray-600">{error}</p>
            <p className="text-sm text-gray-500 mt-4">Mengalihkan ke halaman login...</p>
          </>
        )}
      </div>
    </div>
  );
}