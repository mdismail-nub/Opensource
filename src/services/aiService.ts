import { Repository, RepositoryAnalysis, Issue, IssueAnalysis, RoadmapStep } from '../types';

export const aiService = {
  async analyzeRepository(
    repo: Repository,
    manifestContent?: string
  ): Promise<RepositoryAnalysis> {
    const res = await fetch('/api/ai/analyze-repo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        owner: repo.owner,
        repo: repo.repoName,
        description: repo.description,
        primaryLanguage: repo.primaryLanguage,
        languages: repo.languages,
        readmeSnippet: repo.readmePreview?.slice(0, 3500),
        fileTreeSample: repo.fileTree?.slice(0, 60),
        manifestSnippet: manifestContent?.slice(0, 1500),
      }),
    });

    if (!res.ok) {
      throw new Error(`AI analysis failed with status ${res.status}`);
    }

    const data: RepositoryAnalysis = await res.json();
    return data;
  },

  async analyzeIssue(issue: Issue, fileTreeSample?: string[]): Promise<IssueAnalysis> {
    const res = await fetch('/api/ai/analyze-issue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        issueNumber: issue.issueNumber,
        issueTitle: issue.title,
        issueBody: issue.fullDescription?.slice(0, 2500),
        repoName: issue.repository,
        labels: issue.labels,
        fileTreeSample: fileTreeSample?.slice(0, 40),
      }),
    });

    if (!res.ok) {
      throw new Error(`AI issue analysis failed with status ${res.status}`);
    }

    const data: IssueAnalysis = await res.json();
    return data;
  },
};
