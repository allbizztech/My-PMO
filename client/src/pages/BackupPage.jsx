import React, { useState, useEffect } from 'react';
import {
    AlertTriangle, Trash2, Database, RefreshCw,
    HardDrive, Folder, Archive, Clock, UploadCloud,
    Save, Search, FileArchive, Check, Copy, Download,
    ChevronLeft, ChevronRight, ShieldCheck, Terminal
} from 'lucide-react';
import { API_ENDPOINTS } from '../services/api';

export const BackupPage = ({ showToastNotification, currentUser }) => {
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
            const res = await fetch('/My-PMO/api/modules/backup.php?action=list_backups');
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
            const res = await fetch('/My-PMO/api/modules/backup.php', {
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
            const res = await fetch('/My-PMO/api/modules/backup.php', {
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
            const res = await fetch('/My-PMO/api/modules/backup.php', {
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
        <div className="space-y-6 w-full max-w-[1720px] mx-auto pb-12 animate-in fade-in duration-300">
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
                                                    href={`/My-PMO/api/modules/backup.php?action=download&file=${encodeURIComponent(b.filename)}`}
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
