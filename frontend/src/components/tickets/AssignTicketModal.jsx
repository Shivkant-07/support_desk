import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import agentService from '../../services/agentService';
import PriorityBadge from '../common/PriorityBadge';
import StatusBadge from '../common/StatusBadge';
import { UserCheck, Headphones } from 'lucide-react';

export const AssignTicketModal = ({
  isOpen,
  onClose,
  ticket,
  onAssign,
  submitting = false,
}) => {
  const [agents, setAgents] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAgents();
      setSelectedAgentId(ticket?.assignedAgent?._id || '');
    }
  }, [isOpen, ticket]);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const data = await agentService.getAgents({ status: 'active' });
      setAgents(data.agents || []);
    } catch (err) {
      console.error('Error fetching agents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!selectedAgentId) return;
    onAssign(selectedAgentId);
  };

  if (!ticket) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign Ticket to Agent">
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {/* Ticket Summary Box */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              {ticket.ticketId}
            </span>
            <div className="flex items-center gap-1.5">
              <PriorityBadge priority={ticket.priority} size="sm" />
              <StatusBadge status={ticket.status} size="sm" />
            </div>
          </div>
          <p className="font-semibold text-slate-800 line-clamp-1">{ticket.subject}</p>
          <div className="text-slate-500 text-xs flex items-center justify-between pt-1 border-t border-slate-200">
            <span>Category: {ticket.category}</span>
            <span>
              Current Agent:{' '}
              <strong className="text-slate-700">
                {ticket.assignedAgent ? ticket.assignedAgent.name : 'None'}
              </strong>
            </span>
          </div>
        </div>

        {/* Select Agent */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Select Support Agent
          </label>
          {loading ? (
            <div className="py-4 text-center text-xs text-slate-400">Loading active agents...</div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {agents.map((agent) => {
                const isSelected = selectedAgentId === agent._id;
                const workload = agent.workload || { total: 0, inProgress: 0 };

                return (
                  <div
                    key={agent._id}
                    onClick={() => setSelectedAgentId(agent._id)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-600'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {agent.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 leading-tight">
                          {agent.name}
                        </p>
                        <p className="text-xs text-slate-500">{agent.department || 'Support'}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                        {workload.inProgress} active tickets
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || !selectedAgentId || selectedAgentId === ticket.assignedAgent?._id}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
          >
            {submitting ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <UserCheck className="w-4 h-4" />
            )}
            <span>Assign Ticket</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AssignTicketModal;
