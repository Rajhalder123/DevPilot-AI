import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'DevPilot AI — Job Readiness Intelligence Engine',
            version: '2.0.0',
            description: `
**DevPilot AI** is an AI-powered career co-pilot for Indian developers.

This API powers:
- 📄 Resume ATS Analysis
- 🔬 GitHub Project Review
- 🎯 Job Ready Score (Scoring Engine)
- 🎙️ AI Interview Simulator
- 💬 Career Mentor Chat
- 🗺️ Career Roadmap Generator
- 🌐 Portfolio Builder
- ✉️ Cover Letter Generator
- 🔎 Job Search Aggregator

**Authentication:** All endpoints (except health) require a Bearer JWT token.
            `,
            contact: {
                name: 'Raj Halder',
                email: 'raj@devpilot.ai',
                url: 'https://github.com/Rajhalder123/DevPilot-AI',
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT',
            },
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token (from /api/auth/login or /api/auth/signup)',
                },
            },
            schemas: {
                // ── Error Responses ─────────────────────────────
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        error: {
                            type: 'object',
                            properties: {
                                code: { type: 'string', example: 'VALIDATION_ERROR' },
                                message: { type: 'string', example: 'Validation failed' },
                                details: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            field: { type: 'string' },
                                            message: { type: 'string' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },

                // ── Auth ─────────────────────────────────────────
                SignupRequest: {
                    type: 'object',
                    required: ['name', 'email', 'password'],
                    properties: {
                        name: { type: 'string', example: 'Raj Halder', minLength: 2 },
                        email: { type: 'string', format: 'email', example: 'raj@example.com' },
                        password: { type: 'string', minLength: 6, example: 'mypassword123' },
                    },
                },
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email', example: 'raj@example.com' },
                        password: { type: 'string', example: 'mypassword123' },
                    },
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        token: { type: 'string' },
                        user: {
                            type: 'object',
                            properties: {
                                id: { type: 'string' },
                                name: { type: 'string' },
                                email: { type: 'string' },
                                avatar: { type: 'string' },
                                skills: { type: 'array', items: { type: 'string' } },
                            },
                        },
                    },
                },
                UpdateProfileRequest: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        bio: { type: 'string' },
                        location: { type: 'string' },
                        website: { type: 'string' },
                        skills: { type: 'array', items: { type: 'string' } },
                    },
                },

                // ── Resume ───────────────────────────────────────
                ResumeAnalysis: {
                    type: 'object',
                    properties: {
                        overallScore: { type: 'number', example: 72 },
                        atsScore: { type: 'number', example: 68 },
                        summary: { type: 'string' },
                        strengths: { type: 'array', items: { type: 'string' } },
                        improvements: { type: 'array', items: { type: 'string' } },
                        keywordGaps: { type: 'array', items: { type: 'string' } },
                        formattingTips: { type: 'array', items: { type: 'string' } },
                        sectionFeedback: {
                            type: 'object',
                            properties: {
                                education: { type: 'object', properties: { score: { type: 'number' }, feedback: { type: 'string' } } },
                                experience: { type: 'object', properties: { score: { type: 'number' }, feedback: { type: 'string' } } },
                                projects: { type: 'object', properties: { score: { type: 'number' }, feedback: { type: 'string' } } },
                                skills: { type: 'object', properties: { score: { type: 'number' }, feedback: { type: 'string' } } },
                            },
                        },
                        bulletRewrites: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    original: { type: 'string' },
                                    improved: { type: 'string' },
                                    reason: { type: 'string' },
                                },
                            },
                        },
                    },
                },

                // ── GitHub ───────────────────────────────────────
                GitHubAnalysis: {
                    type: 'object',
                    properties: {
                        overallScore: { type: 'number', example: 65 },
                        readmeScore: { type: 'number', example: 45 },
                        activityScore: { type: 'number', example: 70 },
                        codeStructureScore: { type: 'number', example: 60 },
                        summary: { type: 'string' },
                        codeQuality: { type: 'string' },
                        architecture: { type: 'string' },
                        strengths: { type: 'array', items: { type: 'string' } },
                        improvements: { type: 'array', items: { type: 'string' } },
                        techStack: { type: 'array', items: { type: 'string' } },
                        suggestions: { type: 'array', items: { type: 'string' } },
                    },
                },

                // ── Scoring Engine ───────────────────────────────
                FullAnalysisRequest: {
                    type: 'object',
                    required: ['resumeText', 'repoUrl', 'skills'],
                    properties: {
                        resumeText: { type: 'string', description: 'Full resume text content', minLength: 50 },
                        repoUrl: { type: 'string', format: 'uri', example: 'https://github.com/user/repo', description: 'GitHub repository URL' },
                        skills: { type: 'array', items: { type: 'string' }, example: ['React', 'Node.js', 'TypeScript'], description: '1-30 skills' },
                    },
                },
                FullAnalysisResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        data: {
                            type: 'object',
                            properties: {
                                resumeAnalysis: { $ref: '#/components/schemas/ResumeAnalysis' },
                                githubAnalysis: { $ref: '#/components/schemas/GitHubAnalysis' },
                                scoring: {
                                    type: 'object',
                                    properties: {
                                        finalScore: { type: 'number', example: 63 },
                                        category: { type: 'string', enum: ['Beginner', 'Intermediate', 'Job Ready'], example: 'Intermediate' },
                                        breakdown: {
                                            type: 'object',
                                            properties: {
                                                resume: { type: 'object', properties: { score: { type: 'number' }, weight: { type: 'number' }, weightedScore: { type: 'number' } } },
                                                github: { type: 'object', properties: { score: { type: 'number' }, weight: { type: 'number' }, weightedScore: { type: 'number' } } },
                                                skills: { type: 'object', properties: { score: { type: 'number' }, weight: { type: 'number' }, weightedScore: { type: 'number' } } },
                                            },
                                        },
                                        improvements: { type: 'array', items: { type: 'string' }, description: 'Top 5 AI-powered improvement actions' },
                                        shareText: { type: 'string' },
                                    },
                                },
                                generatedAt: { type: 'string', format: 'date-time' },
                            },
                        },
                    },
                },

                // ── Interview ────────────────────────────────────
                StartInterviewRequest: {
                    type: 'object',
                    required: ['topic'],
                    properties: {
                        topic: { type: 'string', example: 'React.js' },
                        difficulty: { type: 'string', enum: ['easy', 'medium', 'hard', 'junior', 'mid', 'senior', 'lead'], default: 'mid' },
                        type: { type: 'string', enum: ['technical', 'behavioral', 'system-design', 'coding'], default: 'technical' },
                    },
                },

                // ── Cover Letter ─────────────────────────────────
                CoverLetterRequest: {
                    type: 'object',
                    required: ['resumeText', 'jobDescription'],
                    properties: {
                        resumeText: { type: 'string' },
                        jobDescription: { type: 'string' },
                        companyName: { type: 'string', default: 'the company' },
                        tone: { type: 'string', enum: ['professional', 'enthusiastic', 'concise'], default: 'professional' },
                    },
                },

                // ── Roadmap ──────────────────────────────────────
                RoadmapRequest: {
                    type: 'object',
                    required: ['skills', 'targetRole'],
                    properties: {
                        skills: { type: 'array', items: { type: 'string' }, example: ['HTML', 'CSS', 'JavaScript'] },
                        targetRole: { type: 'string', example: 'Full Stack Developer' },
                    },
                },

                // ── Portfolio ────────────────────────────────────
                PortfolioRequest: {
                    type: 'object',
                    required: ['name', 'bio'],
                    properties: {
                        name: { type: 'string', example: 'Raj Halder' },
                        bio: { type: 'string', example: 'Full Stack Developer passionate about AI' },
                        skills: { type: 'array', items: { type: 'string' } },
                        projects: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    title: { type: 'string' },
                                    description: { type: 'string' },
                                    link: { type: 'string' },
                                    tech: { type: 'string' },
                                },
                            },
                        },
                        github: { type: 'string' },
                        linkedin: { type: 'string' },
                        email: { type: 'string' },
                    },
                },
            },
        },
        security: [{ bearerAuth: [] }],
        tags: [
            { name: 'Health', description: 'Server health check' },
            { name: 'Auth', description: 'Authentication & user profile' },
            { name: 'Resume', description: 'Resume upload & ATS analysis' },
            { name: 'GitHub', description: 'GitHub repository analysis' },
            { name: 'Score', description: '🎯 Job Readiness Scoring Engine (NEW)' },
            { name: 'Interview', description: 'AI mock interview simulator' },
            { name: 'Jobs', description: 'Real-time job search aggregator' },
            { name: 'Cover Letter', description: 'AI cover letter generator' },
            { name: 'Career Mentor', description: 'AI career mentor chat' },
            { name: 'Job Ready Score', description: 'Legacy job ready score (5-component)' },
            { name: 'Roadmap', description: 'Career roadmap generator' },
            { name: 'Portfolio', description: 'Portfolio website generator' },
            { name: 'Dashboard', description: 'User dashboard statistics' },
        ],
        paths: {
            // ── Health ───────────────────────────────────────────
            '/api/health': {
                get: {
                    tags: ['Health'],
                    summary: 'Server health check',
                    security: [],
                    responses: {
                        200: { description: 'Server is running', content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' }, timestamp: { type: 'string' } } } } } },
                    },
                },
            },

            // ── Auth ─────────────────────────────────────────────
            '/api/auth/signup': {
                post: {
                    tags: ['Auth'],
                    summary: 'Register a new user',
                    security: [],
                    requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/SignupRequest' } } } },
                    responses: {
                        201: { description: 'User created', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
                        409: { description: 'Email already registered' },
                    },
                },
            },
            '/api/auth/login': {
                post: {
                    tags: ['Auth'],
                    summary: 'Login with email and password',
                    security: [],
                    requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } } },
                    responses: {
                        200: { description: 'Login successful', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
                        401: { description: 'Invalid credentials' },
                    },
                },
            },
            '/api/auth/me': {
                get: {
                    tags: ['Auth'],
                    summary: 'Get current user profile',
                    responses: { 200: { description: 'User profile' } },
                },
            },
            '/api/auth/profile': {
                put: {
                    tags: ['Auth'],
                    summary: 'Update user profile',
                    requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateProfileRequest' } } } },
                    responses: { 200: { description: 'Profile updated' } },
                },
            },
            '/api/auth/github': {
                get: {
                    tags: ['Auth'],
                    summary: 'Redirect to GitHub OAuth',
                    security: [],
                    responses: { 302: { description: 'Redirect to GitHub login' } },
                },
            },

            // ── Resume ───────────────────────────────────────────
            '/api/resume/upload': {
                post: {
                    tags: ['Resume'],
                    summary: 'Upload a PDF resume',
                    requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', properties: { resume: { type: 'string', format: 'binary' } } } } } },
                    responses: { 201: { description: 'Resume uploaded and text extracted' } },
                },
            },
            '/api/resume/analyze': {
                post: {
                    tags: ['Resume'],
                    summary: 'Analyze a previously uploaded resume',
                    requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['resumeId'], properties: { resumeId: { type: 'string' } } } } } },
                    responses: { 200: { description: 'AI analysis result with ATS score, section feedback, and bullet rewrites' } },
                },
            },
            '/api/resume/analyze-text': {
                post: {
                    tags: ['Resume'],
                    summary: 'Analyze resume from pasted text',
                    requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['text'], properties: { text: { type: 'string', minLength: 50 } } } } } },
                    responses: { 200: { description: 'AI analysis result' } },
                },
            },
            '/api/resume/history': {
                get: {
                    tags: ['Resume'],
                    summary: 'Get resume analysis history',
                    responses: { 200: { description: 'List of past analyses' } },
                },
            },

            // ── GitHub ───────────────────────────────────────────
            '/api/github/analyze': {
                post: {
                    tags: ['GitHub'],
                    summary: 'Analyze a GitHub repository',
                    requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['repoUrl'], properties: { repoUrl: { type: 'string', example: 'https://github.com/user/repo' } } } } } },
                    responses: { 200: { description: 'Repo analysis with sub-scores (readme, activity, code structure)' } },
                },
            },
            '/api/github/history': {
                get: {
                    tags: ['GitHub'],
                    summary: 'Get GitHub analysis history',
                    responses: { 200: { description: 'List of past GitHub analyses' } },
                },
            },

            // ── Score (NEW) ──────────────────────────────────────
            '/api/score/full-analysis': {
                post: {
                    tags: ['Score'],
                    summary: '🎯 Unified Job Readiness Analysis',
                    description: 'The core endpoint of the Job Readiness Intelligence Engine. Analyzes resume + GitHub + skills in one request. Returns combined score, category, and AI-powered improvement actions.',
                    requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/FullAnalysisRequest' } } } },
                    responses: {
                        200: { description: 'Full analysis result', content: { 'application/json': { schema: { $ref: '#/components/schemas/FullAnalysisResponse' } } } },
                        400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                        429: { description: 'Rate limit exceeded' },
                    },
                },
            },

            // ── Interview ────────────────────────────────────────
            '/api/interview/start': {
                post: {
                    tags: ['Interview'],
                    summary: 'Start an AI interview session',
                    requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/StartInterviewRequest' } } } },
                    responses: { 201: { description: 'Interview session started' } },
                },
            },
            '/api/interview/{sessionId}/respond': {
                post: {
                    tags: ['Interview'],
                    summary: 'Respond to interview question',
                    parameters: [{ name: 'sessionId', in: 'path', required: true, schema: { type: 'string' } }],
                    requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['message'], properties: { message: { type: 'string' } } } } } },
                    responses: { 200: { description: 'AI response + session state' } },
                },
            },
            '/api/interview/history': {
                get: {
                    tags: ['Interview'],
                    summary: 'Get interview history',
                    responses: { 200: { description: 'List of past interview sessions' } },
                },
            },
            '/api/interview/message': {
                post: {
                    tags: ['Interview'],
                    summary: 'Quick AI message (Voice Assistant mode)',
                    requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['message'], properties: { message: { type: 'string' }, topic: { type: 'string', default: 'General AI & Interview Practice' } } } } } },
                    responses: { 200: { description: 'AI response' } },
                },
            },

            // ── Jobs ─────────────────────────────────────────────
            '/api/jobs/search': {
                get: {
                    tags: ['Jobs'],
                    summary: 'Search real-time jobs from 6 aggregators',
                    parameters: [
                        { name: 'query', in: 'query', schema: { type: 'string' }, description: 'Search keyword', example: 'react developer' },
                        { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
                    ],
                    responses: { 200: { description: 'Aggregated job listings from Remotive, Arbeitnow, The Muse, Jobicy, RemoteOK, Himalayas' } },
                },
            },

            // ── Cover Letter ─────────────────────────────────────
            '/api/cover-letter/generate': {
                post: {
                    tags: ['Cover Letter'],
                    summary: 'Generate AI cover letter',
                    requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CoverLetterRequest' } } } },
                    responses: { 200: { description: 'Generated cover letter text' } },
                },
            },

            // ── Career Mentor ────────────────────────────────────
            '/api/career-mentor/chat': {
                post: {
                    tags: ['Career Mentor'],
                    summary: 'Chat with AI career mentor',
                    requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['message'], properties: { message: { type: 'string' }, history: { type: 'array', items: { type: 'object', properties: { role: { type: 'string' }, content: { type: 'string' } } } } } } } } },
                    responses: { 200: { description: 'AI mentor response' } },
                },
            },

            // ── Job Ready Score (Legacy) ─────────────────────────
            '/api/job-ready-score': {
                get: {
                    tags: ['Job Ready Score'],
                    summary: 'Get legacy job ready score (5-component)',
                    description: 'Legacy endpoint using 5-component formula (Resume 30%, GitHub 25%, Interview 25%, Skills 10%, Projects 10%). For the new 3-component scoring engine, use POST /api/score/full-analysis.',
                    responses: { 200: { description: 'Score breakdown with improvement suggestions' } },
                },
            },

            // ── Roadmap ──────────────────────────────────────────
            '/api/roadmap/generate': {
                post: {
                    tags: ['Roadmap'],
                    summary: 'Generate career roadmap',
                    requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/RoadmapRequest' } } } },
                    responses: { 200: { description: 'Phased learning roadmap with resources' } },
                },
            },

            // ── Portfolio ────────────────────────────────────────
            '/api/portfolio/generate': {
                post: {
                    tags: ['Portfolio'],
                    summary: 'Generate portfolio website HTML',
                    requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/PortfolioRequest' } } } },
                    responses: { 200: { description: 'Self-contained HTML portfolio page' } },
                },
            },

            // ── Dashboard ────────────────────────────────────────
            '/api/dashboard/stats': {
                get: {
                    tags: ['Dashboard'],
                    summary: 'Get user dashboard statistics',
                    responses: { 200: { description: 'Aggregated stats and recent activity' } },
                },
            },
        },
    },
    apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
