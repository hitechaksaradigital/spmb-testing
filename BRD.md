# BUSINESS REQUIREMENTS DOCUMENT (BRD)

**Nama Proyek:** Sistem Penerimaan Murid Baru (SPMB) Hitech School

**Versi:** 1.0

**Tanggal:** 30 Mei 2026

**Status:** Draft Ready for Review

**Peran:** Senior Business Analyst & Solution Architect

---

## 1. Executive Summary & Project Overview

### 1.1 Latar Belakang & Visi

SPMB Hitech School adalah sebuah platform digital yang dirancang untuk mengotomatisasi dan mengintegrasikan seluruh proses seleksi penerimaan siswa baru untuk jenjang SD dan SMP Swasta. Visi dari proyek ini adalah menyediakan pengalaman pendaftaran yang *seamless*, transparan, dan efisien bagi calon orang tua murid/siswa, serta mempermudah administrasi internal sekolah dalam mengelola data, pembayaran, pelaksanaan tes, hingga pengumuman hasil seleksi.

### 1.2 Ruang Lingkup Proyek (Project Scope)

```
+-----------------------------------------------------------------------+
|                            SPMB HITECH SCHOOL                         |
+-----------------------------------------------------------------------+
|  [IN-SCOPE]                                                           |
|  - Landing Page & Registrasi        - Integrasi Payment Gateway       |
|  - Pengisian Formulir (SD/SMP)      - CBT (Computer Based Test)       |
|  - Dashboard Admin & Keuangan       - Pengumuman Real-time            |
+-----------------------------------------------------------------------+
|  [OUT-OF-SCOPE]                                                       |
|  - Sistem Akademik (SIAKAD)         - Pengadaan Soal Ujian            |
|  - Learning Management System       - Aplikasi Mobile Native          |
+-----------------------------------------------------------------------+

```

#### In-Scope (Termasuk dalam Proyek):

* **Landing Page Informatif:** Informasi kuota, alur pendaftaran, biaya, dan jadwal.
* **Manajemen Autentikasi:** Registrasi Akun Orang Tua/Siswa menggunakan email dan proteksi *database*.
* **Pengisian Formulir Elektronik:** Input data personal, data orang tua, dan unggah dokumen pendukung (KK, Akta Kelahiran, dll.).
* **Sistem Pembayaran Terintegrasi:** Pembayaran biaya pendaftaran dan uang pangkal melalui *Payment Gateway*.
* **Modul Ujian/Tes Online (CBT):** Sistem pengerjaan tes masuk dasar untuk calon siswa (khusus SMP) atau jadwal observasi (khusus SD).
* **Sistem Pengumuman:** Dashboard hasil seleksi yang dapat diakses secara *real-time* setelah tanggal pengumuman.
* **Dashboard Admin & Keuangan:** Panel khusus untuk panitia SPMB memverifikasi dokumen, memantau pembayaran, dan menginput nilai.

#### Out-of-Scope (Di luar Proyek):

* Sistem Informasi Akademik (SIAKAD) setelah siswa diterima (misal: absensi, nilai rapor semester).
* *Learning Management System* (LMS) untuk kegiatan belajar mengajar harian.
* Pembuatan konten atau bank soal ujian (disediakan oleh pihak sekolah).
* Aplikasi mobile native (iOS/Android). Aplikasi akan dikembangkan berbasis *Web Responsive*.

---

## 2. User Personas & User Roles

Sistem ini membagi hak akses ke dalam 4 *role* utama yang dikelola melalui Supabase Auth dan tabel profil:

| User Role | Deskripsi | Hak Akses Utama |
| --- | --- | --- |
| **Guest / Public** | Calon pendaftar yang belum membuat akun. | * Melihat Landing Page, informasi biaya, kuota, dan panduan pendaftaran. |
| **Pendaftar (Orang Tua/Siswa)** | Pengguna yang telah terautentikasi. | * Mengisi & mengubah formulir pendaftaran.<br>

