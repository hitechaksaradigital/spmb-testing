-- ============================================
-- PPDB SISTEM DATABASE SCHEMA
-- ============================================
-- 
-- Jalankan script ini di Supabase SQL Editor:
-- 1. Buka project Supabase Anda
-- 2. Pergi ke SQL Editor
-- 3. Paste seluruh kode ini
-- 4. Klik "Run"
--
-- Untuk clean install, jalankan DROP terlebih dahulu
-- ============================================

-- ============================================
-- DROP EXISTING (Untuk clean install)
-- ============================================

DROP VIEW IF EXISTS v_pendaftar_lengkap;
DROP VIEW IF EXISTS v_dashboard_stats;
DROP TRIGGER IF EXISTS update_konfigurasi_updated_at ON konfigurasi;
DROP TRIGGER IF EXISTS update_pendaftar_berkas_updated_at ON pendaftar_berkas;
DROP TRIGGER IF EXISTS update_pendaftar_profil_updated_at ON pendaftar_profil;
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP FUNCTION IF EXISTS generate_no_pendaftaran();
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS is_admin_user();
DROP FUNCTION IF EXISTS is_kepsek_user();
DROP POLICY IF EXISTS "Anyone can view users for login" ON users;
DROP POLICY IF EXISTS "Kepsek can manage konfigurasi" ON konfigurasi;
DROP POLICY IF EXISTS "Admin can view all results" ON ujian_hasil;
DROP POLICY IF EXISTS "Admin can manage soal" ON ujian_soal;
DROP POLICY IF EXISTS "Admin can update payments" ON pembayaran;
DROP POLICY IF EXISTS "Admin can view all payments" ON pembayaran;
DROP POLICY IF EXISTS "Admin can update berkas status" ON pendaftar_berkas;
DROP POLICY IF EXISTS "Admin can view all berkas" ON pendaftar_berkas;
DROP POLICY IF EXISTS "Admin can update pendaftar status" ON pendaftar_profil;
DROP POLICY IF EXISTS "Admin can view all pendaftar" ON pendaftar_profil;
DROP POLICY IF EXISTS "Admin can view all users" ON users;
DROP POLICY IF EXISTS "Anyone can view konfigurasi" ON konfigurasi;
DROP POLICY IF EXISTS "Users can view own results" ON ujian_hasil;
DROP POLICY IF EXISTS "Anyone can view soal" ON ujian_soal;
DROP POLICY IF EXISTS "Users can create own payments" ON pembayaran;
DROP POLICY IF EXISTS "Users can view own payments" ON pembayaran;
DROP POLICY IF EXISTS "Pendaftar can manage own berkas" ON pendaftar_berkas;
DROP POLICY IF EXISTS "Pendaftar can update own profile" ON pendaftar_profil;
DROP POLICY IF EXISTS "Pendaftar can view own profile" ON pendaftar_profil;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Anyone can view users for login" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Pendaftar can insert own profile" ON pendaftar_profil;
DROP POLICY IF EXISTS "Users can insert own results" ON ujian_hasil;
DROP TABLE IF EXISTS ujian_hasil;
DROP TABLE IF EXISTS pendaftar_berkas;
DROP TABLE IF EXISTS pembayaran;
DROP TABLE IF EXISTS pendaftar_profil;
DROP TABLE IF EXISTS ujian_soal;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS konfigurasi;
DROP EXTENSION IF EXISTS "uuid-ossp";
DROP TYPE IF EXISTS jawaban_opsi;
DROP TYPE IF EXISTS kategori_soal;
DROP TYPE IF EXISTS jenis_kelamin;
DROP TYPE IF EXISTS status_form;
DROP TYPE IF EXISTS jenis_berkas;
DROP TYPE IF EXISTS jenis_pembayaran;
DROP TYPE IF EXISTS status_kelulusan;
DROP TYPE IF EXISTS status_verifikasi;
DROP TYPE IF EXISTS status_pembayaran;
DROP TYPE IF EXISTS user_role;
DROP EXTENSION IF EXISTS "uuid-ossp";

-- ============================================
-- CREATE NEW SCHEMA
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUM TYPES
-- ============================================

