import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import PriorityBadge from '../common/PriorityBadge';
import { timeAgo } from '../../utils/formatDate';
import { ChevronRight, User, Tag } from 'lucide-react';

export const TicketCard = ({ ticket, detailBaseUrl }) => {
  return (
    <Link
      to={`${detailBaseUrl}/${ticket.ticketId || ticket._id}`}
      className="block bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
            {ticket.ticketId}
          </span>
          <span className="text-xs text-slate-400">&bull; {timeAgo(ticket.createdAt)}</span>
        </div>
        <StatusBadge status={ticket.status} size="sm" />
      </div>

      <h4 className="font-semibold text-slate-900 text-sm line-clamp-2 group-hover:text-indigo-600 transition-colors mb-2">
        {ticket.subject}
      </h4>

      <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
        {ticket.description}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-600">
        <div className="flex items-center gap-2 flex-wrap">
          <PriorityBadge priority={ticket.priority} size="sm" />
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            <Tag className="w-3 h-3 text-slate-400" /> {ticket.category}
          </span>
        </div>

        <div className="flex items-center gap-1 font-medium text-slate-700">
          <User className="w-3.5 h-3.5 text-slate-400" />
          <span className="truncate max-w-[90px]">
            {ticket.assignedAgent?.name || 'Unassigned'}
          </span>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </Link>
  );
};

export default TicketCard;
