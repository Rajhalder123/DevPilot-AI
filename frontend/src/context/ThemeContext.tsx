'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ── Theme definitions ─────────────────────────────────────────────────────────
export type ThemeId = 'dark' | 'ocean' | 'emerald';

export interface ThemeDef {
    id: ThemeId;
    label: string;
    desc: string;
    accent: string;        // primary brand color
    accentAlt: string;     // secondary brand color
    bg: string;            // page background
    card: string;          // card background
    card2: string;         // card hover / elevated
    sidebar: string;       // sidebar bg
    text: string;          // primary text
    muted: string;         // secondary text
    sub: string;           // tertiary text
    border: string;        // default border
    preview: string[];     // preview gradient stops for the card thumbnail
}

export const THEMES: ThemeDef[] = [
    {
        id: 'dark',
        label: 'Dark Void',
        desc: 'Deep obsidian — best for focus',
        accent: '#7C3AED',
        accentAlt: '#06B6D4',
        bg: '#050505',
        card: '#111111',
        card2: '#161616',
        sidebar: '#0A0A0A',
        text: '#FFFFFF',
        muted: '#A1A1AA',
        sub: '#71717A',
        border: 'rgba(255,255,255,0.06)',
        preview: ['#7C3AED', '#06B6D4'],
    },
    {
        id: 'ocean',
        label: 'Midnight Ocean',
        desc: 'Deep blue — calm and immersive',
        accent: '#3B82F6',
        accentAlt: '#06B6D4',
        bg: '#020A14',
        card: '#071525',
        card2: '#0D1E30',
        sidebar: '#050F1C',
        text: '#E2F0FF',
        muted: '#7BA7CC',
        sub: '#4E7A9E',
        border: 'rgba(59,130,246,0.12)',
        preview: ['#3B82F6', '#06B6D4'],
    },
    {
        id: 'emerald',
        label: 'Emerald Noir',
        desc: 'Dark green — Matrix hacker style',
        accent: '#10B981',
        accentAlt: '#34D399',
        bg: '#020D08',
        card: '#071410',
        card2: '#0D1F18',
        sidebar: '#04100C',
        text: '#ECFDF5',
        muted: '#6EE7B7',
        sub: '#4A9471',
        border: 'rgba(16,185,129,0.12)',
        preview: ['#10B981', '#34D399'],
    },
];

// ── Apply theme CSS variables to <html> ───────────────────────────────────────
function applyTheme(t: ThemeDef) {
    const root = document.documentElement;
    root.setAttribute('data-theme', t.id);

    // DevPilot design tokens
    root.style.setProperty('--dp-bg',          t.bg);
    root.style.setProperty('--dp-card',        t.card);
    root.style.setProperty('--dp-card2',       t.card2);
    root.style.setProperty('--dp-sidebar',     t.sidebar);
    root.style.setProperty('--dp-text',        t.text);
    root.style.setProperty('--dp-muted',       t.muted);
    root.style.setProperty('--dp-sub',         t.sub);
    root.style.setProperty('--dp-border',      t.border);
    root.style.setProperty('--dp-purple',      t.accent);
    root.style.setProperty('--dp-purple-hover',t.accent + 'CC');
    root.style.setProperty('--dp-purple-glow', t.accent + '4D');
    root.style.setProperty('--dp-purple-dim',  t.accent + '1F');
    root.style.setProperty('--dp-cyan',        t.accentAlt);
    root.style.setProperty('--dp-cyan-dim',    t.accentAlt + '1F');
    root.style.setProperty('--dp-gradient',    `linear-gradient(135deg, ${t.accent}, ${t.accentAlt})`);
    root.style.setProperty('--dp-gradient-text',`linear-gradient(90deg, ${t.accent}, ${t.accentAlt})`);
    root.style.setProperty('--dp-hover',       t.accent + '0A');
    root.style.setProperty('--dp-sidebar-border', t.border);
    root.style.setProperty('--dp-nav',         t.bg + 'CC');
    root.style.setProperty('--dp-nav-border',  t.border);

    // Shadcn compat
    root.style.setProperty('--background',     t.bg);
    root.style.setProperty('--foreground',     t.text);
    root.style.setProperty('--card',           t.card);
    root.style.setProperty('--card-foreground',t.text);
    root.style.setProperty('--primary',        t.accent);
    root.style.setProperty('--primary-foreground', t.text);
    root.style.setProperty('--muted',          t.card2);
    root.style.setProperty('--muted-foreground', t.muted);
    root.style.setProperty('--border',         t.border);
    root.style.setProperty('--ring',           t.accent + '80');
    root.style.setProperty('--sidebar',        t.sidebar);
    root.style.setProperty('--sidebar-foreground', t.text);
    root.style.setProperty('--sidebar-primary', t.accent);
    root.style.setProperty('--sidebar-border', t.border);

    // Body background
    document.body.style.background = t.bg;
}

// ── Context ───────────────────────────────────────────────────────────────────
interface ThemeContextType {
    theme: ThemeDef;
    setTheme: (id: ThemeId) => void;
    // legacy compat
    isDark: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: THEMES[0],
    setTheme: () => {},
    isDark: true,
    toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [themeId, setThemeId] = useState<ThemeId>('dark');

    // Load persisted theme on mount
    useEffect(() => {
        const saved = localStorage.getItem('devpilot-theme') as ThemeId | null;
        const initial = THEMES.find(t => t.id === saved) ? saved! : 'dark';
        setThemeId(initial);
        applyTheme(THEMES.find(t => t.id === initial)!);
    }, []);

    const setTheme = (id: ThemeId) => {
        const t = THEMES.find(th => th.id === id)!;
        setThemeId(id);
        applyTheme(t);
        localStorage.setItem('devpilot-theme', id);
    };

    const theme = THEMES.find(t => t.id === themeId)!;

    return (
        <ThemeContext.Provider value={{ theme, setTheme, isDark: true, toggleTheme: () => setTheme('dark') }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
