import { careerMentorChat } from './src/services/ai.service';
import mongoose from 'mongoose';
import { env } from './src/config/env';

async function test() {
    try {
        console.log("Starting test...");
        const res = await careerMentorChat('Hello', []);
        console.log("Response:", res);
    } catch (e) {
        console.error("Error:", e);
    }
    process.exit(0);
}

test();
