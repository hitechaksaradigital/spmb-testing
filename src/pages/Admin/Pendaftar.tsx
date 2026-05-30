import { useState } from 'react';
import { useStore } from '../../store/useStore';
import Card from '../../components/UI/Card';
import Badge from '../../components/UI/Badge';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Modal from '../../components/UI/Modal';
import {
  Search,
  Filter,
  Eye,
  Download,
  User,
  Phone,
  Mail,
  Calendar,
  MapPin
} from 'lucide-react';
import type { PendaftarProfil, User as UserType, Pembayaran } from '../../types';

export default function PendaftarPage() {
  const { getAllPendaftar } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPendaftar, setSelectedPendaftar] = useState<(PendaftarProfil & { user?: UserType; pembayaran?: Pembayaran[] }) | null>(null);

  const allPendaftar = getAllPendaftar();

  const filteredPendaftar = allPendaftar.filter(p => {
    const matchSearch = 
      p.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.noPendaftaran.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchSearch;
    if (filterStatus === 'lunas') {
      return matchSearch && p.pembayaran?.some(pay => pay.jenisPembayaran === 'formulir' && pay.status === 'success');
    }
    if (filterStatus === 'pending') {
      return matchSearch && p.pembayaran?.some(pay => pay.jenisPembayaran === 'formulir' && pay.status === 'pending');
    }
    if (filterStatus === 'belum') {
      return matchSearch && !p.pembayaran?.some(pay => pay.jenisPembayaran === 'formulir');
    }
    return matchSearch;
  });

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getPaymentStatus = (pembayaran?: Pembayaran[]) => {
    const formulir = pembayaran?.find(p => p.jenisPembayaran === 'formulir');
    if (!formulir) return { label: 'Belum Bayar', variant: 'default' as const };
    if (formulir.status === 'success') return { label: 'Lunas', variant: 'success' as const };
    if (formulir.status === 'pending') return { label: 'Pending', variant: 'warning' as const };
    return { label: 'Gagal', variant: 'danger' as const };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Pendaftar</h1>
          <p className="text-gray-600">Total: {allPendaftar.length} pendaftar</p>
        </div>
        <Button variant="outline" icon={<Download className="h-4 w-4" />}>
          Export Excel
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Cari nama atau no. pendaftaran..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua Status</option>
              <option value="lunas">Lunas</option>
              <option value="pending">Pending</option>
              <option value="belum">Belum Bayar</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left py-3 px-4 font-medium text-gray-600">No. Pendaftaran</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Nama Lengkap</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Sekolah Asal</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Pembayaran</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status Form</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Kelulusan</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredPendaftar.map((p) => {
                const paymentStatus = getPaymentStatus(p.pembayaran);
                
                return (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm">{p.noPendaftaran}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{p.namaLengkap}</p>
                        <p className="text-xs text-gray-500">{p.user?.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{p.sekolahAsal || '-'}</td>
                    <td className="py-3 px-4">
                      <Badge variant={paymentStatus.variant} size="sm">
                        {paymentStatus.label}
                      </Badge>
                    </td>
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
                    <td className="py-3 px-4">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Eye className="h-4 w-4" />}
                        onClick={() => setSelectedPendaftar(p)}
                      >
                        Detail
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {filteredPendaftar.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    Tidak ada data pendaftar
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedPendaftar}
        onClose={() => setSelectedPendaftar(null)}
        title="Detail Pendaftar"
        size="lg"
      >
        {selectedPendaftar && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selectedPendaftar.namaLengkap}</h3>
                <p className="text-sm text-gray-600 font-mono">{selectedPendaftar.noPendaftaran}</p>
              </div>
            </div>

            {/* Data Pribadi */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Data Pribadi</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 w-24">NIK</span>
                  <span className="font-mono">{selectedPendaftar.nik || '-'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 w-24">Jenis Kelamin</span>
                  <span>{selectedPendaftar.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{selectedPendaftar.tempatLahir}, {formatDate(selectedPendaftar.tanggalLahir)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 w-24">Agama</span>
                  <span>{selectedPendaftar.agama || '-'}</span>
                </div>
                <div className="flex items-center gap-2 md:col-span-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{selectedPendaftar.alamat || '-'}</span>
                </div>
              </div>
            </div>

            {/* Kontak */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Kontak</h4>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{selectedPendaftar.user?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{selectedPendaftar.user?.phone}</span>
                </div>
              </div>
            </div>

            {/* Data Orang Tua */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Data Orang Tua</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Nama Ayah</p>
                  <p className="font-medium">{selectedPendaftar.namaAyah || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Nama Ibu</p>
                  <p className="font-medium">{selectedPendaftar.namaIbu || '-'}</p>
                </div>
              </div>
            </div>

            {/* Data Sekolah */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Data Sekolah Asal</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Nama Sekolah</p>
                  <p className="font-medium">{selectedPendaftar.sekolahAsal || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-500">NPSN</p>
                  <p className="font-medium font-mono">{selectedPendaftar.npsn || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Tahun Lulus</p>
                  <p className="font-medium">{selectedPendaftar.tahunLulus || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Nilai Rata-rata</p>
                  <p className="font-medium">{selectedPendaftar.nilaiRataRata || '-'}</p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="flex flex-wrap gap-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Nilai Ujian:</span>
                <Badge variant="info">{selectedPendaftar.nilaiUjian ?? 'Belum Ujian'}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Status:</span>
                <Badge
                  variant={
                    selectedPendaftar.statusKelulusan === 'lolos' ? 'success' :
                    selectedPendaftar.statusKelulusan === 'cadangan' ? 'warning' :
                    selectedPendaftar.statusKelulusan === 'tidak_lolos' ? 'danger' : 'default'
                  }
                >
                  {selectedPendaftar.statusKelulusan.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
