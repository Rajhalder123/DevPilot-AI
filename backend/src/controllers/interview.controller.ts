import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import * as interviewService from '../services/interview.service';

// POST /api/interview/start
export const start = asyncHandler(async (req: Request, res: Response) => {
    const { topic, difficulty, type } = req.body;
    const session = await interviewService.startSession(
        req.user!._id.toString(),
        topic,
        difficulty,
        type
    );
    res.status(201).json({ session });
});

// POST /api/interview/:sessionId/respond
export const respond = asyncHandler(async (req: Request, res: Response) => {
    const { message } = req.body;
    const sessionId = req.params.sessionId as string;
    const session = await interviewService.respond(
        sessionId,
        req.user!._id.toString(),
        message
    );
    res.json({ session });
});

// GET /api/interview/history
export const history = asyncHandler(async (req: Request, res: Response) => {
    const sessions = await interviewService.getHistory(req.user!._id.toString());
    res.json({ sessions });
});

// GET /api/interview/:sessionId
export const getSession = asyncHandler(async (req: Request, res: Response) => {
    const sessionId = req.params.sessionId as string;
    const session = await interviewService.getSession(
        sessionId,
        req.user!._id.toString()
    );
    res.json({ session });
});

// POST /api/interview/message  (Voice Assistant — no session needed)
export const message = asyncHandler(async (req: Request, res: Response) => {
    const { message: msg, topic } = req.body;
    const reply = await interviewService.quickMessage(msg, topic);
    res.json({ message: reply });
});
