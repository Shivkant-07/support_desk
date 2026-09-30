import React from 'react';
import { Search, RotateCcw, Filter } from 'lucide-react';

export const TicketFilters = ({
  filters,
  categories = [],
  onChange,
  onReset,
  showAgentFilter = false,
  agents = [],
}) => {
  const handleInputChange = (field, value) => {
    onChange({ ...filters, [field]: value });
  };

  const hasActiveFilters =
    Boolean(filters.search) ||
    (filters.category && filters.category !== 'all') ||
    (filters.agentId && filters.agentId !== 'all');

  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3 mb-6">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tickets by ID, subject, or keywords..."
            value={filters.search || ''}
            onChange={(e) => handleInputChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
          />
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:flex gap-2 sm:gap-3 flex-wrap">
          {/* Category Filter */}
          <select
            value={filters.category || 'all'}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 col-span-2 sm:col-span-1"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id || cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Optional Admin Agent Filter */}
          {showAgentFilter && (
            <select
              value={filters.agentId || 'all'}
              onChange={(e) => handleInputChange('agentId', e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 col-span-2 sm:col-span-1"
            >
              <option value="all">All Agents</option>
              <option value="unassigned">Unassigned</option>
              {agents.map((agent) => (
                <option key={agent._id} value={agent._id}>
                  {agent.name}
                </option>
              ))}
            </select>
          )}

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketFilters;
