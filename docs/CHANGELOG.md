# CHANGELOG.md
> Track all significant changes made to this project.
> Update this file after every meaningful development session.

---

## Format

```
## [version or date] — Short title

### Added
- New features or files

### Changed
- Modified behaviour or structure

### Fixed
- Bug fixes

### Schema
- Database changes

### Notes
- Decisions made, reasons, trade-offs
```

---

## [17 September 2026] — Pembaikan Log Masuk, Sistem Notifikasi Pintar & Konfigurasi SMTP

### Added
- Modul backend API Tetapan SMTP (`api/modules/smtp_settings.php`) menyokong simpanan konfigurasi, keselamatan kata laluan bertopeng, dan ujian diagnostik sambungan pelayan SMTP (`test_connection`).
- Tab baharu "Konfigurasi E-mel (SMTP)" dan "Peraturan Notifikasi Pintar (Auto-Alert)" dalam `SettingsPage`.
- Pusat Notifikasi Bar Atas yang dinaik taraf dengan lencana jenis amaran (Kritikal/Amaran/Maklumat), status masa nyata, butang segar semula, dan pautan terus pantas ke fasa projek berkaitan.

### Changed
- Enjin `api/modules/notifications.php` dinaik taraf untuk menganalisis data masa nyata secara automatik:
  - Pengesanan projek berstatus 'Berisiko' / 'Amaran' atau kemajuan < 40%.
  - Peringatan awal 30 hari sebelum tarikh matang bayaran atau amaran lewat melepasi sasaran fasa kewangan/milestone.
  - Pengesanan tugasan kanban yang tertunggak melepasi tarikh akhir (`due_date`).
- Menyokong tindakan `mark_as_read` secara berpusat dalam pangkalan data.

### Fixed
- Menyelesaikan isu ralat "Gagal menyambung ke pelayan API" semasa log masuk dengan memulakan dan mengesahkan servis Apache (`httpd`) dan MySQL (`mysqld`) pada persekitaran tempatan XAMPP.

### Schema
- Menambah jadual `smtp_settings` untuk konfigurasi pelayan e-mel dan tetapan toggle amaran.
- Menambah jadual `notifications` untuk penyimpanan dan status bacaan notifikasi pintar.
- Menambah lajur `milestone_id` dalam jadual `finances` untuk pautan jadual bayaran.

---

<!-- Copy the block above for each new entry -->
