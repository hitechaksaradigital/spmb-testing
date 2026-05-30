import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Modal from '../../components/UI/Modal';
import {
  PenTool,
  Clock,
  AlertTriangle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Send,
  Award
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function UjianPage() {
  const { currentUser, getPendaftarByUserId, hasValidFormulirPayment, ujianSoal, submitUjian, getUjianHasilByUserId } = useStore();
  
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [currentSoalIndex, setCurrentSoalIndex] = useState(0);
  const [jawaban, setJawaban] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const profil = currentUser ? getPendaftarByUserId(currentUser.id) : null;
  const sudahBayar = currentUser ? hasValidFormulirPayment(currentUser.id) : false;
  const hasilUjian = currentUser ? getUjianHasilByUserId(currentUser.id) : null;

  const formLengkap = profil?.statusForm === 'lengkap' || profil?.statusForm === 'terverifikasi';

  // Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isExamStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
    return () => clearInterval(timer);
  }, [isExamStarted, timeLeft]);

  // Redirect if not eligible
  if (!sudahBayar) {
    return <Navigate to="/siswa/pembayaran" replace />;
  }

  if (!formLengkap) {
    return <Navigate to="/siswa/formulir" replace />;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentSoal = ujianSoal[currentSoalIndex];

  const handleAnswer = (answer: string) => {
    setJawaban(prev => ({
      ...prev,
      [currentSoal.id]: answer
    }));
  };

  const handleSubmit = async () => {
    if (!currentUser || !profil) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    submitUjian(currentUser.id, profil.id, jawaban);
    toast.success('Ujian berhasil dikumpulkan!');
    setIsExamStarted(false);
    setShowConfirmSubmit(false);
    setIsSubmitting(false);
  };

  const answeredCount = Object.keys(jawaban).length;

  // Show result if already done
  if (hasilUjian) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hasil Ujian Seleksi</h1>
          <p className="text-gray-600">Anda sudah mengerjakan ujian seleksi</p>
        </div>

        <Card>
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ujian Selesai</h2>
            <p className="text-gray-600 mb-6">Terima kasih telah mengerjakan ujian seleksi</p>

            <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-blue-50 rounded-xl p-6">
                <p className="text-sm text-blue-600 mb-1">Nilai Akademik</p>
                <p className="text-3xl font-bold text-blue-700">{hasilUjian.nilaiAkademik}</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-6">
                <p className="text-sm text-purple-600 mb-1">Nilai Psikotes</p>
                <p className="text-3xl font-bold text-purple-700">{hasilUjian.nilaiPsikotes}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-6">
                <p className="text-sm text-green-600 mb-1">Total Nilai</p>
                <p className="text-3xl font-bold text-green-700">{hasilUjian.nilaiTotal}</p>
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-6">
              Hasil seleksi akan diumumkan pada tanggal yang telah ditentukan
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // Exam started
  if (isExamStarted) {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Badge variant={currentSoal.kategori === 'akademik' ? 'info' : 'default'}>
              {currentSoal.kategori === 'akademik' ? 'Akademik' : 'Psikotes'}
            </Badge>
            <span className="text-sm text-gray-600">
              Soal {currentSoalIndex + 1} dari {ujianSoal.length}
            </span>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            timeLeft < 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
          }`}>
            <Clock className="h-4 w-4" />
            <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Question */}
        <Card>
          <div className="mb-6">
            <p className="text-lg text-gray-900 font-medium">{currentSoal.pertanyaan}</p>
          </div>

          <div className="space-y-3">
            {['A', 'B', 'C', 'D'].map((option) => {
              const optionKey = `opsi${option}` as 'opsiA' | 'opsiB' | 'opsiC' | 'opsiD';
              const isSelected = jawaban[currentSoal.id] === option;
              
              return (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition flex items-center gap-4 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {option}
                  </span>
                  <span className="text-gray-900">{currentSoal[optionKey]}</span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentSoalIndex(prev => Math.max(0, prev - 1))}
            disabled={currentSoalIndex === 0}
            icon={<ChevronLeft className="h-4 w-4" />}
          >
            Sebelumnya
          </Button>

          <div className="flex gap-2">
            {ujianSoal.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSoalIndex(index)}
                className={`w-8 h-8 rounded text-sm font-medium ${
                  index === currentSoalIndex
                    ? 'bg-blue-600 text-white'
                    : jawaban[ujianSoal[index].id]
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentSoalIndex === ujianSoal.length - 1 ? (
            <Button
              variant="success"
              onClick={() => setShowConfirmSubmit(true)}
              icon={<Send className="h-4 w-4" />}
            >
              Kumpulkan
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentSoalIndex(prev => Math.min(ujianSoal.length - 1, prev + 1))}
              icon={<ChevronRight className="h-4 w-4" />}
            >
              Selanjutnya
            </Button>
          )}
        </div>

        {/* Progress */}
        <Card>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progress Pengerjaan</span>
            <span className="font-medium">{answeredCount}/{ujianSoal.length} terjawab</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all"
              style={{ width: `${(answeredCount / ujianSoal.length) * 100}%` }}
            />
          </div>
        </Card>

        {/* Confirm Submit Modal */}
        <Modal
          isOpen={showConfirmSubmit}
          onClose={() => setShowConfirmSubmit(false)}
          title="Konfirmasi Pengumpulan"
          size="sm"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <p className="text-gray-600 mb-4">
              Anda yakin ingin mengumpulkan ujian?
              <br />
              <strong>{answeredCount}</strong> dari <strong>{ujianSoal.length}</strong> soal terjawab.
            </p>
            {answeredCount < ujianSoal.length && (
              <p className="text-red-600 text-sm mb-4">
                Masih ada {ujianSoal.length - answeredCount} soal yang belum dijawab!
              </p>
            )}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowConfirmSubmit(false)}
              >
                Kembali
              </Button>
              <Button
                variant="success"
                className="flex-1"
                onClick={handleSubmit}
                isLoading={isSubmitting}
                icon={<Send className="h-4 w-4" />}
              >
                Kumpulkan
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  // Pre-exam view
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ujian Seleksi</h1>
        <p className="text-gray-600">Ujian seleksi masuk Computer Assisted Test (CAT)</p>
      </div>

      <Card>
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <PenTool className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ujian Seleksi PPDB</h2>
          <p className="text-gray-600 mb-6">Tes Akademik & Psikotes Online</p>

          <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-1">Jumlah Soal</p>
              <p className="text-2xl font-bold text-gray-900">{ujianSoal.length} Soal</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-1">Waktu Pengerjaan</p>
              <p className="text-2xl font-bold text-gray-900">60 Menit</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-1">Jenis Soal</p>
              <p className="text-2xl font-bold text-gray-900">Pilihan Ganda</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left max-w-2xl mx-auto mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-2">Perhatian:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Ujian hanya dapat dikerjakan SATU KALI</li>
                  <li>Pastikan koneksi internet stabil</li>
                  <li>Jangan menutup atau refresh halaman selama ujian</li>
                  <li>Jawaban otomatis tersimpan saat dikumpulkan</li>
                </ul>
              </div>
            </div>
          </div>

          <Button
            size="lg"
            onClick={() => setIsExamStarted(true)}
            icon={<CheckCircle className="h-5 w-5" />}
          >
            Mulai Ujian Sekarang
          </Button>
        </div>
      </Card>
    </div>
  );
}
