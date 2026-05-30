// ============================================
// MOCK DATABASE - Simulasi Data Laravel MySQL
// ============================================

import type {
  User,
  PendaftarProfil,
  UjianSoal,
  Konfigurasi
} from '../types';

// Default Admin Users
export const defaultUsers: User[] = [
  {
    id: 'admin-1',
    name: 'Panitia PPDB',
    email: 'panitia@sekolah.sch.id',
    phone: '081234567890',
    password: 'panitia123',
    role: 'panitia',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'kepsek-1',
    name: 'Dr. H. Ahmad Sudrajat, M.Pd',
    email: 'kepsek@sekolah.sch.id',
    phone: '081234567891',
    password: 'kepsek123',
    role: 'kepala_sekolah',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'siswa-demo',
    name: 'Budi Santoso',
    email: 'budi@gmail.com',
    phone: '081234567892',
    password: 'siswa123',
    role: 'siswa',
    createdAt: '2025-06-01T08:00:00Z'
  }
];

// Demo pendaftar profile
export const defaultPendaftarProfil: PendaftarProfil[] = [
  {
    id: 'profil-demo',
    userId: 'siswa-demo',
    noPendaftaran: 'PPDB-2025-0001',
    nik: '3201012345670001',
    namaLengkap: 'Budi Santoso',
    tempatLahir: 'Jakarta',
    tanggalLahir: '2010-05-15',
    jenisKelamin: 'L',
    agama: 'Islam',
    alamat: 'Jl. Merdeka No. 123',
    provinsi: 'DKI Jakarta',
    kota: 'Jakarta Selatan',
    kodePos: '12345',
    namaAyah: 'Ahmad Santoso',
    pekerjaanAyah: 'Wiraswasta',
    teleponAyah: '081234567893',
    namaIbu: 'Siti Aminah',
    pekerjaanIbu: 'Ibu Rumah Tangga',
    teleponIbu: '081234567894',
    sekolahAsal: 'SD Negeri 01 Jakarta',
    alamatSekolahAsal: 'Jl. Pendidikan No. 1',
    npsn: '12345678',
    tahunLulus: '2025',
    nilaiRataRata: 85.5,
    statusForm: 'lengkap',
    statusKelulusan: 'belum_diproses',
    createdAt: '2025-06-01T08:00:00Z',
    updatedAt: '2025-06-02T10:00:00Z'
  }
];

// Default Soal Ujian
export const defaultUjianSoal: UjianSoal[] = [
  {
    id: 'soal-1',
    nomorSoal: 1,
    kategori: 'akademik',
    pertanyaan: 'Hasil dari 125 × 8 adalah...',
    opsiA: '900',
    opsiB: '1000',
    opsiC: '1100',
    opsiD: '1200',
    jawabanBenar: 'B',
    createdBy: 'admin-1',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'soal-2',
    nomorSoal: 2,
    kategori: 'akademik',
    pertanyaan: 'Ibu kota Indonesia adalah...',
    opsiA: 'Jakarta',
    opsiB: 'Bandung',
    opsiC: 'Surabaya',
    opsiD: 'Nusantara',
    jawabanBenar: 'D',
    createdBy: 'admin-1',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'soal-3',
    nomorSoal: 3,
    kategori: 'akademik',
    pertanyaan: 'Siapa penemu lampu pijar?',
    opsiA: 'Albert Einstein',
    opsiB: 'Thomas Edison',
    opsiC: 'Nikola Tesla',
    opsiD: 'Alexander Graham Bell',
    jawabanBenar: 'B',
    createdBy: 'admin-1',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'soal-4',
    nomorSoal: 4,
    kategori: 'akademik',
    pertanyaan: 'Planet terbesar di tata surya adalah...',
    opsiA: 'Saturnus',
    opsiB: 'Mars',
    opsiC: 'Jupiter',
    opsiD: 'Uranus',
    jawabanBenar: 'C',
    createdBy: 'admin-1',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'soal-5',
    nomorSoal: 5,
    kategori: 'akademik',
    pertanyaan: 'Rumus luas segitiga adalah...',
    opsiA: 'p × l',
    opsiB: '½ × a × t',
    opsiC: 'π × r²',
    opsiD: 's × s',
    jawabanBenar: 'B',
    createdBy: 'admin-1',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'soal-6',
    nomorSoal: 6,
    kategori: 'psikotes',
    pertanyaan: 'Jika A = 1, B = 2, C = 3, maka CAB = ?',
    opsiA: '123',
    opsiB: '312',
    opsiC: '321',
    opsiD: '213',
    jawabanBenar: 'B',
    createdBy: 'admin-1',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'soal-7',
    nomorSoal: 7,
    kategori: 'psikotes',
    pertanyaan: 'Pola berikut: 2, 4, 8, 16, ... bilangan selanjutnya adalah?',
    opsiA: '24',
    opsiB: '28',
    opsiC: '32',
    opsiD: '36',
    jawabanBenar: 'C',
    createdBy: 'admin-1',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'soal-8',
    nomorSoal: 8,
    kategori: 'psikotes',
    pertanyaan: 'RUMAH : BANGUNAN = MOBIL : ?',
    opsiA: 'Mesin',
    opsiB: 'Kendaraan',
    opsiC: 'Roda',
    opsiD: 'Bensin',
    jawabanBenar: 'B',
    createdBy: 'admin-1',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'soal-9',
    nomorSoal: 9,
    kategori: 'psikotes',
    pertanyaan: 'Antonim dari kata "RAJIN" adalah...',
    opsiA: 'Cepat',
    opsiB: 'Lambat',
    opsiC: 'Malas',
    opsiD: 'Tekun',
    jawabanBenar: 'C',
    createdBy: 'admin-1',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'soal-10',
    nomorSoal: 10,
    kategori: 'psikotes',
    pertanyaan: 'Jika semua A adalah B, dan semua B adalah C, maka...',
    opsiA: 'Semua C adalah A',
    opsiB: 'Semua A adalah C',
    opsiC: 'Beberapa C adalah A',
    opsiD: 'Tidak ada hubungan',
    jawabanBenar: 'B',
    createdBy: 'admin-1',
    createdAt: '2025-01-01T00:00:00Z'
  }
];

// Konfigurasi PPDB
export const defaultKonfigurasi: Konfigurasi = {
  id: 'config-1',
  tahunAjaran: '2025/2026',
  biayaFormulir: 250000,
  biayaUangPangkal: 15000000,
  kuotaSiswa: 200,
  tanggalBukaPendaftaran: '2025-06-01',
  tanggalTutupPendaftaran: '2025-07-31',
  tanggalUjian: '2025-08-05',
  tanggalPengumuman: '2025-08-10',
  batasWaktuDaftarUlang: '2025-08-20'
};

// Generate nomor pendaftaran
export function generateNoPendaftaran(count: number): string {
  const year = new Date().getFullYear();
  const sequence = String(count + 1).padStart(4, '0');
  return `PPDB-${year}-${sequence}`;
}

// Generate sample daily stats for chart
export function generateDailyStats(days: number = 30) {
  const stats = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    stats.push({
      tanggal: date.toISOString().split('T')[0],
      jumlahPendaftar: Math.floor(Math.random() * 15) + 5,
      pemasukan: (Math.floor(Math.random() * 10) + 3) * 250000
    });
  }
  
  return stats;
}
