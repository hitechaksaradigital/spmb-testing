import { useState } from 'react';
import { useStore } from '../../store/useStore';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Modal from '../../components/UI/Modal';
import Input from '../../components/UI/Input';
import {
  Award,
  Clock,
  XCircle,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function PengumumanPage() {
  const { currentUser, getPendaftarByUserId, getUjianHasilByUserId, konfigurasi, createPembayaran, getPembayaranByUserId } = useStore();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [buktiTransfer, setBuktiTransfer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const profil = currentUser ? getPendaftarByUserId(currentUser.id) : null;
  const hasilUjian = currentUser ? getUjianHasilByUserId(currentUser.id) : null;
  const pembayaranList = currentUser ? getPembayaranByUserId(currentUser.id) : [];
  const pembayaranUangPangkal = pembayaranList.find(p => p.jenisPembayaran === 'uang_pangkal');

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
      month: 'long',
      year: 'numeric'
    });
  };

  const handleUploadBukti = async () => {
    if (!buktiTransfer.trim() || !currentUser) {
      toast.error('Masukkan nama file bukti transfer!');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    createPembayaran(currentUser.id, 'uang_pangkal', buktiTransfer);
    toast.success('Bukti pembayaran daftar ulang berhasil diupload!');
    setShowUploadModal(false);
    setBuktiTransfer('');
    setIsLoading(false);
  };

  // Not yet announced
  if (!hasilUjian) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pengumuman Hasil Seleksi</h1>
          <p className="text-gray-600">Pantau status kelulusan Anda</p>
        </div>

        <Card>
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-10 w-10" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Belum Mengikuti Ujian</h2>
            <p className="text-gray-600">
              Silakan selesaikan ujian seleksi terlebih dahulu untuk melihat hasil.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // Waiting for result
  if (profil?.statusKelulusan === 'belum_diproses') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pengumuman Hasil Seleksi</h1>
          <p className="text-gray-600">Pantau status kelulusan Anda</p>
        </div>

        <Card>
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-10 w-10" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Menunggu Pengumuman</h2>
            <p className="text-gray-600 mb-4">
              Hasil ujian Anda sedang diproses. Pengumuman akan diumumkan pada:
            </p>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
              <Calendar className="h-4 w-4" />
              <span className="font-semibold">{formatDate(konfigurasi.tanggalPengumuman)}</span>
            </div>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg max-w-md mx-auto">
              <h3 className="font-medium text-gray-900 mb-2">Nilai Ujian Anda</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Akademik</p>
                  <p className="font-bold text-lg text-blue-600">{hasilUjian.nilaiAkademik}</p>
                </div>
                <div>
                  <p className="text-gray-500">Psikotes</p>
                  <p className="font-bold text-lg text-purple-600">{hasilUjian.nilaiPsikotes}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total</p>
                  <p className="font-bold text-lg text-green-600">{hasilUjian.nilaiTotal}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Result available
  const isLolos = profil?.statusKelulusan === 'lolos';
  const isCadangan = profil?.statusKelulusan === 'cadangan';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pengumuman Hasil Seleksi</h1>
        <p className="text-gray-600">Hasil seleksi PPDB Tahun Ajaran {konfigurasi.tahunAjaran}</p>
      </div>

      {/* Result Card */}
      <Card>
        <div className={`text-center py-8 rounded-xl ${
          isLolos ? 'bg-green-50' :
          isCadangan ? 'bg-yellow-50' :
          'bg-red-50'
        }`}>
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isLolos ? 'bg-green-100 text-green-600' :
            isCadangan ? 'bg-yellow-100 text-yellow-600' :
            'bg-red-100 text-red-600'
          }`}>
            {isLolos ? <Award className="h-12 w-12" /> :
             isCadangan ? <Clock className="h-12 w-12" /> :
             <XCircle className="h-12 w-12" />}
          </div>

          <Badge
            variant={isLolos ? 'success' : isCadangan ? 'warning' : 'danger'}
            size="md"
          >
            {isLolos ? 'LOLOS SELEKSI' :
             isCadangan ? 'CADANGAN' :
             'TIDAK LOLOS'}
          </Badge>

          <h2 className={`text-2xl font-bold mt-4 mb-2 ${
            isLolos ? 'text-green-700' :
            isCadangan ? 'text-yellow-700' :
            'text-red-700'
          }`}>
            {isLolos ? 'Selamat! Anda Dinyatakan Lolos Seleksi' :
             isCadangan ? 'Anda Masuk Daftar Cadangan' :
             'Maaf, Anda Belum Lolos Seleksi'}
          </h2>

          <p className={`${
            isLolos ? 'text-green-600' :
            isCadangan ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            {isLolos ? 'Silakan lakukan daftar ulang sebelum batas waktu berakhir.' :
             isCadangan ? 'Tunggu informasi lebih lanjut dari panitia PPDB.' :
             'Terima kasih telah berpartisipasi dalam PPDB.'}
          </p>

          <div className="mt-6 p-4 bg-white rounded-lg inline-block">
            <p className="text-sm text-gray-500">No. Pendaftaran</p>
            <p className="text-xl font-bold text-gray-900">{profil?.noPendaftaran}</p>
          </div>
        </div>
      </Card>

      {/* Score Card */}
      <Card title="Nilai Ujian Seleksi">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-xl p-6 text-center">
            <p className="text-sm text-blue-600 mb-1">Nilai Akademik</p>
            <p className="text-4xl font-bold text-blue-700">{hasilUjian.nilaiAkademik}</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-6 text-center">
            <p className="text-sm text-purple-600 mb-1">Nilai Psikotes</p>
            <p className="text-4xl font-bold text-purple-700">{hasilUjian.nilaiPsikotes}</p>
          </div>
          <div className="bg-green-50 rounded-xl p-6 text-center">
            <p className="text-sm text-green-600 mb-1">Total Nilai</p>
            <p className="text-4xl font-bold text-green-700">{hasilUjian.nilaiTotal}</p>
          </div>
        </div>
      </Card>

      {/* Re-registration for passed students */}
      {isLolos && (
        <Card title="Daftar Ulang">
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800">Langkah Daftar Ulang:</p>
                <ol className="list-decimal list-inside text-sm text-blue-700 mt-2 space-y-1">
                  <li>Download surat kelulusan</li>
                  <li>Bayar uang pangkal sebesar {formatCurrency(konfigurasi.biayaUangPangkal)}</li>
                  <li>Upload bukti pembayaran</li>
                  <li>Tunggu verifikasi dari panitia</li>
                </ol>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Batas Waktu Daftar Ulang</p>
                <p className="text-sm text-gray-600">{formatDate(konfigurasi.batasWaktuDaftarUlang)}</p>
              </div>
              <Badge variant="warning">
                <Clock className="h-3 w-3 mr-1" />
                Segera
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="w-full"
                icon={<Download className="h-4 w-4" />}
                onClick={() => toast.success('Surat kelulusan berhasil didownload!')}
              >
                Download Surat Kelulusan
              </Button>

              {!pembayaranUangPangkal ? (
                <Button
                  className="w-full"
                  icon={<Upload className="h-4 w-4" />}
                  onClick={() => setShowUploadModal(true)}
                >
                  Bayar Uang Pangkal
                </Button>
              ) : pembayaranUangPangkal.status === 'pending' ? (
                <div className="flex items-center justify-center gap-2 p-3 bg-yellow-50 text-yellow-700 rounded-lg">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">Menunggu Verifikasi</span>
                </div>
              ) : pembayaranUangPangkal.status === 'success' ? (
                <div className="flex items-center justify-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Daftar Ulang Selesai!</span>
                </div>
              ) : null}
            </div>

            {pembayaranUangPangkal?.status === 'success' && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800">Selamat!</p>
                    <p className="text-sm text-green-700 mt-1">
                      Proses daftar ulang Anda telah selesai. Selamat bergabung menjadi siswa baru!
                      Informasi lebih lanjut akan disampaikan melalui WhatsApp.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Pembayaran Uang Pangkal"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Pembayaran</span>
              <span className="text-xl font-bold text-gray-900">
                {formatCurrency(konfigurasi.biayaUangPangkal)}
              </span>
            </div>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-10 w-10 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-600 mb-2">Upload bukti transfer</p>
            <p className="text-sm text-gray-500">Format: JPG, PNG, PDF (Max. 2MB)</p>
            
            <Input
              type="text"
              placeholder="Nama file (contoh: bukti_uang_pangkal.jpg)"
              value={buktiTransfer}
              onChange={(e) => setBuktiTransfer(e.target.value)}
              className="mt-4"
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowUploadModal(false)}
            >
              Batal
            </Button>
            <Button
              className="flex-1"
              onClick={handleUploadBukti}
              isLoading={isLoading}
              icon={<Upload className="h-4 w-4" />}
            >
              Upload
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
