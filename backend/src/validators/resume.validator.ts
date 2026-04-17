import { z } from 'zod';

export const analyzeResumeSchema = z.object({
    resumeId: z.string().min(1, 'Resume ID is required'),
});

export const analyzeTextSchema = z.object({
    text: z.string().min(50, 'Resume text must be at least 50 characters'),
});