CREATE TYPE user_role AS ENUM ('siswa', 'panitia', 'kepala_sekolah');
CREATE TYPE status_pembayaran AS ENUM ('pending', 'success', 'failed');
CREATE TYPE status_verifikasi AS ENUM ('pending', 'valid', 'ditolak');
CREATE TYPE status_kelulusan AS ENUM ('belum_diproses', 'lolos', 'cadangan', 'tidak_lolos');
CREATE TYPE jenis_pembayaran AS ENUM ('formulir', 'uang_pangkal');
CREATE TYPE jenis_berkas AS ENUM ('kk', 'akta_kelahiran', 'rapor', 'foto', 'ijazah');
CREATE TYPE status_form AS ENUM ('draft', 'lengkap', 'terverifikasi');
CREATE TYPE jenis_kelamin AS ENUM ('L', 'P');
CREATE TYPE kategori_soal AS ENUM ('akademik', 'psikotes');
CREATE TYPE jawaban_opsi AS ENUM ('A', 'B', 'C', 'D');

-- ============================================
-- TABLE: users
-- ============================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'siswa',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index untuk pencarian
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================
-- TABLE: pendaftar_profil
-- ============================================

CREATE TABLE pendaftar_profil (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    no_pendaftaran VARCHAR(20) UNIQUE NOT NULL,
    
    -- Data Pribadi
    nik VARCHAR(16),
    nama_lengkap VARCHAR(255) NOT NULL,
    tempat_lahir VARCHAR(100),
    tanggal_lahir DATE,
    jenis_kelamin jenis_kelamin DEFAULT 'L',
    agama VARCHAR(20),
    alamat TEXT,
    provinsi VARCHAR(100),
    kota VARCHAR(100),
    kode_pos VARCHAR(10),
    
    -- Data Orang Tua
    nama_ayah VARCHAR(255),
    pekerjaan_ayah VARCHAR(100),
    telepon_ayah VARCHAR(20),
    nama_ibu VARCHAR(255),
    pekerjaan_ibu VARCHAR(100),
    telepon_ibu VARCHAR(20),
    
    -- Data Wali (opsional)
    nama_wali VARCHAR(255),
    pekerjaan_wali VARCHAR(100),
    telepon_wali VARCHAR(20),
    
    -- Data Sekolah Asal
    sekolah_asal VARCHAR(255),
    alamat_sekolah_asal TEXT,
    npsn VARCHAR(8),
    tahun_lulus VARCHAR(4),
    nilai_rata_rata DECIMAL(5,2),
    
    -- Status
    status_form status_form DEFAULT 'draft',
    status_kelulusan status_kelulusan DEFAULT 'belum_diproses',
    nilai_ujian INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_pendaftar_user ON pendaftar_profil(user_id);
CREATE INDEX idx_pendaftar_no ON pendaftar_profil(no_pendaftaran);
CREATE INDEX idx_pendaftar_status ON pendaftar_profil(status_kelulusan);

-- ============================================
-- TABLE: pendaftar_berkas
-- ============================================

CREATE TABLE pendaftar_berkas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pendaftar_id UUID NOT NULL REFERENCES pendaftar_profil(id) ON DELETE CASCADE,
    jenis_berkas jenis_berkas NOT NULL,
    nama_file VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    status_verifikasi status_verifikasi DEFAULT 'pending',
    catatan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint: satu jenis berkas per pendaftar
    UNIQUE(pendaftar_id, jenis_berkas)
);

-- Index
CREATE INDEX idx_berkas_pendaftar ON pendaftar_berkas(pendaftar_id);
CREATE INDEX idx_berkas_status ON pendaftar_berkas(status_verifikasi);

-- ============================================
-- TABLE: pembayaran
-- ============================================

