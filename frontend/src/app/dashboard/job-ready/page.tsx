'use client';

import { motion } from 'framer-motion';
import { FiTarget, FiTrendingUp, FiFileText, FiGithub, FiVideo, FiZap } from 'react-icons/fi';
import Link from 'next/link';

const breakdown = [
    { label: 'Resume Quality', pct: 68, weight: '30%', icon: FiFileText, color: 'var(--primary)', tip: 'Add more quantified achievements and keywords' },
    { label: 'GitHub Projects', pct: 72, weight: '25%', icon: FiGithub, color: 'var(--accent)', tip: 'Contribute to 2+ open source projects' },
    { label: 'Interview Skills', pct: 55, weight: '25%', icon: FiVideo, color: '#8B5CF6', tip: 'Practice 10 more system design questions' },
    { label: 'Skill Completeness', pct: 80, weight: '20%', icon: FiZap, color: '#22C55E', tip: 'Learn Docker and CI/CD pipelines' },
];

const suggestions = [
    { icon: '📄', text: 'Add testing coverage to your resume projects', href: '/dashboard/resume' },
    { icon: '⌨️', text: 'Complete 3 LeetCode medium problems this week', href: '/dashboard/interview' },
    { icon: '🐙', text: 'Push a full-stack project with proper README', href: '/dashboard/github' },
    { icon: '💼', text: 'Apply to 5 matched jobs this week', href: '/dashboard/jobs' },
];

function CircularScoreRing({ score }: { score: number }) {
    const size = 200;
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const color = score >= 80 ? '#22C55E' : score >= 60 ? '#F59E0B' : '#EF4444';

    return (
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--d-border)" strokeWidth="14" />
                <motion.circle
                    cx={size / 2} cy={size / 2} r={radius}
                    fill="none" stroke={color} strokeWidth="14"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 2, ease: 'easeOut' }}
                />
            </svg>
            <div style={{
                position: 'absolute', textAlign: 'center',
            }}>
                <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                    style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', fontWeight: 900, color, lineHeight: 1 }}
                >
                    {score}
                </motion.div>
                <div style={{ fontSize: '0.78rem', color: 'var(--d-sub)', fontWeight: 600, marginTop: 4 }}>JOB READY SCORE</div>
            </div>
        </div>
    );
}

export default function JobReadyPage() {
    const score = 74;
    const label = score >= 80 ? 'Job Ready! 🎉' : score >= 60 ? 'Good Progress 🔥' : 'Keep Building 💪';
    const color = score >= 80 ? '#22C55E' : score >= 60 ? '#F59E0B' : '#EF4444';

    return (
        <div style={{ padding: '28px 36px 120px 36px', flex: 1, overflowY: 'auto' }} className="hide-scrollbar">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
                <div className="section-label"><FiTarget size={11} /> Job Ready Score</div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--d-text)', marginBottom: 6 }}>
                    Your <span className="gradient-text">Readiness</span> Score
                </h1>
                <p style={{ color: 'var(--d-sub)', fontSize: '0.9rem', margin: 0 }}>
                    A comprehensive assessment of your job market readiness.
                </p>
            </motion.div>

            {/* Score Display */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 28 }}>
                {/* Big Score Ring */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                    style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        padding: '40px 24px', background: 'var(--d-card)',
                        border: '1px solid var(--d-border)', borderRadius: 16, boxShadow: 'var(--d-shadow)',
                    }}
                >
                    <CircularScoreRing score={score} />
                    <motion.div
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
                        style={{
                            marginTop: 20, padding: '8px 20px', borderRadius: 100,
                            background: `${color}18`, border: `1px solid ${color}30`,
                            color, fontSize: '0.88rem', fontWeight: 700,
                        }}
                    >
                        {label}
                    </motion.div>
                </motion.div>

                {/* Breakdown */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                    style={{
                        background: 'var(--d-card)', border: '1px solid var(--d-border)',
                        borderRadius: 16, padding: '24px', boxShadow: 'var(--d-shadow)'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                        <FiTrendingUp size={16} color="var(--primary)" />
                        <h3 style={{ color: 'var(--d-text)', fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                            Score Breakdown
                        </h3>
                    </div>
                    {breakdown.map((item, i) => (
                        <div key={i} style={{ marginBottom: 18 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{
                                        width: 28, height: 28, borderRadius: 8,
                                        background: `${item.color}18`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <item.icon size={13} color={item.color} />
                                    </div>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--d-text)', fontWeight: 600 }}>{item.label}</span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontSize: '0.88rem', color: item.color, fontWeight: 800 }}>{item.pct}%</span>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--d-muted)', marginLeft: 6 }}>({item.weight})</span>
                                </div>
                            </div>
                            <div style={{ height: 6, background: 'var(--d-input)', borderRadius: 100, overflow: 'hidden' }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.pct}%` }}
                                    transition={{ duration: 1.2, delay: 0.4 + i * 0.12 }}
                                    style={{
                                        height: '100%', borderRadius: 100,
                                        background: `linear-gradient(90deg, ${item.color}, ${item.color}80)`,
                                    }}
                                />
                            </div>
                            <p style={{ fontSize: '0.73rem', color: 'var(--d-muted)', margin: '5px 0 0 0' }}>💡 {item.tip}</p>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Action Suggestions */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--d-text)', fontWeight: 700, marginBottom: 14, fontSize: '1.1rem' }}>
                    🚀 Improve Your Score
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
                    {suggestions.map((s, i) => (
                        <motion.div key={i} whileHover={{ y: -3 }}>
                            <Link href={s.href} style={{ textDecoration: 'none' }}>
                                <div style={{ 
                                    padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
                                    background: 'var(--d-card)', border: '1px solid var(--d-border)', borderRadius: 12, boxShadow: 'var(--d-shadow)'
                                }}>
                                    <span style={{ fontSize: '1.4rem' }}>{s.icon}</span>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--d-sub)', margin: 0, lineHeight: 1.5 }}>{s.text}</p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
