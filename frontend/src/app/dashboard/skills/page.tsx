'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiBarChart2, FiTarget, FiCheckCircle, FiAlertCircle, FiArrowRight, FiBookOpen } from 'react-icons/fi';

const roles = [
    { id: 'frontend', name: 'Frontend Developer' },
    { id: 'backend', name: 'Backend Developer' },
    { id: 'fullstack', name: 'Full Stack Developer' },
    { id: 'ai', name: 'AI Engineer' }
];

const skillData: Record<string, any> = {
    frontend: {
        matchScore: 78,
        strengths: ['React.js', 'JavaScript ES6+', 'HTML/CSS', 'Tailwind CSS'],
        gaps: [
            { skill: 'TypeScript', importance: 'High', progress: 30, resources: ['TypeScript Handbook', 'Frontend Masters'] },
            { skill: 'Next.js', importance: 'High', progress: 50, resources: ['Next.js Docs', 'Vercel Learn'] },
            { skill: 'State Management (Redux/Zustand)', importance: 'Medium', progress: 60, resources: ['Redux Toolkit Docs'] },
            { skill: 'Testing (Jest/Cypress)', importance: 'Medium', progress: 20, resources: ['Testing Library Docs'] }
        ]
    },
    backend: {
        matchScore: 45,
        strengths: ['Node.js', 'Express', 'JavaScript ES6+'],
        gaps: [
            { skill: 'PostgreSQL / SQL', importance: 'High', progress: 40, resources: ['SQLBolt', 'PostgreSQL Tutorial'] },
            { skill: 'Docker & Containers', importance: 'High', progress: 10, resources: ['Docker for Beginners'] },
            { skill: 'System Design', importance: 'High', progress: 20, resources: ['System Design Primer'] },
            { skill: 'Caching (Redis)', importance: 'Medium', progress: 5, resources: ['Redis University'] }
        ]
    },
    fullstack: {
        matchScore: 62,
        strengths: ['React.js', 'Node.js', 'Express', 'MongoDB'],
        gaps: [
            { skill: 'TypeScript', importance: 'High', progress: 30, resources: ['TypeScript Handbook'] },
            { skill: 'CI/CD Pipelines', importance: 'High', progress: 15, resources: ['GitHub Actions Docs'] },
            { skill: 'AWS / Cloud Basics', importance: 'Medium', progress: 25, resources: ['AWS Practitioner Course'] }
        ]
    },
    ai: {
        matchScore: 30,
        strengths: ['Python', 'Basic Math/Stats'],
        gaps: [
            { skill: 'PyTorch / TensorFlow', importance: 'High', progress: 10, resources: ['Fast.ai', 'DeepLearning.AI'] },
            { skill: 'NLP Fundamentals', importance: 'High', progress: 5, resources: ['Hugging Face Course'] },
            { skill: 'MLOps', importance: 'Medium', progress: 0, resources: ['MLOps.org'] }
        ]
    }
};

