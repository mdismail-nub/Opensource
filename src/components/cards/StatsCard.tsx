import React from 'react';

interface StatsCardProps {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
  trend?: string;
  subtitle?: string;
  highlight?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  icon,
  trend,
  subtitle,
  highlight = false,
}) => {
  return (
    <div
      className={`p-5 rounded-xl border transition-all ${
        highlight
          ? 'bg-blue-50/40 border-blue-200'
          : 'bg-white border-neutral-200/90 shadow-xs'
      }`}
    >
      <div className="flex items-center justify-between text-neutral-500 mb-2">
        <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
          {label}
        </span>
        {icon && <div className="text-neutral-400">{icon}</div>}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-neutral-900 font-mono tabular-nums tracking-tight">
          {value}
        </span>
        {trend && (
          <span className="text-xs font-medium text-emerald-600 font-mono">
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-neutral-500 mt-1.5">{subtitle}</p>
      )}
    </div>
  );
};
