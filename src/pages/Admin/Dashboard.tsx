import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { useDashboardStats, useAllPendaftar } from '../../hooks/useSupabase';
import Card from '../../components/UI/Card';
import Badge from '../../components/UI/Badge';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  CreditCard,
  FileText,
  PenTool,
  ArrowRight
} from 'lucide-react';

export default function AdminDashboard() {
  const { konfigurasi } = useStore();
  const { stats, loading: statsLoading } = useDashboardStats();
  const { pendaftar: allPendaftar, loading: pendaftarLoading } = useAllPendaftar();
  const recentPendaftar = allPendaftar.slice(-5).reverse();

  if (statsLoading || pendaftarLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const statCards = [
    {
      label: 'Total Pendaftar',
      value: stats.totalPendaftar,
      icon: <Users className="h-6 w-6" />,
      color: 'blue',
      link: '/admin/pendaftar'
    },
    {
      label: 'Sudah Bayar Formulir',
      value: stats.sudahBayarFormulir,
      icon: <CreditCard className="h-6 w-6" />,
      color: 'green',
      link: '/admin/verifikasi-pembayaran'
    },
    {
      label: 'Form Lengkap',
      value: stats.sudahIsiForm,
      icon: <FileText className="h-6 w-6" />,
      color: 'purple',
      link: '/admin/verifikasi-berkas'
    },
    {
      label: 'Sudah Ujian',
      value: stats.sudahUjian,
      icon: <PenTool className="h-6 w-6" />,
      color: 'orange',
      link: '/admin/hasil-ujian'
    }
  ];

  const kelulusanStats = [
    { label: 'Lolos', value: stats.lolos, color: 'green', icon: <UserCheck className="h-5 w-5" /> },
    { label: 'Cadangan', value: stats.cadangan, color: 'yellow', icon: <Clock className="h-5 w-5" /> },
    { label: 'Tidak Lolos', value: stats.tidakLolos, color: 'red', icon: <UserX className="h-5 w-5" /> }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Panitia</h1>
          <p className="text-gray-600">PPDB Tahun Ajaran {konfigurasi.tahunAjaran}</p>
        </div>
        <Badge variant="info">
          Kuota: {stats.kuotaTerisi}/{stats.kuotaTotal} siswa
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Link key={stat.label} to={stat.link}>
            <Card className="hover:shadow-md transition cursor-pointer">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  stat.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  stat.color === 'green' ? 'bg-green-100 text-green-600' :
                  stat.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                  'bg-orange-100 text-orange-600'
                }`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Kelulusan Stats */}
        <Card title="Status Kelulusan">
          <div className="space-y-4">
            {kelulusanStats.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    item.color === 'green' ? 'bg-green-100 text-green-600' :
                    item.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {item.icon}
                  </div>
                  <span className="text-gray-700">{item.label}</span>
                </div>
                <span className="text-xl font-bold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
          <Link to="/admin/kelulusan" className="mt-4 flex items-center gap-2 text-blue-600 text-sm hover:underline">
            Kelola Kelulusan <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>

        {/* Pemasukan */}
        <Card title="Total Pemasukan">
          <div className="space-y-4">
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-600 mb-1">Biaya Formulir</p>
              <p className="text-2xl font-bold text-green-700">
                {formatCurrency(stats.totalPemasukanFormulir)}
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600 mb-1">Uang Pangkal</p>
              <p className="text-2xl font-bold text-blue-700">
                {formatCurrency(stats.totalPemasukanUangPangkal)}
              </p>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Total</span>
                <span className="text-xl font-bold text-gray-900">
                  {formatCurrency(stats.totalPemasukanFormulir + stats.totalPemasukanUangPangkal)}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card title="Aksi Cepat">
          <div className="space-y-3">
            <Link
              to="/admin/verifikasi-pembayaran"
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <CreditCard className="h-5 w-5 text-gray-600" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Verifikasi Pembayaran</p>
                <p className="text-xs text-gray-500">Cek pembayaran pending</p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </Link>
            <Link
              to="/admin/verifikasi-berkas"
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <FileText className="h-5 w-5 text-gray-600" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Verifikasi Berkas</p>
                <p className="text-xs text-gray-500">Review dokumen pendaftar</p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </Link>
            <Link
              to="/admin/soal"
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <PenTool className="h-5 w-5 text-gray-600" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Manajemen Soal</p>
                <p className="text-xs text-gray-500">Kelola bank soal</p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </Link>
          </div>
        </Card>
      </div>

      {/* Recent Pendaftar */}
      <Card
        title="Pendaftar Terbaru"
        action={
          <Link to="/admin/pendaftar" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
            Lihat Semua <ArrowRight className="h-4 w-4" />
          </Link>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-gray-600">No. Pendaftaran</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Nama</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status Form</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Pembayaran</th>
              </tr>
            </thead>
            <tbody>
              {recentPendaftar.map((p) => {
                const hasPaidFormulir = p.pembayaran?.some(
                  pay => pay.jenisPembayaran === 'formulir' && pay.status === 'success'
                );

                return (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm">{p.noPendaftaran}</td>
                    <td className="py-3 px-4">{p.namaLengkap}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          p.statusForm === 'terverifikasi' ? 'success' :
                          p.statusForm === 'lengkap' ? 'info' : 'default'
                        }
                        size="sm"
                      >
                        {p.statusForm}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={hasPaidFormulir ? 'success' : 'warning'} size="sm">
                        {hasPaidFormulir ? 'Lunas' : 'Pending'}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
              {recentPendaftar.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">
                    Belum ada pendaftar
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}