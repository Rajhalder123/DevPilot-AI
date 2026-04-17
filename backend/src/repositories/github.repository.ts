import { GitHubProject, IGitHubProject } from '../models/GitHubProject';

/**
 * Database access layer for GitHubProject documents.
 */
export class GitHubRepository {
    async create(data: Partial<IGitHubProject>) {
        return GitHubProject.create(data);
    }

    async findByUser(userId: string, limit: number = 20) {
        return GitHubProject.find({ userId })
            .sort({ createdAt: -1 })
            .limit(limit);
    }

    async countByUser(userId: string) {
        return GitHubProject.countDocuments({ userId });
    }

    async getRecentScores(userId: string, limit: number = 5) {
        const projects = await GitHubProject.find({ userId })
            .sort({ createdAt: -1 })
            .limit(limit);
        return projects
            .filter((g: any) => g.analysis?.overallScore)
            .map((g: any) => g.analysis.overallScore);
    }
}

export const githubRepository = new GitHubRepository();
