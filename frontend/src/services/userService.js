import api from './api';

export const userService = {
  getUsers: async (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value);
      }
    });
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return await api.get(`/users${queryString}`);
  },

  getUserById: async (id) => {
    return await api.get(`/users/${id}`);
  },

  createUser: async (userData) => {
    return await api.post('/users', userData);
  },

  updateUser: async (id, userData) => {
    return await api.put(`/users/${id}`, userData);
  },

  toggleUserStatus: async (id) => {
    return await api.put(`/users/${id}/status`, {});
  },

  deleteUser: async (id) => {
    return await api.delete(`/users/${id}`);
  },
};

export default userService;
