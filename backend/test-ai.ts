
import dotenv from 'dotenv';
dotenv.config();
import { analyzeResume } from './src/services/ai.service';
async function test() {
  try {
    console.log('Testing Groq AI Resume Analysis...');
    const result = await analyzeResume('I am a Full Stack Developer. I know React, Node.js, and MongoDB. I built an e-commerce app with 10k users. I studied at IIT.');
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
  process.exit(0);
}
test();

