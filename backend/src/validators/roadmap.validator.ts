import { z } from 'zod';

export const generateRoadmapSchema = z.object({
    skills: z
        .array(z.string().trim().min(1))
        .min(1, 'At least one skill is required')
        .max(30),
    targetRole: z.string().trim().min(2, 'Target role is required').max(100),
});
