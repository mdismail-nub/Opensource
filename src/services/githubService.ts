import { Repository, Issue, RepositoryContributor, RoadmapStep } from '../types';
import { storageService } from './storageService';

export interface ParsedRepoUrl {
  owner: string;
  repo: string;
}

export function parseGitHubUrl(input: string): ParsedRepoUrl | null {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();

  // Pattern 1: https://github.com/owner/repo or github.com/owner/repo
  const urlMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9._-]+)\/([a-zA-Z0-9._-]+)/i);
  if (urlMatch && urlMatch[1] && urlMatch[2]) {
    return {
      owner: urlMatch[1],
      repo: urlMatch[2].replace(/\.git$/i, ''),
    };
  }

  // Pattern 2: owner/repo
  const slashMatch = trimmed.match(/^([a-zA-Z0-9._-]+)\/([a-zA-Z0-9._-]+)$/);
  if (slashMatch && slashMatch[1] && slashMatch[2]) {
    return {
      owner: slashMatch[1],
      repo: slashMatch[2].replace(/\.git$/i, ''),
    };
  }

  return null;
}

export function formatStars(count: number): string {
  if (!count && count !== 0) return '0';
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}k`;
  return count.toString();
}

export const githubService = {
  getHeaders(): Record<string, string> {
    const customToken = storageService.getGitHubToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (customToken) {
      headers['x-github-token'] = customToken;
    }
    return headers;
  },

  async fetchRepository(owner: string, repo: string): Promise<Repository> {
    const res = await fetch(
      `/api/github/repo?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`,
      { headers: this.getHeaders() }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `GitHub error ${res.status}`);
    }

    const data = await res.json();
    const raw = data.repo;

    // Extract topics
    const topics: string[] = Array.isArray(raw.topics) ? raw.topics : [];
    if (raw.language && !topics.includes(raw.language.toLowerCase())) {
      topics.unshift(raw.language.toLowerCase());
    }

    const formattedRepo: Repository = {
      id: `${raw.owner?.login || owner}-${raw.name || repo}`.toLowerCase(),
      name: `${raw.owner?.login || owner}/${raw.name || repo}`,
      owner: raw.owner?.login || owner,
      repoName: raw.name || repo,
      description: raw.description || 'No description provided.',
      stars: raw.stargazers_count || 0,
      starsFormatted: formatStars(raw.stargazers_count || 0),
      forks: raw.forks_count || 0,
      contributorsCount: data.contributors?.length || Math.min(raw.forks_count || 10, 80),
      openIssuesCount: raw.open_issues_count || 0,
      primaryLanguage: raw.language || 'Unknown',
      languages: Array.isArray(data.languages) && data.languages.length > 0
        ? data.languages
        : [{ name: raw.language || 'Codebase', percentage: 100, color: '#2563eb' }],
      topics: topics.slice(0, 8),
      skillMatch: 85,
      beginnerIssuesCount: Math.min(raw.open_issues_count || 0, 15),
      difficulty: (raw.stargazers_count > 100000 ? 'Intermediate' : 'Beginner') as any,
      lastUpdated: raw.updated_at ? new Date(raw.updated_at).toLocaleDateString() : 'Recently',
      license: raw.license?.spdx_id || raw.license?.name || 'Open Source',
      defaultBranch: raw.default_branch || 'main',
      roadmap: [],
      readmePreview: data.readme?.slice(0, 3000) || `# ${raw.name}\n\n${raw.description || ''}`,
      architectureNotes: [
        `Default branch: ${raw.default_branch || 'main'}.`,
        `Primary stack: ${raw.language || 'Various'}.`,
        `Repository contains ${data.fileTree?.length || 0} indexed files.`,
      ],
      prerequisites: [
        `Familiarity with ${raw.language || 'modern software engineering'}`,
        'Git branch and pull request workflow',
        'Running repository verification scripts locally',
      ],
      contributors: Array.isArray(data.contributors) ? data.contributors : [],
      activity: {
        commitsThisMonth: data.recentCommitsCount || 24,
        avgPrResponseTime: '1–2 days',
        releasesThisYear: 8,
        mergedPrsLast30Days: 20,
      },
      htmlUrl: raw.html_url,
      fileTree: data.fileTree || [],
      isCustomAnalyzed: true,
    };

    return formattedRepo;
  },

  async searchRepositories(
    query: string,
    options?: { sort?: string; order?: string; page?: number }
  ): Promise<Repository[]> {
    const res = await fetch(
      `/api/github/search?q=${encodeURIComponent(query)}&sort=${options?.sort || 'stars'}&order=${
        options?.order || 'desc'
      }&page=${options?.page || 1}`,
      { headers: this.getHeaders() }
    );

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Search failed with status ${res.status}`);
    }

    const data = await res.json();
    if (!Array.isArray(data.items)) return [];

    return data.items.map((raw: any) => ({
      id: `${raw.owner?.login}-${raw.name}`.toLowerCase(),
      name: `${raw.owner?.login}/${raw.name}`,
      owner: raw.owner?.login,
      repoName: raw.name,
      description: raw.description || 'Open source repository on GitHub.',
      stars: raw.stargazers_count,
      starsFormatted: formatStars(raw.stargazers_count),
      forks: raw.forks_count,
      contributorsCount: Math.min(Math.round(raw.forks_count * 0.15), 100) || 12,
      openIssuesCount: raw.open_issues_count,
      primaryLanguage: raw.language || 'Multiple',
      languages: [{ name: raw.language || 'Codebase', percentage: 100, color: '#2563eb' }],
      topics: Array.isArray(raw.topics) ? raw.topics.slice(0, 6) : [],
      skillMatch: 85,
      beginnerIssuesCount: Math.min(raw.open_issues_count, 10),
      difficulty: 'Beginner',
      lastUpdated: raw.updated_at ? new Date(raw.updated_at).toLocaleDateString() : 'Recently',
      license: raw.license?.spdx_id || 'MIT',
      defaultBranch: raw.default_branch || 'main',
      roadmap: [],
      readmePreview: raw.description || '',
      architectureNotes: ['Active GitHub community repository.'],
      prerequisites: [`Experience in ${raw.language || 'software development'}`],
      contributors: [],
      activity: {
        commitsThisMonth: 30,
        avgPrResponseTime: '1 day',
        releasesThisYear: 6,
        mergedPrsLast30Days: 18,
      },
      htmlUrl: raw.html_url,
    }));
  },

  async fetchIssues(
    owner: string,
    repo: string,
    options?: { labels?: string; state?: string }
  ): Promise<Issue[]> {
    const labelParam = options?.labels ? `&labels=${encodeURIComponent(options.labels)}` : '';
    const stateParam = options?.state ? `&state=${encodeURIComponent(options.state)}` : 'open';

    const res = await fetch(
      `/api/github/issues?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(
        repo
      )}${labelParam}&state=${stateParam}`,
      { headers: this.getHeaders() }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to fetch issues: ${res.status}`);
    }

    const rawList = await res.json();
    if (!Array.isArray(rawList)) return [];

    return rawList.map((item: any) => {
      const labels = Array.isArray(item.labels)
        ? item.labels.map((l: any) => (typeof l === 'string' ? l : l.name))
        : [];

      const isGoodFirst = labels.some((l: string) =>
        l.toLowerCase().includes('good first') ||
        l.toLowerCase().includes('beginner') ||
        l.toLowerCase().includes('help wanted') ||
        l.toLowerCase().includes('easy') ||
        l.toLowerCase().includes('documentation')
      );

      return {
        id: `issue-${item.number}`,
        issueNumber: item.number,
        title: item.title,
        repository: `${owner}/${repo}`,
        repoId: `${owner}-${repo}`.toLowerCase(),
        labels: labels.length > 0 ? labels : ['open-issue'],
        difficulty: isGoodFirst ? 'Beginner' : 'Intermediate',
        skillMatch: isGoodFirst ? 92 : 82,
        descriptionPreview: (item.body || 'No description provided.').slice(0, 180) + '...',
        fullDescription: item.body || 'No extended description provided.',
        expectedBehavior: 'Implement the fix or enhancement as described, adhering to the project code conventions.',
        whatYoullNeed: ['Code reading', 'Component patterns', 'Local testing'],
        youAlreadyKnow: ['Git branching workflow', 'Basic syntax'],
        youShouldReview: ['Issue reproduction steps', 'PR contribution checklist'],
        filesToUnderstand: [
          {
            path: 'README.md',
            lines: 'lines 1–50',
            role: 'Repository onboarding and development scripts.',
            codeSnippet: '# Development Guide\nRun package test runner to verify changes.',
            language: 'markdown',
            githubUrl: `https://github.com/${owner}/${repo}/blob/main/README.md`,
          },
        ],
        preparationChecklist: [
          { id: 'p-1', label: 'Read issue description and reproduction steps', checked: true },
          { id: 'p-2', label: 'Verify issue locally on your machine', checked: false },
          { id: 'p-3', label: 'Read repository CONTRIBUTING.md guidelines', checked: false },
        ],
        createdAt: item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recently',
        commentsCount: item.comments || 0,
        htmlUrl: item.html_url,
        author: {
          name: item.user?.login || 'contributor',
          handle: item.user?.login || 'contributor',
          avatar: item.user?.avatar_url || '',
          role: item.author_association || 'Contributor',
        },
      };
    });
  },

  async fetchFileContent(
    owner: string,
    repo: string,
    filePath: string
  ): Promise<{ path: string; content: string; htmlUrl: string }> {
    const res = await fetch(
      `/api/github/file?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(
        repo
      )}&path=${encodeURIComponent(filePath)}`,
      { headers: this.getHeaders() }
    );
    if (!res.ok) {
      throw new Error(`Could not load ${filePath}`);
    }
    return res.json();
  },

  async fetchUserProfile(username: string) {
    const res = await fetch(`/api/github/user?username=${encodeURIComponent(username)}`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) {
      throw new Error(`User ${username} not found`);
    }
    return res.json();
  },
};
