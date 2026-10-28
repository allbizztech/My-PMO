import React, { useState, useEffect } from 'react';
import {
    Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus,
    Clock, CheckCircle2, AlertCircle, Flag, Target, Users,
    Filter, RefreshCw, Trash2, ArrowUpRight, ExternalLink, Briefcase,
    Mail, Send, Download, MapPin, Video, FileText, Check, X,
    Sparkles, UserCheck, AlertTriangle, Layers, BookmarkCheck,
    UserPlus, Info, CheckSquare
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { API_ENDPOINTS } from '../services/api';

const MALAY_MONTHS = [
    'Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun',
    'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'
];

const DEFAULT_AGENDA_TEMPLATE = `1. Perutusan Pengerusi
2. Pengesahan Minit Mesyuarat Bil. Lepas
3. Pembentangan Kemajuan Projek & Pencapaian Fasa
4. Perbincangan Isu Teknikal, Risiko & Kewangan
5. Hal-hal Lain & Tindakan Susulan`;

export const CalendarPage = ({ onSelectProject, projects = [] }) => {
    const today = new Date();
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-11
    const [events, setEvents] = useState([]);
    const [systemUsers, setSystemUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedProjectFilter, setSelectedProjectFilter] = useState('');
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

    // Modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedEventDetail, setSelectedEventDetail] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isSendingInvite, setIsSendingInvite] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Borang Tambah Mesyuarat States
    const [selectedAttendees, setSelectedAttendees] = useState([]);
    const [customEmailInput, setCustomEmailInput] = useState('');
    const [ccAttendees, setCcAttendees] = useState([]);
    const [bccAttendees, setBccAttendees] = useState([]);
    const [customCcInput, setCustomCcInput] = useState('');
    const [customBccInput, setCustomBccInput] = useState('');
    const [showCcField, setShowCcField] = useState(false);
    const [showBccField, setShowBccField] = useState(false);
    const [agendaInput, setAgendaInput] = useState(DEFAULT_AGENDA_TEMPLATE);
    const [sendInviteOnCreate, setSendInviteOnCreate] = useState(true);

    // Templat E-mel States
    const [templates, setTemplates] = useState([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState('');
    const [showTemplatePreview, setShowTemplatePreview] = useState(false);

    // Status Konfigurasi SMTP
    const [smtpStatus, setSmtpStatus] = useState({ isConfigured: true, checked: false });

    const daysOfWeek = ['Aha', 'Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab'];

    // Format current month string YYYY-MM
    const currentMonthStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;

    const showLocalToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 4000);
    };

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

    const fetchSystemUsers = async () => {
        try {
            const res = await fetch('/My-PMO/api/modules/users.php');
            const data = await res.json();
            if (data.status === 'success' && Array.isArray(data.data)) {
                setSystemUsers(data.data);
            }
        } catch (err) {
            console.error('Ralat mengambil senarai pengguna:', err);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [currentYear, currentMonth, selectedProjectFilter]);

    const fetchTemplates = async () => {
        try {
            const res = await fetch('/My-PMO/api/modules/email_templates.php');
            const data = await res.json();
            if (data.status === 'success' && Array.isArray(data.data)) {
                setTemplates(data.data);
                const defaultTpl = data.data.find(t => t.is_default == 1);
                if (defaultTpl) {
                    setSelectedTemplateId(defaultTpl.id);
                } else if (data.data.length > 0) {
                    setSelectedTemplateId(data.data[0].id);
                }
            }
        } catch (err) {
            console.error('Ralat mengambil templat e-mel:', err);
        }
    };

    const fetchSmtpStatus = async () => {
        try {
            const res = await fetch('/My-PMO/api/modules/smtp_settings.php');
            const data = await res.json();
            if (data.status === 'success' && data.data) {
                const hasPass = Boolean(data.data.smtp_pass && String(data.data.smtp_pass).trim().length > 0);
                const isActive = data.data.is_active == 1;
                setSmtpStatus({
                    isConfigured: hasPass && isActive,
                    checked: true,
                    host: data.data.smtp_host || '',
                    user: data.data.smtp_user || ''
                });
            }
        } catch (err) {
            console.error('Ralat menyemak status SMTP:', err);
        }
    };

    useEffect(() => {
        fetchSystemUsers();
        fetchTemplates();
        fetchSmtpStatus();
    }, []);

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

    // Helper: Jana Pautan Microsoft Outlook Web Deep Link
    const getOutlookWebLink = (event) => {
        if (!event) return '#';
        const title = encodeURIComponent(event.title || 'Mesyuarat PMO PKPMP');
        const loc = encodeURIComponent(event.location || (event.meeting_link ? 'Atas Talian / Microsoft Teams' : 'Bilik Mesyuarat Utama PKPMP'));

        const eventDate = event.event_date || new Date().toISOString().split('T')[0];
        const startTime = event.start_time ? (event.start_time.length === 5 ? event.start_time + ':00' : event.start_time) : '09:00:00';
        const endTime = event.end_time ? (event.end_time.length === 5 ? event.end_time + ':00' : event.end_time) : '10:00:00';

        const startDt = encodeURIComponent(`${eventDate}T${startTime}`);
        const endDt = encodeURIComponent(`${eventDate}T${endTime}`);

        let bodyContent = '';
        if (event.description) {
            bodyContent += `Keterangan: ${event.description}\n\n`;
        }
        if (event.agenda) {
            bodyContent += `AGENDA MESYUARAT:\n${event.agenda}\n\n`;
        }
        if (event.meeting_link) {
            bodyContent += `Pautan Mesyuarat (Online): ${event.meeting_link}\n\n`;
        }
        bodyContent += `---\nDijana secara automatik oleh Sistem MY-PMO PKPMP`;
        const body = encodeURIComponent(bodyContent);

        return `https://outlook.office.com/calendar/0/deeplink/compose?subject=${title}&startdt=${startDt}&enddt=${endDt}&location=${loc}&body=${body}`;
    };

    // Helper: Muat Turun Fail .ics untuk Outlook Desktop / Apple Calendar
    const handleDownloadICS = (event) => {
        const cleanId = event.real_id || (typeof event.id === 'string' && event.id.startsWith('custom_') ? event.id.replace('custom_', '') : event.id);
        window.open(`/My-PMO/api/modules/calendar.php?action=download_ics&id=${cleanId}`, '_blank');
        showLocalToast('Fail jemputan kalendar (.ics) berjaya dimuat turun!');
    };

    // Helper: Hantar Semula Jemputan E-mel Kalendar
    const handleResendInvitation = async (event) => {
        const cleanId = event.real_id || (typeof event.id === 'string' && event.id.startsWith('custom_') ? event.id.replace('custom_', '') : event.id);
        setIsSendingInvite(true);
        try {
            const res = await fetch(API_ENDPOINTS.CALENDAR, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'send_invitation',
                    event_id: cleanId
                })
            });
            const data = await res.json();
            if (data.status === 'success') {
                if (data.mail_report && (data.mail_report.status === 'skipped' || data.mail_report.status === 'failed')) {
                    alert(`Status Penghantaran E-mel:\n${data.mail_report.message || 'Gagal berhubung ke pelayan SMTP.'}\n\nSila pastikan kata laluan SMTP diisi di menu Tetapan Sistem > Konfigurasi E-mel (SMTP).\n\nSebagai alternatif, anda boleh menekan butang "Buka di Outlook Web" atau "Muat Turun .ics".`);
                } else {
                    showLocalToast(data.message || 'Jemputan mesyuarat dan lampiran Outlook berjaya dihantar!');
                }
                setSelectedEventDetail(prev => prev ? { ...prev, invite_status: 'sent' } : null);
                fetchEvents();
            } else {
                alert(data.message || 'Gagal menghantar jemputan mesyuarat.');
            }
        } catch (err) {
            alert('Ralat semasa berhubung dengan pelayan e-mel.');
        } finally {
            setIsSendingInvite(false);
        }
    };

    // Pengurusan Senarai Peserta Jemputan (To, CC, BCC, Kumpulan)
    const toggleAttendeeUser = (userEmail, target = 'to') => {
        if (target === 'to') {
            if (selectedAttendees.includes(userEmail)) {
                setSelectedAttendees(selectedAttendees.filter(e => e !== userEmail));
            } else {
                setSelectedAttendees([...selectedAttendees, userEmail]);
            }
        } else if (target === 'cc') {
            if (ccAttendees.includes(userEmail)) {
                setCcAttendees(ccAttendees.filter(e => e !== userEmail));
            } else {
                setCcAttendees([...ccAttendees, userEmail]);
            }
        }
    };

    const handleAddCustomEmail = (target = 'to') => {
        if (target === 'to') {
            const trimmed = customEmailInput.trim();
            if (!trimmed) return;
            if (!trimmed.includes('@')) {
                alert('Sila masukkan alamat e-mel yang sah.');
                return;
            }
            if (!selectedAttendees.includes(trimmed)) {
                setSelectedAttendees([...selectedAttendees, trimmed]);
            }
            setCustomEmailInput('');
        } else if (target === 'cc') {
            const trimmed = customCcInput.trim();
            if (!trimmed) return;
            if (!trimmed.includes('@')) {
                alert('Sila masukkan alamat e-mel CC yang sah.');
                return;
            }
            if (!ccAttendees.includes(trimmed)) {
                setCcAttendees([...ccAttendees, trimmed]);
            }
            setCustomCcInput('');
        } else if (target === 'bcc') {
            const trimmed = customBccInput.trim();
            if (!trimmed) return;
            if (!trimmed.includes('@')) {
                alert('Sila masukkan alamat e-mel BCC yang sah.');
                return;
            }
            if (!bccAttendees.includes(trimmed)) {
                setBccAttendees([...bccAttendees, trimmed]);
            }
            setCustomBccInput('');
        }
    };

    const handleRemoveAttendee = (emailToRemove, target = 'to') => {
        if (target === 'to') {
            setSelectedAttendees(selectedAttendees.filter(e => e !== emailToRemove));
        } else if (target === 'cc') {
            setCcAttendees(ccAttendees.filter(e => e !== emailToRemove));
        } else if (target === 'bcc') {
            setBccAttendees(bccAttendees.filter(e => e !== emailToRemove));
        }
    };

    // Tambah Kumpulan Pengguna Secara Pukal (PMO, Agensi, Vendor)
    const handleAddGroupEmails = (groupType, target = 'to') => {
        let groupEmails = [];
        if (groupType === 'pmo') {
            groupEmails = systemUsers
                .filter(u => u.role === 'admin' || u.role === 'pmo' || (u.department && u.department.toLowerCase().includes('pmo')))
                .map(u => u.email)
                .filter(Boolean);
        } else if (groupType === 'agency') {
            groupEmails = systemUsers
                .filter(u => u.role === 'stakeholder' || u.role === 'agency_admin')
                .map(u => u.email)
                .filter(Boolean);
        } else if (groupType === 'vendor') {
            groupEmails = systemUsers
                .filter(u => u.role === 'vendor')
                .map(u => u.email)
                .filter(Boolean);
        }

        if (groupEmails.length === 0) {
            alert(`Tiada pengguna ditemui dalam kumpulan ${groupType.toUpperCase()}.`);
            return;
        }

        if (target === 'to') {
            const combined = Array.from(new Set([...selectedAttendees, ...groupEmails]));
            setSelectedAttendees(combined);
            showLocalToast(`${groupEmails.length} pengguna kumpulan ditambah ke senarai Utama (To)!`);
        } else if (target === 'cc') {
            const combined = Array.from(new Set([...ccAttendees, ...groupEmails]));
            setCcAttendees(combined);
            showLocalToast(`${groupEmails.length} pengguna kumpulan ditambah ke senarai Salinan (CC)!`);
        }
    };

    const handleAddEventSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const formData = new FormData(e.target);

        const startTime = formData.get('start_time') || '09:00';
        const endTime = formData.get('end_time') || '10:00';

        if (startTime >= endTime) {
            alert('Masa mula mestilah sebelum masa tamat.');
            setIsSaving(false);
            return;
        }

        try {
            const res = await fetch(API_ENDPOINTS.CALENDAR, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'create_event',
                    title: formData.get('title'),
                    event_date: formData.get('date'),
                    start_time: startTime,
                    end_time: endTime,
                    event_type: formData.get('type') || 'meeting',
                    location: formData.get('location') || '',
                    meeting_link: formData.get('meeting_link') || '',
                    project_id: formData.get('project_id') || null,
                    description: formData.get('description') || '',
                    agenda: agendaInput,
                    attendees: selectedAttendees,
                    cc_emails: ccAttendees,
                    bcc_emails: bccAttendees,
                    template_id: selectedTemplateId || null,
                    send_invite: sendInviteOnCreate
                })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setIsAddModalOpen(false);
                setSelectedAttendees([]);
                setCcAttendees([]);
                setBccAttendees([]);
                setShowCcField(false);
                setShowBccField(false);
                setAgendaInput(DEFAULT_AGENDA_TEMPLATE);
                
                // Diagnostic warning if SMTP was not fully ready
                if (data.mail_report && (data.mail_report.status === 'skipped' || data.mail_report.status === 'failed')) {
                    alert(`Acara berjaya dicipta!
Peringatan E-mel: ${data.mail_report.message || 'E-mel jemputan belum dihantar kerana kata laluan SMTP belum dikonfigurasikan di Tetapan Sistem.'}\n\nAnda boleh menggunakan fungsi 'Buka di Outlook Web' atau muat turun fail .ics di perincian acara.`);
                } else {
                    showLocalToast(data.message || 'Acara mesyuarat berjaya dicipta dan jemputan diselaraskan!');
                }
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
                showLocalToast('Acara berjaya dipadam.');
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
            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-4 fade-in duration-300">
                    <div className="bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center space-x-3 border border-slate-800">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span className="font-bold text-xs">{toastMessage}</span>
                    </div>
                </div>
            )}

            {/* Modal Tambah Acara / Mesyuarat Baharu */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={() => setIsAddModalOpen(false)}></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl animate-in zoom-in-95 duration-200 border border-slate-200 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                <div>
                                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                                        <CalendarIcon className="w-5 h-5 text-indigo-600" />
                                        Cipta Acara / Jemputan Mesyuarat Baharu
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">Jana rekod kalendar berserta jemputan automatik ke perisian Microsoft Outlook</p>
                                </div>
                                <button onClick={() => setIsAddModalOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center border border-slate-200 text-slate-400 hover:text-slate-800 bg-white cursor-pointer">&times;</button>
                            </div>

                            <form onSubmit={handleAddEventSubmit} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Tajuk Acara / Mesyuarat *</label>
                                    <input
                                        name="title"
                                        required
                                        type="text"
                                        placeholder="cth: Mesyuarat Jawatankuasa Pemandu ICT Bil. 4/2026"
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Tarikh Acara *</label>
                                        <input
                                            name="date"
                                            required
                                            type="date"
                                            defaultValue={`${currentMonthStr}-15`}
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Masa Mula *</label>
                                        <input
                                            name="start_time"
                                            type="time"
                                            defaultValue="10:00"
                                            required
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Masa Tamat *</label>
                                        <input
                                            name="end_time"
                                            type="time"
                                            defaultValue="11:30"
                                            required
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Kategori Acara</label>
                                        <select
                                            name="type"
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-indigo-500"
                                        >
                                            <option value="meeting">Mesyuarat PMO / Lembaga</option>
                                            <option value="review">Sesi Semakan / Audit</option>
                                            <option value="milestone">Pencapaian Fasa / Jadual Bayaran</option>
                                            <option value="deadline">Tarikh Akhir Penyerahan</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Pautan Projek (Pilihan)</label>
                                        <select
                                            name="project_id"
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-indigo-500"
                                        >
                                            <option value="">-- Umum PKPMP (Tiada Projek Khusus) --</option>
                                            {projects.map(p => (
                                                <option key={p.id} value={p.id}>
                                                    {p.project_code || `PRJ-${p.id}`} - {p.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5 text-indigo-600" /> Lokasi Fizikal
                                        </label>
                                        <input
                                            name="location"
                                            type="text"
                                            placeholder="cth: Bilik Mesyuarat Aras 4, Istana Kehakiman"
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                            <Video className="w-3.5 h-3.5 text-indigo-600" /> Pautan Microsoft Teams / Maya
                                        </label>
                                        <input
                                            name="meeting_link"
                                            type="url"
                                            placeholder="cth: https://teams.microsoft.com/l/meetup-join/..."
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                </div>

                                {/* SMTP WARNING BANNER JIKA BELUM KONFIGURASI KATA LALUAN */}
                                {!smtpStatus.isConfigured && (
                                    <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                        <div className="text-[11px] text-amber-900 leading-relaxed">
                                            <span className="font-extrabold block mb-0.5">Peringatan Penghantaran E-mel (SMTP Belum Lengkap):</span>
                                            Pelayan SMTP belum dikonfigurasikan dengan kata laluan di <strong>Tetapan Sistem</strong>. E-mel automatik tidak dapat sampai ke peti masuk Outlook/Zimbra/Gmail secara terus. Anda masih boleh menjadualkan mesyuarat dan menekan <strong>"Buka di Outlook Web"</strong> atau memuat turun fail <strong>.ics</strong> selepas disimpan.
                                        </div>
                                    </div>
                                )}

                                {/* PILIHAN TEMPLAT JEMPUTAN E-MEL */}
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                            <Layers className="w-4 h-4 text-indigo-600" />
                                            Templat Jemputan E-mel
                                        </label>
                                        <span className="text-[10px] text-slate-400">
                                            Boleh diurus di Tetapan &gt; Templat E-mel
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                        <div className="sm:col-span-2">
                                            <select
                                                value={selectedTemplateId}
                                                onChange={(e) => setSelectedTemplateId(e.target.value)}
                                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500"
                                            >
                                                {templates.map(t => (
                                                    <option key={t.id} value={t.id}>
                                                        {t.name} {t.is_default == 1 ? '★ (Lalai)' : ''}
                                                    </option>
                                                ))}
                                                {templates.length === 0 && (
                                                    <option value="">-- Templat Asas Sistem PMO --</option>
                                                )}
                                            </select>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowTemplatePreview(!showTemplatePreview)}
                                            className="px-3 py-2 bg-white hover:bg-slate-100 text-indigo-600 border border-indigo-200 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                                        >
                                            <FileText className="w-3.5 h-3.5" />
                                            <span>{showTemplatePreview ? 'Tutup Pratonton' : 'Pratonton Format'}</span>
                                        </button>
                                    </div>

                                    {/* Box Pratonton Templat */}
                                    {showTemplatePreview && selectedTemplateId && (() => {
                                        const currentTpl = templates.find(t => t.id == selectedTemplateId);
                                        if (!currentTpl) return null;
                                        return (
                                            <div className="p-3 bg-white rounded-xl border border-indigo-100 animate-in fade-in duration-200">
                                                <p className="text-[10px] font-bold text-slate-400 mb-1">Subjek E-mel:</p>
                                                <p className="text-xs font-mono font-bold text-indigo-900 mb-2">{currentTpl.subject}</p>
                                                <p className="text-[10px] font-bold text-slate-400 mb-1">Kandungan Surat Jemputan:</p>
                                                <pre className="text-[11px] font-sans text-slate-700 whitespace-pre-wrap max-h-32 overflow-y-auto leading-relaxed p-2 bg-slate-50 rounded-lg border border-slate-100">
                                                    {currentTpl.body}
                                                </pre>
                                            </div>
                                        );
                                    })()}
                                </div>

                                {/* AGENDA MESYUARAT */}
                                <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100/70 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                            <FileText className="w-4 h-4 text-indigo-600" />
                                            Agenda Mesyuarat
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setAgendaInput(DEFAULT_AGENDA_TEMPLATE)}
                                            className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer transition-colors"
                                            title="Isi templat agenda piawai"
                                        >
                                            <Sparkles className="w-3.5 h-3.5" /> Gunakan Templat Rasmi
                                        </button>
                                    </div>
                                    <p className="text-[11px] text-slate-500 leading-relaxed">
                                        Agenda ini akan dipaparkan dalam fail kalendar (.ics) serta badan jemputan Microsoft Outlook peserta.
                                    </p>
                                    <textarea
                                        value={agendaInput}
                                        onChange={(e) => setAgendaInput(e.target.value)}
                                        rows="4"
                                        placeholder="Masukkan perkara-perkara agenda mesyuarat mengikut nombor..."
                                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-mono leading-relaxed text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50"
                                    ></textarea>
                                </div>

                                {/* JEMPUTAN PESERTA (OUTLOOK, ZIMBRA, GMAIL) */}
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div>
                                            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                                <Users className="w-4 h-4 text-indigo-600" />
                                                Senarai Penerima Jemputan (To, CC, BCC)
                                            </label>
                                            <p className="text-[10px] text-slate-500">
                                                Serasi dengan Outlook, Zimbra Webmail, Gmail & Apple Mail (RFC 5545)
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setShowCcField(!showCcField)}
                                                className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer border ${showCcField ? 'bg-indigo-100 text-indigo-700 border-indigo-300' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                                            >
                                                {showCcField ? '✓ Salinan (CC)' : '+ Tambah CC'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowBccField(!showBccField)}
                                                className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer border ${showBccField ? 'bg-indigo-100 text-indigo-700 border-indigo-300' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                                            >
                                                {showBccField ? '✓ Tersembunyi (BCC)' : '+ Tambah BCC'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Butang Pilihan Kumpulan E-mel (Group Emails) */}
                                    <div className="p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100">
                                        <p className="text-[10px] font-bold text-indigo-900 mb-1.5 flex items-center gap-1">
                                            <UserPlus className="w-3 h-3 text-indigo-600" />
                                            Pilihan Pantas Mengikut Kumpulan (Distribution Lists):
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() => handleAddGroupEmails('pmo', 'to')}
                                                className="px-2.5 py-1 bg-white hover:bg-indigo-50 border border-indigo-200 rounded-lg text-[10px] font-bold text-indigo-700 shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                                                title="Tambah semua pegawai PMO PKPMP"
                                            >
                                                <span>👥 Semua Pegawai PMO PKPMP</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleAddGroupEmails('agency', 'to')}
                                                className="px-2.5 py-1 bg-white hover:bg-indigo-50 border border-indigo-200 rounded-lg text-[10px] font-bold text-indigo-700 shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                                                title="Tambah semua pentadbir agensi"
                                            >
                                                <span>🏛️ Semua Pentadbir Agensi</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleAddGroupEmails('vendor', 'to')}
                                                className="px-2.5 py-1 bg-white hover:bg-indigo-50 border border-indigo-200 rounded-lg text-[10px] font-bold text-indigo-700 shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                                                title="Tambah semua wakil vendor berdaftar"
                                            >
                                                <span>🏢 Semua Vendor PMO</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* KEPADA / TO (Penerima Utama) */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-[11px] font-bold text-slate-700">Kepada (To / Wajib Hadir):</span>
                                            <span className="text-[10px] font-extrabold px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">
                                                {selectedAttendees.length} Peserta
                                            </span>
                                        </div>

                                        {/* Senarai Pegawai Individu */}
                                        {systemUsers.length > 0 && (
                                            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1 mb-2">
                                                {systemUsers.map(u => {
                                                    const isChecked = selectedAttendees.includes(u.email);
                                                    return (
                                                        <button
                                                            key={u.id}
                                                            type="button"
                                                            onClick={() => toggleAttendeeUser(u.email, 'to')}
                                                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer border ${isChecked ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'}`}
                                                        >
                                                            {isChecked ? <Check className="w-2.5 h-2.5 text-white" /> : <Plus className="w-2.5 h-2.5 text-slate-400" />}
                                                            <span>{u.name}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* Input Tambah E-mel Manual / Kumpulan */}
                                        <div className="flex gap-2">
                                            <input
                                                type="email"
                                                value={customEmailInput}
                                                onChange={(e) => setCustomEmailInput(e.target.value)}
                                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomEmail('to'); } }}
                                                placeholder="cth: vendor@allbizztech.com atau group-ict@kehakiman.gov.my"
                                                className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleAddCustomEmail('to')}
                                                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                                            >
                                                Tambah
                                            </button>
                                        </div>

                                        {/* Senarai Terpilih (To) */}
                                        {selectedAttendees.length > 0 && (
                                            <div className="pt-2 flex flex-wrap gap-1.5">
                                                {selectedAttendees.map(att => (
                                                    <span key={att} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-semibold text-slate-700 shadow-xs">
                                                        <Mail className="w-3 h-3 text-indigo-500" />
                                                        <span>{att}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveAttendee(att, 'to')}
                                                            className="text-slate-400 hover:text-rose-500 ml-1 cursor-pointer"
                                                        >
                                                            &times;
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* SALINAN KEPADA (CC) */}
                                    {showCcField && (
                                        <div className="pt-2 border-t border-slate-200/80 animate-in fade-in duration-200">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className="text-[11px] font-bold text-slate-700">Salinan Kepada (CC / Pilihan):</span>
                                                <span className="text-[10px] font-extrabold px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full">
                                                    {ccAttendees.length} CC
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <input
                                                    type="email"
                                                    value={customCcInput}
                                                    onChange={(e) => setCustomCcInput(e.target.value)}
                                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomEmail('cc'); } }}
                                                    placeholder="cth: ketua-seksyen@kehakiman.gov.my"
                                                    className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleAddCustomEmail('cc')}
                                                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                                                >
                                                    Tambah CC
                                                </button>
                                            </div>
                                            {ccAttendees.length > 0 && (
                                                <div className="pt-2 flex flex-wrap gap-1.5">
                                                    {ccAttendees.map(att => (
                                                        <span key={att} className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 border border-indigo-200 rounded-lg text-[10px] font-semibold text-indigo-800">
                                                            <Mail className="w-3 h-3 text-indigo-500" />
                                                            <span>{att}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveAttendee(att, 'cc')}
                                                                className="text-indigo-400 hover:text-rose-500 ml-1 cursor-pointer"
                                                            >
                                                                &times;
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* SALINAN TERSEMBUNYI (BCC) */}
                                    {showBccField && (
                                        <div className="pt-2 border-t border-slate-200/80 animate-in fade-in duration-200">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className="text-[11px] font-bold text-slate-700">Salinan Tersembunyi (BCC):</span>
                                                <span className="text-[10px] font-extrabold px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full">
                                                    {bccAttendees.length} BCC
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <input
                                                    type="email"
                                                    value={customBccInput}
                                                    onChange={(e) => setCustomBccInput(e.target.value)}
                                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomEmail('bcc'); } }}
                                                    placeholder="cth: audit-dalaman@kehakiman.gov.my"
                                                    className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleAddCustomEmail('bcc')}
                                                    className="px-3.5 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                                                >
                                                    Tambah BCC
                                                </button>
                                            </div>
                                            {bccAttendees.length > 0 && (
                                                <div className="pt-2 flex flex-wrap gap-1.5">
                                                    {bccAttendees.map(att => (
                                                        <span key={att} className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 border border-slate-300 rounded-lg text-[10px] font-semibold text-slate-700">
                                                            <Mail className="w-3 h-3 text-slate-500" />
                                                            <span>{att}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveAttendee(att, 'bcc')}
                                                                className="text-slate-400 hover:text-rose-500 ml-1 cursor-pointer"
                                                            >
                                                                &times;
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Catatan Tambahan (Pilihan)</label>
                                    <textarea
                                        name="description"
                                        rows="2"
                                        placeholder="cth: Mohon bawa bersama slaid pembentangan fasa perolehan..."
                                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-indigo-500"
                                    ></textarea>
                                </div>

                                {/* Suis Hantar Jemputan E-mel */}
                                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-100/80 border border-slate-200/80">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                                            <Send className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900">Hantar Jemputan Kalendar Outlook Sekarang</p>
                                            <p className="text-[11px] text-slate-500">Sistem akan menghantar e-mel berlampirkan fail .ics kepada semua {selectedAttendees.length} peserta terpilih</p>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={sendInviteOnCreate}
                                        onChange={(e) => setSendInviteOnCreate(e.target.checked)}
                                        className="w-5 h-5 accent-indigo-600 cursor-pointer rounded"
                                    />
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
                                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                                    >
                                        <CalendarIcon className="w-4 h-4" />
                                        <span>{isSaving ? 'Menyimpan...' : (sendInviteOnCreate && selectedAttendees.length > 0 ? 'Simpan & Hantar Jemputan' : 'Simpan Acara')}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Perincian Acara & Integrasi Kalendar Outlook */}
            {selectedEventDetail && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setSelectedEventDetail(null)}></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200 border border-slate-100 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50">
                                <div className="pr-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold text-white ${selectedEventDetail.color}`}>
                                            {selectedEventDetail.category_label || selectedEventDetail.type}
                                        </span>
                                        {selectedEventDetail.invite_status === 'sent' && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                                <UserCheck className="w-3 h-3" /> Jemputan Dihantar
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                                        {selectedEventDetail.title}
                                    </h3>
                                </div>
                                <button onClick={() => setSelectedEventDetail(null)} className="w-8 h-8 rounded-full flex items-center justify-center border border-slate-200 text-slate-400 hover:text-slate-800 bg-white cursor-pointer">&times;</button>
                            </div>

                            <div className="p-6 space-y-3.5 text-xs max-h-[72vh] overflow-y-auto">
                                {/* Masa & Tarikh */}
                                <div className="grid grid-cols-2 gap-2.5">
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <span className="text-slate-400 font-bold block mb-1 flex items-center gap-1">
                                            <CalendarIcon className="w-3.5 h-3.5 text-indigo-600" /> Tarikh:
                                        </span>
                                        <span className="font-extrabold text-slate-900 font-mono text-xs">
                                            {selectedEventDetail.event_date}
                                        </span>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <span className="text-slate-400 font-bold block mb-1 flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5 text-indigo-600" /> Masa:
                                        </span>
                                        <span className="font-extrabold text-slate-900 font-mono text-xs">
                                            {selectedEventDetail.start_time || '09:00'} - {selectedEventDetail.end_time || '10:00'}
                                        </span>
                                    </div>
                                </div>

                                {/* Lokasi Fizikal & Pautan Teams */}
                                {(selectedEventDetail.location || selectedEventDetail.meeting_link) && (
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                                        {selectedEventDetail.location && (
                                            <div className="flex items-start gap-2">
                                                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                                <div>
                                                    <span className="text-slate-400 text-[10px] font-bold block">Lokasi:</span>
                                                    <span className="font-bold text-slate-800">{selectedEventDetail.location}</span>
                                                </div>
                                            </div>
                                        )}
                                        {selectedEventDetail.meeting_link && (
                                            <div className="flex items-start gap-2 pt-1 border-t border-slate-200/60">
                                                <Video className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                                                <div>
                                                    <span className="text-slate-400 text-[10px] font-bold block">Pautan Maya:</span>
                                                    <a
                                                        href={selectedEventDetail.meeting_link}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="font-bold text-indigo-600 hover:underline flex items-center gap-1 break-all"
                                                    >
                                                        {selectedEventDetail.meeting_link} <ArrowUpRight className="w-3 h-3 shrink-0" />
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Projek Terlibat */}
                                {selectedEventDetail.project_name && (
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <span className="text-slate-400 text-[10px] font-bold block mb-1">Projek Terlibat:</span>
                                        <span className="font-bold text-slate-800">
                                            {selectedEventDetail.project_name}
                                        </span>
                                    </div>
                                )}

                                {/* AGENDA MESYUARAT */}
                                {selectedEventDetail.agenda && (
                                    <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100">
                                        <span className="text-indigo-900 font-extrabold text-xs block mb-1.5 flex items-center gap-1.5">
                                            <FileText className="w-3.5 h-3.5 text-indigo-600" /> Agenda Mesyuarat:
                                        </span>
                                        <pre className="font-sans text-xs text-slate-800 leading-relaxed whitespace-pre-wrap bg-white/80 p-2.5 rounded-lg border border-indigo-100/60">
                                            {selectedEventDetail.agenda}
                                        </pre>
                                    </div>
                                )}

                                {/* Keterangan / Catatan */}
                                {selectedEventDetail.description && (
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <span className="text-slate-400 text-[10px] font-bold block mb-1">Catatan / Penerangan:</span>
                                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                                            {selectedEventDetail.description}
                                        </p>
                                    </div>
                                )}

                                {/* Senarai Peserta Jemputan (To, CC, BCC) */}
                                {((Array.isArray(selectedEventDetail.attendees) && selectedEventDetail.attendees.length > 0) || selectedEventDetail.cc_emails || selectedEventDetail.bcc_emails) && (
                                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                                        {Array.isArray(selectedEventDetail.attendees) && selectedEventDetail.attendees.length > 0 && (
                                            <div>
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className="text-slate-700 font-bold text-xs flex items-center gap-1">
                                                        <Users className="w-3.5 h-3.5 text-indigo-600" /> Penerima Utama (To):
                                                    </span>
                                                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                                                        {selectedEventDetail.attendees.length} Orang
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {selectedEventDetail.attendees.map(att => (
                                                        <span key={att} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-semibold text-slate-700">
                                                            <Mail className="w-3 h-3 text-indigo-500" />
                                                            <span>{att}</span>
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* CC Attendees */}
                                        {selectedEventDetail.cc_emails && (
                                            <div className="pt-2 border-t border-slate-200/60">
                                                <span className="text-slate-500 font-bold text-[11px] block mb-1">Salinan Kepada (CC):</span>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {(Array.isArray(selectedEventDetail.cc_emails) ? selectedEventDetail.cc_emails : String(selectedEventDetail.cc_emails).split(',')).map(c => c.trim()).filter(Boolean).map(cc => (
                                                        <span key={cc} className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 border border-indigo-200 rounded-lg text-[10px] font-semibold text-indigo-800">
                                                            <Mail className="w-3 h-3 text-indigo-500" />
                                                            <span>{cc}</span>
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* BCC Attendees */}
                                        {selectedEventDetail.bcc_emails && (
                                            <div className="pt-2 border-t border-slate-200/60">
                                                <span className="text-slate-500 font-bold text-[11px] block mb-1">Salinan Tersembunyi (BCC):</span>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {(Array.isArray(selectedEventDetail.bcc_emails) ? selectedEventDetail.bcc_emails : String(selectedEventDetail.bcc_emails).split(',')).map(b => b.trim()).filter(Boolean).map(bcc => (
                                                        <span key={bcc} className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 border border-slate-300 rounded-lg text-[10px] font-semibold text-slate-700">
                                                            <Mail className="w-3 h-3 text-slate-500" />
                                                            <span>{bcc}</span>
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Diagnostic Note dalam Modal Perincian jika SMTP belum siap */}
                                {!smtpStatus.isConfigured && (
                                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-200/70 text-[11px] text-blue-900 leading-relaxed flex items-start gap-2">
                                        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                        <div>
                                            <strong>Tip Sambungan Kalendar:</strong> Oleh kerana pelayan SMTP belum aktif sepenuhnya di pelayan tempatan, anda boleh klik <strong>"Buka di Outlook Web"</strong> atau <strong>"Muat Turun .ics"</strong> di bawah untuk memasukkan mesyuarat ini terus ke dalam kalendar Outlook peribadi anda tanpa memerlukan e-mel relay.
                                        </div>
                                    </div>
                                )}

                                {/* BAR TINDAKAN SAMBUNGAN KALENDAR OUTLOOK */}
                                <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-200/80 space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-5 h-5 rounded bg-[#0078D4] text-white flex items-center justify-center font-black text-[10px]">
                                                O
                                            </div>
                                            <span className="text-xs font-black text-slate-900">Integrasi Microsoft Outlook</span>
                                        </div>
                                        <span className="text-[10px] font-extrabold text-[#0078D4] bg-blue-100 px-2 py-0.5 rounded-md">
                                            Sambungan Rasmi
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {/* Butang Buka di Outlook Web */}
                                        <a
                                            href={getOutlookWebLink(selectedEventDetail)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="px-3.5 py-2.5 bg-[#0078D4] hover:bg-[#006cbd] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                                            title="Buka dan simpan ke Kalendar Microsoft 365 / Outlook Web"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                            <span>Buka di Outlook Web</span>
                                        </a>

                                        {/* Butang Muat Turun Fail .ics */}
                                        <button
                                            onClick={() => handleDownloadICS(selectedEventDetail)}
                                            className="px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                                            title="Muat turun fail .ics untuk perisian Outlook Desktop"
                                        >
                                            <Download className="w-3.5 h-3.5 text-slate-600" />
                                            <span>Muat Turun .ics</span>
                                        </button>
                                    </div>

                                    {/* Hantar Semula Jemputan E-mel jika ada peserta */}
                                    {Array.isArray(selectedEventDetail.attendees) && selectedEventDetail.attendees.length > 0 && (
                                        <button
                                            onClick={() => handleResendInvitation(selectedEventDetail)}
                                            disabled={isSendingInvite}
                                            className="w-full mt-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                                        >
                                            <Send className="w-3.5 h-3.5" />
                                            <span>{isSendingInvite ? 'Menghantar Jemputan...' : 'Hantar Semula Jemputan E-mel Kalendar'}</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Footer Modal Perincian */}
                            <div className="flex justify-between items-center p-4 border-t border-slate-100 bg-slate-50/60">
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
                    <p className="text-slate-500 text-sm mt-1">Jejak tarikh akhir tugasan Kanban, sasaran milestone bayaran, dan jemputan mesyuarat PMO PKPMP secara bersepadu dengan Microsoft Outlook.</p>
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
                        onClick={() => {
                            setSelectedAttendees([]);
                            setAgendaInput(DEFAULT_AGENDA_TEMPLATE);
                            setIsAddModalOpen(true);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center shadow-md text-xs transition-all active:scale-[0.98] cursor-pointer"
                    >
                        <Plus className="w-4 h-4 mr-1.5" /> Tambah Mesyuarat / Acara
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
                        onClick={() => setSelectedCategoryFilter('meeting')}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 cursor-pointer ${selectedCategoryFilter === 'meeting' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                        <Users className="w-3 h-3" /> Mesyuarat PMO & Outlook
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

            {/* Grid Kalendar Dinamik Penuh (Full Width) */}
            <div className="flex-1 flex flex-col min-h-0">
                <Card className="w-full flex-1 flex flex-col overflow-hidden" noPadding>
                    <div className="p-3 sm:p-5 lg:p-6 flex-1 flex flex-col overflow-y-auto">
                        {/* Petunjuk Tatal Mudah Alih */}
                        <div className="lg:hidden text-[11px] text-slate-400 font-bold flex items-center justify-end gap-1 mb-2 px-1">
                            <span>Tatal mendatar untuk paparan kalendar penuh &rarr;</span>
                        </div>

                        <div className="overflow-x-auto pb-2 flex-1">
                            <div className="min-w-[640px] lg:min-w-0 flex flex-col h-full">
                                {/* Hari Seminggu */}
                                <div className="grid grid-cols-7 mb-3 shrink-0">
                                    {daysOfWeek.map(d => (
                                        <div key={d} className="text-center text-xs font-black text-slate-400 uppercase tracking-widest py-1">
                                            {d}
                                        </div>
                                    ))}
                                </div>

                                {/* Grid Hari */}
                                <div className="flex-1 grid grid-cols-7 auto-rows-fr gap-2 bg-slate-100/70 p-2 rounded-2xl border border-slate-200/60 min-h-[580px]">
                                    {blanks.map((_, i) => (
                                        <div key={`blank-${i}`} className="bg-slate-50/50 rounded-xl p-2.5 min-h-[95px] opacity-40"></div>
                                    ))}

                                    {days.map(d => {
                                        const dayStr = `${currentMonthStr}-${String(d).padStart(2, '0')}`;
                                        const isToday = today.getFullYear() === currentYear && today.getMonth() === currentMonth && today.getDate() === d;
                                        const dayEvents = filteredEvents.filter(e => e.event_date === dayStr);

                                        return (
                                            <div
                                                key={`day-${d}`}
                                                className={`bg-white rounded-xl p-2.5 min-h-[95px] flex flex-col justify-between border transition-all hover:border-indigo-300 hover:shadow-sm ${isToday ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-slate-100'}`}
                                            >
                                                <div className="flex justify-between items-center mb-1.5">
                                                    <span className={`text-xs font-black w-6 h-6 rounded-full flex items-center justify-center ${isToday ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-700'}`}>
                                                        {d}
                                                    </span>
                                                    {dayEvents.length > 0 && (
                                                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500">
                                                            {dayEvents.length} acara
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="space-y-1.5 overflow-y-auto max-h-[90px] flex-1 pr-0.5">
                                                    {dayEvents.map(ev => (
                                                        <div
                                                            key={ev.id}
                                                            onClick={() => setSelectedEventDetail(ev)}
                                                            className={`p-1.5 rounded-lg text-[11px] font-bold text-white truncate cursor-pointer transition-transform hover:scale-[1.01] shadow-xs flex items-center justify-between gap-1 ${ev.color}`}
                                                            title={`${ev.title} (${ev.start_time || ''})`}
                                                        >
                                                            <span className="truncate font-medium">{ev.title}</span>
                                                            {ev.type === 'meeting' && (
                                                                <span className="text-[9px] bg-white/25 px-1.5 py-0.2 rounded font-extrabold shrink-0">
                                                                    Outlook
                                                                </span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default CalendarPage;
