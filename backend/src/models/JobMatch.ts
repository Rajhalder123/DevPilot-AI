import mongoose, { Schema, Document } from 'mongoose';

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

const jobMatchSchema = new Schema<IJobMatch>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        title: { type: String, required: true },
        company: { type: String, required: true },
        location: { type: String, default: 'Remote' },
        type: { type: String, enum: ['remote', 'onsite', 'hybrid'], default: 'remote' },
        matchScore: { type: Number, default: 0, min: 0, max: 100 },
        skills: [{ type: String }],
        description: { type: String, default: '' },
        salary: { type: String, default: '' },
        url: { type: String, default: '' },
        appliedAt: { type: Date, default: null },
    },
    { timestamps: true }
);

export const JobMatch = mongoose.model<IJobMatch>('JobMatch', jobMatchSchema);
