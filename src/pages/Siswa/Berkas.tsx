import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Modal from '../../components/UI/Modal';
import Input from '../../components/UI/Input';
import {
  Upload,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Image,
  File
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { JenisBerkas } from '../../types';

export default function BerkasPage() {
  const { currentUser, getPendaftarByUserId, getBerkasByPendaftarId, uploadBerkas, hasValidFormulirPayment } = useStore();
  const [selectedBerkas, setSelectedBerkas] = useState<JenisBerkas | null>(null);
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const profil = currentUser ? getPendaftarByUserId(currentUser.id) : null;
  const sudahBayar = currentUser ? hasValidFormulirPayment(currentUser.id) : false;
  const berkasList = profil ? getBerkasByPendaftarId(profil.id) : [];

  // Redirect if not paid
  if (!sudahBayar) {
    return <Navigate to="/siswa/pembayaran" replace />;
  }

  const berkasRequired: { jenis: JenisBerkas; label: string; desc: string }[] = [
    { jenis: 'kk', label: 'Kartu Keluarga', desc: 'Scan KK yang masih berlaku (PDF/JPG)' },
    { jenis: 'akta_kelahiran', label: 'Akta Kelahiran', desc: 'Scan akta kelahiran asli (PDF/JPG)' },
    { jenis: 'rapor', label: 'Rapor', desc: 'Scan rapor semester 1-5 (PDF)' },
    { jenis: 'foto', label: 'Pas Foto', desc: 'Foto 3x4 background merah (JPG/PNG)' },
    { jenis: 'ijazah', label: 'Ijazah/SKL', desc: 'Scan ijazah atau Surat Keterangan Lulus (PDF/JPG)' }
  ];

  const getBerkasStatus = (jenis: JenisBerkas) => {
    return berkasList.find(b => b.jenisBerkas === jenis);
  };

  const handleUpload = async () => {
    if (!selectedBerkas || !fileName.trim() || !profil) {
      toast.error('Masukkan nama file!');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    uploadBerkas(profil.id, selectedBerkas, fileName);
    toast.success('Berkas berhasil diupload!');
    setSelectedBerkas(null);
    setFileName('');
    setIsLoading(false);
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'valid':
        return <Badge variant="success"><CheckCircle className="h-3 w-3 mr-1" />Valid</Badge>;
      case 'ditolak':
        return <Badge variant="danger"><XCircle className="h-3 w-3 mr-1" />Ditolak</Badge>;
      case 'pending':
        return <Badge variant="warning"><Clock className="h-3 w-3 mr-1" />Menunggu Verifikasi</Badge>;
      default:
        return <Badge variant="default">Belum Upload</Badge>;
    }
  };

  const uploadedCount = berkasList.filter(b => b.statusVerifikasi === 'valid' || b.statusVerifikasi === 'pending').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upload Berkas</h1>
        <p className="text-gray-600">Upload dokumen persyaratan pendaftaran</p>
      </div>

      {/* Progress */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Progress Upload</h3>
          <span className="text-sm text-gray-600">{uploadedCount}/{berkasRequired.length} berkas</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${(uploadedCount / berkasRequired.length) * 100}%` }}
          />
        </div>
      </Card>

      {/* List Berkas */}
      <div className="grid gap-4">
        {berkasRequired.map((item) => {
          const berkas = getBerkasStatus(item.jenis);
          
          return (
            <Card key={item.jenis}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    berkas?.statusVerifikasi === 'valid' ? 'bg-green-100 text-green-600' :
                    berkas?.statusVerifikasi === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                    berkas?.statusVerifikasi === 'ditolak' ? 'bg-red-100 text-red-600' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {item.jenis === 'foto' ? <Image className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{item.label}</h4>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                    {berkas && (
                      <div className="mt-2 flex items-center gap-3">
                        {getStatusBadge(berkas.statusVerifikasi)}
                        <span className="text-sm text-gray-500">
                          <File className="h-3 w-3 inline mr-1" />
                          {berkas.namaFile}
                        </span>
                      </div>
                    )}
                    {berkas?.catatan && berkas.statusVerifikasi === 'ditolak' && (
                      <p className="text-sm text-red-600 mt-1">
                        Catatan: {berkas.catatan}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {berkas && (
                    <Button variant="outline" size="sm" icon={<Eye className="h-4 w-4" />}>
                      Lihat
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant={berkas ? 'outline' : 'primary'}
                    onClick={() => {
                      setSelectedBerkas(item.jenis);
                      setFileName('');
                    }}
                    icon={<Upload className="h-4 w-4" />}
                  >
                    {berkas ? 'Ganti' : 'Upload'}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Modal Upload */}
      <Modal
        isOpen={!!selectedBerkas}
        onClose={() => setSelectedBerkas(null)}
        title={`Upload ${berkasRequired.find(b => b.jenis === selectedBerkas)?.label}`}
        size="md"
      >
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-10 w-10 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-600 mb-2">
              {berkasRequired.find(b => b.jenis === selectedBerkas)?.desc}
            </p>
            <p className="text-sm text-gray-500">Max. 2MB</p>
            
            <Input
              type="text"
              placeholder="Nama file (contoh: kk_001.pdf)"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
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
              onClick={() => setSelectedBerkas(null)}
            >
              Batal
            </Button>
            <Button
              className="flex-1"
              onClick={handleUpload}
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
