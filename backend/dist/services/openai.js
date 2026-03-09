"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSkillRoadmap = exports.generateCoverLetter = exports.generateInterviewQuestion = exports.recommendJobs = exports.analyzeGitHubRepo = exports.analyzeResume = void 0;
const openai_1 = __importDefault(require("openai"));
const env_1 = require("../config/env");
const openai = new openai_1.default({ apiKey: env_1.env.OPENAI_API_KEY });
const analyzeResume = async (resumeText) => {
    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            {
                role: 'system',
                content: `You are an expert resume analyst and career consultant. Analyze the following resume and return a JSON response with:
        - overallScore: number 0-100
        - summary: brief overview of the resume quality
        - strengths: array of strengths
        - improvements: array of specific improvements needed
        - keywordGaps: array of important missing keywords for tech roles
        - formattingTips: array of formatting suggestions
        - atsScore: ATS compatibility score 0-100
        Return ONLY valid JSON, no markdown.`,
            },
            { role: 'user', content: resumeText },
        ],
        temperature: 0.3,
        max_tokens: 2000,
    });
    return JSON.parse(response.choices[0].message.content || '{}');
};
exports.analyzeResume = analyzeResume;
const analyzeGitHubRepo = async (repoData) => {
    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            {
                role: 'system',
                content: `You are a senior software architect reviewing GitHub repositories. Analyze the repository data and return a JSON response with:
        - overallScore: number 0-100
        - summary: brief quality assessment
        - codeQuality: assessment of code quality
        - architecture: assessment of project architecture
        - strengths: array of project strengths
        - improvements: array of specific improvements
        - techStack: identified technologies used
        - suggestions: actionable suggestions to improve the project
        Return ONLY valid JSON, no markdown.`,
            },
            { role: 'user', content: JSON.stringify(repoData) },
        ],
        temperature: 0.3,
        max_tokens: 2000,
    });
    return JSON.parse(response.choices[0].message.content || '{}');
};
exports.analyzeGitHubRepo = analyzeGitHubRepo;
const recommendJobs = async (userProfile) => {
    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
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
        temperature: 0.7,
        max_tokens: 3000,
    });
    return JSON.parse(response.choices[0].message.content || '[]');
};
exports.recommendJobs = recommendJobs;
const generateInterviewQuestion = async (topic, difficulty, type, previousMessages) => {
    const messages = [
        {
            role: 'system',
            content: `You are an expert technical interviewer conducting a ${difficulty}-level ${type} interview about ${topic}. 
      Ask one question at a time. After the candidate responds, evaluate their answer briefly and ask a follow-up or new question. 
      Be encouraging but honest. If the candidate asks to end the interview, provide a summary with a score out of 100 and key feedback.
      Keep responses concise and professional.`,
        },
        ...previousMessages,
    ];
    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages,
        temperature: 0.6,
        max_tokens: 800,
    });
    return response.choices[0].message.content || 'Could you elaborate on that?';
};
exports.generateInterviewQuestion = generateInterviewQuestion;
const generateCoverLetter = async (data) => {
    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
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
        temperature: 0.7,
        max_tokens: 1000,
    });
    return response.choices[0].message.content || '';
};
exports.generateCoverLetter = generateCoverLetter;
const generateSkillRoadmap = async (skills, targetRole) => {
    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
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
        temperature: 0.5,
        max_tokens: 2000,
    });
    return JSON.parse(response.choices[0].message.content || '{}');
};
exports.generateSkillRoadmap = generateSkillRoadmap;
//# sourceMappingURL=openai.js.map