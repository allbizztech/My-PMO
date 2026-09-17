import React, { useState } from 'react';
import {
    CalendarDays, CheckCircle2, ArrowUpRight,
    ArrowDownRight, MoreVertical, RefreshCw, Eye,
    BarChart2, Briefcase, Activity, AlertCircle
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { DonutChart } from '../components/common/DonutChart';

export const DashboardPage = ({ setView, onSelectFilter, showToastNotification, projects = [], currentUser }) => {
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
