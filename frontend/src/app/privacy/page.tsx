'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiShield, FiLock, FiEye, FiServer } from 'react-icons/fi';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';

function PrivacyContent() {
    const { isDark } = useTheme();

    return (
        <div className="min-h-screen py-24 px-6 transition-colors duration-500" style={{ background: 'var(--d-bg)', color: 'var(--d-text)' }}>
            <div className="max-w-3xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-indigo-500 font-bold mb-12 hover:gap-3 transition-all">
                    <FiArrowLeft /> Back to Home
                </Link>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">Privacy Policy</h1>
                    <p className="text-slate-500 font-medium mb-12">Last Updated: May 10, 2026</p>

                    <div className="prose prose-invert max-w-none space-y-12">
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                                    <FiShield />
                                </div>
                                <h2 className="text-2xl font-bold m-0">Introduction</h2>
                            </div>
                            <p className="opacity-60 leading-relaxed">
                                At DevPilot AI, we build tools to empower developers. To do this effectively, we process data that is deeply personal to your career. 
                                This Privacy Policy explains how we collect, use, and protect your information when you use our AI Career Operating System.
                            </p>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 border border-purple-500/20">
                                    <FiEye />
                                </div>
                                <h2 className="text-2xl font-bold m-0">Information We Collect</h2>
                            </div>
                            <div className="space-y-4 opacity-60">
                                <p><strong>Resume Data:</strong> When you upload a resume, we extract skills, experience, and contact details to provide ATS scoring.</p>
                                <p><strong>GitHub Metadata:</strong> If you connect your GitHub, we analyze repository structures, language distribution, and commit patterns to generate technical insights.</p>
                                <p><strong>Interview Transcripts:</strong> During AI mock interviews, we process your voice or text responses to provide feedback on your technical performance.</p>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                                    <FiLock />
                                </div>
                                <h2 className="text-2xl font-bold m-0">How We Use AI</h2>
                            </div>
                            <p className="opacity-60 leading-relaxed">
                                Your data is processed by advanced Large Language Models (LLMs) to generate career advice. We do not use your personal 
                                resumes or private code to train base models for third parties. All AI processing is temporary and focused solely on 
                                providing you with personalized career intelligence.
                            </p>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-500 border border-pink-500/20">
                                    <FiServer />
                                </div>
                                <h2 className="text-2xl font-bold m-0">Data Retention</h2>
                            </div>
                            <p className="opacity-60 leading-relaxed">
                                You have full control over your data. You can delete your uploaded resumes, GitHub analysis results, and account at any time. 
                                Deleted data is purged from our active databases within 30 days.
                            </p>
                        </section>
                    </div>

                    <div className="mt-24 p-8 rounded-3xl border border-indigo-500/20 bg-indigo-500/5 text-center">
                        <h3 className="text-xl font-bold mb-2">Questions about your data?</h3>
                        <p className="text-sm opacity-60 mb-6">Our security team is ready to help you understand how your career data is protected.</p>
                        <Link href="/contact">
                            <button className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all hover:scale-105">
                                Contact Security Team
                            </button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default function PrivacyPage() {
    return (
        <ThemeProvider>
            <PrivacyContent />
        </ThemeProvider>
    );
}
