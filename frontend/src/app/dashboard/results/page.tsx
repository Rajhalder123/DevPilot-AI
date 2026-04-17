'use client';

import { motion } from 'framer-motion';
import { FiShare2, FiTrendingUp, FiArrowLeft } from 'react-icons/fi';
import ResultPanel from '@/components/ui/ResultPanel';
import Link from 'next/link';

export default function ResultsPage() {
    // Usually fetched, mock data for now
    const score = 68;
    const topImprovements = [
        "Add 3 more React-specific keywords to your resume.",
        "Include a testing framework (e.g. Jest) in your GitHub projects.",
        "Improve your backend architecture score (currently missing Next.js API routes).",
        "Add a cover letter outlining your open source contributions.",
        "Your interview behavioral skills need slight improvement."
    ];

    const handleShare = () => {
        alert("Copied to clipboard! Share on LinkedIn!");
    };

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--muted)', textDecoration: 'none', fontWeight: 500, width: 'fit-content' }}>
                <FiArrowLeft /> Back to Dashboard
            </Link>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
                <div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, marginBottom: 8, color: 'var(--foreground)' }}>
                        Your Readiness <span className="gradient-text">Results</span>
                    </h1>
                    <p style={{ color: 'var(--muted)', fontSize: '1rem' }}>
                        Here is a deep dive into why you scored {score} / 100.
                    </p>
                </div>
                
                <motion.button 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }} 
                    onClick={handleShare}
                    style={{ 
                         background: '#0a66c2', // LinkedIn blue
                         color: '#fff', 
                         border: 'none', 
                         padding: '12px 24px', 
                         borderRadius: '12px', 
                         display: 'flex', 
                         alignItems: 'center', 
                         gap: 10, 
                         fontWeight: 600, 
                         cursor: 'pointer',
                         boxShadow: '0 8px 24px rgba(10, 102, 194, 0.3)'
                    }}>
                    <FiShare2 size={18} /> Share on LinkedIn
                </motion.button>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
                {/* Visual Overview */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    transition={{ delay: 0.1 }}
                    className="glass-panel" 
                    style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
                >
                    <div style={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                        <svg width="200" height="200" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
                            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                            <motion.circle 
                                cx="50" cy="50" r="45" fill="none" stroke="url(#gradient)" strokeWidth="8" strokeLinecap="round" 
                                strokeDasharray="283"
                                initial={{ strokeDashoffset: 283 }}
                                animate={{ strokeDashoffset: 283 - (283 * score) / 100 }}
                                transition={{ duration: 1.5, ease: 'easeOut' }}
                            />
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#3B82F6" />
                                    <stop offset="100%" stopColor="#8B5CF6" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div style={{ fontSize: '3.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}>
                            {score}
                        </div>
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>Job Ready Score</h3>
                    <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: 8 }}>Top 30% of applicants</p>
                </motion.div>

                {/* Top 5 Improvements */}
                <ResultPanel title="Top 5 Focus Areas" icon={FiTrendingUp} iconColor="var(--warning)" delay={0.2}>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: 16, listStyle: 'none', padding: 0 }}>
                        {topImprovements.map((imp, idx) => (
                            <motion.li 
                                key={idx} 
                                initial={{ opacity: 0, x: -10 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                transition={{ delay: 0.3 + (idx * 0.1) }}
                                style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}
                            >
                                <div style={{ 
                                    background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', 
                                    width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                    fontSize: '0.85rem', fontWeight: 700
                                }}>
                                    {idx + 1}
                                </div>
                                <span style={{ color: 'var(--foreground)' }}>{imp}</span>
                            </motion.li>
                        ))}
                    </ul>
                </ResultPanel>
            </div>
            
        </div>
    );
}
