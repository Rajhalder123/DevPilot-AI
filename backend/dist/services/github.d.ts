export declare const fetchRepoData: (owner: string, repo: string, accessToken?: string) => Promise<{
    name: any;
    description: any;
    language: any;
    languages: string[];
    stars: any;
    forks: any;
    topics: any;
    readme: string;
    openIssues: any;
    createdAt: any;
    updatedAt: any;
}>;
export declare const fetchUserRepos: (accessToken: string) => Promise<any>;
//# sourceMappingURL=github.d.ts.map