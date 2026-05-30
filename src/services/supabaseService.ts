// ============================================
// SUPABASE SERVICE LAYER
// ============================================
// 
// Service ini menangani semua interaksi dengan Supabase
// Menggunakan any untuk flexibility dengan database schema
//
// ============================================

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { hashPassword, verifyPassword } from '../lib/password';

// ============================================
// AUTH SERVICE
// ============================================

export const authService = {
  // Register user baru
  async register(name: string, email: string, phone: string, password: string) {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured');
    }

    const passwordHash = await hashPassword(password);

    // 1. Create auth user di Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone }
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Failed to create user');

    // 2. Create user di tabel users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        name,
        email,
        phone,
        password_hash: passwordHash,
        role: 'siswa'
      })
      .select()
      .single();

    if (userError) throw userError;

    // 3. Generate nomor pendaftaran
    const { data: noPendaftaran } = await supabase.rpc('generate_no_pendaftaran');

    // 4. Create pendaftar profil
    const { error: profilError } = await supabase
      .from('pendaftar_profil')
      .insert({
        user_id: authData.user.id,
        no_pendaftaran: noPendaftaran || `PPDB-${new Date().getFullYear()}-0001`,
        nama_lengkap: name
      });

    if (profilError) throw profilError;

    return { user: userData, noPendaftaran };
  },

  // Login
  async login(email: string, password: string) {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured');
    }

    // Try Supabase Auth first (for registered users via registration)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    // If Supabase Auth succeeds, get user data
    if (!error && data.user) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (!userError && userData) {
        return { session: data.session, user: userData };
      }
    }

    // Fallback: Direct login for admin/kepsek via users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !userData) {
      throw new Error('Email atau password salah!');
    }

    // Verify password hash
    const isValid = await verifyPassword(password, userData.password_hash);
    if (!isValid) {
      throw new Error('Email atau password salah!');
    }

    // Create a mock session for direct login
    return { 
      session: { user: { id: userData.id, email: userData.email } } as any, 
      user: userData 
    };
  },

  // Logout
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current session
  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) return null;
    return data;
  }
};

// ============================================
// PENDAFTAR SERVICE
// ============================================

