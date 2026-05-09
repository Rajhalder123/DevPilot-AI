'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFileText, FiCheckCircle, FiAlertTriangle, FiSearch, FiTarget, FiZap, FiDownload, FiArrowRight } from 'react-icons/fi';
import UploadBox from '@/components/ui/UploadBox';
import Link from 'next/link';
import api from '@/lib/api';

const SectionCard = ({ emoji, title, color, children, delay = 0 }: { emoji: string; title: string; color: string; children: React.ReactNode; delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        style={{
            padding: '24px',
            borderRadius: '20px',
            background: 'var(--d-card)',
            border: '1px solid var(--d-border)',
            boxShadow: 'var(--d-shadow)',
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
            borderBottom: '1px solid var(--d-border)',
        }}>
            <span style={{ fontSize: '1.2rem' }}>{emoji}</span>
            <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--d-text)', fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>{title}</h3>
            <div style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: color }} />
        </div>
        {children}
    </motion.div>
);

export default function ResumePage() {
    const [file, setFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<any>(null);

    const handleFileSelect = (selectedFile: File) => {
        setFile(selectedFile);
    };

    const handleAnalyze = async () => {
        if (!file) return;
        setIsAnalyzing(true);
        try {
            const formData = new FormData();
            formData.append('resume', file);
            
            const uploadRes = await api.post('/resume/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const resumeId = uploadRes.data.resume._id;

            const analyzeRes = await api.post('/resume/analyze', { resumeId });
            setAnalysis(analyzeRes.data.resume.analysis);
        } catch (error) {
            console.error('Failed to analyze resume:', error);
            alert('Failed to analyze resume. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div style={{ padding: '28px 36px 120px 36px', flex: 1, overflowY: 'auto' }} className="hide-scrollbar">
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: 32 }}>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                        <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: 10, borderRadius: 12 }}>
                            <FiFileText size={24} color="var(--primary)" />
                        </div>
                        <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--d-text)', fontSize: '2rem', fontWeight: 800, margin: 0 }}>
                            Resume <span className="gradient-text">Analyzer</span>
                        </h1>
                    </div>
                    <p style={{ color: 'var(--d-sub)', fontSize: '1rem' }}>
                        Upload your resume to get deep insights into ATS compatibility and keyword alignment.
                    </p>
                </motion.div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24, marginBottom: 32 }}>
                {/* Upload Section */}
                <div style={{ padding: '32px', borderRadius: '24px', background: 'var(--d-card)', border: '1px solid var(--d-border)', boxShadow: 'var(--d-shadow)' }}>
                    <UploadBox file={file} onFileSelect={handleFileSelect} />
                    
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
                        <button
                            className="button-primary"
                            onClick={handleAnalyze}
                            disabled={!file || isAnalyzing}
                            style={{ padding: '12px 32px', fontSize: '1rem', width: '100%', maxWidth: 300 }}
                        >
                            {isAnalyzing ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div className="animate-spin" style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
                                    Analyzing Profile...
                                </span>
                            ) : 'Analyze Resume'}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {analysis && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 24 }}>
                            {/* Score Stats */}
                            <SectionCard emoji="📊" title="Overall Readiness" color="var(--primary)" delay={0.1}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                    <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--primary)', marginBottom: 8 }}>{analysis.overallScore}%</div>
                                    <div style={{ width: '100%', marginBottom: 16 }}>
                                        <div style={{ height: 8, background: 'var(--d-input)', borderRadius: 4, overflow: 'hidden' }}>
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${analysis.overallScore}%` }} transition={{ duration: 1 }} style={{ height: '100%', background: 'var(--primary)' }} />
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--d-muted)', margin: 0 }}>
                                        {analysis.summary}
                                    </p>
                                </div>
                            </SectionCard>

                            {/* Keywords Grid */}
                            <SectionCard emoji="🔍" title="Keyword Analysis" color="#8B5CF6" delay={0.2}>
                                <div style={{ marginBottom: 16 }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--d-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Identified Strengths</div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                        {(analysis.strengths || []).map((k: string, idx: number) => (
                                            <span key={idx} style={{ padding: '4px 10px', background: 'var(--d-badge-bg)', color: 'var(--d-btn-primary)', border: '1px solid var(--d-border)', borderRadius: 100, fontSize: '0.75rem', fontWeight: 600 }}>{k}</span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--d-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Missing Keywords</div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                        {(analysis.keywordGaps || []).map((k: string, idx: number) => (
                                            <span key={idx} style={{ padding: '4px 10px', background: 'rgba(244, 63, 94, 0.05)', color: '#F43F5E', borderRadius: 100, fontSize: '0.75rem', fontWeight: 600 }}>{k}</span>
                                        ))}
                                    </div>
                                </div>
                            </SectionCard>

                            {/* Detailed Feedback */}
                            <SectionCard emoji="💡" title="Expert Recommendations" color="#F59E0B" delay={0.3}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {(analysis.improvements || []).map((text: string, i: number) => (
                                        <div key={i} style={{ display: 'flex', gap: 10 }}>
                                            <FiAlertTriangle color="#F59E0B" style={{ flexShrink: 0, marginTop: 3 }} />
                                            <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--d-text)', lineHeight: 1.5 }}>{text}</p>
                                        </div>
                                    ))}
                                    {(analysis.formattingTips || []).map((text: string, i: number) => (
                                        <div key={`fmt-${i}`} style={{ display: 'flex', gap: 10 }}>
                                            <FiZap color="#3B82F6" style={{ flexShrink: 0, marginTop: 3 }} />
                                            <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--d-text)', lineHeight: 1.5 }}>{text}</p>
                                        </div>
                                    ))}
                                </div>
                            </SectionCard>
                        </div>

                        {/* Action Bar */}
                        <div style={{ padding: '20px 24px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--d-card)', border: '1px solid var(--d-border)', boxShadow: 'var(--d-shadow)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <FiTarget color="var(--primary)" />
                                <span style={{ color: 'var(--d-text)', fontSize: '0.9rem', fontWeight: 600 }}>Ready to generate a tailored cover letter?</span>
                            </div>
                            <Link href="/dashboard/cover-letter" style={{ textDecoration: 'none' }}>
                                <button style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                                    Get Started <FiArrowRight />
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            </div>
        </div>
    );
}