CREATE TABLE pembayaran (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    jenis_pembayaran jenis_pembayaran NOT NULL,
    jumlah DECIMAL(15,2) NOT NULL,
    status status_pembayaran DEFAULT 'pending',
    bukti_transfer VARCHAR(500),
    keterangan TEXT,
    tanggal_bayar TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_pembayaran_user ON pembayaran(user_id);
CREATE INDEX idx_pembayaran_status ON pembayaran(status);
CREATE INDEX idx_pembayaran_jenis ON pembayaran(jenis_pembayaran);

-- ============================================
-- TABLE: ujian_soal
-- ============================================

CREATE TABLE ujian_soal (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nomor_soal INTEGER NOT NULL,
    kategori kategori_soal NOT NULL,
    pertanyaan TEXT NOT NULL,
    opsi_a TEXT NOT NULL,
    opsi_b TEXT NOT NULL,
    opsi_c TEXT NOT NULL,
    opsi_d TEXT NOT NULL,
    jawaban_benar jawaban_opsi NOT NULL,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_soal_kategori ON ujian_soal(kategori);
CREATE INDEX idx_soal_nomor ON ujian_soal(nomor_soal);

-- ============================================
-- TABLE: ujian_hasil
-- ============================================

CREATE TABLE ujian_hasil (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pendaftar_id UUID NOT NULL REFERENCES pendaftar_profil(id) ON DELETE CASCADE,
    jawaban_siswa JSONB NOT NULL,
    nilai_akademik INTEGER NOT NULL DEFAULT 0,
    nilai_psikotes INTEGER NOT NULL DEFAULT 0,
    nilai_total INTEGER NOT NULL DEFAULT 0,
    waktu_mulai TIMESTAMP WITH TIME ZONE NOT NULL,
    waktu_selesai TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Satu user hanya bisa ujian sekali
    UNIQUE(user_id)
);

-- Index
CREATE INDEX idx_hasil_user ON ujian_hasil(user_id);
CREATE INDEX idx_hasil_nilai ON ujian_hasil(nilai_total DESC);

-- ============================================
-- TABLE: konfigurasi
-- ============================================

CREATE TABLE konfigurasi (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tahun_ajaran VARCHAR(20) NOT NULL,
    biaya_formulir DECIMAL(15,2) NOT NULL,
    biaya_uang_pangkal DECIMAL(15,2) NOT NULL,
    kuota_siswa INTEGER NOT NULL,
    tanggal_buka_pendaftaran DATE NOT NULL,
    tanggal_tutup_pendaftaran DATE NOT NULL,
    tanggal_ujian DATE NOT NULL,
    tanggal_pengumuman DATE NOT NULL,
    batas_waktu_daftar_ulang DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function untuk auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger untuk users
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger untuk pendaftar_profil
CREATE TRIGGER update_pendaftar_profil_updated_at
    BEFORE UPDATE ON pendaftar_profil
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger untuk pendaftar_berkas
CREATE TRIGGER update_pendaftar_berkas_updated_at
    BEFORE UPDATE ON pendaftar_berkas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger untuk konfigurasi
CREATE TRIGGER update_konfigurasi_updated_at
    BEFORE UPDATE ON konfigurasi
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function untuk cek apakah user adalah admin (bypass RLS)
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('panitia', 'kepala_sekolah')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function untuk cek apakah user adalah kepsek (bypass RLS)
CREATE OR REPLACE FUNCTION is_kepsek_user()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role = 'kepala_sekolah'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCTION: Generate Nomor Pendaftaran
-- ============================================

CREATE OR REPLACE FUNCTION generate_no_pendaftaran()
RETURNS VARCHAR(20) AS $$
DECLARE
    tahun VARCHAR(4);
    urutan INTEGER;
    no_pendaftaran VARCHAR(20);
BEGIN
    tahun := EXTRACT(YEAR FROM NOW())::VARCHAR;
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(no_pendaftaran FROM 11 FOR 4) AS INTEGER)), 0) + 1
    INTO urutan
    FROM pendaftar_profil
    WHERE no_pendaftaran LIKE 'PPDB-' || tahun || '-%';
    
    no_pendaftaran := 'PPDB-' || tahun || '-' || LPAD(urutan::VARCHAR, 4, '0');
    
    RETURN no_pendaftaran;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS pada semua tabel
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pendaftar_profil ENABLE ROW LEVEL SECURITY;
ALTER TABLE pendaftar_berkas ENABLE ROW LEVEL SECURITY;
ALTER TABLE pembayaran ENABLE ROW LEVEL SECURITY;
ALTER TABLE ujian_soal ENABLE ROW LEVEL SECURITY;
ALTER TABLE ujian_hasil ENABLE ROW LEVEL SECURITY;
ALTER TABLE konfigurasi ENABLE ROW LEVEL SECURITY;

