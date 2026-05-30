import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import Card from '../../components/UI/Card';
import Input from '../../components/UI/Input';
import Select from '../../components/UI/Select';
import Button from '../../components/UI/Button';
import { Save, Lock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FormulirPage() {
  const { currentUser, getPendaftarByUserId, updatePendaftarProfil, hasValidFormulirPayment } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pribadi');

  const profil = currentUser ? getPendaftarByUserId(currentUser.id) : null;
  const sudahBayar = currentUser ? hasValidFormulirPayment(currentUser.id) : false;

  const [formData, setFormData] = useState({
    nik: '',
    namaLengkap: '',
    tempatLahir: '',
    tanggalLahir: '',
    jenisKelamin: 'L' as 'L' | 'P',
    agama: '',
    alamat: '',
    provinsi: '',
    kota: '',
    kodePos: '',
    namaAyah: '',
    pekerjaanAyah: '',
    teleponAyah: '',
    namaIbu: '',
    pekerjaanIbu: '',
    teleponIbu: '',
    namaWali: '',
    pekerjaanWali: '',
    teleponWali: '',
    sekolahAsal: '',
    alamatSekolahAsal: '',
    npsn: '',
    tahunLulus: '',
    nilaiRataRata: 0
  });

  useEffect(() => {
    if (profil) {
      setFormData({
        nik: profil.nik || '',
        namaLengkap: profil.namaLengkap || '',
        tempatLahir: profil.tempatLahir || '',
        tanggalLahir: profil.tanggalLahir || '',
        jenisKelamin: profil.jenisKelamin || 'L',
        agama: profil.agama || '',
        alamat: profil.alamat || '',
        provinsi: profil.provinsi || '',
        kota: profil.kota || '',
        kodePos: profil.kodePos || '',
        namaAyah: profil.namaAyah || '',
        pekerjaanAyah: profil.pekerjaanAyah || '',
        teleponAyah: profil.teleponAyah || '',
        namaIbu: profil.namaIbu || '',
        pekerjaanIbu: profil.pekerjaanIbu || '',
        teleponIbu: profil.teleponIbu || '',
        namaWali: profil.namaWali || '',
        pekerjaanWali: profil.pekerjaanWali || '',
        teleponWali: profil.teleponWali || '',
        sekolahAsal: profil.sekolahAsal || '',
        alamatSekolahAsal: profil.alamatSekolahAsal || '',
        npsn: profil.npsn || '',
        tahunLulus: profil.tahunLulus || '',
        nilaiRataRata: profil.nilaiRataRata || 0
      });
    }
  }, [profil]);

  // Redirect if not paid
  if (!sudahBayar) {
    return <Navigate to="/siswa/pembayaran" replace />;
  }

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (markComplete = false) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const updateData = {
      ...formData,
      statusForm: markComplete ? 'lengkap' as const : 'draft' as const
    };

    updatePendaftarProfil(updateData);
    toast.success(markComplete ? 'Formulir berhasil disimpan dan dilengkapi!' : 'Draft tersimpan!');
    setIsLoading(false);
  };

  const tabs = [
    { id: 'pribadi', label: 'Data Pribadi' },
    { id: 'orangtua', label: 'Data Orang Tua' },
    { id: 'sekolah', label: 'Data Sekolah Asal' }
  ];

  const jenisKelaminOptions = [
    { value: 'L', label: 'Laki-laki' },
    { value: 'P', label: 'Perempuan' }
  ];

  const agamaOptions = [
    { value: 'Islam', label: 'Islam' },
    { value: 'Kristen', label: 'Kristen' },
    { value: 'Katolik', label: 'Katolik' },
    { value: 'Hindu', label: 'Hindu' },
    { value: 'Buddha', label: 'Buddha' },
    { value: 'Konghucu', label: 'Konghucu' }
  ];

  const isFormComplete = () => {
    const requiredFields = [
      formData.nik, formData.namaLengkap, formData.tempatLahir, formData.tanggalLahir,
      formData.agama, formData.alamat, formData.provinsi, formData.kota,
      formData.namaAyah, formData.namaIbu, formData.sekolahAsal, formData.tahunLulus
    ];
    return requiredFields.every(field => field && field.toString().trim() !== '');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Formulir Pendaftaran</h1>
          <p className="text-gray-600">Lengkapi data diri untuk melanjutkan pendaftaran</p>
        </div>
        {profil?.statusForm === 'lengkap' && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Formulir Lengkap</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4 -mb-px">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <Card>
        {activeTab === 'pribadi' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Pribadi Calon Siswa</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="NIK"
                value={formData.nik}
                onChange={(e) => handleChange('nik', e.target.value)}
                placeholder="16 digit NIK"
                maxLength={16}
                required
              />
              <Input
                label="Nama Lengkap"
                value={formData.namaLengkap}
                onChange={(e) => handleChange('namaLengkap', e.target.value)}
                placeholder="Sesuai akta kelahiran"
                required
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <Input
                label="Tempat Lahir"
                value={formData.tempatLahir}
                onChange={(e) => handleChange('tempatLahir', e.target.value)}
                placeholder="Kota kelahiran"
                required
              />
              <Input
                label="Tanggal Lahir"
                type="date"
                value={formData.tanggalLahir}
                onChange={(e) => handleChange('tanggalLahir', e.target.value)}
                required
              />
              <Select
                label="Jenis Kelamin"
                value={formData.jenisKelamin}
                onChange={(e) => handleChange('jenisKelamin', e.target.value)}
                options={jenisKelaminOptions}
                required
              />
            </div>

            <Select
              label="Agama"
              value={formData.agama}
              onChange={(e) => handleChange('agama', e.target.value)}
              options={agamaOptions}
              placeholder="Pilih agama"
              required
            />

            <Input
              label="Alamat Lengkap"
              value={formData.alamat}
              onChange={(e) => handleChange('alamat', e.target.value)}
              placeholder="Jalan, RT/RW, Kelurahan, Kecamatan"
              required
            />

            <div className="grid md:grid-cols-3 gap-4">
              <Input
                label="Provinsi"
                value={formData.provinsi}
                onChange={(e) => handleChange('provinsi', e.target.value)}
                placeholder="Provinsi"
                required
              />
              <Input
                label="Kota/Kabupaten"
                value={formData.kota}
                onChange={(e) => handleChange('kota', e.target.value)}
                placeholder="Kota/Kabupaten"
                required
              />
              <Input
                label="Kode Pos"
                value={formData.kodePos}
                onChange={(e) => handleChange('kodePos', e.target.value)}
                placeholder="Kode Pos"
                maxLength={5}
              />
            </div>
          </div>
        )}

        {activeTab === 'orangtua' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Ayah</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <Input
                  label="Nama Ayah"
                  value={formData.namaAyah}
                  onChange={(e) => handleChange('namaAyah', e.target.value)}
                  placeholder="Nama lengkap ayah"
                  required
                />
                <Input
                  label="Pekerjaan Ayah"
                  value={formData.pekerjaanAyah}
                  onChange={(e) => handleChange('pekerjaanAyah', e.target.value)}
                  placeholder="Pekerjaan"
                />
                <Input
                  label="No. Telepon Ayah"
                  value={formData.teleponAyah}
                  onChange={(e) => handleChange('teleponAyah', e.target.value)}
                  placeholder="08xxxxxxxxxx"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Ibu</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <Input
                  label="Nama Ibu"
                  value={formData.namaIbu}
                  onChange={(e) => handleChange('namaIbu', e.target.value)}
                  placeholder="Nama lengkap ibu"
                  required
                />
                <Input
                  label="Pekerjaan Ibu"
                  value={formData.pekerjaanIbu}
                  onChange={(e) => handleChange('pekerjaanIbu', e.target.value)}
                  placeholder="Pekerjaan"
                />
                <Input
                  label="No. Telepon Ibu"
                  value={formData.teleponIbu}
                  onChange={(e) => handleChange('teleponIbu', e.target.value)}
                  placeholder="08xxxxxxxxxx"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Wali (Opsional)</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <Input
                  label="Nama Wali"
                  value={formData.namaWali || ''}
                  onChange={(e) => handleChange('namaWali', e.target.value)}
                  placeholder="Nama lengkap wali"
                />
                <Input
                  label="Pekerjaan Wali"
                  value={formData.pekerjaanWali || ''}
                  onChange={(e) => handleChange('pekerjaanWali', e.target.value)}
                  placeholder="Pekerjaan"
                />
                <Input
                  label="No. Telepon Wali"
                  value={formData.teleponWali || ''}
                  onChange={(e) => handleChange('teleponWali', e.target.value)}
                  placeholder="08xxxxxxxxxx"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sekolah' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Sekolah Asal</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Nama Sekolah Asal"
                value={formData.sekolahAsal}
                onChange={(e) => handleChange('sekolahAsal', e.target.value)}
                placeholder="Nama sekolah"
                required
              />
              <Input
                label="NPSN Sekolah"
                value={formData.npsn}
                onChange={(e) => handleChange('npsn', e.target.value)}
                placeholder="8 digit NPSN"
                maxLength={8}
              />
            </div>

            <Input
              label="Alamat Sekolah"
              value={formData.alamatSekolahAsal}
              onChange={(e) => handleChange('alamatSekolahAsal', e.target.value)}
              placeholder="Alamat lengkap sekolah"
            />

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Tahun Lulus"
                value={formData.tahunLulus}
                onChange={(e) => handleChange('tahunLulus', e.target.value)}
                placeholder="Contoh: 2025"
                maxLength={4}
                required
              />
              <Input
                label="Nilai Rata-rata Rapor"
                type="number"
                value={formData.nilaiRataRata || ''}
                onChange={(e) => handleChange('nilaiRataRata', parseFloat(e.target.value) || 0)}
                placeholder="Contoh: 85.5"
                min={0}
                max={100}
                step={0.1}
              />
            </div>
          </div>
        )}
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <Button
          variant="outline"
          onClick={() => handleSave(false)}
          isLoading={isLoading}
          icon={<Save className="h-4 w-4" />}
        >
          Simpan Draft
        </Button>
        <Button
          onClick={() => handleSave(true)}
          isLoading={isLoading}
          disabled={!isFormComplete()}
          icon={isFormComplete() ? <CheckCircle className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
        >
          {isFormComplete() ? 'Simpan & Selesaikan' : 'Lengkapi Data Terlebih Dahulu'}
        </Button>
      </div>
    </div>
  );
}
