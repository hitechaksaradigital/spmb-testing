// ============================================
// SUPABASE HOOKS
// ============================================
// 
// Custom hooks untuk mengintegrasikan Supabase dengan komponen React
// Jika Supabase tidak dikonfigurasi, akan fallback ke mock data dari store
//
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { isSupabaseConfigured } from '../lib/supabase';
import { useStore } from '../store/useStore';
import {
  authService,
  pendaftarService,
  pembayaranService,
  ujianService,
  konfigurasiService,
  dashboardService,
  realtimeService
} from '../services/supabaseService';

// ============================================
// AUTH HOOK
// ============================================

export function useAuth() {
  const store = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      if (isSupabaseConfigured()) {
        const result = await authService.login(email, password);
        // Update local store with user data from Supabase
        if (result.user) {
          useStore.setState({
            currentUser: result.user as any,
            isAuthenticated: true
          });
        }
        return { success: true, user: result.user };
      } else {
        // Fallback to local mock
        const result = store.login(email, password);
        return result;
      }
    } catch (err: any) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, [store]);

  const register = useCallback(async (name: string, email: string, phone: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      if (isSupabaseConfigured()) {
        const result = await authService.register(name, email, phone, password);
        // After successful registration, update store with user data
        if (result.user) {
          useStore.setState({
            currentUser: result.user as any,
            isAuthenticated: true
          });
        }
        return { 
          success: true, 
          noPendaftaran: result.noPendaftaran,
          message: `Registrasi berhasil! No. Pendaftaran: ${result.noPendaftaran}`
        };
      } else {
        // Fallback to local mock
        const result = store.register(name, email, phone, password);
        return result;
      }
    } catch (err: any) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, [store]);

  const logout = useCallback(async () => {
    if (isSupabaseConfigured()) {
      await authService.logout();
    }
    store.logout();
  }, [store]);

  const loginWithGoogle = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured');
    }

    try {
      await authService.loginWithGoogle();
      // Note: This will redirect to Google, so code after this won't execute
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  }, []);

  return { login, register, logout, loginWithGoogle, loading, error };
}

// ============================================
// PENDAFTAR HOOK
// ============================================

