import { useState } from 'react';
import { useStore } from '../../store/useStore';
import Card from '../../components/UI/Card';
import Badge from '../../components/UI/Badge';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Modal from '../../components/UI/Modal';
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  FileText,
  Image
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { PendaftarBerkas } from '../../types';

export default function VerifikasiBerkasPage() {
  const { pendaftarBerkas, pendaftarProfil, users, verifyBerkas } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');
  const [selectedBerkas, setSelectedBerkas] = useState<PendaftarBerkas | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const getBerkasWithDetails = () => {
    return pendaftarBerkas.map(b => {
      const profil = pendaftarProfil.find(p => p.id === b.pendaftarId);
      const user = users.find(u => u.id === profil?.userId);
      return { ...b, profil, user };
    });
  };

  const allBerkas = getBerkasWithDetails();

  const filteredBerkas = allBerkas.filter(b => {
    const matchSearch = 
      b.profil?.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.profil?.noPendaftaran.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchSearch;
    return matchSearch && b.statusVerifikasi === filterStatus;
  });

  const handleVerify = (status: 'valid' | 'ditolak') => {
    if (!selectedBerkas) return;

    verifyBerkas(selectedBerkas.id, status, status === 'ditolak' ? rejectReason : undefined);
    toast.success(status === 'valid' ? 'Berkas divalidasi!' : 'Berkas ditolak!');
    setSelectedBerkas(null);
    setRejectReason('');
  };

  const getBerkasLabel = (jenis: string) => {
    const labels: Record<string, string> = {
      kk: 'Kartu Keluarga',
      akta_kelahiran: 'Akta Kelahiran',
      rapor: 'Rapor',
      foto: 'Pas Foto',
      ijazah: 'Ijazah/SKL'
    };
    return labels[jenis] || jenis;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Verifikasi Berkas</h1>
        <p className="text-gray-600">Verifikasi dokumen pendaftaran siswa</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {pendaftarBerkas.filter(b => b.statusVerifikasi === 'pending').length}
              </p>
              <p className="text-sm text-gray-500">Menunggu Verifikasi</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {pendaftarBerkas.filter(b => b.statusVerifikasi === 'valid').length}
              </p>
              <p className="text-sm text-gray-500">Valid</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
              <XCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {pendaftarBerkas.filter(b => b.statusVerifikasi === 'ditolak').length}
              </p>
              <p className="text-sm text-gray-500">Ditolak</p>
            </div>
          </div>
        </Card>
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
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Menunggu</option>
            <option value="valid">Valid</option>
            <option value="ditolak">Ditolak</option>
          </select>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left py-3 px-4 font-medium text-gray-600">No. Pendaftaran</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Nama</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Jenis Berkas</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">File</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredBerkas.map((b) => (
                <tr key={b.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-sm">{b.profil?.noPendaftaran || '-'}</td>
                  <td className="py-3 px-4">{b.profil?.namaLengkap || '-'}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {b.jenisBerkas === 'foto' ? (
                        <Image className="h-4 w-4 text-gray-400" />
                      ) : (
                        <FileText className="h-4 w-4 text-gray-400" />
                      )}
                      {getBerkasLabel(b.jenisBerkas)}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{b.namaFile}</td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        b.statusVerifikasi === 'valid' ? 'success' :
                        b.statusVerifikasi === 'pending' ? 'warning' : 'danger'
                      }
                      size="sm"
                    >
                      {b.statusVerifikasi === 'valid' ? 'Valid' :
                       b.statusVerifikasi === 'pending' ? 'Menunggu' : 'Ditolak'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Eye className="h-4 w-4" />}
                      onClick={() => setSelectedBerkas(b)}
                    >
                      Detail
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredBerkas.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    Tidak ada berkas untuk diverifikasi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedBerkas}
        onClose={() => {
          setSelectedBerkas(null);
          setRejectReason('');
        }}
        title="Detail Berkas"
        size="md"
      >
        {selectedBerkas && (() => {
          const profil = pendaftarProfil.find(p => p.id === selectedBerkas.pendaftarId);
          
          return (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">No. Pendaftaran</span>
                  <span className="font-mono font-medium">{profil?.noPendaftaran}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Nama</span>
                  <span className="font-medium">{profil?.namaLengkap}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Jenis Berkas</span>
                  <Badge variant="info">{getBerkasLabel(selectedBerkas.jenisBerkas)}</Badge>
                </div>
              </div>

              {/* Preview */}
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-2">Preview Berkas</p>
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  {selectedBerkas.jenisBerkas === 'foto' ? (
                    <Image className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  ) : (
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  )}
                  <p className="text-sm text-gray-600">{selectedBerkas.namaFile}</p>
                  <p className="text-xs text-gray-400 mt-1">(Simulasi - Preview file)</p>
                </div>
              </div>

              {/* Actions */}
              {selectedBerkas.statusVerifikasi === 'pending' && (
                <div className="space-y-4 pt-4 border-t">
                  <Input
                    label="Alasan Penolakan (jika ditolak)"
                    placeholder="Masukkan alasan..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                  <div className="flex gap-3">
                    <Button
                      variant="danger"
                      className="flex-1"
                      icon={<XCircle className="h-4 w-4" />}
                      onClick={() => handleVerify('ditolak')}
                    >
                      Tolak
                    </Button>
                    <Button
                      variant="success"
                      className="flex-1"
                      icon={<CheckCircle className="h-4 w-4" />}
                      onClick={() => handleVerify('valid')}
                    >
                      Validasi
                    </Button>
                  </div>
                </div>
              )}

              {selectedBerkas.statusVerifikasi !== 'pending' && (
                <div className={`p-4 rounded-lg ${
                  selectedBerkas.statusVerifikasi === 'valid' ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <div className="flex items-center gap-2">
                    {selectedBerkas.statusVerifikasi === 'valid' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span className={`font-medium ${
                      selectedBerkas.statusVerifikasi === 'valid' ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {selectedBerkas.statusVerifikasi === 'valid' ? 'Berkas Valid' : 'Berkas Ditolak'}
                    </span>
                  </div>
                  {selectedBerkas.catatan && (
                    <p className="text-sm text-gray-600 mt-2">
                      Catatan: {selectedBerkas.catatan}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
