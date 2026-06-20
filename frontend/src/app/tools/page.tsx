'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiZap, FiCode, FiCpu, FiFileText, FiDatabase, FiGlobe, FiEdit, FiArrowRight, FiStar } from 'react-icons/fi';

const tools = [
    { icon: FiCode, title: 'Code Generator', desc: 'Generate production-ready code in any language from a simple description.', gradient: 'linear-gradient(135deg, #7C3AED, #5B21B6)', badge: 'Popular', href: '/chat', prompt: 'Generate a ' },
    { icon: FiCpu, title: 'Bug Finder', desc: 'Paste your code and AI will instantly identify bugs, errors, and anti-patterns.', gradient: 'linear-gradient(135deg, #06B6D4, #0891B2)', badge: null, href: '/chat', prompt: 'Find bugs in this code: ' },
    { icon: FiFileText, title: 'Resume Analyzer', desc: 'Upload your resume and get ATS score, improvement tips, and keyword analysis.', gradient: 'linear-gradient(135deg, #EC4899, #BE185D)', badge: 'AI Powered', href: '/chat', prompt: 'Analyze my resume: ' },
    { icon: FiEdit, title: 'Documentation Writer', desc: 'Auto-generate clean, professional documentation for your functions and APIs.', gradient: 'linear-gradient(135deg, #F59E0B, #D97706)', badge: null, href: '/chat', prompt: 'Write documentation for: ' },
    { icon: FiDatabase, title: 'SQL Assistant', desc: 'Write, optimize, and explain complex SQL queries with AI guidance.', gradient: 'linear-gradient(135deg, #10B981, #059669)', badge: null, href: '/chat', prompt: 'Help me write a SQL query for: ' },
    { icon: FiGlobe, title: 'API Builder', desc: 'Design RESTful or GraphQL APIs with schemas, routes, and middleware generated instantly.', gradient: 'linear-gradient(135deg, #7C3AED, #06B6D4)', badge: 'New', href: '/chat', prompt: 'Build an API for: ' },
];

export default function ToolsPage() {
    return (
        <div style={{ padding: '32px 36px', maxWidth: 1100, margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: 40 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700, color: '#A78BFA', marginBottom: 14, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    <FiZap size={11} /> AI Tools
                </div>
                <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.5px', color: '#fff', marginBottom: 8, fontFamily: 'var(--font-outfit)' }}>
                    Your AI Toolkit
                </h1>
                <p style={{ color: '#71717A', fontSize: '0.95rem', lineHeight: 1.7 }}>
                    Specialized AI tools built for developers. Click any tool to start instantly.
                </p>
            </div>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}>
                {tools.map((tool, i) => (
                    <motion.div
                        key={tool.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    >
                        <Link href={`${tool.href}?q=${encodeURIComponent(tool.prompt)}`} style={{ textDecoration: 'none' }}>
                            <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: '28px', cursor: 'pointer', height: '100%', position: 'relative', overflow: 'hidden', transition: 'border-color 0.3s' }}
                                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(124,58,237,0.35)')}
                                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
                            >
                                <div style={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, background: tool.gradient, borderRadius: '50%', filter: 'blur(50px)', opacity: 0.12, pointerEvents: 'none' }} />

                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
                                    <div style={{ width: 46, height: 46, borderRadius: 13, background: tool.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.3)' }}>
                                        <tool.icon size={20} color="#fff" />
                                    </div>
                                    {tool.badge && (
                                        <div style={{ padding: '4px 10px', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 100, fontSize: '0.7rem', fontWeight: 700, color: '#A78BFA' }}>
                                            {tool.badge === 'Popular' && <FiStar size={9} style={{ marginRight: 4, verticalAlign: 'middle' }} />}
                                            {tool.badge}
                                        </div>
                                    )}
                                </div>

                                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: 8, letterSpacing: '-0.2px' }}>{tool.title}</h3>
                                <p style={{ fontSize: '0.87rem', color: '#71717A', lineHeight: 1.65, marginBottom: 20 }}>{tool.desc}</p>

                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#A78BFA', fontSize: '0.82rem', fontWeight: 600 }}>
                                    Launch Tool <FiArrowRight size={14} />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
