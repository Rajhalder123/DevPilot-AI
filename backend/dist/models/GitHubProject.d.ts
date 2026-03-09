import mongoose, { Document } from 'mongoose';
export interface IGitHubProject extends Document {
    userId: mongoose.Types.ObjectId;
    repoUrl: string;
    repoName: string;
    owner: string;
    description: string;
    language: string;
    stars: number;
    forks: number;
    analysis: {
        overallScore: number;
        summary: string;
        codeQuality: string;
        architecture: string;
        strengths: string[];
        improvements: string[];
        techStack: string[];
        suggestions: string[];
    } | null;
    status: 'pending' | 'analyzing' | 'completed' | 'failed';
    createdAt: Date;
    updatedAt: Date;
}
export declare const GitHubProject: mongoose.Model<IGitHubProject, {}, {}, {}, mongoose.Document<unknown, {}, IGitHubProject, {}, {}> & IGitHubProject & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=GitHubProject.d.ts.map