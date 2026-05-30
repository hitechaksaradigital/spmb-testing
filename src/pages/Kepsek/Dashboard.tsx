import { useStore } from '../../store/useStore';
import Card from '../../components/UI/Card';
import Badge from '../../components/UI/Badge';
import {
  Users,
  UserCheck,
  TrendingUp,
  DollarSign,
  BarChart3,
  Calendar
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartPie,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { generateDailyStats } from '../../data/mockData';

export default function KepsekDashboard() {
  const { getDashboardStats, konfigurasi } = useStore();
  const stats = getDashboardStats();
  const dailyStats = generateDailyStats(14);

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
      change: '+12%'
    },
    {
      label: 'Kuota Terpenuhi',
      value: `${Math.round((stats.kuotaTerisi / stats.kuotaTotal) * 100)}%`,
      subValue: `${stats.kuotaTerisi}/${stats.kuotaTotal}`,
      icon: <UserCheck className="h-6 w-6" />,
      color: 'green'
    },
    {
      label: 'Total Pemasukan',
      value: formatCurrency(stats.totalPemasukanFormulir + stats.totalPemasukanUangPangkal),
      icon: <DollarSign className="h-6 w-6" />,
      color: 'purple'
    },
    {
      label: 'Pendaftar Hari Ini',
      value: stats.pendaftarHariIni,
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'orange'
    }
  ];

  const kelulusanData = [
    { name: 'Lolos', value: stats.lolos, color: '#22c55e' },
    { name: 'Cadangan', value: stats.cadangan, color: '#eab308' },
    { name: 'Tidak Lolos', value: stats.tidakLolos, color: '#ef4444' },
    { name: 'Belum Diproses', value: stats.totalPendaftar - stats.lolos - stats.cadangan - stats.tidakLolos, color: '#9ca3af' }
  ];

  const progressData = [
    { label: 'Registrasi', value: stats.totalPendaftar, total: stats.totalPendaftar, color: 'blue' },
    { label: 'Bayar Formulir', value: stats.sudahBayarFormulir, total: stats.totalPendaftar, color: 'green' },
    { label: 'Form Lengkap', value: stats.sudahIsiForm, total: stats.totalPendaftar, color: 'purple' },
    { label: 'Sudah Ujian', value: stats.sudahUjian, total: stats.totalPendaftar, color: 'orange' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Kepala Sekolah</h1>
          <p className="text-gray-600">Monitoring PPDB Tahun Ajaran {konfigurasi.tahunAjaran}</p>
        </div>
        <Badge variant="info">
          <Calendar className="h-3 w-3 mr-1" />
          Update: {new Date().toLocaleDateString('id-ID')}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                {stat.subValue && (
                  <p className="text-xs text-gray-500 mt-1">{stat.subValue}</p>
                )}
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                stat.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                stat.color === 'green' ? 'bg-green-100 text-green-600' :
                stat.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                'bg-orange-100 text-orange-600'
              }`}>
                {stat.icon}
              </div>
            </div>
            {stat.change && (
              <div className="mt-3 flex items-center gap-1 text-green-600 text-sm">
                <TrendingUp className="h-4 w-4" />
                <span>{stat.change} dari bulan lalu</span>
              </div>
            )}
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart Pendaftar */}
        <Card title="Tren Pendaftar (14 Hari Terakhir)" className="lg:col-span-2">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyStats}>
                <defs>
                  <linearGradient id="colorPendaftar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="tanggal" 
                  tickFormatter={(val) => new Date(val).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  labelFormatter={(val) => new Date(val).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  formatter={(value) => [String(value), 'Pendaftar']}
                />
                <Area 
                  type="monotone" 
                  dataKey="jumlahPendaftar" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorPendaftar)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Pie Chart Kelulusan */}
        <Card title="Distribusi Kelulusan">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartPie>
                <Pie
                  data={kelulusanData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {kelulusanData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [String(value), 'Siswa']} />
                <Legend />
              </RechartPie>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Progress Funnel */}
      <Card title="Progres Tahapan PPDB">
        <div className="space-y-4">
          {progressData.map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-700">{item.label}</span>
                <span className="text-sm text-gray-500">
                  {item.value} / {item.total} ({item.total > 0 ? Math.round((item.value / item.total) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    item.color === 'blue' ? 'bg-blue-600' :
                    item.color === 'green' ? 'bg-green-600' :
                    item.color === 'purple' ? 'bg-purple-600' :
                    'bg-orange-600'
                  }`}
                  style={{ width: `${item.total > 0 ? (item.value / item.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Rincian Pemasukan */}
      <Card title="Rincian Pemasukan">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-green-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5" />
              </div>
              <span className="font-medium text-green-800">Biaya Formulir</span>
            </div>
            <p className="text-2xl font-bold text-green-700">
              {formatCurrency(stats.totalPemasukanFormulir)}
            </p>
            <p className="text-sm text-green-600 mt-1">
              {stats.sudahBayarFormulir} pembayaran
            </p>
          </div>

          <div className="bg-blue-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5" />
              </div>
              <span className="font-medium text-blue-800">Uang Pangkal</span>
            </div>
            <p className="text-2xl font-bold text-blue-700">
              {formatCurrency(stats.totalPemasukanUangPangkal)}
            </p>
            <p className="text-sm text-blue-600 mt-1">
              Dari siswa yang lolos
            </p>
          </div>

          <div className="bg-purple-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5" />
              </div>
              <span className="font-medium text-purple-800">Total Keseluruhan</span>
            </div>
            <p className="text-2xl font-bold text-purple-700">
              {formatCurrency(stats.totalPemasukanFormulir + stats.totalPemasukanUangPangkal)}
            </p>
            <p className="text-sm text-purple-600 mt-1">
              Akumulasi pemasukan
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
