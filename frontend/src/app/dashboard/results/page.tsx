'use client';

import { motion } from 'framer-motion';
import { FiTarget, FiTrendingUp, FiZap, FiActivity, FiBriefcase, FiAward, FiArrowRight } from 'react-icons/fi';
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

export default function ResultsPage() {
    const focusAreas = [
        { text: "Add 3 more React-specific keywords to your resume.", icon: FiAward, color: "#3B82F6" },
        { text: "Include a testing framework (e.g. Jest) in your GitHub projects.", icon: FiZap, color: "#8B5CF6" },
        { text: "Improve your system design score (practice on Interview Sim).", icon: FiActivity, color: "#10B981" },
        { text: "Complete one more mock interview session.", icon: FiTrendingUp, color: "#F59E0B" }
    ];

    return (
        <div style={{ maxWidth: 900, margin: '0 auto', paddingBottom: 40 }}>
            {/* Back Button */}
            <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--muted)', fontSize: '0.85rem', fontWeight: 600, marginBottom: 24 }}>
                <FiArrowRight style={{ transform: 'rotate(180deg)' }} /> BACK TO DASHBOARD
            </Link>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                        <FiTarget size={28} color="var(--primary)" />
                        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, margin: 0 }}>
                            Career <span className="gradient-text">Readiness</span>
                        </h1>
                    </div>
                    <p style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>Deep dive analysis into your current hiring potential.</p>
                </motion.div>
                
                <button className="button-primary" style={{ padding: '10px 24px' }}>Share Results</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 32 }}>
                {/* Score Visualization */}
                <SectionCard emoji="🎯" title="Overall Score" color="var(--primary)" delay={0.1}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '10px 0' }}>
                        <div style={{ 
                            width: 140, height: 140, borderRadius: '50%', border: '8px solid rgba(59, 130, 246, 0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
                            position: 'relative'
                        }}>
                            <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary)' }}>68</div>
                            <svg style={{ position: 'absolute', top: -8, left: -8, width: 156, height: 156, transform: 'rotate(-90deg)' }}>
                                <circle cx="78" cy="78" r="70" fill="transparent" stroke="var(--primary)" strokeWidth="8" strokeDasharray="440" strokeDashoffset={440 - (440 * 68) / 100} strokeLinecap="round" />
                            </svg>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 4 }}>Great Progress!</div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: 0 }}>You are in the top 30% of platform applicants.</p>
                    </div>
                </SectionCard>

                {/* Focus Areas */}
                <SectionCard emoji="⚡" title="Top Focus Areas" color="#F59E0B" delay={0.2}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {focusAreas.map((area, i) => (
                            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                <div style={{ background: `${area.color}15`, padding: 8, borderRadius: 8, flexShrink: 0 }}>
                                    <area.icon size={14} color={area.color} />
                                </div>
                                <p style={{ fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>{area.text}</p>
                            </div>
                        ))}
                    </div>
                </SectionCard>
            </div>

            {/* Benchmark Section */}
            <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px', background: 'rgba(255,255,255,0.8)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                    <FiTrendingUp color="var(--primary)" size={20} />
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Industry Benchmark</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>
                            <span>Global Applicant Average</span>
                            <span>54%</span>
                        </div>
                        <div style={{ height: 8, background: 'rgba(0,0,0,0.03)', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{ width: '54%', height: '100%', background: 'var(--muted)' }} />
                        </div>
                    </div>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>
                            <span>Your Current Score</span>
                            <span style={{ color: 'var(--primary)' }}>68%</span>
                        </div>
                        <div style={{ height: 8, background: 'rgba(59, 130, 246, 0.1)', borderRadius: 4, overflow: 'hidden' }}>
                            <motion.div initial={{ width: 0 }} animate={{ width: '68%' }} transition={{ duration: 1.5 }} style={{ width: '68%', height: '100%', background: 'var(--primary)' }} />
                        </div>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: 8, fontStyle: 'italic' }}>
                        * Data compiled from 10k+ recent successful placements in Tech MNCs.
                    </p>
                </div>
            </div>
        </div>
    );
}
