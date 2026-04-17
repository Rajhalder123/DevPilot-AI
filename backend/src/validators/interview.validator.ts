import { z } from 'zod';

export const startInterviewSchema = z.object({
    topic: z.string().trim().min(1, 'Interview topic is required').max(200),
    difficulty: z.enum(['easy', 'medium', 'hard', 'junior', 'mid', 'senior', 'lead']).default('mid'),
    type: z.enum(['technical', 'behavioral', 'system-design', 'coding']).default('technical'),
});

export const respondInterviewSchema = z.object({
    message: z.string().trim().min(1, 'Message is required').max(5000),
});

export const interviewMessageSchema = z.object({
    message: z.string().trim().min(1, 'Message is required').max(5000),
    topic: z.string().trim().default('General AI & Interview Practice'),
});
