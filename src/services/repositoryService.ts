import { Repository } from '../types';
import { githubService, parseGitHubUrl } from './githubService';
import { storageService } from './storageService';
import { recommendationEngine } from './recommendationEngine';

// In-memory cache for popular repos to avoid re-fetching on rapid tab navigation
let cachedFeaturedRepos: Repository[] | null = null;
let featuredFetchPromise: Promise<Repository[]> | null = null;

export interface RepositoryFilterOptions {
  language?: string;
  topic?: string;
  difficulty?: string;
  minStars?: number;
  sort?: 'Recommended' | 'Most Active' | 'Recently Updated' | 'Most Starred';
  page?: number;
}

export const repositoryService = {
  async getFeaturedRepositories(): Promise<Repository[]> {
    if (cachedFeaturedRepos && cachedFeaturedRepos.length > 0) {
      return cachedFeaturedRepos;
    }

    if (featuredFetchPromise) {
      return featuredFetchPromise;
    }

    featuredFetchPromise = (async () => {
      try {
        // Query top developer toolkits and frameworks on GitHub
        const repos = await githubService.searchRepositories('stars:>40000', {
          sort: 'stars',
          order: 'desc',
          page: 1,
        });

        const userSkills = storageService.getUserSkillLevels();
        const withScores = repos.map((r) => {
          const compat = recommendationEngine.calculateRepoCompatibility(r, userSkills);
          return { ...r, skillMatch: compat.score };
        });

        cachedFeaturedRepos = withScores;
        return withScores;
      } catch (err) {
        console.error('Failed to fetch featured repositories:', err);
        return [];
      } finally {
        featuredFetchPromise = null;
      }
    })();

    return featuredFetchPromise;
  },

  async searchRepositories(
    query: string,
    filters?: RepositoryFilterOptions
  ): Promise<{ items: Repository[]; totalCount: number }> {
    let q = query.trim();
    if (!q) {
      q = 'stars:>10000';
    }

    if (filters?.language && filters.language !== 'All') {
      q += ` language:${filters.language}`;
    }

    if (filters?.topic && filters.topic !== 'All') {
      q += ` topic:${filters.topic}`;
    }

    let sortParam = 'stars';
    let orderParam = 'desc';

    if (filters?.sort === 'Most Starred') {
      sortParam = 'stars';
      orderParam = 'desc';
    } else if (filters?.sort === 'Recently Updated') {
      sortParam = 'updated';
      orderParam = 'desc';
    } else if (filters?.sort === 'Most Active') {
      sortParam = 'forks';
      orderParam = 'desc';
    }

    const repos = await githubService.searchRepositories(q, {
      sort: sortParam,
      order: orderParam,
      page: filters?.page || 1,
    });

    const userSkills = storageService.getUserSkillLevels();
    const scoredRepos = repos.map((r) => {
      const compat = recommendationEngine.calculateRepoCompatibility(r, userSkills);
      return {
        ...r,
        skillMatch: compat.score,
        difficulty: (r.stars > 80000 ? 'Intermediate' : 'Beginner') as any,
      };
    });

    // Handle 'Recommended' sort locally based on user skill matching
    if (filters?.sort === 'Recommended') {
      scoredRepos.sort((a, b) => b.skillMatch - a.skillMatch);
    }

    return {
      items: scoredRepos,
      totalCount: scoredRepos.length * 5, // Approximate pagination hint
    };
  },

  async getRepository(owner: string, repo: string): Promise<Repository> {
    const repository = await githubService.fetchRepository(owner, repo);
    const userSkills = storageService.getUserSkillLevels();
    const compat = recommendationEngine.calculateRepoCompatibility(repository, userSkills);
    repository.skillMatch = compat.score;
    return repository;
  },

  parseUrl(input: string) {
    return parseGitHubUrl(input);
  },

  getSavedRepositories(): Repository[] {
    return storageService.getSavedRepos();
  },

  toggleBookmark(repo: Repository): boolean {
    return storageService.toggleSaveRepo(repo);
  },

  isBookmarked(repoId: string): boolean {
    return storageService.isRepoSaved(repoId);
  },
};
