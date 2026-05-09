'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
    isDark: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({ isDark: true, toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [isDark, setIsDark] = useState(true);

    // Persist preference
    useEffect(() => {
        const saved = localStorage.getItem('devpilot-theme');
        if (saved === 'light') setIsDark(false);
    }, []);

    const toggleTheme = () => {
        setIsDark(prev => {
            localStorage.setItem('devpilot-theme', prev ? 'light' : 'dark');
            return !prev;
        });
    };

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
