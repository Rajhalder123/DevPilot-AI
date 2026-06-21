import { Request, Response } from 'express';
import { User } from '../models/User';
import { Resume } from '../models/Resume';
import { Conversation } from '../models/Conversation';
import { InterviewSession } from '../models/InterviewSession';
import { GitHubProject } from '../models/GitHubProject';
import { JobMatch } from '../models/JobMatch';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';

// GET /api/admin/stats
export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
        totalUsers, adminCount, newUsersWeek, newUsersMonth,
        totalResumes, totalInterviews, totalConversations,
        totalGithubProjects, totalJobMatches,
        activeUsers, suspendedUsers
    ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: 'admin' }),
        User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
        User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
        Resume.countDocuments(),
        InterviewSession.countDocuments(),
        Conversation.countDocuments(),
        GitHubProject.countDocuments(),
        JobMatch.countDocuments(),
        User.countDocuments({ isActive: true }),
        User.countDocuments({ isActive: false }),
    ]);

    res.json({
        totalUsers,
        adminCount,
        newUsersWeek,
        newUsersMonth,
        totalResumes,
        totalInterviews,
        totalConversations,
        totalGithubProjects,
        totalJobMatches,
        activeUsers,
        suspendedUsers,
    });
});

// GET /api/admin/users
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const search = (req.query.search as string) || '';
    const roleFilter = req.query.role as string;

    const query: any = {};
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
        ];
    }
    if (roleFilter && ['user', 'admin'].includes(roleFilter)) {
        query.role = roleFilter;
    }

    const [users, total] = await Promise.all([
        User.find(query)
            .select('-password -resetPasswordToken -resetPasswordExpire -githubAccessToken')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        User.countDocuments(query),
    ]);

    res.json({
        users,
        pagination: { total, page, pages: Math.ceil(total / limit), limit }
    });
});

// GET /api/admin/users/:id
export const getUserDetail = asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id)
        .select('-password -resetPasswordToken -resetPasswordExpire -githubAccessToken');
    if (!user) throw AppError.notFound('User not found');

    const [resumeCount, interviewCount, conversationCount, githubCount, jobCount] = await Promise.all([
        Resume.countDocuments({ userId: user._id }),
        InterviewSession.countDocuments({ userId: user._id }),
        Conversation.countDocuments({ userId: user._id }),
        GitHubProject.countDocuments({ userId: user._id }),
        JobMatch.countDocuments({ userId: user._id }),
    ]);

    res.json({
        user,
        stats: { resumeCount, interviewCount, conversationCount, githubCount, jobCount }
    });
});

// DELETE /api/admin/users/:id
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id);
    if (!user) throw AppError.notFound('User not found');
    if (user.role === 'admin' && user._id.toString() !== req.user?._id.toString()) {
        throw AppError.forbidden('Cannot delete other admins');
    }
    if (user._id.toString() === req.user?._id.toString()) {
        throw AppError.forbidden('Cannot delete your own account from admin panel');
    }

    // Delete all associated data
    await Promise.all([
        Resume.deleteMany({ userId: user._id }),
        InterviewSession.deleteMany({ userId: user._id }),
        Conversation.deleteMany({ userId: user._id }),
        GitHubProject.deleteMany({ userId: user._id }),
        JobMatch.deleteMany({ userId: user._id }),
    ]);

    await user.deleteOne();
    res.json({ success: true, message: 'User and all associated data deleted successfully' });
});

// PATCH /api/admin/users/:id/role
export const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
        throw AppError.badRequest('Invalid role. Must be "user" or "admin".');
    }

    const user = await User.findById(req.params.id);
    if (!user) throw AppError.notFound('User not found');
    
    if (user._id.toString() === req.user?._id.toString()) {
        throw AppError.forbidden('Cannot change your own role');
    }

    user.role = role;
    await user.save({ validateBeforeSave: false });

    res.json({ success: true, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});

// PATCH /api/admin/users/:id/suspend
export const suspendUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id);
    if (!user) throw AppError.notFound('User not found');

    if (user._id.toString() === req.user?._id.toString()) {
        throw AppError.forbidden('Cannot suspend your own account');
    }
    if (user.role === 'admin') {
        throw AppError.forbidden('Cannot suspend other admin accounts');
    }

    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });

    res.json({
        success: true,
        user: { id: user._id, name: user.name, isActive: user.isActive },
        message: user.isActive ? 'User account reactivated' : 'User account suspended',
    });
});

