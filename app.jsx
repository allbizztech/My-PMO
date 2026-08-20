import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard, Briefcase, ListTodo, Calendar as CalendarIcon,
    Bell, BarChart2, Users, FileText, Settings, Search, Menu,
    LogOut, ChevronRight, MoreVertical, Plus, CheckCircle2,
    AlertCircle, Clock, Paperclip, MessageSquare, Shield,
    Filter, Download, ArrowUpRight, ArrowDownRight, Activity,
    ChevronLeft, Flag, PieChart, TrendingUp, DollarSign, Target, CalendarDays,
    UserPlus, ShieldCheck, Lock, ArrowLeft, ArrowRight,
    Terminal, Server, ShieldAlert, Key, RefreshCw, AlertTriangle, Monitor, Globe, Edit, Trash2, LogIn, Eye, ChevronDown, CheckCircle, UploadCloud, Folder, Receipt
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

// --- KOMPONEN BERSAMA (REUSABLE COMPONENTS) ---
const Card = ({ children, className = "", noPadding = false }) => (
    <div className={`bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden ${noPadding ? '' : 'p-6 lg:p-8'} ${className}`}>
        {children}
    </div>
);

const Badge = ({ text, type = 'default' }) => {
    const styles = {
        'Aktif': 'bg-indigo-50/80 text-indigo-700 border-indigo-100',
        'Tertunda': 'bg-amber-50/80 text-amber-700 border-amber-100',
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
        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${styles[text] || styles.default}`}>
            {text}
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
                            Platform integrasi merentas agensi yang direka khas untuk Pengurusan Projek Kerajaan. Jejak setiap data, bajet, dan kemajuan projek dengan ketelusan mutlak.
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
                            <h3 className="text-base font-bold text-white text-center mb-1">Ketelusan Mutlak</h3>
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

const LoginPage = ({ onLogin, onBack }) => (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans relative">
        <button onClick={onBack} className="absolute top-8 left-8 flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors z-20">
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
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
                <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">ID / E-mel</label>
                        <input type="text" defaultValue="admin@pmo.gov.my" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-slate-100 focus:border-slate-400 outline-none transition-all font-medium" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Kata Laluan</label>
                        <input type="password" defaultValue="password123" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-slate-100 focus:border-slate-400 outline-none transition-all font-medium" />
                    </div>
                    <div className="flex items-center justify-between text-sm pt-2">
                        <label className="flex items-center space-x-3 cursor-pointer group">
                            <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 transition-colors" />
                            <span className="text-slate-500 font-medium group-hover:text-slate-800 transition-colors">Ingat saya</span>
                        </label>
                        <a href="#" className="text-slate-800 font-bold hover:text-indigo-600 transition-colors">Lupa kata laluan?</a>
                    </div>
                    <button type="submit" className="w-full bg-slate-900 text-white font-bold text-lg py-4 rounded-2xl hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 transition-all active:scale-[0.98]">
                        Log Masuk Terjamin
                    </button>
                </form>
            </div>
        </div>
    </div>
);

const DashboardPage = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Papan Pemuka</h1>
                <p className="text-slate-500 mt-1 text-lg">Ringkasan analitik dan metrik prestasi PMO.</p>
            </div>
            <div className="flex items-center space-x-3">
                <button className="bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-50 flex items-center transition-colors shadow-sm">
                    <CalendarDays className="w-4 h-4 mr-2 text-slate-400" /> Suku Ke-2, 2026
                </button>
                <button onClick={() => window.print()} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-800 flex items-center transition-colors shadow-md shadow-slate-900/10">
                    <Download className="w-4 h-4 mr-2" /> Eksport PDF
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
                { title: 'Jumlah Projek', value: '142', icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+12%', isUp: true },
                { title: 'Projek Aktif', value: '86', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+5%', isUp: true },
                { title: 'Projek Tertunda', value: '14', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50', trend: '-2%', isUp: false },
                { title: 'Penggunaan Bajet', value: '68%', icon: BarChart2, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+8%', isUp: true },
            ].map((kpi, i) => (
                <Card key={i} className="group hover:border-slate-200 hover:shadow-md transition-all cursor-pointer">
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
                        <p className="text-sm font-semibold text-slate-500 mt-1.5">{kpi.title}</p>
                    </div>
                </Card>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Aliran Kesihatan Projek</h3>
                        <p className="text-sm text-slate-500 mt-1">Prestasi penyampaian sepanjang 12 minggu lepas.</p>
                    </div>
                    <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 border border-transparent hover:border-slate-200 transition-colors"><MoreVertical className="w-5 h-5" /></button>
                </div>
                <div className="h-64 flex items-end justify-between space-x-3 pb-2 mt-4">
                    {[40, 70, 45, 90, 65, 80, 55, 100, 75, 85, 60, 95].map((h, i) => (
                        <div key={i} className="w-full flex flex-col items-center group cursor-pointer h-full justify-end">
                            <div className="w-full bg-slate-50 rounded-lg h-full relative overflow-hidden group-hover:bg-slate-100 transition-colors">
                                <div
                                    className={`absolute bottom-0 w-full rounded-lg transition-all duration-700 ease-out ${h < 50 ? 'bg-amber-400' : 'bg-slate-800'}`}
                                    style={{ height: `${h}%` }}
                                ></div>
                            </div>
                            <span className="text-xs font-semibold text-slate-400 mt-3 group-hover:text-slate-800 transition-colors">M{i + 1}</span>
                        </div>
                    ))}
                </div>
            </Card>

            <Card className="flex flex-col items-center justify-center relative overflow-hidden">
                <div className="w-full flex justify-between items-start mb-6 z-10">
                    <h3 className="text-lg font-bold text-slate-900">Kadar Siap</h3>
                    <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="w-5 h-5" /></button>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center w-full z-10">
                    <DonutChart percentage={72} colorClass="text-indigo-600" label="Atas Landasan" />
                    <div className="w-full mt-10 space-y-4 px-2">
                        <div className="flex justify-between items-center text-sm"><span className="text-slate-600 font-medium flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-indigo-600 mr-3"></span> Selesai</span><span className="font-bold text-slate-900">45%</span></div>
                        <div className="flex justify-between items-center text-sm"><span className="text-slate-600 font-medium flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-slate-300 mr-3"></span> Sedang Berjalan</span><span className="font-bold text-slate-900">40%</span></div>
                        <div className="flex justify-between items-center text-sm"><span className="text-slate-600 font-medium flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-3"></span> Tertunda</span><span className="font-bold text-slate-900">15%</span></div>
                    </div>
                </div>
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-slate-50 rounded-full blur-3xl pointer-events-none"></div>
            </Card>
        </div>
    </div>
);

const ProjectListPage = ({ setView, projects, setProjects, onSelectProject }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [filterStatus, setFilterStatus] = useState('Semua');
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    const ITEMS_PER_PAGE = 5;

    const filteredProjects = filterStatus === 'Semua' ? projects : projects.filter(p => p.status === filterStatus);
    const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
    const currentProjects = filteredProjects.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const openNewModal = () => {
        setEditingProject(null);
        setIsModalOpen(true);
    };

    const openEditModal = (project) => {
        setEditingProject(project);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        const updatedList = projects.filter(p => p.id !== id);
        setProjects(updatedList);
        const newFiltered = filterStatus === 'Semua' ? updatedList : updatedList.filter(p => p.status === filterStatus);
        const newTotalPages = Math.ceil(newFiltered.length / ITEMS_PER_PAGE);
        if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
        }
    };

    const handleSubmitProject = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const progressVal = Number(formData.get('progress'));
        const healthStatus = progressVal === 100 ? 'Cemerlang' : progressVal > 50 ? 'Baik' : 'Amaran';
        const descriptionVal = formData.get('description');

        if (editingProject) {
            const updatedProjects = projects.map(p => {
                if (p.id === editingProject.id) {
                    return {
                        ...p,
                        name: formData.get('name'),
                        description: descriptionVal,
                        agency: formData.get('agency'),
                        status: formData.get('status'),
                        health: healthStatus,
                        progress: progressVal,
                        manager: formData.get('pmoGov'),
                        vendor: formData.get('pmoVendor'),
                        dueDate: formData.get('endDate')
                    };
                }
                return p;
            });
            setProjects(updatedProjects);
        } else {
            const newProject = {
                id: `PRJ-${Math.floor(Math.random() * 900) + 100}`,
                name: formData.get('name'),
                description: descriptionVal,
                agency: formData.get('agency'),
                status: formData.get('status'),
                health: healthStatus,
                budget: 0,
                progress: progressVal,
                manager: formData.get('pmoGov'),
                vendor: formData.get('pmoVendor'),
                dueDate: formData.get('endDate')
            };
            setProjects([newProject, ...projects]);
            setCurrentPage(1);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">

            {isModalOpen && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                        <div className="relative transform bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-3xl rounded-[32px] animate-in zoom-in-95 duration-200">
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-[32px]">
                                <div>
                                    <h2 className="text-2xl font-extrabold text-slate-900">{editingProject ? 'Kemas Kini Projek' : 'Daftar Projek Baharu'}</h2>
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
                                        <select name="division" defaultValue={editingProject?.division || 'Bahagian Teknologi Maklumat (BTM)'} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all font-medium text-slate-900">
                                            <option value="Bahagian Teknologi Maklumat (BTM)">Bahagian Teknologi Maklumat (BTM)</option>
                                            <option value="Bahagian Pengurusan Sumber Manusia & Pentadbiran (BPSM)">Bahagian Pengurusan Sumber Manusia & Pentadbiran (BPSM)</option>
                                            <option value="Bahagian Kewangan, Pembangunan & Perolehan (BKPP)">Bahagian Kewangan, Pembangunan & Perolehan (BKPP)</option>
                                            <option value="Bahagian Kehakiman & Syariah (BKS)">Bahagian Kehakiman & Syariah (BKS)</option>
                                            <option value="Bahagian Pendaftaran Mahkamah Persekutuan (BPMP)">Bahagian Pendaftaran Mahkamah Persekutuan (BPMP)</option>
                                            <option value="Bahagian Pendaftaran Mahkamah Rayuan (BPMR)">Bahagian Pendaftaran Mahkamah Rayuan (BPMR)</option>
                                            <option value="Bahagian Pendaftaran Mahkamah Tinggi Malaya (BPMTM)">Bahagian Pendaftaran Mahkamah Tinggi Malaya (BPMTM)</option>
                                            <option value="Bahagian Pendaftaran Mahkamah Tinggi Sabah & Sarawak (BPMTSS)">Bahagian Pendaftaran Mahkamah Tinggi Sabah & Sarawak (BPMTSS)</option>
                                            <option value="Bahagian Latihan & Pengurusan Penyelidikan (BPP)">Bahagian Latihan & Pengurusan Penyelidikan (BPP)</option>
                                            <option value="Bahagian Hal Ehwal Antarabangsa & Komunikasi Korporat (BKK)">Bahagian Hal Ehwal Antarabangsa & Komunikasi Korporat (BKK)</option>
                                            <option value="Bahagian Audit Dalaman (BAD)">Bahagian Audit Dalaman (BAD)</option>
                                            <option value="Pejabat Penasihat Undang-Undang Kehakiman (PUU)">Pejabat Penasihat Undang-Undang Kehakiman (PUU)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Status Projek</label>
                                        <select name="status" defaultValue={editingProject?.status || 'Aktif'} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all font-medium text-slate-900">
                                            <option value="Aktif">Aktif</option>
                                            <option value="Tertunda">Tertunda</option>
                                            <option value="Selesai">Selesai</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Kemajuan Semasa (%)</label>
                                        <input name="progress" defaultValue={editingProject?.progress || 0} required type="number" min="0" max="100" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all font-medium text-slate-900" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Pegawai PMO (Kerajaan)</label>
                                        <input name="pmoGov" defaultValue={editingProject?.manager || ''} required type="text" placeholder="Nama Pegawai Penyelaras" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all font-medium text-slate-900" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Pegawai PMO (Syarikat)</label>
                                        <input name="pmoVendor" defaultValue={editingProject?.vendor_manager || editingProject?.pmoVendor || ''} type="text" placeholder="Nama PMO Syarikat / Vendor" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all font-medium text-slate-900" />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Syarikat Vendor / Kontraktor</label>
                                        <input name="vendor" defaultValue={editingProject?.vendor || ''} required type="text" placeholder="Nama Syarikat Vendor/Kontraktor" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all font-medium text-slate-900" />
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

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Direktori Projek</h1>
                    <p className="text-slate-500 mt-1 text-lg">Pantau dan urus semua inisiatif projek.</p>
                </div>
                <div className="flex space-x-3">
                    <div className="relative hidden md:block">
                        <Search className="w-5 h-5 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Cari projek..." className="pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl font-medium focus:ring-4 focus:ring-slate-100 focus:border-slate-400 outline-none w-64 shadow-sm transition-all" />
                    </div>

                    <div className="relative">
                        <button onClick={() => setShowFilterMenu(!showFilterMenu)} className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 flex items-center shadow-sm transition-colors">
                            <Filter className="w-4 h-4 mr-2" /> Tapis {filterStatus !== 'Semua' && <span className="ml-2 bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[10px]">{filterStatus}</span>}
                        </button>
                        {showFilterMenu && (
                            <div className="absolute top-full mt-2 left-0 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 py-2 animate-in fade-in zoom-in-95">
                                <p className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status Projek</p>
                                {['Semua', 'Aktif', 'Tertunda', 'Selesai'].map(s => (
                                    <button key={s} onClick={() => { setFilterStatus(s); setShowFilterMenu(false); setCurrentPage(1); }} className={`w-full text-left px-4 py-2 text-sm font-semibold hover:bg-slate-50 ${filterStatus === s ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-700'}`}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button onClick={openNewModal} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-800 flex items-center shadow-md transition-all active:scale-[0.98]">
                        <Plus className="w-4 h-4 mr-2" /> Projek Baharu
                    </button>
                </div>
            </div>

            <Card noPadding className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-16">Bil.</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Projek</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Agensi</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Kemajuan</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Pengurus Projek</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-28">Tindakan</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/80">
                        {currentProjects.length > 0 ? currentProjects.map((prj, idx) => (
                            <tr key={prj.id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer" onClick={() => onSelectProject(prj)}>
                                <td className="px-6 py-5 text-center font-bold text-slate-400 text-sm">
                                    {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                                </td>
                                <td className="px-8 py-5">
                                    <div className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">{prj.name}</div>
                                    <div className="inline-block bg-slate-100 text-slate-500 text-[11px] font-semibold px-2 py-0.5 rounded-md mt-1 border border-slate-200">
                                        {prj.project_code || (String(prj.id).startsWith('PRJ-') ? prj.id : `PRJ-${String(prj.id).padStart(3, '0')}`)}
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-sm font-semibold text-slate-600">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                        {prj.agency || 'PKPMP'}
                                    </span>
                                </td>
                                <td className="px-8 py-5"><Badge text={prj.status} /></td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center space-x-4 w-40">
                                        <span className="font-bold text-slate-700 text-sm w-10">{prj.progress}%</span>
                                        <ProgressBar progress={prj.progress} colorClass={prj.progress > 75 ? "bg-emerald-500" : prj.progress < 50 ? "bg-amber-500" : "bg-indigo-500"} />
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-slate-600">
                                    <div className="flex items-center space-x-3 whitespace-nowrap">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs flex items-center justify-center font-bold shrink-0 shadow-sm">
                                            {prj.manager ? prj.manager.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '-'}
                                        </div>
                                        <span className="font-semibold text-sm text-slate-800">{prj.manager || 'Tiada'}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-center">
                                    <div className="flex items-center justify-center space-x-2 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            onClick={() => openEditModal(prj)}
                                            title="Kemas Kini"
                                            className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all text-slate-600 shadow-sm active:scale-95 flex items-center justify-center"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(prj.id)}
                                            title="Padam"
                                            className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all text-slate-600 shadow-sm active:scale-95 flex items-center justify-center"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
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

const ProjectDetailPage = ({ setView, project, showToastNotification }) => {
    const [activeTab, setActiveTab] = useState('Gambaran Keseluruhan');

    const [milestones, setMilestones] = useState([
        { id: 1, title: 'Fasa 1: Pengumpulan Keperluan', status: 'Selesai', target: 'Suku Ke-1 2026' },
        { id: 2, title: 'Fasa 2: Infrastruktur Teras', status: 'Selesai', target: 'Suku Ke-2 2026' },
        { id: 3, title: 'Fasa 3: Audit Keselamatan', status: 'Aktif', target: 'Suku Ke-3 2026' },
        { id: 4, title: 'Fasa 4: Pelancaran Beta', status: 'Tertunda', target: 'Suku Ke-4 2026' }
    ]);

    const [kanbanTasks, setKanbanTasks] = useState(TASKS.filter(t => t.project === project?.id));
    const [finances, setFinances] = useState(PROJECT_FINANCE);
    const [docs, setDocs] = useState(PROJECT_DOCS);

    const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
    const [editingMilestone, setEditingMilestone] = useState(null);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [isFinanceModalOpen, setIsFinanceModalOpen] = useState(false);
    const [editingFinance, setEditingFinance] = useState(null);
    const [isDocModalOpen, setIsDocModalOpen] = useState(false);

    if (!project) return null;

    const columns = [
        { id: 'pending', title: 'Akan Datang', color: 'bg-slate-100/50 border-slate-200' },
        { id: 'in_progress', title: 'Sedang Berjalan', color: 'bg-indigo-50/30 border-indigo-100' },
        { id: 'completed', title: 'Selesai', color: 'bg-emerald-50/30 border-emerald-100' }
    ];

    const handleDragStart = (e, taskId) => {
        e.dataTransfer.setData('taskId', taskId);
    };

    const handleDrop = (e, newStatus) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        setKanbanTasks(kanbanTasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
        showToastNotification?.(`Status tugasan ditukar kepada ${newStatus === 'completed' ? 'Selesai' : newStatus === 'in_progress' ? 'Sedang Berjalan' : 'Akan Datang'}`);
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

    const handleDeleteMilestone = (id) => setMilestones(milestones.filter(m => m.id !== id));

    const handleSaveTask = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        if (editingTask) {
            setKanbanTasks(kanbanTasks.map(t => t.id === editingTask.id ? {
                ...t,
                title: formData.get('title'),
                status: formData.get('status'),
                priority: formData.get('priority'),
                assignee: formData.get('assignee'),
                dueDate: formData.get('dueDate')
            } : t));
            showToastNotification?.('Tugasan berjaya dikemas kini.');
        } else {
            const newTask = {
                id: `T-${Date.now()}`,
                title: formData.get('title'),
                project: project.id,
                status: formData.get('status'),
                priority: formData.get('priority'),
                assignee: formData.get('assignee'),
                dueDate: formData.get('dueDate')
            };
            setKanbanTasks([...kanbanTasks, newTask]);
            showToastNotification?.('Tugasan baharu ditambah ke Kanban.');
        }
        setIsTaskModalOpen(false);
    };

    const handleSaveFinance = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newData = {
            id: formData.get('invId'),
            description: formData.get('description'),
            vendor: formData.get('vendor'),
            amount: formData.get('amount'),
            status: formData.get('status'),
            date: formData.get('date')
        };

        if (editingFinance) {
            setFinances(finances.map(f => f.id === editingFinance.id ? newData : f));
        } else {
            setFinances([newData, ...finances]);
        }
        setIsFinanceModalOpen(false);
    };

    const handleDeleteFinance = (id) => setFinances(finances.filter(f => f.id !== id));

    const handleUploadDoc = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newDoc = {
            id: `DOC-${Date.now()}`,
            name: formData.get('fileName') + '.pdf',
            category: formData.get('category'),
            uploader: MOCK_USER.name,
            date: new Date().toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' }),
            size: (Math.random() * 5 + 1).toFixed(1) + ' MB'
        };
        setDocs([newDoc, ...docs]);
        setIsDocModalOpen(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">

            {/* --- ALL POPUP MODALS --- */}
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
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Tarikh Siap (Due Date)</label>
                                        <input name="dueDate" defaultValue={editingTask?.dueDate || ''} required type="date" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Ditugaskan Kepada (Initial)</label>
                                        <input name="assignee" defaultValue={editingTask?.assignee || ''} required type="text" placeholder="Cth: AF" maxLength="3" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
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
                                        <input name="invId" defaultValue={editingFinance?.id || `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 900) + 100}`} required type="text" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-indigo-700" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Tarikh Tuntutan</label>
                                        <input name="date" defaultValue={editingFinance?.date || ''} required type="text" placeholder="DD MMMM YYYY" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
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

            {isDocModalOpen && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsDocModalOpen(false)}></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200">
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-[32px]">
                                <h2 className="text-xl font-extrabold text-slate-900">Muat Naik Dokumen Baru</h2>
                                <button onClick={() => setIsDocModalOpen(false)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200">&times;</button>
                            </div>
                            <form onSubmit={handleUploadDoc} className="p-8 space-y-5">
                                <div className="w-full h-32 border-2 border-dashed border-indigo-200 bg-indigo-50/50 rounded-2xl flex flex-col items-center justify-center text-slate-500 hover:bg-indigo-50 transition-colors cursor-pointer relative">
                                    <UploadCloud className="w-8 h-8 text-indigo-400 mb-2" />
                                    <span className="text-sm font-bold">Klik untuk memilih fail</span>
                                    <input type="file" required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
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
                                        <option value="Spesifikasi Sistem">Spesifikasi Sistem</option>
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

            {/* --- CONTENT PAGE --- */}

            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div>
                    <div className="flex items-center text-sm text-slate-500 space-x-2 mb-2">
                        <span className="hover:text-indigo-600 cursor-pointer font-bold transition-colors" onClick={() => setView('projects')}>Projek</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-slate-900 font-extrabold">{project.name}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{project.name}</h1>
                        <Badge text={project.status} />
                        <Badge text={project.health} type={project.health} />
                    </div>
                </div>
                <div className="flex space-x-3">
                    <button className="bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-50 transition-colors shadow-sm">Kemaskini</button>
                </div>
            </div>

            <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <Briefcase className="w-48 h-48 text-slate-900" />
                </div>
                <p className="text-slate-500 max-w-3xl text-lg leading-relaxed relative z-10 mb-8 whitespace-pre-wrap">
                    {project.description || `Tiada keterangan yang diberikan untuk projek ${project.name}. Sila kemas kini butiran projek untuk menambah penerangan rasmi.`}
                </p>

                <div className="grid grid-cols-2 xl:grid-cols-5 gap-6 relative z-10">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Agensi Peneraju</p>
                        <p className="font-extrabold text-slate-900 text-lg truncate" title={project.agency}>{project.agency}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Syarikat Vendor</p>
                        <p className="font-extrabold text-slate-900 text-lg truncate" title={project.vendor || 'Tidak Dinyatakan'}>{project.vendor || 'Tidak Dinyatakan'}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Pengurus Projek</p>
                        <p className="font-extrabold text-slate-900 text-lg flex items-center truncate" title={project.manager}>
                            <span className="w-6 h-6 rounded-full bg-slate-200 text-xs flex items-center justify-center mr-2 shrink-0">
                                {project.manager.split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </span>
                            <span className="truncate">{project.manager}</span>
                        </p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Garis Masa</p>
                        <p className="font-extrabold text-slate-900 text-lg">{project.dueDate || 'TBA'}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Kemajuan Semasa</p>
                        <p className="font-extrabold text-slate-900 text-lg">{project.progress}% Siap</p>
                    </div>
                </div>
            </Card>

            <div className="border-b border-slate-200 flex overflow-x-auto no-scrollbar gap-8">
                {['Gambaran Keseluruhan', 'Carta Gantt', 'Tugasan (Kanban)', 'Kewangan Projek', 'Dokumen (DMS)'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === tab ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="mt-8">
                {activeTab === 'Gambaran Keseluruhan' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
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
                                                    <button onClick={() => { setEditingMilestone(ms); setIsMilestoneModalOpen(true); }} className="p-1.5 bg-white border border-slate-200 rounded text-slate-500 hover:text-indigo-600 shadow-sm"><Edit className="w-3.5 h-3.5" /></button>
                                                    <button onClick={() => handleDeleteMilestone(ms.id)} className="p-1.5 bg-white border border-slate-200 rounded text-slate-500 hover:text-rose-600 shadow-sm"><Trash2 className="w-3.5 h-3.5" /></button>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center py-8 text-slate-400 font-medium">Tiada pencapaian direkodkan.</div>
                                    )}
                                </div>
                            </Card>
                        </div>
                        <div className="space-y-8">
                            <Card>
                                <h3 className="text-xl font-extrabold text-slate-900 mb-6">Profil Risiko</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-3 p-4 bg-rose-50 rounded-2xl border border-rose-100 text-rose-900">
                                        <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
                                        <div>
                                            <span className="font-bold block mb-1">Kelewatan Penghantaran Vendor</span>
                                            <span className="text-sm font-medium text-rose-700/80">Penghantaran pelayan tertunda 2 minggu disebabkan rantaian bekalan.</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3 p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-900">
                                        <Shield className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
                                        <div>
                                            <span className="font-bold block mb-1">Pematuhan Keselamatan</span>
                                            <span className="text-sm font-medium text-amber-700/80">Menunggu kelulusan akhir dari CyberSecurity Malaysia.</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                            <Card>
                                <h3 className="text-xl font-extrabold text-slate-900 mb-6">Ahli Pasukan</h3>
                                <div className="flex -space-x-3 overflow-hidden mb-6">
                                    {['AF', 'SL', 'NH', 'DR'].map((initials, i) => (
                                        <div key={i} className="inline-flex h-12 w-12 rounded-full ring-4 ring-white bg-slate-100 items-center justify-center font-extrabold text-slate-600 text-sm shadow-sm">
                                            {initials}
                                        </div>
                                    ))}
                                    <div className="inline-flex h-12 w-12 rounded-full ring-4 ring-white bg-slate-900 items-center justify-center font-extrabold text-white text-xs shadow-sm">
                                        +3
                                    </div>
                                </div>
                                <button className="w-full py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors text-sm font-bold">Urus Pasukan</button>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === 'Tugasan (Kanban)' && (
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
                            {columns.map(col => (
                                <div
                                    key={col.id}
                                    className="flex flex-col rounded-[24px] border border-slate-100 bg-white shadow-sm min-w-[300px] md:min-w-0 md:flex-1 shrink-0"
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, col.id)}
                                >
                                    <div className="p-5 flex justify-between items-center border-b border-slate-100 bg-slate-50/50 rounded-t-[24px]">
                                        <h3 className="font-extrabold text-slate-800">{col.title}</h3>
                                        <span className="bg-white border border-slate-200 text-slate-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">{kanbanTasks.filter(t => t.status === col.id).length}</span>
                                    </div>
                                    <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/30">
                                        {kanbanTasks.filter(t => t.status === col.id).map(task => {
                                            const bgColor = task.status === 'completed' ? 'bg-emerald-50 border-emerald-200'
                                                : task.status === 'in_progress' ? 'bg-amber-50 border-amber-200'
                                                    : 'bg-blue-50 border-blue-200';

                                            return (
                                                <div
                                                    key={task.id}
                                                    draggable
                                                    onDragStart={(e) => handleDragStart(e, task.id)}
                                                    className={`${bgColor} p-5 rounded-2xl shadow-sm border cursor-grab hover:shadow-md transition-all active:cursor-grabbing group`}
                                                >
                                                    <div className="flex justify-between items-start mb-3">
                                                        <Badge text={task.priority} />
                                                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => { setEditingTask(task); setIsTaskModalOpen(true); }} className="text-slate-400 hover:text-indigo-600 transition-colors bg-white/50 p-1 rounded"><Edit className="w-4 h-4" /></button>
                                                            <button onClick={() => setKanbanTasks(kanbanTasks.filter(t => t.id !== task.id))} className="text-slate-400 hover:text-rose-500 transition-colors bg-white/50 p-1 rounded"><Trash2 className="w-4 h-4" /></button>
                                                        </div>
                                                    </div>
                                                    <h4 className="font-bold text-slate-900 text-sm mb-1.5 leading-tight">{task.title}</h4>
                                                    <div className="flex items-center text-xs text-slate-500 font-semibold mb-3 mt-2">
                                                        <CalendarIcon className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                                                        {task.dueDate ? `Tamat: ${task.dueDate}` : 'Tiada Tarikh'}
                                                    </div>
                                                    <div className="flex justify-between items-center pt-4 border-t border-slate-200/50">
                                                        <div className="flex space-x-3 text-slate-400">
                                                            <button onClick={() => showToastNotification?.('Buka modul lampiran (Simulasi)')} className="hover:text-slate-700 transition-colors" title="Lampiran"><Paperclip className="w-4 h-4" /></button>
                                                            <button onClick={() => showToastNotification?.('Buka modul komen (Simulasi)')} className="hover:text-slate-700 transition-colors" title="Komen"><MessageSquare className="w-4 h-4" /></button>
                                                        </div>
                                                        <div className="w-8 h-8 rounded-full bg-white text-slate-700 text-xs flex items-center justify-center font-extrabold border border-slate-200 shadow-sm uppercase">
                                                            {task.assignee}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}

                                        {kanbanTasks.filter(t => t.status === col.id).length === 0 && (
                                            <div className="text-center p-8 border-2 border-dashed border-slate-300 rounded-2xl bg-white/50">
                                                <p className="text-slate-500 font-medium text-sm">Tarik kad ke sini</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'Kewangan Projek' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900">Pengurusan Kewangan Projek</h3>
                                <p className="text-slate-500 text-sm mt-1">Jejak perbelanjaan, tuntutan bayaran dan baki peruntukan terkini.</p>
                            </div>
                            <button onClick={() => { setEditingFinance(null); setIsFinanceModalOpen(true); }} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-800 flex items-center text-sm shadow-md transition-all active:scale-[0.98]">
                                <Plus className="w-4 h-4 mr-2" /> Daftar Tuntutan
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
                                <p className="text-slate-400 font-bold text-sm mb-1 uppercase tracking-widest">Jumlah Peruntukan</p>
                                <h3 className="text-4xl font-extrabold tracking-tight">RM {project.budget || 0}M</h3>
                                <div className="mt-4 text-xs font-semibold text-slate-300 flex items-center">
                                    <CheckCircle className="w-4 h-4 mr-1.5 text-emerald-400" /> Kelulusan MOF: 12 Jan 2025
                                </div>
                            </Card>
                            <Card className="border border-indigo-100 bg-indigo-50/30">
                                <p className="text-slate-500 font-bold text-sm mb-1 uppercase tracking-widest">Telah Dibelanjakan</p>
                                <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">RM {project.budget ? (project.budget * 0.56).toFixed(1) : 0}M</h3>
                                <div className="mt-5 w-full bg-slate-200 rounded-full h-2">
                                    <div className="bg-indigo-600 h-2 rounded-full transition-all duration-1000" style={{ width: `56.25%` }}></div>
                                </div>
                                <p className="text-xs font-bold text-indigo-600 mt-2 text-right">56.25% Digunakan</p>
                            </Card>
                            <Card className="border border-emerald-100 bg-emerald-50/30">
                                <p className="text-slate-500 font-bold text-sm mb-1 uppercase tracking-widest">Baki Tersedia</p>
                                <h3 className="text-4xl font-extrabold text-emerald-700 tracking-tight">RM {project.budget ? (project.budget * 0.44).toFixed(1) : 0}M</h3>
                                <p className="text-xs font-semibold text-slate-500 mt-4 leading-relaxed">Mencukupi untuk menampung baki fasa projek mengikut jadual perancangan.</p>
                            </Card>
                        </div>

                        <Card noPadding className="overflow-x-auto mt-6">
                            <div className="p-6 border-b border-slate-100 bg-white flex justify-between items-center">
                                <h3 className="font-extrabold text-slate-900 flex items-center"><Receipt className="w-5 h-5 mr-2 text-slate-400" /> Senarai Tuntutan & Invois</h3>
                                <span className="text-sm font-bold text-indigo-600">{finances.length} Rekod</span>
                            </div>
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID Invois / Tarikh</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Perkara / Keterangan</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pembekal</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Jumlah (RM)</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Tindakan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {finances.map(fin => (
                                        <tr key={fin.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900 text-sm">{fin.id}</div>
                                                <div className="text-xs font-medium text-slate-400 mt-0.5">{fin.date}</div>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-slate-700 text-sm">{fin.description}</td>
                                            <td className="px-6 py-4 text-sm font-semibold text-slate-500">{fin.vendor}</td>
                                            <td className="px-6 py-4 font-extrabold text-slate-900 text-sm text-right">
                                                {fin.amount}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Badge text={fin.status} />
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button onClick={() => { setEditingFinance(fin); setIsFinanceModalOpen(true); }} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-slate-500 shadow-sm"><Edit className="w-3.5 h-3.5" /></button>
                                                <button onClick={() => handleDeleteFinance(fin.id)} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-colors text-slate-500 shadow-sm"><Trash2 className="w-3.5 h-3.5" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Card>
                    </div>
                )}

                {activeTab === 'Dokumen (DMS)' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900">Repositori Dokumen (DMS)</h3>
                                <p className="text-slate-500 text-sm mt-1">Urus dan muat naik dokumen berkaitan projek secara selamat.</p>
                            </div>
                            <button onClick={() => setIsDocModalOpen(true)} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-800 flex items-center text-sm shadow-md transition-all active:scale-[0.98]">
                                <UploadCloud className="w-4 h-4 mr-2" /> Muat Naik Dokumen
                            </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {['Minit Mesyuarat', 'Dokumen Kontrak', 'Spesifikasi Sistem', 'Kewangan & Bajet'].map((cat, i) => (
                                <div key={i} className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center space-x-3 cursor-pointer hover:border-indigo-300 hover:shadow-sm transition-all group">
                                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        <Folder className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-slate-700 text-sm group-hover:text-indigo-700">{cat}</span>
                                </div>
                            ))}
                        </div>

                        <Card noPadding className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[700px]">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Dokumen</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Dimuat Naik Oleh</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Saiz</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Tindakan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {docs.map(doc => (
                                        <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="p-2 bg-indigo-50 rounded-lg shrink-0">
                                                        <FileText className="w-5 h-5 text-indigo-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 text-sm hover:text-indigo-600 cursor-pointer transition-colors">{doc.name}</p>
                                                        <p className="text-xs font-medium text-slate-400 mt-0.5">{doc.date}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="bg-slate-50 text-slate-600 px-2.5 py-1 rounded-md text-xs font-bold border border-slate-200">{doc.category}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold text-slate-700">{doc.uploader}</td>
                                            <td className="px-6 py-4 text-sm font-semibold text-slate-500">{doc.size}</td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-colors text-slate-500 shadow-sm"><Download className="w-4 h-4" /></button>
                                                <button onClick={() => setDocs(docs.filter(d => d.id !== doc.id))} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors text-slate-500 shadow-sm"><Trash2 className="w-4 h-4" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Card>
                    </div>
                )}
            </div>
        </div>
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

const ReportsPage = () => {
    const agencyData = [
        { name: 'Mahkamah Persekutuan', budget: 145, spent: 90, projects: 2, efficiency: 85, status: 'Atas Landasan' },
        { name: 'Mahkamah Rayuan', budget: 92, spent: 40, projects: 2, efficiency: 75, status: 'Baik' },
        { name: 'Mahkamah Tinggi Malaya', budget: 120, spent: 85, projects: 2, efficiency: 90, status: 'Cemerlang' },
        { name: 'Mahkamah Tinggi Sabah & Sarawak', budget: 98, spent: 98, projects: 2, efficiency: 100, status: 'Selesai' }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Analitik Laporan</h1>
                    <p className="text-slate-500 mt-1 text-lg">Wawasan prestasi komprehensif merentasi agensi.</p>
                </div>
                <div className="flex space-x-3">
                    <button className="border border-slate-200 bg-white px-5 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 flex items-center text-sm font-semibold shadow-sm transition-colors">
                        <CalendarDays className="w-4 h-4 mr-2 text-slate-400" /> Suku Ke-2 2026
                    </button>
                    <button onClick={() => window.print()} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-800 flex items-center text-sm shadow-md transition-all active:scale-[0.98]">
                        <Download className="w-4 h-4 mr-2" /> Eksport PDF
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: 'Jumlah Bajet Diperuntukkan', value: 'RM 380M', icon: DollarSign, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+12%', isUp: true },
                    { title: 'Jumlah Perbelanjaan Sebenar', value: 'RM 266M', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '70% diguna', isUp: true },
                    { title: 'Kadar Pencapaian', value: '84%', icon: Target, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+5%', isUp: true },
                    { title: 'Risiko Berkeutamaan Tinggi', value: '3', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50', trend: '-2', isUp: true },
                ].map((kpi, i) => (
                    <Card key={i} className="group hover:border-slate-200 hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-3.5 rounded-2xl ${kpi.bg} group-hover:scale-110 transition-transform`}>
                                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                            </div>
                            <div className="flex items-center text-xs font-bold bg-slate-50 px-2 py-1 rounded-full">
                                {kpi.isUp ? <ArrowUpRight className="w-3 h-3 text-emerald-500 mr-1" /> : <ArrowDownRight className="w-3 h-3 text-rose-500 mr-1" />}
                                <span className={kpi.isUp ? 'text-emerald-700' : 'text-rose-700'}>{kpi.trend}</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{kpi.value}</h3>
                            <p className="text-sm font-semibold text-slate-500 mt-1.5">{kpi.title}</p>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xl font-extrabold text-slate-900">Gambaran Kewangan Agensi (RM Juta)</h3>
                        <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 border border-transparent hover:border-slate-200"><MoreVertical className="w-5 h-5" /></button>
                    </div>
                    <div className="space-y-8">
                        {agencyData.map(agency => (
                            <div key={agency.name}>
                                <div className="flex justify-between text-sm mb-3">
                                    <span className="font-extrabold text-slate-800">{agency.name}</span>
                                    <span className="text-slate-500 font-semibold">{agency.spent}M / {agency.budget}M</span>
                                </div>
                                <div className="w-full bg-slate-50 rounded-full h-4 overflow-hidden flex border border-slate-100">
                                    <div className="bg-slate-900 h-full relative group transition-all duration-1000 rounded-full" style={{ width: `${(agency.spent / agency.budget) * 100}%` }}>
                                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="flex flex-col items-center justify-center relative overflow-hidden">
                    <h3 className="text-xl font-extrabold text-slate-900 w-full text-left mb-8 z-10">Peruntukan Sumber</h3>
                    <div className="relative z-10">
                        <PieChart className="w-40 h-40 text-slate-50 absolute inset-0 m-auto" strokeWidth={1} />
                        <DonutChart percentage={65} colorClass="text-indigo-600" label="IT & Infra" />
                    </div>
                    <div className="w-full mt-10 space-y-4 px-2 z-10">
                        <div className="flex justify-between items-center text-sm"><span className="text-slate-600 font-medium flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-indigo-600 mr-3"></span> IT & Infra</span><span className="font-bold text-slate-900">65%</span></div>
                        <div className="flex justify-between items-center text-sm"><span className="text-slate-600 font-medium flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-3"></span> Operasi</span><span className="font-bold text-slate-900">20%</span></div>
                        <div className="flex justify-between items-center text-sm"><span className="text-slate-600 font-medium flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-3"></span> Latihan</span><span className="font-bold text-slate-900">15%</span></div>
                    </div>
                </Card>
            </div>

            <Card noPadding className="overflow-x-auto">
                <div className="p-6 lg:p-8 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-xl font-extrabold text-slate-900">Pecahan Prestasi Agensi</h3>
                    <button className="text-sm text-indigo-600 font-bold hover:text-indigo-700">Lihat Laporan Penuh</button>
                </div>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Agensi</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Projek Aktif</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Bajet</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Kecekapan Penghantaran</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/80">
                        {agencyData.map((agency, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                                <td className="px-8 py-5 font-extrabold text-slate-900">{agency.name}</td>
                                <td className="px-8 py-5 text-slate-600 font-semibold">{agency.projects} Projek</td>
                                <td className="px-8 py-5 font-bold text-slate-700">RM {agency.budget}M</td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center space-x-4 w-40">
                                        <span className="font-bold text-slate-700 text-sm w-10">{agency.efficiency}%</span>
                                        <ProgressBar progress={agency.efficiency} colorClass={agency.efficiency >= 85 ? "bg-emerald-500" : agency.efficiency < 50 ? "bg-rose-500" : "bg-indigo-500"} />
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <Badge text={agency.status} type={agency.status === 'Berisiko' ? 'Berisiko' : agency.status === 'Selesai' ? 'Selesai' : 'Baik'} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

const UsersPage = () => {
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState(TEAM_MEMBERS);
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

    const handleSaveUser = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const name = formData.get('name');

        if (editingUser) {
            setUsers(users.map(u => u.id === editingUser.id ? {
                ...u,
                name,
                email: formData.get('email'),
                roleId: formData.get('role'),
                agency: formData.get('agency'),
                status: formData.get('status'),
                avatar: name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
            } : u));
        } else {
            setUsers([{
                id: `U${Date.now()}`,
                name,
                email: formData.get('email'),
                roleId: formData.get('role'),
                agency: formData.get('agency'),
                status: formData.get('status'),
                avatar: name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
            }, ...users]);
        }
        setIsUserModalOpen(false);
    };

    const handleDeleteUser = (id) => setUsers(users.filter(u => u.id !== id));

    const handleUpdatePassword = (e) => {
        e.preventDefault();
        setIsPasswordModalOpen(false);
        setPasswordUser(null);
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
                                    <input name="newPassword" required type="password" placeholder="Masukkan kata laluan baharu" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-amber-50 focus:border-amber-400 outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Sahkan Kata Laluan</label>
                                    <input name="confirmPassword" required type="password" placeholder="Sahkan kata laluan" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-amber-50 focus:border-amber-400 outline-none transition-all" />
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
                                        <input name="name" defaultValue={editingUser?.name || ''} required type="text" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">E-mel Rasmi</label>
                                        <input name="email" defaultValue={editingUser?.email || ''} required type="email" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Agensi / Kementerian</label>
                                    <input name="agency" defaultValue={editingUser?.agency || ''} required type="text" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Peranan (Role)</label>
                                        <select name="role" defaultValue={editingUser?.roleId || 'pmo_gov'} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none">
                                            {MOCK_ROLES.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
                                        <select name="status" defaultValue={editingUser?.status || 'Aktif'} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none">
                                            <option value="Aktif">Aktif</option>
                                            <option value="Tidak Aktif">Tidak Aktif</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4"><button type="submit" className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800">Simpan Pengguna</button></div>
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

const AuditTrailPage = ({ currentUser }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showExportMenu, setShowExportMenu] = useState(false);

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
            case 'LOGIN': return { icon: LogIn, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
            case 'LOGOUT': return { icon: LogOut, color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200' };
            case 'CREATE': return { icon: Plus, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
            case 'READ': return { icon: Eye, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' };
            case 'UPDATE': return { icon: Edit, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' };
            case 'DELETE': return { icon: Trash2, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' };
            default: return { icon: Terminal, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' };
        }
    };

    const filteredLogs = AUDIT_LOGS.filter(log => {
        if (!startDate && !endDate) return true;
        const logDate = new Date(log.timestamp.replace(' ', 'T'));
        const start = startDate ? new Date(startDate) : new Date('2000-01-01T00:00');
        const end = endDate ? new Date(endDate) : new Date('2100-01-01T23:59');
        return logDate >= start && logDate <= end;
    });

    const handleExport = (format) => {
        if (format === 'Excel (.csv)') {
            const headers = "Masa & Tarikh,Pengguna,Peranan,Tindakan,Modul,Butiran Aktiviti,IP Address,Hostname,Status\n";
            const rows = filteredLogs.map(l => `${l.timestamp},${l.user},${l.role},${l.action},${l.module},"${l.details}",${l.ipAddress},${l.hostname},${l.status}`).join("\n");
            const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `AuditLog_PMO_${new Date().getTime()}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else if (format === 'PDF') {
            window.print();
        }
        setShowExportMenu(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 printable-area">
            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Jejak Audit Sistem</h1>
                    <p className="text-slate-500 mt-1 text-lg">Pemantauan log keselamatan, aktiviti pengguna (CRUD), dan info peranti.</p>
                </div>

                <div className="bg-white border border-slate-100 rounded-[24px] p-6 md:p-8 shadow-sm no-print relative overflow-hidden flex flex-col xl:flex-row xl:items-end justify-between gap-6">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -z-10 opacity-60 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>

                    <div className="flex flex-col md:flex-row items-center gap-5 w-full xl:w-auto z-10">
                        <div className="w-full md:w-80">
                            <label className="block text-xs font-bold text-slate-500 mb-2.5 ml-1 uppercase tracking-wider">Carian Pantas</label>
                            <div className="relative group">
                                <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                <input type="text" placeholder="IP, Pengguna, Modul..." className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all placeholder:text-slate-400 placeholder:font-medium" />
                            </div>
                        </div>

                        <div className="flex items-end space-x-3 w-full md:w-auto">
                            <div className="flex-1 md:flex-none">
                                <label className="block text-xs font-bold text-slate-500 mb-2.5 ml-1 uppercase tracking-wider">Tarikh Mula</label>
                                <input type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full md:w-56 px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all cursor-pointer" />
                            </div>
                            <div className="pb-4 text-slate-300 font-bold hidden md:block">—</div>
                            <div className="flex-1 md:flex-none">
                                <label className="block text-xs font-bold text-slate-500 mb-2.5 ml-1 uppercase tracking-wider">Tarikh Akhir</label>
                                <input type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full md:w-56 px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all cursor-pointer" />
                            </div>
                        </div>
                    </div>

                    <div className="relative w-full xl:w-auto z-10 shrink-0">
                        <button onClick={() => setShowExportMenu(!showExportMenu)} className="w-full xl:w-auto bg-slate-900 text-white px-8 py-3.5 rounded-2xl text-sm font-bold hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/10 flex justify-center items-center active:scale-[0.98] transition-all">
                            <Download className="w-4 h-4 mr-2" /> Eksport Log
                            <ChevronDown className="w-4 h-4 ml-3 opacity-70" />
                        </button>

                        {showExportMenu && (
                            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                                <button onClick={() => handleExport('Excel (.csv)')} className="w-full text-left px-5 py-4 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center border-b border-slate-50 transition-colors">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 mr-3 font-extrabold text-[10px]">CSV</span>
                                    Excel (CSV)
                                </button>
                                <button onClick={() => handleExport('PDF')} className="w-full text-left px-5 py-4 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center transition-colors">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-rose-50 text-rose-600 mr-3 font-extrabold text-[10px]">PDF</span>
                                    Dokumen PDF
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 no-print">
                <Card className="relative overflow-hidden group hover:shadow-md hover:-translate-y-1 transition-all border border-slate-200">
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-indigo-50 opacity-50 group-hover:scale-150 transition-transform duration-700 ease-out pointer-events-none"></div>
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="p-3.5 bg-white border border-indigo-100 shadow-sm text-indigo-600 rounded-xl">
                            <Terminal className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100/50">Semua Log</span>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-1">{filteredLogs.length}</h3>
                        <p className="text-sm font-bold text-slate-500">Jumlah Log Ditapis</p>
                    </div>
                </Card>

                <Card className="relative overflow-hidden group hover:shadow-md hover:-translate-y-1 transition-all border border-slate-200">
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-rose-50 opacity-50 group-hover:scale-150 transition-transform duration-700 ease-out pointer-events-none"></div>
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="p-3.5 bg-white border border-rose-100 shadow-sm text-rose-600 rounded-xl">
                            <ShieldAlert className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100/50 flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1.5" /> Amaran
                        </span>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-1">{filteredLogs.filter(l => l.status === 'FAILED').length}</h3>
                        <p className="text-sm font-bold text-slate-500">Log Masuk Gagal</p>
                    </div>
                </Card>

                <Card className="relative overflow-hidden group hover:shadow-md hover:-translate-y-1 transition-all border border-slate-200">
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-amber-50 opacity-50 group-hover:scale-150 transition-transform duration-700 ease-out pointer-events-none"></div>
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="p-3.5 bg-white border border-amber-100 shadow-sm text-amber-600 rounded-xl">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100/50">Kritikal</span>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-1">{filteredLogs.filter(l => l.action === 'DELETE' || l.action === 'UPDATE').length}</h3>
                        <p className="text-sm font-bold text-slate-500">Aktiviti (Kemas Kini/Padam)</p>
                    </div>
                </Card>
            </div>

            <Card noPadding className="overflow-x-auto print:shadow-none print:border-0">
                <div className="p-6 lg:p-8 border-b border-slate-100 bg-white flex justify-between items-center no-print">
                    <h3 className="text-xl font-extrabold text-slate-900 flex items-center"><Server className="w-5 h-5 mr-3 text-slate-400" /> Log Pelayan (Server Logs)</h3>
                    <button className="text-sm font-bold text-slate-500 hover:text-indigo-600 flex items-center transition-colors"><RefreshCw className="w-4 h-4 mr-2" /> Muat Semula</button>
                </div>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Masa & Tarikh</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Pengguna</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Tindakan</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Butiran Aktiviti</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Rangkaian (Network)</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/80 bg-white">
                        {filteredLogs.length > 0 ? filteredLogs.map((log) => {
                            const ActionIcon = getActionConfig(log.action).icon;
                            return (
                                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors print:border-b">
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        <div className="font-extrabold text-slate-900 text-sm">{log.timestamp.split(' ')[1]}</div>
                                        <div className="text-slate-500 text-xs font-medium mt-1">{log.timestamp.split(' ')[0]}</div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="font-bold text-slate-900 text-sm">{log.user}</div>
                                        <div className="text-slate-500 text-xs font-semibold mt-1">{log.role}</div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className={`inline-flex items-center px-2.5 py-1.5 text-[10px] font-extrabold rounded-md border uppercase ${getActionConfig(log.action).bg} ${getActionConfig(log.action).color} ${getActionConfig(log.action).border}`}>
                                            <ActionIcon className="w-3.5 h-3.5 mr-1.5" /> {log.action}
                                        </div>
                                        <div className="text-slate-500 text-xs mt-2 font-bold">Modul: {log.module}</div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-slate-700 font-semibold text-sm max-w-xs truncate leading-relaxed" title={log.details}>{log.details}</p>
                                        <p className="text-slate-400 text-[10px] mt-1.5 uppercase font-bold tracking-wider">ID: {log.id}</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center text-slate-700 font-semibold text-xs mb-1.5">
                                            <Globe className="w-3.5 h-3.5 mr-2 text-slate-400" /> {log.ipAddress}
                                        </div>
                                        <div className="flex items-center text-slate-500 font-medium text-xs">
                                            <Monitor className="w-3.5 h-3.5 mr-2 text-slate-400" /> {log.hostname}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        {log.status === 'SUCCESS' ? (
                                            <span className="inline-flex items-center px-3 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-extrabold border border-emerald-100">Berjaya</span>
                                        ) : (
                                            <span className="inline-flex items-center px-3 py-1 rounded-md bg-rose-50 text-rose-700 text-xs font-extrabold border border-rose-100">Gagal</span>
                                        )}
                                    </td>
                                </tr>
                            )
                        }) : (
                            <tr>
                                <td colSpan="6" className="px-8 py-16 text-center text-slate-500 font-bold text-lg">
                                    Tiada log audit ditemui untuk tempoh yang ditapis.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authView, setAuthView] = useState('landing');
    const [currentView, setCurrentView] = useState('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [projectsList, setProjectsList] = useState(INITIAL_PROJECTS);
    const [selectedProject, setSelectedProject] = useState(null);

    const [showNotif, setShowNotif] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const unreadCount = notifications.filter(n => n.unread).length;
    const [language, setLanguage] = useState('ms');

    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [settingsTab, setSettingsTab] = useState('profile');
    const [pseudoTheme, setPseudoTheme] = useState('light');
    const [toastMsg, setToastMsg] = useState('');

    const showToastNotification = (msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(''), 3000);
    };

    const markAllRead = () => setNotifications(notifications.map(n => ({ ...n, unread: false })));
    const markAsRead = (id) => setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));

    if (!isAuthenticated) {
        if (authView === 'landing') return <LandingPage onNavigateToLogin={() => setAuthView('login')} />;
        return <LoginPage onLogin={() => setIsAuthenticated(true)} onBack={() => setAuthView('landing')} />;
    }

    const NAVIGATION = [
        { id: 'dashboard', label: 'Papan Pemuka', icon: LayoutDashboard },
        { id: 'projects', label: 'Projek', icon: Briefcase },
        { id: 'calendar', label: 'Kalendar', icon: CalendarIcon },
        { id: 'reports', label: 'Analitik Laporan', icon: BarChart2 },
        { id: 'users', label: 'Pasukan & Peranan', icon: Users },
        { id: 'audit', label: 'Jejak Audit', icon: FileText },
    ];

    const handleSelectProject = (project) => {
        setSelectedProject(project);
        setCurrentView('project_detail');
    };

    const renderView = () => {
        switch (currentView) {
            case 'dashboard': return <DashboardPage />;
            case 'projects': return <ProjectListPage setView={setCurrentView} projects={projectsList} setProjects={setProjectsList} onSelectProject={handleSelectProject} />;
            case 'project_detail': return <ProjectDetailPage setView={setCurrentView} project={selectedProject || projectsList[0]} showToastNotification={showToastNotification} />;
            case 'calendar': return <CalendarPage />;
            case 'reports': return <ReportsPage />;
            case 'users': return <UsersPage />;
            case 'audit': return <AuditTrailPage currentUser={MOCK_USER} />;
            default: return <DashboardPage />;
        }
    };

    const handleNavigation = (id) => {
        setCurrentView(id);
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="flex h-screen bg-[#F8F9FB] font-sans text-slate-900 overflow-hidden selection:bg-indigo-100 selection:text-indigo-900 relative">

            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 lg:hidden transition-opacity" onClick={() => setIsMobileMenuOpen(false)}></div>
            )}

            <aside className={`fixed inset-y-0 left-0 w-[280px] bg-white border-r border-slate-100 flex flex-col h-full z-40 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 shadow-[4px_0_24px_rgba(0,0,0,0.01)] ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-20 lg:h-24 flex items-center justify-between px-6 lg:px-8 shrink-0">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-md">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <span className="ml-4 text-xl font-extrabold text-slate-900 tracking-tight">MY-PMO</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5 no-scrollbar">
                    <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 mt-2">Menu Utama</p>
                    {NAVIGATION.map(item => {
                        const isActive = currentView === item.id || (currentView === 'project_detail' && item.id === 'projects');
                        return (
                            <button key={item.id} onClick={() => handleNavigation(item.id)} className={`w-full flex items-center px-4 py-3.5 rounded-2xl transition-all duration-200 group ${isActive ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                                <item.icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'}`} />
                                <span className="ml-4 font-bold text-sm tracking-wide">{item.label}</span>
                            </button>
                        )
                    })}
                </div>

                <div className="p-6 shrink-0">
                    <div className="bg-slate-50 rounded-3xl p-4 border border-slate-100">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 shadow-sm shrink-0">
                                {MOCK_USER.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 truncate">{MOCK_USER.name}</p>
                                <p className="text-xs font-semibold text-slate-500 truncate">{MOCK_USER.role}</p>
                            </div>
                        </div>
                        <button onClick={() => { setIsAuthenticated(false); setAuthView('landing'); }} className="w-full flex items-center justify-center px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-colors rounded-xl font-bold text-sm shadow-sm active:scale-[0.98]">
                            <LogOut className="w-4 h-4 mr-2" /> Log Keluar
                        </button>
                    </div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                <header className="h-20 lg:h-24 flex items-center justify-between px-4 lg:px-8 z-10 shrink-0 bg-[#F8F9FB]/80 backdrop-blur-md">
                    <div className="flex items-center">
                        <button className="p-2.5 mr-4 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl lg:hidden shadow-sm transition-colors" onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="hidden md:flex relative group">
                            <Search className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                            <input type="text" placeholder="Cari pantas..." className="pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-semibold focus:ring-4 focus:ring-slate-100 outline-none w-72 shadow-sm transition-all" />
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="relative">
                            <button onClick={() => { setShowNotif(!showNotif); setShowSettings(false); }} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all shadow-sm relative focus:ring-2 focus:ring-indigo-100">
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse"></span>}
                            </button>
                            {showNotif && (
                                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                                    <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                                        <span className="font-extrabold text-slate-800">Pusat Notifikasi</span>
                                        {unreadCount > 0 && (
                                            <span onClick={markAllRead} className="text-xs text-indigo-600 font-bold cursor-pointer hover:underline">Tanda Dibaca Semua</span>
                                        )}
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {notifications.length > 0 ? notifications.map(n => (
                                            <div key={n.id} onClick={() => markAsRead(n.id)} className={`p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer ${n.unread ? 'bg-indigo-50/30 border-l-4 border-l-indigo-500' : 'border-l-4 border-l-transparent'}`}>
                                                <div className="flex justify-between items-start">
                                                    <p className="text-sm font-bold text-slate-800">{n.title}</p>
                                                    {n.unread && <span className="w-2 h-2 bg-indigo-500 rounded-full mt-1.5"></span>}
                                                </div>
                                                <p className="text-xs font-semibold text-slate-500 mt-1.5 leading-relaxed">{n.message}</p>
                                                <p className="text-[10px] text-slate-400 mt-2 font-extrabold tracking-widest uppercase">{n.time}</p>
                                            </div>
                                        )) : (
                                            <div className="p-8 text-center text-slate-400 text-sm font-medium">Tiada notifikasi baharu.</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="relative hidden sm:block">
                            <button onClick={() => { setShowSettings(!showSettings); setShowNotif(false); }} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all shadow-sm focus:ring-2 focus:ring-indigo-100">
                                <Settings className="w-5 h-5" />
                            </button>
                            {showSettings && (
                                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                                    <div className="p-2 space-y-1">
                                        <p className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bahasa / Language</p>
                                        <button onClick={() => setLanguage('ms')} className={`w-full text-left px-4 py-2.5 text-sm font-bold rounded-xl transition-colors flex justify-between items-center ${language === 'ms' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'}`}>
                                            <span>Bahasa Melayu</span> {language === 'ms' && <CheckCircle2 className="w-4 h-4" />}
                                        </button>
                                        <button onClick={() => setLanguage('en')} className={`w-full text-left px-4 py-2.5 text-sm font-bold rounded-xl transition-colors flex justify-between items-center ${language === 'en' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'}`}>
                                            <span>English</span> {language === 'en' && <CheckCircle2 className="w-4 h-4" />}
                                        </button>
                                        <div className="h-px w-full bg-slate-100 my-2"></div>
                                        <p className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Akaun</p>
                                        <button onClick={() => { setSettingsTab('profile'); setIsSettingsModalOpen(true); setShowSettings(false); }} className="w-full text-left px-4 py-2.5 text-sm font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors">Profil Pengguna</button>
                                        <button onClick={() => { setSettingsTab('theme'); setIsSettingsModalOpen(true); setShowSettings(false); }} className="w-full text-left px-4 py-2.5 text-sm font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors">Tema Sistem</button>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </header>

                {isSettingsModalOpen && (
                    <div className="fixed inset-0 z-[70] overflow-y-auto">
                        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsSettingsModalOpen(false)}></div>
                        <div className="flex min-h-full items-center justify-center p-4">
                            <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-xl animate-in zoom-in-95 duration-200">
                                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-[32px]">
                                    <h2 className="text-xl font-extrabold text-slate-900">Tetapan Sistem</h2>
                                    <button onClick={() => setIsSettingsModalOpen(false)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200 hover:text-rose-500 hover:border-rose-200 transition-colors">&times;</button>
                                </div>
                                <div className="flex border-b border-slate-200 px-8 pt-4">
                                    <button onClick={() => setSettingsTab('profile')} className={`pb-4 text-sm font-bold border-b-2 transition-colors mr-8 ${settingsTab === 'profile' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Profil Pengguna</button>
                                    <button onClick={() => setSettingsTab('theme')} className={`pb-4 text-sm font-bold border-b-2 transition-colors ${settingsTab === 'theme' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Tema Sistem</button>
                                </div>
                                <div className="p-8">
                                    {settingsTab === 'profile' && (
                                        <form onSubmit={(e) => { e.preventDefault(); setIsSettingsModalOpen(false); showToastNotification('Profil berjaya dikemas kini!'); }} className="space-y-5">
                                            <div className="flex items-center space-x-5 mb-6">
                                                <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-extrabold text-2xl shadow-inner border-2 border-white">{MOCK_USER.avatar}</div>
                                                <div>
                                                    <button type="button" className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-colors shadow-md mb-2">Tukar Gambar</button>
                                                    <p className="text-xs text-slate-400 font-medium">Format JPG, PNG (Maks: 2MB)</p>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Penuh</label>
                                                <input type="text" defaultValue={MOCK_USER.name} required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">E-mel Rasmi</label>
                                                <input type="email" defaultValue="admin@pmo.gov.my" required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Peranan Sistem (Read-only)</label>
                                                <input type="text" defaultValue={MOCK_USER.role} disabled className="w-full px-5 py-3.5 bg-slate-100 border border-slate-200 rounded-2xl outline-none text-slate-500 cursor-not-allowed font-medium" />
                                            </div>
                                            <div className="flex justify-end pt-4"><button type="submit" className="px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md active:scale-[0.98] transition-all">Simpan Profil</button></div>
                                        </form>
                                    )}
                                    {settingsTab === 'theme' && (
                                        <div className="space-y-6">
                                            <p className="text-sm font-semibold text-slate-500">Pilih tema antaramuka pilihan anda. Tema akan disimpan mengikut peranti.</p>
                                            <div className="grid grid-cols-2 gap-4">
                                                <button onClick={() => setPseudoTheme('light')} className={`p-6 border-2 rounded-2xl flex flex-col items-center gap-3 transition-all ${pseudoTheme === 'light' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-200 bg-white'}`}>
                                                    <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shadow-inner"><CheckCircle2 className={`w-6 h-6 ${pseudoTheme === 'light' ? 'text-indigo-600' : 'text-slate-300'}`} /></div>
                                                    <span className="font-extrabold text-slate-800">Mod Cerah</span>
                                                </button>
                                                <button onClick={() => { setPseudoTheme('dark'); showToastNotification('Mod Gelap diaktifkan (Versi Beta)'); }} className={`p-6 border-2 rounded-2xl flex flex-col items-center gap-3 transition-all relative overflow-hidden ${pseudoTheme === 'dark' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-200 bg-white'}`}>
                                                    <div className="absolute top-3 right-3 bg-amber-100 text-amber-700 text-[10px] px-2.5 py-1 rounded-md font-extrabold tracking-widest">BETA</div>
                                                    <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center shadow-inner"><CheckCircle2 className={`w-6 h-6 ${pseudoTheme === 'dark' ? 'text-indigo-400' : 'text-slate-600'}`} /></div>
                                                    <span className="font-extrabold text-slate-800">Mod Gelap</span>
                                                </button>
                                            </div>
                                            {pseudoTheme === 'dark' && (
                                                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start space-x-3">
                                                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                                                    <p className="text-xs text-amber-700 font-semibold leading-relaxed">Mod Gelap (Dark Mode) sedang dalam fasa pengujian awal (Beta). Sesetengah komponen mungkin masih memaparkan warna lalai cerah untuk mengekalkan kejelasan data.</p>
                                                </div>
                                            )}
                                            <div className="flex justify-end pt-4"><button onClick={() => setIsSettingsModalOpen(false)} className="px-8 py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 shadow-md active:scale-[0.98] transition-all">Tutup</button></div>
                                        </div>
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

                <main className="flex-1 overflow-y-auto px-4 lg:px-8 pb-12 w-full" onClick={() => { setShowNotif(false); setShowSettings(false); }}>
                    <div className="max-w-7xl mx-auto h-full">
                        {renderView()}
                    </div>
                </main>
            </div>
        </div>
    );
}