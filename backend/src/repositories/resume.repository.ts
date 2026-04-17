import { Resume, IResume } from '../models/Resume';

/**
 * Database access layer for Resume documents.
 */
export class ResumeRepository {
    async create(data: Partial<IResume>) {
        return Resume.create(data);
    }

    async findByIdAndUser(resumeId: string, userId: string) {
        return Resume.findOne({ _id: resumeId, userId });
    }

    async findByUser(userId: string, limit: number = 20) {
        return Resume.find({ userId })
            .sort({ createdAt: -1 })
            .limit(limit);
    }

    async findByUserWithoutText(userId: string, limit: number = 20) {
        return Resume.find({ userId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .select('-rawText');
    }

    async countByUser(userId: string) {
        return Resume.countDocuments({ userId });
    }

    async getRecentScores(userId: string, limit: number = 5) {
        const resumes = await Resume.find({ userId })
            .sort({ createdAt: -1 })
            .limit(limit);
        return resumes
            .filter((r: any) => r.analysis?.overallScore)
            .map((r: any) => r.analysis.overallScore);
    }
}

export const resumeRepository = new ResumeRepository();
