import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import PriorityBadge from '../common/PriorityBadge';
import TicketCard from './TicketCard';
import EmptyState from '../common/EmptyState';
import { formatShortDate } from '../../utils/formatDate';
import { ChevronRight, ArrowUpDown, User, UserCheck } from 'lucide-react';

export const TicketList = ({
  tickets = [],
  loading = false,
  detailBaseUrl,
  emptyMessage = 'No tickets match your filters.',
  onCreateNew,
  onAssign,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="w-8 h-8 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500">Loading tickets...</p>
        </div>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <EmptyState
        title="No Tickets Found"
        description={emptyMessage}
        actionText={onCreateNew ? 'Create New Ticket' : null}
        onAction={onCreateNew}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile & Tablet Card Layout (< 1024px) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 lg:hidden">
        {tickets.map((ticket) => (
          <div key={ticket._id} className="space-y-1.5">
            <TicketCard
              ticket={ticket}
              detailBaseUrl={detailBaseUrl}
            />
            {onAssign && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => onAssign(ticket)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{ticket.assignedAgent ? 'Reassign Agent' : 'Assign Agent'}</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop Responsive Table (>= 1024px) */}
      <div className="hidden lg:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Ticket ID</th>
                <th className="py-3.5 px-4 min-w-[220px]">Subject</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Assigned Agent</th>
                <th className="py-3.5 px-4">Created Date</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {tickets.map((ticket) => (
                <tr
                  key={ticket._id}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => {
                    window.location.href = `${detailBaseUrl}/${ticket.ticketId || ticket._id}`;
                  }}
                >
                  <td className="py-3.5 px-4 font-mono font-semibold text-xs text-indigo-600">
                    {ticket.ticketId}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {ticket.subject}
                    </span>
                    <span className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                      {ticket.description}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs font-medium text-slate-600">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full inline-block">
                      {ticket.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <PriorityBadge priority={ticket.priority} size="sm" />
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={ticket.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600">
                    {ticket.assignedAgent?.name ? (
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                          {ticket.assignedAgent.name.charAt(0)}
                        </div>
                        <span className="truncate max-w-[120px] font-medium text-slate-700">
                          {ticket.assignedAgent.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                    {formatShortDate(ticket.createdAt)}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    {onAssign && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAssign(ticket);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2.5 py-1.5 rounded-lg transition-colors mr-2"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>{ticket.assignedAgent ? 'Reassign' : 'Assign'}</span>
                      </button>
                    )}
                    <Link
                      to={`${detailBaseUrl}/${ticket.ticketId || ticket._id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                      <span>View</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TicketList;
