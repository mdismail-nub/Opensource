import React, { useState, useEffect } from 'react';
import { RoadmapStep, Repository } from '../../types';
import { roadmapService } from '../../services/roadmapService';
import { storageService } from '../../services/storageService';
import { EmptyState } from '../common/EmptyState';
import { LoadingState } from '../common/LoadingState';
import {
  CheckCircle2,
  CircleDot,
  Lock,
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Sparkles,
  GitBranch,
  Clock,
  Layers,
  RefreshCw,
  FileCode,
} from 'lucide-react';

interface RoadmapViewProps {
  repository?: Repository;
  onExploreIssues?: () => void;
  onSelectRepo?: (repo: Repository) => void;
  onTriggerAnalyze?: () => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  repository,
  onExploreIssues,
  onSelectRepo,
  onTriggerAnalyze,
}) => {
  const [steps, setSteps] = useState<RoadmapStep[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedStep, setExpandedStep] = useState<string>('01');

  useEffect(() => {
    if (!repository) {
      setSteps([]);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    roadmapService
      .getRoadmapForRepository(repository)
      .then((generatedSteps) => {
        if (isMounted) {
          setSteps(generatedSteps);
          // Auto-expand the first in-progress or next step
          const active = generatedSteps.find((s) => s.status === 'in_progress' || s.status === 'next');
          if (active) setExpandedStep(active.stepNumber);
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message || 'Failed to generate roadmap');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [repository?.id, repository?.name]);

  const handleToggleTopic = (stepNumber: string, topicId: string) => {
    if (!repository) return;
    roadmapService.toggleTopic(repository.id, stepNumber, topicId);

    setSteps((prev) =>
      prev.map((step) => {
        if (step.stepNumber !== stepNumber) return step;
        const newChecklist = step.checklist.map((item) =>
          item.id === topicId ? { ...item, completed: !item.completed } : item
        );
        const completedCount = newChecklist.filter((c) => c.completed).length;
        const newProgress = Math.round((completedCount / newChecklist.length) * 100);

        let newStatus = step.status;
        if (newProgress === 100) newStatus = 'completed';
        else if (newProgress > 0) newStatus = 'in_progress';

        return {
          ...step,
          checklist: newChecklist,
          progress: newProgress,
          status: newStatus,
        };
      })
    );
  };

  const totalTopics = steps.reduce((acc, s) => acc + s.checklist.length, 0);
  const completedTopics = steps.reduce(
    (acc, s) => acc + s.checklist.filter((c) => c.completed).length,
    0
  );
  const overallPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  if (!repository) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <EmptyState
          icon={<GitBranch className="w-8 h-8 text-[var(--primary)]" />}
          title="No roadmap generated yet"
          description="Analyze a GitHub repository or select a project from Explore to generate your personalized learning curriculum."
          actionText="Analyze Repository"
          onAction={onTriggerAnalyze}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Container */}
      <div className="bg-white border border-[var(--border)] rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-mono text-[var(--primary)] bg-blue-50 px-2 py-0.5 rounded font-medium">
                {repository.name}
              </span>
              <span className="text-[12px] text-neutral-400 font-mono">
                {repository.primaryLanguage}
              </span>
            </div>
            <h1 className="text-[26px] sm:text-[32px] font-bold text-[var(--foreground)] tracking-tight">
              Learning Roadmap
            </h1>
            <p className="text-[14px] sm:text-[15px] text-neutral-600 font-normal">
              Structured preparation tailored to this repository's architecture and conventions.
            </p>
          </div>

          {/* Overall Progress Gauge */}
          <div className="flex items-center gap-3 bg-neutral-50 border border-[var(--border)] rounded-xl p-3.5 sm:self-center shrink-0">
            <div className="text-right">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 block">
                Roadmap Progress
              </span>
              <span className="text-[20px] font-bold font-mono text-[var(--foreground)] tabular-nums">
                {overallPercentage}%
              </span>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-blue-100 flex items-center justify-center font-bold text-xs font-mono text-[var(--primary)] relative">
              <span className="tabular-nums">{completedTopics}/{totalTopics}</span>
            </div>
          </div>
        </div>

        {/* Linear progress bar */}
        <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--primary)] transition-all duration-300"
            style={{ width: `${overallPercentage}%` }}
          />
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="bg-white border border-[var(--border)] rounded-2xl p-8 space-y-4 text-center">
          <RefreshCw className="w-6 h-6 animate-spin text-[var(--primary)] mx-auto" />
          <p className="text-[15px] font-semibold text-neutral-900">Synthesizing learning roadmap with Gemini AI...</p>
          <p className="text-[13px] text-neutral-500 max-w-md mx-auto">
            Extracting core framework conventions, package dependencies, and testing prerequisites for {repository.name}.
          </p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between text-[14px] text-red-800">
          <span>{error}</span>
          <button
            onClick={() => {
              setLoading(true);
              setError(null);
              roadmapService.getRoadmapForRepository(repository).then(setSteps).catch((e) => setError(e.message)).finally(() => setLoading(false));
            }}
            className="px-3 py-1 bg-white border border-red-300 rounded-lg text-xs font-semibold hover:bg-red-50"
          >
            Retry
          </button>
        </div>
      ) : (
        /* Vertical Roadmap Timeline */
        <div className="space-y-4">
          {steps.map((step, idx) => {
            const isExpanded = expandedStep === step.stepNumber;
            const isCompleted = step.status === 'completed';
            const isInProgress = step.status === 'in_progress';
            const isNext = step.status === 'next';

            return (
              <div
                key={step.stepNumber}
                className={`bg-white border rounded-xl transition-all duration-200 overflow-hidden shadow-xs ${
                  isInProgress
                    ? 'border-blue-400 ring-2 ring-blue-500/10'
                    : isCompleted
                    ? 'border-[var(--success-border)]'
                    : 'border-[var(--border)]'
                }`}
              >
                {/* Step Header Accordion Toggle */}
                <button
                  onClick={() => setExpandedStep(isExpanded ? '' : step.stepNumber)}
                  className="w-full p-5 text-left flex items-start sm:items-center justify-between gap-4 hover:bg-neutral-50/50 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    {/* Status Icon */}
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : isInProgress
                          ? 'bg-blue-100 text-blue-800'
                          : isNext
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-neutral-100 text-neutral-500'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : isInProgress ? (
                        <CircleDot className="w-4 h-4 text-blue-600 animate-pulse" />
                      ) : (
                        <span>{step.stepNumber}</span>
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-mono text-neutral-400">Step {step.stepNumber}</span>
                        {step.difficulty && (
                          <span className="text-[11px] font-mono px-1.5 py-0.2 bg-neutral-100 text-neutral-600 rounded">
                            {step.difficulty}
                          </span>
                        )}
                      </div>
                      <h3 className="text-[16px] font-semibold text-[var(--foreground)]">
                        {step.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[12px] font-mono text-neutral-500 hidden sm:inline tabular-nums">
                      {step.progress}%
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-neutral-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-400" />
                    )}
                  </div>
                </button>

                {/* Expanded Details & Checklist */}
                {isExpanded && (
                  <div className="px-5 pb-6 pt-2 border-t border-neutral-100 space-y-5 bg-neutral-50/30">
                    {/* Why it matters */}
                    {step.whyItMatters && (
                      <div className="p-3 bg-blue-50/70 border border-blue-200/60 rounded-lg text-[13px] text-blue-900 leading-relaxed font-normal">
                        <strong>Why it matters:</strong> {step.whyItMatters}
                      </div>
                    )}

                    <p className="text-[14px] text-neutral-600 font-normal leading-relaxed">
                      {step.summary}
                    </p>

                    {/* Topics badges */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 block">
                        Concepts Covered
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {step.topics.map((topic) => (
                          <span
                            key={topic}
                            className="text-[12px] font-mono text-neutral-700 bg-white border border-[var(--border)] px-2 py-0.5 rounded shadow-2xs"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Related repository files */}
                    {step.relatedFiles && step.relatedFiles.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 block">
                          Related Codebase Files
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {step.relatedFiles.map((file) => (
                            <span
                              key={file}
                              className="inline-flex items-center gap-1 text-[12px] font-mono text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded"
                            >
                              <FileCode className="w-3.5 h-3.5 text-neutral-400" />
                              {file}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Interactive Checklist Items */}
                    <div className="space-y-2 pt-2 border-t border-neutral-200/60">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 block">
                        Learning Checklist ({step.checklist.filter((c) => c.completed).length}/{step.checklist.length})
                      </span>
                      <div className="space-y-1.5">
                        {step.checklist.map((item) => (
                          <label
                            key={item.id}
                            className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer select-none ${
                              item.completed
                                ? 'bg-emerald-50/50 border-emerald-200/80 text-emerald-900'
                                : 'bg-white border-[var(--border)] hover:bg-neutral-50 text-neutral-800'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={item.completed}
                              onChange={() => handleToggleTopic(step.stepNumber, item.id)}
                              className="w-4 h-4 text-emerald-600 rounded border-neutral-300 focus:ring-emerald-500 mt-0.5 shrink-0"
                            />
                            <div className="flex-1 text-[13px] leading-snug">
                              <span className={item.completed ? 'line-through text-neutral-500' : 'font-medium'}>
                                {item.name}
                              </span>
                              {item.resourceTitle && (
                                <span className="block text-[11px] text-neutral-400 font-mono mt-0.5">
                                  Ref: {item.resourceTitle}
                                </span>
                              )}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Explore Issues Next CTA */}
      {onExploreIssues && (
        <div className="flex justify-between items-center bg-white border border-[var(--border)] rounded-xl p-5 shadow-xs">
          <div>
            <h4 className="text-[15px] font-semibold text-neutral-900">Ready to put your learning into practice?</h4>
            <p className="text-[13px] text-neutral-500">Inspect beginner-friendly issues scoped for this repository.</p>
          </div>
          <button
            onClick={onExploreIssues}
            className="px-4 py-2 text-[13px] font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-lg transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
          >
            <span>Explore Issues</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