-- Policy: Users dapat melihat data sendiri
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

-- Policy: Allow login query (for authentication)
CREATE POLICY "Anyone can view users for login" ON users
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (true);

-- Policy: Pendaftar dapat melihat & update profil sendiri
CREATE POLICY "Pendaftar can view own profile" ON pendaftar_profil
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Pendaftar can update own profile" ON pendaftar_profil
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Pendaftar can insert own profile" ON pendaftar_profil
    FOR INSERT WITH CHECK (true);

-- Policy: Pendaftar dapat mengelola berkas sendiri
CREATE POLICY "Pendaftar can manage own berkas" ON pendaftar_berkas
    FOR ALL USING (
        pendaftar_id IN (
            SELECT id FROM pendaftar_profil WHERE user_id::text = auth.uid()::text
        )
    );

-- Policy: Pembayaran
CREATE POLICY "Users can view own payments" ON pembayaran
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create own payments" ON pembayaran
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Policy: Soal ujian dapat dilihat semua (saat ujian)
CREATE POLICY "Anyone can view soal" ON ujian_soal
    FOR SELECT USING (true);

-- Policy: Hasil ujian
CREATE POLICY "Users can view own results" ON ujian_hasil
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own results" ON ujian_hasil
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Policy: Konfigurasi dapat dilihat semua
CREATE POLICY "Anyone can view konfigurasi" ON konfigurasi
    FOR SELECT USING (true);

-- ============================================
-- ADMIN POLICIES (untuk panitia dan kepsek)
-- ============================================

-- Admin bisa melihat semua users (bypass RLS untuk admin)
CREATE POLICY "Admin can view all users" ON users
    FOR SELECT USING (is_admin_user());

-- Admin bisa melihat semua pendaftar
CREATE POLICY "Admin can view all pendaftar" ON pendaftar_profil
    FOR SELECT USING (is_admin_user());

-- Admin bisa update status kelulusan
CREATE POLICY "Admin can update pendaftar status" ON pendaftar_profil
    FOR UPDATE USING (is_admin_user());

-- Admin bisa melihat semua berkas
CREATE POLICY "Admin can view all berkas" ON pendaftar_berkas
    FOR SELECT USING (is_admin_user());

-- Admin bisa update status berkas
CREATE POLICY "Admin can update berkas status" ON pendaftar_berkas
    FOR UPDATE USING (is_admin_user());

-- Admin bisa melihat & verify semua pembayaran
CREATE POLICY "Admin can view all payments" ON pembayaran
    FOR SELECT USING (is_admin_user());

CREATE POLICY "Admin can update payments" ON pembayaran
    FOR UPDATE USING (is_admin_user());

-- Admin bisa manage soal
CREATE POLICY "Admin can manage soal" ON ujian_soal
    FOR ALL USING (is_admin_user());

-- Admin bisa melihat semua hasil
CREATE POLICY "Admin can view all results" ON ujian_hasil
    FOR SELECT USING (is_admin_user());

-- Kepsek bisa update konfigurasi
CREATE POLICY "Kepsek can manage konfigurasi" ON konfigurasi
    FOR ALL USING (is_kepsek_user());

-- ============================================
-- SAMPLE DATA (untuk testing)
-- ============================================

-- Insert konfigurasi default
INSERT INTO konfigurasi (
    tahun_ajaran,
    biaya_formulir,
    biaya_uang_pangkal,
    kuota_siswa,
    tanggal_buka_pendaftaran,
    tanggal_tutup_pendaftaran,
    tanggal_ujian,
    tanggal_pengumuman,
    batas_waktu_daftar_ulang
) VALUES (
    '2025/2026',
    250000,
    15000000,
    200,
    '2025-06-01',
    '2025-07-31',
    '2025-08-05',
    '2025-08-10',
    '2025-08-20'
);