<br>* Mengunggah berkas syarat.<br>

<br>* Melakukan pembayaran.<br>

<br>* Mengikuti tes online.<br>

<br>* Melihat pengumuman kelulusan. |
| **Admin Panitia SPMB** | Staf seleksi sekolah. | * Melakukan verifikasi berkas pendaftaran.<br>

<br>* Mengelola jadwal tes dan memantau ujian.<br>

<br>* Menginput nilai observasi/manual.<br>

<br>* Mengubah status kelulusan siswa. |
| **Admin Keuangan (Finance)** | Staf administrasi keuangan. | * Memantau arus kas masuk dari *payment gateway*.<br>

<br>* Melakukan verifikasi manual jika ada kendala sistem pembayaran.<br>

<br>* Mengubah status pembayaran (Uang Pangkal/Pendaftaran). |

---

## 3. Functional Requirements (Kebutuhan Fungsional)

Arsitektur fitur dirancang dengan mengoptimalkan kombinasi **React TypeScript (Vite)** di sisi *frontend* dan **Supabase Ecosystem** di sisi *backend*.

### 3.1 Autentikasi & Registrasi (Supabase Auth)

* **FR-AUTH-01:** Sistem harus mendukung pendaftaran akun menggunakan kombinasi *Email & Password* dengan enkripsi standar Supabase.
* **FR-AUTH-02:** Sistem harus menyediakan opsi *Magic Link SignIn* via email untuk mempermudah orang tua murid masuk tanpa menghafal *password*.
* **FR-AUTH-03:** Sistem wajib mengimplementasikan *Session Management* di React via Supabase Auth Context, otomatis *logout* jika sesi kedaluwarsa.

### 3.2 Manajemen Pengguna & Formulir Profil

* **FR-PROF-01:** Pendaftar dapat memilih jenjang pendidikan (SD atau SMP). Pilihan ini akan menentukan skema formulir berikutnya.
* **FR-PROF-02:** Sistem harus menyediakan formulir multi-langkah (*Multi-step Form* menggunakan React Stateful) untuk mencatat: Data Calon Siswa, Data Orang Tua/Wali, dan Riwayat Sekolah.
* **FR-PROF-03:** Pendaftar dapat mengunggah dokumen (Format: PDF, JPG, PNG; Maksimal 2MB per file) yang akan langsung disimpan ke dalam **Supabase Storage** di *bucket* `dokumen-pendaftaran`.

### 3.3 Sistem Pembayaran (Payment Gateway Integration)

* **FR-PAY-01:** Sistem harus terintegrasi dengan *Payment Gateway* (seperti Midtrans/Xendit) menggunakan **Supabase Edge Functions** sebagai *webhook receiver* yang aman.
* **FR-PAY-02:** Pendaftar dapat memilih metode pembayaran (Virtual Account, E-Wallet, QRIS) untuk Biaya Pendaftaran dan Biaya Uang Pangkal.
* **FR-PAY-03:** Status pembayaran pada *database* PostgreSQL Supabase harus berubah otomatis secara *real-time* dari `PENDING` menjadi `SUCCESS` setelah menerima *callback webhook*.

### 3.4 Modul Tes Online / Computer Based Test (CBT)

* **FR-TEST-01:** Untuk jenjang SMP, sistem harus menyediakan halaman ujian berkunci (tidak bisa *back/refresh* sembarangan) yang menampilkan soal pilihan ganda dari *database* Supabase.
* **FR-TEST-02:** Sistem harus memiliki fungsi *timer countdown* berbasis *client-side* (React state) dan divalidasi *server-side* (Supabase timestamps) untuk mencegah kecurangan waktu.
* **FR-TEST-03:** Untuk jenjang SD, modul ini berupa penjadwalan observasi tatap muka yang tanggalnya dapat dipilih oleh Orang Tua berdasarkan kuota tersedia.

### 3.5 Dashboard Admin (Back-Office)

