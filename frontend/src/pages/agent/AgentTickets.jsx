import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import ticketService from '../../services/ticketService';
import categoryService from '../../services/categoryService';
import TicketFilters from '../../components/tickets/TicketFilters';
import TicketList from '../../components/tickets/TicketList';

export const AgentTickets = () => {
  const [searchParams] = useSearchParams();

  const [tickets, setTickets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
  });

  const fetchAssignedTickets = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ticketService.getTickets(filters);
      setTickets(data.tickets || []);
    } catch (err) {
      console.error('Error fetching assigned tickets:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    categoryService.getCategories().then((res) => {
      setCategories(res.categories || []);
    });
  }, []);

  useEffect(() => {
    fetchAssignedTickets();
  }, [fetchAssignedTickets]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'all',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Assigned Support Queue
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Tickets assigned to you for triage, troubleshooting, and resolution
        </p>
      </div>

      {/* Filters */}
      <TicketFilters
        filters={filters}
        categories={categories}
        onChange={setFilters}
        onReset={handleResetFilters}
      />

      {/* Tickets List */}
      <TicketList
        tickets={tickets}
        loading={loading}
        detailBaseUrl="/agent/tickets"
        emptyMessage="No tickets found in your assigned queue matching these filters."
      />
    </div>
  );
};

export default AgentTickets;
