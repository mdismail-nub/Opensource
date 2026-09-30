import React, { useState, useEffect } from 'react';
import { Repository, RepositoryAnalysis } from '../../types';
import { githubService, parseGitHubUrl } from '../../services/githubService';
import { aiService } from '../../services/aiService';
import { storageService } from '../../services/storageService';
import { recommendationEngine } from '../../services/recommendationEngine';
import { GitBranch, CheckCircle2, Loader2, ArrowRight, X, AlertCircle, Sparkles, BookOpen } from 'lucide-react';

interface AnalyzeRepoModalProps {
  urlInput: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectRepo: (repo: Repository) => void;
}

export const AnalyzeRepoModal: React.FC<AnalyzeRepoModalProps> = ({
  urlInput,
  isOpen,
  onClose,
  onSelectRepo,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [analyzedRepo, setAnalyzedRepo] = useState<Repository | null>(null);
  const [analysisResult, setAnalysisResult] = useState<RepositoryAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const steps = [
    'Connecting to GitHub API & fetching repository...',
    'Inspecting project tree, dependencies & README...',
    'Gemini AI analyzing codebase architecture...',
    'Synthesizing your personalized learning roadmap...',
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      setAnalyzedRepo(null);
      setAnalysisResult(null);
      setIsLoading(false);
      setErrorMessage(null);
      return;
    }

    const runAnalysis = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      setCurrentStepIndex(0);

      const parsed = parseGitHubUrl(urlInput);
      if (!parsed) {
        setIsLoading(false);
        setErrorMessage(
          'Please enter a valid GitHub repository URL or format like "owner/repo" (e.g., "facebook/react" or "shadcn/ui").'
        );
        return;
      }

      try {
        // Step 1: Fetch Repository
        setCurrentStepIndex(0);
        const repo = await githubService.fetchRepository(parsed.owner, parsed.repo);

        // Step 2: Fetch manifest file if present
        setCurrentStepIndex(1);
        let manifestContent = '';
        if (repo.fileTree && repo.fileTree.length > 0) {
          const manifestFile = repo.fileTree.find(
            (p) =>
              p === 'package.json' ||
              p === 'Cargo.toml' ||
              p === 'pyproject.toml' ||
              p === 'go.mod' ||
              p === 'requirements.txt'
          );
          if (manifestFile) {
            try {
              const fileData = await githubService.fetchFileContent(parsed.owner, parsed.repo, manifestFile);
              manifestContent = fileData.content;
            } catch (e) {
              // Non-fatal
            }
          }
        }

        // Step 3: Run Gemini AI Analysis
        setCurrentStepIndex(2);
        const aiAnalysis = await aiService.analyzeRepository(repo, manifestContent);
        setAnalysisResult(aiAnalysis);

        // Step 4: Calculate personalized compatibility and roadmap
        setCurrentStepIndex(3);
        const userSkills = storageService.getUserSkillLevels();
        const compat = recommendationEngine.calculateRepoCompatibility(repo, userSkills);

        const enrichedRepo: Repository = {
          ...repo,
          skillMatch: compat.score,
          difficulty: aiAnalysis.difficulty || repo.difficulty,
          architectureNotes: aiAnalysis.architecture.length > 0 ? aiAnalysis.architecture : repo.architectureNotes,
          prerequisites: aiAnalysis.learningRequirements.length > 0 ? aiAnalysis.learningRequirements : repo.prerequisites,
          roadmap: aiAnalysis.generatedRoadmap && aiAnalysis.generatedRoadmap.length > 0 ? aiAnalysis.generatedRoadmap : repo.roadmap,
        };

        setAnalyzedRepo(enrichedRepo);
        storageService.addRecentlyAnalyzed({
          owner: enrichedRepo.owner,
          repo: enrichedRepo.repoName,
          stars: enrichedRepo.starsFormatted,
          primaryLanguage: enrichedRepo.primaryLanguage,
        });

        setIsLoading(false);
      } catch (err: any) {
        setIsLoading(false);
        console.error('Analysis error:', err);
        setErrorMessage(
          err.message || 'Unable to retrieve repository from GitHub. Please check repository name and try again.'
        );
      }
    };

    runAnalysis();
  }, [isOpen, urlInput]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 bg-neutral-50/50">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-blue-600" />
            <span className="font-mono text-sm font-semibold text-neutral-900 truncate max-w-xs">
              {analyzedRepo ? analyzedRepo.name : urlInput || 'Repository Analysis'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 rounded-md hover:bg-neutral-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {errorMessage ? (
            <div className="space-y-4 py-2">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 space-y-1">
                  <p className="font-semibold text-sm">Analysis Note</p>
                  <p className="leading-relaxed">{errorMessage}</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : isLoading ? (
            <div className="space-y-5 py-4">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                <span className="text-sm font-medium text-neutral-800">
                  {steps[currentStepIndex]}
                </span>
              </div>

              <div className="space-y-2.5">
                {steps.map((s, idx) => {
                  const isDone = currentStepIndex > idx;
                  const isCurrent = currentStepIndex === idx;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-2.5 text-xs font-mono transition-opacity ${
                        isDone
                          ? 'text-neutral-700'
                          : isCurrent
                          ? 'text-blue-600 font-semibold'
                          : 'text-neutral-400 opacity-60'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : isCurrent ? (
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-neutral-300 shrink-0" />
                      )}
                      <span>{s}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : analyzedRepo ? (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    AI Repository Analysis Complete
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded font-mono">
                    {analyzedRepo.skillMatch}% Match
                  </span>
                </div>
                <h3 className="text-base font-bold text-neutral-900">{analyzedRepo.name}</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {analysisResult?.summary || analyzedRepo.description}
                </p>
              </div>

              {/* Technologies identified */}
              {analysisResult?.frameworks && analysisResult.frameworks.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                    Key Frameworks & Technologies
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.frameworks.map((fw) => (
                      <span
                        key={fw}
                        className="px-2 py-0.5 text-xs font-mono bg-neutral-100 border border-neutral-200 text-neutral-700 rounded"
                      >
                        {fw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Path preview */}
              <div>
                <p className="text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                  Generated 5-Step Learning Roadmap
                </p>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono text-neutral-700">
                  <span className="px-2 py-1 bg-neutral-100 rounded border border-neutral-200 whitespace-nowrap">
                    01 Core
                  </span>
                  <span className="text-neutral-400">→</span>
                  <span className="px-2 py-1 bg-neutral-100 rounded border border-neutral-200 whitespace-nowrap">
                    02 Framework
                  </span>
                  <span className="text-neutral-400">→</span>
                  <span className="px-2 py-1 bg-neutral-100 rounded border border-neutral-200 whitespace-nowrap">
                    03 Architecture
                  </span>
                  <span className="text-neutral-400">→</span>
                  <span className="px-2 py-1 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 font-semibold whitespace-nowrap">
                    05 PR Ready
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => {
                    onSelectRepo(analyzedRepo);
                    onClose();
                  }}
                  className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>Explore Repository Overview</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
