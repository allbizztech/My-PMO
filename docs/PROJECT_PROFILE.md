# PROJECT_PROFILE.md
> Fail konteks projek untuk AI. Isi sebelum mula sebarang sesi coding.
> AI perlu baca fail ini bersama AGENTS.md, STANDARDS.md, SECURITY.md dan SCHEMA.md.

---

## Identiti Projek

| Medan | Nilai |
|-------|-------|
| Nama Projek | Sistem Pengurusan Projek - My-PMO |
| Kod Pendek | MY-PMO |
| Klien / Pemilik | Pejabat Ketua Pendaftar Mahkamah Persekutuan|
| Pembangun | Muhammad Izzat Bin Mansor |
| Tarikh Mula | 20 Mei 2026 |
| URL Tempatan | http://localhost/ |
| Nama Database | my_pmo_db |

---

## Penerangan Sistem

> Terangkan dalam 2 hingga 4 ayat — apa yang sistem ini buat, siapa penggunanya, dan masalah apa yang ia selesaikan.

Sistem pengurusan projek yang membantu pengurus projek memantau kemajuan projek, mengurus sumber, dan berkomunikasi dengan pasukan.

---

## Peranan Pengguna

| Peranan | Penerangan | Kebenaran Utama |
|---------|-----------|----------------|
| Superadmin | Ketua Pengarah / Pengurus Sistem (Global) | Akses penuh CRUD untuk semua agensi dan modul |
| Admin Agensi | Penyelaras peringkat Agensi | Akses CRUD terhad dalam agensi sendiri sahaja |
| Kewangan | Pegawai Kewangan Agensi | Akses CRUD modul kewangan/invois agensi sahaja |
| PMO Kerajaan | Pengurus Projek (Kerajaan) | Akses CRUD projek yang ditugaskan |
| PMO Vendor | Pengurus Projek (Kontraktor) | Akses CRUD terhad kepada projek yang dibangunkan |
| Pengurusan | Pembuat Dasar / Pihak Pengurusan | Akses "View Only" laporan dan metrik agensi/sistem |

---

## Fungsi Sistem

> Senaraikan fungsi utama dalam ayat ringkas. Tidak perlu nama fail atau nama modul — AI akan tentukan sendiri.

- Pengurusan Profil Projek (Direktori Projek, Kemajuan, Kesihatan)
- Pengurusan Tugasan berasaskan Kanban
- Pemantauan Kewangan dan Invois Projek
- Repositori Dokumen Pintar (DMS) berasaskan projek
- Log Audit Sistem & Penjejakan Keselamatan
- Papan Pemuka Analitik Reaktif (Metrik & Laporan)

---

## Timbunan Teknologi

| Lapisan | Pilihan |
|---------|---------|
| Backend (API)| PHP 8.x — REST API (JSON) tanpa framework besar |
| Pangkalan Data | MySQL 8.x — PDO prepared statements |
| Frontend | React (Vite), Tailwind CSS, Lucide Icons |
| Server | Apache / Laragon (tempatan) & Node.js (untuk dev frontend) |
| Alat AI | Antigravity |

---

## Peraturan Perniagaan

> Peraturan yang mempengaruhi cara sistem berfungsi — urutan proses, had akses, sekatan, atau logik khas.

1. **Skop Tunggal Agensi (PKPMP):** Sistem ini beroperasi khusus secara eksklusif untuk Pejabat Ketua Pendaftar Mahkamah Persekutuan (PKPMP) dan Badan Kehakiman Malaysia. Semua rekod projek, dokumen, kewangan, dan pengguna tertumpu pada domain PKPMP (domain e-mel: `@kehakiman.gov.my`).
2. **Kesihatan Projek:** Kesihatan projek ditentukan oleh kemajuan (Progress); >75% (Cemerlang/Baik), <50% (Amaran/Berisiko).
3. **Log Audit Mandatori:** Semua tindakan mencipta, mengemas kini, memadam, dan memuat turun (CRUD) mesti direkod dalam jadual log audit untuk tujuan keselamatan dan ketelusan.

---

## Medan Status (ENUM)

> Nilai tetap yang digunakan dalam sistem. AI akan guna nilai ini dalam schema dan semakan input.

| Konteks | Nilai |
|---------|-------|
| Status Projek | 'Aktif', 'Tertunda', 'Selesai' |
| Kesihatan Projek| 'Cemerlang', 'Baik', 'Amaran', 'Berisiko' |
| Status Tugasan  | 'pending' (Akan Datang), 'in_progress' (Sedang Berjalan), 'completed' (Selesai) |
| Status Kewangan | 'Selesai', 'Menunggu Kelulusan', 'Ditolak' |
| Status Pengguna | 'Aktif', 'Tidak Aktif' |

---

## Gaya Visual

> Warna dan gaya antara muka yang perlu diikuti oleh AI semasa jana HTML/CSS.

| Elemen | Nilai |
|--------|-------|
| Warna Utama | Indigo (#4f46e5) |
| Warna Sekunder | Emerald (#10b981) untuk "success", Rose (#e11d48) untuk "danger", Amber (#f59e0b) untuk "warning" |
| Warna Aksen | Slate/Dark (#0f172a) untuk elemen korporat/profesional |
| Warna Latar | Slate-50 (#f8fafc) untuk aplikasi, Slate-950 (#020617) untuk halaman log masuk/landing |
| Fon | Sans-serif moden (cadangan: Inter / Roboto) |
| Gaya UI | Moden, korporat, bersih, sedikit "glassmorphism", bucu bulat besar (rounded-2xl) |

> Nota: Reka bentuk HTML/CSS hendaklah mengadaptasi prototaip asal (Tailwind/React) ke dalam sistem kelas Bootstrap 5 dan CSS Vanilla bagi memadankan rupa.

---

## Nota untuk AI

> Tulis hanya perkara khusus untuk projek ini yang tidak diliputi oleh STANDARDS.md atau SECURITY.md.

- Prototaip sistem terletak dalam fail `app.jsx`. Pindahkan logik dan gaya dari React/Tailwind tersebut kepada format PHP Procedural/Bootstrap.
- Sila patuhi struktur folder ketat yang dinyatakan dalam `AGENTS.md`. Tiada kelas controller. Semua logik dalam fail modul (`list.php`, `create.php`, `store.php`, dll).
