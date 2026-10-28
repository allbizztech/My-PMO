import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    ClipboardCheck, CheckCircle2, AlertCircle, FileText, UploadCloud,
    Download, ExternalLink, Settings2, Printer, ChevronDown, ChevronRight,
    Clock, Shield, Building2, Check, X, AlertTriangle, Paperclip, Plus,
    RefreshCw, Filter, HelpCircle, Eye
} from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { API_ENDPOINTS } from '../../services/api';

const METHOD_DETAILS = {
    direct_purchase: {
        label: 'Pembelian / Rundingan Terus',
        threshold: '< RM 50,000',
        color: 'bg-blue-50 text-blue-700 border-blue-200',
        badgeType: 'default',
        approvalBody: 'Pegawai Pengawal / Ketua Jabatan'
    },
    quotation: {
        label: 'Sebutharga',
        threshold: 'RM 50,001 – RM 500,000',
        color: 'bg-amber-50 text-amber-700 border-amber-200',
        badgeType: 'Amaran',
        approvalBody: 'Jawatankuasa Sebutharga (JKSH)'
    },
    tender: {
        label: 'Tender Awam / Terhad',
        threshold: '> RM 500,000',
        color: 'bg-purple-50 text-purple-700 border-purple-200',
        badgeType: 'Tinggi',
        approvalBody: 'Lembaga Perolehan (LP)'
    }
};

