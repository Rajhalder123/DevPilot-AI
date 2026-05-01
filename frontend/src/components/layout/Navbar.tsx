'use client';

import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiMenu, FiBriefcase, FiExternalLink, FiX, FiLoader } from 'react-icons/fi';
import { useAuth } from '@/lib/auth';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
    onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
    const { user } = useAuth();
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch jobs as suggestions
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.length >= 2) {
                setIsLoading(true);
                setShowDropdown(true);
                try {
                    const response = await api.get(`/jobs/search?query=${query}`);
                    setSuggestions(response.data.jobs.slice(0, 6) || []);
                } catch (error) {
                    console.error('Job search failed');
                } finally {
                    setIsLoading(false);
                }
            } else {
                setSuggestions([]);
                setShowDropdown(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    return (
        <header className="glass" style={{
            height: 72,
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            position: 'sticky',
            top: 0,
            zIndex: 1001, // Higher than sidebar
        }}>
            {/* Left side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                    onClick={onMenuClick}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        padding: 8,
                        color: 'var(--primary)',
                    }}
                >
                    <FiMenu size={24} />
                </button>
            </div>

            {/* Center: Real Job Search Section */}
            <div ref={dropdownRef} style={{ 
                flex: 1, 
                display: 'flex', 
                justifyContent: 'center',
                padding: '0 20px',
                position: 'relative'
            }}>
                <div className="navbar-search" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    background: 'rgba(15, 23, 42, 0.04)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 14,
                    padding: '8px 16px',
                    width: '100%',
                    maxWidth: 450,
                    transition: 'all 0.3s ease',
                    boxShadow: showDropdown ? '0 10px 40px rgba(0,0,0,0.1)' : 'none',
                    zIndex: 1002
                }}>
                    <FiSearch size={16} color="var(--muted)" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search job roles (e.g. Frontend Developer)..."
                        style={{
                            background: 'transparent',
                            border: 'none',
                            outline: 'none',
                            color: 'var(--foreground)',
                            fontSize: '0.85rem',
                            fontFamily: "'Inter', sans-serif",
                            width: '100%',
                        }}
                    />
                    {isLoading ? (
                        <FiLoader className="animate-spin" size={16} color="var(--primary)" />
                    ) : query && (
                        <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
                            <FiX size={16} />
                        </button>
                    )}
                </div>

                {/* Search Dropdown / Auto-suggestions */}
                <AnimatePresence>
                    {showDropdown && (query.length >= 2) && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            style={{
                                position: 'absolute',
                                top: '100%',
                                marginTop: 10,
                                width: '100%',
                                maxWidth: 450,
                                background: '#fff',
                                borderRadius: 16,
                                border: '1px solid var(--border-color)',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                                overflow: 'hidden',
                                zIndex: 1000
                            }}
                        >
                            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', background: '#f8fafc' }}>
                                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Matching Jobs found for "{query}"
                                </span>
                            </div>
                            
                            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                                {suggestions.length > 0 ? suggestions.map((job) => (
                                    <div 
                                        key={job.id} 
                                        style={{ 
                                            padding: '14px 16px', 
                                            borderBottom: '1px solid rgba(0,0,0,0.03)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            gap: 12,
                                            cursor: 'pointer',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(79, 70, 229, 0.03)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        onClick={() => window.open(job.applyUrl, '_blank')}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                                            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(79, 70, 229, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <FiBriefcase size={16} color="var(--primary)" />
                                            </div>
                                            <div style={{ overflow: 'hidden' }}>
                                                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {job.title}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                                                    {job.company} · {job.location}
                                                </div>
                                            </div>
                                        </div>
                                        <FiExternalLink size={14} color="var(--muted)" />
                                    </div>
                                )) : !isLoading && (
                                    <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--muted)', fontSize: '0.85rem' }}>
                                        No real-time jobs found for this role.
                                    </div>
                                )}
                            </div>

                            {suggestions.length > 0 && (
                                <div style={{ padding: '12px', textAlign: 'center', borderTop: '1px solid var(--border-color)' }}>
                                    <button 
                                        onClick={() => window.location.href = `/dashboard/jobs?q=${query}`}
                                        style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                                    >
                                        View All Results →
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Right side: Minimal Spacer */}
            <div style={{ minWidth: 40 }} />
        </header>
    );
}
