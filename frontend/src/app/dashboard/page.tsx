'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiGithub, FiAward, FiTarget, FiTrendingUp } from 'react-icons/fi';
import { useAuth } from '@/lib/auth';
import api from '@/lib/api';
import Link from 'next/link';
import ScoreCard from '@/components/ui/ScoreCard';
import ProgressBar from '@/components/ui/ProgressBar';

interface DashboardStats {
    resumeScore?: number;
    githubScore?: number;
    skillsScore?: number;
    overallScore?: number;
}

export default function DashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Assuming we might not have a dedicated endpoint yet, provide a robust fallback for the mock demo
                await api.get('/dashboard/stats');
                setStats({
                    overallScore: 68,
                    resumeScore: 75,
                    githubScore: 60,
                    skillsScore: 70
                });
            } catch {
                setStats({
                    overallScore: 68,
                    resumeScore: 75,
                    githubScore: 60,
                    skillsScore: 70
                });
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const score = stats?.overallScore || 0;
    
    // Insight calculation
    let insight = "You're getting started!";
    if (score >= 80) insight = "Your profile is looking top-tier. Ready to apply!";
    else if (score >= 60) insight = "You are on the right track, just a few more optimizations!";

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: 8, color: 'var(--foreground)' }}>
                    Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0] || 'Developer'}</span>!
                </h1>
                <p style={{ color: 'var(--muted)', fontSize: '1rem' }}>
                    Here&apos;s your career readiness dashboard. Let&apos;s get you hired.
                </p>
            </motion.div>

            {/* HERO SCORE */}
            {loading ? (
                <div className="skeleton glass-panel" style={{ height: 260, borderRadius: 'var(--radius)' }} />
            ) : (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
                    className="glass-panel" 
                    style={{ 
                        padding: '40px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{
                        position: 'absolute',
                        top: -100,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 400,
                        height: 200,
                        background: 'var(--primary)',
                        filter: 'blur(100px)',
                        opacity: 0.15,
                        borderRadius: '50%'
                    }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                        <FiTarget size={24} color="var(--primary)" />
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, fontFamily: 'var(--font-display)' }}>Job Ready Score</h2>
                    </div>
                    
                    <div style={{ fontSize: '4.5rem', fontWeight: 900, fontFamily: 'var(--font-display)', lineHeight: 1, marginBottom: 16, display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
                        <span style={{ fontSize: '2rem', marginTop: 12, marginRight: 8 }}>🔥</span>
                        <span className="gradient-text">{score}</span>
                        <span style={{ fontSize: '1.5rem', marginTop: 36, marginLeft: 4, color: 'var(--muted)' }}>/ 100</span>
                    </div>

                    <div style={{ width: '100%', maxWidth: 400, marginBottom: 20 }}>
                        <ProgressBar progress={score} color="var(--primary)" height={12} showLabel={false} />
                    </div>

                    <p style={{ fontSize: '1.1rem', color: 'var(--foreground)', fontWeight: 500 }}>
                        {insight} <Link href="/dashboard/results" style={{ color: 'var(--primary)', textDecoration: 'none', marginLeft: 8 }}>See details &rarr;</Link>
                    </p>
                </motion.div>
            )}

            {/* BREAKDOWN CARDS */}
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, marginTop: 16, color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <FiTrendingUp color="var(--accent)" /> Detailed Breakdown
            </h2>
            
            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
                    <div className="skeleton glass-panel" style={{ height: 160 }} />
                    <div className="skeleton glass-panel" style={{ height: 160 }} />
                    <div className="skeleton glass-panel" style={{ height: 160 }} />
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
                    <Link href="/dashboard/resume" style={{ textDecoration: 'none' }}>
                        <ScoreCard 
                            title="Resume Score" 
                            score={stats?.resumeScore || 0} 
                            icon={FiFileText} 
                            color="#3B82F6" 
                            delay={0.2}
                        />
                    </Link>
                    <Link href="/dashboard/github" style={{ textDecoration: 'none' }}>
                        <ScoreCard 
                            title="GitHub Score" 
                            score={stats?.githubScore || 0} 
                            icon={FiGithub} 
                            color="#8B5CF6" 
                            delay={0.3}
                        />
                    </Link>
                    <Link href="/dashboard/interview" style={{ textDecoration: 'none' }}>
                        <ScoreCard 
                            title="Skills Score" 
                            score={stats?.skillsScore || 0} 
                            icon={FiAward} 
                            color="#10B981" 
                            delay={0.4}
                        />
                    </Link>
                </div>
            )}
        </div>
    );
}
