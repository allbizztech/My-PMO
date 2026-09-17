import React, { useState } from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import { API_ENDPOINTS } from '../services/api';

export const LoginPage = ({ onLogin, onBack }) => {
    const [email, setEmail] = useState('admin@kehakiman.gov.my');
    const [password, setPassword] = useState('password');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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
