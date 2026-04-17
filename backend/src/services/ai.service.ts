import OpenAI from 'openai';
import { env } from '../config/env';
import { parseJSON } from '../utils/parseJSON';
import { logger } from '../utils/logger';
import { AppError } from '../utils/AppError';
import {
    ResumeAnalysis,
    GitHubAnalysis,
    GitHubRepoData,
    CoverLetterInput,
    SkillRoadmap,
    PortfolioInput,
    UserProfileForJobs,
    JobRecommendation,
} from '../types/ai.types';

// ── Groq client (OpenAI-compatible) ─────────────────────────────────────────

const openai = new OpenAI({
    apiKey: env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
});

const MODEL = 'llama-3.3-70b-versatile';

// ── Helper: call AI with optional retry ─────────────────────────────────────

async function callAI(
    messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
    options: { temperature?: number; maxTokens?: number } = {}
): Promise<string> {
    const { temperature = 0.3, maxTokens = 2000 } = options;

    try {
        const response = await openai.chat.completions.create({
            model: MODEL,
            messages,
            temperature,
            max_completion_tokens: maxTokens,
        });
        return response.choices[0].message.content || '';
    } catch (error: any) {
        logger.error('Groq API call failed', {
            error: error.message,
            status: error.status,
        });
        throw AppError.aiServiceError(
            error.status === 429
                ? 'AI rate limit reached. Please wait a moment and try again.'
                : 'AI service is temporarily unavailable. Please try again.'
        );
    }
}

/**
 * Call AI and parse JSON response. Retries once with lower temperature if parsing fails.
 */
async function callAIJSON<T>(
    messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
    options: { temperature?: number; maxTokens?: number } = {},
    fallback?: T
): Promise<T> {
    const raw = await callAI(messages, options);
    try {
        return parseJSON<T>(raw);
    } catch {
        // Retry once with lower temperature for more deterministic output
        logger.warn('AI JSON parse failed, retrying with lower temperature');
        const retryRaw = await callAI(messages, {
            ...options,
            temperature: 0.1,
        });
        return parseJSON<T>(retryRaw, fallback);
    }
}

// ── Resume Analysis ─────────────────────────────────────────────────────────

export const analyzeResume = async (resumeText: string): Promise<ResumeAnalysis> => {
    const systemPrompt = `You are an expert resume analyst and career consultant specializing in the Indian tech job market.

Analyze the following resume and return a JSON response with EXACTLY this structure:
{
  "overallScore": <number 0-100>,
  "atsScore": <number 0-100>,
  "summary": "<brief overview of resume quality>",
  "strengths": ["<strength 1>", "<strength 2>", ...],
  "improvements": ["<specific improvement 1>", ...],
  "keywordGaps": ["<missing keyword 1>", ...],
  "formattingTips": ["<formatting tip 1>", ...],
  "sectionFeedback": {
    "education": { "score": <0-100>, "feedback": "<specific feedback>" },
    "experience": { "score": <0-100>, "feedback": "<specific feedback>" },
    "projects": { "score": <0-100>, "feedback": "<specific feedback>" },
    "skills": { "score": <0-100>, "feedback": "<specific feedback>" }
  },
  "bulletRewrites": [
    {
      "original": "<weak bullet point from the resume>",
      "improved": "<rewritten version with metrics and impact>",
      "reason": "<why this rewrite is better>"
    }
  ]
}

Rules:
- Identify up to 3 weak bullet points and rewrite them with measurable impact
- If a section is missing from the resume, give it a score of 0 and note it
- keywordGaps should list skills commonly required but missing from this resume
- Return ONLY valid JSON, no markdown fences, no explanation text`;

    const defaultAnalysis: ResumeAnalysis = {
        overallScore: 0,
        atsScore: 0,
        summary: 'Analysis could not be completed',
        strengths: [],
        improvements: ['Please try analyzing again'],
        keywordGaps: [],
        formattingTips: [],
        sectionFeedback: {
            education: { score: 0, feedback: 'Could not analyze' },
            experience: { score: 0, feedback: 'Could not analyze' },
            projects: { score: 0, feedback: 'Could not analyze' },
            skills: { score: 0, feedback: 'Could not analyze' },
        },
        bulletRewrites: [],
    };

    return callAIJSON<ResumeAnalysis>(
        [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: resumeText },
        ],
        { temperature: 0.3, maxTokens: 2500 },
        defaultAnalysis
    );
};

// ── GitHub Repo Analysis ────────────────────────────────────────────────────

