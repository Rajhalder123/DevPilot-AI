import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { createServer } from 'http';
import { Server as SocketIO } from 'socket.io';
import { connectDB } from './config/db';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { authenticate, AuthRequest } from './middleware/auth';
import { generateInterviewQuestion } from './services/openai';
import { InterviewSession } from './models/InterviewSession';
import jwt from 'jsonwebtoken';
import { User } from './models/User';

// Import routes
import authRoutes from './routes/auth';
import resumeRoutes from './routes/resume';
import githubRoutes from './routes/github';
import jobRoutes from './routes/jobs';
import interviewRoutes from './routes/interview';
import coverLetterRoutes from './routes/coverLetter';
import dashboardRoutes from './routes/dashboard';

// Create Express app
const app = express();
const httpServer = createServer(app);

// Socket.IO setup
const io = new SocketIO(httpServer, {
    cors: {
        origin: env.FRONTEND_URL,
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

// Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/cover-letter', coverLetterRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// WebSocket Authentication & Interview Chat
io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        if (!token) return next(new Error('Authentication required'));

        const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
        const user = await User.findById(decoded.id);
        if (!user) return next(new Error('User not found'));

        (socket as any).user = user;
        next();
    } catch {
        next(new Error('Invalid token'));
    }
});

io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${(socket as any).user.name}`);

    socket.on('interview:message', async (data: { sessionId: string; message: string }) => {
        try {
            const session = await InterviewSession.findOne({
                _id: data.sessionId,
                userId: (socket as any).user._id,
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
            const aiResponse = await generateInterviewQuestion(
                session.topic,
                session.difficulty,
                session.type,
                session.messages.map((m) => ({ role: m.role, content: m.content }))
            );

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
        } catch (error: any) {
            socket.emit('interview:error', { error: error.message });
        }
    });

    socket.on('disconnect', () => {
        console.log(`🔌 User disconnected: ${(socket as any).user.name}`);
    });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const startServer = async () => {
    await connectDB();

    httpServer.listen(env.PORT, () => {
        console.log(`🚀 DevPilot AI server running on port ${env.PORT}`);
        console.log(`📝 Environment: ${env.NODE_ENV}`);
    });
};

startServer();

export { app, httpServer, io };
