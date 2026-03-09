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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewSession = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const messageSchema = new mongoose_1.Schema({
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
}, { _id: false });
const interviewSessionSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    topic: { type: String, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard', 'junior', 'mid', 'senior', 'lead'], default: 'mid' },
    type: { type: String, enum: ['technical', 'behavioral', 'system-design', 'coding'], default: 'technical' },
    messages: [messageSchema],
    score: { type: Number, default: null, min: 0, max: 100 },
    feedback: { type: String, default: '' },
    questionsAsked: { type: Number, default: 0 },
    questionsAnswered: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'completed', 'abandoned'], default: 'active' },
}, { timestamps: true });
exports.InterviewSession = mongoose_1.default.model('InterviewSession', interviewSessionSchema);
//# sourceMappingURL=InterviewSession.js.map