import { AppError } from './AppError';
import { logger } from './logger';

/**
 * Safely parse JSON from AI model responses.
 * Strips markdown code fences that LLMs sometimes add despite instructions.
 * Provides a fallback value if parsing fails.
 */
export const parseJSON = <T = any>(raw: string, fallback?: T): T => {
    try {
        // Strip markdown code fences (```json ... ``` or ``` ... ```)
        const cleaned = raw
            .replace(/^```(?:json)?\s*/i, '')
            .replace(/\s*```$/i, '')
            .trim();

        return JSON.parse(cleaned);
    } catch (firstError) {
        // Second attempt: try to extract JSON from within the response
        try {
            const jsonMatch = raw.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch {
            // Fall through to error handling
        }

        if (fallback !== undefined) {
            logger.warn('Failed to parse AI JSON response, using fallback', {
                rawLength: raw.length,
                rawPreview: raw.substring(0, 200),
            });
            return fallback;
        }

        logger.error('Failed to parse AI JSON response', {
            rawLength: raw.length,
            rawPreview: raw.substring(0, 500),
        });
        throw AppError.aiServiceError('Failed to parse AI response. Please try again.');
    }
};
