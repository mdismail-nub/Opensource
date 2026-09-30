import React from 'react';

interface LoadingStateProps {
  count?: number;
  type?: 'card' | 'grid' | 'row' | 'roadmap';
}

export const LoadingState: React.FC<LoadingStateProps> = ({ count = 3, type = 'card' }) => {
  if (type === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full animate-pulse">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="p-5 bg-white border border-[var(--border)] rounded-xl space-y-4 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="h-5 w-36 bg-neutral-200 rounded" />
              <div className="h-5 w-14 bg-neutral-100 rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-3.5 w-full bg-neutral-100 rounded" />
              <div className="h-3.5 w-4/5 bg-neutral-100 rounded" />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <div className="h-4 w-16 bg-neutral-100 rounded" />
              <div className="h-4 w-16 bg-neutral-100 rounded" />
            </div>
            <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
              <div className="h-4 w-20 bg-neutral-100 rounded" />
              <div className="h-7 w-24 bg-neutral-100 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-5 bg-white border border-[var(--border)] rounded-xl space-y-3 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <div className="h-5 w-44 bg-neutral-200 rounded" />
            <div className="h-5 w-16 bg-neutral-100 rounded" />
          </div>
          <div className="h-4 w-full max-w-md bg-neutral-100 rounded" />
          <div className="flex items-center gap-3 pt-2">
            <div className="h-4 w-14 bg-neutral-100 rounded" />
            <div className="h-4 w-16 bg-neutral-100 rounded" />
            <div className="h-4 w-24 bg-neutral-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};
