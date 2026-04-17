/**
 * Legacy re-export shim.
 * GitHub service has been refactored into github.service.ts.
 * This file ensures existing imports continue to work.
 */
export { fetchRepoData, fetchUserRepos } from './github.service';
