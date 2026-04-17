import { InterviewSession } from '../models/InterviewSession';
import { User } from '../models/User';
import { generateInterviewQuestion } from './ai.service';
import { AppError } from '../utils/AppError';

/**
 * Interview business logic extracted from routes.
 */

/** Start a new interview session */
export const startSession = async (
    userId: string,
    topic: string,
    difficulty: string = 'mid',
    type: string = 'technical'
) => {
    const initialMessage = await generateInterviewQuestion(topic, difficulty, type, []);

    const session = await InterviewSession.create({
        userId,
        topic,
        difficulty,
        type,
        messages: [{ role: 'assistant', content: initialMessage, timestamp: new Date() }],
        questionsAsked: 1,
        status: 'active',
    });

    await User.findByIdAndUpdate(userId, { $inc: { interviewCount: 1 } });
    return session;
};

/** Respond to an active interview session */
export const respond = async (sessionId: string, userId: string, message: string) => {
    const session = await InterviewSession.findOne({ _id: sessionId, userId });
    if (!session) throw AppError.notFound('Session');
    if (session.status !== 'active') throw AppError.badRequest('This interview session has ended');

    // Add user message
    session.messages.push({ role: 'user', content: message, timestamp: new Date() });
    session.questionsAnswered += 1;

    // Generate AI response
    const aiResponse = await generateInterviewQuestion(
        session.topic,
        session.difficulty,
        session.type,
        session.messages.map((m) => ({ role: m.role, content: m.content }))
    );

    session.messages.push({ role: 'assistant', content: aiResponse, timestamp: new Date() });
    session.questionsAsked += 1;

    // Check if interview should end
    if (message.toLowerCase().includes('end interview') || session.questionsAsked >= 10) {
        session.status = 'completed';
        session.feedback = aiResponse;
        const scoreMatch = aiResponse.match(/(\d{1,3})\/100|score[:\s]*(\d{1,3})/i);
        if (scoreMatch) {
            session.score = parseInt(scoreMatch[1] || scoreMatch[2]);
        }
    }

    await session.save();
    return session;
};

/** Get interview history */
export const getHistory = async (userId: string) => {
    return InterviewSession.find({ userId })
        .sort({ createdAt: -1 })
        .limit(20)
        .select('-messages');
};

/** Get a single session */
export const getSession = async (sessionId: string, userId: string) => {
    const session = await InterviewSession.findOne({ _id: sessionId, userId });
    if (!session) throw AppError.notFound('Session');
    return session;
};

/** Quick message (no session, for Voice Assistant) */
export const quickMessage = async (message: string, topic: string) => {
    return generateInterviewQuestion(topic, 'medium', 'behavioral', [
        { role: 'user', content: message },
    ]);
};