export default function SkillsPage() {
    const [selectedRole, setSelectedRole] = useState('frontend');
    const data = skillData[selectedRole];

    return (
        <div style={{ padding: '28px 36px 120px 36px', flex: 1, overflowY: 'auto' }} className="hide-scrollbar">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--d-badge-bg)', color: 'var(--d-badge-text)', padding: '6px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    <FiBarChart2 size={12} /> Skill Gap Analyzer
                </div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color: 'var(--d-text)', marginBottom: 8, letterSpacing: '-0.02em' }}>
                    Identify Your <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Skill Gaps</span>
                </h1>
                <p style={{ color: 'var(--d-sub)', fontSize: '1rem', margin: 0, maxWidth: 600, lineHeight: 1.6 }}>
                    Compare your current tech stack with market requirements for your target role and get actionable learning resources.
                </p>
            </motion.div>

            {/* Role Selector */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
                {roles.map(role => (
                    <button
                        key={role.id}
                        onClick={() => setSelectedRole(role.id)}
                        style={{
                            background: selectedRole === role.id ? 'var(--d-btn-primary)' : 'var(--d-card)',
                            color: selectedRole === role.id ? '#fff' : 'var(--d-text)',
                            border: `1px solid ${selectedRole === role.id ? 'var(--d-btn-primary)' : 'var(--d-border)'}`,
                            padding: '10px 20px', borderRadius: 24, fontSize: '0.9rem', fontWeight: 600,
                            cursor: 'pointer', transition: 'all 0.2s', boxShadow: selectedRole === role.id ? '0 4px 12px rgba(79, 70, 229, 0.3)' : 'none'
                        }}
                    >
                        {role.name}
                    </button>
                ))}
            </div>

            {/* Match Score & Strengths */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, marginBottom: 32 }}>
                <motion.div
                    key={`score-${selectedRole}`}
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    style={{ background: 'var(--d-card)', borderRadius: 16, padding: '28px', border: '1px solid var(--d-border)', boxShadow: 'var(--d-shadow)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                >
                    <div style={{ fontSize: '0.85rem', color: 'var(--d-sub)', fontWeight: 600, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiTarget size={14} /> Role Match Score
                    </div>
                    <div style={{ position: 'relative', width: 140, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--d-border)" strokeWidth="8" />
                            <motion.circle 
                                initial={{ strokeDasharray: '0 251.2' }}
                                animate={{ strokeDasharray: `${(data.matchScore / 100) * 251.2} 251.2` }}
                                transition={{ duration: 1.5, ease: 'easeOut' }}
                                cx="50" cy="50" r="40" fill="none" stroke="url(#scoreGrad)" strokeWidth="8" strokeLinecap="round" 
                            />
                            <defs>
                                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#4f46e5" />
                                    <stop offset="100%" stopColor="#06b6d4" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--d-text)', lineHeight: 1 }}>{data.matchScore}%</span>
                        </div>
                    </div>
                    <div style={{ marginTop: 20, textAlign: 'center', fontSize: '0.85rem', color: 'var(--d-muted)', lineHeight: 1.5 }}>
                        Based on your parsed resume and GitHub projects.
                    </div>
                </motion.div>

                <motion.div
                    key={`strengths-${selectedRole}`}
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    style={{ background: 'var(--d-card)', borderRadius: 16, padding: '28px', border: '1px solid var(--d-border)', boxShadow: 'var(--d-shadow)' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FiCheckCircle size={18} color="var(--d-stat-green)" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--d-text)', fontWeight: 700 }}>Your Strengths</h3>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--d-sub)' }}>Skills you already possess for this role</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                        {data.strengths.map((s: string, i: number) => (
                            <div key={i} style={{ background: 'var(--d-tag-bg)', color: 'var(--d-tag-text)', padding: '8px 16px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <FiCheckCircle size={12} color="var(--d-stat-green)" /> {s}
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Skill Gaps List */}
            <motion.div
                key={`gaps-${selectedRole}`}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: 'var(--d-card)', borderRadius: 16, padding: '28px', border: '1px solid var(--d-border)', boxShadow: 'var(--d-shadow)' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FiAlertCircle size={18} color="#ef4444" />
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--d-text)', fontWeight: 700 }}>Identified Skill Gaps</h3>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--d-sub)' }}>Areas to improve to increase your match score</p>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {data.gaps.map((gap: any, i: number) => (
                        <div key={i} style={{ background: 'var(--d-hover)', border: '1px solid var(--d-border)', borderRadius: 12, padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                        <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--d-text)', fontWeight: 700 }}>{gap.skill}</h4>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: 12, background: gap.importance === 'High' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)', color: gap.importance === 'High' ? '#ef4444' : '#f59e0b', textTransform: 'uppercase' }}>
                                            {gap.importance} Priority
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--d-muted)' }}>
                                        <FiBookOpen size={14} /> Recommended Resources:
                                        {gap.resources.map((r: string, j: number) => (
                                            <span key={j} style={{ color: 'var(--d-accent-text)', fontWeight: 600, cursor: 'pointer' }}>{r}{j < gap.resources.length - 1 ? ', ' : ''}</span>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ minWidth: 150 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--d-sub)', fontWeight: 600 }}>Your Progress</span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--d-text)', fontWeight: 700 }}>{gap.progress}%</span>
                                    </div>
                                    <div style={{ height: 8, background: 'var(--d-input)', borderRadius: 4, overflow: 'hidden' }}>
                                        <motion.div 
                                            initial={{ width: 0 }} animate={{ width: `${gap.progress}%` }} transition={{ duration: 1, delay: 0.2 }}
                                            style={{ height: '100%', background: 'var(--gradient-primary)', borderRadius: 4 }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
