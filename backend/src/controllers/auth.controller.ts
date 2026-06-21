import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { User } from '../models/User';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import { verifyTurnstile } from '../utils/turnstile';

const generateToken = (userId: string): string => {
    return jwt.sign({ id: userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as any);
};

// POST /api/auth/signup
export const signup = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, turnstileToken } = req.body;

    // Verify Cloudflare Turnstile
    const isHuman = await verifyTurnstile(turnstileToken, req.ip);
    if (!isHuman) {
        throw AppError.unauthorized('Security challenge failed. Please try again.');
    }

    const existing = await User.findOne({ email });
    if (existing) throw AppError.conflict('Email already registered');

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id.toString());

    res.status(201).json({
        token,
        user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, role: user.role },
    });
});

// POST /api/auth/login
export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, turnstileToken } = req.body;

    // Verify Cloudflare Turnstile
    const isHuman = await verifyTurnstile(turnstileToken, req.ip);
    if (!isHuman) {
        throw AppError.unauthorized('Security challenge failed. Please try again.');
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
        throw AppError.unauthorized('Invalid email or password');
    }

    if (!user.isActive) {
        throw AppError.forbidden('Your account has been suspended. Please contact support.');
    }

    const token = generateToken(user._id.toString());

    res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, skills: user.skills, role: user.role },
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

// POST /api/auth/forgot-password
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Security: always return the same response regardless of whether the email exists
    // to prevent email enumeration attacks
    if (!user) {
        res.status(200).json({ success: true, message: 'If an account exists with that email, a password reset link has been sent.' });
        return;
    }

    // Generate token
    const crypto = await import('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT/POST request to: \n\n ${resetUrl}`;

    try {
        const { sendEmail } = await import('../utils/email.service');
        await sendEmail({
            email: user.email,
            subject: 'DevPilot AI - Password Reset Token',
            message,
        });

        res.status(200).json({ success: true, message: 'Email sent' });
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        throw AppError.internal('Email could not be sent');
    }
});

// POST /api/auth/reset-password/:token
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const crypto = await import('crypto');
    // Get hashed token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: new Date() }
    });

    if (!user) {
        throw AppError.badRequest('Invalid or expired password reset token');
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    const token = generateToken(user._id.toString());

    res.status(200).json({
        success: true,
        token
    });
});
