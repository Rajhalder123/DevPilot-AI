// ── Resume Analysis Types ──────────────────────────────────────────────

export interface SectionFeedback {
    score: number;
    feedback: string;
}

export interface BulletRewrite {
    original: string;
    improved: string;
    reason: string;
}

export interface ResumeAnalysis {
    overallScore: number;
    atsScore: number;
    summary: string;
    strengths: string[];
    improvements: string[];
    keywordGaps: string[];
    formattingTips: string[];
    sectionFeedback: {
        education: SectionFeedback;
        experience: SectionFeedback;
        projects: SectionFeedback;
        skills: SectionFeedback;
    };
    bulletRewrites: BulletRewrite[];
}

// ── GitHub Analysis Types ──────────────────────────────────────────────

export interface GitHubAnalysis {
    overallScore: number;
    readmeScore: number;
    activityScore: number;
    codeStructureScore: number;
    summary: string;
    codeQuality: string;
    architecture: string;
    strengths: string[];
    improvements: string[];
    techStack: string[];
    suggestions: string[];
}

export interface GitHubRepoData {
    name: string;
    description: string;
    language: string;
    languages: string[];
    readme: string;
    topics: string[];
    stars: number;
    forks: number;
    openIssues: number;
    createdAt: string;
    updatedAt: string;
    // Enhanced fields (from upgraded github service)
    commitFrequency?: {
        totalLastYear: number;
        avgPerWeek: number;
    };
    hasTests?: boolean;
    hasCICD?: boolean;
    hasDockerfile?: boolean;
    directoryDepth?: number;
    fileCount?: number;
}

// ── Cover Letter Types ─────────────────────────────────────────────────

export interface CoverLetterInput {
    resumeText: string;
    jobDescription: string;
    companyName: string;
    tone: string;
}

// ── Roadmap Types ──────────────────────────────────────────────────────

export interface RoadmapPhaseSkill {
    name: string;
    priority: string;
    resources: string[];
}

export interface RoadmapPhase {
    name: string;
    duration: string;
    skills: RoadmapPhaseSkill[];
}

export interface SkillRoadmap {
    currentLevel: string;
    targetRole: string;
    timeline: string;
    phases: RoadmapPhase[];
    tips: string[];
}

// ── Portfolio Types ────────────────────────────────────────────────────

export interface PortfolioProject {
    title: string;
    description: string;
    link: string;
    tech: string;
}

export interface PortfolioInput {
    name: string;
    bio: string;
    skills: string[];
    projects: PortfolioProject[];
    github: string;
    linkedin: string;
    email: string;
}

// ── Job Recommendation Types ───────────────────────────────────────────

export interface JobRecommendation {
    title: string;
    company: string;
    location: string;
    type: 'remote' | 'onsite' | 'hybrid';
    matchScore: number;
    skills: string[];
    description: string;
    salary: string;
}

export interface UserProfileForJobs {
    skills: string[];
    experience: string;
    preferences: string;
}
