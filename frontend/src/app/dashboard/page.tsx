'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    FiSend, FiMic, FiPaperclip, FiX, FiZap, FiRefreshCw, FiPlus,
    FiCode, FiMessageSquare, FiClock, FiTrendingUp, FiArrowRight,
    FiCopy, FiCheck, FiTerminal, FiAlertCircle, FiGithub,
    FiStar, FiGitBranch, FiFileText
} from 'react-icons/fi';
import { useAuth } from '@/lib/auth';
import api, { getCached } from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useConversation } from '@/context/ConversationContext';

// Ã¢â€â‚¬Ã¢â€â‚¬ Types Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
interface Message { role: string; content: string; }
interface Conversation { _id: string; title?: string; updatedAt: string; messageCount?: number; }
interface DashboardStats { resumeCount: number; githubCount: number; jobCount: number; interviewCount: number; avgInterviewScore: number; }
interface GitHubProject { _id: string; repoName: string; owner: string; language: string; stars: number; forks: number; status: string; createdAt: string; analysis?: { overallScore?: number } }

// Ã¢â€â‚¬Ã¢â€â‚¬ Code block with copy Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
const CodeBlock = ({ children, className }: any) => {
    const [copied, setCopied] = useState(false);
    const lang = className?.replace('language-', '') || 'code';
    return (
        <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(124,58,237,0.2)', marginBottom: 10, marginTop: 10 }}>
            <div style={{ padding: '6px 12px', background: 'rgba(124,58,237,0.08)', borderBottom: '1px solid rgba(124,58,237,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FiTerminal size={11} color="#7C3AED" />
                    <span style={{ fontSize: 11, color: '#7C3AED', fontWeight: 700, textTransform: 'uppercase' }}>{lang}</span>
                </div>
                <button onClick={() => { navigator.clipboard.writeText(String(children)); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                    style={{ background: 'none', border: 'none', color: copied ? '#10B981' : '#71717A', fontSize: 11, cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    {copied ? <FiCheck size={10} /> : <FiCopy size={10} />} {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
            <pre style={{ padding: '12px', background: '#050505', margin: 0, overflowX: 'auto', fontSize: 13, lineHeight: 1.7, color: '#A78BFA' }}>
                <code>{children}</code>
            </pre>
        </div>
    );
};

const mdComponents = {
    code({ node, inline, className, children, ...props }: any) {
        if (inline) return <code style={{ background: 'rgba(124,58,237,0.15)', padding: '1px 5px', borderRadius: 4, fontSize: '0.88em', color: '#A78BFA', fontFamily: 'monospace' }} {...props}>{children}</code>;
        return <CodeBlock className={className}>{children}</CodeBlock>;
    },
};

const quickPrompts = [
    'Write a React hook for debounced search',
    'Fix this: TypeError: Cannot read properties of undefined',
    'Explain async/await vs Promises with examples',
    'Create a Node.js REST API with auth middleware',
];

// Ã¢â€â‚¬Ã¢â€â‚¬ Stat Card Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
const StatCard = ({ icon: Icon, label, value, color, loading }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '20px 22px', display: 'flex', alignItems: 'center', gap: 16 }}
    >
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={18} color={color} />
        </div>
        <div>
            {loading ? (
                <div style={{ width: 40, height: 22, background: 'rgba(255,255,255,0.06)', borderRadius: 6, marginBottom: 4 }} className="animate-pulse" />
            ) : (
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', fontFamily: 'var(--font-outfit)' }}>{value ?? 'Ã¢â‚¬â€'}</div>
            )}
            <div style={{ fontSize: '0.78rem', color: '#71717A', fontWeight: 500 }}>{label}</div>
        </div>
    </motion.div>
);

// Ã¢â€â‚¬Ã¢â€â‚¬ Main Dashboard Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
export default function DashboardPage() {
    const { user } = useAuth();
    const { currentConversationId, setCurrentConversationId } = useConversation();

    // Chat state
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [attachedFile, setAttachedFile] = useState<File | null>(null);
    const [chatMode, setChatMode] = useState(false);

    // Dashboard data
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [githubProjects, setGithubProjects] = useState<GitHubProject[]>([]);
    const [statsLoading, setStatsLoading] = useState(true);
    const [convLoading, setConvLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const bottomRef = useRef<HTMLDivElement>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const recognitionRef = useRef<any>(null);

    // Ã¢â€â‚¬Ã¢â€â‚¬ Fetch all dashboard data Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
    const fetchDashboard = useCallback(async () => {
        setStatsLoading(true);
        setError(null);
        try {
            const [statsRes, githubRes] = await Promise.allSettled([
                getCached('/dashboard/stats', () => api.get('/dashboard/stats')),
                getCached('/github/history',  () => api.get('/github/history')),
            ]);
            if (statsRes.status === 'fulfilled') setStats(statsRes.value.data.stats);
            if (githubRes.status === 'fulfilled') setGithubProjects((githubRes.value.data.projects || []).slice(0, 3));
        } catch (e: any) {
            setError(e.message || 'Failed to load data');
        } finally {
            setStatsLoading(false);
        }
    }, []);

    const fetchConversations = useCallback(async () => {
        setConvLoading(true);
        try {
            const res = await getCached('/career-mentor/conversations', () => api.get('/career-mentor/conversations'));
            setConversations((res.data.conversations || []).slice(0, 5));
        } catch { }
        finally { setConvLoading(false); }
    }, []);

    useEffect(() => { fetchDashboard(); fetchConversations(); }, []);

    // Ã¢â€â‚¬Ã¢â€â‚¬ Load conversation messages when ID changes Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
    useEffect(() => {
        if (!currentConversationId) { setMessages([]); setChatMode(false); return; }
        api.get(`/career-mentor/history/${currentConversationId}`)
            .then(r => { setMessages(r.data.messages || []); setChatMode(true); })
            .catch(() => { });
    }, [currentConversationId]);

    // Ã¢â€â‚¬Ã¢â€â‚¬ Auto-scroll Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

    // Ã¢â€â‚¬Ã¢â€â‚¬ Voice recognition Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SR) return;
        recognitionRef.current = new SR();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.onstart = () => setIsListening(true);
        recognitionRef.current.onresult = (e: any) => { setInput(p => p + ' ' + e.results[0][0].transcript); setIsListening(false); };
        recognitionRef.current.onerror = () => setIsListening(false);
        recognitionRef.current.onend = () => setIsListening(false);
    }, []);

    const toggleListen = () => {
        if (!recognitionRef.current) return;
        try { isListening ? recognitionRef.current.stop() : recognitionRef.current.start(); }
        catch { setIsListening(false); }
    };

    // Ã¢â€â‚¬Ã¢â€â‚¬ Send message Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
    const handleSend = async (e?: React.FormEvent, overrideMsg?: string) => {
        if (e) e.preventDefault();
        const content = overrideMsg ?? (attachedFile ? `[File: ${attachedFile.name}]\n${input.trim()}` : input.trim());
        if (!content) return;
        setChatMode(true);
        setMessages(prev => [...prev, { role: 'user', content }]);
        setInput(''); setAttachedFile(null); setIsTyping(true);
        try {
            const res = await api.post('/career-mentor/chat', {
                message: content,
                conversationId: currentConversationId,
                history: messages.map(m => ({ role: m.role, content: m.content }))
            });
            if (!currentConversationId && res.data.conversationId) {
                setCurrentConversationId(res.data.conversationId);
                fetchConversations(); // refresh history list
            }
            setMessages(prev => [...prev, { role: 'assistant', content: res.data.response || 'How can I help?' }]);
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Connection issue. Please try again.' }]);
        } finally { setIsTyping(false); }
    };

    const startNewChat = () => {
        setCurrentConversationId(null);
        setMessages([]);
        setChatMode(false);
        setInput('');
    };

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

    // Ã¢â€â‚¬Ã¢â€â‚¬ CHAT VIEW Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
    if (chatMode) {
        return (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#050505' }}>
                {/* Chat Topbar */}
                <div style={{ padding: '12px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, background: 'rgba(5,5,5,0.7)', backdropFilter: 'blur(10px)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <motion.div
                            animate={{ boxShadow: ['0 0 0px rgba(124,58,237,0)', '0 0 12px rgba(124,58,237,0.6)', '0 0 0px rgba(124,58,237,0)'] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <FiZap size={13} color="#fff" />
                        </motion.div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>DevPilot AI</div>
                            <div style={{ fontSize: '0.68rem', color: '#10B981', fontWeight: 600 }}>Ã¢ââ— Online  -  Powered by AI</div>
                        </div>
                    </div>
                    <button onClick={startNewChat}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#71717A', padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontSize: '0.82rem', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#71717A'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}>
                        <FiX size={13} /> New Chat
                    </button>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }} className="hide-scrollbar">
                    {messages.map((msg, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                            style={{ display: 'flex', gap: 12, maxWidth: msg.role === 'user' ? '80%' : '100%', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                            <div style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, background: msg.role === 'assistant' ? 'linear-gradient(135deg, #7C3AED, #06B6D4)' : 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 800, border: msg.role === 'user' ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                                {msg.role === 'assistant' ? <FiZap size={13} /> : (user?.name?.charAt(0)?.toUpperCase() || 'U')}
                            </div>
                            <div style={{ background: msg.role === 'user' ? 'linear-gradient(135deg, #7C3AED, #6D28D9)' : '#111', border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.06)', borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px', padding: '12px 16px', maxWidth: '100%', minWidth: 0 }}>
                                {msg.role === 'assistant' ? (
                                    <div style={{ fontSize: '0.9rem', lineHeight: 1.75, color: '#E4E4E7' }}>
                                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>{msg.content}</ReactMarkdown>
                                    </div>
                                ) : (
                                    <p style={{ fontSize: '0.9rem', color: '#fff', lineHeight: 1.6, margin: 0 }}>{msg.content}</p>
                                )}
                            </div>
                        </motion.div>
                    ))}

                    {isTyping && (
                        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <FiZap size={13} color="#fff" />
                            </div>
                            <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px 16px 16px 16px', padding: '14px 18px', display: 'flex', gap: 5, alignItems: 'center' }}>
                                {[0, 0.2, 0.4].map((d, i) => (
                                    <motion.div key={i} animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, delay: d, repeat: Infinity }}
                                        style={{ width: 7, height: 7, borderRadius: '50%', background: '#7C3AED' }} />
                                ))}
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <InputBar input={input} setInput={setInput} attachedFile={attachedFile} setAttachedFile={setAttachedFile}
                    isTyping={isTyping} isListening={isListening} onToggleListen={toggleListen}
                    onSend={handleSend} fileRef={fileRef} textareaRef={textareaRef} />
            </div>
        );
    }

    // Ã¢â€â‚¬Ã¢â€â‚¬ DASHBOARD HOME Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
    return (
        <div style={{ height: '100%', overflowY: 'auto', background: '#050505' }} className="hide-scrollbar">
            <div style={{ padding: '32px 36px 120px', maxWidth: 1100, margin: '0 auto' }}>

                {/* Greeting */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
                    <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', fontFamily: 'var(--font-outfit)', marginBottom: 4 }}>
                        {greeting}, {user?.name?.split(' ')[0] || 'Developer'} </h1>
                    <p style={{ color: '#71717A', fontSize: '0.95rem' }}>What do you want to build today?</p>
                </motion.div>

                {/* Error Banner */}
                {error && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, marginBottom: 20 }}>
                        <FiAlertCircle size={16} color="#FCA5A5" />
                        <span style={{ fontSize: '0.85rem', color: '#FCA5A5', flex: 1 }}>{error}</span>
                        <button onClick={fetchDashboard} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#FCA5A5', padding: '5px 12px', borderRadius: 6, fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}>
                            <FiRefreshCw size={12} /> Retry
                        </button>
                    </div>
                )}

                {/* Quick AI Prompt Input */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    style={{ background: '#111', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 16, padding: '16px 20px', marginBottom: 28, boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}>
                    <form onSubmit={handleSend} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <FiZap size={15} color="#fff" />
                        </div>
                        <input
                            type="text" value={input} onChange={e => setInput(e.target.value)}
                            placeholder="Ask DevPilot AI anything..."
                            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.95rem', fontFamily: 'var(--font-inter)' }}
                        />
                        <motion.button type="submit" disabled={!input.trim()}
                            whileHover={input.trim() ? { scale: 1.05 } : {}} whileTap={input.trim() ? { scale: 0.95 } : {}}
                            style={{ width: 36, height: 36, background: input.trim() ? 'linear-gradient(135deg, #7C3AED, #06B6D4)' : 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() ? 'pointer' : 'default', opacity: input.trim() ? 1 : 0.4, transition: 'all 0.2s', flexShrink: 0 }}>
                            <FiSend size={15} color="#fff" />
                        </motion.button>
                    </form>

                    {/* Quick prompts */}
                    <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
                        {quickPrompts.map(qp => (
                            <button key={qp} onClick={() => handleSend(undefined, qp)}
                                style={{ padding: '5px 12px', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 20, fontSize: '0.75rem', color: '#A78BFA', cursor: 'pointer', fontWeight: 600, transition: 'all 0.15s', whiteSpace: 'nowrap' }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.15)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.08)'; }}>
                                {qp}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Stats Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
                    <StatCard icon={FiMessageSquare} label="AI Chats" value={conversations.length} color="#7C3AED" loading={convLoading} />
                    <StatCard icon={FiCode} label="GitHub Projects" value={stats?.githubCount ?? githubProjects.length} color="#06B6D4" loading={statsLoading} />
                    <StatCard icon={FiTrendingUp} label="AI Interviews" value={stats?.interviewCount} color="#10B981" loading={statsLoading} />
                    <StatCard icon={FiZap} label="Resumes Analyzed" value={stats?.resumeCount} color="#F59E0B" loading={statsLoading} />
                </div>

                {/* Two column: Recent Chats + GitHub */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

                    {/* Recent Chat History */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '22px', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FiMessageSquare size={15} color="#A78BFA" />
                                </div>
                                <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>Recent Chats</h2>
                            </div>
                            <Link href="/chat" style={{ textDecoration: 'none' }}>
                                <button onClick={() => setCurrentConversationId(null)}
                                    style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', border: 'none', borderRadius: 7, padding: '5px 12px', color: '#fff', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                                    <FiPlus size={12} /> New Chat
                                </button>
                            </Link>
                        </div>

                        {convLoading ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {[1, 2, 3].map(i => (
                                    <div key={i} style={{ height: 52, background: 'rgba(255,255,255,0.04)', borderRadius: 10 }} className="animate-pulse" />
                                ))}
                            </div>
                        ) : conversations.length === 0 ? (
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 0', textAlign: 'center' }}>
                                <FiMessageSquare size={28} color="#3F3F46" style={{ marginBottom: 10 }} />
                                <p style={{ fontSize: '0.85rem', color: '#3F3F46' }}>No chats yet. Start a conversation!</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {conversations.map(conv => (
                                    <button key={conv._id}
                                        onClick={() => setCurrentConversationId(conv._id)}
                                        style={{ textAlign: 'left', width: '100%', background: currentConversationId === conv._id ? 'rgba(124,58,237,0.1)' : 'transparent', border: `1px solid ${currentConversationId === conv._id ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.04)'}`, borderRadius: 10, padding: '10px 14px', cursor: 'pointer', transition: 'all 0.15s' }}
                                        onMouseEnter={e => { if (currentConversationId !== conv._id) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                                        onMouseLeave={e => { if (currentConversationId !== conv._id) e.currentTarget.style.background = 'transparent'; }}>
                                        <div style={{ fontSize: '0.85rem', color: '#E4E4E7', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>
                                            {conv.title || 'Chat session'}
                                        </div>
                                        <div style={{ fontSize: '0.72rem', color: '#3F3F46', display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <FiClock size={10} />
                                            {new Date(conv.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </button>
                                ))}
                                <Link href="/history" style={{ textDecoration: 'none', marginTop: 4 }}>
                                    <button style={{ width: '100%', padding: '8px', background: 'transparent', border: '1px dashed rgba(255,255,255,0.06)', borderRadius: 10, color: '#71717A', fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'; e.currentTarget.style.color = '#A78BFA'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#71717A'; }}>
                                        View All History <FiArrowRight size={12} />
                                    </button>
                                </Link>
                            </div>
                        )}
                    </motion.div>

                    {/* GitHub Projects */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                        style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '22px', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FiGithub size={15} color="#67E8F9" />
                                </div>
                                <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>GitHub Projects</h2>
                            </div>
                            <Link href="/chat?q=Analyze%20my%20GitHub%20projects" style={{ textDecoration: 'none' }}>
                                <button style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 7, padding: '5px 12px', color: '#67E8F9', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                                    Analyze
                                </button>
                            </Link>
                        </div>

                        {statsLoading ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {[1, 2, 3].map(i => <div key={i} style={{ height: 60, background: 'rgba(255,255,255,0.04)', borderRadius: 10 }} className="animate-pulse" />)}
                            </div>
                        ) : githubProjects.length === 0 ? (
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 0', textAlign: 'center' }}>
                                <FiGithub size={28} color="#3F3F46" style={{ marginBottom: 10 }} />
                                <p style={{ fontSize: '0.85rem', color: '#3F3F46', marginBottom: 12 }}>No repos analyzed yet.</p>
                                <button onClick={() => handleSend(undefined, 'Help me connect and analyze my GitHub repositories')}
                                    style={{ padding: '7px 16px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 8, color: '#A78BFA', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
                                    Connect GitHub
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {githubProjects.map(proj => (
                                    <div key={proj._id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, padding: '12px 14px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#E4E4E7', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{proj.repoName}</div>
                                            {proj.analysis?.overallScore && (
                                                <div style={{ padding: '2px 8px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 6, fontSize: '0.7rem', color: '#10B981', fontWeight: 700, flexShrink: 0, marginLeft: 8 }}>
                                                    {proj.analysis.overallScore}/10
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', gap: 12, fontSize: '0.72rem', color: '#71717A', alignItems: 'center' }}>
                                            {proj.language && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FiCode size={10} /> {proj.language}</span>}
                                            {proj.stars > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><FiStar size={10} /> {proj.stars}</span>}
                                            {proj.forks > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><FiGitBranch size={10} /> {proj.forks}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                </div>

                {/* Ã¢â€â‚¬Ã¢â€â‚¬ Voice AI Assistant + Resume Analyzer Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

                    {/* Voice AI Assistant */}
                    <VoiceAssistant onSend={handleSend} isListening={isListening} onToggleListen={toggleListen} />

                    {/* Resume Analyzer */}
                    <ResumeAnalyzer onResult={(summary: string) => handleSend(undefined, `Analyze this resume feedback and suggest improvements: ${summary}`)} />
                </div>

                {/* Quick Action Tiles */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#3F3F46', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Quick Actions</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                        {[
                            { label: 'Chat', desc: 'AI Developer Chat', icon: FiMessageSquare, color: '#7C3AED', href: '/chat', prompt: null },
                            { label: 'AI Tools', desc: 'Code generator & more', icon: FiZap, color: '#06B6D4', href: '/tools', prompt: null },
                            { label: 'Templates', desc: 'Project starters', icon: FiCode, color: '#10B981', href: '/templates', prompt: null },
                            { label: 'History', desc: 'Past conversations', icon: FiClock, color: '#F59E0B', href: '/history', prompt: null },
                        ].map((item, i) => (
                            <motion.div key={item.label} whileHover={{ y: -3, transition: { duration: 0.15 } }}>
                                <Link href={item.href} style={{ textDecoration: 'none' }}>
                                    <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '18px 16px', cursor: 'pointer', transition: 'border-color 0.2s', textAlign: 'center' }}
                                        onMouseEnter={e => (e.currentTarget.style.borderColor = `${item.color}40`)}
                                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}>
                                        <div style={{ width: 40, height: 40, borderRadius: 12, background: `${item.color}18`, border: `1px solid ${item.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                                            <item.icon size={18} color={item.color} />
                                        </div>
                                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff', marginBottom: 3 }}>{item.label}</div>
                                        <div style={{ fontSize: '0.72rem', color: '#71717A' }}>{item.desc}</div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Floating Input Bar */}
            <div style={{ position: 'fixed', bottom: 0, left: '260px', right: 0, padding: '16px 36px 20px', background: 'linear-gradient(to top, #050505 60%, transparent)', zIndex: 50, transition: 'left 0.3s' }}>
                <InputBar input={input} setInput={setInput} attachedFile={attachedFile} setAttachedFile={setAttachedFile}
                    isTyping={isTyping} isListening={isListening} onToggleListen={toggleListen}
                    onSend={handleSend} fileRef={fileRef} textareaRef={textareaRef} />
            </div>
            <input type="file" ref={fileRef} style={{ display: 'none' }} onChange={e => e.target.files?.[0] && setAttachedFile(e.target.files[0])} />
        </div>
    );
}

// Ã¢â€â‚¬Ã¢â€â‚¬ Voice Assistant Modal (Google Assistant style) Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
// Stable waveform heights Ã¢â‚¬â€ no Math.random() in render (causes layout jumps)
const LISTEN_BARS = [0.4, 1.6, 0.8, 2.1, 0.6, 1.9, 0.5, 1.3, 2.0, 0.7, 1.7, 0.4, 2.2, 0.9, 1.5, 0.6, 1.8, 0.5];
const SPEAK_BARS  = [0.5, 2.0, 1.0, 2.5, 0.7, 2.2, 0.6, 1.4, 2.3, 0.8, 2.0, 0.5, 2.4, 1.1, 1.8, 0.7, 2.1, 0.6];

// ── Voice Assistant Modal ─────────────────────────────────────────────────────

// Helper: split AI reply into sentence-lines for animated reveal
function splitIntoLines(text: string): string[] {
    return text
        .split(/(?<=[.!?])\s+(?=[A-Z0-9"])|\n+/)
        .map(s => s.trim())
        .filter(Boolean);
}

// AI message bubble: animates each sentence in line by line
function AIMessageBubble({ text, isLatest, onDelete }: { text: string; isLatest: boolean; onDelete: () => void }) {
    const lines = splitIntoLines(text);
    const [visibleLines, setVisibleLines] = useState(isLatest ? 0 : lines.length);
    const [hovered, setHovered] = useState(false);

    useEffect(() => {
        if (!isLatest) { setVisibleLines(lines.length); return; }
        setVisibleLines(0);
        let idx = 0;
        const show = () => {
            setVisibleLines(v => v + 1);
            idx++;
            if (idx < lines.length) setTimeout(show, Math.min(600, 280 + lines[idx - 1].length * 3));
        };
        const t = setTimeout(show, 100);
        return () => clearTimeout(t);
    }, [text]);

    return (
        <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
            style={{ display: 'flex', alignItems: 'flex-start', gap: 8, position: 'relative' }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg,#7C3AED,#06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                <span style={{ fontSize: '0.52rem', color: '#fff', fontWeight: 800 }}>AI</span>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                {lines.slice(0, visibleLines).map((line, li) => (
                    <motion.div key={li}
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        style={{ padding: '8px 12px', borderRadius: li === 0 ? '4px 14px 14px 14px' : 12, background: 'rgba(124,58,237,0.09)', border: '1px solid rgba(124,58,237,0.14)', fontSize: '0.84rem', color: '#D4D4D8', lineHeight: 1.55 }}>
                        {line}
                        {isLatest && li === visibleLines - 1 && visibleLines < lines.length && (
                            <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}
                                style={{ display: 'inline-block', width: 2, height: '0.85em', background: '#7C3AED', marginLeft: 3, verticalAlign: 'middle', borderRadius: 1 }} />
                        )}
                    </motion.div>
                ))}
            </div>
            {hovered && (
                <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    onClick={onDelete}
                    style={{ position: 'absolute', top: -7, left: 32, width: 20, height: 20, borderRadius: '50%', background: 'rgba(239,68,68,0.14)', border: '1px solid rgba(239,68,68,0.28)', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                    <FiX size={10} />
                </motion.button>
            )}
        </div>
    );
}

const LISTEN_BARS_V = [0.4, 1.6, 0.8, 2.1, 0.6, 1.9, 0.5, 1.3, 2.0, 0.7, 1.7, 0.4, 2.2, 0.9, 1.5, 0.6, 1.8, 0.5];
const SPEAK_BARS_V  = [0.5, 2.0, 1.0, 2.5, 0.7, 2.2, 0.6, 1.4, 2.3, 0.8, 2.0, 0.5, 2.4, 1.1, 1.8, 0.7, 2.1, 0.6];

function VoiceAssistantModal({ onClose }: { onClose: () => void }) {
    const [transcript, setTranscript] = useState('');
    const [voiceStatus, setVoiceStatus] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
    const [history, setHistory] = useState<{ id: number; role: 'user' | 'ai'; text: string }[]>([]);
    const [latestAiId, setLatestAiId] = useState<number | null>(null);
    const recognitionRef = useRef<any>(null);
    const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
    const historyRef = useRef<HTMLDivElement>(null);
    const sendTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const idCounter = useRef(0);

    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = prev; };
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SR) return;
        const r = new SR();
        r.continuous = true; r.interimResults = true;
        r.onstart = () => setVoiceStatus('listening');
        r.onresult = (e: any) => { let full = ''; for (let i = 0; i < e.results.length; i++) full += e.results[i][0].transcript; setTranscript(full); };
        r.onend = () => setVoiceStatus(v => v === 'listening' ? 'idle' : v);
        r.onerror = () => setVoiceStatus('idle');
        recognitionRef.current = r;
        try { r.start(); } catch { }
        return () => { try { r.stop(); } catch { } };
    }, []);

    useEffect(() => {
        if (historyRef.current) historyRef.current.scrollTo({ top: historyRef.current.scrollHeight, behavior: 'smooth' });
    }, [history]);

    useEffect(() => {
        if (!transcript || voiceStatus !== 'listening') return;
        if (sendTimer.current) clearTimeout(sendTimer.current);
        sendTimer.current = setTimeout(() => { if (transcript.trim()) sendVoiceMessage(transcript.trim()); }, 1800);
        return () => { if (sendTimer.current) clearTimeout(sendTimer.current); };
    }, [transcript]);

    const speak = (text: string) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utt = new SpeechSynthesisUtterance(text);
        utt.rate = 1.0; utt.pitch = 1; utt.volume = 1;
        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(v => v.lang.startsWith('en') && v.localService);
        if (preferred) utt.voice = preferred;
        utt.onstart = () => setVoiceStatus('speaking');
        utt.onend = () => { setVoiceStatus('idle'); setTimeout(() => { try { recognitionRef.current?.start(); } catch { } }, 600); };
        utt.onerror = () => setVoiceStatus('idle');
        synthRef.current = utt;
        window.speechSynthesis.speak(utt);
    };

    const stopAll = () => { try { recognitionRef.current?.stop(); } catch { } window.speechSynthesis?.cancel(); setVoiceStatus('idle'); };
    const handleClose = () => { stopAll(); onClose(); };

    const toggleMic = () => {
        if (voiceStatus === 'speaking') { window.speechSynthesis?.cancel(); setVoiceStatus('idle'); return; }
        if (voiceStatus === 'listening') { try { recognitionRef.current?.stop(); } catch { } }
        else { setTranscript(''); try { recognitionRef.current?.start(); } catch { } }
    };

    const deleteMessage = (id: number) => setHistory(h => h.filter(m => m.id !== id));
    const clearAll = () => { stopAll(); setHistory([]); setTranscript(''); setLatestAiId(null); };

    const sendVoiceMessage = async (msg: string) => {
        if (!msg.trim()) return;
        try { recognitionRef.current?.stop(); } catch { }
        setTranscript('');
        const userId = ++idCounter.current;
        setHistory(h => [...h, { id: userId, role: 'user', text: msg }]);
        setVoiceStatus('processing');
        try {
            const res = await api.post('/career-mentor/chat', { message: msg, history: [] });
            const reply = res.data.response || 'Got it!';
            const aiId = ++idCounter.current;
            setHistory(h => [...h, { id: aiId, role: 'ai', text: reply }]);
            setLatestAiId(aiId);
            const plain = reply.replace(/```[\s\S]*?```/g, 'code block').replace(/[#*`_~>]/g, '').trim();
            speak(plain);
        } catch {
            const errId = ++idCounter.current;
            setHistory(h => [...h, { id: errId, role: 'ai', text: 'Could not connect. Please try again.' }]);
            setLatestAiId(errId);
            setVoiceStatus('idle');
        }
    };

    const statusDotColor = voiceStatus === 'listening' ? '#EF4444' : voiceStatus === 'speaking' ? '#06B6D4' : '#7C3AED';
    const orbBg = { idle: 'linear-gradient(135deg,#7C3AED,#06B6D4)', listening: 'radial-gradient(circle at 40% 40%,#EF4444,#7C3AED)', processing: 'linear-gradient(135deg,#3F3F46,#1C1C1C)', speaking: 'radial-gradient(circle at 40% 40%,#06B6D4,#7C3AED)' };
    const orbShadow = { idle: '0 12px 40px rgba(124,58,237,0.35)', listening: '0 0 50px rgba(239,68,68,0.4),0 0 20px rgba(124,58,237,0.3)', processing: '0 4px 20px rgba(0,0,0,0.5)', speaking: '0 0 50px rgba(6,182,212,0.4)' };

    return (
        <motion.div key="voice-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
            style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>

            <motion.div initial={{ scale: 0.92, opacity: 0, y: 24 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0, y: 24 }}
                transition={{ type: 'spring', damping: 26, stiffness: 290 }}
                onClick={e => e.stopPropagation()}
                style={{ width: '100%', maxWidth: 540, maxHeight: '88vh', background: 'linear-gradient(160deg,#0C0C14 0%,#09090F 100%)', borderRadius: 26, border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 40px 80px rgba(0,0,0,0.75),0 0 0 1px rgba(124,58,237,0.08)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px 13px', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.4, repeat: Infinity }}
                            style={{ width: 7, height: 7, borderRadius: '50%', background: statusDotColor, flexShrink: 0 }} />
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#A1A1AA', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                            {voiceStatus === 'listening' ? 'Listening...' : voiceStatus === 'processing' ? 'Thinking...' : voiceStatus === 'speaking' ? 'Speaking...' : 'DevPilot Voice'}
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {history.length > 0 && (
                            <button onClick={clearAll}
                                style={{ padding: '4px 10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 20, fontSize: '0.68rem', fontWeight: 600, color: '#F87171', cursor: 'pointer' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.16)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}>
                                Clear all
                            </button>
                        )}
                        <button onClick={handleClose}
                            style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#71717A', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.18)'; e.currentTarget.style.color = '#EF4444'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#71717A'; }}>
                            <FiX size={13} />
                        </button>
                    </div>
                </div>

                {/* Conversation history (scrollable) */}
                <div ref={historyRef} style={{ flex: 1, overflowY: 'auto', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }} className="hide-scrollbar">
                    {history.length === 0 && voiceStatus === 'idle' && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '24px 0', opacity: 0.38 }}>
                            <FiMic size={28} color="#71717A" />
                            <p style={{ fontSize: '0.82rem', color: '#71717A', margin: 0 }}>Tap the orb below or speak to start</p>
                        </div>
                    )}
                    <AnimatePresence>
                        {history.map(msg => (
                            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}>
                                {msg.role === 'user' ? (
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'relative' }}
                                        onMouseEnter={e => { const b = e.currentTarget.querySelector('.del-btn') as HTMLElement; if (b) b.style.opacity='1'; }}
                                        onMouseLeave={e => { const b = e.currentTarget.querySelector('.del-btn') as HTMLElement; if (b) b.style.opacity='0'; }}>
                                        <div style={{ maxWidth: '78%', padding: '9px 14px', borderRadius: '14px 4px 14px 14px', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)', fontSize: '0.85rem', color: '#C4B5FD', lineHeight: 1.5 }}>
                                            {msg.text}
                                        </div>
                                        <button className="del-btn" onClick={() => deleteMessage(msg.id)}
                                            style={{ position: 'absolute', top: -7, right: -7, width: 20, height: 20, borderRadius: '50%', background: 'rgba(239,68,68,0.14)', border: '1px solid rgba(239,68,68,0.28)', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.15s' }}>
                                            <FiX size={9} />
                                        </button>
                                    </div>
                                ) : (
                                    <AIMessageBubble text={msg.text} isLatest={msg.id === latestAiId} onDelete={() => deleteMessage(msg.id)} />
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {voiceStatus === 'processing' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg,#7C3AED,#06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <span style={{ fontSize: '0.52rem', color: '#fff', fontWeight: 800 }}>AI</span>
                            </div>
                            <div style={{ display: 'flex', gap: 4 }}>
                                {[0, 1, 2].map(i => (
                                    <motion.div key={i} animate={{ y: [0, -5, 0] }} transition={{ duration: 0.55, delay: i * 0.14, repeat: Infinity }}
                                        style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(124,58,237,0.55)' }} />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Live transcript pill */}
                {voiceStatus === 'listening' && (
                    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                        style={{ margin: '0 18px', padding: '8px 14px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 10, flexShrink: 0 }}>
                        <p style={{ fontSize: '0.82rem', color: transcript ? '#F9A8D4' : '#52525B', margin: 0, fontStyle: transcript ? 'normal' : 'italic' }}>
                            {transcript || 'Speak now...'}
                        </p>
                    </motion.div>
                )}

                {/* Orb + waveform */}
                <div style={{ padding: '18px 18px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, flexShrink: 0, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ position: 'relative', width: 86, height: 86, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {(voiceStatus === 'listening' || voiceStatus === 'speaking') && [1, 2, 3].map(i => (
                            <motion.div key={i} animate={{ scale: [1, 1.48 + i * 0.22], opacity: [0.3, 0] }}
                                transition={{ duration: 1.6, delay: i * 0.38, repeat: Infinity, ease: 'easeOut' }}
                                style={{ position: 'absolute', width: 74, height: 74, borderRadius: '50%', border: `1.5px solid ${voiceStatus === 'listening' ? 'rgba(239,68,68,0.5)' : 'rgba(6,182,212,0.5)'}`, pointerEvents: 'none' }} />
                        ))}
                        <motion.button onClick={toggleMic}
                            animate={voiceStatus !== 'idle' && voiceStatus !== 'processing' ? { scale: [1, voiceStatus === 'listening' ? 1.06 : 1.04, 1] } : voiceStatus === 'processing' ? { scale: [1, 0.94, 1] } : {}}
                            transition={{ duration: 1.2, repeat: voiceStatus !== 'idle' ? Infinity : 0, ease: 'easeInOut' }}
                            style={{ width: 74, height: 74, borderRadius: '50%', border: 'none', cursor: 'pointer', background: orbBg[voiceStatus], display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: orbShadow[voiceStatus], transition: 'background 0.4s,box-shadow 0.4s', position: 'relative', zIndex: 1 }}>
                            {voiceStatus === 'processing' ? (
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                                    style={{ width: 24, height: 24, border: '3px solid rgba(255,255,255,0.15)', borderTopColor: '#fff', borderRadius: '50%' }} />
                            ) : voiceStatus === 'speaking' ? (
                                <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end' }}>
                                    {[7, 14, 10, 18, 7].map((bh, i) => (
                                        <motion.div key={i} animate={{ scaleY: [1, 2.0, 0.7, 1.8, 1] }} transition={{ duration: 0.6, delay: i * 0.09, repeat: Infinity }}
                                            style={{ width: 3, height: bh, background: '#fff', borderRadius: 2, transformOrigin: 'bottom' }} />
                                    ))}
                                </div>
                            ) : <FiMic size={26} color="#fff" />}
                        </motion.button>
                    </div>
                    <div style={{ height: 26, display: 'flex', gap: 2.5, alignItems: 'center', justifyContent: 'center' }}>
                        {(voiceStatus === 'listening' || voiceStatus === 'speaking') && (voiceStatus === 'listening' ? LISTEN_BARS_V : SPEAK_BARS_V).map((scale, i) => (
                            <motion.div key={i} animate={{ scaleY: [0.2, scale, 0.2] }}
                                transition={{ duration: 0.5 + i * 0.018, delay: i * 0.032, repeat: Infinity, ease: 'easeInOut' }}
                                style={{ width: 2.5, height: 20, borderRadius: 2, transformOrigin: 'center', background: voiceStatus === 'listening' ? `rgba(239,68,68,${0.38 + (i % 4) * 0.14})` : `rgba(6,182,212,${0.38 + (i % 4) * 0.14})` }} />
                        ))}
                    </div>
                    <p style={{ fontSize: '0.66rem', color: '#3F3F46', margin: 0, textAlign: 'center' }}>
                        {voiceStatus === 'listening' ? 'Auto-sends after 1.8s silence - tap orb to stop' : voiceStatus === 'speaking' ? 'Tap orb to stop - listens again after' : 'Tap orb to start listening'}
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}

// â”€â”€ Voice AI Assistant Card (trigger) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function VoiceAssistant({ onSend }: any) {
    const [modalOpen, setModalOpen] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [aiReply, setAiReply] = useState('');
    const [voiceStatus, setVoiceStatus] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
    const recognitionRef = useRef<any>(null);
    const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Card just triggers the modal
    return (
        <>
            {/* Portal-style modal rendered above all content */}
            {modalOpen && <VoiceAssistantModal onClose={() => setModalOpen(false)} />}

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
                style={{ background: '#111', border: `1px solid ${modalOpen ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 16, padding: '24px', display: 'flex', flexDirection: 'column', gap: 16, cursor: 'pointer', transition: 'all 0.3s' }}
                onClick={() => !modalOpen && setModalOpen(true)}
                whileHover={{ borderColor: 'rgba(239,68,68,0.35)', boxShadow: '0 8px 30px rgba(239,68,68,0.12)' }}>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FiMic size={16} color="#F87171" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: 1 }}>Voice AI Assistant</h2>
 <p style={{ fontSize: '0.72rem', color: '#71717A' }}>Click to open - Auto-listen - AI speaks back</p>
                    </div>
                    {modalOpen && (
                        <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }}
                            style={{ padding: '3px 10px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 20, fontSize: '0.68rem', fontWeight: 700, color: '#F87171', letterSpacing: '0.04em' }}>
                            LIVE
                        </motion.div>
                    )}
                </div>

                {/* Preview orb */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <motion.div
                        animate={{ boxShadow: ['0 0 0px rgba(124,58,237,0)', '0 0 25px rgba(124,58,237,0.4)', '0 0 0px rgba(124,58,237,0)'] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                        style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(124,58,237,0.3)' }}>
                        <FiMic size={28} color="#fff" />
                    </motion.div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={e => { e.stopPropagation(); setModalOpen(true); }}
                    style={{ padding: '11px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, color: '#F87171', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <FiMic size={15} /> Start Voice Assistant
                </motion.button>
            </motion.div>
        </>
    );
}

// Ã¢â€â‚¬Ã¢â€â‚¬ Resume Analyzer Widget Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
function ResumeAnalyzer({ onResult }: { onResult: (s: string) => void }) {
    const [dragging, setDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [err, setErr] = useState('');
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFile = (f: File) => {
        if (!f.type.includes('pdf') && !f.name.endsWith('.pdf') && !f.name.endsWith('.docx')) {
            setErr('Please upload a PDF or DOCX resume.');
            return;
        }
        setFile(f); setErr(''); setResult(null);
    };

    const analyze = async () => {
        if (!file) return;
        setUploading(true); setErr('');
        try {
            // Step 1: Upload file
            const fd = new FormData();
            fd.append('resume', file);
            const uploadRes = await api.post('/resume/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            const resumeId = uploadRes.data?.resume?._id;
            if (!resumeId) throw new Error('Upload failed Ã¢â‚¬â€ no resume ID returned.');

            // Step 2: Analyze by ID
            const analyzeRes = await api.post('/resume/analyze', { resumeId });
            const data = analyzeRes.data?.resume?.analysis || analyzeRes.data?.resume || analyzeRes.data;
            setResult(data);
            const score = data?.overallScore ?? data?.score ?? 'N/A';
            const strengths = (data?.strengths || []).join(', ') || 'Not available';
            const improvements = (data?.improvements || data?.weaknesses || []).join(', ') || 'Not available';
            const summary = `Resume Score: ${score}/10. Strengths: ${strengths}. Improvements needed: ${improvements}.`;
            onResult(summary);
        } catch (e: any) {
            const msg = e.response?.data?.error || e.response?.data?.message || e.message || 'Analysis failed.';
            setErr(msg);
        } finally { setUploading(false); }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}
            style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FiFileText size={16} color="#FBBF24" />
                </div>
                <div>
                    <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: 1 }}>Resume Analyzer</h2>
 <p style={{ fontSize: '0.72rem', color: '#71717A' }}>Upload PDF - Get AI score + tips</p>
                </div>
            </div>

            {/* Drop Zone */}
            {!result && (
                <div
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
                    onClick={() => fileRef.current?.click()}
                    style={{ border: `2px dashed ${dragging ? 'rgba(245,158,11,0.5)' : file ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 12, padding: '28px 16px', textAlign: 'center', cursor: 'pointer', background: dragging ? 'rgba(245,158,11,0.04)' : file ? 'rgba(16,185,129,0.04)' : 'transparent', transition: 'all 0.2s' }}>
                    {file ? (
                        <>
                            <FiCheck size={24} color="#10B981" style={{ marginBottom: 8 }} />
                            <p style={{ fontSize: '0.85rem', color: '#10B981', fontWeight: 600, marginBottom: 3 }}>{file.name}</p>
                            <p style={{ fontSize: '0.72rem', color: '#71717A' }}>{(file.size / 1024).toFixed(0)} KB  -  Ready to analyze</p>
                        </>
                    ) : (
                        <>
                            <FiFileText size={24} color="#3F3F46" style={{ marginBottom: 8 }} />
                            <p style={{ fontSize: '0.85rem', color: '#71717A', marginBottom: 3 }}>Drag & drop your resume</p>
                            <p style={{ fontSize: '0.72rem', color: '#3F3F46' }}>PDF or DOCX  -  Max 5MB</p>
                        </>
                    )}
                </div>
            )}

            <input type="file" ref={fileRef} accept=".pdf,.docx" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />

            {err && <p style={{ fontSize: '0.8rem', color: '#FCA5A5', background: 'rgba(239,68,68,0.08)', padding: '8px 12px', borderRadius: 8 }}>{err}</p>}

            {/* Results */}
            {result && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                            <motion.div initial={{ width: 0 }} animate={{ width: `${(result.overallScore || result.score || 7) * 10}%` }} transition={{ duration: 1, ease: 'easeOut' }}
                                style={{ height: '100%', background: 'linear-gradient(90deg, #7C3AED, #06B6D4)', borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fff', fontFamily: 'var(--font-outfit)' }}>{result.overallScore || result.score || 'Ã¢â‚¬â€'}<span style={{ fontSize: '0.7rem', color: '#71717A', fontWeight: 500 }}>/10</span></span>
                    </div>
                    {(result.strengths || []).slice(0, 2).map((s: string, i: number) => (
                        <div key={i} style={{ display: 'flex', gap: 8, fontSize: '0.78rem', color: '#10B981' }}>
                            <FiCheck size={12} style={{ marginTop: 2, flexShrink: 0 }} /> {s}
                        </div>
                    ))}
                    <button onClick={() => { setFile(null); setResult(null); }}
                        style={{ background: 'none', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '6px 12px', color: '#71717A', fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#71717A'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}>
                        Analyze another Ã¢â€ â€™
                    </button>
                </motion.div>
            )}

            {file && !result && (
                <motion.button onClick={analyze} disabled={uploading} whileHover={!uploading ? { scale: 1.02 } : {}} whileTap={!uploading ? { scale: 0.97 } : {}}
                    style={{ width: '100%', padding: '11px', background: uploading ? 'rgba(245,158,11,0.1)' : 'linear-gradient(135deg, #F59E0B, #D97706)', border: uploading ? '1px solid rgba(245,158,11,0.3)' : 'none', borderRadius: 10, color: uploading ? '#FBBF24' : '#fff', fontWeight: 700, fontSize: '0.88rem', cursor: uploading ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    {uploading ? (
                        <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ width: 14, height: 14, border: '2px solid #FBBF24', borderTopColor: 'transparent', borderRadius: '50%' }} /> Analyzing...</>
                    ) : (
                        <><FiZap size={15} /> Analyze Resume</>
                    )}
                </motion.button>
            )}
        </motion.div>
    );
}

// Ã¢â€â‚¬Ã¢â€â‚¬ Shared Input Bar Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
function InputBar({ input, setInput, attachedFile, setAttachedFile, isTyping, isListening, onToggleListen, onSend, fileRef, textareaRef }: any) {
    return (
        <>
            {attachedFile && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 12px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 8, marginBottom: 8, width: 'fit-content' }}>
                    <FiPaperclip size={12} color="#A78BFA" />
                    <span style={{ fontSize: '0.78rem', color: '#A78BFA' }}>{attachedFile.name}</span>
                    <button onClick={() => setAttachedFile(null)} style={{ background: 'none', border: 'none', color: '#A78BFA', cursor: 'pointer', padding: 0, display: 'flex' }}><FiX size={12} /></button>
                </div>
            )}
            <form onSubmit={onSend}
                style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '10px 14px', display: 'flex', alignItems: 'flex-end', gap: 10, boxShadow: '0 8px 40px rgba(0,0,0,0.5)', transition: 'border-color 0.2s' }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
            >
                <button type="button" onClick={() => fileRef.current?.click()}
                    style={{ background: 'none', border: 'none', color: '#3F3F46', cursor: 'pointer', padding: '4px', display: 'flex', transition: 'color 0.2s', flexShrink: 0 }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#A1A1AA')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#3F3F46')}>
                    <FiPaperclip size={17} />
                </button>
                <textarea ref={textareaRef} value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); } }}
                    placeholder="Ask DevPilot AI anything..." rows={1}
                    style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', resize: 'none', color: '#fff', fontSize: '0.92rem', fontFamily: 'var(--font-inter)', maxHeight: 120, lineHeight: 1.6, padding: '4px 0' }} />
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                    <button type="button" onClick={onToggleListen}
                        style={{ background: isListening ? 'rgba(239,68,68,0.12)' : 'none', border: 'none', color: isListening ? '#EF4444' : '#3F3F46', cursor: 'pointer', padding: '6px', borderRadius: 7, display: 'flex', transition: 'all 0.2s' }}>
                        <FiMic size={17} />
                    </button>
                    <motion.button type="submit" disabled={!input.trim() && !attachedFile}
                        whileHover={input.trim() ? { scale: 1.05 } : {}} whileTap={input.trim() ? { scale: 0.95 } : {}}
                        style={{ width: 36, height: 36, background: input.trim() ? 'linear-gradient(135deg, #7C3AED, #06B6D4)' : 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() ? 'pointer' : 'default', transition: 'all 0.2s', opacity: input.trim() ? 1 : 0.35 }}>
                        <FiSend size={15} color="#fff" />
                    </motion.button>
                </div>
            </form>
            <p style={{ textAlign: 'center', fontSize: '0.68rem', color: '#3F3F46', marginTop: 8 }}>
 Press Enter to send - Shift+Enter for new line - DevPilot AI v1.0
            </p>
        </>
    );
}


