'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiUser, FiShield, FiKey, FiMonitor, FiSave, FiCheck,
    FiCopy, FiEye, FiEyeOff, FiRefreshCw, FiTrash2, FiPlus,
    FiMoon, FiSun, FiZap, FiGlobe, FiMapPin, FiMail
} from 'react-icons/fi';
import { useAuth } from '@/lib/auth';
import api from '@/lib/api';

// ── Theme definitions ────────────────────────────────────────────────────────
const THEMES = [
    {
        id: 'dark-void',
        name: 'Dark Void',
        desc: 'Deep obsidian — best for focus',
        colors: ['#050505', '#111', '#7C3AED'],
        vars: {
            '--dp-bg': '#050505', '--dp-card': '#111', '--dp-border': 'rgba(255,255,255,0.06)',
            '--dp-text': '#F4F4F5', '--dp-muted': '#71717A', '--dp-purple': '#7C3AED',
            '--dp-cyan': '#06B6D4',
        }
    },
    {
        id: 'midnight-ocean',
        name: 'Midnight Ocean',
        desc: 'Deep calm and immersive',
        colors: ['#020B18', '#071428', '#0EA5E9'],
        vars: {
            '--dp-bg': '#020B18', '--dp-card': '#071428', '--dp-border': 'rgba(14,165,233,0.12)',
            '--dp-text': '#E0F2FE', '--dp-muted': '#64748B', '--dp-purple': '#6366F1',
            '--dp-cyan': '#0EA5E9',
        }
    },
    {
        id: 'forest-dark',
        name: 'Forest Dark',
        desc: 'Natural and focused',
        colors: ['#030D07', '#0A1F10', '#10B981'],
        vars: {
            '--dp-bg': '#030D07', '--dp-card': '#0A1F10', '--dp-border': 'rgba(16,185,129,0.1)',
            '--dp-text': '#D1FAE5', '--dp-muted': '#6B7280', '--dp-purple': '#059669',
            '--dp-cyan': '#34D399',
        }
    },
    {
        id: 'rose-noir',
        name: 'Rose Noir',
        desc: 'Elegant and bold',
        colors: ['#0C0408', '#1A0812', '#F43F5E'],
        vars: {
            '--dp-bg': '#0C0408', '--dp-card': '#1A0812', '--dp-border': 'rgba(244,63,94,0.1)',
            '--dp-text': '#FFE4E6', '--dp-muted': '#6B7280', '--dp-purple': '#F43F5E',
            '--dp-cyan': '#FB7185',
        }
    },
];

