import React, { useState, useEffect, useRef } from 'react';
import { Repository } from '../../types';
import { repositoryService } from '../../services/repositoryService';
import { RepositoryCard } from '../cards/RepositoryCard';
import { SearchBar } from '../common/SearchBar';
import { EmptyState } from '../common/EmptyState';
import { LoadingState } from '../common/LoadingState';
import {
  SlidersHorizontal,
  ArrowUpDown,
  Check,
  Sparkles,
  GitBranch,
  Star,
  RefreshCw,
  AlertCircle,
  ChevronDown,
} from 'lucide-react';

interface ExploreProjectsPageProps {
  onSelectRepo: (repo: Repository) => void;
  onFindIssuesForRepo: (repo: Repository) => void;
}

export const ExploreProjectsPage: React.FC<ExploreProjectsPageProps> = ({
  onSelectRepo,
  onFindIssuesForRepo,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [onlyGoodFirstIssues, setOnlyGoodFirstIssues] = useState(false);
  const [sortBy, setSortBy] = useState<'Recommended' | 'Most Active' | 'Recently Updated' | 'Most Starred'>('Recommended');
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const debounceTimer = useRef<any>(null);

  const languages = ['All', 'TypeScript', 'JavaScript', 'Python', 'Rust', 'Go', 'C++', 'Java'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const topics = ['All', 'react', 'web', 'machine-learning', 'tools', 'database', 'framework'];

  // Initial fetch of popular real GitHub repositories
  const fetchRepositories = async (isNewQuery = true, targetPage = 1) => {
    if (isNewQuery) {
      setIsLoading(true);
      setError(null);
    } else {
      setIsLoadingMore(true);
    }

    try {
      if (!searchQuery.trim() && selectedLanguage === 'All' && selectedTopic === 'All') {
        const featured = await repositoryService.getFeaturedRepositories();
        let filtered = featured;
        if (selectedDifficulty !== 'All') {
          filtered = filtered.filter((r) => r.difficulty === selectedDifficulty);
        }
        if (onlyGoodFirstIssues) {
          filtered = filtered.filter((r) => r.beginnerIssuesCount > 0);
        }
        setRepositories(filtered);
        setHasMore(false);
      } else {
        const { items } = await repositoryService.searchRepositories(searchQuery, {
          language: selectedLanguage,
          topic: selectedTopic,
          difficulty: selectedDifficulty,
          sort: sortBy,
          page: targetPage,
        });

        let filtered = items;
        if (selectedDifficulty !== 'All') {
          filtered = filtered.filter((r) => r.difficulty === selectedDifficulty);
        }
        if (onlyGoodFirstIssues) {
          filtered = filtered.filter((r) => r.beginnerIssuesCount > 0);
        }

        if (isNewQuery) {
          setRepositories(filtered);
        } else {
          setRepositories((prev) => [...prev, ...filtered]);
        }
        setHasMore(items.length >= 10);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load repositories from GitHub. Please try again.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Debounced search on input/filter change
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      setPage(1);
      fetchRepositories(true, 1);
    }, 400);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [searchQuery, selectedLanguage, selectedTopic, selectedDifficulty, onlyGoodFirstIssues, sortBy]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchRepositories(false, nextPage);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedLanguage('All');
    setSelectedDifficulty('All');
    setSelectedTopic('All');
    setOnlyGoodFirstIssues(false);
    setSortBy('Recommended');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Subtitle */}
      <div className="space-y-1">
        <h1 className="text-[28px] sm:text-[36px] font-bold tracking-tight text-[var(--foreground)]">
          Explore Open Source
        </h1>
        <p className="text-[15px] sm:text-[16px] text-[var(--muted-foreground)] max-w-2xl font-normal leading-relaxed">
          Find real GitHub repositories that match your skills, inspect architectures, and discover contribution paths.
        </p>
      </div>

      {/* Top Search Bar & Sort Dropdown */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search repositories, technologies, or topics... (e.g. react, next.js, rust)"
          />
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <ArrowUpDown className="w-4 h-4 text-neutral-400" />
          <span className="text-[13px] text-neutral-500 hidden sm:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-[13px] font-medium text-neutral-700 bg-white border border-[var(--border)] rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all"
          >
            <option value="Recommended">Recommended</option>
            <option value="Most Active">Most Active</option>
            <option value="Recently Updated">Recently Updated</option>
            <option value="Most Starred">Most Starred</option>
          </select>
        </div>
      </div>

      {/* Filter Bar with Horizontal Scrolling on Mobile */}
      <div className="bg-white border border-[var(--border)] rounded-xl p-4 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-[13px] font-semibold text-neutral-700">
          <SlidersHorizontal className="w-4 h-4 text-[var(--primary)]" />
          <span>Filters</span>
        </div>

        {/* Filters Group */}
        <div className="space-y-3">
          {/* Languages */}
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)] block mb-1.5">
              Language
            </span>
            <div className="flex flex-wrap gap-1.5">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-2.5 py-1 text-[12px] font-medium rounded-lg transition-colors font-mono ${
                    selectedLanguage === lang
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200/80'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty & Topics & Toggle Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 border-t border-neutral-100">
            {/* Difficulty */}
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)] block mb-1.5">
                Difficulty
              </span>
              <div className="flex flex-wrap gap-1.5">
                {difficulties.map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-2.5 py-1 text-[12px] font-medium rounded-lg transition-colors ${
                      selectedDifficulty === diff
                        ? 'bg-neutral-900 text-white shadow-2xs'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200/80'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Topics */}
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)] block mb-1.5">
                Topic
              </span>
              <div className="flex flex-wrap gap-1.5">
                {topics.map((top) => (
                  <button
                    key={top}
                    onClick={() => setSelectedTopic(top)}
                    className={`px-2.5 py-1 text-[12px] font-medium rounded-lg transition-colors font-mono ${
                      selectedTopic === top
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80'
                    }`}
                  >
                    {top === 'All' ? 'All' : `#${top}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Beginner Issues Only Toggle */}
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2.5 text-[13px] font-medium text-neutral-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyGoodFirstIssues}
                  onChange={(e) => setOnlyGoodFirstIssues(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-neutral-300 focus:ring-blue-500"
                />
                <span>Has Beginner Issues Only</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start justify-between gap-3 text-red-800 text-[14px]">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Unable to load repositories</p>
              <p className="text-[13px] text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
          <button
            onClick={() => fetchRepositories(true, 1)}
            className="px-3 py-1.5 text-xs font-semibold text-red-800 bg-white border border-red-300 rounded-lg hover:bg-red-50 flex items-center gap-1.5 shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <LoadingState count={6} type="grid" />
      ) : repositories.length === 0 ? (
        <EmptyState
          title="No repositories found"
          description="Try broadening your search query or resetting active language and topic filters."
          actionText="Reset All Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="space-y-8">
          <div className="flex items-center justify-between text-[13px] text-[var(--muted-foreground)]">
            <span className="font-mono tabular-nums">
              Showing {repositories.length} open source repositories from GitHub
            </span>
          </div>

          {/* Repositories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repositories.map((repo) => (
              <RepositoryCard
                key={repo.id}
                repository={repo}
                onViewProject={onSelectRepo}
                onFindIssues={onFindIssuesForRepo}
              />
            ))}
          </div>

          {/* Load More Pagination */}
          {hasMore && (
            <div className="flex justify-center pt-4">
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="px-6 py-2.5 text-[13px] font-semibold text-neutral-800 bg-white hover:bg-neutral-100 border border-[var(--border)] rounded-lg transition-colors flex items-center gap-2 shadow-2xs disabled:opacity-50"
              >
                {isLoadingMore ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Loading more repositories...</span>
                  </>
                ) : (
                  <>
                    <span>Load More Repositories</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
