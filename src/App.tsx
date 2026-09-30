/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ViewType, Repository, Issue, UserProfile } from './types';
import { repositoryService } from './services/repositoryService';
import { profileService } from './services/profileService';
import { storageService } from './services/storageService';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { ExploreProjectsPage } from './components/explore/ExploreProjectsPage';
import { RepositoryOverviewPage } from './components/repo/RepositoryOverviewPage';
import { RoadmapView } from './components/roadmap/RoadmapView';
import { GoodFirstIssuesPage } from './components/issues/GoodFirstIssuesPage';
import { IssueDetailPage } from './components/issues/IssueDetailPage';
import { UserDashboardPage } from './components/dashboard/UserDashboardPage';
import { HowItWorksPage } from './components/howitworks/HowItWorksPage';
import { AnalyzeRepoModal } from './components/modals/AnalyzeRepoModal';
import { GitHubTokenModal } from './components/modals/GitHubTokenModal';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('landing');
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(() => {
    const saved = storageService.getSavedRepos();
    return saved.length > 0 ? saved[0] : null;
  });
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(() => {
    const saved = storageService.getSavedIssues();
    return saved.length > 0 ? saved[0] : null;
  });
  const [isSignedIn, setIsSignedIn] = useState(true);
  const [analyzeModalOpen, setAnalyzeModalOpen] = useState(false);
  const [analyzeUrl, setAnalyzeUrl] = useState('');
  const [tokenModalOpen, setTokenModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile>(() =>
    profileService.getUserProfile(selectedRepo || undefined)
  );

  // Update profile whenever selectedRepo or storage changes
  useEffect(() => {
    setCurrentUser(profileService.getUserProfile(selectedRepo || undefined));
  }, [selectedRepo]);

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleNavigate = (view: ViewType) => {
    setCurrentView(view);
  };

  const handleSelectRepo = (repo: Repository) => {
    setSelectedRepo(repo);
    storageService.setActiveRepoId(repo.id);
    setCurrentView('repo-detail');
  };

  const handleSelectIssue = (issue: Issue) => {
    setSelectedIssue(issue);
    setCurrentView('issue-detail');
  };

  const handleFindIssuesForRepo = (repo: Repository) => {
    setSelectedRepo(repo);
    setCurrentView('repo-detail');
  };

  const handleTriggerAnalyze = (url: string) => {
    setAnalyzeUrl(url);
    setAnalyzeModalOpen(true);
  };

  const handleToggleSignIn = () => {
    setIsSignedIn((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] selection:bg-blue-100 selection:text-blue-900 font-sans antialiased">
      {/* Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        isSignedIn={isSignedIn}
        onToggleSignIn={handleToggleSignIn}
        onOpenTokenModal={() => setTokenModalOpen(true)}
        onOpenSearch={() => setCurrentView('explore')}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onNavigate={handleNavigate}
            onSelectRepo={handleSelectRepo}
            onSelectIssue={handleSelectIssue}
            onTriggerAnalyze={handleTriggerAnalyze}
          />
        )}

        {currentView === 'explore' && (
          <ExploreProjectsPage
            onSelectRepo={handleSelectRepo}
            onFindIssuesForRepo={handleFindIssuesForRepo}
          />
        )}

        {currentView === 'repo-detail' && (
          selectedRepo ? (
            <RepositoryOverviewPage
              repository={selectedRepo}
              onBack={() => setCurrentView('explore')}
              onSelectIssue={handleSelectIssue}
              onNavigateToIssues={() => setCurrentView('issues')}
              onSelectRepo={setSelectedRepo}
            />
          ) : (
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
              <p className="text-neutral-600 mb-4">No repository currently selected.</p>
              <button
                onClick={() => setCurrentView('explore')}
                className="px-4 py-2 text-sm font-semibold text-white bg-[var(--primary)] rounded-lg"
              >
                Explore Projects
              </button>
            </div>
          )
        )}

        {currentView === 'roadmap' && (
          <div className="py-6">
            <RoadmapView
              repository={selectedRepo || undefined}
              onExploreIssues={() => setCurrentView('issues')}
              onSelectRepo={(r) => setSelectedRepo(r)}
              onTriggerAnalyze={() => handleTriggerAnalyze('facebook/react')}
            />
          </div>
        )}

        {currentView === 'issues' && (
          <GoodFirstIssuesPage
            onSelectIssue={handleSelectIssue}
            onPrepareIssue={handleSelectIssue}
          />
        )}

        {currentView === 'issue-detail' && (
          selectedIssue ? (
            <IssueDetailPage
              issue={selectedIssue}
              onBack={() => setCurrentView('issues')}
              onViewProject={async (repoName) => {
                const [owner, repo] = repoName.split('/');
                if (owner && repo) {
                  try {
                    const loaded = await repositoryService.getRepository(owner, repo);
                    setSelectedRepo(loaded);
                    setCurrentView('repo-detail');
                    return;
                  } catch (e) {
                    // Fall through
                  }
                }
                setCurrentView('explore');
              }}
            />
          ) : (
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
              <p className="text-neutral-600 mb-4">No issue selected.</p>
              <button
                onClick={() => setCurrentView('issues')}
                className="px-4 py-2 text-sm font-semibold text-white bg-[var(--primary)] rounded-lg"
              >
                Browse Good First Issues
              </button>
            </div>
          )
        )}

        {currentView === 'dashboard' && (
          <UserDashboardPage
            user={currentUser}
            onNavigateToRoadmap={() => setCurrentView('roadmap')}
            onSelectIssue={handleSelectIssue}
            onSelectRepo={handleSelectRepo}
            onNavigateToExplore={() => setCurrentView('explore')}
            onTriggerAnalyze={() => handleTriggerAnalyze('facebook/react')}
          />
        )}

        {currentView === 'how-it-works' && (
          <HowItWorksPage onNavigate={handleNavigate} />
        )}
      </main>

      {/* Interactive Analyze Repo Pipeline Modal */}
      <AnalyzeRepoModal
        urlInput={analyzeUrl}
        isOpen={analyzeModalOpen}
        onClose={() => setAnalyzeModalOpen(false)}
        onSelectRepo={(repo) => {
          setSelectedRepo(repo);
          setCurrentView('repo-detail');
        }}
      />

      {/* Optional GitHub Token Modal */}
      <GitHubTokenModal
        isOpen={tokenModalOpen}
        onClose={() => setTokenModalOpen(false)}
      />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
