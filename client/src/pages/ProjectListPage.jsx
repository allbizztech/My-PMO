import React, { useState, useEffect } from 'react';
import {
    AlertTriangle, Trash2, Search, Filter,
    Download, Plus, Edit, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { formatShortName } from '../services/formatters';
import { API_ENDPOINTS } from '../services/api';

export const ProjectListPage = ({ setView, projects, setProjects, onSelectProject, refreshProjects, initialFilter = 'Semua', showToastNotification }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [filterStatus, setFilterStatus] = useState(initialFilter);
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Dynamic Divisions & Units state
    const [divisionList, setDivisionList] = useState([]);
    const [selectedDivisionCode, setSelectedDivisionCode] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('');

    // Dynamic Users List state (Pasukan & Peranan)
    const [userList, setUserList] = useState([]);
    const [projectToDelete, setProjectToDelete] = useState(null);

    const fetchDivisionsAndUnits = async () => {
        try {
            const res = await fetch('/My-PMO/api/modules/divisions.php');
            const data = await res.json();
            if (data.status === 'success' && data.data) {
                setDivisionList(data.data);
            }
        } catch (err) {
            console.error('Ralat mengambil bahagian & unit:', err);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch('/My-PMO/api/modules/users.php');
            const data = await res.json();
            if (data.status === 'success' && data.data) {
                setUserList(data.data);
            }
        } catch (err) {
            console.error('Ralat mengambil senarai pengguna:', err);
        }
    };

    useEffect(() => {
        fetchDivisionsAndUnits();
        fetchUsers();
    }, []);

    useEffect(() => {
        if (initialFilter) setFilterStatus(initialFilter);
    }, [initialFilter]);

    const ITEMS_PER_PAGE = 5;

    const filteredProjects = projects.filter(p => {
        const matchesStatus = filterStatus === 'Semua' ||
            (filterStatus === 'Berisiko' && (p.status === 'Lewat' || p.status === 'Berisiko' || p.health === 'Berisiko')) ||
            p.status === filterStatus;
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery = !q || (
            (p.name && p.name.toLowerCase().includes(q)) ||
            (p.project_code && p.project_code.toLowerCase().includes(q)) ||
            (p.agency && p.agency.toLowerCase().includes(q)) ||
            (p.division && p.division.toLowerCase().includes(q)) ||
            (p.unit && p.unit.toLowerCase().includes(q)) ||
            (p.manager && p.manager.toLowerCase().includes(q)) ||
            (p.vendor_manager && p.vendor_manager.toLowerCase().includes(q)) ||
            (p.pmoVendor && p.pmoVendor.toLowerCase().includes(q))
        );
        return matchesStatus && matchesQuery;
    });
    const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
    const currentProjects = filteredProjects.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const openNewModal = () => {
        setEditingProject(null);
        const defaultDiv = divisionList[0]?.name || 'Bahagian Teknologi Maklumat (BTM)';
        setSelectedDivisionCode(defaultDiv);
        setSelectedUnit('');
        setIsModalOpen(true);
    };

    const openEditModal = (project) => {
        setEditingProject(project);
        setSelectedDivisionCode(project.division || (divisionList[0]?.name || 'Bahagian Teknologi Maklumat (BTM)'));
        setSelectedUnit(project.unit || '');
        setIsModalOpen(true);
    };

    const confirmDeleteProject = async (id) => {
        try {
            const res = await fetch('/My-PMO/api/modules/projects.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            const data = await res.json();
            if (data.status === 'success') {
                if (showToastNotification) showToastNotification('Projek berjaya dipadam.');
                refreshProjects();
            }
        } catch (err) {
            console.error("Ralat memadam projek:", err);
        }
    };

    const handleExportCSV = () => {
        if (filteredProjects.length === 0) {
            alert('Tiada data projek untuk dieksport.');
            return;
        }
        const headers = "Kod Projek,Nama Projek,Agensi,Bahagian,Unit,Status,Kemajuan(%),Pengurus GOV,Pengurus Vendor,Tarikh Mula,Tarikh Tamat\n";
        const rows = filteredProjects.map(p =>
            `"${p.project_code || p.id}","${p.name || ''}","${p.agency || ''}","${p.division || ''}","${p.unit || ''}","${p.status || ''}",${p.progress || 0},"${p.manager || ''}","${p.vendor_manager || p.pmoVendor || ''}","${p.start_date || ''}","${p.end_date || ''}"`
        ).join("\n");

        const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Senarai_Projek_PMO_${new Date().getTime()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        if (showToastNotification) showToastNotification('Fail CSV senarai projek berjaya di-muat turun.');
    };

    const handleSubmitProject = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const progressVal = Number(formData.get('progress'));
        const healthStatus = progressVal === 100 ? 'Cemerlang' : progressVal > 50 ? 'Baik' : 'Amaran';
        const descriptionVal = formData.get('description');
        const budgetVal = parseFloat(formData.get('budget')) || 0;
        const mofApprovalDateVal = formData.get('mofApprovalDate') || '2025-01-12';

        try {
            if (editingProject) {
                const res = await fetch('/My-PMO/api/modules/projects.php', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: editingProject.id,
                        name: formData.get('name'),
                        description: descriptionVal,
                        agency: formData.get('agency'),
                        division: formData.get('division'),
                        unit: formData.get('unit'),
                        status: formData.get('status'),
                        health: healthStatus,
                        progress: progressVal,
                        budget: budgetVal,
                        mofApprovalDate: mofApprovalDateVal,
                        manager: formData.get('pmoGov'),
                        pmoVendor: formData.get('pmoVendor'),
                        vendor: formData.get('vendor'),
                        startDate: formData.get('startDate'),
                        dueDate: formData.get('endDate')
                    })
                });
                await res.json();
            } else {
                const res = await fetch('/My-PMO/api/modules/projects.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formData.get('name'),
                        description: descriptionVal,
                        agency: formData.get('agency'),
                        division: formData.get('division'),
                        unit: formData.get('unit'),
                        status: formData.get('status') || 'Aktif',
                        health: healthStatus,
                        progress: progressVal,
                        budget: budgetVal,
                        mofApprovalDate: mofApprovalDateVal,
                        manager: formData.get('pmoGov'),
                        pmoVendor: formData.get('pmoVendor'),
                        vendor: formData.get('vendor'),
                        startDate: formData.get('startDate'),
                        dueDate: formData.get('endDate')
                    })
                });
                await res.json();
                setCurrentPage(1);
            }
            refreshProjects();
            setIsModalOpen(false);
        } catch (err) {
            console.error("Ralat mencipta/mengemas kini projek:", err);
        }
    };

    // Find currently active division object from divisionList
    const activeDivObj = divisionList.find(d =>
        d.name.toLowerCase() === selectedDivisionCode.toLowerCase() ||
        selectedDivisionCode.toLowerCase().includes(d.code.toLowerCase()) ||
        d.name.toLowerCase().includes(selectedDivisionCode.toLowerCase())
    );
    const activeUnits = activeDivObj?.units || [];

    // Filter Government PMO Officers (PKPMP / pmo_gov / superadmin / admin_agency)
    const pmoGovUsers = userList.filter(u =>
        u.role !== 'pmo_vendor' &&
        (!u.agency || u.agency.toUpperCase().includes('PKPMP') || u.role === 'pmo_gov' || u.role === 'superadmin' || u.role === 'admin_agency')
    );

    // Filter Vendor / Company PMO Officers (pmo_vendor or non-PKPMP agency)
    const pmoVendorUsers = userList.filter(u =>
        u.role === 'pmo_vendor' || (u.agency && !u.agency.toUpperCase().includes('PKPMP'))
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">

            {projectToDelete && (
                <div className="fixed inset-0 z-[70] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setProjectToDelete(null)}></div>
                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                        <div className="relative transform overflow-hidden rounded-[32px] bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md p-6 sm:p-8 animate-in zoom-in-95 border border-slate-100">
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                                    <AlertTriangle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-extrabold text-slate-900">Padam Rekod Projek?</h3>
                                    <p className="text-xs font-semibold text-slate-500 mt-1 leading-relaxed">
                                        Tindakan ini tidak boleh diundur. Adakah anda pasti mahu memadam rekod projek <span className="font-bold text-slate-900">"{projectToDelete.name}"</span>?
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8 flex items-center justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setProjectToDelete(null)}
                                    className="px-5 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors text-sm cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={async () => {
                                        const idToDelete = projectToDelete.id;
                                        setProjectToDelete(null);
                                        await confirmDeleteProject(idToDelete);
                                    }}
                                    className="px-5 py-2.5 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md active:scale-95 transition-all text-sm flex items-center space-x-1.5 cursor-pointer"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Ya, Padam Projek</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                        <div className="relative transform bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-3xl rounded-[32px] animate-in zoom-in-95 duration-200">
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-[32px]">
                                <div>
                                    <h2 className="text-2xl font-extrabold text-slate-900">{editingProject ? 'Kemaskini Projek' : 'Daftar Projek Baharu'}</h2>
                                    <p className="text-slate-500 text-sm font-medium mt-1">{editingProject ? 'Ubah maklumat projek sedia ada.' : 'Masukkan maklumat projek ke dalam pangkalan data PMO.'}</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 shadow-sm border border-slate-200 transition-colors">
                                    <span className="font-bold text-xl leading-none">&times;</span>
                                </button>
                            </div>

                            <form onSubmit={handleSubmitProject} className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Nama Projek</label>
                                        <input name="name" defaultValue={editingProject?.name || ''} required type="text" placeholder="Cth: Sistem ID Digital V2" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all font-medium text-slate-900" />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Keterangan Projek</label>
                                        <textarea name="description" defaultValue={editingProject?.description || ''} rows="3" placeholder="Deskripsi ringkas mengenai objektif projek..." className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all font-medium text-slate-900"></textarea>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Agensi Kerajaan</label>
                                        <select name="agency" defaultValue={editingProject?.agency || 'PKPMP'} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all font-medium text-slate-900">
                                            <option value="PKPMP">Pejabat Ketua Pendaftar Mahkamah Persekutuan (PKPMP)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Bahagian (PKPMP)</label>
                                        <select
                                            name="division"
                                            value={selectedDivisionCode}
                                            onChange={(e) => {
                                                setSelectedDivisionCode(e.target.value);
                                                setSelectedUnit('');
                                            }}
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all font-medium text-slate-900"
                                        >
                                            {divisionList.length > 0 ? (
                                                divisionList.map((div) => (
                                                    <option key={div.id} value={div.name}>
                                                        {div.name}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="Bahagian Teknologi Maklumat (BTM)">Bahagian Teknologi Maklumat (BTM)</option>
                                            )}
                                        </select>
                                    </div>

                                    {/* Dynamic Unit Dropdown */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            Unit di Bawah Bahagian <span className="text-slate-400 font-normal text-xs">(Diambil dari Tetapan Pengurusan Unit)</span>
                                        </label>
                                        <select
                                            name="unit"
                                            value={selectedUnit}
                                            onChange={(e) => setSelectedUnit(e.target.value)}
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all font-medium text-slate-900"
                                        >
                                            <option value="">-- Pilih Unit (Jika Ada) --</option>
                                            {activeUnits.map((u) => (
                                                <option key={u.id} value={u.name}>
                                                    {u.code ? `[${u.code}] ` : ''}{u.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Status Projek</label>
                                        <select key={`status-select-${editingProject?.id || 'new'}-${editingProject?.status || 'Aktif'}`} name="status" defaultValue={editingProject?.status || 'Aktif'} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all font-medium text-slate-900">
                                            <option value="Aktif">Aktif</option>
                                            <option value="Lewat">Lewat</option>
                                            <option value="Selesai">Selesai</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Kemajuan Semasa (%)</label>
                                        <input name="progress" defaultValue={editingProject?.progress || 0} required type="number" min="0" max="100" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all font-medium text-slate-900" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Pegawai PMO (Kerajaan)</label>
                                        <select
                                            name="pmoGov"
                                            defaultValue={editingProject?.manager || ''}
                                            required
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all font-medium text-slate-900"
                                        >
                                            <option value="">-- Pilih Pegawai PMO (Kerajaan) --</option>
                                            {pmoGovUsers.map((u) => (
                                                <option key={u.id} value={u.name}>
                                                    {u.name} {u.agency ? `(${u.agency})` : ''}
                                                </option>
                                            ))}
                                            {editingProject?.manager && !pmoGovUsers.some(u => u.name === editingProject.manager) && (
                                                <option value={editingProject.manager}>{editingProject.manager}</option>
                                            )}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Pegawai PMO (Syarikat)</label>
                                        <select
                                            name="pmoVendor"
                                            defaultValue={editingProject?.vendor_manager || editingProject?.pmoVendor || ''}
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all font-medium text-slate-900"
                                        >
                                            <option value="">-- Pilih Pegawai PMO (Syarikat) --</option>
                                            {pmoVendorUsers.map((u) => (
                                                <option key={u.id} value={u.name}>
                                                    {u.name} {u.agency ? `(${u.agency})` : ''}
                                                </option>
                                            ))}
                                            {(editingProject?.vendor_manager || editingProject?.pmoVendor) && !pmoVendorUsers.some(u => u.name === (editingProject.vendor_manager || editingProject.pmoVendor)) && (
                                                <option value={editingProject.vendor_manager || editingProject.pmoVendor}>
                                                    {editingProject.vendor_manager || editingProject.pmoVendor}
                                                </option>
                                            )}
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Syarikat Vendor / Kontraktor</label>
                                        <input name="vendor" defaultValue={editingProject?.vendor || ''} required type="text" placeholder="Nama Syarikat Vendor/Kontraktor" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all font-medium text-slate-900" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Nilai Projek / Jumlah Peruntukan (RM / Juta)</label>
                                            <input name="budget" defaultValue={editingProject?.budget || ''} required type="number" step="0.01" placeholder="Cth: RM 200,000.00" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all font-medium text-slate-900" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Tarikh Kelulusan MOF</label>
                                            <input name="mofApprovalDate" defaultValue={editingProject?.mof_approval_date || editingProject?.mofApprovalDate || '2025-01-12'} required type="date" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all font-medium text-slate-900" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Tarikh Mula Projek</label>
                                            <input name="startDate" defaultValue={editingProject?.start_date || editingProject?.startDate || ''} required type="date" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all font-medium text-slate-900" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Tarikh Tamat Projek</label>
                                            <input name="endDate" defaultValue={editingProject?.end_date || editingProject?.dueDate || ''} required type="date" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all font-medium text-slate-900" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-100 mt-8">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm">Batal</button>
                                    <button type="submit" className="px-8 py-3 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
                                        {editingProject ? 'Simpan Perubahan' : 'Daftar Projek'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Senarai Projek</h1>
                    <p className="text-slate-500 mt-1 text-sm sm:text-base">Pantau dan urus semua kemajuan projek.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full lg:w-auto">
                    <div className="relative w-full sm:w-64 shrink-0">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            placeholder="Cari projek..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl font-medium focus:ring-4 focus:ring-slate-100 focus:border-slate-400 outline-none shadow-sm transition-all text-sm text-slate-800"
                        />
                    </div>

                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:flex-initial">
                            <button onClick={() => setShowFilterMenu(!showFilterMenu)} className="w-full sm:w-auto bg-white border border-slate-200 px-3.5 sm:px-4 py-2.5 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center shadow-sm transition-colors cursor-pointer whitespace-nowrap text-xs sm:text-sm">
                                <Filter className="w-4 h-4 mr-1.5 sm:mr-2 shrink-0" /> Tapis {filterStatus !== 'Semua' && <span className="ml-1.5 bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[10px]">{filterStatus}</span>}
                            </button>
                            {showFilterMenu && (
                                <div className="absolute top-full mt-2 left-0 sm:right-0 sm:left-auto w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 py-2 animate-in fade-in zoom-in-95">
                                    <p className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status Projek</p>
                                    {['Semua', 'Aktif', 'Lewat', 'Selesai'].map(s => (
                                        <button key={s} onClick={() => { setFilterStatus(s); setShowFilterMenu(false); setCurrentPage(1); }} className={`w-full text-left px-4 py-2 text-sm font-semibold hover:bg-slate-50 ${filterStatus === s ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-700'}`}>
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button onClick={handleExportCSV} className="flex-1 sm:flex-initial bg-white border border-slate-200 text-slate-700 px-3 sm:px-4 py-2.5 rounded-xl font-semibold hover:bg-slate-50 flex items-center justify-center shadow-sm transition-colors cursor-pointer active:scale-95 whitespace-nowrap text-xs sm:text-sm" title="Muat turun senarai sebagai CSV">
                            <Download className="w-4 h-4 mr-1.5 sm:mr-2 text-indigo-600 shrink-0" /> Eksport CSV
                        </button>

                        <button onClick={openNewModal} className="w-full sm:w-auto bg-slate-900 text-white px-4 sm:px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-800 flex items-center justify-center shadow-md transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap text-xs sm:text-sm">
                            <Plus className="w-4 h-4 mr-1.5 sm:mr-2 shrink-0" /> Projek Baharu
                        </button>
                    </div>
                </div>
            </div>

            <Card noPadding className="w-full overflow-hidden border border-slate-100">
                <div className="overflow-x-auto w-full">
                    <table className="w-full min-w-[720px] text-left border-collapse table-auto">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-3 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-12">Bil.</th>
                            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Projek</th>
                            <th className="px-3 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Agensi & Bahagian</th>
                            <th className="px-3 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                            <th className="px-3 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Kemajuan</th>
                            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pengurus Projek (PMO)</th>
                            <th className="px-3 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-24">Tindakan</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/80">
                        {currentProjects.length > 0 ? currentProjects.map((prj, idx) => {
                            const govShort = formatShortName(prj.manager);
                            const vendorShort = formatShortName(prj.vendor_manager || prj.pmoVendor);

                            return (
                                <tr key={prj.id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer" onClick={() => onSelectProject(prj)}>
                                    <td className="px-3 py-4 text-center font-bold text-slate-400 text-xs">
                                        {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="font-bold text-slate-900 text-xs lg:text-sm group-hover:text-indigo-600 transition-colors leading-snug">{prj.name}</div>
                                        <div className="inline-block bg-slate-100 text-slate-500 text-[10px] font-semibold px-2 py-0.5 rounded-md mt-1 border border-slate-200">
                                            {prj.project_code || (String(prj.id).startsWith('PRJ-') ? prj.id : `PRJ-${String(prj.id).padStart(3, '0')}`)}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4 text-xs font-semibold text-slate-600">
                                        <div className="flex flex-col gap-1 items-start">
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wider">
                                                {prj.agency || 'PKPMP'}
                                            </span>
                                            <span className="text-[11px] font-medium text-slate-600">
                                                {prj.division || 'BTM'}
                                            </span>
                                            {prj.unit && (
                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                                    {prj.unit}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4 text-center"><Badge text={prj.status} /></td>
                                    <td className="px-3 py-4 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            {/* Bar melengkung pendek di atas peratusan */}
                                            <div className="w-14 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                                                <div
                                                    className={`h-full rounded-full transition-all ${prj.progress > 75 ? "bg-emerald-500" : prj.progress < 50 ? "bg-amber-500" : "bg-indigo-500"}`}
                                                    style={{ width: `${Math.max(prj.progress || 0, 5)}%` }}
                                                />
                                            </div>
                                            <span className="font-extrabold text-slate-900 text-xs">{prj.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-slate-600">
                                        <div className="flex flex-col gap-1 justify-center">
                                            {/* PMO GOV */}
                                            <div className="flex items-center space-x-1.5">
                                                <span className="px-1 py-0.5 rounded text-[8px] font-black bg-indigo-100 text-indigo-800 uppercase shrink-0">GOV</span>
                                                <span className="font-bold text-xs text-slate-900 truncate" title={prj.manager}>{govShort || 'Tiada'}</span>
                                            </div>
                                            {/* PMO SYARIKAT */}
                                            {vendorShort && (
                                                <div className="flex items-center space-x-1.5">
                                                    <span className="px-1 py-0.5 rounded text-[8px] font-black bg-emerald-100 text-emerald-800 uppercase shrink-0 font-mono">SYARIKAT</span>
                                                    <span className="font-semibold text-xs text-slate-600 truncate" title={prj.vendor_manager || prj.pmoVendor}>{vendorShort}</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4 text-center">
                                        <div className="flex items-center justify-center space-x-1.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                onClick={() => openEditModal(prj)}
                                                title="Kemas Kini"
                                                className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all text-slate-600 shadow-sm active:scale-95 flex items-center justify-center"
                                            >
                                                <Edit className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => setProjectToDelete(prj)}
                                                title="Padam"
                                                className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all text-slate-600 shadow-sm active:scale-95 flex items-center justify-center cursor-pointer"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan="7" className="px-8 py-16 text-center text-slate-500 font-bold text-lg">
                                    Tiada projek dijumpai untuk saringan ini.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                </div>

                <div className="px-4 sm:px-8 py-4 sm:py-5 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-sm font-medium text-slate-500">
                        Memaparkan <span className="font-bold text-slate-900">{(currentPage - 1) * ITEMS_PER_PAGE + (filteredProjects.length > 0 ? 1 : 0)}</span> hingga <span className="font-bold text-slate-900">{Math.min(currentPage * ITEMS_PER_PAGE, filteredProjects.length)}</span> daripada <span className="font-bold text-slate-900">{filteredProjects.length}</span> rekod
                    </span>
                    <div className="flex items-center space-x-3">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-white hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all bg-white shadow-sm"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="text-sm font-extrabold text-slate-700 px-2">
                            {currentPage} / {totalPages || 1}
                        </span>
                        <button
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-white hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all bg-white shadow-sm"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    );
};
