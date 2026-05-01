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
        className="glass-panel"
        style={{
            padding: '24px',
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.7)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
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
            borderBottom: '1px solid var(--border-color)',
        }}>
            <span style={{ fontSize: '1.2rem' }}>{emoji}</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', margin: 0 }}>{title}</h3>
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
        <div style={{ maxWidth: 800, margin: '0 auto', paddingBottom: 40 }}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: 4 }}>
                    ⚙️ <span className="gradient-text">Settings</span>
                </h1>
                <p style={{ color: 'var(--muted)', fontSize: '1rem' }}>
                    Manage your personal information, career preferences, and security.
                </p>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
                {/* Profile Info */}
                <SectionCard emoji="👤" title="Public Profile" color="var(--primary)" delay={0.1}>
                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <FiUser size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                                <input className="input" value={name} onChange={e => setName(e.target.value)} style={{ paddingLeft: 42 }} />
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Bio</label>
                            <textarea className="input" value={bio} onChange={e => setBio(e.target.value)} placeholder="Describe your expertise..." rows={2} style={{ resize: 'none' }} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Location</label>
                                <input className="input" placeholder="City" value={location} onChange={e => setLocation(e.target.value)} />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Website</label>
                                <input className="input" placeholder="URL" value={website} onChange={e => setWebsite(e.target.value)} />
                            </div>
                        </div>

                        <button
                            className="button-primary"
                            type="submit"
                            disabled={saving}
                            style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
                        >
                            {saved ? <><FiCheck /> Saved</> : (saving ? 'Saving...' : 'Update Profile')}
                        </button>
                    </form>
                </SectionCard>

                {/* Account & Security */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <SectionCard emoji="🔐" title="Account Details" color="#8B5CF6" delay={0.2}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div style={{ padding: '12px', background: 'rgba(0,0,0,0.03)', borderRadius: 12, border: '1px solid var(--border-color)' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 4 }}>Email</div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user?.email}</div>
                            </div>
                            <div style={{ padding: '12px', background: 'rgba(0,0,0,0.03)', borderRadius: 12, border: '1px solid var(--border-color)' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 4 }}>GitHub Connected</div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: user?.githubUsername ? 'var(--success)' : 'var(--muted)' }}>
                                    {user?.githubUsername ? `@${user.githubUsername}` : 'Not Connected'}
                                </div>
                            </div>
                        </div>
                    </SectionCard>

                    <SectionCard emoji="🔔" title="Preferences" color="#10B981" delay={0.3}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Email Notifications</span>
                                <div style={{ width: 40, height: 20, background: 'var(--primary)', borderRadius: 10, position: 'relative' }}>
                                    <div style={{ width: 16, height: 16, background: '#fff', borderRadius: '50%', position: 'absolute', right: 2, top: 2 }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>AI Recommendations</span>
                                <div style={{ width: 40, height: 20, background: 'var(--primary)', borderRadius: 10, position: 'relative' }}>
                                    <div style={{ width: 16, height: 16, background: '#fff', borderRadius: '50%', position: 'absolute', right: 2, top: 2 }} />
                                </div>
                            </div>
                        </div>
                    </SectionCard>
                </div>
            </div>
        </div>
    );
}
