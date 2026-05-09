'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCheckCircle, FiAlertCircle, FiCreditCard, FiActivity } from 'react-icons/fi';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';

function TermsContent() {
    const { isDark } = useTheme();

    return (
        <div className="min-h-screen py-24 px-6 transition-colors duration-500" style={{ background: 'var(--d-bg)', color: 'var(--d-text)' }}>
            <div className="max-w-3xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-indigo-500 font-bold mb-12 hover:gap-3 transition-all">
                    <FiArrowLeft /> Back to Home
                </Link>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">Terms of Service</h1>
                    <p className="text-slate-500 font-medium mb-12">Last Updated: May 10, 2026</p>

                    <div className="prose prose-invert max-w-none space-y-12">
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                                    <FiCheckCircle />
                                </div>
                                <h2 className="text-2xl font-bold m-0">Acceptance of Terms</h2>
                            </div>
                            <p className="opacity-60 leading-relaxed">
                                By accessing or using DevPilot AI, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, 
                                do not use our services. We provide an AI-powered career intelligence platform designed for software developers.
                            </p>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 border border-purple-500/20">
                                    <FiActivity />
                                </div>
                                <h2 className="text-2xl font-bold m-0">Nature of AI Advice</h2>
                            </div>
                            <div className="space-y-4 opacity-60">
                                <p><strong>Suggestions, Not Guarantees:</strong> DevPilot AI provides career insights, ATS scores, and interview feedback based on Large Language Models. These are suggestions and do not guarantee employment, interview invitations, or specific career outcomes.</p>
                                <p><strong>Data Accuracy:</strong> You are responsible for the accuracy of the resumes and code repositories you provide. Inaccurate data will result in inaccurate AI analysis.</p>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                                    <FiCreditCard />
                                </div>
                                <h2 className="text-2xl font-bold m-0">Subscriptions and Payments</h2>
                            </div>
                            <p className="opacity-60 leading-relaxed">
                                Our "Pro License" is a subscription-based service billed monthly. You can cancel at any time through your dashboard settings. 
                                Refunds are handled on a case-by-case basis at our discretion. We reserve the right to change our pricing with 30 days' notice.
                            </p>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                                    <FiAlertCircle />
                                </div>
                                <h2 className="text-2xl font-bold m-0">Prohibited Conduct</h2>
                            </div>
                            <p className="opacity-60 leading-relaxed">
                                You may not use DevPilot AI to: (a) reverse engineer our AI models; (b) scrape job data for commercial use; (c) upload malicious 
                                code or inappropriate content; or (d) impersonate other developers. Violation of these terms will result in immediate account termination.
                            </p>
                        </section>
                    </div>

                    <div className="mt-24 p-8 rounded-3xl border border-indigo-500/20 bg-indigo-500/5 text-center">
                        <h3 className="text-xl font-bold mb-2">Legal Clarity</h3>
                        <p className="text-sm opacity-60 mb-6">We believe in transparent legal terms for the developer community. If you have questions, reach out.</p>
                        <Link href="/contact">
                            <button className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all hover:scale-105">
                                Reach Out to Legal
                            </button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default function TermsPage() {
    return (
        <ThemeProvider>
            <TermsContent />
        </ThemeProvider>
    );
}
