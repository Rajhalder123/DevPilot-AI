'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiShield, FiHome, FiUsers, FiDatabase, FiLogOut, FiZap } from 'react-icons/fi';
import { useAuth } from '@/lib/auth';

const adminNavItems = [
    { href: '/dashboard', icon: FiHome, label: 'Overview' },
    { href: '/dashboard/users', icon: FiUsers, label: 'Users' },
    { href: '/dashboard/content', icon: FiDatabase, label: 'Content' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (loading) return;
        if (!user) { router.push('/login'); return; }
        if (user.role !== 'admin') { router.push('/login'); return; }
        setChecked(true);
    }, [user, loading, router]);

    if (loading || !checked) {
        return (
            <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{ width: 32, height: 32, border: '3px solid rgba(124,58,237,0.2)', borderTopColor: '#7C3AED', borderRadius: '50%' }} />
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#050505', fontFamily: 'var(--font-inter)' }}>
            {/* Admin Top Bar */}
            <div style={{
                position: 'sticky', top: 0, zIndex: 100,
                background: 'rgba(5,5,5,0.85)', backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(124,58,237,0.15)',
                padding: '0 32px',
            }}>
                <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, #7C3AED, #DC2626)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FiShield size={14} color="#fff" />
                            </div>
                            <span style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-outfit)' }}>
                                DevPilot <span style={{ background: 'linear-gradient(90deg, #7C3AED, #DC2626)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Admin</span>
                            </span>
                        </div>

                        <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.08)' }} />

                        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            {adminNavItems.map(item => {
                                const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                                return (
                                    <Link key={item.href} href={item.href} style={{
                                        textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6,
                                        padding: '8px 14px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600,
                                        color: active ? '#fff' : '#71717A',
                                        background: active ? 'rgba(124,58,237,0.15)' : 'transparent',
                                        border: active ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent',
                                        transition: 'all 0.2s',
                                    }}
                                        onMouseEnter={e => { if (!active) { e.currentTarget.style.color = '#A78BFA'; e.currentTarget.style.background = 'rgba(124,58,237,0.08)'; } }}
                                        onMouseLeave={e => { if (!active) { e.currentTarget.style.color = '#71717A'; e.currentTarget.style.background = 'transparent'; } }}>
                                        <item.icon size={14} />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ padding: '4px 12px', borderRadius: 6, background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.25)' }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin</span>
                        </div>
                        <span style={{ fontSize: '0.85rem', color: '#A1A1AA', fontWeight: 500 }}>{user?.name}</span>
                        <button onClick={() => { logout(); router.push('/login'); }}
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '6px 10px', color: '#71717A', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', fontWeight: 600 }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = '#71717A'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
                            <FiLogOut size={14} /> Logout
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px' }}>
                {children}
            </div>
        </div>
    );
}
