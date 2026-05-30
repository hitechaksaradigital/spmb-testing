import { useState } from 'react';
import { useStore } from '../../store/useStore';
import Card from '../../components/UI/Card';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import {
  Save,
  Calendar,
  DollarSign,
  Users,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function PengaturanPage() {
  const { konfigurasi } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    tahunAjaran: konfigurasi.tahunAjaran,
    biayaFormulir: konfigurasi.biayaFormulir,
    biayaUangPangkal: konfigurasi.biayaUangPangkal,
    kuotaSiswa: konfigurasi.kuotaSiswa,
    tanggalBukaPendaftaran: konfigurasi.tanggalBukaPendaftaran,
    tanggalTutupPendaftaran: konfigurasi.tanggalTutupPendaftaran,
    tanggalUjian: konfigurasi.tanggalUjian,
    tanggalPengumuman: konfigurasi.tanggalPengumuman,
    batasWaktuDaftarUlang: konfigurasi.batasWaktuDaftarUlang
  });

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Pengaturan berhasil disimpan!');
    setIsLoading(false);
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan PPDB</h1>
        <p className="text-gray-600">Konfigurasi sistem pendaftaran peserta didik baru</p>
      </div>

      {/* Info Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-800">Perhatian</p>
            <p className="text-sm text-yellow-700 mt-1">
              Perubahan pengaturan dapat mempengaruhi proses pendaftaran yang sedang berjalan. 
              Pastikan untuk memeriksa kembali sebelum menyimpan perubahan.
            </p>
          </div>
        </div>
      </div>

      {/* Informasi Umum */}
      <Card title="Informasi Umum">
        <div className="grid md:grid-cols-2 gap-6">
          <Input
            label="Tahun Ajaran"
            value={formData.tahunAjaran}
            onChange={(e) => handleChange('tahunAjaran', e.target.value)}
            placeholder="Contoh: 2025/2026"
          />
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Kuota Siswa</label>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-gray-400" />
                <Input
                  type="number"
                  value={formData.kuotaSiswa}
                  onChange={(e) => handleChange('kuotaSiswa', parseInt(e.target.value))}
                  min={1}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Biaya */}
      <Card title="Biaya Pendaftaran">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Biaya Formulir</label>
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-gray-400" />
              <Input
                type="number"
                value={formData.biayaFormulir}
                onChange={(e) => handleChange('biayaFormulir', parseInt(e.target.value))}
                min={0}
                step={10000}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Saat ini: {formatCurrency(formData.biayaFormulir)}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Uang Pangkal</label>
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-gray-400" />
              <Input
                type="number"
                value={formData.biayaUangPangkal}
                onChange={(e) => handleChange('biayaUangPangkal', parseInt(e.target.value))}
                min={0}
                step={100000}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Saat ini: {formatCurrency(formData.biayaUangPangkal)}
            </p>
          </div>
        </div>
      </Card>

      {/* Jadwal */}
      <Card title="Jadwal Penting">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="h-4 w-4 inline mr-1" />
              Tanggal Buka Pendaftaran
            </label>
            <Input
              type="date"
              value={formData.tanggalBukaPendaftaran}
              onChange={(e) => handleChange('tanggalBukaPendaftaran', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="h-4 w-4 inline mr-1" />
              Tanggal Tutup Pendaftaran
            </label>
            <Input
              type="date"
              value={formData.tanggalTutupPendaftaran}
              onChange={(e) => handleChange('tanggalTutupPendaftaran', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="h-4 w-4 inline mr-1" />
              Tanggal Ujian Seleksi
            </label>
            <Input
              type="date"
              value={formData.tanggalUjian}
              onChange={(e) => handleChange('tanggalUjian', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="h-4 w-4 inline mr-1" />
              Tanggal Pengumuman
            </label>
            <Input
              type="date"
              value={formData.tanggalPengumuman}
              onChange={(e) => handleChange('tanggalPengumuman', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="h-4 w-4 inline mr-1" />
              Batas Waktu Daftar Ulang
            </label>
            <Input
              type="date"
              value={formData.batasWaktuDaftarUlang}
              onChange={(e) => handleChange('batasWaktuDaftarUlang', e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">
          Reset
        </Button>
        <Button
          onClick={handleSave}
          isLoading={isLoading}
          icon={<Save className="h-4 w-4" />}
        >
          Simpan Pengaturan
        </Button>
      </div>
    </div>
  );
}
