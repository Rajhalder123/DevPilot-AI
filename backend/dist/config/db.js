"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const connectDB = async () => {
    try {
        // Try connecting to the configured MongoDB URI with a short timeout
        const conn = await mongoose_1.default.connect(env_1.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    }
    catch (error) {
        if (env_1.env.NODE_ENV === 'development') {
            console.warn('⚠️  Could not connect to MongoDB. Starting in-memory database...');
            try {
                const { MongoMemoryServer } = await Promise.resolve().then(() => __importStar(require('mongodb-memory-server')));
                const mongod = await MongoMemoryServer.create();
                const uri = mongod.getUri();
                const conn = await mongoose_1.default.connect(uri);
                console.log(`✅ In-memory MongoDB started: ${conn.connection.host}`);
                console.log('⚠️  Data will NOT persist after restart. Use a real MongoDB for production.');
            }
            catch (memError) {
                console.error('❌ Failed to start in-memory MongoDB:', memError);
                process.exit(1);
            }
        }
        else {
            console.error('❌ MongoDB connection error:', error);
            process.exit(1);
        }
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=db.js.map