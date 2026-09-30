import React, { useState, useEffect } from 'react';
import { Repository } from '../../types';
import { SkillMatchBadge } from '../common/SkillMatchBadge';
import { storageService } from '../../services/storageService';
import { Star, Users, ArrowRight, Bookmark } from 'lucide-react';

interface RepositoryCardProps {
  repository: Repository;
  onViewProject: (repo: Repository) => void;
  onFindIssues: (repo: Repository) => void;
}

export const RepositoryCard: React.FC<RepositoryCardProps> = ({
  repository,
  onViewProject,
  onFindIssues,
}) => {
  const [isSaved, setIsSaved] = useState(() => storageService.isRepoSaved(repository.id));

  useEffect(() => {
    setIsSaved(storageService.isRepoSaved(repository.id));
  }, [repository.id]);

  const handleToggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = storageService.toggleSaveRepo(repository);
    setIsSaved(updated);
  };

  return (
    <div className="group relative bg-white border border-[var(--border)] hover:border-neutral-300 rounded-xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onViewProject(repository)}
                className="text-[16px] font-semibold text-[var(--foreground)] hover:text-[var(--primary)] transition-colors text-left flex items-center gap-1.5 truncate group/title"
              >
                <span className="truncate">{repository.name}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover/title:opacity-100 group-hover/title:translate-x-0 transition-all text-[var(--primary)] shrink-0" />
              </button>
              <button
                onClick={handleToggleSave}
                title={isSaved ? 'Remove from saved' : 'Save repository'}
                aria-label={isSaved ? 'Remove from saved' : 'Save repository'}
                className={`p-1 rounded hover:bg-neutral-100 transition-colors ${
                  isSaved ? 'text-blue-600' : 'text-neutral-400 hover:text-neutral-600'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-blue-600' : ''}`} />
              </button>
            </div>
            <p className="text-[12px] text-[var(--muted-foreground)] mt-0.5">
              Updated {repository.lastUpdated}
            </p>
          </div>
          <SkillMatchBadge score={repository.skillMatch} size="sm" />
        </div>

        {/* Description */}
        <p className="text-[14px] text-neutral-600 line-clamp-2 mb-4 leading-relaxed font-normal">
          {repository.description}
        </p>

        {/* Technologies & Languages */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          {repository.languages.slice(0, 3).map((lang) => (
            <span
              key={lang.name}
              className="inline-flex items-center gap-1 text-[12px] text-neutral-700 bg-neutral-100/90 px-2 py-0.5 rounded font-mono"
            >
              <span
                className="w-2 h-2 rounded-full inline-block shrink-0"
                style={{ backgroundColor: lang.color || '#2563eb' }}
              />
              {lang.name}
            </span>
          ))}
          {repository.topics.slice(0, 2).map((topic) => (
            <span
              key={topic}
              className="text-[12px] text-neutral-500 bg-neutral-50 border border-[var(--border)] px-1.5 py-0.5 rounded"
            >
              #{topic}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Info & Actions */}
      <div className="pt-3.5 border-t border-[var(--border)]">
        <div className="flex items-center justify-between text-[12px] text-[var(--muted-foreground)] mb-3.5">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-mono tabular-nums" title={`${repository.stars.toLocaleString()} Stars`}>
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
              {repository.starsFormatted}
            </span>
            <span className="flex items-center gap-1 font-mono tabular-nums" title={`${repository.contributorsCount} Contributors`}>
              <Users className="w-3.5 h-3.5 text-neutral-400" />
              {repository.contributorsCount}+
            </span>
          </div>

          <span className="text-[var(--success)] font-medium bg-[var(--success-subtle)] border border-[var(--success-border)] px-2 py-0.5 rounded text-[11px]">
            {repository.beginnerIssuesCount} beginner issues
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onViewProject(repository)}
            className="w-full py-2 px-3 text-[13px] font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors text-center"
          >
            View Project
          </button>
          <button
            onClick={() => onFindIssues(repository)}
            className="w-full py-2 px-3 text-[13px] font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-lg transition-colors text-center shadow-xs"
          >
            Find Issues
          </button>
        </div>
      </div>
    </div>
  );
};
