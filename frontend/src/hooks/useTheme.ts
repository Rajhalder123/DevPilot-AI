'use client';

import { useState, useEffect } from 'react';

export function useTheme() {
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');

    useEffect(() => {
        const saved = localStorage.getItem('devpilot_theme') as 'dark' | 'light' | null;
        if (saved) setTheme(saved);
    }, []);

    const toggleTheme = () => {
        const next = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        localStorage.setItem('devpilot_theme', next);
        document.documentElement.setAttribute('data-theme', next);
    };

    return { theme, toggleTheme };
}
