'use client';

import { FiBell, FiSearch, FiMenu } from 'react-icons/fi';
import { useAuth } from '@/lib/auth';

interface NavbarProps {
    onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
    const { user } = useAuth();

    return (
        <header className="glass" style={{
            height: 72,
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            position: 'sticky',
            top: 0,
            zIndex: 40,
        }}>
            {/* Left side: Hamburger (Mobile) & Search */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <button
                    onClick={onMenuClick}
                    className="md-hidden"
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

                {/* Search */}
                <div className="navbar-search" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    background: 'rgba(15, 23, 42, 0.4)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 14,
                    padding: '10px 18px',
                    width: 320,
                    transition: 'all 0.3s ease',
                }}>
                    <FiSearch size={18} color="var(--muted)" />
                    <input
                        type="text"
                        placeholder="Search dashboard..."
                        style={{
                            background: 'transparent',
                            border: 'none',
                            outline: 'none',
                            color: 'var(--foreground)',
                            fontSize: '0.9rem',
                            fontFamily: "'Inter', sans-serif",
                            width: '100%',
                        }}
                    />
                </div>
            </div>

            {/* Right side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <button style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 12,
                    padding: 10,
                    cursor: 'pointer',
                    color: 'var(--muted)',
                    position: 'relative',
                    transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--foreground)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)' }}
                >
                    <FiBell size={20} />
                    <span style={{
                        position: 'absolute',
                        top: -2,
                        right: -2,
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: 'var(--danger)',
                        border: '2px solid var(--background)'
                    }} />
                </button>
                
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '6px 16px 6px 6px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: 100,
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer'
                }}>
                    <div style={{
                        width: 34, height: 34, borderRadius: '50%',
                        background: 'var(--gradient-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: 700, fontSize: '0.85rem',
                        fontFamily: "'Outfit', sans-serif",
                    }}>
                        {(user?.name?.charAt(0) || 'U').toUpperCase()}
                    </div>
                    <span style={{ fontSize: '0.9rem', color: 'var(--foreground)', fontWeight: 500 }}>
                        {user?.name?.split(' ')[0] || 'Developer'}
                    </span>
                </div>
            </div>
        </header>
    );
}
