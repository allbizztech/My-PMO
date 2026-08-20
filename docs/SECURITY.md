# SECURITY.md
> Wajib diikuti pada setiap form, setiap process file, setiap halaman.

## Rules Wajib
1. Jangan percaya input pengguna — validate semua
2. Guna PDO prepared statements — tiada interpolasi string dalam SQL
3. Escape semua output dengan `h()` — `htmlspecialchars($val, ENT_QUOTES, 'UTF-8')`
4. Setiap form yang ubah data mesti ada CSRF token
5. Setiap halaman terhad mesti semak sesi login
6. Setiap tindakan sensitif mesti semak role pengguna
7. Jangan papar ralat teknikal kepada pengguna dalam production
8. Jangan simpan password dalam plaintext — guna `password_hash(PASSWORD_BCRYPT)`

## CSRF
- Form: `<input type="hidden" name="csrf_token" value="<?= h(csrf_token()) ?>">`
- Process file (store, update, delete): panggil `csrf_verify()` di baris pertama
- Token dirotate selepas setiap verify — jangan guna semula

## Pengesahan Identiti (Auth)
- Setiap halaman terhad: panggil `require_login()` di baris pertama
- Selepas login berjaya: `session_regenerate_id(true)` — elak session fixation
- Simpan dalam sesi: `user_id`, `user_name`, `user_role` sahaja
- Jangan simpan: password, objek pengguna penuh, token

## Validasi Input
| Jenis Input | Cara Validasi |
|-------------|--------------|
| ID (URL/POST) | `FILTER_VALIDATE_INT` — tolak jika false atau <= 0 |
| Emel | `FILTER_VALIDATE_EMAIL` |
| Teks | `trim()` + semak tidak kosong |
| ENUM / status | Semak dalam array nilai yang dibenarkan |
| Tarikh | `DateTime::createFromFormat()` |
| Muat naik fail | Semak `$_FILES['error']`, MIME type, sambungan, saiz |
| Nombor | `is_numeric()` atau `FILTER_VALIDATE_FLOAT` |

Tolak dan redirect serta-merta jika validasi kritikal gagal — jangan teruskan pelaksanaan.

## Padam (Delete)
- Wajib guna POST — bukan GET
- Semak `$_SERVER['REQUEST_METHOD'] !== 'POST'` di baris pertama process file
- Form padam mesti ada CSRF token dan `onsubmit="return confirm(...)"` 

## Muat Naik Fail
- Semak MIME type menggunakan `finfo` — bukan hanya sambungan
- Jenis dibenarkan: `image/jpeg`, `image/png`, `application/pdf`
- Saiz maksimum: 2MB
- Namakan semula fail: `uniqid('file_', true) . '.' . $ext` — jangan guna nama asal
- Simpan di luar `public/` jika boleh

## Perlindungan Folder
- `config/`, `functions/`, `storage/`, `uploads/` — tambah `.htaccess` `Deny from all`
- Root projek: `Options -Indexes`

## Ralat dalam Production
- `display_errors = 0`, `error_reporting = 0`
- Log ralat ke fail — jangan papar kepada pengguna
- Jangan dedahkan: SQL query, path server, stack trace, nilai `.env`
