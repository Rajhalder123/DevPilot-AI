'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud, FiFileText, FiCheckCircle, FiAlertCircle, FiTrendingUp, FiTarget, FiAward } from 'react-icons/fi';
import api from '@/lib/api';

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

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles[0]) {
            setFile(acceptedFiles[0]);
            setAnalysis(null);
            setError('');
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        maxFiles: 1,
        maxSize: 5 * 1024 * 1024,
    });

    const handleAnalyze = async () => {
        if (!file) return;
        setAnalyzing(true);
        setError('');
        try {
            // Step 1: Upload the resume
            const formData = new FormData();
            formData.append('resume', file);
            const uploadRes = await api.post('/resume/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const resumeId = uploadRes.data.resume._id;

            // Step 2: Analyze with AI using the resumeId
            const analyzeRes = await api.post('/resume/analyze', { resumeId });
            setAnalysis(analyzeRes.data.resume.analysis);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Analysis failed. Please try again.');
        } finally {
            setAnalyzing(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'var(--success)';
        if (score >= 60) return 'var(--warning)';
        return 'var(--danger)';
    };

    return (
        <div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, marginBottom: 4 }}>
                    Resume <span className="gradient-text">Analyzer</span>
                </h1>
                <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: '0.95rem' }}>
                    Upload your resume and get AI-powered feedback, scoring, and optimization tips.
                </p>
            </motion.div>

            {/* Upload zone */}
            {!analysis && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <div
                        {...getRootProps()}
                        style={{
                            border: `2px dashed ${isDragActive ? 'var(--primary)' : 'var(--border-color)'}`,
                            borderRadius: 16,
                            padding: '60px 40px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            background: isDragActive ? 'rgba(108,92,231,0.05)' : 'var(--card)',
                            transition: 'all 0.3s ease',
                            marginBottom: 24,
                        }}
                    >
                        <input {...getInputProps()} />
                        <FiUploadCloud size={48} color={isDragActive ? 'var(--primary)' : 'var(--muted)'} style={{ marginBottom: 16 }} />
                        {file ? (
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
                                    <FiFileText size={18} color="var(--accent)" />
                                    <span style={{ fontWeight: 600 }}>{file.name}</span>
                                </div>
                                <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{(file.size / 1024).toFixed(1)} KB — Click or drop to replace</p>
                            </div>
                        ) : (
                            <div>
                                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 8 }}>
                                    {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
                                </h3>
                                <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>PDF format, max 5MB</p>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div style={{
                            background: 'rgba(255,82,82,0.1)', border: '1px solid rgba(255,82,82,0.3)',
                            borderRadius: 10, padding: '12px 16px', fontSize: '0.85rem', color: 'var(--danger)', marginBottom: 16,
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
                            style={{ width: '100%', padding: '16px', fontSize: '1rem', opacity: analyzing ? 0.7 : 1 }}
                        >
                            {analyzing ? '🔍 Analyzing your resume...' : '✨ Analyze Resume with AI'}
                        </motion.button>
                    )}
                </motion.div>
            )}

            {/* Results */}
            {analysis && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    {/* Score cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
                        {[
                            { label: 'Overall Score', value: analysis.overallScore, icon: FiAward },
                            { label: 'ATS Score', value: analysis.atsScore, icon: FiTarget },
                        ].map((s, i) => (
                            <div key={i} className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
                                <s.icon size={24} color={getScoreColor(s.value)} style={{ marginBottom: 12 }} />
                                <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: getScoreColor(s.value) }}>{s.value}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="card" style={{ marginBottom: 24 }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FiTrendingUp size={18} color="var(--accent)" /> Summary
                        </h3>
                        <p style={{ color: 'var(--muted)', lineHeight: 1.7, fontSize: '0.9rem' }}>{analysis.summary}</p>
                    </div>

                    {/* Strengths & Improvements */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 24 }}>
                        <div className="card">
                            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <FiCheckCircle size={18} color="var(--success)" /> Strengths
                            </h3>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {analysis.strengths?.map((s, i) => (
                                    <li key={i} style={{ fontSize: '0.9rem', color: 'var(--muted)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                        <span style={{ color: 'var(--success)', marginTop: 2 }}>✓</span> {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="card">
                            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <FiAlertCircle size={18} color="var(--warning)" /> Improvements
                            </h3>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {analysis.improvements?.map((s, i) => (
                                    <li key={i} style={{ fontSize: '0.9rem', color: 'var(--muted)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                        <span style={{ color: 'var(--warning)', marginTop: 2 }}>!</span> {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Keyword Gaps */}
                    {analysis.keywordGaps?.length > 0 && (
                        <div className="card" style={{ marginBottom: 24 }}>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 16 }}>
                                🔑 Missing Keywords
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {analysis.keywordGaps.map((k, i) => (
                                    <span key={i} style={{
                                        background: 'rgba(108,92,231,0.1)', border: '1px solid rgba(108,92,231,0.3)',
                                        borderRadius: 20, padding: '6px 14px', fontSize: '0.8rem', color: 'var(--accent)',
                                    }}>{k}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    <button className="btn-secondary" onClick={() => { setAnalysis(null); setFile(null); }} style={{ marginTop: 8 }}>
                        Analyze Another Resume
                    </button>
                </motion.div>
            )}
        </div>
    );
}