export const analyzeGitHubRepo = async (repoData: GitHubRepoData): Promise<GitHubAnalysis> => {
    const enrichedContext = [
        `Repository: ${repoData.name}`,
        `Description: ${repoData.description || 'None'}`,
        `Primary Language: ${repoData.language || 'Not detected'}`,
        `Languages: ${repoData.languages?.join(', ') || 'Unknown'}`,
        `Stars: ${repoData.stars} | Forks: ${repoData.forks} | Open Issues: ${repoData.openIssues}`,
        `Topics: ${repoData.topics?.join(', ') || 'None'}`,
        `Created: ${repoData.createdAt} | Last Updated: ${repoData.updatedAt}`,
        repoData.commitFrequency
            ? `Commit Activity: ${repoData.commitFrequency.totalLastYear} commits last year (avg ${repoData.commitFrequency.avgPerWeek}/week)`
            : '',
        repoData.hasTests !== undefined ? `Has Tests: ${repoData.hasTests}` : '',
        repoData.hasCICD !== undefined ? `Has CI/CD: ${repoData.hasCICD}` : '',
        repoData.hasDockerfile !== undefined ? `Has Dockerfile: ${repoData.hasDockerfile}` : '',
        repoData.fileCount !== undefined ? `File Count: ${repoData.fileCount}` : '',
        `\n--- README (truncated) ---\n${repoData.readme || 'No README found'}`,
    ].filter(Boolean).join('\n');

    const systemPrompt = `You are a senior software architect reviewing GitHub repositories for code quality and job-readiness.

Analyze the repository data and return a JSON response with EXACTLY this structure:
{
  "overallScore": <number 0-100>,
  "readmeScore": <number 0-100>,
  "activityScore": <number 0-100>,
  "codeStructureScore": <number 0-100>,
  "summary": "<brief quality assessment>",
  "codeQuality": "<assessment of code quality>",
  "architecture": "<assessment of project architecture>",
  "strengths": ["<strength 1>", ...],
  "improvements": ["<specific improvement>", ...],
  "techStack": ["<tech 1>", "<tech 2>", ...],
  "suggestions": ["<actionable suggestion>", ...]
}

Scoring guide:
- readmeScore: based on README completeness (setup instructions, screenshots, description, badges)
- activityScore: based on commit frequency, recency of updates, open issues being managed
- codeStructureScore: based on folder organization, separation of concerns, presence of tests/CI/CD
- overallScore: weighted combination of the above

Return ONLY valid JSON, no markdown fences, no explanation text`;

    const defaultAnalysis: GitHubAnalysis = {
        overallScore: 0,
        readmeScore: 0,
        activityScore: 0,
        codeStructureScore: 0,
        summary: 'Analysis could not be completed',
        codeQuality: 'Unknown',
        architecture: 'Unknown',
        strengths: [],
        improvements: ['Please try analyzing again'],
        techStack: [],
        suggestions: [],
    };

    return callAIJSON<GitHubAnalysis>(
        [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: enrichedContext },
        ],
        { temperature: 0.3, maxTokens: 2000 },
        defaultAnalysis
    );
};

// ── Generate Final Insights (for Scoring Engine) ────────────────────────────

export const generateFinalInsights = async (
    resumeAnalysis: ResumeAnalysis,
    githubAnalysis: GitHubAnalysis,
    finalScore: number,
    category: string,
    skills: string[]
): Promise<string[]> => {
    const context = `
Resume Score: ${resumeAnalysis.overallScore}/100
Resume Weaknesses: ${resumeAnalysis.improvements.join('; ')}
GitHub Score: ${githubAnalysis.overallScore}/100
GitHub Weaknesses: ${githubAnalysis.improvements.join('; ')}
Skills Listed: ${skills.join(', ')}
Final Job Ready Score: ${finalScore}/100
Category: ${category}
    `.trim();

    const systemPrompt = `You are a career strategist. Based on a candidate's resume analysis, GitHub analysis, and skills, generate EXACTLY 5 prioritized improvement actions.

Return a JSON array of exactly 5 strings. Each string should be:
- Specific and actionable (not vague motivation)
- Include a concrete example or metric when possible
- Ordered by impact (highest impact first)

Return ONLY a valid JSON array of 5 strings, no markdown fences, no object wrapper.
Example: ["Action 1", "Action 2", "Action 3", "Action 4", "Action 5"]`;

    const defaultInsights = [
        'Improve your resume with quantifiable achievements',
        'Add comprehensive README files to your GitHub projects',
        'Expand your technical skill set',
        'Add unit tests to your projects',
        'Practice coding interviews regularly',
    ];

    return callAIJSON<string[]>(
        [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: context },
        ],
        { temperature: 0.5, maxTokens: 800 },
        defaultInsights
    );
};

// ── Job Recommendations ─────────────────────────────────────────────────────

export const recommendJobs = async (userProfile: UserProfileForJobs): Promise<JobRecommendation[]> => {
    const response = await callAI(
        [
            {
                role: 'system',
                content: `You are an AI career advisor. Based on the developer's profile, generate 6 realistic job recommendations. Return a JSON array where each job has:
        - title: job title
        - company: realistic company name
        - location: city or "Remote"
        - type: "remote" | "onsite" | "hybrid"
        - matchScore: 0-100 how well it matches
        - skills: array of required skills
        - description: 2-3 sentence job description
        - salary: estimated salary range
        Return ONLY a valid JSON array, no markdown.`,
            },
            { role: 'user', content: JSON.stringify(userProfile) },
        ],
        { temperature: 0.7, maxTokens: 3000 }
    );

    return parseJSON<JobRecommendation[]>(response, []);
};

