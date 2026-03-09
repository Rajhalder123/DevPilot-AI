import mongoose, { Document } from 'mongoose';
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
export declare const Resume: mongoose.Model<IResume, {}, {}, {}, mongoose.Document<unknown, {}, IResume, {}, {}> & IResume & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Resume.d.ts.map