import React, { useState } from 'react';
import { ArrowLeft, Shield, Lock, AlertCircle, CheckCircle2, KeyRound, Mail, X } from 'lucide-react';
import { API_ENDPOINTS } from '../services/api';

export const LoginPage = ({ onLogin, onBack }) => {
    const [email, setEmail] = useState('admin@kehakiman.gov.my');
    const [password, setPassword] = useState('password');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Self-Service Password Reset States
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [resetStep, setResetStep] = useState(1); // 1 = enter email, 2 = enter new password
    const [resetEmail, setResetEmail] = useState('');
    const [resetUserData, setResetUserData] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetError, setResetError] = useState('');
    const [resetSuccess, setResetSuccess] = useState('');
    const [isResetLoading, setIsResetLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const res = await fetch(API_ENDPOINTS.AUTH, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'login', email, password })
            });
            const data = await res.json();
            if (data.status === 'success') {
                onLogin(data.user);
            } else {
                setError(data.message || 'Log masuk gagal. Sila semak ID dan kata laluan anda.');
            }
        } catch (err) {
            setError('Gagal menyambung ke pelayan API.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenResetModal = () => {
        setResetStep(1);
        setResetEmail(email || '');
        setResetUserData(null);
        setNewPassword('');
        setConfirmPassword('');
        setResetError('');
        setResetSuccess('');
        setIsResetModalOpen(true);
    };

    const handleCheckEmail = async (e) => {
        e.preventDefault();
        setResetError('');
        setIsResetLoading(true);
        try {
            const res = await fetch(API_ENDPOINTS.AUTH, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'check_email_reset', email: resetEmail })
            });
            const data = await res.json();
            if (data.status === 'success' && data.data) {
                setResetUserData(data.data);
                setResetStep(2);
            } else {
                setResetError(data.message || 'Alamat e-mel tidak ditemui dalam rekod pengguna aktif.');
            }
        } catch (err) {
            setResetError('Ralat berhubung dengan pelayan. Sila cuba sebentar lagi.');
        } finally {
            setIsResetLoading(false);
        }
    };

    const handleSaveNewPassword = async (e) => {
        e.preventDefault();
        setResetError('');

        if (newPassword.length < 6) {
            setResetError('Kata laluan baharu mestilah sekurang-kurangnya 6 aksara.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setResetError('Kata laluan baharu dan pengesahan kata laluan tidak sepadan.');
            return;
        }

        setIsResetLoading(true);
        try {
            const res = await fetch(API_ENDPOINTS.AUTH, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'self_reset_password',
                    email: resetEmail,
                    new_password: newPassword
                })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setResetSuccess(data.message || 'Kata laluan baharu berjaya disimpan!');
                setEmail(resetEmail);
                setPassword('');
                setTimeout(() => {
                    setIsResetModalOpen(false);
                }, 2000);
            } else {
                setResetError(data.message || 'Gagal menetapkan semula kata laluan.');
            }
        } catch (err) {
            setResetError('Ralat berhubung dengan pelayan semasa menetapkan kata laluan.');
        } finally {
            setIsResetLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
            {/* Top Navigation Bar */}
            <div className="w-full max-w-4xl mb-4 flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="inline-flex items-center text-xs font-bold text-slate-600 hover:text-indigo-600 transition-all group active:scale-95 cursor-pointer bg-white hover:bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1 text-slate-400 group-hover:text-indigo-600" />
                    <span>Kembali ke Laman Utama</span>
                </button>
                <div className="text-[11px] text-slate-500 font-semibold hidden sm:block">
                    Pejabat Ketua Pendaftar Mahkamah Persekutuan Malaysia (PKPMP)
                </div>
            </div>

            {/* Login Card */}
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden grid md:grid-cols-5 min-h-[520px]">
                {/* Left Brand Panel with Istana Kehakiman Background */}
                <div className="relative md:col-span-2 bg-slate-900 p-8 sm:p-10 flex flex-col justify-between text-white border-r border-slate-800 overflow-hidden">
                    {/* Background Image Istana Kehakiman di dalam kad */}
                    <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
                        <img 
                            src="/My-PMO/istana-kehakiman.png" 
                            alt="Istana Kehakiman Putrajaya" 
                            className="w-full h-full object-cover object-center scale-105 opacity-35 brightness-95 contrast-115 saturate-90"
                            style={{
                                transform: 'translateZ(0)',
                                backfaceVisibility: 'hidden'
                            }}
                        />
                        {/* Gradient Overlay Biru Tua/Navy Mewah */}
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-900/75 to-slate-950/90" />
                        <div className="absolute inset-0 bg-indigo-950/30 mix-blend-multiply" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center space-x-3 mb-10">
                            <img src="/My-PMO/logo.png" alt="MY-PMO Logo" className="w-12 h-12 rounded-xl object-contain shadow-lg shrink-0 border border-white/10" />
                            <div>
                                <span className="text-lg font-black tracking-tight block">MY-PMO</span>
                                <span className="text-[11px] text-slate-300 font-medium">Badan Kehakiman Malaysia</span>
                            </div>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black mb-3 leading-tight tracking-tight drop-shadow-sm">
                            Portal Pengurusan Projek
                        </h1>
                        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                            Sistem maklumat berpusat bagi penyelarasan inisiatif ICT, pemantauan milestone, dan pematuhan tatacara perolehan rasmi PKPMP.
                        </p>
                    </div>

                    <div className="relative z-10 pt-6 border-t border-slate-700/80 text-[11px] text-slate-300 flex items-start space-x-2">
                        <Lock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <p className="leading-snug">
                            Sistem Terperingkat. Akses terhad kepada pegawai berdaftar dan pihak berkepentingan yang diberi kebenaran sahaja.
                        </p>
                    </div>
                </div>

                {/* Right Form Panel */}
                <div className="md:col-span-3 p-8 sm:p-12 flex flex-col justify-center bg-white">
                    <div className="mb-8">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Log Masuk Pegawai</h2>
                        <p className="text-slate-500 mt-1 text-xs sm:text-sm">Sila masukkan ID e-mel rasmi dan kata laluan anda untuk meneruskan.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-semibold text-xs flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">E-mel Rasmi / ID Pengguna</label>
                            <input
                                type="text"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                placeholder="nama@kehakiman.gov.my"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all font-medium text-xs sm:text-sm text-slate-800"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Kata Laluan</label>
                                <button
                                    type="button"
                                    onClick={handleOpenResetModal}
                                    className="text-xs text-indigo-600 font-bold hover:underline cursor-pointer bg-transparent border-none p-0"
                                >
                                    Lupa kata laluan?
                                </button>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                placeholder="Masukkan kata laluan portal"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all font-medium text-xs sm:text-sm text-slate-800"
                            />
                        </div>

                        <div className="flex items-center text-xs pt-1">
                            <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                                <span className="text-slate-600 font-medium">Ingat kelayakan pada peranti ini</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3.5 rounded-xl shadow-md transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                        >
                            {isLoading ? 'Mengesahkan Kelayakan...' : 'Log Masuk Sistem'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Self-Service Password Reset Modal */}
            {isResetModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 sm:p-8 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                                    <KeyRound className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-base text-slate-900">Set Semula Kata Laluan</h3>
                                    <p className="text-xs text-slate-500">Penetapan kata laluan kendiri pengguna</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsResetModalOpen(false)}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {resetError && (
                            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-semibold text-xs flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                                <span>{resetError}</span>
                            </div>
                        )}

                        {resetSuccess && (
                            <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-semibold text-xs flex items-start gap-2.5">
                                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
                                <div>
                                    <p className="font-bold text-sm text-emerald-900 mb-1">Berjaya!</p>
                                    <p>{resetSuccess}</p>
                                </div>
                            </div>
                        )}

                        {/* Step 1: Masuk Email */}
                        {resetStep === 1 && !resetSuccess && (
                            <form onSubmit={handleCheckEmail} className="space-y-4">
                                <div>
                                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                                        Sila masukkan alamat e-mel berdaftar anda. Sistem akan mengesahkan akaun anda untuk membolehkan penetapan semula kata laluan.
                                    </p>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                                        E-mel Berdaftar Pengguna *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            required
                                            value={resetEmail}
                                            onChange={(e) => setResetEmail(e.target.value)}
                                            placeholder="nama@kehakiman.gov.my"
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all"
                                        />
                                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                                    </div>
                                </div>

                                <div className="pt-2 flex items-center justify-end gap-2.5">
                                    <button
                                        type="button"
                                        onClick={() => setIsResetModalOpen(false)}
                                        className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isResetLoading}
                                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
                                    >
                                        {isResetLoading ? 'Mengesahkan...' : 'Sahkan E-mel & Teruskan'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Step 2: Cipta Kata Laluan Baharu */}
                        {resetStep === 2 && !resetSuccess && (
                            <form onSubmit={handleSaveNewPassword} className="space-y-4">
                                <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-indigo-900 mb-2">
                                    <span className="font-bold block">Akaun Disahkan:</span>
                                    <span className="font-semibold text-slate-800">{resetUserData?.name}</span> ({resetEmail})
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                                        Kata Laluan Baharu *
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Minimum 6 aksara"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                                        Sahkan Kata Laluan Baharu *
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Ulangi kata laluan baharu"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all"
                                    />
                                </div>

                                <div className="pt-2 flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={() => setResetStep(1)}
                                        className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                                    >
                                        &larr; Tukar E-mel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isResetLoading}
                                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
                                    >
                                        {isResetLoading ? 'Menyimpan...' : 'Simpan Kata Laluan Baharu'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
