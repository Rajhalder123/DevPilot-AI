import { Router, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { env } from '../config/env';
import { authenticate, AuthRequest } from '../middleware/auth';
import axios from 'axios';

const router = Router();

// Generate JWT
const generateToken = (userId: string): string => {
    return jwt.sign({ id: userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as any);
};

// POST /api/auth/signup
router.post('/signup', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({ error: 'Name, email, and password are required' });
            return;
        }

        const existing = await User.findOne({ email });
        if (existing) {
            res.status(409).json({ error: 'Email already registered' });
            return;
        }

        const user = await User.create({ name, email, password });
        const token = generateToken(user._id.toString());

        res.status(201).json({
            token,
            user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/auth/login
router.post('/login', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        const token = generateToken(user._id.toString());

        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, skills: user.skills },
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/auth/github — Redirect to GitHub OAuth
router.get('/github', (_req: AuthRequest, res: Response): void => {
    const params = new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        redirect_uri: env.GITHUB_CALLBACK_URL,
        scope: 'user:email read:user repo',
    });
    res.redirect(`https://github.com/login/oauth/authorize?${params}`);
});

// GET /api/auth/github/callback
router.get('/github/callback', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { code } = req.query;
        if (!code) {
            res.status(400).json({ error: 'Authorization code required' });
            return;
        }

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
    } catch (error: any) {
        res.redirect(`${env.FRONTEND_URL}/login?error=github_auth_failed`);
    }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    res.json({ user: req.user });
});

// PUT /api/auth/profile
router.put('/profile', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, bio, location, website, skills } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user!._id,
            { name, bio, location, website, skills },
            { new: true, runValidators: true }
        );
        res.json({ user });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
