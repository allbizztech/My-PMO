import React, { useState, useEffect } from 'react';
import {
    Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus,
    Clock, CheckCircle2, AlertCircle, Flag, Target, Users,
    Filter, RefreshCw, Trash2, ArrowUpRight, ExternalLink, Briefcase
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { API_ENDPOINTS } from '../services/api';

const MALAY_MONTHS = [
    'Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun',
    'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'
];

export const CalendarPage = ({ onSelectProject, projects = [] }) => {
    const today = new Date();
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-11
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedProjectFilter, setSelectedProjectFilter] = useState('');
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

    // Modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedEventDetail, setSelectedEventDetail] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const daysOfWeek = ['Aha', 'Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab'];

    // Format current month string YYYY-MM
    const currentMonthStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;

    const fetchEvents = async () => {
        setIsLoading(true);
        try {
            let url = `${API_ENDPOINTS.CALENDAR}?month=${currentMonthStr}`;
            if (selectedProjectFilter) {
                url += `&project_id=${selectedProjectFilter}`;
            }
            const res = await fetch(url);
            const data = await res.json();
            if (data.status === 'success') {
                setEvents(data.data || []);
            }
        } catch (err) {
            console.error('Ralat mengambil acara kalendar:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [currentYear, currentMonth, selectedProjectFilter]);

    // Navigation handlers
    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(prev => prev - 1);
        } else {
            setCurrentMonth(prev => prev - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(prev => prev + 1);
        } else {
            setCurrentMonth(prev => prev + 1);
        }
    };

    const handleToday = () => {
        setCurrentYear(today.getFullYear());
        setCurrentMonth(today.getMonth());
    };

    // Calendar grid calculations
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const blanks = Array(firstDayIndex).fill(null);
    const days = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);

    // Filter events by category
    const filteredEvents = events.filter(e => {
        if (selectedCategoryFilter === 'all') return true;
        if (selectedCategoryFilter === 'task') return e.type === 'task';
        if (selectedCategoryFilter === 'milestone') return e.type === 'milestone';
        if (selectedCategoryFilter === 'meeting') return e.type === 'meeting' || e.type === 'review';
        if (selectedCategoryFilter === 'deadline') return e.type === 'deadline';
        return true;
    });

    const handleAddEventSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const formData = new FormData(e.target);

        try {
            const res = await fetch(API_ENDPOINTS.CALENDAR, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'create_event',
                    title: formData.get('title'),
                    event_date: formData.get('date'),
                    event_type: formData.get('type'),
                    project_id: formData.get('project_id') || null,
                    description: formData.get('description') || ''
                })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setIsAddModalOpen(false);
                fetchEvents();
            } else {
                alert(data.message || 'Gagal menyimpan acara.');
            }
        } catch (err) {
            alert('Ralat semasa berhubung dengan pelayan.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteCustomEvent = async (eventId) => {
        if (!window.confirm('Adakah anda pasti mahu memadam acara kalendar ini?')) return;
        try {
            const res = await fetch(`${API_ENDPOINTS.CALENDAR}?id=${eventId}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.status === 'success') {
                setSelectedEventDetail(null);
                fetchEvents();
            } else {
                alert(data.message || 'Gagal memadam acara.');
            }
        } catch (err) {
            alert('Ralat memadam acara.');
        }
    };

    return (
        <div className="space-y-6 flex flex-col h-full animate-in fade-in slide-in-from-bottom-3 duration-500 relative">
            {/* Modal Tambah Acara Kalendar */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsAddModalOpen(false)}></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200 border border-slate-100">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-3xl">
                                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                                    <CalendarIcon className="w-5 h-5 text-indigo-600" />
                                    Tambah Acara / Mesyuarat Baharu
                                </h3>
                                <button onClick={() => setIsAddModalOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center border border-slate-200 text-slate-500 hover:text-slate-900 bg-white cursor-pointer">&times;</button>
                            </div>
                            <form onSubmit={handleAddEventSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Tajuk Acara / Mesyuarat *</label>
                                    <input
                                        name="title"
                                        required
                                        type="text"
                                        placeholder="cth: Mesyuarat Lembaga PMO Bil. 3/2026"
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Tarikh Acara *</label>
                                        <input
                                            name="date"
                                            required
                                            type="date"
                                            defaultValue={`${currentMonthStr}-15`}
                                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Kategori Acara</label>
                                        <select
                                            name="type"
                                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500"
                                        >
                                            <option value="meeting">Mesyuarat PMO</option>
                                            <option value="review">Sesi Semakan / Audit</option>
                                            <option value="milestone">Pencapaian Fasa</option>
                                            <option value="deadline">Tarikh Akhir Penyerahan</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Pautan Projek (Pilihan)</label>
                                    <select
                                        name="project_id"
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500"
                                    >
                                        <option value="">-- Umum PKPMP (Tiada Projek Khusus) --</option>
                                        {projects.map(p => (
                                            <option key={p.id} value={p.id}>
                                                {p.project_code || `PRJ-${p.id}`} - {p.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Catatan / Lokasi</label>
                                    <textarea
                                        name="description"
                                        rows="3"
                                        placeholder="cth: Bilik Mesyuarat Utama Istana Kehakiman atau pautan Zoom..."
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500"
                                    ></textarea>
                                </div>

                                <div className="flex justify-end pt-3 border-t border-slate-100 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 cursor-pointer"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                                    >
                                        {isSaving ? 'Menyimpan...' : 'Simpan Acara'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Perincian Acara */}
            {selectedEventDetail && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedEventDetail(null)}></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200 border border-slate-100 p-6">
                            <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                                <div className="pr-3">
                                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold text-white mb-2 ${selectedEventDetail.color}`}>
                                        {selectedEventDetail.category_label || selectedEventDetail.type}
                                    </span>
                                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                                        {selectedEventDetail.title}
                                    </h3>
                                </div>
                                <button onClick={() => setSelectedEventDetail(null)} className="text-slate-400 hover:text-slate-700 font-bold text-lg">&times;</button>
                            </div>

                            <div className="mt-4 space-y-3 text-xs">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <span className="text-slate-500 font-bold flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5 text-indigo-600" /> Tarikh Sasaran:
                                    </span>
                                    <span className="font-extrabold text-slate-900 font-mono">
                                        {selectedEventDetail.event_date}
                                    </span>
                                </div>

                                {selectedEventDetail.project_name && (
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <span className="text-slate-400 text-[11px] font-bold block mb-1">Projek Terlibat:</span>
                                        <span className="font-bold text-slate-800 text-xs">
                                            {selectedEventDetail.project_name}
                                        </span>
                                    </div>
                                )}

                                {selectedEventDetail.description && (
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <span className="text-slate-400 text-[11px] font-bold block mb-1">Keterangan:</span>
                                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                                            {selectedEventDetail.description}
                                        </p>
                                    </div>
                                )}

                                {selectedEventDetail.status && (
                                    <div className="flex items-center justify-between pt-2">
                                        <span className="text-slate-400 font-bold">Status:</span>
                                        <Badge text={selectedEventDetail.status} />
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between items-center pt-5 mt-4 border-t border-slate-100">
                                {selectedEventDetail.is_editable ? (
                                    <button
                                        onClick={() => handleDeleteCustomEvent(selectedEventDetail.id)}
                                        className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" /> Padam Acara
                                    </button>
                                ) : (
                                    <span className="text-[11px] text-slate-400 italic">Disinkronkan daripada pangkalan data projek</span>
                                )}

                                {selectedEventDetail.project_id && onSelectProject && (
                                    <button
                                        onClick={() => {
                                            const proj = projects.find(p => p.id == selectedEventDetail.project_id || p.project_code == selectedEventDetail.project_id);
                                            if (proj) {
                                                onSelectProject(proj);
                                                setSelectedEventDetail(null);
                                            }
                                        }}
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ml-auto"
                                    >
                                        Buka Halaman Projek <ExternalLink className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header & Kawalan Navigasi Kalendar */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 shrink-0">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        Kalendar & Garis Masa Projek
                        {isLoading && <RefreshCw className="w-5 h-5 text-indigo-600 animate-spin" />}
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Jejak tarikh akhir tugasan Kanban, sasaran milestone bayaran, dan mesyuarat PMO PKPMP secara dinamik.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    {/* Penukar Bulan & Tahun */}
                    <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
                        <button
                            onClick={handlePrevMonth}
                            className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors cursor-pointer"
                            title="Bulan Sebelumnya"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="px-4 font-black text-slate-800 text-sm min-w-[140px] text-center">
                            {MALAY_MONTHS[currentMonth]} {currentYear}
                        </span>
                        <button
                            onClick={handleNextMonth}
                            className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors cursor-pointer"
                            title="Bulan Seterusnya"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <button
                        onClick={handleToday}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                        Hari Ini
                    </button>

                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center shadow-md text-xs transition-all active:scale-[0.98] cursor-pointer"
                    >
                        <Plus className="w-4 h-4 mr-1.5" /> Tambah Acara
                    </button>
                </div>
            </div>

            {/* Bar Penapis Projek & Kategori */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-slate-100 shadow-sm text-xs">
                <div className="flex flex-wrap items-center gap-1.5">
                    <button
                        onClick={() => setSelectedCategoryFilter('all')}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${selectedCategoryFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        Semua ({events.length})
                    </button>
                    <button
                        onClick={() => setSelectedCategoryFilter('milestone')}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 cursor-pointer ${selectedCategoryFilter === 'milestone' ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                    >
                        <Target className="w-3 h-3" /> Milestone Bayaran
                    </button>
                    <button
                        onClick={() => setSelectedCategoryFilter('task')}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 cursor-pointer ${selectedCategoryFilter === 'task' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                    >
                        <Clock className="w-3 h-3" /> Tugasan Kanban
                    </button>
                    <button
                        onClick={() => setSelectedCategoryFilter('meeting')}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 cursor-pointer ${selectedCategoryFilter === 'meeting' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                        <Users className="w-3 h-3" /> Mesyuarat PMO
                    </button>
                    <button
                        onClick={() => setSelectedCategoryFilter('deadline')}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 cursor-pointer ${selectedCategoryFilter === 'deadline' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
                    >
                        <CheckCircle2 className="w-3 h-3" /> Tarikh Akhir
                    </button>
                </div>

                {projects.length > 0 && (
                    <div className="flex items-center gap-2 shrink-0">
                        <Filter className="w-3.5 h-3.5 text-slate-400" />
                        <select
                            value={selectedProjectFilter}
                            onChange={(e) => setSelectedProjectFilter(e.target.value)}
                            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500"
                        >
                            <option value="">Semua Projek PKPMP</option>
                            {projects.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.project_code || `PRJ-${p.id}`} - {p.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Grid Kalendar Dinamik Sebenar */}
            <div className="flex-1 grid grid-cols-1 xl:grid-cols-4 gap-6 min-h-0">
                <Card className="xl:col-span-3 flex flex-col h-full overflow-hidden" noPadding>
                    <div className="p-5 lg:p-6 flex-1 flex flex-col overflow-y-auto">
                        {/* Hari Seminggu */}
                        <div className="grid grid-cols-7 mb-3 shrink-0">
                            {daysOfWeek.map(d => (
                                <div key={d} className="text-center text-xs font-black text-slate-400 uppercase tracking-widest py-1">
                                    {d}
                                </div>
                            ))}
                        </div>

                        {/* Grid Hari */}
                        <div className="flex-1 grid grid-cols-7 auto-rows-fr gap-1.5 bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/60 min-h-[550px]">
                            {blanks.map((_, i) => (
                                <div key={`blank-${i}`} className="bg-slate-50/50 rounded-xl p-2 min-h-[90px] opacity-40"></div>
                            ))}

                            {days.map(d => {
                                const dayStr = `${currentMonthStr}-${String(d).padStart(2, '0')}`;
                                const isToday = today.getFullYear() === currentYear && today.getMonth() === currentMonth && today.getDate() === d;
                                const dayEvents = filteredEvents.filter(e => e.event_date === dayStr);

                                return (
                                    <div
                                        key={`day-${d}`}
                                        className={`bg-white rounded-xl p-2 min-h-[90px] flex flex-col justify-between border transition-all hover:border-indigo-300 hover:shadow-sm ${isToday ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-slate-100'}`}
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className={`text-xs font-black w-6 h-6 rounded-full flex items-center justify-center ${isToday ? 'bg-indigo-600 text-white' : 'text-slate-700'}`}>
                                                {d}
                                            </span>
                                            {dayEvents.length > 0 && (
                                                <span className="text-[10px] font-extrabold text-slate-400">
                                                    {dayEvents.length}
                                                </span>
                                            )}
                                        </div>

                                        <div className="space-y-1 overflow-y-auto max-h-[85px] flex-1">
                                            {dayEvents.map(ev => (
                                                <div
                                                    key={ev.id}
                                                    onClick={() => setSelectedEventDetail(ev)}
                                                    className={`p-1 rounded-md text-[10px] font-bold text-white truncate cursor-pointer transition-transform hover:scale-[1.02] shadow-xs ${ev.color}`}
                                                    title={`${ev.title} (${ev.category_label || ev.type})`}
                                                >
                                                    {ev.title}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </Card>

                {/* Bar Sisi: Senarai Acara Bulan Ini */}
                <div className="space-y-4 flex flex-col">
                    <Card className="flex-1 flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                                <CalendarIcon className="w-4 h-4 text-indigo-600" />
                                Acara {MALAY_MONTHS[currentMonth]} {currentYear}
                            </h3>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                {filteredEvents.length}
                            </span>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[550px]">
                            {filteredEvents.length > 0 ? (
                                filteredEvents.map(ev => (
                                    <div
                                        key={ev.id}
                                        onClick={() => setSelectedEventDetail(ev)}
                                        className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-indigo-200 hover:shadow-xs transition-all cursor-pointer group"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0 flex-1">
                                                <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-extrabold text-white mb-1 ${ev.color}`}>
                                                    {ev.category_label || ev.type}
                                                </span>
                                                <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                                                    {ev.title}
                                                </h4>
                                                {ev.project_name && (
                                                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                                                        {ev.project_name}
                                                    </p>
                                                )}
                                            </div>
                                            <span className="text-[11px] font-black text-slate-700 font-mono shrink-0 bg-white px-2 py-1 rounded-lg border border-slate-200/60">
                                                {ev.event_date.split('-')[2]} {MALAY_MONTHS[parseInt(ev.event_date.split('-')[1]) - 1]?.substring(0, 3)}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-12 text-center text-slate-400 text-xs font-medium">
                                    Tiada acara direkodkan untuk bulan ini.
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;
