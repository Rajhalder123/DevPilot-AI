'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

export interface DashboardStats {
    resumeCount: number;
    githubCount: number;
    jobCount: number;
    interviewCount: number;
    avgInterviewScore: number;
}

export interface RecentResume {
    _id: string;
    fileName: string;
    status: string;
    analysis?: { overallScore?: number };
    createdAt: string;
}

export interface RecentInterview {
    _id: string;
    topic: string;
    difficulty: string;
    score?: number;
    status: string;
    createdAt: string;
}

export interface Job {
    id: string;
    title: string;
    company: string;
    companyLogo: string;
    location: string;
    type: string;
    salary: string;
    description: string;
    tags: string[];
    applyUrl: string;
    source: string;
    postedAt: string;
}

export interface GitHubProject {
    _id: string;
    repoName: string;
    owner: string;
    language: string;
    stars: number;
    forks: number;
    status: string;
    createdAt: string;
    analysis?: { overallScore?: number; strengths?: string[] };
}

export interface DashboardData {
    stats: DashboardStats | null;
    recentResumes: RecentResume[];
    recentInterviews: RecentInterview[];
    jobs: Job[];
    githubProjects: GitHubProject[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useDashboardData(): DashboardData {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentResumes, setRecentResumes] = useState<RecentResume[]>([]);
    const [recentInterviews, setRecentInterviews] = useState<RecentInterview[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [githubProjects, setGithubProjects] = useState<GitHubProject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tick, setTick] = useState(0);

    const refetch = () => setTick(t => t + 1);

    useEffect(() => {
        let cancelled = false;

        const fetchAll = async () => {
            setLoading(true);
            setError(null);

            try {
                const [dashRes, jobsRes, githubRes] = await Promise.allSettled([
                    api.get('/dashboard/stats'),
                    api.get('/jobs/search?query=developer'),
                    api.get('/github/history'),
                ]);

                if (cancelled) return;

                if (dashRes.status === 'fulfilled') {
                    setStats(dashRes.value.data.stats);
                    setRecentResumes(dashRes.value.data.recentResumes || []);
                    setRecentInterviews(dashRes.value.data.recentInterviews || []);
                }

                if (jobsRes.status === 'fulfilled') {
                    setJobs((jobsRes.value.data.jobs || []).slice(0, 3));
                }

                if (githubRes.status === 'fulfilled') {
                    setGithubProjects(githubRes.value.data.projects || []);
                }
            } catch (err: any) {
                if (!cancelled) setError(err.message || 'Failed to load dashboard');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchAll();
        return () => { cancelled = true; };
    }, [tick]);

    return { stats, recentResumes, recentInterviews, jobs, githubProjects, loading, error, refetch };
}