* **FR-ADM-01:** Admin dapat menyaring (filter) data pendaftar berdasarkan status berkas (`Belum Diverifikasi`, `Valid`, `Tidak Valid`).
* **FR-ADM-02:** Admin dapat mengunduh seluruh dokumen pendaftar secara masal memanfaatkan kapabilitas *zip download* dari Supabase Storage URL.
* **FR-ADM-03:** Admin Keuangan memiliki akses ke grafik pendapatan harian/mingguan yang datanya ditarik langsung via *Supabase Realtime subscription* dari tabel `payments`.

---

## 4. Non-Functional Requirements (Kebutuhan Non-Fungsional)

### 4.1 Performa & Frontend Optimization (React + Vite)

* **NFR-PERF-01 (Load Time):** Target *First Contentful Paint (FCP)* harus di bawah **1.5 detik**, dan *Time to Interactive (TTI)* di bawah **2 detik** pada jaringan 4G standar.
* **NFR-PERF-02 (Code Splitting):** Wajib menggunakan `React.lazy()` dan `Suspense` untuk memisahkan *bundle* halaman publik, halaman pendaftar, dan halaman admin (*Route-based code splitting*) agar ukuran *initial bundle* JavaScript tetap kecil.
* **NFR-PERF-03 (State & Asset):** Menggunakan Vite dengan kompresi aset otomatis (Vite-plugin-compression) menghasilkan format `.webp` untuk gambar, dan Tailwind CSS/Shadcn UI untuk memastikan hilangnya *unused CSS classes* saat *production build*.

### 4.2 Keamanan & Proteksi Data (Supabase Security Architecture)

```
       [ Request dari React App / Client Frontend ]
                           |
                           v
          [ Supabase API Gateway / Kong ]
                           |
                           v
    [ Row Level Security (RLS) Authentication Check ]
      - Apakah User Authenticated?
      - Apakah User ID sesuai dengan Pemilik Data?
      - Apakah User Role = 'Admin'?
                           |
        +------------------+------------------+
        | Pas Keluar       | Gagal            |
        v                  v                  v
[ PostgreSQL Tables ]  [ Denied ]     [ Supabase Storage ]

```

* **NFR-SEC-01 (Row Level Security - RLS):** * Setiap tabel di PostgreSQL Supabase **wajib** mengaktifkan RLS (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`).
* Pendaftar hanya diizinkan melakukan `SELECT`, `INSERT`, dan `UPDATE` pada baris data milik mereka sendiri berdasarkan `auth.uid()`.
* Hanya pengguna dengan *role* `admin` di dalam tabel `user_roles` yang diberikan akses `ALL` untuk seluruh data pendaftar.


* **NFR-SEC-02 (Storage Security):** *Bucket* Supabase Storage untuk dokumen pendaftaran diset sebagai **Private**. Akses unduh file hanya dapat dilakukan melalui *Authenticated Signed URLs* dengan masa kedaluwarsa maksimal 15 menit.
* **NFR-SEC-03 (Data Encryption):** Data sensitif seperti Nomor Induk Kependudukan (NIK) orang tua dan siswa harus dienkripsi di tingkat kolom (*Column-level encryption*) menggunakan ekstensi `pgcrypto` bawaan PostgreSQL di Supabase sebelum disimpan ke *disk*.

---

## 5. Rekomendasi Arsitektur Spesifik

1. **Bahasa Pemrograman:** Sangat direkomendasikan menggunakan **TypeScript** pada React Vite. Hal ini menjamin tipe data skema tabel dari Supabase dapat di-generate otomatis via CLI (`supabase gen types typescript`), mengurangi potensi *runtime bug* saat validasi data formulir pendaftaran.
2. **UI/UX Component:** Gunakan **Shadcn UI** (yang berbasis Radix Primitives & Tailwind CSS). Ini akan mempercepat pembangunan *dashboard admin* dan komponen formulir pendaftaran karena aksesibilitasnya yang tinggi dan desainnya yang bersih secara *out-of-the-box*.