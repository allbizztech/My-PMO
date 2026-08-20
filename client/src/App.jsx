import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard, Briefcase, ListTodo, Calendar as CalendarIcon,
    Bell, BarChart2, Users, FileText, Settings, Search, Menu,
    LogOut, ChevronRight, MoreVertical, Plus, CheckCircle2,
    AlertCircle, Clock, Paperclip, MessageSquare, Shield,
    Filter, Download, ArrowUpRight, ArrowDownRight, Activity,
    ChevronLeft, Flag, PieChart, TrendingUp, DollarSign, Target, CalendarDays,
    UserPlus, ShieldCheck, Lock, ArrowLeft, ArrowRight,
    Terminal, Server, ShieldAlert, Key, RefreshCw, AlertTriangle, Monitor, Globe, Edit, Trash2, LogIn, Eye, ChevronDown, CheckCircle, UploadCloud, Folder, Receipt,
    Building2, FolderKanban, UserCheck, HardDrive, Database, FileArchive, Save, Archive, Wallet,
    Copy, Check
} from 'lucide-react';

// --- DATA SIMULASI (MOCK DATA) ---
const MOCK_USER = {
    name: "Datuk Dr. Azman",
    role: "Ketua Pengarah PMO PKPMP",
    roleId: "superadmin",
    avatar: "DA"
};

const INITIAL_PROJECTS = [
    { id: 'PRJ-101', name: 'Sistem e-Kehakiman Fasa 3', agency: 'PKPMP', status: 'Aktif', health: 'Baik', budget: 85, progress: 68, manager: 'Ahmad Faiz', vendor: 'TechNova Sdn Bhd', dueDate: '2026-12-01', description: 'Pelaksanaan fasa ketiga Sistem e-Kehakiman berpusat bagi mempertingkatkan penyampaian perkhidmatan kehakiman, sistem e-Filing, dan pengurusan kes mahkamah secara dalam talian.' },
    { id: 'PRJ-102', name: 'Platform Transkripsi Suara Mahkamah (AI CRT)', agency: 'PKPMP', status: 'Tertunda', health: 'Berisiko', budget: 92, progress: 40, manager: 'Sarah Lee', vendor: 'SmartWay Infra', dueDate: '2026-08-15', description: 'Pembangunan platform berasaskan kecerdasan buatan (AI) untuk transkripsi rakaman prosiding mahkamah secara автоматиk dan berintegriti tinggi.' },
    { id: 'PRJ-103', name: 'Naik Taraf Infrastruktur IT Mahkamah Persekutuan', agency: 'PKPMP', status: 'Aktif', health: 'Baik', budget: 45, progress: 82, manager: 'Dr. Ramesh', vendor: 'MedTech Systems', dueDate: '2026-09-30', description: 'Penaiktarafan pelayan, peranti rangkaian, dan sistem keselamatan siber di Mahkamah Persekutuan, Mahkamah Rayuan, serta Mahkamah Tinggi seluruh negara.' },
    { id: 'PRJ-104', name: 'Portal Awam Informasi Kehakiman', agency: 'PKPMP', status: 'Selesai', health: 'Cemerlang', budget: 98, progress: 100, manager: 'Wei Chen', vendor: 'GreenPower Corp', dueDate: '2026-02-10', description: 'Inisiatif pembaharuan portal rasmi Badan Kehakiman Malaysia bagi memudahkan akses maklumat senarai kes, keputusan penghakiman, dan panduan awam.' },
    { id: 'PRJ-105', name: 'Migrasi GovCloud Mahkamah', agency: 'PKPMP', status: 'Aktif', health: 'Amaran', budget: 60, progress: 55, manager: 'Nurul Huda', vendor: 'AwanBiru Tech', dueDate: '2027-01-20', description: 'Projek pemindahan pelayan fizikal (on-premise) premis mahkamah ke infrastruktur pengkomputeran awan (GovCloud) bagi penjimatan kos dan ketahanan sistem.' },
    { id: 'PRJ-106', name: 'Sistem Digitasi Fail Indeks Kes Mahkamah', agency: 'PKPMP', status: 'Aktif', health: 'Baik', budget: 120, progress: 30, manager: 'Dr. Aminah', vendor: 'EduDigital', dueDate: '2027-06-15', description: 'Mendigitalkan fail dan rekod fizikal perbicaraan mahkamah terdahulu ke dalam pangkalan data terperingkat dan selamat.' },
    { id: 'PRJ-107', name: 'Integrasi Rangkaian Mahkamah Tinggi & Magistret', agency: 'PKPMP', status: 'Aktif', health: 'Baik', budget: 350, progress: 75, manager: 'Zulkifli', vendor: 'MyNet Bhd', dueDate: '2026-11-30', description: 'Penambahbaikan liputan sambungan jalur lebar berkelajuan tinggi di bilik-bilik perbicaraan Mahkamah Sesyen dan Mahkamah Majistret.' },
    { id: 'PRJ-108', name: 'Sistem Pengurusan Rekod Kes Mahkamah (e-Rekod)', agency: 'PKPMP', status: 'Tertunda', health: 'Amaran', budget: 25, progress: 15, manager: 'Siti Nurhaliza', vendor: 'Lexis Systems', dueDate: '2028-02-28', description: 'Sistem pengurusan rekod terbilik untuk menyimpan dokumen penghakiman dan transkripsi mahkamah secara teratur.' },
];

const TASKS = [
    { id: 'T-1', title: 'Audit Keselamatan Vendor CRT', project: 'PRJ-101', status: 'pending', priority: 'Tinggi', assignee: 'AF', dueDate: '2026-05-18' },
    { id: 'T-2', title: 'Dokumentasi API e-Filing', project: 'PRJ-101', status: 'in_progress', priority: 'Sederhana', assignee: 'SL', dueDate: '2026-05-20' },
    { id: 'T-3', title: 'Integrasi Pangkalan Data Kes', project: 'PRJ-101', status: 'completed', priority: 'Tinggi', assignee: 'AF', dueDate: '2026-05-10' },
];

const CALENDAR_EVENTS = [
    { id: 1, date: 15, title: 'Penyerahan e-Kehakiman Fasa 3', type: 'milestone', color: 'bg-indigo-500' },
    { id: 2, date: 18, title: 'Mesyuarat Lembaga PMO PKPMP', type: 'meeting', color: 'bg-slate-800' },
    { id: 3, date: 22, title: 'UAT System AI CRT', type: 'deadline', color: 'bg-red-500' },
    { id: 4, date: 28, title: 'Semakan Bajet ICT Mahkamah', type: 'review', color: 'bg-emerald-500' },
    { id: 5, date: 12, title: 'Audit Keselamatan Vendor', type: 'task', color: 'bg-blue-500' },
];

