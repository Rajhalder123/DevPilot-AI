/**
 * Legacy re-export shim.
 * All AI functions have been refactored into ai.service.ts.
 * This file ensures existing imports continue to work.
 */
export {
    analyzeResume,
    analyzeGitHubRepo,
    recommendJobs,
    generateInterviewQuestion,
    generateCoverLetter,
    generateSkillRoadmap,
    careerMentorChat,
    generatePortfolioContent,
} from './ai.service';
