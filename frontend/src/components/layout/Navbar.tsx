'use client';

import { useState, useRef, useEffect } from 'react';
import { FiSearch, FiMenu, FiBell, FiZap, FiSun, FiMoon, FiUser, FiSettings, FiCreditCard, FiLogOut, FiCheck, FiInfo, FiX } from 'react-icons/fi';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface NavbarProps { onMenuClick?: () => void; }

export default function Navbar({ onMenuClick }: NavbarProps) {
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const [query, setQuery] = useState('');
    const [notifOpen, setNotifOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, title: "New Match!", desc: "A Full-Stack role at Vercel matches your skills.", time: "2m ago", icon: FiCheck, color: "var(--success)", read: false },
        { id: 2, title: "AI Insight", desc: "Your Resume Score improved by 12% today.", time: "1h ago", icon: FiZap, color: "var(--primary)", read: false },
        { id: 3, title: "System Update", desc: "DevPilot AI v1.2 is now live with RAG support.", time: "4h ago", icon: FiInfo, color: "var(--d-muted)", read: false }
    ]);

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const removeNotif = (id: number) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <header style={{
            height: 66, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 28px', position: 'sticky', top: 0, zIndex: 990,
            background: 'var(--d-nav)', borderBottom: '1px solid var(--d-nav-border)',
            transition: 'background 0.3s ease, border-color 0.3s ease',
        }}>
            {/* Menu Button */}
            <button onClick={onMenuClick} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 8, color: 'var(--d-sub)', borderRadius: 8, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--d-text)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--d-sub)')}>
                <FiMenu size={22} />
            </button>

            {/* Search */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '0 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--d-card)', border: '1px solid var(--d-border)', borderRadius: 8, padding: '8px 14px', width: '100%', maxWidth: 480, transition: 'all 0.3s' }}>
                    <FiSearch size={15} color="var(--d-muted)" />
                    <input type="text" value={query} onChange={e => setQuery(e.target.value)}
                        placeholder="Search jobs, skills, companies..."
                        style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--d-text)', fontSize: '0.85rem', fontFamily: 'inherit', width: '100%' }} />
                    <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                        {['⌘','K'].map(k => <span key={k} style={{ background: 'var(--d-tag-bg)', color: 'var(--d-muted)', fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px', borderRadius: 4 }}>{k}</span>)}
                    </div>
                </div>
            </div>

            {/* Right Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                {/* Ask AI */}
                <button style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--d-accent)', border: '1px solid var(--d-border)', color: 'var(--d-accent-text)', padding: '7px 14px', borderRadius: 8, fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                    <FiZap size={13} /> Ask DevPilot AI
                </button>

                {/* Theme Toggle */}
                <button onClick={toggleTheme} title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    style={{ background: 'var(--d-card)', border: '1px solid var(--d-border)', borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--d-sub)', transition: 'all 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--d-text)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--d-sub)')}>
                    {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
                </button>

                {/* Notifications */}
                <div style={{ position: 'relative' }}>
                    <button 
                        onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                        style={{ 
                            background: notifOpen ? 'var(--d-hover)' : 'none', 
                            border: 'none', 
                            cursor: 'pointer', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            color: notifOpen ? 'var(--d-text)' : 'var(--d-sub)', 
                            position: 'relative',
                            width: 36,
                            height: 36,
                            borderRadius: 8,
                            transition: 'all 0.2s'
                        }}
                    >
                        <FiBell size={20} style={{ filter: notifOpen ? 'drop-shadow(0 0 5px var(--primary))' : 'none' }} />
                        {unreadCount > 0 && (
                            <span style={{ position: 'absolute', top: 2, right: 2, background: '#ec4899', color: '#fff', fontSize: '0.58rem', fontWeight: 800, width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '2px solid var(--d-nav)' }}>
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    <AnimatePresence>
                        {notifOpen && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                                animate={{ opacity: 1, y: 0, scale: 1 }} 
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                style={{ position: 'absolute', top: 40, right: 0, width: 320, background: 'var(--d-card)', border: '1px solid var(--d-border)', borderRadius: 16, boxShadow: '0 10px 40px rgba(0,0,0,0.3)', padding: '16px', zIndex: 1000 }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                    <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: 'var(--d-text)' }}>Notifications</h4>
                                    {unreadCount > 0 && (
                                        <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}>Mark all read</button>
                                    )}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 400, overflowY: 'auto' }} className="hide-scrollbar">
                                    {notifications.length === 0 ? (
                                        <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--d-muted)', fontSize: '0.8rem' }}>No new notifications</div>
                                    ) : (
                                        notifications.map((n) => (
                                            <div key={n.id} style={{ padding: 12, borderRadius: 12, background: n.read ? 'transparent' : 'var(--d-hover)', border: '1px solid var(--d-border)', display: 'flex', gap: 12, position: 'relative', transition: 'all 0.2s' }}>
                                                <div style={{ width: 32, height: 32, borderRadius: 10, background: n.color + '15', color: n.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                    <n.icon size={16} />
                                                </div>
                                                <div style={{ flex: 1, paddingRight: 20 }}>
                                                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--d-text)', marginBottom: 2 }}>{n.title}</div>
                                                    <div style={{ fontSize: '0.7rem', color: 'var(--d-sub)', lineHeight: 1.4 }}>{n.desc}</div>
                                                    <div style={{ fontSize: '0.6rem', color: 'var(--d-muted)', marginTop: 6, fontWeight: 600 }}>{n.time}</div>
                                                </div>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); removeNotif(n.id); }}
                                                    style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--d-muted)', padding: 4 }}
                                                >
                                                    <FiX size={12} />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Profile */}
                <div style={{ position: 'relative' }}>
                    <button 
                        onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                        style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '4px 8px', borderRadius: 12, transition: 'background 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--d-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 800, color: '#fff', overflow: 'hidden', border: '2px solid var(--d-border)' }}>
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="hidden lg:block">
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--d-text)', lineHeight: 1.2 }}>{user?.name || 'User'}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--d-muted)', fontWeight: 600 }}>Pro Account</div>
                        </div>
                    </button>

                    <AnimatePresence>
                        {profileOpen && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                                animate={{ opacity: 1, y: 0, scale: 1 }} 
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                style={{ position: 'absolute', top: 50, right: 0, width: 220, background: 'var(--d-card)', border: '1px solid var(--d-border)', borderRadius: 16, boxShadow: '0 10px 40px rgba(0,0,0,0.3)', padding: '8px', zIndex: 1000 }}
                            >
                                <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--d-border)', marginBottom: 6 }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--d-text)' }}>{user?.email}</div>
                                    <div style={{ fontSize: '0.6rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginTop: 2 }}>Premium Membership</div>
                                </div>
                                
                                {[
                                    { label: 'My Profile', icon: FiUser, href: '/dashboard/settings' },
                                    { label: 'Settings', icon: FiSettings, href: '/dashboard/settings' },
                                    { label: 'Billing', icon: FiCreditCard, href: '/dashboard/subscription' },
                                ].map((item, i) => (
                                    <Link key={i} href={item.href} onClick={() => setProfileOpen(false)}>
                                        <div style={{ padding: '10px 12px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', transition: 'all 0.2s' }}
                                            className="hover:bg-white/5"
                                            onMouseEnter={e => e.currentTarget.style.background = 'var(--d-hover)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                                            <item.icon size={15} color="var(--d-sub)" />
                                            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--d-text)' }}>{item.label}</span>
                                        </div>
                                    </Link>
                                ))}
                                
                                <div style={{ height: 1, background: 'var(--d-border)', margin: '6px 0' }} />
                                
                                <div 
                                    onClick={logout}
                                    style={{ padding: '10px 12px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', color: '#ef4444' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                >
                                    <FiLogOut size={15} />
                                    <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>Log Out</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}
