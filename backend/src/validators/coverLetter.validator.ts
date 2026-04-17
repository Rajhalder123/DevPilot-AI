import { z } from 'zod';

export const generateCoverLetterSchema = z.object({
    resumeText: z.string().min(50, 'Resume text is required'),
    jobDescription: z.string().min(20, 'Job description is required'),
    companyName: z.string().default('the company'),
    tone: z.enum(['professional', 'enthusiastic', 'concise']).default('professional'),
});
