import React, { useState, useEffect } from 'react';
import { ViewType, Repository, Issue } from '../../types';
import { repositoryService } from '../../services/repositoryService';
import { issueService } from '../../services/issueService';
import { RepositoryCard } from '../cards/RepositoryCard';
import { IssueCard } from '../cards/IssueCard';
import { LoadingState } from '../common/LoadingState';
import {
  GitBranch,
  ArrowRight,
  Star,
  Users,
  CheckCircle2,
  Sparkles,
  Terminal,
  Compass,
  Map,
  Code2,
  Search,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: ViewType) => void;
  onSelectRepo: (repo: Repository) => void;
  onSelectIssue: (issue: Issue) => void;
  onTriggerAnalyze: (url: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onSelectRepo,
  onSelectIssue,
  onTriggerAnalyze,
}) => {
  const [repoUrlInput, setRepoUrlInput] = useState('');
  const [featuredRepos, setFeaturedRepos] = useState<Repository[]>([]);
  const [featuredIssues, setFeaturedIssues] = useState<Issue[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Load real featured projects and live beginner issues
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [repos, issuesResult] = await Promise.allSettled([
          repositoryService.getFeaturedRepositories(),
          issueService.searchGoodFirstIssues({ labelFilter: 'good first issue' }),
        ]);

        if (isMounted) {
          if (repos.status === 'fulfilled' && repos.value.length > 0) {
            setFeaturedRepos(repos.value.slice(0, 3));
          }
          if (issuesResult.status === 'fulfilled' && issuesResult.value.items.length > 0) {
            setFeaturedIssues(issuesResult.value.items.slice(0, 3));
          }
        }
      } catch (e) {
        console.warn('Failed to load live landing data:', e);
      } finally {
        if (isMounted) setLoadingData(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAnalyzeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTriggerAnalyze(repoUrlInput.trim() || 'facebook/react');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-12 pb-18 md:pt-20 md:pb-26 overflow-hidden border-b border-[var(--border)] bg-gradient-to-b from-white via-neutral-50/50 to-neutral-100/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headline, Description & Search CTA */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200/80 rounded-full text-[12px] font-medium text-blue-700">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                <span>Open Source Contribution Engine</span>
              </div>

              <h1 className="text-[34px] sm:text-[46px] lg:text-[54px] font-extrabold tracking-tight text-[var(--foreground)] leading-[1.12]">
                Your path into open source starts here.
              </h1>

              <p className="text-[16px] sm:text-[18px] text-[var(--muted-foreground)] max-w-2xl font-normal leading-relaxed">
                Discover projects that match your skills, learn what you need to contribute, and find issues you can actually work on.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('explore')}
                  className="px-6 py-3 text-[14px] font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-lg shadow-sm hover:shadow transition-all active:scale-[0.98] flex items-center gap-2"
                >
                  <span>Explore Projects</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="px-6 py-3 text-[14px] font-semibold text-neutral-700 bg-white hover:bg-neutral-100 border border-[var(--border)] rounded-lg transition-all"
                >
                  How It Works
                </button>
              </div>

              {/* GitHub Repository Quick Search Input */}
              <div className="pt-4 max-w-xl">
                <form
                  onSubmit={handleAnalyzeSubmit}
                  className="flex items-center gap-2 p-1.5 bg-white border border-neutral-300 rounded-xl shadow-xs focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all"
                >
                  <div className="flex items-center pl-3 text-neutral-400">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={repoUrlInput}
                    onChange={(e) => setRepoUrlInput(e.target.value)}
                    placeholder="Paste a GitHub repository URL... (e.g. facebook/react)"
                    className="flex-1 px-2 py-1.5 text-[13px] sm:text-[14px] bg-transparent border-none text-[var(--foreground)] placeholder:text-neutral-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 text-[13px] font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-lg transition-colors whitespace-nowrap shadow-xs"
                  >
                    Analyze
                  </button>
                </form>
                <p className="text-[12px] text-neutral-500 mt-2 pl-1">
                  Try analyzing popular repositories like{' '}
                  <button
                    type="button"
                    onClick={() => onTriggerAnalyze('facebook/react')}
                    className="text-neutral-700 font-mono bg-neutral-100 px-1 py-0.5 rounded hover:bg-neutral-200 transition-colors"
                  >
                    facebook/react
                  </button>{' '}
                  or{' '}
                  <button
                    type="button"
                    onClick={() => onTriggerAnalyze('vercel/next.js')}
                    className="text-neutral-700 font-mono bg-neutral-100 px-1 py-0.5 rounded hover:bg-neutral-200 transition-colors"
                  >
                    vercel/next.js
                  </button>
                </p>
              </div>
            </div>

            {/* Right Column: Polished Dashboard Preview Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                <div className="bg-white border border-[var(--border)] rounded-2xl shadow-xl p-6 space-y-5">
                  {/* Top Bar with Repo Name & Stats */}
                  <div className="border-b border-neutral-100 pb-4">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-neutral-900 text-white flex items-center justify-center text-[11px] font-mono">
                          fb
                        </div>
                        <span className="font-mono text-[14px] font-bold text-neutral-900">
                          facebook/react
                        </span>
                      </div>
                      <span className="text-[11px] font-mono font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        94% Match
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[12px] text-neutral-500 font-mono mt-2">
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                        <span className="tabular-nums">235k stars</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-neutral-400" />
                        <span className="tabular-nums">1,800+ contributors</span>
                      </span>
                    </div>

                    {/* Tech Badges */}
                    <div className="flex items-center gap-1.5 mt-3">
                      <span className="text-[11px] font-mono text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded">
                        React
                      </span>
                      <span className="text-[11px] font-mono text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded">
                        JavaScript
                      </span>
                      <span className="text-[11px] font-mono text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded">
                        TypeScript
                      </span>
                    </div>
                  </div>

                  {/* Your Contribution Path Card */}
                  <div className="bg-neutral-50/80 border border-neutral-200/70 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="font-semibold uppercase tracking-wider text-neutral-700">
                        Your contribution path
                      </span>
                      <span className="text-blue-600 font-medium font-mono text-[11px]">Step 2 of 5</span>
                    </div>

                    {/* Progression timeline */}
                    <div className="space-y-1 font-mono text-[12px]">
                      <div className="flex items-center gap-2 p-1.5 rounded bg-emerald-50/80 text-emerald-800 border border-emerald-200/60">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-semibold">JavaScript</span>
                        <span className="text-[11px] text-emerald-600 ml-auto">Mastered</span>
                      </div>

                      <div className="text-center text-neutral-300 py-0.5 leading-none">↓</div>

                      <div className="flex items-center gap-2 p-1.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin shrink-0" />
                        <span className="font-semibold">React</span>
                        <span className="text-[11px] text-blue-700 font-mono ml-auto">68% In Progress</span>
                      </div>

                      <div className="text-center text-neutral-300 py-0.5 leading-none">↓</div>

                      <div className="flex items-center gap-2 p-1.5 rounded bg-white text-neutral-600 border border-neutral-200/80">
                        <div className="w-3.5 h-3.5 rounded-full border border-neutral-300 shrink-0" />
                        <span>TypeScript</span>
                        <span className="text-[11px] text-neutral-400 ml-auto">Next</span>
                      </div>

                      <div className="text-center text-neutral-300 py-0.5 leading-none">↓</div>

                      <div className="flex items-center gap-2 p-1.5 rounded bg-white text-neutral-400 border border-neutral-200/60">
                        <div className="w-3.5 h-3.5 rounded-full border border-neutral-200 shrink-0" />
                        <span>Testing</span>
                        <span className="text-[11px] text-neutral-400 ml-auto">Locked</span>
                      </div>

                      <div className="text-center text-neutral-300 py-0.5 leading-none">↓</div>

                      <div className="flex items-center gap-2 p-1.5 rounded bg-neutral-900 text-white font-semibold shadow-xs">
                        <GitBranch className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>Open your first PR</span>
                        <ArrowRight className="w-3 h-3 ml-auto text-blue-300" />
                      </div>
                    </div>
                  </div>

                  {/* Quick Action */}
                  <button
                    onClick={() => onTriggerAnalyze('facebook/react')}
                    className="w-full py-2.5 text-[13px] font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Analyze react & View Roadmap</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Curated Projects Section */}
      <section className="py-16 md:py-20 bg-white border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="text-[12px] font-semibold text-[var(--primary)] uppercase tracking-wider mb-1">
                Curated Repositories
              </div>
              <h2 className="text-[22px] sm:text-[30px] font-bold text-[var(--foreground)] tracking-tight">
                Projects welcoming contributors today
              </h2>
              <p className="text-[14px] text-[var(--muted-foreground)] mt-1 max-w-xl">
                Real-world GitHub codebases with active maintainers, clear documentation, and beginner opportunities.
              </p>
            </div>
            <button
              onClick={() => onNavigate('explore')}
              className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)] self-start md:self-end"
            >
              <span>View all repositories</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {loadingData ? (
            <LoadingState count={3} type="grid" />
          ) : featuredRepos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRepos.map((repo) => (
                <RepositoryCard
                  key={repo.id}
                  repository={repo}
                  onViewProject={onSelectRepo}
                  onFindIssues={(r) => {
                    onSelectRepo(r);
                    onNavigate('repo-detail');
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-neutral-50 rounded-xl border border-[var(--border)]">
              <p className="text-[14px] text-neutral-600">Explore hundreds of open source projects on the Explore page.</p>
              <button
                onClick={() => onNavigate('explore')}
                className="mt-3 px-4 py-2 text-[13px] font-semibold text-white bg-[var(--primary)] rounded-lg"
              >
                Go to Explore
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 3 Core Pillars */}
      <section className="py-16 md:py-20 bg-neutral-50/70 border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-[24px] sm:text-[32px] font-bold text-[var(--foreground)] tracking-tight">
              A structured bridge from tutorial to pull request
            </h2>
            <p className="text-[15px] text-neutral-600 mt-3 font-normal">
              Open source is intimidating without context. We remove the guesswork by giving you the exact prerequisites before you open a code editor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-[var(--border)] shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-[var(--primary)] flex items-center justify-center font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-[18px] font-semibold text-[var(--foreground)]">1. Skill Matching</h3>
              <p className="text-[14px] text-neutral-600 leading-relaxed font-normal">
                Connect your GitHub profile or select your skills. We analyze repositories and calculate transparent skill compatibility.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[var(--border)] shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Map className="w-5 h-5" />
              </div>
              <h3 className="text-[18px] font-semibold text-[var(--foreground)]">2. Learning Roadmaps</h3>
              <p className="text-[14px] text-neutral-600 leading-relaxed font-normal">
                Every repository generates a prerequisite roadmap using Gemini AI. Master architecture and core concepts before writing code.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[var(--border)] shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-[18px] font-semibold text-[var(--foreground)]">3. Guided Issues</h3>
              <p className="text-[14px] text-neutral-600 leading-relaxed font-normal">
                We inspect real issues, extract relevant files, highlight what you already know, and generate a pre-flight preparation checklist.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Good First Issues Teaser */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="text-[12px] font-semibold text-[var(--primary)] uppercase tracking-wider mb-1">
                Ready For Contribution
              </div>
              <h2 className="text-[22px] sm:text-[30px] font-bold text-[var(--foreground)] tracking-tight">
                Recommended beginner-friendly issues
              </h2>
              <p className="text-[14px] text-[var(--muted-foreground)] mt-1 max-w-xl">
                Real open GitHub issues with active discussion, clear scope, and welcoming maintainers.
              </p>
            </div>
            <button
              onClick={() => onNavigate('issues')}
              className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)] self-start md:self-end"
            >
              <span>Browse all issues</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {loadingData ? (
            <LoadingState count={3} type="grid" />
          ) : featuredIssues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredIssues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  onViewIssue={onSelectIssue}
                  onPrepareToContribute={onSelectIssue}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-neutral-50 rounded-xl border border-[var(--border)]">
              <p className="text-[14px] text-neutral-600">Find real beginner-friendly issues on the Issues page.</p>
              <button
                onClick={() => onNavigate('issues')}
                className="mt-3 px-4 py-2 text-[13px] font-semibold text-white bg-[var(--primary)] rounded-lg"
              >
                Browse Issues
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
