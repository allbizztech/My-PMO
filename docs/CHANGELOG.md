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

## [19 September 2026] — Integrasi Logo Rasmi Sistem MY-PMO (Transparent Background)

### Added
- **Logo Rasmi Sistem Baharu (`client/public/logo.png` & `favicon.png`)**:
  - Mengimport logo grafik rasmi sistem **MY-PMO** yang mengandungi elemen papan klip senarai semak, carta Gantt, gear teknologi, ikon pasukan, anak panah dinamik, dan tipografi rasmi.
  - Membuang latar belakang putih kanvas (*background removal*) dengan teknik *anti-aliased alpha matting* beresolusi tinggi (951x947 piksel), menghasilkan bucu bulat (*squircle*) lutsinar yang licin dan kemas.
  - Menggantikan placeholder ikon `Shield` lama dengan logo baharu di semua lokasi utama:
    - Bar Sisi Utama & Drawer Mudah Alih ([App.jsx](file:///d:/xampp/htdocs/My-PMO/client/src/App.jsx))
    - Pengaki Rasmi Sistem ([App.jsx](file:///d:/xampp/htdocs/My-PMO/client/src/App.jsx))
    - Halaman Log Masuk ([LoginPage.jsx](file:///d:/xampp/htdocs/My-PMO/client/src/pages/LoginPage.jsx))
    - Pengepala Halaman Utama ([LandingPage.jsx](file:///d:/xampp/htdocs/My-PMO/client/src/pages/LandingPage.jsx))
    - Favicon pelayar & tajuk dokumen rasmi ([index.html](file:///d:/xampp/htdocs/My-PMO/client/index.html))

---

## [19 September 2026] — Penambahbaikan Menyeluruh Responsif Mudah Alih (Mobile UI & UX)

### Changed
- **Pengepala & Navigasi Utama (`App.jsx`)**:
  - **Penyatuan Butang Toggle Menu (*Unified Hamburger Menu*)**: Menggabungkan kawalan kuncup/kembang bar sisi dan pembuka menu mudah alih kepada satu butang garis 3 (`☰`) universal di pengepala atas (*top header*). Butang anak panah pendua (`<`) di kepala bar sisi telah dibuang sepenuhnya, menghapuskan kekeliruan dua ikon bersebelahan.
  - **Menu Laci Sisi (*Sidebar Drawer*)**: Menambah butang tutup `X` yang jelas di sudut kanan atas laci navigasi mudah alih dan menutup laci secara automatik sebaik sahaja pautan atau kad profil ditekan.
  - **Ketinggian Header Ergonomik**: Ketinggian bar atas dioptimumkan kepada `h-16 lg:h-24` untuk menjimatkan ruang menegak pada skrin telefon pintar.
  - **Ikon Profil Pantas Mudah Alih**: Menambah butang profil khas bersebelahan loceng notifikasi untuk pengguna telefon mengakses modal kemaskini akaun dan kata laluan dengan satu sentuhan.
  - **Menu Notifikasi Fleksibel**: Menyelaraskan panel dropdown notifikasi (`fixed sm:absolute inset-x-3 sm:inset-auto sm:right-0 mt-3 sm:w-96`) bagi mengelakkan limpahan (*horizontal clipping*) pada skrin 360px–480px.
  - **Penyelarasan Avatar Pengguna (*Collapsed Sidebar Avatar*)**: Memperbaiki kedudukan bulatan avatar biru ("Iz") dan kad profil di bahagian bawah bar sisi apabila dikuncupkan (*collapsed mode*). Padding dan penjajaran kini berpusat tepat (`flex flex-col items-center justify-center p-2`), menghapuskan masalah bulatan avatar terkeluar dari kad (*overflow/misaligned*), serta butang log keluar kini bertukar menjadi butang ikon petak simetri yang kemas.
  - **Ruang Kerja (`main`)**: Melaraskan padding luaran kepada `px-3 sm:px-6 lg:px-8` bagi mengoptimumkan saiz paparan kandungan pada peranti mudah alih.

- **Kalendar & Garis Masa Projek (`CalendarPage.jsx`)**:
  - **Grid 7-Hari Boleh Tatal**: Membungkus grid kalendar dalam bekas tatal mendatar (`overflow-x-auto min-w-[640px] lg:min-w-0`) bersama petunjuk panduan pengguna mudah alih (*"Tatal mendatar untuk paparan kalendar penuh"*), mengelakkan sel tarikh dan lencana acara daripada terhimpit atau terpotong.
  - **Tajuk Responsif**: Mengurangkan saiz fon tajuk utama kepada `text-2xl sm:text-3xl` bagi mengelakkan ruang atas skrin telefon dipenuhi baris tajuk berlebihan.

- **Senarai Projek (`ProjectListPage.jsx`)**:
  - **Jadual Projek Responsif**: Membungkus elemen `<table>` dengan bekas `overflow-x-auto` dan `min-w-[720px]`, membolehkan maklumat 7 lajur utama (Nama Projek, Kod, Agensi, Status, Kemajuan, PMO, Tindakan) diteliti dengan lancar tanpa kecacatan teks.
  - **Butang Tindakan & Carian Fleksibel**: Butang *Tapis*, *Eksport CSV*, dan *Projek Baharu* menyusun susun atur secara automatik (`flex-wrap sm:flex-nowrap`) mengikut lebar skrin pengguna.

- **Tetapan Sistem (`SettingsPage.jsx`)**:
  - **Bar Tab Boleh Leret (*Scrollable Tab Bar*)**: Menambah gaya `overflow-x-auto no-scrollbar whitespace-nowrap` pada bar navigasi 4 tab tetapan bagi mengelakkan tab panjang pecah kepada 3-4 baris bertingkat pada skrin telefon.

---

## [19 September 2026] — Pemurnian Halaman Utama (Fit 1 Page) & Pelebaran Paparan Grid Kalendar

### Changed
- **Pelebaran Paparan Kalendar (`CalendarPage.jsx`)**:
  - Membuang kad bar sisi *"Acara & Mesyuarat Bulan Ini"* mengikut arahan.
  - Memperluaskan kad grid kalendar 7-hari ke lebar penuh (*full width*), memberikan ruang paparan sel tarikh yang jauh lebih besar, luas, dan selesa untuk membaca perincian mesyuarat harian.
- **Pemurnian Halaman Utama / Pendaratan (`LandingPage.jsx`)**:
  - Membuang teks *"Portal Rasmi Badan Kehakiman Malaysia"* di bar maklumat atas, hanya mengekalkan lencana rasmi *"Pejabat Ketua Pendaftar Mahkamah Persekutuan Malaysia (PKPMP)"*.
  - Menghapuskan lencana pil ikon *"Bahagian Teknologi Maklumat (BTM) & Kewangan PKPMP"*.
  - Mengemas kini tajuk utama (*Hero Heading*) kepada: **"Sistem Pengurusan & Pemantauan Projek"**.
  - Menyelaraskan padding dan jarak menegak (*vertical spacing*) bagi membolehkan keseluruhan blok pengenalan, 3 statistik utama (*8 Fasa, 100% Aliran Bajet, Jejak Audit*), dan kad Panduan Akses Pengguna termuat kemas dalam 1 halaman (*fit 1 page above the fold*).
  - Skrol ke bawah hanya diperlukan apabila pengguna ingin meneliti butiran skop dan modul portal.

---

## [19 September 2026] — Sokongan CC, BCC, Kumpulan E-mel (Distribution Lists), Templat Jemputan E-mel & Enjin Socket SMTP Universal

### Added
- **Sokongan Penerima E-mel CC & BCC (`CalendarPage.jsx` & `calendar.php`)**:
  - Medan Salinan Kepada (CC / Pilihan) dan Salinan Tersembunyi (BCC) dengan tag lencana (*badges*) dan suis sembunyi/papar.
  - Fail iCalendar (`.ics`) menandakan penerima CC sebagai `ROLE=OPT-PARTICIPANT` manakala penerima utama kekal `ROLE=REQ-PARTICIPANT`.
  - Penerima BCC dirahsiakan sepenuhnya daripada pengepala MIME dan lampiran `.ics` mengikut piawaian RFC 5322 & RFC 5545.
- **Sokongan Kumpulan E-mel & Senarai Agihan (Distribution Lists)**:
  - Butang pemilihan pantas kumpulan: *👥 Semua Pegawai PMO PKPMP*, *🏛️ Semua Pentadbir Agensi*, dan *🏢 Semua Vendor PMO*.
  - Menerima sebarang alamat e-mel kumpulan atau senarai agihan (cth: `pmo-team@kehakiman.gov.my`, `vendor-support@allbizztech.com`).
- **Pengurusan Templat Jemputan E-mel (`SettingsPage.jsx` & `email_templates.php`)**:
  - Tab baharu **"Templat E-mel Jemputan"** di menu Tetapan Sistem untuk Pentadbir PMO mencipta, mengubah suai, menetapkan templat lalai (*default*), atau memadam templat e-mel.
  - Sokongan cip tag pemboleh ubah dinamik (*placeholder chips*): `{TAJUK_MESYUARAT}`, `{TARIKH}`, `{MASA}`, `{LOKASI}`, `{AGENDA}`, `{PAUTAN_MEETING}`, `{PROJEK}`, `{NAMA_PENGANJUR}`.
  - Dropdown pemilihan templat serta kotak pratonton format surat jemputan dalam modal penciptaan acara mesyuarat di Kalendar.
- **Enjin Socket SMTP Pantas & Universal (`mailer.php`)**:
  - Enjin penghantaran e-mel socket tulen berasaskan `fsockopen` / `stream_socket_enable_crypto` menyokong TLS (`STARTTLS`), SSL, dan pengesahan `AUTH LOGIN`.
  - Struktur MIME multipart standard (`multipart/mixed` dengan `multipart/alternative` dan `text/calendar; method=REQUEST; charset=UTF-8`) yang disokong secara rasmi oleh Microsoft Outlook, Zimbra Webmail, Gmail, Apple Mail, dan Thunderbird.
  - Maklum balas diagnostik mesra pengguna sekiranya kata laluan SMTP belum dimasukkan, memandu pengguna menggunakan butang *Deep Link* Outlook Web atau muat turun fail `.ics`.

### Schema
- Penambahan jadual baharu `email_templates` (`id`, `name`, `category`, `subject`, `body`, `is_default`, `created_by`, `created_at`, `updated_at`).
- Penambahan lajur `cc_emails` (TEXT), `bcc_emails` (TEXT), dan `template_id` (INT) ke dalam jadual `calendar_events`.

---

## [19 September 2026] — Integrasi Jemputan Mesyuarat Kalendar & Sambungan Kalendar Microsoft Outlook

### Added
- **Modul Jemputan Mesyuarat & Integrasi Outlook (`CalendarPage.jsx` & `calendar.php`)**:
  - **Sokongan Agenda Mesyuarat Berstruktur**: Penambahan medan teks khusus untuk memasukkan senarai agenda mesyuarat bersama butang pantas *"Gunakan Templat Rasmi"* (Perutusan Pengerusi, Pengesahan Minit, Kemajuan Projek, Isu & Risiko, Hal-hal Lain).
  - **Penjana Fail iCalendar RFC 5545 (`.ics`)**: Endpoint `GET ?action=download_ics&id=...` menjana fail `.ics` piawai antarabangsa lengkap dengan `METHOD:REQUEST`, koordinat masa UTC, `DTSTART`, `DTEND`, `SUMMARY`, `LOCATION`, `URL`, dan senarai `ATTENDEE` untuk perisian Microsoft Outlook Desktop, Apple Calendar, dan telefon pintar.
  - **Pautan Langsung Outlook Web (*Deep Link*)**: Butang **"Buka di Outlook Web"** yang menyusun parameter URL rasmi Microsoft 365 Outlook (`outlook.office.com/calendar/0/deeplink/compose`) dengan tajuk, tarikh, masa, lokasi, agenda mesyuarat, dan pautan Teams/Maya terisi automatik.
  - **Penghantaran Jemputan E-mel Kalendar**: Tindakan `send_invitation` menghantar e-mel berformat MIME multipart bersama fail jemputan kalendar kepada para peserta terpilih dengan notifikasi automatik ke Outlook.
  - **Pemilih Peserta Mesyuarat (Attendees)**: Antara muka pemilihan berbilang pegawai daripada senarai pengguna sistem serta sokongan penambahan alamat e-mel luar secara manual.

### Schema
- Penambahan lajur `start_time`, `end_time`, `location`, `meeting_link`, `agenda`, `attendees`, dan `invite_status` ke dalam jadual `calendar_events`.

---

## [19 September 2026] — Pembuangan Pilihan Bahasa, Modul Edit Profil Langsung & Reset Kata Laluan Layan Diri (Self-Service)

### Added
- **Fungsi Reset Kata Laluan Layan Diri (`LoginPage.jsx` & `api/modules/auth.php`)**:
  - Menambah pautan *"Lupa kata laluan? Tetapkan semula di sini"* pada halaman log masuk rasmi.
  - Aliran penetapan 2 langkah selamat:
    1. Pengguna memasukkan alamat e-mel berdaftar. Sistem menyemak kewujudan pengguna aktif melalui endpoint `action: 'check_email_reset'`.
    2. Sekiranya akaun sah, modal memaparkan nama pengguna dan meminta pengguna menetapkan kata laluan baharu serta pengesahan (minimum 6 aksara).
    3. Endpoint `action: 'self_reset_password'` mengemas kini hash kata laluan (`PASSWORD_BCRYPT`) dalam pangkalan data MySQL dan merekod jejak audit `RESET_PASSWORD`.
  - Paparan notifikasi pengesahan berjaya dan e-mel diisi secara automatik ke borang log masuk.

### Changed
- **Pembuangan Pilihan Bahasa & Pemurnian Header (`App.jsx`)**:
  - Membuang sepenuhnya pilihan bahasa (*"BAHASA / LANGUAGE"*, *"Bahasa Melayu"*, *"English"*) daripada dropdown header.
  - Menggantikan butang tetapan gear lama dengan butang kemas **"Edit Profil"** (berikon `User`) yang membuka terus modal Profil Pengguna.
  - Membolehkan kad profil pengguna di bar sisi (*sidebar footer*) diklik terus untuk membuka modal profil pengguna.
- **Penambahbaikan Modal Profil Pengguna (`App.jsx`)**:
  - Menyusun semula modal kepada dua tab: **Maklumat Profil** dan **Tukar Kata Laluan**.
  - Mengintegrasikan fungsi `handleUpdateProfile` ke API `api/modules/users.php` (PUT) untuk mengemas kini nama, e-mel, atau kata laluan baharu secara terus ke pangkalan data MySQL.

---

## [19 September 2026] — Pembetulan Suis Peraturan Notifikasi Pintar (Auto-Alert Rules) & Pengasingan Notifikasi SMTP

### Fixed
- **Pengasingan Tindakan Simpan Peraturan Amaran (`SettingsPage.jsx` & `smtp_settings.php`)**:
  - Memperbaiki masalah suis togol (toggle) amaran pintar (*Amaran Projek Berisiko*, *Peringatan Jadual Bayaran*, *Amaran Tugasan Kanban Overdue*) yang sebelum ini kembali aktif semula secara serta-merta apabila dimatikan.
  - Membetulkan notifikasi toast yang sebelum ini tersalah memaparkan mesej *"Konfigurasi pelayan SMTP berjaya disimpan!"* semasa menukar peraturan amaran.
  - Menambah fungsi khusus `handleToggleAlertRule()` pada Frontend dengan kemas kini optimistik serta pengasingan tindakan API `action: 'save_alert_rules'`.
  - Backend kini mengemas kini lajur peraturan amaran secara bersasar dan memulangkan mesej respon yang tepat: *"Peraturan amaran pintar berjaya dikemas kini."*.
- **Pembersihan Lencana Header Senarai Semak Perolehan (`ProcurementChecklistTab.jsx`)**:
  - Membuang lencana (badge) *"Wajib Kontrak Rasmi (> 4 Bulan)"* daripada bar lencana header kad pematuhan untuk menjadikan paparan lebih ringkas dan kemas.
- **Pembersihan 'AI Slop' & Humanizing UI/UX Keseluruhan Sistem**:
  - Membina semula `LandingPage.jsx` sebagai portal rasmi PKPMP tanpa animasi 3D carousel berputar, lingkaran neon kabur, atau carta bar CSS rekaan.
  - Memperkemas `LoginPage.jsx` dengan tema korporat kehakiman (*Deep Navy/Slate*), penafian keselamatan akta/akses terperingkat, dan butang *"Log Masuk Sistem"*.
  - Menyingkirkan nombor trend peratusan rekaan (`+12%`, `+5%`, `-2%`, `+8%`) daripada kad KPI `DashboardPage.jsx` dan menggantikannya dengan lencana status operasi sebenar.
  - Mengharmonikan istilah pentadbiran rasmi (membuang penggunaan berlebihan *"Pintar"*, *"Auto-Alert"*, *"Enjin Sistem"*, lencana *"Dinamik"*) merentas `SettingsPage.jsx`, `ReportsPage.jsx`, `App.jsx`, dan `ProjectDetailPage.jsx`.

---

## [18 September 2026] — Penambahbaikan UI/UX Cetakan Senarai Semak (Format Rasmi PKPMP & Multi-Page PDF)

### Added
- **Modal Pratonton Cetakan Rasmi A4 (`ProcurementChecklistTab.jsx`)**:
  - Menambah butang baharu **"Pratonton Cetak"** berserta modal pratonton bersaiz penuh yang mensimulasikan kertas A4 sebelum mencetak atau menyimpan sebagai PDF.
  - Bar kawalan terapung (*sticky header*) dengan butang "Cetak Sekarang (PDF)" dan "Tutup".
- **Format Dokumen Piawaian Rasmi Kerajaan (PKPMP / JPM)**:
  - Kepala surat rasmi (*official letterhead*) dengan lencana Jata PKPMP, nama kementerian, bahagian, kod rujukan dokumen (`PKPMP/BTM/PMO/SSP-01`), dan tarikh/masa cetakan.
  - **Bahagian A**: Kotak grid bersempadan maklumat projek, kod, agensi, pengurus PMO, kaedah perolehan, had siling bajet, badan kelulusan, dan status bon kontrak.
  - **Bahagian B**: Ringkasan matriks eksekutif 8 fasa perolehan (bilangan item, dokumen selesai, peratusan, dan status fasa).
  - **Bahagian C**: Jadual semakan terperinci bagi kesemua 8 fasa merangkumi kod item, huraian SOP, status pematuhan (`☑ SELESAI`, `[-] T/B`, `☐ BELUM`), nombor rujukan kelulusan/surat, nama pemeriksa, dan pautan dokumen DMS.
  - **Bahagian D**: Ruangan perakuan dua peringkat rasmi mengandungi blok tandatangan & cop bagi **Pegawai Penyedia (PMO)** dan **Pegawai Pengesah (Pengarah Bahagian Kewangan / BTM PKPMP)**.

### Changed
- **Penyesuaian Reka Bentuk & Halaman Cetakan Senarai Semak (`ProcurementChecklistTab.jsx`)**:
  - **Pemisahan Halaman Fasa 3 & Fasa 8**: Menambah `page-break-before: always` pada Fasa 3 dan Fasa 8 supaya bermula kemas di halaman baharu.
  - **Kemaskini Pengepala Rasmi**:
    - Membuang `& PEJABAT PENGURUSAN PROJEK (PMO)` dan mengekalkan hanya `BAHAGIAN TEKNOLOGI MAKLUMAT`.
    - Menetapkan teks `PEJABAT KETUA PENDAFTAR MAHKAMAH PERSEKUTUAN MALAYSIA` dalam satu baris penuh tanpa terpotong (`whitespace-nowrap`).
    - Menyusun semula lencana `TERPERINGKAT / DALAMAN` ke bar status berasingan di bahagian atas pengepala bersama Kod Dokumen dan Tarikh Cetakan.
  - **Syarat Bon Kontrak**: Menggantikan teks panjang kepada format ringkas `Tempoh : 24 Bulan` (tanpa perkataan `Wajib > 4 Bulan`).

### Fixed
- **Penyelesaian Muktamad Isu Ruang Kosong Awal Halaman 1 PDF (React Portal Print Root Isolation)**:
  - **Isu Ditangani**: Dokumen PDF bermula di bahagian bawah halaman 1 (ruang kosong ~400px di bahagian atas halaman 1).
  - **Punca Sebenar**: Elemen `<main>` dan sub-kontena skrin dalam `App.jsx` menggunakan flexbox (`flex-1 flex flex-col justify-between`) serta kad ringkasan dan tab navigasi di atas dokumen. Semasa mencetak, enjin pelayar tetap mengira anjakan ketinggian flexbox dan margin elemen induk `#root`.
  - **Penyelesaian Senibina Mantap**:
    1. Menambah kontena berasingan `<div id="print-root"></div>` di luar `<div id="root"></div>` dalam [index.html](file:///d:/xampp/htdocs/My-PMO/client/index.html).
    2. Menggunakan `createPortal` daripada `react-dom` dalam [ProcurementChecklistTab.jsx](file:///d:/xampp/htdocs/My-PMO/client/src/components/project/ProcurementChecklistTab.jsx) untuk merender dokumen cetakan terus ke `#print-root`.
    3. Menetapkan peraturan `@media print` dalam [index.css](file:///d:/xampp/htdocs/My-PMO/client/src/index.css) di mana `#root` ditetapkan kepada `display: none !important;` (menghapuskan 100% gangguan flexbox, bar navigasi, dan elemen skrin).
    4. `#print-root` kini bermula tepat pada baris pertama (0,0) di bahagian paling atas Halaman 1 tanpa sebarang anjakan ruang kosong lagi.
- **Pertindihan Butang "Kembali ke Laman Utama" pada Kad Log Masuk (`LoginPage.jsx`)**:
  - Mengubah kedudukan butang daripada `absolute top-8 left-8` kepada struktur susun atur flexbox sejajar (`w-full max-w-5xl mb-4`) di atas kad log masuk.
  - Menghalang bucu kad gelap melindung teks butang pada semua saiz skrin dan ketinggian pelayar, serta menggayakannya sebagai butang kad putih dengan animasi panah mikro semasa hover.
- **Isu Cetakan PDF Terhad 1 Halaman Sahaja (Multi-Page Truncation Fix)**:
  - **`client/src/index.css`**: Menambah arahan `@page { size: A4 portrait; margin: 12mm 12mm 15mm 12mm; }` dan membatalkan sekatan ketinggian viewport serta limpahan skrol (`height: auto !important; overflow: visible !important; min-height: 0 !important;`) pada `html`, `body`, `#root`, `.h-screen`, `.h-full`, dan `main`. Ini membolehkan dokumen cetakan mengalir secara lancar merentasi berbilang halaman (*infinite multi-page flow*) tanpa dipotong pada halaman pertama.
  - Menetapkan kawalan pemisah halaman (*page-break controls*): `page-break-inside: avoid` pada baris jadual (`tr`) dan kotak tandatangan, serta `thead { display: table-header-group }` agar kepala jadual berulang secara automatik di setiap halaman baharu.
  - **`ProcurementChecklistTab.jsx`**: Mengasingkan keseluruhan komponen UI interaktif skrin (kad gradien, bar status, butang penapis, akordion fasa, dan borang modal) dengan kelas `print:hidden` supaya tidak mencemari atau bertindih dengan dokumen cetakan rasmi.
  - **`ProjectDetailPage.jsx`**: Menambah kelas `print:hidden` pada bar navigasi atas, kad keterangan projek, dan tab navigasi utama agar tidak muncul dalam cetakan dokumen Senarai Semak.

---

## [18 September 2026] — Audit & Peneguhan Keselamatan Sistem (Hardening & Cyber Defense)

### Added
- **Perlindungan Akses Direktori Pelayan Web (`.htaccess`)**:
  - Menambah `.htaccess` pada punca projek (`/`) dengan arahan `Options -Indexes` untuk menghalang penyenaraian direktori terbuka, serta menyekat akses langsung fail konfigurasi `.env`, fail pangkalan data `.sql`, dokumen markdown `.md`, dan repositori `.git*`.
  - Menambah `.htaccess` dengan sekatan ketat `Deny from all` pada folder dalaman sensitif: `api/config/`, `api/functions/`, `api/backups/`, dan `api/uploads/`.
  - Fail muat naik dan arkib sandaran kini tidak boleh dicapai atau dimuat turun terus secara bebas melalui URL pelayar.
- **HTTP Security Response Headers (`api/functions/cors.php`)**:
  - Melaksanakan header keselamatan industri bagi setiap respons API:
    - `X-Content-Type-Options: nosniff` (Mencegah MIME-type sniffing).
    - `X-Frame-Options: SAMEORIGIN` (Perlindungan serangan Clickjacking).
    - `X-XSS-Protection: 1; mode=block` (Pencegahan serangan Cross-Site Scripting).
    - `Referrer-Policy: strict-origin-when-cross-origin` (Kawalan kebocoran maklumat URL referrer).
- **Penjejakan Keselamatan Log Masuk Gagal (`api/modules/auth.php`)**:
  - Merekod percubaan log masuk yang gagal (`FAILED_LOGIN`) ke dalam `audit_logs` bagi memudahkan pemantauan dan pengesanan serangan *Brute-Force* atau *Credential Stuffing*.

### Changed
- **Penyembunyian Maklumat Ralat Pelayan (Information Disclosure Prevention)**:
  - Mengubah blok `catch (\PDOException $e)` dalam modul pengesahan (`auth.php`) untuk merekodkan ralat sebenar ke fail log pelayan (`error_log`) dan mengembalikan mesej generik kepada pengguna tanpa mendedahkan struktur dalaman jadual atau pangkalan data.
- **Perlindungan Akaun Superadmin (`api/modules/users.php`)**:
  - Menghalang pemadaman akaun Superadmin utama (ID 1) bagi mengelakkan akaun pentadbir tertinggi terhapus secara tidak sengaja atau melalui manipulasi parameter.

### Fixed
- **Penghapusan Kerentanan SQL Injection (SQLi) 100% Prepared Statements**:
  - Mengubah suai `api/modules/calendar.php`: Menukarkan pembinaan pertanyaan dinamik `$projectId` (bagi tugasan, gantt, projek, dan acara khusus) kepada *PDO prepared statements* berparameter sepenuhnya.
  - Mengubah suai `api/modules/notifications.php`: Menukarkan pertanyaan `$customSql` dengan pembolehubah `$userId` kepada *prepared statement* berparameter.
- **Perlindungan Muat Naik Fail & RCE (`api/modules/procurement_checklist.php`)**:
  - Melaksanakan validasi jenis MIME sebenar berasaskan *magic bytes* menggunakan `finfo`.
  - Menyekat sebarang fail jenis skrip atau boleh laku (*executable*) seperti `.php`, `.phtml`, `.exe`, `.bat`, `.sh`, `.cmd`, `.js`, `.py`.
  - Menetapkan had saiz fail maksimum 10MB dan penamaan unik `doc_[uniqid].[ext]` untuk mengelakkan penimpaan fail (*file overwrite*).
- **Pencegahan Serangan Path Traversal CWE-22 (`api/modules/download.php`)**:
  - Melaksanakan pengesahan kanonikal laluan `realpath()` yang ketat bagi memastikan sebarang fail yang dimuat turun berada di bawah subdirektori selamat `api/uploads/` sahaja.
- **Pencegahan Reverse Tabnabbing / Client-side Hardening (`client/src`)**:
  - Mengemas kini panggilan `window.open` dalam komponen frontend dengan atribut keselamatan `noopener,noreferrer` dan penapisan `encodeURIComponent()`.

---

## [18 September 2026] — Modul Senarai Semak Perolehan ICT (SOP PKPMP)

### Added
- **Modul Backend API Senarai Semak Perolehan (`api/modules/procurement_checklist.php`)**:
  - Menyokong penentuan automatik kaedah perolehan mengikut had nilai bajet (Pembelian Terus < RM50k, Sebutharga RM50,001–RM500,000, Tender Awam > RM500,000).
  - Penjanaan automatik templat 8 fasa pematuhan rasmi SOP PKPMP (Kelulusan JPICT, Lampiran J, Kelulusan Belanja, ezApply, Tapak ePerolehan, Lantikan Jawatankuasa, Dokumen Pelawaan, Keputusan JKSH/LP/SST).
  - Sokongan tindakan `update_item` (pengesahan checkbox, no. rujukan surat/minit, catatan pemeriksa).
  - Pautan dokumen fizikal DMS sedia ada atau muat naik terus fail bukti semakan (`upload_and_link`).
  - Rekod jejak audit automatik ke dalam `audit_logs`.
- **Komponen Frontend Senarai Semak (`client/src/components/project/ProcurementChecklistTab.jsx`)**:
  - Kad papan pemuka pematuhan (*Compliance Dashboard*) dengan lencana kaedah, status bon kontrak (>4 bulan), nilai anggaran, dan peratus siap.
  - Senarai akordion interaktif 8 fasa berserta bar kemajuan fasa, status dokumen, nombor rujukan kelulusan, dan butang muat turun fail bukti.
  - Modal muat naik fail baharu atau pautkan dokumen sedia ada daripada repositori DMS.
  - Format paparan cetakan rasmi A4 (*Print-ready view*) berserta ruangan tandatangan Pegawai Penyedia dan Pengesah Bahagian Kewangan/BTM PKPMP.
- **Integrasi Paparan Terperinci Projek (`client/src/pages/ProjectDetailPage.jsx`)**:
  - Menambah tab baharu "Senarai Semak" di sebelah tab DMS dan Ahli Pasukan.

### Fixed
- **Pertindihan Kunci Respons API (`api/modules/procurement_checklist.php`)**:
  - Membetulkan pertindihan kunci JSON `'status' => $newStatus` yang menimpa `'status' => 'success'` semasa mengemas kini status ke 'pending', 'submitted', atau 'not_applicable'.
  - Menyusun semula turutan carian `$currentItem` sebelum pemetaan pembolehubah bagi mengelakkan amaran PHP masa larian.
- **Logik Penyahtandaan & Penutupan Popup (`ProcurementChecklistTab.jsx`)**:
  - Membetulkan pemetaan `is_checked: 0` apabila status ditukar kepada 'pending' atau 'submitted' agar butang hijau boleh ditanda dan dipadam semula dengan sempurna.
  - Memastikan modal tertutup secara automatik (`setEditingItem(null)`) selepas menekan 'Simpan Maklumat'.
  - Menambah kemas kini optimistik (*optimistic UI update*) untuk maklum balas visual serta-merta semasa klik tanda selesai/belum.
- **Penyelarasan Keselamatan SAST Sandaran Pangkalan Data (`api/modules/backup.php`)**:
  - Melaksanakan penapisan senarai putih (*identifier regex whitelisting*) pada nama jadual (`$table`) dan lajur (`$cols`) bagi mengelakkan amaran SAST (Static Application Security Testing).
  - Menggantikan interpolasi terus skema pangkalan data dengan *prepared statement* berparameter untuk pengiraan saiz pangkalan data.

### Schema
- Menambah jadual `procurement_checklists` dan `procurement_checklist_items` dalam MySQL `my_pmo_db`, `docs/SCHEMA.md`, dan `schema.sql`.

---

## [17 September 2026] — Refaktor Modular Frontend (No 2) & Kalendar Projek Bersepadu Dinamik (No 4)

### Added
- **Struktur Modular Frontend (`client/src/`)**:
  - `client/src/pages/`: Diekstrak sepenuhnya kepada komponen berasingan: `AuditTrailPage.jsx`, `BackupPage.jsx`, `CalendarPage.jsx`, `DashboardPage.jsx`, `LandingPage.jsx`, `LoginPage.jsx`, `ProjectDetailPage.jsx`, `ProjectListPage.jsx`, `ReportsPage.jsx`, `SettingsPage.jsx`, `UsersPage.jsx`.
  - `client/src/components/common/`: Komponen UI asas diguna semula (`Card.jsx`, `Badge.jsx`, `ProgressBar.jsx`, `DonutChart.jsx`).
  - `client/src/services/`: Pemusatan komunikasi API (`api.js`), data simulasi rujukan (`mockData.js`), dan fungsi utiliti pemformatan (`formatters.js`).
- **Enjin Kalendar Projek Bersepadu Dinamik (`api/modules/calendar.php` & `CalendarPage.jsx`)**:
  - Pengagregatan automatik merentasi semua projek: tarikh akhir projek (`projects.end_date`), jadual bayaran/milestone (`gantt_tasks`), dan fasa kerja Gantt.
  - Sokongan pendaftaran acara tersuai (mesyuarat, ulasan teknikal, tarikh penting) yang disimpan dalam jadual `calendar_events`.
  - Navigasi bulan/tahun dinamik (Januari–Disember), penapis mengikut projek atau kategori, grid kalendar sebenar mengikut hari, serta modal butiran acara dengan pintasan terus ke paparan terperinci projek.

### Changed
- `client/src/App.jsx` kini diringkaskan daripada **8,434 baris** kepada hanya **579 baris** yang memfokuskan kepada router paparan utama, menu navigasi, dan pengurusan sesi pengguna.
- Kod binaan Vite (`npm run build`) kini lebih pantas (sekitar ~300ms) dengan modulariti penuh.

### Schema
- Menambah jadual `calendar_events` (`id`, `title`, `description`, `event_date`, `event_type`, `project_id`, `created_by`, `color`, `created_at`, `updated_at`) dalam pangkalan data `my_pmo_db`, `docs/SCHEMA.md`, dan `schema.sql`.

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
