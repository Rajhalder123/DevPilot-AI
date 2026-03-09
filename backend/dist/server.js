"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.httpServer = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const db_1 = require("./config/db");
const env_1 = require("./config/env");
const errorHandler_1 = require("./middleware/errorHandler");
const openai_1 = require("./services/openai");
const InterviewSession_1 = require("./models/InterviewSession");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("./models/User");
// Import routes
const auth_1 = __importDefault(require("./routes/auth"));
const resume_1 = __importDefault(require("./routes/resume"));
const github_1 = __importDefault(require("./routes/github"));
const jobs_1 = __importDefault(require("./routes/jobs"));
const interview_1 = __importDefault(require("./routes/interview"));
const coverLetter_1 = __importDefault(require("./routes/coverLetter"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
// Create Express app
const app = (0, express_1.default)();
exports.app = app;
const httpServer = (0, http_1.createServer)(app);
exports.httpServer = httpServer;
// Socket.IO setup
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: env_1.env.FRONTEND_URL,
        methods: ['GET', 'POST'],
        credentials: true,
    },
});
exports.io = io;
// Middleware
app.use((0, helmet_1.default)({ crossOriginResourcePolicy: false }));
app.use((0, cors_1.default)({ origin: env_1.env.FRONTEND_URL, credentials: true }));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// API Routes
app.use('/api/auth', auth_1.default);
app.use('/api/resume', resume_1.default);
app.use('/api/github', github_1.default);
app.use('/api/jobs', jobs_1.default);
app.use('/api/interview', interview_1.default);
app.use('/api/cover-letter', coverLetter_1.default);
app.use('/api/dashboard', dashboard_1.default);
// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// WebSocket Authentication & Interview Chat
io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        if (!token)
            return next(new Error('Authentication required'));
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        const user = await User_1.User.findById(decoded.id);
        if (!user)
            return next(new Error('User not found'));
        socket.user = user;
        next();
    }
    catch {
        next(new Error('Invalid token'));
    }
});
io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.user.name}`);
    socket.on('interview:message', async (data) => {
        try {
            const session = await InterviewSession_1.InterviewSession.findOne({
                _id: data.sessionId,
                userId: socket.user._id,
                status: 'active',
            });
            if (!session) {
                socket.emit('interview:error', { error: 'Session not found or ended' });
                return;
            }
            // Add user message
            session.messages.push({ role: 'user', content: data.message, timestamp: new Date() });
            session.questionsAnswered += 1;
            // Generate AI response
            const aiResponse = await (0, openai_1.generateInterviewQuestion)(session.topic, session.difficulty, session.type, session.messages.map((m) => ({ role: m.role, content: m.content })));
            session.messages.push({ role: 'assistant', content: aiResponse, timestamp: new Date() });
            session.questionsAsked += 1;
            // Check for interview end
            if (data.message.toLowerCase().includes('end interview') || session.questionsAsked >= 10) {
                session.status = 'completed';
                session.feedback = aiResponse;
                const scoreMatch = aiResponse.match(/(\d{1,3})\/100|score[:\s]*(\d{1,3})/i);
                if (scoreMatch) {
                    session.score = parseInt(scoreMatch[1] || scoreMatch[2]);
                }
            }
            await session.save();
            socket.emit('interview:response', {
                message: aiResponse,
                status: session.status,
                score: session.score,
            });
        }
        catch (error) {
            socket.emit('interview:error', { error: error.message });
        }
    });
    socket.on('disconnect', () => {
        console.log(`🔌 User disconnected: ${socket.user.name}`);
    });
});
// Error handler (must be last)
app.use(errorHandler_1.errorHandler);
// Start server
const startServer = async () => {
    await (0, db_1.connectDB)();
    httpServer.listen(env_1.env.PORT, () => {
        console.log(`🚀 DevPilot AI server running on port ${env_1.env.PORT}`);
        console.log(`📝 Environment: ${env_1.env.NODE_ENV}`);
    });
};
startServer();
//# sourceMappingURL=server.js.map