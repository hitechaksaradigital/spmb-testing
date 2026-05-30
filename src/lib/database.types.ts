// ============================================
// SUPABASE DATABASE TYPES
// ============================================
// 
// Tipe data ini sesuai dengan skema database MySQL/Supabase
// yang dirancang untuk sistem PPDB
//
// ============================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'siswa' | 'panitia' | 'kepala_sekolah';
export type StatusPembayaran = 'pending' | 'success' | 'failed';
export type StatusVerifikasi = 'pending' | 'valid' | 'ditolak';
export type StatusKelulusan = 'belum_diproses' | 'lolos' | 'cadangan' | 'tidak_lolos';
export type JenisPembayaran = 'formulir' | 'uang_pangkal';
export type JenisBerkas = 'kk' | 'akta_kelahiran' | 'rapor' | 'foto' | 'ijazah';
export type StatusForm = 'draft' | 'lengkap' | 'terverifikasi';
export type JenisKelamin = 'L' | 'P';
export type KategoriSoal = 'akademik' | 'psikotes';
export type JawabanOpsi = 'A' | 'B' | 'C' | 'D';

export interface Database {
  public: {
    Tables: {
      // Tabel: users
      users: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          password_hash: string
          role: UserRole
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          password_hash: string
          role?: UserRole
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          password_hash?: string
          role?: UserRole
          updated_at?: string
        }
      }

      // Tabel: pendaftar_profil
      pendaftar_profil: {
        Row: {
          id: string
          user_id: string
          no_pendaftaran: string
          nik: string | null
          nama_lengkap: string
          tempat_lahir: string | null
          tanggal_lahir: string | null
          jenis_kelamin: JenisKelamin
          agama: string | null
          alamat: string | null
          provinsi: string | null
          kota: string | null
          kode_pos: string | null
          nama_ayah: string | null
          pekerjaan_ayah: string | null
          telepon_ayah: string | null
          nama_ibu: string | null
          pekerjaan_ibu: string | null
          telepon_ibu: string | null
          nama_wali: string | null
          pekerjaan_wali: string | null
          telepon_wali: string | null
          sekolah_asal: string | null
          alamat_sekolah_asal: string | null
          npsn: string | null
          tahun_lulus: string | null
          nilai_rata_rata: number | null
          status_form: StatusForm
          status_kelulusan: StatusKelulusan
          nilai_ujian: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          no_pendaftaran: string
          nik?: string | null
          nama_lengkap: string
          tempat_lahir?: string | null
          tanggal_lahir?: string | null
          jenis_kelamin?: JenisKelamin
          agama?: string | null
          alamat?: string | null
          provinsi?: string | null
          kota?: string | null
          kode_pos?: string | null
          nama_ayah?: string | null
          pekerjaan_ayah?: string | null
          telepon_ayah?: string | null
          nama_ibu?: string | null
          pekerjaan_ibu?: string | null
          telepon_ibu?: string | null
          nama_wali?: string | null
          pekerjaan_wali?: string | null
          telepon_wali?: string | null
          sekolah_asal?: string | null
          alamat_sekolah_asal?: string | null
          npsn?: string | null
          tahun_lulus?: string | null
          nilai_rata_rata?: number | null
          status_form?: StatusForm
          status_kelulusan?: StatusKelulusan
          nilai_ujian?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          nik?: string | null
          nama_lengkap?: string
          tempat_lahir?: string | null
          tanggal_lahir?: string | null
          jenis_kelamin?: JenisKelamin
          agama?: string | null
          alamat?: string | null
          provinsi?: string | null
          kota?: string | null
          kode_pos?: string | null
          nama_ayah?: string | null
          pekerjaan_ayah?: string | null
          telepon_ayah?: string | null
          nama_ibu?: string | null
          pekerjaan_ibu?: string | null
          telepon_ibu?: string | null
          nama_wali?: string | null
          pekerjaan_wali?: string | null
          telepon_wali?: string | null
          sekolah_asal?: string | null
          alamat_sekolah_asal?: string | null
          npsn?: string | null
          tahun_lulus?: string | null
          nilai_rata_rata?: number | null
          status_form?: StatusForm
          status_kelulusan?: StatusKelulusan
          nilai_ujian?: number | null
          updated_at?: string
        }
      }