export const pendaftarService = {
  // Get profil by user ID
  async getProfilByUserId(userId: string) {
    const { data, error } = await supabase
      .from('pendaftar_profil')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  // Update profil
  async updateProfil(userId: string, updates: Record<string, any>) {
    const { data, error } = await supabase
      .from('pendaftar_profil')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get all pendaftar (admin only)
  async getAllPendaftar() {
    console.log('[pendaftarService] Fetching pendaftar_profil...');
    const { data, error } = await supabase
      .from('pendaftar_profil')
      .select(`
        *,
        user:users(id, name, email, phone, role)
      `)
      .order('created_at', { ascending: false });

    console.log('[pendaftarService] pendaftar_profil response - data:', data, 'error:', error);

    if (error) throw error;

    // Fetch pembayaran separately
    const { data: pembayaranData } = await supabase
      .from('pembayaran')
      .select('*')
      .order('created_at', { ascending: false });

    console.log('[pendaftarService] pembayaran response - data:', pembayaranData);

    // Merge pembayaran into pendaftar
    if (data && pembayaranData) {
      return data.map(p => ({
        ...p,
        pembayaran: pembayaranData.filter(pay => pay.user_id === p.user_id)
      }));
    }

    return data;
  },

  // Update status kelulusan
  async updateStatusKelulusan(pendaftarId: string, status: string) {
    const { data, error } = await supabase
      .from('pendaftar_profil')
      .update({ status_kelulusan: status })
      .eq('id', pendaftarId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Bulk update kelulusan
  async bulkUpdateKelulusan(updates: { id: string; status: string }[]) {
    const promises = updates.map(u => 
      supabase
        .from('pendaftar_profil')
        .update({ status_kelulusan: u.status })
        .eq('id', u.id)
    );

    await Promise.all(promises);
  }
};

// ============================================
// BERKAS SERVICE
// ============================================

export const berkasService = {
  // Get berkas by pendaftar ID
  async getBerkasByPendaftarId(pendaftarId: string) {
    const { data, error } = await supabase
      .from('pendaftar_berkas')
      .select('*')
      .eq('pendaftar_id', pendaftarId);

    if (error) throw error;
    return data;
  },

  // Upload berkas (metadata only)
  async uploadBerkas(berkas: Record<string, any>) {
    const { data, error } = await supabase
      .from('pendaftar_berkas')
      .upsert(berkas, { onConflict: 'pendaftar_id,jenis_berkas' })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Upload file ke Supabase Storage
  async uploadFile(bucket: string, path: string, file: File) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true });

    if (error) throw error;
    return data;
  },

  // Verify berkas (admin)
  async verifyBerkas(berkasId: string, status: string, catatan?: string) {
    const { data, error } = await supabase
      .from('pendaftar_berkas')
      .update({ status_verifikasi: status, catatan })
      .eq('id', berkasId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get all berkas (admin)
  async getAllBerkas() {
    const { data, error } = await supabase
      .from('pendaftar_berkas')
      .select(`
        *,
        pendaftar:pendaftar_profil(no_pendaftaran, nama_lengkap)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};

// ============================================
// PEMBAYARAN SERVICE
// ============================================

export const pembayaranService = {
  // Get pembayaran by user ID
  async getPembayaranByUserId(userId: string) {
    const { data, error } = await supabase
      .from('pembayaran')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Create pembayaran
  async createPembayaran(pembayaran: Record<string, any>) {
    const { data, error } = await supabase
      .from('pembayaran')
      .insert(pembayaran)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Verify pembayaran (admin)
  async verifyPembayaran(pembayaranId: string, status: string, verifiedBy: string) {
    const { data, error } = await supabase
      .from('pembayaran')
      .update({
        status,
        verified_by: verifiedBy,
        verified_at: new Date().toISOString()
      })
      .eq('id', pembayaranId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get all pembayaran (admin)
  async getAllPembayaran() {
    const { data, error } = await supabase
      .from('pembayaran')
      .select(`
        *,
        user:users(name, email)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Check valid formulir payment
  async hasValidFormulirPayment(userId: string) {
    const { data, error } = await supabase
      .from('pembayaran')
      .select('id')
      .eq('user_id', userId)
      .eq('jenis_pembayaran', 'formulir')
      .eq('status', 'success')
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  }
};

// ============================================
// UJIAN SERVICE
// ============================================

export const ujianService = {
  // Get all soal
  async getAllSoal() {
    const { data, error } = await supabase
      .from('ujian_soal')
      .select('*')
      .order('nomor_soal');

    if (error) throw error;
    return data;
  },

  // Add soal (admin)
  async addSoal(soal: Record<string, any>) {
    const { data, error } = await supabase
      .from('ujian_soal')
      .insert(soal)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update soal (admin)
  async updateSoal(soalId: string, updates: Record<string, any>) {
    const { data, error } = await supabase
      .from('ujian_soal')
      .update(updates)
      .eq('id', soalId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete soal (admin)
  async deleteSoal(soalId: string) {
    const { error } = await supabase
      .from('ujian_soal')
      .delete()
      .eq('id', soalId);

    if (error) throw error;
  },

  // Submit ujian
  async submitUjian(hasil: Record<string, any>) {
    const { data, error } = await supabase
      .from('ujian_hasil')
      .insert(hasil)
      .select()
      .single();

    if (error) throw error;

    // Update nilai di pendaftar_profil
    await supabase
      .from('pendaftar_profil')
      .update({ nilai_ujian: hasil.nilai_total })
      .eq('id', hasil.pendaftar_id);

    return data;
  },

  // Get hasil by user ID
  async getHasilByUserId(userId: string) {
    const { data, error } = await supabase
      .from('ujian_hasil')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Get all hasil (admin)
  async getAllHasil() {
    const { data, error } = await supabase
      .from('ujian_hasil')
      .select(`
        *,
        pendaftar:pendaftar_profil(no_pendaftaran, nama_lengkap, status_kelulusan)
      `)
      .order('nilai_total', { ascending: false });

    if (error) throw error;
    return data;
  }
};

// ============================================
// KONFIGURASI SERVICE
// ============================================

export const konfigurasiService = {
  // Get konfigurasi
  async getKonfigurasi() {
    const { data, error } = await supabase
      .from('konfigurasi')
      .select('*')
      .single();

    if (error) throw error;
    return data;
  },

  // Update konfigurasi (kepsek only)
  async updateKonfigurasi(updates: Record<string, any>) {
    const { data: existing } = await supabase
      .from('konfigurasi')
      .select('id')
      .single();

    if (!existing) throw new Error('Konfigurasi not found');

    const { data, error } = await supabase
      .from('konfigurasi')
      .update(updates)
      .eq('id', (existing as any).id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// ============================================
// DASHBOARD SERVICE
// ============================================

export const dashboardService = {
  // Get dashboard stats
  async getStats() {
    // Get counts from various tables
    const [
      { count: totalPendaftar },
      { count: sudahBayar },
      { count: lolos },
      { count: cadangan },
      { count: tidakLolos },
      { count: sudahUjian }
    ] = await Promise.all([
      supabase.from('pendaftar_profil').select('*', { count: 'exact', head: true }),
      supabase.from('pembayaran').select('*', { count: 'exact', head: true }).eq('status', 'success').eq('jenis_pembayaran', 'formulir'),
      supabase.from('pendaftar_profil').select('*', { count: 'exact', head: true }).eq('status_kelulusan', 'lolos'),
      supabase.from('pendaftar_profil').select('*', { count: 'exact', head: true }).eq('status_kelulusan', 'cadangan'),
      supabase.from('pendaftar_profil').select('*', { count: 'exact', head: true }).eq('status_kelulusan', 'tidak_lolos'),
      supabase.from('ujian_hasil').select('*', { count: 'exact', head: true })
    ]);

    // Get pemasukan
    const { data: pemasukanData } = await supabase
      .from('pembayaran')
      .select('jumlah, jenis_pembayaran')
      .eq('status', 'success');

    let totalFormulir = 0;
    let totalUangPangkal = 0;
    pemasukanData?.forEach((p: any) => {
      if (p.jenis_pembayaran === 'formulir') totalFormulir += Number(p.jumlah);
      else totalUangPangkal += Number(p.jumlah);
    });

    // Get konfigurasi for kuota
    const { data: config } = await supabase.from('konfigurasi').select('kuota_siswa').single();

    return {
      totalPendaftar: totalPendaftar || 0,
      pendaftarHariIni: 0, // Would need separate query
      sudahBayarFormulir: sudahBayar || 0,
      sudahIsiForm: 0,
      sudahUjian: sudahUjian || 0,
      lolos: lolos || 0,
      cadangan: cadangan || 0,
      tidakLolos: tidakLolos || 0,
      totalPemasukanFormulir: totalFormulir,
      totalPemasukanUangPangkal: totalUangPangkal,
      kuotaTerisi: lolos || 0,
      kuotaTotal: (config as any)?.kuota_siswa || 200
    };
  }
};

// ============================================
// REALTIME SUBSCRIPTIONS
// ============================================

export const realtimeService = {
  // Subscribe to changes
  subscribePendaftar(callback: (payload: any) => void) {
    return supabase
      .channel('pendaftar-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'pendaftar_profil' },
        callback
      )
      .subscribe();
  },

  subscribePembayaran(callback: (payload: any) => void) {
    return supabase
      .channel('pembayaran-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'pembayaran' },
        callback
      )
      .subscribe();
  },

  unsubscribe(channel: any) {
    supabase.removeChannel(channel);
  }
};

// Export all services
export default {
  auth: authService,
  pendaftar: pendaftarService,
  berkas: berkasService,
  pembayaran: pembayaranService,
  ujian: ujianService,
  konfigurasi: konfigurasiService,
  dashboard: dashboardService,
  realtime: realtimeService
};
