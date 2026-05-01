'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGithub, FiCheckCircle, FiTrendingUp, FiActivity, FiArrowRight, FiCode, FiZap, FiTarget } from 'react-icons/fi';
import Link from 'next/link';

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
            overflow: 'hidden'
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

export default function GitHubPage() {
    const [repoUrl, setRepoUrl] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<any>(null);

    const handleAnalyze = (e: React.FormEvent) => {
        e.preventDefault();
        if (!repoUrl) return;
        setIsAnalyzing(true);
        setTimeout(() => {
            setAnalysis({
                score: 82,
                techStack: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL'],
                qualityMetrics: [
                    { label: 'Documentation', value: 90, color: '#10B981' },
                    { label: 'Architecture', value: 75, color: '#3B82F6' },
                    { label: 'Maintainability', value: 85, color: '#8B5CF6' }
                ],
                highlights: [
                    'Excellent README structure with clear setup instructions.',
                    'Good use of custom hooks and component abstraction.',
                    'Consistent naming conventions and folder organization.'
                ]
            });
            setIsAnalyzing(false);
        }, 2000);
    };

    return (
        <div style={{ maxWidth: 900, margin: '0 auto', paddingBottom: 40 }}>
            {/* Header */}
            <div style={{ marginBottom: 32 }}>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                        <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: 10, borderRadius: 12 }}>
                            <FiGithub size={24} color="var(--primary)" />
                        </div>
                        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, margin: 0 }}>
                            GitHub <span className="gradient-text">Analyzer</span>
                        </h1>
                    </div>
                    <p style={{ color: 'var(--muted)', fontSize: '1rem' }}>
                        Provide your repository URL to analyze code quality, tech stack, and architectural patterns.
                    </p>
                </motion.div>
            </div>

            <form onSubmit={handleAnalyze} style={{ marginBottom: 32 }}>
                <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px', background: 'rgba(255,255,255,0.8)', border: '1px solid var(--border-color)' }}>
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 10, display: 'block' }}>🔗 Repository URL</label>
                        <div style={{ position: 'relative' }}>
                            <FiCode style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                            <input
                                className="input"
                                style={{ paddingLeft: 48, fontSize: '1rem' }}
                                placeholder="https://github.com/username/project"
                                value={repoUrl}
                                onChange={(e) => setRepoUrl(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="button-primary"
                        disabled={isAnalyzing}
                        style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
                    >
                        {isAnalyzing ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                                <div className="animate-spin" style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
                                Scanning Codebase...
                            </span>
                        ) : 'Start Analysis'}
                    </button>
                </div>
            </form>

            <AnimatePresence>
                {analysis && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 24 }}>
                            {/* Score Stats */}
                            <SectionCard emoji="📊" title="Quality Score" color="var(--primary)" delay={0.1}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                    <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--primary)', marginBottom: 8 }}>{analysis.score}</div>
                                    <div style={{ padding: '4px 12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', borderRadius: 100, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 16 }}>
                                        High Quality
                                    </div>
                                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
                                        {analysis.qualityMetrics.map((m: any) => (
                                            <div key={m.label}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 4 }}>
                                                    <span>{m.label}</span>
                                                    <span style={{ fontWeight: 700 }}>{m.value}%</span>
                                                </div>
                                                <div style={{ height: 6, background: 'rgba(0,0,0,0.03)', borderRadius: 3, overflow: 'hidden' }}>
                                                    <motion.div initial={{ width: 0 }} animate={{ width: `${m.value}%` }} transition={{ duration: 1 }} style={{ height: '100%', background: m.color }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </SectionCard>

                            {/* Tech Stack */}
                            <SectionCard emoji="🛠️" title="Tech Stack" color="#8B5CF6" delay={0.2}>
                                <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 16 }}>The primary technologies identified in this project:</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                                    {analysis.techStack.map((tech: string) => (
                                        <div key={tech} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: 'rgba(255,255,255,0.5)', border: '1px solid var(--border-color)', borderRadius: 12, fontSize: '0.85rem', fontWeight: 600 }}>
                                            <FiCode size={14} color="#8B5CF6" /> {tech}
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginTop: 'auto', paddingTop: 24, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--success)', fontSize: '0.8rem', fontWeight: 600 }}>
                                    <FiCheckCircle size={14} /> Modern stack confirmed
                                </div>
                            </SectionCard>

                            {/* Highlights */}
                            <SectionCard emoji="✨" title="Project Highlights" color="#F59E0B" delay={0.3}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    {analysis.highlights.map((h: string, i: number) => (
                                        <div key={i} style={{ display: 'flex', gap: 10 }}>
                                            <FiZap color="#F59E0B" style={{ flexShrink: 0, marginTop: 3 }} />
                                            <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--foreground)', lineHeight: 1.5 }}>{h}</p>
                                        </div>
                                    ))}
                                </div>
                            </SectionCard>
                        </div>

                        {/* Action Bar */}
                        <div className="glass-panel" style={{ padding: '20px 24px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <FiActivity color="var(--primary)" />
                                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>This project significantly boosts your Architectural Score.</span>
                            </div>
                            <Link href="/dashboard/results" style={{ textDecoration: 'none' }}>
                                <button style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                                    View Full Career Stats <FiArrowRight />
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
