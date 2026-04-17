import { InterviewSession } from '../models/InterviewSession';

/**
 * Database access layer for InterviewSession documents.
 */
export class InterviewRepository {
    async findByUser(userId: string, limit: number = 20) {
        return InterviewSession.find({ userId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .select('-messages');
    }

    async findCompletedWithScores(userId: string, limit: number = 5) {
        return InterviewSession.find({
            userId,
            status: 'completed',
            score: { $ne: null },
        })
            .sort({ createdAt: -1 })
            .limit(limit);
    }

    async countByUser(userId: string) {
        return InterviewSession.countDocuments({ userId });
    }

    async getAverageScore(userId: string): Promise<number> {
        const result = await InterviewSession.aggregate([
            { $match: { userId, score: { $ne: null } } },
            { $group: { _id: null, avgScore: { $avg: '$score' } } },
        ]);
        return result[0]?.avgScore || 0;
    }

    async getRecentScores(userId: string, limit: number = 5) {
        const sessions = await this.findCompletedWithScores(userId, limit);
        return sessions
            .filter((i: any) => i.score)
            .map((i: any) => i.score);
    }
}

export const interviewRepository = new InterviewRepository();
