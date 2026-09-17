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
    Clock, CheckCircle2, ShieldCheck
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
            const res = await fetch('http://localhost/My-PMO/api/modules/projects.php');
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
    const [showSettings, setShowSettings] = useState(false);

    const [notifications, setNotifications] = useState([]);
    const unreadCount = notifications.filter(n => n.unread).length;
    const [language, setLanguage] = useState('ms');

    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [settingsTab, setSettingsTab] = useState('profile');
    const [pseudoTheme, setPseudoTheme] = useState('light');
    const [toastMsg, setToastMsg] = useState('');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const fetchNotifications = async () => {
        try {
            const res = await fetch('http://localhost/My-PMO/api/modules/notifications.php');
            const data = await res.json();
            if (data.status === 'success' && Array.isArray(data.data)) {
                setNotifications(data.data);
            } else {
                setNotifications(MOCK_NOTIFICATIONS);
            }
        } catch (err) {
            setNotifications(MOCK_NOTIFICATIONS);
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
            await fetch('http://localhost/My-PMO/api/modules/notifications.php', {
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
            await fetch('http://localhost/My-PMO/api/modules/notifications.php', {
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
            case 'users': return <UsersPage />;
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

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newName = formData.get('name') || currentUser?.name || 'Datuk Dr. Azman';
        const newEmail = formData.get('email') || currentUser?.email || 'admin@kehakiman.gov.my';

        const words = newName.trim().split(/\s+/);
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

        setCurrentUser(updatedUser);
        localStorage.setItem('mypmo_user', JSON.stringify(updatedUser));
        setIsSettingsModalOpen(false);
        showToastNotification('Profil pengguna berjaya dikemas kini!');
    };



    return (
        <div className="flex h-screen font-sans overflow-hidden selection:bg-indigo-100 selection:text-indigo-900 relative bg-[#F8F9FB] text-slate-900">

            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 lg:hidden transition-opacity" onClick={() => setIsMobileMenuOpen(false)}></div>
            )}

            <aside className={`fixed inset-y-0 left-0 bg-white border-r border-slate-100 flex flex-col h-full z-40 transform transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 shadow-[4px_0_24px_rgba(0,0,0,0.01)] ${isSidebarCollapsed ? 'w-20' : 'w-[280px]'} ${isMobileMenuOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full'}`}>
                <div className="h-20 lg:h-24 flex items-center justify-between px-5 shrink-0 border-b border-slate-50">
                    <div className="flex items-center overflow-hidden">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shrink-0">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <span className={`ml-3.5 text-xl font-extrabold tracking-tight text-slate-900 transition-all duration-300 ${isSidebarCollapsed ? 'lg:hidden' : ''}`}>MY-PMO</span>
                    </div>
                    <button
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        title={isSidebarCollapsed ? "Kembangkan Menu Utama" : "Kuncupkan Menu Utama"}
                        className="hidden lg:flex p-2 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95 shrink-0 bg-slate-100 hover:bg-slate-200 text-slate-600"
                    >
                        <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
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

                <div className="p-4 shrink-0">
                    <div className="bg-slate-50 border-slate-100 rounded-3xl p-3 border transition-colors">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-extrabold text-sm shadow-sm shrink-0">
                                {currentUser?.avatar || 'DA'}
                            </div>
                            <div className={`flex-1 min-w-0 transition-all duration-200 ${isSidebarCollapsed ? 'lg:hidden' : ''}`}>
                                <p className="text-sm font-bold truncate text-slate-900">{currentUser?.name || 'Datuk Dr. Azman'}</p>
                                <p className="text-xs font-semibold truncate text-slate-500">{MOCK_ROLES.find(r => r.id === currentUser?.roleId)?.name || currentUser?.role || 'PMO Vendor'}</p>
                            </div>
                        </div>
                        <button onClick={() => { setIsAuthenticated(false); setAuthView('landing'); }} className="w-full flex items-center justify-center px-3 py-2.5 border transition-colors rounded-xl font-bold text-sm shadow-sm active:scale-[0.98] bg-white border-slate-200 text-slate-700 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50">
                            <LogOut className="w-4 h-4 shrink-0" />
                            <span className={`ml-2 font-bold text-xs ${isSidebarCollapsed ? 'lg:hidden' : ''}`}>Log Keluar</span>
                        </button>
                    </div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                <header className="h-20 lg:h-24 flex items-center justify-between px-4 lg:px-8 z-30 shrink-0 backdrop-blur-md transition-colors bg-[#F8F9FB]/80">
                    <div className="flex items-center space-x-3">
                        <button className="p-2.5 border rounded-xl lg:hidden shadow-sm transition-colors bg-white border-slate-200 text-slate-600 hover:text-slate-900" onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                            className="hidden lg:flex p-2.5 border rounded-xl shadow-sm transition-all active:scale-95 items-center space-x-2 bg-white border-slate-200 text-slate-600 hover:text-slate-900"
                            title={isSidebarCollapsed ? "Kembangkan Menu Utama" : "Kuncupkan Menu Utama"}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="relative">
                            <button onClick={() => { setShowNotif(!showNotif); setShowSettings(false); }} className="w-10 h-10 flex items-center justify-center border rounded-full transition-all shadow-sm relative focus:ring-2 focus:ring-indigo-100 bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 cursor-pointer">
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[18px] text-[10px] font-black bg-rose-500 text-white rounded-full ring-2 ring-white flex items-center justify-center animate-pulse shadow-sm">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>
                            {showNotif && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowNotif(false)} />
                                    <div className="absolute right-0 mt-3 w-88 sm:w-96 rounded-3xl shadow-2xl border overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 bg-white border-slate-100 text-slate-900">
                                        <div className="p-4 border-b flex justify-between items-center border-slate-100 bg-slate-50/80">
                                            <div className="flex items-center gap-2">
                                                <Bell className="w-4 h-4 text-indigo-600" />
                                                <span className="font-extrabold text-sm text-slate-900">Pusat Amaran Pintar</span>
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

                        <div className="relative hidden sm:block">
                            <button onClick={() => { setShowSettings(!showSettings); setShowNotif(false); }} className="w-10 h-10 flex items-center justify-center border rounded-full transition-all shadow-sm focus:ring-2 focus:ring-indigo-100 bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50">
                                <Settings className="w-5 h-5" />
                            </button>
                            {showSettings && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowSettings(false)} />
                                    <div className="absolute right-0 mt-3 w-56 rounded-2xl shadow-xl border overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 bg-white border-slate-100 text-slate-900">
                                        <div className="p-2 space-y-1">
                                            <p className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bahasa / Language</p>
                                            <button onClick={() => setLanguage('ms')} className={`w-full text-left px-4 py-2.5 text-sm font-bold rounded-xl transition-colors flex justify-between items-center ${language === 'ms' ? 'text-indigo-500 bg-indigo-500/10' : 'text-slate-700 hover:bg-slate-50'}`}>
                                                <span>Bahasa Melayu</span> {language === 'ms' && <CheckCircle2 className="w-4 h-4 text-indigo-500" />}
                                            </button>
                                            <button onClick={() => setLanguage('en')} className={`w-full text-left px-4 py-2.5 text-sm font-bold rounded-xl transition-colors flex justify-between items-center ${language === 'en' ? 'text-indigo-500 bg-indigo-500/10' : 'text-slate-700 hover:bg-slate-50'}`}>
                                                <span>English</span> {language === 'en' && <CheckCircle2 className="w-4 h-4 text-indigo-500" />}
                                            </button>
                                            <div className="h-px w-full my-2 bg-slate-100"></div>
                                            <p className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Akaun</p>
                                            <button onClick={() => { setSettingsTab('profile'); setIsSettingsModalOpen(true); setShowSettings(false); }} className="w-full text-left px-4 py-2.5 text-sm font-bold rounded-xl transition-colors text-slate-700 hover:bg-slate-50">Profil Pengguna</button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                    </div>
                </header>

                {isSettingsModalOpen && (
                    <div className="fixed inset-0 z-[70] overflow-y-auto">
                        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsSettingsModalOpen(false)}></div>
                        <div className="flex min-h-full items-center justify-center p-4">
                            <div className="relative rounded-[32px] shadow-2xl w-full max-w-xl animate-in zoom-in-95 duration-200 bg-white text-slate-900">
                                <div className="p-8 border-b flex justify-between items-center rounded-t-[32px] bg-slate-50 border-slate-100">
                                    <h2 className="text-xl font-extrabold">Tetapan Sistem</h2>
                                    <button onClick={() => setIsSettingsModalOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center border transition-colors bg-white border-slate-200 text-slate-500 hover:text-rose-500">&times;</button>
                                </div>
                                <div className="flex border-b px-8 pt-4 border-slate-200">
                                    <button onClick={() => setSettingsTab('profile')} className="pb-4 text-sm font-bold border-b-2 transition-colors mr-8 border-indigo-600 text-indigo-600">Profil Pengguna</button>
                                </div>
                                <div className="p-8">
                                    {settingsTab === 'profile' && (
                                        <form onSubmit={handleUpdateProfile} className="space-y-5">
                                            <div className="flex items-center space-x-5 mb-6">
                                                <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-inner border-2 border-white">{currentUser?.avatar || 'DA'}</div>
                                                <div>
                                                    <button type="button" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl transition-colors shadow-md mb-2">Tukar Gambar</button>
                                                    <p className="text-xs text-slate-400 font-medium">Format JPG, PNG (Maks: 2MB)</p>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold mb-2 text-slate-700">Nama Penuh</label>
                                                <input name="name" type="text" defaultValue={currentUser?.name || 'Datuk Dr. Azman'} required className="w-full px-5 py-3.5 border rounded-2xl outline-none transition-all bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold mb-2 text-slate-700">E-mel Rasmi</label>
                                                <input name="email" type="email" defaultValue={currentUser?.email || 'admin@kehakiman.gov.my'} required className="w-full px-5 py-3.5 border rounded-2xl outline-none transition-all bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold mb-2 text-slate-700">Peranan Sistem (Read-only)</label>
                                                <input type="text" value={MOCK_ROLES.find(r => r.id === currentUser?.roleId)?.name || currentUser?.role || 'PMO Vendor'} disabled className="w-full px-5 py-3.5 border rounded-2xl outline-none cursor-not-allowed font-medium bg-slate-100 border-slate-200 text-slate-500" />
                                            </div>
                                            <div className="flex justify-end pt-4"><button type="submit" className="px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md active:scale-[0.98] transition-all cursor-pointer">Simpan Profil</button></div>
                                        </form>
                                    )}
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

                <main className="flex-1 overflow-y-auto px-4 lg:px-8 pt-2 pb-6 w-full flex flex-col justify-between" onClick={() => { setShowNotif(false); setShowSettings(false); }}>
                    <div className="max-w-7xl mx-auto w-full flex-1 pb-8">
                        {renderView()}
                    </div>

                    {/* Footer System Rasmi MY-PMO */}
                    <footer className="max-w-7xl mx-auto w-full border-t border-slate-200/80 pt-6 pb-4 mt-auto text-slate-500 text-xs">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center space-x-3 text-center sm:text-left">
                                <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                                    <Shield className="w-4 h-4 text-white" />
                                </div>
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