-- Insert sample admin users (password: admin123)
-- Note: Password sudah di-hash dengan bcrypt
INSERT INTO users (name, email, phone, password_hash, role) VALUES
('Panitia PPDB', 'panitia@sekolah.sch.id', '081234567890', '$2b$10$Ouq50PJnrTY0yytKCMlAl.nzwbGuEABmRB6dnORd6aqrtAiCFhQk.', 'panitia'),
('Dr. H. Ahmad Sudrajat, M.Pd', 'kepsek@sekolah.sch.id', '081234567891', '$2b$10$Ouq50PJnrTY0yytKCMlAl.nzwbGuEABmRB6dnORd6aqrtAiCFhQk.', 'kepala_sekolah'),
('Budi Santoso', 'budi@gmail.com', '081234567892', '$2b$10$VvR1wCZF8uO03SqXA4TjVuKDrc5KHp4o4ib8ensO5O7IV6umqbZQy', 'siswa');

-- Insert sample pendaftar profil for Budi (demo siswa)
INSERT INTO pendaftar_profil (
  user_id, no_pendaftaran, nik, nama_lengkap, tempat_lahir, tanggal_lahir,
  jenis_kelamin, agama, alamat, provinsi, kota, kode_pos,
  nama_ayah, pekerjaan_ayah, telepon_ayah, nama_ibu, pekerjaan_ibu, telepon_ibu,
  sekolah_asal, alamat_sekolah_asal, npsn, tahun_lulus, nilai_rata_rata,
  status_form, status_kelulusan
) VALUES (
  (SELECT id FROM users WHERE email = 'budi@gmail.com' LIMIT 1),
  'PPDB-2025-0001', '3201012345670001', 'Budi Santoso', 'Jakarta', '2010-05-15',
  'L', 'Islam', 'Jl. Merdeka No. 123', 'DKI Jakarta', 'Jakarta Selatan', '12345',
  'Ahmad Santoso', 'Wiraswasta', '081234567893', 'Siti Aminah', 'Ibu Rumah Tangga', '081234567894',
  'SD Negeri 01 Jakarta', 'Jl. Pendidikan No. 1', '12345678', '2025', 85.5,
  'lengkap', 'belum_diproses'
);

-- Insert sample soal ujian
INSERT INTO ujian_soal (nomor_soal, kategori, pertanyaan, opsi_a, opsi_b, opsi_c, opsi_d, jawaban_benar, created_by) VALUES
(1, 'akademik', 'Hasil dari 125 × 8 adalah...', '900', '1000', '1100', '1200', 'B', (SELECT id FROM users WHERE role = 'panitia' LIMIT 1)),
(2, 'akademik', 'Ibu kota Indonesia adalah...', 'Jakarta', 'Bandung', 'Surabaya', 'Nusantara', 'D', (SELECT id FROM users WHERE role = 'panitia' LIMIT 1)),
(3, 'akademik', 'Siapa penemu lampu pijar?', 'Albert Einstein', 'Thomas Edison', 'Nikola Tesla', 'Alexander Graham Bell', 'B', (SELECT id FROM users WHERE role = 'panitia' LIMIT 1)),
(4, 'akademik', 'Planet terbesar di tata surya adalah...', 'Saturnus', 'Mars', 'Jupiter', 'Uranus', 'C', (SELECT id FROM users WHERE role = 'panitia' LIMIT 1)),
(5, 'akademik', 'Rumus luas segitiga adalah...', 'p × l', '½ × a × t', 'π × r²', 's × s', 'B', (SELECT id FROM users WHERE role = 'panitia' LIMIT 1)),
(6, 'psikotes', 'Jika A = 1, B = 2, C = 3, maka CAB = ?', '123', '312', '321', '213', 'B', (SELECT id FROM users WHERE role = 'panitia' LIMIT 1)),
(7, 'psikotes', 'Pola berikut: 2, 4, 8, 16, ... bilangan selanjutnya adalah?', '24', '28', '32', '36', 'C', (SELECT id FROM users WHERE role = 'panitia' LIMIT 1)),
(8, 'psikotes', 'RUMAH : BANGUNAN = MOBIL : ?', 'Mesin', 'Kendaraan', 'Roda', 'Bensin', 'B', (SELECT id FROM users WHERE role = 'panitia' LIMIT 1)),
(9, 'psikotes', 'Antonim dari kata "RAJIN" adalah...', 'Cepat', 'Lambat', 'Malas', 'Tekun', 'C', (SELECT id FROM users WHERE role = 'panitia' LIMIT 1)),
(10, 'psikotes', 'Jika semua A adalah B, dan semua B adalah C, maka...', 'Semua C adalah A', 'Semua A adalah C', 'Beberapa C adalah A', 'Tidak ada hubungan', 'B', (SELECT id FROM users WHERE role = 'panitia' LIMIT 1));

