import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { generatePortfolioContent } from '../services/ai.service';

// POST /api/portfolio/generate
export const generate = asyncHandler(async (req: Request, res: Response) => {
    const { name, bio, skills, projects, github, linkedin, email } = req.body;

    const html = await generatePortfolioContent({
        name,
        bio,
        skills: skills || [],
        projects: projects || [],
        github: github || '',
        linkedin: linkedin || '',
        email: email || '',
    });

    res.json({ html });
});
