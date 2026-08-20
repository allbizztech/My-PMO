# AGENTS.md
> Baca fail ini dahulu sebelum menulis sebarang kod.

## Stack
- Frontend: React, Vite, Tailwind CSS, Lucide React
- Backend (API): PHP (REST API), PDO MySQL
- Database: MySQL
- Server: Apache / Laragon (tempatan)

Jangan guna: Laravel, CodeIgniter, Symfony, atau framework PHP berat yang lain. Kita bina API ringkas.

---

## Struktur Projek

```
project/
├── client/                  ← Frontend React (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── api/                     ← Backend PHP (REST API)
│   ├── config/
│   │   └── db.php
│   ├── modules/
│   │   ├── auth.php
│   │   ├── projects.php
│   │   └── ...
│   ├── functions/
│   │   ├── helpers.php
│   │   ├── cors.php
│   │   └── log.php
│   └── uploads/
├── docs/
├── .env
└── schema.sql
```

`api/config/`, `api/functions/`, `.env`, `docs/` — dilindungi dan tidak boleh diakses terus dari browser (kecuali melalui request API).

---

## Aliran Halaman Standard

```
React (Frontend) → Fetch API (POST/GET) 
  → PHP API (Terima JSON) → Validate → Semak Auth (Sesi / Token)
    → Operasi DB (PDO) → Response JSON → React (Render UI)
```

Semua endpoint API mesti menyokong CORS dan mengembalikan response dalam format JSON.

---

## Sebelum Tulis Kod

Setiap modul baru — **cadang dulu, tunggu kelulusan, baru tulis kod**:

1. Struktur table DB
2. Senarai endpoint API
3. Komponen Frontend React
4. Rules validasi
5. Semakan permission

---

## Cara Jana Kod

Ikut arahan pembangun. Panduan umum:

| Situasi | Pendekatan |
|---------|-----------|
| Modul CRUD standard | Jana komponen Frontend dan fail API Backend sekaligus |
| Modul kompleks (approval, upload, integrasi) | Jana satu fail/modul dahulu, tunggu pengesahan |
| Pembetulan ralat | Fokus kepada fail bermasalah sahaja — jangan ubah fail lain |
| Perubahan schema | Kemaskini `docs/SCHEMA.md` dahulu sebelum jana kod |

Jika pembangun tidak nyatakan pendekatan, tanya terlebih dahulu.

---

## Fail Rujukan

| Fail | Baca bila |
|------|-----------|
| `docs/STANDARDS.md` | Bina mana-mana modul |
| `docs/SECURITY.md` | Setiap endpoint API, pengesahan, form frontend |
| `docs/PROJECT_PROFILE.md` | Konteks projek, roles, fungsi sistem |
| `docs/SCHEMA.md` | Setiap query dan perubahan schema |

---

## Aliran Kerja Schema

1. Cadang struktur table dalam chat dahulu
2. Tunggu kelulusan pembangun
3. Tulis ke `docs/SCHEMA.md` selepas diluluskan sahaja
4. Ikut format sedia ada dalam `docs/SCHEMA.md`
5. Tambah entri dalam bahagian Changelog