const MOCK_ROLES = [
    { id: 'superadmin', name: 'Superadmin', scope: 'PKPMP', access: 'Boleh CRUD semua (Akses penuh sistem PMO PKPMP)', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    { id: 'admin_agency', name: 'Pentadbir PKPMP', scope: 'PKPMP', access: 'Boleh CRUD dalam bahagian PKPMP', color: 'bg-red-100 text-red-700 border-red-200' },
    { id: 'kewangan', name: 'Kewangan PKPMP', scope: 'PKPMP (Kewangan)', access: 'Boleh CRUD dalam PKPMP berkaitan kewangan sahaja', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    { id: 'pmo_gov', name: 'Pegawai PMO PKPMP', scope: 'PKPMP (Projek)', access: 'Boleh CRUD projek PKPMP', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { id: 'pmo_vendor', name: 'PMO Vendor', scope: 'Peringkat Projek', access: 'Boleh CRUD dalam projek yang ditugaskan sahaja', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    { id: 'management', name: 'Pengurusan PKPMP', scope: 'PKPMP', access: 'Hanya boleh lihat (View Only) rekod PKPMP', color: 'bg-slate-100 text-slate-700 border-slate-300' }
];

const TEAM_MEMBERS = [
    { id: 'U1', name: 'Datuk Dr. Azman', email: 'azman@kehakiman.gov.my', roleId: 'superadmin', agency: 'PKPMP', status: 'Aktif', avatar: 'DA' },
    { id: 'U2', name: 'Ahmad Faiz', email: 'faiz@kehakiman.gov.my', roleId: 'pmo_gov', agency: 'PKPMP', status: 'Aktif', avatar: 'AF' },
    { id: 'U3', name: 'Sarah Lee', email: 'sarah@kehakiman.gov.my', roleId: 'admin_agency', agency: 'PKPMP', status: 'Aktif', avatar: 'SL' },
    { id: 'U4', name: 'Wei Chen', email: 'weichen@kehakiman.gov.my', roleId: 'kewangan', agency: 'PKPMP', status: 'Aktif', avatar: 'WC' },
    { id: 'U5', name: 'Nurul Huda', email: 'nhuda@vendor.com.my', roleId: 'pmo_vendor', agency: 'Vendor X', status: 'Aktif', avatar: 'NH' },
    { id: 'U6', name: 'Tan Sri Johan', email: 'johan@kehakiman.gov.my', roleId: 'management', agency: 'PKPMP', status: 'Aktif', avatar: 'TJ' },
];

const AUDIT_LOGS = [
    { id: 'AL-9021', timestamp: '2026-05-10 14:22:05', user: 'Ahmad Faiz', role: 'Pegawai PMO PKPMP', action: 'UPDATE', module: 'Projek', details: 'Mengemas kini status kesihatan projek e-Kehakiman (PRJ-101) kepada "Baik"', ipAddress: '10.2.45.112', hostname: 'PKPMP-LT-882', status: 'SUCCESS' },
    { id: 'AL-9020', timestamp: '2026-05-10 14:15:30', user: 'Wei Chen', role: 'Kewangan PKPMP', action: 'READ', module: 'Laporan', details: 'Memuat turun Laporan Analitik Kewangan Suku Ke-2 (PDF)', ipAddress: '192.168.1.55', hostname: 'PKPMP-FIN-01', status: 'SUCCESS' },
    { id: 'AL-9019', timestamp: '2026-05-10 13:40:12', user: 'Tidak Diketahui', role: 'Tetamu', action: 'LOGIN', module: 'Sistem', details: 'Cubaan log masuk gagal (Kata laluan tidak sah)', ipAddress: '175.143.22.10', hostname: 'Unknown-Device', status: 'FAILED' },
];

const PROJECT_DOCS = [
    { id: 'DOC-01', name: 'Minit_Mesyuarat_Bil_1_2026.pdf', category: 'Minit Mesyuarat', uploader: 'Ahmad Faiz', date: '10 Mei 2026', size: '2.4 MB' },
    { id: 'DOC-02', name: 'SLA_Vendor_Infrastruktur_Final.pdf', category: 'Dokumen Kontrak', uploader: 'Sarah Lee', date: '05 Mei 2026', size: '5.1 MB' },
];

const PROJECT_FINANCE = [
    { id: 'INV-2026-001', description: 'Bayaran Pendahuluan Pelayan (Fasa 1)', vendor: 'TechNova Solutions', date: '02 Mei 2026', amount: '1,500,000.00', status: 'Selesai' },
    { id: 'INV-2026-002', description: 'Lesen Perisian Keselamatan Siber (Tahun 1)', vendor: 'CyberGuard Sdn Bhd', date: '08 Mei 2026', amount: '450,000.00', status: 'Menunggu Kelulusan' },
];

const MOCK_NOTIFICATIONS = [
    { id: 1, title: 'Projek NDI (PRJ-101)', message: 'Tugasan "Audit Keselamatan" telah selesai.', time: '10 minit lepas', unread: true },
    { id: 2, title: 'Amaran Bajet', message: 'Projek Integrasi Tol Pintar melebihi bajet sasaran.', time: '1 jam lepas', unread: true },
    { id: 3, title: 'Kemas Kini Sistem', message: 'Penyelenggaraan pelayan dijadualkan malam ini.', time: 'Semalam', unread: false },
];

const formatShortName = (fullName) => {
    if (!fullName || typeof fullName !== 'string' || fullName.trim() === '' || fullName === '-') return '';
    let clean = fullName.replace(/\b(bin|binti|bte|a\/l|a\/p)\b.*/i, '').trim();
    return clean || fullName;
};

const formatDateMalay = (dateStr) => {
    if (!dateStr) return '';
    try {
        const parts = String(dateStr).split('-');
        if (parts.length === 3 && parts[0].length === 4) {
            const months = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogo', 'Sep', 'Okt', 'Nov', 'Dis'];
            const day = parseInt(parts[2], 10);
            const monthIdx = parseInt(parts[1], 10) - 1;
            const year = parts[0];
            if (months[monthIdx]) {
                return `${day} ${months[monthIdx]} ${year}`;
            }
        }
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        const months = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogo', 'Sep', 'Okt', 'Nov', 'Dis'];
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    } catch {
        return dateStr;
    }
};

// --- KOMPONEN BERSAMA (REUSABLE COMPONENTS) ---
const Card = ({ children, className = "", noPadding = false }) => (
    <div className={`bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden ${noPadding ? '' : 'p-6 lg:p-8'} ${className}`}>
        {children}
    </div>
);

const Badge = ({ text, type = 'default' }) => {
    const statusText = text && text.trim() ? text : 'Lewat';
    const styles = {
        'Aktif': 'bg-indigo-50/80 text-indigo-700 border-indigo-100',
        'Tertunda': 'bg-amber-50/80 text-amber-700 border-amber-100',
        'Lewat': 'bg-rose-50/80 text-rose-700 border-rose-100',
        'Berisiko': 'bg-red-50/80 text-red-700 border-red-100',
        'Selesai': 'bg-emerald-50/80 text-emerald-700 border-emerald-100',
        'Baik': 'bg-emerald-50/80 text-emerald-700 border-emerald-100',
        'Amaran': 'bg-amber-50/80 text-amber-700 border-amber-100',
        'Cemerlang': 'bg-blue-50/80 text-blue-700 border-blue-100',
        'Tinggi': 'bg-orange-50/80 text-orange-700 border-orange-100',
        'Segera': 'bg-red-50/80 text-red-700 border-red-100',
        'Sederhana': 'bg-slate-100 text-slate-700 border-slate-200',
        'Ditolak': 'bg-rose-50/80 text-rose-700 border-rose-100',
        'Menunggu Kelulusan': 'bg-amber-50/80 text-amber-700 border-amber-100',
        'default': 'bg-slate-100 text-slate-700 border-slate-200'
    };
    return (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${styles[statusText] || styles.default}`}>
            {statusText}
        </span>
    );
};

const ProgressBar = ({ progress, colorClass = "bg-slate-800" }) => (
    <div className="w-full bg-slate-100 rounded-full h-2">
        <div className={`${colorClass} h-2 rounded-full transition-all duration-1000 ease-out`} style={{ width: `${progress}%` }}></div>
    </div>
);

const DonutChart = ({ percentage, colorClass = "text-slate-800", label }) => {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="relative inline-flex items-center justify-center">
                <svg className="w-32 h-32 transform -rotate-90">
                    <circle className="text-slate-50" strokeWidth="10" stroke="currentColor" fill="transparent" r={radius} cx="64" cy="64" />
                    <circle className={colorClass} strokeWidth="10" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" stroke="currentColor" fill="transparent" r={radius} cx="64" cy="64" />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-2xl font-extrabold text-slate-800 tracking-tight">{percentage}%</span>
                </div>
            </div>
            {label && <span className="text-sm font-semibold text-slate-500 mt-4 tracking-wide uppercase">{label}</span>}
        </div>
    );
};

// --- HALAMAN UTAMA (1-PAGE 3D SLIDER) ---
const LandingPage = ({ onNavigateToLogin }) => {
    const [activeSlide, setActiveSlide] = useState(0);
    const totalSlides = 3;

    const nextSlide = () => setActiveSlide((prev) => (prev + 1) % totalSlides);
    const prevSlide = () => setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % totalSlides);
        }, 5000);
        return () => clearInterval(timer);
    }, [activeSlide]);

    const getSlideStyle = (index) => {
        if (activeSlide === index) {
            return { opacity: 1, transform: 'translateZ(0px) rotateY(0deg) scale(1)', zIndex: 10, transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)', pointerEvents: 'auto' };
        }
        if (index < activeSlide) {
            return { opacity: 0, transform: 'translateZ(-400px) rotateY(20deg) translateX(-60%) scale(0.85)', zIndex: 0, transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)', pointerEvents: 'none' };
        }
        return { opacity: 0, transform: 'translateZ(-400px) rotateY(-20deg) translateX(60%) scale(0.85)', zIndex: 0, transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)', pointerEvents: 'none' };
    };

    return (
        <div className="h-screen w-screen bg-[#020617] text-white overflow-hidden relative font-sans selection:bg-indigo-500/30 flex flex-col">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none"></div>

            <header className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full shrink-0">
                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveSlide(0)}>
                    <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-extrabold tracking-tight text-white hidden sm:block">MY-PMO</span>
                </div>
                <div className="flex items-center space-x-1 md:space-x-4">
                    <button onClick={() => setActiveSlide(0)} className={`px-3 py-2 text-xs md:text-sm font-bold transition-colors ${activeSlide === 0 ? 'text-white' : 'text-slate-400 hover:text-white'}`}>Utama</button>
                    <button onClick={() => setActiveSlide(1)} className={`px-3 py-2 text-xs md:text-sm font-bold transition-colors ${activeSlide === 1 ? 'text-white' : 'text-slate-400 hover:text-white'}`}>Modul Sistem</button>
                    <button onClick={() => setActiveSlide(2)} className={`px-3 py-2 text-xs md:text-sm font-bold transition-colors ${activeSlide === 2 ? 'text-white' : 'text-slate-400 hover:text-white'}`}>Objektif</button>
                    <button onClick={onNavigateToLogin} className="ml-2 md:ml-4 px-4 md:px-6 py-2 md:py-2.5 bg-white text-slate-900 hover:bg-slate-200 rounded-full text-xs md:text-sm font-bold transition-all flex items-center shadow-lg shadow-white/10">
                        Log Masuk <LogIn className="w-4 h-4 ml-2 opacity-70" />
                    </button>
                </div>
            </header>

            <div className="flex-1 relative w-full h-full flex items-center justify-center overflow-hidden perspective-[1500px]">
                <button className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-50 p-2 md:p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white/50 hover:text-white backdrop-blur-md transition-all shadow-xl" onClick={prevSlide}>
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </button>
                <button className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-50 p-2 md:p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white/50 hover:text-white backdrop-blur-md transition-all shadow-xl" onClick={nextSlide}>
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </button>

                <div className="absolute w-full max-w-7xl mx-auto px-10 md:px-24 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12" style={getSlideStyle(0)}>
                    <div className="flex-1 text-center lg:text-left">
                        <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-6 backdrop-blur-md">
                            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                            <span className="text-[10px] font-extrabold text-indigo-300 uppercase tracking-widest">Sistem Pintar Berpusat</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl xl:text-7xl font-extrabold tracking-tight mb-4 md:mb-6 leading-[1.15]">
                            Pengurusan Projek <br className="hidden lg:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400">
                                MY-PMO
                            </span>
                        </h1>
                        <p className="text-base md:text-lg text-slate-400 mb-6 md:mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            Platform untuk Pengurusan Projek Kerajaan. Jejak setiap data, bajet, dan kemajuan projek dengan telus.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <button onClick={onNavigateToLogin} className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold text-base transition-all shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:shadow-[0_0_50px_rgba(79,70,229,0.6)] flex items-center justify-center group">
                                Akses Log Masuk <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 w-full max-w-[500px] h-[350px] md:h-[500px] relative hidden md:block perspective-[1000px]">
                        <div className="absolute inset-0 m-auto w-full aspect-[4/3] bg-[#0B1120] rounded-2xl border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col transition-transform duration-700 ease-out hover:rotate-x-[5deg] hover:-rotate-y-[5deg]" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(15deg) rotateY(-15deg)' }}>
                            <div className="h-8 bg-white/5 border-b border-white/5 flex items-center px-4 space-x-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                            </div>
                            <div className="flex-1 flex p-3 gap-3">
                                <div className="w-12 bg-white/5 rounded-xl border border-white/5 flex flex-col items-center py-3 gap-3">
                                    <div className="w-6 h-6 rounded-lg bg-indigo-500/80"></div>
                                    <div className="w-6 h-6 rounded-lg bg-white/10 mt-3"></div>
                                    <div className="w-6 h-6 rounded-lg bg-white/10"></div>
                                </div>
                                <div className="flex-1 flex flex-col gap-3">
                                    <div className="w-full h-6 bg-white/5 rounded-lg border border-white/5"></div>
                                    <div className="flex gap-3">
                                        <div className="flex-1 h-16 bg-gradient-to-br from-indigo-500/20 to-transparent rounded-xl border border-indigo-500/20"></div>
                                        <div className="flex-1 h-16 bg-emerald-500/10 rounded-xl border border-emerald-500/10"></div>
                                    </div>
                                    <div className="flex-1 w-full bg-white/5 rounded-xl border border-white/5 flex items-end px-3 gap-1.5 pb-3">
                                        {[40, 70, 45, 90, 60, 80].map((h, i) => <div key={i} className="flex-1 bg-indigo-500/60 rounded-t-sm" style={{ height: `${h}%` }}></div>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-[20%] -left-[10%] bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-xl shadow-2xl z-20" style={{ transform: 'translateZ(60px)' }}>
                            <p className="text-xs font-bold text-white flex items-center"><Target className="w-4 h-4 mr-2 text-emerald-400" /> Analitik Tepat</p>
                        </div>
                    </div>
                </div>

                <div className="absolute w-full max-w-5xl mx-auto px-6 md:px-12 flex flex-col justify-center" style={getSlideStyle(1)}>
                    <div className="text-center mb-4 md:mb-6">
                        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2 text-white">Modul Teras <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">MY-PMO</span></h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-xs md:text-sm">Infrastruktur perisian yang merangkumi setiap aspek kitaran hayat pengurusan projek.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-5 perspective-[1000px]">
                        <div className="bg-[#0B1120] border border-white/10 p-4 md:p-5 rounded-2xl shadow-xl hover:-translate-y-1 hover:border-indigo-500/50 transition-all group flex items-start space-x-4" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(5deg) rotateY(-5deg)' }}>
                            <div className="w-12 h-12 shrink-0 bg-indigo-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Briefcase className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="text-base md:text-lg font-bold text-white mb-1">Direktori Projek</h3>
                                <p className="text-slate-400 text-xs leading-relaxed">Pangkalan data menyeluruh untuk mengurus maklumat dan garis masa setiap projek secara interaktif.</p>
                            </div>
                        </div>
                        <div className="bg-[#0B1120] border border-white/10 p-4 md:p-5 rounded-2xl shadow-xl hover:-translate-y-1 hover:border-emerald-500/50 transition-all group flex items-start space-x-4" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(5deg) rotateY(5deg)' }}>
                            <div className="w-12 h-12 shrink-0 bg-emerald-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <DollarSign className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-base md:text-lg font-bold text-white mb-1">Jejak Kewangan</h3>
                                <p className="text-slate-400 text-xs leading-relaxed">Pantau siling peruntukan dan perbelanjaan sebenar dalam satu paparan bagi mengelakkan lebihan bajet.</p>
                            </div>
                        </div>
                        <div className="bg-[#0B1120] border border-white/10 p-4 md:p-5 rounded-2xl shadow-xl hover:-translate-y-1 hover:border-amber-500/50 transition-all group flex items-start space-x-4" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(-5deg) rotateY(-5deg)' }}>
                            <div className="w-12 h-12 shrink-0 bg-amber-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Folder className="w-5 h-5 text-amber-400" />
                            </div>
                            <div>
                                <h3 className="text-base md:text-lg font-bold text-white mb-1">Repositori DMS</h3>
                                <p className="text-slate-400 text-xs leading-relaxed">Muat naik fail rasmi dengan sistem kawalan akses (Role-Based Access Control) yang selamat dan terjamin.</p>
                            </div>
                        </div>
                        <div className="bg-[#0B1120] border border-white/10 p-4 md:p-5 rounded-2xl shadow-xl hover:-translate-y-1 hover:border-rose-500/50 transition-all group flex items-start space-x-4" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(-5deg) rotateY(5deg)' }}>
                            <div className="w-12 h-12 shrink-0 bg-rose-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <PieChart className="w-5 h-5 text-rose-400" />
                            </div>
                            <div>
                                <h3 className="text-base md:text-lg font-bold text-white mb-1">Analitik Reaktif</h3>
                                <p className="text-slate-400 text-xs leading-relaxed">Hasilkan laporan komprehensif berbentuk visual carta untuk dinilai oleh pembuat dasar peringkat atasan.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute w-full max-w-6xl mx-auto px-8 md:px-16 flex flex-col justify-center" style={getSlideStyle(2)}>
                    <div className="text-center mb-6 md:mb-8">
                        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2 text-white">Objektif <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Strategik</span></h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-xs md:text-sm">Berteraskan tiga rukun pengurusan awam yang progresif dan berintegriti tinggi.</p>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 perspective-[1000px]">
                        <div className="w-full md:w-1/3 bg-gradient-to-b from-white/10 to-white/5 border border-white/10 p-5 rounded-3xl backdrop-blur-xl transition-all duration-500 hover:bg-white/20 hover:-translate-y-2" style={{ transform: 'rotateY(10deg) translateZ(-10px)' }}>
                            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-3 mx-auto border border-blue-500/30">
                                <Eye className="w-5 h-5 text-blue-400" />
                            </div>
                            <h3 className="text-base font-bold text-white text-center mb-1">Ketelusan</h3>
                            <p className="text-slate-400 text-center text-xs leading-relaxed">Visualisasi jelas kepada setiap transaksi dan menyingkirkan karenah birokrasi lapuk.</p>
                        </div>
                        <div className="w-full md:w-1/3 bg-gradient-to-b from-indigo-600/30 to-indigo-900/30 border border-indigo-500/50 p-6 rounded-3xl backdrop-blur-xl transition-all duration-500 hover:bg-indigo-600/40 hover:-translate-y-3 shadow-[0_0_30px_rgba(79,70,229,0.3)] z-10" style={{ transform: 'translateZ(30px) scale(1.05)' }}>
                            <div className="w-14 h-14 rounded-full bg-indigo-500/40 flex items-center justify-center mb-4 mx-auto border border-indigo-400">
                                <Activity className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-white text-center mb-1">Kecekapan</h3>
                            <p className="text-indigo-200 text-center text-xs leading-relaxed">Mempercepat kelulusan fasa dan memastikan setiap projek strategik disiapkan tepat pada masanya.</p>
                        </div>
                        <div className="w-full md:w-1/3 bg-gradient-to-b from-white/10 to-white/5 border border-white/10 p-5 rounded-3xl backdrop-blur-xl transition-all duration-500 hover:bg-white/20 hover:-translate-y-2" style={{ transform: 'rotateY(-10deg) translateZ(-10px)' }}>
                            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-3 mx-auto border border-emerald-500/30">
                                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                            </div>
                            <h3 className="text-base font-bold text-white text-center mb-1">Keselamatan</h3>
                            <p className="text-slate-400 text-center text-xs leading-relaxed">Setiap rekod aktiviti dilindungi dengan jejak audit mematuhi piawaian keselamatan ICT kerajaan.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-6 md:bottom-10 left-0 w-full flex justify-center items-center space-x-3 z-50">
                {[0, 1, 2].map((idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveSlide(idx)}
                        className={`h-2.5 rounded-full transition-all duration-300 ease-in-out ${activeSlide === idx ? 'w-8 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]' : 'w-2.5 bg-white/20 hover:bg-white/40'}`}
                        aria-label={`Pergi ke slaid ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

const LoginPage = ({ onLogin, onBack }) => {
    const [email, setEmail] = useState('admin@kehakiman.gov.my');
    const [password, setPassword] = useState('password');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost/My-PMO/api/modules/auth.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'login', email, password })
            });
            const data = await res.json();
            if (data.status === 'success') {
                onLogin(data.user);
            } else {
                setError(data.message || 'Log masuk gagal');
            }
        } catch (err) {
            setError('Gagal menyambung ke pelayan API.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans relative">
            <button onClick={onBack} className="absolute top-8 left-8 flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors z-20">
                <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Laman Utama
            </button>
            <div className="w-full max-w-5xl bg-white rounded-[32px] shadow-xl border border-slate-100 overflow-hidden grid md:grid-cols-2 min-h-[600px] animate-in fade-in zoom-in-95 duration-500">
                <div className="bg-slate-900 p-12 flex flex-col justify-between relative overflow-hidden text-white">
                    <div className="relative z-10">
                        <div className="flex items-center space-x-3 mb-16">
                            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">MY-PMO</span>
                        </div>
                        <h1 className="text-5xl font-extrabold mb-6 leading-tight tracking-tight">Pengurusan<br />Projek Kerajaan.</h1>
                        <p className="text-slate-400 text-lg max-w-sm leading-relaxed">Portal berpusat untuk menjejak, mengurus, dan melaporkan inisiatif projek kerajaan dengan analitik masa nyata.</p>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-950 opacity-50"></div>
                    <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/4 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
                </div>
                <div className="p-12 lg:p-16 flex flex-col justify-center bg-white">
                    <h2 className="text-3xl font-extrabold text-slate-800 mb-2 tracking-tight">Log Masuk</h2>
                    <p className="text-slate-500 mb-10 text-lg">Sila masukkan kelayakan portal anda.</p>

                    {error && <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl font-bold text-sm">{error}</div>}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">ID / E-mel</label>
                            <input type="text" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-slate-100 focus:border-slate-400 outline-none transition-all font-medium" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Kata Laluan</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-slate-100 focus:border-slate-400 outline-none transition-all font-medium" />
                        </div>
                        <div className="flex items-center justify-between text-sm pt-2">
                            <label className="flex items-center space-x-3 cursor-pointer group">
                                <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 transition-colors" />
                                <span className="text-slate-500 font-medium group-hover:text-slate-800 transition-colors">Ingat saya</span>
                            </label>
                            <a href="#" className="text-slate-800 font-bold hover:text-indigo-600 transition-colors">Lupa kata laluan?</a>
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full bg-slate-900 text-white font-bold text-lg py-4 rounded-2xl hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 transition-all active:scale-[0.98] disabled:opacity-50">
                            {isLoading ? 'Memproses...' : 'Log Masuk Terjamin'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const DashboardPage = ({ setView, onSelectFilter, showToastNotification, projects = [], currentUser }) => {
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        risk: 0,
        completed: 0,
        agencies: 0,
        completedPct: 0,
        activePct: 0,
        pendingPct: 0,
        onTrackPct: 0
    });

    const [selectedQuarter, setSelectedQuarter] = useState('Suku Ke-2, 2026');
    const [isQuarterModalOpen, setIsQuarterModalOpen] = useState(false);
    const [activeProgressMenu, setActiveProgressMenu] = useState(false);
    const [activeDonutMenu, setActiveDonutMenu] = useState(false);

    useEffect(() => {
        fetch('http://localhost/My-PMO/api/modules/dashboard.php')
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    setStats({
                        total: data.data.total_projects,
                        active: data.data.active_projects,
                        risk: data.data.risk_projects,
                        completed: data.data.completed_projects || 0,
                        agencies: data.data.total_agencies,
                        completedPct: data.data.completed_pct || 0,
                        activePct: data.data.active_pct || 0,
                        pendingPct: data.data.pending_pct || 0,
                        onTrackPct: data.data.on_track_pct || 0
                    });
                }
            })
            .catch(err => console.error("Error fetching dashboard stats:", err));
    }, [projects]);

    const realTimeTotal = projects.length > 0 ? projects.length : stats.total;
    const realTimeActive = projects.length > 0 ? projects.filter(p => p.status === 'Aktif').length : stats.active;
    const realTimeRisk = projects.length > 0 ? projects.filter(p => p.status === 'Lewat').length : stats.risk;
    const realTimeCompleted = projects.length > 0 ? projects.filter(p => p.status === 'Selesai').length : stats.completed;

    const calcTotal = projects.length > 0 ? projects.length : (stats.total || 1);
    const completedPct = projects.length > 0 ? Math.round((realTimeCompleted / calcTotal) * 100) : (stats.completedPct || 0);
    const activePct = projects.length > 0 ? Math.round((realTimeActive / calcTotal) * 100) : (stats.activePct || 0);
    const pendingPct = projects.length > 0 ? Math.round((realTimeRisk / calcTotal) * 100) : (stats.pendingPct || 0);
    const onTrackPct = projects.length > 0 ? Math.min(100, completedPct + activePct) : (stats.onTrackPct || 0);

    const isVendorPmo = currentUser?.roleId === 'pmo_vendor';
    const donutLabel = isVendorPmo ? (currentUser?.agency || currentUser?.name || 'Syarikat') : 'PKPMP';

    const handleExportPDF = () => {
        if (showToastNotification) showToastNotification('Menjana PDF Laporan Dashboard...');
        setTimeout(() => {
            window.print();
        }, 300);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
            {isQuarterModalOpen && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsQuarterModalOpen(false)}></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-[32px]">
                                <h3 className="font-extrabold text-slate-900 text-lg flex items-center">
                                    <CalendarDays className="w-5 h-5 text-indigo-600 mr-2" /> Pilih Tempoh Laporan
                                </h3>
                                <button onClick={() => setIsQuarterModalOpen(false)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200 text-slate-400 hover:text-slate-900">&times;</button>
                            </div>
                            <div className="p-6 space-y-3">
                                {['Suku Ke-1, 2026', 'Suku Ke-2, 2026', 'Suku Ke-3, 2026', 'Suku Ke-4, 2026', 'Keseluruhan Tahun 2026'].map((q) => (
                                    <button
                                        key={q}
                                        onClick={() => {
                                            setSelectedQuarter(q);
                                            setIsQuarterModalOpen(false);
                                            if (showToastNotification) showToastNotification(`Tempoh ditukar kepada: ${q}`);
                                        }}
                                        className={`w-full text-left px-5 py-3.5 rounded-2xl font-bold transition-all flex justify-between items-center ${selectedQuarter === q ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
                                    >
                                        <span>{q}</span>
                                        {selectedQuarter === q && <CheckCircle2 className="w-5 h-5 text-white" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
                    <p className="text-slate-500 mt-1 text-lg">Ringkasan analitik dan metrik kemajuan projek.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: 'Jumlah Projek', value: realTimeTotal, icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+12%', isUp: true, filter: 'Semua' },
                    { title: 'Projek Aktif', value: realTimeActive, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+5%', isUp: true, filter: 'Aktif' },
                    { title: 'Projek Lewat', value: realTimeRisk, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50', trend: '-2%', isUp: false, filter: 'Lewat' },
                    { title: 'Projek Selesai', value: realTimeCompleted, icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+8%', isUp: true, filter: 'Selesai' },
                ].map((kpi, i) => (
                    <Card
                        key={i}
                        className="group hover:border-indigo-300 hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-1"
                    >
                        <div
                            onClick={() => {
                                if (onSelectFilter) onSelectFilter(kpi.filter);
                                if (setView) setView('projects');
                            }}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-3.5 rounded-2xl ${kpi.bg} group-hover:scale-110 transition-transform`}>
                                    <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                                </div>
                                <div className={`flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${kpi.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                    {kpi.isUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                                    {kpi.trend}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">{kpi.value}</h3>
                                <div className="flex items-center justify-between mt-1.5">
                                    <p className="text-sm font-semibold text-slate-500">{kpi.title}</p>
                                    <span className="text-[10px] text-indigo-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Papar &rarr;</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 relative flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Projek Mengikut Bahagian di PKPMP</h3>

                        </div>
                        <div className="relative">
                            <button
                                onClick={() => setActiveProgressMenu(!activeProgressMenu)}
                                className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 border border-slate-200 transition-colors shadow-sm cursor-pointer"
                            >
                                <MoreVertical className="w-5 h-5" />
                            </button>
                            {activeProgressMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 py-2 animate-in fade-in zoom-in-95">
                                    <button
                                        onClick={() => {
                                            setActiveProgressMenu(false);
                                            if (showToastNotification) showToastNotification('Data beban kerja bahagian dikemas kini!');
                                        }}
                                        className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center"
                                    >
                                        <RefreshCw className="w-3.5 h-3.5 mr-2 text-indigo-600" /> Muat Semula Data
                                    </button>
                                    <button
                                        onClick={() => {
                                            setActiveProgressMenu(false);
                                            if (onSelectFilter) onSelectFilter('Semua');
                                            if (setView) setView('projects');
                                        }}
                                        className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center"
                                    >
                                        <Eye className="w-3.5 h-3.5 mr-2 text-emerald-600" /> Lihat Senarai Projek
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto max-h-[310px] pr-1">
                        {(() => {
                            const standardList = [
                                { code: 'BTM', name: 'Bahagian Teknologi Maklumat (BTM)' },
                                { code: 'BPMP', name: 'Bahagian Pendaftaran Mahkamah Persekutuan (BPMP)' },
                                { code: 'BKW', name: 'Bahagian Kewangan & Akaun (BKW)' },
                                { code: 'PUU', name: 'Pejabat Penasihat Undang-Undang (PUU)' },
                                { code: 'BPSM', name: 'Bahagian Sumber Manusia (BPSM)' },
                                { code: 'BPP', name: 'Bahagian Latihan & Penyelidikan (BPP)' },
                                { code: 'BPMTSS', name: 'Pendaftaran Mahkamah Tinggi S&S' }
                            ];

                            const isVendorPmo = currentUser?.roleId === 'pmo_vendor';
                            const knownCodes = new Set();
                            const dynamicList = [];

                            if (!isVendorPmo) {
                                standardList.forEach(d => {
                                    knownCodes.add(d.code.toLowerCase());
                                    dynamicList.push(d);
                                });
                            }

                            (projects || []).forEach(p => {
                                const divName = p.division || p.agency || '';
                                if (divName) {
                                    const match = divName.match(/\(([^)]+)\)/);
                                    const code = match ? match[1] : divName;
                                    if (!knownCodes.has(code.toLowerCase()) && !knownCodes.has(divName.toLowerCase())) {
                                        knownCodes.add(code.toLowerCase());
                                        dynamicList.push({ code: code, name: divName });
                                    }
                                }
                            });

                            const renderedDivisions = dynamicList.map((div) => {
                                const matched = (projects || []).filter(p => {
                                    const d = (p.division || p.agency || '').toLowerCase();
                                    return d.includes(div.code.toLowerCase()) || d.includes(div.name.toLowerCase());
                                });
                                const total = matched.length;
                                const active = matched.filter(p => p.status === 'Aktif').length;
                                const lewat = matched.filter(p => p.status === 'Lewat').length;
                                const selesai = matched.filter(p => p.status === 'Selesai').length;

                                return { div, total, active, lewat, selesai };
                            }).filter(item => !isVendorPmo || item.total > 0);

                            if (renderedDivisions.length === 0) {
                                return (
                                    <div className="col-span-2 py-8 text-center text-slate-400 text-xs font-semibold">
                                        Tiada bahagian projek ditemui.
                                    </div>
                                );
                            }

                            return renderedDivisions.map(({ div, total, active, lewat, selesai }, idx) => (
                                <div key={idx} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-indigo-200 transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 tracking-wider">
                                                {div.code}
                                            </span>
                                            <h4 className="text-xs font-bold text-slate-800 mt-1 truncate max-w-[190px]" title={div.name}>
                                                {div.name}
                                            </h4>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-lg font-black text-slate-900">{total}</span>
                                            <span className="text-[10px] text-slate-400 block font-semibold">Projek</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2 text-[11px] font-bold pt-2 border-t border-slate-200/60 mt-2">
                                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                            {active} Aktif
                                        </span>
                                        {lewat > 0 && (
                                            <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                                                {lewat} Lewat
                                            </span>
                                        )}
                                        {selesai > 0 && (
                                            <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                                                {selesai} Selesai
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ));
                        })()}
                    </div>

                    <div className="pt-4 mt-2 border-t border-slate-100 flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400"></span>
                        <button
                            onClick={() => {
                                if (onSelectFilter) onSelectFilter('Semua');
                                if (setView) setView('projects');
                            }}
                            className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 flex items-center cursor-pointer"
                        >
                            Lihat Semua Projek &rarr;
                        </button>
                    </div>
                </Card>

                <Card className="flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="w-full flex justify-between items-start mb-6 z-10">
                        <h3 className="text-lg font-bold text-slate-900">Kadar Selesai Projek</h3>
                        <div className="relative">
                            <button
                                onClick={() => setActiveDonutMenu(!activeDonutMenu)}
                                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                            >
                                <MoreVertical className="w-5 h-5" />
                            </button>
                            {activeDonutMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 py-2 animate-in fade-in zoom-in-95">
                                    <button
                                        onClick={() => {
                                            setActiveDonutMenu(false);
                                            if (setView) setView('reports');
                                        }}
                                        className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center"
                                    >
                                        <BarChart2 className="w-3.5 h-3.5 mr-2 text-indigo-600" /> Analisis Terperinci
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center w-full z-10">
                        <DonutChart percentage={completedPct} colorClass="text-indigo-600" label={donutLabel} />
                        <div className="w-full mt-10 space-y-4 px-2">
                            <div className="flex justify-between items-center text-sm"><span className="text-slate-600 font-medium flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-indigo-600 mr-3"></span> Projek Selesai</span><span className="font-bold text-slate-900">{completedPct}%</span></div>
                            <div className="flex justify-between items-center text-sm"><span className="text-slate-600 font-medium flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-slate-300 mr-3"></span> Projek Sedang Berjalan</span><span className="font-bold text-slate-900">{activePct}%</span></div>
                            <div className="flex justify-between items-center text-sm"><span className="text-slate-600 font-medium flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-3"></span> Projek Lewat</span><span className="font-bold text-slate-900">{pendingPct}%</span></div>
                        </div>
                    </div>
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-slate-50 rounded-full blur-3xl pointer-events-none"></div>
                </Card>
            </div>
        </div>
    );
};

const ProjectListPage = ({ setView, projects, setProjects, onSelectProject, refreshProjects, initialFilter = 'Semua', showToastNotification }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [filterStatus, setFilterStatus] = useState(initialFilter);
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Dynamic Divisions & Units state
    const [divisionList, setDivisionList] = useState([]);
    const [selectedDivisionCode, setSelectedDivisionCode] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('');

    // Dynamic Users List state (Pasukan & Peranan)
    const [userList, setUserList] = useState([]);
    const [projectToDelete, setProjectToDelete] = useState(null);

    const fetchDivisionsAndUnits = async () => {
        try {
            const res = await fetch('http://localhost/My-PMO/api/modules/divisions.php');
            const data = await res.json();
            if (data.status === 'success' && data.data) {
                setDivisionList(data.data);
            }
        } catch (err) {
            console.error('Ralat mengambil bahagian & unit:', err);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch('http://localhost/My-PMO/api/modules/users.php');
            const data = await res.json();
            if (data.status === 'success' && data.data) {
                setUserList(data.data);
            }
        } catch (err) {
            console.error('Ralat mengambil senarai pengguna:', err);
        }
    };

    useEffect(() => {
        fetchDivisionsAndUnits();
        fetchUsers();
    }, []);

    useEffect(() => {
        if (initialFilter) setFilterStatus(initialFilter);
    }, [initialFilter]);

    const ITEMS_PER_PAGE = 5;

    const filteredProjects = projects.filter(p => {
        const matchesStatus = filterStatus === 'Semua' ||
            (filterStatus === 'Berisiko' && (p.status === 'Lewat' || p.status === 'Berisiko' || p.health === 'Berisiko')) ||
            p.status === filterStatus;
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery = !q || (
            (p.name && p.name.toLowerCase().includes(q)) ||
            (p.project_code && p.project_code.toLowerCase().includes(q)) ||
            (p.agency && p.agency.toLowerCase().includes(q)) ||
            (p.division && p.division.toLowerCase().includes(q)) ||
            (p.unit && p.unit.toLowerCase().includes(q)) ||
            (p.manager && p.manager.toLowerCase().includes(q)) ||
            (p.vendor_manager && p.vendor_manager.toLowerCase().includes(q)) ||
            (p.pmoVendor && p.pmoVendor.toLowerCase().includes(q))
        );
        return matchesStatus && matchesQuery;
    });
    const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
    const currentProjects = filteredProjects.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const openNewModal = () => {
        setEditingProject(null);
        const defaultDiv = divisionList[0]?.name || 'Bahagian Teknologi Maklumat (BTM)';
        setSelectedDivisionCode(defaultDiv);
        setSelectedUnit('');
        setIsModalOpen(true);
    };

    const openEditModal = (project) => {
        setEditingProject(project);
        setSelectedDivisionCode(project.division || (divisionList[0]?.name || 'Bahagian Teknologi Maklumat (BTM)'));
        setSelectedUnit(project.unit || '');
        setIsModalOpen(true);
    };

    const confirmDeleteProject = async (id) => {
        try {
            const res = await fetch('http://localhost/My-PMO/api/modules/projects.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            const data = await res.json();
            if (data.status === 'success') {
                if (showToastNotification) showToastNotification('Projek berjaya dipadam.');
                refreshProjects();
            }
        } catch (err) {
            console.error("Ralat memadam projek:", err);
        }
    };

    const handleExportCSV = () => {
        if (filteredProjects.length === 0) {
            alert('Tiada data projek untuk dieksport.');
            return;
        }
        const headers = "Kod Projek,Nama Projek,Agensi,Bahagian,Unit,Status,Kemajuan(%),Pengurus GOV,Pengurus Vendor,Tarikh Mula,Tarikh Tamat\n";
        const rows = filteredProjects.map(p =>
            `"${p.project_code || p.id}","${p.name || ''}","${p.agency || ''}","${p.division || ''}","${p.unit || ''}","${p.status || ''}",${p.progress || 0},"${p.manager || ''}","${p.vendor_manager || p.pmoVendor || ''}","${p.start_date || ''}","${p.end_date || ''}"`
        ).join("\n");

        const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Senarai_Projek_PMO_${new Date().getTime()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        if (showToastNotification) showToastNotification('Fail CSV senarai projek berjaya di-muat turun.');
    };

    const handleSubmitProject = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const progressVal = Number(formData.get('progress'));
        const healthStatus = progressVal === 100 ? 'Cemerlang' : progressVal > 50 ? 'Baik' : 'Amaran';
        const descriptionVal = formData.get('description');
        const budgetVal = parseFloat(formData.get('budget')) || 0;
        const mofApprovalDateVal = formData.get('mofApprovalDate') || '2025-01-12';

        try {
            if (editingProject) {
                const res = await fetch('http://localhost/My-PMO/api/modules/projects.php', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: editingProject.id,
                        name: formData.get('name'),
                        description: descriptionVal,
                        agency: formData.get('agency'),
                        division: formData.get('division'),
                        unit: formData.get('unit'),
                        status: formData.get('status'),
                        health: healthStatus,
                        progress: progressVal,
                        budget: budgetVal,
                        mofApprovalDate: mofApprovalDateVal,
                        manager: formData.get('pmoGov'),
                        pmoVendor: formData.get('pmoVendor'),
                        vendor: formData.get('vendor'),
                        startDate: formData.get('startDate'),
                        dueDate: formData.get('endDate')
                    })
                });
                await res.json();
            } else {
                const res = await fetch('http://localhost/My-PMO/api/modules/projects.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formData.get('name'),
                        description: descriptionVal,
                        agency: formData.get('agency'),
                        division: formData.get('division'),
                        unit: formData.get('unit'),
                        status: formData.get('status') || 'Aktif',
                        health: healthStatus,
                        progress: progressVal,
                        budget: budgetVal,
                        mofApprovalDate: mofApprovalDateVal,
                        manager: formData.get('pmoGov'),
                        pmoVendor: formData.get('pmoVendor'),
                        vendor: formData.get('vendor'),
                        startDate: formData.get('startDate'),
                        dueDate: formData.get('endDate')
                    })
                });
                await res.json();
                setCurrentPage(1);
            }
            refreshProjects();
            setIsModalOpen(false);
        } catch (err) {
            console.error("Ralat mencipta/mengemas kini projek:", err);
        }
    };

    // Find currently active division object from divisionList
    const activeDivObj = divisionList.find(d =>
        d.name.toLowerCase() === selectedDivisionCode.toLowerCase() ||
        selectedDivisionCode.toLowerCase().includes(d.code.toLowerCase()) ||
        d.name.toLowerCase().includes(selectedDivisionCode.toLowerCase())
    );
    const activeUnits = activeDivObj?.units || [];

    // Filter Government PMO Officers (PKPMP / pmo_gov / superadmin / admin_agency)
    const pmoGovUsers = userList.filter(u =>
        u.role !== 'pmo_vendor' &&
        (!u.agency || u.agency.toUpperCase().includes('PKPMP') || u.role === 'pmo_gov' || u.role === 'superadmin' || u.role === 'admin_agency')
    );

    // Filter Vendor / Company PMO Officers (pmo_vendor or non-PKPMP agency)
    const pmoVendorUsers = userList.filter(u =>
        u.role === 'pmo_vendor' || (u.agency && !u.agency.toUpperCase().includes('PKPMP'))
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">

            {projectToDelete && (
                <div className="fixed inset-0 z-[70] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setProjectToDelete(null)}></div>
                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                        <div className="relative transform overflow-hidden rounded-[32px] bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md p-6 sm:p-8 animate-in zoom-in-95 border border-slate-100">
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                                    <AlertTriangle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-extrabold text-slate-900">Padam Rekod Projek?</h3>
                                    <p className="text-xs font-semibold text-slate-500 mt-1 leading-relaxed">
                                        Tindakan ini tidak boleh diundur. Adakah anda pasti mahu memadam rekod projek <span className="font-bold text-slate-900">"{projectToDelete.name}"</span>?
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8 flex items-center justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setProjectToDelete(null)}
                                    className="px-5 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors text-sm cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={async () => {
                                        const idToDelete = projectToDelete.id;
                                        setProjectToDelete(null);
                                        await confirmDeleteProject(idToDelete);
                                    }}
                                    className="px-5 py-2.5 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md active:scale-95 transition-all text-sm flex items-center space-x-1.5 cursor-pointer"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Ya, Padam Projek</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                        <div className="relative transform bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-3xl rounded-[32px] animate-in zoom-in-95 duration-200">
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-[32px]">
                                <div>
                                    <h2 className="text-2xl font-extrabold text-slate-900">{editingProject ? 'Kemaskini Projek' : 'Daftar Projek Baharu'}</h2>
                                    <p className="text-slate-500 text-sm font-medium mt-1">{editingProject ? 'Ubah maklumat projek sedia ada.' : 'Masukkan maklumat projek ke dalam pangkalan data PMO.'}</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 shadow-sm border border-slate-200 transition-colors">
                                    <span className="font-bold text-xl leading-none">&times;</span>
                                </button>
                            </div>

                            <form onSubmit={handleSubmitProject} className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Nama Projek</label>
                                        <input name="name" defaultValue={editingProject?.name || ''} required type="text" placeholder="Cth: Sistem ID Digital V2" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all font-medium text-slate-900" />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Keterangan Projek</label>
                                        <textarea name="description" defaultValue={editingProject?.description || ''} rows="3" placeholder="Deskripsi ringkas mengenai objektif projek..." className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all font-medium text-slate-900"></textarea>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Agensi Kerajaan</label>
                                        <select name="agency" defaultValue={editingProject?.agency || 'PKPMP'} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all font-medium text-slate-900">
                                            <option value="PKPMP">Pejabat Ketua Pendaftar Mahkamah Persekutuan (PKPMP)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Bahagian (PKPMP)</label>
                                        <select
                                            name="division"
                                            value={selectedDivisionCode}
                                            onChange={(e) => {
                                                setSelectedDivisionCode(e.target.value);
                                                setSelectedUnit('');
                                            }}
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all font-medium text-slate-900"
                                        >
                                            {divisionList.length > 0 ? (
                                                divisionList.map((div) => (
                                                    <option key={div.id} value={div.name}>
                                                        {div.name}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="Bahagian Teknologi Maklumat (BTM)">Bahagian Teknologi Maklumat (BTM)</option>
                                            )}
                                        </select>
                                    </div>

                                    {/* Dynamic Unit Dropdown */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            Unit di Bawah Bahagian <span className="text-slate-400 font-normal text-xs">(Diambil dari Tetapan Pengurusan Unit)</span>
                                        </label>
                                        <select
                                            name="unit"
                                            value={selectedUnit}
                                            onChange={(e) => setSelectedUnit(e.target.value)}
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all font-medium text-slate-900"
                                        >
                                            <option value="">-- Pilih Unit (Jika Ada) --</option>
                                            {activeUnits.map((u) => (
                                                <option key={u.id} value={u.name}>
                                                    {u.code ? `[${u.code}] ` : ''}{u.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Status Projek</label>
                                        <select key={`status-select-${editingProject?.id || 'new'}-${editingProject?.status || 'Aktif'}`} name="status" defaultValue={editingProject?.status || 'Aktif'} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all font-medium text-slate-900">
                                            <option value="Aktif">Aktif</option>
                                            <option value="Lewat">Lewat</option>
                                            <option value="Selesai">Selesai</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Kemajuan Semasa (%)</label>
                                        <input name="progress" defaultValue={editingProject?.progress || 0} required type="number" min="0" max="100" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all font-medium text-slate-900" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Pegawai PMO (Kerajaan)</label>
                                        <select
                                            name="pmoGov"
                                            defaultValue={editingProject?.manager || ''}
                                            required
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all font-medium text-slate-900"
                                        >
                                            <option value="">-- Pilih Pegawai PMO (Kerajaan) --</option>
                                            {pmoGovUsers.map((u) => (
                                                <option key={u.id} value={u.name}>
                                                    {u.name} {u.agency ? `(${u.agency})` : ''}
                                                </option>
                                            ))}
                                            {editingProject?.manager && !pmoGovUsers.some(u => u.name === editingProject.manager) && (
                                                <option value={editingProject.manager}>{editingProject.manager}</option>
                                            )}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Pegawai PMO (Syarikat)</label>
                                        <select
                                            name="pmoVendor"
                                            defaultValue={editingProject?.vendor_manager || editingProject?.pmoVendor || ''}
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all font-medium text-slate-900"
                                        >
                                            <option value="">-- Pilih Pegawai PMO (Syarikat) --</option>
                                            {pmoVendorUsers.map((u) => (
                                                <option key={u.id} value={u.name}>
                                                    {u.name} {u.agency ? `(${u.agency})` : ''}
                                                </option>
                                            ))}
                                            {(editingProject?.vendor_manager || editingProject?.pmoVendor) && !pmoVendorUsers.some(u => u.name === (editingProject.vendor_manager || editingProject.pmoVendor)) && (
                                                <option value={editingProject.vendor_manager || editingProject.pmoVendor}>
                                                    {editingProject.vendor_manager || editingProject.pmoVendor}
                                                </option>
                                            )}
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Syarikat Vendor / Kontraktor</label>
                                        <input name="vendor" defaultValue={editingProject?.vendor || ''} required type="text" placeholder="Nama Syarikat Vendor/Kontraktor" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all font-medium text-slate-900" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Nilai Projek / Jumlah Peruntukan (RM / Juta)</label>
                                            <input name="budget" defaultValue={editingProject?.budget || ''} required type="number" step="0.01" placeholder="Cth: RM 200,000.00" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all font-medium text-slate-900" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Tarikh Kelulusan MOF</label>
                                            <input name="mofApprovalDate" defaultValue={editingProject?.mof_approval_date || editingProject?.mofApprovalDate || '2025-01-12'} required type="date" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all font-medium text-slate-900" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Tarikh Mula Projek</label>
                                            <input name="startDate" defaultValue={editingProject?.start_date || editingProject?.startDate || ''} required type="date" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all font-medium text-slate-900" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Tarikh Tamat Projek</label>
                                            <input name="endDate" defaultValue={editingProject?.end_date || editingProject?.dueDate || ''} required type="date" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all font-medium text-slate-900" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-100 mt-8">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm">Batal</button>
                                    <button type="submit" className="px-8 py-3 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
                                        {editingProject ? 'Simpan Perubahan' : 'Daftar Projek'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Senarai Projek</h1>
                    <p className="text-slate-500 mt-1 text-sm sm:text-base">Pantau dan urus semua kemajuan projek.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full lg:w-auto">
                    <div className="relative w-full sm:w-64 shrink-0">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            placeholder="Cari projek..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl font-medium focus:ring-4 focus:ring-slate-100 focus:border-slate-400 outline-none shadow-sm transition-all text-sm text-slate-800"
                        />
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:flex-initial">
                            <button onClick={() => setShowFilterMenu(!showFilterMenu)} className="w-full sm:w-auto bg-white border border-slate-200 px-4 py-2.5 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center shadow-sm transition-colors cursor-pointer whitespace-nowrap text-sm">
                                <Filter className="w-4 h-4 mr-2 shrink-0" /> Tapis {filterStatus !== 'Semua' && <span className="ml-1.5 bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[10px]">{filterStatus}</span>}
                            </button>
                            {showFilterMenu && (
                                <div className="absolute top-full mt-2 left-0 sm:right-0 sm:left-auto w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 py-2 animate-in fade-in zoom-in-95">
                                    <p className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status Projek</p>
                                    {['Semua', 'Aktif', 'Lewat', 'Selesai'].map(s => (
                                        <button key={s} onClick={() => { setFilterStatus(s); setShowFilterMenu(false); setCurrentPage(1); }} className={`w-full text-left px-4 py-2 text-sm font-semibold hover:bg-slate-50 ${filterStatus === s ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-700'}`}>
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button onClick={handleExportCSV} className="flex-1 sm:flex-initial bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-semibold hover:bg-slate-50 flex items-center justify-center shadow-sm transition-colors cursor-pointer active:scale-95 whitespace-nowrap text-sm" title="Muat turun senarai sebagai CSV">
                            <Download className="w-4 h-4 mr-2 text-indigo-600 shrink-0" /> Eksport CSV
                        </button>

                        <button onClick={openNewModal} className="flex-1 sm:flex-initial bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-800 flex items-center justify-center shadow-md transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap text-sm">
                            <Plus className="w-4 h-4 mr-2 shrink-0" /> Projek Baharu
                        </button>
                    </div>
                </div>
            </div>

            <Card noPadding className="w-full overflow-hidden border border-slate-100">
                <table className="w-full text-left border-collapse table-auto">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-3 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-12">Bil.</th>
                            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Projek</th>
                            <th className="px-3 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Agensi & Bahagian</th>
                            <th className="px-3 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                            <th className="px-3 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Kemajuan</th>
                            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pengurus Projek (PMO)</th>
                            <th className="px-3 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-24">Tindakan</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/80">
                        {currentProjects.length > 0 ? currentProjects.map((prj, idx) => {
                            const govShort = formatShortName(prj.manager);
                            const vendorShort = formatShortName(prj.vendor_manager || prj.pmoVendor);

                            return (
                                <tr key={prj.id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer" onClick={() => onSelectProject(prj)}>
                                    <td className="px-3 py-4 text-center font-bold text-slate-400 text-xs">
                                        {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="font-bold text-slate-900 text-xs lg:text-sm group-hover:text-indigo-600 transition-colors leading-snug">{prj.name}</div>
                                        <div className="inline-block bg-slate-100 text-slate-500 text-[10px] font-semibold px-2 py-0.5 rounded-md mt-1 border border-slate-200">
                                            {prj.project_code || (String(prj.id).startsWith('PRJ-') ? prj.id : `PRJ-${String(prj.id).padStart(3, '0')}`)}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4 text-xs font-semibold text-slate-600">
                                        <div className="flex flex-col gap-1 items-start">
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wider">
                                                {prj.agency || 'PKPMP'}
                                            </span>
                                            <span className="text-[11px] font-medium text-slate-600">
                                                {prj.division || 'BTM'}
                                            </span>
                                            {prj.unit && (
                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                                    {prj.unit}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4 text-center"><Badge text={prj.status} /></td>
                                    <td className="px-3 py-4 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            {/* Bar melengkung pendek di atas peratusan */}
                                            <div className="w-14 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                                                <div
                                                    className={`h-full rounded-full transition-all ${prj.progress > 75 ? "bg-emerald-500" : prj.progress < 50 ? "bg-amber-500" : "bg-indigo-500"}`}
                                                    style={{ width: `${Math.max(prj.progress || 0, 5)}%` }}
                                                />
                                            </div>
                                            <span className="font-extrabold text-slate-900 text-xs">{prj.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-slate-600">
                                        <div className="flex flex-col gap-1 justify-center">
                                            {/* PMO GOV */}
                                            <div className="flex items-center space-x-1.5">
                                                <span className="px-1 py-0.5 rounded text-[8px] font-black bg-indigo-100 text-indigo-800 uppercase shrink-0">GOV</span>
                                                <span className="font-bold text-xs text-slate-900 truncate" title={prj.manager}>{govShort || 'Tiada'}</span>
                                            </div>
                                            {/* PMO SYARIKAT */}
                                            {vendorShort && (
                                                <div className="flex items-center space-x-1.5">
                                                    <span className="px-1 py-0.5 rounded text-[8px] font-black bg-emerald-100 text-emerald-800 uppercase shrink-0 font-mono">SYARIKAT</span>
                                                    <span className="font-semibold text-xs text-slate-600 truncate" title={prj.vendor_manager || prj.pmoVendor}>{vendorShort}</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4 text-center">
                                        <div className="flex items-center justify-center space-x-1.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                onClick={() => openEditModal(prj)}
                                                title="Kemas Kini"
                                                className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all text-slate-600 shadow-sm active:scale-95 flex items-center justify-center"
                                            >
                                                <Edit className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => setProjectToDelete(prj)}
                                                title="Padam"
                                                className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all text-slate-600 shadow-sm active:scale-95 flex items-center justify-center cursor-pointer"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan="7" className="px-8 py-16 text-center text-slate-500 font-bold text-lg">
                                    Tiada projek dijumpai untuk saringan ini.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-sm font-medium text-slate-500">
                        Memaparkan <span className="font-bold text-slate-900">{(currentPage - 1) * ITEMS_PER_PAGE + (filteredProjects.length > 0 ? 1 : 0)}</span> hingga <span className="font-bold text-slate-900">{Math.min(currentPage * ITEMS_PER_PAGE, filteredProjects.length)}</span> daripada <span className="font-bold text-slate-900">{filteredProjects.length}</span> rekod
                    </span>
                    <div className="flex items-center space-x-3">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-white hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all bg-white shadow-sm"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="text-sm font-extrabold text-slate-700 px-2">
                            {currentPage} / {totalPages || 1}
                        </span>
                        <button
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-white hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all bg-white shadow-sm"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

const ProjectDetailPage = ({ setView, project, showToastNotification, currentUser, notifications = [], setNotifications = () => { } }) => {
    const formatDateMalay = (dateStr) => {
        if (!dateStr) return '';
        const months = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogo', 'Sep', 'Okt', 'Nov', 'Dis'];
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            const year = parts[0];
            const monthIndex = parseInt(parts[1], 10) - 1;
            const day = parseInt(parts[2], 10);
            return `${String(day).padStart(2, '0')} ${months[monthIndex]} ${year}`;
        }
    };

    const triggerBellNotification = (title, message) => {
        if (setNotifications) {
            setNotifications(prev => [
                {
                    id: Date.now(),
                    title,
                    message,
                    time: 'Baru sahaja',
                    unread: true
                },
                ...prev
            ]);
        }
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const [currentProject, setCurrentProject] = useState(project);
    const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
    const [userList, setUserList] = useState(TEAM_MEMBERS);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('http://localhost/My-PMO/api/modules/users.php');
                const data = await res.json();
                if (data.status === 'success' && data.data && data.data.length > 0) {
                    setUserList(data.data);
                }
            } catch (err) {
                console.error('Ralat mengambil senarai pengguna:', err);
            }
        };
        fetchUsers();
    }, []);

    const pmoGovUsers = userList.filter(u =>
        u.role !== 'pmo_vendor' &&
        (!u.agency || u.agency.toUpperCase().includes('PKPMP') || u.role === 'pmo_gov' || u.role === 'superadmin' || u.role === 'admin_agency')
    );

    const pmoVendorUsers = userList.filter(u =>
        u.role === 'pmo_vendor' || (u.agency && !u.agency.toUpperCase().includes('PKPMP'))
    );

    useEffect(() => {
        setCurrentProject(project);
    }, [project]);

    const handleUpdateProject = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const name = formData.get('name');
        const description = formData.get('description');
        const agency = formData.get('agency') || 'PKPMP';
        const division = formData.get('division');
        const unit = formData.get('unit');
        const vendor = formData.get('vendor');
        const pmoVendor = formData.get('pmoVendor');
        const manager = formData.get('manager');
        const startDate = formData.get('startDate');
        const dueDate = formData.get('dueDate');
        const budget = formData.get('budget');
        const status = formData.get('status') || 'Aktif';
        const health = formData.get('health') || currentProject.health || 'Baik';
        const progress = parseInt(formData.get('progress') || '0', 10);

        try {
            const res = await fetch('http://localhost/My-PMO/api/modules/projects.php', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: currentProject.id,
                    name,
                    description,
                    agency,
                    division,
                    unit,
                    vendor,
                    pmoVendor,
                    manager,
                    startDate,
                    dueDate,
                    budget,
                    status,
                    health,
                    progress
                })
            });
            const data = await res.json();
            if (data.status === 'success') {
                const updated = {
                    ...currentProject,
                    name,
                    description,
                    agency,
                    division,
                    unit,
                    vendor,
                    vendor_manager: pmoVendor,
                    manager,
                    start_date: startDate,
                    end_date: dueDate,
                    dueDate: dueDate,
                    budget,
                    status,
                    health,
                    progress
                };
                setCurrentProject(updated);
                setIsEditProjectModalOpen(false);
                showToastNotification?.('Maklumat projek berjaya dikemas kini!');
            } else {
                showToastNotification?.(data.message || 'Gagal mengemas kini projek.');
            }
        } catch (err) {
            console.error("Ralat kemaskini projek:", err);
            showToastNotification?.('Ralat sambungan pelayan.');
        }
    };

    const [activeTab, setActiveTab] = useState('Gambaran Keseluruhan');

    const [milestones, setMilestones] = useState([
        { id: 1, title: 'Fasa 1: Pengumpulan Keperluan', status: 'Selesai', target: 'Suku Ke-1 2026' },
        { id: 2, title: 'Fasa 2: Infrastruktur Teras', status: 'Selesai', target: 'Suku Ke-2 2026' },
        { id: 3, title: 'Fasa 3: Audit Keselamatan', status: 'Aktif', target: 'Suku Ke-3 2026' },
        { id: 4, title: 'Fasa 4: Pelancaran Beta', status: 'Tertunda', target: 'Suku Ke-4 2026' }
    ]);

    const [kanbanTasks, setKanbanTasks] = useState([]);
    const [projectUsers, setProjectUsers] = useState([]);

    const fetchTasks = async () => {
        try {
            const res = await fetch(`http://localhost/My-PMO/api/modules/tasks.php?project_id=${project.id}`);
            const data = await res.json();
            if (data.status === 'success') {
                const mappedTasks = data.data.map(t => ({
                    id: t.id,
                    project: t.project_id,
                    title: t.title,
                    description: t.description || '',
                    status: t.status,
                    priority: t.priority,
                    assignee: t.assignee_id || '', // keep raw ID for matching later
                    dueDate: t.due_date
                }));
                setKanbanTasks(mappedTasks);
            }
        } catch (err) {
            console.error("Ralat tarik tugasan:", err);
        }
    };

    const fetchProjectUsers = async () => {
        try {
            const res = await fetch('http://localhost/My-PMO/api/modules/users.php');
            const data = await res.json();
            if (data.status === 'success') {
                setProjectUsers(data.data);
            }
        } catch (err) {
            console.error("Ralat memuat turun pengguna projek:", err);
        }
    };

    const fetchFinances = async () => {
        try {
            const res = await fetch(`http://localhost/My-PMO/api/modules/finances.php?project_id=${project.id}`);
            const data = await res.json();
            if (data.status === 'success') {
                setFinances(data.data);
            }
        } catch (err) {
            console.error("Ralat memuat turun data kewangan:", err);
        }
    };

    const fetchDocs = async () => {
        try {
            const res = await fetch(`http://localhost/My-PMO/api/modules/documents.php?project_id=${project.id}`);
            const data = await res.json();
            if (data.status === 'success') {
                setDocs(data.data);
            }
        } catch (err) {
            console.error("Ralat memuat turun dokumen:", err);
        }
    };

    const [ganttItems, setGanttItems] = useState([]);
    const [isGanttModalOpen, setIsGanttModalOpen] = useState(false);
    const [editingGanttItem, setEditingGanttItem] = useState(null);
    const [ganttPage, setGanttPage] = useState(0);

    const [teamMembers, setTeamMembers] = useState([]);
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

    const fetchGanttItems = async () => {
        try {
            const res = await fetch(`http://localhost/My-PMO/api/modules/gantt.php?project_id=${project.id}`);
            const data = await res.json();
            if (data.status === 'success') {
                setGanttItems(data.data);
            }
        } catch (err) {
            console.error("Ralat memuat turun data Gantt:", err);
        }
    };

    const fetchTeamMembers = async () => {
        try {
            const res = await fetch(`http://localhost/My-PMO/api/modules/project_members.php?project_id=${project.id}`);
            const data = await res.json();
            if (data.status === 'success') {
                setTeamMembers(data.data);
            }
        } catch (err) {
            console.error("Ralat memuat turun ahli pasukan:", err);
        }
    };

    useEffect(() => {
        if (project?.id) {
            fetchTasks();
            fetchProjectUsers();
            fetchFinances();
            fetchDocs();
            fetchGanttItems();
            fetchTeamMembers();

            try {
                const savedC = localStorage.getItem(`pmo_task_comments_${project.id}`);
                if (savedC) setTaskComments(JSON.parse(savedC));
                const savedA = localStorage.getItem(`pmo_task_attachments_${project.id}`);
                if (savedA) setTaskAttachments(JSON.parse(savedA));
            } catch (e) { }
        }
    }, [project]);
    const [finances, setFinances] = useState([]);
    const [docs, setDocs] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
    const [editingMilestone, setEditingMilestone] = useState(null);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [emailNotificationModal, setEmailNotificationModal] = useState(null);
    const [selectedTaskForDetail, setSelectedTaskForDetail] = useState(null);
    const [taskComments, setTaskComments] = useState(() => {
        try {
            const saved = localStorage.getItem(`pmo_task_comments_${project?.id || 'default'}`);
            if (saved) return JSON.parse(saved);
        } catch (e) { }
        return {
            1: [
                { id: 101, author: 'Zara', role: 'PMO Vendor', text: 'Semakan spesifikasi teknikal telah selesai. Sila teruskan dengan fasa pelaksanaan.', date: '27 Jul 2026 10:30 AM' }
            ]
        };
    });

    const [taskAttachments, setTaskAttachments] = useState(() => {
        try {
            const saved = localStorage.getItem(`pmo_task_attachments_${project?.id || 'default'}`);
            if (saved) return JSON.parse(saved);
        } catch (e) { }
        return {
            1: [
                { id: 201, name: 'Lampiran_Spesifikasi_v1.pdf', size: '1.2 MB', uploader: 'Izzat', date: '27 Jul 2026' }
            ]
        };
    });

    useEffect(() => {
        if (project?.id) {
            try {
                localStorage.setItem(`pmo_task_comments_${project.id}`, JSON.stringify(taskComments));
            } catch (e) { }
        }
    }, [taskComments, project?.id]);

    useEffect(() => {
        if (project?.id) {
            try {
                const cleanAttachments = {};
                Object.keys(taskAttachments).forEach(tId => {
                    cleanAttachments[tId] = (taskAttachments[tId] || []).map(f => {
                        const { fileObj, ...rest } = f;
                        return rest;
                    });
                });
                localStorage.setItem(`pmo_task_attachments_${project.id}`, JSON.stringify(cleanAttachments));
            } catch (e) { }
        }
    }, [taskAttachments, project?.id]);
    const [newCommentText, setNewCommentText] = useState('');
    const [isFinanceModalOpen, setIsFinanceModalOpen] = useState(false);
    const [isPenaltyModalOpen, setIsPenaltyModalOpen] = useState(false);
    const [editingFinance, setEditingFinance] = useState(null);
    const [editingPenalty, setEditingPenalty] = useState(null);
    const [financeToDelete, setFinanceToDelete] = useState(null);
    const [editingDoc, setEditingDoc] = useState(null);
    const [docToDelete, setDocToDelete] = useState(null);
    const [memberToDelete, setMemberToDelete] = useState(null);
    const [milestoneToDelete, setMilestoneToDelete] = useState(null);
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('Semua');
    const [isDocModalOpen, setIsDocModalOpen] = useState(false);

    const handleEditDoc = async (e) => {
        e.preventDefault();
        if (!editingDoc) return;
        const formData = new FormData(e.target);
        const fileName = formData.get('file_name');
        const category = formData.get('category');

        try {
            const res = await fetch('http://localhost/My-PMO/api/modules/documents.php', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: editingDoc.id,
                    file_name: fileName,
                    category: category,
                    user_id: currentUser?.id
                })
            });
            const data = await res.json();
            if (data.status === 'success') {
                fetchDocs();
                setEditingDoc(null);
                showToastNotification?.(`✅ Dokumen '${fileName}' berjaya dikemas kini.`);
            } else {
                alert(data.message || "Gagal mengemaskini dokumen.");
            }
        } catch (err) {
            console.error("Edit doc error:", err);
        }
    };

    const handleAddTeamMember = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const userId = formData.get('user_id');
        const role = formData.get('role') || 'Ahli Pasukan';

        if (!userId) return;

        try {
            const res = await fetch('http://localhost/My-PMO/api/modules/project_members.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ project_id: project.id, user_id: userId, role })
            });
            const data = await res.json();
            if (data.status === 'success') {
                showToastNotification('Ahli pasukan berjaya ditambah!');
                fetchTeamMembers();
                setIsAddMemberModalOpen(false);
            } else {
                alert('Gagal menambah ahli: ' + data.message);
            }
        } catch (err) {
            console.error("Ralat menambah ahli pasukan:", err);
        }
    };

    const handleRemoveTeamMember = async () => {
        if (!memberToDelete) return;
        try {
            const res = await fetch('http://localhost/My-PMO/api/modules/project_members.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: memberToDelete.member_id, project_id: project.id })
            });
            const data = await res.json();
            if (data.status === 'success') {
                showToastNotification('Ahli pasukan berjaya dikeluarkan!');
                fetchTeamMembers();
                setMemberToDelete(null);
            } else {
                alert('Gagal mengeluarkan ahli: ' + data.message);
            }
        } catch (err) {
            console.error("Ralat memadam ahli pasukan:", err);
        }
    };

    const handleSaveGanttItem = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const reqBody = {
            project_id: project.id,
            title: formData.get('title'),
            planned_start: formData.get('planned_start'),
            planned_end: formData.get('planned_end'),
            actual_start: formData.get('actual_start') || null,
            actual_end: formData.get('actual_end') || null,
            progress: parseInt(formData.get('progress') || '0', 10),
            status: formData.get('status'),
            is_milestone: formData.get('is_milestone') ? 1 : 0
        };

        try {
            if (editingGanttItem) {
                const res = await fetch('http://localhost/My-PMO/api/modules/gantt.php', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...reqBody, id: editingGanttItem.id })
                });
                const data = await res.json();
                if (data.status === 'success') {
                    showToastNotification?.('Item Carta Gantt berjaya dikemas kini!');
                }
            } else {
                const res = await fetch('http://localhost/My-PMO/api/modules/gantt.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(reqBody)
                });
                const data = await res.json();
                if (data.status === 'success') {
                    showToastNotification?.('Item Carta Gantt berjaya ditambah!');
                }
            }
            fetchGanttItems();
            setIsGanttModalOpen(false);
        } catch (err) {
            console.error("Ralat menyimpan data Gantt:", err);
        }
    };

    const handleDeleteGanttItem = async (id) => {
        if (!window.confirm("Adakah anda pasti mahu memadam item Carta Gantt ini?")) return;
        try {
            const res = await fetch('http://localhost/My-PMO/api/modules/gantt.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            const data = await res.json();
            if (data.status === 'success') {
                showToastNotification?.('Item Carta Gantt berjaya dipadam!');
                fetchGanttItems();
            }
        } catch (err) {
            console.error("Ralat memadam item Gantt:", err);
        }
    };

    if (!project) return null;

    const columns = [
        { id: 'pending', title: 'Akan Datang', color: 'bg-slate-50 border-slate-200', headerBg: 'bg-slate-100 text-slate-800 border-slate-200', badgeBg: 'bg-slate-200 text-slate-800 border-slate-300' },
        { id: 'in_progress', title: 'Sedang Berjalan', color: 'bg-amber-50/40 border-amber-200', headerBg: 'bg-amber-100/90 text-amber-900 border-amber-200', badgeBg: 'bg-amber-600 text-white border-amber-600' },
        { id: 'completed', title: 'Selesai', color: 'bg-emerald-50/60 border-emerald-200', headerBg: 'bg-emerald-100/90 text-emerald-900 border-emerald-300', badgeBg: 'bg-emerald-600 text-white border-emerald-600' }
    ];

    const syncTaskFilesToDms = async (taskObj) => {
        if (!taskObj) return;
        const attachments = taskAttachments[taskObj.id] || [];
        const unsyncedFiles = attachments.filter(f => !f.syncedToDms);

        if (unsyncedFiles.length === 0) return;

        let syncedCount = 0;
        const updatedAttachments = [...attachments];

        for (const fl of unsyncedFiles) {
            try {
                const formData = new FormData();
                formData.append('project_id', project.id);
                formData.append('uploader_id', currentUser?.id || '1');
                formData.append('category', 'Kanban File');
                formData.append('fileName', fl.name.replace(/\.[^/.]+$/, ""));

                if (fl.fileObj) {
                    formData.append('file', fl.fileObj);
                } else {
                    const blob = new Blob([`Kandungan lampiran tugasan: ${fl.name}`], { type: 'text/plain' });
                    formData.append('file', blob, fl.name);
                }

                const res = await fetch('http://localhost/My-PMO/api/modules/documents.php', {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();
                if (data.status === 'success') {
                    syncedCount++;
                    const itemIdx = updatedAttachments.findIndex(item => item.id === fl.id);
                    if (itemIdx !== -1) {
                        updatedAttachments[itemIdx] = {
                            ...updatedAttachments[itemIdx],
                            syncedToDms: true,
                            dmsDocId: data.id
                        };
                    }
                }
            } catch (err) {
                console.error("Gagal menyelaraskan fail ke DMS:", err);
            }
        }

        if (syncedCount > 0) {
            setTaskAttachments({
                ...taskAttachments,
                [taskObj.id]: updatedAttachments
            });
            if (typeof fetchDocs === 'function') fetchDocs();
            showToastNotification?.(`📁 ${syncedCount} dokumen lampiran tugasan '${taskObj.title}' berjaya dihantar & diselaraskan ke Repositori Dokumen (DMS)!`);
        }
    };

    const unsyncTaskFilesFromDms = async (taskObj) => {
        if (!taskObj) return;
        const attachments = taskAttachments[taskObj.id] || [];
        const syncedFiles = attachments.filter(f => f.syncedToDms || f.dmsDocId);

        if (syncedFiles.length === 0) return;

        let removedCount = 0;
        const updatedAttachments = [...attachments];

        for (const fl of syncedFiles) {
            let targetDocId = fl.dmsDocId;
            if (!targetDocId && Array.isArray(docs)) {
                const matchedDoc = docs.find(d => d.file_name === fl.name);
                if (matchedDoc) targetDocId = matchedDoc.id;
            }

            if (targetDocId) {
                try {
                    const res = await fetch('http://localhost/My-PMO/api/modules/documents.php', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: targetDocId, user_id: currentUser?.id })
                    });
                    const data = await res.json();
                    if (data.status === 'success') {
                        removedCount++;
                        const itemIdx = updatedAttachments.findIndex(item => item.id === fl.id);
                        if (itemIdx !== -1) {
                            updatedAttachments[itemIdx] = {
                                ...updatedAttachments[itemIdx],
                                syncedToDms: false,
                                dmsDocId: null
                            };
                        }
                    }
                } catch (err) {
                    console.error("Gagal mengeluarkan dokumen dari DMS:", err);
                }
            }
        }

        if (removedCount > 0) {
            setTaskAttachments({
                ...taskAttachments,
                [taskObj.id]: updatedAttachments
            });
            if (typeof fetchDocs === 'function') fetchDocs();
            showToastNotification?.(`ℹ️ ${removedCount} dokumen lampiran tugasan '${taskObj.title}' telah dikeluarkan daripada Repositori Dokumen (DMS).`);
        }
    };

    const handleDragStart = (e, taskId) => {
        e.dataTransfer.setData('taskId', taskId);
    };

    const handleDrop = async (e, newStatus) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        const taskObj = kanbanTasks.find(t => t.id == taskId);
        const prevStatus = taskObj?.status;
        const assignedUser = projectUsers.find(u => u.id == taskObj?.assignee);
        const officerName = assignedUser?.name || 'Pegawai Bertanggungjawab';

        setKanbanTasks(kanbanTasks.map(t => t.id == taskId ? { ...t, status: newStatus } : t));

        if (newStatus === 'completed') {
            syncTaskFilesToDms(taskObj);
            showToastNotification?.(`✅ Tugasan '${taskObj?.title || 'Tugasan'}' telah diselesaikan! Notifikasi dihantar kepada PMO & ${officerName}.`);
        } else {
            if (prevStatus === 'completed') {
                unsyncTaskFilesFromDms(taskObj);
            }
            showToastNotification?.(`Status tugasan ditukar kepada ${newStatus === 'in_progress' ? 'Sedang Berjalan' : 'Akan Datang'}`);
        }

        try {
            await fetch('http://localhost/My-PMO/api/modules/tasks.php', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: taskId, status: newStatus })
            });
        } catch (err) {
            console.error("Gagal mengemaskini status:", err);
            fetchTasks();
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleSaveMilestone = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newTitle = formData.get('title');
        const newStatus = formData.get('status');
        const newTarget = formData.get('target');

        if (editingMilestone) {
            setMilestones(milestones.map(m => m.id === editingMilestone.id ? { ...m, title: newTitle, status: newStatus, target: newTarget } : m));
        } else {
            setMilestones([...milestones, { id: Date.now(), title: newTitle, status: newStatus, target: newTarget }]);
        }
        setIsMilestoneModalOpen(false);
    };

    const handleDeleteMilestone = () => {
        if (!milestoneToDelete) return;
        setMilestones(prev => prev.filter(m => m.id !== milestoneToDelete.id));
        showToastNotification?.('Pencapaian (Milestone) berjaya dipadam!');
        setMilestoneToDelete(null);
    };

    const handleSaveTask = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const title = formData.get('title');
        const description = formData.get('description') || '';
        const priority = formData.get('priority') || 'Sederhana';
        const dueDate = formData.get('dueDate');
        const assigneeId = formData.get('assignee');
        const status = formData.get('status') || 'pending';
        const assignedUser = projectUsers.find(u => u.id == assigneeId);

        try {
            if (editingTask) {
                await fetch('http://localhost/My-PMO/api/modules/tasks.php', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: editingTask.id,
                        title,
                        description,
                        status,
                        priority,
                        due_date: dueDate,
                        assignee_id: assigneeId
                    })
                });
                setKanbanTasks(kanbanTasks.map(t => t.id === editingTask.id ? { ...t, title, description, status, priority, dueDate, assignee: assigneeId } : t));
                if (selectedTaskForDetail && selectedTaskForDetail.id === editingTask.id) {
                    setSelectedTaskForDetail(prev => ({ ...prev, title, description, status, priority, dueDate, assignee: assigneeId }));
                }
                showToastNotification?.('Tugasan berjaya dikemas kini.');
            } else {
                const newTaskObj = {
                    id: Date.now(),
                    project_id: project.id,
                    title,
                    description,
                    status: 'pending',
                    priority,
                    dueDate,
                    assignee: assigneeId
                };
                await fetch('http://localhost/My-PMO/api/modules/tasks.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        project_id: project.id,
                        title,
                        description,
                        priority,
                        due_date: dueDate,
                        assignee_id: assigneeId
                    })
                });
                setKanbanTasks([...kanbanTasks, newTaskObj]);
                showToastNotification?.('Tugasan baharu ditambah ke Kanban.');
            }

            fetchTasks();

            if (assignedUser) {
                // 1. Trigger System Bell Notification
                triggerBellNotification(
                    `🔔 Tugasan Ditugaskan: ${title}`,
                    `Anda telah ditugaskan oleh PMO untuk menyiap tugasan '${title}' (${project.name}) sebelum ${dueDate || 'tarikh tamat'}.`
                );

                // 2. Launch Email Notification Modal Preview
                setEmailNotificationModal({
                    recipientName: assignedUser.name,
                    recipientEmail: assignedUser.email || `${assignedUser.name.toLowerCase().replace(/\s+/g, '.')}@kehakiman.gov.my`,
                    taskTitle: title,
                    description: description || 'Tiada keterangan khas diberikan oleh PMO.',
                    priority,
                    dueDate: dueDate || '12 Ogo 2026',
                    projectName: project.name,
                    senderName: currentUser?.name || 'Pengarah PMO'
                });
            }

            fetchTasks();
            setIsTaskModalOpen(false);
        } catch (err) {
            console.error("Gagal simpan tugasan:", err);
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            const res = await fetch('http://localhost/My-PMO/api/modules/tasks.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            const data = await res.json();
            if (data.status === 'success') {
                showToastNotification?.('Tugasan dipadam.');
                fetchTasks();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaveFinance = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const amtStr = formData.get('amount') || '0';
        const cleanedAmount = parseFloat(amtStr.toString().replace(/,/g, '')) || 0;

        const reqBody = {
            project_id: project.id,
            invoice_no: formData.get('invId'),
            description: formData.get('description'),
            vendor: formData.get('vendor'),
            amount: cleanedAmount,
            status: formData.get('status'),
            date: formData.get('date'),
            user_id: currentUser?.id
        };

        try {
            if (editingFinance) {
                const res = await fetch('http://localhost/My-PMO/api/modules/finances.php', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...reqBody, id: editingFinance.id })
                });
                const data = await res.json();
                if (data.status === 'success') {
                    showToastNotification('Rekod kewangan berjaya dikemas kini!');
                }
            } else {
                const res = await fetch('http://localhost/My-PMO/api/modules/finances.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(reqBody)
                });
                const data = await res.json();
                if (data.status === 'success') {
                    showToastNotification('Tuntutan baru berjaya didaftarkan!');
                }
            }
            fetchFinances();
            setIsFinanceModalOpen(false);
        } catch (err) {
            console.error("Ralat menyimpan data kewangan:", err);
        }
    };

    const handleDeleteFinance = async (id) => {
        try {
            const res = await fetch('http://localhost/My-PMO/api/modules/finances.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, user_id: currentUser?.id })
            });
            const data = await res.json();
            if (data.status === 'success') {
                showToastNotification('Rekod kewangan berjaya dipadam!');
                fetchFinances();
            }
        } catch (err) {
            console.error("Ralat memadam rekod kewangan:", err);
        }
    };

    const handleSavePenalty = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const refNo = formData.get('refNo');
        const description = formData.get('description');
        const slaCategory = formData.get('slaCategory') || 'Kelewatan Masa';
        const vendor = formData.get('vendor') || project.vendor || 'Vendor Utama';
        const amtStr = formData.get('amount') || '0';
        const cleanedAmount = parseFloat(amtStr.toString().replace(/,/g, '')) || 0;
        const date = formData.get('date');
        const notes = formData.get('notes') || '';
        const fileInput = formData.get('file');

        if (!refNo || !description || cleanedAmount <= 0 || !date) {
            alert('Sila isi maklumat wajib denda SLA (No. Rujukan, Keterangan, Tarikh & Amaun).');
            return;
        }

        let uploadedDocMsg = '';
        if (fileInput && fileInput.name && fileInput.size > 0) {
            try {
                const docFormData = new FormData();
                docFormData.append('project_id', project.id);
                docFormData.append('category', 'Denda');
                docFormData.append('uploader_id', currentUser?.id || 1);
                docFormData.append('fileName', `Butiran_Denda_${refNo}`);
                docFormData.append('file', fileInput);

                const docRes = await fetch('http://localhost/My-PMO/api/modules/documents.php', {
                    method: 'POST',
                    body: docFormData
                });
                const docData = await docRes.json();
                if (docData.status === 'success') {
                    uploadedDocMsg = ' & fail detail denda automatik disimpan ke DMS (Folder Denda)';
                }
            } catch (err) {
                console.error("Ralat muat naik fail denda ke DMS:", err);
            }
        }

        const reqBody = {
            project_id: project.id,
            invoice_no: refNo,
            description: `[DENDA SLA: ${slaCategory}] ${description}${notes ? ' (' + notes + ')' : ''}`,
            vendor: vendor,
            amount: cleanedAmount,
            status: 'Denda SLA',
            type: 'Denda',
            date: date,
            user_id: currentUser?.id
        };

        try {
            if (editingPenalty) {
                const res = await fetch('http://localhost/My-PMO/api/modules/finances.php', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...reqBody, id: editingPenalty.id })
                });
                const data = await res.json();
                if (data.status === 'success') {
                    showToastNotification?.(`⚠️ Denda SLA berjaya dikemas kini${uploadedDocMsg}!`);
                    fetchFinances();
                    fetchDocs();
                    setIsPenaltyModalOpen(false);
                    setEditingPenalty(null);
                } else {
                    alert('Gagal mengemaskini denda: ' + data.message);
                }
            } else {
                const res = await fetch('http://localhost/My-PMO/api/modules/finances.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(reqBody)
                });
                const data = await res.json();
                if (data.status === 'success') {
                    showToastNotification?.(`⚠️ Denda SLA sebanyak RM ${cleanedAmount.toLocaleString('ms-MY', { minimumFractionDigits: 2 })} berjaya didaftarkan${uploadedDocMsg}!`);
                    fetchFinances();
                    fetchDocs();
                    setIsPenaltyModalOpen(false);
                } else {
                    alert('Gagal mendaftar denda: ' + data.message);
                }
            }
        } catch (err) {
            console.error("Ralat menyimpan Denda SLA:", err);
        }
    };

    const handleUploadDoc = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append('project_id', project.id);
        formData.append('uploader_id', currentUser?.id || '');

        try {
            const res = await fetch('http://localhost/My-PMO/api/modules/documents.php', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.status === 'success') {
                showToastNotification('Dokumen berjaya dimuat naik!');
                fetchDocs();
                setIsDocModalOpen(false);
                setSelectedFile(null);
            } else {
                alert('Gagal memuat naik: ' + data.message);
            }
        } catch (err) {
            console.error("Ralat memuat naik dokumen:", err);
            alert('Ralat semasa menghubungi pelayan.');
        }
    };

    const handleDeleteDoc = async (id) => {
        try {
            const res = await fetch('http://localhost/My-PMO/api/modules/documents.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, user_id: currentUser?.id })
            });
            const data = await res.json();
            if (data.status === 'success') {
                showToastNotification('Dokumen berjaya dipadam!');
                fetchDocs();
            } else {
                alert('Gagal memadam dokumen: ' + data.message);
            }
        } catch (err) {
            console.error("Ralat memadam dokumen:", err);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">

            {/* --- ALL POPUP MODALS --- */}
            {isGanttModalOpen && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsGanttModalOpen(false)}></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-2xl animate-in zoom-in-95 duration-200">
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-[32px]">
                                <div>
                                    <h2 className="text-xl font-extrabold text-slate-900">{editingGanttItem ? 'Kemaskini Item Carta Gantt' : 'Tambah Fasa / Item Gantt Baharu'}</h2>
                                    <p className="text-slate-500 text-xs font-medium mt-1">Isi tarikh perancangan dan pelaksanaan sebenar bagi item ini.</p>
                                </div>
                                <button onClick={() => setIsGanttModalOpen(false)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200 text-slate-500 hover:text-slate-900">&times;</button>
                            </div>
                            <form onSubmit={handleSaveGanttItem} className="p-8 space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Tajuk Fasa / Tugasan / Pencapaian</label>
                                    <input name="title" defaultValue={editingGanttItem?.title || ''} required type="text" placeholder="Cth: Fasa 1: Pengumpulan Keperluan" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none font-medium text-slate-900" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 bg-indigo-50/40 rounded-2xl border border-indigo-100">
                                    <div className="md:col-span-2 text-xs font-extrabold uppercase tracking-wider text-indigo-900">1. Garis Masa Perancangan (Planned)</div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Tarikh Mula Dirancang</label>
                                        <input name="planned_start" defaultValue={editingGanttItem?.planned_start || ''} required type="date" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none text-sm font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Tarikh Tamat Dirancang</label>
                                        <input name="planned_end" defaultValue={editingGanttItem?.planned_end || ''} required type="date" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none text-sm font-medium" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 bg-emerald-50/40 rounded-2xl border border-emerald-100">
                                    <div className="md:col-span-2 text-xs font-extrabold uppercase tracking-wider text-emerald-900">2. Pelaksanaan Sebenar (Actual)</div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Tarikh Mula Sebenar (Jika bermula)</label>
                                        <input name="actual_start" defaultValue={editingGanttItem?.actual_start || ''} type="date" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none text-sm font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Tarikh Tamat Sebenar (Jika siap)</label>
                                        <input name="actual_end" defaultValue={editingGanttItem?.actual_end || ''} type="date" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none text-sm font-medium" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Kemajuan Sebenar (%)</label>
                                        <input name="progress" defaultValue={editingGanttItem?.progress || 0} required type="number" min="0" max="100" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Status Fasa</label>
                                        <select name="status" defaultValue={editingGanttItem?.status || 'Belum Mula'} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold">
                                            <option value="Belum Mula">Belum Mula</option>
                                            <option value="Sedang Berjalan">Sedang Berjalan</option>
                                            <option value="Selesai">Selesai</option>
                                            <option value="Tertunda">Tertunda</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 pt-2">
                                    <input type="checkbox" id="is_milestone" name="is_milestone" defaultChecked={!!editingGanttItem?.is_milestone} className="w-5 h-5 accent-indigo-600 rounded cursor-pointer" />
                                    <label htmlFor="is_milestone" className="text-sm font-bold text-slate-800 cursor-pointer">Tanda sebagai Pencapaian Utama (Milestone ◆)</label>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                                    <button type="button" onClick={() => setIsGanttModalOpen(false)} className="px-5 py-3 rounded-xl font-bold text-slate-600 border border-slate-200 hover:bg-slate-50">Batal</button>
                                    <button type="submit" className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 shadow-md">
                                        {editingGanttItem ? 'Simpan Perubahan' : 'Tambah Fasa'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {isMilestoneModalOpen && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsMilestoneModalOpen(false)}></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-xl animate-in zoom-in-95 duration-200">
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-[32px]">
                                <h2 className="text-xl font-extrabold text-slate-900">{editingMilestone ? 'Kemaskini Pencapaian' : 'Tambah Pencapaian'}</h2>
                                <button onClick={() => setIsMilestoneModalOpen(false)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200">&times;</button>
                            </div>
                            <form onSubmit={handleSaveMilestone} className="p-8 space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Keterangan / Fasa</label>
                                    <input name="title" defaultValue={editingMilestone?.title || ''} required type="text" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Sasaran Penyiapan</label>
                                        <input name="target" defaultValue={editingMilestone?.target || ''} required type="text" placeholder="Cth: Suku Ke-1 2026" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
                                        <select name="status" defaultValue={editingMilestone?.status || 'Aktif'} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none">
                                            <option value="Selesai">Selesai</option>
                                            <option value="Aktif">Aktif</option>
                                            <option value="Tertunda">Tertunda</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4"><button type="submit" className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800">Simpan Pencapaian</button></div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {isTaskModalOpen && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsTaskModalOpen(false)}></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-xl animate-in zoom-in-95 duration-200">
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-[32px]">
                                <h2 className="text-xl font-extrabold text-slate-900">{editingTask ? 'Kemaskini Tugasan' : 'Tambah Tugasan Baharu'}</h2>
                                <button onClick={() => setIsTaskModalOpen(false)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200">&times;</button>
                            </div>
                            <form onSubmit={handleSaveTask} className="p-8 space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Tajuk Tugasan</label>
                                        <input name="title" defaultValue={editingTask?.title || ''} required type="text" placeholder="Apa yang perlu disiapkan?" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Keterangan / Arahan Tugasan (Khas Pegawai)</label>
                                        <textarea name="description" defaultValue={editingTask?.description || ''} rows={3} placeholder="Masukkan arahan terperinci atau skop kerja supaya pegawai jelas dengan tugas ini..." className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none resize-none text-sm font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Status Semasa</label>
                                        <select name="status" defaultValue={editingTask?.status || 'pending'} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none">
                                            <option value="pending">Akan Datang</option>
                                            <option value="in_progress">Sedang Berjalan</option>
                                            <option value="completed">Selesai</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Keutamaan</label>
                                        <select name="priority" defaultValue={editingTask?.priority || 'Sederhana'} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none">
                                            <option value="Sederhana">Sederhana</option>
                                            <option value="Tinggi">Tinggi</option>
                                            <option value="Segera">Segera</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Pegawai Bertanggungjawab</label>
                                        <select name="assignee" defaultValue={editingTask?.assignee || ''} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none">
                                            <option value="">Belum Ditugaskan</option>
                                            {projectUsers.map(u => (
                                                <option key={u.id} value={u.id}>{u.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Tarikh Siap (Due Date)</label>
                                        <input name="dueDate" defaultValue={editingTask?.dueDate || ''} required type="date" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4"><button type="submit" className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800">{editingTask ? 'Simpan Perubahan' : 'Tambah ke Papan'}</button></div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {isFinanceModalOpen && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsFinanceModalOpen(false)}></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-2xl animate-in zoom-in-95 duration-200">
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-[32px]">
                                <h2 className="text-xl font-extrabold text-slate-900">{editingFinance ? 'Kemaskini Tuntutan' : 'Daftar Tuntutan/Invois'}</h2>
                                <button onClick={() => setIsFinanceModalOpen(false)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200">&times;</button>
                            </div>
                            <form onSubmit={handleSaveFinance} className="p-8 space-y-5">
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">No. Invois</label>
                                        <input name="invId" defaultValue={editingFinance?.invoice_no || `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 900) + 100}`} required type="text" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-indigo-700" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Tarikh Tuntutan</label>
                                        <input name="date" defaultValue={editingFinance?.date || ''} required type="date" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Keterangan Bayaran</label>
                                    <input name="description" defaultValue={editingFinance?.description || ''} required type="text" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Nama Vendor</label>
                                    <input name="vendor" defaultValue={editingFinance?.vendor || project.vendor || ''} required type="text" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Jumlah (RM)</label>
                                        <input name="amount" defaultValue={editingFinance?.amount || ''} required type="text" placeholder="Cth: 15,000.00" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
                                        <select name="status" defaultValue={editingFinance?.status || 'Menunggu Kelulusan'} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none">
                                            <option value="Selesai">Selesai</option>
                                            <option value="Menunggu Kelulusan">Menunggu Kelulusan</option>
                                            <option value="Ditolak">Ditolak</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4"><button type="submit" className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 shadow-lg">Simpan Kewangan</button></div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {isPenaltyModalOpen && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={() => setIsPenaltyModalOpen(false)}></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
                            <div className="p-6 lg:p-8 border-b border-rose-100 flex justify-between items-center bg-rose-50/80 rounded-t-[32px]">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-rose-600 text-white rounded-xl flex items-center justify-center shadow-md">
                                        <AlertTriangle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-extrabold text-slate-900">{editingPenalty ? 'Kemaskini Denda SLA Projek' : 'Borang Denda SLA Projek'}</h2>
                                        <p className="text-xs text-rose-700 font-medium">{editingPenalty ? 'Kemaskini rekod denda SLA dan maklumat berkaitan' : 'Rekod denda pelanggaran SLA & dokumen bukti secara automatik ke DMS'}</p>
                                    </div>
                                </div>
                                <button onClick={() => { setIsPenaltyModalOpen(false); setEditingPenalty(null); }} className="w-8 h-8 bg-white text-slate-500 rounded-full flex items-center justify-center border border-rose-200 hover:bg-rose-100 transition-colors">&times;</button>
                            </div>
                            <form onSubmit={handleSavePenalty} className="p-6 lg:p-8 space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">No. Rujukan Denda / SLA <span className="text-rose-500">*</span></label>
                                        <input name="refNo" defaultValue={editingPenalty?.invoice_no || `DND-${new Date().getFullYear()}-${Math.floor(Math.random() * 900) + 100}`} required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-rose-700" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Tarikh Kejadian / Denda <span className="text-rose-500">*</span></label>
                                        <input name="date" defaultValue={editingPenalty?.date || new Date().toISOString().split('T')[0]} required type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Kategori SLA <span className="text-rose-500">*</span></label>
                                        <select name="slaCategory" defaultValue="Kelewatan Masa (Delay)" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-slate-800 font-medium">
                                            <option value="Kelewatan Masa (Delay)">Kelewatan Masa (Delay)</option>
                                            <option value="Ketersediaan Sistem (Downtime)">Ketersediaan Sistem (Downtime)</option>
                                            <option value="Kualiti Penyerahan (Defect)">Kualiti Penyerahan (Defect)</option>
                                            <option value="Pematuhan SOP / Kontrak">Pematuhan SOP / Kontrak</option>
                                            <option value="Lain-lain">Lain-lain</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Nama Vendor / Kontraktor</label>
                                        <input name="vendor" defaultValue={editingPenalty?.vendor || project.vendor || ''} required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Tajuk / Keterangan Denda <span className="text-rose-500">*</span></label>
                                    <input name="description" defaultValue={editingPenalty?.description ? editingPenalty.description.replace(/^\[DENDA SLA:[^\]]+\]\s*/, '') : ''} required type="text" placeholder="Cth: Kelewatan Penyerahan UAT 4 hari melebihi jadual SLA" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Jumlah Denda (RM) <span className="text-rose-500">*</span></label>
                                        <input name="amount" defaultValue={editingPenalty?.amount || ''} required type="text" placeholder="Cth: 5,000.00" className="w-full px-4 py-3 bg-rose-50/50 border border-rose-200 rounded-2xl outline-none font-extrabold text-rose-700 text-lg" />
                                        <p className="text-[11px] text-slate-400 mt-1">Nilai ini akan ditolak secara automatik daripada perbelanjaan projek.</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Fail Bukti / Detail Denda (Auto DMS)</label>
                                        <input name="file" type="file" className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-100 file:text-rose-700 hover:file:bg-rose-200" />
                                        <p className="text-[11px] text-slate-400 mt-1">Fail ini akan disimpan secara automatik ke DMS di bawah folder 'Denda'.</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Catatan / Pengiraan Formula SLA</label>
                                    <textarea name="notes" rows="2" placeholder="Cth: Denda 0.5% sehari x 4 hari kelewatan daripada jumlah fasa RM 250,000" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm"></textarea>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                                    <button type="button" onClick={() => { setIsPenaltyModalOpen(false); setEditingPenalty(null); }} className="px-5 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200">
                                        Batal
                                    </button>
                                    <button type="submit" className="px-6 py-2.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 shadow-md shadow-rose-200 transition-all flex items-center">
                                        <AlertTriangle className="w-4 h-4 mr-2" /> {editingPenalty ? 'Simpan Perubahan' : 'Simpan Denda SLA'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {financeToDelete && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl p-6 lg:p-8 max-w-md w-full shadow-2xl border border-slate-100 text-center space-y-4">
                        <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                            <AlertTriangle className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-xl font-extrabold text-slate-900">Padam Tuntutan?</h3>
                            <p className="text-sm font-medium text-slate-500 mt-2">
                                Adakah anda pasti ingin memadamkan tuntutan <span className="font-bold text-slate-800">{financeToDelete.invoice_no || financeToDelete.description}</span>? Tindakan ini tidak boleh dibatalkan.
                            </p>
                        </div>
                        <div className="flex items-center justify-center space-x-3 pt-2">
                            <button
                                onClick={() => setFinanceToDelete(null)}
                                className="w-1/2 py-3 px-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => {
                                    handleDeleteFinance(financeToDelete.id);
                                    setFinanceToDelete(null);
                                }}
                                className="w-1/2 py-3 px-4 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md hover:shadow-lg transition-all"
                            >
                                Ya, Padam
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {docToDelete && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl p-6 lg:p-8 max-w-md w-full shadow-2xl border border-slate-100 text-center space-y-4">
                        <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                            <AlertTriangle className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-xl font-extrabold text-slate-900">Padam Dokumen?</h3>
                            <p className="text-sm font-medium text-slate-500 mt-2">
                                Adakah anda pasti ingin memadamkan dokumen <span className="font-bold text-slate-800">{docToDelete.file_name}</span>? Tindakan ini akan memadamkan dokumen.
                            </p>
                        </div>
                        <div className="flex items-center justify-center space-x-3 pt-2">
                            <button
                                onClick={() => setDocToDelete(null)}
                                className="w-1/2 py-3 px-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => {
                                    handleDeleteDoc(docToDelete.id);
                                    setDocToDelete(null);
                                }}
                                className="w-1/2 py-3 px-4 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md hover:shadow-lg transition-all"
                            >
                                Ya, Padam
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {taskToDelete && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl p-6 lg:p-8 max-w-md w-full shadow-2xl border border-slate-100 text-center space-y-4">
                        <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                            <AlertTriangle className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-xl font-extrabold text-slate-900">Padam Tugasan?</h3>
                            <p className="text-sm font-medium text-slate-500 mt-2">
                                Adakah anda pasti ingin memadamkan tugasan <span className="font-bold text-slate-800">{taskToDelete.title}</span>? Tindakan ini akan memadamkan tugasan daripada Papan Kanban secara kekal.
                            </p>
                        </div>
                        <div className="flex items-center justify-center space-x-3 pt-2">
                            <button
                                onClick={() => setTaskToDelete(null)}
                                className="w-1/2 py-3 px-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => {
                                    handleDeleteTask(taskToDelete.id);
                                    setTaskToDelete(null);
                                }}
                                className="w-1/2 py-3 px-4 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md hover:shadow-lg transition-all"
                            >
                                Ya, Padam
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {emailNotificationModal && (
                <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[110] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden space-y-0">
                        {/* Top Email Header */}
                        <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-md text-lg">
                                    📧
                                </div>
                                <div>
                                    <h4 className="font-extrabold text-base text-white">E-mel Notifikasi Tugasan Dihantar!</h4>
                                    <p className="text-xs text-slate-400">Sistem Penghantaran Emel Automatik MY-PMO</p>
                                </div>
                            </div>
                            <button onClick={() => setEmailNotificationModal(null)} className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-lg">&times;</button>
                        </div>

                        {/* Email Body Template */}
                        <div className="p-6 bg-slate-50 space-y-4">
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                                <div className="flex justify-between items-center border-b border-slate-100 pb-3 text-xs">
                                    <div>
                                        <span className="text-slate-400 font-semibold block">Daripada:</span>
                                        <span className="font-extrabold text-slate-800">MY-PMO System &lt;notifikasi@kehakiman.gov.my&gt;</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-slate-400 font-semibold block">Kepada:</span>
                                        <span className="font-extrabold text-indigo-600">{emailNotificationModal.recipientEmail}</span>
                                    </div>
                                </div>

                                <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 flex items-center justify-between text-xs">
                                    <span className="font-bold text-indigo-900">Projek: {emailNotificationModal.projectName}</span>
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-600 text-white">
                                        Keutamaan: {emailNotificationModal.priority}
                                    </span>
                                </div>

                                <div className="space-y-2 pt-1">
                                    <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
                                        Tugasan Baharu: "{emailNotificationModal.taskTitle}"
                                    </h3>
                                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                        Salam sejahtera <strong>{emailNotificationModal.recipientName}</strong>,<br />
                                        Anda telah ditugaskan oleh PMO (<strong>{emailNotificationModal.senderName}</strong>) untuk melaksana dan menyiap tugasan ini mengikut jadual.
                                    </p>
                                </div>

                                {/* Description Block */}
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1">
                                    <span className="font-extrabold text-slate-500 text-[10px] uppercase tracking-wider block">Keterangan & Arahan PMO:</span>
                                    <p className="text-slate-800 font-semibold leading-relaxed">{emailNotificationModal.description}</p>
                                </div>

                                <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-100">
                                    <span>📅 Tarikh Tamat: <strong>{emailNotificationModal.dueDate}</strong></span>
                                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> E-mel Berjaya Dihantar
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Email Modal Footer */}
                        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-medium">🔔 Notifikasi sistem loceng juga telah diaktifkan untuk pengguna ini.</span>
                            <button onClick={() => setEmailNotificationModal(null)} className="px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 shadow-md">
                                Tutup Emel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {selectedTaskForDetail && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="p-6 bg-slate-900 text-white flex justify-between items-start shrink-0">
                            <div>
                                <div className="flex items-center space-x-2 mb-2">
                                    <Badge text={selectedTaskForDetail.priority} />
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${selectedTaskForDetail.status === 'completed'
                                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                        : selectedTaskForDetail.status === 'in_progress'
                                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                            : 'bg-slate-700 text-slate-300 border-slate-600'
                                        }`}>
                                        {selectedTaskForDetail.status === 'completed' ? '✓ Selesai' : selectedTaskForDetail.status === 'in_progress' ? 'Sedang Berjalan' : 'Akan Datang'}
                                    </span>
                                </div>
                                <h3 className="text-xl font-extrabold text-white leading-snug">{selectedTaskForDetail.title}</h3>
                                <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                                    <span>📅 Tarikh Tamat: <strong>{selectedTaskForDetail.dueDate || 'Tiada Tarikh'}</strong></span>
                                    <span>•</span>
                                    <span>👤 Pegawai: <strong>{projectUsers.find(u => u.id == selectedTaskForDetail.assignee)?.name || 'Belum Ditugaskan'}</strong></span>
                                </p>
                            </div>
                            <button onClick={() => setSelectedTaskForDetail(null)} className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors">&times;</button>
                        </div>

                        {/* Modal Body: Status Switcher, Comments, File Upload */}
                        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
                            {/* Keterangan / Arahan PMO Block */}
                            <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-100 space-y-1">
                                <label className="text-[11px] font-extrabold text-indigo-700 uppercase tracking-wider block">Keterangan / Arahan PMO</label>
                                <p className="text-xs text-slate-800 font-semibold leading-relaxed">{selectedTaskForDetail.description || 'Tiada keterangan khas diberikan oleh PMO.'}</p>
                            </div>

                            {/* Status Quick Switcher */}
                            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                                <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">Kemas Kini Status Tugasan</label>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { id: 'pending', label: 'Akan Datang', cls: 'bg-slate-100 text-slate-700 hover:bg-slate-200' },
                                        { id: 'in_progress', label: 'Sedang Berjalan', cls: 'bg-amber-100 text-amber-800 hover:bg-amber-200' },
                                        { id: 'completed', label: '✓ Selesai (Notifikasi PMO)', cls: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm' }
                                    ].map(st => (
                                        <button
                                            key={st.id}
                                            onClick={async () => {
                                                const prevStatus = selectedTaskForDetail.status;
                                                const updated = { ...selectedTaskForDetail, status: st.id };
                                                setSelectedTaskForDetail(updated);
                                                setKanbanTasks(kanbanTasks.map(t => t.id === updated.id ? updated : t));
                                                if (st.id === 'completed') {
                                                    syncTaskFilesToDms(updated);
                                                    const assignedUser = projectUsers.find(u => u.id == updated.assignee);
                                                    triggerBellNotification(
                                                        `✅ Tugasan Selesai: ${updated.title}`,
                                                        `${assignedUser?.name || 'Pegawai'} telah menyelesaikan tugasan '${updated.title}' bagi projek ${project.name}.`
                                                    );
                                                    showToastNotification?.(`✅ Tugasan '${updated.title}' telah diselesaikan! Dokumen lampiran diselaraskan ke DMS.`);
                                                } else {
                                                    if (prevStatus === 'completed') {
                                                        unsyncTaskFilesFromDms(updated);
                                                    }
                                                    showToastNotification?.(`Status tugasan ditukar kepada ${st.label}`);
                                                }
                                                try {
                                                    await fetch('http://localhost/My-PMO/api/modules/tasks.php', {
                                                        method: 'PUT',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({ id: updated.id, status: st.id })
                                                    });
                                                } catch (err) { console.error(err); }
                                            }}
                                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${selectedTaskForDetail.status === st.id ? 'ring-2 ring-indigo-600 ring-offset-1 ' + st.cls : 'opacity-70 hover:opacity-100 ' + st.cls
                                                }`}
                                        >
                                            {st.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Section: Comments */}
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                    <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4 text-indigo-600" /> Ruang Komen Ahli Pasukan
                                    </h4>
                                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                        {(taskComments[selectedTaskForDetail.id] || []).length} Komen
                                    </span>
                                </div>

                                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                                    {(taskComments[selectedTaskForDetail.id] || []).length > 0 ? (
                                        (taskComments[selectedTaskForDetail.id] || []).map(cm => (
                                            <div key={cm.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-bold text-slate-900">{cm.author} <span className="text-[10px] text-indigo-600 font-semibold">({cm.role})</span></span>
                                                    <span className="text-[10px] font-medium text-slate-400">{cm.date}</span>
                                                </div>
                                                <p className="text-slate-700 text-xs leading-relaxed font-medium">{cm.text}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-400 italic text-center py-3">Belum ada komen untuk tugasan ini. Sila hantar komen pertama.</p>
                                    )}
                                </div>

                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    if (!newCommentText.trim()) return;
                                    const taskId = selectedTaskForDetail.id;
                                    const newCm = {
                                        id: Date.now(),
                                        author: currentUser?.name || 'Ahli Pasukan',
                                        role: currentUser?.role || 'Ahli Pasukan',
                                        text: newCommentText.trim(),
                                        date: 'Hari ini'
                                    };
                                    setTaskComments({
                                        ...taskComments,
                                        [taskId]: [...(taskComments[taskId] || []), newCm]
                                    });

                                    // Trigger In-System Bell Notification for team members
                                    triggerBellNotification(
                                        `💬 Komen Baharu: ${selectedTaskForDetail.title}`,
                                        `${currentUser?.name || 'Ahli Pasukan'} menambah komen pada tugasan '${selectedTaskForDetail.title}': "${newCommentText.trim().substring(0, 45)}..."`
                                    );

                                    setNewCommentText('');
                                    showToastNotification?.('💬 Komen ditambah & notifikasi loceng dihantar kepada semua ahli pasukan!');
                                }} className="flex gap-2 pt-2 border-t border-slate-100">
                                    <input
                                        type="text"
                                        value={newCommentText}
                                        onChange={(e) => setNewCommentText(e.target.value)}
                                        placeholder="Tulis komen atau kemaskini kerja..."
                                        className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                    <button type="submit" className="px-4 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors">
                                        Hantar
                                    </button>
                                </form>
                            </div>

                            {/* Section: File Attachments */}
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                    <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                                        <Paperclip className="w-4 h-4 text-indigo-600" /> Muat Naik & Lampiran Fail
                                    </h4>
                                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                        {(taskAttachments[selectedTaskForDetail.id] || []).length} Fail
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    {(taskAttachments[selectedTaskForDetail.id] || []).length > 0 ? (
                                        (taskAttachments[selectedTaskForDetail.id] || []).map(fl => (
                                            <div key={fl.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                                                <div className="flex items-center space-x-2.5 truncate pr-2">
                                                    <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                                                    <span className="font-bold text-slate-800 truncate">{fl.name}</span>
                                                    <span className="text-[10px] text-slate-400 font-medium shrink-0">({fl.size})</span>
                                                </div>
                                                <span className="text-[10px] text-slate-400 shrink-0 font-medium">Oleh {fl.uploader}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-400 italic text-center py-2">Tiada lampiran fail untuk tugasan ini.</p>
                                    )}
                                </div>

                                <div className="pt-2 border-t border-slate-100">
                                    <label className="cursor-pointer flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-indigo-200 bg-indigo-50/40 rounded-xl hover:bg-indigo-50 transition-colors text-indigo-700 text-xs font-bold">
                                        <UploadCloud className="w-4 h-4" />
                                        <span>Pilih Fail Lampiran Baru</span>
                                        <input type="file" className="hidden" onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            const taskId = selectedTaskForDetail.id;
                                            const isTaskCompleted = selectedTaskForDetail.status === 'completed';

                                            const newFl = {
                                                id: Date.now(),
                                                name: file.name,
                                                size: formatFileSize(file.size),
                                                uploader: currentUser?.name || 'Ahli Pasukan',
                                                date: 'Hari ini',
                                                fileObj: file,
                                                syncedToDms: false
                                            };

                                            if (isTaskCompleted) {
                                                try {
                                                    const formData = new FormData();
                                                    formData.append('project_id', project.id);
                                                    formData.append('uploader_id', currentUser?.id || '1');
                                                    formData.append('category', 'Kanban File');
                                                    formData.append('fileName', file.name.replace(/\.[^/.]+$/, ""));
                                                    formData.append('file', file);

                                                    const res = await fetch('http://localhost/My-PMO/api/modules/documents.php', {
                                                        method: 'POST',
                                                        body: formData
                                                    });
                                                    const data = await res.json();
                                                    if (data.status === 'success') {
                                                        newFl.syncedToDms = true;
                                                        if (typeof fetchDocs === 'function') fetchDocs();
                                                        showToastNotification?.(`📁 Fail '${file.name}' dimuat naik & diselaraskan ke Repositori Dokumen (DMS) kerana tugasan telah Selesai!`);
                                                    }
                                                } catch (err) {
                                                    console.error("DMS upload error:", err);
                                                }
                                            } else {
                                                showToastNotification?.(`📎 Fail '${file.name}' dilampirkan pada tugasan! Fail ini akan dihantar ke Repositori Dokumen (DMS) apabila tugasan ditanda Selesai.`);
                                            }

                                            setTaskAttachments({
                                                ...taskAttachments,
                                                [taskId]: [...(taskAttachments[taskId] || []), newFl]
                                            });
                                        }} />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end shrink-0">
                            <button onClick={() => setSelectedTaskForDetail(null)} className="px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition-colors">
                                Tutup Modul
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isDocModalOpen && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => { setIsDocModalOpen(false); setSelectedFile(null); }}></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200">
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-[32px]">
                                <h2 className="text-xl font-extrabold text-slate-900">Muat Naik Dokumen Baru</h2>
                                <button onClick={() => { setIsDocModalOpen(false); setSelectedFile(null); }} className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200">&times;</button>
                            </div>
                            <form onSubmit={handleUploadDoc} className="p-8 space-y-5">
                                <div className="w-full h-32 border-2 border-dashed border-indigo-200 bg-indigo-50/50 rounded-2xl flex flex-col items-center justify-center text-slate-500 hover:bg-indigo-50 transition-colors cursor-pointer relative">
                                    <UploadCloud className="w-8 h-8 text-indigo-400 mb-2" />
                                    <span className="text-sm font-bold text-center px-4">
                                        {selectedFile ? `Fail dipilih: ${selectedFile.name}` : "Klik untuk memilih fail"}
                                    </span>
                                    <input type="file" name="file" required onChange={(e) => setSelectedFile(e.target.files[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Nama Dokumen</label>
                                    <input name="fileName" required type="text" placeholder="Tanpa sambungan (.pdf/.doc)" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Kategori Repositori</label>
                                    <select name="category" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none">
                                        <option value="Minit Mesyuarat">Minit Mesyuarat</option>
                                        <option value="Dokumen Kontrak">Dokumen Kontrak</option>
                                        <option value="Kanban File">Kanban File</option>
                                        <option value="Kewangan & Bajet">Kewangan & Bajet</option>
                                        <option value="Lain-lain">Lain-lain</option>
                                    </select>
                                </div>
                                <div className="flex justify-end pt-4"><button type="submit" className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 w-full">Mula Memuat Naik</button></div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {editingDoc && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setEditingDoc(null)}></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200">
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-[32px]">
                                <h2 className="text-xl font-extrabold text-slate-900">Ubah Maklumat Dokumen</h2>
                                <button onClick={() => setEditingDoc(null)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200">&times;</button>
                            </div>
                            <form onSubmit={handleEditDoc} className="p-8 space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Nama Dokumen</label>
                                    <input name="file_name" required defaultValue={editingDoc.file_name} type="text" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none font-medium text-slate-800" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Kategori Repositori</label>
                                    <select name="category" defaultValue={editingDoc.category === 'Spesifikasi Sistem' ? 'Kanban File' : editingDoc.category} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium text-slate-800">
                                        <option value="Minit Mesyuarat">Minit Mesyuarat</option>
                                        <option value="Dokumen Kontrak">Dokumen Kontrak</option>
                                        <option value="Kanban File">Kanban File</option>
                                        <option value="Kewangan & Bajet">Kewangan & Bajet</option>
                                        <option value="Lain-lain">Lain-lain</option>
                                    </select>
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button type="button" onClick={() => setEditingDoc(null)} className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200">Batal</button>
                                    <button type="submit" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md">Simpan Perubahan</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {isAddMemberModalOpen && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsAddMemberModalOpen(false)}></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200">
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-[32px]">
                                <h2 className="text-xl font-extrabold text-slate-900">Tambah Ahli Pasukan Projek</h2>
                                <button onClick={() => setIsAddMemberModalOpen(false)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200">&times;</button>
                            </div>
                            <form onSubmit={handleAddTeamMember} className="p-8 space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Pilih Pengguna / Pegawai</label>
                                    <select name="user_id" required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none font-bold">
                                        <option value="">-- Pilih dari senarai pengguna --</option>
                                        {projectUsers
                                            .filter(u => !teamMembers.some(m => m.user_id == u.id))
                                            .map(u => (
                                                <option key={u.id} value={u.id}>
                                                    {u.name} ({u.role || 'Pengguna'}) - {u.agency || 'PKPMP'}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Peranan Dalam Projek</label>
                                    <input name="role" defaultValue="Ahli Pasukan" required type="text" placeholder="Cth: Penyelaras / Ahli Teknikal / Pengurus Risik" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none font-bold" />
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button type="submit" className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 w-full shadow-md">
                                        Tambah Ahli Pasukan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {memberToDelete && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setMemberToDelete(null)}></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200 p-8 text-center">
                            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                                <AlertTriangle className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-extrabold text-slate-900 mb-2">Buang Akses Ahli Pasukan</h3>
                            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                                Adakah anda pasti mahu membuang akses bagi <span className="font-extrabold text-slate-900">{memberToDelete.name}</span> dari pasukan projek ini?
                            </p>
                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setMemberToDelete(null)}
                                    className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-colors text-sm"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleRemoveTeamMember}
                                    className="flex-1 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl transition-colors text-sm shadow-lg shadow-rose-200 active:scale-[0.98]"
                                >
                                    Ya, Buang Akses
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {milestoneToDelete && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setMilestoneToDelete(null)}></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200 p-8 text-center">
                            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                                <AlertTriangle className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-extrabold text-slate-900 mb-2">Padam Pencapaian (Milestone)</h3>
                            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                                Adakah anda pasti mahu memadam pencapaian <span className="font-extrabold text-slate-900">{milestoneToDelete.title}</span>?
                            </p>
                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setMilestoneToDelete(null)}
                                    className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-colors text-sm"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDeleteMilestone}
                                    className="flex-1 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl transition-colors text-sm shadow-lg shadow-rose-200 active:scale-[0.98]"
                                >
                                    Ya, Padam
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- EDIT PROJECT MODAL --- */}
            {isEditProjectModalOpen && (
                <div className="fixed inset-0 z-[65] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsEditProjectModalOpen(false)}></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
                            <div className="p-6 sm:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                <div>
                                    <h2 className="text-xl font-extrabold text-slate-900">Kemaskini Butiran Projek</h2>
                                    <p className="text-xs font-semibold text-slate-500 mt-0.5">{currentProject.name}</p>
                                </div>
                                <button onClick={() => setIsEditProjectModalOpen(false)} className="w-9 h-9 bg-white rounded-full flex items-center justify-center border border-slate-200 text-slate-400 hover:text-rose-500 transition-colors">&times;</button>
                            </div>

                            <form onSubmit={handleUpdateProject} className="p-6 sm:p-8 space-y-4 max-h-[75vh] overflow-y-auto">
                                <div>
                                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Nama Projek</label>
                                    <input name="name" defaultValue={currentProject.name} required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-sm" />
                                </div>

                                <div>
                                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Objektif & Keterangan Projek</label>
                                    <textarea name="description" defaultValue={currentProject.description} rows={3} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none font-medium text-sm" placeholder="Masukkan rincian dan sasaran projek..."></textarea>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Agensi</label>
                                        <input name="agency" defaultValue={currentProject.agency || 'PKPMP'} required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Bahagian</label>
                                        <input name="division" defaultValue={currentProject.division || 'Bahagian Teknologi Maklumat (BTM)'} type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-sm" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Unit</label>
                                        <input name="unit" defaultValue={currentProject.unit || ''} type="text" placeholder="Cth: Unit Rangkaian" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Syarikat Vendor</label>
                                        <input name="vendor" defaultValue={currentProject.vendor || ''} type="text" placeholder="Cth: Pine Supplies Sdn Bhd" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-sm" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Pengurus Vendor (PMO Syarikat)</label>
                                        <select
                                            name="pmoVendor"
                                            defaultValue={currentProject.vendor_manager || currentProject.pmoVendor || ''}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-sm text-slate-900"
                                        >
                                            <option value="">-- Pilih PMO Syarikat (Tetapan) --</option>
                                            {pmoVendorUsers.map((u) => (
                                                <option key={u.id} value={u.name}>
                                                    {u.name} {u.agency ? `(${u.agency})` : ''}
                                                </option>
                                            ))}
                                            {(currentProject.vendor_manager || currentProject.pmoVendor) && !pmoVendorUsers.some(u => u.name === (currentProject.vendor_manager || currentProject.pmoVendor)) && (
                                                <option value={currentProject.vendor_manager || currentProject.pmoVendor}>
                                                    {currentProject.vendor_manager || currentProject.pmoVendor}
                                                </option>
                                            )}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Pengurus Projek PKPMP (PMO GOV)</label>
                                        <select
                                            name="manager"
                                            defaultValue={currentProject.manager || ''}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-sm text-slate-900"
                                        >
                                            <option value="">-- Pilih PMO GOV / PKPMP (Tetapan) --</option>
                                            {pmoGovUsers.map((u) => (
                                                <option key={u.id} value={u.name}>
                                                    {u.name} {u.agency ? `(${u.agency})` : ''}
                                                </option>
                                            ))}
                                            {currentProject.manager && !pmoGovUsers.some(u => u.name === currentProject.manager) && (
                                                <option value={currentProject.manager}>{currentProject.manager}</option>
                                            )}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Tarikh Mula</label>
                                        <input name="startDate" defaultValue={currentProject.start_date || currentProject.startDate || ''} type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Tarikh Tamat</label>
                                        <input name="dueDate" defaultValue={currentProject.end_date || currentProject.dueDate || ''} type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Bajet (RM)</label>
                                        <input name="budget" defaultValue={currentProject.budget || ''} type="number" step="0.01" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-sm" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Status Projek</label>
                                        <select name="status" defaultValue={currentProject.status || 'Aktif'} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-sm">
                                            <option value="Aktif">Aktif</option>
                                            <option value="Lewat">Lewat</option>
                                            <option value="Tertunda">Tertunda</option>
                                            <option value="Selesai">Selesai</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Kemajuan (%)</label>
                                        <input name="progress" defaultValue={currentProject.progress || 0} type="number" min="0" max="100" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-sm" />
                                    </div>
                                </div>

                                <div className="flex space-x-3 pt-4 border-t border-slate-100">
                                    <button type="button" onClick={() => setIsEditProjectModalOpen(false)} className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-colors text-sm">
                                        Batal
                                    </button>
                                    <button type="submit" className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-colors text-sm shadow-md active:scale-95">
                                        Simpan Perubahan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* --- CONTENT PAGE (10k USD ENTERPRISE PMO DESIGN) --- */}

            {/* Header & Main Action Bar */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                <div>
                    <div className="flex items-center text-xs font-semibold text-slate-500 space-x-2 mb-1">
                        <span
                            className="hover:text-indigo-600 cursor-pointer font-bold transition-colors flex items-center gap-1 bg-slate-100/80 hover:bg-slate-200/80 px-2 py-0.5 rounded-lg text-slate-600"
                            onClick={() => setView('projects')}
                        >
                            <Briefcase className="w-3 h-3 text-slate-500" /> Projek
                        </span>
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-900 font-extrabold truncate max-w-[200px] sm:max-w-md">{currentProject.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                            {currentProject.name}
                        </h1>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs shrink-0">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            {currentProject.status || 'Aktif'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                    <button
                        onClick={() => setIsEditProjectModalOpen(true)}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-4 py-2 rounded-xl font-extrabold transition-all duration-200 shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/35 active:scale-95 text-xs cursor-pointer border border-indigo-500/30"
                    >
                        <Edit className="w-3.5 h-3.5" /> Kemaskini
                    </button>
                </div>
            </div>

            {/* Main Hero Card Container */}
            <div className="relative overflow-hidden bg-white border border-slate-200/90 shadow-lg shadow-slate-200/40 rounded-2xl p-4 sm:p-5 lg:p-6 mb-5 transition-all">
                {/* Background Ambient Decorative Light */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-bl from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none hidden sm:block">
                    <Briefcase className="w-56 h-56 text-slate-900" />
                </div>

                {/* Top Section: Keterangan & Objektif Projek */}
                <div className="relative z-10 mb-4 pb-3 border-b border-slate-100/80 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-indigo-50/90 text-indigo-700 text-[10px] font-extrabold rounded-full tracking-wider uppercase border border-indigo-100 shadow-2xs">
                            <Activity className="w-3 h-3 text-indigo-600" /> OBJEKTIF & KETERANGAN PROJEK
                        </span>
                        {currentProject.project_code && (
                            <span className="inline-flex items-center text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/60">
                                {currentProject.project_code}
                            </span>
                        )}
                    </div>

                    <div className="border-l-3 border-indigo-600 pl-3 py-0.5">
                        <p className="text-slate-700 text-xs sm:text-sm lg:text-base leading-snug whitespace-pre-wrap font-medium">
                            {currentProject.description || `Tiada keterangan khas diberikan untuk projek ${currentProject.name}. Sila klik butang 'Kemaskini' di atas untuk memasukkan penerangan rasmi projek.`}
                        </p>
                    </div>
                </div>

                {/* 8 Metric Cards Grid Layout */}
                {/* 8 Metric Cards Grid Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 relative z-10">

                    {/* 1. AGENSI */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">AGENSI</span>
                            <Building2 className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 text-sm sm:text-base leading-tight break-words">
                                {currentProject.agency || 'PKPMP'}
                            </p>
                            <p className="text-xs text-slate-500 font-normal mt-1 leading-normal">Pejabat Ketua Pendaftar Mahkamah Persekutuan</p>
                        </div>
                    </div>

                    {/* 2. BAHAGIAN & UNIT */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">BAHAGIAN & UNIT</span>
                            <FolderKanban className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 text-sm sm:text-base leading-tight break-words">
                                {currentProject.division || 'Bahagian Teknologi Maklumat (BTM)'}
                            </p>
                            <p className="text-xs text-slate-500 font-normal mt-1 leading-normal">
                                {currentProject.unit ? `Unit: ${currentProject.unit}` : 'Pengurusan Utama'}
                            </p>
                        </div>
                    </div>

                    {/* 3. SYARIKAT VENDOR */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">SYARIKAT VENDOR</span>
                            <Briefcase className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 text-sm sm:text-base leading-tight break-words">
                                {currentProject.vendor || 'Tidak Dinyatakan'}
                            </p>
                            {currentProject.vendor_manager ? (
                                <p className="text-xs text-slate-500 font-normal mt-1 leading-normal">
                                    PMO Syarikat: <span className="font-medium text-slate-700">{currentProject.vendor_manager}</span>
                                </p>
                            ) : (
                                <p className="text-xs text-slate-500 font-normal mt-1 leading-normal">Tiada PMO Syarikat</p>
                            )}
                        </div>
                    </div>

                    {/* 4. PENGURUS PROJEK */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">PENGURUS PROJEK</span>
                            <UserCheck className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                        </div>
                        <div className="flex items-center space-x-2.5">
                            <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                                {currentProject.manager ? currentProject.manager.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'P'}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="font-bold text-slate-900 text-sm sm:text-base leading-tight truncate">
                                    {currentProject.manager || 'Belum Dilantik'}
                                </p>
                                <p className="text-xs text-slate-500 font-normal leading-normal">Pegawai PMO PKPMP</p>
                            </div>
                        </div>
                    </div>

                    {/* 5. GARIS MASA / TEMPOH */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">GARIS MASA</span>
                            <CalendarIcon className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                                {formatDateMalay(currentProject.start_date || currentProject.startDate) || 'TBA'} <span className="text-slate-400 font-normal">─</span> {formatDateMalay(currentProject.end_date || currentProject.dueDate) || 'TBA'}
                            </p>
                            <p className="text-xs text-slate-500 font-normal mt-1 leading-normal">Tempoh Pelaksanaan Projek</p>
                        </div>
                    </div>

                    {/* 6. BAJET / PERUNTUKAN */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">PERUNTUKAN</span>
                            <DollarSign className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 text-base sm:text-lg tracking-tight leading-tight whitespace-nowrap">
                                RM {parseFloat(currentProject.budget || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                            <p className="text-xs text-slate-500 font-normal mt-1 leading-normal">Peruntukan Diluluskan PKPMP</p>
                        </div>
                    </div>

                    {/* 7. STATUS PROJEK */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">STATUS PROJEK</span>
                            <Activity className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                        </div>
                        <div>
                            <div className="flex items-center">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentProject.status === 'Selesai' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                    currentProject.status === 'Lewat' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                        currentProject.status === 'Tertunda' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                            'bg-indigo-50 text-indigo-700 border-indigo-200'
                                    }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${currentProject.status === 'Selesai' ? 'bg-emerald-500' :
                                        currentProject.status === 'Lewat' ? 'bg-rose-500' :
                                            currentProject.status === 'Tertunda' ? 'bg-amber-500' :
                                                'bg-indigo-500'
                                        }`}></span>
                                    {currentProject.status || 'Aktif'}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 font-normal mt-1 leading-normal">Status Operasi Semasa</p>
                        </div>
                    </div>

                    {/* 8. KEMAJUAN SEMASA */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">KEMAJUAN SEMASA</span>
                            <span className="text-xs font-bold text-slate-900">{currentProject.progress || 0}% SIAP</span>
                        </div>
                        <div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min(100, Math.max(0, currentProject.progress || 0))}%` }}
                                />
                            </div>
                            <p className="text-xs text-slate-400 font-normal text-right mt-1">Sasaran: 100%</p>
                        </div>
                    </div>

                </div>
            </div>

            {/* --- TABS NAVIGATION (COMPACT 1-PAGE ZERO-SCROLL GRID) --- */}
            <div className="bg-slate-100/90 backdrop-blur-sm p-1 rounded-xl border border-slate-200/80 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1 mb-5 shadow-inner w-full">
                {[
                    { id: 'Gambaran Keseluruhan', label: 'Gambaran Keseluruhan', icon: Activity },
                    { id: 'Carta Gantt', label: 'Carta Gantt', icon: CalendarIcon },
                    { id: 'Tugasan (Kanban)', label: 'Tugasan (Kanban)', icon: FolderKanban },
                    { id: 'Kewangan Projek', label: 'Kewangan Projek', icon: DollarSign },
                    { id: 'Dokumen (DMS)', label: 'Dokumen (DMS)', icon: FileText },
                    { id: 'Ahli Pasukan', label: 'Ahli Pasukan', icon: Users },
                ].map(tab => {
                    const TabIcon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-[11px] xl:text-xs font-extrabold uppercase tracking-tight transition-all duration-200 cursor-pointer w-full text-center ${isActive
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-[1.01]'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                                }`}
                        >
                            <TabIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                            <span className="truncate">{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            <div className="mt-8">
                {activeTab === 'Gambaran Keseluruhan' && (
                    <div className="space-y-8">
                        <Card>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-extrabold text-slate-900">Pencapaian (Milestones)</h3>
                                <button onClick={() => { setEditingMilestone(null); setIsMilestoneModalOpen(true); }} className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors flex items-center">
                                    <Plus className="w-4 h-4 mr-1" /> Tambah Pencapaian
                                </button>
                            </div>

                            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-3 md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                                {milestones.length > 0 ? milestones.map((ms, i) => (
                                    <div key={ms.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                        <div className={`flex items-center justify-center w-7 h-7 rounded-full border-[3px] border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${ms.status === 'Selesai' ? 'bg-emerald-500' : ms.status === 'Aktif' ? 'bg-indigo-500' : 'bg-slate-200'}`}>
                                            {ms.status === 'Selesai' && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                        </div>
                                        <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-md transition-all relative">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="font-bold text-slate-900 truncate pr-4">{ms.title}</h4>
                                                <Badge text={ms.status} />
                                            </div>
                                            <p className="text-sm font-semibold text-slate-500">Sasaran: {ms.target}</p>

                                            <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => { setEditingMilestone(ms); setIsMilestoneModalOpen(true); }} className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 shadow-sm" title="Kemaskini Pencapaian"><Edit className="w-3.5 h-3.5" /></button>
                                                <button onClick={() => setMilestoneToDelete(ms)} className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-rose-600 hover:border-rose-200 transition-colors shadow-sm" title="Padam Pencapaian"><Trash2 className="w-3.5 h-3.5" /></button>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-8 text-slate-400 font-medium">Tiada pencapaian direkodkan.</div>
                                )}
                            </div>
                        </Card>
                    </div>
                )}

                {activeTab === 'Carta Gantt' && (() => {
                    const monthNamesMalay = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogo', 'Sep', 'Okt', 'Nov', 'Dis'];

                    // 1. Tentukan Tarikh Mula & Tarikh Tamat Projek secara dinamik
                    const projStartStr = project.start_date || project.startDate || (ganttItems.length > 0 ? ganttItems[0].planned_start : '2026-07-20');
                    const projEndStr = project.end_date || project.endDate || project.dueDate || (ganttItems.length > 0 ? ganttItems[ganttItems.length - 1].planned_end : '2027-07-23');

                    const parseDateInfo = (dStr) => {
                        if (!dStr) return null;
                        const parts = dStr.split('-');
                        if (parts.length < 2) return null;
                        const y = parseInt(parts[0], 10);
                        const m = parseInt(parts[1], 10) - 1;
                        const d = parts[2] ? parseInt(parts[2], 10) : 1;
                        if (isNaN(y) || isNaN(m)) return null;
                        return { year: y, month: m, day: d, globalM: y * 12 + m };
                    };

                    const startInfo = parseDateInfo(projStartStr) || { year: 2026, month: 6, day: 20, globalM: 2026 * 12 + 6 };
                    const endInfo = parseDateInfo(projEndStr) || { year: 2027, month: 6, day: 23, globalM: 2027 * 12 + 6 };

                    let startGlobalM = startInfo.globalM;
                    let endGlobalM = endInfo.globalM;

                    if (endGlobalM < startGlobalM) {
                        endGlobalM = startGlobalM;
                    }

                    // 2. Bina senarai bulan mengikut garis masa projek (contoh: Jul 2026 hingga Jul 2027 = 13 Bulan)
                    const visibleMonths = [];
                    for (let gm = startGlobalM; gm <= endGlobalM; gm++) {
                        const yr = Math.floor(gm / 12);
                        const mIdx = ((gm % 12) + 12) % 12;
                        visibleMonths.push({
                            globalM: gm,
                            year: yr,
                            monthIndex: mIdx,
                            monthName: monthNamesMalay[mIdx],
                            label: `${monthNamesMalay[mIdx]} ${yr}`
                        });
                    }

                    const totalMonths = visibleMonths.length;
                    const rangeStartText = `${startInfo.day} ${monthNamesMalay[startInfo.month]} ${startInfo.year}`;
                    const rangeEndText = `${endInfo.day} ${monthNamesMalay[endInfo.month]} ${endInfo.year}`;

                    const toGlobalM = (dStr) => {
                        if (!dStr) return null;
                        const parts = dStr.split('-');
                        const yr = parseInt(parts[0], 10);
                        const m = parseInt(parts[1], 10) - 1;
                        if (isNaN(yr) || isNaN(m)) return null;
                        return yr * 12 + m;
                    };

                    return (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <Card>
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                                    <div>
                                        <h3 className="text-xl font-extrabold text-slate-900 flex items-center">
                                            Carta Gantt Dynamik Mengikut Tempoh Projek
                                        </h3>
                                        <p className="text-slate-500 text-sm mt-1">
                                            Garis masa dipaparkan khusus mengikut tempoh projek: <strong>{rangeStartText}</strong> hingga <strong>{rangeEndText}</strong> (<strong>{totalMonths} Bulan</strong>).
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="flex items-center space-x-3 text-xs font-bold bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                                            <div className="flex items-center space-x-1.5"><span className="w-3.5 h-2.5 rounded-sm bg-indigo-600 inline-block"></span><span>Planned</span></div>
                                            <div className="flex items-center space-x-1.5"><span className="w-3.5 h-2.5 rounded-sm bg-emerald-500 inline-block"></span><span>Actual</span></div>
                                            <div className="flex items-center space-x-1.5"><span className="text-amber-500 font-black text-base leading-none">◆</span><span>Milestone</span></div>
                                        </div>
                                        <button onClick={() => { setEditingGanttItem(null); setIsGanttModalOpen(true); }} className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-slate-800 flex items-center text-sm shadow-md transition-all active:scale-[0.98]">
                                            <Plus className="w-4 h-4 mr-1.5" /> Tambah Fasa
                                        </button>
                                    </div>
                                </div>

                                {/* Dynamic Timeline Header Info */}
                                <div className="flex flex-col sm:flex-row justify-between items-center bg-indigo-50/60 p-3.5 rounded-2xl border border-indigo-100 mb-6 gap-3">
                                    <div className="flex items-center space-x-2 text-xs font-extrabold text-indigo-950">
                                        <CalendarIcon className="w-4 h-4 text-indigo-600" />
                                        <span>Garis Masa Projek: {rangeStartText} — {rangeEndText}</span>
                                    </div>

                                    <div className="text-center sm:text-right">
                                        <span className="text-xs font-extrabold text-indigo-900 bg-white px-3 py-1 rounded-xl border border-indigo-200 shadow-sm inline-block">
                                            Jumlah Tempoh: {totalMonths} Bulan ({visibleMonths[0].label} — {visibleMonths[totalMonths - 1].label})
                                        </span>
                                    </div>
                                </div>

                                {/* Dynamic Monthly Timeline Table */}
                                <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-sm">
                                    <div style={{ minWidth: `${Math.max(900, 320 + totalMonths * 80)}px` }}>
                                        {/* Timeline Header (Displays Month + Year for each column) */}
                                        <div className="flex bg-slate-900 text-white font-bold text-xs py-3.5 px-4 rounded-t-2xl">
                                            <div className="w-80 shrink-0 uppercase tracking-wider pr-4">Fasa / Tugasan / Pencapaian</div>
                                            <div className="flex-1 grid gap-0" style={{ gridTemplateColumns: `repeat(${totalMonths}, minmax(0, 1fr))` }}>
                                                {visibleMonths.map((vm, idx) => (
                                                    <div key={vm.globalM} className={`text-center font-extrabold px-1 ${idx !== 0 ? 'border-l border-slate-800' : ''}`}>
                                                        <span className="block text-[11px] text-indigo-300 uppercase leading-none">{vm.monthName}</span>
                                                        <span className="block text-[9px] font-medium text-slate-400 mt-0.5">{vm.year}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Timeline Body Items */}
                                        <div className="divide-y divide-slate-100">
                                            {ganttItems.length > 0 ? ganttItems.map((item) => {
                                                const pStartM = toGlobalM(item.planned_start) ?? startGlobalM;
                                                const pEndM = toGlobalM(item.planned_end) ?? pStartM;

                                                const pColStart = Math.max(1, pStartM - startGlobalM + 1);
                                                const pColEnd = Math.min(totalMonths, pEndM - startGlobalM + 1);
                                                const pSpan = Math.max(1, pColEnd - pColStart + 1);
                                                const pIsVisible = pEndM >= startGlobalM && pStartM <= endGlobalM;

                                                const aStartM = toGlobalM(item.actual_start) ?? pStartM;
                                                const aEndM = toGlobalM(item.actual_end) ?? (item.actual_start ? aStartM : pEndM);
                                                const aColStart = Math.max(1, aStartM - startGlobalM + 1);
                                                const aColEnd = Math.min(totalMonths, aEndM - startGlobalM + 1);
                                                const aSpan = Math.max(1, aColEnd - aColStart + 1);

                                                const isMilestone = !!item.is_milestone;

                                                return (
                                                    <div key={item.id} className={`flex items-center py-4 px-4 hover:bg-slate-50 transition-colors group ${isMilestone ? 'bg-amber-50/30' : ''}`}>
                                                        {/* Left Item Details */}
                                                        <div className="w-80 shrink-0 pr-4">
                                                            <div className="flex items-center justify-between">
                                                                <div className="font-extrabold text-slate-900 text-sm flex items-center truncate pr-2">
                                                                    {isMilestone ? (
                                                                        <span className="text-amber-500 font-extrabold text-base mr-2 shrink-0">◆</span>
                                                                    ) : (
                                                                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 mr-2 shrink-0"></span>
                                                                    )}
                                                                    <span className="truncate" title={item.title}>{item.title}</span>
                                                                </div>

                                                                {/* Action buttons */}
                                                                <div className="flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                                                    <button onClick={() => { setEditingGanttItem(item); setIsGanttModalOpen(true); }} className="p-1 bg-white border border-slate-200 rounded text-slate-500 hover:text-indigo-600 shadow-sm" title="Kemas kini"><Edit className="w-3.5 h-3.5" /></button>
                                                                    <button onClick={() => handleDeleteGanttItem(item.id)} className="p-1 bg-white border border-slate-200 rounded text-slate-500 hover:text-rose-600 shadow-sm" title="Padam"><Trash2 className="w-3.5 h-3.5" /></button>
                                                                </div>
                                                            </div>

                                                            {/* Subtitle Dates */}
                                                            <div className="text-[11px] font-medium text-slate-400 mt-1 ml-4 space-y-0.5">
                                                                <div>Dirancang: <strong className="text-indigo-600 font-semibold">{item.planned_start} — {item.planned_end}</strong></div>
                                                                {item.actual_start && (
                                                                    <div>Sebenar: <span className="text-emerald-600 font-semibold">{item.actual_start} {item.actual_end ? `— ${item.actual_end}` : '(Semasa)'}</span></div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Right Monthly Timeline Grid */}
                                                        <div className="flex-1 grid gap-0 relative items-center bg-slate-50/50 p-2 rounded-xl border border-slate-100 min-h-[58px]" style={{ gridTemplateColumns: `repeat(${totalMonths}, minmax(0, 1fr))` }}>
                                                            {!pIsVisible ? (
                                                                <div className="text-center text-[11px] font-medium text-slate-400/70 italic" style={{ gridColumn: `1 / span ${totalMonths}` }}>
                                                                    (Fasa di luar garis masa projek)
                                                                </div>
                                                            ) : isMilestone ? (
                                                                /* Milestone Marker Display */
                                                                <div className="flex items-center justify-center" style={{ gridColumn: `${pColStart} / span ${pSpan}` }}>
                                                                    <span className="px-3 py-1 rounded-full bg-amber-500 text-white font-black text-xs shadow-md flex items-center gap-1.5 whitespace-nowrap">
                                                                        ◆ Milestone ({item.progress}%)
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    {/* Bar 1: Dirancang (Planned) */}
                                                                    <div className="h-3.5 bg-indigo-200 rounded-full border border-indigo-300 relative shadow-inner group/bar" style={{ gridColumn: `${pColStart} / span ${pSpan}` }}>
                                                                        <span className="absolute -top-5 left-1 text-[9px] font-black text-indigo-700 uppercase tracking-widest whitespace-nowrap">Dirancang</span>
                                                                    </div>

                                                                    {/* Bar 2: Pelaksanaan Sebenar (Actual) */}
                                                                    {item.actual_start && (
                                                                        <div className="h-4 bg-slate-200 rounded-full overflow-hidden relative shadow-sm mt-1" style={{ gridColumn: `${aColStart} / span ${aSpan}` }}>
                                                                            <div
                                                                                className={`h-full font-extrabold text-[10px] text-white flex items-center justify-center transition-all ${item.status === 'Selesai' ? 'bg-emerald-500' : item.status === 'Tertunda' ? 'bg-rose-500' : 'bg-indigo-600'}`}
                                                                                style={{ width: `${Math.max(item.progress, 10)}%` }}
                                                                            >
                                                                                {item.progress}%
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            }) : (
                                                <div className="text-center py-12 text-slate-400 font-medium">Tiada item fasa atau tugasan Carta Gantt direkodkan. Sila tambah fasa baharu.</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    );
                })()}

                {
                    activeTab === 'Tugasan (Kanban)' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 h-[800px] flex flex-col">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 shrink-0">
                                <div>
                                    <h3 className="text-xl font-extrabold text-slate-900">Papan Tugasan (Agile)</h3>
                                    <p className="text-slate-500 text-sm mt-1">Urus tugas harian secara visual khusus untuk <strong>{project.name}</strong>.</p>
                                </div>
                                <button onClick={() => { setEditingTask(null); setIsTaskModalOpen(true); }} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-800 flex items-center text-sm shadow-md transition-all active:scale-[0.98]">
                                    <Plus className="w-4 h-4 mr-2" /> Tambah Tugas
                                </button>
                            </div>

                            <div className="flex-1 flex overflow-x-auto gap-6 pb-4 no-scrollbar">
                                {columns.map(col => {
                                    const colTasks = kanbanTasks.filter(t => t.status === col.id);
                                    return (
                                        <div
                                            key={col.id}
                                            className={`flex flex-col rounded-[24px] border shadow-sm min-w-[300px] md:min-w-0 md:flex-1 shrink-0 ${col.color}`}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleDrop(e, col.id)}
                                        >
                                            <div className={`p-4 sm:p-5 flex justify-between items-center border-b rounded-t-[24px] ${col.headerBg}`}>
                                                <h3 className="font-extrabold text-base flex items-center gap-2">
                                                    {col.id === 'completed' && <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>}
                                                    {col.title}
                                                </h3>
                                                <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm border ${col.badgeBg}`}>{colTasks.length}</span>
                                            </div>
                                            <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
                                                {colTasks.map(task => {
                                                    const assignedUser = projectUsers.find(u => u.id == task.assignee);
                                                    const commentsCount = (taskComments[task.id] || []).length;
                                                    const filesCount = (taskAttachments[task.id] || []).length;

                                                    const cardStyle = task.status === 'completed'
                                                        ? 'bg-emerald-50/95 border-emerald-300 hover:border-emerald-400 text-emerald-950 shadow-sm'
                                                        : task.status === 'in_progress'
                                                            ? 'bg-amber-50/80 border-amber-200 hover:border-amber-300 text-slate-900 shadow-sm'
                                                            : 'bg-white border-slate-200 hover:border-indigo-300 text-slate-900 shadow-sm';

                                                    return (
                                                        <div
                                                            key={task.id}
                                                            draggable
                                                            onDragStart={(e) => handleDragStart(e, task.id)}
                                                            onClick={() => setSelectedTaskForDetail(task)}
                                                            className={`${cardStyle} p-4 sm:p-5 rounded-2xl border cursor-pointer hover:shadow-md transition-all active:scale-[0.99] group relative`}
                                                        >
                                                            <div className="flex justify-between items-start mb-2.5">
                                                                <Badge text={task.priority} />
                                                                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                                                    <button onClick={() => { setEditingTask(task); setIsTaskModalOpen(true); }} className="text-slate-400 hover:text-indigo-600 transition-colors bg-white/80 p-1 rounded shadow-xs" title="Edit"><Edit className="w-3.5 h-3.5" /></button>
                                                                    <button onClick={() => setTaskToDelete(task)} className="text-slate-400 hover:text-rose-500 transition-colors bg-white/80 p-1 rounded shadow-xs" title="Padam Tugasan"><Trash2 className="w-3.5 h-3.5" /></button>
                                                                </div>
                                                            </div>

                                                            <h4 className="font-extrabold text-sm mb-1.5 leading-snug group-hover:text-indigo-600 transition-colors">{task.title}</h4>

                                                            {task.description && (
                                                                <p className="text-[12px] text-slate-600 mb-3 line-clamp-2 leading-relaxed font-medium bg-slate-50/90 p-2.5 rounded-xl border border-slate-100/90 shadow-2xs">
                                                                    {task.description}
                                                                </p>
                                                            )}

                                                            <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] font-semibold text-slate-500 mb-3">
                                                                <div className="flex items-center">
                                                                    <CalendarIcon className="w-3.5 h-3.5 mr-1 text-slate-400" />
                                                                    <span>{task.dueDate ? `Tamat: ${task.dueDate}` : 'Tiada Tarikh'}</span>
                                                                </div>
                                                                {task.status === 'completed' ? (
                                                                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-200/80 text-emerald-900 border border-emerald-300">
                                                                        ✓ Selesai & Dinotifikasi
                                                                    </span>
                                                                ) : assignedUser ? (
                                                                    <span className="text-[10px] font-bold text-slate-500 bg-white/80 px-2 py-0.5 rounded border border-slate-200 truncate max-w-[120px]" title={`Pegawai: ${assignedUser.name}`}>
                                                                        👤 {assignedUser.name}
                                                                    </span>
                                                                ) : null}
                                                            </div>

                                                            <div className="flex justify-between items-center pt-3 border-t border-slate-200/60">
                                                                <div className="flex items-center space-x-3 text-slate-500 text-xs font-bold">
                                                                    <span className="flex items-center space-x-1 hover:text-indigo-600 transition-colors" title="Komen Ahli Pasukan">
                                                                        <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                                                                        <span>{commentsCount}</span>
                                                                    </span>
                                                                    <span className="flex items-center space-x-1 hover:text-indigo-600 transition-colors" title="Lampiran Fail">
                                                                        <Paperclip className="w-3.5 h-3.5 text-indigo-500" />
                                                                        <span>{filesCount}</span>
                                                                    </span>
                                                                </div>

                                                                <div className="flex items-center space-x-2">
                                                                    <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                                        Interaktif ►
                                                                    </span>
                                                                    <div className="w-7 h-7 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-extrabold shadow-xs uppercase shrink-0" title={assignedUser?.name || 'Belum Ditugaskan'}>
                                                                        {assignedUser ? (assignedUser.avatar || assignedUser.name.substring(0, 2).toUpperCase()) : '?'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}

                                                {colTasks.length === 0 && (
                                                    <div className="text-center p-8 border-2 border-dashed border-slate-300 rounded-2xl bg-white/50">
                                                        <p className="text-slate-400 font-medium text-xs">Tarik kad ke sini</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )
                }

                {
                    activeTab === 'Kewangan Projek' && (() => {
                        const rawBudget = parseFloat(project.budget) || 0;
                        const totalBudgetRM = rawBudget > 0 && rawBudget < 1000 ? rawBudget * 1000000 : rawBudget;

                        // Bahagikan perbelanjaan kepada Invois/Tuntutan dan Denda SLA
                        const claimsFinances = finances.filter(f => f.type !== 'Denda' && f.status !== 'Denda SLA');
                        const penaltyFinances = finances.filter(f => f.type === 'Denda' || f.status === 'Denda SLA');

                        const totalClaimsRM = claimsFinances.reduce((sum, f) => sum + (parseFloat(f.amount) || 0), 0);
                        const totalPenaltiesRM = penaltyFinances.reduce((sum, f) => sum + (parseFloat(f.amount) || 0), 0);

                        // Perbelanjaan bersih = Invois ditolak Denda SLA (potongan bayaran)
                        const netSpentRM = Math.max(0, totalClaimsRM - totalPenaltiesRM);
                        const totalSpentRM = totalClaimsRM; // Jumlah kasardibelanjakan
                        const isBurst = netSpentRM > totalBudgetRM && totalBudgetRM > 0;
                        const burstAmount = Math.abs(netSpentRM - totalBudgetRM);
                        const remainingBalanceRM = Math.max(0, totalBudgetRM - netSpentRM);
                        const spentPercentage = totalBudgetRM > 0 ? ((netSpentRM / totalBudgetRM) * 100).toFixed(2) : '0.00';

                        const formatFullRM = (val) => {
                            return 'RM ' + parseFloat(val || 0).toLocaleString('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                        };

                        return (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                                    <div>
                                        <h3 className="text-xl font-bold tracking-tight text-slate-900">Pengurusan Kewangan & Denda SLA Projek</h3>
                                        <p className="text-slate-500 text-xs sm:text-sm mt-0.5">Jejak perbelanjaan, tuntutan bayaran, tolakan denda SLA dan baki peruntukan terkini.</p>
                                    </div>
                                    <div className="flex items-center space-x-2.5 shrink-0">
                                        <button onClick={() => setIsPenaltyModalOpen(true)} className="bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all flex items-center shadow-2xs active:scale-[0.98]">
                                            <AlertTriangle className="w-4 h-4 mr-2 text-rose-600 shrink-0" /> Denda SLA
                                        </button>
                                        <button onClick={() => { setEditingFinance(null); setIsFinanceModalOpen(true); }} className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all flex items-center shadow-xs active:scale-[0.98]">
                                            <Plus className="w-4 h-4 mr-2 text-slate-300 shrink-0" /> Daftar Tuntutan
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                                    <Card noPadding className="p-5 border border-slate-200/80 bg-white hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                                            <span>Peruntukan Projek</span>
                                            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                                                <DollarSign className="w-3.5 h-3.5" />
                                            </div>
                                        </div>
                                        <h3 className="text-xl xl:text-2xl font-bold tracking-tight text-slate-900 truncate mt-2" title={formatFullRM(totalBudgetRM)}>
                                            {formatFullRM(totalBudgetRM)}
                                        </h3>
                                        <div className="mt-3.5 pt-2.5 border-t border-slate-100 text-[11px] font-semibold text-slate-500 flex items-center truncate">
                                            <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-emerald-600 shrink-0" />
                                            <span className="truncate">MOF: {formatDateMalay(project.mof_approval_date || project.mofApprovalDate) || '12 Jan 2025'}</span>
                                        </div>
                                    </Card>

                                    <Card noPadding className={`p-5 border bg-white hover:shadow-md transition-shadow ${isBurst ? 'border-rose-200' : 'border-slate-200/80'}`}>
                                        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                                            <span>Tuntutan & Invois</span>
                                            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                                <Receipt className="w-3.5 h-3.5" />
                                            </div>
                                        </div>
                                        <h3 className="text-xl xl:text-2xl font-bold tracking-tight text-slate-900 truncate mt-2" title={formatFullRM(totalClaimsRM)}>
                                            {formatFullRM(totalClaimsRM)}
                                        </h3>
                                        <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mr-2">
                                                <div className="bg-indigo-600 h-1.5 rounded-full transition-all" style={{ width: `${Math.min(100, parseFloat(spentPercentage))}%` }}></div>
                                            </div>
                                            <span className="shrink-0 text-slate-700 font-bold">{spentPercentage}%</span>
                                        </div>
                                    </Card>

                                    <Card noPadding className="p-5 border border-rose-200/80 bg-rose-50/20 hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between text-xs font-bold text-rose-600 uppercase tracking-wider">
                                            <span className="flex items-center truncate">
                                                Denda SLA <span className="ml-1.5 px-1.5 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-extrabold rounded">Potongan</span>
                                            </span>
                                            <div className="w-7 h-7 rounded-lg bg-rose-100/70 flex items-center justify-center text-rose-600 shrink-0">
                                                <AlertTriangle className="w-3.5 h-3.5" />
                                            </div>
                                        </div>
                                        <h3 className="text-xl xl:text-2xl font-bold tracking-tight text-rose-600 truncate mt-2" title={`- ${formatFullRM(totalPenaltiesRM)}`}>
                                            - {formatFullRM(totalPenaltiesRM)}
                                        </h3>
                                        <div className="mt-3.5 pt-2.5 border-t border-rose-100 text-[11px] font-semibold text-rose-600 flex items-center truncate">
                                            <AlertTriangle className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                                            <span className="truncate">{penaltyFinances.length} Kes Denda Direkodkan</span>
                                        </div>
                                    </Card>

                                    <Card noPadding className={`p-5 border bg-white hover:shadow-md transition-shadow ${isBurst ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200/80'}`}>
                                        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                                            <span>{isBurst ? 'Baki (Melebihi Bajet)' : 'Baki Tersedia (Nett)'}</span>
                                            <div className={`w-7 h-7 rounded-lg ${isBurst ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'} flex items-center justify-center shrink-0`}>
                                                <Wallet className="w-3.5 h-3.5" />
                                            </div>
                                        </div>
                                        <h3 className={`text-xl xl:text-2xl font-bold tracking-tight truncate mt-2 ${isBurst ? 'text-rose-600' : 'text-emerald-700'}`} title={isBurst ? `- ${formatFullRM(burstAmount)}` : formatFullRM(remainingBalanceRM)}>
                                            {isBurst ? `- ${formatFullRM(burstAmount)}` : formatFullRM(remainingBalanceRM)}
                                        </h3>
                                        <div className="mt-3.5 pt-2.5 border-t border-slate-100 text-[11px] font-semibold text-slate-500 truncate">
                                            {isBurst ? `Melebihi bajet ${formatFullRM(burstAmount)}` : `Baki bersih (selepas denda)`}
                                        </div>
                                    </Card>
                                </div>

                                <Card noPadding className="overflow-x-auto mt-6">
                                    <div className="p-6 border-b border-slate-100 bg-white flex justify-between items-center">
                                        <h3 className="font-extrabold text-slate-900 flex items-center"><Receipt className="w-5 h-5 mr-2 text-slate-400" /> Senarai Rekod Kewangan & Denda SLA</h3>
                                        <span className="text-sm font-bold text-indigo-600">{finances.length} Rekod</span>
                                    </div>
                                    <table className="w-full text-left border-collapse min-w-[800px]">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-100">
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">No. Rujukan / Tarikh</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Perkara / Keterangan</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pembekal / Vendor</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Jumlah (RM)</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Tindakan</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {finances.map(fin => {
                                                const isPenalty = fin.type === 'Denda' || fin.status === 'Denda SLA';
                                                return (
                                                    <tr key={fin.id} className={`hover:bg-slate-50 transition-colors ${isPenalty ? 'bg-rose-50/20' : ''}`}>
                                                        <td className="px-6 py-4">
                                                            <div className={`font-bold text-sm ${isPenalty ? 'text-rose-700 flex items-center' : 'text-slate-900'}`}>
                                                                {isPenalty && <AlertTriangle className="w-3.5 h-3.5 mr-1 text-rose-600 shrink-0" />}
                                                                {fin.invoice_no}
                                                            </div>
                                                            <div className="text-xs font-medium text-slate-400 mt-0.5">{formatDateMalay(fin.date)}</div>
                                                        </td>
                                                        <td className="px-6 py-4 font-semibold text-slate-700 text-sm">
                                                            {fin.description}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-semibold text-slate-500">{fin.vendor}</td>
                                                        <td className={`px-6 py-4 font-extrabold text-sm text-right ${isPenalty ? 'text-rose-600 font-black' : 'text-slate-900'}`}>
                                                            {isPenalty ? `- ${parseFloat(fin.amount).toLocaleString('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : parseFloat(fin.amount).toLocaleString('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            {isPenalty ? (
                                                                <span className="px-3 py-1 bg-rose-100 text-rose-700 border border-rose-200 text-xs font-extrabold rounded-full inline-flex items-center shadow-2xs">
                                                                    ⚠️ Denda SLA
                                                                </span>
                                                            ) : (
                                                                <Badge text={fin.status} />
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex items-center justify-end space-x-2">
                                                                {isPenalty ? (
                                                                    <button onClick={() => { setEditingPenalty(fin); setIsPenaltyModalOpen(true); }} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors text-slate-500 shadow-sm" title="Kemaskini Denda SLA">
                                                                        <Edit className="w-4 h-4" />
                                                                    </button>
                                                                ) : (
                                                                    <button onClick={() => { setEditingFinance(fin); setIsFinanceModalOpen(true); }} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors text-slate-500 shadow-sm" title="Kemaskini Tuntutan">
                                                                        <Edit className="w-4 h-4" />
                                                                    </button>
                                                                )}
                                                                <button onClick={() => setFinanceToDelete(fin)} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors text-slate-500 shadow-sm" title="Padam Rekod">
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </Card>
                            </div>
                        );
                    })()
                }

                {
                    activeTab === 'Dokumen (DMS)' && (() => {
                        const filteredDocs = selectedCategoryFilter === 'Semua'
                            ? docs
                            : docs.filter(d => d.category === selectedCategoryFilter || (selectedCategoryFilter === 'Kanban File' && d.category === 'Spesifikasi Sistem'));

                        const categories = ['Semua', 'Minit Mesyuarat', 'Dokumen Kontrak', 'Kanban File', 'Kewangan & Bajet', 'Denda'];

                        return (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                                    <div>
                                        <h3 className="text-xl font-extrabold text-slate-900">Repositori Dokumen (DMS)</h3>
                                        <p className="text-slate-500 text-sm mt-1">Urus dan muat naik dokumen berkaitan projek secara selamat.</p>
                                    </div>
                                    <button onClick={() => { setSelectedFile(null); setIsDocModalOpen(true); }} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-800 flex items-center text-sm shadow-md transition-all active:scale-[0.98]">
                                        <UploadCloud className="w-4 h-4 mr-2" /> Muat Naik Dokumen
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                                    {categories.map((cat, i) => {
                                        const isActive = selectedCategoryFilter === cat;
                                        const count = cat === 'Semua'
                                            ? docs.length
                                            : docs.filter(d => d.category === cat || (cat === 'Kanban File' && d.category === 'Spesifikasi Sistem')).length;
                                        return (
                                            <div
                                                key={i}
                                                onClick={() => setSelectedCategoryFilter(isActive && cat !== 'Semua' ? 'Semua' : cat)}
                                                className={`p-3.5 rounded-2xl border flex items-center space-x-3 cursor-pointer transition-all ${isActive
                                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
                                                    : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:shadow-sm'
                                                    }`}
                                            >
                                                <div className={`p-2 rounded-xl shrink-0 transition-colors ${isActive ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'
                                                    }`}>
                                                    <Folder className="w-5 h-5" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className={`font-bold text-xs sm:text-sm truncate ${isActive ? 'text-white' : 'text-slate-800'}`}>{cat}</p>
                                                    <p className={`text-[11px] font-semibold ${isActive ? 'text-indigo-100' : 'text-slate-400'}`}>{count} Fail</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <Card noPadding className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-[750px]">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-100">
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Nama Dokumen</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Kategori</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Dimuat Naik Oleh</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Saiz</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right whitespace-nowrap">Tindakan</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredDocs.length > 0 ? (
                                                filteredDocs.map(doc => (
                                                    <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center space-x-3">
                                                                <div className="p-2 bg-indigo-50 rounded-lg shrink-0">
                                                                    <FileText className="w-5 h-5 text-indigo-600" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-slate-900 text-sm hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => window.open(`http://localhost/My-PMO/api/modules/download.php?id=${doc.id}&user_id=${currentUser?.id}`, '_blank')}>{doc.file_name}</p>
                                                                    <p className="text-xs font-medium text-slate-400 mt-0.5">{formatDateMalay(doc.created_at ? doc.created_at.split(' ')[0] : '')}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="inline-block bg-slate-50 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold border border-slate-200 whitespace-nowrap">{doc.category === 'Spesifikasi Sistem' ? 'Kanban File' : doc.category}</span>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-semibold text-slate-700 whitespace-nowrap">{doc.uploader_name || 'Sistem'}</td>
                                                        <td className="px-6 py-4 text-sm font-semibold text-slate-500 whitespace-nowrap">{formatFileSize(doc.file_size)}</td>
                                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                                            <div className="flex items-center justify-end space-x-1.5 shrink-0">
                                                                <button onClick={() => window.open(`http://localhost/My-PMO/api/modules/download.php?id=${doc.id}&user_id=${currentUser?.id}`, '_blank')} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-colors text-slate-500 shadow-sm" title="Muat Turun Dokumen"><Download className="w-4 h-4" /></button>
                                                                <button onClick={() => setEditingDoc(doc)} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 transition-colors text-slate-500 shadow-sm" title="Ubah Dokumen"><Edit className="w-4 h-4" /></button>
                                                                <button onClick={() => setDocToDelete(doc)} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors text-slate-500 shadow-sm" title="Padam Dokumen"><Trash2 className="w-4 h-4" /></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="text-center py-12 text-slate-400 font-medium">
                                                        Tiada dokumen ditemui untuk kategori <span className="font-bold text-slate-700">"{selectedCategoryFilter}"</span>.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </Card>
                            </div>
                        );
                    })()
                }

                {
                    activeTab === 'Ahli Pasukan' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                                <div>
                                    <h3 className="text-xl font-extrabold text-slate-900">Ahli Pasukan Projek</h3>
                                    <p className="text-slate-500 text-sm mt-1">Urus pegawai dan ahli pasukan yang diberikan akses kepada maklumat projek ini.</p>
                                </div>
                                <button onClick={() => setIsAddMemberModalOpen(true)} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-800 flex items-center text-sm shadow-md transition-all active:scale-[0.98]">
                                    <Plus className="w-4 h-4 mr-2" /> Tambah Ahli Pasukan
                                </button>
                            </div>

                            <Card noPadding className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[750px]">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-100">
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Pegawai / Ahli</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Peranan Dalam Projek</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Peranan Sistem / Agensi</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status Akses</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Tindakan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {teamMembers.length > 0 ? (
                                            teamMembers.map(m => {
                                                const initials = m.name ? m.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'AP';
                                                return (
                                                    <tr key={m.member_id} className="hover:bg-slate-50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center space-x-3">
                                                                <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-sm">
                                                                    {initials}
                                                                </div>
                                                                <div>
                                                                    <p className="font-extrabold text-slate-900 text-sm">{m.name}</p>
                                                                    <p className="text-xs text-slate-400 font-medium">{m.email}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-xs font-extrabold border border-indigo-100 inline-block">
                                                                {m.project_role || 'Ahli Pasukan'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm font-bold text-slate-800">{m.agency || 'PKPMP'}</div>
                                                            <div className="text-xs text-slate-400 uppercase font-semibold">{m.system_role || 'Pengguna'}</div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <Badge text={m.status || 'Aktif'} />
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <button
                                                                onClick={() => setMemberToDelete(m)}
                                                                className="px-3.5 py-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl hover:bg-rose-600 hover:text-white transition-colors text-xs font-bold shadow-sm inline-flex items-center active:scale-95"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Buang Akses
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="text-center py-12 text-slate-400 font-medium">
                                                    Belum ada ahli pasukan yang didaftarkan secara khusus untuk projek ini. Klik "+ Tambah Ahli Pasukan" untuk menambah ahli.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </Card>
                        </div>
                    )
                }
            </div >
        </div >
    );
};

const CalendarPage = () => {
    const [events, setEvents] = useState(CALENDAR_EVENTS);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const daysOfWeek = ['Aha', 'Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab'];
    const blanks = Array(5).fill(null);
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    const handleAddEvent = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const dateValue = formData.get('date');
        const dayNumber = parseInt(dateValue.split('-')[2]);

        const newEvent = {
            id: Date.now(),
            title: formData.get('title'),
            date: dayNumber,
            type: formData.get('type'),
            color: formData.get('type') === 'meeting' ? 'bg-slate-800' : formData.get('type') === 'deadline' ? 'bg-rose-500' : 'bg-indigo-500'
        };

        setEvents([...events, newEvent]);
        setIsEventModalOpen(false);
    };

    return (
        <div className="space-y-8 flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500 relative">

            {isEventModalOpen && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsEventModalOpen(false)}></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-xl animate-in zoom-in-95 duration-200">
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-[32px]">
                                <h2 className="text-xl font-extrabold text-slate-900">Tambah Acara Kalendar</h2>
                                <button onClick={() => setIsEventModalOpen(false)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200">&times;</button>
                            </div>
                            <form onSubmit={handleAddEvent} className="p-8 space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Tajuk Acara</label>
                                    <input name="title" required type="text" placeholder="Mesyuarat / Tarikh Akhir" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Tarikh (Mei 2026)</label>
                                        <input name="date" required type="date" min="2026-05-01" max="2026-05-31" defaultValue="2026-05-15" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Jenis Acara</label>
                                        <select name="type" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none">
                                            <option value="meeting">Mesyuarat (Meeting)</option>
                                            <option value="milestone">Pencapaian (Milestone)</option>
                                            <option value="deadline">Tarikh Akhir (Deadline)</option>
                                            <option value="task">Tugasan (Task)</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4"><button type="submit" className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800">Simpan Acara</button></div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 shrink-0">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Kalendar & Garis Masa</h1>
                    <p className="text-slate-500 mt-1 text-lg">Jejak tarikh akhir, mesyuarat, dan pencapaian.</p>
                </div>
                <div className="flex flex-wrap space-x-3">
                    <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                        <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                        <span className="px-5 font-bold text-slate-800 text-sm">Mei 2026</span>
                        <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors"><ChevronRight className="w-5 h-5" /></button>
                    </div>
                    <button onClick={() => setIsEventModalOpen(true)} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-800 flex items-center shadow-md text-sm transition-all active:scale-[0.98]">
                        <Plus className="w-4 h-4 mr-2" /> Tambah Acara
                    </button>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 xl:grid-cols-4 gap-8 min-h-0 overflow-hidden">
                <Card className="xl:col-span-3 flex flex-col h-full overflow-hidden" noPadding>
                    <div className="p-6 lg:p-8 flex-1 flex flex-col overflow-y-auto">
                        <div className="grid grid-cols-7 mb-4 shrink-0">
                            {daysOfWeek.map(d => <div key={d} className="text-center text-xs font-extrabold text-slate-400 uppercase tracking-widest">{d}</div>)}
                        </div>
                        <div className="flex-1 grid grid-cols-7 grid-rows-6 gap-px bg-slate-100 border border-slate-100 rounded-3xl overflow-hidden min-h-[500px]">
                            {blanks.map((_, i) => <div key={`blank-${i}`} className="bg-slate-50 p-2 min-h-[80px]"></div>)}
                            {days.map(d => {
                                const dayEvents = events.filter(e => e.date === d);
                                const isToday = d === 10;
                                return (
                                    <div key={d} className={`bg-white p-3 min-h-[90px] hover:bg-slate-50 transition-colors flex flex-col ${isToday ? 'bg-indigo-50/30' : ''}`}>
                                        <span className={`text-sm font-extrabold mb-2 w-8 h-8 flex items-center justify-center rounded-full ${isToday ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-700'}`}>{d}</span>
                                        <div className="flex-1 space-y-1.5 overflow-y-auto no-scrollbar">
                                            {dayEvents.map(evt => (
                                                <div key={evt.id} className={`${evt.color} text-white text-[11px] px-2 py-1 rounded-md shadow-sm truncate font-bold cursor-pointer hover:opacity-90 transition-opacity`}>
                                                    {evt.title}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}
                            {Array(6).fill(null).map((_, i) => <div key={`end-blank-${i}`} className="bg-slate-50 p-2 min-h-[80px]"></div>)}
                        </div>
                    </div>
                </Card>

                <div className="flex flex-col h-full overflow-hidden">
                    <Card className="flex-1 overflow-y-auto">
                        <h3 className="text-xl font-extrabold text-slate-900 mb-8 flex items-center"><Flag className="w-5 h-5 text-indigo-500 mr-3" /> Akan Datang</h3>
                        <div className="space-y-0 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-100">
                            {events.sort((a, b) => a.date - b.date).filter(e => e.date >= 10).map((evt) => (
                                <div key={evt.id} className="relative flex items-start group mb-8 last:mb-0">
                                    <div className={`flex items-center justify-center w-6 h-6 rounded-full border-[3px] border-white shrink-0 shadow-sm ${evt.color} relative z-10`}></div>
                                    <div className="ml-5 pt-0.5">
                                        <h4 className="font-extrabold text-slate-900 text-sm leading-tight mb-1">{evt.title}</h4>
                                        <p className="text-xs text-slate-500 font-semibold flex items-center mb-2"><CalendarIcon className="w-3 h-3 mr-1.5" /> {evt.date} Mei 2026</p>
                                        <span className={`text-[10px] uppercase tracking-widest font-extrabold px-2.5 py-1 rounded-md border border-slate-100 bg-slate-50 text-slate-600`}>{evt.type}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const ReportsPage = ({ projects = [] }) => {
    const formatCurrency = (val) => {
        let amount = Number(val) || 0;
        if (amount > 0 && amount < 10000) {
            amount = amount * 1000000;
        }
        return `RM ${amount.toLocaleString('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    // Dynamic KPI calculations from live project data
    const totalBudget = projects.reduce((acc, p) => acc + (Number(p.budget) || 0), 0);
    const totalSpent = projects.reduce((acc, p) => acc + (((Number(p.budget) || 0) * (Number(p.progress) || 0)) / 100), 0);
    const totalRemaining = Math.max(0, totalBudget - totalSpent);
    const pctUsed = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
    const pctRemaining = Math.max(0, 100 - pctUsed);
    const avgProgress = projects.length > 0 ? Math.round(projects.reduce((acc, p) => acc + (Number(p.progress) || 0), 0) / projects.length) : 0;
    const highRiskCount = projects.filter(p => p.status === 'Lewat' || p.status === 'Berisiko' || p.health === 'Berisiko' || p.health === 'Amaran').length;

    // Dynamic Agency / Division Data breakdown
    const agencyMap = {};
    projects.forEach(p => {
        const agencyName = p.division || p.agency || 'Pejabat PMO';
        if (!agencyMap[agencyName]) {
            agencyMap[agencyName] = {
                name: agencyName,
                budget: 0,
                spent: 0,
                projects: 0,
                totalProgress: 0,
                hasRisk: false
            };
        }
        const b = Number(p.budget) || 0;
        const prog = Number(p.progress) || 0;
        agencyMap[agencyName].budget += b;
        agencyMap[agencyName].spent += (b * prog) / 100;
        agencyMap[agencyName].projects += 1;
        agencyMap[agencyName].totalProgress += prog;
        if (p.status === 'Lewat' || p.status === 'Berisiko' || p.health === 'Berisiko' || p.health === 'Amaran') {
            agencyMap[agencyName].hasRisk = true;
        }
    });

    let agencyData = Object.values(agencyMap).map(a => {
        const avgProg = a.projects > 0 ? Math.round(a.totalProgress / a.projects) : 0;
        let statusStr = 'Baik';
        if (a.hasRisk) statusStr = 'Berisiko';
        else if (avgProg === 100) statusStr = 'Selesai';
        else if (avgProg >= 75) statusStr = 'Cemerlang';

        return {
            name: a.name,
            budget: a.budget,
            spent: a.spent,
            projects: a.projects,
            efficiency: avgProg,
            status: statusStr
        };
    });

    if (agencyData.length === 0) {
        agencyData = [
            { name: 'Pejabat Ketua Pendaftar Mahkamah Persekutuan', budget: 0, spent: 0, projects: 0, efficiency: 0, status: 'Baik' }
        ];
    }

    // Dynamic Donut status percentages
    const totalProj = projects.length || 1;
    const completedCount = projects.filter(p => p.status === 'Selesai' || p.progress === 100).length;
    const activeCount = projects.filter(p => p.status === 'Aktif' && p.progress < 100).length;

    const completedPct = Math.round((completedCount / totalProj) * 100);
    const activePct = Math.round((activeCount / totalProj) * 100);
    const riskPct = Math.max(0, 100 - completedPct - activePct);

    const exportReportsToCSV = () => {
        if (!projects || projects.length === 0) return;
        const headers = ['Agensi / Bahagian', 'Projek Aktif', 'Jumlah Bajet (RM)', 'Jumlah Perbelanjaan (RM)', 'Kecekapan (%)', 'Status'];
        const rows = agencyData.map(a => [
            `"${(a.name || '').replace(/"/g, '""')}"`,
            `"${a.projects || 0}"`,
            `"${a.budget || 0}"`,
            `"${a.spent || 0}"`,
            `"${a.efficiency || 0}"`,
            `"${a.status || ''}"`
        ]);

        const csvContent = '\uFEFF' + [
            '=== LAPORAN RINGKASAN ANALITIK MY-PMO ===',
            '',
            '--- PECAHAN PRESTASI BAHAGIAN ---',
            headers.join(','),
            ...rows.map(r => r.join(',')),
            '',
            '--- SENARAI TERPERINCI PROJEK ---',
            ['ID Projek', 'Nama Projek', 'Bahagian', 'Pengurus', 'Bajet (RM)', 'Kemajuan (%)', 'Status'].join(','),
            ...projects.map(p => [
                `"${p.id || ''}"`,
                `"${(p.name || '').replace(/"/g, '""')}"`,
                `"${(p.division || p.agency || '').replace(/"/g, '""')}"`,
                `"${(p.manager || '').replace(/"/g, '""')}"`,
                `"${p.budget || 0}"`,
                `"${p.progress || 0}"`,
                `"${(p.status || '').replace(/"/g, '""')}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `laporan_analitik_pmo_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header section with responsive flex layout */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-5">
                <div>
                    <div className="flex items-center space-x-2.5">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Analitik Laporan</h1>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 hidden sm:inline-block">Dinamik</span>
                    </div>
                    <p className="text-slate-500 mt-1 text-sm sm:text-base">Prestasi kemajuan dan analisis kewangan projek secara masa nyata.</p>
                </div>

                {/* Export Action Buttons */}
                <div className="flex items-center space-x-2.5 self-start sm:self-auto shrink-0 print:hidden">
                    <button
                        onClick={exportReportsToCSV}
                        className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
                        title="Eksport data ke fail Excel / CSV"
                    >
                        <Download className="w-4 h-4 text-emerald-600" />
                        <span>Eksport Excel</span>
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                        title="Cetak atau simpan sebagai PDF"
                    >
                        <FileText className="w-4 h-4 text-white" />
                        <span>Cetak / PDF</span>
                    </button>
                </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[
                    { title: 'Jumlah Bajet Diperuntukkan', value: formatCurrency(totalBudget), icon: DollarSign, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100', trend: `${projects.length} Projek`, isUp: true },
                    { title: 'Jumlah Perbelanjaan Sebenar', value: formatCurrency(totalSpent), icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100', trend: `${pctUsed}% Diguna`, isUp: true },
                    { title: 'Baki Peruntukan', value: formatCurrency(totalRemaining), icon: Receipt, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100', trend: `${pctRemaining}% Baki`, isUp: true },
                    { title: 'Kadar Pencapaian', value: `${avgProgress}%`, icon: Target, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100', trend: 'Purata Kemajuan', isUp: true },
                ].map((kpi, i) => (
                    <Card key={i} className="group hover:border-indigo-200 hover:shadow-md transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl border ${kpi.bg} group-hover:scale-105 transition-transform duration-300`}>
                                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                            </div>
                            <div className="flex items-center text-xs font-extrabold bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                                {kpi.isUp ? <ArrowUpRight className="w-3 h-3 text-emerald-500 mr-1" /> : <ArrowDownRight className="w-3 h-3 text-rose-500 mr-1" />}
                                <span className={kpi.isUp ? 'text-emerald-700' : 'text-rose-700'}>{kpi.trend}</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 tracking-tight leading-snug break-words" title={kpi.value}>
                                {kpi.value}
                            </h3>
                            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">{kpi.title}</p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Financial Overview & Project Status Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Financial Breakdown */}
                <Card className="lg:col-span-2 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">Gambaran Kewangan Agensi</h3>
                            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Perbandingan perbelanjaan sebenar dan peruntukan bajet mengikut bahagian.</p>
                        </div>
                    </div>
                    <div className="space-y-6">
                        {agencyData.map(agency => {
                            const spentPct = agency.budget > 0 ? Math.min(100, Math.round((agency.spent / agency.budget) * 100)) : 0;
                            return (
                                <div key={agency.name} className="space-y-2">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs sm:text-sm">
                                        <span className="font-extrabold text-slate-800 line-clamp-1">{agency.name}</span>
                                        <span className="text-slate-500 font-semibold whitespace-nowrap">
                                            {formatCurrency(agency.spent)} <span className="text-slate-400">/</span> {formatCurrency(agency.budget)}
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden flex border border-slate-200/60 p-0.5">
                                        <div
                                            className="bg-gradient-to-r from-indigo-600 to-indigo-800 h-full relative group transition-all duration-1000 rounded-full shadow-sm"
                                            style={{ width: `${Math.max(spentPct, 4)}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>

                {/* Status Projek Donut Chart */}
                <Card className="flex flex-col items-center justify-between relative overflow-hidden">
                    <div className="w-full mb-6 text-left">
                        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">Status Projek</h3>
                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Pecahan status fizikal keseluruhan projek.</p>
                    </div>

                    <div className="relative py-4 my-auto">
                        <PieChart className="w-36 h-36 sm:w-40 sm:h-40 text-slate-100 absolute inset-0 m-auto pointer-events-none" strokeWidth={1} />
                        <DonutChart percentage={completedPct} colorClass="text-emerald-600" label="Selesai" />
                    </div>

                    <div className="w-full mt-6 space-y-3 pt-4 border-t border-slate-100">
                        <div className="flex justify-between items-center text-xs sm:text-sm">
                            <span className="text-slate-600 font-medium flex items-center">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2.5 shrink-0"></span> Selesai
                            </span>
                            <span className="font-extrabold text-slate-900">{completedPct}%</span>
                        </div>
                        <div className="flex justify-between items-center text-xs sm:text-sm">
                            <span className="text-slate-600 font-medium flex items-center">
                                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 mr-2.5 shrink-0"></span> Dalam Kemajuan
                            </span>
                            <span className="font-extrabold text-slate-900">{activePct}%</span>
                        </div>
                        <div className="flex justify-between items-center text-xs sm:text-sm">
                            <span className="text-slate-600 font-medium flex items-center">
                                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-2.5 shrink-0"></span> Berisiko / Lewat
                            </span>
                            <span className="font-extrabold text-slate-900">{riskPct}%</span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Division Performance Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">Pecahan Prestasi Bahagian</h3>
                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Analisis kecekapan dan peruntukan bajet mengikut unit/agensi.</p>
                    </div>
                </div>

                <div className="overflow-x-auto min-w-full">
                    <table className="w-full text-left border-collapse min-w-[650px]">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 text-xs font-extrabold uppercase tracking-wider">
                                <th className="px-6 py-4">Agensi / Bahagian</th>
                                <th className="px-6 py-4">Projek Aktif</th>
                                <th className="px-6 py-4">Jumlah Bajet</th>
                                <th className="px-6 py-4">Kecekapan Penghantaran</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {agencyData.map((agency, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="px-6 py-4 font-extrabold text-slate-900 max-w-[260px] truncate" title={agency.name}>
                                        {agency.name}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 font-semibold whitespace-nowrap">
                                        {agency.projects} Projek
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-700 whitespace-nowrap">
                                        {formatCurrency(agency.budget)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3 min-w-[140px]">
                                            <span className="font-extrabold text-slate-800 text-xs w-9 shrink-0">{agency.efficiency}%</span>
                                            <ProgressBar progress={agency.efficiency} colorClass={agency.efficiency >= 85 ? "bg-emerald-500" : agency.efficiency < 50 ? "bg-rose-500" : "bg-indigo-500"} />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge text={agency.status} type={agency.status === 'Berisiko' ? 'Berisiko' : agency.status === 'Selesai' ? 'Selesai' : 'Baik'} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detailed Projects Table (Hidden on Screen, Appears Only in Printed PDF) */}
            <div className="hidden print:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mt-6">
                <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">Senarai Terperinci Projek</h3>
                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Maklumat terperinci status, bajet, dan kemajuan setiap projek.</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-100 self-start sm:self-auto">
                        {projects.length} Projek Keseluruhan
                    </span>
                </div>

                <div className="overflow-x-auto min-w-full">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 text-xs font-extrabold uppercase tracking-wider">
                                <th className="px-6 py-4">ID & Nama Projek</th>
                                <th className="px-6 py-4">Agensi / Bahagian</th>
                                <th className="px-6 py-4">Pengurus Projek (PMO)</th>
                                <th className="px-6 py-4">Jumlah Bajet (RM)</th>
                                <th className="px-6 py-4 text-center">Kemajuan (%)</th>
                                <th className="px-6 py-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {projects.map((prj, idx) => (
                                <tr key={prj.id || idx} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-extrabold text-slate-900 text-xs sm:text-sm">{prj.name}</div>
                                        <div className="inline-block bg-slate-100 text-slate-500 text-[10px] font-semibold px-2 py-0.5 rounded-md mt-1 border border-slate-200">
                                            {prj.project_code || (String(prj.id).startsWith('PRJ-') ? prj.id : `PRJ-${String(prj.id).padStart(3, '0')}`)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs font-bold text-slate-800">{prj.division || prj.agency || 'PKPMP'}</div>
                                        {prj.unit && <div className="text-[11px] font-medium text-slate-500">{prj.unit}</div>}
                                    </td>
                                    <td className="px-6 py-4 text-xs">
                                        <div className="font-bold text-slate-900">{prj.manager || 'Tiada'}</div>
                                        {prj.vendor_manager && <div className="text-slate-500 font-medium">{prj.vendor_manager}</div>}
                                    </td>
                                    <td className="px-6 py-4 font-extrabold text-slate-900 whitespace-nowrap">
                                        {formatCurrency(prj.budget)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                                <div
                                                    className={`h-full rounded-full ${prj.progress > 75 ? "bg-emerald-500" : prj.progress < 50 ? "bg-amber-500" : "bg-indigo-500"}`}
                                                    style={{ width: `${Math.max(prj.progress || 0, 5)}%` }}
                                                />
                                            </div>
                                            <span className="font-extrabold text-slate-900 text-xs">{prj.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        <Badge text={prj.status} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const UsersPage = () => {
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const res = await fetch('http://localhost/My-PMO/api/modules/users.php');
            const data = await res.json();
            if (data.status === 'success') {
                const mappedData = data.data.map(u => ({
                    ...u,
                    roleId: u.role, // Map 'role' dari DB ke 'roleId'
                    avatar: u.avatar || u.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                }));
                setUsers(mappedData);
            }
        } catch (err) {
            console.error("Ralat memuat turun pengguna:", err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [viewRoleUsers, setViewRoleUsers] = useState(null);

    const [filterRole, setFilterRole] = useState('Semua');
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordUser, setPasswordUser] = useState(null);

    const filteredUsers = filterRole === 'Semua' ? users : users.filter(u => u.roleId === filterRole);

    const getRoleStyle = (roleId) => {
        const role = MOCK_ROLES.find(r => r.id === roleId);
        return role ? role.color : 'bg-slate-100 text-slate-700 border-slate-200';
    };

    const getRoleName = (roleId) => {
        const role = MOCK_ROLES.find(r => r.id === roleId);
        return role ? role.name : roleId;
    };

    const handleSaveUser = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        try {
            if (editingUser) {
                const bodyObj = {
                    id: editingUser.id,
                    name: formData.get('name'),
                    email: formData.get('email'),
                    role: formData.get('role'),
                    agency: formData.get('agency'),
                    status: formData.get('status')
                };
                const pwd = formData.get('password');
                if (pwd) bodyObj.password = pwd;

                await fetch('http://localhost/My-PMO/api/modules/users.php', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bodyObj)
                });
            } else {
                await fetch('http://localhost/My-PMO/api/modules/users.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formData.get('name'),
                        email: formData.get('email'),
                        role: formData.get('role'),
                        agency: formData.get('agency'),
                        status: formData.get('status'),
                        password: formData.get('password') || 'password123'
                    })
                });
            }
            fetchUsers();
            setIsUserModalOpen(false);
            if (showToastNotification) showToastNotification('Maklumat pengguna berjaya disimpan.');
        } catch (err) {
            console.error("Ralat menyimpan pengguna:", err);
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            await fetch('http://localhost/My-PMO/api/modules/users.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            fetchUsers();
        } catch (err) {
            console.error("Ralat memadam pengguna:", err);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newPassword = formData.get('newPassword');
        const confirmPassword = formData.get('confirmPassword');

        if (!newPassword || newPassword !== confirmPassword) {
            alert('Kata laluan tidak sepadan! Sila pastikan kedua-dua medan kata laluan adalah sama.');
            return;
        }

        try {
            const res = await fetch('http://localhost/My-PMO/api/modules/users.php', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: passwordUser.id,
                    password: newPassword
                })
            });
            const data = await res.json();
            if (data.status === 'success') {
                if (showToastNotification) showToastNotification('Kata laluan pengguna berjaya dikemas kini!');
                fetchUsers();
                setIsPasswordModalOpen(false);
                setPasswordUser(null);
            } else {
                alert('Gagal mengemaskini kata laluan: ' + data.message);
            }
        } catch (err) {
            console.error("Ralat kemaskini kata laluan:", err);
            alert('Ralat semasa menghubungi pelayan.');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">

            {isPasswordModalOpen && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsPasswordModalOpen(false)}></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-[32px]">
                                <div>
                                    <h2 className="text-xl font-extrabold text-slate-900">Ubah Kata Laluan</h2>
                                    <p className="text-sm font-semibold text-slate-500 mt-1">Pengguna: <span className="font-bold text-slate-700">{passwordUser?.name}</span></p>
                                </div>
                                <button onClick={() => setIsPasswordModalOpen(false)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200 hover:text-slate-900">&times;</button>
                            </div>
                            <form onSubmit={handleUpdatePassword} className="p-8 space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Kata Laluan Baharu</label>
                                    <input name="newPassword" required type="password" placeholder="Masukkan kata laluan baharu" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-amber-50 focus:border-amber-400 outline-none transition-all font-medium" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Sahkan Kata Laluan</label>
                                    <input name="confirmPassword" required type="password" placeholder="Sahkan kata laluan" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-amber-50 focus:border-amber-400 outline-none transition-all font-medium" />
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button type="submit" className="w-full px-6 py-4 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 shadow-md transition-all active:scale-[0.98]">
                                        Simpan Kata Laluan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {isUserModalOpen && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsUserModalOpen(false)}></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-xl animate-in zoom-in-95 duration-200">
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-[32px]">
                                <h2 className="text-xl font-extrabold text-slate-900">{editingUser ? 'Kemaskini Pengguna' : 'Tambah Pengguna Baru'}</h2>
                                <button onClick={() => setIsUserModalOpen(false)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200">&times;</button>
                            </div>
                            <form onSubmit={handleSaveUser} className="p-8 space-y-5">
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Nama Penuh</label>
                                        <input name="name" defaultValue={editingUser?.name || ''} required type="text" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">E-mel Rasmi</label>
                                        <input name="email" defaultValue={editingUser?.email || ''} required type="email" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Kata Laluan {editingUser ? <span className="text-slate-400 font-normal text-xs">(Biarkan kosong jika tidak mahu ubah)</span> : <span className="text-rose-500">*</span>}</label>
                                    <input name="password" required={!editingUser} type="password" placeholder={editingUser ? "Kata laluan baharu (pilihan)..." : "Masukkan kata laluan log masuk..."} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Agensi / Kementerian / Syarikat</label>
                                    <input name="agency" defaultValue={editingUser?.agency || ''} required type="text" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium" />
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Peranan (Role)</label>
                                        <select name="role" defaultValue={editingUser?.roleId || 'pmo_gov'} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium">
                                            {MOCK_ROLES.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
                                        <select name="status" defaultValue={editingUser?.status || 'Aktif'} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium">
                                            <option value="Aktif">Aktif</option>
                                            <option value="Tidak Aktif">Tidak Aktif</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4"><button type="submit" className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">Simpan Pengguna</button></div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {viewRoleUsers && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setViewRoleUsers(null)}></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200">
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-[32px]">
                                <div>
                                    <h2 className="text-xl font-extrabold text-slate-900">Senarai Pengguna</h2>
                                    <p className="text-sm font-semibold text-slate-500 mt-1">Peranan: {getRoleName(viewRoleUsers)}</p>
                                </div>
                                <button onClick={() => setViewRoleUsers(null)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200">&times;</button>
                            </div>
                            <div className="p-4 max-h-96 overflow-y-auto">
                                {users.filter(u => u.roleId === viewRoleUsers).length > 0 ? (
                                    <div className="divide-y divide-slate-100">
                                        {users.filter(u => u.roleId === viewRoleUsers).map(u => (
                                            <div key={u.id} className="p-4 flex items-center space-x-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">{u.avatar}</div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{u.name}</p>
                                                    <p className="text-sm text-slate-500">{u.agency} • {u.email}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-slate-400 py-8 font-medium">Tiada pengguna diberikan peranan ini.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Pasukan & Peranan</h1>
                    <p className="text-slate-500 mt-1 text-lg">Urus akses pengguna, tugasan agensi, dan kebenaran sistem.</p>
                </div>
                <div className="flex space-x-3">
                    <div className="relative">
                        <button onClick={() => setShowFilterMenu(!showFilterMenu)} className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 flex items-center shadow-sm transition-colors">
                            <Filter className="w-4 h-4 mr-2" /> Tapis {filterRole !== 'Semua' && <span className="ml-2 bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[10px]">{getRoleName(filterRole)}</span>}
                        </button>
                        {showFilterMenu && (
                            <div className="absolute top-full mt-2 left-0 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 py-2 animate-in fade-in zoom-in-95">
                                <p className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tapis Peranan</p>
                                <button onClick={() => { setFilterRole('Semua'); setShowFilterMenu(false); }} className={`w-full text-left px-4 py-2 text-sm font-semibold hover:bg-slate-50 ${filterRole === 'Semua' ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-700'}`}>Semua Peranan</button>
                                {MOCK_ROLES.map(r => (
                                    <button key={r.id} onClick={() => { setFilterRole(r.id); setShowFilterMenu(false); }} className={`w-full text-left px-4 py-2 text-sm font-semibold hover:bg-slate-50 ${filterRole === r.id ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-700'}`}>
                                        {r.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button onClick={() => { setEditingUser(null); setIsUserModalOpen(true); }} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-800 flex items-center text-sm shadow-md transition-all active:scale-[0.98]">
                        <UserPlus className="w-4 h-4 mr-2" /> Tambah Pengguna
                    </button>
                </div>
            </div>

            <div className="border-b border-slate-200 flex space-x-8">
                <button onClick={() => setActiveTab('users')} className={`pb-4 text-sm font-bold border-b-2 transition-colors flex items-center ${activeTab === 'users' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-700'}`}>
                    <Users className="w-4 h-4 mr-2" /> Direktori Pengguna
                </button>
                <button onClick={() => setActiveTab('roles')} className={`pb-4 text-sm font-bold border-b-2 transition-colors flex items-center ${activeTab === 'roles' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-700'}`}>
                    <ShieldCheck className="w-4 h-4 mr-2" /> Kebenaran Peranan (Roles)
                </button>
            </div>

            {activeTab === 'users' ? (
                <Card noPadding className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Pengguna</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Agensi</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Peranan</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Tindakan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/80">
                            {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-8 py-5 flex items-center space-x-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-extrabold shadow-sm">
                                            {user.avatar}
                                        </div>
                                        <div>
                                            <div className="font-extrabold text-slate-900 text-sm">{user.name}</div>
                                            <div className="text-slate-500 font-medium text-xs mt-1">{user.email}</div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-slate-700 font-bold text-sm">{user.agency}</td>
                                    <td className="px-8 py-5">
                                        <span className={`px-3 py-1.5 text-xs font-bold rounded-full border ${getRoleStyle(user.roleId)}`}>
                                            {getRoleName(user.roleId)}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <Badge text={user.status} type={user.status === 'Aktif' ? 'Baik' : 'default'} />
                                    </td>
                                    <td className="px-8 py-5 text-right space-x-2 whitespace-nowrap">
                                        <button onClick={() => { setPasswordUser(user); setIsPasswordModalOpen(true); }} title="Ubah Kata Laluan" className="p-2 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 border border-slate-200 bg-white rounded-xl text-slate-400 transition-colors shadow-sm"><Key className="w-4 h-4" /></button>
                                        <button onClick={() => { setEditingUser(user); setIsUserModalOpen(true); }} title="Kemaskini Pengguna" className="p-2 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 border border-slate-200 bg-white rounded-xl text-slate-400 transition-colors shadow-sm"><Edit className="w-4 h-4" /></button>
                                        <button onClick={() => handleDeleteUser(user.id)} title="Padam Pengguna" className="p-2 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 border border-slate-200 bg-white rounded-xl text-slate-400 transition-colors shadow-sm"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="5" className="px-8 py-10 text-center text-slate-500 font-medium">Tiada rekod pengguna untuk saringan ini.</td></tr>
                            )}
                        </tbody>
                    </table>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MOCK_ROLES.map((role) => (
                        <Card key={role.id} className="flex flex-col h-full hover:border-slate-300 hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="font-extrabold text-slate-900 text-xl">{role.name}</h3>
                                <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400 border border-slate-100">
                                    {role.id === 'superadmin' ? <ShieldCheck className="w-5 h-5 text-indigo-600" /> : <Lock className="w-5 h-5" />}
                                </div>
                            </div>
                            <div className="mb-6">
                                <p className="text-[10px] text-slate-400 uppercase font-extrabold tracking-widest mb-2">Skop Akses</p>
                                <span className={`px-3 py-1 text-xs font-bold rounded-md border ${role.color}`}>
                                    {role.scope}
                                </span>
                            </div>
                            <div className="flex-1 bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                <p className="text-sm text-slate-700 font-semibold leading-relaxed">
                                    {role.access}
                                </p>
                            </div>
                            <button onClick={() => setViewRoleUsers(role.id)} className="mt-6 w-full py-3 text-sm text-slate-900 font-bold hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors">
                                Lihat Pengguna
                            </button>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

const AuditTrailPage = ({ currentUser, showToastNotification }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedAction, setSelectedAction] = useState('ALL');
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [auditLogs, setAuditLogs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 20;

    const fetchAuditLogs = async () => {
        try {
            const res = await fetch('http://localhost/My-PMO/api/modules/audit.php');
            const data = await res.json();
            if (data.status === 'success') {
                const mapped = data.data.map(l => ({
                    id: l.id,
                    timestamp: l.created_at,
                    user: l.user_name || 'Sistem',
                    role: l.user_role ? (l.user_role === 'superadmin' ? 'Superadmin' : l.user_role) : 'Sistem',
                    action: l.action,
                    module: l.module,
                    details: l.details,
                    ipAddress: l.ip_address || '127.0.0.1',
                    hostname: 'localhost',
                    status: 'SUCCESS'
                }));
                setAuditLogs(mapped);
            }
        } catch (err) {
            console.error("Ralat memuat turun log audit:", err);
        }
    };

    useEffect(() => {
        fetchAuditLogs();
    }, []);

    // Reset pagination to page 1 whenever filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedAction, startDate, endDate]);

    if (currentUser?.roleId !== 'superadmin' && currentUser?.roleId !== 'admin_agency') {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-6">
                    <ShieldAlert className="w-12 h-12 text-rose-500" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Akses Ditolak</h2>
                <p className="text-slate-500 max-w-md text-center">Maaf, peranan anda (<span className="font-bold">{currentUser?.role}</span>) tidak mempunyai kebenaran untuk melihat Jejak Audit Sistem. Hanya Superadmin dan Admin Agensi dibenarkan.</p>
            </div>
        );
    }

    const getActionConfig = (action) => {
        switch (action) {
            case 'LOGIN': return { icon: LogIn, label: 'Log Masuk', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' };
            case 'LOGOUT': return { icon: LogOut, label: 'Log Keluar', color: 'text-slate-700', bg: 'bg-slate-100', border: 'border-slate-200' };
            case 'CREATE': return { icon: Plus, label: 'Cipta', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' };
            case 'READ': return { icon: Eye, label: 'Lihat', color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200' };
            case 'UPDATE': return { icon: Edit, label: 'Kemas Kini', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' };
            case 'DELETE': return { icon: Trash2, label: 'Padam', color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' };
            default: return { icon: Terminal, label: action || 'Aktiviti', color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-200' };
        }
    };

    const filteredLogs = auditLogs.filter(log => {
        if (selectedAction !== 'ALL' && log.action !== selectedAction) {
            return false;
        }
        if (startDate || endDate) {
            const logDate = new Date(log.timestamp.replace(' ', 'T'));
            const start = startDate ? new Date(startDate) : new Date('2000-01-01T00:00');
            const end = endDate ? new Date(endDate) : new Date('2100-01-01T23:59');
            if (logDate < start || logDate > end) return false;
        }
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchUser = log.user ? log.user.toLowerCase().includes(query) : false;
            const matchIp = log.ipAddress ? log.ipAddress.toLowerCase().includes(query) : false;
            const matchModule = log.module ? log.module.toLowerCase().includes(query) : false;
            const matchDetails = log.details ? log.details.toLowerCase().includes(query) : false;
            return matchUser || matchIp || matchModule || matchDetails;
        }
        return true;
    });

    const isFiltered = searchQuery !== '' || selectedAction !== 'ALL' || startDate !== '' || endDate !== '';

    const handleResetFilters = () => {
        setSearchQuery('');
        setSelectedAction('ALL');
        setStartDate('');
        setEndDate('');
        setCurrentPage(1);
    };

    // Pagination calculations
    const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE) || 1;
    const paginatedLogs = filteredLogs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const startRecord = filteredLogs.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endRecord = Math.min(currentPage * ITEMS_PER_PAGE, filteredLogs.length);

    const escapeCsv = (str) => {
        if (str === null || str === undefined) return '""';
        const stringified = String(str).replace(/"/g, '""');
        return `"${stringified}"`;
    };

    const handleExport = (format) => {
        setShowExportMenu(false);
        if (filteredLogs.length === 0) {
            if (showToastNotification) {
                showToastNotification('Tiada rekod log audit untuk dieksport.');
            } else {
                alert('Tiada rekod log audit untuk dieksport.');
            }
            return;
        }

        if (format === 'Excel (.csv)') {
            const headers = ["Masa & Tarikh", "Pengguna", "Peranan", "Tindakan", "Modul", "Butiran Aktiviti", "IP Address", "Hostname", "Status"].join(",");
            const rows = filteredLogs.map(l => [
                escapeCsv(l.timestamp),
                escapeCsv(l.user),
                escapeCsv(l.role),
                escapeCsv(l.action),
                escapeCsv(l.module),
                escapeCsv(l.details),
                escapeCsv(l.ipAddress),
                escapeCsv(l.hostname),
                escapeCsv(l.status)
            ].join(",")).join("\n");

            // Include UTF-8 BOM so Excel opens Malay characters cleanly
            const csvContent = "\uFEFF" + headers + "\n" + rows;
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            const dateStr = new Date().toISOString().slice(0, 10);
            link.setAttribute("download", `AuditLog_PMO_${dateStr}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            if (showToastNotification) {
                showToastNotification(`Fail CSV Jejak Audit (${filteredLogs.length} rekod) berjaya dimuat turun!`);
            }
        } else if (format === 'PDF') {
            if (showToastNotification) {
                showToastNotification('Membuka paparan cetakan / PDF Jejak Audit...');
            }
            setTimeout(() => {
                window.print();
            }, 300);
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-300 printable-area">
            {/* Top Breadcrumb & Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        <span>Pentadbiran Sistem</span>
                        <span>/</span>
                        <span className="text-indigo-600">Keselamatan & Pematuhan</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
                        <FileText className="w-7 h-7 text-indigo-700" />
                        Jejak Audit Sistem
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Pemantauan log keselamatan, aktiviti pengguna (CRUD), sesi log masuk, dan maklumat peranti capaian.
                    </p>
                </div>

                {/* Top Action Buttons (Export & Refresh) */}
                <div className="flex items-center gap-3 no-print relative">
                    <button
                        type="button"
                        onClick={fetchAuditLogs}
                        className="px-3.5 py-2 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-medium text-xs shadow-sm flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                        title="Muat Semula Rekod Log"
                    >
                        <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
                        <span>Muat Semula</span>
                    </button>

                    {/* Export Dropdown in Header */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium text-xs shadow-sm flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                        >
                            <Download className="w-3.5 h-3.5" />
                            <span>Eksport Log</span>
                            <ChevronDown className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${showExportMenu ? 'rotate-180' : ''}`} />
                        </button>

                        {showExportMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowExportMenu(false)}
                                ></div>
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                                    <button
                                        type="button"
                                        onClick={() => handleExport('Excel (.csv)')}
                                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer border-b border-slate-100"
                                    >
                                        <span className="flex items-center justify-center w-6 h-6 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px]">CSV</span>
                                        <div>
                                            <div className="text-slate-900">Format Excel (.CSV)</div>
                                            <div className="text-[10px] text-slate-400 font-normal">Sesuai untuk analisis spreadsheet</div>
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleExport('PDF')}
                                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                                    >
                                        <span className="flex items-center justify-center w-6 h-6 rounded-md bg-rose-50 text-rose-700 font-bold text-[10px]">PDF</span>
                                        <div>
                                            <div className="text-slate-900">Dokumen PDF / Cetak</div>
                                            <div className="text-[10px] text-slate-400 font-normal">Paparan laporan sedia dicetak</div>
                                        </div>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Filter Toolbar Card */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm no-print">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 flex-1">
                        {/* 1. Carian Pantas */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Carian Pantas
                            </label>
                            <div className="relative">
                                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Pengguna, modul, IP, butiran..."
                                    className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        {/* 2. Pilihan Tindakan (Action Filter Dropdown) */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Pilihan Tindakan
                            </label>
                            <div className="relative">
                                <Filter className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <select
                                    value={selectedAction}
                                    onChange={e => setSelectedAction(e.target.value)}
                                    className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all cursor-pointer appearance-none"
                                >
                                    <option value="ALL">Semua Tindakan (Keseluruhan)</option>
                                    <option value="CREATE">CREATE (Cipta Rekod Baharu)</option>
                                    <option value="UPDATE">UPDATE (Kemas Kini Maklumat)</option>
                                    <option value="DELETE">DELETE (Padam Rekod)</option>
                                    <option value="LOGIN">LOGIN (Log Masuk Pengguna)</option>
                                    <option value="LOGOUT">LOGOUT (Log Keluar)</option>
                                    <option value="READ">READ (Lihat / Akses Data)</option>
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>

                        {/* 3. Tarikh Mula */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Tarikh Mula
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={e => setStartDate(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* 4. Tarikh Akhir */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Tarikh Akhir
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={e => setEndDate(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Reset Button */}
                    {isFiltered && (
                        <div className="flex items-end">
                            <button
                                type="button"
                                onClick={handleResetFilters}
                                className="px-3.5 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                                title="Padam semua tapisan"
                            >
                                <RefreshCw className="w-3 h-3" />
                                <span>Set Semula Penapis</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Summary Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 no-print">
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Jumlah Rekod Ditapis</span>
                        <div className="text-2xl font-bold text-slate-900 font-mono mt-0.5">{filteredLogs.length}</div>
                        <span className="text-[11px] text-slate-400">daripada {auditLogs.length} keseluruhan log</span>
                    </div>
                    <div className="p-3 bg-indigo-50 text-indigo-700 rounded-xl">
                        <Terminal className="w-5 h-5" />
                    </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Cubaan Log Masuk Gagal</span>
                        <div className="text-2xl font-bold text-slate-900 font-mono mt-0.5">{filteredLogs.filter(l => l.status === 'FAILED').length}</div>
                        <span className="text-[11px] text-rose-600 font-medium">Amaran keselamatan</span>
                    </div>
                    <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                        <ShieldAlert className="w-5 h-5" />
                    </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Aktiviti Sensitif (Kemas Kini / Padam)</span>
                        <div className="text-2xl font-bold text-slate-900 font-mono mt-0.5">{filteredLogs.filter(l => l.action === 'DELETE' || l.action === 'UPDATE').length}</div>
                        <span className="text-[11px] text-amber-600 font-medium">Perubahan data kritikal</span>
                    </div>
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Audit Logs Table Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden print:shadow-none print:border-0">
                <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-slate-50/50 flex items-center justify-between no-print">
                    <div className="flex items-center gap-2">
                        <Server className="w-4 h-4 text-slate-500" />
                        <h3 className="text-sm font-bold text-slate-900">Rekod Log Aktiviti Pelayan</h3>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">
                        {filteredLogs.length > 0 ? `Paparan ${startRecord}-${endRecord} daripada ${filteredLogs.length} rekod` : '0 rekod'}
                    </span>
                </div>

                {/* Desktop & Tablet Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                <th className="px-5 py-3">Masa & Tarikh</th>
                                <th className="px-5 py-3">Pengguna & Peranan</th>
                                <th className="px-5 py-3">Tindakan</th>
                                <th className="px-5 py-3">Butiran Aktiviti</th>
                                <th className="px-5 py-3">Peranti / IP</th>
                                <th className="px-5 py-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs text-slate-700 bg-white">
                            {paginatedLogs.length > 0 ? paginatedLogs.map((log) => {
                                const actionCfg = getActionConfig(log.action);
                                const ActionIcon = actionCfg.icon;
                                return (
                                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors print:border-b">
                                        <td className="px-5 py-3.5 whitespace-nowrap">
                                            <div className="font-mono font-bold text-slate-900 text-xs">{log.timestamp.split(' ')[1]}</div>
                                            <div className="text-slate-400 text-[11px] font-mono mt-0.5">{log.timestamp.split(' ')[0]}</div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="font-semibold text-slate-900 text-xs">{log.user}</div>
                                            <div className="text-slate-400 text-[11px] mt-0.5">{log.role}</div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded border ${actionCfg.bg} ${actionCfg.color} ${actionCfg.border}`}>
                                                <ActionIcon className="w-3 h-3 mr-1" /> {log.action}
                                            </div>
                                            <div className="text-slate-400 text-[10px] mt-1">Modul: <span className="text-slate-700 font-medium">{log.module}</span></div>
                                        </td>
                                        <td className="px-5 py-3.5 max-w-md">
                                            <p className="text-slate-700 font-medium text-xs leading-relaxed" title={log.details}>{log.details}</p>
                                            <p className="text-slate-400 text-[10px] mt-0.5 font-mono">ID: #{log.id}</p>
                                        </td>
                                        <td className="px-5 py-3.5 whitespace-nowrap">
                                            <div className="flex items-center text-slate-700 font-mono text-[11px]">
                                                <Globe className="w-3 h-3 mr-1 text-slate-400" /> {log.ipAddress}
                                            </div>
                                            <div className="flex items-center text-slate-400 text-[10px] mt-0.5">
                                                <Monitor className="w-3 h-3 mr-1 text-slate-400" /> {log.hostname}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 text-center whitespace-nowrap">
                                            {log.status === 'SUCCESS' ? (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Berjaya</span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">Gagal</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                        <p className="text-slate-600 font-semibold">Tiada rekod log audit ditemui</p>
                                        <p className="text-slate-400 text-xs mt-1">
                                            {isFiltered ? 'Sila ubah carian atau tekan "Set Semula Penapis".' : 'Belum ada rekod log aktiviti yang dicatatkan dalam sistem.'}
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards View */}
                <div className="md:hidden divide-y divide-slate-100 bg-white">
                    {paginatedLogs.length > 0 ? paginatedLogs.map((log) => {
                        const actionCfg = getActionConfig(log.action);
                        const ActionIcon = actionCfg.icon;
                        return (
                            <div key={log.id} className="p-4 space-y-2.5">
                                <div className="flex justify-between items-center">
                                    <div className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded border ${actionCfg.bg} ${actionCfg.color} ${actionCfg.border}`}>
                                        <ActionIcon className="w-3 h-3 mr-1" /> {log.action}
                                    </div>
                                    <span className="text-[11px] font-mono text-slate-400">{log.timestamp}</span>
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-900 text-xs">{log.user} <span className="text-[11px] font-normal text-slate-400">({log.role})</span></div>
                                    <div className="text-slate-700 text-xs font-medium mt-1 leading-relaxed">{log.details}</div>
                                </div>
                                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-50">
                                    <span className="font-medium text-indigo-600">Modul: {log.module}</span>
                                    <span className="font-mono text-slate-400">{log.ipAddress}</span>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="p-8 text-center text-slate-400 text-xs">
                            Tiada rekod log audit ditemui.
                        </div>
                    )}
                </div>

                {/* Footer & Pagination Navigation */}
                <div className="p-4 bg-slate-50/70 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
                    <div>
                        Menunjukkan <span className="font-semibold text-slate-800">{startRecord}</span> - <span className="font-semibold text-slate-800">{endRecord}</span> daripada <span className="font-semibold text-slate-800">{filteredLogs.length}</span> rekod {totalPages > 1 && `(Halaman ${currentPage} / ${totalPages})`}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center gap-1.5 self-center sm:self-auto">
                            <button
                                type="button"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-1 cursor-pointer shadow-xs"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                                <span>Sebelum</span>
                            </button>

                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(page => {
                                        if (totalPages <= 5) return true;
                                        return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                                    })
                                    .map((page, idx, arr) => {
                                        const prev = arr[idx - 1];
                                        return (
                                            <React.Fragment key={page}>
                                                {prev && page - prev > 1 && (
                                                    <span className="px-1 text-slate-400">...</span>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${currentPage === page ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'}`}
                                                >
                                                    {page}
                                                </button>
                                            </React.Fragment>
                                        );
                                    })}
                            </div>

                            <button
                                type="button"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-1 cursor-pointer shadow-xs"
                            >
                                <span>Seterusnya</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const SettingsPage = ({ showToastNotification }) => {
    const [divisions, setDivisions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedDivision, setSelectedDivision] = useState(null);

    const [formCode, setFormCode] = useState('');
    const [formName, setFormName] = useState('');
    const [formDesc, setFormDesc] = useState('');

    // Unit states
    const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);
    const [isEditUnitModalOpen, setIsEditUnitModalOpen] = useState(false);
    const [targetDivisionId, setTargetDivisionId] = useState(null);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [unitCode, setUnitCode] = useState('');
    const [unitName, setUnitName] = useState('');
    const [unitDesc, setUnitDesc] = useState('');

    const fetchDivisions = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost/My-PMO/api/modules/divisions.php');
            const data = await res.json();
            if (data.status === 'success') {
                setDivisions(data.data || []);
            }
        } catch (err) {
            console.error('Ralat mengambil data bahagian:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDivisions();
    }, []);

    const handleCreateDivision = async (e) => {
        e.preventDefault();
        if (!formCode || !formName) return;

        try {
            const res = await fetch('http://localhost/My-PMO/api/modules/divisions.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: formCode, name: formName, description: formDesc })
            });
            const data = await res.json();
            if (data.status === 'success') {
                if (showToastNotification) showToastNotification('Bahagian baharu berjaya ditambah!');
                setIsAddModalOpen(false);
                setFormCode('');
                setFormName('');
                setFormDesc('');
                fetchDivisions();
            }
        } catch (err) {
            alert('Gagal menambah bahagian.');
        }
    };

    const handleUpdateDivision = async (e) => {
        e.preventDefault();
        if (!selectedDivision || !formCode || !formName) return;

        try {
            const res = await fetch(`http://localhost/My-PMO/api/modules/divisions.php?id=${selectedDivision.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: formCode, name: formName, description: formDesc })
            });
            const data = await res.json();
            if (data.status === 'success') {
                if (showToastNotification) showToastNotification('Maklumat bahagian berjaya dikemas kini!');
                setIsEditModalOpen(false);
                setSelectedDivision(null);
                fetchDivisions();
            }
        } catch (err) {
            alert('Gagal mengemas kini bahagian.');
        }
    };

    const handleDeleteDivision = async (id, name) => {
        if (!window.confirm(`Adakah anda pasti mahu memadam bahagian "${name}"?`)) return;

        try {
            const res = await fetch(`http://localhost/My-PMO/api/modules/divisions.php?id=${id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.status === 'success') {
                if (showToastNotification) showToastNotification('Bahagian berjaya dipadam.');
                fetchDivisions();
            }
        } catch (err) {
            alert('Gagal memadam bahagian.');
        }
    };

    // Unit Actions
    const handleCreateUnit = async (e) => {
        e.preventDefault();
        if (!targetDivisionId || !unitName) return;

        try {
            const res = await fetch('http://localhost/My-PMO/api/modules/units.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ division_id: targetDivisionId, code: unitCode, name: unitName, description: unitDesc })
            });
            const data = await res.json();
            if (data.status === 'success') {
                if (showToastNotification) showToastNotification('Unit baharu berjaya ditambah!');
                setIsAddUnitModalOpen(false);
                setUnitCode('');
                setUnitName('');
                setUnitDesc('');
                fetchDivisions();
            }
        } catch (err) {
            alert('Gagal menambah unit.');
        }
    };

    const handleUpdateUnit = async (e) => {
        e.preventDefault();
        if (!selectedUnit || !unitName) return;

        try {
            const res = await fetch(`http://localhost/My-PMO/api/modules/units.php?id=${selectedUnit.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ division_id: targetDivisionId, code: unitCode, name: unitName, description: unitDesc })
            });
            const data = await res.json();
            if (data.status === 'success') {
                if (showToastNotification) showToastNotification('Maklumat unit berjaya dikemas kini!');
                setIsEditUnitModalOpen(false);
                setSelectedUnit(null);
                fetchDivisions();
            }
        } catch (err) {
            alert('Gagal mengemas kini unit.');
        }
    };

    const handleDeleteUnit = async (id, name) => {
        if (!window.confirm(`Adakah anda pasti mahu memadam unit "${name}"?`)) return;

        try {
            const res = await fetch(`http://localhost/My-PMO/api/modules/units.php?id=${id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.status === 'success') {
                if (showToastNotification) showToastNotification('Unit berjaya dipadam.');
                fetchDivisions();
            }
        } catch (err) {
            alert('Gagal memadam unit.');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tetapan Sistem</h1>
                    <p className="text-slate-500 text-sm mt-1">Urus senarai bahagian dan Unit di PKPMP.</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 flex items-center">
                            <Folder className="w-5 h-5 mr-2 text-indigo-600" />
                            Pengurusan Bahagian & Unit PKPMP
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">Senarai Bahagian rasmi dan Unit-unit di bawah pentadbiran PKPMP.</p>
                    </div>
                    <button
                        onClick={() => {
                            setFormCode('');
                            setFormName('');
                            setFormDesc('');
                            setIsAddModalOpen(true);
                        }}
                        className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center shrink-0 cursor-pointer"
                    >
                        <Plus className="w-4 h-4 mr-1.5" /> Tambah Bahagian
                    </button>
                </div>

                <div className="mt-6 space-y-4">
                    {divisions.length > 0 ? (
                        divisions.map((div) => (
                            <div key={div.id} className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-md hover:border-indigo-200 transition-all">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-xs font-black px-3 py-1 rounded-lg bg-indigo-600 text-white shadow-sm">
                                            {div.code}
                                        </span>
                                        <div>
                                            <h3 className="text-sm font-extrabold text-slate-900">{div.name}</h3>
                                            {div.description && <p className="text-xs text-slate-500 mt-0.5">{div.description}</p>}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => {
                                                setTargetDivisionId(div.id);
                                                setUnitCode('');
                                                setUnitName('');
                                                setUnitDesc('');
                                                setIsAddUnitModalOpen(true);
                                            }}
                                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold transition-colors flex items-center cursor-pointer border border-emerald-200/60"
                                        >
                                            <Plus className="w-3.5 h-3.5 mr-1" /> Tambah Unit
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedDivision(div);
                                                setFormCode(div.code);
                                                setFormName(div.name);
                                                setFormDesc(div.description || '');
                                                setIsEditModalOpen(true);
                                            }}
                                            className="p-1.5 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors cursor-pointer border border-slate-200/60 bg-white"
                                            title="Edit Bahagian"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteDivision(div.id, div.name)}
                                            className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors cursor-pointer border border-slate-200/60 bg-white"
                                            title="Padam Bahagian"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Senarai Unit di Bawah Bahagian */}
                                <div className="mt-3">
                                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2 flex items-center">
                                        <span>Unit di bawah {div.code} ({div.units ? div.units.length : 0})</span>
                                    </div>

                                    {div.units && div.units.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                            {div.units.map((unit) => (
                                                <div key={unit.id} className="p-2.5 rounded-xl bg-white border border-slate-200/70 flex items-center justify-between group hover:border-indigo-300 transition-all">
                                                    <div className="truncate pr-2">
                                                        <div className="flex items-center space-x-1.5">
                                                            {unit.code && (
                                                                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                                                                    {unit.code}
                                                                </span>
                                                            )}
                                                            <span className="text-xs font-bold text-slate-800 truncate" title={unit.name}>
                                                                {unit.name}
                                                            </span>
                                                        </div>
                                                        {unit.description && <p className="text-[10px] text-slate-400 truncate mt-0.5">{unit.description}</p>}
                                                    </div>
                                                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedUnit(unit);
                                                                setTargetDivisionId(div.id);
                                                                setUnitCode(unit.code || '');
                                                                setUnitName(unit.name);
                                                                setUnitDesc(unit.description || '');
                                                                setIsEditUnitModalOpen(true);
                                                            }}
                                                            className="p-1 text-slate-400 hover:text-indigo-600 rounded cursor-pointer"
                                                        >
                                                            <Edit className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUnit(unit.id, unit.name)}
                                                            className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-slate-400 italic">Tiada unit berdaftar di bawah bahagian ini.</p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-12 text-center text-slate-400 italic">
                            {isLoading ? 'Memuatkan data bahagian & unit...' : 'Tiada bahagian berdaftar.'}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Tambah Bahagian */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Tambah Bahagian Baharu</h3>
                        <form onSubmit={handleCreateDivision} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Kod Bahagian (e.g. BKS)</label>
                                <input
                                    type="text"
                                    required
                                    value={formCode}
                                    onChange={(e) => setFormCode(e.target.value)}
                                    placeholder="cth: BKS"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Penuh Bahagian</label>
                                <input
                                    type="text"
                                    required
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    placeholder="cth: Bahagian Khidmat Pengurusan (BKS)"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Penerangan / Skop (Pilihan)</label>
                                <textarea
                                    rows="3"
                                    value={formDesc}
                                    onChange={(e) => setFormDesc(e.target.value)}
                                    placeholder="Penerangan ringkas mengenai bahagian..."
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
                                ></textarea>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-md cursor-pointer"
                                >
                                    Simpan Bahagian
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Edit Bahagian */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Kemaskini Nama Bahagian</h3>
                        <form onSubmit={handleUpdateDivision} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Kod Bahagian</label>
                                <input
                                    type="text"
                                    required
                                    value={formCode}
                                    onChange={(e) => setFormCode(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Penuh Bahagian</label>
                                <input
                                    type="text"
                                    required
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Penerangan / Skop</label>
                                <textarea
                                    rows="3"
                                    value={formDesc}
                                    onChange={(e) => setFormDesc(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
                                ></textarea>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-md cursor-pointer"
                                >
                                    Kemas Kini
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Tambah Unit */}
            {isAddUnitModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Tambah Unit Baharu</h3>
                        <form onSubmit={handleCreateUnit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Bahagian Induk</label>
                                <select
                                    value={targetDivisionId || ''}
                                    onChange={(e) => setTargetDivisionId(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-500 bg-white"
                                >
                                    {divisions.map(d => (
                                        <option key={d.id} value={d.id}>[{d.code}] {d.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Kod Unit (Pilihan, cth: UPS)</label>
                                <input
                                    type="text"
                                    value={unitCode}
                                    onChange={(e) => setUnitCode(e.target.value)}
                                    placeholder="cth: UPS"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Unit</label>
                                <input
                                    type="text"
                                    required
                                    value={unitName}
                                    onChange={(e) => setUnitName(e.target.value)}
                                    placeholder="cth: Unit Pembangunan Sistem"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Penerangan / Skop Unit</label>
                                <textarea
                                    rows="3"
                                    value={unitDesc}
                                    onChange={(e) => setUnitDesc(e.target.value)}
                                    placeholder="Skop tugas unit ringkas..."
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
                                ></textarea>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsAddUnitModalOpen(false)}
                                    className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 shadow-md cursor-pointer"
                                >
                                    Simpan Unit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Edit Unit */}
            {isEditUnitModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Kemaskini Unit</h3>
                        <form onSubmit={handleUpdateUnit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Bahagian Induk</label>
                                <select
                                    value={targetDivisionId || ''}
                                    onChange={(e) => setTargetDivisionId(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-500 bg-white"
                                >
                                    {divisions.map(d => (
                                        <option key={d.id} value={d.id}>[{d.code}] {d.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Kod Unit</label>
                                <input
                                    type="text"
                                    value={unitCode}
                                    onChange={(e) => setUnitCode(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Unit</label>
                                <input
                                    type="text"
                                    required
                                    value={unitName}
                                    onChange={(e) => setUnitName(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Penerangan / Skop Unit</label>
                                <textarea
                                    rows="3"
                                    value={unitDesc}
                                    onChange={(e) => setUnitDesc(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
                                ></textarea>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsEditUnitModalOpen(false)}
                                    className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-md cursor-pointer"
                                >
                                    Kemas Kini Unit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const BackupPage = ({ showToastNotification, currentUser }) => {
    const [backups, setBackups] = useState([]);
    const [settings, setSettings] = useState({ frequency: 'off', scope: 'both', last_backup_at: null });
    const [stats, setStats] = useState({ db_size: 0, uploads_size: 0, total_backups: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [isCreatingBackup, setIsCreatingBackup] = useState(false);
    const [isSavingSettings, setIsSavingSettings] = useState(false);
    const [selectedFrequency, setSelectedFrequency] = useState('off');
    const [selectedScope, setSelectedScope] = useState('both');
    const [instantScope, setInstantScope] = useState('both');
    const [backupToDelete, setBackupToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all'); // 'all', 'manual', 'auto'
    const [copiedFile, setCopiedFile] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 20;

    const fetchBackupData = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost/My-PMO/api/modules/backup.php?action=list_backups');
            const data = await res.json();
            if (data.status === 'success') {
                setBackups(data.data.logs || []);
                if (data.data.settings) {
                    setSettings(data.data.settings);
                    setSelectedFrequency(data.data.settings.frequency || 'off');
                    setSelectedScope(data.data.settings.scope || 'both');
                }
                if (data.data.stats) {
                    setStats(data.data.stats);
                }
            }
        } catch (err) {
            console.error("Failed to load backup data:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBackupData();
    }, []);

    // Reset pagination to page 1 whenever filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterType]);

    const handleCreateBackup = async () => {
        setIsCreatingBackup(true);
        try {
            const res = await fetch('http://localhost/My-PMO/api/modules/backup.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'create_backup',
                    created_by: currentUser?.name || 'Pentadbir Sistem',
                    scope: instantScope
                })
            });
            const data = await res.json();
            if (data.status === 'success') {
                if (showToastNotification) {
                    showToastNotification('Salinan sandaran sistem berjaya dijana dan disimpan!');
                }
                fetchBackupData();
            } else {
                alert(data.message || 'Gagal menghasilkan sandaran sistem.');
            }
        } catch (err) {
            alert('Ralat semasa menyambung ke pelayan sandaran.');
        } finally {
            setIsCreatingBackup(false);
        }
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        setIsSavingSettings(true);
        try {
            const res = await fetch('http://localhost/My-PMO/api/modules/backup.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'update_settings',
                    frequency: selectedFrequency,
                    scope: selectedScope
                })
            });
            const data = await res.json();
            if (data.status === 'success') {
                if (showToastNotification) {
                    showToastNotification('Konfigurasi jadual sandaran berjaya dikemaskini!');
                }
                fetchBackupData();
            } else {
                alert(data.message || 'Gagal menyimpan konfigurasi jadual.');
            }
        } catch (err) {
            alert('Ralat semasa menghubungi pelayan.');
        } finally {
            setIsSavingSettings(false);
        }
    };

    const handleDeleteBackup = async () => {
        if (!backupToDelete) return;
        try {
            const res = await fetch('http://localhost/My-PMO/api/modules/backup.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: backupToDelete.id })
            });
            const data = await res.json();
            if (data.status === 'success') {
                if (showToastNotification) {
                    showToastNotification(`Fail sandaran ${backupToDelete.filename} berjaya dipadam.`);
                }
                setBackupToDelete(null);
                fetchBackupData();
            } else {
                alert(data.message || 'Gagal memadam fail sandaran.');
            }
        } catch (err) {
            alert('Ralat semasa memadam fail.');
        }
    };

    const formatBytes = (bytes) => {
        if (!bytes || bytes === 0) return '0.00 KB';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFrequencyText = (freq) => {
        switch (freq) {
            case 'daily': return 'Setiap Hari (00:00 AM)';
            case 'weekly': return 'Setiap Ahad (Mingguan)';
            case 'monthly': return 'Awal Bulan (1hb)';
            case 'yearly': return 'Setiap Tahun (1 Jan)';
            default: return 'Dimatikan (Manual Sahaja)';
        }
    };

    const handleCopyFilename = (filename) => {
        navigator.clipboard.writeText(filename);
        setCopiedFile(filename);
        setTimeout(() => setCopiedFile(null), 2000);
    };

    // Filter & search logic
    const filteredBackups = backups.filter(b => {
        const matchesSearch = searchTerm === '' ||
            (b.filename && b.filename.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (b.created_by && b.created_by.toLowerCase().includes(searchTerm.toLowerCase()));
        
        if (!matchesSearch) return false;
        if (filterType === 'manual') return b.type === 'manual';
        if (filterType === 'auto') return b.type === 'auto';
        return true;
    });

    // Pagination calculations
    const totalPages = Math.ceil(filteredBackups.length / ITEMS_PER_PAGE) || 1;
    const paginatedBackups = filteredBackups.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const startRecord = filteredBackups.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endRecord = Math.min(currentPage * ITEMS_PER_PAGE, filteredBackups.length);

    const totalBackupsSize = backups.reduce((acc, curr) => acc + (parseInt(curr.filesize) || 0), 0);
    const manualCount = backups.filter(b => b.type === 'manual').length;
    const autoCount = backups.filter(b => b.type === 'auto').length;

    // Proportional storage breakdown (Pangkalan Data + Fail Dokumen + Arkib Sandaran)
    const dbBytes = parseInt(stats.db_size) || 0;
    const uploadBytes = parseInt(stats.uploads_size) || 0;
    const backupBytes = totalBackupsSize || parseInt(stats.backups_size) || 0;
    const totalStorageBytes = dbBytes + uploadBytes + backupBytes || 1;

    // Proportions
    const dbPercentage = Math.round((dbBytes / totalStorageBytes) * 100);
    const uploadPercentage = Math.round((uploadBytes / totalStorageBytes) * 100);
    const backupPercentage = Math.max(0, 100 - dbPercentage - uploadPercentage);

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
            {/* Modal Confirmation Delete */}
            {backupToDelete && (
                <div className="fixed inset-0 z-[70] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setBackupToDelete(null)}></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 border border-slate-200 animate-in zoom-in-95 duration-150">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 shrink-0">
                                    <AlertTriangle className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-slate-900">Pengesahan Pemadaman Arkib</h3>
                                    <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                                        Adakah anda pasti mahu memadamkan arkib sandaran fizikal ini secara kekal dari pelayan?
                                    </p>
                                    
                                    <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5 font-mono text-slate-700">
                                        <div className="flex justify-between">
                                            <span className="text-slate-400 font-sans">Nama Fail:</span>
                                            <span className="font-bold text-slate-900 break-all">{backupToDelete.filename}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400 font-sans">Saiz:</span>
                                            <span>{formatBytes(backupToDelete.filesize)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400 font-sans">Tarikh Cipta:</span>
                                            <span>{backupToDelete.created_at}</span>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setBackupToDelete(null)}
                                            className="px-4 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 text-sm transition-colors cursor-pointer"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleDeleteBackup}
                                            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
                                        >
                                            <Trash2 className="w-4 h-4" /> Padam Arkib Kekal
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Breadcrumb & Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        <span>Pentadbiran Sistem</span>
                        <span>/</span>
                        <span className="text-indigo-600">Sandaran & Pemulihan</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
                        <Database className="w-7 h-7 text-indigo-700" />
                        Pusat Pengurusan Sandaran Sistem
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Kawalan sandaran pangkalan data MySQL, repositori dokumen lampiran, dan konfigurasi automasi pemulihan.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Pelayan Pangkalan Data Aktif
                    </div>
                    <button
                        onClick={fetchBackupData}
                        disabled={isLoading}
                        className="px-3.5 py-2 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-medium text-xs shadow-sm flex items-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                        title="Muat Semula Status Semasa"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${isLoading ? 'animate-spin' : ''}`} />
                        <span>Muat Semula Data</span>
                    </button>
                </div>
            </div>

            {/* Storage & System Health Metrics */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                            <HardDrive className="w-4 h-4 text-slate-600" />
                            Ringkasan Storan & Kapasiti Sistem
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Status pecahan penggunaan storan pangkalan data, fail lampiran fizikal, dan arkib sandaran sedia ada.
                        </p>
                    </div>
                    <div className="text-right">
                        <span className="text-xs text-slate-400 font-medium">Jumlah Penggunaan Storan:</span>
                        <div className="text-base font-bold text-slate-900 font-mono">
                            {formatBytes(totalStorageBytes)}
                        </div>
                    </div>
                </div>

                {/* Storage Segment Bar (Pangkalan Data + Lampiran + Arkib ZIP) */}
                <div className="w-full bg-slate-100 rounded-lg h-3 overflow-hidden flex mb-4">
                    <div
                        style={{ width: `${dbPercentage}%` }}
                        className="bg-indigo-600 h-full transition-all duration-500"
                        title={`Pangkalan Data: ${formatBytes(dbBytes)} (${dbPercentage}%)`}
                    ></div>
                    <div
                        style={{ width: `${uploadPercentage}%` }}
                        className="bg-emerald-500 h-full transition-all duration-500"
                        title={`Fail Dokumen: ${formatBytes(uploadBytes)} (${uploadPercentage}%)`}
                    ></div>
                    <div
                        style={{ width: `${backupPercentage}%` }}
                        className="bg-amber-500 h-full transition-all duration-500"
                        title={`Arkib Sandaran: ${formatBytes(backupBytes)} (${backupPercentage}%)`}
                    ></div>
                </div>

                {/* Metric Summary Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                                <span className="w-2.5 h-2.5 rounded bg-indigo-600"></span>
                                Pangkalan Data (SQL)
                            </div>
                            <div className="text-lg font-bold text-slate-900 font-mono mt-1">
                                {formatBytes(stats.db_size)}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">Skema: my_pmo_db</div>
                        </div>
                        <Database className="w-5 h-5 text-indigo-500 mt-0.5" />
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                                <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
                                Repositori Fail Lampiran
                            </div>
                            <div className="text-lg font-bold text-slate-900 font-mono mt-1">
                                {formatBytes(stats.uploads_size)}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">Direktori: api/uploads/</div>
                        </div>
                        <Folder className="w-5 h-5 text-emerald-500 mt-0.5" />
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                                <span className="w-2.5 h-2.5 rounded bg-amber-500"></span>
                                Jumlah Arkib Sandaran
                            </div>
                            <div className="text-lg font-bold text-slate-900 font-mono mt-1">
                                {stats.total_backups || backups.length} <span className="text-xs font-normal text-slate-500 font-sans">Fail ZIP</span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">Saiz Arkib: {formatBytes(totalBackupsSize)}</div>
                        </div>
                        <Archive className="w-5 h-5 text-amber-500 mt-0.5" />
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                                <span className="w-2.5 h-2.5 rounded bg-purple-500"></span>
                                Jadual Automatik
                            </div>
                            <div className="text-xs font-bold text-slate-900 mt-1.5 truncate max-w-[140px]" title={getFrequencyText(settings.frequency)}>
                                {settings.frequency === 'off' ? 'Tidak Aktif' : getFrequencyText(settings.frequency)}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[140px]">
                                {settings.last_backup_at ? `Terkini: ${settings.last_backup_at.split(' ')[0]}` : 'Belum dijalankan'}
                            </div>
                        </div>
                        <Clock className="w-5 h-5 text-purple-500 mt-0.5" />
                    </div>
                </div>
            </div>

            {/* Operational Dual Control: Instant Action & Schedule Setup */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* On-Demand Backup Panel */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Cipta Salinan Sandaran Baharu</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Jana arkib fizikal sandaran data dan dokumen serta-merta</p>
                            </div>
                            <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg">
                                Tindakan Segera
                            </span>
                        </div>

                        <div className="mt-4 space-y-3.5">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Skop Kandungan Salinan
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <label className={`flex items-start p-3 rounded-xl border cursor-pointer transition-all text-xs ${instantScope === 'both' ? 'border-indigo-500 bg-indigo-50/40 text-indigo-950 font-semibold ring-1 ring-indigo-500' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}>
                                        <input
                                            type="radio"
                                            name="instantScope"
                                            value="both"
                                            checked={instantScope === 'both'}
                                            onChange={() => setInstantScope('both')}
                                            className="mt-0.5 mr-2 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <div>
                                            <div>Lengkap (DB + Dokumen)</div>
                                            <div className="text-[11px] text-slate-500 font-normal mt-0.5">Termasuk struktur SQL & semua fail muat naik</div>
                                        </div>
                                    </label>
                                    <label className={`flex items-start p-3 rounded-xl border cursor-pointer transition-all text-xs ${instantScope === 'db' ? 'border-indigo-500 bg-indigo-50/40 text-indigo-950 font-semibold ring-1 ring-indigo-500' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}>
                                        <input
                                            type="radio"
                                            name="instantScope"
                                            value="db"
                                            checked={instantScope === 'db'}
                                            onChange={() => setInstantScope('db')}
                                            className="mt-0.5 mr-2 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <div>
                                            <div>Pangkalan Data Sahaja</div>
                                            <div className="text-[11px] text-slate-500 font-normal mt-0.5">Eksport skema jadual dan rekod SQL sahaja</div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Pegawai Pelaksana:</span>
                                    <span className="font-semibold text-slate-800">{currentUser?.name || 'Pentadbir Sistem'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Format Arkib:</span>
                                    <span className="font-mono text-slate-800">.ZIP (database_backup.sql + manifest.json)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Sandaran Terakhir:</span>
                                    <span className="text-slate-700">{settings.last_backup_at || 'Belum pernah disandar'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end">
                        <button
                            type="button"
                            onClick={handleCreateBackup}
                            disabled={isCreatingBackup}
                            className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
                        >
                            {isCreatingBackup ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" /> Sedang Menjana Fail Sandaran...
                                </>
                            ) : (
                                <>
                                    <UploadCloud className="w-4 h-4" /> Mulakan Proses Sandaran Sekarang
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Automated Backup Settings Panel */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Konfigurasi Sandaran Berjadual</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Penetapan frekuensi automatik penyelenggaraan pangkalan data</p>
                            </div>
                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${selectedFrequency !== 'off' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
                                {selectedFrequency !== 'off' ? 'Jadual Aktif' : 'Manual Sahaja'}
                            </span>
                        </div>

                        <form id="scheduleForm" onSubmit={handleSaveSettings} className="mt-4 space-y-3.5">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Kekerapan Pelaksanaan
                                </label>
                                <select
                                    value={selectedFrequency}
                                    onChange={(e) => setSelectedFrequency(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 cursor-pointer"
                                >
                                    <option value="off">Nyahaktifkan (Manual Sahaja)</option>
                                    <option value="daily">Setiap Hari (Daily - 00:00 AM)</option>
                                    <option value="weekly">Setiap Minggu (Weekly - Setiap Ahad)</option>
                                    <option value="monthly">Setiap Bulan (Monthly - Hari Pertama)</option>
                                    <option value="yearly">Setiap Tahun (Yearly - 1 Januari)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Skop Kandungan Berjadual
                                </label>
                                <select
                                    value={selectedScope}
                                    onChange={(e) => setSelectedScope(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 cursor-pointer"
                                >
                                    <option value="both">Lengkap: Pangkalan Data (SQL) + Dokumen Lampiran (ZIP)</option>
                                    <option value="db">Pangkalan Data Sahaja (SQL)</option>
                                </select>
                            </div>

                            <p className="text-[11px] text-slate-400 leading-relaxed">
                                * Sandaran automatik akan dijalankan secara di latar belakang apabila sistem menerima trafik operasi pertama pada selang masa yang ditetapkan.
                            </p>
                        </form>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end">
                        <button
                            type="submit"
                            form="scheduleForm"
                            disabled={isSavingSettings}
                            className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
                        >
                            {isSavingSettings ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" /> Menyimpan Tetapan...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" /> Simpan Konfigurasi Jadual
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Archive Registry & Backup History Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                {/* Table Header Controls */}
                <div className="p-5 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                    <div>
                        <h3 className="text-base font-bold text-slate-900">Arkib & Log Fail Sandaran</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Senarai rekod arkib fizikal yang disimpan di direktori storan pelayan</p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        {/* Search Input */}
                        <div className="relative">
                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Cari fail atau pencipta..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 w-full sm:w-56"
                            />
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex items-center bg-slate-200/70 p-1 rounded-xl text-xs font-medium">
                            <button
                                onClick={() => setFilterType('all')}
                                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${filterType === 'all' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
                            >
                                Semua ({backups.length})
                            </button>
                            <button
                                onClick={() => setFilterType('manual')}
                                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${filterType === 'manual' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
                            >
                                Manual ({manualCount})
                            </button>
                            <button
                                onClick={() => setFilterType('auto')}
                                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${filterType === 'auto' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
                            >
                                Automatik ({autoCount})
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table Data */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                <th className="px-5 py-3">Nama Fail Arkib</th>
                                <th className="px-5 py-3">Saiz Fail</th>
                                <th className="px-5 py-3">Kategori</th>
                                <th className="px-5 py-3">Pegawai / Pencipta</th>
                                <th className="px-5 py-3">Tarikh & Masa</th>
                                <th className="px-5 py-3 text-right">Tindakan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-slate-400">
                                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-600" />
                                        <span>Memuatkan senarai arkib sandaran...</span>
                                    </td>
                                </tr>
                            ) : filteredBackups.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center">
                                        <FileArchive className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                        <p className="text-slate-600 font-semibold">Tiada fail arkib sandaran ditemui</p>
                                        <p className="text-slate-400 text-xs mt-1">
                                            {searchTerm ? 'Cuba kata kunci carian yang lain.' : 'Tekan butang "Mulakan Proses Sandaran Sekarang" untuk mencipta fail sandaran pertama.'}
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                paginatedBackups.map((b) => (
                                    <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-2">
                                                <FileArchive className="w-4 h-4 text-indigo-600 shrink-0" />
                                                <span className="font-mono font-medium text-slate-900 select-all" title={b.filename}>
                                                    {b.filename}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleCopyFilename(b.filename)}
                                                    className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                                                    title={copiedFile === b.filename ? "Disalin!" : "Salin nama fail"}
                                                >
                                                    {copiedFile === b.filename ? (
                                                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                                                    ) : (
                                                        <Copy className="w-3.5 h-3.5" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 font-mono text-slate-800 font-medium">
                                            {formatBytes(b.filesize)}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${b.type === 'auto' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'}`}>
                                                {b.frequency_label || (b.type === 'auto' ? 'Automatik' : 'Manual')}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-slate-600 font-medium">
                                            {b.created_by || 'Pentadbir Sistem'}
                                        </td>
                                        <td className="px-5 py-3.5 text-slate-500 font-mono text-[11px]">
                                            {b.created_at}
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <a
                                                    href={`http://localhost/My-PMO/api/modules/backup.php?action=download&file=${encodeURIComponent(b.filename)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                                    title="Muat Turun Fail ZIP Sandaran"
                                                >
                                                    <Download className="w-3.5 h-3.5" />
                                                    <span>Muat Turun</span>
                                                </a>
                                                <button
                                                    type="button"
                                                    onClick={() => setBackupToDelete(b)}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                                    title="Padam Fail Arkib Ini"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    <span>Padam</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer notes & Pagination */}
                <div className="p-4 bg-slate-50/70 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        Menunjukkan <span className="font-semibold text-slate-800">{startRecord}</span> - <span className="font-semibold text-slate-800">{endRecord}</span> daripada <span className="font-semibold text-slate-800">{filteredBackups.length}</span> fail arkib {totalPages > 1 && `(Halaman ${currentPage} / ${totalPages})`}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center gap-1.5 self-center sm:self-auto">
                            <button
                                type="button"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-1 cursor-pointer shadow-xs"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                                <span>Sebelum</span>
                            </button>

                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(page => {
                                        if (totalPages <= 5) return true;
                                        return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                                    })
                                    .map((page, idx, arr) => {
                                        const prev = arr[idx - 1];
                                        return (
                                            <React.Fragment key={page}>
                                                {prev && page - prev > 1 && (
                                                    <span className="px-1 text-slate-400">...</span>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${currentPage === page ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'}`}
                                                >
                                                    {page}
                                                </button>
                                            </React.Fragment>
                                        );
                                    })}
                            </div>

                            <button
                                type="button"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-1 cursor-pointer shadow-xs"
                            >
                                <span>Seterusnya</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}

                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Arkib disimpan secara selamat dalam direktori pelayan terlindung.</span>
                    </div>
                </div>
            </div>

            {/* Disaster Recovery Guide Box */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-slate-800">
                <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-slate-800 rounded-xl text-indigo-400 shrink-0 mt-0.5">
                        <Terminal className="w-5 h-5" />
                    </div>
                    <div className="space-y-1.5">
                        <h4 className="text-sm font-bold text-white tracking-wide">
                            Panduan Pemulihan Bencana (Disaster Recovery SOP)
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            Setiap fail arkib <span className="text-indigo-300 font-mono">.ZIP</span> mengandungi fail <span className="text-indigo-300 font-mono">database_backup.sql</span> dan folder <span className="text-indigo-300 font-mono">documents/</span>. Untuk memulihkan semula data sekiranya berlaku kecemasan, ekstrak fail SQL dan laksanakan arahan import MySQL melalui konsol atau phpMyAdmin.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(() => {
        const saved = localStorage.getItem('mypmo_user');
        return saved ? JSON.parse(saved) : MOCK_USER;
    });
    const [authView, setAuthView] = useState('landing');
    const [currentView, setCurrentView] = useState('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [projectsList, setProjectsList] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [dashboardFilter, setDashboardFilter] = useState('Semua');

    const fetchProjects = async () => {
        try {
            const res = await fetch('http://localhost/My-PMO/api/modules/projects.php');
            const data = await res.json();
            if (data.status === 'success') {
                const mappedData = data.data.map(p => ({
                    ...p,
                    id: p.id,
                    projectCode: p.project_code,
                    dueDate: p.end_date,
                    budget: Number(p.budget),
                    progress: Number(p.progress)
                }));
                setProjectsList(mappedData);
            }
        } catch (err) {
            console.error("Error fetching projects:", err);
        }
    };

    const [showNotif, setShowNotif] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const [notifications, setNotifications] = useState([]);
    const unreadCount = notifications.filter(n => n.unread).length;
    const [language, setLanguage] = useState('ms');

    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [settingsTab, setSettingsTab] = useState('profile');
    const [pseudoTheme, setPseudoTheme] = useState('light');
    const [toastMsg, setToastMsg] = useState('');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const fetchNotifications = async () => {
        try {
            const res = await fetch('http://localhost/My-PMO/api/modules/notifications.php');
            const data = await res.json();
            if (data.status === 'success' && Array.isArray(data.data)) {
                setNotifications(data.data);
            } else {
                setNotifications(MOCK_NOTIFICATIONS);
            }
        } catch (err) {
            setNotifications(MOCK_NOTIFICATIONS);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchProjects();
            fetchNotifications();
        }
    }, [isAuthenticated]);

    const showToastNotification = (msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(''), 3000);
    };

    const markAllRead = () => setNotifications(notifications.map(n => ({ ...n, unread: false })));
    const markAsRead = (id) => setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));

    const handleLoginSuccess = (user) => {
        const userObj = user || MOCK_USER;
        const rId = userObj.roleId || userObj.role || 'pmo_gov';
        const matchedRole = MOCK_ROLES.find(r => r.id === rId);
        const roleName = matchedRole ? matchedRole.name : (userObj.role || 'Pegawai PMO');

        const updatedUser = {
            ...userObj,
            roleId: rId,
            role: roleName
        };
        setCurrentUser(updatedUser);
        localStorage.setItem('mypmo_user', JSON.stringify(updatedUser));
        setIsAuthenticated(true);
    };

    if (!isAuthenticated) {
        if (authView === 'landing') return <LandingPage onNavigateToLogin={() => setAuthView('login')} />;
        return <LoginPage onLogin={handleLoginSuccess} onBack={() => setAuthView('landing')} />;
    }

    const isVendorPmo = currentUser?.roleId === 'pmo_vendor';
    const isGovPmo = currentUser?.roleId === 'pmo_gov';
    const isAdmin = currentUser?.roleId === 'superadmin' || currentUser?.roleId === 'admin_agency';

    const visibleProjectsList = projectsList.filter(p => {
        if (isAdmin) return true;

        const uname = (currentUser?.name || '').trim().toLowerCase();
        const uagency = (currentUser?.agency || '').trim().toLowerCase();
        const udivision = (currentUser?.division || currentUser?.agency || '').trim().toLowerCase();

        const vm = (p.vendor_manager || p.pmoVendor || '').trim().toLowerCase();
        const mgr = (p.manager || '').trim().toLowerCase();
        const v = (p.vendor || '').trim().toLowerCase();
        const div = (p.division || p.agency || '').trim().toLowerCase();

        if (isVendorPmo) {
            const matchName = uname && (vm.includes(uname) || uname.includes(vm) || mgr.includes(uname) || uname.includes(mgr));
            const matchAgency = uagency && v && (v.includes(uagency) || uagency.includes(v));
            return Boolean(matchName || matchAgency);
        }

        if (isGovPmo) {
            const matchName = uname && (mgr.includes(uname) || uname.includes(mgr) || vm.includes(uname) || uname.includes(vm));
            const matchDivision = udivision && div && (div.includes(udivision) || udivision.includes(div));
            return Boolean(matchName || matchDivision);
        }

        return true;
    });

    const NAVIGATION = [
        { id: 'dashboard', label: 'Papan Pemuka', icon: LayoutDashboard },
        { id: 'projects', label: 'Projek', icon: Briefcase },
        { id: 'calendar', label: 'Kalendar', icon: CalendarIcon },
        ...(!isVendorPmo ? [{ id: 'reports', label: 'Analitik Laporan', icon: BarChart2 }] : []),
        ...(isAdmin ? [
            { id: 'users', label: 'Pasukan & Peranan', icon: Users },
            { id: 'audit', label: 'Jejak Audit', icon: FileText },
            { id: 'backup', label: 'Sandaran Sistem', icon: Database },
            { id: 'settings', label: 'Tetapan', icon: Settings },
        ] : [])
    ];

    const handleSelectProject = (project) => {
        setSelectedProject(project);
        setCurrentView('project_detail');
    };

    const renderView = () => {
        if (!isAdmin && ['users', 'audit', 'backup', 'settings'].includes(currentView)) {
            return (
                <DashboardPage
                    setView={setCurrentView}
                    onSelectFilter={(filter) => {
                        setDashboardFilter(filter);
                        setCurrentView('projects');
                    }}
                    showToastNotification={showToastNotification}
                    projects={visibleProjectsList}
                    currentUser={currentUser}
                />
            );
        }

        if (isVendorPmo && currentView === 'reports') {
            return (
                <DashboardPage
                    setView={setCurrentView}
                    onSelectFilter={(filter) => {
                        setDashboardFilter(filter);
                        setCurrentView('projects');
                    }}
                    showToastNotification={showToastNotification}
                    projects={visibleProjectsList}
                    currentUser={currentUser}
                />
            );
        }

        switch (currentView) {
            case 'dashboard':
                return (
                    <DashboardPage
                        setView={setCurrentView}
                        onSelectFilter={(filter) => {
                            setDashboardFilter(filter);
                            setCurrentView('projects');
                        }}
                        showToastNotification={showToastNotification}
                        projects={visibleProjectsList}
                        currentUser={currentUser}
                    />
                );
            case 'projects':
                return (
                    <ProjectListPage
                        setView={setCurrentView}
                        projects={visibleProjectsList}
                        setProjects={setProjectsList}
                        onSelectProject={handleSelectProject}
                        refreshProjects={fetchProjects}
                        initialFilter={dashboardFilter}
                        showToastNotification={showToastNotification}
                        currentUser={currentUser}
                    />
                );
            case 'project_detail':
                const activeProject = selectedProject && visibleProjectsList.some(p => p.id === selectedProject.id)
                    ? selectedProject
                    : (visibleProjectsList[0] || selectedProject);
                return (
                    <ProjectDetailPage
                        setView={setCurrentView}
                        project={activeProject}
                        showToastNotification={showToastNotification}
                        currentUser={currentUser}
                        notifications={notifications}
                        setNotifications={setNotifications}
                    />
                );
            case 'calendar': return <CalendarPage />;
            case 'reports': return <ReportsPage projects={visibleProjectsList} />;
            case 'users': return <UsersPage />;
            case 'audit': return <AuditTrailPage currentUser={currentUser} showToastNotification={showToastNotification} />;
            case 'backup': return <BackupPage showToastNotification={showToastNotification} currentUser={currentUser} />;
            case 'settings': return <SettingsPage showToastNotification={showToastNotification} />;
            default: return <DashboardPage setView={setCurrentView} showToastNotification={showToastNotification} projects={visibleProjectsList} />;
        }
    };

    const handleNavigation = (id) => {
        setCurrentView(id);
        setIsMobileMenuOpen(false);
    };

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newName = formData.get('name') || currentUser?.name || 'Datuk Dr. Azman';
        const newEmail = formData.get('email') || currentUser?.email || 'admin@kehakiman.gov.my';

        const words = newName.trim().split(/\s+/);
        let avatarInitials = 'PM';
        if (words.length >= 2) {
            avatarInitials = (words[0][0] + words[words.length - 1][0]).toUpperCase();
        } else if (words.length === 1 && words[0].length >= 2) {
            avatarInitials = words[0].substring(0, 2).toUpperCase();
        }

        const updatedUser = {
            ...currentUser,
            name: newName,
            email: newEmail,
            avatar: avatarInitials
        };

        setCurrentUser(updatedUser);
        localStorage.setItem('mypmo_user', JSON.stringify(updatedUser));
        setIsSettingsModalOpen(false);
        showToastNotification('Profil pengguna berjaya dikemas kini!');
    };



    return (
        <div className="flex h-screen font-sans overflow-hidden selection:bg-indigo-100 selection:text-indigo-900 relative bg-[#F8F9FB] text-slate-900">

            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 lg:hidden transition-opacity" onClick={() => setIsMobileMenuOpen(false)}></div>
            )}

            <aside className={`fixed inset-y-0 left-0 bg-white border-r border-slate-100 flex flex-col h-full z-40 transform transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 shadow-[4px_0_24px_rgba(0,0,0,0.01)] ${isSidebarCollapsed ? 'w-20' : 'w-[280px]'} ${isMobileMenuOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full'}`}>
                <div className="h-20 lg:h-24 flex items-center justify-between px-5 shrink-0 border-b border-slate-50">
                    <div className="flex items-center overflow-hidden">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shrink-0">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <span className={`ml-3.5 text-xl font-extrabold tracking-tight text-slate-900 transition-all duration-300 ${isSidebarCollapsed ? 'lg:hidden' : ''}`}>MY-PMO</span>
                    </div>
                    <button
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        title={isSidebarCollapsed ? "Kembangkan Menu Utama" : "Kuncupkan Menu Utama"}
                        className="hidden lg:flex p-2 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95 shrink-0 bg-slate-100 hover:bg-slate-200 text-slate-600"
                    >
                        <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 no-scrollbar">
                    <p className={`px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 mt-2 transition-all duration-200 ${isSidebarCollapsed ? 'lg:hidden' : ''}`}>Menu Utama</p>
                    {NAVIGATION.map(item => {
                        const isActive = currentView === item.id || (currentView === 'project_detail' && item.id === 'projects');
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavigation(item.id)}
                                title={item.label}
                                className={`w-full flex items-center ${isSidebarCollapsed ? 'lg:justify-center lg:px-0' : 'px-4'} py-3.5 rounded-2xl transition-all duration-200 group ${isActive ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                            >
                                <item.icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'}`} />
                                <span className={`ml-4 font-bold text-sm tracking-wide transition-all duration-200 ${isSidebarCollapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
                            </button>
                        )
                    })}
                </div>

                <div className="p-4 shrink-0">
                    <div className="bg-slate-50 border-slate-100 rounded-3xl p-3 border transition-colors">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-extrabold text-sm shadow-sm shrink-0">
                                {currentUser?.avatar || 'DA'}
                            </div>
                            <div className={`flex-1 min-w-0 transition-all duration-200 ${isSidebarCollapsed ? 'lg:hidden' : ''}`}>
                                <p className="text-sm font-bold truncate text-slate-900">{currentUser?.name || 'Datuk Dr. Azman'}</p>
                                <p className="text-xs font-semibold truncate text-slate-500">{MOCK_ROLES.find(r => r.id === currentUser?.roleId)?.name || currentUser?.role || 'PMO Vendor'}</p>
                            </div>
                        </div>
                        <button onClick={() => { setIsAuthenticated(false); setAuthView('landing'); }} className="w-full flex items-center justify-center px-3 py-2.5 border transition-colors rounded-xl font-bold text-sm shadow-sm active:scale-[0.98] bg-white border-slate-200 text-slate-700 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50">
                            <LogOut className="w-4 h-4 shrink-0" />
                            <span className={`ml-2 font-bold text-xs ${isSidebarCollapsed ? 'lg:hidden' : ''}`}>Log Keluar</span>
                        </button>
                    </div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                <header className="h-20 lg:h-24 flex items-center justify-between px-4 lg:px-8 z-30 shrink-0 backdrop-blur-md transition-colors bg-[#F8F9FB]/80">
                    <div className="flex items-center space-x-3">
                        <button className="p-2.5 border rounded-xl lg:hidden shadow-sm transition-colors bg-white border-slate-200 text-slate-600 hover:text-slate-900" onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                            className="hidden lg:flex p-2.5 border rounded-xl shadow-sm transition-all active:scale-95 items-center space-x-2 bg-white border-slate-200 text-slate-600 hover:text-slate-900"
                            title={isSidebarCollapsed ? "Kembangkan Menu Utama" : "Kuncupkan Menu Utama"}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="relative">
                            <button onClick={() => { setShowNotif(!showNotif); setShowSettings(false); }} className="w-10 h-10 flex items-center justify-center border rounded-full transition-all shadow-sm relative focus:ring-2 focus:ring-indigo-100 bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50">
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse"></span>}
                            </button>
                            {showNotif && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowNotif(false)} />
                                    <div className="absolute right-0 mt-3 w-80 rounded-2xl shadow-xl border overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 bg-white border-slate-100 text-slate-900">
                                        <div className="p-4 border-b flex justify-between items-center border-slate-100 bg-slate-50">
                                            <span className="font-extrabold">Pusat Notifikasi</span>
                                            {unreadCount > 0 && (
                                                <span onClick={markAllRead} className="text-xs text-indigo-500 font-bold cursor-pointer hover:underline">Tanda Dibaca Semua</span>
                                            )}
                                        </div>
                                        <div className="max-h-80 overflow-y-auto">
                                            {notifications.length > 0 ? notifications.map(n => (
                                                <div key={n.id} onClick={() => markAsRead(n.id)} className={`p-4 border-b cursor-pointer transition-colors border-slate-50 hover:bg-slate-50 ${n.unread ? 'bg-indigo-500/10 border-l-4 border-l-indigo-500' : 'border-l-4 border-l-transparent'}`}>
                                                    <div className="flex justify-between items-start">
                                                        <p className="text-sm font-bold text-slate-800">{n.title}</p>
                                                        {n.unread && <span className="w-2 h-2 bg-indigo-500 rounded-full mt-1.5"></span>}
                                                    </div>
                                                    <p className="text-xs font-semibold mt-1.5 leading-relaxed text-slate-500">{n.message}</p>
                                                    <p className="text-[10px] text-slate-400 mt-2 font-extrabold tracking-widest uppercase">{n.time}</p>
                                                </div>
                                            )) : (
                                                <div className="p-8 text-center text-slate-400 text-sm font-medium">Tiada notifikasi baharu.</div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="relative hidden sm:block">
                            <button onClick={() => { setShowSettings(!showSettings); setShowNotif(false); }} className="w-10 h-10 flex items-center justify-center border rounded-full transition-all shadow-sm focus:ring-2 focus:ring-indigo-100 bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50">
                                <Settings className="w-5 h-5" />
                            </button>
                            {showSettings && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowSettings(false)} />
                                    <div className="absolute right-0 mt-3 w-56 rounded-2xl shadow-xl border overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 bg-white border-slate-100 text-slate-900">
                                        <div className="p-2 space-y-1">
                                            <p className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bahasa / Language</p>
                                            <button onClick={() => setLanguage('ms')} className={`w-full text-left px-4 py-2.5 text-sm font-bold rounded-xl transition-colors flex justify-between items-center ${language === 'ms' ? 'text-indigo-500 bg-indigo-500/10' : 'text-slate-700 hover:bg-slate-50'}`}>
                                                <span>Bahasa Melayu</span> {language === 'ms' && <CheckCircle2 className="w-4 h-4 text-indigo-500" />}
                                            </button>
                                            <button onClick={() => setLanguage('en')} className={`w-full text-left px-4 py-2.5 text-sm font-bold rounded-xl transition-colors flex justify-between items-center ${language === 'en' ? 'text-indigo-500 bg-indigo-500/10' : 'text-slate-700 hover:bg-slate-50'}`}>
                                                <span>English</span> {language === 'en' && <CheckCircle2 className="w-4 h-4 text-indigo-500" />}
                                            </button>
                                            <div className="h-px w-full my-2 bg-slate-100"></div>
                                            <p className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Akaun</p>
                                            <button onClick={() => { setSettingsTab('profile'); setIsSettingsModalOpen(true); setShowSettings(false); }} className="w-full text-left px-4 py-2.5 text-sm font-bold rounded-xl transition-colors text-slate-700 hover:bg-slate-50">Profil Pengguna</button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                    </div>
                </header>

                {isSettingsModalOpen && (
                    <div className="fixed inset-0 z-[70] overflow-y-auto">
                        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsSettingsModalOpen(false)}></div>
                        <div className="flex min-h-full items-center justify-center p-4">
                            <div className="relative rounded-[32px] shadow-2xl w-full max-w-xl animate-in zoom-in-95 duration-200 bg-white text-slate-900">
                                <div className="p-8 border-b flex justify-between items-center rounded-t-[32px] bg-slate-50 border-slate-100">
                                    <h2 className="text-xl font-extrabold">Tetapan Sistem</h2>
                                    <button onClick={() => setIsSettingsModalOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center border transition-colors bg-white border-slate-200 text-slate-500 hover:text-rose-500">&times;</button>
                                </div>
                                <div className="flex border-b px-8 pt-4 border-slate-200">
                                    <button onClick={() => setSettingsTab('profile')} className="pb-4 text-sm font-bold border-b-2 transition-colors mr-8 border-indigo-600 text-indigo-600">Profil Pengguna</button>
                                </div>
                                <div className="p-8">
                                    {settingsTab === 'profile' && (
                                        <form onSubmit={handleUpdateProfile} className="space-y-5">
                                            <div className="flex items-center space-x-5 mb-6">
                                                <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-inner border-2 border-white">{currentUser?.avatar || 'DA'}</div>
                                                <div>
                                                    <button type="button" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl transition-colors shadow-md mb-2">Tukar Gambar</button>
                                                    <p className="text-xs text-slate-400 font-medium">Format JPG, PNG (Maks: 2MB)</p>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold mb-2 text-slate-700">Nama Penuh</label>
                                                <input name="name" type="text" defaultValue={currentUser?.name || 'Datuk Dr. Azman'} required className="w-full px-5 py-3.5 border rounded-2xl outline-none transition-all bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold mb-2 text-slate-700">E-mel Rasmi</label>
                                                <input name="email" type="email" defaultValue={currentUser?.email || 'admin@kehakiman.gov.my'} required className="w-full px-5 py-3.5 border rounded-2xl outline-none transition-all bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold mb-2 text-slate-700">Peranan Sistem (Read-only)</label>
                                                <input type="text" value={MOCK_ROLES.find(r => r.id === currentUser?.roleId)?.name || currentUser?.role || 'PMO Vendor'} disabled className="w-full px-5 py-3.5 border rounded-2xl outline-none cursor-not-allowed font-medium bg-slate-100 border-slate-200 text-slate-500" />
                                            </div>
                                            <div className="flex justify-end pt-4"><button type="submit" className="px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md active:scale-[0.98] transition-all cursor-pointer">Simpan Profil</button></div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {toastMsg && (
                    <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
                        <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                            <span className="font-bold text-sm">{toastMsg}</span>
                        </div>
                    </div>
                )}

                <main className="flex-1 overflow-y-auto px-4 lg:px-8 pt-2 pb-6 w-full flex flex-col justify-between" onClick={() => { setShowNotif(false); setShowSettings(false); }}>
                    <div className="max-w-7xl mx-auto w-full flex-1 pb-8">
                        {renderView()}
                    </div>

                    {/* Footer System Rasmi MY-PMO */}
                    <footer className="max-w-7xl mx-auto w-full border-t border-slate-200/80 pt-6 pb-4 mt-auto text-slate-500 text-xs">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center space-x-3 text-center sm:text-left">
                                <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                                    <Shield className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className="font-extrabold text-slate-900 text-xs sm:text-sm">
                                        MY-PMO
                                    </p>
                                    <p className="text-[11px] text-slate-400 font-medium">Sistem Pengurusan & Pemantauan Projek PKPMP</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
                            <p>© {new Date().getFullYear()} Hak Cipta Terpelihara - Pejabat Ketua Pendaftar Mahkamah Persekutuan Malaysia.</p>
                            <div className="flex items-center space-x-2">
                                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> Terperingkat & Selamat
                                </span>
                                <span className="font-mono text-[10px] text-slate-400">v2.4.0</span>
                            </div>
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    );
}