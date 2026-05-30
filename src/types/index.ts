// ============================================
// PPDB SYSTEM TYPES - Skema Database Simulasi
// ============================================

export type UserRole = 'siswa' | 'panitia' | 'kepala_sekolah';

export type StatusPembayaran = 'pending' | 'success' | 'failed';
export type StatusVerifikasi = 'pending' | 'valid' | 'ditolak';
export type StatusKelulusan = 'belum_diproses' | 'lolos' | 'cadangan' | 'tidak_lolos';
export type JenisPembayaran = 'formulir' | 'uang_pangkal';
export type JenisBerkas = 'kk' | 'akta_kelahiran' | 'rapor' | 'foto' | 'ijazah';

// Tabel: users
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  createdAt: string;
}

// Tabel: pendaftar_profil
export interface PendaftarProfil {
  id: string;
  userId: string;
  noPendaftaran: string;
  nik: string;
  namaLengkap: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: 'L' | 'P';
  agama: string;
  alamat: string;
  provinsi: string;
  kota: string;
  kodePos: string;
  
  // Data Orang Tua/Wali
  namaAyah: string;
  pekerjaanAyah: string;
  teleponAyah: string;
  namaIbu: string;
  pekerjaanIbu: string;
  teleponIbu: string;
  namaWali?: string;
  pekerjaanWali?: string;
  teleponWali?: string;
  
  // Data Sekolah Asal
  sekolahAsal: string;
  alamatSekolahAsal: string;
  npsn: string;
  tahunLulus: string;
  nilaiRataRata?: number;
  
  // Status
  statusForm: 'draft' | 'lengkap' | 'terverifikasi';
  statusKelulusan: StatusKelulusan;
  nilaiUjian?: number;
  
  createdAt: string;
  updatedAt: string;
}

// Tabel: pendaftar_berkas
export interface PendaftarBerkas {
  id: string;
  pendaftarId: string;
  jenisBerkas: JenisBerkas;
  namaFile: string;
  filePath: string;
  statusVerifikasi: StatusVerifikasi;
  catatan?: string;
  createdAt: string;
  updatedAt: string;
}

// Tabel: pembayaran
export interface Pembayaran {
  id: string;
  userId: string;
  jenisPembayaran: JenisPembayaran;
  jumlah: number;
  status: StatusPembayaran;
  buktiTransfer?: string;
  keterangan?: string;
  tanggalBayar?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
}

// Tabel: ujian_soal
export interface UjianSoal {
  id: string;
  nomorSoal: number;
  kategori: 'akademik' | 'psikotes';
  pertanyaan: string;
  opsiA: string;
  opsiB: string;
  opsiC: string;
  opsiD: string;
  jawabanBenar: 'A' | 'B' | 'C' | 'D';
  createdBy: string;
  createdAt: string;
}

// Tabel: ujian_hasil
export interface UjianHasil {
  id: string;
  userId: string;
  pendaftarId: string;
  jawabanSiswa: Record<string, string>; // soalId: jawaban
  nilaiAkademik: number;
  nilaiPsikotes: number;
  nilaiTotal: number;
  waktuMulai: string;
  waktuSelesai: string;
  createdAt: string;
}

// Tabel: konfigurasi
export interface Konfigurasi {
  id: string;
  tahunAjaran: string;
  biayaFormulir: number;
  biayaUangPangkal: number;
  kuotaSiswa: number;
  tanggalBukaPendaftaran: string;
  tanggalTutupPendaftaran: string;
  tanggalUjian: string;
  tanggalPengumuman: string;
  batasWaktuDaftarUlang: string;
}

// Dashboard Analytics
export interface DashboardStats {
  totalPendaftar: number;
  pendaftarHariIni: number;
  sudahBayarFormulir: number;
  sudahIsiForm: number;
  sudahUjian: number;
  lolos: number;
  cadangan: number;
  tidakLolos: number;
  totalPemasukanFormulir: number;
  totalPemasukanUangPangkal: number;
  kuotaTerisi: number;
  kuotaTotal: number;
}

export interface DailyStats {
  tanggal: string;
  jumlahPendaftar: number;
  pemasukan: number;
}
