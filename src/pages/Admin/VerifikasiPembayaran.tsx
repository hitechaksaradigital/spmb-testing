import { useState } from 'react';
import { useStore } from '../../store/useStore';
import Card from '../../components/UI/Card';
import Badge from '../../components/UI/Badge';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import Input from '../../components/UI/Input';
import {
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  CreditCard,
  Search
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function VerifikasiPembayaranPage() {
  const { pembayaran, users, pendaftarProfil, verifyPembayaran, currentUser } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');
  const [selectedPembayaran, setSelectedPembayaran] = useState<typeof pembayaran[0] | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const filteredPembayaran = pembayaran.filter(p => {
    const user = users.find(u => u.id === p.userId);
    const profil = pendaftarProfil.find(pr => pr.userId === p.userId);
    
    const matchSearch = 
      user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profil?.noPendaftaran.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchSearch;
    return matchSearch && p.status === filterStatus;
  });

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
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleVerify = (status: 'success' | 'failed') => {
    if (!selectedPembayaran || !currentUser) return;

    verifyPembayaran(selectedPembayaran.id, status, currentUser.id);
    toast.success(status === 'success' ? 'Pembayaran diverifikasi!' : 'Pembayaran ditolak!');
    setSelectedPembayaran(null);
    setRejectReason('');
  };

  const getPembayaranDetails = (p: typeof pembayaran[0]) => {
    const user = users.find(u => u.id === p.userId);
    const profil = pendaftarProfil.find(pr => pr.userId === p.userId);
    return { user, profil };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Verifikasi Pembayaran</h1>
        <p className="text-gray-600">Verifikasi bukti pembayaran dari pendaftar</p>
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
                {pembayaran.filter(p => p.status === 'pending').length}
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
                {pembayaran.filter(p => p.status === 'success').length}
              </p>
              <p className="text-sm text-gray-500">Terverifikasi</p>
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
                {pembayaran.filter(p => p.status === 'failed').length}
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
            <option value="success">Terverifikasi</option>
            <option value="failed">Ditolak</option>
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
                <th className="text-left py-3 px-4 font-medium text-gray-600">Jenis</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Jumlah</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Tanggal</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredPembayaran.map((p) => {
                const { user, profil } = getPembayaranDetails(p);
                
                return (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm">{profil?.noPendaftaran || '-'}</td>
                    <td className="py-3 px-4">{user?.name || '-'}</td>
                    <td className="py-3 px-4">
                      <Badge variant="info" size="sm">
                        {p.jenisPembayaran === 'formulir' ? 'Formulir' : 'Uang Pangkal'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-medium">{formatCurrency(p.jumlah)}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{formatDate(p.createdAt)}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          p.status === 'success' ? 'success' :
                          p.status === 'pending' ? 'warning' : 'danger'
                        }
                        size="sm"
                      >
                        {p.status === 'success' ? 'Terverifikasi' :
                         p.status === 'pending' ? 'Menunggu' : 'Ditolak'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Eye className="h-4 w-4" />}
                        onClick={() => setSelectedPembayaran(p)}
                      >
                        Detail
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {filteredPembayaran.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    Tidak ada data pembayaran
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedPembayaran}
        onClose={() => {
          setSelectedPembayaran(null);
          setRejectReason('');
        }}
        title="Detail Pembayaran"
        size="md"
      >
        {selectedPembayaran && (() => {
          const { user, profil } = getPembayaranDetails(selectedPembayaran);
          
          return (
            <div className="space-y-6">
              {/* Info */}
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">No. Pendaftaran</span>
                  <span className="font-mono font-medium">{profil?.noPendaftaran}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Nama</span>
                  <span className="font-medium">{user?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Jenis Pembayaran</span>
                  <Badge variant="info">
                    {selectedPembayaran.jenisPembayaran === 'formulir' ? 'Biaya Formulir' : 'Uang Pangkal'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Jumlah</span>
                  <span className="text-xl font-bold text-gray-900">{formatCurrency(selectedPembayaran.jumlah)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tanggal Upload</span>
                  <span>{formatDate(selectedPembayaran.createdAt)}</span>
                </div>
              </div>

              {/* Bukti Transfer */}
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-2">Bukti Transfer</p>
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">{selectedPembayaran.buktiTransfer}</p>
                  <p className="text-xs text-gray-400 mt-1">(Simulasi - File bukti transfer)</p>
                </div>
              </div>

              {/* Actions */}
              {selectedPembayaran.status === 'pending' && (
                <div className="space-y-4 pt-4 border-t">
                  <Input
                    label="Alasan Penolakan (opsional)"
                    placeholder="Masukkan alasan jika menolak..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                  <div className="flex gap-3">
                    <Button
                      variant="danger"
                      className="flex-1"
                      icon={<XCircle className="h-4 w-4" />}
                      onClick={() => handleVerify('failed')}
                    >
                      Tolak
                    </Button>
                    <Button
                      variant="success"
                      className="flex-1"
                      icon={<CheckCircle className="h-4 w-4" />}
                      onClick={() => handleVerify('success')}
                    >
                      Verifikasi
                    </Button>
                  </div>
                </div>
              )}

              {selectedPembayaran.status !== 'pending' && (
                <div className={`p-4 rounded-lg ${
                  selectedPembayaran.status === 'success' ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <div className="flex items-center gap-2">
                    {selectedPembayaran.status === 'success' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span className={`font-medium ${
                      selectedPembayaran.status === 'success' ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {selectedPembayaran.status === 'success' ? 'Sudah Diverifikasi' : 'Ditolak'}
                    </span>
                  </div>
                  {selectedPembayaran.verifiedAt && (
                    <p className="text-sm text-gray-600 mt-1">
                      {formatDate(selectedPembayaran.verifiedAt)}
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
