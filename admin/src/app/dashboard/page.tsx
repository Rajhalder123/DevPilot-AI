'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    FiUsers, FiFileText, FiMessageSquare, FiCpu, FiShield,
    FiTrendingUp, FiArrowRight, FiGithub,
    FiUserCheck, FiActivity
} from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '@/lib/api';

interface Stats {
    totalUsers: number; adminCount: number; newUsersWeek: number; newUsersMonth: number;
    totalResumes: number; totalInterviews: number; totalConversations: number;
    totalGithubProjects: number; totalJobMatches: number; activeUsers: number; suspendedUsers: number;
}
interface GrowthPoint { date: string; count: number; }
interface RecentUser { _id: string; name: string; email: string; avatar?: string; role: string; isActive: boolean; createdAt: string; }

const StatCard = ({ icon: Icon, label, value, color, delay }: any) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: delay * 0.05 }}
        style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}15`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={20} color={color} />
            </div>
            <FiTrendingUp size={14} color="#3F3F46" />
        </div>
        <div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', letterSpacing: '-1px', fontFamily: 'var(--font-outfit)' }}>{value ?? '—'}</div>
            <div style={{ fontSize: '0.82rem', color: '#71717A', fontWeight: 500, marginTop: 2 }}>{label}</div>
        </div>
    </motion.div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: '#1A1A1A', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 10, padding: '10px 14px', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>
            <div style={{ fontSize: '0.75rem', color: '#71717A', marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#A78BFA' }}>{payload[0].value} new users</div>
        </div>
    );
};

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [growth, setGrowth] = useState<GrowthPoint[]>([]);
    const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, growthRes, usersRes] = await Promise.all([
                    api.get('/admin/stats'),
                    api.get('/admin/analytics/growth?days=30'),
                    api.get('/admin/users?limit=8'),
                ]);
                setStats(statsRes.data);
                setGrowth(growthRes.data.growth);
                setRecentUsers(usersRes.data.users);
            } catch (err) { console.error('Failed to load admin data', err); }
            finally { setLoading(false); }
        };
        fetchData();
    }, []);

    const statCards = stats ? [
        { icon: FiUsers, label: 'Total Users', value: stats.totalUsers, color: '#7C3AED' },
        { icon: FiUserCheck, label: 'Active Users', value: stats.activeUsers, color: '#10B981' },
        { icon: FiTrendingUp, label: 'New This Week', value: stats.newUsersWeek, color: '#06B6D4' },
        { icon: FiShield, label: 'Admins', value: stats.adminCount, color: '#EF4444' },
        { icon: FiFileText, label: 'Total Resumes', value: stats.totalResumes, color: '#F59E0B' },
        { icon: FiCpu, label: 'Interviews', value: stats.totalInterviews, color: '#EC4899' },
        { icon: FiMessageSquare, label: 'AI Conversations', value: stats.totalConversations, color: '#8B5CF6' },
        { icon: FiGithub, label: 'GitHub Projects', value: stats.totalGithubProjects, color: '#fff' },
    ] : [];

    return (
        <div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-outfit)', marginBottom: 6 }}>Admin Dashboard</h1>
                <p style={{ color: '#71717A', fontSize: '0.95rem' }}>Monitor your platform at a glance</p>
            </motion.div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
                {loading ? Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} style={{ height: 130, background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16 }} className="animate-pulse" />
                )) : statCards.map((card, i) => <StatCard key={i} {...card} delay={i} />)}
            </div>

            {/* Growth Chart + Recent Users */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: 4 }}>User Growth</h3>
                            <p style={{ fontSize: '0.8rem', color: '#71717A' }}>New signups — last 30 days</p>
                        </div>
                        <FiActivity size={18} color="#7C3AED" />
                    </div>
                    <div style={{ width: '100%', height: 250 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={growth}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#3F3F46' }} axisLine={false} tickLine={false}
                                    tickFormatter={(v: string) => new Date(v).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                                    interval={Math.max(0, Math.floor(growth.length / 6) - 1)} />
                                <YAxis tick={{ fontSize: 10, fill: '#3F3F46' }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="count" stroke="#7C3AED" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: 4 }}>Recent Users</h3>
                            <p style={{ fontSize: '0.8rem', color: '#71717A' }}>Latest signups</p>
                        </div>
                        <Link href="/dashboard/users" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.82rem', color: '#7C3AED', fontWeight: 600 }}>
                            View all <FiArrowRight size={12} />
                        </Link>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {recentUsers.map(u => (
                            <div key={u._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, transition: 'background 0.15s', cursor: 'pointer' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                <div style={{ width: 36, height: 36, borderRadius: 10, background: u.avatar ? `url(${u.avatar}) center/cover` : 'linear-gradient(135deg, #7C3AED, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                                    {!u.avatar && u.name?.charAt(0).toUpperCase()}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</span>
                                        {u.role === 'admin' && <span style={{ padding: '1px 6px', borderRadius: 4, background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', fontSize: '0.65rem', fontWeight: 700, color: '#EF4444', textTransform: 'uppercase' }}>Admin</span>}
                                        {!u.isActive && <span style={{ padding: '1px 6px', borderRadius: 4, background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', fontSize: '0.65rem', fontWeight: 700, color: '#F59E0B', textTransform: 'uppercase' }}>Suspended</span>}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#52525B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</div>
                                </div>
                                <div style={{ fontSize: '0.72rem', color: '#3F3F46', whiteSpace: 'nowrap' }}>
                                    {new Date(u.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
