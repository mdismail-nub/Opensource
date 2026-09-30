import React, { useState, useEffect } from 'react';
import { Repository, Issue } from '../../types';
import { RoadmapView } from '../roadmap/RoadmapView';
import { IssueCard } from '../cards/IssueCard';
import { SkillMatchBadge } from '../common/SkillMatchBadge';
import { DifficultyBadge } from '../common/DifficultyBadge';
import { LoadingState } from '../common/LoadingState';
import { EmptyState } from '../common/EmptyState';
import { issueService } from '../../services/issueService';
import { analysisService } from '../../services/analysisService';
import { storageService } from '../../services/storageService';
import { recommendationEngine } from '../../services/recommendationEngine';
import {
  GitBranch,
  Star,
  GitFork,
  Users,
  AlertCircle,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Code,
  FileText,
  Activity as ActivityIcon,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowLeft,
  Sparkles,
  Bookmark,
  RefreshCw,
  Loader2,
} from 'lucide-react';

interface RepositoryOverviewPageProps {
  repository: Repository;
  onBack: () => void;
  onSelectIssue: (issue: Issue) => void;
  onNavigateToIssues: () => void;
  onSelectRepo: (repo: Repository) => void;
}

export const RepositoryOverviewPage: React.FC<RepositoryOverviewPageProps> = ({
  repository: initialRepo,
  onBack,
  onSelectIssue,
  onNavigateToIssues,
  onSelectRepo,
}) => {
  const [repository, setRepository] = useState<Repository>(initialRepo);
  const [activeTab, setActiveTab] = useState<'Overview' | 'Learning Roadmap' | 'Issues' | 'Contributors' | 'Activity'>('Overview');
  const [isSaved, setIsSaved] = useState(() => storageService.isRepoSaved(initialRepo.id));
  const [liveIssues, setLiveIssues] = useState<Issue[] | null>(null);
  const [loadingIssues, setLoadingIssues] = useState(false);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    setRepository(initialRepo);
    setIsSaved(storageService.isRepoSaved(initialRepo.id));
    setLiveIssues(null);
  }, [initialRepo]);

  // Load real issues when user opens Issues tab
  useEffect(() => {
    if (activeTab === 'Issues' && liveIssues === null) {
      setLoadingIssues(true);
      issueService
        .getIssuesForRepository(repository.owner, repository.repoName)
        .then((issues) => {
          setLiveIssues(issues);
        })
        .catch((e) => {
          console.warn('Failed to fetch real issues for repo:', e);
          setLiveIssues([]);
        })
        .finally(() => setLoadingIssues(false));
    }
  }, [activeTab, repository.owner, repository.repoName, liveIssues]);

  const handleToggleSave = () => {
    const updated = storageService.toggleSaveRepo(repository);
    setIsSaved(updated);
  };

  const handleRunAiAnalysis = async () => {
    setIsAiAnalyzing(true);
    setAiError(null);
    try {
      const aiResult = await analysisService.analyzeRepository(repository);
      const userSkills = storageService.getUserSkillLevels();
      const compat = recommendationEngine.calculateRepoCompatibility(repository, userSkills);

      const enriched: Repository = {
        ...repository,
        skillMatch: compat.score,
        difficulty: aiResult.difficulty || repository.difficulty,
        architectureNotes: aiResult.architecture.length > 0 ? aiResult.architecture : repository.architectureNotes,
        prerequisites: aiResult.learningRequirements.length > 0 ? aiResult.learningRequirements : repository.prerequisites,
        roadmap: aiResult.generatedRoadmap && aiResult.generatedRoadmap.length > 0 ? aiResult.generatedRoadmap : repository.roadmap,
        isCustomAnalyzed: true,
      };

      setRepository(enriched);
      onSelectRepo(enriched);
    } catch (e: any) {
      setAiError(e.message || 'Gemini analysis failed. Please try again.');
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to exploration</span>
      </button>

      {/* Top Header Card */}
      <div className="bg-white border border-[var(--border)] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[12px] font-mono text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                {repository.owner}
              </span>
              <span className="text-neutral-300">/</span>
              <h1 className="text-[24px] sm:text-[32px] font-bold text-[var(--foreground)] tracking-tight font-mono">
                {repository.repoName}
              </h1>

              <div className="flex items-center gap-2 ml-auto sm:ml-2">
                <SkillMatchBadge score={repository.skillMatch} size="md" />
                <DifficultyBadge difficulty={repository.difficulty} />
              </div>
            </div>

            <p className="text-[15px] sm:text-[16px] text-neutral-600 leading-relaxed font-normal max-w-3xl">
              {repository.description}
            </p>

            {/* Quick Metadata Chips */}
            <div className="flex flex-wrap items-center gap-4 text-[13px] text-neutral-600 font-mono pt-1">
              <span className="flex items-center gap-1.5" title={`${repository.stars.toLocaleString()} Stars`}>
                <Star className="w-4 h-4 text-amber-500 fill-amber-500/20" />
                <strong className="text-neutral-900 font-semibold">{repository.starsFormatted}</strong> stars
              </span>
              <span className="text-neutral-300">·</span>
              <span className="flex items-center gap-1.5" title={`${repository.forks.toLocaleString()} Forks`}>
                <GitFork className="w-4 h-4 text-neutral-400" />
                <strong className="text-neutral-900 font-semibold">{repository.forks.toLocaleString()}</strong> forks
              </span>
              <span className="text-neutral-300">·</span>
              <span className="flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-neutral-400" />
                <strong className="text-neutral-900 font-semibold">{repository.openIssuesCount.toLocaleString()}</strong> open issues
              </span>
              <span className="text-neutral-300">·</span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-neutral-400" />
                <strong className="text-neutral-900 font-semibold">{repository.contributorsCount}+</strong> contributors
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
            <button
              onClick={handleToggleSave}
              className={`px-4 py-2.5 text-[13px] font-semibold rounded-lg border transition-colors flex items-center justify-center gap-2 ${
                isSaved
                  ? 'bg-blue-50 text-[var(--primary)] border-blue-200'
                  : 'bg-white text-neutral-700 border-[var(--border)] hover:bg-neutral-50'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[var(--primary)]' : ''}`} />
              <span>{isSaved ? 'Saved to Bookmarks' : 'Bookmark Project'}</span>
            </button>

            <button
              onClick={handleRunAiAnalysis}
              disabled={isAiAnalyzing}
              className="px-4 py-2.5 text-[13px] font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
            >
              {isAiAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze with Gemini AI</span>
                </>
              )}
            </button>

            {repository.htmlUrl && (
              <a
                href={repository.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-[13px] font-medium text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200/80 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View on GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* AI Error Alert */}
        {aiError && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-[13px] text-red-800 flex items-center justify-between">
            <span>{aiError}</span>
            <button onClick={handleRunAiAnalysis} className="underline font-semibold ml-2">Retry</button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-t border-[var(--border)] pt-4 overflow-x-auto">
          {(['Overview', 'Learning Roadmap', 'Issues', 'Contributors', 'Activity'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-2 text-[14px] font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'text-[var(--primary)] bg-blue-50/80 font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'Overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Architecture Overview */}
            <div className="bg-white border border-[var(--border)] rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[var(--primary)]" />
                <h3 className="text-[18px] font-semibold text-[var(--foreground)]">Architecture & Structure</h3>
              </div>
              <ul className="space-y-2 text-[14px] text-neutral-600 font-normal leading-relaxed">
                {repository.architectureNotes.map((note, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shrink-0 mt-2" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Prerequisites */}
            <div className="bg-white border border-[var(--border)] rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <h3 className="text-[18px] font-semibold text-[var(--foreground)]">Recommended Prerequisites</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {repository.prerequisites.map((prereq, idx) => (
                  <div key={idx} className="p-3 bg-neutral-50 border border-[var(--border)] rounded-lg flex items-center gap-2.5 text-[13px] text-neutral-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{prereq}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* README Preview */}
            <div className="bg-white border border-[var(--border)] rounded-xl p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-neutral-500" />
                  <h3 className="text-[18px] font-semibold text-[var(--foreground)]">README Excerpt</h3>
                </div>
                {repository.htmlUrl && (
                  <a
                    href={`${repository.htmlUrl}#readme`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12px] text-blue-600 hover:underline flex items-center gap-1 font-mono"
                  >
                    <span>Full README on GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <pre className="p-4 bg-neutral-950 text-neutral-200 rounded-lg text-[13px] font-mono overflow-x-auto whitespace-pre-wrap max-h-80 leading-relaxed">
                {repository.readmePreview}
              </pre>
            </div>
          </div>

          {/* Sidebar Column: Language Breakdown & Quick Next Step */}
          <div className="space-y-6">
            {/* Languages Breakdown */}
            <div className="bg-white border border-[var(--border)] rounded-xl p-6 shadow-xs space-y-4">
              <h3 className="text-[16px] font-semibold text-[var(--foreground)]">Languages & Tooling</h3>
              <div className="space-y-3">
                {repository.languages.map((lang) => (
                  <div key={lang.name} className="space-y-1">
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="font-medium text-neutral-800 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: lang.color }} />
                        {lang.name}
                      </span>
                      <span className="font-mono text-neutral-500 tabular-nums">{lang.percentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Next Step Box */}
            <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-blue-800 font-semibold text-[14px]">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Ready to start?</span>
              </div>
              <p className="text-[13px] text-neutral-600 leading-relaxed font-normal">
                Follow the generated learning roadmap to prepare, or inspect beginner-friendly open issues for this repository.
              </p>
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => setActiveTab('Learning Roadmap')}
                  className="w-full py-2 px-3 text-[13px] font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-lg transition-colors text-center shadow-xs"
                >
                  View Learning Roadmap
                </button>
                <button
                  onClick={() => setActiveTab('Issues')}
                  className="w-full py-2 px-3 text-[13px] font-semibold text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-lg transition-colors text-center"
                >
                  Inspect Open Issues
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Learning Roadmap */}
      {activeTab === 'Learning Roadmap' && (
        <RoadmapView
          repository={repository}
          onExploreIssues={() => setActiveTab('Issues')}
          onSelectRepo={setRepository}
        />
      )}

      {/* Tab 3: Issues */}
      {activeTab === 'Issues' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-[20px] font-bold text-[var(--foreground)]">
                Issues for {repository.name}
              </h3>
              <p className="text-[14px] text-[var(--muted-foreground)]">
                Live GitHub issues evaluated for beginner contribution viability.
              </p>
            </div>
            {repository.htmlUrl && (
              <a
                href={`${repository.htmlUrl}/issues`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-blue-600 hover:underline flex items-center gap-1 font-medium"
              >
                <span>All issues on GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {loadingIssues ? (
            <LoadingState count={3} type="grid" />
          ) : !liveIssues || liveIssues.length === 0 ? (
            <EmptyState
              title="No open issues found"
              description={`There are currently no open issues available for ${repository.name}. Check back later or inspect another repository.`}
              actionText="Back to Explore"
              onAction={onBack}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveIssues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  onViewIssue={onSelectIssue}
                  onPrepareToContribute={onSelectIssue}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Contributors */}
      {activeTab === 'Contributors' && (
        <div className="bg-white border border-[var(--border)] rounded-xl p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-[18px] font-semibold text-[var(--foreground)]">Project Contributors</h3>
            <p className="text-[14px] text-[var(--muted-foreground)] mt-0.5">
              Maintainers and community members who actively shape {repository.name}.
            </p>
          </div>

          {repository.contributors.length === 0 ? (
            <p className="text-[14px] text-neutral-500">No public contributor data retrieved for this repository.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {repository.contributors.map((contrib, idx) => (
                <a
                  key={idx}
                  href={`https://github.com/${contrib.handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-lg border border-[var(--border)] hover:bg-neutral-50 transition-colors group"
                >
                  {contrib.avatar ? (
                    <img
                      src={contrib.avatar}
                      alt={contrib.name}
                      className="w-10 h-10 rounded-full ring-1 ring-neutral-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-neutral-200 text-neutral-700 flex items-center justify-center font-bold text-sm">
                      {contrib.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors truncate">
                      {contrib.name}
                    </p>
                    <p className="text-[12px] text-neutral-500 font-mono">
                      @{contrib.handle}
                    </p>
                    <p className="text-[11px] text-emerald-700 font-mono mt-0.5">
                      {contrib.commits} commits
                    </p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-blue-600" />
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Activity */}
      {activeTab === 'Activity' && (
        <div className="bg-white border border-[var(--border)] rounded-xl p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-[18px] font-semibold text-[var(--foreground)]">Repository Velocity & Activity</h3>
            <p className="text-[14px] text-[var(--muted-foreground)] mt-0.5">
              Recent commit frequency, response cadence, and release cadence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-neutral-50 border border-[var(--border)] rounded-xl space-y-1">
              <span className="text-[12px] uppercase tracking-wider text-neutral-500 font-medium">Commits this month</span>
              <p className="text-[26px] font-bold font-mono text-neutral-900">{repository.activity.commitsThisMonth}</p>
            </div>
            <div className="p-4 bg-neutral-50 border border-[var(--border)] rounded-xl space-y-1">
              <span className="text-[12px] uppercase tracking-wider text-neutral-500 font-medium">Avg PR Response</span>
              <p className="text-[26px] font-bold font-mono text-neutral-900">{repository.activity.avgPrResponseTime}</p>
            </div>
            <div className="p-4 bg-neutral-50 border border-[var(--border)] rounded-xl space-y-1">
              <span className="text-[12px] uppercase tracking-wider text-neutral-500 font-medium">Releases this year</span>
              <p className="text-[26px] font-bold font-mono text-neutral-900">{repository.activity.releasesThisYear}</p>
            </div>
            <div className="p-4 bg-neutral-50 border border-[var(--border)] rounded-xl space-y-1">
              <span className="text-[12px] uppercase tracking-wider text-neutral-500 font-medium">Merged PRs (30d)</span>
              <p className="text-[26px] font-bold font-mono text-neutral-900">{repository.activity.mergedPrsLast30Days}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
