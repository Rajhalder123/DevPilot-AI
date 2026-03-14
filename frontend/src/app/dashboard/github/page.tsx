'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiStar, FiGitBranch, FiCheckCircle, FiAlertCircle, FiCode, FiSearch } from 'react-icons/fi';
import api from '@/lib/api';

interface RepoAnalysis {
    overallScore: number;
    summary: string;
    codeQuality: string;
    architecture: string;
    strengths: string[];
    improvements: string[];
    techStack: string[];
    suggestions: string[];
}

export default function GitHubPage() {
    const [repoUrl, setRepoUrl] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<RepoAnalysis | null>(null);
    const [error, setError] = useState('');

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!repoUrl.trim()) return;
        setAnalyzing(true);
        setError('');
        setAnalysis(null);
        try {
            const res = await api.post('/github/analyze', { repoUrl });
            setAnalysis(res.data.project.analysis);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Analysis failed. Check the repository URL.');
        } finally {
            setAnalyzing(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'var(--success)';
        if (score >= 60) return 'var(--warning)';
        return 'var(--danger)';
    };

    return (
        <div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, marginBottom: 4 }}>
                    GitHub <span className="gradient-text">Analyzer</span>
                </h1>
                <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: '0.95rem' }}>
                    Enter a GitHub repository URL to get AI-powered code review and architecture analysis.
                </p>
            </motion.div>

            {/* Input */}
            <motion.form
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onSubmit={handleAnalyze}
                style={{ display: 'flex', gap: 12, marginBottom: 32 }}
            >
                <div style={{ flex: 1, position: 'relative' }}>
                    <FiGithub size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                    <input
                        className="input"
                        type="url"
                        placeholder="https://github.com/user/repository"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        style={{ paddingLeft: 42 }}
                        required
                    />
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary"
                    type="submit"
                    disabled={analyzing}
                    style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 8, opacity: analyzing ? 0.7 : 1 }}
                >
                    <FiSearch size={16} /> {analyzing ? 'Analyzing...' : 'Analyze'}
                </motion.button>
            </motion.form>

            {error && (
                <div style={{
                    background: 'rgba(255,82,82,0.1)', border: '1px solid rgba(255,82,82,0.3)',
                    borderRadius: 10, padding: '12px 16px', fontSize: '0.85rem', color: 'var(--danger)', marginBottom: 24,
                }}>
                    {error}
                </div>
            )}

            {/* Results */}
            {analysis && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    {/* Score */}
                    <div className="card" style={{ textAlign: 'center', padding: '40px', marginBottom: 24 }}>
                        <div style={{ fontSize: '4rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: getScoreColor(analysis.overallScore) }}>
                            {analysis.overallScore}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: 16 }}>Overall Repository Score</div>
                        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>{analysis.summary}</p>
                    </div>

                    {/* Code Quality & Architecture */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 20, marginBottom: 24 }}>
                        <div className="card">
                            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <FiCode size={18} color="var(--accent)" /> Code Quality
                            </h3>
                            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>{analysis.codeQuality}</p>
                        </div>
                        <div className="card">
                            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <FiGitBranch size={18} color="var(--primary)" /> Architecture
                            </h3>
                            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>{analysis.architecture}</p>
                        </div>
                    </div>

                    {/* Tech Stack */}
                    {analysis.techStack?.length > 0 && (
                        <div className="card" style={{ marginBottom: 24 }}>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <FiStar size={18} color="var(--warning)" /> Detected Tech Stack
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {analysis.techStack.map((t, i) => (
                                    <span key={i} style={{
                                        background: 'rgba(249, 115, 22, 0.1)', border: '1px solid rgba(249, 115, 22, 0.3)',
                                        borderRadius: 20, padding: '6px 14px', fontSize: '0.8rem', color: 'var(--primary)',
                                    }}>{t}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Strengths & Improvements */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 20 }}>
                        <div className="card">
                            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <FiCheckCircle size={18} color="var(--success)" /> Strengths
                            </h3>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {analysis.strengths?.map((s, i) => (
                                    <li key={i} style={{ fontSize: '0.9rem', color: 'var(--muted)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                        <span style={{ color: 'var(--success)' }}>✓</span> {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="card">
                            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <FiAlertCircle size={18} color="var(--warning)" /> Suggestions
                            </h3>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {analysis.suggestions?.map((s, i) => (
                                    <li key={i} style={{ fontSize: '0.9rem', color: 'var(--muted)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                        <span style={{ color: 'var(--warning)' }}>→</span> {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