export const ProcurementChecklistTab = ({ project, currentUser, showToastNotification = () => {} }) => {
    const [checklistData, setChecklistData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedPhases, setExpandedPhases] = useState(new Set([1, 2])); // Default buka Fasa 1 & 2
    const [phaseFilter, setPhaseFilter] = useState('all');
    const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);

    // Modals
    const [linkModalItem, setLinkModalItem] = useState(null);
    const [selectedDocId, setSelectedDocId] = useState('');
    const [uploadFile, setUploadFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [settingsMethod, setSettingsMethod] = useState('quotation');
    const [settingsValue, setSettingsValue] = useState(0);
    const [settingsContract, setSettingsContract] = useState(0);
    const [settingsMonths, setSettingsMonths] = useState(0);
    const [settingsNotes, setSettingsNotes] = useState('');
    const [isSavingSettings, setIsSavingSettings] = useState(false);

    // Edit Item Details Modal
    const [editingItem, setEditingItem] = useState(null);
    const [editRefNo, setEditRefNo] = useState('');
    const [editRemarks, setEditRemarks] = useState('');
    const [editStatus, setEditStatus] = useState('pending');
    const [isSavingItem, setIsSavingItem] = useState(false);

    const canEdit = ['superadmin', 'admin_agency', 'pmo_gov'].includes(currentUser?.roleId || currentUser?.role);

    const fetchChecklist = async () => {
        if (!project?.id) return;
        setIsLoading(true);
        try {
            const res = await fetch(`${API_ENDPOINTS.PROCUREMENT_CHECKLIST}?project_id=${project.id}`);
            const data = await res.json();
            if (data.status === 'success') {
                setChecklistData(data.data);
                const chk = data.data.checklist;
                if (chk) {
                    setSettingsMethod(chk.procurement_method || 'quotation');
                    setSettingsValue(Number(chk.estimated_value) || Number(project.budget) || 0);
                    setSettingsContract(chk.requires_contract ? 1 : 0);
                    setSettingsMonths(chk.contract_period_months || 0);
                    setSettingsNotes(chk.notes || '');
                }
            } else {
                showToastNotification(data.message || 'Gagal mengambil data senarai semak.', 'error');
            }
        } catch (err) {
            console.error('Ralat fetching senarai semak:', err);
            showToastNotification('Gagal menyambung ke pelayan API senarai semak.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchChecklist();
    }, [project?.id]);

    const togglePhaseExpand = (pNum) => {
        setExpandedPhases(prev => {
            const next = new Set(prev);
            if (next.has(pNum)) {
                next.delete(pNum);
            } else {
                next.add(pNum);
            }
            return next;
        });
    };

    const toggleAllPhases = (expandAll) => {
        if (expandAll && checklistData?.phases) {
            setExpandedPhases(new Set(checklistData.phases.map(p => p.phase_number)));
        } else {
            setExpandedPhases(new Set());
        }
    };

    // Toggle status checked (checkbox)
    const handleToggleCheck = async (item) => {
        if (!canEdit) {
            showToastNotification('Hanya Pegawai PMO Kerajaan mempunyai kebenaran mengesahkan senarai semak.', 'warning');
            return;
        }

        const newChecked = item.is_checked == 1 ? 0 : 1;
        const newStatus = newChecked ? 'verified' : 'pending';

        // Optimistic update for instantaneous feedback
        setChecklistData(prev => {
            if (!prev || !prev.phases) return prev;
            return {
                ...prev,
                phases: prev.phases.map(ph => ({
                    ...ph,
                    items: ph.items.map(it => it.id === item.id ? { 
                        ...it, 
                        is_checked: newChecked, 
                        status: newStatus,
                        checked_by: newChecked ? (currentUser?.name || 'Pegawai PMO') : null,
                        checked_at: newChecked ? new Date().toISOString().split('T')[0] : null
                    } : it)
                }))
            };
        });

        try {
            const res = await fetch(API_ENDPOINTS.PROCUREMENT_CHECKLIST, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'update_item',
                    item_id: item.id,
                    is_checked: newChecked,
                    status: newStatus,
                    checked_by: currentUser?.name || 'Pegawai PMO',
                    user_id: currentUser?.id || 1
                })
            });
            const data = await res.json();
            if (data.status === 'success' || data.item_status || data.status === 'verified') {
                showToastNotification(newChecked ? `Item ${item.item_code} disahkan selesai.` : `Item ${item.item_code} ditandakan belum selesai.`, 'success');
                fetchChecklist();
            } else {
                showToastNotification(data.message || 'Ralat mengemas kini item.', 'error');
                fetchChecklist();
            }
        } catch (err) {
            showToastNotification('Gagal menyambung ke pelayan.', 'error');
            fetchChecklist();
        }
    };

    // Save item edit (Ref No & Remarks)
    const handleSaveItemDetails = async (e) => {
        e.preventDefault();
        if (!editingItem) return;
        setIsSavingItem(true);
        const newChecked = (editStatus === 'verified' || editStatus === 'not_applicable') ? 1 : 0;
        try {
            const res = await fetch(API_ENDPOINTS.PROCUREMENT_CHECKLIST, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'update_item',
                    item_id: editingItem.id,
                    reference_no: editRefNo,
                    remarks: editRemarks,
                    status: editStatus,
                    is_checked: newChecked,
                    checked_by: currentUser?.name || 'Pegawai PMO',
                    user_id: currentUser?.id || 1
                })
            });
            const data = await res.json();
            if (data.status === 'success' || data.item_status || data.status === 'verified') {
                showToastNotification('Maklumat item berjaya dikemas kini.', 'success');
                setEditingItem(null);
                fetchChecklist();
            } else {
                showToastNotification(data.message || 'Ralat menyimpan maklumat item.', 'error');
            }
        } catch (err) {
            showToastNotification('Gagal menghubungi pelayan.', 'error');
        } finally {
            setIsSavingItem(false);
        }
    };

    // Link existing DMS doc or upload new doc
    const handleLinkDocumentSubmit = async (e) => {
        e.preventDefault();
        if (!linkModalItem) return;
        setIsUploading(true);

        try {
            if (uploadFile) {
                // Upload new file directly
                const formData = new FormData();
                formData.append('action', 'upload_and_link');
                formData.append('project_id', project.id);
                formData.append('item_id', linkModalItem.id);
                formData.append('user_id', currentUser?.id || 1);
                formData.append('category', 'Senarai Semak Perolehan');
                formData.append('file', uploadFile);

                const res = await fetch(API_ENDPOINTS.PROCUREMENT_CHECKLIST, {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();
                if (data.status === 'success') {
                    showToastNotification(`Fail ${data.file_name} berjaya dimuat naik & dipautkan ke DMS.`, 'success');
                    setLinkModalItem(null);
                    setUploadFile(null);
                    fetchChecklist();
                } else {
                    showToastNotification(data.message || 'Ralat memuat naik fail.', 'error');
                }
            } else if (selectedDocId) {
                // Link existing DMS file
                const res = await fetch(API_ENDPOINTS.PROCUREMENT_CHECKLIST, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'link_document',
                        item_id: linkModalItem.id,
                        document_id: selectedDocId,
                        user_id: currentUser?.id || 1
                    })
                });
                const data = await res.json();
                if (data.status === 'success') {
                    showToastNotification('Dokumen DMS berjaya dipautkan.', 'success');
                    setLinkModalItem(null);
                    setSelectedDocId('');
                    fetchChecklist();
                } else {
                    showToastNotification(data.message || 'Ralat memautkan fail.', 'error');
                }
            } else {
                showToastNotification('Sila pilih fail sedia ada atau muat naik fail baharu.', 'warning');
            }
        } catch (err) {
            showToastNotification('Ralat komunikasi pelayan.', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    // Save general checklist settings / method
    const handleSaveSettings = async (e) => {
        e.preventDefault();
        if (!checklistData?.checklist?.id) return;
        setIsSavingSettings(true);
        try {
            const res = await fetch(API_ENDPOINTS.PROCUREMENT_CHECKLIST, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'update_settings',
                    checklist_id: checklistData.checklist.id,
                    procurement_method: settingsMethod,
                    estimated_value: settingsValue,
                    requires_contract: settingsContract,
                    contract_period_months: settingsMonths,
                    notes: settingsNotes,
                    user_id: currentUser?.id || 1
                })
            });
            const data = await res.json();
            if (data.status === 'success') {
                showToastNotification('Tetapan kaedah perolehan berjaya dikemas kini.', 'success');
                setIsSettingsModalOpen(false);
                fetchChecklist();
            } else {
                showToastNotification(data.message || 'Ralat menyimpan tetapan.', 'error');
            }
        } catch (err) {
            showToastNotification('Ralat menghubungi pelayan.', 'error');
        } finally {
            setIsSavingSettings(false);
        }
    };

    // Print Handler
    const handlePrint = () => {
        window.print();
    };

    if (isLoading) {
        return (
            <Card className="py-20 text-center flex flex-col items-center justify-center">
                <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mb-3" />
                <p className="text-sm font-bold text-slate-600">Memuatkan data Senarai Semak Perolehan ICT PKPMP...</p>
            </Card>
        );
    }

    const checklist = checklistData?.checklist || {};
    const phases = checklistData?.phases || [];
    const availableDocs = checklistData?.available_dms_documents || [];
    const methodMeta = METHOD_DETAILS[checklist.procurement_method] || METHOD_DETAILS.quotation;
    const progressPct = checklistData?.progress_percentage || 0;
    const completedItems = checklistData?.completed_items || 0;
    const totalItems = checklistData?.total_items || 0;

    const filteredPhases = phaseFilter === 'all' 
        ? phases 
        : phases.filter(p => p.phase_number === parseInt(phaseFilter));

    const renderPrintableDocument = () => {
        const printDate = new Date().toLocaleDateString('ms-MY', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        return (
            <div className="font-sans text-slate-900 w-full bg-white print:p-0 leading-normal">
                {/* 1. KEPALA SURAT RASMI KERAJAAN (OFFICIAL LETTERHEAD) */}
                <div className="pb-2.5 border-b-2 border-slate-900 mb-3.5">
                    {/* Bar Status Keselamatan & Rujukan Terperingkat (Disusun Kemas Di Bahagian Atas) */}
                    <div className="flex items-center justify-between text-[9px] pb-1.5 mb-2 border-b border-slate-200">
                        <span className="font-mono text-slate-500 font-bold">KOD DOKUMEN: PKPMP/BTM/PMO/SSP-01</span>
                        <div className="flex items-center gap-3">
                            <span className="px-2 py-0.5 bg-slate-100 border border-slate-400 font-mono font-bold text-slate-900 rounded text-[8.5px] uppercase">
                                TERPERINGKAT / DALAMAN
                            </span>
                            <span className="text-slate-500">Tarikh Cetakan: {printDate}</span>
                        </div>
                    </div>

                    {/* Logo + Teks Jabatan (Sebaris Penuh) */}
                    <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center p-2 shrink-0 border border-slate-700">
                            <Shield className="w-7 h-7" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[9.5px] font-extrabold tracking-widest text-slate-600 uppercase leading-none mb-1">
                                JABATAN PERDANA MENTERI
                            </p>
                            <h1 className="text-sm md:text-[14px] font-black uppercase text-slate-900 tracking-tight leading-tight whitespace-nowrap">
                                PEJABAT KETUA PENDAFTAR MAHKAMAH PERSEKUTUAN MALAYSIA
                            </h1>
                            <p className="text-[10.5px] font-bold text-slate-800 leading-snug mt-0.5">
                                BAHAGIAN TEKNOLOGI MAKLUMAT
                            </p>
                            <p className="text-[9px] text-slate-500 leading-none mt-0.5">
                                Istana Kehakiman, Presint 3, 62506 Wilayah Persekutuan Putrajaya
                            </p>
                        </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-300 text-center">
                        <h2 className="text-sm font-black uppercase tracking-wide text-slate-900">
                            SENARAI SEMAK PEMATUHAN TADBIR URUS PEROLEHAN ICT (SOP PKPMP)
                        </h2>
                        <p className="text-[10px] text-slate-600 italic mt-0.5">
                            Pematuhan Tatacara Perolehan Kerajaan &bull; Kelulusan JPICT &bull; Tapak eP &bull; Lantikan Jawatankuasa &bull; Surat Setuju Terima (SST)
                        </p>
                    </div>
                </div>

                {/* 2. BAHAGIAN A: MAKLUMAT PROJEK & PARAMETER PEROLEHAN (TABLE FORMAT) */}
                <div className="mb-3.5 text-[10px]">
                    <div className="bg-slate-800 text-white px-2.5 py-1 font-bold uppercase tracking-wider text-[9.5px] flex justify-between items-center rounded-t border border-slate-800">
                        <span>BAHAGIAN A: MAKLUMAT PROJEK &amp; PARAMETER PEROLEHAN</span>
                        <span className="font-mono text-slate-200 text-[9px]">
                            KEMAJUAN PATUH: {progressPct}% ({completedItems}/{totalItems} Dokumen Disahkan)
                        </span>
                    </div>

                    <table className="w-full border-collapse border border-slate-400 text-[9px]">
                        <tbody>
                            <tr>
                                <td className="w-[18%] bg-slate-100 font-bold border border-slate-400 p-1.5 text-slate-700">Nama Projek:</td>
                                <td className="w-[32%] font-extrabold border border-slate-400 p-1.5 text-slate-900">{project.name}</td>
                                <td className="w-[18%] bg-slate-100 font-bold border border-slate-400 p-1.5 text-slate-700">Kaedah Perolehan:</td>
                                <td className="w-[32%] font-extrabold border border-slate-400 p-1.5 text-indigo-950">
                                    {methodMeta.label} <span className="font-normal text-[8.5px] text-slate-600">({methodMeta.threshold})</span>
                                </td>
                            </tr>
                            <tr>
                                <td className="bg-slate-100 font-bold border border-slate-400 p-1.5 text-slate-700">Kod Projek:</td>
                                <td className="font-mono font-bold border border-slate-400 p-1.5 text-slate-900">{project.project_code || `PRJ-${project.id}`}</td>
                                <td className="bg-slate-100 font-bold border border-slate-400 p-1.5 text-slate-700">Anggaran Nilai Bajet:</td>
                                <td className="font-mono font-extrabold border border-slate-400 p-1.5 text-slate-900">
                                    RM {Number(checklist.estimated_value || project.budget || 0).toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                                </td>
                            </tr>
                            <tr>
                                <td className="bg-slate-100 font-bold border border-slate-400 p-1.5 text-slate-700">Agensi &amp; Bahagian:</td>
                                <td className="border border-slate-400 p-1.5 text-slate-800">{project.agency || 'PKPMP'} &bull; {project.division || 'BTM'}</td>
                                <td className="bg-slate-100 font-bold border border-slate-400 p-1.5 text-slate-700">Badan Kelulusan Akhir:</td>
                                <td className="font-bold border border-slate-400 p-1.5 text-slate-800">{methodMeta.approvalBody}</td>
                            </tr>
                            <tr>
                                <td className="bg-slate-100 font-bold border border-slate-400 p-1.5 text-slate-700">Pengurus PMO (Gov):</td>
                                <td className="font-bold border border-slate-400 p-1.5 text-slate-800">{project.manager || 'Pegawai PMO PKPMP'}</td>
                                <td className="bg-slate-100 font-bold border border-slate-400 p-1.5 text-slate-700">Syarat Bon Kontrak:</td>
                                <td className="border border-slate-400 p-1.5 text-slate-800 font-semibold">
                                    {checklist.requires_contract == 1 ? `Tempoh : ${checklist.contract_period_months || 24} Bulan` : 'Tidak Diperlukan'}
                                </td>
                            </tr>
                            <tr>
                                <td className="bg-slate-100 font-bold border border-slate-400 p-1.5 text-slate-700">Syarikat / Vendor:</td>
                                <td className="border border-slate-400 p-1.5 text-slate-800">{project.vendor || 'Dalam Tindakan Pelantikan'}</td>
                                <td className="bg-slate-100 font-bold border border-slate-400 p-1.5 text-slate-700">Status Keseluruhan:</td>
                                <td className="font-bold border border-slate-400 p-1.5 text-slate-900">
                                    {progressPct === 100 ? (
                                        <span className="text-emerald-700">✓ LENGKAP &amp; MEMATUHI SOP</span>
                                    ) : (
                                        <span className="text-indigo-900">{completedItems} Daripada {totalItems} Dokumen Disahkan ({progressPct}%)</span>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* 3. BAHAGIAN B: RINGKASAN STATUS 8 FASA */}
                <div className="mb-4 text-[10px]">
                    <div className="bg-slate-800 text-white px-2.5 py-1 font-bold uppercase tracking-wider text-[9.5px] flex justify-between items-center rounded-t border border-slate-800">
                        <span>BAHAGIAN B: RINGKASAN STATUS KEMAJUAN MENGIKUT FASA PEROLEHAN</span>
                    </div>

                    <table className="w-full text-[9px] border-collapse border border-slate-400">
                        <thead>
                            <tr className="bg-slate-100 text-slate-900 text-center font-bold">
                                <th className="border border-slate-400 p-1 w-14 text-center">Fasa</th>
                                <th className="border border-slate-400 p-1 text-left">Fasa Tindakan Perolehan SOP</th>
                                <th className="border border-slate-400 p-1 w-20 text-center">Bil. Dokumen</th>
                                <th className="border border-slate-400 p-1 w-20 text-center">Telah Selesai</th>
                                <th className="border border-slate-400 p-1 w-20 text-center">Peratusan</th>
                                <th className="border border-slate-400 p-1 w-28 text-center">Status Fasa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {phases.map((p) => {
                                const isDone = p.completed_items >= p.total_items && p.total_items > 0;
                                const pct = p.total_items > 0 ? Math.round((p.completed_items / p.total_items) * 100) : 0;
                                return (
                                    <tr key={p.phase_number} className="hover:bg-slate-50">
                                        <td className="border border-slate-400 p-1 text-center font-bold">Fasa {p.phase_number}</td>
                                        <td className="border border-slate-400 p-1 font-bold text-slate-800">{p.phase_name}</td>
                                        <td className="border border-slate-400 p-1 text-center">{p.total_items}</td>
                                        <td className="border border-slate-400 p-1 text-center font-bold text-slate-900">{p.completed_items}</td>
                                        <td className="border border-slate-400 p-1 text-center font-mono font-bold">{pct}%</td>
                                        <td className="border border-slate-400 p-1 text-center font-bold">
                                            {isDone ? (
                                                <span className="text-emerald-700">✓ LENGKAP</span>
                                            ) : p.completed_items > 0 ? (
                                                <span className="text-amber-700">DALAM PROSES</span>
                                            ) : (
                                                <span className="text-slate-500">BELUM SELESAI</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* 4. BAHAGIAN C: SENARAI TERPERINCI DOKUMEN BUKTI (SEMUA 8 FASA) */}
                <div className="space-y-4">
                    <div className="bg-slate-900 text-white px-2.5 py-1 font-bold uppercase tracking-wider text-[9.5px] rounded">
                        BAHAGIAN C: SENARAI TERPERINCI SEMAKAN DOKUMEN &amp; BUKTI KELULUSAN (8 FASA)
                    </div>

                    {phases.map((phase) => {
                        const isBreakBefore = phase.phase_number === 3 || phase.phase_number === 8;
                        return (
                            <div 
                                key={phase.phase_number} 
                                className={`mb-3.5 ${isBreakBefore ? 'print-page-break-before pt-2' : ''}`}
                                style={isBreakBefore ? { breakBefore: 'page', pageBreakBefore: 'always' } : {}}
                            >
                                <div className="bg-slate-700 text-white px-2.5 py-1 text-[9.5px] font-bold flex justify-between items-center rounded-t">
                                    <span>FASA {phase.phase_number}: {phase.phase_name.toUpperCase()}</span>
                                    <span className="text-[9px] font-mono text-slate-200">
                                        {phase.completed_items} / {phase.total_items} Disahkan ({phase.total_items > 0 ? Math.round((phase.completed_items / phase.total_items) * 100) : 0}%)
                                    </span>
                                </div>

                            <table className="w-full text-[9px] border-collapse border border-slate-400">
                                <thead>
                                    <tr className="bg-slate-100 text-slate-900 text-left font-bold">
                                        <th className="border border-slate-400 p-1 w-12 text-center">Kod</th>
                                        <th className="border border-slate-400 p-1">Perkara / Dokumen Bukti SOP</th>
                                        <th className="border border-slate-400 p-1 w-20 text-center">Status Semakan</th>
                                        <th className="border border-slate-400 p-1 w-28">No. Rujukan / Kelulusan</th>
                                        <th className="border border-slate-400 p-1 w-20">Pemeriksa</th>
                                        <th className="border border-slate-400 p-1 w-32">Catatan / Dokumen DMS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {phase.items.map((it) => {
                                        const isDone = it.is_checked == 1 || it.status === 'completed';
                                        const isNA = it.status === 'not_applicable';
                                        return (
                                            <tr key={it.id} className={isDone ? 'bg-white' : isNA ? 'bg-slate-50 text-slate-500' : 'bg-amber-50/20'}>
                                                <td className="border border-slate-400 p-1 text-center font-mono font-bold">{it.item_code}</td>
                                                <td className="border border-slate-400 p-1">
                                                    <div className="font-bold text-slate-900">{it.item_title}</div>
                                                    {it.description && (
                                                        <div className="text-[8.5px] text-slate-600 mt-0.5 leading-tight">{it.description}</div>
                                                    )}
                                                </td>
                                                <td className="border border-slate-400 p-1 text-center">
                                                    {isDone ? (
                                                        <span className="inline-block font-bold text-emerald-800 border border-emerald-400 bg-emerald-50 px-1 py-0.5 rounded text-[8.5px]">
                                                            ☑ SELESAI
                                                        </span>
                                                    ) : isNA ? (
                                                        <span className="inline-block font-semibold text-slate-600 border border-slate-300 bg-slate-100 px-1 py-0.5 rounded text-[8.5px]">
                                                            [-] T/B
                                                        </span>
                                                    ) : (
                                                        <span className="inline-block font-semibold text-amber-800 border border-amber-300 bg-amber-50 px-1 py-0.5 rounded text-[8.5px]">
                                                            ☐ BELUM
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="border border-slate-400 p-1 text-slate-800 font-mono text-[8.5px]">
                                                    {it.reference_no || '-'}
                                                </td>
                                                <td className="border border-slate-400 p-1 text-slate-700 text-[8.5px]">
                                                    {it.checked_by || '-'}
                                                </td>
                                                <td className="border border-slate-400 p-1 text-[8.5px]">
                                                    {it.remarks && <div className="text-slate-800 italic">{it.remarks}</div>}
                                                    {it.document_name && (
                                                        <div className="text-slate-600 font-mono text-[8px] mt-0.5">
                                                            Fail: {it.document_name}
                                                        </div>
                                                    )}
                                                    {!it.remarks && !it.document_name && <span className="text-slate-400">-</span>}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    );
                })}
            </div>

                {/* 5. BAHAGIAN D: PERAKUAN & PENGESAHAN DUA PERINGKAT */}
                <div className="mt-6 pt-3 border-t-2 border-slate-900 text-[10px] break-inside-avoid">
                    <div className="text-center font-black uppercase tracking-wider mb-2.5 text-[11px] text-slate-900">
                        BAHAGIAN D: PERAKUAN &amp; PENGESAHAN SEMAKAN PEMATUHAN PEROLEHAN
                    </div>

                    <table className="w-full border-collapse border border-slate-400 text-[9px]">
                        <tbody>
                            <tr>
                                <td className="w-1/2 align-top border border-slate-400 p-3 space-y-2">
                                    <p className="font-extrabold uppercase text-slate-900 border-b border-slate-300 pb-1 text-[9.5px]">
                                        1. Disediakan Oleh (Pegawai PMO / Urus Setia ICT)
                                    </p>
                                    <p className="text-[8.5px] text-slate-600 leading-snug">
                                        Saya mengesahkan bahawa semua maklumat, nombor rujukan, dan dokumen semakan perolehan di atas telah disemak dengan teliti selaras dengan SOP Perolehan ICT PKPMP.
                                    </p>
                                    <div className="pt-6 space-y-1 text-[9px]">
                                        <p className="border-b border-dotted border-slate-400 pb-1">Tandatangan: ................................................................</p>
                                        <p>Nama Pegawai: <strong>{currentUser?.name || '................................................................'}</strong></p>
                                        <p>Jawatan: <strong>Pegawai PMO / Bahagian Teknologi Maklumat PKPMP</strong></p>
                                        <p>Tarikh: <strong>{new Date().toLocaleDateString('ms-MY', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></p>
                                    </div>
                                </td>
                                <td className="w-1/2 align-top border border-slate-400 p-3 space-y-2">
                                    <p className="font-extrabold uppercase text-slate-900 border-b border-slate-300 pb-1 text-[9.5px]">
                                        2. Disahkan &amp; Diperakui Oleh (Ketua Bahagian / Pengarah)
                                    </p>
                                    <p className="text-[8.5px] text-slate-600 leading-snug">
                                        Saya memperakui bahawa perolehan ICT ini telah memenuhi syarat tadbir urus dan garis panduan perolehan yang ditetapkan oleh PKPMP dan Kementerian Kewangan Malaysia.
                                    </p>
                                    <div className="pt-6 space-y-1 text-[9px]">
                                        <p className="border-b border-dotted border-slate-400 pb-1">Tandatangan &amp; Cop: ................................................................</p>
                                        <p>Nama: ................................................................................</p>
                                        <p>Jawatan: <strong>Pengarah Bahagian Kewangan / BTM PKPMP</strong></p>
                                        <p>Tarikh: ................................................................................</p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="mt-4 pt-2 border-t border-slate-300 flex justify-between items-center text-[8.5px] text-slate-500 font-mono">
                        <span>Sistem Pengurusan Projek MY-PMO PKPMP &bull; Modul Senarai Semak Tadbir Urus Perolehan</span>
                        <span>Dokumen Rasmi &bull; Pematuhan Cetakan Berbilang Halaman A4</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full">
            {/* --- INTERACTIVE SCREEN UI (HIDDEN ON PRINT) --- */}
            <div className="space-y-6 animate-in fade-in duration-300 print:hidden">
            {/* --- COMPLIANCE DASHBOARD HEADER CARD --- */}
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-[28px] p-6 lg:p-8 text-white shadow-xl relative overflow-hidden print:hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                                <Shield className="w-3.5 h-3.5" /> SOP PKPMP
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${methodMeta.color}`}>
                                {methodMeta.label} ({methodMeta.threshold})
                            </span>
                        </div>
                        <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-white">
                            Senarai Semak Perolehan ICT
                        </h2>
                        <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
                            Matriks pematuhan tata kelola tadbir urus ICT PKPMP merangkumi 8 fasa kelulusan teknikal, belanja, tapak eP, pelantikan jawatankuasa hingga SST.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                        {canEdit && (
                            <button
                                onClick={() => setIsSettingsModalOpen(true)}
                                className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/15 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
                            >
                                <Settings2 className="w-4 h-4" /> Tetapan Kaedah
                            </button>
                        )}
                        <button
                            onClick={() => setIsPrintPreviewOpen(true)}
                            className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/15 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
                            title="Pratonton Susun Atur Dokumen A4 Rasmi"
                        >
                            <Eye className="w-4 h-4" /> Pratonton Cetak
                        </button>
                        <button
                            onClick={handlePrint}
                            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
                            title="Cetak atau Simpan Sebagai Fail PDF"
                        >
                            <Printer className="w-4 h-4" /> Cetak Senarai Semak (PDF)
                        </button>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10 relative z-10">
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                        <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Status Keseluruhan</span>
                        <div className="flex items-center justify-between mt-1">
                            <span className="text-xl font-extrabold text-white">
                                {progressPct === 100 ? 'Lengkap & Patuh' : `${progressPct}% Selesai`}
                            </span>
                            <span className="text-xs text-indigo-300 font-bold">{completedItems} / {totalItems} Dokumen</span>
                        </div>
                        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-2">
                            <div className={`h-full rounded-full transition-all duration-700 ${progressPct === 100 ? 'bg-emerald-400' : 'bg-indigo-400'}`} style={{ width: `${progressPct}%` }}></div>
                        </div>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                        <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Had Nilai Anggaran</span>
                        <p className="text-xl font-extrabold text-white mt-1">
                            RM {Number(checklist.estimated_value || project.budget || 0).toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">Siling Peruntukan Projek</p>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                        <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Badan Kelulusan Akhir</span>
                        <p className="text-base font-extrabold text-white mt-1 leading-snug">
                            {methodMeta.approvalBody}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">Fasa 8 Keputusan Perolehan</p>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                        <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Tempoh Pelaksanaan</span>
                        <p className="text-xl font-extrabold text-white mt-1">
                            {checklist.contract_period_months || 0} Bulan
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                            {checklist.requires_contract == 1 ? 'Tertakluk Bon & Draf Kontrak' : 'Pesanan Tempatan (LO) / SST'}
                        </p>
                    </div>
                </div>
            </div>

            {/* --- FILTER & ACTION TOOLBAR --- */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm print:hidden">
                <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Filter className="w-3.5 h-3.5 text-indigo-600" /> Tapis Fasa:
                    </span>
                    <select
                        value={phaseFilter}
                        onChange={(e) => setPhaseFilter(e.target.value)}
                        className="px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer"
                    >
                        <option value="all">Semua 8 Fasa SOP PKPMP</option>
                        {phases.map(p => (
                            <option key={p.phase_number} value={p.phase_number}>
                                Fasa {p.phase_number}: {p.phase_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => toggleAllPhases(true)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                    >
                        Buka Semua
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                        onClick={() => toggleAllPhases(false)}
                        className="text-xs font-bold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        Tutup Semua
                    </button>
                </div>
            </div>

            {/* --- 8 PHASES ACCORDION LIST --- */}
            <div className="space-y-4">
                {filteredPhases.map((phase) => {
                    const isExpanded = expandedPhases.has(phase.phase_number);
                    const phaseProgress = phase.total_items > 0 ? Math.round((phase.completed_items / phase.total_items) * 100) : 0;
                    const isPhaseComplete = phaseProgress === 100;

                    return (
                        <div
                            key={phase.phase_number}
                            className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm ${
                                isPhaseComplete ? 'border-emerald-200 shadow-emerald-500/5' : 'border-slate-200/80 hover:border-indigo-200'
                            }`}
                        >
                            {/* Phase Accordion Header */}
                            <div
                                onClick={() => togglePhaseExpand(phase.phase_number)}
                                className={`p-4 lg:p-5 flex items-center justify-between gap-4 cursor-pointer select-none transition-colors ${
                                    isExpanded ? 'bg-slate-50/80 border-b border-slate-100' : 'hover:bg-slate-50/40'
                                }`}
                            >
                                <div className="flex items-center gap-3.5 min-w-0">
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-transform ${
                                        isPhaseComplete 
                                            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' 
                                            : isExpanded 
                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                                            : 'bg-slate-100 text-slate-700'
                                    }`}>
                                        {isPhaseComplete ? <Check className="w-4 h-4" /> : `F${phase.phase_number}`}
                                    </div>

                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                Fasa {phase.phase_number}
                                            </span>
                                            {isPhaseComplete && (
                                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-extrabold uppercase">
                                                    Selesai
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-sm lg:text-base font-extrabold text-slate-900 truncate mt-0.5">
                                            {phase.phase_name}
                                        </h3>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 shrink-0">
                                    <div className="text-right hidden sm:block">
                                        <div className="text-xs font-black text-slate-700">
                                            {phase.completed_items} / {phase.total_items}
                                        </div>
                                        <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${
                                                    isPhaseComplete ? 'bg-emerald-500' : 'bg-indigo-500'
                                                }`}
                                                style={{ width: `${phaseProgress}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-slate-100 text-slate-500 transition-transform duration-200 ${
                                        isExpanded ? 'rotate-180 bg-indigo-50 text-indigo-600' : ''
                                    }`}>
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>

                            {/* Phase Items Table / Content */}
                            {isExpanded && (
                                <div className="divide-y divide-slate-100">
                                    {phase.items.map((item) => {
                                        const isChecked = item.is_checked == 1;
                                        const isNA = item.status === 'not_applicable';

                                        return (
                                            <div
                                                key={item.id}
                                                className={`p-4 lg:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                                                    isChecked 
                                                        ? 'bg-emerald-50/20' 
                                                        : isNA 
                                                        ? 'bg-slate-50/50 opacity-60' 
                                                        : 'hover:bg-slate-50/40'
                                                }`}
                                            >
                                                {/* Left: Checkbox & Document Details */}
                                                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleCheck(item)}
                                                        disabled={!canEdit}
                                                        className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                                                            isChecked
                                                                ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-200'
                                                                : 'bg-white border-2 border-slate-300 hover:border-indigo-500'
                                                        }`}
                                                        title={canEdit ? 'Klik untuk tandakan selesai/belum' : 'Hanya PMO Kerajaan boleh mengesahkan'}
                                                    >
                                                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                                    </button>

                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                                            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                                                                {item.item_code}
                                                            </span>
                                                            <h4 className={`text-sm font-bold tracking-tight text-slate-900 ${
                                                                isChecked ? 'line-through text-slate-500' : ''
                                                            }`}>
                                                                {item.item_title}
                                                            </h4>
                                                            {item.is_mandatory == 1 ? (
                                                                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-100 rounded-full">
                                                                    Wajib
                                                                </span>
                                                            ) : (
                                                                <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                                                                    Bersyarat / Pilihan
                                                                </span>
                                                            )}
                                                        </div>

                                                        {item.description && (
                                                            <p className="text-xs text-slate-500 mb-2 leading-relaxed">
                                                                {item.description}
                                                            </p>
                                                        )}

                                                        {/* Metadata badges (Ref No, Remarks, Auditor) */}
                                                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
                                                            {item.reference_no && (
                                                                <span className="bg-indigo-50/70 border border-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-md font-semibold flex items-center gap-1">
                                                                    No. Ruj: <strong className="font-bold">{item.reference_no}</strong>
                                                                </span>
                                                            )}

                                                            {item.remarks && (
                                                                <span className="text-slate-500 italic">
                                                                    &ldquo;{item.remarks}&rdquo;
                                                                </span>
                                                            )}

                                                            {item.checked_at && (
                                                                <span className="text-slate-400 font-medium flex items-center gap-1">
                                                                    <Clock className="w-3 h-3" /> {item.checked_at.split(' ')[0]} ({item.checked_by || 'PMO'})
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right: Linked Document & Actions */}
                                                <div className="flex flex-wrap items-center gap-2 pl-9 md:pl-0 shrink-0">
                                                    {item.doc_file_name ? (
                                                        <div className="flex items-center gap-2 bg-slate-100/90 hover:bg-slate-200/80 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors">
                                                            <Paperclip className="w-3.5 h-3.5 text-indigo-600" />
                                                            <span className="text-xs font-bold text-slate-700 max-w-[140px] truncate" title={item.doc_file_name}>
                                                                {item.doc_file_name}
                                                            </span>
                                                            <a
                                                                href={`/My-PMO/api/uploads/${item.doc_file_path}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-indigo-600 hover:text-indigo-800 p-1"
                                                                title="Muat turun dokumen bukti"
                                                            >
                                                                <Download className="w-3.5 h-3.5" />
                                                            </a>
                                                        </div>
                                                    ) : (
                                                        canEdit && (
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setLinkModalItem(item);
                                                                    setSelectedDocId('');
                                                                    setUploadFile(null);
                                                                }}
                                                                className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                                                            >
                                                                <UploadCloud className="w-3.5 h-3.5" /> Pautkan Dokumen DMS
                                                            </button>
                                                        )
                                                    )}

                                                    {canEdit && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setEditingItem(item);
                                                                setEditRefNo(item.reference_no || '');
                                                                setEditRemarks(item.remarks || '');
                                                                setEditStatus(item.status || 'pending');
                                                            }}
                                                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                                                            title="Edit Catatan & No Rujukan"
                                                        >
                                                            <Settings2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* --- MODAL: PAUTKAN / MUAT NAIK DOKUMEN KE DMS --- */}
            {linkModalItem && (
                <div className="fixed inset-0 z-[70] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setLinkModalItem(null)}></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                                <div>
                                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Pautan Dokumen DMS</span>
                                    <h3 className="text-lg font-black mt-0.5">{linkModalItem.item_code} - {linkModalItem.item_title}</h3>
                                </div>
                                <button onClick={() => setLinkModalItem(null)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleLinkDocumentSubmit} className="p-6 space-y-5">
                                <div>
                                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                                        Pilihan 1: Pilih Dokumen Sedia Ada dalam Projek (DMS)
                                    </label>
                                    <select
                                        value={selectedDocId}
                                        onChange={(e) => {
                                            setSelectedDocId(e.target.value);
                                            if (e.target.value) setUploadFile(null);
                                        }}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                    >
                                        <option value="">-- Pilih Fail dari Repositori DMS Projek --</option>
                                        {availableDocs.map(doc => (
                                            <option key={doc.id} value={doc.id}>
                                                {doc.file_name} ({doc.category}) - {(doc.file_size / 1024).toFixed(0)} KB
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="relative flex py-2 items-center">
                                    <div className="flex-grow border-t border-slate-200"></div>
                                    <span className="flex-shrink mx-4 text-xs font-extrabold text-slate-400 uppercase">ATAU</span>
                                    <div className="flex-grow border-t border-slate-200"></div>
                                </div>

                                <div>
                                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                                        Pilihan 2: Muat Naik Fail Baharu Terus ke DMS
                                    </label>
                                    <input
                                        type="file"
                                        onChange={(e) => {
                                            setUploadFile(e.target.files[0] || null);
                                            if (e.target.files[0]) setSelectedDocId('');
                                        }}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 border-dashed rounded-xl text-xs font-medium text-slate-600 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 cursor-pointer"
                                    />
                                    <p className="text-[11px] text-slate-400 mt-1">Format dibenarkan: PDF, DOCX, XLSX (Maksimum 25MB).</p>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setLinkModalItem(null)}
                                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isUploading}
                                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                                    >
                                        {isUploading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                                        {isUploading ? 'Menyimpan...' : 'Simpan Pautan Dokumen'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL: EDIT ITEM DETAILS (REF NO & REMARKS) --- */}
            {editingItem && (
                <div className="fixed inset-0 z-[70] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setEditingItem(null)}></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                                <div>
                                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Kemas Kini Status & Rujukan</span>
                                    <h3 className="text-lg font-black mt-0.5">{editingItem.item_code} - {editingItem.item_title}</h3>
                                </div>
                                <button onClick={() => setEditingItem(null)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveItemDetails} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                                        Status Semakan
                                    </label>
                                    <select
                                        value={editStatus}
                                        onChange={(e) => setEditStatus(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:bg-white"
                                    >
                                        <option value="pending">Belum Selesai (Pending)</option>
                                        <option value="submitted">Telah Dihantar / Menunggu Semakan</option>
                                        <option value="verified">Disahkan Selesai (Verified)</option>
                                        <option value="not_applicable">Tidak Berkaitan (N/A)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                                        Nombor Rujukan Surat / Minit Kelulusan
                                    </label>
                                    <input
                                        type="text"
                                        value={editRefNo}
                                        onChange={(e) => setEditRefNo(e.target.value)}
                                        placeholder="cth: PKPMP/BTM/ICT/01/2026"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                                        Catatan Pemeriksa PMO
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={editRemarks}
                                        onChange={(e) => setEditRemarks(e.target.value)}
                                        placeholder="cth: Kertas telah diluluskan dalam Mesyuarat JPICT Bil. 2/2026..."
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setEditingItem(null)}
                                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSavingItem}
                                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                                    >
                                        {isSavingItem ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                                        {isSavingItem ? 'Menyimpan...' : 'Simpan Maklumat'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL: TETAPAN KAEDAH PEROLEHAN --- */}
            {isSettingsModalOpen && (
                <div className="fixed inset-0 z-[70] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsSettingsModalOpen(false)}></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                                <div>
                                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Tetapan Perolehan SOP PKPMP</span>
                                    <h3 className="text-lg font-black mt-0.5">Konfigurasi Had Nilai & Kaedah</h3>
                                </div>
                                <button onClick={() => setIsSettingsModalOpen(false)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveSettings} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                                        Kaedah Perolehan Rasmi
                                    </label>
                                    <select
                                        value={settingsMethod}
                                        onChange={(e) => setSettingsMethod(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:bg-white"
                                    >
                                        <option value="direct_purchase">Pembelian / Rundingan Terus (&lt; RM 50,000)</option>
                                        <option value="quotation">Sebutharga (RM 50,001 – RM 500,000)</option>
                                        <option value="tender">Tender Awam / Terhad (&gt; RM 500,000)</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                                            Nilai Anggaran (RM)
                                        </label>
                                        <input
                                            type="number"
                                            value={settingsValue}
                                            onChange={(e) => setSettingsValue(e.target.value)}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                                            Tempoh (Bulan)
                                        </label>
                                        <input
                                            type="number"
                                            value={settingsMonths}
                                            onChange={(e) => {
                                                const m = parseInt(e.target.value) || 0;
                                                setSettingsMonths(m);
                                                if (m > 4) setSettingsContract(1);
                                            }}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:bg-white"
                                        />
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settingsContract == 1}
                                            onChange={(e) => setSettingsContract(e.target.checked ? 1 : 0)}
                                            className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                        />
                                        <div>
                                            <span className="text-xs font-bold text-slate-900 block">Wajibkan Perjanjian Kontrak Rasmi</span>
                                            <span className="text-[11px] text-slate-500 block">Tertakluk klausa perolehan jika tempoh melebihi 4 bulan.</span>
                                        </div>
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                                        Catatan Khusus Perolehan
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={settingsNotes}
                                        onChange={(e) => setSettingsNotes(e.target.value)}
                                        placeholder="Catatan pelantikan atau klausa syarat..."
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:bg-white"
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsSettingsModalOpen(false)}
                                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSavingSettings}
                                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                                    >
                                        {isSavingSettings ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                                        {isSavingSettings ? 'Menyimpan...' : 'Kemas Kini Tetapan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            </div>

            {/* --- MODAL PRATONTON CETAKAN RASMI (PRINT PREVIEW MODAL) --- */}
            {isPrintPreviewOpen && (
                <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm overflow-y-auto p-3 sm:p-6 flex flex-col items-center print:hidden">
                    {/* Floating Sticky Control Header */}
                    <div className="sticky top-2 z-20 w-full max-w-4xl bg-slate-900/95 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center justify-between mb-4 border border-white/15 backdrop-blur-md">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shrink-0">
                                <FileText className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                                    Pratonton Dokumen Cetakan Rasmi (A4)
                                </h3>
                                <p className="text-[11px] text-slate-300">Format Pematuhan Tadbir Urus Perolehan ICT PKPMP &bull; Berbilang Halaman</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                            <button
                                onClick={() => setIsPrintPreviewOpen(false)}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                            >
                                Tutup
                            </button>
                            <button
                                onClick={() => {
                                    window.print();
                                }}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-indigo-600/40 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
                            >
                                <Printer className="w-4 h-4" /> Cetak Sekarang (PDF)
                            </button>
                        </div>
                    </div>

                    {/* A4 Paper Canvas Simulator */}
                    <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-6 sm:p-12 border border-slate-300 mb-12 text-slate-900 animate-in zoom-in-95 duration-200">
                        {renderPrintableDocument()}
                    </div>
                </div>
            )}

            {/* --- DEDICATED MULTI-PAGE PRINTABLE VIEW (RENDERED DIRECTLY INTO #print-root IN BODY) --- */}
            {typeof document !== 'undefined' && document.getElementById('print-root') && createPortal(
                <div className="font-sans text-slate-900 w-full">
                    {renderPrintableDocument()}
                </div>,
                document.getElementById('print-root')
            )}
        </div>
    );
};
