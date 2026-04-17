'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiStar, FiGitBranch, FiCheckCircle, FiAlertCircle, FiCode, FiSearch, FiActivity } from 'react-icons/fi';
import api from '@/lib/api';
import ResultPanel from '@/components/ui/ResultPanel';

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

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: 8, color: 'var(--foreground)' }}>
                    GitHub <span className="gradient-text">Analyzer</span>
                </h1>
                <p style={{ color: 'var(--muted)', fontSize: '1rem' }}>
                    Enter a repository URL to get an instant AI review on code quality and architecture.
                </p>
            </motion.div>

            {/* Animated Input */}
            <motion.form
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onSubmit={handleAnalyze}
                className="glass-panel"
                style={{ display: 'flex', gap: 12, padding: '16px', borderRadius: '16px', marginBottom: 16 }}
            >
                <div style={{ flex: 1, position: 'relative' }}>
                    <FiGithub size={20} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                    <input
                        className="input"
                        type="url"
                        placeholder="https://github.com/user/repository"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        style={{ paddingLeft: 46, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '12px', height: '100%' }}
                        required
                    />
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary"
                    type="submit"
                    disabled={analyzing}
                    style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 8, opacity: analyzing ? 0.7 : 1, borderRadius: '12px', padding: '0 24px' }}
                >
                    <FiSearch size={18} /> {analyzing ? 'Scanning...' : 'Analyze Repo'}
                </motion.button>
            </motion.form>

            {error && (
                <div style={{
                    background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: 12, padding: '16px', fontSize: '0.9rem', color: 'var(--danger)'
                }}>
                    {error}
                </div>
            )}

            {/* Results Grid */}
            {analysis && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 24 }}>
                    
                    {/* Top Row: Score & Graph */}
                    <div style={{ gridColumn: 'span 12', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
                        <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ fontSize: '4.5rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--primary)', lineHeight: 1, marginBottom: 12 }}>
                                {analysis.overallScore}
                            </div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: 8 }}>Overall Quality Score</div>
                            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{analysis.summary}</p>
                        </div>

                        <ResultPanel title="Activity Graph" icon={FiActivity} iconColor="var(--accent)">
                            <div style={{ display: 'flex', alignItems: 'flex-end', height: 120, gap: 6, marginTop: 20 }}>
                                {[40, 60, 30, 80, 50, 90, 70, 45, 85, 35, 65, 100].map((h, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h}%` }}
                                        transition={{ duration: 1, delay: i * 0.05 }}
                                        style={{
                                            flex: 1,
                                            background: h > 70 ? 'var(--primary)' : 'rgba(59, 130, 246, 0.3)',
                                            borderRadius: '4px 4px 0 0',
                                            minWidth: 10
                                        }}
                                    />
                                ))}
                            </div>
                            <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.8rem', marginTop: 12 }}>Commit frequency (Mock Data)</p>
                        </ResultPanel>
                    </div>

                    {/* Middle Row: Arch & Stack */}
                    <div style={{ gridColumn: 'span 12', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
                        <ResultPanel title="Architecture" icon={FiGitBranch} iconColor="var(--primary)">
                            {analysis.architecture}
                        </ResultPanel>

                        <ResultPanel title="Tech Stack" icon={FiStar} iconColor="var(--warning)">
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 12 }}>
                                {analysis.techStack?.map((t, i) => (
                                    <span key={i} style={{
                                        background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)',
                                        borderRadius: 20, padding: '6px 14px', fontSize: '0.85rem', color: 'var(--warning)', fontWeight: 500
                                    }}>{t}</span>
                                ))}
                            </div>
                            <div style={{ marginTop: 24 }}>
                                <h4 style={{ color: 'var(--foreground)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}><FiCode /> Code Quality</h4>
                                <p style={{ fontSize: '0.9rem' }}>{analysis.codeQuality}</p>
                            </div>
                        </ResultPanel>
                    </div>

                    {/* Bottom Row: Strengths and Suggestions */}
                    <div style={{ gridColumn: 'span 12', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
                        <ResultPanel title="Strengths" icon={FiCheckCircle} iconColor="var(--success)">
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {analysis.strengths?.map((s, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                        <span style={{ color: 'var(--success)' }}>✓</span>
                                        <span style={{ color: 'var(--foreground)' }}>{s}</span>
                                    </li>
                                ))}
                            </ul>
                        </ResultPanel>

                        <ResultPanel title="Suggestions" icon={FiAlertCircle} iconColor="var(--danger)">
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {analysis.suggestions?.map((s, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                        <span style={{ color: 'var(--danger)' }}>→</span>
                                        <span style={{ color: 'var(--foreground)' }}>{s}</span>
                                    </li>
                                ))}
                            </ul>
                        </ResultPanel>
                    </div>

                </motion.div>
            )}
        </div>
    );
}
