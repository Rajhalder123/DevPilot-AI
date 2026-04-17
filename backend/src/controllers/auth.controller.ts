import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { User } from '../models/User';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';

const generateToken = (userId: string): string => {
    return jwt.sign({ id: userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as any);
};

// POST /api/auth/signup
export const signup = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) throw AppError.conflict('Email already registered');

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id.toString());

    res.status(201).json({
        token,
        user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
    });
});

// POST /api/auth/login
export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
        throw AppError.unauthorized('Invalid email or password');
    }

    const token = generateToken(user._id.toString());

    res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, skills: user.skills },
    });
});

// GET /api/auth/github — Redirect to GitHub OAuth
export const githubRedirect = (_req: Request, res: Response) => {
    const params = new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        redirect_uri: env.GITHUB_CALLBACK_URL,
        scope: 'user:email read:user repo',
    });
    res.redirect(`https://github.com/login/oauth/authorize?${params}`);
};

// GET /api/auth/github/callback
export const githubCallback = asyncHandler(async (req: Request, res: Response) => {
    const { code } = req.query;
    if (!code) throw AppError.badRequest('Authorization code required');

    // Exchange code for access token
    const tokenRes = await axios.post(
        'https://github.com/login/oauth/access_token',
        { client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code },
        { headers: { Accept: 'application/json' } }
    );

    const accessToken = tokenRes.data.access_token;

    // Fetch GitHub user
    const ghUser = await axios.get('https://api.github.com/user', {
        headers: { Authorization: `token ${accessToken}` },
    });

    // Fetch email
    const ghEmails = await axios.get('https://api.github.com/user/emails', {
        headers: { Authorization: `token ${accessToken}` },
    });
    const primaryEmail = ghEmails.data.find((e: any) => e.primary)?.email || ghUser.data.email;

    // Find or create user
    let user = await User.findOne({ githubId: ghUser.data.id.toString() });

    if (!user) {
        user = await User.findOne({ email: primaryEmail });
        if (user) {
            user.githubId = ghUser.data.id.toString();
            user.githubUsername = ghUser.data.login;
            user.githubAccessToken = accessToken;
            user.avatar = ghUser.data.avatar_url;
            await user.save();
        } else {
            user = await User.create({
                name: ghUser.data.name || ghUser.data.login,
                email: primaryEmail,
                githubId: ghUser.data.id.toString(),
                githubUsername: ghUser.data.login,
                githubAccessToken: accessToken,
                avatar: ghUser.data.avatar_url,
            });
        }
    } else {
        user.githubAccessToken = accessToken;
        await user.save();
    }

    const token = generateToken(user._id.toString());
    res.redirect(`${env.FRONTEND_URL}/auth/callback?token=${token}`);
});

// GET /api/auth/me
export const getMe = asyncHandler(async (req: Request, res: Response) => {
    res.json({ user: req.user });
});

// PUT /api/auth/profile
export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const { name, bio, location, website, skills } = req.body;
    const user = await User.findByIdAndUpdate(
        req.user!._id,
        { name, bio, location, website, skills },
        { new: true, runValidators: true }
    );
    res.json({ user });
});
