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
    if (status === 'done') return { icon: FiCheck, bg: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.3)', color: '#22C55E' };
    if (status === 'active') return { icon: FiArrowRight, bg: 'rgba(249, 115, 22, 0.15)', border: 'rgba(249, 115, 22, 0.3)', color: 'var(--primary)' };
    if (status === 'upcoming') return { icon: FiClock, bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.25)', color: 'var(--accent)' };
    return { icon: FiLock, bg: 'rgba(71,85,105,0.15)', border: 'rgba(71,85,105,0.25)', color: '#64748B' };
};

export default function RoadmapPage() {
    return (
        <div>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
                <div className="section-label"><FiMap size={11} /> Career Roadmap</div>
                <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>
                    Your Career <span className="gradient-text">Roadmap</span>
                </h1>
                <p style={{ color: '#475569', fontSize: '0.9rem', margin: 0 }}>
                    A personalized 5-phase plan to land your first or next developer job.
                </p>
            </motion.div>

            {/* Progress bar overview */}
            <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="card" style={{ marginBottom: 28, background: 'rgba(249, 115, 22, 0.04)', borderColor: 'rgba(249, 115, 22, 0.1)' }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>Overall Progress</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700 }}>2 / 5 Phases Complete</span>
                </div>
                <div className="progress-bar" style={{ height: 10 }}>
                    <motion.div
                        initial={{ width: 0 }} animate={{ width: '40%' }}
                        transition={{ duration: 1.5, delay: 0.3 }}
                        style={{ height: '100%', borderRadius: 100, background: 'linear-gradient(90deg, #22C55E, var(--accent))' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
                    {[
                        { label: 'Completed', val: 2, color: '#22C55E' },
                        { label: 'In Progress', val: 1, color: 'var(--primary)' },
                        { label: 'Upcoming', val: 2, color: 'var(--accent)' },
                    ].map((s, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#475569' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
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

                            {/* Content */}
                            <div className="card" style={{
                                flex: 1, marginBottom: 0,
                                borderColor: phase.status === 'active' ? 'rgba(249, 115, 22, 0.25)' :
                                    phase.status === 'done' ? 'rgba(34,197,94,0.15)' : border,
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                                            <span style={{
                                                fontSize: '0.7rem', fontWeight: 800, color: '#475569',
                                                background: 'rgba(15,23,42,0.04)', padding: '2px 8px', borderRadius: 6,
                                            }}>
                                                PHASE {phase.phase}
                                            </span>
                                            <span style={{
                                                fontSize: '0.72rem', fontWeight: 700,
                                                color: color, background: bg,
                                                padding: '2px 10px', borderRadius: 100,
                                                border: `1px solid ${border}`,
                                                textTransform: 'uppercase', letterSpacing: 0.5,
                                            }}>
                                                {phase.status}
                                            </span>
                                        </div>
                                        <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0F172A', fontSize: '1.1rem' }}>
                                            {phase.title}
                                        </h3>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#475569', fontSize: '0.8rem' }}>
                                        <FiClock size={13} /> {phase.weeks}
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                                    {/* Skills */}
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Skills</div>
                                        {phase.skills.map((s, j) => (
                                            <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                                <div style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0 }} />
                                                <span style={{ fontSize: '0.82rem', color: '#475569' }}>{s}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Resources */}
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Resources</div>
                                        {phase.resources.map((r, j) => (
                                            <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#475569', flexShrink: 0 }} />
                                                <span style={{ fontSize: '0.82rem', color: '#475569' }}>{r}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
