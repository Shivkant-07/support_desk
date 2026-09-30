import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import ticketService from '../../services/ticketService';
import categoryService from '../../services/categoryService';
import agentService from '../../services/agentService';
import TicketFilters from '../../components/tickets/TicketFilters';
import TicketList from '../../components/tickets/TicketList';
import AssignTicketModal from '../../components/tickets/AssignTicketModal';
import { UserCheck } from 'lucide-react';

export const AdminTickets = () => {
  const [searchParams] = useSearchParams();

  const [tickets, setTickets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    agentId: 'all',
  });

  // Assign Modal state
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [assignSubmitting, setAssignSubmitting] = useState(false);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ticketService.getTickets(filters);
      setTickets(data.tickets || []);
    } catch (err) {
      console.error('Error fetching admin tickets:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    Promise.all([categoryService.getCategories(true), agentService.getAgents()]).then(
      ([catRes, agentRes]) => {
        setCategories(catRes.categories || []);
        setAgents(agentRes.agents || []);
      }
    );
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      agentId: 'all',
    });
  };

  const handleAssignSubmit = async (agentId) => {
    if (!selectedTicket) return;
    try {
      setAssignSubmitting(true);
      await ticketService.assignTicket(selectedTicket._id, agentId);
      setAssignModalOpen(false);
      setSelectedTicket(null);
      fetchTickets();
    } catch (err) {
      alert(err.message || 'Failed to assign ticket');
    } finally {
      setAssignSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Ticket Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Overview, agent assignment, and lifecycle monitoring of all support tickets
          </p>
        </div>
      </div>

      {/* Filters */}
      <TicketFilters
        filters={filters}
        categories={categories}
        agents={agents}
        showAgentFilter={true}
        onChange={setFilters}
        onReset={handleResetFilters}
      />

      {/* Ticket List */}
      <TicketList
        tickets={tickets}
        loading={loading}
        detailBaseUrl="/admin/tickets"
        onAssign={(ticket) => {
          setSelectedTicket(ticket);
          setAssignModalOpen(true);
        }}
        emptyMessage="No tickets match the selected management filters."
      />

      {/* Assign Agent Modal */}
      <AssignTicketModal
        isOpen={assignModalOpen}
        onClose={() => {
          setAssignModalOpen(false);
          setSelectedTicket(null);
        }}
        ticket={selectedTicket}
        onAssign={handleAssignSubmit}
        submitting={assignSubmitting}
      />
    </div>
  );
};

export default AdminTickets;
