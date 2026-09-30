import React from 'react';
import { DifficultyLevel } from '../../types';

interface DifficultyBadgeProps {
  difficulty: DifficultyLevel;
  className?: string;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty, className = '' }) => {
  const getStyles = (level: DifficultyLevel) => {
    switch (level) {
      case 'Beginner':
        return 'text-emerald-700 bg-emerald-50/70 border-emerald-200';
      case 'Intermediate':
        return 'text-sky-700 bg-sky-50/70 border-sky-200';
      case 'Advanced':
        return 'text-purple-700 bg-purple-50/70 border-purple-200';
      default:
        return 'text-neutral-600 bg-neutral-100 border-neutral-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded border ${getStyles(
        difficulty
      )} ${className}`}
    >
      {difficulty}
    </span>
  );
};
