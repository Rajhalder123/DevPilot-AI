export declare const analyzeResume: (resumeText: string) => Promise<any>;
export declare const analyzeGitHubRepo: (repoData: {
    name: string;
    description: string;
    language: string;
    readme: string;
    topics: string[];
    stars: number;
    forks: number;
}) => Promise<any>;
export declare const recommendJobs: (userProfile: {
    skills: string[];
    experience: string;
    preferences: string;
}) => Promise<any>;
export declare const generateInterviewQuestion: (topic: string, difficulty: string, type: string, previousMessages: {
    role: string;
    content: string;
}[]) => Promise<string>;
export declare const generateCoverLetter: (data: {
    resumeText: string;
    jobDescription: string;
    companyName: string;
    tone: string;
}) => Promise<string>;
export declare const generateSkillRoadmap: (skills: string[], targetRole: string) => Promise<any>;
//# sourceMappingURL=openai.d.ts.map