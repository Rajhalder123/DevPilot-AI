'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiMapPin, FiGlobe, FiSave, FiCheck, FiShield, FiBell, FiKey, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '@/lib/auth';
import api from '@/lib/api';

const SectionCard = ({ emoji, title, color, children, delay = 0 }: { emoji: string; title: string; color: string; children: React.ReactNode; delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        style={{
            padding: '24px',
            borderRadius: '20px',
            background: 'var(--d-card)',
            border: '1px solid var(--d-border)',
            boxShadow: 'var(--d-shadow)',
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: 24
        }}
    >
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '4px',
            height: '100%',
            background: color
        }} />
        <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            marginBottom: 20, paddingBottom: 16,
            borderBottom: '1px solid var(--d-border)',
        }}>
            <span style={{ fontSize: '1.2rem' }}>{emoji}</span>
            <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--d-text)', fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>{title}</h3>
            <div style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: color }} />
        </div>
        {children}
    </motion.div>
);

export default function SettingsPage() {
    const { user, updateUser } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [location, setLocation] = useState(user?.location || '');
    const [website, setWebsite] = useState(user?.website || '');
    const [skills, setSkills] = useState(user?.skills?.join(', ') || '');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true); setError('');
        try {
            const res = await api.put('/auth/profile', {
                name, bio, location, website,
                skills: skills.split(',').map(s => s.trim()).filter(Boolean),
            });
            updateUser(res.data.user);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to save');
        } finally { setSaving(false); }
    };

    return (
        <div style={{ padding: '28px 48px 120px 48px', flex: 1, overflowY: 'auto' }} className="hide-scrollbar">
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40 }}>
                <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--d-text)', fontSize: '2.5rem', fontWeight: 800, marginBottom: 8 }}>
                    ⚙️ <span className="gradient-text">Settings</span>
                </h1>
                <p style={{ color: 'var(--d-sub)', fontSize: '1.1rem' }}>
                    Manage your personal information, career preferences, and security.
                </p>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 32, alignItems: 'start' }}>
                {/* Profile Info */}
                <SectionCard emoji="👤" title="Public Profile" color="var(--primary)" delay={0.1}>
                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--d-muted)', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <FiUser size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--d-muted)' }} />
                                <input className="input" value={name} onChange={e => setName(e.target.value)} style={{ paddingLeft: 46, background: 'var(--d-input)', color: 'var(--d-text)', border: '1px solid var(--d-border)', borderRadius: 12 }} />
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--d-muted)', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>Bio</label>
                            <textarea className="input" value={bio} onChange={e => setBio(e.target.value)} placeholder="Describe your expertise..." rows={3} style={{ resize: 'none', background: 'var(--d-input)', color: 'var(--d-text)', border: '1px solid var(--d-border)', borderRadius: 12 }} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--d-muted)', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>Location</label>
                                <input className="input" placeholder="City" value={location} onChange={e => setLocation(e.target.value)} style={{ background: 'var(--d-input)', color: 'var(--d-text)', border: '1px solid var(--d-border)', borderRadius: 12 }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--d-muted)', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>Website</label>
                                <input className="input" placeholder="URL" value={website} onChange={e => setWebsite(e.target.value)} style={{ background: 'var(--d-input)', color: 'var(--d-text)', border: '1px solid var(--d-border)', borderRadius: 12 }} />
                            </div>
                        </div>

                        <button
                            className="button-primary"
                            type="submit"
                            disabled={saving}
                            style={{ marginTop: 12, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 14, fontWeight: 700 }}
                        >
                            {saved ? <><FiCheck /> Saved</> : (saving ? 'Saving...' : 'Update Profile')}
                        </button>
                    </form>
                </SectionCard>

                {/* Account & Security */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                    <SectionCard emoji="🔐" title="Account Details" color="#8B5CF6" delay={0.2}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{ padding: '16px', background: 'var(--d-hover)', borderRadius: 16, border: '1px solid var(--d-border)' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--d-muted)', textTransform: 'uppercase', marginBottom: 6 }}>Email</div>
                                <div style={{ fontSize: '0.95rem', color: 'var(--d-text)', fontWeight: 600 }}>{user?.email}</div>
                            </div>
                            <div style={{ padding: '16px', background: 'var(--d-hover)', borderRadius: 16, border: '1px solid var(--d-border)' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--d-muted)', textTransform: 'uppercase', marginBottom: 6 }}>GitHub Connected</div>
                                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: user?.githubUsername ? 'var(--success)' : 'var(--d-muted)' }}>
                                    {user?.githubUsername ? `@${user.githubUsername}` : 'Not Connected'}
                                </div>
                            </div>
                        </div>
                    </SectionCard>

                    <SectionCard emoji="🔔" title="Preferences" color="#10B981" delay={0.3}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.95rem', color: 'var(--d-text)', fontWeight: 600 }}>Email Notifications</span>
                                <div style={{ width: 44, height: 24, background: 'var(--primary)', borderRadius: 12, position: 'relative', cursor: 'pointer' }}>
                                    <div style={{ width: 18, height: 18, background: '#fff', borderRadius: '50%', position: 'absolute', right: 3, top: 3 }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.95rem', color: 'var(--d-text)', fontWeight: 600 }}>AI Recommendations</span>
                                <div style={{ width: 44, height: 24, background: 'var(--primary)', borderRadius: 12, position: 'relative', cursor: 'pointer' }}>
                                    <div style={{ width: 18, height: 18, background: '#fff', borderRadius: '50%', position: 'absolute', right: 3, top: 3 }} />
                                </div>
                            </div>
                        </div>
                    </SectionCard>
                </div>
            </div>
        </div>
    </div>
    );
}
