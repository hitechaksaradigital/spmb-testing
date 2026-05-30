import { useState } from 'react';
import { useStore } from '../../store/useStore';
import Card from '../../components/UI/Card';
import Badge from '../../components/UI/Badge';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Modal from '../../components/UI/Modal';
import Select from '../../components/UI/Select';
import {
  Search,
  UserCheck,
  UserX,
  Clock,
  Save,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { StatusKelulusan } from '../../types';

export default function KelulusanPage() {
  const { getAllPendaftar, ujianHasil, updateStatusKelulusan, bulkUpdateKelulusan } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkStatus, setBulkStatus] = useState<StatusKelulusan>('lolos');

  const allPendaftar = getAllPendaftar().map(p => ({
    ...p,
    hasilUjian: ujianHasil.find(h => h.pendaftarId === p.id)
  }));

  const pendaftarWithExam = allPendaftar.filter(p => p.hasilUjian);

  const filteredPendaftar = pendaftarWithExam.filter(p => {
    const matchSearch = 
      p.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.noPendaftaran.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchSearch;
    return matchSearch && p.statusKelulusan === filterStatus;
  });

  const handleStatusChange = (pendaftarId: string, status: StatusKelulusan) => {
    updateStatusKelulusan(pendaftarId, status);
    toast.success('Status kelulusan diperbarui!');
  };

  const handleBulkUpdate = () => {
    if (selectedIds.length === 0) {
      toast.error('Pilih pendaftar terlebih dahulu!');
      return;
    }

    const updates = selectedIds.map(id => ({
      pendaftarId: id,
      status: bulkStatus
    }));

    bulkUpdateKelulusan(updates);
    toast.success(`${selectedIds.length} pendaftar diperbarui!`);
    setSelectedIds([]);
    setShowBulkModal(false);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredPendaftar.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPendaftar.map(p => p.id));
    }
  };

  const statusOptions = [
    { value: 'belum_diproses', label: 'Belum Diproses' },
    { value: 'lolos', label: 'Lolos' },
    { value: 'cadangan', label: 'Cadangan' },
    { value: 'tidak_lolos', label: 'Tidak Lolos' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Kelulusan</h1>
          <p className="text-gray-600">Kelola status kelulusan peserta PPDB</p>
        </div>
        {selectedIds.length > 0 && (
          <Button
            onClick={() => setShowBulkModal(true)}
            icon={<Save className="h-4 w-4" />}
          >
            Update {selectedIds.length} Terpilih
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">{pendaftarWithExam.length}</p>
            <p className="text-sm text-gray-500">Total Ujian</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">
              {pendaftarWithExam.filter(p => p.statusKelulusan === 'lolos').length}
            </p>
            <p className="text-sm text-gray-500">Lolos</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-600">
              {pendaftarWithExam.filter(p => p.statusKelulusan === 'cadangan').length}
            </p>
            <p className="text-sm text-gray-500">Cadangan</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-red-600">
              {pendaftarWithExam.filter(p => p.statusKelulusan === 'tidak_lolos').length}
            </p>
            <p className="text-sm text-gray-500">Tidak Lolos</p>
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
            <option value="belum_diproses">Belum Diproses</option>
            <option value="lolos">Lolos</option>
            <option value="cadangan">Cadangan</option>
            <option value="tidak_lolos">Tidak Lolos</option>
          </select>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="py-3 px-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredPendaftar.length && filteredPendaftar.length > 0}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">No. Pendaftaran</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Nama</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Nilai Akademik</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Nilai Psikotes</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Total</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredPendaftar
                .sort((a, b) => (b.hasilUjian?.nilaiTotal || 0) - (a.hasilUjian?.nilaiTotal || 0))
                .map((p, index) => (
                <tr key={p.id} className={`border-b hover:bg-gray-50 ${selectedIds.includes(p.id) ? 'bg-blue-50' : ''}`}>
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(p.id)}
                      onChange={() => toggleSelect(p.id)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <span className="font-mono text-sm">{p.noPendaftaran}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium">{p.namaLengkap}</td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-blue-600">{p.hasilUjian?.nilaiAkademik || 0}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-purple-600">{p.hasilUjian?.nilaiPsikotes || 0}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-lg font-bold text-gray-900">{p.hasilUjian?.nilaiTotal || 0}</span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        p.statusKelulusan === 'lolos' ? 'success' :
                        p.statusKelulusan === 'cadangan' ? 'warning' :
                        p.statusKelulusan === 'tidak_lolos' ? 'danger' : 'default'
                      }
                    >
                      {p.statusKelulusan === 'lolos' && <UserCheck className="h-3 w-3 mr-1" />}
                      {p.statusKelulusan === 'tidak_lolos' && <UserX className="h-3 w-3 mr-1" />}
                      {p.statusKelulusan === 'cadangan' && <Clock className="h-3 w-3 mr-1" />}
                      {p.statusKelulusan.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={p.statusKelulusan}
                      onChange={(e) => handleStatusChange(p.id, e.target.value as StatusKelulusan)}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {statusOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {filteredPendaftar.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">
                    {pendaftarWithExam.length === 0 
                      ? 'Belum ada peserta yang mengerjakan ujian' 
                      : 'Tidak ada data yang sesuai filter'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Bulk Update Modal */}
      <Modal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        title="Update Status Massal"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-700">
              Anda akan mengubah status {selectedIds.length} pendaftar sekaligus.
            </p>
          </div>

          <Select
            label="Status Kelulusan"
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value as StatusKelulusan)}
            options={statusOptions}
          />

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowBulkModal(false)}
            >
              Batal
            </Button>
            <Button
              className="flex-1"
              onClick={handleBulkUpdate}
              icon={<Save className="h-4 w-4" />}
            >
              Update
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
