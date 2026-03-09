'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiEdit3, FiCopy, FiCheck, FiSend } from 'react-icons/fi';
import api from '@/lib/api';

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
        setGenerating(true);
        setError('');
        setCoverLetter('');
        try {
            const res = await api.post('/cover-letter/generate', {
                resumeText,
                jobDescription,
                companyName: companyName || 'the company',
                tone,
            });
            setCoverLetter(res.data.coverLetter);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Generation failed. Please try again.');
        } finally {
            setGenerating(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(coverLetter);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, marginBottom: 4 }}>
                    Cover Letter <span className="gradient-text">Generator</span>
                </h1>
                <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: '0.95rem' }}>
                    Generate a personalized, compelling cover letter tailored to any job posting.
                </p>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: coverLetter ? '1fr 1fr' : '1fr', gap: 24 }}>
                {/* Input Form */}
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div className="card">
                            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <FiFileText size={18} color="var(--accent)" /> Your Resume
                            </h3>
                            <textarea
                                className="input"
                                placeholder="Paste your resume text here..."
                                value={resumeText}
                                onChange={(e) => setResumeText(e.target.value)}
                                rows={6}
                                required
                                style={{ resize: 'vertical', lineHeight: 1.6 }}
                            />
                        </div>

                        <div className="card">
                            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <FiEdit3 size={18} color="var(--primary)" /> Job Details
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                <div>
                                    <label style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 6, display: 'block' }}>Job Description</label>
                                    <textarea
                                        className="input"
                                        placeholder="Paste the job description..."
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        rows={5}
                                        required
                                        style={{ resize: 'vertical', lineHeight: 1.6 }}
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                                    <div>
                                        <label style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 6, display: 'block' }}>Company Name</label>
                                        <input className="input" placeholder="e.g. Google" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 6, display: 'block' }}>Tone</label>
                                        <select className="input" value={tone} onChange={(e) => setTone(e.target.value)} style={{ cursor: 'pointer' }}>
                                            <option value="professional">Professional</option>
                                            <option value="enthusiastic">Enthusiastic</option>
                                            <option value="casual">Casual</option>
                                            <option value="formal">Formal</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div style={{
                                background: 'rgba(255,82,82,0.1)', border: '1px solid rgba(255,82,82,0.3)',
                                borderRadius: 10, padding: '12px 16px', fontSize: '0.85rem', color: 'var(--danger)',
                            }}>
                                {error}
                            </div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="btn-primary"
                            type="submit"
                            disabled={generating || !resumeText.trim() || !jobDescription.trim()}
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                padding: '16px', fontSize: '1rem', opacity: generating ? 0.7 : 1,
                            }}
                        >
                            <FiSend size={16} /> {generating ? 'Generating...' : '✨ Generate Cover Letter'}
                        </motion.button>
                    </form>
                </motion.div>

                {/* Generated Cover Letter */}
                {coverLetter && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="card" style={{ position: 'sticky', top: 20 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    📝 Your Cover Letter
                                </h3>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleCopy}
                                    style={{
                                        background: copied ? 'var(--success)' : 'var(--card-hover)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: 8, padding: '8px 14px', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', gap: 6,
                                        fontSize: '0.8rem', color: copied ? '#fff' : 'var(--foreground)',
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    {copied ? <><FiCheck size={14} /> Copied!</> : <><FiCopy size={14} /> Copy</>}
                                </motion.button>
                            </div>
                            <div style={{
                                whiteSpace: 'pre-wrap', lineHeight: 1.8, fontSize: '0.9rem',
                                color: 'var(--muted)', padding: '20px', borderRadius: 12,
                                background: 'rgba(0,0,0,0.15)', border: '1px solid var(--border-color)',
                                maxHeight: 500, overflow: 'auto',
                            }}>
                                {coverLetter}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
