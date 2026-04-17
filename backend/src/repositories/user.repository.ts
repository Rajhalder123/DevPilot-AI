import { User, IUser } from '../models/User';

/**
 * Database access layer for User documents.
 */
export class UserRepository {
    async findById(userId: string) {
        return User.findById(userId);
    }

    async findByEmail(email: string) {
        return User.findOne({ email });
    }

    async findByEmailWithPassword(email: string) {
        return User.findOne({ email }).select('+password');
    }

    async findByGitHubId(githubId: string) {
        return User.findOne({ githubId });
    }

    async create(data: Partial<IUser>) {
        return User.create(data);
    }

    async updateProfile(userId: string, data: Partial<IUser>) {
        return User.findByIdAndUpdate(userId, data, {
            new: true,
            runValidators: true,
        });
    }

    async incrementCounter(userId: string, field: 'resumeCount' | 'interviewCount') {
        return User.findByIdAndUpdate(userId, { $inc: { [field]: 1 } });
    }
}

export const userRepository = new UserRepository();
