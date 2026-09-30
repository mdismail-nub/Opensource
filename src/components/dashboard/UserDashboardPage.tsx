import React, { useState, useEffect } from 'react';
import { UserProfile, Issue, Repository, UserSkillItem } from '../../types';
import { StatsCard } from '../cards/StatsCard';
import { RepositoryCard } from '../cards/RepositoryCard';
import { IssueCard } from '../cards/IssueCard';
import { EmptyState } from '../common/EmptyState';
import { storageService } from '../../services/storageService';
import { profileService } from '../../services/profileService';
import {
  Compass,
  CheckCircle2,
  GitPullRequest,
  GitMerge,
  BookOpen,
  ArrowRight,
  Sparkles,
  Bookmark,
  Clock,
  Github,
  Plus,
  RefreshCw,
  Loader2,
  ExternalLink,
} from 'lucide-react';

interface UserDashboardPageProps {
  user: UserProfile;
  onNavigateToRoadmap: () => void;
  onSelectIssue: (issue: Issue) => void;
  onSelectRepo: (repo: Repository) => void;
  onNavigateToExplore: () => void;
  onTriggerAnalyze: () => void;
}

export const UserDashboardPage: React.FC<UserDashboardPageProps> = ({
  user: initialUser,
  onNavigateToRoadmap,
  onSelectIssue,
  onSelectRepo,
  onNavigateToExplore,
  onTriggerAnalyze,
}) => {
  const [profile, setProfile] = useState<UserProfile>(() => profileService.getUserProfile());
  const [savedRepos, setSavedRepos] = useState<Repository[]>(() => storageService.getSavedRepos());
  const [savedIssues, setSavedIssues] = useState<Issue[]>(() => storageService.getSavedIssues());
  const [recentlyAnalyzed, setRecentlyAnalyzed] = useState(() => storageService.getRecentlyAnalyzed());
  const [skillLevels, setSkillLevels] = useState<UserSkillItem[]>(() => storageService.getUserSkillLevels());
  const [githubInput, setGithubInput] = useState('');
  const [isSyncingGithub, setIsSyncingGithub] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // Modal / Input for tracking a new Pull Request
  const [showAddPrModal, setShowAddPrModal] = useState(false);
  const [prTitle, setPrTitle] = useState('');
  const [prRepo, setPrRepo] = useState('');
  const [prUrl, setPrUrl] = useState('');

  // Refresh profile whenever user interacts or view opens
  const refreshState = () => {
    setProfile(profileService.getUserProfile());
    setSavedRepos(storageService.getSavedRepos());
    setSavedIssues(storageService.getSavedIssues());
    setRecentlyAnalyzed(storageService.getRecentlyAnalyzed());
    setSkillLevels(storageService.getUserSkillLevels());
  };

  useEffect(() => {
    refreshState();
  }, []);

  const handleSyncGithub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubInput.trim()) return;

    setIsSyncingGithub(true);
    setSyncFeedback(null);
    try {
      const detected = await profileService.syncWithGitHub(githubInput.trim());
      setSkillLevels(detected);
      refreshState();
      setSyncFeedback(`Successfully synced ${detected.length} language skills from @${githubInput.trim()}`);
    } catch (e: any) {
      setSyncFeedback(e.message || 'Could not sync public profile.');
    } finally {
      setIsSyncingGithub(false);
    }
  };

  const handleSkillProficiencyChange = (skillName: string, nextProf: 'Beginner' | 'Intermediate' | 'Strong') => {
    const updated = skillLevels.map((s) => (s.skill === skillName ? { ...s, proficiency: nextProf } : s));
    setSkillLevels(updated);
    profileService.updateSkills(updated);
    refreshState();
  };

  const handleAddPR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prTitle.trim() || !prRepo.trim()) return;

    storageService.addTrackedPR({
      id: `pr-${Date.now()}`,
      title: prTitle.trim(),
      repo: prRepo.trim(),
      url: prUrl.trim() || `https://github.com/${prRepo.trim()}/pulls`,
      merged: false,
      createdAt: 'Just now',
    });

    setPrTitle('');
    setPrRepo('');
    setPrUrl('');
    setShowAddPrModal(false);
    refreshState();
  };

  const isBrandNewUser = profile.stats.projectsExploring === 0 && savedIssues.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div className="space-y-1">
          <h1 className="text-[26px] sm:text-[32px] font-bold tracking-tight text-[var(--foreground)]">
            {isBrandNewUser ? 'Your open-source journey starts here.' : 'Developer Dashboard'}
          </h1>
          <p className="text-[14px] sm:text-[15px] text-[var(--muted-foreground)] font-normal">
            {isBrandNewUser
              ? 'Analyze a repository or explore beginner issues to build your real track record.'
              : 'Keep building your verified contribution and learning path.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onTriggerAnalyze}
            className="px-3.5 py-2 text-[13px] font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-lg transition-colors shadow-xs"
          >
            Analyze Repository
          </button>
          <button
            onClick={onNavigateToExplore}
            className="px-3.5 py-2 text-[13px] font-semibold text-neutral-700 bg-white hover:bg-neutral-100 border border-[var(--border)] rounded-lg transition-colors"
          >
            Explore Projects
          </button>
        </div>
      </div>

      {/* Real Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Projects Exploring"
          value={profile.stats.projectsExploring}
          subtitle={profile.stats.projectsExploring > 0 ? 'Saved & analyzed' : 'No projects yet'}
          icon={<Compass className="w-4 h-4 text-blue-600" />}
          highlight={profile.stats.projectsExploring > 0}
        />
        <StatsCard
          label="Issues Contributed"
          value={profile.stats.issuesCompleted}
          subtitle={profile.stats.issuesCompleted > 0 ? 'Resolved or prepared' : 'None yet'}
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          highlight={profile.stats.issuesCompleted > 0}
        />
        <StatsCard
          label="Pull Requests Tracked"
          value={profile.stats.pullRequests}
          subtitle="Open & submitted"
          icon={<GitPullRequest className="w-4 h-4 text-purple-600" />}
        />
        <StatsCard
          label="Merged PRs"
          value={profile.stats.merged}
          subtitle="Community accepted"
          icon={<GitMerge className="w-4 h-4 text-emerald-600" />}
        />
      </div>

      {/* If Brand New User: Motivating Onboarding Card */}
      {isBrandNewUser && (
        <div className="p-8 bg-white border border-[var(--border)] rounded-2xl shadow-xs space-y-6">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[var(--primary)] bg-blue-50 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Getting Started</span>
            </div>
            <h2 className="text-[20px] font-bold text-[var(--foreground)]">
              Welcome to OpenSourcePath
            </h2>
            <p className="text-[14px] text-neutral-600 leading-relaxed font-normal">
              Unlike generic dashboards, your numbers above reflect real actions. Bookmark a repository, follow its generated roadmap, or inspect good first issues to start your path.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <button
              onClick={onNavigateToExplore}
              className="p-4 rounded-xl border border-[var(--border)] hover:border-blue-300 hover:bg-blue-50/40 text-left transition-all group"
            >
              <span className="text-[12px] font-mono text-[var(--primary)] font-medium">Step 1</span>
              <h3 className="text-[15px] font-semibold text-neutral-900 group-hover:text-blue-600 mt-1">
                Explore Projects →
              </h3>
              <p className="text-[12px] text-neutral-500 mt-1">Find repositories matching your preferred language.</p>
            </button>

            <button
              onClick={onTriggerAnalyze}
              className="p-4 rounded-xl border border-[var(--border)] hover:border-blue-300 hover:bg-blue-50/40 text-left transition-all group"
            >
              <span className="text-[12px] font-mono text-[var(--primary)] font-medium">Step 2</span>
              <h3 className="text-[15px] font-semibold text-neutral-900 group-hover:text-blue-600 mt-1">
                Analyze a Repo →
              </h3>
              <p className="text-[12px] text-neutral-500 mt-1">Paste any GitHub repo to generate an AI curriculum.</p>
            </button>

            <button
              onClick={onNavigateToRoadmap}
              className="p-4 rounded-xl border border-[var(--border)] hover:border-blue-300 hover:bg-blue-50/40 text-left transition-all group"
            >
              <span className="text-[12px] font-mono text-[var(--primary)] font-medium">Step 3</span>
              <h3 className="text-[15px] font-semibold text-neutral-900 group-hover:text-blue-600 mt-1">
                Learning Roadmap →
              </h3>
              <p className="text-[12px] text-neutral-500 mt-1">Master prerequisite concepts before opening PRs.</p>
            </button>
          </div>
        </div>
      )}

      {/* Main Content: Saved Repositories & Saved Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Saved Repositories Section */}
        <div className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-[var(--primary)]" />
              <h3 className="text-[17px] font-semibold text-[var(--foreground)]">
                Saved Repositories ({savedRepos.length})
              </h3>
            </div>
            <button
              onClick={onNavigateToExplore}
              className="text-[12px] text-blue-600 hover:underline font-medium"
            >
              Browse more
            </button>
          </div>

          {savedRepos.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-[var(--border)] rounded-xl bg-neutral-50/50">
              <p className="text-[14px] font-medium text-neutral-800">No saved repositories yet</p>
              <p className="text-[12px] text-neutral-500 mt-1 mb-4">
                Bookmark projects from Explore to track your learning journey here.
              </p>
              <button
                onClick={onNavigateToExplore}
                className="px-3.5 py-1.5 text-xs font-semibold text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-100"
              >
                Explore Projects
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {savedRepos.map((repo) => (
                <div
                  key={repo.id}
                  onClick={() => onSelectRepo(repo)}
                  className="p-3.5 border border-[var(--border)] hover:border-neutral-300 hover:bg-neutral-50 rounded-xl transition-colors cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <span className="text-[14px] font-semibold text-neutral-900 font-mono block truncate">
                      {repo.name}
                    </span>
                    <p className="text-[12px] text-neutral-500 line-clamp-1 mt-0.5">
                      {repo.description}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-400 shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Saved Issues Section */}
        <div className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h3 className="text-[17px] font-semibold text-[var(--foreground)]">
                Bookmarked Issues ({savedIssues.length})
              </h3>
            </div>
            <button
              onClick={() => setShowAddPrModal(true)}
              className="text-[12px] text-blue-600 hover:underline font-medium flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Track a PR</span>
            </button>
          </div>

          {savedIssues.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-[var(--border)] rounded-xl bg-neutral-50/50">
              <p className="text-[14px] font-medium text-neutral-800">No bookmarked issues</p>
              <p className="text-[12px] text-neutral-500 mt-1 mb-4">
                Bookmark beginner-friendly issues to keep track of tasks you want to solve.
              </p>
              <button
                onClick={onNavigateToExplore}
                className="px-3.5 py-1.5 text-xs font-semibold text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-100"
              >
                Find Good First Issues
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {savedIssues.map((issue) => (
                <div
                  key={issue.id}
                  onClick={() => onSelectIssue(issue)}
                  className="p-3.5 border border-[var(--border)] hover:border-neutral-300 hover:bg-neutral-50 rounded-xl transition-colors cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <span className="text-[12px] font-mono text-neutral-500">
                      {issue.repository} #{issue.issueNumber}
                    </span>
                    <h4 className="text-[14px] font-semibold text-neutral-900 line-clamp-1 mt-0.5">
                      {issue.title}
                    </h4>
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-400 shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Skills & GitHub Sync */}
      <div className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-[18px] font-semibold text-[var(--foreground)]">Your Skill Profile</h3>
            <p className="text-[14px] text-[var(--muted-foreground)] mt-0.5">
              Used by recommendationEngine to calculate transparent matching scores for repositories.
            </p>
          </div>

          {/* Sync with GitHub Public Handle */}
          <form onSubmit={handleSyncGithub} className="flex items-center gap-2 max-w-sm">
            <input
              type="text"
              value={githubInput}
              onChange={(e) => setGithubInput(e.target.value)}
              placeholder="GitHub username (e.g. torvalds)"
              className="px-3 py-1.5 text-[13px] border border-[var(--border)] rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              type="submit"
              disabled={isSyncingGithub}
              className="px-3 py-1.5 text-[12px] font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1 shrink-0"
            >
              {isSyncingGithub ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Github className="w-3.5 h-3.5" />}
              <span>Sync</span>
            </button>
          </form>
        </div>

        {syncFeedback && (
          <p className="text-[13px] text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg">
            {syncFeedback}
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {skillLevels.map((item) => (
            <div key={item.skill} className="p-3 bg-neutral-50 border border-[var(--border)] rounded-xl space-y-2">
              <span className="text-[13px] font-semibold font-mono text-neutral-800 block truncate">
                {item.skill}
              </span>
              <select
                value={item.proficiency}
                onChange={(e) => handleSkillProficiencyChange(item.skill, e.target.value as any)}
                className="w-full text-[11px] font-medium text-neutral-600 bg-white border border-neutral-200 rounded px-1.5 py-1 focus:outline-none"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Strong">Strong</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Track PR Modal */}
      {showAddPrModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[var(--border)] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-[18px] font-bold text-neutral-900">Track a Pull Request</h3>
            <p className="text-[13px] text-neutral-500">Record an open pull request you submitted to GitHub.</p>

            <form onSubmit={handleAddPR} className="space-y-3">
              <div>
                <label className="text-[12px] font-semibold text-neutral-700 block mb-1">PR Title</label>
                <input
                  type="text"
                  required
                  value={prTitle}
                  onChange={(e) => setPrTitle(e.target.value)}
                  placeholder="e.g. Fix button loading accessibility"
                  className="w-full px-3 py-2 text-[13px] border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="text-[12px] font-semibold text-neutral-700 block mb-1">Repository (owner/repo)</label>
                <input
                  type="text"
                  required
                  value={prRepo}
                  onChange={(e) => setPrRepo(e.target.value)}
                  placeholder="e.g. facebook/react"
                  className="w-full px-3 py-2 text-[13px] border border-neutral-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="text-[12px] font-semibold text-neutral-700 block mb-1">GitHub PR Link (Optional)</label>
                <input
                  type="url"
                  value={prUrl}
                  onChange={(e) => setPrUrl(e.target.value)}
                  placeholder="https://github.com/owner/repo/pull/123"
                  className="w-full px-3 py-2 text-[13px] border border-neutral-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddPrModal(false)}
                  className="px-4 py-2 text-[13px] font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-[13px] font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-lg shadow-xs"
                >
                  Save PR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
