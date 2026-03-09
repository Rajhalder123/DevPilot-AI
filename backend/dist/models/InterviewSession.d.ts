import mongoose, { Document } from 'mongoose';
export interface IMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
}
export interface IInterviewSession extends Document {
    userId: mongoose.Types.ObjectId;
    topic: string;
    difficulty: 'junior' | 'mid' | 'senior' | 'lead';
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
export declare const InterviewSession: mongoose.Model<IInterviewSession, {}, {}, {}, mongoose.Document<unknown, {}, IInterviewSession, {}, {}> & IInterviewSession & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=InterviewSession.d.ts.map