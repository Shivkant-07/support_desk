import React from 'react';

export const DonutChart = ({ data = [], title }) => {
  const total = data.reduce((sum, item) => sum + (item.count || 0), 0);

  // Colors mapping for common statuses/priorities
  const getColor = (name, index) => {
    switch (name) {
      case 'Open':
        return '#3b82f6'; // blue
      case 'Assigned':
        return '#8b5cf6'; // purple
      case 'In Progress':
        return '#f59e0b'; // amber
      case 'Resolved':
        return '#10b981'; // emerald
      case 'Closed':
        return '#64748b'; // slate
      case 'Reopened':
        return '#f43f5e'; // rose
      case 'Critical':
        return '#ef4444'; // red
      case 'High':
        return '#f97316'; // orange
      case 'Medium':
        return '#0284c7'; // sky
      case 'Low':
        return '#94a3b8'; // slate
      default:
        const palette = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
        return palette[index % palette.length];
    }
  };

  if (!data || data.length === 0 || total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-xs text-slate-400">
        No distribution data yet
      </div>
    );
  }

  // Calculate SVG stroke dashes for donut
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  let accumulatedAngle = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
      {/* SVG Donut */}
      <div className="relative w-36 h-36 flex-shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth="12"
          />
          {data.map((item, index) => {
            const count = item.count || 0;
            const strokeDasharray = `${(count / total) * circumference} ${circumference}`;
            const strokeDashoffset = -accumulatedAngle;
            accumulatedAngle += (count / total) * circumference;

            return (
              <circle
                key={index}
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke={getColor(item.label || item.status || item.priority, index)}
                strokeWidth="12"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            );
          })}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xl font-bold text-slate-800 leading-none">{total}</span>
          <span className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">Total</span>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 text-xs w-full max-w-[200px]">
        {data.map((item, index) => {
          const count = item.count || 0;
          const percentage = Math.round((count / total) * 100);
          const label = item.label || item.status || item.priority;

          return (
            <div key={index} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 truncate">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: getColor(label, index) }}
                />
                <span className="text-slate-600 truncate">{label}</span>
              </div>
              <div className="flex items-center gap-1 font-semibold text-slate-800 flex-shrink-0">
                <span>{count}</span>
                <span className="text-[10px] font-normal text-slate-400">({percentage}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DonutChart;
