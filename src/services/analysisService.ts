import { Repository, RepositoryAnalysis, Issue, IssueAnalysis } from '../types';
import { aiService } from './aiService';
import { githubService } from './githubService';

// In-memory cache for analysis results during session
const repoAnalysisCache = new Map<string, RepositoryAnalysis>();
const issueAnalysisCache = new Map<string, IssueAnalysis>();

export const analysisService = {
  async analyzeRepository(
    repo: Repository,
    fileTreeSample?: string[]
  ): Promise<RepositoryAnalysis> {
    const key = repo.name.toLowerCase();
    if (repoAnalysisCache.has(key)) {
      return repoAnalysisCache.get(key)!;
    }

    // Attempt to load package.json or requirements.txt or Cargo.toml if present in tree
    let manifestSnippet = '';
    const files = fileTreeSample || repo.fileTree || [];
    const candidateManifest = files.find(
      (p) =>
        p.endsWith('package.json') ||
        p.endsWith('Cargo.toml') ||
        p.endsWith('pyproject.toml') ||
        p.endsWith('go.mod') ||
        p.endsWith('requirements.txt')
    );

    if (candidateManifest) {
      try {
        const fileData = await githubService.fetchFileContent(
          repo.owner,
          repo.repoName,
          candidateManifest
        );
        manifestSnippet = fileData.content?.slice(0, 1500) || '';
      } catch (e) {
        // Continue if manifest fetch fails (e.g. rate limit)
      }
    }

    const analysis = await aiService.analyzeRepository(repo, manifestSnippet);
    repoAnalysisCache.set(key, analysis);
    return analysis;
  },

  async analyzeIssue(
    issue: Issue,
    fileTreeSample?: string[]
  ): Promise<IssueAnalysis> {
    const key = `${issue.repository}#${issue.issueNumber}`;
    if (issueAnalysisCache.has(key)) {
      return issueAnalysisCache.get(key)!;
    }

    const analysis = await aiService.analyzeIssue(issue, fileTreeSample);
    issueAnalysisCache.set(key, analysis);
    return analysis;
  },
};
