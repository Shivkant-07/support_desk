import React from 'react';
import { getPriorityStyle } from '../../utils/formatDate';
import { AlertTriangle, AlertCircle, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

export const PriorityBadge = ({ priority, showIcon = true, size = 'md' }) => {
  const style = getPriorityStyle(priority);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-0.5',
    lg: 'text-sm px-3 py-1',
  };

  const renderIcon = () => {
    if (!showIcon) return null;
    switch (priority) {
      case 'Critical':
        return <AlertTriangle className="w-3.5 h-3.5 text-red-600 animate-pulse" />;
      case 'High':
        return <AlertCircle className="w-3.5 h-3.5 text-orange-500" />;
      case 'Medium':
        return <ArrowUpCircle className="w-3.5 h-3.5 text-sky-500" />;
      case 'Low':
        return <ArrowDownCircle className="w-3.5 h-3.5 text-slate-400" />;
      default:
        return null;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full border ${style.bg} ${sizeClasses[size] || sizeClasses.md}`}
    >
      {renderIcon()}
      <span>{priority || 'Medium'}</span>
    </span>
  );
};

export default PriorityBadge;
