'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from './api';

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    skills?: string[];
    bio?: string;
    location?: string;
    website?: string;
    githubUsername?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem('devpilot_token');
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
            setUser(res.data.user);
        } catch {
            localStorage.removeItem('devpilot_token');
            setToken(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        const res = await api.post('/auth/login', { email, password });
        const { token: t, user: u } = res.data;
        localStorage.setItem('devpilot_token', t);
        setToken(t);
        setUser(u);
    };

    const signup = async (name: string, email: string, password: string) => {
        const res = await api.post('/auth/signup', { name, email, password });
        const { token: t, user: u } = res.data;
        localStorage.setItem('devpilot_token', t);
        setToken(t);
        setUser(u);
    };

    const logout = () => {
        localStorage.removeItem('devpilot_token');
        setToken(null);
        setUser(null);
    };

    const updateUser = (data: Partial<User>) => {
        if (user) setUser({ ...user, ...data });
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, signup, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
