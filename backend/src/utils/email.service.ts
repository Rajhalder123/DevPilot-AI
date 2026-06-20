import { env } from '../config/env';
import nodemailer from 'nodemailer';

interface EmailOptions {
    email: string;
    subject: string;
    message: string;
}

/**
 * Email service.
 * Uses nodemailer with Gmail SMTP if SMTP_EMAIL and SMTP_PASSWORD are provided in .env.
 * Otherwise, falls back to a mock email service by logging to the console.
 */
export const sendEmail = async (options: EmailOptions): Promise<void> => {
    // Check if SMTP credentials are provided
    if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
        // Create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        // Send email with defined transport object
        await transporter.sendMail({
            from: `"DevPilot AI" <${process.env.SMTP_EMAIL}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            // You can optionally add html: '<p>...</p>' here in the future
        });
        
        console.log(`✅ Real email sent to: ${options.email}`);
    } else {
        // Fallback to Mock Logger
        console.log('\n========================================================');
        console.log('📧 MOCK EMAIL INTERCEPTED (Set SMTP_EMAIL and SMTP_PASSWORD in .env to send real emails)');
        console.log('========================================================');
        console.log(`To:      ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log('--------------------------------------------------------');
        console.log(options.message);
        console.log('========================================================\n');

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
    }
};
