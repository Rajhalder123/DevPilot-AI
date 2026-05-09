'use client';

import { motion } from 'framer-motion';
import { FiMap, FiCheck, FiClock, FiLock, FiArrowRight } from 'react-icons/fi';

const phases = [
    {
        phase: '01', title: 'Fundamentals', status: 'done', weeks: '4-6 weeks', color: '#22C55E',
        skills: ['HTML, CSS, JavaScript ES6+', 'Git & GitHub basics', 'VS Code & DevTools', 'Basic Algorithms & Data Structures'],
        resources: ['freeCodeCamp', 'The Odin Project', 'JavaScript.info'],
    },
    {
        phase: '02', title: 'Core Development', status: 'done', weeks: '6-8 weeks', color: '#22C55E',
        skills: ['React.js fundamentals', 'Node.js & Express', 'REST APIs & JSON', 'MongoDB basics'],
        resources: ['React Docs', 'Node.js Docs', 'Scrimba React', 'MongoDB University'],
    },
    {
        phase: '03', title: 'System Design', status: 'active', weeks: '4-6 weeks', color: '#F59E0B',
        skills: ['Microservices architecture', 'Caching strategies (Redis)', 'Message queues (Kafka)', 'Load balancing & scaling'],
        resources: ['System Design Primer', 'ByteByteGo', 'Educative.io'],
    },
    {
        phase: '04', title: 'Interview Prep', status: 'upcoming', weeks: '4-6 weeks', color: '#F97316',
        skills: ['LeetCode 150 problems', 'Behavioral STAR method', 'Mock interview practice', 'Company-specific prep'],
        resources: ['LeetCode', 'NeetCode.io', 'Blind 75', 'Pramp.com'],
    },
    {
        phase: '05', title: 'Job Applications', status: 'locked', weeks: '2-4 weeks', color: '#EA580C',
        skills: ['Resume / LinkedIn optimization', 'Portfolio showcase', 'Networking & referrals', 'Salary negotiation'],
        resources: ['LinkedIn Jobs', 'DevPilot Job Matcher', 'AngelList', 'Naukri'],
    },
];

const statusIcon = (status: string) => {
    if (status === 'done') return { icon: FiCheck, bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)', color: 'var(--d-stat-green)' };
    if (status === 'active') return { icon: FiArrowRight, bg: 'var(--d-badge-bg)', border: 'var(--d-border-hover)', color: 'var(--d-btn-primary)' };
    if (status === 'upcoming') return { icon: FiClock, bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B' };
    return { icon: FiLock, bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.2)', color: 'var(--d-muted)' };
};

export default function RoadmapPage() {
    return (
        <div style={{ padding: '28px 36px 120px 36px', flex: 1, overflowY: 'auto' }} className="hide-scrollbar">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--d-badge-bg)', color: 'var(--d-badge-text)', padding: '6px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    <FiMap size={12} /> Career Roadmap
                </div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color: 'var(--d-text)', marginBottom: 8, letterSpacing: '-0.02em' }}>
                    Your Career <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Roadmap</span>
                </h1>
                <p style={{ color: 'var(--d-sub)', fontSize: '1rem', margin: 0, maxWidth: 600, lineHeight: 1.6 }}>
                    A personalized 5-phase plan to land your first or next developer job.
                </p>
            </motion.div>

            {/* Progress bar overview */}
            <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                style={{ marginBottom: 40, background: 'var(--d-card)', border: '1px solid var(--d-border)', borderRadius: 16, padding: '24px', boxShadow: 'var(--d-shadow)' }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--d-sub)', fontWeight: 600 }}>Overall Progress</span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--d-btn-primary)', fontWeight: 700 }}>2 / 5 Phases Complete</span>
                </div>
                <div style={{ height: 12, background: 'var(--d-input)', borderRadius: 100, overflow: 'hidden' }}>
                    <motion.div
                        initial={{ width: 0 }} animate={{ width: '40%' }}
                        transition={{ duration: 1.5, delay: 0.3 }}
                        style={{ height: '100%', borderRadius: 100, background: 'var(--gradient-primary)' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: 20, marginTop: 16, flexWrap: 'wrap' }}>
                    {[
                        { label: 'Completed', val: 2, color: 'var(--d-stat-green)' },
                        { label: 'In Progress', val: 1, color: 'var(--d-btn-primary)' },
                        { label: 'Upcoming', val: 2, color: 'var(--d-accent-text)' },
                    ].map((s, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--d-muted)', fontWeight: 500 }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.color }} />
                            <span>{s.val} {s.label}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Timeline */}
            <div style={{ position: 'relative', paddingLeft: 0 }}>
                {phases.map((phase, i) => {
                    const { icon: Icon, bg, border, color } = statusIcon(phase.status);
                    const isLocked = phase.status === 'locked';

                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -24 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15 + i * 0.1 }}
                            style={{ display: 'flex', gap: 20, marginBottom: 20, opacity: isLocked ? 0.6 : 1 }}
                        >
                            {/* Phase indicator */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                                <div style={{
                                    width: 48, height: 48, borderRadius: 14,
                                    background: bg, border: `1px solid ${border}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Icon size={20} color={color} />
                                </div>
                                {i < phases.length - 1 && (
                                    <div style={{
                                        width: 2, flex: 1, marginTop: 8,
                                        background: `linear-gradient(to bottom, ${color}60, transparent)`,
                                        minHeight: 32,
                                    }} />
                                )}
                            </div>

                            {/* Content vCard */}
                            <motion.div 
                                whileHover={{ y: -4 }}
                                transition={{ duration: 0.2 }}
                                style={{
                                    flex: 1, marginBottom: 0,
                                    background: 'var(--d-card)',
                                    borderRadius: 16,
                                    padding: '28px',
                                    boxShadow: 'var(--d-shadow)',
                                    border: '1px solid',
                                    borderColor: phase.status === 'active' ? 'var(--d-border-hover)' : 'var(--d-border)',
                                }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                            <span style={{
                                                fontSize: '0.75rem', fontWeight: 800, color: 'var(--d-sub)',
                                                background: 'var(--d-tag-bg)', padding: '4px 10px', borderRadius: 8,
                                            }}>
                                                PHASE {phase.phase}
                                            </span>
                                            <span style={{
                                                fontSize: '0.72rem', fontWeight: 700,
                                                color: color, background: bg,
                                                padding: '4px 12px', borderRadius: 100,
                                                border: `1px solid ${border}`,
                                                textTransform: 'uppercase', letterSpacing: 0.5,
                                            }}>
                                                {phase.status}
                                            </span>
                                        </div>
                                        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--d-text)', fontSize: '1.3rem', margin: 0 }}>
                                            {phase.title}
                                        </h3>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--d-muted)', fontSize: '0.85rem', fontWeight: 500, background: 'var(--d-hover)', padding: '6px 14px', borderRadius: 20 }}>
                                        <FiClock size={14} /> {phase.weeks}
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, paddingTop: 18, borderTop: '1px solid var(--d-border)' }}>
                                    {/* Skills */}
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--d-muted)', fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Skills to Master</div>
                                        {phase.skills.map((s, j) => (
                                            <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
                                                <span style={{ fontSize: '0.9rem', color: 'var(--d-sub)', fontWeight: 500 }}>{s}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Resources */}
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--d-muted)', fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Recommended Resources</div>
                                        {phase.resources.map((r, j) => (
                                            <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                                <div style={{ width: 6, height: 6, borderRadius: '2px', background: 'var(--d-muted)', flexShrink: 0 }} />
                                                <span style={{ fontSize: '0.9rem', color: 'var(--d-sub)', fontWeight: 500 }}>{r}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
