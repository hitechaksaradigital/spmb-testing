import { useState } from 'react';
import { useStore } from '../../store/useStore';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Modal from '../../components/UI/Modal';
import Input from '../../components/UI/Input';
import {
  CreditCard,
  Upload,
  CheckCircle,
  Clock,
  XCircle,
  Copy,
  Building2,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function PembayaranPage() {
  const { currentUser, konfigurasi, getPembayaranByUserId, createPembayaran, hasValidFormulirPayment } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buktiTransfer, setBuktiTransfer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const pembayaranList = currentUser ? getPembayaranByUserId(currentUser.id) : [];
  const sudahBayarFormulir = currentUser ? hasValidFormulirPayment(currentUser.id) : false;
  const pembayaranFormulirPending = pembayaranList.find(
    p => p.jenisPembayaran === 'formulir' && p.status === 'pending'
  );

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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSubmitPembayaran = async () => {
    if (!buktiTransfer.trim()) {
      toast.error('Masukkan nama file bukti transfer!');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (currentUser) {
      createPembayaran(currentUser.id, 'formulir', buktiTransfer);
      toast.success('Bukti pembayaran berhasil diupload! Tunggu verifikasi dari panitia.');
      setIsModalOpen(false);
      setBuktiTransfer('');
    }

    setIsLoading(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Disalin ke clipboard!');
  };

  const bankInfo = {
    bank: 'Bank BCA',
    noRekening: '1234567890',
    atasNama: 'Yayasan Pendidikan Unggulan'
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pembayaran</h1>
        <p className="text-gray-600">Kelola pembayaran pendaftaran Anda</p>
      </div>

      {/* Status Pembayaran Formulir */}
      <Card title="Pembayaran Biaya Formulir">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Biaya Formulir</span>
                <span className="text-2xl font-bold text-gray-900">
                  {formatCurrency(konfigurasi.biayaFormulir)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Status:</span>
                {sudahBayarFormulir ? (
                  <Badge variant="success">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Lunas
                  </Badge>
                ) : pembayaranFormulirPending ? (
                  <Badge variant="warning">
                    <Clock className="h-3 w-3 mr-1" />
                    Menunggu Verifikasi
                  </Badge>
                ) : (
                  <Badge variant="danger">
                    <XCircle className="h-3 w-3 mr-1" />
                    Belum Dibayar
                  </Badge>
                )}
              </div>
            </div>

            {!sudahBayarFormulir && !pembayaranFormulirPending && (
              <Button
                onClick={() => setIsModalOpen(true)}
                className="w-full"
                icon={<Upload className="h-4 w-4" />}
              >
                Upload Bukti Pembayaran
              </Button>
            )}

            {pembayaranFormulirPending && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800">Menunggu Verifikasi</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Bukti pembayaran Anda sedang diverifikasi oleh panitia. 
                      Proses verifikasi maksimal 1x24 jam.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {sudahBayarFormulir && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800">Pembayaran Berhasil</p>
                    <p className="text-sm text-green-700 mt-1">
                      Anda dapat melanjutkan ke tahap pengisian formulir.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Info Transfer */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Informasi Transfer</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-blue-700">Bank</p>
                <p className="font-semibold text-blue-900">{bankInfo.bank}</p>
              </div>
              <div>
                <p className="text-sm text-blue-700">Nomor Rekening</p>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-blue-900 font-mono text-lg">{bankInfo.noRekening}</p>
                  <button
                    onClick={() => copyToClipboard(bankInfo.noRekening)}
                    className="p-1 hover:bg-blue-100 rounded"
                  >
                    <Copy className="h-4 w-4 text-blue-600" />
                  </button>
                </div>
              </div>
              <div>
                <p className="text-sm text-blue-700">Atas Nama</p>
                <p className="font-semibold text-blue-900">{bankInfo.atasNama}</p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-100 rounded-lg">
              <p className="text-xs text-blue-800">
                <AlertCircle className="h-3 w-3 inline mr-1" />
                Pastikan nominal transfer sesuai dan simpan bukti transfer untuk diupload.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Riwayat Pembayaran */}
      <Card title="Riwayat Pembayaran">
        {pembayaranList.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CreditCard className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Belum ada riwayat pembayaran</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Jenis</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Jumlah</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Tanggal</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {pembayaranList.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="capitalize">{p.jenisPembayaran.replace('_', ' ')}</span>
                    </td>
                    <td className="py-3 px-4 font-medium">{formatCurrency(p.jumlah)}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {formatDate(p.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          p.status === 'success' ? 'success' :
                          p.status === 'pending' ? 'warning' : 'danger'
                        }
                      >
                        {p.status === 'success' ? 'Terverifikasi' :
                         p.status === 'pending' ? 'Menunggu' : 'Ditolak'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal Upload Bukti */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Upload Bukti Pembayaran"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Pembayaran</span>
              <span className="text-xl font-bold text-gray-900">
                {formatCurrency(konfigurasi.biayaFormulir)}
              </span>
            </div>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-10 w-10 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-600 mb-2">Upload bukti transfer</p>
            <p className="text-sm text-gray-500">Format: JPG, PNG, PDF (Max. 2MB)</p>
            
            <Input
              type="text"
              placeholder="Nama file (contoh: bukti_transfer_001.jpg)"
              value={buktiTransfer}
              onChange={(e) => setBuktiTransfer(e.target.value)}
              className="mt-4"
            />
            <p className="text-xs text-gray-500 mt-1">
              * Simulasi: Masukkan nama file untuk melanjutkan
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmitPembayaran}
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
