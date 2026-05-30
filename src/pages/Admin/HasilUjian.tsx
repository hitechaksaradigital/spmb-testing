import { useState } from 'react';
import { useStore } from '../../store/useStore';
import Card from '../../components/UI/Card';
import Badge from '../../components/UI/Badge';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import {
  Search,
  Download,
  Trophy,
  Medal,
  Award
} from 'lucide-react';

export default function HasilUjianPage() {
  const { ujianHasil, pendaftarProfil, users } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const getHasilWithDetails = () => {
    return ujianHasil.map(h => {
      const profil = pendaftarProfil.find(p => p.id === h.pendaftarId);
      const user = users.find(u => u.id === h.userId);
      return { ...h, profil, user };
    }).sort((a, b) => b.nilaiTotal - a.nilaiTotal);
  };

  const hasilList = getHasilWithDetails();

  const filteredHasil = hasilList.filter(h => 
    h.profil?.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.profil?.noPendaftaran.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return null;
  };

  const avgAkademik = hasilList.length > 0 
    ? Math.round(hasilList.reduce((sum, h) => sum + h.nilaiAkademik, 0) / hasilList.length) 
    : 0;
  const avgPsikotes = hasilList.length > 0 
    ? Math.round(hasilList.reduce((sum, h) => sum + h.nilaiPsikotes, 0) / hasilList.length) 
    : 0;
  const avgTotal = hasilList.length > 0 
    ? Math.round(hasilList.reduce((sum, h) => sum + h.nilaiTotal, 0) / hasilList.length) 
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hasil Ujian Seleksi</h1>
          <p className="text-gray-600">Total: {hasilList.length} peserta telah menyelesaikan ujian</p>
        </div>
        <Button variant="outline" icon={<Download className="h-4 w-4" />}>
          Export Hasil
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">{hasilList.length}</p>
            <p className="text-sm text-gray-500">Peserta Ujian</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{avgAkademik}</p>
            <p className="text-sm text-gray-500">Rata-rata Akademik</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">{avgPsikotes}</p>
            <p className="text-sm text-gray-500">Rata-rata Psikotes</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{avgTotal}</p>
            <p className="text-sm text-gray-500">Rata-rata Total</p>
          </div>
        </Card>
      </div>

      {/* Top 3 */}
      {hasilList.length >= 3 && (
        <Card title="Peringkat Teratas">
          <div className="grid md:grid-cols-3 gap-4">
            {hasilList.slice(0, 3).map((h, idx) => (
              <div
                key={h.id}
                className={`p-4 rounded-xl text-center ${
                  idx === 0 ? 'bg-yellow-50 border-2 border-yellow-200' :
                  idx === 1 ? 'bg-gray-50 border-2 border-gray-200' :
                  'bg-amber-50 border-2 border-amber-200'
                }`}
              >
                <div className="flex justify-center mb-3">
                  {getRankIcon(idx + 1)}
                </div>
                <p className="font-bold text-gray-900">{h.profil?.namaLengkap}</p>
                <p className="text-sm text-gray-500 font-mono">{h.profil?.noPendaftaran}</p>
                <p className="text-2xl font-bold mt-2 text-gray-900">{h.nilaiTotal}</p>
                <p className="text-xs text-gray-500">Total Nilai</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Search */}
      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Cari nama atau no. pendaftaran..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Peringkat</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">No. Pendaftaran</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Nama</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Akademik</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Psikotes</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Total</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Waktu Selesai</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredHasil.map((h, idx) => (
                <tr key={h.id} className={`border-b hover:bg-gray-50 ${idx < 3 ? 'bg-green-50/50' : ''}`}>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getRankIcon(idx + 1)}
                      <span className="font-bold">{idx + 1}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-sm">{h.profil?.noPendaftaran}</td>
                  <td className="py-3 px-4 font-medium">{h.profil?.namaLengkap}</td>
                  <td className="py-3 px-4">
                    <span className={`font-bold ${h.nilaiAkademik >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                      {h.nilaiAkademik}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-bold ${h.nilaiPsikotes >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                      {h.nilaiPsikotes}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-lg font-bold text-gray-900">{h.nilaiTotal}</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {formatDate(h.waktuSelesai)}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        h.profil?.statusKelulusan === 'lolos' ? 'success' :
                        h.profil?.statusKelulusan === 'cadangan' ? 'warning' :
                        h.profil?.statusKelulusan === 'tidak_lolos' ? 'danger' : 'default'
                      }
                    >
                      {h.profil?.statusKelulusan?.replace('_', ' ') || 'Belum Diproses'}
                    </Badge>
                  </td>
                </tr>
              ))}
              {filteredHasil.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">
                    Belum ada hasil ujian
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
