'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiAward, FiArrowLeft, FiBarChart } from 'react-icons/fi';
import api from '@/lib/api';
import UploadBox from '@/components/ui/UploadBox';
import ResultPanel from '@/components/ui/ResultPanel';

interface Analysis {
    overallScore: number;
    summary: string;
    strengths: string[];
    improvements: string[];
    keywordGaps: string[];
    formattingTips: string[];
    atsScore: number;
}

export default function ResumePage() {
    const [file, setFile] = useState<File | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<Analysis | null>(null);
    const [error, setError] = useState('');

    const handleAnalyze = async () => {
        if (!file) return;
        setAnalyzing(true);
        setError('');
        try {
            const formData = new FormData();
            formData.append('resume', file);
            // Mock integration or use real if backend is ready
            const uploadRes = await api.post('/resume/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const resumeId = uploadRes.data.resume._id;

            const analyzeRes = await api.post('/resume/analyze', { resumeId });
            setAnalysis(analyzeRes.data.resume.analysis);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Analysis failed. Please try again.');
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: 8, color: 'var(--foreground)' }}>
                    Resume <span className="gradient-text">Analyzer</span>
                </h1>
                <p style={{ color: 'var(--muted)', fontSize: '1rem' }}>
                    Upload your resume to get AI-powered feedback, ATS scoring, and keyword gap analysis.
                </p>
            </motion.div>

            {!analysis && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <UploadBox 
                        file={file} 
                        onFileSelect={(f) => { setFile(f); setError(''); }} 
                    />
                    
                    {error && (
                        <div style={{
                            background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
                            borderRadius: 12, padding: '16px', fontSize: '0.9rem', color: 'var(--danger)', marginBottom: 24,
                        }}>
                            {error}
                        </div>
                    )}

                    {file && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="btn-primary"
                            onClick={handleAnalyze}
                            disabled={analyzing}
                            style={{ width: '100%', padding: '18px', fontSize: '1.05rem', opacity: analyzing ? 0.7 : 1, borderRadius: '14px' }}
                        >
                            {analyzing ? '🔍 Analyzing your resume...' : '✨ Spark Magic & Analyze'}
                        </motion.button>
                    )}
                </motion.div>
            )}

            {analysis && (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <button className="btn-secondary" onClick={() => { setAnalysis(null); setFile(null); }} style={{ display: 'flex', alignItems: 'center', gap: 8, border: 'none', padding: '10px 16px', fontSize: '0.9rem' }}>
                            <FiArrowLeft /> Upload Another
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 24 }}>
                        <ResultPanel title="Score Overview" icon={FiBarChart} iconColor="var(--primary)">
                            <div style={{ display: 'flex', gap: 24, justifyContent: 'space-around', margin: '20px 0' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '3.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--primary)' }}>{analysis.overallScore}</div>
                                    <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Overall</div>
                                </div>
                                <div style={{ width: 1, background: 'var(--border-color)' }} />
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '3.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--accent)' }}>{analysis.atsScore}</div>
                                    <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>ATS Match</div>
                                </div>
                            </div>
                            <p style={{ marginTop: 20 }}>{analysis.summary}</p>
                        </ResultPanel>

                        <ResultPanel title="Missing Keywords" icon={FiAward} iconColor="var(--warning)">
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 16 }}>
                                {analysis.keywordGaps?.map((k, i) => (
                                    <span key={i} style={{
                                        background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)',
                                        borderRadius: 20, padding: '6px 14px', fontSize: '0.85rem', color: 'var(--warning)', fontWeight: 500
                                    }}>{k}</span>
                                ))}
                            </div>
                        </ResultPanel>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
                        <ResultPanel title="Strengths" icon={FiCheckCircle} iconColor="var(--success)">
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {analysis.strengths?.map((s, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                        <span style={{ color: 'var(--success)' }}>✓</span>
                                        <span style={{ color: 'var(--foreground)' }}>{s}</span>
                                    </li>
                                ))}
                            </ul>
                        </ResultPanel>
                        
                        <ResultPanel title="To Improve" icon={FiAlertCircle} iconColor="var(--danger)">
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {analysis.improvements?.map((s, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                        <span style={{ color: 'var(--danger)' }}>→</span>
                                        <span style={{ color: 'var(--foreground)' }}>{s}</span>
                                    </li>
                                ))}
                            </ul>
                        </ResultPanel>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
