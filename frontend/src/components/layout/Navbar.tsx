'use client';

import { FiBell, FiSearch } from 'react-icons/fi';
import { useAuth } from '@/lib/auth';

export default function Navbar() {
    const { user } = useAuth();

    return (
        <header style={{
            height: 64,
            background: 'var(--card)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            position: 'sticky',
            top: 0,
            zIndex: 40,
        }}>
            {/* Search */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: 'var(--background)',
                border: '1px solid var(--border-color)',
                borderRadius: 10,
                padding: '8px 16px',
                width: 320,
            }}>
                <FiSearch size={16} color="var(--muted)" />
                <input
                    type="text"
                    placeholder="Search features..."
                    style={{
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: 'var(--foreground)',
                        fontSize: '0.85rem',
                        width: '100%',
                    }}
                />
            </div>

            {/* Right side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <button style={{
                    background: 'none',
                    border: '1px solid var(--border-color)',
                    borderRadius: 10,
                    padding: 8,
                    cursor: 'pointer',
                    color: 'var(--muted)',
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
                        background: 'var(--danger)',
                    }} />
                </button>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                        Welcome, <span style={{ color: 'var(--foreground)', fontWeight: 600 }}>{user?.name?.split(' ')[0] || 'User'}</span>
                    </span>
                </div>
            </div>
        </header>
    );
}
