import mongoose from 'mongoose';
import { env } from './env';

export const connectDB = async (): Promise<void> => {
    try {
        // Try connecting to the configured MongoDB URI with a short timeout
        const conn = await mongoose.connect(env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        if (env.NODE_ENV === 'development') {
            console.warn('⚠️  Could not connect to MongoDB. Starting in-memory database...');
            try {
                const { MongoMemoryServer } = await import('mongodb-memory-server');
                const mongod = await MongoMemoryServer.create();
                const uri = mongod.getUri();
                const conn = await mongoose.connect(uri);
                console.log(`✅ In-memory MongoDB started: ${conn.connection.host}`);
                console.log('⚠️  Data will NOT persist after restart. Use a real MongoDB for production.');
            } catch (memError) {
                console.error('❌ Failed to start in-memory MongoDB:', memError);
                process.exit(1);
            }
        } else {
            console.error('❌ MongoDB connection error:', error);
            process.exit(1);
        }
    }
};
