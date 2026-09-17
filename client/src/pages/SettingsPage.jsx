import React, { useState, useEffect } from 'react';
import {
    Folder, Mail, Bell, Plus, Edit, Trash2, Server,
    EyeOff, Eye, Save, Send, RefreshCw, CheckCircle2,
    AlertCircle, AlertTriangle, Clock, ShieldCheck
} from 'lucide-react';

export const SettingsPage = ({ showToastNotification, currentUser, refreshNotifications }) => {
    const [activeSettingsTab, setActiveSettingsTab] = useState('divisions'); // 'divisions', 'smtp', 'alerts'
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

    // SMTP Configuration States
    const [smtpHost, setSmtpHost] = useState('smtp.kehakiman.gov.my');
    const [smtpPort, setSmtpPort] = useState(587);
    const [smtpEncryption, setSmtpEncryption] = useState('tls');
    const [smtpUser, setSmtpUser] = useState('pmo@kehakiman.gov.my');
    const [smtpPass, setSmtpPass] = useState('');
    const [showSmtpPass, setShowSmtpPass] = useState(false);
    const [fromEmail, setFromEmail] = useState('noreply-mypmo@kehakiman.gov.my');
    const [fromName, setFromName] = useState('Sistem MY-PMO PKPMP');
    const [isActiveSmtp, setIsActiveSmtp] = useState(true);
    const [notifyOnRisk, setNotifyOnRisk] = useState(true);
    const [notifyOnOverdue, setNotifyOnOverdue] = useState(true);
    const [notifyOnPayment, setNotifyOnPayment] = useState(true);
    const [testEmail, setTestEmail] = useState(currentUser?.email || 'admin@kehakiman.gov.my');
    const [isLoadingSmtp, setIsLoadingSmtp] = useState(false);
    const [isSavingSmtp, setIsSavingSmtp] = useState(false);
    const [isTestingSmtp, setIsTestingSmtp] = useState(false);
    const [smtpTestResult, setSmtpTestResult] = useState(null);

    // Auto-Alert Monitoring States
    const [alertStats, setAlertStats] = useState({ unread: 0, critical: 0, warning: 0, total: 0 });
    const [activeAlerts, setActiveAlerts] = useState([]);
    const [isLoadingAlerts, setIsLoadingAlerts] = useState(false);

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

    const fetchSmtpSettings = async () => {
        setIsLoadingSmtp(true);
        try {
            const res = await fetch('http://localhost/My-PMO/api/modules/smtp_settings.php');
            const data = await res.json();
            if (data.status === 'success' && data.data) {
                const s = data.data;
                setSmtpHost(s.smtp_host || 'smtp.kehakiman.gov.my');
                setSmtpPort(s.smtp_port || 587);
                setSmtpEncryption(s.smtp_encryption || 'tls');
                setSmtpUser(s.smtp_user || '');
                setSmtpPass(s.smtp_pass || '');
                setFromEmail(s.from_email || 'noreply-mypmo@kehakiman.gov.my');
                setFromName(s.from_name || 'Sistem MY-PMO PKPMP');
                setIsActiveSmtp(s.is_active == 1);
                setNotifyOnRisk(s.notify_on_risk == 1);
                setNotifyOnOverdue(s.notify_on_overdue_task == 1);
                setNotifyOnPayment(s.notify_on_payment_due == 1);
            }
        } catch (err) {
            console.error('Ralat mengambil tetapan SMTP:', err);
        } finally {
            setIsLoadingSmtp(false);
        }
    };

    const fetchAlertsSummary = async () => {
        setIsLoadingAlerts(true);
        try {
            const res = await fetch('http://localhost/My-PMO/api/modules/notifications.php');
            const data = await res.json();
            if (data.status === 'success') {
                if (data.counts) setAlertStats(data.counts);
                if (data.data) setActiveAlerts(data.data);
            }
        } catch (err) {
            console.error('Ralat mengambil amaran pintar:', err);
        } finally {
            setIsLoadingAlerts(false);
        }
    };

    useEffect(() => {
        fetchDivisions();
        fetchSmtpSettings();
        fetchAlertsSummary();
    }, []);

    const handleSaveSmtp = async (e) => {
        if (e) e.preventDefault();
        setIsSavingSmtp(true);
        try {
            const res = await fetch('http://localhost/My-PMO/api/modules/smtp_settings.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'save_settings',
                    smtp_host: smtpHost,
                    smtp_port: smtpPort,
                    smtp_encryption: smtpEncryption,
                    smtp_user: smtpUser,
                    smtp_pass: smtpPass,
                    from_email: fromEmail,
                    from_name: fromName,
                    is_active: isActiveSmtp ? 1 : 0,
                    notify_on_risk: notifyOnRisk ? 1 : 0,
                    notify_on_overdue_task: notifyOnOverdue ? 1 : 0,
                    notify_on_payment_due: notifyOnPayment ? 1 : 0,
                    user_id: currentUser?.id || 1
                })
            });
            const data = await res.json();
            if (data.status === 'success') {
                if (showToastNotification) showToastNotification('Konfigurasi pelayan SMTP berjaya disimpan!');
                fetchSmtpSettings();
                if (refreshNotifications) refreshNotifications();
            } else {
                alert(data.message || 'Gagal menyimpan tetapan SMTP.');
            }
        } catch (err) {
            alert('Ralat semasa berhubung dengan pelayan.');
        } finally {
            setIsSavingSmtp(false);
        }
    };

    const handleTestSmtp = async () => {
        setIsTestingSmtp(true);
        setSmtpTestResult(null);
        try {
            const res = await fetch('http://localhost/My-PMO/api/modules/smtp_settings.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'test_connection',
                    smtp_host: smtpHost,
                    smtp_port: smtpPort,
                    smtp_encryption: smtpEncryption,
                    smtp_user: smtpUser,
                    smtp_pass: smtpPass,
                    from_email: fromEmail,
                    test_email: testEmail,
                    user_id: currentUser?.id || 1
                })
            });
            const data = await res.json();
            setSmtpTestResult(data);
            if (data.status === 'success') {
                if (showToastNotification) showToastNotification('Ujian sambungan SMTP berjaya!');
            }
        } catch (err) {
            setSmtpTestResult({
                status: 'error',
                message: 'Gagal membuat permintaan ujian ke pelayan API.'
            });
        } finally {
            setIsTestingSmtp(false);
        }
    };

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
                    <p className="text-slate-500 text-sm mt-1">Konfigurasi organisasi bahagian, integrasi pelayan e-mel SMTP, dan peraturan notifikasi pintar PKPMP.</p>
                </div>
            </div>

            {/* Tab Bar Navigasi Tetapan */}
            <div className="flex border-b border-slate-200 gap-6">
                <button
                    type="button"
                    onClick={() => setActiveSettingsTab('divisions')}
                    className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${activeSettingsTab === 'divisions' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
                >
                    <Folder className="w-4 h-4" /> Bahagian & Unit
                </button>
                <button
                    type="button"
                    onClick={() => setActiveSettingsTab('smtp')}
                    className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${activeSettingsTab === 'smtp' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
                >
                    <Mail className="w-4 h-4" /> Konfigurasi E-mel (SMTP)
                </button>
                <button
                    type="button"
                    onClick={() => setActiveSettingsTab('alerts')}
                    className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${activeSettingsTab === 'alerts' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
                >
                    <Bell className="w-4 h-4" /> Peraturan Notifikasi Pintar (Auto-Alert)
                </button>
            </div>

            {/* TAB 1: BAHAGIAN & UNIT */}
            {activeSettingsTab === 'divisions' && (
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
            )}

            {/* TAB 2: KONFIGURASI E-MEL SMTP */}
            {activeSettingsTab === 'smtp' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-100 p-6 lg:p-8 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <Mail className="w-5 h-5 text-indigo-600" />
                                    Konfigurasi Pelayan E-mel (SMTP)
                                </h2>
                                <p className="text-xs text-slate-500 mt-1">Konfigurasikan maklumat pelayan SMTP untuk penghantaran e-mel amaran dan notifikasi sistem.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${isActiveSmtp ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                    <span className={`w-2 h-2 rounded-full ${isActiveSmtp ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                                    {isActiveSmtp ? 'Perkhidmatan E-mel Aktif' : 'Perkhidmatan Dinyahaktifkan'}
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handleSaveSmtp} className="mt-6 space-y-6">
                            {/* Suis Status Servis */}
                            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-extrabold text-indigo-950">Pengaktifan E-mel Sistem</p>
                                    <p className="text-xs text-indigo-700 mt-0.5">Benarkan sistem menghantar e-mel amaran automatik bagi projek dan kewangan.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isActiveSmtp}
                                        onChange={(e) => setIsActiveSmtp(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Pelayan Hos SMTP (SMTP Host) *</label>
                                    <div className="relative">
                                        <Server className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                                        <input
                                            type="text"
                                            required
                                            value={smtpHost}
                                            onChange={(e) => setSmtpHost(e.target.value)}
                                            placeholder="cth: smtp.kehakiman.gov.my atau smtp.gmail.com"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                    <p className="text-[11px] text-slate-400 mt-1">Contoh: `smtp.kehakiman.gov.my`, `smtp.office365.com`</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Port SMTP *</label>
                                    <input
                                        type="number"
                                        required
                                        value={smtpPort}
                                        onChange={(e) => setSmtpPort(Number(e.target.value))}
                                        placeholder="587"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                                    />
                                    <p className="text-[11px] text-slate-400 mt-1">Kebiasaannya 587 (TLS), 465 (SSL), atau 25 (Standard)</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Kaedah Enkripsi (Encryption)</label>
                                    <select
                                        value={smtpEncryption}
                                        onChange={(e) => setSmtpEncryption(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-500 bg-white"
                                    >
                                        <option value="tls">TLS (STARTTLS - Disyorkan)</option>
                                        <option value="ssl">SSL (SMTPS - Port 465)</option>
                                        <option value="none">Tiada Enkripsi (None)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Pengguna / E-mel SMTP</label>
                                    <input
                                        type="text"
                                        value={smtpUser}
                                        onChange={(e) => setSmtpUser(e.target.value)}
                                        placeholder="pmo@kehakiman.gov.my"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Kata Laluan SMTP</label>
                                    <div className="relative">
                                        <input
                                            type={showSmtpPass ? "text" : "password"}
                                            value={smtpPass}
                                            onChange={(e) => setSmtpPass(e.target.value)}
                                            placeholder="Masukkan kata laluan pelayan e-mel"
                                            className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowSmtpPass(!showSmtpPass)}
                                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                                        >
                                            {showSmtpPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <p className="text-[11px] text-slate-400 mt-1">Biarkan kosong atau bertopeng sekiranya tidak mahu menukar kata laluan sedia ada.</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">E-mel Pengirim (From Email) *</label>
                                    <input
                                        type="email"
                                        required
                                        value={fromEmail}
                                        onChange={(e) => setFromEmail(e.target.value)}
                                        placeholder="noreply-mypmo@kehakiman.gov.my"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Paparan Pengirim (From Name) *</label>
                                    <input
                                        type="text"
                                        required
                                        value={fromName}
                                        onChange={(e) => setFromName(e.target.value)}
                                        placeholder="Sistem MY-PMO PKPMP"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-slate-100">
                                <button
                                    type="submit"
                                    disabled={isSavingSmtp}
                                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" />
                                    {isSavingSmtp ? 'Menyimpan...' : 'Simpan Konfigurasi SMTP'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Kad Ujian Sambungan SMTP */}
                    <div className="bg-white rounded-3xl border border-slate-100 p-6 lg:p-8 shadow-sm">
                        <div className="pb-4 border-b border-slate-100">
                            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <Send className="w-4 h-4 text-emerald-600" />
                                Ujian Diagnostik Sambungan SMTP
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">Uji kebolehsambungan soket dan protokol ke pelayan SMTP secara langsung sebelum digunakan.</p>
                        </div>

                        <div className="mt-4 flex flex-col sm:flex-row items-end gap-3">
                            <div className="flex-1 w-full">
                                <label className="block text-xs font-bold text-slate-700 mb-1">E-mel Penerima Ujian</label>
                                <input
                                    type="email"
                                    value={testEmail}
                                    onChange={(e) => setTestEmail(e.target.value)}
                                    placeholder="admin@kehakiman.gov.my"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleTestSmtp}
                                disabled={isTestingSmtp}
                                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow flex items-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
                            >
                                {isTestingSmtp ? (
                                    <>
                                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Menguji Sambungan...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-3.5 h-3.5" /> Uji Sambungan Pelayan
                                    </>
                                )}
                            </button>
                        </div>

                        {smtpTestResult && (
                            <div className={`mt-4 p-4 rounded-2xl border text-xs font-medium ${smtpTestResult.status === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                                <div className="flex items-start gap-2.5">
                                    {smtpTestResult.status === 'success' ? (
                                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                                    )}
                                    <div>
                                        <p className="font-bold text-sm mb-1">{smtpTestResult.status === 'success' ? 'Sambungan Berjaya' : 'Sambungan Gagal'}</p>
                                        <p className="leading-relaxed">{smtpTestResult.message}</p>
                                        {smtpTestResult.details && (
                                            <div className="mt-2 text-[11px] opacity-85 font-mono">
                                                Pelayan: {smtpTestResult.details.host}:{smtpTestResult.details.port} ({smtpTestResult.details.encryption})
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB 3: PERATURAN NOTIFIKASI PINTAR (AUTO-ALERT) */}
            {activeSettingsTab === 'alerts' && (
                <div className="space-y-6">
                    {/* Ringkasan Metrik Amaran */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                                <Bell className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-slate-900">{alertStats.total || activeAlerts.length}</p>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Jumlah Notifikasi</p>
                            </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-black">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-rose-600">{alertStats.critical || 0}</p>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Amaran Kritikal</p>
                            </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-amber-600">{alertStats.warning || 0}</p>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Peringatan Awal</p>
                            </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-slate-900">{alertStats.unread || 0}</p>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Belum Dibaca</p>
                            </div>
                        </div>
                    </div>

                    {/* Peraturan Suis Auto-Alert */}
                    <div className="bg-white rounded-3xl border border-slate-100 p-6 lg:p-8 shadow-sm">
                        <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <Bell className="w-5 h-5 text-indigo-600" />
                                    Peraturan Amaran Automatik (Auto-Alert Rules)
                                </h2>
                                <p className="text-xs text-slate-500 mt-1">Konfigurasikan keadaan di mana sistem akan menjana amaran pintar secara automatik ke papan pemuka dan e-mel.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => { fetchAlertsSummary(); if (refreshNotifications) refreshNotifications(); }}
                                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                            >
                                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAlerts ? 'animate-spin' : ''}`} /> Imbas Semula Amaran
                            </button>
                        </div>

                        <div className="mt-6 space-y-4">
                            {/* Rule 1 */}
                            <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 flex items-center justify-between hover:bg-white transition-all">
                                <div className="pr-4">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                                        <h4 className="text-sm font-extrabold text-slate-900">Amaran Projek Berisiko & Tertunda</h4>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Jana amaran segera apabila projek ditandakan sebagai 'Berisiko' atau 'Amaran', atau apabila kemajuan projek berada di bawah 40%.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                    <input
                                        type="checkbox"
                                        checked={notifyOnRisk}
                                        onChange={(e) => { setNotifyOnRisk(e.target.checked); handleSaveSmtp(); }}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>

                            {/* Rule 2 */}
                            <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 flex items-center justify-between hover:bg-white transition-all">
                                <div className="pr-4">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                                        <h4 className="text-sm font-extrabold text-slate-900">Peringatan Jadual Bayaran & Milestone</h4>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Peringatan awal automatik 30 hari sebelum tarikh matang sasaran bayaran fasa projek dan amaran lewat jika tarikh terlepas.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                    <input
                                        type="checkbox"
                                        checked={notifyOnPayment}
                                        onChange={(e) => { setNotifyOnPayment(e.target.checked); handleSaveSmtp(); }}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>

                            {/* Rule 3 */}
                            <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 flex items-center justify-between hover:bg-white transition-all">
                                <div className="pr-4">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                                        <h4 className="text-sm font-extrabold text-slate-900">Amaran Tugasan Kanban Melepasi Tarikh Akhir (Overdue)</h4>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Keluarkan amaran bagi tugasan kanban yang masih pending atau in_progress setelah melepasi due date yang ditetapkan.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                    <input
                                        type="checkbox"
                                        checked={notifyOnOverdue}
                                        onChange={(e) => { setNotifyOnOverdue(e.target.checked); handleSaveSmtp(); }}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Senarai Amaran Langsung */}
                    <div className="bg-white rounded-3xl border border-slate-100 p-6 lg:p-8 shadow-sm">
                        <div className="pb-4 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Senarai Amaran Pintar Aktif Masa Nyata</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Pengesanan amaran semasa yang dianalisis oleh enjin sistem.</p>
                            </div>
                        </div>

                        <div className="mt-4 space-y-3">
                            {activeAlerts.length > 0 ? (
                                activeAlerts.map(alert => (
                                    <div key={alert.id} className={`p-4 rounded-2xl border transition-all ${alert.type === 'danger' ? 'bg-rose-50/50 border-rose-200/70' : alert.type === 'warning' ? 'bg-amber-50/50 border-amber-200/70' : 'bg-slate-50 border-slate-200/70'}`}>
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-start space-x-3">
                                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${alert.type === 'danger' ? 'bg-rose-500 text-white' : alert.type === 'warning' ? 'bg-amber-500 text-white' : 'bg-indigo-500 text-white'}`}>
                                                    {alert.type === 'danger' ? <AlertCircle className="w-4 h-4" /> : alert.type === 'warning' ? <Clock className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-slate-900">{alert.title}</h4>
                                                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{alert.message}</p>
                                                    <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-wider">{alert.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-8 text-center text-slate-400 text-xs font-medium">
                                    Tiada amaran pintar aktif buat masa ini. Semua metrik projek dalam keadaan optimum.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

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
