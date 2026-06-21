'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiSearch, FiShield, FiTrash2, FiUserCheck, FiUserX,
    FiChevronLeft, FiChevronRight, FiAlertTriangle
} from 'react-icons/fi';
import api from '@/lib/api';

interface AdminUser {
    _id: string; name: string; email: string; avatar?: string;
    role: 'user' | 'admin'; isActive: boolean; createdAt: string;
}
interface Pagination { total: number; page: number; pages: number; limit: number; }

function ConfirmModal({ title, message, confirmText, danger, onConfirm, onCancel }: any) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
            onClick={onCancel}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '28px', maxWidth: 420, width: '100%', boxShadow: '0 25px 80px rgba(0,0,0,0.6)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: danger ? 'rgba(239,68,68,0.15)' : 'rgba(124,58,237,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FiAlertTriangle size={18} color={danger ? '#EF4444' : '#7C3AED'} />
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{title}</h3>
                </div>
                <p style={{ color: '#A1A1AA', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 24 }}>{message}</p>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                    <button onClick={onCancel} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#A1A1AA', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer' }}>Cancel</button>
                    <button onClick={onConfirm} style={{ padding: '10px 20px', background: danger ? 'rgba(239,68,68,0.2)' : 'rgba(124,58,237,0.2)', border: `1px solid ${danger ? 'rgba(239,68,68,0.4)' : 'rgba(124,58,237,0.4)'}`, borderRadius: 10, color: danger ? '#FCA5A5' : '#A78BFA', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}>{confirmText}</button>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, pages: 1, limit: 20 });
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [confirm, setConfirm] = useState<any>(null);

    const fetchUsers = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const params: any = { page, limit: 20 };
            if (search) params.search = search;
            if (roleFilter) params.role = roleFilter;
            const res = await api.get('/admin/users', { params });
            setUsers(res.data.users);
            setPagination(res.data.pagination);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }, [search, roleFilter]);

    useEffect(() => { fetchUsers(1); }, [fetchUsers]);

    const handleRoleChange = (user: AdminUser) => {
        const newRole = user.role === 'admin' ? 'user' : 'admin';
        setConfirm({
            title: 'Change Role', message: `Change ${user.name}'s role to "${newRole}"?`, confirmText: `Make ${newRole}`, danger: false,
            onConfirm: async () => {
                try { await api.patch(`/admin/users/${user._id}/role`, { role: newRole }); setUsers(prev => prev.map(u => u._id === user._id ? { ...u, role: newRole as any } : u)); } catch (err: any) { alert(err.response?.data?.error || 'Failed'); }
                setConfirm(null);
            },
        });
    };

    const handleSuspend = (user: AdminUser) => {
        setConfirm({
            title: user.isActive ? 'Suspend Account' : 'Reactivate Account',
            message: `${user.isActive ? 'Suspend' : 'Reactivate'} ${user.name}'s account?${user.isActive ? ' They will not be able to log in.' : ''}`,
            confirmText: user.isActive ? 'Suspend' : 'Reactivate', danger: user.isActive,
            onConfirm: async () => {
                try { await api.patch(`/admin/users/${user._id}/suspend`); setUsers(prev => prev.map(u => u._id === user._id ? { ...u, isActive: !u.isActive } : u)); } catch (err: any) { alert(err.response?.data?.error || 'Failed'); }
                setConfirm(null);
            },
        });
    };

    const handleDelete = (user: AdminUser) => {
        setConfirm({
            title: 'Delete User', message: `Permanently delete ${user.name} and ALL their data? This cannot be undone.`, confirmText: 'Delete Forever', danger: true,
            onConfirm: async () => {
                try { await api.delete(`/admin/users/${user._id}`); setUsers(prev => prev.filter(u => u._id !== user._id)); setPagination(prev => ({ ...prev, total: prev.total - 1 })); } catch (err: any) { alert(err.response?.data?.error || 'Failed'); }
                setConfirm(null);
            },
        });
    };

    return (
        <div>
            <AnimatePresence>{confirm && <ConfirmModal {...confirm} onCancel={() => setConfirm(null)} />}</AnimatePresence>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-outfit)', marginBottom: 6 }}>User Management</h1>
                <p style={{ color: '#71717A', fontSize: '0.95rem' }}>{pagination.total} users registered</p>
            </motion.div>

            {/* Search & Filter */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
                    <FiSearch size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#3F3F46' }} />
                    <input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)}
                        style={{ width: '100%', padding: '11px 14px 11px 44px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#fff', outline: 'none', fontSize: '0.9rem', fontFamily: 'var(--font-inter)', boxSizing: 'border-box' }}
                        onFocus={e => { e.target.style.borderColor = 'rgba(124,58,237,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'; }}
                        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }} />
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                    {[{ v: '', l: 'All' }, { v: 'user', l: 'Users' }, { v: 'admin', l: 'Admins' }].map(r => (
                        <button key={r.v} onClick={() => setRoleFilter(r.v)}
                            style={{ padding: '10px 16px', borderRadius: 10, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', background: roleFilter === r.v ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${roleFilter === r.v ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.08)'}`, color: roleFilter === r.v ? '#A78BFA' : '#71717A' }}>
                            {r.l}
                        </button>
                    ))}
                </div>
            </div>

            {/* Users Table */}
            <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 100px 100px 120px 160px', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', gap: 12 }}>
                    {['User', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                        <div key={h} style={{ fontSize: '0.72rem', fontWeight: 700, color: '#3F3F46', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</div>
                    ))}
                </div>

                {loading ? Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} style={{ height: 56, borderBottom: '1px solid rgba(255,255,255,0.03)' }} className="animate-pulse" />
                )) : users.length === 0 ? (
                    <div style={{ padding: 40, textAlign: 'center', color: '#3F3F46' }}>No users found</div>
                ) : users.map(user => (
                    <div key={user._id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 100px 100px 120px 160px', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.03)', alignItems: 'center', gap: 12, transition: 'background 0.1s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: user.avatar ? `url(${user.avatar}) center/cover` : 'linear-gradient(135deg, #7C3AED, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>
                                {!user.avatar && user.name?.charAt(0).toUpperCase()}
                            </div>
                            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</span>
                        </div>
                        <div style={{ fontSize: '0.82rem', color: '#71717A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                        <div><span style={{ padding: '3px 8px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', background: user.role === 'admin' ? 'rgba(220,38,38,0.15)' : 'rgba(124,58,237,0.1)', border: `1px solid ${user.role === 'admin' ? 'rgba(220,38,38,0.3)' : 'rgba(124,58,237,0.2)'}`, color: user.role === 'admin' ? '#EF4444' : '#A78BFA' }}>{user.role}</span></div>
                        <div><span style={{ padding: '3px 8px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700, background: user.isActive ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', border: `1px solid ${user.isActive ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`, color: user.isActive ? '#10B981' : '#F59E0B' }}>{user.isActive ? 'Active' : 'Suspended'}</span></div>
                        <div style={{ fontSize: '0.8rem', color: '#52525B' }}>{new Date(user.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                        <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => handleRoleChange(user)} title={user.role === 'admin' ? 'Demote' : 'Promote'}
                                style={{ padding: '6px 8px', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 6, color: '#A78BFA', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><FiShield size={13} /></button>
                            <button onClick={() => handleSuspend(user)} title={user.isActive ? 'Suspend' : 'Reactivate'}
                                style={{ padding: '6px 8px', background: user.isActive ? 'rgba(245,158,11,0.08)' : 'rgba(16,185,129,0.08)', border: `1px solid ${user.isActive ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)'}`, borderRadius: 6, color: user.isActive ? '#F59E0B' : '#10B981', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                {user.isActive ? <FiUserX size={13} /> : <FiUserCheck size={13} />}
                            </button>
                            <button onClick={() => handleDelete(user)} title="Delete"
                                style={{ padding: '6px 8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><FiTrash2 size={13} /></button>
                        </div>
                    </div>
                ))}
            </div>

            {pagination.pages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 20 }}>
                    <button onClick={() => fetchUsers(pagination.page - 1)} disabled={pagination.page <= 1}
                        style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#71717A', cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', opacity: pagination.page <= 1 ? 0.4 : 1 }}><FiChevronLeft size={16} /></button>
                    <span style={{ fontSize: '0.85rem', color: '#71717A' }}>Page {pagination.page} of {pagination.pages}</span>
                    <button onClick={() => fetchUsers(pagination.page + 1)} disabled={pagination.page >= pagination.pages}
                        style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#71717A', cursor: pagination.page >= pagination.pages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', opacity: pagination.page >= pagination.pages ? 0.4 : 1 }}><FiChevronRight size={16} /></button>
                </div>
            )}
        </div>
    );
}
