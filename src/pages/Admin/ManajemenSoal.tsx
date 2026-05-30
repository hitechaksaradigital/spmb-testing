import { useState } from 'react';
import { useStore } from '../../store/useStore';
import Card from '../../components/UI/Card';
import Badge from '../../components/UI/Badge';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Select from '../../components/UI/Select';
import Modal from '../../components/UI/Modal';
import {
  Plus,
  Edit,
  Trash2,
  BookOpen,
  Brain,
  Save
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { UjianSoal } from '../../types';

export default function ManajemenSoalPage() {
  const { ujianSoal, addSoal, updateSoal, deleteSoal, currentUser } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSoal, setEditingSoal] = useState<UjianSoal | null>(null);
  const [filterKategori, setFilterKategori] = useState('all');

  const [formData, setFormData] = useState({
    nomorSoal: 1,
    kategori: 'akademik' as 'akademik' | 'psikotes',
    pertanyaan: '',
    opsiA: '',
    opsiB: '',
    opsiC: '',
    opsiD: '',
    jawabanBenar: 'A' as 'A' | 'B' | 'C' | 'D'
  });

  const filteredSoal = ujianSoal.filter(s => 
    filterKategori === 'all' || s.kategori === filterKategori
  ).sort((a, b) => a.nomorSoal - b.nomorSoal);

  const akademikCount = ujianSoal.filter(s => s.kategori === 'akademik').length;
  const psikotesCount = ujianSoal.filter(s => s.kategori === 'psikotes').length;

  const resetForm = () => {
    setFormData({
      nomorSoal: ujianSoal.length + 1,
      kategori: 'akademik',
      pertanyaan: '',
      opsiA: '',
      opsiB: '',
      opsiC: '',
      opsiD: '',
      jawabanBenar: 'A'
    });
  };

  const openAddModal = () => {
    resetForm();
    setEditingSoal(null);
    setIsModalOpen(true);
  };

  const openEditModal = (soal: UjianSoal) => {
    setFormData({
      nomorSoal: soal.nomorSoal,
      kategori: soal.kategori,
      pertanyaan: soal.pertanyaan,
      opsiA: soal.opsiA,
      opsiB: soal.opsiB,
      opsiC: soal.opsiC,
      opsiD: soal.opsiD,
      jawabanBenar: soal.jawabanBenar
    });
    setEditingSoal(soal);
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.pertanyaan || !formData.opsiA || !formData.opsiB || !formData.opsiC || !formData.opsiD) {
      toast.error('Lengkapi semua field!');
      return;
    }

    if (editingSoal) {
      updateSoal(editingSoal.id, formData);
      toast.success('Soal berhasil diupdate!');
    } else {
      addSoal({
        ...formData,
        createdBy: currentUser?.id || ''
      });
      toast.success('Soal berhasil ditambahkan!');
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Yakin ingin menghapus soal ini?')) {
      deleteSoal(id);
      toast.success('Soal berhasil dihapus!');
    }
  };

  const kategoriOptions = [
    { value: 'akademik', label: 'Akademik' },
    { value: 'psikotes', label: 'Psikotes' }
  ];

  const jawabanOptions = [
    { value: 'A', label: 'A' },
    { value: 'B', label: 'B' },
    { value: 'C', label: 'C' },
    { value: 'D', label: 'D' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Soal Ujian</h1>
          <p className="text-gray-600">Kelola bank soal ujian seleksi</p>
        </div>
        <Button onClick={openAddModal} icon={<Plus className="h-4 w-4" />}>
          Tambah Soal
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{ujianSoal.length}</p>
              <p className="text-sm text-gray-500">Total Soal</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{akademikCount}</p>
              <p className="text-sm text-gray-500">Soal Akademik</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{psikotesCount}</p>
              <p className="text-sm text-gray-500">Soal Psikotes</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Filter Kategori:</span>
          <div className="flex gap-2">
            {['all', 'akademik', 'psikotes'].map(kat => (
              <button
                key={kat}
                onClick={() => setFilterKategori(kat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filterKategori === kat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {kat === 'all' ? 'Semua' : kat.charAt(0).toUpperCase() + kat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Soal List */}
      <div className="space-y-4">
        {filteredSoal.map((soal) => (
          <Card key={soal.id}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {soal.nomorSoal}
                  </span>
                  <Badge variant={soal.kategori === 'akademik' ? 'info' : 'default'}>
                    {soal.kategori}
                  </Badge>
                </div>
                
                <p className="text-gray-900 font-medium mb-4">{soal.pertanyaan}</p>
                
                <div className="grid sm:grid-cols-2 gap-2">
                  {(['A', 'B', 'C', 'D'] as const).map(opt => {
                    const optKey = `opsi${opt}` as 'opsiA' | 'opsiB' | 'opsiC' | 'opsiD';
                    const isCorrect = soal.jawabanBenar === opt;
                    
                    return (
                      <div
                        key={opt}
                        className={`p-3 rounded-lg text-sm ${
                          isCorrect 
                            ? 'bg-green-50 border border-green-200 text-green-700' 
                            : 'bg-gray-50 text-gray-600'
                        }`}
                      >
                        <span className="font-medium mr-2">{opt}.</span>
                        {soal[optKey]}
                        {isCorrect && (
                          <span className="ml-2 text-green-600 text-xs">(Jawaban Benar)</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Edit className="h-4 w-4" />}
                  onClick={() => openEditModal(soal)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  icon={<Trash2 className="h-4 w-4" />}
                  onClick={() => handleDelete(soal.id)}
                >
                  Hapus
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {filteredSoal.length === 0 && (
          <Card>
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>Belum ada soal</p>
            </div>
          </Card>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSoal ? 'Edit Soal' : 'Tambah Soal Baru'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nomor Soal"
              type="number"
              value={formData.nomorSoal}
              onChange={(e) => setFormData({ ...formData, nomorSoal: parseInt(e.target.value) })}
              min={1}
            />
            <Select
              label="Kategori"
              value={formData.kategori}
              onChange={(e) => setFormData({ ...formData, kategori: e.target.value as 'akademik' | 'psikotes' })}
              options={kategoriOptions}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pertanyaan <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.pertanyaan}
              onChange={(e) => setFormData({ ...formData, pertanyaan: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Masukkan pertanyaan..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Opsi A"
              value={formData.opsiA}
              onChange={(e) => setFormData({ ...formData, opsiA: e.target.value })}
              required
            />
            <Input
              label="Opsi B"
              value={formData.opsiB}
              onChange={(e) => setFormData({ ...formData, opsiB: e.target.value })}
              required
            />
            <Input
              label="Opsi C"
              value={formData.opsiC}
              onChange={(e) => setFormData({ ...formData, opsiC: e.target.value })}
              required
            />
            <Input
              label="Opsi D"
              value={formData.opsiD}
              onChange={(e) => setFormData({ ...formData, opsiD: e.target.value })}
              required
            />
          </div>

          <Select
            label="Jawaban Benar"
            value={formData.jawabanBenar}
            onChange={(e) => setFormData({ ...formData, jawabanBenar: e.target.value as 'A' | 'B' | 'C' | 'D' })}
            options={jawabanOptions}
          />

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmit}
              icon={<Save className="h-4 w-4" />}
            >
              {editingSoal ? 'Update' : 'Simpan'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
