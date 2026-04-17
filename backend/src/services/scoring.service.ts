import { ScoringInput, ScoringResult, ScoreCategory, ScoreBreakdown } from '../types/score.types';

// ── Common tech skills by category (for skills scoring) ─────────────────────

const HIGH_DEMAND_SKILLS = new Set([
    'javascript', 'typescript', 'python', 'java', 'react', 'node.js', 'nodejs',
    'aws', 'docker', 'kubernetes', 'sql', 'postgresql', 'mongodb', 'git',
    'rest api', 'graphql', 'ci/cd', 'linux', 'agile', 'microservices',
    'next.js', 'nextjs', 'express', 'django', 'spring boot', 'go', 'golang',
    'redis', 'kafka', 'terraform', 'azure', 'gcp',
]);

const MODERATE_SKILLS = new Set([
    'html', 'css', 'tailwind', 'sass', 'bootstrap', 'firebase', 'heroku',
    'figma', 'jest', 'mocha', 'cypress', 'selenium', 'postman', 'jira',
    'scrum', 'redux', 'vue', 'angular', 'svelte', 'flutter', 'react native',
    'c++', 'c#', 'rust', 'swift', 'kotlin', 'php', 'ruby',
]);

/**
 * Scoring Engine — calculates the Job Ready Score.
 *
 * Weights:
 *   Resume:  40%
 *   GitHub:  40%
 *   Skills:  20%
 */
export class ScoringEngine {
    private static readonly WEIGHTS = {
        resume: 0.40,
        github: 0.40,
        skills: 0.20,
    };

    /**
     * Calculate the weighted Job Ready Score.
     */
    calculateScore(input: ScoringInput): ScoringResult {
        const { resumeScore, githubScore, skills } = input;

        const skillsScore = this.evaluateSkills(skills);

        const breakdown: ScoreBreakdown = {
            resume: {
                score: resumeScore,
                weight: ScoringEngine.WEIGHTS.resume,
                weightedScore: Math.round(resumeScore * ScoringEngine.WEIGHTS.resume * 10) / 10,
            },
            github: {
                score: githubScore,
                weight: ScoringEngine.WEIGHTS.github,
                weightedScore: Math.round(githubScore * ScoringEngine.WEIGHTS.github * 10) / 10,
            },
            skills: {
                score: skillsScore,
                weight: ScoringEngine.WEIGHTS.skills,
                weightedScore: Math.round(skillsScore * ScoringEngine.WEIGHTS.skills * 10) / 10,
            },
        };

        const finalScore = Math.round(
            breakdown.resume.weightedScore +
            breakdown.github.weightedScore +
            breakdown.skills.weightedScore
        );

        const category = this.categorize(finalScore);
        const improvements = this.generateImprovements(breakdown, skills);

        return {
            finalScore,
            category,
            breakdown,
            improvements,
            shareText: `My Job Ready Score: ${finalScore}% 🚀 — I'm at the ${category} level! Check yours at DevPilot AI`,
        };
    }

    // ── Private helpers ─────────────────────────────────────────────────────

    /**
     * Evaluate skills based on quantity and quality (demand level).
     */
    private evaluateSkills(skills: string[]): number {
        if (!skills || skills.length === 0) return 0;

        let score = 0;
        const normalizedSkills = skills.map((s) => s.toLowerCase().trim());

        // Base score: number of skills (diminishing returns)
        const quantityScore = Math.min(40, normalizedSkills.length * 5);

        // Quality score: how many high-demand skills
        let highDemandCount = 0;
        let moderateCount = 0;

        for (const skill of normalizedSkills) {
            if (HIGH_DEMAND_SKILLS.has(skill)) {
                highDemandCount++;
            } else if (MODERATE_SKILLS.has(skill)) {
                moderateCount++;
            }
        }

        const qualityScore = Math.min(60, highDemandCount * 10 + moderateCount * 5);

        score = quantityScore + qualityScore;
        return Math.min(100, score);
    }

    /**
     * Categorize the final score.
     */
    private categorize(score: number): ScoreCategory {
        if (score >= 75) return 'Job Ready';
        if (score >= 45) return 'Intermediate';
        return 'Beginner';
    }

    /**
     * Generate top 5 improvement actions based on the weakest areas.
     */
    private generateImprovements(breakdown: ScoreBreakdown, skills: string[]): string[] {
        const improvements: string[] = [];

        // Sort components by score (weakest first)
        const components = [
            { name: 'resume', ...breakdown.resume },
            { name: 'github', ...breakdown.github },
            { name: 'skills', ...breakdown.skills },
        ].sort((a, b) => a.score - b.score);

        for (const component of components) {
            if (component.score < 30) {
                if (component.name === 'resume') {
                    improvements.push('Your resume needs significant improvement — upload it to the Resume Analyzer for a detailed ATS score and rewrite suggestions');
                } else if (component.name === 'github') {
                    improvements.push('Your GitHub profile needs work — add comprehensive README files, tests, and CI/CD pipelines to your projects');
                } else if (component.name === 'skills') {
                    improvements.push('Expand your skill set — focus on high-demand technologies like React, Node.js, Docker, and cloud services (AWS/GCP)');
                }
            } else if (component.score < 60) {
                if (component.name === 'resume') {
                    improvements.push('Optimize your resume by adding measurable achievements (e.g., "reduced load time by 40%") and industry-specific keywords');
                } else if (component.name === 'github') {
                    improvements.push('Strengthen your GitHub projects — ensure each repo has a professional README with setup instructions, screenshots, and a live demo link');
                } else if (component.name === 'skills') {
                    improvements.push('Add more in-demand skills to your profile — consider learning TypeScript, cloud deployment, or containerization');
                }
            } else if (component.score < 80) {
                if (component.name === 'resume') {
                    improvements.push('Fine-tune your resume — consider adding certifications and tailoring it to specific job descriptions');
                } else if (component.name === 'github') {
                    improvements.push('Polish your GitHub — add unit tests and deploy at least one project to production');
                } else if (component.name === 'skills') {
                    improvements.push('Deepen expertise in your strongest skills and add emerging technologies to stay competitive');
                }
            }
        }

        // Add general improvements if we have room
        const normalizedSkills = skills.map((s) => s.toLowerCase());
        if (improvements.length < 5 && !normalizedSkills.some((s) => HIGH_DEMAND_SKILLS.has(s))) {
            improvements.push('Learn at least one high-demand technology: React, Node.js, Python, AWS, or Docker');
        }
        if (improvements.length < 5 && skills.length < 5) {
            improvements.push('Add more skills to your profile — aim for at least 5-8 relevant technical skills');
        }
        if (improvements.length < 5) {
            improvements.push('Practice mock interviews with the AI Interview Simulator to improve your communication skills');
        }

        return improvements.slice(0, 5);
    }
}

// Export singleton instance
export const scoringEngine = new ScoringEngine();
