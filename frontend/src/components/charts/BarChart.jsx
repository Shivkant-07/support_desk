import React from 'react';

export const BarChart = ({
  data = [],
  dataKey = 'count',
  labelKey = 'label',
  color = 'indigo',
}) => {
  const max = Math.max(...data.map((d) => d[dataKey] || 0), 1);

  const colorMap = {
    indigo: 'bg-indigo-600',
    blue: 'bg-blue-600',
    emerald: 'bg-emerald-600',
    purple: 'bg-purple-600',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
  };

  const barColor = colorMap[color] || 'bg-indigo-600';

  if (!data || data.length === 0) {
    return <div className="text-center py-6 text-xs text-slate-400">No chart data available</div>;
  }

  return (
    <div className="space-y-3">
      {data.map((item, index) => {
        const val = item[dataKey] || 0;
        const percentage = Math.round((val / max) * 100);

        return (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between text-xs font-medium text-slate-700">
              <span className="truncate max-w-[180px]">{item[labelKey]}</span>
              <span className="font-semibold text-slate-900">{val}</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BarChart;
