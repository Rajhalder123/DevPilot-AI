import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    avatar?: string;
    githubId?: string;
    githubUsername?: string;
    githubAccessToken?: string;
    skills: string[];
    bio?: string;
    location?: string;
    website?: string;
    resumeCount: number;
    interviewCount: number;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, minlength: 6, select: false },
        avatar: { type: String, default: '' },
        githubId: { type: String, unique: true, sparse: true },
        githubUsername: { type: String },
        githubAccessToken: { type: String, select: false },
        skills: [{ type: String, trim: true }],
        bio: { type: String, default: '' },
        location: { type: String, default: '' },
        website: { type: String, default: '' },
        resumeCount: { type: Number, default: 0 },
        interviewCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    if (!this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
