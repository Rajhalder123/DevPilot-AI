'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiMail, FiMessageSquare, FiGithub, FiLinkedin, FiSend } from 'react-icons/fi';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';

function ContactContent() {
    const { isDark } = useTheme();
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
    };

    return (
        <div className="min-h-screen py-24 px-6 transition-colors duration-500" style={{ background: 'var(--d-bg)', color: 'var(--d-text)' }}>
            <div className="max-w-5xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-indigo-500 font-bold mb-12 hover:gap-3 transition-all">
                    <FiArrowLeft /> Back to Home
                </Link>

                <div className="grid lg:grid-cols-2 gap-20">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tight leading-tight">Let's talk <br /> <span className="text-indigo-500">Careers.</span></h1>
                        <p className="text-lg opacity-60 mb-12 max-w-md">Whether you're a developer seeking career advice, a recruiter looking for talent, or just want to say hi—we're all ears.</p>
                        
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                                    <FiMail size={24} />
                                </div>
                                <div>
                                    <div className="text-xs font-black text-slate-500 uppercase tracking-widest">Email Us</div>
                                    <div className="text-lg font-bold">raj@devpilot.ai</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 border border-purple-500/20">
                                    <FiMessageSquare size={24} />
                                </div>
                                <div>
                                    <div className="text-xs font-black text-slate-500 uppercase tracking-widest">Social Media</div>
                                    <div className="flex gap-4 mt-2">
                                        <FiGithub size={20} className="cursor-pointer hover:text-indigo-500 transition-colors" />
                                        <FiLinkedin size={20} className="cursor-pointer hover:text-indigo-500 transition-colors" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2.5rem] blur opacity-10" />
                        <div className="relative p-8 md:p-10 rounded-[2rem] border border-white/5" style={{ background: 'var(--d-card2)' }}>
                            {sent ? (
                                <div className="py-20 text-center">
                                    <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <FiSend size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                                    <p className="opacity-60">We'll get back to you within 24 hours.</p>
                                    <button onClick={() => setSent(false)} className="mt-8 text-indigo-500 font-bold text-sm">Send another message</button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6 text-left">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Name</label>
                                            <input required type="text" placeholder="Developer Name" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500/50 transition-colors" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Email</label>
                                            <input required type="email" placeholder="dev@domain.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500/50 transition-colors" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Subject</label>
                                        <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500/50 transition-colors">
                                            <option>General Inquiry</option>
                                            <option>Technical Support</option>
                                            <option>Partnership</option>
                                            <option>Account Issue</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Message</label>
                                        <textarea required rows={5} placeholder="How can we help your career?" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500/50 transition-colors resize-none"></textarea>
                                    </div>
                                    <button type="submit" className="w-full py-4 bg-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/20 hover:scale-[1.02] transition-all active:scale-[0.98]">
                                        Dispatch Message <FiSend />
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default function ContactPage() {
    return (
        <ThemeProvider>
            <ContactContent />
        </ThemeProvider>
    );
}
