// Format date cleanly e.g. "Oct 12, 2026, 04:30 PM"
export const formatDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);
};

// Format short date e.g. "Oct 12, 2026"
export const formatShortDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

// Format relative time e.g. "10 mins ago"
export const timeAgo = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '—';

  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 30) return 'Just now';
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  return formatShortDate(dateString);
};

// Status styling mapping
export const getStatusStyle = (status) => {
  switch (status) {
    case 'Open':
      return {
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-500',
        badge: 'bg-blue-100 text-blue-800',
      };
    case 'Assigned':
      return {
        bg: 'bg-purple-50 text-purple-700 border-purple-200',
        dot: 'bg-purple-500',
        badge: 'bg-purple-100 text-purple-800',
      };
    case 'In Progress':
      return {
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
        badge: 'bg-amber-100 text-amber-800',
      };
    case 'Resolved':
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
        badge: 'bg-emerald-100 text-emerald-800',
      };
    case 'Closed':
      return {
        bg: 'bg-slate-100 text-slate-700 border-slate-200',
        dot: 'bg-slate-400',
        badge: 'bg-slate-200 text-slate-700',
      };
    case 'Reopened':
      return {
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'bg-rose-500',
        badge: 'bg-rose-100 text-rose-800',
      };
    default:
      return {
        bg: 'bg-gray-50 text-gray-700 border-gray-200',
        dot: 'bg-gray-400',
        badge: 'bg-gray-100 text-gray-800',
      };
  }
};

// Priority styling mapping
export const getPriorityStyle = (priority) => {
  switch (priority) {
    case 'Critical':
      return {
        bg: 'bg-red-50 text-red-700 border-red-200',
        dot: 'bg-red-600',
        badge: 'bg-red-100 text-red-800 font-semibold',
      };
    case 'High':
      return {
        bg: 'bg-orange-50 text-orange-700 border-orange-200',
        dot: 'bg-orange-500',
        badge: 'bg-orange-100 text-orange-800',
      };
    case 'Medium':
      return {
        bg: 'bg-sky-50 text-sky-700 border-sky-200',
        dot: 'bg-sky-500',
        badge: 'bg-sky-100 text-sky-800',
      };
    case 'Low':
      return {
        bg: 'bg-slate-50 text-slate-600 border-slate-200',
        dot: 'bg-slate-400',
        badge: 'bg-slate-100 text-slate-700',
      };
    default:
      return {
        bg: 'bg-gray-50 text-gray-700 border-gray-200',
        dot: 'bg-gray-400',
        badge: 'bg-gray-100 text-gray-800',
      };
  }
};
