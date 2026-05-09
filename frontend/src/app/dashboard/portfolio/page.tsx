'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiLayout, FiDownload, FiEye, FiUser, FiCode, FiGithub, FiLinkedin, FiPlus, FiTrash2, FiZap } from 'react-icons/fi';

interface Portfolio {
    name: string;
    title: string;
    bio: string;
    skills: string[];
    github: string;
    linkedin: string;
    email: string;
    projects: { name: string; desc: string; url: string }[];
}

const defaultPortfolio: Portfolio = {
    name: '', title: '', bio: '', skills: [], github: '', linkedin: '', email: '',
    projects: [{ name: '', desc: '', url: '' }],
};

export default function PortfolioPage() {
    const [form, setForm] = useState<Portfolio>(defaultPortfolio);
    const [skillInput, setSkillInput] = useState('');
    const [previewing, setPreviewing] = useState(false);
    const [generating, setGenerating] = useState(false);

    const addSkill = () => {
        if (skillInput.trim() && !form.skills.includes(skillInput.trim())) {
            setForm(f => ({ ...f, skills: [...f.skills, skillInput.trim()] }));
            setSkillInput('');
        }
    };

    const removeSkill = (s: string) => setForm(f => ({ ...f, skills: f.skills.filter(x => x !== s) }));

    const addProject = () => setForm(f => ({ ...f, projects: [...f.projects, { name: '', desc: '', url: '' }] }));
    const removeProject = (i: number) => setForm(f => ({ ...f, projects: f.projects.filter((_, j) => j !== i) }));
    const updateProject = (i: number, field: string, val: string) => {
        setForm(f => {
            const projects = [...f.projects];
            projects[i] = { ...projects[i], [field]: val };
            return { ...f, projects };
        });
    };

    const handleGenerate = () => {
        setGenerating(true);
        setTimeout(() => { setGenerating(false); setPreviewing(true); }, 1500);
    };

    if (previewing) {
        return (
            <div style={{ padding: '28px 36px 120px 36px', flex: 1, overflowY: 'auto' }} className="hide-scrollbar">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--d-text)', fontWeight: 700 }}>Portfolio Preview</h2>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button className="btn-ghost" onClick={() => setPreviewing(false)}>← Edit</button>
                        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FiDownload size={14} /> Download HTML
                        </button>
                    </div>
                </div>
                {/* Preview Card */}
                <div style={{
                    padding: '48px', textAlign: 'center', background: 'var(--d-card)',
                    border: '1px solid var(--d-border)', borderRadius: 16, boxShadow: 'var(--d-shadow)'
                }}>
                    <div style={{
                        width: 80, height: 80, borderRadius: '50%', margin: '0 auto 16px',
                        background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2rem', fontWeight: 800, color: '#FFFFFF',
                    }}>
                        {form.name.charAt(0) || 'D'}
                    </div>
                    <h1 style={{ color: 'var(--d-text)', fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
                        {form.name || 'Your Name'}
                    </h1>
                    <p style={{ color: 'var(--primary)', fontSize: '1rem', marginTop: 6, margin: '6px 0 16px' }}>
                        {form.title || 'Full Stack Developer'}
                    </p>
                    <p style={{ color: 'var(--d-sub)', maxWidth: 500, margin: '0 auto 24px', fontSize: '0.9rem', lineHeight: 1.7 }}>
                        {form.bio || 'Passionate developer building impactful applications.'}
                    </p>
                    {/* Skills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
                        {(form.skills.length > 0 ? form.skills : ['React', 'Node.js', 'TypeScript']).map((s, i) => (
                            <span key={i} className="tag">{s}</span>
                        ))}
                    </div>
                    {/* Links */}
                    <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                        {form.github && (
                            <a href={form.github} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--primary)', fontSize: '0.85rem', textDecoration: 'none' }}>
                                <FiGithub size={16} /> GitHub
                            </a>
                        )}
                        {form.linkedin && (
                            <a href={form.linkedin} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--primary)', fontSize: '0.85rem', textDecoration: 'none' }}>
                                <FiLinkedin size={16} /> LinkedIn
                            </a>
                        )}
                    </div>
                </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '28px 36px 120px 36px', flex: 1, overflowY: 'auto' }} className="hide-scrollbar">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
                <div className="section-label"><FiLayout size={11} /> Portfolio Builder</div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--d-text)', marginBottom: 6 }}>
                    Build Your <span className="gradient-text">Portfolio</span>
                </h1>
                <p style={{ color: 'var(--d-sub)', fontSize: '0.9rem', margin: 0 }}>
                    Fill in your details and generate a professional portfolio instantly.
                </p>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
                {/* Personal Info */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <div style={{ background: 'var(--d-card)', border: '1px solid var(--d-border)', borderRadius: 16, padding: '24px', boxShadow: 'var(--d-shadow)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                            <FiUser size={16} color="var(--primary)" />
                            <h3 style={{ color: 'var(--d-text)', fontFamily: 'var(--font-display)', fontWeight: 700, margin: 0 }}>Personal Info</h3>
                        </div>
                        {[
                            { label: 'Full Name', field: 'name', placeholder: 'Rahul Sharma' },
                            { label: 'Job Title', field: 'title', placeholder: 'Full Stack Developer' },
                            { label: 'Email', field: 'email', placeholder: 'rahul@example.com' },
                        ].map(({ label, field, placeholder }) => (
                            <div key={field} style={{ marginBottom: 16 }}>
                                <label style={{ fontSize: '0.8rem', color: 'var(--d-muted)', fontWeight: 600, display: 'block', marginBottom: 6 }}>{label}</label>
                                <input
                                    className="input" placeholder={placeholder}
                                    value={(form as any)[field]}
                                    onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                                    style={{ background: 'var(--d-input)', color: 'var(--d-text)', border: '1px solid var(--d-border)' }}
                                />
                            </div>
                        ))}
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ fontSize: '0.8rem', color: 'var(--d-muted)', fontWeight: 600, display: 'block', marginBottom: 6 }}>Bio</label>
                            <textarea
                                className="input" placeholder="Passionate developer from Bangalore..."
                                value={form.bio}
                                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                                rows={3}
                                style={{ resize: 'vertical', fontFamily: 'var(--font-sans)', background: 'var(--d-input)', color: 'var(--d-text)', border: '1px solid var(--d-border)' }}
                            />
                        </div>
                        {[
                            { label: 'GitHub URL', field: 'github', icon: FiGithub, placeholder: 'https://github.com/username' },
                            { label: 'LinkedIn URL', field: 'linkedin', icon: FiLinkedin, placeholder: 'https://linkedin.com/in/username' },
                        ].map(({ label, field, icon: Icon, placeholder }) => (
                            <div key={field} style={{ marginBottom: 16 }}>
                                <label style={{ fontSize: '0.8rem', color: 'var(--d-muted)', fontWeight: 600, display: 'block', marginBottom: 6 }}>{label}</label>
                                <div style={{ position: 'relative' }}>
                                    <Icon size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--d-muted)' }} />
                                    <input className="input" placeholder={placeholder} value={(form as any)[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} style={{ paddingLeft: 36, background: 'var(--d-input)', color: 'var(--d-text)', border: '1px solid var(--d-border)' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Skills & Projects */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                    <div style={{ background: 'var(--d-card)', border: '1px solid var(--d-border)', borderRadius: 16, padding: '24px', boxShadow: 'var(--d-shadow)', marginBottom: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <FiCode size={16} color="var(--primary)" />
                            <h3 style={{ color: 'var(--d-text)', fontFamily: 'var(--font-display)', fontWeight: 700, margin: 0 }}>Skills</h3>
                        </div>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                            <input className="input" placeholder="e.g. React, Node.js..." value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill()} style={{ flex: 1, background: 'var(--d-input)', color: 'var(--d-text)', border: '1px solid var(--d-border)' }} />
                            <button className="btn-secondary" onClick={addSkill} style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>Add</button>
                        </div>
                        {form.skills.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                                {form.skills.map((s, i) => (
                                    <span key={i} className="tag" style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }} onClick={() => removeSkill(s)}>
                                        {s} <FiTrash2 size={10} color="#EF4444" />
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={{ background: 'var(--d-card)', border: '1px solid var(--d-border)', borderRadius: 16, padding: '24px', boxShadow: 'var(--d-shadow)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <FiLayout size={16} color="var(--accent)" />
                                <h3 style={{ color: 'var(--d-text)', fontFamily: 'var(--font-display)', fontWeight: 700, margin: 0 }}>Projects</h3>
                            </div>
                            <button className="btn-ghost" onClick={addProject} style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 5 }}>
                                <FiPlus size={13} /> Add
                            </button>
                        </div>
                        {form.projects.map((proj, i) => (
                            <div key={i} style={{ marginBottom: 16, padding: '16px', borderRadius: 10, background: 'var(--d-hover)', border: '1px solid var(--d-border)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                                    <span style={{ fontSize: '0.78rem', color: 'var(--d-muted)', fontWeight: 600 }}>Project {i + 1}</span>
                                    {form.projects.length > 1 && (
                                        <button onClick={() => removeProject(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444' }}>
                                            <FiTrash2 size={13} />
                                        </button>
                                    )}
                                </div>
                                {[
                                    { label: 'Name', field: 'name', placeholder: 'DevPilot AI' },
                                    { label: 'Description', field: 'desc', placeholder: 'AI career platform for developers' },
                                    { label: 'URL', field: 'url', placeholder: 'https://github.com/...' },
                                ].map(({ label, field, placeholder }) => (
                                    <div key={field} style={{ marginBottom: 8 }}>
                                        <label style={{ fontSize: '0.75rem', color: 'var(--d-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>{label}</label>
                                        <input className="input" placeholder={placeholder} value={(proj as any)[field]} onChange={e => updateProject(i, field, e.target.value)} style={{ padding: '8px 12px', background: 'var(--d-input)', color: 'var(--d-text)', border: '1px solid var(--d-border)' }} />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Generate Button */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ marginTop: 24, display: 'flex', gap: 12 }}>
                <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="btn-primary"
                    onClick={handleGenerate}
                    disabled={generating}
                    style={{ padding: '14px 32px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 10 }}
                >
                    {generating ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><FiZap size={18} /></motion.div>
                    ) : <FiEye size={18} />}
                    {generating ? 'Generating...' : 'Preview Portfolio'}
                </motion.button>
                <button className="btn-ghost" style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FiDownload size={16} /> Download HTML
                </button>
            </motion.div>
        </div>
    );
}
