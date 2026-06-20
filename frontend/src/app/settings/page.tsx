'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { useTheme, THEMES, ThemeId } from '@/context/ThemeContext';
import { FiUser, FiShield, FiKey, FiMonitor, FiSave, FiEye, FiEyeOff, FiCopy, FiRefreshCw, FiCheck } from 'react-icons/fi';

const tabs = [
    { id: 'account',    label: 'Account',  icon: FiUser },
    { id: 'security',   label: 'Security', icon: FiShield },
    { id: 'api',        label: 'API Keys', icon: FiKey },
    { id: 'appearance', label: 'Theme',    icon: FiMonitor },
];

export default function SettingsPage() {
    const { user } = useAuth();
    const { theme: activeTheme, setTheme } = useTheme();
    const searchParams = useSearchParams();

    const [activeTab, setActiveTab]   = useState('account');

    // Auto-open tab from URL query (?tab=account, ?tab=appearance, etc.)
    useEffect(() => {
        const tab = searchParams?.get('tab');
        if (tab && tabs.find(t => t.id === tab)) setActiveTab(tab);
    }, [searchParams]);

    const [saved, setSaved]           = useState(false);
    const [showKey, setShowKey]       = useState(false);
    const [keyCopied, setKeyCopied]   = useState(false);
    const [name, setName]             = useState(user?.name || '');
    const [email, setEmail]           = useState(user?.email || '');

    const fakeApiKey = 'dp_live_sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx';

    const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };
    const copyKey = () => { navigator.clipboard.writeText(fakeApiKey); setKeyCopied(true); setTimeout(() => setKeyCopied(false), 2000); };

    const InputField = ({ label, value, onChange, type = 'text', placeholder = '' }: any) => (
        <div>
            <label style={{ fontSize: '0.82rem', color: '#A1A1AA', fontWeight: 600, display: 'block', marginBottom: 8 }}>{label}</label>
            <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
                style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#fff', outline: 'none', fontSize: '0.9rem', fontFamily: 'var(--font-inter)', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                onFocus={e => (e.target.style.borderColor = 'rgba(124,58,237,0.4)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')} />
        </div>
    );

    return (
        <div style={{ padding: '32px 36px', maxWidth: 820, margin: '0 auto' }}>
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.5px', color: '#fff', marginBottom: 4, fontFamily: 'var(--font-outfit)' }}>Settings</h1>
                <p style={{ color: '#71717A', fontSize: '0.9rem' }}>Manage your account, security, and preferences.</p>
            </div>

            <div style={{ display: 'flex', gap: 28 }}>
                {/* Sidebar Tabs */}
                <div style={{ width: 180, flexShrink: 0 }}>
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, border: 'none', marginBottom: 4, cursor: 'pointer', fontFamily: 'var(--font-inter)', fontSize: '0.88rem', fontWeight: activeTab === tab.id ? 600 : 400, background: activeTab === tab.id ? 'rgba(124,58,237,0.12)' : 'transparent', color: activeTab === tab.id ? '#A78BFA' : '#71717A', borderLeft: activeTab === tab.id ? '2px solid #7C3AED' : '2px solid transparent', transition: 'all 0.15s' }}
                            onMouseEnter={e => { if (activeTab !== tab.id) { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = '#A1A1AA'; } }}
                            onMouseLeave={e => { if (activeTab !== tab.id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#71717A'; } }}>
                            <tab.icon size={15} /> {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div style={{ flex: 1, background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '28px', minHeight: 400 }}>
                    <AnimatePresence mode="wait">
                        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>

                            {/* ── Account ── */}
                            {activeTab === 'account' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                                    <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: 4 }}>Account Information</h2>
                                    <InputField label="Full Name"      value={name}  onChange={setName}  placeholder="Your name" />
                                    <InputField label="Email Address"  value={email} onChange={setEmail} type="email" placeholder="your@email.com" />
                                    <InputField label="Role"           value="Full Stack Developer" onChange={() => {}} placeholder="Your role" />
                                    <motion.button onClick={handleSave} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                        style={{ padding: '11px 22px', background: saved ? 'rgba(16,185,129,0.15)' : 'linear-gradient(135deg, #7C3AED, #06B6D4)', border: saved ? '1px solid rgba(16,185,129,0.3)' : 'none', borderRadius: 10, color: saved ? '#10B981' : '#fff', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, alignSelf: 'flex-start', transition: 'all 0.3s' }}>
                                        {saved ? <><FiCheck size={15} /> Saved!</> : <><FiSave size={15} /> Save Changes</>}
                                    </motion.button>
                                </div>
                            )}

                            {/* ── Security ── */}
                            {activeTab === 'security' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                                    <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: 4 }}>Security Settings</h2>
                                    <InputField label="Current Password"     value="" onChange={() => {}} type="password" placeholder="••••••••" />
                                    <InputField label="New Password"         value="" onChange={() => {}} type="password" placeholder="Min. 8 characters" />
                                    <InputField label="Confirm New Password" value="" onChange={() => {}} type="password" placeholder="Repeat password" />
                                    <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 10, padding: '14px 16px', fontSize: '0.85rem', color: '#10B981', display: 'flex', gap: 10, alignItems: 'center' }}>
                                        <FiShield size={15} /> Your account is secured with 256-bit encryption.
                                    </div>
                                    <button onClick={handleSave} style={{ padding: '11px 22px', background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', alignSelf: 'flex-start' }}>
                                        Update Password
                                    </button>
                                </div>
                            )}

                            {/* ── API Keys ── */}
                            {activeTab === 'api' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                                    <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: 4 }}>API Keys</h2>
                                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '18px' }}>
                                        <div style={{ fontSize: '0.82rem', color: '#71717A', fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your API Key</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <code style={{ flex: 1, background: '#050505', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '10px 14px', fontSize: '0.85rem', color: '#A78BFA', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {showKey ? fakeApiKey : 'dp_live_sk_' + '•'.repeat(28)}
                                            </code>
                                            <button onClick={() => setShowKey(s => !s)} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.08)', color: '#71717A', cursor: 'pointer', padding: '10px', borderRadius: 8, display: 'flex' }}>
                                                {showKey ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                                            </button>
                                            <button onClick={copyKey} style={{ background: keyCopied ? 'rgba(16,185,129,0.12)' : 'none', border: '1px solid ' + (keyCopied ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)'), color: keyCopied ? '#10B981' : '#71717A', cursor: 'pointer', padding: '10px', borderRadius: 8, display: 'flex' }}>
                                                {keyCopied ? <FiCheck size={15} /> : <FiCopy size={15} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '0.82rem', color: '#3F3F46', lineHeight: 1.6 }}>
                                        Keep your API key secret. Never share it publicly or commit it to version control.
                                    </div>
                                    <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, color: '#FCA5A5', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', alignSelf: 'flex-start' }}
                                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.14)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}>
                                        <FiRefreshCw size={14} /> Regenerate Key
                                    </button>
                                </div>
                            )}

                            {/* ── Theme ── */}
                            {activeTab === 'appearance' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                    <div>
                                        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: 4 }}>Choose Theme</h2>
                                        <p style={{ fontSize: '0.82rem', color: '#71717A', margin: 0 }}>Select a theme to instantly apply it across the entire app.</p>
                                    </div>

                                    {/* Theme grid — 3 cards */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                                        {THEMES.map(t => {
                                            const isActive = activeTheme.id === t.id;
                                            return (
                                                <motion.button key={t.id}
                                                    onClick={() => setTheme(t.id as ThemeId)}
                                                    whileHover={{ scale: 1.02, y: -2 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    style={{ background: t.card, border: `2px solid ${isActive ? t.accent : 'rgba(255,255,255,0.07)'}`, borderRadius: 14, padding: '14px', cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.25s, box-shadow 0.25s', boxShadow: isActive ? `0 0 0 1px ${t.accent}33, 0 8px 30px ${t.accent}22` : 'none', position: 'relative', outline: 'none' }}>

                                                    {/* Active badge */}
                                                    {isActive && (
                                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                                                            style={{ position: 'absolute', top: 10, right: 10, width: 20, height: 20, borderRadius: '50%', background: `linear-gradient(135deg, ${t.accent}, ${t.accentAlt})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <FiCheck size={11} color="#fff" />
                                                        </motion.div>
                                                    )}

                                                    {/* Theme preview thumbnail */}
                                                    <div style={{ height: 68, borderRadius: 10, marginBottom: 12, overflow: 'hidden', position: 'relative', background: t.bg, border: `1px solid ${t.border}` }}>
                                                        {/* Simulated sidebar strip */}
                                                        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 20, background: t.sidebar, borderRight: `1px solid ${t.border}` }} />
                                                        {/* Gradient orb */}
                                                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-25%, -50%)', width: 36, height: 36, borderRadius: '50%', background: `radial-gradient(circle, ${t.accent}55 0%, transparent 70%)` }} />
                                                        {/* Fake content lines */}
                                                        <div style={{ position: 'absolute', top: 12, left: 28, right: 8 }}>
                                                            <div style={{ height: 4, borderRadius: 2, background: t.accent + '55', marginBottom: 5, width: '60%' }} />
                                                            <div style={{ height: 3, borderRadius: 2, background: t.muted + '44', marginBottom: 4, width: '85%' }} />
                                                            <div style={{ height: 3, borderRadius: 2, background: t.muted + '22', width: '45%' }} />
                                                        </div>
                                                        {/* Gradient accent bar at bottom */}
                                                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${t.accent}, ${t.accentAlt})` }} />
                                                    </div>

                                                    {/* Label */}
                                                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: isActive ? t.accent : '#E4E4E7', marginBottom: 3 }}>{t.label}</div>
                                                    <div style={{ fontSize: '0.72rem', color: isActive ? t.muted : '#71717A', lineHeight: 1.4 }}>{t.desc}</div>

                                                    {/* Active indicator */}
                                                    {isActive && (
                                                        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', color: t.accent, fontWeight: 700 }}>
                                                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: t.accent }} />
                                                            Active
                                                        </div>
                                                    )}
                                                </motion.button>
                                            );
                                        })}
                                    </div>

                                    {/* Color swatches */}
                                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '16px 18px' }}>
                                        <div style={{ fontSize: '0.78rem', color: '#71717A', fontWeight: 600, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Current Palette</div>
                                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                            {[activeTheme.bg, activeTheme.card, activeTheme.accent, activeTheme.accentAlt, activeTheme.text].map((color, i) => (
                                                <div key={i} title={color} style={{ width: 28, height: 28, borderRadius: 8, background: color, border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }} />
                                            ))}
                                            <span style={{ fontSize: '0.78rem', color: '#3F3F46', marginLeft: 4 }}>
                                                {activeTheme.label} — {activeTheme.accent}
                                            </span>
                                        </div>
                                    </div>

                                    <p style={{ fontSize: '0.78rem', color: '#3F3F46', margin: 0 }}>
                                        Theme is saved automatically and applied on next visit.
                                    </p>
                                </div>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
