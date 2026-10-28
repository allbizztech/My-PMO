export const MOCK_USER = {
    name: "Datuk Dr. Azman",
    role: "Ketua Pengarah PMO PKPMP",
    roleId: "superadmin",
    avatar: "DA"
};

export const INITIAL_PROJECTS = [
    { id: 'PRJ-101', name: 'Sistem e-Kehakiman Fasa 3', agency: 'PKPMP', status: 'Aktif', health: 'Baik', budget: 85, progress: 68, manager: 'Ahmad Faiz', vendor: 'TechNova Sdn Bhd', dueDate: '2026-12-01', description: 'Pelaksanaan fasa ketiga Sistem e-Kehakiman berpusat bagi mempertingkatkan penyampaian perkhidmatan kehakiman, sistem e-Filing, dan pengurusan kes mahkamah secara dalam talian.' },
    { id: 'PRJ-102', name: 'Platform Transkripsi Suara Mahkamah (AI CRT)', agency: 'PKPMP', status: 'Tertunda', health: 'Berisiko', budget: 92, progress: 40, manager: 'Sarah Lee', vendor: 'SmartWay Infra', dueDate: '2026-08-15', description: 'Pembangunan platform berasaskan kecerdasan buatan (AI) untuk transkripsi rakaman prosiding mahkamah secara автоматиk dan berintegriti tinggi.' },
    { id: 'PRJ-103', name: 'Naik Taraf Infrastruktur IT Mahkamah Persekutuan', agency: 'PKPMP', status: 'Aktif', health: 'Baik', budget: 45, progress: 82, manager: 'Dr. Ramesh', vendor: 'MedTech Systems', dueDate: '2026-09-30', description: 'Penaiktarafan pelayan, peranti rangkaian, dan sistem keselamatan siber di Mahkamah Persekutuan, Mahkamah Rayuan, serta Mahkamah Tinggi seluruh negara.' },
    { id: 'PRJ-104', name: 'Portal Awam Informasi Kehakiman', agency: 'PKPMP', status: 'Selesai', health: 'Cemerlang', budget: 98, progress: 100, manager: 'Wei Chen', vendor: 'GreenPower Corp', dueDate: '2026-02-10', description: 'Inisiatif pembaharuan portal rasmi Badan Kehakiman Malaysia bagi memudahkan akses maklumat senarai kes, keputusan penghakiman, dan panduan awam.' },
    { id: 'PRJ-105', name: 'Migrasi GovCloud Mahkamah', agency: 'PKPMP', status: 'Aktif', health: 'Amaran', budget: 60, progress: 55, manager: 'Nurul Huda', vendor: 'AwanBiru Tech', dueDate: '2027-01-20', description: 'Projek pemindahan pelayan fizikal (on-premise) premis mahkamah ke infrastruktur pengkomputeran awan (GovCloud) bagi penjimatan kos dan ketahanan sistem.' },
    { id: 'PRJ-106', name: 'Sistem Digitasi Fail Indeks Kes Mahkamah', agency: 'PKPMP', status: 'Aktif', health: 'Baik', budget: 120, progress: 30, manager: 'Dr. Aminah', vendor: 'EduDigital', dueDate: '2027-06-15', description: 'Mendigitalkan fail dan rekod fizikal perbicaraan mahkamah terdahulu ke dalam pangkalan data terperingkat dan selamat.' },
    { id: 'PRJ-107', name: 'Integrasi Rangkaian Mahkamah Tinggi & Magistret', agency: 'PKPMP', status: 'Aktif', health: 'Baik', budget: 350, progress: 75, manager: 'Zulkifli', vendor: 'MyNet Bhd', dueDate: '2026-11-30', description: 'Penambahbaikan liputan sambungan jalur lebar berkelajuan tinggi di bilik-bilik perbicaraan Mahkamah Sesyen dan Mahkamah Majistret.' },
    { id: 'PRJ-108', name: 'Sistem Pengurusan Rekod Kes Mahkamah (e-Rekod)', agency: 'PKPMP', status: 'Tertunda', health: 'Amaran', budget: 25, progress: 15, manager: 'Siti Nurhaliza', vendor: 'Lexis Systems', dueDate: '2028-02-28', description: 'Sistem pengurusan rekod terbilik untuk menyimpan dokumen penghakiman dan transkripsi mahkamah secara teratur.' },
];

export const TASKS = [
    { id: 'T-1', title: 'Audit Keselamatan Vendor CRT', project: 'PRJ-101', status: 'pending', priority: 'Tinggi', assignee: 'AF', dueDate: '2026-05-18' },
    { id: 'T-2', title: 'Dokumentasi API e-Filing', project: 'PRJ-101', status: 'in_progress', priority: 'Sederhana', assignee: 'SL', dueDate: '2026-05-20' },
    { id: 'T-3', title: 'Integrasi Pangkalan Data Kes', project: 'PRJ-101', status: 'completed', priority: 'Tinggi', assignee: 'AF', dueDate: '2026-05-10' },
];

export const CALENDAR_EVENTS = [
    { id: 1, date: 15, title: 'Penyerahan e-Kehakiman Fasa 3', type: 'milestone', color: 'bg-indigo-500' },
    { id: 2, date: 18, title: 'Mesyuarat Lembaga PMO PKPMP', type: 'meeting', color: 'bg-slate-800' },
    { id: 3, date: 22, title: 'UAT System AI CRT', type: 'deadline', color: 'bg-red-500' },
    { id: 4, date: 28, title: 'Semakan Bajet ICT Mahkamah', type: 'review', color: 'bg-emerald-500' },
    { id: 5, date: 12, title: 'Audit Keselamatan Vendor', type: 'task', color: 'bg-blue-500' },
];