-- ============================================
-- VIEWS (untuk reporting)
-- ============================================

-- View: Dashboard statistics
CREATE OR REPLACE VIEW v_dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM pendaftar_profil) as total_pendaftar,
    (SELECT COUNT(*) FROM pendaftar_profil WHERE DATE(created_at) = CURRENT_DATE) as pendaftar_hari_ini,
    (SELECT COUNT(*) FROM pembayaran WHERE jenis_pembayaran = 'formulir' AND status = 'success') as sudah_bayar_formulir,
    (SELECT COUNT(*) FROM pendaftar_profil WHERE status_form IN ('lengkap', 'terverifikasi')) as sudah_isi_form,
    (SELECT COUNT(*) FROM ujian_hasil) as sudah_ujian,
    (SELECT COUNT(*) FROM pendaftar_profil WHERE status_kelulusan = 'lolos') as lolos,
    (SELECT COUNT(*) FROM pendaftar_profil WHERE status_kelulusan = 'cadangan') as cadangan,
    (SELECT COUNT(*) FROM pendaftar_profil WHERE status_kelulusan = 'tidak_lolos') as tidak_lolos,
    (SELECT COALESCE(SUM(jumlah), 0) FROM pembayaran WHERE jenis_pembayaran = 'formulir' AND status = 'success') as total_pemasukan_formulir,
    (SELECT COALESCE(SUM(jumlah), 0) FROM pembayaran WHERE jenis_pembayaran = 'uang_pangkal' AND status = 'success') as total_pemasukan_uang_pangkal,
    (SELECT kuota_siswa FROM konfigurasi LIMIT 1) as kuota_total;

-- View: Pendaftar lengkap dengan user info
CREATE OR REPLACE VIEW v_pendaftar_lengkap AS
SELECT 
    p.*,
    u.name as user_name,
    u.email as user_email,
    u.phone as user_phone,
    (SELECT status FROM pembayaran WHERE user_id = u.id AND jenis_pembayaran = 'formulir' ORDER BY created_at DESC LIMIT 1) as status_bayar_formulir,
    h.nilai_total as nilai_ujian_total
FROM pendaftar_profil p
JOIN users u ON p.user_id = u.id
LEFT JOIN ujian_hasil h ON p.id = h.pendaftar_id
WHERE u.role = 'siswa'
ORDER BY p.created_at DESC;

-- ============================================
-- SEED ADMIN USERS TO SUPABASE AUTH
-- ============================================
-- Run this to create admin users in Supabase Auth
-- These users will be able to login via Supabase Auth and RLS will work properly
--
-- NOTE: The password encryption in auth.users must use bcrypt format
-- For simplicity, use Supabase Dashboard > Authentication > Users to create admin users
-- with matching IDs to public.users table
--
-- Admin users credentials:
-- - Email: panitia@sekolah.sch.id / Password: panitia123
-- - Email: kepsek@sekolah.sch.id / Password: kepsek123

-- First, ensure admin users exist in public.users with consistent IDs
UPDATE users SET id = '11111111-1111-1111-1111-111111111111' WHERE email = 'panitia@sekolah.sch.id';
UPDATE users SET id = '22222222-2222-2222-2222-222222222222' WHERE email = 'kepsek@sekolah.sch.id';

-- ============================================
-- END OF SCHEMA
-- ============================================

-- ============================================
-- END OF SCHEMA
-- ============================================