// ── Interview Question Generation ───────────────────────────────────────────

export const generateInterviewQuestion = async (
    topic: string,
    difficulty: string,
    type: string,
    previousMessages: { role: string; content: string }[]
): Promise<string> => {
    const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
        {
            role: 'system',
            content: `You are an expert technical interviewer conducting a ${difficulty}-level ${type} interview about ${topic}. 
      Ask one question at a time. After the candidate responds, evaluate their answer briefly and ask a follow-up or new question. 
      Be encouraging but honest. If the candidate asks to end the interview, provide a summary with a score out of 100 and key feedback.
      Keep responses concise and professional.`,
        },
        ...(previousMessages as { role: 'system' | 'user' | 'assistant'; content: string }[]),
    ];

    return callAI(messages, { temperature: 0.6, maxTokens: 800 });
};

// ── Cover Letter Generation ─────────────────────────────────────────────────

export const generateCoverLetter = async (data: CoverLetterInput): Promise<string> => {
    return callAI(
        [
            {
                role: 'system',
                content: `You are an expert career coach. Write a professional, personalized cover letter based on the candidate's resume and the job description. 
        Tone: ${data.tone || 'professional'}. 
        Make it compelling, specific to the role, and highlight relevant experience. 
        Keep it under 400 words. Return the cover letter text only, no headers or markdown.`,
            },
            {
                role: 'user',
                content: `Resume:\n${data.resumeText}\n\nJob Description:\n${data.jobDescription}\n\nCompany: ${data.companyName}`,
            },
        ],
        { temperature: 0.7, maxTokens: 1000 }
    );
};

// ── Skill Roadmap Generation ────────────────────────────────────────────────

export const generateSkillRoadmap = async (skills: string[], targetRole: string): Promise<SkillRoadmap> => {
    const defaultRoadmap: SkillRoadmap = {
        currentLevel: 'Unknown',
        targetRole,
        timeline: 'Unknown',
        phases: [],
        tips: ['Please try again'],
    };

    return callAIJSON<SkillRoadmap>(
        [
            {
                role: 'system',
                content: `You are a career coach and tech lead. Create a personalized skill development roadmap. Return a JSON response with:
        - currentLevel: assessment of current skill level
        - targetRole: the role they're aiming for
        - timeline: estimated months to reach target
        - phases: array of phases, each with { name, duration, skills: [{ name, priority, resources }] }
        - tips: array of general career tips
        Return ONLY valid JSON, no markdown.`,
            },
            {
                role: 'user',
                content: `Current skills: ${skills.join(', ')}\nTarget role: ${targetRole}`,
            },
        ],
        { temperature: 0.5, maxTokens: 2000 },
        defaultRoadmap
    );
};

// ── Career Mentor Chat ──────────────────────────────────────────────────────

export const careerMentorChat = async (
    message: string,
    history: { role: string; content: string }[]
): Promise<string> => {
    const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
        {
            role: 'system',
            content: `You are DevPilot AI — an expert AI career mentor specializing in helping Indian fresh graduates and jobless students land their first IT job.

You have deep knowledge of:
- Indian IT job market (TCS, Infosys, Wipro, HCL, Accenture, startups, MNCs)
- Campus placements, off-campus drives, and walk-in interviews
- Required skills for different roles (Frontend, Backend, Full Stack, Data Science, DevOps)
- ATS resume optimization
- Project building strategies that impress recruiters
- Interview preparation (technical + HR + behavioral)
- Freelancing and remote work opportunities for beginners

Guidelines:
- Give specific, actionable advice — not vague motivational talk
- Include concrete steps with timelines when possible
- Reference real tools, platforms, and technologies
- Be encouraging but honest about what it takes
- Use simple English that non-native speakers can understand
- When recommending learning paths, suggest free resources first
- Format responses with bullet points and numbered lists for clarity
- Keep responses concise but comprehensive`,
        },
        ...(history as { role: 'system' | 'user' | 'assistant'; content: string }[]),
        { role: 'user', content: message },
    ];

    const response = await callAI(messages, { temperature: 0.7, maxTokens: 1500 });
    return response || 'I apologize, I could not process that. Please try again.';
};

// ── Portfolio Content Generation ────────────────────────────────────────────

export const generatePortfolioContent = async (data: PortfolioInput): Promise<string> => {
    const raw = await callAI(
        [
            {
                role: 'system',
                content: `You are an expert web developer. Generate a complete, beautiful, single-page portfolio website as a standalone HTML file.
        The HTML must include embedded CSS (in a <style> tag) and be fully self-contained.
        Design: Modern, dark theme with gradient accents, smooth animations, responsive layout.
        Sections: Hero with name & bio, Skills (as tags), Projects (card grid), Contact info, Footer.
        Use Google Fonts (Inter). Make it look professional and premium.
        Return ONLY the complete HTML code, nothing else.`,
            },
            {
                role: 'user',
                content: JSON.stringify(data),
            },
        ],
        { temperature: 0.5, maxTokens: 4000 }
    );

    // Clean any markdown code fences
    return raw
        .replace(/^```(?:html)?\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();
};
