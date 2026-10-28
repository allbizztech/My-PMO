import React, { useState, useEffect } from 'react';
import { CalendarPage } from './pages/CalendarPage';
import { BackupPage } from './pages/BackupPage';
import { AuditTrailPage } from './pages/AuditTrailPage';
import { UsersPage } from './pages/UsersPage';
import { ReportsPage } from './pages/ReportsPage';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectListPage } from './pages/ProjectListPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { SettingsPage } from './pages/SettingsPage';
import {
    LayoutDashboard, Briefcase, Calendar as CalendarIcon,
    Bell, BarChart2, Users, FileText, Database, Settings,
    Menu, LogOut, Shield, ChevronLeft, RefreshCw, AlertCircle,
    Clock, CheckCircle2, ShieldCheck, User, KeyRound, X
} from 'lucide-react';
import { MOCK_USER, MOCK_ROLES } from './services/mockData';

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(() => {
        const saved = localStorage.getItem('mypmo_user');
        return saved ? JSON.parse(saved) : MOCK_USER;
    });
    const [authView, setAuthView] = useState('landing');
    const [currentView, setCurrentView] = useState('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [projectsList, setProjectsList] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [dashboardFilter, setDashboardFilter] = useState('Semua');

    const fetchProjects = async () => {
        try {
            const res = await fetch('/My-PMO/api/modules/projects.php');
            const data = await res.json();
            if (data.status === 'success') {
                const mappedData = data.data.map(p => ({
                    ...p,
                    id: p.id,
                    projectCode: p.project_code,
                    dueDate: p.end_date,
                    budget: Number(p.budget),
                    progress: Number(p.progress)
                }));
                setProjectsList(mappedData);
            }
        } catch (err) {
            console.error("Error fetching projects:", err);
        }
    };

    const [showNotif, setShowNotif] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const unreadCount = notifications.filter(n => n.unread).length;

    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [settingsTab, setSettingsTab] = useState('profile');
    const [pseudoTheme, setPseudoTheme] = useState('light');
    const [toastMsg, setToastMsg] = useState('');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/My-PMO/api/modules/notifications.php');
            const data = await res.json();
            if (data.status === 'success' && Array.isArray(data.data)) {
                setNotifications(data.data);
            } else {
                setNotifications([]);
            }
        } catch (err) {
            setNotifications([]);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchProjects();
            fetchNotifications();
        }
    }, [isAuthenticated]);

    const showToastNotification = (msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(''), 3000);
    };

    const markAllRead = async () => {
        setNotifications(notifications.map(n => ({ ...n, unread: false })));
        try {
            await fetch('/My-PMO/api/modules/notifications.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'mark_as_read', id: 'all' })
            });
        } catch (e) {
            // ignore
        }
    };

    const markAsRead = async (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
        try {
            await fetch('/My-PMO/api/modules/notifications.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'mark_as_read', id })
            });
        } catch (e) {
            // ignore
        }
    };

    const handleNotificationClick = (n) => {
        markAsRead(n.id);
        if (n.project_id) {
            const targetP = projectsList.find(p => p.id == n.project_id || p.project_code == n.project_id);
            if (targetP) {
                setSelectedProject(targetP);
                setCurrentView('project_detail');
                setShowNotif(false);
            }
        }
    };

    const handleLoginSuccess = (user) => {
        const userObj = user || MOCK_USER;
        const rId = userObj.roleId || userObj.role || 'pmo_gov';
        const matchedRole = MOCK_ROLES.find(r => r.id === rId);
        const roleName = matchedRole ? matchedRole.name : (userObj.role || 'Pegawai PMO');

        const updatedUser = {
            ...userObj,
            roleId: rId,
            role: roleName
        };
        setCurrentUser(updatedUser);
        localStorage.setItem('mypmo_user', JSON.stringify(updatedUser));
        setIsAuthenticated(true);
    };

    if (!isAuthenticated) {
        if (authView === 'landing') return <LandingPage onNavigateToLogin={() => setAuthView('login')} />;
        return <LoginPage onLogin={handleLoginSuccess} onBack={() => setAuthView('landing')} />;
    }

    const isVendorPmo = currentUser?.roleId === 'pmo_vendor';
    const isGovPmo = currentUser?.roleId === 'pmo_gov';
    const isAdmin = currentUser?.roleId === 'superadmin' || currentUser?.roleId === 'admin_agency';

    const visibleProjectsList = projectsList.filter(p => {
        if (isAdmin) return true;

        const uname = (currentUser?.name || '').trim().toLowerCase();
        const uagency = (currentUser?.agency || '').trim().toLowerCase();
        const udivision = (currentUser?.division || currentUser?.agency || '').trim().toLowerCase();

        const vm = (p.vendor_manager || p.pmoVendor || '').trim().toLowerCase();
        const mgr = (p.manager || '').trim().toLowerCase();
        const v = (p.vendor || '').trim().toLowerCase();
        const div = (p.division || p.agency || '').trim().toLowerCase();

        if (isVendorPmo) {
            const matchName = uname && (vm.includes(uname) || uname.includes(vm) || mgr.includes(uname) || uname.includes(mgr));
            const matchAgency = uagency && v && (v.includes(uagency) || uagency.includes(v));
            return Boolean(matchName || matchAgency);
        }

        if (isGovPmo) {
            const matchName = uname && (mgr.includes(uname) || uname.includes(mgr) || vm.includes(uname) || uname.includes(vm));
            const matchDivision = udivision && div && (div.includes(udivision) || udivision.includes(div));
            return Boolean(matchName || matchDivision);
        }

        return true;
    });

    const NAVIGATION = [
        { id: 'dashboard', label: 'Papan Pemuka', icon: LayoutDashboard },
        { id: 'projects', label: 'Projek', icon: Briefcase },
        { id: 'calendar', label: 'Kalendar', icon: CalendarIcon },
        ...(!isVendorPmo ? [{ id: 'reports', label: 'Analitik Laporan', icon: BarChart2 }] : []),
        ...(isAdmin ? [
            { id: 'users', label: 'Pasukan & Peranan', icon: Users },
            { id: 'audit', label: 'Jejak Audit', icon: FileText },
            { id: 'backup', label: 'Sandaran Sistem', icon: Database },
            { id: 'settings', label: 'Tetapan', icon: Settings },
        ] : [])
    ];

    const handleSelectProject = (project) => {
        setSelectedProject(project);
        setCurrentView('project_detail');
    };

    const renderView = () => {
        if (!isAdmin && ['users', 'audit', 'backup', 'settings'].includes(currentView)) {
            return (
                <DashboardPage
                    setView={setCurrentView}
                    onSelectFilter={(filter) => {
                        setDashboardFilter(filter);
                        setCurrentView('projects');
                    }}
                    showToastNotification={showToastNotification}
                    projects={visibleProjectsList}
                    currentUser={currentUser}
                />
            );
        }

        if (isVendorPmo && currentView === 'reports') {
            return (
                <DashboardPage
                    setView={setCurrentView}
                    onSelectFilter={(filter) => {
                        setDashboardFilter(filter);
                        setCurrentView('projects');
                    }}
                    showToastNotification={showToastNotification}
                    projects={visibleProjectsList}
                    currentUser={currentUser}
                />
            );
        }

        switch (currentView) {
            case 'dashboard':
                return (
                    <DashboardPage
                        setView={setCurrentView}
                        onSelectFilter={(filter) => {
                            setDashboardFilter(filter);
                            setCurrentView('projects');
                        }}
                        showToastNotification={showToastNotification}
                        projects={visibleProjectsList}
                        currentUser={currentUser}
                    />
                );
            case 'projects':
                return (
                    <ProjectListPage
                        setView={setCurrentView}
                        projects={visibleProjectsList}
                        setProjects={setProjectsList}
                        onSelectProject={handleSelectProject}
                        refreshProjects={fetchProjects}
                        initialFilter={dashboardFilter}
                        showToastNotification={showToastNotification}
                        currentUser={currentUser}
                    />
                );
            case 'project_detail':
                const activeProject = selectedProject && visibleProjectsList.some(p => p.id === selectedProject.id)
                    ? selectedProject
                    : (visibleProjectsList[0] || selectedProject);
                return (
                    <ProjectDetailPage
                        setView={setCurrentView}
                        project={activeProject}
                        showToastNotification={showToastNotification}
                        currentUser={currentUser}
                        notifications={notifications}
                        setNotifications={setNotifications}
                    />
                );
            case 'calendar': return <CalendarPage onSelectProject={handleSelectProject} projects={visibleProjectsList} />;
            case 'reports': return <ReportsPage projects={visibleProjectsList} />;
            case 'users': return <UsersPage showToastNotification={showToastNotification} />;
            case 'audit': return <AuditTrailPage currentUser={currentUser} showToastNotification={showToastNotification} />;
            case 'backup': return <BackupPage showToastNotification={showToastNotification} currentUser={currentUser} />;
            case 'settings': return <SettingsPage showToastNotification={showToastNotification} currentUser={currentUser} refreshNotifications={fetchNotifications} />;
            default: return <DashboardPage setView={setCurrentView} showToastNotification={showToastNotification} projects={visibleProjectsList} />;
        }
    };

    const handleNavigation = (id) => {
        setCurrentView(id);
        setIsMobileMenuOpen(false);
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newName = (formData.get('name') || currentUser?.name || 'Datuk Dr. Azman').trim();
        const newEmail = (formData.get('email') || currentUser?.email || 'admin@kehakiman.gov.my').trim();
        const newPassword = formData.get('new_password');
        const confirmPassword = formData.get('confirm_password');

        if (newPassword) {
            if (newPassword.length < 6) {
                alert('Kata laluan baharu mestilah sekurang-kurangnya 6 aksara.');
                return;
            }
            if (newPassword !== confirmPassword) {
                alert('Kata laluan baharu dan pengesahan kata laluan tidak sepadan.');
                return;
            }
        }

        const words = newName.split(/\s+/);
        let avatarInitials = 'PM';
        if (words.length >= 2) {
            avatarInitials = (words[0][0] + words[words.length - 1][0]).toUpperCase();
        } else if (words.length === 1 && words[0].length >= 2) {
            avatarInitials = words[0].substring(0, 2).toUpperCase();
        }

        const updatedUser = {
            ...currentUser,
            name: newName,
            email: newEmail,
            avatar: avatarInitials
        };

        try {
            const payload = {
                id: currentUser?.id || 1,
                name: newName,
                email: newEmail
            };
            if (newPassword) {
                payload.password = newPassword;
            }

            const res = await fetch('/My-PMO/api/modules/users.php', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.status === 'success') {
                setCurrentUser(updatedUser);
                localStorage.setItem('mypmo_user', JSON.stringify(updatedUser));
                setIsSettingsModalOpen(false);
                showToastNotification(newPassword ? 'Profil & kata laluan berjaya dikemas kini!' : 'Profil pengguna berjaya dikemas kini!');
            } else {
                alert(data.message || 'Gagal mengemas kini profil.');
            }
        } catch (err) {
            // Fallback for offline/mock mode
            setCurrentUser(updatedUser);
            localStorage.setItem('mypmo_user', JSON.stringify(updatedUser));
            setIsSettingsModalOpen(false);
            showToastNotification('Profil pengguna berjaya dikemas kini!');
        }
    };



    return (
        <div className="flex h-screen font-sans overflow-hidden selection:bg-indigo-100 selection:text-indigo-900 relative bg-[#F8F9FB] text-slate-900">

            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 lg:hidden transition-opacity" onClick={() => setIsMobileMenuOpen(false)}></div>
            )}

            <aside className={`fixed inset-y-0 left-0 bg-white border-r border-slate-100 flex flex-col h-full z-50 transform transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 shadow-[4px_0_24px_rgba(0,0,0,0.01)] ${isSidebarCollapsed ? 'w-20' : 'w-[280px]'} ${isMobileMenuOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full'}`}>
                <div className={`h-16 lg:h-24 flex items-center shrink-0 border-b border-slate-50 ${isSidebarCollapsed ? 'justify-center px-2' : 'justify-between px-4 lg:px-5'}`}>
                    <div className="flex items-center overflow-hidden">
                        <img src="/My-PMO/logo.png" alt="MY-PMO Logo" className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl object-contain shrink-0 drop-shadow-sm transition-transform hover:scale-105" />
                        <span className={`ml-3 text-lg lg:text-xl font-extrabold tracking-tight text-slate-900 transition-all duration-300 ${isSidebarCollapsed ? 'hidden' : ''}`}>MY-PMO</span>
                    </div>
                    {/* Butang Tutup X khusus untuk Paparan Mobile Drawer */}
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        title="Tutup Menu"
                        className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 no-scrollbar">
                    <p className={`px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 mt-2 transition-all duration-200 ${isSidebarCollapsed ? 'lg:hidden' : ''}`}>Menu Utama</p>
                    {NAVIGATION.map(item => {
                        const isActive = currentView === item.id || (currentView === 'project_detail' && item.id === 'projects');
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavigation(item.id)}
                                title={item.label}
                                className={`w-full flex items-center ${isSidebarCollapsed ? 'lg:justify-center lg:px-0' : 'px-4'} py-3.5 rounded-2xl transition-all duration-200 group ${isActive ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                            >
                                <item.icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'}`} />
                                <span className={`ml-4 font-bold text-sm tracking-wide transition-all duration-200 ${isSidebarCollapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
                            </button>
                        )
                    })}
                </div>

                <div className={`shrink-0 transition-all duration-300 ${isSidebarCollapsed ? 'p-2' : 'p-4'}`}>
                    <div className={`bg-slate-50 border border-slate-200/70 transition-all duration-300 ${isSidebarCollapsed ? 'rounded-2xl p-2 flex flex-col items-center gap-2' : 'rounded-3xl p-3'}`}>
                        <div
                            onClick={() => { setSettingsTab('profile'); setIsSettingsModalOpen(true); setIsMobileMenuOpen(false); }}
                            className={`cursor-pointer transition-all group ${
                                isSidebarCollapsed 
                                    ? 'w-full flex justify-center items-center py-1' 
                                    : 'flex items-center space-x-3 mb-3 hover:bg-white/80 p-1.5 rounded-2xl'
                            }`}
                            title="Klik untuk kemas kini profil pengguna"
                        >
                            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-extrabold text-sm shadow-xs shrink-0 group-hover:scale-105 group-hover:ring-4 group-hover:ring-indigo-100 transition-all tracking-tight">
                                {currentUser?.avatar || 'DA'}
                            </div>
                            <div className={`flex-1 min-w-0 transition-all duration-200 ${isSidebarCollapsed ? 'hidden' : ''}`}>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-bold truncate text-slate-900 group-hover:text-indigo-600 transition-colors">{currentUser?.name || 'Datuk Dr. Azman'}</p>
                                    <User className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 ml-1" />
                                </div>
                                <p className="text-xs font-semibold truncate text-slate-500">{MOCK_ROLES.find(r => r.id === currentUser?.roleId)?.name || currentUser?.role || 'PMO Vendor'}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => { setIsAuthenticated(false); setAuthView('landing'); }} 
                            title="Log Keluar"
                            className={`flex items-center justify-center border transition-all duration-200 font-bold text-xs shadow-xs active:scale-95 bg-white border-slate-200 text-slate-700 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 cursor-pointer ${
                                isSidebarCollapsed 
                                    ? 'w-10 h-10 rounded-xl p-0' 
                                    : 'w-full px-3 py-2.5 rounded-xl'
                            }`}
                        >
                            <LogOut className="w-4 h-4 shrink-0" />
                            {!isSidebarCollapsed && <span className="ml-2 font-bold text-xs">Log Keluar</span>}
                        </button>
                    </div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                <header className="h-14 sm:h-16 lg:h-20 flex items-center justify-between px-3 sm:px-6 lg:px-8 z-30 shrink-0 backdrop-blur-md transition-colors bg-[#F8F9FB]/90 border-b border-slate-100/80">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        {/* Butang Menu Universal (Desktop: Kuncup/Kembang, Mobile: Buka Laci) */}
                        <button
                            onClick={() => {
                                if (window.innerWidth >= 1024) {
                                    setIsSidebarCollapsed(!isSidebarCollapsed);
                                } else {
                                    setIsMobileMenuOpen(true);
                                }
                            }}
                            className="p-2 sm:p-2.5 border rounded-xl shadow-xs transition-all active:scale-95 flex items-center bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 cursor-pointer"
                            title={isSidebarCollapsed ? "Kembangkan Menu Utama" : "Kuncupkan / Buka Menu Utama"}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <div className="relative">
                            <button onClick={() => { setShowNotif(!showNotif); }} className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center border rounded-full transition-all shadow-sm relative focus:ring-2 focus:ring-indigo-100 bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 cursor-pointer">
                                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[18px] text-[10px] font-black bg-rose-500 text-white rounded-full ring-2 ring-white flex items-center justify-center animate-pulse shadow-sm">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>
                            {showNotif && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowNotif(false)} />
                                    <div className="fixed sm:absolute inset-x-3 sm:inset-auto sm:right-0 mt-3 sm:w-96 rounded-2xl shadow-xl border overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 bg-white border-slate-100 text-slate-900">
                                        <div className="p-4 border-b flex justify-between items-center border-slate-100 bg-slate-50/80">
                                            <div className="flex items-center gap-2">
                                                <Bell className="w-4 h-4 text-indigo-600" />
                                                <span className="font-extrabold text-sm text-slate-900">Pusat Notifikasi & Peringatan Projek</span>
                                                {unreadCount > 0 && (
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-700">
                                                        {unreadCount} Baharu
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => fetchNotifications()}
                                                    className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer"
                                                    title="Segar Semula Notifikasi"
                                                >
                                                    <RefreshCw className="w-3.5 h-3.5" />
                                                </button>
                                                {unreadCount > 0 && (
                                                    <button onClick={markAllRead} className="text-xs text-indigo-600 font-bold hover:underline cursor-pointer">
                                                        Tanda Semua
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto divide-y divide-slate-50">
                                            {notifications.length > 0 ? notifications.map(n => (
                                                <div
                                                    key={n.id}
                                                    onClick={() => handleNotificationClick(n)}
                                                    className={`p-4 cursor-pointer transition-all hover:bg-slate-50/80 ${n.unread ? (n.type === 'danger' ? 'bg-rose-50/40 border-l-4 border-l-rose-500' : n.type === 'warning' ? 'bg-amber-50/40 border-l-4 border-l-amber-500' : 'bg-indigo-50/40 border-l-4 border-l-indigo-500') : 'border-l-4 border-l-transparent opacity-85'}`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${n.type === 'danger' ? 'bg-rose-100 text-rose-700' : n.type === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}>
                                                            {n.type === 'danger' ? <AlertCircle className="w-3.5 h-3.5" /> : n.type === 'warning' ? <Clock className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between gap-1">
                                                                <p className="text-xs font-bold text-slate-900 truncate">{n.title}</p>
                                                                {n.unread && <span className="w-2 h-2 bg-indigo-600 rounded-full shrink-0"></span>}
                                                            </div>
                                                            <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">{n.message}</p>
                                                            <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100/60">
                                                                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">{n.time}</span>
                                                                {n.project_id && (
                                                                    <span className="text-[11px] font-bold text-indigo-600 hover:underline flex items-center">
                                                                        Buka Projek &rarr;
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="p-8 text-center text-slate-400 text-xs font-medium">
                                                    Tiada notifikasi baharu buat masa ini.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Mobile quick profile icon button */}
                        <button
                            onClick={() => { setSettingsTab('profile'); setIsSettingsModalOpen(true); setShowNotif(false); }}
                            className="sm:hidden w-10 h-10 flex items-center justify-center border rounded-xl transition-all shadow-xs bg-white border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-200 hover:bg-slate-50 cursor-pointer"
                            title="Edit Profil Pengguna"
                        >
                            <User className="w-4 h-4 text-indigo-600 shrink-0" />
                        </button>

                        <div className="relative hidden sm:block">
                            <button
                                onClick={() => { setSettingsTab('profile'); setIsSettingsModalOpen(true); setShowNotif(false); }}
                                className="h-10 px-3.5 flex items-center space-x-2 border rounded-xl transition-all shadow-xs focus:ring-2 focus:ring-indigo-100 bg-white border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-200 hover:bg-slate-50 cursor-pointer text-xs font-bold"
                                title="Edit Profil Pengguna"
                            >
                                <User className="w-4 h-4 text-indigo-600 shrink-0" />
                                <span>Edit Profil</span>
                            </button>
                        </div>

                    </div>
                </header>

                {isSettingsModalOpen && (
                    <div className="fixed inset-0 z-[70] overflow-y-auto">
                        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={() => setIsSettingsModalOpen(false)}></div>
                        <div className="flex min-h-full items-center justify-center p-4">
                            <div className="relative rounded-3xl shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200 bg-white text-slate-900 border border-slate-200 overflow-hidden">
                                <div className="p-6 border-b flex justify-between items-center bg-slate-50/80 border-slate-100">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-base font-extrabold text-slate-900">Edit Profil Pengguna</h2>
                                            <p className="text-xs text-slate-500">Kemaskini maklumat akaun dan kata laluan anda</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setIsSettingsModalOpen(false)} 
                                        className="w-8 h-8 rounded-full flex items-center justify-center border transition-colors bg-white border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 cursor-pointer"
                                    >
                                        &times;
                                    </button>
                                </div>

                                <div className="flex border-b px-6 border-slate-200 bg-white">
                                    <button 
                                        type="button"
                                        onClick={() => setSettingsTab('profile')} 
                                        className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center space-x-2 cursor-pointer ${settingsTab === 'profile' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
                                    >
                                        <User className="w-3.5 h-3.5" />
                                        <span>Maklumat Profil</span>
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setSettingsTab('security')} 
                                        className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center space-x-2 cursor-pointer ${settingsTab === 'security' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
                                    >
                                        <KeyRound className="w-3.5 h-3.5" />
                                        <span>Tukar Kata Laluan</span>
                                    </button>
                                </div>

                                <div className="p-6">
                                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                                        {settingsTab === 'profile' ? (
                                            <>
                                                <div className="flex items-center space-x-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-4">
                                                    <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center text-white font-extrabold text-xl shadow-xs shrink-0">
                                                        {currentUser?.avatar || 'DA'}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-sm text-slate-900">{currentUser?.name || 'Pengguna'}</h4>
                                                        <p className="text-xs text-slate-500">{currentUser?.email || 'admin@kehakiman.gov.my'}</p>
                                                        <span className="inline-block mt-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                                                            {MOCK_ROLES.find(r => r.id === currentUser?.roleId)?.name || currentUser?.role || 'PMO Vendor'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-bold mb-1.5 text-slate-700">Nama Penuh</label>
                                                    <input 
                                                        name="name" 
                                                        type="text" 
                                                        defaultValue={currentUser?.name || 'Datuk Dr. Azman'} 
                                                        required 
                                                        className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none transition-all bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500" 
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-bold mb-1.5 text-slate-700">Alamat E-mel Rasmi</label>
                                                    <input 
                                                        name="email" 
                                                        type="email" 
                                                        defaultValue={currentUser?.email || 'admin@kehakiman.gov.my'} 
                                                        required 
                                                        className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none transition-all bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500" 
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-3 pt-1">
                                                    <div>
                                                        <label className="block text-xs font-bold mb-1.5 text-slate-500">Peranan Sistem</label>
                                                        <input 
                                                            type="text" 
                                                            value={MOCK_ROLES.find(r => r.id === currentUser?.roleId)?.name || currentUser?.role || 'PMO Vendor'} 
                                                            disabled 
                                                            className="w-full px-3.5 py-2 text-xs border rounded-xl cursor-not-allowed font-medium bg-slate-100 border-slate-200 text-slate-500" 
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold mb-1.5 text-slate-500">Agensi</label>
                                                        <input 
                                                            type="text" 
                                                            value={currentUser?.agency || 'PKPMP'} 
                                                            disabled 
                                                            className="w-full px-3.5 py-2 text-xs border rounded-xl cursor-not-allowed font-medium bg-slate-100 border-slate-200 text-slate-500" 
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start space-x-2.5">
                                                    <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                                    <span>Kata laluan baharu mestilah sekurang-kurangnya <strong>6 aksara</strong>. Pastikan anda mengingati kata laluan ini.</span>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-bold mb-1.5 text-slate-700">Kata Laluan Baharu</label>
                                                    <input 
                                                        name="new_password" 
                                                        type="password" 
                                                        placeholder="Masukkan kata laluan baharu" 
                                                        className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none transition-all bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500" 
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-bold mb-1.5 text-slate-700">Sahkan Kata Laluan Baharu</label>
                                                    <input 
                                                        name="confirm_password" 
                                                        type="password" 
                                                        placeholder="Ulang semula kata laluan baharu" 
                                                        className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none transition-all bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500" 
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                                            <button 
                                                type="button" 
                                                onClick={() => setIsSettingsModalOpen(false)} 
                                                className="px-4 py-2.5 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                                            >
                                                Batal
                                            </button>
                                            <button 
                                                type="submit" 
                                                className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 shadow-sm active:scale-[0.98] transition-all cursor-pointer flex items-center space-x-2"
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                                <span>Simpan Perubahan</span>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {toastMsg && (
                    <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
                        <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                            <span className="font-bold text-sm">{toastMsg}</span>
                        </div>
                    </div>
                )}

                <main className="flex-1 overflow-y-auto px-3 sm:px-5 lg:px-7 pt-3 pb-6 w-full flex flex-col justify-between" onClick={() => { setShowNotif(false); }}>
                    <div className="w-full max-w-[1720px] mx-auto flex-1 pb-6">
                        {renderView()}
                    </div>

                    {/* Footer System Rasmi MY-PMO */}
                    <footer className="w-full max-w-[1720px] mx-auto border-t border-slate-200/80 pt-5 pb-4 mt-auto text-slate-500 text-xs">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center space-x-3 text-center sm:text-left">
                                <img src="/My-PMO/logo.png" alt="MY-PMO Logo" className="w-8 h-8 rounded-lg object-contain shadow-xs shrink-0" />
                                <div>
                                    <p className="font-extrabold text-slate-900 text-xs sm:text-sm">
                                        MY-PMO
                                    </p>
                                    <p className="text-[11px] text-slate-400 font-medium">Sistem Pengurusan & Pemantauan Projek PKPMP</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
                            <p>© {new Date().getFullYear()} Hak Cipta Terpelihara - Pejabat Ketua Pendaftar Mahkamah Persekutuan Malaysia.</p>
                            <div className="flex items-center space-x-2">
                                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> Terperingkat & Selamat
                                </span>
                                <span className="font-mono text-[10px] text-slate-400">v2.4.0</span>
                            </div>
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    );
}