import React, { useState, useEffect } from 'react';
import {
    Filter, UserPlus, Users, ShieldCheck,
    Key, Edit, Trash2, Lock
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { MOCK_ROLES, TEAM_MEMBERS } from '../services/mockData';

export const UsersPage = ({ showToastNotification }) => {
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/My-PMO/api/modules/users.php');
            const data = await res.json();
            if (data.status === 'success') {
                const mappedData = data.data.map(u => ({
                    ...u,
                    roleId: u.role, // Map 'role' dari DB ke 'roleId'
                    avatar: u.avatar || u.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                }));
                setUsers(mappedData);
            }
        } catch (err) {
            console.error("Ralat memuat turun pengguna:", err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [viewRoleUsers, setViewRoleUsers] = useState(null);

    const [filterRole, setFilterRole] = useState('Semua');
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordUser, setPasswordUser] = useState(null);

    const filteredUsers = filterRole === 'Semua' ? users : users.filter(u => u.roleId === filterRole);

    const getRoleStyle = (roleId) => {
        const role = MOCK_ROLES.find(r => r.id === roleId);
        return role ? role.color : 'bg-slate-100 text-slate-700 border-slate-200';
    };

    const getRoleName = (roleId) => {
        const role = MOCK_ROLES.find(r => r.id === roleId);
        return role ? role.name : roleId;
    };

    const handleSaveUser = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        try {
            if (editingUser) {
                const bodyObj = {
                    id: editingUser.id,
                    name: formData.get('name'),
                    email: formData.get('email'),
                    role: formData.get('role'),
                    agency: formData.get('agency'),
                    status: formData.get('status')
                };
                const pwd = formData.get('password');
                if (pwd) bodyObj.password = pwd;

                await fetch('/My-PMO/api/modules/users.php', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bodyObj)
                });
            } else {
                await fetch('/My-PMO/api/modules/users.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formData.get('name'),
                        email: formData.get('email'),
                        role: formData.get('role'),
                        agency: formData.get('agency'),
                        status: formData.get('status'),
                        password: formData.get('password') || 'password123'
                    })
                });
            }
            fetchUsers();
            setIsUserModalOpen(false);
            if (showToastNotification) showToastNotification('Maklumat pengguna berjaya disimpan.');
        } catch (err) {
            console.error("Ralat menyimpan pengguna:", err);
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            await fetch('/My-PMO/api/modules/users.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            fetchUsers();
        } catch (err) {
            console.error("Ralat memadam pengguna:", err);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newPassword = formData.get('newPassword');
        const confirmPassword = formData.get('confirmPassword');

        if (!newPassword || newPassword !== confirmPassword) {
            alert('Kata laluan tidak sepadan! Sila pastikan kedua-dua medan kata laluan adalah sama.');
            return;
        }

        try {
            const res = await fetch('/My-PMO/api/modules/users.php', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: passwordUser.id,
                    password: newPassword
                })
            });
            const data = await res.json();
            if (data.status === 'success') {
                if (showToastNotification) showToastNotification('Kata laluan pengguna berjaya dikemas kini!');
                fetchUsers();
                setIsPasswordModalOpen(false);
                setPasswordUser(null);
            } else {
                alert('Gagal mengemaskini kata laluan: ' + data.message);
            }
        } catch (err) {
            console.error("Ralat kemaskini kata laluan:", err);
            alert('Ralat semasa menghubungi pelayan.');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">

            {isPasswordModalOpen && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsPasswordModalOpen(false)}></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-[32px]">
                                <div>
                                    <h2 className="text-xl font-extrabold text-slate-900">Ubah Kata Laluan</h2>
                                    <p className="text-sm font-semibold text-slate-500 mt-1">Pengguna: <span className="font-bold text-slate-700">{passwordUser?.name}</span></p>
                                </div>
                                <button onClick={() => setIsPasswordModalOpen(false)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200 hover:text-slate-900">&times;</button>
                            </div>
                            <form onSubmit={handleUpdatePassword} className="p-8 space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Kata Laluan Baharu</label>
                                    <input name="newPassword" required type="password" placeholder="Masukkan kata laluan baharu" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-amber-50 focus:border-amber-400 outline-none transition-all font-medium" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Sahkan Kata Laluan</label>
                                    <input name="confirmPassword" required type="password" placeholder="Sahkan kata laluan" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-amber-50 focus:border-amber-400 outline-none transition-all font-medium" />
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button type="submit" className="w-full px-6 py-4 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 shadow-md transition-all active:scale-[0.98]">
                                        Simpan Kata Laluan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {isUserModalOpen && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsUserModalOpen(false)}></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-xl animate-in zoom-in-95 duration-200">
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-[32px]">
                                <h2 className="text-xl font-extrabold text-slate-900">{editingUser ? 'Kemaskini Pengguna' : 'Tambah Pengguna Baru'}</h2>
                                <button onClick={() => setIsUserModalOpen(false)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200">&times;</button>
                            </div>
                            <form onSubmit={handleSaveUser} className="p-8 space-y-5">
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Nama Penuh</label>
                                        <input name="name" defaultValue={editingUser?.name || ''} required type="text" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">E-mel Rasmi</label>
                                        <input name="email" defaultValue={editingUser?.email || ''} required type="email" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Kata Laluan {editingUser ? <span className="text-slate-400 font-normal text-xs">(Biarkan kosong jika tidak mahu ubah)</span> : <span className="text-rose-500">*</span>}</label>
                                    <input name="password" required={!editingUser} type="password" placeholder={editingUser ? "Kata laluan baharu (pilihan)..." : "Masukkan kata laluan log masuk..."} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Agensi / Kementerian / Syarikat</label>
                                    <input name="agency" defaultValue={editingUser?.agency || ''} required type="text" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium" />
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Peranan (Role)</label>
                                        <select name="role" defaultValue={editingUser?.roleId || 'pmo_gov'} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium">
                                            {MOCK_ROLES.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
                                        <select name="status" defaultValue={editingUser?.status || 'Aktif'} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium">
                                            <option value="Aktif">Aktif</option>
                                            <option value="Tidak Aktif">Tidak Aktif</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4"><button type="submit" className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">Simpan Pengguna</button></div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {viewRoleUsers && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setViewRoleUsers(null)}></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200">
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-[32px]">
                                <div>
                                    <h2 className="text-xl font-extrabold text-slate-900">Senarai Pengguna</h2>
                                    <p className="text-sm font-semibold text-slate-500 mt-1">Peranan: {getRoleName(viewRoleUsers)}</p>
                                </div>
                                <button onClick={() => setViewRoleUsers(null)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200">&times;</button>
                            </div>
                            <div className="p-4 max-h-96 overflow-y-auto">
                                {users.filter(u => u.roleId === viewRoleUsers).length > 0 ? (
                                    <div className="divide-y divide-slate-100">
                                        {users.filter(u => u.roleId === viewRoleUsers).map(u => (
                                            <div key={u.id} className="p-4 flex items-center space-x-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">{u.avatar}</div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{u.name}</p>
                                                    <p className="text-sm text-slate-500">{u.agency} • {u.email}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-slate-400 py-8 font-medium">Tiada pengguna diberikan peranan ini.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Pasukan & Peranan</h1>
                    <p className="text-slate-500 mt-1 text-lg">Urus akses pengguna, tugasan agensi, dan kebenaran sistem.</p>
                </div>
                <div className="flex space-x-3">
                    <div className="relative">
                        <button onClick={() => setShowFilterMenu(!showFilterMenu)} className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 flex items-center shadow-sm transition-colors">
                            <Filter className="w-4 h-4 mr-2" /> Tapis {filterRole !== 'Semua' && <span className="ml-2 bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[10px]">{getRoleName(filterRole)}</span>}
                        </button>
                        {showFilterMenu && (
                            <div className="absolute top-full mt-2 left-0 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 py-2 animate-in fade-in zoom-in-95">
                                <p className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tapis Peranan</p>
                                <button onClick={() => { setFilterRole('Semua'); setShowFilterMenu(false); }} className={`w-full text-left px-4 py-2 text-sm font-semibold hover:bg-slate-50 ${filterRole === 'Semua' ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-700'}`}>Semua Peranan</button>
                                {MOCK_ROLES.map(r => (
                                    <button key={r.id} onClick={() => { setFilterRole(r.id); setShowFilterMenu(false); }} className={`w-full text-left px-4 py-2 text-sm font-semibold hover:bg-slate-50 ${filterRole === r.id ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-700'}`}>
                                        {r.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button onClick={() => { setEditingUser(null); setIsUserModalOpen(true); }} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-800 flex items-center text-sm shadow-md transition-all active:scale-[0.98]">
                        <UserPlus className="w-4 h-4 mr-2" /> Tambah Pengguna
                    </button>
                </div>
            </div>

            <div className="border-b border-slate-200 flex space-x-8">
                <button onClick={() => setActiveTab('users')} className={`pb-4 text-sm font-bold border-b-2 transition-colors flex items-center ${activeTab === 'users' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-700'}`}>
                    <Users className="w-4 h-4 mr-2" /> Direktori Pengguna
                </button>
                <button onClick={() => setActiveTab('roles')} className={`pb-4 text-sm font-bold border-b-2 transition-colors flex items-center ${activeTab === 'roles' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-700'}`}>
                    <ShieldCheck className="w-4 h-4 mr-2" /> Kebenaran Peranan (Roles)
                </button>
            </div>

            {activeTab === 'users' ? (
                <Card noPadding className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Pengguna</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Agensi</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Peranan</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Tindakan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/80">
                            {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-8 py-5 flex items-center space-x-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-extrabold shadow-sm">
                                            {user.avatar}
                                        </div>
                                        <div>
                                            <div className="font-extrabold text-slate-900 text-sm">{user.name}</div>
                                            <div className="text-slate-500 font-medium text-xs mt-1">{user.email}</div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-slate-700 font-bold text-sm">{user.agency}</td>
                                    <td className="px-8 py-5">
                                        <span className={`px-3 py-1.5 text-xs font-bold rounded-full border ${getRoleStyle(user.roleId)}`}>
                                            {getRoleName(user.roleId)}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <Badge text={user.status} type={user.status === 'Aktif' ? 'Baik' : 'default'} />
                                    </td>
                                    <td className="px-8 py-5 text-right space-x-2 whitespace-nowrap">
                                        <button onClick={() => { setPasswordUser(user); setIsPasswordModalOpen(true); }} title="Ubah Kata Laluan" className="p-2 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 border border-slate-200 bg-white rounded-xl text-slate-400 transition-colors shadow-sm"><Key className="w-4 h-4" /></button>
                                        <button onClick={() => { setEditingUser(user); setIsUserModalOpen(true); }} title="Kemaskini Pengguna" className="p-2 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 border border-slate-200 bg-white rounded-xl text-slate-400 transition-colors shadow-sm"><Edit className="w-4 h-4" /></button>
                                        <button onClick={() => handleDeleteUser(user.id)} title="Padam Pengguna" className="p-2 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 border border-slate-200 bg-white rounded-xl text-slate-400 transition-colors shadow-sm"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="5" className="px-8 py-10 text-center text-slate-500 font-medium">Tiada rekod pengguna untuk saringan ini.</td></tr>
                            )}
                        </tbody>
                    </table>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MOCK_ROLES.map((role) => (
                        <Card key={role.id} className="flex flex-col h-full hover:border-slate-300 hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="font-extrabold text-slate-900 text-xl">{role.name}</h3>
                                <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400 border border-slate-100">
                                    {role.id === 'superadmin' ? <ShieldCheck className="w-5 h-5 text-indigo-600" /> : <Lock className="w-5 h-5" />}
                                </div>
                            </div>
                            <div className="mb-6">
                                <p className="text-[10px] text-slate-400 uppercase font-extrabold tracking-widest mb-2">Skop Akses</p>
                                <span className={`px-3 py-1 text-xs font-bold rounded-md border ${role.color}`}>
                                    {role.scope}
                                </span>
                            </div>
                            <div className="flex-1 bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                <p className="text-sm text-slate-700 font-semibold leading-relaxed">
                                    {role.access}
                                </p>
                            </div>
                            <button onClick={() => setViewRoleUsers(role.id)} className="mt-6 w-full py-3 text-sm text-slate-900 font-bold hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors">
                                Lihat Pengguna
                            </button>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
