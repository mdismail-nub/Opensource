import React, { useState } from 'react';
import { Check, Circle, Info, Sparkles } from 'lucide-react';

interface SkillMatchBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
  matches?: string[];
  needsImprovement?: string[];
  showDetailsOnClick?: boolean;
}

export const SkillMatchBadge: React.FC<SkillMatchBadgeProps> = ({
  score,
  size = 'md',
  showLabel = true,
  className = '',
  matches = ['React', 'JavaScript', 'TypeScript'],
  needsImprovement = ['Testing', 'Internal Architecture'],
  showDetailsOnClick = true,
}) => {
  const [showPopover, setShowPopover] = useState(false);

  const getLabel = (val: number) => {
    if (val >= 85) return 'Strong match';
    if (val >= 70) return 'Moderate match';
    return 'Challenging match';
  };

  const getColor = (val: number) => {
    if (val >= 85) return 'text-emerald-700 bg-emerald-50 border-emerald-200/80 hover:bg-emerald-100/60';
    if (val >= 70) return 'text-blue-700 bg-blue-50 border-blue-200/80 hover:bg-blue-100/60';
    return 'text-amber-700 bg-amber-50 border-amber-200/80 hover:bg-amber-100/60';
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={(e) => {
          if (showDetailsOnClick) {
            e.stopPropagation();
            setShowPopover(!showPopover);
          }
        }}
        className={`inline-flex items-center gap-1.5 font-medium rounded-md border transition-colors cursor-pointer text-left ${getColor(
          score
        )} ${sizeClasses[size]} ${className}`}
        title="Click to view transparent compatibility factors"
      >
        <span className="font-mono tabular-nums font-semibold tracking-tight">{score}%</span>
        {showLabel && <span className="text-neutral-500 font-normal">Match</span>}
        <Info className="w-3 h-3 opacity-60 ml-0.5" />
      </button>

      {/* Popover explaining transparent compatibility factors */}
      {showPopover && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-full mt-1.5 z-50 w-72 p-3.5 bg-white rounded-xl shadow-xl border border-neutral-200 text-neutral-800 text-xs space-y-2.5 animate-in fade-in slide-in-from-top-1"
        >
          <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
            <span className="font-bold text-neutral-900 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Estimated Compatibility
            </span>
            <span className="font-mono font-bold text-emerald-700">{score}%</span>
          </div>

          <div>
            <span className="font-semibold text-neutral-800 block mb-1">
              Rating: <span className="text-blue-600 font-normal">{getLabel(score)}</span>
            </span>
            <p className="text-2xs text-neutral-500 leading-tight">
              Calculated by comparing your public GitHub profile skills with the repository's detected stack and issue prerequisites.
            </p>
          </div>

          <div className="space-y-1 pt-1 border-t border-neutral-100">
            <span className="font-semibold text-neutral-700 block">Matches:</span>
            <ul className="space-y-0.5 text-neutral-600 font-mono text-2xs">
              {matches.map((m) => (
                <li key={m} className="flex items-center gap-1 text-emerald-700">
                  <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-1 pt-1 border-t border-neutral-100">
            <span className="font-semibold text-neutral-700 block">Needs improvement:</span>
            <ul className="space-y-0.5 text-neutral-500 font-mono text-2xs">
              {needsImprovement.map((n) => (
                <li key={n} className="flex items-center gap-1 text-neutral-500">
                  <Circle className="w-2.5 h-2.5 text-amber-500 shrink-0" />
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2 border-t border-neutral-100 flex justify-end">
            <button
              type="button"
              onClick={() => setShowPopover(false)}
              className="text-2xs text-blue-600 hover:underline font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
