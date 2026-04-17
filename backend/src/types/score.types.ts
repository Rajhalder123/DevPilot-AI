import { ResumeAnalysis, GitHubAnalysis } from './ai.types';

// ── Scoring Engine Types ───────────────────────────────────────────────

export type ScoreCategory = 'Beginner' | 'Intermediate' | 'Job Ready';

export interface ScoreBreakdownItem {
    score: number;
    weight: number;
    weightedScore: number;
}

export interface ScoreBreakdown {
    resume: ScoreBreakdownItem;
    github: ScoreBreakdownItem;
    skills: ScoreBreakdownItem;
}

export interface ScoringResult {
    finalScore: number;
    category: ScoreCategory;
    breakdown: ScoreBreakdown;
    improvements: string[];
    shareText: string;
}

export interface ScoringInput {
    resumeScore: number;
    githubScore: number;
    skills: string[];
}

// ── Full Analysis Types ────────────────────────────────────────────────

export interface FullAnalysisInput {
    resumeText: string;
    repoUrl: string;
    skills: string[];
}

export interface FullAnalysisResult {
    resumeAnalysis: ResumeAnalysis;
    githubAnalysis: GitHubAnalysis;
    scoring: ScoringResult;
    generatedAt: string;
}
