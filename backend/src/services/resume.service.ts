import fs from 'fs';
import { Resume } from '../models/Resume';
import { User } from '../models/User';
import { analyzeResume as aiAnalyzeResume } from './ai.service';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';
import { ResumeAnalysis } from '../types/ai.types';

const pdfParse = require('pdf-parse');

/**
 * Resume business logic extracted from routes.
 */

/** Extract text from an uploaded PDF file */
export const extractText = async (filePath: string): Promise<string> => {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    return pdfData.text;
};

/** Create a resume record from file upload */
export const createFromUpload = async (
    userId: string,
    fileName: string,
    fileUrl: string,
    rawText: string
) => {
    const resume = await Resume.create({
        userId,
        fileName,
        fileUrl,
        rawText,
        status: 'uploaded',
    });
    await User.findByIdAndUpdate(userId, { $inc: { resumeCount: 1 } });
    return resume;
};

/** Analyze a previously uploaded resume */
export const analyzeById = async (resumeId: string, userId: string) => {
    const resume = await Resume.findOne({ _id: resumeId, userId });
    if (!resume) throw AppError.notFound('Resume');

    resume.status = 'analyzing';
    await resume.save();

    try {
        const analysis = await aiAnalyzeResume(resume.rawText);
        resume.analysis = analysis;
        resume.status = 'completed';
        await resume.save();
        return resume;
    } catch (error: any) {
        logger.error('AI resume analysis failed', { resumeId, error: error.message });
        resume.status = 'failed';
        await resume.save();
        throw AppError.aiServiceError(error.message || 'AI analysis failed. Please try again.');
    }
};

/** Analyze raw text directly (no prior upload) */
export const analyzeText = async (text: string, userId: string) => {
    const analysis = await aiAnalyzeResume(text);

    const resume = await Resume.create({
        userId,
        fileName: 'pasted-resume.txt',
        fileUrl: '',
        rawText: text,
        analysis,
        status: 'completed',
    });

    await User.findByIdAndUpdate(userId, { $inc: { resumeCount: 1 } });
    return resume;
};

/** Get user's resume analysis history */
export const getHistory = async (userId: string) => {
    return Resume.find({ userId })
        .sort({ createdAt: -1 })
        .limit(20)
        .select('-rawText');
};
