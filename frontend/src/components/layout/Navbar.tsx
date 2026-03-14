'use client';

import { FiBell, FiSearch, FiMenu } from 'react-icons/fi';
import { useAuth } from '@/lib/auth';

interface NavbarProps {
    onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
    const { user } = useAuth();

    return (
        <header style={{
            height: 64,
            background: '#FFFFFF',
            borderBottom: '1px solid rgba(249, 115, 22, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            position: 'sticky',
            top: 0,
            zIndex: 40,
            boxShadow: '0 2px 16px rgba(249, 115, 22, 0.06)',
        }}>
            {/* Left side: Hamburger (Mobile) & Search */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <button
                    onClick={onMenuClick}
                    className="md-hidden"
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        padding: 8,
                        color: '#F97316',
                    }}
                >
                    <FiMenu size={24} />
                </button>

                {/* Search */}
                <div className="navbar-search" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    background: '#FFF7ED',
                    border: '1px solid rgba(249, 115, 22, 0.2)',
                    borderRadius: 12,
                    padding: '8px 16px',
                    width: 320,
                }}>
                    <FiSearch size={16} color="#F97316" />
                    <input
                        type="text"
                        placeholder="Search features..."
                        style={{
                            background: 'transparent',
                            border: 'none',
                            outline: 'none',
                            color: '#0F172A',
                            fontSize: '0.85rem',
                            fontFamily: "'Inter', sans-serif",
                            width: '100%',
                        }}
                    />
                </div>
            </div>

            {/* Right side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <button style={{
                    background: 'none',
                    border: '1px solid rgba(249, 115, 22, 0.2)',
                    borderRadius: 10,
                    padding: 8,
                    cursor: 'pointer',
                    color: '#F97316',
                    position: 'relative',
                    transition: 'all 0.2s',
                }}>
                    <FiBell size={18} />
                    <span style={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: '#F97316',
                    }} />
                </button>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '6px 14px',
                    background: '#FFF7ED',
                    borderRadius: 12,
                    border: '1px solid rgba(249, 115, 22, 0.15)',
                }}>
                    <div style={{
                        width: 30, height: 30, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #F97316, #F59E0B)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: 700, fontSize: '0.8rem',
                        fontFamily: "'Outfit', sans-serif",
                    }}>
                        {(user?.name?.charAt(0) || 'U').toUpperCase()}
                    </div>
                    <span style={{ fontSize: '0.85rem', color: '#64748B', fontFamily: "'Inter', sans-serif" }}>
                        Welcome, <span style={{ color: '#0F172A', fontWeight: 700 }}>{user?.name?.split(' ')[0] || 'User'}</span>
                    </span>
                </div>
            </div>
        </header>
    );
}
