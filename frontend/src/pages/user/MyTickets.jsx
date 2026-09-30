import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import ticketService from '../../services/ticketService';
import categoryService from '../../services/categoryService';
import TicketFilters from '../../components/tickets/TicketFilters';
import TicketList from '../../components/tickets/TicketList';
import { PlusCircle } from 'lucide-react';

export const MyTickets = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [tickets, setTickets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
  });

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ticketService.getTickets(filters);
      setTickets(data.tickets || []);
    } catch (err) {
      console.error('Error fetching tickets:', err);
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
    fetchTickets();
  }, [fetchTickets]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'all',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            My Support Tickets
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            View, track, and update all tickets submitted by you
          </p>
        </div>

        <Link
          to="/user/tickets/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Ticket</span>
        </Link>
      </div>

      {/* Filters & Search */}
      <TicketFilters
        filters={filters}
        categories={categories}
        onChange={setFilters}
        onReset={handleResetFilters}
      />

      {/* Responsive Ticket Table / Cards */}
      <TicketList
        tickets={tickets}
        loading={loading}
        detailBaseUrl="/user/tickets"
        emptyMessage="No tickets found matching your query."
        onCreateNew={() => navigate('/user/tickets/new')}
      />
    </div>
  );
};

export default MyTickets;
