import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
}

export interface IInterviewSession extends Document {
    userId: mongoose.Types.ObjectId;
    topic: string;
    difficulty: 'easy' | 'medium' | 'hard' | 'junior' | 'mid' | 'senior' | 'lead';
    type: 'technical' | 'behavioral' | 'system-design' | 'coding';
    messages: IMessage[];
    score: number | null;
    feedback: string;
    questionsAsked: number;
    questionsAnswered: number;
    status: 'active' | 'completed' | 'abandoned';
    createdAt: Date;
    updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
    {
        role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
    },
    { _id: false }
);

const interviewSessionSchema = new Schema<IInterviewSession>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        topic: { type: String, required: true },
        difficulty: { type: String, enum: ['easy', 'medium', 'hard', 'junior', 'mid', 'senior', 'lead'], default: 'mid' },
        type: { type: String, enum: ['technical', 'behavioral', 'system-design', 'coding'], default: 'technical' },
        messages: [messageSchema],
        score: { type: Number, default: null, min: 0, max: 100 },
        feedback: { type: String, default: '' },
        questionsAsked: { type: Number, default: 0 },
        questionsAnswered: { type: Number, default: 0 },
        status: { type: String, enum: ['active', 'completed', 'abandoned'], default: 'active' },
    },
    { timestamps: true }
);

export const InterviewSession = mongoose.model<IInterviewSession>('InterviewSession', interviewSessionSchema);
