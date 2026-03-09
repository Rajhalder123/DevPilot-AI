'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiMapPin, FiGlobe, FiSave, FiCheck } from 'react-icons/fi';
import { useAuth } from '@/lib/auth';
import api from '@/lib/api';

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
        setSaving(true);
        setError('');
        try {
            const res = await api.put('/auth/profile', {
                name,
                bio,
                location,
                website,
                skills: skills.split(',').map(s => s.trim()).filter(Boolean),
            });
            updateUser(res.data.user);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, marginBottom: 4 }}>
                    <span className="gradient-text">Settings</span>
                </h1>
                <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: '0.95rem' }}>Manage your profile and preferences.</p>
            </motion.div>

            <div style={{ maxWidth: 600 }}>
                {/* Profile */}
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ marginBottom: 24 }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiUser size={18} color="var(--accent)" /> Profile Information
                    </h3>

                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <label style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 6, display: 'block' }}>Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <FiUser size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                                <input className="input" value={name} onChange={(e) => setName(e.target.value)} style={{ paddingLeft: 40 }} />
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 6, display: 'block' }}>Email</label>
                            <div style={{ position: 'relative' }}>
                                <FiMail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                                <input className="input" value={user?.email || ''} disabled style={{ paddingLeft: 40, opacity: 0.6 }} />
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 6, display: 'block' }}>Bio</label>
                            <textarea
                                className="input"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Tell us about yourself..."
                                rows={3}
                                style={{ resize: 'vertical' }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div>
                                <label style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 6, display: 'block' }}>Location</label>
                                <div style={{ position: 'relative' }}>
                                    <FiMapPin size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                                    <input className="input" placeholder="City, Country" value={location} onChange={(e) => setLocation(e.target.value)} style={{ paddingLeft: 40 }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 6, display: 'block' }}>Website</label>
                                <div style={{ position: 'relative' }}>
                                    <FiGlobe size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                                    <input className="input" placeholder="https://..." value={website} onChange={(e) => setWebsite(e.target.value)} style={{ paddingLeft: 40 }} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 6, display: 'block' }}>Skills (comma-separated)</label>
                            <input className="input" placeholder="React, TypeScript, Node.js..." value={skills} onChange={(e) => setSkills(e.target.value)} />
                        </div>

                        {error && (
                            <div style={{ background: 'rgba(255,82,82,0.1)', border: '1px solid rgba(255,82,82,0.3)', borderRadius: 10, padding: '12px', fontSize: '0.85rem', color: 'var(--danger)' }}>
                                {error}
                            </div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="btn-primary"
                            type="submit"
                            disabled={saving}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: saving ? 0.7 : 1 }}
                        >
                            {saved ? <><FiCheck size={16} /> Saved!</> : <><FiSave size={16} /> {saving ? 'Saving...' : 'Save Changes'}</>}
                        </motion.button>
                    </form>
                </motion.div>

                {/* Account Info */}
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 16 }}>Account Details</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--muted)' }}>User ID</span>
                            <span style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{user?.id}</span>
                        </div>
                        {user?.githubUsername && (
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--muted)' }}>GitHub</span>
                                <span style={{ color: 'var(--accent)' }}>@{user.githubUsername}</span>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
