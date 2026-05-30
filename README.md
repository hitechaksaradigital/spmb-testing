# 🎓 Sistem PPDB Online - Sekolah Swasta

Sistem Informasi Pendaftaran Peserta Didik Baru (PPDB) berbasis web dengan fitur lengkap untuk sekolah swasta.

## 📋 Fitur Utama

### 👨‍🎓 Calon Siswa (Pendaftar)
- ✅ Registrasi akun dengan email/WhatsApp
- ✅ Pembayaran formulir (upload bukti transfer)
- ✅ Pengisian formulir data diri lengkap
- ✅ Upload berkas persyaratan
- ✅ Ujian seleksi online (CAT)
- ✅ Cek pengumuman kelulusan
- ✅ Daftar ulang (jika lolos)

### 👨‍💼 Panitia PPDB (Admin)
- ✅ Dashboard statistik pendaftar
- ✅ Verifikasi pembayaran
- ✅ Verifikasi berkas pendaftar
- ✅ Manajemen soal ujian
- ✅ Lihat hasil ujian
- ✅ Kelola status kelulusan (massal/individu)

### 🎓 Kepala Sekolah (Superadmin)
- ✅ Dashboard analytics dengan grafik
- ✅ Laporan export (Excel/PDF)
- ✅ Pengaturan sistem PPDB

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Charts**: Recharts
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth

## 🚀 Instalasi

### 1. Clone & Install Dependencies

```bash
npm install
```

### 2. Konfigurasi Supabase

1. Buat akun di [Supabase](https://supabase.com)
2. Buat project baru
3. Copy kredensial dari **Settings > API**
4. Buat file `.env` dari `.env.example`:

```bash
cp .env.example .env
```

5. Isi kredensial:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Setup Database

1. Buka **SQL Editor** di Supabase Dashboard
2. Copy & paste isi file `supabase/schema.sql`
3. Klik **Run**

### 4. Jalankan Aplikasi

```bash
npm run dev
```

## 📁 Struktur Project

```
src/
├── components/          # Komponen UI reusable
│   ├── Layout/         # Navbar, Sidebar, dll
│   └── UI/             # Button, Card, Modal, dll
├── data/               # Mock data untuk development
├── hooks/              # Custom React hooks
├── lib/                # Konfigurasi library (Supabase)
├── pages/              # Halaman-halaman aplikasi
│   ├── Auth/           # Login & Register
│   ├── Siswa/          # Dashboard siswa
│   ├── Admin/          # Dashboard panitia
│   └── Kepsek/         # Dashboard kepala sekolah
├── services/           # API services (Supabase)
├── store/              # Zustand store
└── types/              # TypeScript types
```

## 🔐 Akun Demo

Jika Supabase tidak dikonfigurasi, aplikasi menggunakan mock data dengan akun berikut:

| Role | Email | Password |
|------|-------|----------|
| Siswa | budi@gmail.com | siswa123 |
| Panitia | panitia@sekolah.sch.id | panitia123 |
| Kepala Sekolah | kepsek@sekolah.sch.id | kepsek123 |

## 📊 Database Schema

### Tabel Utama

- `users` - Data pengguna (siswa, panitia, kepsek)
- `pendaftar_profil` - Profil lengkap pendaftar
- `pendaftar_berkas` - Dokumen yang diupload
- `pembayaran` - Riwayat pembayaran
- `ujian_soal` - Bank soal ujian
- `ujian_hasil` - Hasil ujian siswa
- `konfigurasi` - Pengaturan sistem PPDB

### Relasi

```
users (1) ──────── (1) pendaftar_profil
                         │
                         ├── (N) pendaftar_berkas
                         └── (1) ujian_hasil

users (1) ──────── (N) pembayaran
```

## 🔄 Workflow PPDB

```
1. REGISTRASI
   └── Siswa daftar dengan email/WA
       └── Dapat nomor pendaftaran (PPDB-YYYY-XXXX)

2. PEMBAYARAN
   └── Upload bukti transfer
       └── Panitia verifikasi
           └── Status: Lunas

3. PENGISIAN FORMULIR
   └── Isi data diri lengkap
       └── Upload berkas (KK, Akta, Rapor, dll)
           └── Panitia verifikasi berkas

4. UJIAN SELEKSI
   └── Kerjakan soal akademik & psikotes
       └── Sistem hitung nilai otomatis

5. PENGUMUMAN
   └── Panitia tentukan status kelulusan
       └── Lolos / Cadangan / Tidak Lolos

6. DAFTAR ULANG (Jika Lolos)
   └── Download surat kelulusan
       └── Bayar uang pangkal
           └── Selesai!
```

## 🛡️ Row Level Security (RLS)

Database menggunakan RLS untuk keamanan:

- Siswa hanya bisa akses data sendiri
- Panitia bisa akses semua data pendaftar
- Kepala Sekolah akses penuh + konfigurasi

## 📱 Responsive Design

Aplikasi fully responsive untuk:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🤝 Contributing

1. Fork repository
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

MIT License - Silakan gunakan untuk keperluan pendidikan dan komersial.

---

Dibuat dengan ❤️ untuk memudahkan proses PPDB Sekolah Swasta
