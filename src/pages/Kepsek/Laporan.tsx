import { useState } from 'react';
import { useStore } from '../../store/useStore';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import {
  FileSpreadsheet,
  FileText,
  Users,
  DollarSign,
  GraduationCap,
  Printer
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function LaporanPage() {
  const { getAllPendaftar, getDashboardStats, konfigurasi, ujianHasil } = useStore();
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const allPendaftar = getAllPendaftar();
  const stats = getDashboardStats();

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const handleExport = async (type: string) => {
    setIsExporting(type);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success(`Laporan ${type} berhasil diexport!`);
    setIsExporting(null);
  };

  const reports = [
    {
      id: 'pendaftar',
      title: 'Data Pendaftar',
      desc: 'Daftar lengkap semua pendaftar dengan status',
      icon: <Users className="h-6 w-6" />,
      color: 'blue',
      count: allPendaftar.length
    },
    {
      id: 'pembayaran',
      title: 'Laporan Keuangan',
      desc: 'Rekap pembayaran formulir dan uang pangkal',
      icon: <DollarSign className="h-6 w-6" />,
      color: 'green',
      count: formatCurrency(stats.totalPemasukanFormulir + stats.totalPemasukanUangPangkal)
    },
    {
      id: 'ujian',
      title: 'Hasil Ujian',
      desc: 'Nilai dan peringkat peserta ujian',
      icon: <FileSpreadsheet className="h-6 w-6" />,
      color: 'purple',
      count: ujianHasil.length
    },
    {
      id: 'kelulusan',
      title: 'Kelulusan',
      desc: 'Status kelulusan semua peserta',
      icon: <GraduationCap className="h-6 w-6" />,
      color: 'orange',
      count: stats.lolos
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laporan PPDB</h1>
          <p className="text-gray-600">Export dan cetak laporan PPDB Tahun Ajaran {konfigurasi.tahunAjaran}</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.totalPendaftar}</p>
            <p className="text-sm text-gray-500">Total Pendaftar</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{stats.lolos}</p>
            <p className="text-sm text-gray-500">Diterima</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-600">{stats.cadangan}</p>
            <p className="text-sm text-gray-500">Cadangan</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">
              {Math.round((stats.kuotaTerisi / stats.kuotaTotal) * 100)}%
            </p>
            <p className="text-sm text-gray-500">Kuota Terpenuhi</p>
          </div>
        </Card>
      </div>

      {/* Report Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {reports.map((report) => (
          <Card key={report.id}>
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                report.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                report.color === 'green' ? 'bg-green-100 text-green-600' :
                report.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                'bg-orange-100 text-orange-600'
              }`}>
                {report.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{report.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{report.desc}</p>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="default">{report.count} data</Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    icon={<FileSpreadsheet className="h-4 w-4" />}
                    onClick={() => handleExport(`${report.title} Excel`)}
                    isLoading={isExporting === `${report.title} Excel`}
                  >
                    Excel
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    icon={<FileText className="h-4 w-4" />}
                    onClick={() => handleExport(`${report.title} PDF`)}
                    isLoading={isExporting === `${report.title} PDF`}
                  >
                    PDF
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    icon={<Printer className="h-4 w-4" />}
                    onClick={() => toast.success('Membuka halaman cetak...')}
                  >
                    Cetak
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Preview Data */}
      <Card title="Preview Data Pendaftar (10 Data Teratas)">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left py-3 px-4 font-medium text-gray-600">No</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">No. Pendaftaran</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Nama</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Sekolah Asal</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Nilai</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {allPendaftar.slice(0, 10).map((p, idx) => (
                <tr key={p.id} className="border-b">
                  <td className="py-3 px-4">{idx + 1}</td>
                  <td className="py-3 px-4 font-mono">{p.noPendaftaran}</td>
                  <td className="py-3 px-4">{p.namaLengkap}</td>
                  <td className="py-3 px-4">{p.sekolahAsal || '-'}</td>
                  <td className="py-3 px-4 font-medium">{p.nilaiUjian || '-'}</td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        p.statusKelulusan === 'lolos' ? 'success' :
                        p.statusKelulusan === 'cadangan' ? 'warning' :
                        p.statusKelulusan === 'tidak_lolos' ? 'danger' : 'default'
                      }
                      size="sm"
                    >
                      {p.statusKelulusan.replace('_', ' ')}
                    </Badge>
                  </td>
                </tr>
              ))}
              {allPendaftar.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    Belum ada data pendaftar
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {allPendaftar.length > 10 && (
          <p className="text-sm text-gray-500 mt-4 text-center">
            Menampilkan 10 dari {allPendaftar.length} data. Export untuk melihat seluruh data.
          </p>
        )}
      </Card>
    </div>
  );
}