// GET /api/admin/content/resumes
export const getAllResumes = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [resumes, total] = await Promise.all([
        Resume.find()
            .populate('userId', 'name email avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('fileName status analysis.overallScore analysis.atsScore createdAt userId'),
        Resume.countDocuments(),
    ]);

    res.json({ resumes, pagination: { total, page, pages: Math.ceil(total / limit) } });
});

// GET /api/admin/content/resumes/:id — Full resume detail
export const getResumeDetail = asyncHandler(async (req: Request, res: Response) => {
    const resume = await Resume.findById(req.params.id)
        .populate('userId', 'name email avatar');
    if (!resume) throw AppError.notFound('Resume not found');
    res.json({ resume });
});

// DELETE /api/admin/content/resumes/:id
export const deleteResume = asyncHandler(async (req: Request, res: Response) => {
    const resume = await Resume.findById(req.params.id);
    if (!resume) throw AppError.notFound('Resume not found');
    await resume.deleteOne();
    res.json({ success: true, message: 'Resume deleted permanently' });
});

// GET /api/admin/content/conversations
export const getAllConversations = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [conversations, total] = await Promise.all([
        Conversation.find()
            .populate('userId', 'name email avatar')
            .sort({ lastMessageAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('title lastMessageAt createdAt userId messages'),
        Conversation.countDocuments(),
    ]);

    // Add message count without sending full messages
    const result = conversations.map(c => ({
        _id: c._id,
        title: c.title,
        lastMessageAt: c.lastMessageAt,
        createdAt: c.createdAt,
        userId: c.userId,
        messageCount: c.messages?.length || 0,
    }));

    res.json({ conversations: result, pagination: { total, page, pages: Math.ceil(total / limit) } });
});

// GET /api/admin/content/conversations/:id — Full conversation with all messages
export const getConversationDetail = asyncHandler(async (req: Request, res: Response) => {
    const conversation = await Conversation.findById(req.params.id)
        .populate('userId', 'name email avatar');
    if (!conversation) throw AppError.notFound('Conversation not found');
    res.json({ conversation });
});

// DELETE /api/admin/content/conversations/:id
export const deleteConversation = asyncHandler(async (req: Request, res: Response) => {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) throw AppError.notFound('Conversation not found');
    await conversation.deleteOne();
    res.json({ success: true, message: 'Conversation deleted permanently' });
});

// GET /api/admin/content/interviews
export const getAllInterviews = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [interviews, total] = await Promise.all([
        InterviewSession.find()
            .populate('userId', 'name email avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('topic difficulty type score status questionsAsked questionsAnswered createdAt userId'),
        InterviewSession.countDocuments(),
    ]);

    res.json({ interviews, pagination: { total, page, pages: Math.ceil(total / limit) } });
});

// GET /api/admin/content/interviews/:id — Full interview detail
export const getInterviewDetail = asyncHandler(async (req: Request, res: Response) => {
    const interview = await InterviewSession.findById(req.params.id)
        .populate('userId', 'name email avatar');
    if (!interview) throw AppError.notFound('Interview not found');
    res.json({ interview });
});

// DELETE /api/admin/content/interviews/:id
export const deleteInterview = asyncHandler(async (req: Request, res: Response) => {
    const interview = await InterviewSession.findById(req.params.id);
    if (!interview) throw AppError.notFound('Interview not found');
    await interview.deleteOne();
    res.json({ success: true, message: 'Interview deleted permanently' });
});

// GET /api/admin/analytics/growth
export const getGrowthAnalytics = asyncHandler(async (req: Request, res: Response) => {
    const days = parseInt(req.query.days as string) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const userGrowth = await User.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                count: { $sum: 1 },
            }
        },
        { $sort: { _id: 1 } },
    ]);

    // Fill in missing days with 0
    const result: { date: string; count: number }[] = [];
    for (let i = 0; i < days; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        const found = userGrowth.find(u => u._id === dateStr);
        result.push({ date: dateStr, count: found?.count || 0 });
    }

    res.json({ growth: result });
});
