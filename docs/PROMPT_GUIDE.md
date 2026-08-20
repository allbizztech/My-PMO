# PROMPT_GUIDE.md
> Panduan prompt untuk membangunkan projek menggunakan starter kit ini bersama antigravity.
> Tiga fasa sahaja — Faham, Bina, Selesai.

---

## Struktur Starter Kit

```
starterkit/
├── AGENTS.md
└── docs/
    ├── STANDARDS.md
    ├── SECURITY.md
    ├── SCHEMA.md
    ├── PROJECT_PROFILE.md
    └── PROMPT_GUIDE.md
```

**Langkah persediaan sebelum mula:**
1. Copy folder `starterkit/` ke dalam `laragon/www/nama_projek/`
2. Buka VS Code → Open Folder → pilih folder projek
3. Isi `docs/PROJECT_PROFILE.md` dengan maklumat projek
4. Buka terminal dalam VS Code (Ctrl + `)

---

## FASA 1 — FAHAM

> AI membaca semua fail konteks, menyenaraikan fungsi yang akan dibina,
> mencadangkan susunan kerja dan meminta kebenaran sebelum mula.

**Hantar prompt ini sekali sahaja pada permulaan projek:**

```
Sila baca fail-fail berikut mengikut urutan:
1. AGENTS.md
2. docs/STANDARDS.md
3. docs/SECURITY.md
4. docs/PROJECT_PROFILE.md
5. docs/SCHEMA.md

Selepas membaca, sila:
1. Ringkaskan projek ini dalam 3 baris
2. Senaraikan SEMUA fungsi yang perlu dibina beserta
   cadangan fail yang akan dicipta untuk setiap fungsi
3. Cadangkan fungsi mana yang patut dibina dahulu
   dan jelaskan sebabnya
4. Tanya jika ada maklumat yang tidak jelas

Jangan tulis sebarang kod lagi. Tunggu kelulusan saya.
```

**AI akan balas dengan sesuatu seperti ini:**
```
Projek: Sistem Pengurusan Aduan IT (SPAIT)
...

Fungsi yang akan dibina:
1. Log Masuk (2FA)         → login.php, verify.php, functions/auth.php
2. Dashboard               → dashboard.php
3. Modul Aduan             → modules/aduan/list.php, create.php, store.php ...
4. Laporan                 → modules/laporan/index.php, export.php
...

Cadangan urutan: Mulakan dengan Log Masuk dahulu kerana
semua modul lain bergantung kepada pengesahan pengguna.

Setuju dengan susunan ini?
```

**Jawapan pelajar — pilih satu:**
```
Setuju. Teruskan.
```
```
Setuju tetapi mula dengan [nama fungsi lain].
```
```
Ubah [nama fungsi] — [terangkan perubahan yang diperlukan].
```

---

## FASA 2 — BINA

> AI memulakan kerja fungsi demi fungsi.
> Sebelum menulis kod, AI akan minta kebenaran cara jana — semua sekaligus atau satu persatu.

**Setiap kali AI mula fungsi baharu, ia akan tanya:**
```
Saya akan mulakan fungsi: Log Masuk (2FA)

Fail yang akan dicipta:
- public/login.php
- public/verify.php
- public/dashboard.php
- functions/auth.php
- functions/csrf.php

Kemaskini docs/SCHEMA.md dengan table baharu:
- pengguna
- pin_2fa

Nak saya bina semua fail sekaligus atau satu persatu?
```

**Jawapan pelajar — pilih satu:**
```
Semua sekaligus.
```
```
Satu persatu.
```

---

### Semasa Proses Bina

**Jika kod diterima dan ada fail seterusnya:**
```
Diterima. Sambung.
```

**Jika perlu pindaan:**
```
Ubah [bahagian yang perlu diubah].
Kemudian sambung.
```

**Jika ada ralat semasa ujian:**
```
Ralat pada [nama fail]:
[tampal mesej ralat]

Betulkan fail ini sahaja. Jangan ubah fail lain.
```

**Jika AI teruskan tanpa kebenaran:**
```
Berhenti. Tunggu arahan saya.
```

---

## FASA 3 — SELESAI

> AI mengisytiharkan kerja selesai, menyenaraikan fail dan memberikan langkah pengujian.
> Pelajar menguji — kemudian keluluskan untuk teruskan ke fungsi seterusnya.

**AI akan isytihar selesai secara automatik:**
```
Fungsi Log Masuk (2FA) selesai.

Fail yang telah dicipta:
- public/login.php
- public/verify.php
- public/dashboard.php
- functions/auth.php
- functions/csrf.php

Schema dikemaskini:
- Table pengguna
- Table pin_2fa

Langkah pengujian:
1. Buka http://localhost/nama_projek/login.php
2. Masukkan alamat emel yang sah
3. Semak emel — kod PIN perlu diterima
4. Masukkan PIN — dashboard perlu dipaparkan
5. Cuba akses dashboard.php terus tanpa log masuk —
   perlu redirect ke login.php

BERHENTI. Lakukan pengujian dan maklumkan hasilnya.
```

**Selepas pengujian, jawapan pelajar — pilih satu:**

**Jika semua lulus — teruskan ke fungsi seterusnya:**
```
Semua pengujian lulus.
Kemaskini docs/CHANGELOG.md.
Teruskan ke fungsi seterusnya.
```

**Jika ada isu — betulkan dulu:**
```
Pengujian [nombor] gagal:
[terangkan masalah]

Betulkan dahulu sebelum teruskan.
```

**Jika ingin tambah sesuatu sebelum teruskan:**
```
Sebelum teruskan, tambah [perkara yang ingin ditambah]
dalam fungsi ini.
```

---

## Sesi Baharu — Sambung Semula

Apabila membuka semula VS Code selepas sesi ditutup,
AI tidak mengingati apa yang telah dibuat.

```
Sambung projek ini.

Sila baca AGENTS.md, docs/PROJECT_PROFILE.md
dan docs/SCHEMA.md untuk semak semula konteks.

Fungsi yang telah selesai: [senaraikan]
Fungsi seterusnya: [nama fungsi]
```

> Tidak perlu baca semula STANDARDS.md dan SECURITY.md —
> AGENTS.md sudah merangkumi arahan rujukan tersebut.

---

## Rujukan Cepat — Penggunaan Token

| Fasa | Fail Dirujuk | Token |
|------|-------------|-------|
| Fasa 1 — Permulaan projek | AGENTS + STANDARDS + SECURITY + PROJECT_PROFILE + SCHEMA | Tinggi — sekali sahaja |
| Fasa 2 — Bina | Tiada rujukan tambahan | Sangat rendah |
| Fasa 3 — Selesai | Tiada | Sangat rendah |
| Sesi sambungan | AGENTS + PROJECT_PROFILE + SCHEMA | Sederhana |
