import React from 'react';
import { getStatusStyle } from '../../utils/formatDate';

export const StatusBadge = ({ status, size = 'md' }) => {
  const style = getStatusStyle(status);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${style.bg} ${sizeClasses[size] || sizeClasses.md}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {status || 'Unknown'}
    </span>
  );
};

export default StatusBadge;
