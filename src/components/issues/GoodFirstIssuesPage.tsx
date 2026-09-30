import React, { useState, useEffect, useRef } from 'react';
import { Issue } from '../../types';
import { issueService, IssueFilterOptions } from '../../services/issueService';
import { IssueCard } from '../cards/IssueCard';
import { SearchBar } from '../common/SearchBar';
import { EmptyState } from '../common/EmptyState';
import { LoadingState } from '../common/LoadingState';
import { Filter, ArrowUpDown, RefreshCw, AlertCircle, ChevronDown, Sparkles } from 'lucide-react';

interface GoodFirstIssuesPageProps {
  onSelectIssue: (issue: Issue) => void;
  onPrepareIssue: (issue: Issue) => void;
}

export const GoodFirstIssuesPage: React.FC<GoodFirstIssuesPageProps> = ({
  onSelectIssue,
  onPrepareIssue,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'good first issue' | 'help wanted' | 'documentation' | 'beginner' | 'intermediate'>('all');
  const [sortBy, setSortBy] = useState<'match' | 'newest' | 'comments'>('match');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const debounceTimer = useRef<any>(null);

  const filterTabs: { label: string; value: typeof selectedFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Good First Issue', value: 'good first issue' },
    { label: 'Help Wanted', value: 'help wanted' },
    { label: 'Documentation', value: 'documentation' },
    { label: 'Beginner', value: 'beginner' },
    { label: 'Intermediate', value: 'intermediate' },
  ];

  const fetchIssues = async (isNewQuery = true, targetPage = 1) => {
    if (isNewQuery) {
      setIsLoading(true);
      setError(null);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const result = await issueService.searchGoodFirstIssues({
        labelFilter: selectedFilter,
        searchQuery: searchQuery.trim(),
        page: targetPage,
      });

      let items = result.items;

      // Filter by difficulty if selected
      if (selectedFilter === 'beginner') {
        items = items.filter((i) => i.difficulty === 'Beginner');
      } else if (selectedFilter === 'intermediate') {
        items = items.filter((i) => i.difficulty === 'Intermediate');
      }

      // Sort
      if (sortBy === 'match') {
        items.sort((a, b) => b.skillMatch - a.skillMatch);
      } else if (sortBy === 'comments') {
        items.sort((a, b) => b.commentsCount - a.commentsCount);
      }

      if (isNewQuery) {
        setIssues(items);
      } else {
        setIssues((prev) => [...prev, ...items]);
      }

      setHasMore(items.length >= 10);
    } catch (err: any) {
      setError(err.message || 'Failed to load issues from GitHub. Please try again.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      setPage(1);
      fetchIssues(true, 1);
    }, 400);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [searchQuery, selectedFilter, sortBy]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchIssues(false, nextPage);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedFilter('all');
    setSortBy('match');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-[28px] sm:text-[36px] font-bold tracking-tight text-[var(--foreground)]">
          Issues you can contribute to
        </h1>
        <p className="text-[15px] sm:text-[16px] text-[var(--muted-foreground)] max-w-2xl font-normal leading-relaxed">
          Real open issues from GitHub evaluated for beginner friendliness and matched to your skill profile.
        </p>
      </div>

      {/* Top Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search issues by keywords or labels... (e.g. documentation, bug, refactor)"
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
            <option value="match">Best Skill Match</option>
            <option value="newest">Recently Created</option>
            <option value="comments">Most Discussion</option>
          </select>
        </div>
      </div>

      {/* Filter Segment Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[var(--border)]">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelectedFilter(tab.value)}
            className={`px-3 py-1.5 text-[13px] font-medium rounded-lg transition-colors whitespace-nowrap ${
              selectedFilter === tab.value
                ? 'text-[var(--primary)] bg-blue-50 font-semibold border border-blue-200/80 shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start justify-between gap-3 text-red-800 text-[14px]">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Unable to load issues from GitHub</p>
              <p className="text-[13px] text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
          <button
            onClick={() => fetchIssues(true, 1)}
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
      ) : issues.length === 0 ? (
        <EmptyState
          title="No suitable issues found"
          description="Try adjusting your keyword search or selecting another category filter."
          actionText="Reset Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="space-y-8">
          <div className="flex items-center justify-between text-[13px] text-[var(--muted-foreground)]">
            <span className="font-mono tabular-nums">
              Showing {issues.length} live issues matching criteria
            </span>
          </div>

          {/* Issues Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                onViewIssue={onSelectIssue}
                onPrepareToContribute={onPrepareIssue}
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
                    <span>Loading more issues...</span>
                  </>
                ) : (
                  <>
                    <span>Load More Issues</span>
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
