'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { FiZap, FiCode, FiMessageSquare, FiCpu, FiEdit3, FiGithub, FiAward } from 'react-icons/fi';

const stats = [
    { label: 'Projects', value: '12', icon: FiCode, color: '#7C3AED' },
    { label: 'AI Prompts', value: '540', icon: FiZap, color: '#06B6D4' },
    { label: 'Chats', value: '48', icon: FiMessageSquare, color: '#10B981' },
    { label: 'Tools Used', value: '6', icon: FiCpu, color: '#F59E0B' },
];

const recentActivity = [
    { icon: FiCode, label: 'Generated React dashboard component', time: '2h ago', color: '#7C3AED' },
    { icon: FiCpu, label: 'Fixed TypeScript compilation error', time: '5h ago', color: '#06B6D4' },
    { icon: FiMessageSquare, label: 'Explained REST API design patterns', time: 'Yesterday', color: '#10B981' },
    { icon: FiEdit3, label: 'Generated API documentation', time: '2 days ago', color: '#F59E0B' },
];

export default function ProfilePage() {
    const { user } = useAuth();

    return (
        <div style={{ padding: '32px 36px', maxWidth: 900, margin: '0 auto' }}>

            {/* Profile Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: '32px', marginBottom: 24, position: 'relative', overflow: 'hidden' }}
            >
                <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, position: 'relative', zIndex: 1 }}>
                    {/* Avatar */}
                    <motion.div
                        animate={{ boxShadow: ['0 0 0px rgba(124,58,237,0)', '0 0 25px rgba(124,58,237,0.4)', '0 0 0px rgba(124,58,237,0)'] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                        style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 900, color: '#fff', flexShrink: 0 }}
                    >
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </motion.div>

                    {/* Info */}
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', fontFamily: 'var(--font-outfit)' }}>
                                {user?.name || 'Developer'}
                            </h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 10px', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 100, fontSize: '0.7rem', fontWeight: 700, color: '#A78BFA' }}>
                                <FiAward size={10} /> Free Plan
                            </div>
                        </div>
                        <p style={{ color: '#71717A', fontSize: '0.9rem', marginBottom: 6 }}>{user?.email || 'developer@email.com'}</p>
                        <p style={{ color: '#A1A1AA', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <FiCode size={13} color="#7C3AED" /> Full Stack Developer
                        </p>
                    </div>

                    <Link href="/settings?tab=account" style={{ textDecoration: 'none' }}>
                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(6,182,212,0.08))', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 10, color: '#A78BFA', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #7C3AED, #06B6D4)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'transparent'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(6,182,212,0.08))'; e.currentTarget.style.color = '#A78BFA'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'; }}>
                            <FiEdit3 size={14} />
                            Edit Profile
                        </motion.button>
                    </Link>
                </div>
            </motion.div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
                {stats.map((s, i) => (
                    <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '20px', textAlign: 'center' }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}18`, border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                            <s.icon size={16} color={s.color} />
                        </div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', fontFamily: 'var(--font-outfit)' }}>{s.value}</div>
                        <div style={{ fontSize: '0.78rem', color: '#71717A', fontWeight: 500 }}>{s.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Recent Activity */}
            <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '24px' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: 18 }}>Recent Activity</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {recentActivity.map((a, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                            style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.04)' }}>
                            <div style={{ width: 34, height: 34, borderRadius: 9, background: `${a.color}15`, border: `1px solid ${a.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <a.icon size={15} color={a.color} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.88rem', color: '#E4E4E7', fontWeight: 500 }}>{a.label}</div>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#3F3F46' }}>{a.time}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
