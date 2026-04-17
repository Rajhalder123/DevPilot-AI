import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { generateSkillRoadmap } from '../services/ai.service';

// POST /api/roadmap/generate
export const generate = asyncHandler(async (req: Request, res: Response) => {
    const { skills, targetRole } = req.body;
    const roadmap = await generateSkillRoadmap(skills, targetRole);
    res.json({ roadmap });
});