export function usePendaftar(userId?: string) {
  const store = useStore();
  const [profil, setProfil] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfil() {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        if (isSupabaseConfigured()) {
          const data = await pendaftarService.getProfilByUserId(userId);
          setProfil(data);
        } else {
          const data = store.getPendaftarByUserId(userId);
          setProfil(data);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProfil();
  }, [userId, store]);

  const updateProfil = useCallback(async (updates: Record<string, any>) => {
    if (!userId) return;

    try {
      if (isSupabaseConfigured()) {
        const data = await pendaftarService.updateProfil(userId, updates);
        setProfil(data);
      } else {
        store.updatePendaftarProfil(updates);
        const data = store.getPendaftarByUserId(userId);
        setProfil(data);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [userId, store]);

  return { profil, loading, error, updateProfil };
}

// ============================================
// ALL PENDAFTAR HOOK (Admin)
// ============================================

export function useAllPendaftar() {
  const store = useStore();
  const [pendaftar, setPendaftar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPendaftar = useCallback(async () => {
    console.log('[useAllPendaftar] Hook called, Supabase configured:', isSupabaseConfigured());
    try {
      if (isSupabaseConfigured()) {
        console.log('[useAllPendaftar] Fetching from Supabase...');
        const data = await pendaftarService.getAllPendaftar();
        console.log('[useAllPendaftar] Raw data:', data);
        const transformed = (data || []).map((p: any) => ({
          id: p.id,
          userId: p.user_id,
          noPendaftaran: p.no_pendaftaran,
          nik: p.nik,
          namaLengkap: p.nama_lengkap,
          tempatLahir: p.tempat_lahir,
          tanggalLahir: p.tanggal_lahir,
          jenisKelamin: p.jenis_kelamin,
          agama: p.agama,
          alamat: p.alamat,
          provinsi: p.provinsi,
          kota: p.kota,
          kodePos: p.kode_pos,
          namaAyah: p.nama_ayah,
          pekerjaanAyah: p.pekerjaan_ayah,
          teleponAyah: p.telepon_ayah,
          namaIbu: p.nama_ibu,
          pekerjaanIbu: p.pekerjaan_ibu,
          teleponIbu: p.telepon_ibu,
          sekolahAsal: p.sekolah_asal,
          alamatSekolahAsal: p.alamat_sekolah_asal,
          npsn: p.npsn,
          tahunLulus: p.tahun_lulus,
          nilaiRataRata: p.nilai_rata_rata,
          statusForm: p.status_form,
          statusKelulusan: p.status_kelulusan,
          nilaiUjian: p.nilai_ujian,
          createdAt: p.created_at,
          updatedAt: p.updated_at,
          user: p.user ? {
            id: p.user.id,
            name: p.user.name,
            email: p.user.email,
            phone: p.user.phone,
            role: p.user.role
          } : undefined,
          pembayaran: (p.pembayaran || []).map((pay: any) => ({
            id: pay.id,
            userId: pay.user_id,
            jenisPembayaran: pay.jenis_pembayaran,
            jumlah: pay.jumlah,
            status: pay.status,
            buktiTransfer: pay.bukti_transfer,
            tanggalBayar: pay.tanggal_bayar,
            verifiedBy: pay.verified_by,
            verifiedAt: pay.verified_at,
            createdAt: pay.created_at
          }))
        }));
        console.log('[useAllPendaftar] Transformed data:', transformed);
        setPendaftar(transformed);
      } else {
        console.log('[useAllPendaftar] Using local store fallback');
        const data = store.getAllPendaftar ? store.getAllPendaftar() : [];
        console.log('[useAllPendedor] Store data:', data);
        setPendaftar(data);
      }
    } catch (err: any) {
      console.error('[useAllPendedor] Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [store]);

  useEffect(() => {
    fetchPendaftar();
  }, [fetchPendaftar]);

return { pendaftar, loading, error, refresh: fetchPendaftar };
}

// ============================================
// PEMBAYARAN HOOK
// ============================================

export function usePembayaran(userId?: string) {
  const store = useStore();
  const [pembayaran, setPembayaran] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasValidFormulir, setHasValidFormulir] = useState(false);

  useEffect(() => {
    async function fetchPembayaran() {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        if (isSupabaseConfigured()) {
          const data = await pembayaranService.getPembayaranByUserId(userId);
          setPembayaran(data || []);
          const valid = await pembayaranService.hasValidFormulirPayment(userId);
          setHasValidFormulir(valid);
        } else {
          const data = store.getPembayaranByUserId(userId);
          setPembayaran(data);
          setHasValidFormulir(store.hasValidFormulirPayment(userId));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPembayaran();
  }, [userId, store]);

  const createPembayaran = useCallback(async (jenis: 'formulir' | 'uang_pangkal', bukti: string) => {
    if (!userId) return;

    try {
      if (isSupabaseConfigured()) {
        const config = await konfigurasiService.getKonfigurasi();
        const jumlah = jenis === 'formulir' ? config.biaya_formulir : config.biaya_uang_pangkal;
        
        await pembayaranService.createPembayaran({
          user_id: userId,
          jenis_pembayaran: jenis,
          jumlah,
          bukti_transfer: bukti,
          tanggal_bayar: new Date().toISOString()
        });
        
        // Refresh data
        const data = await pembayaranService.getPembayaranByUserId(userId);
        setPembayaran(data || []);
      } else {
        store.createPembayaran(userId, jenis, bukti);
        setPembayaran(store.getPembayaranByUserId(userId));
      }
    } catch (err) {
      throw err;
    }
  }, [userId, store]);

  return { pembayaran, loading, hasValidFormulir, createPembayaran };
}

// ============================================
// UJIAN HOOK
// ============================================

export function useUjian(userId?: string, pendaftarId?: string) {
  const store = useStore();
  const [soalList, setSoalList] = useState<any[]>([]);
  const [hasil, setHasil] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        if (isSupabaseConfigured()) {
          const soal = await ujianService.getAllSoal();
          setSoalList(soal || []);
          
          if (userId) {
            const hasilData = await ujianService.getHasilByUserId(userId);
            setHasil(hasilData);
          }
        } else {
          setSoalList(store.ujianSoal);
          if (userId) {
            setHasil(store.getUjianHasilByUserId(userId));
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [userId, store]);

  const submitUjian = useCallback(async (jawaban: Record<string, string>) => {
    if (!userId || !pendaftarId) return null;

    try {
      if (isSupabaseConfigured()) {
        // Calculate scores
        const soal = await ujianService.getAllSoal();
        let nilaiAkademik = 0, nilaiPsikotes = 0;
        let totalAkademik = 0, totalPsikotes = 0;

        soal?.forEach((s: any) => {
          if (s.kategori === 'akademik') {
            totalAkademik++;
            if (jawaban[s.id] === s.jawaban_benar) nilaiAkademik++;
          } else {
            totalPsikotes++;
            if (jawaban[s.id] === s.jawaban_benar) nilaiPsikotes++;
          }
        });

        const skorAkademik = totalAkademik > 0 ? Math.round((nilaiAkademik / totalAkademik) * 100) : 0;
        const skorPsikotes = totalPsikotes > 0 ? Math.round((nilaiPsikotes / totalPsikotes) * 100) : 0;
        const nilaiTotal = Math.round((skorAkademik + skorPsikotes) / 2);

        const hasilData = await ujianService.submitUjian({
          user_id: userId,
          pendaftar_id: pendaftarId,
          jawaban_siswa: jawaban,
          nilai_akademik: skorAkademik,
          nilai_psikotes: skorPsikotes,
          nilai_total: nilaiTotal,
          waktu_mulai: new Date(Date.now() - 3600000).toISOString(),
          waktu_selesai: new Date().toISOString()
        });

        setHasil(hasilData);
        return hasilData;
      } else {
        const hasilData = store.submitUjian(userId, pendaftarId, jawaban);
        setHasil(hasilData);
        return hasilData;
      }
    } catch (err) {
      throw err;
    }
  }, [userId, pendaftarId, store]);

  return { soalList, hasil, loading, submitUjian };
}

// ============================================
// DASHBOARD STATS HOOK (Admin/Kepsek)
// ============================================

export function useDashboardStats() {
  const store = useStore();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        if (isSupabaseConfigured()) {
          const data = await dashboardService.getStats();
          setStats(data);
        } else {
          setStats(store.getDashboardStats());
        }
      } catch (err) {
        console.error(err);
        // Fallback to local
        setStats(store.getDashboardStats());
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [store]);

  return { stats, loading };
}

// ============================================
// REALTIME HOOK
// ============================================

export function useRealtimeUpdates(table: 'pendaftar' | 'pembayaran', callback: () => void) {
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    let channel: any;

    if (table === 'pendaftar') {
      channel = realtimeService.subscribePendaftar(callback);
    } else if (table === 'pembayaran') {
      channel = realtimeService.subscribePembayaran(callback);
    }

    return () => {
      if (channel) {
        realtimeService.unsubscribe(channel);
      }
    };
  }, [table, callback]);
}

// Export utility to check Supabase status
export { isSupabaseConfigured };
