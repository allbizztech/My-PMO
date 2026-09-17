import React, { useState } from 'react';
import {
    Shield, LogIn, ChevronLeft, ChevronRight,
    Target, Briefcase, DollarSign, Folder,
    PieChart, Eye, Activity, ShieldCheck
} from 'lucide-react';

export const LandingPage = ({ onNavigateToLogin }) => {
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
