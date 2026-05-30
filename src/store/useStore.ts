// ============================================
// ZUSTAND STORE - State Management (Simulasi Laravel Session)
// ============================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type {
  User,
  PendaftarProfil,
  PendaftarBerkas,
  Pembayaran,
  UjianSoal,
  UjianHasil,
  Konfigurasi,
  StatusKelulusan
} from '../types';
import {
  defaultUsers,
  defaultPendaftarProfil,
  defaultUjianSoal,
  defaultKonfigurasi,
  generateNoPendaftaran
} from '../data/mockData';

interface AppState {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  
  // Data Tables
  users: User[];
  pendaftarProfil: PendaftarProfil[];
  pendaftarBerkas: PendaftarBerkas[];
  pembayaran: Pembayaran[];
  ujianSoal: UjianSoal[];
  ujianHasil: UjianHasil[];
  konfigurasi: Konfigurasi;
  
  // Actions - Auth
  login: (email: string, password: string) => { success: boolean; message: string };
  register: (name: string, email: string, phone: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  
  // Actions - Pendaftar
  getPendaftarByUserId: (userId: string) => PendaftarProfil | undefined;
  updatePendaftarProfil: (data: Partial<PendaftarProfil>) => void;
  getBerkasByPendaftarId: (pendaftarId: string) => PendaftarBerkas[];
  uploadBerkas: (pendaftarId: string, jenisBerkas: PendaftarBerkas['jenisBerkas'], fileName: string) => void;
  
  // Actions - Pembayaran
  getPembayaranByUserId: (userId: string) => Pembayaran[];
  createPembayaran: (userId: string, jenis: Pembayaran['jenisPembayaran'], bukti: string) => void;
  verifyPembayaran: (pembayaranId: string, status: Pembayaran['status'], verifierId: string) => void;
  hasValidFormulirPayment: (userId: string) => boolean;
  
  // Actions - Ujian
  submitUjian: (userId: string, pendaftarId: string, jawaban: Record<string, string>) => UjianHasil;
  getUjianHasilByUserId: (userId: string) => UjianHasil | undefined;
  addSoal: (soal: Omit<UjianSoal, 'id' | 'createdAt'>) => void;
  updateSoal: (id: string, data: Partial<UjianSoal>) => void;
  deleteSoal: (id: string) => void;
  
  // Actions - Admin
  getAllPendaftar: () => (PendaftarProfil & { user?: User; pembayaran?: Pembayaran[] })[];
  verifyBerkas: (berkasId: string, status: PendaftarBerkas['statusVerifikasi'], catatan?: string) => void;
  updateStatusKelulusan: (pendaftarId: string, status: StatusKelulusan) => void;
  bulkUpdateKelulusan: (updates: { pendaftarId: string; status: StatusKelulusan }[]) => void;
  
  // Actions - Analytics
  getDashboardStats: () => {
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
  };
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      currentUser: null,
      isAuthenticated: false,
      users: defaultUsers,
      pendaftarProfil: defaultPendaftarProfil,
      pendaftarBerkas: [],
      pembayaran: [
        {
          id: 'pay-demo',
          userId: 'siswa-demo',
          jenisPembayaran: 'formulir',
          jumlah: 250000,
          status: 'success',
          buktiTransfer: 'bukti-transfer-demo.jpg',
          tanggalBayar: '2025-06-01T09:00:00Z',
          verifiedBy: 'admin-1',
          verifiedAt: '2025-06-01T10:00:00Z',
          createdAt: '2025-06-01T08:30:00Z'
        }
      ],
      ujianSoal: defaultUjianSoal,
      ujianHasil: [],
      konfigurasi: defaultKonfigurasi,

      // Auth Actions
      login: (email, password) => {
        const user = get().users.find(u => u.email === email && u.password === password);
        if (user) {
          set({ currentUser: user, isAuthenticated: true });
          return { success: true, message: 'Login berhasil!' };
        }
        return { success: false, message: 'Email atau password salah!' };
      },

      register: (name, email, phone, password) => {
        const existingUser = get().users.find(u => u.email === email);
        if (existingUser) {
          return { success: false, message: 'Email sudah terdaftar!' };
        }

        const newUser: User = {
          id: uuidv4(),
          name,
          email,
          phone,
          password,
          role: 'siswa',
          createdAt: new Date().toISOString()
        };

        const noPendaftaran = generateNoPendaftaran(get().pendaftarProfil.length);
        
        const newProfil: PendaftarProfil = {
          id: uuidv4(),
          userId: newUser.id,
          noPendaftaran,
          nik: '',
          namaLengkap: name,
          tempatLahir: '',
          tanggalLahir: '',
          jenisKelamin: 'L',
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
          sekolahAsal: '',
          alamatSekolahAsal: '',
          npsn: '',
          tahunLulus: '',
          statusForm: 'draft',
          statusKelulusan: 'belum_diproses',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        set(state => ({
          users: [...state.users, newUser],
          pendaftarProfil: [...state.pendaftarProfil, newProfil],
          currentUser: newUser,
          isAuthenticated: true
        }));

        return { success: true, message: `Registrasi berhasil! No. Pendaftaran: ${noPendaftaran}` };
      },

      logout: () => {
        set({ currentUser: null, isAuthenticated: false });
      },

      // Pendaftar Actions
      getPendaftarByUserId: (userId) => {
        return get().pendaftarProfil.find(p => p.userId === userId);
      },

      updatePendaftarProfil: (data) => {
        set(state => ({
          pendaftarProfil: state.pendaftarProfil.map(p =>
            p.userId === state.currentUser?.id
              ? { ...p, ...data, updatedAt: new Date().toISOString() }
              : p
          )
        }));
      },

      getBerkasByPendaftarId: (pendaftarId) => {
        return get().pendaftarBerkas.filter(b => b.pendaftarId === pendaftarId);
      },

      uploadBerkas: (pendaftarId, jenisBerkas, fileName) => {
        const existing = get().pendaftarBerkas.find(
          b => b.pendaftarId === pendaftarId && b.jenisBerkas === jenisBerkas
        );

        if (existing) {
          set(state => ({
            pendaftarBerkas: state.pendaftarBerkas.map(b =>
              b.id === existing.id
                ? { ...b, namaFile: fileName, filePath: `/uploads/${fileName}`, statusVerifikasi: 'pending', updatedAt: new Date().toISOString() }
                : b
            )
          }));
        } else {
          const newBerkas: PendaftarBerkas = {
            id: uuidv4(),
            pendaftarId,
            jenisBerkas,
            namaFile: fileName,
            filePath: `/uploads/${fileName}`,
            statusVerifikasi: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          set(state => ({
            pendaftarBerkas: [...state.pendaftarBerkas, newBerkas]
          }));
        }
      },

      // Pembayaran Actions
      getPembayaranByUserId: (userId) => {
        return get().pembayaran.filter(p => p.userId === userId);
      },

      createPembayaran: (userId, jenis, bukti) => {
        const config = get().konfigurasi;
        const jumlah = jenis === 'formulir' ? config.biayaFormulir : config.biayaUangPangkal;
        
        const newPembayaran: Pembayaran = {
          id: uuidv4(),
          userId,
          jenisPembayaran: jenis,
          jumlah,
          status: 'pending',
          buktiTransfer: bukti,
          tanggalBayar: new Date().toISOString(),
          createdAt: new Date().toISOString()
        };

        set(state => ({
          pembayaran: [...state.pembayaran, newPembayaran]
        }));
      },

      verifyPembayaran: (pembayaranId, status, verifierId) => {
        set(state => ({
          pembayaran: state.pembayaran.map(p =>
            p.id === pembayaranId
              ? { ...p, status, verifiedBy: verifierId, verifiedAt: new Date().toISOString() }
              : p
          )
        }));
      },

      hasValidFormulirPayment: (userId) => {
        return get().pembayaran.some(
          p => p.userId === userId && p.jenisPembayaran === 'formulir' && p.status === 'success'
        );
      },

      // Ujian Actions
      submitUjian: (userId, pendaftarId, jawaban) => {
        const soalList = get().ujianSoal;
        let nilaiAkademik = 0;
        let nilaiPsikotes = 0;
        let totalAkademik = 0;
        let totalPsikotes = 0;

        soalList.forEach(soal => {
          if (soal.kategori === 'akademik') {
            totalAkademik++;
            if (jawaban[soal.id] === soal.jawabanBenar) nilaiAkademik++;
          } else {
            totalPsikotes++;
            if (jawaban[soal.id] === soal.jawabanBenar) nilaiPsikotes++;
          }
        });

        const skorAkademik = totalAkademik > 0 ? Math.round((nilaiAkademik / totalAkademik) * 100) : 0;
        const skorPsikotes = totalPsikotes > 0 ? Math.round((nilaiPsikotes / totalPsikotes) * 100) : 0;
        const nilaiTotal = Math.round((skorAkademik + skorPsikotes) / 2);

        const hasil: UjianHasil = {
          id: uuidv4(),
          userId,
          pendaftarId,
          jawabanSiswa: jawaban,
          nilaiAkademik: skorAkademik,
          nilaiPsikotes: skorPsikotes,
          nilaiTotal,
          waktuMulai: new Date(Date.now() - 3600000).toISOString(),
          waktuSelesai: new Date().toISOString(),
          createdAt: new Date().toISOString()
        };

        set(state => ({
          ujianHasil: [...state.ujianHasil, hasil],
          pendaftarProfil: state.pendaftarProfil.map(p =>
            p.id === pendaftarId ? { ...p, nilaiUjian: nilaiTotal } : p
          )
        }));

        return hasil;
      },

      getUjianHasilByUserId: (userId) => {
        return get().ujianHasil.find(h => h.userId === userId);
      },

      addSoal: (soal) => {
        const newSoal: UjianSoal = {
          ...soal,
          id: uuidv4(),
          createdAt: new Date().toISOString()
        };
        set(state => ({
          ujianSoal: [...state.ujianSoal, newSoal]
        }));
      },

      updateSoal: (id, data) => {
        set(state => ({
          ujianSoal: state.ujianSoal.map(s => s.id === id ? { ...s, ...data } : s)
        }));
      },

      deleteSoal: (id) => {
        set(state => ({
          ujianSoal: state.ujianSoal.filter(s => s.id !== id)
        }));
      },

      // Admin Actions
      getAllPendaftar: () => {
        const state = get();
        return state.pendaftarProfil
          .filter(p => {
            const user = state.users.find(u => u.id === p.userId);
            return user?.role === 'siswa';
          })
          .map(p => ({
            ...p,
            user: state.users.find(u => u.id === p.userId),
            pembayaran: state.pembayaran.filter(pay => pay.userId === p.userId)
          }));
      },

      verifyBerkas: (berkasId, status, catatan) => {
        set(state => ({
          pendaftarBerkas: state.pendaftarBerkas.map(b =>
            b.id === berkasId
              ? { ...b, statusVerifikasi: status, catatan, updatedAt: new Date().toISOString() }
              : b
          )
        }));
      },

      updateStatusKelulusan: (pendaftarId, status) => {
        set(state => ({
          pendaftarProfil: state.pendaftarProfil.map(p =>
            p.id === pendaftarId ? { ...p, statusKelulusan: status, updatedAt: new Date().toISOString() } : p
          )
        }));
      },

      bulkUpdateKelulusan: (updates) => {
        set(state => ({
          pendaftarProfil: state.pendaftarProfil.map(p => {
            const update = updates.find(u => u.pendaftarId === p.id);
            return update ? { ...p, statusKelulusan: update.status, updatedAt: new Date().toISOString() } : p;
          })
        }));
      },

      // Analytics
      getDashboardStats: () => {
        const state = get();
        const siswaProfiles = state.pendaftarProfil.filter(p => {
          const user = state.users.find(u => u.id === p.userId);
          return user?.role === 'siswa';
        });
        
        const today = new Date().toISOString().split('T')[0];
        const pendaftarHariIni = siswaProfiles.filter(p => p.createdAt.startsWith(today)).length;
        
        const successFormulir = state.pembayaran.filter(p => p.jenisPembayaran === 'formulir' && p.status === 'success');
        const successUangPangkal = state.pembayaran.filter(p => p.jenisPembayaran === 'uang_pangkal' && p.status === 'success');

        return {
          totalPendaftar: siswaProfiles.length,
          pendaftarHariIni,
          sudahBayarFormulir: successFormulir.length,
          sudahIsiForm: siswaProfiles.filter(p => p.statusForm === 'lengkap' || p.statusForm === 'terverifikasi').length,
          sudahUjian: state.ujianHasil.length,
          lolos: siswaProfiles.filter(p => p.statusKelulusan === 'lolos').length,
          cadangan: siswaProfiles.filter(p => p.statusKelulusan === 'cadangan').length,
          tidakLolos: siswaProfiles.filter(p => p.statusKelulusan === 'tidak_lolos').length,
          totalPemasukanFormulir: successFormulir.reduce((sum, p) => sum + p.jumlah, 0),
          totalPemasukanUangPangkal: successUangPangkal.reduce((sum, p) => sum + p.jumlah, 0),
          kuotaTerisi: siswaProfiles.filter(p => p.statusKelulusan === 'lolos').length,
          kuotaTotal: state.konfigurasi.kuotaSiswa
        };
      }
    }),
    {
      name: 'ppdb-storage'
    }
  )
);
