import { JobMatch, IJobMatch } from '../models/JobMatch';

/**
 * Database access layer for JobMatch documents.
 */
export class JobMatchRepository {
    async create(data: Partial<IJobMatch>) {
        return JobMatch.create(data);
    }

    async findByUser(userId: string, limit: number = 20) {
        return JobMatch.find({ userId })
            .sort({ createdAt: -1 })
            .limit(limit);
    }

    async countByUser(userId: string) {
        return JobMatch.countDocuments({ userId });
    }
}

export const jobMatchRepository = new JobMatchRepository();
