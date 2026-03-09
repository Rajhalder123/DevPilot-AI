import mongoose, { Schema, Document } from 'mongoose';

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

const githubProjectSchema = new Schema<IGitHubProject>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        repoUrl: { type: String, required: true },
        repoName: { type: String, required: true },
        owner: { type: String, required: true },
        description: { type: String, default: '' },
        language: { type: String, default: '' },
        stars: { type: Number, default: 0 },
        forks: { type: Number, default: 0 },
        analysis: {
            overallScore: { type: Number, default: 0 },
            summary: { type: String, default: '' },
            codeQuality: { type: String, default: '' },
            architecture: { type: String, default: '' },
            strengths: [{ type: String }],
            improvements: [{ type: String }],
            techStack: [{ type: String }],
            suggestions: [{ type: String }],
        },
        status: { type: String, enum: ['pending', 'analyzing', 'completed', 'failed'], default: 'pending' },
    },
    { timestamps: true }
);

export const GitHubProject = mongoose.model<IGitHubProject>('GitHubProject', githubProjectSchema);
