import { z } from 'zod';

export const analyzeGitHubSchema = z.object({
    repoUrl: z
        .string()
        .url('Must be a valid URL')
        .regex(/github\.com\/[^/]+\/[^/]+/, 'Must be a valid GitHub repository URL (e.g. https://github.com/owner/repo)'),
});
