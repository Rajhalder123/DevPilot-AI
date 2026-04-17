import { z } from 'zod';

const projectSchema = z.object({
    title: z.string().trim().min(1),
    description: z.string().trim(),
    link: z.string().default(''),
    tech: z.string().default(''),
});

export const generatePortfolioSchema = z.object({
    name: z.string().trim().min(2, 'Name is required'),
    bio: z.string().trim().min(10, 'Bio is required (at least 10 characters)'),
    skills: z.array(z.string().trim().min(1)).default([]),
    projects: z.array(projectSchema).default([]),
    github: z.string().default(''),
    linkedin: z.string().default(''),
    email: z.string().email().or(z.literal('')).default(''),
});
