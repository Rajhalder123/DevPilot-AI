import mongoose, { Schema, Document } from 'mongoose';

export interface IResume extends Document {
    userId: mongoose.Types.ObjectId;
    fileName: string;
    fileUrl: string;
    rawText: string;
    analysis: {
        overallScore: number;
        summary: string;
        strengths: string[];
        improvements: string[];
        keywordGaps: string[];
        formattingTips: string[];
        atsScore: number;
    } | null;
    status: 'uploaded' | 'analyzing' | 'completed' | 'failed';
    createdAt: Date;
    updatedAt: Date;
}

const resumeSchema = new Schema<IResume>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        fileName: { type: String, required: true },
        fileUrl: { type: String, required: true },
        rawText: { type: String, default: '' },
        analysis: {
            overallScore: { type: Number, default: 0 },
            summary: { type: String, default: '' },
            strengths: [{ type: String }],
            improvements: [{ type: String }],
            keywordGaps: [{ type: String }],
            formattingTips: [{ type: String }],
            atsScore: { type: Number, default: 0 },
        },
        status: { type: String, enum: ['uploaded', 'analyzing', 'completed', 'failed'], default: 'uploaded' },
    },
    { timestamps: true }
);

export const Resume = mongoose.model<IResume>('Resume', resumeSchema);
