import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export interface IConversation extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    messages: IMessage[];
    lastMessageAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: true, default: 'New Conversation' },
        messages: [
            {
                role: { type: String, enum: ['user', 'assistant'], required: true },
                content: { type: String, required: true },
                timestamp: { type: Date, default: Date.now },
            },
        ],
        lastMessageAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

// Index for faster history retrieval
conversationSchema.index({ userId: 1, lastMessageAt: -1 });

export const Conversation = mongoose.model<IConversation>('Conversation', conversationSchema);
