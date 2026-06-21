import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { careerMentorChat } from '../services/ai.service';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';
import { Conversation } from '../models/Conversation';

// POST /api/career-mentor/chat
export const chat = asyncHandler(async (req: Request, res: Response) => {
    logger.info('entering careerMentorController.chat');
    const { message, conversationId, history = [] } = req.body;
    const userId = (req as any).user._id;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
        throw AppError.badRequest('Message is required');
    }

    logger.info('calling careerMentorChat');
    const aiResponse = await careerMentorChat(message.trim(), history);
    logger.info('careerMentorChat finished');

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

    logger.info('sending response');
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

// DELETE /api/career-mentor/conversations/:id
export const deleteConversation = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user._id;
    const { id } = req.params;

    const result = await Conversation.deleteOne({ _id: id, userId });

    if (result.deletedCount === 0) {
        throw AppError.notFound('Conversation not found or not authorized');
    }

    res.json({ success: true, message: 'Conversation deleted successfully' });
});

// PATCH /api/career-mentor/conversations/:id  (rename)
export const renameConversation = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user._id;
    const { id } = req.params;
    const { title } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
        throw AppError.badRequest('Title is required');
    }

    const conversation = await Conversation.findOneAndUpdate(
        { _id: id, userId },
        { title: title.trim().substring(0, 60) },
        { new: true }
    );

    if (!conversation) {
        throw AppError.notFound('Conversation not found or not authorized');
    }

    res.json({ success: true, conversation: { _id: conversation._id, title: conversation.title } });
});