      // Tabel: pendaftar_berkas
      pendaftar_berkas: {
        Row: {
          id: string
          pendaftar_id: string
          jenis_berkas: JenisBerkas
          nama_file: string
          file_path: string
          status_verifikasi: StatusVerifikasi
          catatan: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          pendaftar_id: string
          jenis_berkas: JenisBerkas
          nama_file: string
          file_path: string
          status_verifikasi?: StatusVerifikasi
          catatan?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          nama_file?: string
          file_path?: string
          status_verifikasi?: StatusVerifikasi
          catatan?: string | null
          updated_at?: string
        }
      }

      // Tabel: pembayaran
      pembayaran: {
        Row: {
          id: string
          user_id: string
          jenis_pembayaran: JenisPembayaran
          jumlah: number
          status: StatusPembayaran
          bukti_transfer: string | null
          keterangan: string | null
          tanggal_bayar: string | null
          verified_by: string | null
          verified_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          jenis_pembayaran: JenisPembayaran
          jumlah: number
          status?: StatusPembayaran
          bukti_transfer?: string | null
          keterangan?: string | null
          tanggal_bayar?: string | null
          verified_by?: string | null
          verified_at?: string | null
          created_at?: string
        }
        Update: {
          status?: StatusPembayaran
          bukti_transfer?: string | null
          keterangan?: string | null
          tanggal_bayar?: string | null
          verified_by?: string | null
          verified_at?: string | null
        }
      }

      // Tabel: ujian_soal
      ujian_soal: {
        Row: {
          id: string
          nomor_soal: number
          kategori: KategoriSoal
          pertanyaan: string
          opsi_a: string
          opsi_b: string
          opsi_c: string
          opsi_d: string
          jawaban_benar: JawabanOpsi
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          nomor_soal: number
          kategori: KategoriSoal
          pertanyaan: string
          opsi_a: string
          opsi_b: string
          opsi_c: string
          opsi_d: string
          jawaban_benar: JawabanOpsi
          created_by: string
          created_at?: string
        }
        Update: {
          nomor_soal?: number
          kategori?: KategoriSoal
          pertanyaan?: string
          opsi_a?: string
          opsi_b?: string
          opsi_c?: string
          opsi_d?: string
          jawaban_benar?: JawabanOpsi
        }
      }

      // Tabel: ujian_hasil
      ujian_hasil: {
        Row: {
          id: string
          user_id: string
          pendaftar_id: string
          jawaban_siswa: Json
          nilai_akademik: number
          nilai_psikotes: number
          nilai_total: number
          waktu_mulai: string
          waktu_selesai: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          pendaftar_id: string
          jawaban_siswa: Json
          nilai_akademik: number
          nilai_psikotes: number
          nilai_total: number
          waktu_mulai: string
          waktu_selesai: string
          created_at?: string
        }
        Update: {
          nilai_akademik?: number
          nilai_psikotes?: number
          nilai_total?: number
        }
      }

      // Tabel: konfigurasi
      konfigurasi: {
        Row: {
          id: string
          tahun_ajaran: string
          biaya_formulir: number
          biaya_uang_pangkal: number
          kuota_siswa: number
          tanggal_buka_pendaftaran: string
          tanggal_tutup_pendaftaran: string
          tanggal_ujian: string
          tanggal_pengumuman: string
          batas_waktu_daftar_ulang: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tahun_ajaran: string
          biaya_formulir: number
          biaya_uang_pangkal: number
          kuota_siswa: number
          tanggal_buka_pendaftaran: string
          tanggal_tutup_pendaftaran: string
          tanggal_ujian: string
          tanggal_pengumuman: string
          batas_waktu_daftar_ulang: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          tahun_ajaran?: string
          biaya_formulir?: number
          biaya_uang_pangkal?: number
          kuota_siswa?: number
          tanggal_buka_pendaftaran?: string
          tanggal_tutup_pendaftaran?: string
          tanggal_ujian?: string
          tanggal_pengumuman?: string
          batas_waktu_daftar_ulang?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: UserRole
      status_pembayaran: StatusPembayaran
      status_verifikasi: StatusVerifikasi
      status_kelulusan: StatusKelulusan
      jenis_pembayaran: JenisPembayaran
      jenis_berkas: JenisBerkas
      status_form: StatusForm
      jenis_kelamin: JenisKelamin
      kategori_soal: KategoriSoal
      jawaban_opsi: JawabanOpsi
    }
  }
}
