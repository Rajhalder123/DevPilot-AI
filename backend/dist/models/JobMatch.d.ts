import mongoose, { Document } from 'mongoose';
export interface IJobMatch extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    company: string;
    location: string;
    type: 'remote' | 'onsite' | 'hybrid';
    matchScore: number;
    skills: string[];
    description: string;
    salary: string;
    url: string;
    appliedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
export declare const JobMatch: mongoose.Model<IJobMatch, {}, {}, {}, mongoose.Document<unknown, {}, IJobMatch, {}, {}> & IJobMatch & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=JobMatch.d.ts.map