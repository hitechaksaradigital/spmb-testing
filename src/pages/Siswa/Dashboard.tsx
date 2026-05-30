import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import Card from '../../components/UI/Card';
import ProgressBar from '../../components/UI/ProgressBar';
import Badge from '../../components/UI/Badge';
import Button from '../../components/UI/Button';
import {
  CreditCard,
  FileText,
  PenTool,
  Award,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar
} from 'lucide-react';

export default function SiswaDashboard() {
  const { currentUser, getPendaftarByUserId, hasValidFormulirPayment, getUjianHasilByUserId, konfigurasi, getPembayaranByUserId } = useStore();

  const profil = currentUser ? getPendaftarByUserId(currentUser.id) : null;
  const sudahBayar = currentUser ? hasValidFormulirPayment(currentUser.id) : false;
  const hasilUjian = currentUser ? getUjianHasilByUserId(currentUser.id) : null;
  const pembayaran = currentUser ? getPembayaranByUserId(currentUser.id) : [];
  const pembayaranFormulir = pembayaran.find(p => p.jenisPembayaran === 'formulir');

  const getProgressSteps = () => {
    const steps = [
      {
        id: 'registrasi',
        label: 'Registrasi',
        status: 'completed' as const
      },
      {
        id: 'bayar',
        label: 'Pembayaran',
        status: sudahBayar ? 'completed' as const : 
                pembayaranFormulir?.status === 'pending' ? 'current' as const : 'current' as const
      },
      {
        id: 'formulir',
        label: 'Isi Formulir',
        status: !sudahBayar ? 'locked' as const :
                profil?.statusForm === 'lengkap' || profil?.statusForm === 'terverifikasi' ? 'completed' as const : 'current' as const
      },
      {
        id: 'ujian',
        label: 'Ujian',
        status: !sudahBayar || (profil?.statusForm !== 'lengkap' && profil?.statusForm !== 'terverifikasi') ? 'locked' as const :
                hasilUjian ? 'completed' as const : 'current' as const
      },
      {
        id: 'pengumuman',
        label: 'Pengumuman',
        status: !hasilUjian ? 'locked' as const :
                profil?.statusKelulusan !== 'belum_diproses' ? 'completed' as const : 'current' as const
      }
    ];
    return steps;
  };

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

  const getNextAction = () => {
    if (!sudahBayar) {
      return {
        title: 'Lakukan Pembayaran',
        desc: 'Bayar biaya formulir untuk melanjutkan pendaftaran',
        link: '/siswa/pembayaran',
        icon: <CreditCard className="h-5 w-5" />
      };
    }
    if (profil?.statusForm === 'draft') {
      return {
        title: 'Lengkapi Formulir',
        desc: 'Isi data diri dan upload berkas yang diperlukan',
        link: '/siswa/formulir',
        icon: <FileText className="h-5 w-5" />
      };
    }
    if (!hasilUjian && (profil?.statusForm === 'lengkap' || profil?.statusForm === 'terverifikasi')) {
      return {
        title: 'Ikuti Ujian Seleksi',
        desc: 'Kerjakan soal ujian akademik dan psikotes',
        link: '/siswa/ujian',
        icon: <PenTool className="h-5 w-5" />
      };
    }
    if (profil?.statusKelulusan === 'belum_diproses') {
      return {
        title: 'Menunggu Pengumuman',
        desc: 'Hasil seleksi akan diumumkan segera',
        link: '/siswa/pengumuman',
        icon: <Clock className="h-5 w-5" />
      };
    }
    return {
      title: 'Lihat Hasil Seleksi',
      desc: 'Cek status kelulusan Anda',
      link: '/siswa/pengumuman',
      icon: <Award className="h-5 w-5" />
    };
  };

  const nextAction = getNextAction();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              Selamat Datang, {currentUser?.name}!
            </h1>
            <p className="text-blue-100">
              No. Pendaftaran: <span className="font-semibold">{profil?.noPendaftaran}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={sudahBayar ? 'success' : 'warning'}>
              {sudahBayar ? 'Sudah Bayar Formulir' : 'Belum Bayar Formulir'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Progress */}
      <Card title="Progress Pendaftaran">
        <ProgressBar steps={getProgressSteps()} />
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Next Action */}
        <Card>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              {nextAction.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">{nextAction.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{nextAction.desc}</p>
              <Link to={nextAction.link}>
                <Button size="sm" icon={<ArrowRight className="h-4 w-4" />}>
                  Lanjutkan
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Info Jadwal */}
        <Card>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Calendar className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-3">Jadwal Penting</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Batas Pendaftaran:</span>
                  <span className="font-medium">{formatDate(konfigurasi.tanggalTutupPendaftaran)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ujian Seleksi:</span>
                  <span className="font-medium">{formatDate(konfigurasi.tanggalUjian)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pengumuman:</span>
                  <span className="font-medium">{formatDate(konfigurasi.tanggalPengumuman)}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Status Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Status Pembayaran */}
        <Card>
          <div className="text-center">
            <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
              sudahBayar ? 'bg-green-100 text-green-600' : 
              pembayaranFormulir?.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 
              'bg-gray-100 text-gray-400'
            }`}>
              {sudahBayar ? <CheckCircle className="h-6 w-6" /> : 
               pembayaranFormulir?.status === 'pending' ? <Clock className="h-6 w-6" /> :
               <CreditCard className="h-6 w-6" />}
            </div>
            <h4 className="font-medium text-gray-900 mb-1">Pembayaran Formulir</h4>
            <Badge variant={
              sudahBayar ? 'success' : 
              pembayaranFormulir?.status === 'pending' ? 'warning' : 'default'
            }>
              {sudahBayar ? 'Lunas' : 
               pembayaranFormulir?.status === 'pending' ? 'Menunggu Verifikasi' : 'Belum Bayar'}
            </Badge>
            <p className="text-sm text-gray-500 mt-2">{formatCurrency(konfigurasi.biayaFormulir)}</p>
          </div>
        </Card>

        {/* Status Formulir */}
        <Card>
          <div className="text-center">
            <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
              profil?.statusForm === 'lengkap' || profil?.statusForm === 'terverifikasi' 
                ? 'bg-green-100 text-green-600' 
                : profil?.statusForm === 'draft' && sudahBayar 
                ? 'bg-yellow-100 text-yellow-600'
                : 'bg-gray-100 text-gray-400'
            }`}>
              {profil?.statusForm === 'lengkap' || profil?.statusForm === 'terverifikasi' 
                ? <CheckCircle className="h-6 w-6" /> 
                : <FileText className="h-6 w-6" />}
            </div>
            <h4 className="font-medium text-gray-900 mb-1">Data Formulir</h4>
            <Badge variant={
              profil?.statusForm === 'terverifikasi' ? 'success' :
              profil?.statusForm === 'lengkap' ? 'info' :
              sudahBayar ? 'warning' : 'default'
            }>
              {profil?.statusForm === 'terverifikasi' ? 'Terverifikasi' :
               profil?.statusForm === 'lengkap' ? 'Lengkap' :
               sudahBayar ? 'Belum Lengkap' : 'Terkunci'}
            </Badge>
          </div>
        </Card>

        {/* Status Ujian */}
        <Card>
          <div className="text-center">
            <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
              hasilUjian ? 'bg-green-100 text-green-600' : 
              profil?.statusForm === 'lengkap' || profil?.statusForm === 'terverifikasi'
                ? 'bg-yellow-100 text-yellow-600'
                : 'bg-gray-100 text-gray-400'
            }`}>
              {hasilUjian ? <CheckCircle className="h-6 w-6" /> : <PenTool className="h-6 w-6" />}
            </div>
            <h4 className="font-medium text-gray-900 mb-1">Ujian Seleksi</h4>
            <Badge variant={
              hasilUjian ? 'success' :
              profil?.statusForm === 'lengkap' || profil?.statusForm === 'terverifikasi' ? 'warning' : 'default'
            }>
              {hasilUjian ? `Selesai (${hasilUjian.nilaiTotal})` :
               profil?.statusForm === 'lengkap' || profil?.statusForm === 'terverifikasi' ? 'Belum Dikerjakan' : 'Terkunci'}
            </Badge>
          </div>
        </Card>
      </div>

      {/* Info Status Kelulusan */}
      {profil?.statusKelulusan !== 'belum_diproses' && (
        <Card>
          <div className={`p-6 rounded-lg text-center ${
            profil?.statusKelulusan === 'lolos' ? 'bg-green-50' :
            profil?.statusKelulusan === 'cadangan' ? 'bg-yellow-50' :
            'bg-red-50'
          }`}>
            <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
              profil?.statusKelulusan === 'lolos' ? 'bg-green-100 text-green-600' :
              profil?.statusKelulusan === 'cadangan' ? 'bg-yellow-100 text-yellow-600' :
              'bg-red-100 text-red-600'
            }`}>
              {profil?.statusKelulusan === 'lolos' ? <Award className="h-8 w-8" /> :
               profil?.statusKelulusan === 'cadangan' ? <Clock className="h-8 w-8" /> :
               <AlertCircle className="h-8 w-8" />}
            </div>
            <h3 className={`text-xl font-bold mb-2 ${
              profil?.statusKelulusan === 'lolos' ? 'text-green-700' :
              profil?.statusKelulusan === 'cadangan' ? 'text-yellow-700' :
              'text-red-700'
            }`}>
              {profil?.statusKelulusan === 'lolos' ? 'Selamat! Anda Dinyatakan LOLOS' :
               profil?.statusKelulusan === 'cadangan' ? 'Anda Masuk Daftar CADANGAN' :
               'Maaf, Anda Belum Lolos Seleksi'}
            </h3>
            <p className={`text-sm ${
              profil?.statusKelulusan === 'lolos' ? 'text-green-600' :
              profil?.statusKelulusan === 'cadangan' ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {profil?.statusKelulusan === 'lolos' ? 'Silakan lakukan daftar ulang sebelum batas waktu berakhir' :
               profil?.statusKelulusan === 'cadangan' ? 'Tunggu informasi selanjutnya dari panitia' :
               'Terima kasih telah berpartisipasi dalam PPDB'}
            </p>
            {profil?.statusKelulusan === 'lolos' && (
              <Link to="/siswa/pengumuman" className="inline-block mt-4">
                <Button variant="success" icon={<ArrowRight className="h-4 w-4" />}>
                  Daftar Ulang
                </Button>
              </Link>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
