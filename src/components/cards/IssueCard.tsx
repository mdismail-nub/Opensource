import React, { useState, useEffect } from 'react';
import { Issue } from '../../types';
import { SkillMatchBadge } from '../common/SkillMatchBadge';
import { DifficultyBadge } from '../common/DifficultyBadge';
import { storageService } from '../../services/storageService';
import {
  MessageSquare,
  ArrowRight,
  ExternalLink,
  Bookmark,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

interface IssueCardProps {
  issue: Issue;
  onViewIssue: (issue: Issue) => void;
  onPrepareToContribute: (issue: Issue) => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({
  issue,
  onViewIssue,
  onPrepareToContribute,
}) => {
  const [isSaved, setIsSaved] = useState(() => storageService.isIssueSaved(issue.id));
  const [isCompleted, setIsCompleted] = useState(() => storageService.isIssueCompleted(issue.id));

  useEffect(() => {
    setIsSaved(storageService.isIssueSaved(issue.id));
    setIsCompleted(storageService.isIssueCompleted(issue.id));
  }, [issue.id]);

  const handleToggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = storageService.toggleSaveIssue(issue);
    setIsSaved(updated);
  };

  const handleToggleCompleted = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = storageService.toggleIssueCompleted(issue.id);
    setIsCompleted(updated);
  };

  return (
    <div
      className={`group relative bg-white border rounded-xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between ${
        isCompleted
          ? 'border-[var(--success-border)] bg-[var(--success-subtle)]/30'
          : 'border-[var(--border)] hover:border-neutral-300'
      }`}
    >
      <div>
        {/* Header: Repository & Number & Save action */}
        <div className="flex items-center justify-between gap-2 mb-2 text-[12px] font-mono">
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-[var(--primary)] font-medium truncate">
              {issue.repository}
            </span>
            <span className="text-neutral-400">·</span>
            <span className="text-neutral-500 tabular-nums">#{issue.issueNumber}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleToggleCompleted}
              title={isCompleted ? 'Mark as incomplete' : 'Mark as contributed/completed'}
              aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as contributed'}
              className={`p-1 rounded hover:bg-neutral-100 transition-colors ${
                isCompleted ? 'text-[var(--success)]' : 'text-neutral-300 hover:text-neutral-500'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'fill-emerald-100' : ''}`} />
            </button>
            <button
              onClick={handleToggleSave}
              title={isSaved ? 'Remove bookmark' : 'Bookmark issue'}
              aria-label={isSaved ? 'Remove bookmark' : 'Bookmark issue'}
              className={`p-1 rounded hover:bg-neutral-100 transition-colors ${
                isSaved ? 'text-blue-600' : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-blue-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title */}
        <button
          onClick={() => onViewIssue(issue)}
          className="text-left w-full group/title mb-2.5"
        >
          <h3 className="text-[16px] font-semibold text-[var(--foreground)] group-hover/title:text-[var(--primary)] transition-colors leading-snug line-clamp-2">
            {issue.title}
          </h3>
        </button>

        {/* Labels & Difficulty Badge */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
          <DifficultyBadge difficulty={issue.difficulty} />
          {issue.labels.slice(0, 2).map((label) => (
            <span
              key={label}
              className="text-[11px] font-mono text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200/60"
            >
              {label}
            </span>
          ))}
          {issue.labels.length > 2 && (
            <span className="text-[11px] text-neutral-400 font-mono">
              +{issue.labels.length - 2}
            </span>
          )}
        </div>

        {/* Description Preview */}
        <p className="text-[14px] text-neutral-600 line-clamp-2 mb-4 leading-relaxed font-normal">
          {issue.descriptionPreview}
        </p>

        {/* What You'll Need Box */}
        <div className="bg-neutral-50 border border-[var(--border)] rounded-lg p-2.5 mb-4 space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 block">
            What you'll need
          </span>
          <div className="flex flex-wrap gap-1">
            {issue.whatYoullNeed.slice(0, 3).map((item) => (
              <span
                key={item}
                className="text-[12px] text-neutral-700 bg-white border border-neutral-200/80 px-2 py-0.5 rounded font-mono"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Info & CTA */}
      <div className="pt-3 border-t border-[var(--border)]">
        <div className="flex items-center justify-between text-[12px] text-[var(--muted-foreground)] mb-3">
          <div className="flex items-center gap-2">
            <SkillMatchBadge score={issue.skillMatch} size="sm" />
            <span className="text-neutral-300">|</span>
            <span className="flex items-center gap-1 tabular-nums font-mono text-xs text-neutral-500">
              <MessageSquare className="w-3 h-3 text-neutral-400" />
              {issue.commentsCount}
            </span>
          </div>

          <span className="text-[11px] text-neutral-400 flex items-center gap-1 font-mono">
            <Clock className="w-3 h-3" />
            {issue.createdAt}
          </span>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {issue.htmlUrl ? (
            <a
              href={issue.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 text-[12px] font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center justify-center gap-1 text-center"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 text-neutral-500" />
            </a>
          ) : (
            <button
              onClick={() => onViewIssue(issue)}
              className="w-full py-2 px-3 text-[12px] font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors text-center"
            >
              View Details
            </button>
          )}

          <button
            onClick={() => onPrepareToContribute(issue)}
            className="w-full py-2 px-3 text-[12px] font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-lg transition-colors flex items-center justify-center gap-1 text-center shadow-xs"
          >
            <span>Prepare</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
