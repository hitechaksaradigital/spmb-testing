import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import Navbar from '../components/Layout/Navbar';
import {
  GraduationCap,
  Users,
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  ArrowRight,
  Clock,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

export default function LandingPage() {
  const { konfigurasi } = useStore();

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const features = [
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Pendaftaran Online',
      description: 'Daftar dari mana saja tanpa perlu datang ke sekolah'
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: 'Ujian CBT',
      description: 'Ujian seleksi berbasis komputer yang mudah dan praktis'
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: 'Hasil Real-time',
      description: 'Pantau status pendaftaran dan hasil seleksi secara langsung'
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: 'Proses Transparan',
      description: 'Setiap tahapan dapat dipantau dengan jelas'
    }
  ];

  const timeline = [
    { step: 1, title: 'Registrasi Akun', desc: 'Buat akun dengan email/WhatsApp' },
    { step: 2, title: 'Pembayaran Formulir', desc: 'Bayar biaya pendaftaran' },
    { step: 3, title: 'Isi Formulir', desc: 'Lengkapi data diri & upload berkas' },
    { step: 4, title: 'Ujian Seleksi', desc: 'Ikuti tes akademik & psikotes online' },
    { step: 5, title: 'Pengumuman', desc: 'Lihat hasil seleksi' },
    { step: 6, title: 'Daftar Ulang', desc: 'Bayar uang pangkal jika lolos' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm mb-6">
                <Calendar className="h-4 w-4" />
                Tahun Ajaran {konfigurasi.tahunAjaran}
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
                Pendaftaran Peserta Didik Baru
                <span className="text-blue-300"> Online</span>
              </h1>
              
              <p className="text-lg text-blue-100 mb-8 max-w-xl">
                Selamat datang di sistem PPDB Online Sekolah Swasta Unggulan. 
                Daftar sekarang dan wujudkan masa depan cemerlang bersama kami!
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition shadow-lg"
                >
                  Daftar Sekarang
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition"
                >
                  Sudah Punya Akun? Masuk
                </Link>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/20">
                <div className="flex items-center gap-4 mb-6">
                  <GraduationCap className="h-12 w-12" />
                  <div>
                    <h3 className="text-xl font-bold">Informasi Pendaftaran</h3>
                    <p className="text-blue-200">Kuota: {konfigurasi.kuotaSiswa} siswa</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4">
                    <Clock className="h-5 w-5 text-blue-300" />
                    <div>
                      <p className="text-sm text-blue-200">Periode Pendaftaran</p>
                      <p className="font-medium">{formatDate(konfigurasi.tanggalBukaPendaftaran)} - {formatDate(konfigurasi.tanggalTutupPendaftaran)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4">
                    <Calendar className="h-5 w-5 text-blue-300" />
                    <div>
                      <p className="text-sm text-blue-200">Tanggal Ujian</p>
                      <p className="font-medium">{formatDate(konfigurasi.tanggalUjian)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4">
                    <Award className="h-5 w-5 text-blue-300" />
                    <div>
                      <p className="text-sm text-blue-200">Pengumuman</p>
                      <p className="font-medium">{formatDate(konfigurasi.tanggalPengumuman)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Kemudahan Pendaftaran Online
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Sistem PPDB online kami dirancang untuk memberikan pengalaman pendaftaran yang mudah dan transparan
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl hover:bg-blue-50 transition group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-xl mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Alur Pendaftaran
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ikuti langkah-langkah berikut untuk menyelesaikan pendaftaran
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {timeline.map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition flex items-start gap-4"
              >
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Biaya */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Biaya Pendaftaran
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center">
              <h3 className="text-lg font-medium text-blue-800 mb-2">Biaya Formulir</h3>
              <p className="text-4xl font-bold text-blue-900 mb-4">
                {formatCurrency(konfigurasi.biayaFormulir)}
              </p>
              <p className="text-blue-700 text-sm">Dibayar saat pendaftaran</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 text-center">
              <h3 className="text-lg font-medium text-green-800 mb-2">Uang Pangkal</h3>
              <p className="text-4xl font-bold text-green-900 mb-4">
                {formatCurrency(konfigurasi.biayaUangPangkal)}
              </p>
              <p className="text-green-700 text-sm">Dibayar jika dinyatakan lolos</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-700 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Siap Bergabung Bersama Kami?
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Jangan lewatkan kesempatan untuk menjadi bagian dari sekolah terbaik. 
            Daftar sekarang sebelum kuota penuh!
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition shadow-lg text-lg"
          >
            Daftar Sekarang
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 text-white mb-4">
                <GraduationCap className="h-8 w-8" />
                <span className="font-bold text-lg">PPDB Online</span>
              </div>
              <p className="text-sm">
                Sistem Pendaftaran Peserta Didik Baru Online untuk Sekolah Swasta Unggulan
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Kontak</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Jl. Pendidikan No. 123, Jakarta
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  (021) 1234-5678
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  info@sekolah.sch.id
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Akun Demo</h4>
              <div className="space-y-2 text-sm bg-gray-800 p-4 rounded-lg">
                <p><strong>Siswa:</strong> budi@gmail.com / siswa123</p>
                <p><strong>Panitia:</strong> panitia@sekolah.sch.id / panitia123</p>
                <p><strong>Kepsek:</strong> kepsek@sekolah.sch.id / kepsek123</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2025 PPDB Online - Sekolah Swasta Unggulan. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
