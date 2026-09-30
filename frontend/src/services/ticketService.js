import api from './api';

export const ticketService = {
  getTickets: async (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value);
      }
    });
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return await api.get(`/tickets${queryString}`);
  },

  getTicketById: async (id) => {
    return await api.get(`/tickets/${id}`);
  },

  createTicket: async (formData) => {
    return await api.post('/tickets', formData);
  },

  updateTicket: async (id, updateData) => {
    return await api.put(`/tickets/${id}`, updateData);
  },

  assignTicket: async (id, agentId) => {
    return await api.put(`/tickets/${id}/assign`, { agentId });
  },

  reopenTicket: async (id, reason) => {
    return await api.put(`/tickets/${id}/reopen`, { reason });
  },

  closeTicket: async (id) => {
    return await api.put(`/tickets/${id}/close`, {});
  },

  deleteTicket: async (id) => {
    return await api.delete(`/tickets/${id}`);
  },
};

export default ticketService;
