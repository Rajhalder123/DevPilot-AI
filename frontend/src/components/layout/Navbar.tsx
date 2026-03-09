'use client';

import { FiBell, FiSearch } from 'react-icons/fi';
import { useAuth } from '@/lib/auth';

export default function Navbar() {
    const { user } = useAuth();

    return (
        <header style={{
            height: 64,
            background: '#FFFFFF',
            borderBottom: '1px solid #e8e8e8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            position: 'sticky',
            top: 0,
            zIndex: 40,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}>
            {/* Search */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: '#f8f8f8',
                border: '1px solid #e8e8e8',
                borderRadius: 0,
                padding: '8px 16px',
                width: 320,
            }}>
                <FiSearch size={16} color="#a5a5a5" />
                <input
                    type="text"
                    placeholder="Search features..."
                    style={{
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: '#3a3a3a',
                        fontSize: '0.85rem',
                        fontFamily: "'Roboto', sans-serif",
                        width: '100%',
                    }}
                />
            </div>

            {/* Right side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <button style={{
                    background: 'none',
                    border: '1px solid #e8e8e8',
                    borderRadius: 0,
                    padding: 8,
                    cursor: 'pointer',
                    color: '#a5a5a5',
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
                        background: '#ffb606',
                    }} />
                </button>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                }}>
                    <span style={{ fontSize: '0.85rem', color: '#a5a5a5', fontFamily: "'Roboto', sans-serif" }}>
                        Welcome, <span style={{ color: '#3a3a3a', fontWeight: 600 }}>{user?.name?.split(' ')[0] || 'User'}</span>
                    </span>
                </div>
            </div>
        </header>
    );
}
