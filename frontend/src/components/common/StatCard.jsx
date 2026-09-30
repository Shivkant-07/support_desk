import React from 'react';

const colorThemes = {
  indigo: {
    bg: 'bg-indigo-50 text-indigo-600',
    border: 'border-indigo-100 hover:border-indigo-200',
    bar: 'bg-indigo-500',
  },
  blue: {
    bg: 'bg-blue-50 text-blue-600',
    border: 'border-blue-100 hover:border-blue-200',
    bar: 'bg-blue-500',
  },
  amber: {
    bg: 'bg-amber-50 text-amber-600',
    border: 'border-amber-100 hover:border-amber-200',
    bar: 'bg-amber-500',
  },
  emerald: {
    bg: 'bg-emerald-50 text-emerald-600',
    border: 'border-emerald-100 hover:border-emerald-200',
    bar: 'bg-emerald-500',
  },
  rose: {
    bg: 'bg-rose-50 text-rose-600',
    border: 'border-rose-100 hover:border-rose-200',
    bar: 'bg-rose-500',
  },
  slate: {
    bg: 'bg-slate-100 text-slate-700',
    border: 'border-slate-200 hover:border-slate-300',
    bar: 'bg-slate-500',
  },
};

export const StatCard = ({
  title,
  count,
  icon: Icon,
  color = 'indigo',
  subtitle,
  onClick,
}) => {
  const theme = colorThemes[color] || colorThemes.indigo;

  return (
    <div
      onClick={onClick}
      className={`relative bg-white rounded-xl p-5 border shadow-sm transition-all duration-200 overflow-hidden ${
        theme.border
      } ${onClick ? 'cursor-pointer hover:shadow-md' : ''}`}
    >
      <div className={`absolute top-0 left-0 right-0 h-1 ${theme.bar}`} />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
            {count ?? 0}
          </h3>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${theme.bg}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
