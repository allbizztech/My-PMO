import React, { useState, useEffect } from 'react';
import {
    Shield, LogIn, ChevronRight, CheckCircle2,
    Briefcase, DollarSign, FileCheck, Lock,
    Clock, HelpCircle, Sun, Moon
} from 'lucide-react';

export const LandingPage = ({ onNavigateToLogin }) => {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('mypmo_landing_theme');
        return saved ? saved : 'light';
    });

    useEffect(() => {
        localStorage.setItem('mypmo_landing_theme', theme);
    }, [theme]);

    const isDark = theme === 'dark';
    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

    return (
        <div className={`min-h-screen w-full font-sans flex flex-col transition-colors duration-200 ${
            isDark 
                ? 'bg-slate-900 text-slate-100 selection:bg-indigo-600/40' 
                : 'bg-slate-50 text-slate-800 selection:bg-indigo-500 selection:text-white'
        }`}>
            {/* Top Official Banner */}
            <div className={`border-b text-xs py-2 px-4 sm:px-8 transition-colors ${
                isDark 
                    ? 'bg-slate-950/80 border-slate-800 text-slate-400' 
                    : 'bg-slate-100/90 border-slate-200 text-slate-600'
            }`}>
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1">
                    <div className="flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full inline-block ${isDark ? 'bg-emerald-500' : 'bg-emerald-600'}`}></span>
                        <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                            Pejabat Ketua Pendaftar Mahkamah Persekutuan Malaysia (PKPMP)
                        </span>
                    </div>
                    <div className="flex items-center space-x-4 text-[11px]">
                        <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                            Klasifikasi: <strong className={isDark ? 'text-slate-300' : 'text-slate-800'}>Dalaman / Terperingkat</strong>
                        </span>
                        <span className={`${isDark ? 'text-slate-600' : 'text-slate-300'} hidden md:inline`}>&bull;</span>
                        <span className={`${isDark ? 'text-slate-400' : 'text-slate-600'} hidden md:inline`}>
                            Zon Masa: <strong className={isDark ? 'text-slate-300' : 'text-slate-800'}>Putrajaya (GMT+8)</strong>
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <header className={`relative z-20 border-b px-4 sm:px-8 py-3 sm:py-3.5 backdrop-blur-md transition-colors ${
                isDark 
                    ? 'border-slate-800/80 bg-slate-900/90' 
                    : 'border-slate-200/90 bg-white/90 shadow-xs'
            }`}>
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-3.5">
                        <img 
                            src="/My-PMO/logo.png" 
                            alt="MY-PMO Logo" 
                            className={`w-10 h-10 rounded-xl object-contain shrink-0 transition-all ${
                                isDark ? 'shadow-md shadow-indigo-600/30' : 'shadow-xs border border-slate-200 bg-white'
                            }`} 
                        />
                        <div>
                            <div className="flex items-center space-x-2">
                                <span className={`text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    MY-PMO
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                    isDark 
                                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' 
                                        : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                }`}>
                                    v2.4
                                </span>
                            </div>
                            <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                Sistem Pengurusan & Pemantauan Projek PKPMP
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2.5 sm:space-x-3">
                        {/* Mode Toggle Button */}
                        <button
                            type="button"
                            onClick={toggleTheme}
                            title={isDark ? "Tukar ke Mod Cerah" : "Tukar ke Mod Gelap"}
                            aria-label={isDark ? "Tukar ke Mod Cerah" : "Tukar ke Mod Gelap"}
                            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer select-none active:scale-95 ${
                                isDark
                                    ? 'bg-slate-800 hover:bg-slate-700/80 text-amber-300 border-slate-700 shadow-sm'
                                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border-slate-200 shadow-xs'
                            }`}
                        >
                            {isDark ? (
                                <>
                                    <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                                    <span className="hidden sm:inline font-bold text-slate-200">Mod Cerah</span>
                                </>
                            ) : (
                                <>
                                    <Moon className="w-4 h-4 text-indigo-600 shrink-0" />
                                    <span className="hidden sm:inline font-bold text-slate-700">Mod Gelap</span>
                                </>
                            )}
                        </button>

                        <button
                            onClick={onNavigateToLogin}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/25 flex items-center gap-2 active:scale-95 cursor-pointer"
                        >
                            <span>Log Masuk Pegawai</span>
                            <LogIn className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section with Faded Istana Kehakiman Background */}
            <main className="flex-1 flex flex-col justify-center">
                <div className="relative overflow-hidden">
                    {/* Background Istana Kehakiman Image with Multi-layer Professional Fade */}
                    <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
                        <img 
                            src="/My-PMO/istana-kehakiman.png" 
                            alt="Istana Kehakiman Putrajaya" 
                            className={`w-full h-full object-cover object-center sm:object-top transition-all duration-700 ${
                                isDark 
                                    ? 'opacity-55 brightness-90 contrast-110 saturate-95' 
                                    : 'opacity-85 brightness-100 contrast-105'
                            }`}
                            style={{
                                transform: 'translateZ(0)',
                                backfaceVisibility: 'hidden'
                            }}
                        />
                        {/* Horizontal Gradient: Lembut & pelindung di sebelah kiri teks, telus di sebelah kanan bangunan asal */}
                        <div className={`absolute inset-0 transition-colors duration-300 ${
                            isDark 
                                ? 'bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-slate-900/20' 
                                : 'bg-gradient-to-r from-slate-50/95 via-slate-50/65 to-transparent'
                        }`} />
                        {/* Vertical Gradient: Peralihan halus dari header atas */}
                        <div className={`absolute inset-0 transition-colors duration-300 ${
                            isDark 
                                ? 'bg-gradient-to-b from-slate-900/60 via-transparent to-slate-900/85' 
                                : 'bg-gradient-to-b from-white/50 via-transparent to-slate-50/85'
                        }`} />
                        {/* Bottom smooth fade-out ke seksyen modul */}
                        <div className={`absolute bottom-0 left-0 right-0 h-28 transition-colors duration-300 ${
                            isDark 
                                ? 'bg-gradient-to-t from-slate-900 to-transparent' 
                                : 'bg-gradient-to-t from-slate-50 to-transparent'
                        }`} />
                    </div>

                    <section className="relative z-10 px-4 sm:px-8 py-8 sm:py-12 lg:py-16 max-w-7xl mx-auto w-full">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                            <div className="lg:col-span-7 text-center lg:text-left">
                                <h1 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight mb-4 ${
                                    isDark ? 'text-white' : 'text-slate-950'
                                }`}>
                                    Sistem Pengurusan & Pemantauan Projek
                                </h1>

                                <p className={`text-sm sm:text-base max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-6 ${
                                    isDark ? 'text-slate-300' : 'text-slate-600'
                                }`}>
                                    Portal berpusat bagi penyelarasan kitaran hayat projek pembangunan sistem mahkamah, kawalan siling bajet peruntukan, jadual pencapaian milestone, serta pematuhan semakan perolehan rasmi kerajaan.
                                </p>

                                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-6">
                                    <button
                                        onClick={onNavigateToLogin}
                                        className="w-full sm:w-auto px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                                    >
                                        <span>Akses Sistem MY-PMO</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                    <a
                                        href="#modul"
                                        className={`w-full sm:w-auto px-5 py-3 rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center justify-center gap-2 ${
                                            isDark 
                                                ? 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-slate-700' 
                                                : 'bg-white/90 backdrop-blur-xs hover:bg-slate-50 text-slate-700 border-slate-300 shadow-xs'
                                        }`}
                                    >
                                        <span>Skop Modul Sistem</span>
                                    </a>
                                </div>

                                <div className={`grid grid-cols-3 gap-4 pt-5 border-t text-left max-w-xl mx-auto lg:mx-0 ${
                                    isDark ? 'border-slate-800/80' : 'border-slate-200'
                                }`}>
                                    <div>
                                        <p className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>8 Fasa</p>
                                        <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Semakan SOP Perolehan</p>
                                    </div>
                                    <div>
                                        <p className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>100%</p>
                                        <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Ketelusan Aliran Bajet</p>
                                    </div>
                                    <div>
                                        <p className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Jejak Audit</p>
                                        <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Keselamatan & Pematuhan</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Summary Card (Corporate & Realistic) */}
                            <div className="lg:col-span-5">
                                <div className={`rounded-2xl p-5 sm:p-6 transition-all backdrop-blur-sm ${
                                    isDark 
                                        ? 'bg-slate-800/90 border border-slate-700 shadow-xl' 
                                        : 'bg-white/95 border border-slate-200/90 shadow-xl shadow-slate-200/60'
                                }`}>
                                    <div className={`flex items-center justify-between pb-3.5 border-b mb-4 ${
                                        isDark ? 'border-slate-700' : 'border-slate-100'
                                    }`}>
                                        <div className="flex items-center space-x-2.5">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs border ${
                                                isDark 
                                                    ? 'bg-indigo-600/30 text-indigo-400 border-indigo-500/30' 
                                                    : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                            }`}>
                                                PMO
                                            </div>
                                            <div>
                                                <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                    Panduan Akses Pengguna
                                                </h3>
                                                <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                                    Pejabat Pengurusan Projek PKPMP
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                                            isDark 
                                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        }`}>
                                            Aktif
                                        </span>
                                    </div>

                                    <div className="space-y-3 text-xs">
                                        <div className={`p-2.5 sm:p-3 rounded-xl border flex items-start space-x-3 transition-colors ${
                                            isDark 
                                                ? 'bg-slate-900/60 border-slate-800' 
                                                : 'bg-slate-50/90 border-slate-200/80'
                                        }`}>
                                            <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                                            <div>
                                                <strong className={`block ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                                                    Pegawai PMO PKPMP & BTM
                                                </strong>
                                                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                                                    Pengurusan penuh data projek, pengesahan fasa senarai semak, dan penetapan peraturan amaran.
                                                </span>
                                            </div>
                                        </div>

                                        <div className={`p-2.5 sm:p-3 rounded-xl border flex items-start space-x-3 transition-colors ${
                                            isDark 
                                                ? 'bg-slate-900/60 border-slate-800' 
                                                : 'bg-slate-50/90 border-slate-200/80'
                                        }`}>
                                            <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                                            <div>
                                                <strong className={`block ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                                                    Pengurus Projek Vendor
                                                </strong>
                                                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                                                    Kemas kini kemajuan fizikal projek, dokumen sokongan fasa perolehan, dan tuntutan bayaran.
                                                </span>
                                            </div>
                                        </div>

                                        <div className={`p-2.5 sm:p-3 rounded-xl border flex items-start space-x-3 transition-colors ${
                                            isDark 
                                                ? 'bg-slate-900/60 border-slate-800' 
                                                : 'bg-slate-50/90 border-slate-200/80'
                                        }`}>
                                            <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                                            <div>
                                                <strong className={`block ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                                                    Pengurusan Atasan / Pentadbir
                                                </strong>
                                                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                                                    Pemantauan eksekutif portfolio projek mahkamah seluruh negara, laporan analitik, dan log audit.
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`mt-5 pt-4 border-t flex items-center justify-between ${
                                        isDark ? 'border-slate-700' : 'border-slate-100'
                                    }`}>
                                        <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                            Ada pertanyaan mengenai akaun?
                                        </span>
                                        <button
                                            onClick={onNavigateToLogin}
                                            className={`text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                                                isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'
                                            }`}
                                        >
                                            Log Masuk &rarr;
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Scope & Modules Section */}
                <section id="modul" className={`px-4 sm:px-8 py-12 border-t transition-colors ${
                    isDark ? 'border-transparent bg-slate-950' : 'border-transparent bg-slate-100/90'
                }`}>
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8 text-center sm:text-left">
                            <h2 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                Fungsi Utama Portal MY-PMO
                            </h2>
                            <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                Struktur modul yang mematuhi garis panduan tadbir urus dan arahan perbendaharaan.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            <div className={`p-5 rounded-2xl border transition-all ${
                                isDark 
                                    ? 'bg-slate-900 border-slate-800' 
                                    : 'bg-white border-slate-200/90 shadow-xs hover:shadow-md'
                            }`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3.5 border ${
                                    isDark 
                                        ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' 
                                        : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                                }`}>
                                    <FileCheck className="w-5 h-5" />
                                </div>
                                <h3 className={`text-sm font-bold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    Senarai Semak Perolehan
                                </h3>
                                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    Pematuhan 8 fasa kelulusan daripada JPICT, had perolehan Sebutharga/Tender, syarat Bon Kontrak, hingga SST rasmi.
                                </p>
                            </div>

                            <div className={`p-5 rounded-2xl border transition-all ${
                                isDark 
                                    ? 'bg-slate-900 border-slate-800' 
                                    : 'bg-white border-slate-200/90 shadow-xs hover:shadow-md'
                            }`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3.5 border ${
                                    isDark 
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                        : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                }`}>
                                    <Briefcase className="w-5 h-5" />
                                </div>
                                <h3 className={`text-sm font-bold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    Direktori Projek & Kanban
                                </h3>
                                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    Penyelarasan tugasan pelaksanaan pasukan, jadual Gantt, dan pengesanan status kemajuan fizikal setiap inisiatif.
                                </p>
                            </div>

                            <div className={`p-5 rounded-2xl border transition-all ${
                                isDark 
                                    ? 'bg-slate-900 border-slate-800' 
                                    : 'bg-white border-slate-200/90 shadow-xs hover:shadow-md'
                            }`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3.5 border ${
                                    isDark 
                                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                                        : 'bg-amber-50 text-amber-600 border-amber-100'
                                }`}>
                                    <DollarSign className="w-5 h-5" />
                                </div>
                                <h3 className={`text-sm font-bold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    Pengurusan Kewangan
                                </h3>
                                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    Kawalan siling peruntukan projek, padanan tuntutan bayaran milestone fasa, dan unjuran baki perbelanjaan sebenar.
                                </p>
                            </div>

                            <div className={`p-5 rounded-2xl border transition-all ${
                                isDark 
                                    ? 'bg-slate-900 border-slate-800' 
                                    : 'bg-white border-slate-200/90 shadow-xs hover:shadow-md'
                            }`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3.5 border ${
                                    isDark 
                                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                                        : 'bg-blue-50 text-blue-600 border-blue-100'
                                }`}>
                                    <Lock className="w-5 h-5" />
                                </div>
                                <h3 className={`text-sm font-bold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    Jejak Audit & Kawalan Akses
                                </h3>
                                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    Log aktiviti sistem masa nyata mematuhi piawaian tadbir urus keselamatan data ICT sektor awam.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Official Footer */}
            <footer className={`border-t text-xs py-8 px-4 sm:px-8 transition-colors ${
                isDark 
                    ? 'border-slate-800 bg-slate-950 text-slate-400' 
                    : 'border-slate-200 bg-white text-slate-500'
            }`}>
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <p className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                            Pejabat Ketua Pendaftar Mahkamah Persekutuan Malaysia (PKPMP)
                        </p>
                        <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Istana Kehakiman, Presint 3, 62506 Putrajaya, Malaysia
                        </p>
                    </div>
                    <div className="flex items-center space-x-6 text-[11px]">
                        <span>BTM PKPMP &bull; Hak Cipta Terpelihara &copy; {new Date().getFullYear()}</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};
