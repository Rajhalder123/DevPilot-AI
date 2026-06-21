'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from './api';

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'user' | 'admin';
}

interface AuthContextType {
    user: AdminUser | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AdminUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem('devpilot_admin_token');
        if (savedToken) {
            setToken(savedToken);
            fetchUser(savedToken);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async (t: string) => {
        try {
            const res = await api.get('/auth/me', {
                headers: { Authorization: `Bearer ${t}` },
            });
            const u = res.data.user;
            if (u.role !== 'admin') {
                // Non-admin user — reject
                localStorage.removeItem('devpilot_admin_token');
                setToken(null);
                setUser(null);
            } else {
                setUser(u);
            }
        } catch {
            localStorage.removeItem('devpilot_admin_token');
            setToken(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        const res = await api.post('/auth/login', { email, password });
        const { token: t, user: u } = res.data;

        if (u.role !== 'admin') {
            throw new Error('Access denied. Admin privileges required.');
        }

        localStorage.setItem('devpilot_admin_token', t);
        setToken(t);
        setUser(u);
    };

    const logout = () => {
        localStorage.removeItem('devpilot_admin_token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
