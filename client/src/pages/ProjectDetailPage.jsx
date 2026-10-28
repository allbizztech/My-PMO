import React, { useState, useEffect } from 'react';
import {
    AlertTriangle, CheckCircle2, MessageSquare, Paperclip,
    FileText, UploadCloud, Briefcase, ChevronRight, Edit,
    Activity, Building2, FolderKanban, UserCheck,
    Calendar as CalendarIcon, DollarSign, Wallet, Plus,
    Clock, Trash2, CheckCircle, Receipt, Folder, Download, Users,
    ClipboardCheck
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ProcurementChecklistTab } from '../components/project/ProcurementChecklistTab';
import { TEAM_MEMBERS } from '../services/mockData';
import { API_ENDPOINTS } from '../services/api';

export const ProjectDetailPage = ({ setView, project, showToastNotification, currentUser, notifications = [], setNotifications = () => { } }) => {
    const formatDateMalay = (dateStr) => {
        if (!dateStr) return '';
        const months = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogo', 'Sep', 'Okt', 'Nov', 'Dis'];
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            const year = parts[0];
            const monthIndex = parseInt(parts[1], 10) - 1;
            const day = parseInt(parts[2], 10);
            return `${String(day).padStart(2, '0')} ${months[monthIndex]} ${year}`;
        }
    };

    const triggerBellNotification = (title, message) => {
        if (setNotifications) {
            setNotifications(prev => [
                {
                    id: Date.now(),
                    title,
                    message,
                    time: 'Baru sahaja',
                    unread: true
                },
                ...prev
            ]);
        }
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const [currentProject, setCurrentProject] = useState(project);
    const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
    const [userList, setUserList] = useState(TEAM_MEMBERS);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('/My-PMO/api/modules/users.php');
                const data = await res.json();
                if (data.status === 'success' && data.data && data.data.length > 0) {
                    setUserList(data.data);
                }
            } catch (err) {
                console.error('Ralat mengambil senarai pengguna:', err);
            }
        };
        fetchUsers();
    }, []);

    const pmoGovUsers = userList.filter(u =>
        u.role !== 'pmo_vendor' &&
        (!u.agency || u.agency.toUpperCase().includes('PKPMP') || u.role === 'pmo_gov' || u.role === 'superadmin' || u.role === 'admin_agency')
    );

    const pmoVendorUsers = userList.filter(u =>
        u.role === 'pmo_vendor' || (u.agency && !u.agency.toUpperCase().includes('PKPMP'))
    );

    useEffect(() => {
        setCurrentProject(project);
    }, [project]);

    const handleUpdateProject = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const name = formData.get('name');
        const description = formData.get('description');
        const agency = formData.get('agency') || 'PKPMP';
        const division = formData.get('division');
        const unit = formData.get('unit');
        const vendor = formData.get('vendor');
        const pmoVendor = formData.get('pmoVendor');
        const manager = formData.get('manager');
        const startDate = formData.get('startDate');
        const dueDate = formData.get('dueDate');
        const budget = formData.get('budget');
        const status = formData.get('status') || 'Aktif';
        const health = formData.get('health') || currentProject.health || 'Baik';
        const progress = parseInt(formData.get('progress') || '0', 10);

        try {
            const res = await fetch('/My-PMO/api/modules/projects.php', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: currentProject.id,
                    name,
                    description,
                    agency,
                    division,
                    unit,
                    vendor,
                    pmoVendor,
                    manager,
                    startDate,
                    dueDate,
                    budget,
                    status,
                    health,
                    progress
                })
            });
            const data = await res.json();
            if (data.status === 'success') {
                const updated = {
                    ...currentProject,
                    name,
                    description,
                    agency,
                    division,
                    unit,
                    vendor,
                    vendor_manager: pmoVendor,
                    manager,
                    start_date: startDate,
                    end_date: dueDate,
                    dueDate: dueDate,
                    budget,
                    status,
                    health,
                    progress
                };
                setCurrentProject(updated);
                setIsEditProjectModalOpen(false);
                showToastNotification?.('Maklumat projek berjaya dikemas kini!');
            } else {
                showToastNotification?.(data.message || 'Gagal mengemas kini projek.');
            }
        } catch (err) {
            console.error("Ralat kemaskini projek:", err);
            showToastNotification?.('Ralat sambungan pelayan.');
        }
    };

    const [activeTab, setActiveTab] = useState('Jadual Bayaran');

    const [milestones, setMilestones] = useState([]);

    const [kanbanTasks, setKanbanTasks] = useState([]);
    const [projectUsers, setProjectUsers] = useState([]);

    const fetchTasks = async () => {
        try {
            const res = await fetch(`/My-PMO/api/modules/tasks.php?project_id=${project.id}`);
            const data = await res.json();
            if (data.status === 'success') {
                const mappedTasks = data.data.map(t => ({
                    id: t.id,
                    project: t.project_id,
                    title: t.title,
                    description: t.description || '',
                    status: t.status,
                    priority: t.priority,
                    assignee: t.assignee_id || '', // keep raw ID for matching later
                    dueDate: t.due_date
                }));
                setKanbanTasks(mappedTasks);
            }
        } catch (err) {
            console.error("Ralat tarik tugasan:", err);
        }
    };

    const fetchProjectUsers = async () => {
        try {
            const res = await fetch('/My-PMO/api/modules/users.php');
            const data = await res.json();
            if (data.status === 'success') {
                setProjectUsers(data.data);
            }
        } catch (err) {
            console.error("Ralat memuat turun pengguna projek:", err);
        }
    };

    const fetchFinances = async () => {
        try {
            const res = await fetch(`/My-PMO/api/modules/finances.php?project_id=${project.id}`);
            const data = await res.json();
            if (data.status === 'success') {
                setFinances(data.data);
            }
        } catch (err) {
            console.error("Ralat memuat turun data kewangan:", err);
        }
    };

    const fetchDocs = async () => {
        try {
            const res = await fetch(`/My-PMO/api/modules/documents.php?project_id=${project.id}`);
            const data = await res.json();
            if (data.status === 'success') {
                setDocs(data.data);
            }
        } catch (err) {
            console.error("Ralat memuat turun dokumen:", err);
        }
    };

    const [ganttItems, setGanttItems] = useState([]);
    const [isGanttModalOpen, setIsGanttModalOpen] = useState(false);
    const [editingGanttItem, setEditingGanttItem] = useState(null);
    const [ganttPage, setGanttPage] = useState(0);

    const [teamMembers, setTeamMembers] = useState([]);
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

    const fetchGanttItems = async () => {
        try {
            const res = await fetch(`/My-PMO/api/modules/gantt.php?project_id=${project.id}`);
            const data = await res.json();
            if (data.status === 'success') {
                setGanttItems(data.data);
            }
        } catch (err) {
            console.error("Ralat memuat turun data Gantt:", err);
        }
    };

    const fetchTeamMembers = async () => {
        try {
            const res = await fetch(`/My-PMO/api/modules/project_members.php?project_id=${project.id}`);
            const data = await res.json();
            if (data.status === 'success') {
                setTeamMembers(data.data);
            }
        } catch (err) {
            console.error("Ralat memuat turun ahli pasukan:", err);
        }
    };

    useEffect(() => {
        if (project?.id) {
            fetchTasks();
            fetchProjectUsers();
            fetchFinances();
            fetchDocs();
            fetchGanttItems();
            fetchTeamMembers();

            try {
                const savedC = localStorage.getItem(`pmo_task_comments_${project.id}`);
                if (savedC) setTaskComments(JSON.parse(savedC));
                const savedA = localStorage.getItem(`pmo_task_attachments_${project.id}`);
                if (savedA) setTaskAttachments(JSON.parse(savedA));

                // Muat turun Jadual Bayaran khas untuk projek ini sahaja
                const savedM = localStorage.getItem(`pmo_payment_schedule_${project.id}`);
                if (savedM) {
                    setMilestones(JSON.parse(savedM));
                } else if (String(project.id) === 'PRJ-101' || String(project.id) === '1') {
                    // Hanya projek demo asal yang mempunyai data rujukan awal
                    const demoMilestones = [
                        { id: 1, title: 'Fasa 1: Bayaran Pendahuluan (10%)', amount: '150,000.00', targetDate: '2026-06-15', target: '15 Jun 2026', status: 'Selesai' },
                        { id: 2, title: 'Fasa 2: Infrastruktur Teras & Pelayan', amount: '450,000.00', targetDate: '2026-08-30', target: '30 Ogo 2026', status: 'Selesai' },
                        { id: 3, title: 'Fasa 3: Audit Keselamatan & Integrasi', amount: '250,000.00', targetDate: '2026-10-15', target: '15 Okt 2026', status: 'Menunggu' },
                        { id: 4, title: 'Fasa 4: Pelancaran & Penyerahan Akhir', amount: '150,000.00', targetDate: '2026-12-01', target: '01 Dis 2026', status: 'Menunggu' }
                    ];
                    setMilestones(demoMilestones);
                } else {
                    // Projek baharu yang ditambah sentiasa KOSONG
                    setMilestones([]);
                }
            } catch (e) { 
                setMilestones([]);
            }
        }
    }, [project]);
    const [finances, setFinances] = useState([]);
    const [docs, setDocs] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
    const [editingMilestone, setEditingMilestone] = useState(null);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [emailNotificationModal, setEmailNotificationModal] = useState(null);
    const [selectedTaskForDetail, setSelectedTaskForDetail] = useState(null);
    const [taskComments, setTaskComments] = useState(() => {
        try {
            const saved = localStorage.getItem(`pmo_task_comments_${project?.id || 'default'}`);
            if (saved) return JSON.parse(saved);
        } catch (e) { }
        return {
            1: [
                { id: 101, author: 'Zara', role: 'PMO Vendor', text: 'Semakan spesifikasi teknikal telah selesai. Sila teruskan dengan fasa pelaksanaan.', date: '27 Jul 2026 10:30 AM' }
            ]
        };
    });

    const [taskAttachments, setTaskAttachments] = useState(() => {
        try {
            const saved = localStorage.getItem(`pmo_task_attachments_${project?.id || 'default'}`);
            if (saved) return JSON.parse(saved);
        } catch (e) { }
        return {
            1: [
                { id: 201, name: 'Lampiran_Spesifikasi_v1.pdf', size: '1.2 MB', uploader: 'Izzat', date: '27 Jul 2026' }
            ]
        };
    });

    useEffect(() => {
        if (project?.id) {
            try {
                localStorage.setItem(`pmo_task_comments_${project.id}`, JSON.stringify(taskComments));
            } catch (e) { }
        }
    }, [taskComments, project?.id]);

    useEffect(() => {
        if (project?.id) {
            try {
                const cleanAttachments = {};
                Object.keys(taskAttachments).forEach(tId => {
                    cleanAttachments[tId] = (taskAttachments[tId] || []).map(f => {
                        const { fileObj, ...rest } = f;
                        return rest;
                    });
                });
                localStorage.setItem(`pmo_task_attachments_${project.id}`, JSON.stringify(cleanAttachments));
            } catch (e) { }
        }
    }, [taskAttachments, project?.id]);
    const [newCommentText, setNewCommentText] = useState('');
    const [isFinanceModalOpen, setIsFinanceModalOpen] = useState(false);
    const [isPenaltyModalOpen, setIsPenaltyModalOpen] = useState(false);
    const [editingFinance, setEditingFinance] = useState(null);
    const [editingPenalty, setEditingPenalty] = useState(null);
    const [financeToDelete, setFinanceToDelete] = useState(null);
    const [editingDoc, setEditingDoc] = useState(null);
    const [docToDelete, setDocToDelete] = useState(null);
    const [memberToDelete, setMemberToDelete] = useState(null);
    const [milestoneToDelete, setMilestoneToDelete] = useState(null);
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('Semua');
    const [isDocModalOpen, setIsDocModalOpen] = useState(false);

    const handleEditDoc = async (e) => {
        e.preventDefault();
        if (!editingDoc) return;
        const formData = new FormData(e.target);
        const fileName = formData.get('file_name');
        const category = formData.get('category');

        try {
            const res = await fetch('/My-PMO/api/modules/documents.php', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: editingDoc.id,
                    file_name: fileName,
                    category: category,
                    user_id: currentUser?.id
                })
            });
            const data = await res.json();
            if (data.status === 'success') {
                fetchDocs();
                setEditingDoc(null);
                showToastNotification?.(`✅ Dokumen '${fileName}' berjaya dikemas kini.`);
            } else {
                alert(data.message || "Gagal mengemaskini dokumen.");
            }
        } catch (err) {
            console.error("Edit doc error:", err);
        }
    };

    const handleAddTeamMember = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const userId = formData.get('user_id');
        const role = formData.get('role') || 'Ahli Pasukan';

        if (!userId) return;

        try {
            const res = await fetch('/My-PMO/api/modules/project_members.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ project_id: project.id, user_id: userId, role })
            });
            const data = await res.json();
            if (data.status === 'success') {
                showToastNotification('Ahli pasukan berjaya ditambah!');
                fetchTeamMembers();
                setIsAddMemberModalOpen(false);
            } else {
                alert('Gagal menambah ahli: ' + data.message);
            }
        } catch (err) {
            console.error("Ralat menambah ahli pasukan:", err);
        }
    };

    const handleRemoveTeamMember = async () => {
        if (!memberToDelete) return;
        try {
            const res = await fetch('/My-PMO/api/modules/project_members.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: memberToDelete.member_id, project_id: project.id })
            });
            const data = await res.json();
            if (data.status === 'success') {
                showToastNotification('Ahli pasukan berjaya dikeluarkan!');
                fetchTeamMembers();
                setMemberToDelete(null);
            } else {
                alert('Gagal mengeluarkan ahli: ' + data.message);
            }
        } catch (err) {
            console.error("Ralat memadam ahli pasukan:", err);
        }
    };

    const handleSaveGanttItem = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const reqBody = {
            project_id: project.id,
            title: formData.get('title'),
            planned_start: formData.get('planned_start'),
            planned_end: formData.get('planned_end'),
            actual_start: formData.get('actual_start') || null,
            actual_end: formData.get('actual_end') || null,
            progress: parseInt(formData.get('progress') || '0', 10),
            status: formData.get('status'),
            is_milestone: formData.get('is_milestone') ? 1 : 0
        };

        try {
            if (editingGanttItem) {
                const res = await fetch('/My-PMO/api/modules/gantt.php', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...reqBody, id: editingGanttItem.id })
                });
                const data = await res.json();
                if (data.status === 'success') {
                    showToastNotification?.('Item Carta Gantt berjaya dikemas kini!');
                }
            } else {
                const res = await fetch('/My-PMO/api/modules/gantt.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(reqBody)
                });
                const data = await res.json();
                if (data.status === 'success') {
                    showToastNotification?.('Item Carta Gantt berjaya ditambah!');
                }
            }
            fetchGanttItems();
            setIsGanttModalOpen(false);
        } catch (err) {
            console.error("Ralat menyimpan data Gantt:", err);
        }
    };

    const handleDeleteGanttItem = async (id) => {
        if (!window.confirm("Adakah anda pasti mahu memadam item Carta Gantt ini?")) return;
        try {
            const res = await fetch('/My-PMO/api/modules/gantt.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            const data = await res.json();
            if (data.status === 'success') {
                showToastNotification?.('Item Carta Gantt berjaya dipadam!');
                fetchGanttItems();
            }
        } catch (err) {
            console.error("Ralat memadam item Gantt:", err);
        }
    };

    if (!project) return null;

    const columns = [
        { id: 'pending', title: 'Akan Datang', color: 'bg-slate-50 border-slate-200', headerBg: 'bg-slate-100 text-slate-800 border-slate-200', badgeBg: 'bg-slate-200 text-slate-800 border-slate-300' },
        { id: 'in_progress', title: 'Sedang Berjalan', color: 'bg-amber-50/40 border-amber-200', headerBg: 'bg-amber-100/90 text-amber-900 border-amber-200', badgeBg: 'bg-amber-600 text-white border-amber-600' },
        { id: 'completed', title: 'Selesai', color: 'bg-emerald-50/60 border-emerald-200', headerBg: 'bg-emerald-100/90 text-emerald-900 border-emerald-300', badgeBg: 'bg-emerald-600 text-white border-emerald-600' }
    ];

    const syncTaskFilesToDms = async (taskObj) => {
        if (!taskObj) return;
        const attachments = taskAttachments[taskObj.id] || [];
        const unsyncedFiles = attachments.filter(f => !f.syncedToDms);

        if (unsyncedFiles.length === 0) return;

        let syncedCount = 0;
        const updatedAttachments = [...attachments];

        for (const fl of unsyncedFiles) {
            try {
                const formData = new FormData();
                formData.append('project_id', project.id);
                formData.append('uploader_id', currentUser?.id || '1');
                formData.append('category', 'Kanban File');
                formData.append('fileName', fl.name.replace(/\.[^/.]+$/, ""));

                if (fl.fileObj) {
                    formData.append('file', fl.fileObj);
                } else {
                    const blob = new Blob([`Kandungan lampiran tugasan: ${fl.name}`], { type: 'text/plain' });
                    formData.append('file', blob, fl.name);
                }

                const res = await fetch('/My-PMO/api/modules/documents.php', {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();
                if (data.status === 'success') {
                    syncedCount++;
                    const itemIdx = updatedAttachments.findIndex(item => item.id === fl.id);
                    if (itemIdx !== -1) {
                        updatedAttachments[itemIdx] = {
                            ...updatedAttachments[itemIdx],
                            syncedToDms: true,
                            dmsDocId: data.id
                        };
                    }
                }
            } catch (err) {
                console.error("Gagal menyelaraskan fail ke DMS:", err);
            }
        }

        if (syncedCount > 0) {
            setTaskAttachments({
                ...taskAttachments,
                [taskObj.id]: updatedAttachments
            });
            if (typeof fetchDocs === 'function') fetchDocs();
            showToastNotification?.(`📁 ${syncedCount} dokumen lampiran tugasan '${taskObj.title}' berjaya dihantar & diselaraskan ke Repositori Dokumen (DMS)!`);
        }
    };

    const unsyncTaskFilesFromDms = async (taskObj) => {
        if (!taskObj) return;
        const attachments = taskAttachments[taskObj.id] || [];
        const syncedFiles = attachments.filter(f => f.syncedToDms || f.dmsDocId);

        if (syncedFiles.length === 0) return;

        let removedCount = 0;
        const updatedAttachments = [...attachments];

        for (const fl of syncedFiles) {
            let targetDocId = fl.dmsDocId;
            if (!targetDocId && Array.isArray(docs)) {
                const matchedDoc = docs.find(d => d.file_name === fl.name);
                if (matchedDoc) targetDocId = matchedDoc.id;
            }

            if (targetDocId) {
                try {
                    const res = await fetch('/My-PMO/api/modules/documents.php', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: targetDocId, user_id: currentUser?.id })
                    });
                    const data = await res.json();
                    if (data.status === 'success') {
                        removedCount++;
                        const itemIdx = updatedAttachments.findIndex(item => item.id === fl.id);
                        if (itemIdx !== -1) {
                            updatedAttachments[itemIdx] = {
                                ...updatedAttachments[itemIdx],
                                syncedToDms: false,
                                dmsDocId: null
                            };
                        }
                    }
                } catch (err) {
                    console.error("Gagal mengeluarkan dokumen dari DMS:", err);
                }
            }
        }

        if (removedCount > 0) {
            setTaskAttachments({
                ...taskAttachments,
                [taskObj.id]: updatedAttachments
            });
            if (typeof fetchDocs === 'function') fetchDocs();
            showToastNotification?.(`ℹ️ ${removedCount} dokumen lampiran tugasan '${taskObj.title}' telah dikeluarkan daripada Repositori Dokumen (DMS).`);
        }
    };

    const handleDragStart = (e, taskId) => {
        e.dataTransfer.setData('taskId', taskId);
    };

    const handleDrop = async (e, newStatus) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        const taskObj = kanbanTasks.find(t => t.id == taskId);
        const prevStatus = taskObj?.status;
        const assignedUser = projectUsers.find(u => u.id == taskObj?.assignee);
        const officerName = assignedUser?.name || 'Pegawai Bertanggungjawab';

        setKanbanTasks(kanbanTasks.map(t => t.id == taskId ? { ...t, status: newStatus } : t));

        if (newStatus === 'completed') {
            syncTaskFilesToDms(taskObj);
            showToastNotification?.(`✅ Tugasan '${taskObj?.title || 'Tugasan'}' telah diselesaikan! Notifikasi dihantar kepada PMO & ${officerName}.`);
        } else {
            if (prevStatus === 'completed') {
                unsyncTaskFilesFromDms(taskObj);
            }
            showToastNotification?.(`Status tugasan ditukar kepada ${newStatus === 'in_progress' ? 'Sedang Berjalan' : 'Akan Datang'}`);
        }

        try {
            await fetch('/My-PMO/api/modules/tasks.php', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: taskId, status: newStatus })
            });
        } catch (err) {
            console.error("Gagal mengemaskini status:", err);
            fetchTasks();
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleSaveMilestone = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newTitle = formData.get('title');
        const newAmount = formData.get('amount') || '0.00';
        const newTargetDate = formData.get('targetDate');
        const newStatus = formData.get('status') || 'Menunggu';
        const newTarget = newTargetDate ? formatDateMalay(newTargetDate) : (formData.get('target') || 'Mengikut Jadual');
        const cleanedAmount = parseFloat(newAmount.toString().replace(/,/g, '')) || 0;

        let updated = [];
        let milestoneId = null;

        if (editingMilestone) {
            milestoneId = editingMilestone.id;
            updated = milestones.map(m => m.id === editingMilestone.id ? { 
                ...m, 
                title: newTitle, 
                amount: newAmount,
                targetDate: newTargetDate,
                status: newStatus, 
                target: newTarget 
            } : m);
            showToastNotification?.('Jadual bayaran berjaya dikemaskini!');
        } else {
            milestoneId = Date.now();
            updated = [...milestones, { 
                id: milestoneId, 
                title: newTitle, 
                amount: newAmount,
                targetDate: newTargetDate,
                status: newStatus, 
                target: newTarget 
            }];
            showToastNotification?.('Jadual bayaran baharu berjaya ditetapkan!');
        }
        setMilestones(updated);
        try {
            if (project?.id) {
                localStorage.setItem(`pmo_payment_schedule_${project.id}`, JSON.stringify(updated));
            }
        } catch (err) {}

        // Selaraskan rekod secara terus ke Senarai Rekod Kewangan & Denda SLA
        try {
            const existingFin = finances.find(f => 
                (f.milestone_id && String(f.milestone_id) === String(milestoneId)) ||
                (f.invoice_no && f.invoice_no === `JDL-${String(milestoneId).slice(-4)}`) ||
                (editingMilestone && f.description === editingMilestone.title)
            );

            if (existingFin) {
                await fetch('/My-PMO/api/modules/finances.php', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: existingFin.id,
                        description: newTitle,
                        amount: cleanedAmount,
                        status: newStatus,
                        date: newTargetDate || existingFin.date,
                        milestone_id: milestoneId,
                        user_id: currentUser?.id
                    })
                });
            } else {
                const autoRef = `JDL-${String(milestoneId).slice(-4)}`;
                await fetch('/My-PMO/api/modules/finances.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        project_id: project.id,
                        invoice_no: autoRef,
                        description: newTitle,
                        vendor: project.vendor || 'Belum Dilantik',
                        amount: cleanedAmount,
                        status: newStatus,
                        type: 'Invois',
                        date: newTargetDate || new Date().toISOString().split('T')[0],
                        milestone_id: milestoneId,
                        user_id: currentUser?.id
                    })
                });
            }
            fetchFinances();
        } catch (err) {
            console.error("Ralat selaraskan rekod kewangan:", err);
        }

        setIsMilestoneModalOpen(false);
    };

    const handleDeleteMilestone = async () => {
        if (!milestoneToDelete) return;
        const updated = milestones.filter(m => m.id !== milestoneToDelete.id);
        setMilestones(updated);
        try {
            if (project?.id) {
                localStorage.setItem(`pmo_payment_schedule_${project.id}`, JSON.stringify(updated));
            }
        } catch (err) {}

        // Padam rekod pautan dalam finances jika ada
        const linkedFin = finances.find(f => 
            (f.milestone_id && String(f.milestone_id) === String(milestoneToDelete.id)) ||
            (f.invoice_no && f.invoice_no === `JDL-${String(milestoneToDelete.id).slice(-4)}`)
        );
        if (linkedFin) {
            try {
                await fetch('/My-PMO/api/modules/finances.php', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: linkedFin.id, user_id: currentUser?.id })
                });
                fetchFinances();
            } catch (err) {
                console.error("Ralat padam rekod pautan kewangan:", err);
            }
        }

        showToastNotification?.('Jadual bayaran berjaya dipadam!');
        setMilestoneToDelete(null);
    };

    const handleSaveTask = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const title = formData.get('title');
        const description = formData.get('description') || '';
        const priority = formData.get('priority') || 'Sederhana';
        const dueDate = formData.get('dueDate');
        const assigneeId = formData.get('assignee');
        const status = formData.get('status') || 'pending';
        const assignedUser = projectUsers.find(u => u.id == assigneeId);

        try {
            if (editingTask) {
                await fetch('/My-PMO/api/modules/tasks.php', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: editingTask.id,
                        title,
                        description,
                        status,
                        priority,
                        due_date: dueDate,
                        assignee_id: assigneeId
                    })
                });
                setKanbanTasks(kanbanTasks.map(t => t.id === editingTask.id ? { ...t, title, description, status, priority, dueDate, assignee: assigneeId } : t));
                if (selectedTaskForDetail && selectedTaskForDetail.id === editingTask.id) {
                    setSelectedTaskForDetail(prev => ({ ...prev, title, description, status, priority, dueDate, assignee: assigneeId }));
                }
                showToastNotification?.('Tugasan berjaya dikemas kini.');
            } else {
                const newTaskObj = {
                    id: Date.now(),
                    project_id: project.id,
                    title,
                    description,
                    status: 'pending',
                    priority,
                    dueDate,
                    assignee: assigneeId
                };
                await fetch('/My-PMO/api/modules/tasks.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        project_id: project.id,
                        title,
                        description,
                        priority,
                        due_date: dueDate,
                        assignee_id: assigneeId
                    })
                });
                setKanbanTasks([...kanbanTasks, newTaskObj]);
                showToastNotification?.('Tugasan baharu ditambah ke Kanban.');
            }

            fetchTasks();

            if (assignedUser) {
                // 1. Trigger System Bell Notification
                triggerBellNotification(
                    `🔔 Tugasan Ditugaskan: ${title}`,
                    `Anda telah ditugaskan oleh PMO untuk menyiap tugasan '${title}' (${project.name}) sebelum ${dueDate || 'tarikh tamat'}.`
                );

                // 2. Launch Email Notification Modal Preview
                setEmailNotificationModal({
                    recipientName: assignedUser.name,
                    recipientEmail: assignedUser.email || `${assignedUser.name.toLowerCase().replace(/\s+/g, '.')}@kehakiman.gov.my`,
                    taskTitle: title,
                    description: description || 'Tiada keterangan khas diberikan oleh PMO.',
                    priority,
                    dueDate: dueDate || '12 Ogo 2026',
                    projectName: project.name,
                    senderName: currentUser?.name || 'Pengarah PMO'
                });
            }

            fetchTasks();
            setIsTaskModalOpen(false);
        } catch (err) {
            console.error("Gagal simpan tugasan:", err);
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            const res = await fetch('/My-PMO/api/modules/tasks.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            const data = await res.json();
            if (data.status === 'success') {
                showToastNotification?.('Tugasan dipadam.');
                fetchTasks();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaveFinance = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const amtStr = formData.get('amount') || '0';
        const cleanedAmount = parseFloat(amtStr.toString().replace(/,/g, '')) || 0;

        const linkedMsId = formData.get('linked_milestone_id');

        const reqBody = {
            project_id: project.id,
            invoice_no: formData.get('invId'),
            description: formData.get('description'),
            vendor: formData.get('vendor'),
            amount: cleanedAmount,
            status: formData.get('status'),
            date: formData.get('date'),
            milestone_id: linkedMsId && linkedMsId !== '' ? parseInt(linkedMsId, 10) : null,
            user_id: currentUser?.id
        };

        try {
            if (editingFinance) {
                const res = await fetch('/My-PMO/api/modules/finances.php', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...reqBody, id: editingFinance.id })
                });
                const data = await res.json();
                if (data.status === 'success') {
                    showToastNotification('Rekod kewangan berjaya dikemas kini!');
                }
            } else {
                const res = await fetch('/My-PMO/api/modules/finances.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(reqBody)
                });
                const data = await res.json();
                if (data.status === 'success') {
                    showToastNotification('Tuntutan baru berjaya didaftarkan!');
                }
            }

            const linkedMsId = formData.get('linked_milestone_id');
            if (linkedMsId) {
                setMilestones(prev => {
                    const updated = prev.map(m => {
                        if (String(m.id) === String(linkedMsId)) {
                            return { ...m, status: formData.get('status') };
                        }
                        return m;
                    });
                    try {
                        if (project?.id) {
                            localStorage.setItem(`pmo_payment_schedule_${project.id}`, JSON.stringify(updated));
                        }
                    } catch (e) {}
                    return updated;
                });
            }

            fetchFinances();
            setIsFinanceModalOpen(false);
        } catch (err) {
            console.error("Ralat menyimpan data kewangan:", err);
        }
    };

    const handleDeleteFinance = async (id) => {
        try {
            const res = await fetch('/My-PMO/api/modules/finances.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, user_id: currentUser?.id })
            });
            const data = await res.json();
            if (data.status === 'success') {
                showToastNotification('Rekod kewangan berjaya dipadam!');
                fetchFinances();
            }
        } catch (err) {
            console.error("Ralat memadam rekod kewangan:", err);
        }
    };

    const handleSavePenalty = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const refNo = formData.get('refNo');
        const description = formData.get('description');
        const slaCategory = formData.get('slaCategory') || 'Kelewatan Masa';
        const vendor = formData.get('vendor') || project.vendor || 'Vendor Utama';
        const amtStr = formData.get('amount') || '0';
        const cleanedAmount = parseFloat(amtStr.toString().replace(/,/g, '')) || 0;
        const date = formData.get('date');
        const notes = formData.get('notes') || '';
        const fileInput = formData.get('file');

        if (!refNo || !description || cleanedAmount <= 0 || !date) {
            alert('Sila isi maklumat wajib denda SLA (No. Rujukan, Keterangan, Tarikh & Amaun).');
            return;
        }

        let uploadedDocMsg = '';
        if (fileInput && fileInput.name && fileInput.size > 0) {
            try {
                const docFormData = new FormData();
                docFormData.append('project_id', project.id);
                docFormData.append('category', 'Denda');
                docFormData.append('uploader_id', currentUser?.id || 1);
                docFormData.append('fileName', `Butiran_Denda_${refNo}`);
                docFormData.append('file', fileInput);

                const docRes = await fetch('/My-PMO/api/modules/documents.php', {
                    method: 'POST',
                    body: docFormData
                });
                const docData = await docRes.json();
                if (docData.status === 'success') {
                    uploadedDocMsg = ' & fail detail denda automatik disimpan ke DMS (Folder Denda)';
                }
            } catch (err) {
                console.error("Ralat muat naik fail denda ke DMS:", err);
            }
        }

        const reqBody = {
            project_id: project.id,
            invoice_no: refNo,
            description: `[DENDA SLA: ${slaCategory}] ${description}${notes ? ' (' + notes + ')' : ''}`,
            vendor: vendor,
            amount: cleanedAmount,
            status: 'Denda SLA',
            type: 'Denda',
            date: date,
            user_id: currentUser?.id
        };

        try {
            if (editingPenalty) {
                const res = await fetch('/My-PMO/api/modules/finances.php', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...reqBody, id: editingPenalty.id })
                });
                const data = await res.json();
                if (data.status === 'success') {
                    showToastNotification?.(`⚠️ Denda SLA berjaya dikemas kini${uploadedDocMsg}!`);
                    fetchFinances();
                    fetchDocs();
                    setIsPenaltyModalOpen(false);
                    setEditingPenalty(null);
                } else {
                    alert('Gagal mengemaskini denda: ' + data.message);
                }
            } else {
                const res = await fetch('/My-PMO/api/modules/finances.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(reqBody)
                });
                const data = await res.json();
                if (data.status === 'success') {
                    showToastNotification?.(`⚠️ Denda SLA sebanyak RM ${cleanedAmount.toLocaleString('ms-MY', { minimumFractionDigits: 2 })} berjaya didaftarkan${uploadedDocMsg}!`);
                    fetchFinances();
                    fetchDocs();
                    setIsPenaltyModalOpen(false);
                } else {
                    alert('Gagal mendaftar denda: ' + data.message);
                }
            }
        } catch (err) {
            console.error("Ralat menyimpan Denda SLA:", err);
        }
    };

    const handleUploadDoc = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append('project_id', project.id);
        formData.append('uploader_id', currentUser?.id || '');

        try {
            const res = await fetch('/My-PMO/api/modules/documents.php', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.status === 'success') {
                showToastNotification('Dokumen berjaya dimuat naik!');
                fetchDocs();
                setIsDocModalOpen(false);
                setSelectedFile(null);
            } else {
                alert('Gagal memuat naik: ' + data.message);
            }
        } catch (err) {
            console.error("Ralat memuat naik dokumen:", err);
            alert('Ralat semasa menghubungi pelayan.');
        }
    };

    const handleDeleteDoc = async (id) => {
        try {
            const res = await fetch('/My-PMO/api/modules/documents.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, user_id: currentUser?.id })
            });
            const data = await res.json();
            if (data.status === 'success') {
                showToastNotification('Dokumen berjaya dipadam!');
                fetchDocs();
            } else {
                alert('Gagal memadam dokumen: ' + data.message);
            }
        } catch (err) {
            console.error("Ralat memadam dokumen:", err);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">

            {/* --- ALL POPUP MODALS --- */}
            {isGanttModalOpen && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsGanttModalOpen(false)}></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-2xl animate-in zoom-in-95 duration-200">
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-[32px]">
                                <div>
                                    <h2 className="text-xl font-extrabold text-slate-900">{editingGanttItem ? 'Kemaskini Item Carta Gantt' : 'Tambah Fasa / Item Gantt Baharu'}</h2>
                                    <p className="text-slate-500 text-xs font-medium mt-1">Isi tarikh perancangan dan pelaksanaan sebenar bagi item ini.</p>
                                </div>
                                <button onClick={() => setIsGanttModalOpen(false)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200 text-slate-500 hover:text-slate-900">&times;</button>
                            </div>
                            <form onSubmit={handleSaveGanttItem} className="p-8 space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Tajuk Fasa / Tugasan / Pencapaian</label>
                                    <input name="title" defaultValue={editingGanttItem?.title || ''} required type="text" placeholder="Cth: Fasa 1: Pengumpulan Keperluan" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none font-medium text-slate-900" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 bg-indigo-50/40 rounded-2xl border border-indigo-100">
                                    <div className="md:col-span-2 text-xs font-extrabold uppercase tracking-wider text-indigo-900">1. Garis Masa Perancangan (Planned)</div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Tarikh Mula Dirancang</label>
                                        <input name="planned_start" defaultValue={editingGanttItem?.planned_start || ''} required type="date" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none text-sm font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Tarikh Tamat Dirancang</label>
                                        <input name="planned_end" defaultValue={editingGanttItem?.planned_end || ''} required type="date" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none text-sm font-medium" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 bg-emerald-50/40 rounded-2xl border border-emerald-100">
                                    <div className="md:col-span-2 text-xs font-extrabold uppercase tracking-wider text-emerald-900">2. Pelaksanaan Sebenar (Actual)</div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Tarikh Mula Sebenar (Jika bermula)</label>
                                        <input name="actual_start" defaultValue={editingGanttItem?.actual_start || ''} type="date" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none text-sm font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Tarikh Tamat Sebenar (Jika siap)</label>
                                        <input name="actual_end" defaultValue={editingGanttItem?.actual_end || ''} type="date" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none text-sm font-medium" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Kemajuan Sebenar (%)</label>
                                        <input name="progress" defaultValue={editingGanttItem?.progress || 0} required type="number" min="0" max="100" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Status Fasa</label>
                                        <select name="status" defaultValue={editingGanttItem?.status || 'Belum Mula'} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold">
                                            <option value="Belum Mula">Belum Mula</option>
                                            <option value="Sedang Berjalan">Sedang Berjalan</option>
                                            <option value="Selesai">Selesai</option>
                                            <option value="Tertunda">Tertunda</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 pt-2">
                                    <input type="checkbox" id="is_milestone" name="is_milestone" defaultChecked={!!editingGanttItem?.is_milestone} className="w-5 h-5 accent-indigo-600 rounded cursor-pointer" />
                                    <label htmlFor="is_milestone" className="text-sm font-bold text-slate-800 cursor-pointer">Tanda sebagai Pencapaian Utama (Milestone ◆)</label>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                                    <button type="button" onClick={() => setIsGanttModalOpen(false)} className="px-5 py-3 rounded-xl font-bold text-slate-600 border border-slate-200 hover:bg-slate-50">Batal</button>
                                    <button type="submit" className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 shadow-md">
                                        {editingGanttItem ? 'Simpan Perubahan' : 'Tambah Fasa'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {isMilestoneModalOpen && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsMilestoneModalOpen(false)}></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-xl animate-in zoom-in-95 duration-200">
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-[32px]">
                                <div>
                                    <h2 className="text-xl font-extrabold text-slate-900">{editingMilestone ? 'Kemaskini Jadual Bayaran' : 'Tetapkan Jadual Bayaran Projek'}</h2>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">Penetapan tarikh matang awal bagi mengelakkan bayaran lewat</p>
                                </div>
                                <button onClick={() => setIsMilestoneModalOpen(false)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200 text-slate-500 hover:text-slate-800">&times;</button>
                            </div>
                            <form onSubmit={handleSaveMilestone} className="p-8 space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Peringkat / Keterangan Bayaran</label>
                                    <input name="title" defaultValue={editingMilestone?.title || ''} required type="text" placeholder="Cth: Bayaran Kemajuan Fasa 1 (Infrastruktur)" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none text-slate-800 font-medium" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Jumlah Bayaran (RM)</label>
                                        <input name="amount" defaultValue={editingMilestone?.amount || ''} required type="text" placeholder="Cth: 150,000.00" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-indigo-700" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Tarikh Sasaran Matang</label>
                                        <input name="targetDate" defaultValue={editingMilestone?.targetDate || ''} required type="date" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Status Bayaran</label>
                                    <select name="status" defaultValue={editingMilestone?.status || 'Menunggu'} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium">
                                        <option value="Menunggu">Menunggu</option>
                                        <option value="Dalam Tindakan">Dalam Tindakan</option>
                                        <option value="Selesai">Selesai</option>
                                        <option value="Lewat">Lewat</option>
                                    </select>
                                </div>
                                <div className="flex justify-end pt-4 space-x-3 border-t border-slate-100">
                                    <button type="button" onClick={() => setIsMilestoneModalOpen(false)} className="px-5 py-3 rounded-xl font-bold text-slate-600 border border-slate-200 hover:bg-slate-50">Batal</button>
                                    <button type="submit" className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 shadow-md">Simpan Jadual Bayaran</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {isTaskModalOpen && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsTaskModalOpen(false)}></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-xl animate-in zoom-in-95 duration-200">
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-[32px]">
                                <h2 className="text-xl font-extrabold text-slate-900">{editingTask ? 'Kemaskini Tugasan' : 'Tambah Tugasan Baharu'}</h2>
                                <button onClick={() => setIsTaskModalOpen(false)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200">&times;</button>
                            </div>
                            <form onSubmit={handleSaveTask} className="p-8 space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Tajuk Tugasan</label>
                                        <input name="title" defaultValue={editingTask?.title || ''} required type="text" placeholder="Apa yang perlu disiapkan?" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Keterangan / Arahan Tugasan (Khas Pegawai)</label>
                                        <textarea name="description" defaultValue={editingTask?.description || ''} rows={3} placeholder="Masukkan arahan terperinci atau skop kerja supaya pegawai jelas dengan tugas ini..." className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none resize-none text-sm font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Status Semasa</label>
                                        <select name="status" defaultValue={editingTask?.status || 'pending'} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none">
                                            <option value="pending">Akan Datang</option>
                                            <option value="in_progress">Sedang Berjalan</option>
                                            <option value="completed">Selesai</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Keutamaan</label>
                                        <select name="priority" defaultValue={editingTask?.priority || 'Sederhana'} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none">
                                            <option value="Sederhana">Sederhana</option>
                                            <option value="Tinggi">Tinggi</option>
                                            <option value="Segera">Segera</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Pegawai Bertanggungjawab</label>
                                        <select name="assignee" defaultValue={editingTask?.assignee || ''} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none">
                                            <option value="">Belum Ditugaskan</option>
                                            {projectUsers.map(u => (
                                                <option key={u.id} value={u.id}>{u.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Tarikh Siap (Due Date)</label>
                                        <input name="dueDate" defaultValue={editingTask?.dueDate || ''} required type="date" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4"><button type="submit" className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800">{editingTask ? 'Simpan Perubahan' : 'Tambah ke Papan'}</button></div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {isFinanceModalOpen && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsFinanceModalOpen(false)}></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-2xl animate-in zoom-in-95 duration-200">
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-[32px]">
                                <h2 className="text-xl font-extrabold text-slate-900">{editingFinance ? 'Kemaskini Tuntutan' : 'Daftar Tuntutan/Invois'}</h2>
                                <button onClick={() => setIsFinanceModalOpen(false)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200">&times;</button>
                            </div>
                            <form onSubmit={handleSaveFinance} className="p-8 space-y-5">
                                {(() => {
                                    const matchedMilestoneId = editingFinance?.milestone_id 
                                        ? String(editingFinance.milestone_id) 
                                        : (editingFinance?.linked_milestone_id 
                                            ? String(editingFinance.linked_milestone_id) 
                                            : (() => {
                                                if (!editingFinance?.description) return '';
                                                const desc = editingFinance.description.toLowerCase().trim();
                                                const found = milestones.find(m => {
                                                    const title = m.title.toLowerCase().trim();
                                                    return desc.includes(title) || title.includes(desc.replace(/^tuntutan\s+/i, ''));
                                                });
                                                return found ? String(found.id) : '';
                                            })());

                                    return (
                                        <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl">
                                            <label className="block text-xs font-extrabold uppercase tracking-wider text-indigo-900 mb-1.5 flex items-center justify-between">
                                                <span>Pautkan ke Jadual Bayaran / Milestone Projek</span>
                                                <span className="text-[11px] text-indigo-600 font-semibold lowercase">isi fasa & amaun automatik</span>
                                            </label>
                                            <select 
                                                key={editingFinance ? `edit-fin-${editingFinance.id}-${matchedMilestoneId}` : 'new-fin'}
                                                name="linked_milestone_id"
                                                defaultValue={matchedMilestoneId}
                                                onChange={(e) => {
                                                    const selectedId = e.target.value;
                                                    if (selectedId) {
                                                        const ms = milestones.find(m => String(m.id) === String(selectedId));
                                                        if (ms) {
                                                            const descInput = document.querySelector('input[name="description"]');
                                                            const amtInput = document.querySelector('input[name="amount"]');
                                                            if (descInput) descInput.value = `Tuntutan ${ms.title}`;
                                                            if (amtInput && ms.amount) amtInput.value = ms.amount;
                                                        }
                                                    }
                                                }}
                                                className="w-full px-4 py-2.5 bg-white border border-indigo-200 rounded-xl outline-none font-bold text-slate-800 text-sm focus:ring-4 focus:ring-indigo-100 cursor-pointer"
                                            >
                                                <option value="">-- Tiada Pautan (Tuntutan Bebas) --</option>
                                                {milestones.map(ms => (
                                                    <option key={ms.id} value={String(ms.id)}>
                                                        {ms.title} - RM {ms.amount ? Number(String(ms.amount).replace(/,/g, '')).toLocaleString('en-MY', { minimumFractionDigits: 2 }) : '0.00'} [{ms.status}]
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    );
                                })()}
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">No. Invois</label>
                                        <input name="invId" defaultValue={editingFinance?.invoice_no || `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 900) + 100}`} required type="text" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-indigo-700" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Tarikh Tuntutan</label>
                                        <input name="date" defaultValue={editingFinance?.date || ''} required type="date" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Keterangan Bayaran</label>
                                    <input name="description" defaultValue={editingFinance?.description || ''} required type="text" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Nama Vendor</label>
                                    <input name="vendor" defaultValue={editingFinance?.vendor || project.vendor || ''} required type="text" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Jumlah (RM)</label>
                                        <input name="amount" defaultValue={editingFinance?.amount || ''} required type="text" placeholder="Cth: 15,000.00" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
                                        <select name="status" defaultValue={editingFinance?.status || 'Menunggu'} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium">
                                            <option value="Menunggu">Menunggu</option>
                                            <option value="Dalam Tindakan">Dalam Tindakan</option>
                                            <option value="Selesai">Selesai</option>
                                            <option value="Menunggu Kelulusan">Menunggu Kelulusan</option>
                                            <option value="Lewat">Lewat</option>
                                            <option value="Ditolak">Ditolak</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4"><button type="submit" className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 shadow-lg">Simpan Kewangan</button></div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {isPenaltyModalOpen && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={() => setIsPenaltyModalOpen(false)}></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
                            <div className="p-6 lg:p-8 border-b border-rose-100 flex justify-between items-center bg-rose-50/80 rounded-t-[32px]">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-rose-600 text-white rounded-xl flex items-center justify-center shadow-md">
                                        <AlertTriangle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-extrabold text-slate-900">{editingPenalty ? 'Kemaskini Denda SLA Projek' : 'Borang Denda SLA Projek'}</h2>
                                        <p className="text-xs text-rose-700 font-medium">{editingPenalty ? 'Kemaskini rekod denda SLA dan maklumat berkaitan' : 'Rekod denda pelanggaran SLA & dokumen bukti secara automatik ke DMS'}</p>
                                    </div>
                                </div>
                                <button onClick={() => { setIsPenaltyModalOpen(false); setEditingPenalty(null); }} className="w-8 h-8 bg-white text-slate-500 rounded-full flex items-center justify-center border border-rose-200 hover:bg-rose-100 transition-colors">&times;</button>
                            </div>
                            <form onSubmit={handleSavePenalty} className="p-6 lg:p-8 space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">No. Rujukan Denda / SLA <span className="text-rose-500">*</span></label>
                                        <input name="refNo" defaultValue={editingPenalty?.invoice_no || `DND-${new Date().getFullYear()}-${Math.floor(Math.random() * 900) + 100}`} required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-rose-700" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Tarikh Kejadian / Denda <span className="text-rose-500">*</span></label>
                                        <input name="date" defaultValue={editingPenalty?.date || new Date().toISOString().split('T')[0]} required type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Kategori SLA <span className="text-rose-500">*</span></label>
                                        <select name="slaCategory" defaultValue="Kelewatan Masa (Delay)" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-slate-800 font-medium">
                                            <option value="Kelewatan Masa (Delay)">Kelewatan Masa (Delay)</option>
                                            <option value="Ketersediaan Sistem (Downtime)">Ketersediaan Sistem (Downtime)</option>
                                            <option value="Kualiti Penyerahan (Defect)">Kualiti Penyerahan (Defect)</option>
                                            <option value="Pematuhan SOP / Kontrak">Pematuhan SOP / Kontrak</option>
                                            <option value="Lain-lain">Lain-lain</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Nama Vendor / Kontraktor</label>
                                        <input name="vendor" defaultValue={editingPenalty?.vendor || project.vendor || ''} required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Tajuk / Keterangan Denda <span className="text-rose-500">*</span></label>
                                    <input name="description" defaultValue={editingPenalty?.description ? editingPenalty.description.replace(/^\[DENDA SLA:[^\]]+\]\s*/, '') : ''} required type="text" placeholder="Cth: Kelewatan Penyerahan UAT 4 hari melebihi jadual SLA" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Jumlah Denda (RM) <span className="text-rose-500">*</span></label>
                                        <input name="amount" defaultValue={editingPenalty?.amount || ''} required type="text" placeholder="Cth: 5,000.00" className="w-full px-4 py-3 bg-rose-50/50 border border-rose-200 rounded-2xl outline-none font-extrabold text-rose-700 text-lg" />
                                        <p className="text-[11px] text-slate-400 mt-1">Nilai ini akan ditolak secara automatik daripada perbelanjaan projek.</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Fail Bukti / Detail Denda (Auto DMS)</label>
                                        <input name="file" type="file" className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-100 file:text-rose-700 hover:file:bg-rose-200" />
                                        <p className="text-[11px] text-slate-400 mt-1">Fail ini akan disimpan secara automatik ke DMS di bawah folder 'Denda'.</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Catatan / Pengiraan Formula SLA</label>
                                    <textarea name="notes" rows="2" placeholder="Cth: Denda 0.5% sehari x 4 hari kelewatan daripada jumlah fasa RM 250,000" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm"></textarea>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                                    <button type="button" onClick={() => { setIsPenaltyModalOpen(false); setEditingPenalty(null); }} className="px-5 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200">
                                        Batal
                                    </button>
                                    <button type="submit" className="px-6 py-2.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 shadow-md shadow-rose-200 transition-all flex items-center">
                                        <AlertTriangle className="w-4 h-4 mr-2" /> {editingPenalty ? 'Simpan Perubahan' : 'Simpan Denda SLA'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {financeToDelete && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl p-6 lg:p-8 max-w-md w-full shadow-2xl border border-slate-100 text-center space-y-4">
                        <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                            <AlertTriangle className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-xl font-extrabold text-slate-900">Padam Tuntutan?</h3>
                            <p className="text-sm font-medium text-slate-500 mt-2">
                                Adakah anda pasti ingin memadamkan tuntutan <span className="font-bold text-slate-800">{financeToDelete.invoice_no || financeToDelete.description}</span>? Tindakan ini tidak boleh dibatalkan.
                            </p>
                        </div>
                        <div className="flex items-center justify-center space-x-3 pt-2">
                            <button
                                onClick={() => setFinanceToDelete(null)}
                                className="w-1/2 py-3 px-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => {
                                    handleDeleteFinance(financeToDelete.id);
                                    setFinanceToDelete(null);
                                }}
                                className="w-1/2 py-3 px-4 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md hover:shadow-lg transition-all"
                            >
                                Ya, Padam
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {docToDelete && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl p-6 lg:p-8 max-w-md w-full shadow-2xl border border-slate-100 text-center space-y-4">
                        <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                            <AlertTriangle className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-xl font-extrabold text-slate-900">Padam Dokumen?</h3>
                            <p className="text-sm font-medium text-slate-500 mt-2">
                                Adakah anda pasti ingin memadamkan dokumen <span className="font-bold text-slate-800">{docToDelete.file_name}</span>? Tindakan ini akan memadamkan dokumen.
                            </p>
                        </div>
                        <div className="flex items-center justify-center space-x-3 pt-2">
                            <button
                                onClick={() => setDocToDelete(null)}
                                className="w-1/2 py-3 px-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => {
                                    handleDeleteDoc(docToDelete.id);
                                    setDocToDelete(null);
                                }}
                                className="w-1/2 py-3 px-4 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md hover:shadow-lg transition-all"
                            >
                                Ya, Padam
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {taskToDelete && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl p-6 lg:p-8 max-w-md w-full shadow-2xl border border-slate-100 text-center space-y-4">
                        <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                            <AlertTriangle className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-xl font-extrabold text-slate-900">Padam Tugasan?</h3>
                            <p className="text-sm font-medium text-slate-500 mt-2">
                                Adakah anda pasti ingin memadamkan tugasan <span className="font-bold text-slate-800">{taskToDelete.title}</span>? Tindakan ini akan memadamkan tugasan daripada Papan Kanban secara kekal.
                            </p>
                        </div>
                        <div className="flex items-center justify-center space-x-3 pt-2">
                            <button
                                onClick={() => setTaskToDelete(null)}
                                className="w-1/2 py-3 px-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => {
                                    handleDeleteTask(taskToDelete.id);
                                    setTaskToDelete(null);
                                }}
                                className="w-1/2 py-3 px-4 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md hover:shadow-lg transition-all"
                            >
                                Ya, Padam
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {emailNotificationModal && (
                <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[110] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden space-y-0">
                        {/* Top Email Header */}
                        <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-md text-lg">
                                    📧
                                </div>
                                <div>
                                    <h4 className="font-extrabold text-base text-white">E-mel Notifikasi Tugasan Dihantar!</h4>
                                    <p className="text-xs text-slate-400">Sistem Penghantaran Emel Automatik MY-PMO</p>
                                </div>
                            </div>
                            <button onClick={() => setEmailNotificationModal(null)} className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-lg">&times;</button>
                        </div>

                        {/* Email Body Template */}
                        <div className="p-6 bg-slate-50 space-y-4">
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                                <div className="flex justify-between items-center border-b border-slate-100 pb-3 text-xs">
                                    <div>
                                        <span className="text-slate-400 font-semibold block">Daripada:</span>
                                        <span className="font-extrabold text-slate-800">MY-PMO System &lt;notifikasi@kehakiman.gov.my&gt;</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-slate-400 font-semibold block">Kepada:</span>
                                        <span className="font-extrabold text-indigo-600">{emailNotificationModal.recipientEmail}</span>
                                    </div>
                                </div>

                                <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 flex items-center justify-between text-xs">
                                    <span className="font-bold text-indigo-900">Projek: {emailNotificationModal.projectName}</span>
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-600 text-white">
                                        Keutamaan: {emailNotificationModal.priority}
                                    </span>
                                </div>

                                <div className="space-y-2 pt-1">
                                    <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
                                        Tugasan Baharu: "{emailNotificationModal.taskTitle}"
                                    </h3>
                                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                        Salam sejahtera <strong>{emailNotificationModal.recipientName}</strong>,<br />
                                        Anda telah ditugaskan oleh PMO (<strong>{emailNotificationModal.senderName}</strong>) untuk melaksana dan menyiap tugasan ini mengikut jadual.
                                    </p>
                                </div>

                                {/* Description Block */}
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1">
                                    <span className="font-extrabold text-slate-500 text-[10px] uppercase tracking-wider block">Keterangan & Arahan PMO:</span>
                                    <p className="text-slate-800 font-semibold leading-relaxed">{emailNotificationModal.description}</p>
                                </div>

                                <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-100">
                                    <span>📅 Tarikh Tamat: <strong>{emailNotificationModal.dueDate}</strong></span>
                                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> E-mel Berjaya Dihantar
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Email Modal Footer */}
                        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-medium">🔔 Notifikasi sistem loceng juga telah diaktifkan untuk pengguna ini.</span>
                            <button onClick={() => setEmailNotificationModal(null)} className="px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 shadow-md">
                                Tutup Emel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {selectedTaskForDetail && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="p-6 bg-slate-900 text-white flex justify-between items-start shrink-0">
                            <div>
                                <div className="flex items-center space-x-2 mb-2">
                                    <Badge text={selectedTaskForDetail.priority} />
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${selectedTaskForDetail.status === 'completed'
                                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                        : selectedTaskForDetail.status === 'in_progress'
                                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                            : 'bg-slate-700 text-slate-300 border-slate-600'
                                        }`}>
                                        {selectedTaskForDetail.status === 'completed' ? '✓ Selesai' : selectedTaskForDetail.status === 'in_progress' ? 'Sedang Berjalan' : 'Akan Datang'}
                                    </span>
                                </div>
                                <h3 className="text-xl font-extrabold text-white leading-snug">{selectedTaskForDetail.title}</h3>
                                <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                                    <span>📅 Tarikh Tamat: <strong>{selectedTaskForDetail.dueDate || 'Tiada Tarikh'}</strong></span>
                                    <span>•</span>
                                    <span>👤 Pegawai: <strong>{projectUsers.find(u => u.id == selectedTaskForDetail.assignee)?.name || 'Belum Ditugaskan'}</strong></span>
                                </p>
                            </div>
                            <button onClick={() => setSelectedTaskForDetail(null)} className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors">&times;</button>
                        </div>

                        {/* Modal Body: Status Switcher, Comments, File Upload */}
                        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
                            {/* Keterangan / Arahan PMO Block */}
                            <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-100 space-y-1">
                                <label className="text-[11px] font-extrabold text-indigo-700 uppercase tracking-wider block">Keterangan / Arahan PMO</label>
                                <p className="text-xs text-slate-800 font-semibold leading-relaxed">{selectedTaskForDetail.description || 'Tiada keterangan khas diberikan oleh PMO.'}</p>
                            </div>

                            {/* Status Quick Switcher */}
                            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                                <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">Kemas Kini Status Tugasan</label>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { id: 'pending', label: 'Akan Datang', cls: 'bg-slate-100 text-slate-700 hover:bg-slate-200' },
                                        { id: 'in_progress', label: 'Sedang Berjalan', cls: 'bg-amber-100 text-amber-800 hover:bg-amber-200' },
                                        { id: 'completed', label: '✓ Selesai (Notifikasi PMO)', cls: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm' }
                                    ].map(st => (
                                        <button
                                            key={st.id}
                                            onClick={async () => {
                                                const prevStatus = selectedTaskForDetail.status;
                                                const updated = { ...selectedTaskForDetail, status: st.id };
                                                setSelectedTaskForDetail(updated);
                                                setKanbanTasks(kanbanTasks.map(t => t.id === updated.id ? updated : t));
                                                if (st.id === 'completed') {
                                                    syncTaskFilesToDms(updated);
                                                    const assignedUser = projectUsers.find(u => u.id == updated.assignee);
                                                    triggerBellNotification(
                                                        `✅ Tugasan Selesai: ${updated.title}`,
                                                        `${assignedUser?.name || 'Pegawai'} telah menyelesaikan tugasan '${updated.title}' bagi projek ${project.name}.`
                                                    );
                                                    showToastNotification?.(`✅ Tugasan '${updated.title}' telah diselesaikan! Dokumen lampiran diselaraskan ke DMS.`);
                                                } else {
                                                    if (prevStatus === 'completed') {
                                                        unsyncTaskFilesFromDms(updated);
                                                    }
                                                    showToastNotification?.(`Status tugasan ditukar kepada ${st.label}`);
                                                }
                                                try {
                                                    await fetch('/My-PMO/api/modules/tasks.php', {
                                                        method: 'PUT',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({ id: updated.id, status: st.id })
                                                    });
                                                } catch (err) { console.error(err); }
                                            }}
                                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${selectedTaskForDetail.status === st.id ? 'ring-2 ring-indigo-600 ring-offset-1 ' + st.cls : 'opacity-70 hover:opacity-100 ' + st.cls
                                                }`}
                                        >
                                            {st.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Section: Comments */}
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                    <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4 text-indigo-600" /> Ruang Komen Ahli Pasukan
                                    </h4>
                                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                        {(taskComments[selectedTaskForDetail.id] || []).length} Komen
                                    </span>
                                </div>

                                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                                    {(taskComments[selectedTaskForDetail.id] || []).length > 0 ? (
                                        (taskComments[selectedTaskForDetail.id] || []).map(cm => (
                                            <div key={cm.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-bold text-slate-900">{cm.author} <span className="text-[10px] text-indigo-600 font-semibold">({cm.role})</span></span>
                                                    <span className="text-[10px] font-medium text-slate-400">{cm.date}</span>
                                                </div>
                                                <p className="text-slate-700 text-xs leading-relaxed font-medium">{cm.text}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-400 italic text-center py-3">Belum ada komen untuk tugasan ini. Sila hantar komen pertama.</p>
                                    )}
                                </div>

                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    if (!newCommentText.trim()) return;
                                    const taskId = selectedTaskForDetail.id;
                                    const newCm = {
                                        id: Date.now(),
                                        author: currentUser?.name || 'Ahli Pasukan',
                                        role: currentUser?.role || 'Ahli Pasukan',
                                        text: newCommentText.trim(),
                                        date: 'Hari ini'
                                    };
                                    setTaskComments({
                                        ...taskComments,
                                        [taskId]: [...(taskComments[taskId] || []), newCm]
                                    });

                                    // Trigger In-System Bell Notification for team members
                                    triggerBellNotification(
                                        `💬 Komen Baharu: ${selectedTaskForDetail.title}`,
                                        `${currentUser?.name || 'Ahli Pasukan'} menambah komen pada tugasan '${selectedTaskForDetail.title}': "${newCommentText.trim().substring(0, 45)}..."`
                                    );

                                    setNewCommentText('');
                                    showToastNotification?.('💬 Komen ditambah & notifikasi loceng dihantar kepada semua ahli pasukan!');
                                }} className="flex gap-2 pt-2 border-t border-slate-100">
                                    <input
                                        type="text"
                                        value={newCommentText}
                                        onChange={(e) => setNewCommentText(e.target.value)}
                                        placeholder="Tulis komen atau kemaskini kerja..."
                                        className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                    <button type="submit" className="px-4 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors">
                                        Hantar
                                    </button>
                                </form>
                            </div>

                            {/* Section: File Attachments */}
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                    <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                                        <Paperclip className="w-4 h-4 text-indigo-600" /> Muat Naik & Lampiran Fail
                                    </h4>
                                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                        {(taskAttachments[selectedTaskForDetail.id] || []).length} Fail
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    {(taskAttachments[selectedTaskForDetail.id] || []).length > 0 ? (
                                        (taskAttachments[selectedTaskForDetail.id] || []).map(fl => (
                                            <div key={fl.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                                                <div className="flex items-center space-x-2.5 truncate pr-2">
                                                    <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                                                    <span className="font-bold text-slate-800 truncate">{fl.name}</span>
                                                    <span className="text-[10px] text-slate-400 font-medium shrink-0">({fl.size})</span>
                                                </div>
                                                <span className="text-[10px] text-slate-400 shrink-0 font-medium">Oleh {fl.uploader}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-400 italic text-center py-2">Tiada lampiran fail untuk tugasan ini.</p>
                                    )}
                                </div>

                                <div className="pt-2 border-t border-slate-100">
                                    <label className="cursor-pointer flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-indigo-200 bg-indigo-50/40 rounded-xl hover:bg-indigo-50 transition-colors text-indigo-700 text-xs font-bold">
                                        <UploadCloud className="w-4 h-4" />
                                        <span>Pilih Fail Lampiran Baru</span>
                                        <input type="file" className="hidden" onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            const taskId = selectedTaskForDetail.id;
                                            const isTaskCompleted = selectedTaskForDetail.status === 'completed';

                                            const newFl = {
                                                id: Date.now(),
                                                name: file.name,
                                                size: formatFileSize(file.size),
                                                uploader: currentUser?.name || 'Ahli Pasukan',
                                                date: 'Hari ini',
                                                fileObj: file,
                                                syncedToDms: false
                                            };

                                            if (isTaskCompleted) {
                                                try {
                                                    const formData = new FormData();
                                                    formData.append('project_id', project.id);
                                                    formData.append('uploader_id', currentUser?.id || '1');
                                                    formData.append('category', 'Kanban File');
                                                    formData.append('fileName', file.name.replace(/\.[^/.]+$/, ""));
                                                    formData.append('file', file);

                                                    const res = await fetch('/My-PMO/api/modules/documents.php', {
                                                        method: 'POST',
                                                        body: formData
                                                    });
                                                    const data = await res.json();
                                                    if (data.status === 'success') {
                                                        newFl.syncedToDms = true;
                                                        if (typeof fetchDocs === 'function') fetchDocs();
                                                        showToastNotification?.(`📁 Fail '${file.name}' dimuat naik & diselaraskan ke Repositori Dokumen (DMS) kerana tugasan telah Selesai!`);
                                                    }
                                                } catch (err) {
                                                    console.error("DMS upload error:", err);
                                                }
                                            } else {
                                                showToastNotification?.(`📎 Fail '${file.name}' dilampirkan pada tugasan! Fail ini akan dihantar ke Repositori Dokumen (DMS) apabila tugasan ditanda Selesai.`);
                                            }

                                            setTaskAttachments({
                                                ...taskAttachments,
                                                [taskId]: [...(taskAttachments[taskId] || []), newFl]
                                            });
                                        }} />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end shrink-0">
                            <button onClick={() => setSelectedTaskForDetail(null)} className="px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition-colors">
                                Tutup Modul
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isDocModalOpen && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => { setIsDocModalOpen(false); setSelectedFile(null); }}></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200">
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-[32px]">
                                <h2 className="text-xl font-extrabold text-slate-900">Muat Naik Dokumen Baru</h2>
                                <button onClick={() => { setIsDocModalOpen(false); setSelectedFile(null); }} className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200">&times;</button>
                            </div>
                            <form onSubmit={handleUploadDoc} className="p-8 space-y-5">
                                <div className="w-full h-32 border-2 border-dashed border-indigo-200 bg-indigo-50/50 rounded-2xl flex flex-col items-center justify-center text-slate-500 hover:bg-indigo-50 transition-colors cursor-pointer relative">
                                    <UploadCloud className="w-8 h-8 text-indigo-400 mb-2" />
                                    <span className="text-sm font-bold text-center px-4">
                                        {selectedFile ? `Fail dipilih: ${selectedFile.name}` : "Klik untuk memilih fail"}
                                    </span>
                                    <input type="file" name="file" required onChange={(e) => setSelectedFile(e.target.files[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Nama Dokumen</label>
                                    <input name="fileName" required type="text" placeholder="Tanpa sambungan (.pdf/.doc)" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Kategori Repositori</label>
                                    <select name="category" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none">
                                        <option value="Minit Mesyuarat">Minit Mesyuarat</option>
                                        <option value="Dokumen Kontrak">Dokumen Kontrak</option>
                                        <option value="Kanban File">Kanban File</option>
                                        <option value="Kewangan & Bajet">Kewangan & Bajet</option>
                                        <option value="Lain-lain">Lain-lain</option>
                                    </select>
                                </div>
                                <div className="flex justify-end pt-4"><button type="submit" className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 w-full">Mula Memuat Naik</button></div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {editingDoc && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setEditingDoc(null)}></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200">
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-[32px]">
                                <h2 className="text-xl font-extrabold text-slate-900">Ubah Maklumat Dokumen</h2>
                                <button onClick={() => setEditingDoc(null)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200">&times;</button>
                            </div>
                            <form onSubmit={handleEditDoc} className="p-8 space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Nama Dokumen</label>
                                    <input name="file_name" required defaultValue={editingDoc.file_name} type="text" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none font-medium text-slate-800" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Kategori Repositori</label>
                                    <select name="category" defaultValue={editingDoc.category === 'Spesifikasi Sistem' ? 'Kanban File' : editingDoc.category} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium text-slate-800">
                                        <option value="Minit Mesyuarat">Minit Mesyuarat</option>
                                        <option value="Dokumen Kontrak">Dokumen Kontrak</option>
                                        <option value="Kanban File">Kanban File</option>
                                        <option value="Kewangan & Bajet">Kewangan & Bajet</option>
                                        <option value="Lain-lain">Lain-lain</option>
                                    </select>
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button type="button" onClick={() => setEditingDoc(null)} className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200">Batal</button>
                                    <button type="submit" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md">Simpan Perubahan</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {isAddMemberModalOpen && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsAddMemberModalOpen(false)}></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200">
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-[32px]">
                                <h2 className="text-xl font-extrabold text-slate-900">Tambah Ahli Pasukan Projek</h2>
                                <button onClick={() => setIsAddMemberModalOpen(false)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200">&times;</button>
                            </div>
                            <form onSubmit={handleAddTeamMember} className="p-8 space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Pilih Pengguna / Pegawai</label>
                                    <select name="user_id" required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none font-bold">
                                        <option value="">-- Pilih dari senarai pengguna --</option>
                                        {projectUsers
                                            .filter(u => !teamMembers.some(m => m.user_id == u.id))
                                            .map(u => (
                                                <option key={u.id} value={u.id}>
                                                    {u.name} ({u.role || 'Pengguna'}) - {u.agency || 'PKPMP'}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Peranan Dalam Projek</label>
                                    <input name="role" defaultValue="Ahli Pasukan" required type="text" placeholder="Cth: Penyelaras / Ahli Teknikal / Pengurus Risik" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none font-bold" />
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button type="submit" className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 w-full shadow-md">
                                        Tambah Ahli Pasukan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {memberToDelete && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setMemberToDelete(null)}></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200 p-8 text-center">
                            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                                <AlertTriangle className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-extrabold text-slate-900 mb-2">Buang Akses Ahli Pasukan</h3>
                            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                                Adakah anda pasti mahu membuang akses bagi <span className="font-extrabold text-slate-900">{memberToDelete.name}</span> dari pasukan projek ini?
                            </p>
                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setMemberToDelete(null)}
                                    className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-colors text-sm"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleRemoveTeamMember}
                                    className="flex-1 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl transition-colors text-sm shadow-lg shadow-rose-200 active:scale-[0.98]"
                                >
                                    Ya, Buang Akses
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {milestoneToDelete && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setMilestoneToDelete(null)}></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200 p-8 text-center">
                            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                                <AlertTriangle className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-extrabold text-slate-900 mb-2">Padam Jadual Bayaran Projek</h3>
                            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                                Adakah anda pasti mahu memadam jadual bayaran <span className="font-extrabold text-slate-900">{milestoneToDelete.title}</span>?
                            </p>
                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setMilestoneToDelete(null)}
                                    className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-colors text-sm"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDeleteMilestone}
                                    className="flex-1 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl transition-colors text-sm shadow-lg shadow-rose-200 active:scale-[0.98]"
                                >
                                    Ya, Padam
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- EDIT PROJECT MODAL --- */}
            {isEditProjectModalOpen && (
                <div className="fixed inset-0 z-[65] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsEditProjectModalOpen(false)}></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
                            <div className="p-6 sm:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                <div>
                                    <h2 className="text-xl font-extrabold text-slate-900">Kemaskini Butiran Projek</h2>
                                    <p className="text-xs font-semibold text-slate-500 mt-0.5">{currentProject.name}</p>
                                </div>
                                <button onClick={() => setIsEditProjectModalOpen(false)} className="w-9 h-9 bg-white rounded-full flex items-center justify-center border border-slate-200 text-slate-400 hover:text-rose-500 transition-colors">&times;</button>
                            </div>

                            <form onSubmit={handleUpdateProject} className="p-6 sm:p-8 space-y-4 max-h-[75vh] overflow-y-auto">
                                <div>
                                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Nama Projek</label>
                                    <input name="name" defaultValue={currentProject.name} required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-sm" />
                                </div>

                                <div>
                                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Objektif & Keterangan Projek</label>
                                    <textarea name="description" defaultValue={currentProject.description} rows={3} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none font-medium text-sm" placeholder="Masukkan rincian dan sasaran projek..."></textarea>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Agensi</label>
                                        <input name="agency" defaultValue={currentProject.agency || 'PKPMP'} required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Bahagian</label>
                                        <input name="division" defaultValue={currentProject.division || 'Bahagian Teknologi Maklumat (BTM)'} type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-sm" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Unit</label>
                                        <input name="unit" defaultValue={currentProject.unit || ''} type="text" placeholder="Cth: Unit Rangkaian" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Syarikat Vendor</label>
                                        <input name="vendor" defaultValue={currentProject.vendor || ''} type="text" placeholder="Cth: Pine Supplies Sdn Bhd" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-sm" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Pengurus Vendor (PMO Syarikat)</label>
                                        <select
                                            name="pmoVendor"
                                            defaultValue={currentProject.vendor_manager || currentProject.pmoVendor || ''}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-sm text-slate-900"
                                        >
                                            <option value="">-- Pilih PMO Syarikat (Tetapan) --</option>
                                            {pmoVendorUsers.map((u) => (
                                                <option key={u.id} value={u.name}>
                                                    {u.name} {u.agency ? `(${u.agency})` : ''}
                                                </option>
                                            ))}
                                            {(currentProject.vendor_manager || currentProject.pmoVendor) && !pmoVendorUsers.some(u => u.name === (currentProject.vendor_manager || currentProject.pmoVendor)) && (
                                                <option value={currentProject.vendor_manager || currentProject.pmoVendor}>
                                                    {currentProject.vendor_manager || currentProject.pmoVendor}
                                                </option>
                                            )}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Pengurus Projek PKPMP (PMO GOV)</label>
                                        <select
                                            name="manager"
                                            defaultValue={currentProject.manager || ''}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-sm text-slate-900"
                                        >
                                            <option value="">-- Pilih PMO GOV / PKPMP (Tetapan) --</option>
                                            {pmoGovUsers.map((u) => (
                                                <option key={u.id} value={u.name}>
                                                    {u.name} {u.agency ? `(${u.agency})` : ''}
                                                </option>
                                            ))}
                                            {currentProject.manager && !pmoGovUsers.some(u => u.name === currentProject.manager) && (
                                                <option value={currentProject.manager}>{currentProject.manager}</option>
                                            )}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Tarikh Mula</label>
                                        <input name="startDate" defaultValue={currentProject.start_date || currentProject.startDate || ''} type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Tarikh Tamat</label>
                                        <input name="dueDate" defaultValue={currentProject.end_date || currentProject.dueDate || ''} type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Bajet (RM)</label>
                                        <input name="budget" defaultValue={currentProject.budget || ''} type="number" step="0.01" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-sm" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Status Projek</label>
                                        <select name="status" defaultValue={currentProject.status || 'Aktif'} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-sm">
                                            <option value="Aktif">Aktif</option>
                                            <option value="Lewat">Lewat</option>
                                            <option value="Tertunda">Tertunda</option>
                                            <option value="Selesai">Selesai</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Kemajuan (%)</label>
                                        <input name="progress" defaultValue={currentProject.progress || 0} type="number" min="0" max="100" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-sm" />
                                    </div>
                                </div>

                                <div className="flex space-x-3 pt-4 border-t border-slate-100">
                                    <button type="button" onClick={() => setIsEditProjectModalOpen(false)} className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-colors text-sm">
                                        Batal
                                    </button>
                                    <button type="submit" className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-colors text-sm shadow-md active:scale-95">
                                        Simpan Perubahan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* --- CONTENT PAGE (10k USD ENTERPRISE PMO DESIGN) --- */}

            {/* Header & Main Action Bar */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 print:hidden">
                <div>
                    <div className="flex items-center text-xs font-semibold text-slate-500 space-x-2 mb-1">
                        <span
                            className="hover:text-indigo-600 cursor-pointer font-bold transition-colors flex items-center gap-1 bg-slate-100/80 hover:bg-slate-200/80 px-2 py-0.5 rounded-lg text-slate-600"
                            onClick={() => setView('projects')}
                        >
                            <Briefcase className="w-3 h-3 text-slate-500" /> Projek
                        </span>
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-900 font-extrabold truncate max-w-[200px] sm:max-w-md">{currentProject.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                            {currentProject.name}
                        </h1>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs shrink-0">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            {currentProject.status || 'Aktif'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                    <button
                        onClick={() => setIsEditProjectModalOpen(true)}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-4 py-2 rounded-xl font-extrabold transition-all duration-200 shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/35 active:scale-95 text-xs cursor-pointer border border-indigo-500/30"
                    >
                        <Edit className="w-3.5 h-3.5" /> Kemaskini
                    </button>
                </div>
            </div>

            {/* Main Hero Card Container */}
            <div className="relative overflow-hidden bg-white border border-slate-200/90 shadow-lg shadow-slate-200/40 rounded-2xl p-4 sm:p-5 lg:p-6 mb-5 transition-all print:hidden">
                {/* Background Ambient Decorative Light */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-bl from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none hidden sm:block">
                    <Briefcase className="w-56 h-56 text-slate-900" />
                </div>

                {/* Top Section: Keterangan & Objektif Projek */}
                <div className="relative z-10 mb-4 pb-3 border-b border-slate-100/80 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-indigo-50/90 text-indigo-700 text-[10px] font-extrabold rounded-full tracking-wider uppercase border border-indigo-100 shadow-2xs">
                            <Activity className="w-3 h-3 text-indigo-600" /> OBJEKTIF & KETERANGAN PROJEK
                        </span>
                        {currentProject.project_code && (
                            <span className="inline-flex items-center text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/60">
                                {currentProject.project_code}
                            </span>
                        )}
                    </div>

                    <div className="border-l-3 border-indigo-600 pl-3 py-0.5">
                        <p className="text-slate-700 text-xs sm:text-sm lg:text-base leading-snug whitespace-pre-wrap font-medium">
                            {currentProject.description || `Tiada keterangan khas diberikan untuk projek ${currentProject.name}. Sila klik butang 'Kemaskini' di atas untuk memasukkan penerangan rasmi projek.`}
                        </p>
                    </div>
                </div>

                {/* 8 Metric Cards Grid Layout */}
                {/* 8 Metric Cards Grid Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 relative z-10">

                    {/* 1. AGENSI */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">AGENSI</span>
                            <Building2 className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 text-sm sm:text-base leading-tight break-words">
                                {currentProject.agency || 'PKPMP'}
                            </p>
                            <p className="text-xs text-slate-500 font-normal mt-1 leading-normal">Pejabat Ketua Pendaftar Mahkamah Persekutuan</p>
                        </div>
                    </div>

                    {/* 2. BAHAGIAN & UNIT */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">BAHAGIAN & UNIT</span>
                            <FolderKanban className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 text-sm sm:text-base leading-tight break-words">
                                {currentProject.division || 'Bahagian Teknologi Maklumat (BTM)'}
                            </p>
                            <p className="text-xs text-slate-500 font-normal mt-1 leading-normal">
                                {currentProject.unit ? `Unit: ${currentProject.unit}` : 'Pengurusan Utama'}
                            </p>
                        </div>
                    </div>

                    {/* 3. SYARIKAT VENDOR */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">SYARIKAT VENDOR</span>
                            <Briefcase className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 text-sm sm:text-base leading-tight break-words">
                                {currentProject.vendor || 'Tidak Dinyatakan'}
                            </p>
                            {currentProject.vendor_manager ? (
                                <p className="text-xs text-slate-500 font-normal mt-1 leading-normal">
                                    PMO Syarikat: <span className="font-medium text-slate-700">{currentProject.vendor_manager}</span>
                                </p>
                            ) : (
                                <p className="text-xs text-slate-500 font-normal mt-1 leading-normal">Tiada PMO Syarikat</p>
                            )}
                        </div>
                    </div>

                    {/* 4. PENGURUS PROJEK */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">PENGURUS PROJEK</span>
                            <UserCheck className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                        </div>
                        <div className="flex items-center space-x-2.5">
                            <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                                {currentProject.manager ? currentProject.manager.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'P'}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="font-bold text-slate-900 text-sm sm:text-base leading-tight truncate">
                                    {currentProject.manager || 'Belum Dilantik'}
                                </p>
                                <p className="text-xs text-slate-500 font-normal leading-normal">Pegawai PMO PKPMP</p>
                            </div>
                        </div>
                    </div>

                    {/* 5. GARIS MASA / TEMPOH */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">GARIS MASA</span>
                            <CalendarIcon className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                                {formatDateMalay(currentProject.start_date || currentProject.startDate) || 'TBA'} <span className="text-slate-400 font-normal">─</span> {formatDateMalay(currentProject.end_date || currentProject.dueDate) || 'TBA'}
                            </p>
                            <p className="text-xs text-slate-500 font-normal mt-1 leading-normal">Tempoh Pelaksanaan Projek</p>
                        </div>
                    </div>

                    {/* 6. BAJET / PERUNTUKAN */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">PERUNTUKAN</span>
                            <DollarSign className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 text-base sm:text-lg tracking-tight leading-tight whitespace-nowrap">
                                RM {parseFloat(currentProject.budget || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                            <p className="text-xs text-slate-500 font-normal mt-1 leading-normal">Peruntukan Diluluskan PKPMP</p>
                        </div>
                    </div>

                    {/* 7. STATUS PROJEK */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">STATUS PROJEK</span>
                            <Activity className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                        </div>
                        <div>
                            <div className="flex items-center">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentProject.status === 'Selesai' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                    currentProject.status === 'Lewat' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                        currentProject.status === 'Tertunda' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                            'bg-indigo-50 text-indigo-700 border-indigo-200'
                                    }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${currentProject.status === 'Selesai' ? 'bg-emerald-500' :
                                        currentProject.status === 'Lewat' ? 'bg-rose-500' :
                                            currentProject.status === 'Tertunda' ? 'bg-amber-500' :
                                                'bg-indigo-500'
                                        }`}></span>
                                    {currentProject.status || 'Aktif'}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 font-normal mt-1 leading-normal">Status Operasi Semasa</p>
                        </div>
                    </div>

                    {/* 8. KEMAJUAN SEMASA */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">KEMAJUAN SEMASA</span>
                            <span className="text-xs font-bold text-slate-900">{currentProject.progress || 0}% SIAP</span>
                        </div>
                        <div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min(100, Math.max(0, currentProject.progress || 0))}%` }}
                                />
                            </div>
                            <p className="text-xs text-slate-400 font-normal text-right mt-1">Sasaran: 100%</p>
                        </div>
                    </div>

                </div>
            </div>

            {/* --- TABS NAVIGATION (COMPACT 1-PAGE ZERO-SCROLL GRID) --- */}
            <div className="bg-slate-100/90 backdrop-blur-sm p-1 rounded-xl border border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1 mb-5 shadow-inner w-full print:hidden">
                {[
                    { id: 'Jadual Bayaran', label: 'Jadual Bayaran', icon: Wallet },
                    { id: 'Carta Gantt', label: 'Carta Gantt', icon: CalendarIcon },
                    { id: 'Tugasan (Kanban)', label: 'Tugasan (Kanban)', icon: FolderKanban },
                    { id: 'Kewangan Projek', label: 'Kewangan Projek', icon: DollarSign },
                    { id: 'Dokumen (DMS)', label: 'Dokumen (DMS)', icon: FileText },
                    { id: 'Senarai Semak', label: 'Senarai Semak', icon: ClipboardCheck },
                    { id: 'Ahli Pasukan', label: 'Ahli Pasukan', icon: Users },
                ].map(tab => {
                    const TabIcon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-[11px] xl:text-xs font-extrabold uppercase tracking-tight transition-all duration-200 cursor-pointer w-full text-center ${isActive
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-[1.01]'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                                }`}
                        >
                            <TabIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                            <span className="truncate">{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            <div className="mt-8">
                {activeTab === 'Jadual Bayaran' && (
                    <div className="space-y-8">
                        <Card>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                                <div>
                                    <div className="flex items-center space-x-2.5">
                                        <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                            <Wallet className="w-4 h-4" />
                                        </div>
                                        <h3 className="text-xl font-extrabold text-slate-900">Jadual Bayaran Projek</h3>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium mt-1">Perancangan fasa pembayaran awal & pemantauan tuntutan kewangan dengan amaran matang.</p>
                                </div>
                                <button onClick={() => { setEditingMilestone(null); setIsMilestoneModalOpen(true); }} className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-colors flex items-center shadow-sm">
                                    <Plus className="w-4 h-4 mr-1.5" /> Tetapkan Jadual Bayaran
                                </button>
                            </div>

                            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-3 md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                                {milestones.length > 0 ? milestones.map((ms, i) => {
                                    let diffDays = null;
                                    if (ms.targetDate) {
                                        try {
                                            const targetD = new Date(ms.targetDate);
                                            const todayD = new Date();
                                            todayD.setHours(0, 0, 0, 0);
                                            targetD.setHours(0, 0, 0, 0);
                                            diffDays = Math.ceil((targetD - todayD) / (1000 * 60 * 60 * 24));
                                        } catch (e) {
                                            diffDays = null;
                                        }
                                    }

                                    return (
                                        <div key={ms.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                            <div className={`flex items-center justify-center w-7 h-7 rounded-full border-[3px] border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${ms.status === 'Selesai' ? 'bg-emerald-500' : ms.status === 'Lewat' || (diffDays !== null && diffDays < 0) ? 'bg-rose-500' : (diffDays !== null && diffDays <= 30) ? 'bg-amber-500' : 'bg-indigo-500'}`}>
                                                {ms.status === 'Selesai' ? <CheckCircle2 className="w-3.5 h-3.5 text-white" /> : <Clock className="w-3.5 h-3.5 text-white" />}
                                            </div>
                                            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-md transition-all relative">
                                                <div className="flex justify-between items-start mb-2 gap-2">
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 pr-2">{ms.title}</h4>
                                                        <div className="text-base font-extrabold text-indigo-700 mt-0.5">
                                                            RM {ms.amount ? Number(String(ms.amount).replace(/,/g, '')).toLocaleString('en-MY', { minimumFractionDigits: 2 }) : '0.00'}
                                                        </div>
                                                    </div>
                                                    <Badge text={ms.status} />
                                                </div>
                                                
                                                <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-200/60 text-xs">
                                                    <span className="font-medium text-slate-500">
                                                        Sasaran: <strong className="text-slate-700">{ms.targetDate ? formatDateMalay(ms.targetDate) : ms.target}</strong>
                                                    </span>

                                                    {ms.status === 'Selesai' ? (
                                                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                                                            ✓ Selesai Dibayar
                                                        </span>
                                                    ) : diffDays !== null ? (
                                                        diffDays < 0 ? (
                                                            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold animate-pulse">
                                                                ⚠ Lewat: {Math.abs(diffDays)} Hari Melepasi Tarikh
                                                            </span>
                                                        ) : diffDays <= 30 ? (
                                                            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                                                                🔔 Amaran Awal: {diffDays} Hari Lagi
                                                            </span>
                                                        ) : (
                                                            <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
                                                                ⏱ Baki {diffDays} Hari
                                                            </span>
                                                        )
                                                    ) : null}
                                                </div>

                                                <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => { setEditingMilestone(ms); setIsMilestoneModalOpen(true); }} className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 shadow-sm" title="Kemaskini Jadual Bayaran"><Edit className="w-3.5 h-3.5" /></button>
                                                    <button onClick={() => setMilestoneToDelete(ms)} className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-rose-600 hover:border-rose-200 transition-colors shadow-sm" title="Padam Jadual Bayaran"><Trash2 className="w-3.5 h-3.5" /></button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }) : (
                                    <div className="text-center py-8 text-slate-400 font-medium">Tiada jadual bayaran direkodkan. Sila tetapkan jadual bayaran awal projek.</div>
                                )}
                            </div>
                        </Card>
                    </div>
                )}

                {activeTab === 'Carta Gantt' && (() => {
                    const monthNamesMalay = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogo', 'Sep', 'Okt', 'Nov', 'Dis'];

                    // 1. Tentukan Tarikh Mula & Tarikh Tamat Projek secara dinamik
                    const projStartStr = project.start_date || project.startDate || (ganttItems.length > 0 ? ganttItems[0].planned_start : '2026-07-20');
                    const projEndStr = project.end_date || project.endDate || project.dueDate || (ganttItems.length > 0 ? ganttItems[ganttItems.length - 1].planned_end : '2027-07-23');

                    const parseDateInfo = (dStr) => {
                        if (!dStr) return null;
                        const parts = dStr.split('-');
                        if (parts.length < 2) return null;
                        const y = parseInt(parts[0], 10);
                        const m = parseInt(parts[1], 10) - 1;
                        const d = parts[2] ? parseInt(parts[2], 10) : 1;
                        if (isNaN(y) || isNaN(m)) return null;
                        return { year: y, month: m, day: d, globalM: y * 12 + m };
                    };

                    const startInfo = parseDateInfo(projStartStr) || { year: 2026, month: 6, day: 20, globalM: 2026 * 12 + 6 };
                    const endInfo = parseDateInfo(projEndStr) || { year: 2027, month: 6, day: 23, globalM: 2027 * 12 + 6 };

                    let startGlobalM = startInfo.globalM;
                    let endGlobalM = endInfo.globalM;

                    if (endGlobalM < startGlobalM) {
                        endGlobalM = startGlobalM;
                    }

                    // 2. Bina senarai bulan mengikut garis masa projek (contoh: Jul 2026 hingga Jul 2027 = 13 Bulan)
                    const visibleMonths = [];
                    for (let gm = startGlobalM; gm <= endGlobalM; gm++) {
                        const yr = Math.floor(gm / 12);
                        const mIdx = ((gm % 12) + 12) % 12;
                        visibleMonths.push({
                            globalM: gm,
                            year: yr,
                            monthIndex: mIdx,
                            monthName: monthNamesMalay[mIdx],
                            label: `${monthNamesMalay[mIdx]} ${yr}`
                        });
                    }

                    const totalMonths = visibleMonths.length;
                    const rangeStartText = `${startInfo.day} ${monthNamesMalay[startInfo.month]} ${startInfo.year}`;
                    const rangeEndText = `${endInfo.day} ${monthNamesMalay[endInfo.month]} ${endInfo.year}`;

                    const toGlobalM = (dStr) => {
                        if (!dStr) return null;
                        const parts = dStr.split('-');
                        const yr = parseInt(parts[0], 10);
                        const m = parseInt(parts[1], 10) - 1;
                        if (isNaN(yr) || isNaN(m)) return null;
                        return yr * 12 + m;
                    };

                    return (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <Card>
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                                    <div>
                                        <h3 className="text-xl font-extrabold text-slate-900 flex items-center">
                                            Carta Gantt Dynamik Mengikut Tempoh Projek
                                        </h3>
                                        <p className="text-slate-500 text-sm mt-1">
                                            Garis masa dipaparkan khusus mengikut tempoh projek: <strong>{rangeStartText}</strong> hingga <strong>{rangeEndText}</strong> (<strong>{totalMonths} Bulan</strong>).
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="flex items-center space-x-3 text-xs font-bold bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                                            <div className="flex items-center space-x-1.5"><span className="w-3.5 h-2.5 rounded-sm bg-indigo-600 inline-block"></span><span>Planned</span></div>
                                            <div className="flex items-center space-x-1.5"><span className="w-3.5 h-2.5 rounded-sm bg-emerald-500 inline-block"></span><span>Actual</span></div>
                                            <div className="flex items-center space-x-1.5"><span className="text-amber-500 font-black text-base leading-none">◆</span><span>Milestone</span></div>
                                        </div>
                                        <button onClick={() => { setEditingGanttItem(null); setIsGanttModalOpen(true); }} className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-slate-800 flex items-center text-sm shadow-md transition-all active:scale-[0.98]">
                                            <Plus className="w-4 h-4 mr-1.5" /> Tambah Fasa
                                        </button>
                                    </div>
                                </div>

                                {/* Dynamic Timeline Header Info */}
                                <div className="flex flex-col sm:flex-row justify-between items-center bg-indigo-50/60 p-3.5 rounded-2xl border border-indigo-100 mb-6 gap-3">
                                    <div className="flex items-center space-x-2 text-xs font-extrabold text-indigo-950">
                                        <CalendarIcon className="w-4 h-4 text-indigo-600" />
                                        <span>Garis Masa Projek: {rangeStartText} — {rangeEndText}</span>
                                    </div>

                                    <div className="text-center sm:text-right">
                                        <span className="text-xs font-extrabold text-indigo-900 bg-white px-3 py-1 rounded-xl border border-indigo-200 shadow-sm inline-block">
                                            Jumlah Tempoh: {totalMonths} Bulan ({visibleMonths[0].label} — {visibleMonths[totalMonths - 1].label})
                                        </span>
                                    </div>
                                </div>

                                {/* Dynamic Monthly Timeline Table */}
                                <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-sm">
                                    <div style={{ minWidth: `${Math.max(900, 320 + totalMonths * 80)}px` }}>
                                        {/* Timeline Header (Displays Month + Year for each column) */}
                                        <div className="flex bg-slate-900 text-white font-bold text-xs py-3.5 px-4 rounded-t-2xl">
                                            <div className="w-80 shrink-0 uppercase tracking-wider pr-4">Fasa / Tugasan / Pencapaian</div>
                                            <div className="flex-1 grid gap-0" style={{ gridTemplateColumns: `repeat(${totalMonths}, minmax(0, 1fr))` }}>
                                                {visibleMonths.map((vm, idx) => (
                                                    <div key={vm.globalM} className={`text-center font-extrabold px-1 ${idx !== 0 ? 'border-l border-slate-800' : ''}`}>
                                                        <span className="block text-[11px] text-indigo-300 uppercase leading-none">{vm.monthName}</span>
                                                        <span className="block text-[9px] font-medium text-slate-400 mt-0.5">{vm.year}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Timeline Body Items */}
                                        <div className="divide-y divide-slate-100">
                                            {ganttItems.length > 0 ? ganttItems.map((item) => {
                                                const pStartM = toGlobalM(item.planned_start) ?? startGlobalM;
                                                const pEndM = toGlobalM(item.planned_end) ?? pStartM;

                                                const pColStart = Math.max(1, pStartM - startGlobalM + 1);
                                                const pColEnd = Math.min(totalMonths, pEndM - startGlobalM + 1);
                                                const pSpan = Math.max(1, pColEnd - pColStart + 1);
                                                const pIsVisible = pEndM >= startGlobalM && pStartM <= endGlobalM;

                                                const aStartM = toGlobalM(item.actual_start) ?? pStartM;
                                                const aEndM = toGlobalM(item.actual_end) ?? (item.actual_start ? aStartM : pEndM);
                                                const aColStart = Math.max(1, aStartM - startGlobalM + 1);
                                                const aColEnd = Math.min(totalMonths, aEndM - startGlobalM + 1);
                                                const aSpan = Math.max(1, aColEnd - aColStart + 1);

                                                const isMilestone = !!item.is_milestone;

                                                return (
                                                    <div key={item.id} className={`flex items-center py-4 px-4 hover:bg-slate-50 transition-colors group ${isMilestone ? 'bg-amber-50/30' : ''}`}>
                                                        {/* Left Item Details */}
                                                        <div className="w-80 shrink-0 pr-4">
                                                            <div className="flex items-center justify-between">
                                                                <div className="font-extrabold text-slate-900 text-sm flex items-center truncate pr-2">
                                                                    {isMilestone ? (
                                                                        <span className="text-amber-500 font-extrabold text-base mr-2 shrink-0">◆</span>
                                                                    ) : (
                                                                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 mr-2 shrink-0"></span>
                                                                    )}
                                                                    <span className="truncate" title={item.title}>{item.title}</span>
                                                                </div>

                                                                {/* Action buttons */}
                                                                <div className="flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                                                    <button onClick={() => { setEditingGanttItem(item); setIsGanttModalOpen(true); }} className="p-1 bg-white border border-slate-200 rounded text-slate-500 hover:text-indigo-600 shadow-sm" title="Kemas kini"><Edit className="w-3.5 h-3.5" /></button>
                                                                    <button onClick={() => handleDeleteGanttItem(item.id)} className="p-1 bg-white border border-slate-200 rounded text-slate-500 hover:text-rose-600 shadow-sm" title="Padam"><Trash2 className="w-3.5 h-3.5" /></button>
                                                                </div>
                                                            </div>

                                                            {/* Subtitle Dates */}
                                                            <div className="text-[11px] font-medium text-slate-400 mt-1 ml-4 space-y-0.5">
                                                                <div>Dirancang: <strong className="text-indigo-600 font-semibold">{item.planned_start} — {item.planned_end}</strong></div>
                                                                {item.actual_start && (
                                                                    <div>Sebenar: <span className="text-emerald-600 font-semibold">{item.actual_start} {item.actual_end ? `— ${item.actual_end}` : '(Semasa)'}</span></div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Right Monthly Timeline Grid */}
                                                        <div className="flex-1 grid gap-0 relative items-center bg-slate-50/50 p-2 rounded-xl border border-slate-100 min-h-[58px]" style={{ gridTemplateColumns: `repeat(${totalMonths}, minmax(0, 1fr))` }}>
                                                            {!pIsVisible ? (
                                                                <div className="text-center text-[11px] font-medium text-slate-400/70 italic" style={{ gridColumn: `1 / span ${totalMonths}` }}>
                                                                    (Fasa di luar garis masa projek)
                                                                </div>
                                                            ) : isMilestone ? (
                                                                /* Milestone Marker Display */
                                                                <div className="flex items-center justify-center" style={{ gridColumn: `${pColStart} / span ${pSpan}` }}>
                                                                    <span className="px-3 py-1 rounded-full bg-amber-500 text-white font-black text-xs shadow-md flex items-center gap-1.5 whitespace-nowrap">
                                                                        ◆ Milestone ({item.progress}%)
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    {/* Bar 1: Dirancang (Planned) */}
                                                                    <div className="h-3.5 bg-indigo-200 rounded-full border border-indigo-300 relative shadow-inner group/bar" style={{ gridColumn: `${pColStart} / span ${pSpan}` }}>
                                                                        <span className="absolute -top-5 left-1 text-[9px] font-black text-indigo-700 uppercase tracking-widest whitespace-nowrap">Dirancang</span>
                                                                    </div>

                                                                    {/* Bar 2: Pelaksanaan Sebenar (Actual) */}
                                                                    {item.actual_start && (
                                                                        <div className="h-4 bg-slate-200 rounded-full overflow-hidden relative shadow-sm mt-1" style={{ gridColumn: `${aColStart} / span ${aSpan}` }}>
                                                                            <div
                                                                                className={`h-full font-extrabold text-[10px] text-white flex items-center justify-center transition-all ${item.status === 'Selesai' ? 'bg-emerald-500' : item.status === 'Tertunda' ? 'bg-rose-500' : 'bg-indigo-600'}`}
                                                                                style={{ width: `${Math.max(item.progress, 10)}%` }}
                                                                            >
                                                                                {item.progress}%
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            }) : (
                                                <div className="text-center py-12 text-slate-400 font-medium">Tiada item fasa atau tugasan Carta Gantt direkodkan. Sila tambah fasa baharu.</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    );
                })()}

                {
                    activeTab === 'Tugasan (Kanban)' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 h-[800px] flex flex-col">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 shrink-0">
                                <div>
                                    <h3 className="text-xl font-extrabold text-slate-900">Papan Tugasan (Agile)</h3>
                                    <p className="text-slate-500 text-sm mt-1">Urus tugas harian secara visual khusus untuk <strong>{project.name}</strong>.</p>
                                </div>
                                <button onClick={() => { setEditingTask(null); setIsTaskModalOpen(true); }} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-800 flex items-center text-sm shadow-md transition-all active:scale-[0.98]">
                                    <Plus className="w-4 h-4 mr-2" /> Tambah Tugas
                                </button>
                            </div>

                            <div className="flex-1 flex overflow-x-auto gap-6 pb-4 no-scrollbar">
                                {columns.map(col => {
                                    const colTasks = kanbanTasks.filter(t => t.status === col.id);
                                    return (
                                        <div
                                            key={col.id}
                                            className={`flex flex-col rounded-[24px] border shadow-sm min-w-[300px] md:min-w-0 md:flex-1 shrink-0 ${col.color}`}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleDrop(e, col.id)}
                                        >
                                            <div className={`p-4 sm:p-5 flex justify-between items-center border-b rounded-t-[24px] ${col.headerBg}`}>
                                                <h3 className="font-extrabold text-base flex items-center gap-2">
                                                    {col.id === 'completed' && <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>}
                                                    {col.title}
                                                </h3>
                                                <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm border ${col.badgeBg}`}>{colTasks.length}</span>
                                            </div>
                                            <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
                                                {colTasks.map(task => {
                                                    const assignedUser = projectUsers.find(u => u.id == task.assignee);
                                                    const commentsCount = (taskComments[task.id] || []).length;
                                                    const filesCount = (taskAttachments[task.id] || []).length;

                                                    const cardStyle = task.status === 'completed'
                                                        ? 'bg-emerald-50/95 border-emerald-300 hover:border-emerald-400 text-emerald-950 shadow-sm'
                                                        : task.status === 'in_progress'
                                                            ? 'bg-amber-50/80 border-amber-200 hover:border-amber-300 text-slate-900 shadow-sm'
                                                            : 'bg-white border-slate-200 hover:border-indigo-300 text-slate-900 shadow-sm';

                                                    return (
                                                        <div
                                                            key={task.id}
                                                            draggable
                                                            onDragStart={(e) => handleDragStart(e, task.id)}
                                                            onClick={() => setSelectedTaskForDetail(task)}
                                                            className={`${cardStyle} p-4 sm:p-5 rounded-2xl border cursor-pointer hover:shadow-md transition-all active:scale-[0.99] group relative`}
                                                        >
                                                            <div className="flex justify-between items-start mb-2.5">
                                                                <Badge text={task.priority} />
                                                                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                                                    <button onClick={() => { setEditingTask(task); setIsTaskModalOpen(true); }} className="text-slate-400 hover:text-indigo-600 transition-colors bg-white/80 p-1 rounded shadow-xs" title="Edit"><Edit className="w-3.5 h-3.5" /></button>
                                                                    <button onClick={() => setTaskToDelete(task)} className="text-slate-400 hover:text-rose-500 transition-colors bg-white/80 p-1 rounded shadow-xs" title="Padam Tugasan"><Trash2 className="w-3.5 h-3.5" /></button>
                                                                </div>
                                                            </div>

                                                            <h4 className="font-extrabold text-sm mb-1.5 leading-snug group-hover:text-indigo-600 transition-colors">{task.title}</h4>

                                                            {task.description && (
                                                                <p className="text-[12px] text-slate-600 mb-3 line-clamp-2 leading-relaxed font-medium bg-slate-50/90 p-2.5 rounded-xl border border-slate-100/90 shadow-2xs">
                                                                    {task.description}
                                                                </p>
                                                            )}

                                                            <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] font-semibold text-slate-500 mb-3">
                                                                <div className="flex items-center">
                                                                    <CalendarIcon className="w-3.5 h-3.5 mr-1 text-slate-400" />
                                                                    <span>{task.dueDate ? `Tamat: ${task.dueDate}` : 'Tiada Tarikh'}</span>
                                                                </div>
                                                                {task.status === 'completed' ? (
                                                                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-200/80 text-emerald-900 border border-emerald-300">
                                                                        ✓ Selesai & Dinotifikasi
                                                                    </span>
                                                                ) : assignedUser ? (
                                                                    <span className="text-[10px] font-bold text-slate-500 bg-white/80 px-2 py-0.5 rounded border border-slate-200 truncate max-w-[120px]" title={`Pegawai: ${assignedUser.name}`}>
                                                                        👤 {assignedUser.name}
                                                                    </span>
                                                                ) : null}
                                                            </div>

                                                            <div className="flex justify-between items-center pt-3 border-t border-slate-200/60">
                                                                <div className="flex items-center space-x-3 text-slate-500 text-xs font-bold">
                                                                    <span className="flex items-center space-x-1 hover:text-indigo-600 transition-colors" title="Komen Ahli Pasukan">
                                                                        <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                                                                        <span>{commentsCount}</span>
                                                                    </span>
                                                                    <span className="flex items-center space-x-1 hover:text-indigo-600 transition-colors" title="Lampiran Fail">
                                                                        <Paperclip className="w-3.5 h-3.5 text-indigo-500" />
                                                                        <span>{filesCount}</span>
                                                                    </span>
                                                                </div>

                                                                <div className="flex items-center space-x-2">
                                                                    <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                                        Interaktif ►
                                                                    </span>
                                                                    <div className="w-7 h-7 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-extrabold shadow-xs uppercase shrink-0" title={assignedUser?.name || 'Belum Ditugaskan'}>
                                                                        {assignedUser ? (assignedUser.avatar || assignedUser.name.substring(0, 2).toUpperCase()) : '?'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}

                                                {colTasks.length === 0 && (
                                                    <div className="text-center p-8 border-2 border-dashed border-slate-300 rounded-2xl bg-white/50">
                                                        <p className="text-slate-400 font-medium text-xs">Tarik kad ke sini</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )
                }

                {
                    activeTab === 'Kewangan Projek' && (() => {
                        const rawBudget = parseFloat(project.budget) || 0;
                        const totalBudgetRM = rawBudget > 0 && rawBudget < 1000 ? rawBudget * 1000000 : rawBudget;

                        // Bahagikan perbelanjaan kepada Invois/Tuntutan dan Denda SLA
                        const claimsFinances = finances.filter(f => f.type !== 'Denda' && f.status !== 'Denda SLA');
                        const penaltyFinances = finances.filter(f => f.type === 'Denda' || f.status === 'Denda SLA');

                        const totalClaimsRM = claimsFinances.reduce((sum, f) => sum + (parseFloat(f.amount) || 0), 0);
                        const totalPenaltiesRM = penaltyFinances.reduce((sum, f) => sum + (parseFloat(f.amount) || 0), 0);

                        // Perbelanjaan bersih = Invois ditolak Denda SLA (potongan bayaran)
                        const netSpentRM = Math.max(0, totalClaimsRM - totalPenaltiesRM);
                        const totalSpentRM = totalClaimsRM; // Jumlah kasardibelanjakan
                        const isBurst = netSpentRM > totalBudgetRM && totalBudgetRM > 0;
                        const burstAmount = Math.abs(netSpentRM - totalBudgetRM);
                        const remainingBalanceRM = Math.max(0, totalBudgetRM - netSpentRM);
                        const spentPercentage = totalBudgetRM > 0 ? ((netSpentRM / totalBudgetRM) * 100).toFixed(2) : '0.00';

                        const formatFullRM = (val) => {
                            return 'RM ' + parseFloat(val || 0).toLocaleString('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                        };

                        return (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                                    <div>
                                        <h3 className="text-xl font-bold tracking-tight text-slate-900">Pengurusan Kewangan & Denda SLA Projek</h3>
                                        <p className="text-slate-500 text-xs sm:text-sm mt-0.5">Jejak perbelanjaan, tuntutan bayaran, tolakan denda SLA dan baki peruntukan terkini.</p>
                                    </div>
                                    <div className="flex items-center space-x-2.5 shrink-0">
                                        <button onClick={() => setIsPenaltyModalOpen(true)} className="bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all flex items-center shadow-2xs active:scale-[0.98]">
                                            <AlertTriangle className="w-4 h-4 mr-2 text-rose-600 shrink-0" /> Denda SLA
                                        </button>
                                        <button onClick={() => { setEditingFinance(null); setIsFinanceModalOpen(true); }} className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all flex items-center shadow-xs active:scale-[0.98]">
                                            <Plus className="w-4 h-4 mr-2 text-slate-300 shrink-0" /> Daftar Tuntutan
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                                    <Card noPadding className="p-5 border border-slate-200/80 bg-white hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                                            <span>Peruntukan Projek</span>
                                            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                                                <DollarSign className="w-3.5 h-3.5" />
                                            </div>
                                        </div>
                                        <h3 className="text-xl xl:text-2xl font-bold tracking-tight text-slate-900 truncate mt-2" title={formatFullRM(totalBudgetRM)}>
                                            {formatFullRM(totalBudgetRM)}
                                        </h3>
                                        <div className="mt-3.5 pt-2.5 border-t border-slate-100 text-[11px] font-semibold text-slate-500 flex items-center truncate">
                                            <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-emerald-600 shrink-0" />
                                            <span className="truncate">MOF: {formatDateMalay(project.mof_approval_date || project.mofApprovalDate) || '12 Jan 2025'}</span>
                                        </div>
                                    </Card>

                                    <Card noPadding className={`p-5 border bg-white hover:shadow-md transition-shadow ${isBurst ? 'border-rose-200' : 'border-slate-200/80'}`}>
                                        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                                            <span>Tuntutan & Invois</span>
                                            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                                <Receipt className="w-3.5 h-3.5" />
                                            </div>
                                        </div>
                                        <h3 className="text-xl xl:text-2xl font-bold tracking-tight text-slate-900 truncate mt-2" title={formatFullRM(totalClaimsRM)}>
                                            {formatFullRM(totalClaimsRM)}
                                        </h3>
                                        <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mr-2">
                                                <div className="bg-indigo-600 h-1.5 rounded-full transition-all" style={{ width: `${Math.min(100, parseFloat(spentPercentage))}%` }}></div>
                                            </div>
                                            <span className="shrink-0 text-slate-700 font-bold">{spentPercentage}%</span>
                                        </div>
                                    </Card>

                                    <Card noPadding className="p-5 border border-rose-200/80 bg-rose-50/20 hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between text-xs font-bold text-rose-600 uppercase tracking-wider">
                                            <span className="flex items-center truncate">
                                                Denda SLA <span className="ml-1.5 px-1.5 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-extrabold rounded">Potongan</span>
                                            </span>
                                            <div className="w-7 h-7 rounded-lg bg-rose-100/70 flex items-center justify-center text-rose-600 shrink-0">
                                                <AlertTriangle className="w-3.5 h-3.5" />
                                            </div>
                                        </div>
                                        <h3 className="text-xl xl:text-2xl font-bold tracking-tight text-rose-600 truncate mt-2" title={`- ${formatFullRM(totalPenaltiesRM)}`}>
                                            - {formatFullRM(totalPenaltiesRM)}
                                        </h3>
                                        <div className="mt-3.5 pt-2.5 border-t border-rose-100 text-[11px] font-semibold text-rose-600 flex items-center truncate">
                                            <AlertTriangle className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                                            <span className="truncate">{penaltyFinances.length} Kes Denda Direkodkan</span>
                                        </div>
                                    </Card>

                                    <Card noPadding className={`p-5 border bg-white hover:shadow-md transition-shadow ${isBurst ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200/80'}`}>
                                        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                                            <span>{isBurst ? 'Baki (Melebihi Bajet)' : 'Baki Tersedia (Nett)'}</span>
                                            <div className={`w-7 h-7 rounded-lg ${isBurst ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'} flex items-center justify-center shrink-0`}>
                                                <Wallet className="w-3.5 h-3.5" />
                                            </div>
                                        </div>
                                        <h3 className={`text-xl xl:text-2xl font-bold tracking-tight truncate mt-2 ${isBurst ? 'text-rose-600' : 'text-emerald-700'}`} title={isBurst ? `- ${formatFullRM(burstAmount)}` : formatFullRM(remainingBalanceRM)}>
                                            {isBurst ? `- ${formatFullRM(burstAmount)}` : formatFullRM(remainingBalanceRM)}
                                        </h3>
                                        <div className="mt-3.5 pt-2.5 border-t border-slate-100 text-[11px] font-semibold text-slate-500 truncate">
                                            {isBurst ? `Melebihi bajet ${formatFullRM(burstAmount)}` : `Baki bersih (selepas denda)`}
                                        </div>
                                    </Card>
                                </div>

                                <Card noPadding className="overflow-x-auto mt-6">
                                    <div className="p-6 border-b border-slate-100 bg-white flex justify-between items-center">
                                        <h3 className="font-extrabold text-slate-900 flex items-center"><Receipt className="w-5 h-5 mr-2 text-slate-400" /> Senarai Rekod Kewangan & Denda SLA</h3>
                                        <span className="text-sm font-bold text-indigo-600">{finances.length} Rekod</span>
                                    </div>
                                    <table className="w-full text-left border-collapse min-w-[800px]">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-100">
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">No. Rujukan / Tarikh</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Perkara / Keterangan</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pembekal / Vendor</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Jumlah (RM)</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Tindakan</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {finances.map(fin => {
                                                const isPenalty = fin.type === 'Denda' || fin.status === 'Denda SLA';
                                                return (
                                                    <tr key={fin.id} className={`hover:bg-slate-50 transition-colors ${isPenalty ? 'bg-rose-50/20' : ''}`}>
                                                        <td className="px-6 py-4">
                                                            <div className={`font-bold text-sm ${isPenalty ? 'text-rose-700 flex items-center' : 'text-slate-900'}`}>
                                                                {isPenalty && <AlertTriangle className="w-3.5 h-3.5 mr-1 text-rose-600 shrink-0" />}
                                                                {fin.invoice_no}
                                                            </div>
                                                            <div className="text-xs font-medium text-slate-400 mt-0.5">{formatDateMalay(fin.date)}</div>
                                                        </td>
                                                        <td className="px-6 py-4 font-semibold text-slate-700 text-sm">
                                                            {fin.description}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-semibold text-slate-500">{fin.vendor}</td>
                                                        <td className={`px-6 py-4 font-extrabold text-sm text-right ${isPenalty ? 'text-rose-600 font-black' : 'text-slate-900'}`}>
                                                            {isPenalty ? `- ${parseFloat(fin.amount).toLocaleString('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : parseFloat(fin.amount).toLocaleString('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            {isPenalty ? (
                                                                <span className="px-3 py-1 bg-rose-100 text-rose-700 border border-rose-200 text-xs font-extrabold rounded-full inline-flex items-center shadow-2xs">
                                                                    ⚠️ Denda SLA
                                                                </span>
                                                            ) : (
                                                                <Badge text={fin.status} />
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex items-center justify-end space-x-2">
                                                                {isPenalty ? (
                                                                    <button onClick={() => { setEditingPenalty(fin); setIsPenaltyModalOpen(true); }} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors text-slate-500 shadow-sm" title="Kemaskini Denda SLA">
                                                                        <Edit className="w-4 h-4" />
                                                                    </button>
                                                                ) : (
                                                                    <button onClick={() => { setEditingFinance(fin); setIsFinanceModalOpen(true); }} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors text-slate-500 shadow-sm" title="Kemaskini Tuntutan">
                                                                        <Edit className="w-4 h-4" />
                                                                    </button>
                                                                )}
                                                                <button onClick={() => setFinanceToDelete(fin)} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors text-slate-500 shadow-sm" title="Padam Rekod">
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </Card>
                            </div>
                        );
                    })()
                }

                {
                    activeTab === 'Dokumen (DMS)' && (() => {
                        const filteredDocs = selectedCategoryFilter === 'Semua'
                            ? docs
                            : docs.filter(d => d.category === selectedCategoryFilter || (selectedCategoryFilter === 'Kanban File' && d.category === 'Spesifikasi Sistem'));

                        const categories = ['Semua', 'Minit Mesyuarat', 'Dokumen Kontrak', 'Kanban File', 'Kewangan & Bajet', 'Denda'];

                        return (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                                    <div>
                                        <h3 className="text-xl font-extrabold text-slate-900">Repositori Dokumen (DMS)</h3>
                                        <p className="text-slate-500 text-sm mt-1">Urus dan muat naik dokumen berkaitan projek secara selamat.</p>
                                    </div>
                                    <button onClick={() => { setSelectedFile(null); setIsDocModalOpen(true); }} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-800 flex items-center text-sm shadow-md transition-all active:scale-[0.98]">
                                        <UploadCloud className="w-4 h-4 mr-2" /> Muat Naik Dokumen
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                                    {categories.map((cat, i) => {
                                        const isActive = selectedCategoryFilter === cat;
                                        const count = cat === 'Semua'
                                            ? docs.length
                                            : docs.filter(d => d.category === cat || (cat === 'Kanban File' && d.category === 'Spesifikasi Sistem')).length;
                                        return (
                                            <div
                                                key={i}
                                                onClick={() => setSelectedCategoryFilter(isActive && cat !== 'Semua' ? 'Semua' : cat)}
                                                className={`p-3.5 rounded-2xl border flex items-center space-x-3 cursor-pointer transition-all ${isActive
                                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
                                                    : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:shadow-sm'
                                                    }`}
                                            >
                                                <div className={`p-2 rounded-xl shrink-0 transition-colors ${isActive ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'
                                                    }`}>
                                                    <Folder className="w-5 h-5" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className={`font-bold text-xs sm:text-sm truncate ${isActive ? 'text-white' : 'text-slate-800'}`}>{cat}</p>
                                                    <p className={`text-[11px] font-semibold ${isActive ? 'text-indigo-100' : 'text-slate-400'}`}>{count} Fail</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <Card noPadding className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-[750px]">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-100">
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Nama Dokumen</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Kategori</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Dimuat Naik Oleh</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Saiz</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right whitespace-nowrap">Tindakan</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredDocs.length > 0 ? (
                                                filteredDocs.map(doc => (
                                                    <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center space-x-3">
                                                                <div className="p-2 bg-indigo-50 rounded-lg shrink-0">
                                                                    <FileText className="w-5 h-5 text-indigo-600" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-slate-900 text-sm hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => window.open(`/My-PMO/api/modules/download.php?id=${encodeURIComponent(doc.id)}&user_id=${encodeURIComponent(currentUser?.id || '')}`, '_blank', 'noopener,noreferrer')}>{doc.file_name}</p>
                                                                    <p className="text-xs font-medium text-slate-400 mt-0.5">{formatDateMalay(doc.created_at ? doc.created_at.split(' ')[0] : '')}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="inline-block bg-slate-50 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold border border-slate-200 whitespace-nowrap">{doc.category === 'Spesifikasi Sistem' ? 'Kanban File' : doc.category}</span>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-semibold text-slate-700 whitespace-nowrap">{doc.uploader_name || 'Sistem'}</td>
                                                        <td className="px-6 py-4 text-sm font-semibold text-slate-500 whitespace-nowrap">{formatFileSize(doc.file_size)}</td>
                                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                                            <div className="flex items-center justify-end space-x-1.5 shrink-0">
                                                                <button onClick={() => window.open(`/My-PMO/api/modules/download.php?id=${encodeURIComponent(doc.id)}&user_id=${encodeURIComponent(currentUser?.id || '')}`, '_blank', 'noopener,noreferrer')} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-colors text-slate-500 shadow-sm" title="Muat Turun Dokumen"><Download className="w-4 h-4" /></button>
                                                                <button onClick={() => setEditingDoc(doc)} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 transition-colors text-slate-500 shadow-sm" title="Ubah Dokumen"><Edit className="w-4 h-4" /></button>
                                                                <button onClick={() => setDocToDelete(doc)} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors text-slate-500 shadow-sm" title="Padam Dokumen"><Trash2 className="w-4 h-4" /></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="text-center py-12 text-slate-400 font-medium">
                                                        Tiada dokumen ditemui untuk kategori <span className="font-bold text-slate-700">"{selectedCategoryFilter}"</span>.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </Card>
                            </div>
                        );
                    })()
                }

                {
                    activeTab === 'Senarai Semak' && (
                        <ProcurementChecklistTab
                            project={currentProject}
                            currentUser={currentUser}
                            showToastNotification={showToastNotification}
                        />
                    )
                }

                {
                    activeTab === 'Ahli Pasukan' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                                <div>
                                    <h3 className="text-xl font-extrabold text-slate-900">Ahli Pasukan Projek</h3>
                                    <p className="text-slate-500 text-sm mt-1">Urus pegawai dan ahli pasukan yang diberikan akses kepada maklumat projek ini.</p>
                                </div>
                                <button onClick={() => setIsAddMemberModalOpen(true)} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-800 flex items-center text-sm shadow-md transition-all active:scale-[0.98]">
                                    <Plus className="w-4 h-4 mr-2" /> Tambah Ahli Pasukan
                                </button>
                            </div>

                            <Card noPadding className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[750px]">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-100">
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Pegawai / Ahli</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Peranan Dalam Projek</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Peranan Sistem / Agensi</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status Akses</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Tindakan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {teamMembers.length > 0 ? (
                                            teamMembers.map(m => {
                                                const initials = m.name ? m.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'AP';
                                                return (
                                                    <tr key={m.member_id} className="hover:bg-slate-50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center space-x-3">
                                                                <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-sm">
                                                                    {initials}
                                                                </div>
                                                                <div>
                                                                    <p className="font-extrabold text-slate-900 text-sm">{m.name}</p>
                                                                    <p className="text-xs text-slate-400 font-medium">{m.email}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-xs font-extrabold border border-indigo-100 inline-block">
                                                                {m.project_role || 'Ahli Pasukan'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm font-bold text-slate-800">{m.agency || 'PKPMP'}</div>
                                                            <div className="text-xs text-slate-400 uppercase font-semibold">{m.system_role || 'Pengguna'}</div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <Badge text={m.status || 'Aktif'} />
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <button
                                                                onClick={() => setMemberToDelete(m)}
                                                                className="px-3.5 py-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl hover:bg-rose-600 hover:text-white transition-colors text-xs font-bold shadow-sm inline-flex items-center active:scale-95"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Buang Akses
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="text-center py-12 text-slate-400 font-medium">
                                                    Belum ada ahli pasukan yang didaftarkan secara khusus untuk projek ini. Klik "+ Tambah Ahli Pasukan" untuk menambah ahli.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </Card>
                        </div>
                    )
                }
            </div >
        </div >
    );
};



