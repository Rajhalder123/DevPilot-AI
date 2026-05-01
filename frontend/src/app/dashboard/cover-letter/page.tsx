'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiEdit3, FiCopy, FiCheck, FiSend, FiZap } from 'react-icons/fi';
import api from '@/lib/api';

const SectionCard = ({ emoji, title, color, children, delay = 0 }: { emoji: string; title: string; color: string; children: React.ReactNode; delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="card"
        style={{ borderTop: `3px solid ${color}`, borderRadius: '0 0 14px 14px', marginBottom: 20 }}
    >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '1.3rem' }}>{emoji}</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', margin: 0 }}>{title}</h3>
            <div style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}` }} />
        </div>
        {children}
    </motion.div>
);

const tones = [
    { value: 'professional', label: '💼 Professional', color: '#3B82F6' },
    { value: 'enthusiastic', label: '🔥 Enthusiastic', color: '#F97316' },
    { value: 'casual', label: '😊 Casual', color: '#10B981' },
    { value: 'formal', label: '🎩 Formal', color: '#8B5CF6' },
];

export default function CoverLetterPage() {
    const [resumeText, setResumeText] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [tone, setTone] = useState('professional');
    const [coverLetter, setCoverLetter] = useState('');
    const [generating, setGenerating] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resumeText.trim() || !jobDescription.trim()) return;
        setGenerating(true); setError(''); setCoverLetter('');
        try {
            const res = await api.post('/cover-letter/generate', {
                resumeText, jobDescription,
                companyName: companyName || 'the company', tone,
            });
            setCoverLetter(res.data.coverLetter);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Generation failed. Please try again.');
        } finally { setGenerating(false); }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(coverLetter);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, marginBottom: 4 }}>
                    ✉️ Cover Letter <span className="gradient-text">Generator</span>
                </h1>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
                    Generate a personalized, compelling cover letter tailored to any job posting.
                </p>
            </motion.div>

            <form onSubmit={handleGenerate}>
                <div className="responsive-grid-2" style={{ gap: 24, gridTemplateColumns: coverLetter ? undefined : '1fr' }}>
                    {/* Left: Inputs */}
                    <div>
                        <SectionCard emoji="📄" title="Your Resume" color="#3B82F6" delay={0.05}>
                            <textarea
                                className="input"
                                placeholder="Paste your resume text here — experience, skills, education..."
                                value={resumeText}
                                onChange={e => setResumeText(e.target.value)}
                                rows={7}
                                required
                                style={{ resize: 'vertical', lineHeight: 1.7, fontSize: '0.88rem' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
                                <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{resumeText.length} characters</span>
                            </div>
                        </SectionCard>

                        <SectionCard emoji="💼" title="Job Details" color="#8B5CF6" delay={0.1}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                <div>
                                    <label style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 6, display: 'block', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>📋 Job Description</label>
                                    <textarea
                                        className="input"
                                        placeholder="Paste the full job description here..."
                                        value={jobDescription}
                                        onChange={e => setJobDescription(e.target.value)}
                                        rows={5}
                                        required
                                        style={{ resize: 'vertical', lineHeight: 1.7, fontSize: '0.88rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 6, display: 'block', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>🏢 Company Name</label>
                                    <input className="input" placeholder="e.g. Google, Microsoft, Infosys..." value={companyName} onChange={e => setCompanyName(e.target.value)} />
                                </div>
                            </div>
                        </SectionCard>

                        <SectionCard emoji="🎨" title="Tone & Style" color="#F59E0B" delay={0.15}>
                            <div className="responsive-grid-2" style={{ gap: 10 }}>
                                {tones.map(t => (
                                    <button
                                        key={t.value}
                                        type="button"
                                        onClick={() => setTone(t.value)}
                                        style={{
                                            padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
                                            fontSize: '0.85rem', fontWeight: 600, textAlign: 'left',
                                            border: `2px solid ${tone === t.value ? t.color : 'var(--border-color)'}`,
                                            background: tone === t.value ? `${t.color}15` : 'transparent',
                                            color: tone === t.value ? t.color : 'var(--muted)',
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </SectionCard>

                        {error && (
                            <div style={{ background: 'rgba(255,82,82,0.1)', border: '1px solid rgba(255,82,82,0.3)', borderRadius: 10, padding: '12px 16px', fontSize: '0.85rem', color: 'var(--danger)', marginBottom: 16 }}>
                                ❌ {error}
                            </div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            className="btn-primary" type="submit"
                            disabled={generating || !resumeText.trim() || !jobDescription.trim()}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '16px', fontSize: '1rem', opacity: generating ? 0.7 : 1, width: '100%' }}
                        >
                            {generating ? (
                                <><motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><FiZap size={16} /></motion.span> Generating...</>
                            ) : (
                                <><FiSend size={16} /> ✨ Generate Cover Letter</>
                            )}
                        </motion.button>
                    </div>

                    {/* Right: Output */}
                    {coverLetter && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <SectionCard emoji="📝" title="Your Cover Letter" color="#10B981" delay={0}>
                                <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                                    <motion.button
                                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                        type="button" onClick={handleCopy}
                                        style={{
                                            background: copied ? 'var(--success)' : 'rgba(16,185,129,0.1)',
                                            border: `1px solid ${copied ? 'var(--success)' : 'rgba(16,185,129,0.4)'}`,
                                            borderRadius: 8, padding: '7px 14px', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', gap: 6,
                                            fontSize: '0.8rem', color: copied ? '#fff' : '#10B981',
                                            fontWeight: 600, transition: 'all 0.3s',
                                        }}
                                    >
                                        {copied ? <><FiCheck size={13} /> Copied!</> : <><FiCopy size={13} /> Copy</>}
                                    </motion.button>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'flex', alignItems: 'center' }}>
                                        ~{Math.ceil(coverLetter.split(' ').length)} words
                                    </span>
                                </div>
                                <div style={{
                                    whiteSpace: 'pre-wrap', lineHeight: 1.9, fontSize: '0.88rem',
                                    color: 'var(--foreground)', padding: '20px', borderRadius: 10,
                                    background: 'rgba(16,185,129,0.04)',
                                    border: '1px solid rgba(16,185,129,0.2)',
                                    maxHeight: 520, overflowY: 'auto',
                                }}>
                                    {coverLetter}
                                </div>
                            </SectionCard>
                        </motion.div>
                    )}
                </div>
            </form>
        </div>
    );
}