export const MOCK_ROLES = [
    { id: 'superadmin', name: 'Superadmin', scope: 'PKPMP', access: 'Boleh CRUD semua (Akses penuh sistem PMO PKPMP)', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    { id: 'admin_agency', name: 'Pentadbir PKPMP', scope: 'PKPMP', access: 'Boleh CRUD dalam bahagian PKPMP', color: 'bg-red-100 text-red-700 border-red-200' },
    { id: 'kewangan', name: 'Kewangan PKPMP', scope: 'PKPMP (Kewangan)', access: 'Boleh CRUD dalam PKPMP berkaitan kewangan sahaja', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    { id: 'pmo_gov', name: 'Pegawai PMO PKPMP', scope: 'PKPMP (Projek)', access: 'Boleh CRUD projek PKPMP', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { id: 'pmo_vendor', name: 'PMO Vendor', scope: 'Peringkat Projek', access: 'Boleh CRUD dalam projek yang ditugaskan sahaja', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    { id: 'management', name: 'Pengurusan PKPMP', scope: 'PKPMP', access: 'Hanya boleh lihat (View Only) rekod PKPMP', color: 'bg-slate-100 text-slate-700 border-slate-300' }
];

export const TEAM_MEMBERS = [
    { id: 'U1', name: 'Datuk Dr. Azman', email: 'azman@kehakiman.gov.my', roleId: 'superadmin', agency: 'PKPMP', status: 'Aktif', avatar: 'DA' },
    { id: 'U2', name: 'Ahmad Faiz', email: 'faiz@kehakiman.gov.my', roleId: 'pmo_gov', agency: 'PKPMP', status: 'Aktif', avatar: 'AF' },
    { id: 'U3', name: 'Sarah Lee', email: 'sarah@kehakiman.gov.my', roleId: 'admin_agency', agency: 'PKPMP', status: 'Aktif', avatar: 'SL' },
    { id: 'U4', name: 'Wei Chen', email: 'weichen@kehakiman.gov.my', roleId: 'kewangan', agency: 'PKPMP', status: 'Aktif', avatar: 'WC' },
    { id: 'U5', name: 'Nurul Huda', email: 'nhuda@vendor.com.my', roleId: 'pmo_vendor', agency: 'Vendor X', status: 'Aktif', avatar: 'NH' },
    { id: 'U6', name: 'Tan Sri Johan', email: 'johan@kehakiman.gov.my', roleId: 'management', agency: 'PKPMP', status: 'Aktif', avatar: 'TJ' },
];

export const AUDIT_LOGS = [
    { id: 'AL-9021', timestamp: '2026-05-10 14:22:05', user: 'Ahmad Faiz', role: 'Pegawai PMO PKPMP', action: 'UPDATE', module: 'Projek', details: 'Mengemas kini status kesihatan projek e-Kehakiman (PRJ-101) kepada "Baik"', ipAddress: '10.2.45.112', hostname: 'PKPMP-LT-882', status: 'SUCCESS' },
    { id: 'AL-9020', timestamp: '2026-05-10 14:15:30', user: 'Wei Chen', role: 'Kewangan PKPMP', action: 'READ', module: 'Laporan', details: 'Memuat turun Laporan Analitik Kewangan Suku Ke-2 (PDF)', ipAddress: '192.168.1.55', hostname: 'PKPMP-FIN-01', status: 'SUCCESS' },
    { id: 'AL-9019', timestamp: '2026-05-10 13:40:12', user: 'Tidak Diketahui', role: 'Tetamu', action: 'LOGIN', module: 'Sistem', details: 'Cubaan log masuk gagal (Kata laluan tidak sah)', ipAddress: '175.143.22.10', hostname: 'Unknown-Device', status: 'FAILED' },
];

export const PROJECT_DOCS = [
    { id: 'DOC-01', name: 'Minit_Mesyuarat_Bil_1_2026.pdf', category: 'Minit Mesyuarat', uploader: 'Ahmad Faiz', date: '10 Mei 2026', size: '2.4 MB' },
    { id: 'DOC-02', name: 'SLA_Vendor_Infrastruktur_Final.pdf', category: 'Dokumen Kontrak', uploader: 'Sarah Lee', date: '05 Mei 2026', size: '5.1 MB' },
];

export const PROJECT_FINANCE = [
    { id: 'INV-2026-001', description: 'Bayaran Pendahuluan Pelayan (Fasa 1)', vendor: 'TechNova Solutions', date: '02 Mei 2026', amount: '1,500,000.00', status: 'Selesai' },
    { id: 'INV-2026-002', description: 'Lesen Perisian Keselamatan Siber (Tahun 1)', vendor: 'CyberGuard Sdn Bhd', date: '08 Mei 2026', amount: '450,000.00', status: 'Menunggu Kelulusan' },
];

export const MOCK_NOTIFICATIONS = [
    { id: 1, title: 'Projek NDI (PRJ-101)', message: 'Tugasan "Audit Keselamatan" telah selesai.', time: '10 minit lepas', unread: true },
    { id: 2, title: 'Amaran Bajet', message: 'Projek Integrasi Sistem Mahkamah Digital melebihi bajet sasaran.', time: '1 jam lepas', unread: true },
    { id: 3, title: 'Kemas Kini Sistem', message: 'Penyelenggaraan pelayan dijadualkan malam ini.', time: 'Semalam', unread: false },
];
