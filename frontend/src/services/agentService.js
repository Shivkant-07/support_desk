import api from './api';

export const agentService = {
  getAgents: async (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value);
      }
    });
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return await api.get(`/agents${queryString}`);
  },

  createAgent: async (agentData) => {
    return await api.post('/agents', agentData);
  },

  updateAgent: async (id, agentData) => {
    return await api.put(`/agents/${id}`, agentData);
  },

  toggleAgentStatus: async (id) => {
    return await api.put(`/agents/${id}/status`, {});
  },

  deleteAgent: async (id) => {
    return await api.delete(`/agents/${id}`);
  },
};

export default agentService;
