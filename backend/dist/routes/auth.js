"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const env_1 = require("../config/env");
const auth_1 = require("../middleware/auth");
const axios_1 = __importDefault(require("axios"));
const router = (0, express_1.Router)();
// Generate JWT
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ id: userId }, env_1.env.JWT_SECRET, { expiresIn: env_1.env.JWT_EXPIRES_IN });
};
// POST /api/auth/signup
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ error: 'Name, email, and password are required' });
            return;
        }
        const existing = await User_1.User.findOne({ email });
        if (existing) {
            res.status(409).json({ error: 'Email already registered' });
            return;
        }
        const user = await User_1.User.create({ name, email, password });
        const token = generateToken(user._id.toString());
        res.status(201).json({
            token,
            user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }
        const user = await User_1.User.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        const token = generateToken(user._id.toString());
        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, skills: user.skills },
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET /api/auth/github — Redirect to GitHub OAuth
router.get('/github', (_req, res) => {
    const params = new URLSearchParams({
        client_id: env_1.env.GITHUB_CLIENT_ID,
        redirect_uri: env_1.env.GITHUB_CALLBACK_URL,
        scope: 'user:email read:user repo',
    });
    res.redirect(`https://github.com/login/oauth/authorize?${params}`);
});
// GET /api/auth/github/callback
router.get('/github/callback', async (req, res) => {
    try {
        const { code } = req.query;
        if (!code) {
            res.status(400).json({ error: 'Authorization code required' });
            return;
        }
        // Exchange code for access token
        const tokenRes = await axios_1.default.post('https://github.com/login/oauth/access_token', { client_id: env_1.env.GITHUB_CLIENT_ID, client_secret: env_1.env.GITHUB_CLIENT_SECRET, code }, { headers: { Accept: 'application/json' } });
        const accessToken = tokenRes.data.access_token;
        // Fetch GitHub user
        const ghUser = await axios_1.default.get('https://api.github.com/user', {
            headers: { Authorization: `token ${accessToken}` },
        });
        // Fetch email
        const ghEmails = await axios_1.default.get('https://api.github.com/user/emails', {
            headers: { Authorization: `token ${accessToken}` },
        });
        const primaryEmail = ghEmails.data.find((e) => e.primary)?.email || ghUser.data.email;
        // Find or create user
        let user = await User_1.User.findOne({ githubId: ghUser.data.id.toString() });
        if (!user) {
            user = await User_1.User.findOne({ email: primaryEmail });
            if (user) {
                user.githubId = ghUser.data.id.toString();
                user.githubUsername = ghUser.data.login;
                user.githubAccessToken = accessToken;
                user.avatar = ghUser.data.avatar_url;
                await user.save();
            }
            else {
                user = await User_1.User.create({
                    name: ghUser.data.name || ghUser.data.login,
                    email: primaryEmail,
                    githubId: ghUser.data.id.toString(),
                    githubUsername: ghUser.data.login,
                    githubAccessToken: accessToken,
                    avatar: ghUser.data.avatar_url,
                });
            }
        }
        else {
            user.githubAccessToken = accessToken;
            await user.save();
        }
        const token = generateToken(user._id.toString());
        res.redirect(`${env_1.env.FRONTEND_URL}/auth/callback?token=${token}`);
    }
    catch (error) {
        res.redirect(`${env_1.env.FRONTEND_URL}/login?error=github_auth_failed`);
    }
});
// GET /api/auth/me
router.get('/me', auth_1.authenticate, async (req, res) => {
    res.json({ user: req.user });
});
// PUT /api/auth/profile
router.put('/profile', auth_1.authenticate, async (req, res) => {
    try {
        const { name, bio, location, website, skills } = req.body;
        const user = await User_1.User.findByIdAndUpdate(req.user._id, { name, bio, location, website, skills }, { new: true, runValidators: true });
        res.json({ user });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map