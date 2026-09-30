import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ticketService from '../../services/ticketService';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import AssignTicketModal from '../../components/tickets/AssignTicketModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { formatDate, timeAgo } from '../../utils/formatDate';
import {
  ArrowLeft,
  UserCheck,
  Trash2,
  Mail,
  Building,
  AlertCircle,
  Headphones,
} from 'lucide-react';

export const AdminTicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  // Assign Modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignSubmitting, setAssignSubmitting] = useState(false);

  // Delete Dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchTicketData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await ticketService.getTicketById(id);
      setTicket(res.ticket);
    } catch (err) {
      console.error('Error fetching ticket:', err);
      setFeedback({ type: 'error', message: err.message || 'Ticket not found' });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTicketData();
  }, [fetchTicketData]);

  const handleStatusChange = async (newStatus) => {
    if (newStatus === ticket.status) return;
    try {
      const res = await ticketService.updateTicket(ticket._id, { status: newStatus });
      setTicket(res.ticket);
      fetchTicketData();
      setFeedback({ type: 'success', message: `Status updated to ${newStatus}` });
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handlePriorityChange = async (newPriority) => {
    if (newPriority === ticket.priority) return;
    try {
      const res = await ticketService.updateTicket(ticket._id, { priority: newPriority });
      setTicket(res.ticket);
      fetchTicketData();
      setFeedback({ type: 'success', message: `Priority updated to ${newPriority}` });
    } catch (err) {
      alert(err.message || 'Failed to update priority');
    }
  };

  const handleAssignSubmit = async (agentId) => {
    try {
      setAssignSubmitting(true);
      const res = await ticketService.assignTicket(ticket._id, agentId);
      setTicket(res.ticket);
      setAssignModalOpen(false);
      fetchTicketData();
      setFeedback({ type: 'success', message: res.message });
    } catch (err) {
      alert(err.message || 'Failed to assign ticket');
    } finally {
      setAssignSubmitting(false);
    }
  };

  const handleDeleteTicket = async () => {
    try {
      setDeleteLoading(true);
      await ticketService.deleteTicket(ticket._id);
      navigate('/admin/tickets', { replace: true });
    } catch (err) {
      alert(err.message || 'Failed to delete ticket');
      setDeleteLoading(false);
    }
  };



  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-8 h-8 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-500">Loading ticket controls...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-800">Ticket Not Found</h2>
        <Link
          to="/admin/tickets"
          className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold"
        >
          Return to All Tickets
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/tickets')}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-100">
                {ticket.ticketId}
              </span>
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 line-clamp-1">
              {ticket.subject}
            </h1>
          </div>
        </div>

        {/* Admin Action Bar */}
        <div className="flex items-center gap-2 flex-wrap bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
          {/* Assign / Reassign Button */}
          <button
            onClick={() => setAssignModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-200 transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{ticket.assignedAgent ? 'Reassign Agent' : 'Assign Agent'}</span>
          </button>

          {/* Status Changer */}
          <select
            value={ticket.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none"
          >
            <option value="Open">Status: Open</option>
            <option value="Assigned">Status: Assigned</option>
            <option value="In Progress">Status: In Progress</option>
            <option value="Resolved">Status: Resolved</option>
            <option value="Closed">Status: Closed</option>
            <option value="Reopened">Status: Reopened</option>
          </select>

          {/* Priority Changer */}
          <select
            value={ticket.priority}
            onChange={(e) => handlePriorityChange(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none"
          >
            <option value="Low">Priority: Low</option>
            <option value="Medium">Priority: Medium</option>
            <option value="High">Priority: High</option>
            <option value="Critical">Priority: Critical</option>
          </select>

          {/* Delete Ticket Button */}
          <button
            onClick={() => setDeleteDialogOpen(true)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete Ticket"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-sm flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{feedback.message}</span>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs font-semibold underline ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Problem Description
            </h3>
            <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
              {ticket.description}
            </p>

          </div>

        </div>

        {/* Right Column (1 Col) - Parties & Audit Log */}
        <div className="space-y-6">
          {/* Parties Involved Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <h3 className="font-semibold text-slate-900 text-sm pb-2 border-b border-slate-100">
              Stakeholders & Classification
            </h3>

            {/* Requester */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Submitted By
              </p>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                  {ticket.createdBy?.name?.charAt(0) || 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-900 truncate">
                    {ticket.createdBy?.name}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">{ticket.createdBy?.email}</p>
                </div>
              </div>
            </div>

            {/* Assigned Agent */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Assigned Agent
                </p>
                <button
                  onClick={() => setAssignModalOpen(true)}
                  className="text-[11px] font-semibold text-indigo-600 hover:underline"
                >
                  Change
                </button>
              </div>

              {ticket.assignedAgent ? (
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
                    {ticket.assignedAgent.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {ticket.assignedAgent.name}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {ticket.assignedAgent.department || 'Technical Support'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                  <span className="italic">No agent assigned</span>
                  <button
                    onClick={() => setAssignModalOpen(true)}
                    className="text-xs font-semibold text-indigo-600"
                  >
                    Assign Now
                  </button>
                </div>
              )}
            </div>

            {/* Category and Timestamps */}
            <div className="space-y-2 text-xs pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Category</span>
                <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-medium">
                  {ticket.category}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Created</span>
                <span className="text-slate-700">{formatDate(ticket.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Last Active</span>
                <span className="text-slate-700">{timeAgo(ticket.updatedAt)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Assign Ticket Modal */}
      <AssignTicketModal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        ticket={ticket}
        onAssign={handleAssignSubmit}
        submitting={assignSubmitting}
      />

      {/* Delete Ticket Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteTicket}
        title={`Delete Ticket ${ticket.ticketId}?`}
        message="This will permanently delete this ticket along with all attached comments and audit activity logs. This action cannot be reversed."
        confirmText="Delete Ticket"
        danger={true}
        loading={deleteLoading}
      />
    </div>
  );
};

export default AdminTicketDetails;
