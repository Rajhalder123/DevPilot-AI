import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { careerMentorChat } from '../services/ai.service';
import { AppError } from '../utils/AppError';
import { Conversation } from '../models/Conversation';

// POST /api/career-mentor/chat
export const chat = asyncHandler(async (req: Request, res: Response) => {
    const { message, conversationId, history = [] } = req.body;
    const userId = (req as any).user._id;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
        throw AppError.badRequest('Message is required');
    }

    const aiResponse = await careerMentorChat(message.trim(), history);

    // Persist to Database
    let conversation;
    if (conversationId) {
        conversation = await Conversation.findOne({ _id: conversationId, userId });
        if (conversation) {
            conversation.messages.push({ role: 'user', content: message.trim(), timestamp: new Date() });
            conversation.messages.push({ role: 'assistant', content: aiResponse, timestamp: new Date() });
            conversation.lastMessageAt = new Date();
            await conversation.save();
        }
    } else {
        // Create new conversation
        conversation = await Conversation.create({
            userId,
            title: message.trim().substring(0, 40) + (message.length > 40 ? '...' : ''),
            messages: [
                { role: 'user', content: message.trim(), timestamp: new Date() },
                { role: 'assistant', content: aiResponse, timestamp: new Date() }
            ],
            lastMessageAt: new Date()
        });
    }

    res.json({ 
        response: aiResponse,
        conversationId: conversation?._id 
    });
});

// GET /api/career-mentor/conversations
export const getConversations = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user._id;
    const conversations = await Conversation.find({ userId })
        .select('title lastMessageAt updatedAt')
        .sort({ lastMessageAt: -1 })
        .limit(20);
    
    res.json({ conversations });
});

// GET /api/career-mentor/history/:id
export const getHistory = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user._id;
    const { id } = req.params;

    const conversation = await Conversation.findOne({ _id: id, userId });
    if (!conversation) {
        throw AppError.notFound('Conversation not found');
    }

    // Return last 20 messages as requested
    const last20Messages = conversation.messages.slice(-20);
    res.json({ messages: last20Messages, title: conversation.title });
});
