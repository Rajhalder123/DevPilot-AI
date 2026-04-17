import { z } from 'zod';

export const fullAnalysisSchema = z.object({
    resumeText: z.string().min(50, 'Resume text must be at least 50 characters'),
    repoUrl: z
        .string()
        .url('Must be a valid URL')
        .regex(/github\.com\/[^/]+\/[^/]+/, 'Must be a valid GitHub repository URL'),
    skills: z
        .array(z.string().trim().min(1))
        .min(1, 'At least one skill is required')
        .max(30, 'Maximum 30 skills allowed'),
});
