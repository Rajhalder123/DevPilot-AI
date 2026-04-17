import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { careerMentorChat } from '../services/ai.service';
import { AppError } from '../utils/AppError';

// POST /api/career-mentor/chat
export const chat = asyncHandler(async (req: Request, res: Response) => {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
        throw AppError.badRequest('Message is required');
    }

    const response = await careerMentorChat(message.trim(), history);
    res.json({ response });
});
