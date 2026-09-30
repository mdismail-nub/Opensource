import { Issue } from '../types';
import { githubService } from './githubService';
import { storageService } from './storageService';
import { recommendationEngine } from './recommendationEngine';

export interface IssueFilterOptions {
  labelFilter?: 'all' | 'good first issue' | 'help wanted' | 'documentation' | 'beginner' | 'intermediate';
  repoFilter?: string; // owner/repo
  searchQuery?: string;
  page?: number;
}

export const issueService = {
  async getIssuesForRepository(
    owner: string,
    repo: string,
    options?: { labels?: string }
  ): Promise<Issue[]> {
    const issues = await githubService.fetchIssues(owner, repo, options);
    const userSkills = storageService.getUserSkillLevels();

    return issues.map((issue) => {
      const compat = recommendationEngine.calculateIssueCompatibility(issue, userSkills);
      return {
        ...issue,
        skillMatch: compat.score,
        difficulty: compat.label.includes('Strong') ? 'Beginner' : 'Intermediate',
      };
    });
  },

  async searchGoodFirstIssues(options?: IssueFilterOptions): Promise<{ items: Issue[]; totalCount: number }> {
    const userSkills = storageService.getUserSkillLevels();
    const token = storageService.getGitHubToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['x-github-token'] = token;
    }

    let q = 'is:issue is:open';

    if (options?.repoFilter && options.repoFilter !== 'all') {
      q += ` repo:${options.repoFilter}`;
    }

    if (options?.labelFilter && options.labelFilter !== 'all') {
      if (options.labelFilter === 'beginner' || options.labelFilter === 'good first issue') {
        q += ' label:"good first issue"';
      } else if (options.labelFilter === 'help wanted') {
        q += ' label:"help wanted"';
      } else if (options.labelFilter === 'documentation') {
        q += ' label:"documentation"';
      }
    } else if (!options?.repoFilter || options.repoFilter === 'all') {
      // Default to good first issues across open-source
      q += ' label:"good first issue"';
    }

    if (options?.searchQuery?.trim()) {
      q += ` ${options.searchQuery.trim()}`;
    }

    const page = options?.page || 1;
    const res = await fetch(
      `/api/github/search-issues?q=${encodeURIComponent(q)}&sort=created&order=desc&page=${page}`,
      { headers }
    );

    if (!res.ok) {
      throw new Error(`Failed to load issues from GitHub (${res.status})`);
    }

    const data = await res.json();
    const rawItems = Array.isArray(data.items) ? data.items : [];

    const issues: Issue[] = rawItems
      .filter((item: any) => !item.pull_request)
      .map((item: any) => {
        // extract owner/repo from repository_url: https://api.github.com/repos/owner/name
        let repoFullName = 'open-source/project';
        if (item.repository_url) {
          const parts = item.repository_url.split('/repos/');
          if (parts[1]) repoFullName = parts[1];
        }

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

        const issueObj: Issue = {
          id: `issue-${item.number}-${repoFullName.replace('/', '-')}`,
          issueNumber: item.number,
          title: item.title,
          repository: repoFullName,
          repoId: repoFullName.replace('/', '-').toLowerCase(),
          labels: labels.length > 0 ? labels : ['good first issue'],
          difficulty: isGoodFirst ? 'Beginner' : 'Intermediate',
          skillMatch: isGoodFirst ? 94 : 82,
          descriptionPreview: (item.body || 'No description provided.').slice(0, 190) + '...',
          fullDescription: item.body || 'No extended description provided.',
          expectedBehavior: 'Implement or resolve the described enhancement or bug fix.',
          whatYoullNeed: ['Code reading', 'Git branch workflow', 'Local verification'],
          youAlreadyKnow: ['Common programming constructs', 'Git'],
          youShouldReview: ['Repository CONTRIBUTING.md', 'Issue discussion thread'],
          filesToUnderstand: [
            {
              path: 'README.md',
              lines: 'lines 1–50',
              role: 'Environment setup and contribution flow.',
              codeSnippet: '# Contributing Guide\nVerify code with automated testing before submitting PR.',
              language: 'markdown',
              githubUrl: `https://github.com/${repoFullName}/blob/main/README.md`,
            },
          ],
          preparationChecklist: [
            { id: 'p-1', label: 'Read issue description and reproduction steps', checked: true },
            { id: 'p-2', label: 'Reproduce locally or identify target files', checked: false },
            { id: 'p-3', label: 'Check repo CONTRIBUTING.md for test and PR rules', checked: false },
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

        const compat = recommendationEngine.calculateIssueCompatibility(issueObj, userSkills);
        issueObj.skillMatch = compat.score;
        return issueObj;
      });

    return {
      items: issues,
      totalCount: data.total_count || issues.length,
    };
  },

  isSaved(issueId: string): boolean {
    return storageService.isIssueSaved(issueId);
  },

  toggleBookmark(issue: Issue): boolean {
    return storageService.toggleSaveIssue(issue);
  },

  isCompleted(issueId: string): boolean {
    return storageService.isIssueCompleted(issueId);
  },

  toggleCompleted(issueId: string): boolean {
    return storageService.toggleIssueCompleted(issueId);
  },

  getSavedIssues(): Issue[] {
    return storageService.getSavedIssues();
  },
};
