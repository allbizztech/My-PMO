import React, { useState, useEffect } from 'react';
import {
    ShieldAlert, FileText, RefreshCw, Download,
    ChevronDown, Search, Filter, Terminal, AlertTriangle,
    Server, Globe, Monitor, ChevronLeft, ChevronRight,
    LogIn, LogOut, Plus, Eye, Edit, Trash2
} from 'lucide-react';
import { API_ENDPOINTS } from '../services/api';

export const AuditTrailPage = ({ currentUser, showToastNotification }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedAction, setSelectedAction] = useState('ALL');
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [auditLogs, setAuditLogs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 20;

    const fetchAuditLogs = async () => {
        try {
            const res = await fetch('http://localhost/My-PMO/api/modules/audit.php');
            const data = await res.json();
            if (data.status === 'success') {
                const mapped = data.data.map(l => ({
                    id: l.id,
                    timestamp: l.created_at,
                    user: l.user_name || 'Sistem',
                    role: l.user_role ? (l.user_role === 'superadmin' ? 'Superadmin' : l.user_role) : 'Sistem',
                    action: l.action,
                    module: l.module,
                    details: l.details,
                    ipAddress: l.ip_address || '127.0.0.1',
                    hostname: 'localhost',
                    status: 'SUCCESS'
                }));
                setAuditLogs(mapped);
            }
        } catch (err) {
            console.error("Ralat memuat turun log audit:", err);
        }
    };

    useEffect(() => {
        fetchAuditLogs();
    }, []);

    // Reset pagination to page 1 whenever filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedAction, startDate, endDate]);

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
            case 'LOGIN': return { icon: LogIn, label: 'Log Masuk', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' };
            case 'LOGOUT': return { icon: LogOut, label: 'Log Keluar', color: 'text-slate-700', bg: 'bg-slate-100', border: 'border-slate-200' };
            case 'CREATE': return { icon: Plus, label: 'Cipta', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' };
            case 'READ': return { icon: Eye, label: 'Lihat', color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200' };
            case 'UPDATE': return { icon: Edit, label: 'Kemas Kini', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' };
            case 'DELETE': return { icon: Trash2, label: 'Padam', color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' };
            default: return { icon: Terminal, label: action || 'Aktiviti', color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-200' };
        }
    };

    const filteredLogs = auditLogs.filter(log => {
        if (selectedAction !== 'ALL' && log.action !== selectedAction) {
            return false;
        }
        if (startDate || endDate) {
            const logDate = new Date(log.timestamp.replace(' ', 'T'));
            const start = startDate ? new Date(startDate) : new Date('2000-01-01T00:00');
            const end = endDate ? new Date(endDate) : new Date('2100-01-01T23:59');
            if (logDate < start || logDate > end) return false;
        }
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchUser = log.user ? log.user.toLowerCase().includes(query) : false;
            const matchIp = log.ipAddress ? log.ipAddress.toLowerCase().includes(query) : false;
            const matchModule = log.module ? log.module.toLowerCase().includes(query) : false;
            const matchDetails = log.details ? log.details.toLowerCase().includes(query) : false;
            return matchUser || matchIp || matchModule || matchDetails;
        }
        return true;
    });

    const isFiltered = searchQuery !== '' || selectedAction !== 'ALL' || startDate !== '' || endDate !== '';

    const handleResetFilters = () => {
        setSearchQuery('');
        setSelectedAction('ALL');
        setStartDate('');
        setEndDate('');
        setCurrentPage(1);
    };

    // Pagination calculations
    const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE) || 1;
    const paginatedLogs = filteredLogs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const startRecord = filteredLogs.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endRecord = Math.min(currentPage * ITEMS_PER_PAGE, filteredLogs.length);

    const escapeCsv = (str) => {
        if (str === null || str === undefined) return '""';
        const stringified = String(str).replace(/"/g, '""');
        return `"${stringified}"`;
    };

    const handleExport = (format) => {
        setShowExportMenu(false);
        if (filteredLogs.length === 0) {
            if (showToastNotification) {
                showToastNotification('Tiada rekod log audit untuk dieksport.');
            } else {
                alert('Tiada rekod log audit untuk dieksport.');
            }
            return;
        }

        if (format === 'Excel (.csv)') {
            const headers = ["Masa & Tarikh", "Pengguna", "Peranan", "Tindakan", "Modul", "Butiran Aktiviti", "IP Address", "Hostname", "Status"].join(",");
            const rows = filteredLogs.map(l => [
                escapeCsv(l.timestamp),
                escapeCsv(l.user),
                escapeCsv(l.role),
                escapeCsv(l.action),
                escapeCsv(l.module),
                escapeCsv(l.details),
                escapeCsv(l.ipAddress),
                escapeCsv(l.hostname),
                escapeCsv(l.status)
            ].join(",")).join("\n");

            // Include UTF-8 BOM so Excel opens Malay characters cleanly
            const csvContent = "\uFEFF" + headers + "\n" + rows;
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            const dateStr = new Date().toISOString().slice(0, 10);
            link.setAttribute("download", `AuditLog_PMO_${dateStr}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            if (showToastNotification) {
                showToastNotification(`Fail CSV Jejak Audit (${filteredLogs.length} rekod) berjaya dimuat turun!`);
            }
        } else if (format === 'PDF') {
            if (showToastNotification) {
                showToastNotification('Membuka paparan cetakan / PDF Jejak Audit...');
            }
            setTimeout(() => {
                window.print();
            }, 300);
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-300 printable-area">
            {/* Top Breadcrumb & Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        <span>Pentadbiran Sistem</span>
                        <span>/</span>
                        <span className="text-indigo-600">Keselamatan & Pematuhan</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
                        <FileText className="w-7 h-7 text-indigo-700" />
                        Jejak Audit Sistem
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Pemantauan log keselamatan, aktiviti pengguna (CRUD), sesi log masuk, dan maklumat peranti capaian.
                    </p>
                </div>

                {/* Top Action Buttons (Export & Refresh) */}
                <div className="flex items-center gap-3 no-print relative">
                    <button
                        type="button"
                        onClick={fetchAuditLogs}
                        className="px-3.5 py-2 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-medium text-xs shadow-sm flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                        title="Muat Semula Rekod Log"
                    >
                        <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
                        <span>Muat Semula</span>
                    </button>

                    {/* Export Dropdown in Header */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium text-xs shadow-sm flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                        >
                            <Download className="w-3.5 h-3.5" />
                            <span>Eksport Log</span>
                            <ChevronDown className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${showExportMenu ? 'rotate-180' : ''}`} />
                        </button>

                        {showExportMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowExportMenu(false)}
                                ></div>
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                                    <button
                                        type="button"
                                        onClick={() => handleExport('Excel (.csv)')}
                                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer border-b border-slate-100"
                                    >
                                        <span className="flex items-center justify-center w-6 h-6 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px]">CSV</span>
                                        <div>
                                            <div className="text-slate-900">Format Excel (.CSV)</div>
                                            <div className="text-[10px] text-slate-400 font-normal">Sesuai untuk analisis spreadsheet</div>
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleExport('PDF')}
                                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                                    >
                                        <span className="flex items-center justify-center w-6 h-6 rounded-md bg-rose-50 text-rose-700 font-bold text-[10px]">PDF</span>
                                        <div>
                                            <div className="text-slate-900">Dokumen PDF / Cetak</div>
                                            <div className="text-[10px] text-slate-400 font-normal">Paparan laporan sedia dicetak</div>
                                        </div>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Filter Toolbar Card */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm no-print">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 flex-1">
                        {/* 1. Carian Pantas */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Carian Pantas
                            </label>
                            <div className="relative">
                                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Pengguna, modul, IP, butiran..."
                                    className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        {/* 2. Pilihan Tindakan (Action Filter Dropdown) */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Pilihan Tindakan
                            </label>
                            <div className="relative">
                                <Filter className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <select
                                    value={selectedAction}
                                    onChange={e => setSelectedAction(e.target.value)}
                                    className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all cursor-pointer appearance-none"
                                >
                                    <option value="ALL">Semua Tindakan (Keseluruhan)</option>
                                    <option value="CREATE">CREATE (Cipta Rekod Baharu)</option>
                                    <option value="UPDATE">UPDATE (Kemas Kini Maklumat)</option>
                                    <option value="DELETE">DELETE (Padam Rekod)</option>
                                    <option value="LOGIN">LOGIN (Log Masuk Pengguna)</option>
                                    <option value="LOGOUT">LOGOUT (Log Keluar)</option>
                                    <option value="READ">READ (Lihat / Akses Data)</option>
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>

                        {/* 3. Tarikh Mula */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Tarikh Mula
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={e => setStartDate(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* 4. Tarikh Akhir */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Tarikh Akhir
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={e => setEndDate(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Reset Button */}
                    {isFiltered && (
                        <div className="flex items-end">
                            <button
                                type="button"
                                onClick={handleResetFilters}
                                className="px-3.5 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                                title="Padam semua tapisan"
                            >
                                <RefreshCw className="w-3 h-3" />
                                <span>Set Semula Penapis</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Summary Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 no-print">
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Jumlah Rekod Ditapis</span>
                        <div className="text-2xl font-bold text-slate-900 font-mono mt-0.5">{filteredLogs.length}</div>
                        <span className="text-[11px] text-slate-400">daripada {auditLogs.length} keseluruhan log</span>
                    </div>
                    <div className="p-3 bg-indigo-50 text-indigo-700 rounded-xl">
                        <Terminal className="w-5 h-5" />
                    </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Cubaan Log Masuk Gagal</span>
                        <div className="text-2xl font-bold text-slate-900 font-mono mt-0.5">{filteredLogs.filter(l => l.status === 'FAILED').length}</div>
                        <span className="text-[11px] text-rose-600 font-medium">Amaran keselamatan</span>
                    </div>
                    <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                        <ShieldAlert className="w-5 h-5" />
                    </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Aktiviti Sensitif (Kemas Kini / Padam)</span>
                        <div className="text-2xl font-bold text-slate-900 font-mono mt-0.5">{filteredLogs.filter(l => l.action === 'DELETE' || l.action === 'UPDATE').length}</div>
                        <span className="text-[11px] text-amber-600 font-medium">Perubahan data kritikal</span>
                    </div>
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Audit Logs Table Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden print:shadow-none print:border-0">
                <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-slate-50/50 flex items-center justify-between no-print">
                    <div className="flex items-center gap-2">
                        <Server className="w-4 h-4 text-slate-500" />
                        <h3 className="text-sm font-bold text-slate-900">Rekod Log Aktiviti Pelayan</h3>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">
                        {filteredLogs.length > 0 ? `Paparan ${startRecord}-${endRecord} daripada ${filteredLogs.length} rekod` : '0 rekod'}
                    </span>
                </div>

                {/* Desktop & Tablet Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                <th className="px-5 py-3">Masa & Tarikh</th>
                                <th className="px-5 py-3">Pengguna & Peranan</th>
                                <th className="px-5 py-3">Tindakan</th>
                                <th className="px-5 py-3">Butiran Aktiviti</th>
                                <th className="px-5 py-3">Peranti / IP</th>
                                <th className="px-5 py-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs text-slate-700 bg-white">
                            {paginatedLogs.length > 0 ? paginatedLogs.map((log) => {
                                const actionCfg = getActionConfig(log.action);
                                const ActionIcon = actionCfg.icon;
                                return (
                                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors print:border-b">
                                        <td className="px-5 py-3.5 whitespace-nowrap">
                                            <div className="font-mono font-bold text-slate-900 text-xs">{log.timestamp.split(' ')[1]}</div>
                                            <div className="text-slate-400 text-[11px] font-mono mt-0.5">{log.timestamp.split(' ')[0]}</div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="font-semibold text-slate-900 text-xs">{log.user}</div>
                                            <div className="text-slate-400 text-[11px] mt-0.5">{log.role}</div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded border ${actionCfg.bg} ${actionCfg.color} ${actionCfg.border}`}>
                                                <ActionIcon className="w-3 h-3 mr-1" /> {log.action}
                                            </div>
                                            <div className="text-slate-400 text-[10px] mt-1">Modul: <span className="text-slate-700 font-medium">{log.module}</span></div>
                                        </td>
                                        <td className="px-5 py-3.5 max-w-md">
                                            <p className="text-slate-700 font-medium text-xs leading-relaxed" title={log.details}>{log.details}</p>
                                            <p className="text-slate-400 text-[10px] mt-0.5 font-mono">ID: #{log.id}</p>
                                        </td>
                                        <td className="px-5 py-3.5 whitespace-nowrap">
                                            <div className="flex items-center text-slate-700 font-mono text-[11px]">
                                                <Globe className="w-3 h-3 mr-1 text-slate-400" /> {log.ipAddress}
                                            </div>
                                            <div className="flex items-center text-slate-400 text-[10px] mt-0.5">
                                                <Monitor className="w-3 h-3 mr-1 text-slate-400" /> {log.hostname}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 text-center whitespace-nowrap">
                                            {log.status === 'SUCCESS' ? (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Berjaya</span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">Gagal</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                        <p className="text-slate-600 font-semibold">Tiada rekod log audit ditemui</p>
                                        <p className="text-slate-400 text-xs mt-1">
                                            {isFiltered ? 'Sila ubah carian atau tekan "Set Semula Penapis".' : 'Belum ada rekod log aktiviti yang dicatatkan dalam sistem.'}
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards View */}
                <div className="md:hidden divide-y divide-slate-100 bg-white">
                    {paginatedLogs.length > 0 ? paginatedLogs.map((log) => {
                        const actionCfg = getActionConfig(log.action);
                        const ActionIcon = actionCfg.icon;
                        return (
                            <div key={log.id} className="p-4 space-y-2.5">
                                <div className="flex justify-between items-center">
                                    <div className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded border ${actionCfg.bg} ${actionCfg.color} ${actionCfg.border}`}>
                                        <ActionIcon className="w-3 h-3 mr-1" /> {log.action}
                                    </div>
                                    <span className="text-[11px] font-mono text-slate-400">{log.timestamp}</span>
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-900 text-xs">{log.user} <span className="text-[11px] font-normal text-slate-400">({log.role})</span></div>
                                    <div className="text-slate-700 text-xs font-medium mt-1 leading-relaxed">{log.details}</div>
                                </div>
                                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-50">
                                    <span className="font-medium text-indigo-600">Modul: {log.module}</span>
                                    <span className="font-mono text-slate-400">{log.ipAddress}</span>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="p-8 text-center text-slate-400 text-xs">
                            Tiada rekod log audit ditemui.
                        </div>
                    )}
                </div>

                {/* Footer & Pagination Navigation */}
                <div className="p-4 bg-slate-50/70 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
                    <div>
                        Menunjukkan <span className="font-semibold text-slate-800">{startRecord}</span> - <span className="font-semibold text-slate-800">{endRecord}</span> daripada <span className="font-semibold text-slate-800">{filteredLogs.length}</span> rekod {totalPages > 1 && `(Halaman ${currentPage} / ${totalPages})`}
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
                </div>
            </div>
        </div>
    );
};