// ── API Key item ─────────────────────────────────────────────────────────────
function ApiKeyRow({ label, value, onDelete }: { label: string; value: string; onDelete: () => void }) {
    const [show, setShow] = useState(false);
    const [copied, setCopied] = useState(false);
    const masked = '•'.repeat(24) + value.slice(-6);
    return (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#A78BFA', marginBottom: 4 }}>{label}</div>
                <code style={{ fontSize: '0.78rem', color: '#71717A', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', maxWidth: '100%' }}>
                    {show ? value : masked}
                </code>
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button onClick={() => setShow(s => !s)} style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#71717A', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {show ? <FiEyeOff size={13} /> : <FiEye size={13} />}
                </button>
                <button onClick={() => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                    style={{ width: 32, height: 32, borderRadius: 8, background: copied ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${copied ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.06)'}`, color: copied ? '#10B981' : '#71717A', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {copied ? <FiCheck size={13} /> : <FiCopy size={13} />}
                </button>
                <button onClick={onDelete} style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FiTrash2 size={13} />
                </button>
            </div>
        </div>
    );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function SettingsPage() {
    const { user, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState<'account' | 'security' | 'apikeys' | 'theme'>('account');

    // Account state
    const [name, setName] = useState(user?.name || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [location, setLocation] = useState(user?.location || '');
    const [website, setWebsite] = useState(user?.website || '');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    // Theme state
    const [activeTheme, setActiveTheme] = useState(() =>
        typeof window !== 'undefined' ? (localStorage.getItem('dp-theme') || 'dark-void') : 'dark-void'
    );

    // API Keys state
    const [apiKeys, setApiKeys] = useState([
        { id: '1', label: 'Production Key', value: 'dp_sk_prod_7f3a9c2e1b8d4f6a0e5c9b3d7f1a4e2c' },
        { id: '2', label: 'Development Key', value: 'dp_sk_dev_2b5e8f1a4c7d0e3f6a9b2c5d8e1f4a7b' },
    ]);
    const [generatingKey, setGeneratingKey] = useState(false);
    const [newKeyLabel, setNewKeyLabel] = useState('');
    const [showGenForm, setShowGenForm] = useState(false);

    const tabs = [
        { id: 'account', label: 'Account', icon: FiUser },
        { id: 'security', label: 'Security', icon: FiShield },
        { id: 'apikeys', label: 'API Keys', icon: FiKey },
        { id: 'theme', label: 'Theme', icon: FiMonitor },
    ];

    // Apply theme on change
    useEffect(() => {
        const theme = THEMES.find(t => t.id === activeTheme);
        if (!theme) return;
        const root = document.documentElement;
        Object.entries(theme.vars).forEach(([key, val]) => root.style.setProperty(key, val));
        localStorage.setItem('dp-theme', activeTheme);
    }, [activeTheme]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true); setError('');
        try {
            const res = await api.put('/auth/profile', { name, bio, location, website });
            updateUser(res.data.user);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err: any) {
            const ed = err.response?.data?.error;
            setError(typeof ed === 'string' ? ed : ed?.message || 'Failed to save');
        } finally { setSaving(false); }
    };

    const generateKey = () => {
        if (!newKeyLabel.trim()) return;
        setGeneratingKey(true);
        setTimeout(() => {
            const chars = 'abcdef0123456789';
            const rand = Array.from({ length: 32 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
            setApiKeys(prev => [...prev, { id: Date.now().toString(), label: newKeyLabel.trim(), value: `dp_sk_${rand}` }]);
            setNewKeyLabel('');
            setShowGenForm(false);
            setGeneratingKey(false);
        }, 800);
    };

    return (
        <div style={{ flex: 1, overflowY: 'auto' }} className="dp-page-pad hide-scrollbar">
            <div style={{ maxWidth: 900, margin: '0 auto' }}>

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', fontFamily: 'var(--font-outfit)', marginBottom: 4 }}>
                        Settings
                    </h1>
                    <p style={{ color: '#71717A', fontSize: '0.9rem' }}>Manage your account, security, and preferences.</p>
                </motion.div>

                {/* Layout: sidebar + content */}
                <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }} className="settings-layout">

                    {/* ── Sidebar tabs ── */}
                    <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                        style={{ width: 180, flexShrink: 0, background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '8px', position: 'sticky', top: 80 }}
                        className="settings-sidebar">
                        {tabs.map(tab => {
                            const active = activeTab === tab.id;
                            return (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', marginBottom: 2, transition: 'all 0.15s', textAlign: 'left', background: active ? 'rgba(124,58,237,0.15)' : 'transparent', color: active ? '#A78BFA' : '#71717A', fontWeight: active ? 700 : 500, fontSize: '0.88rem', fontFamily: 'var(--font-inter)' }}>
                                    <tab.icon size={15} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </motion.div>

                    {/* ── Content panel ── */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <AnimatePresence mode="wait">

                            {/* ACCOUNT TAB */}
                            {activeTab === 'account' && (
                                <motion.div key="account" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                                    <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <FiUser size={16} color="#A78BFA" />
                                            </div>
                                            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0 }}>Public Profile</h2>
                                        </div>

                                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                                            {error && <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px', fontSize: '0.85rem', color: '#FCA5A5' }}>{error}</div>}

                                            <div>
                                                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#71717A', textTransform: 'uppercase', marginBottom: 8, display: 'block', letterSpacing: '0.05em' }}>Full Name</label>
                                                <div style={{ position: 'relative' }}>
                                                    <FiUser size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#3F3F46' }} />
                                                    <input value={name} onChange={e => setName(e.target.value)}
                                                        style={{ width: '100%', padding: '12px 14px 12px 40px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                                                        onFocus={e => { e.target.style.borderColor = 'rgba(124,58,237,0.5)'; }} onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }} />
                                                </div>
                                            </div>

                                            <div>
                                                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#71717A', textTransform: 'uppercase', marginBottom: 8, display: 'block', letterSpacing: '0.05em' }}>Bio</label>
                                                <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} placeholder="Describe your expertise..."
                                                    style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff', fontSize: '0.9rem', outline: 'none', resize: 'none', fontFamily: 'var(--font-inter)', boxSizing: 'border-box' }}
                                                    onFocus={e => { e.target.style.borderColor = 'rgba(124,58,237,0.5)'; }} onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }} />
                                            </div>

                                            <div className="dp-grid-2" style={{ gap: 14 }}>
                                                <div>
                                                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#71717A', textTransform: 'uppercase', marginBottom: 8, display: 'block', letterSpacing: '0.05em' }}>Location</label>
                                                    <div style={{ position: 'relative' }}>
                                                        <FiMapPin size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#3F3F46' }} />
                                                        <input value={location} onChange={e => setLocation(e.target.value)} placeholder="City, Country"
                                                            style={{ width: '100%', padding: '12px 14px 12px 40px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                                                            onFocus={e => { e.target.style.borderColor = 'rgba(124,58,237,0.5)'; }} onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#71717A', textTransform: 'uppercase', marginBottom: 8, display: 'block', letterSpacing: '0.05em' }}>Website</label>
                                                    <div style={{ position: 'relative' }}>
                                                        <FiGlobe size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#3F3F46' }} />
                                                        <input value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://..."
                                                            style={{ width: '100%', padding: '12px 14px 12px 40px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                                                            onFocus={e => { e.target.style.borderColor = 'rgba(124,58,237,0.5)'; }} onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }} />
                                                    </div>
                                                </div>
                                            </div>

                                            <motion.button type="submit" disabled={saving}
                                                whileHover={!saving ? { scale: 1.02 } : {}} whileTap={!saving ? { scale: 0.98 } : {}}
                                                style={{ padding: '13px', background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                                {saved ? <><FiCheck size={15} /> Saved!</> : saving ? 'Saving...' : <><FiSave size={15} /> Save Profile</>}
                                            </motion.button>
                                        </form>
                                    </div>

                                    {/* Account Info */}
                                    <div style={{ marginTop: 16, background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
                                        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: 16 }}>Account Details</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <FiMail size={14} color="#71717A" />
                                                <div>
                                                    <div style={{ fontSize: '0.72rem', color: '#3F3F46', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</div>
                                                    <div style={{ fontSize: '0.9rem', color: '#E4E4E7', fontWeight: 600 }}>{user?.email}</div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <FiZap size={14} color={user?.githubUsername ? '#10B981' : '#71717A'} />
                                                <div>
                                                    <div style={{ fontSize: '0.72rem', color: '#3F3F46', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>GitHub</div>
                                                    <div style={{ fontSize: '0.9rem', color: user?.githubUsername ? '#10B981' : '#71717A', fontWeight: 600 }}>
                                                        {user?.githubUsername ? `@${user.githubUsername}` : 'Not connected'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* SECURITY TAB */}
                            {activeTab === 'security' && (
                                <motion.div key="security" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                                    <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <FiShield size={16} color="#8B5CF6" />
                                            </div>
                                            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0 }}>Security</h2>
                                        </div>

                                        {[
                                            { label: 'Email Notifications', desc: 'Get alerts for account activity', on: true },
                                            { label: 'AI Recommendations', desc: 'Personalized learning suggestions', on: true },
                                            { label: 'Two-Factor Auth', desc: 'Extra layer of account security', on: false },
                                            { label: 'Session Alerts', desc: 'Notify on new device login', on: true },
                                        ].map((item, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                                                <div>
                                                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#E4E4E7', marginBottom: 2 }}>{item.label}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#71717A' }}>{item.desc}</div>
                                                </div>
                                                <div style={{ width: 44, height: 24, background: item.on ? 'linear-gradient(135deg, #7C3AED, #06B6D4)' : 'rgba(255,255,255,0.08)', borderRadius: 12, position: 'relative', cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s' }}>
                                                    <div style={{ width: 18, height: 18, background: '#fff', borderRadius: '50%', position: 'absolute', top: 3, left: item.on ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* API KEYS TAB */}
                            {activeTab === 'apikeys' && (
                                <motion.div key="apikeys" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                                    <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap', gap: 12 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <FiKey size={16} color="#10B981" />
                                                </div>
                                                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0 }}>API Keys</h2>
                                            </div>
                                            <motion.button onClick={() => setShowGenForm(s => !s)}
                                                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
                                                <FiPlus size={13} /> New Key
                                            </motion.button>
                                        </div>

                                        <AnimatePresence>
                                            {showGenForm && (
                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                                    style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 12, padding: 16, marginBottom: 16, overflow: 'hidden' }}>
                                                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                                        <input value={newKeyLabel} onChange={e => setNewKeyLabel(e.target.value)} placeholder="Key label (e.g. Production)"
                                                            style={{ flex: 1, minWidth: 140, padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#fff', fontSize: '0.88rem', outline: 'none' }}
                                                            onKeyDown={e => { if (e.key === 'Enter') generateKey(); }} />
                                                        <button onClick={generateKey} disabled={generatingKey || !newKeyLabel.trim()}
                                                            style={{ padding: '10px 18px', background: generatingKey ? 'rgba(255,255,255,0.06)' : 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 10, color: '#10B981', fontWeight: 700, fontSize: '0.82rem', cursor: generatingKey ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                                                            {generatingKey ? <><FiRefreshCw size={12} className="animate-spin" /> Generating...</> : <><FiCheck size={12} /> Generate</>}
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                            {apiKeys.map(key => (
                                                <ApiKeyRow key={key.id} label={key.label} value={key.value}
                                                    onDelete={() => setApiKeys(prev => prev.filter(k => k.id !== key.id))} />
                                            ))}
                                            {apiKeys.length === 0 && (
                                                <div style={{ textAlign: 'center', padding: '32px 0', color: '#3F3F46', fontSize: '0.88rem' }}>
                                                    <FiKey size={28} style={{ marginBottom: 10, opacity: 0.4 }} /><br />No API keys yet. Create one above.
                                                </div>
                                            )}
                                        </div>

                                        <div style={{ marginTop: 20, padding: '12px 14px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 10 }}>
                                            <p style={{ fontSize: '0.78rem', color: '#D97706', margin: 0, lineHeight: 1.6 }}>
                                                ⚠️ Keep your API keys secret. Never share them in public repos or client-side code.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* THEME TAB */}
                            {activeTab === 'theme' && (
                                <motion.div key="theme" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                                    <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <FiMonitor size={16} color="#06B6D4" />
                                            </div>
                                            <div>
                                                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0 }}>Choose Theme</h2>
                                                <p style={{ fontSize: '0.75rem', color: '#71717A', margin: 0 }}>Select a theme to install across the entire app.</p>
                                            </div>
                                        </div>

                                        {/* Theme cards grid */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}>
                                            {THEMES.map(theme => {
                                                const active = activeTheme === theme.id;
                                                return (
                                                    <motion.div key={theme.id} whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}
                                                        onClick={() => setActiveTheme(theme.id)}
                                                        style={{ cursor: 'pointer', borderRadius: 14, border: `2px solid ${active ? '#7C3AED' : 'rgba(255,255,255,0.06)'}`, overflow: 'hidden', background: active ? 'rgba(124,58,237,0.06)' : 'rgba(255,255,255,0.02)', transition: 'all 0.2s', position: 'relative' }}>

                                                        {/* Preview swatch */}
                                                        <div style={{ height: 70, background: theme.colors[0], display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                                            <div style={{ width: 28, height: 28, borderRadius: 8, background: theme.colors[1], border: '1px solid rgba(255,255,255,0.1)' }} />
                                                            <div style={{ width: 18, height: 18, borderRadius: '50%', background: theme.colors[2] }} />
                                                        </div>

                                                        {active && (
                                                            <div style={{ position: 'absolute', top: 8, right: 8, width: 20, height: 20, borderRadius: '50%', background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                <FiCheck size={11} color="#fff" />
                                                            </div>
                                                        )}

                                                        <div style={{ padding: '10px 12px' }}>
                                                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: active ? '#A78BFA' : '#E4E4E7', marginBottom: 2 }}>{theme.name}</div>
                                                            <div style={{ fontSize: '0.7rem', color: '#71717A', lineHeight: 1.4 }}>{theme.desc}</div>
                                                            {active && <div style={{ marginTop: 6, fontSize: '0.68rem', color: '#10B981', fontWeight: 700 }}>• Active</div>}
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>

                                        {/* Current palette */}
                                        <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                                            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#3F3F46', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Current Palette</div>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                {(THEMES.find(t => t.id === activeTheme)?.colors || []).map((c, i) => (
                                                    <div key={i} style={{ width: 32, height: 32, borderRadius: 8, background: c, border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }} />
                                                ))}
                                            </div>
                                            <p style={{ marginTop: 12, fontSize: '0.75rem', color: '#3F3F46', margin: '12px 0 0' }}>Theme is saved automatically for your next visit.</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Mobile responsiveness for settings layout */}
            <style>{`
                .settings-layout {
                    flex-direction: row;
                }
                .settings-sidebar {
                    width: 180px !important;
                }
                @media (max-width: 640px) {
                    .settings-layout {
                        flex-direction: column !important;
                    }
                    .settings-sidebar {
                        width: 100% !important;
                        position: static !important;
                        display: flex !important;
                        flex-direction: row !important;
                        padding: 6px !important;
                        overflow-x: auto;
                        gap: 4px;
                    }
                    .settings-sidebar button {
                        white-space: nowrap;
                        flex-shrink: 0;
                    }
                }
            `}</style>
        </div>
    );
}
