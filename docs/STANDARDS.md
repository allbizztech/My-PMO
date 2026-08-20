# STANDARDS.md
> Piawaian pembangunan, konvensyen kod dan struktur modul.

## Keutamaan (bila konflik)
Ketepatan → Keselamatan → Kebolehselenggaraan → Konsistensi → Kebolehbacaan

## Penamaan (Naming)
| Konteks | Konvensyen | Contoh |
|---------|-----------|--------|
| Variable PHP | snake_case | `$user_id`, `$jumlah_rekod` |
| Fungsi PHP | snake_case | `get_user_by_id()`, `aduan_cipta()` |
| Table DB | snake_case plural | `pengguna`, `aduan_it`, `tempahan_bilik` |
| Column DB | snake_case | `created_at`, `pengguna_id`, `nama_fail` |
| Fail | snake_case | `store.php`, `functions.php` |
| Pemalar | UPPER_CASE | `APP_NAME`, `MAX_UPLOAD_SIZE` |

- Istilah domain → Bahasa Malaysia: `aduan`, `pengguna`, `tempahan`
- Istilah teknikal → English: `store`, `update`, `list`, `created_at`
- Prefix fungsi ikut nama modul: `aduan_get_all()`, `pelawat_cipta()`, `pengguna_padam()`

## Struktur Fail
- Fungsi dikongsi → `functions/`
- Fungsi khusus modul → `public/modules/{modul}/functions.php`
- Sambungan DB → `config/db.php` sahaja
- Nilai persekitaran → `.env` sahaja — jangan hardcode credentials dalam PHP

## Rules PHP
- Output: escape semua dengan `h()` — `htmlspecialchars($val, ENT_QUOTES, 'UTF-8')`
- Query: PDO prepared statements wajib — jangan interpolasi variable dalam SQL
- Redirect: `header('Location: ...')` mesti diikuti `exit` serta-merta
- Input: guna `filter_input()` atau `filter_var()` untuk semua input pengguna
- Mesej ralat/berjaya: simpan dalam `$_SESSION`, papar dan `unset` serta-merta
- Setiap fail PHP yang perlukan DB atau sesi: mulakan dengan `require_once __DIR__ . '/../../config/bootstrap.php'`

## Konvensyen Modul
- `list.php` — papar rekod, carian, pagination
- `create.php` — papar form cipta
- `store.php` — proses cipta: validate → insert → log → redirect
- `edit.php` — papar form kemaskini dengan data sedia ada
- `update.php` — proses kemaskini: validate → update → log → redirect
- `delete.php` — proses padam: POST sahaja → validate → padam → log → redirect
- `functions.php` — fungsi khusus modul sahaja

Jangan campurkan logik proses dalam display files (list, create, edit).

## Model Kebenaran (Permission)
- Semak role dalam **process file** — bukan hanya sembunyi butang di UI
- Guna `require_role($role)` yang redirect dengan mesej ralat jika akses ditolak

| Peranan | Cipta | Lihat | Kemaskini | Padam | Lulus |
|---------|-------|-------|-----------|-------|-------|
| Admin | ✓ | ✓ | ✓ | ✓ | ✓ |
| Pegawai | ✓ | ✓ | ✓ | — | — |
| Pengguna | — | ✓ | — | — | — |

## Logging
- Log tindakan penting: login, logout, login gagal, cipta, kemaskini, padam, muat naik, lulus, tolak, akses ditolak
- Guna: `log_action($pdo, $user_id, 'create', 'aduan', $record_id, 'Keterangan')`
- Jangan log: password, token, data sesi penuh

## Konfigurasi Persekitaran
- Semua nilai konfigurasi dalam `.env`
- Load melalui `config/bootstrap.php` — jangan baca `.env` terus dalam modul
- Nilai utama: `APP_NAME`, `APP_ENV`, `APP_DEBUG`, `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS`

## Schema Database
- Kunci utama: `id INT AUTO_INCREMENT PRIMARY KEY`
- Kunci asing: `{singular_table}_id` — contoh: `pengguna_id`, `bilik_id`
- Timestamp: `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
- Soft delete: `deleted_at TIMESTAMP NULL DEFAULT NULL`
- Setiap perubahan schema mesti dikemas kini dalam `schema.sql`

## UI & Reka Bentuk
- Setiap halaman mesti nampak korporat, profesional dan interaktif
- Guna Bootstrap 5 — ikut palet warna dalam `PROJECT_PROFILE.md`
- Pastikan responsif untuk desktop dan tablet

## Senarai Semak Ujian (per modul)
- [ ] Input normal — simpan dengan betul
- [ ] Medan wajib kosong — tunjuk ralat, tiada insert
- [ ] Format tidak sah (emel, nombor) — ditolak
- [ ] Data duplikasi — ditangani
- [ ] Token CSRF tiada — ditolak
- [ ] Role salah — redirect dengan ralat
- [ ] Redirect berjaya berfungsi
- [ ] Mesej ralat/berjaya papar dan hilang
- [ ] Rekod DB betul selepas operasi
- [ ] Entri log dicipta
