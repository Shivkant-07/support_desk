import api from './api';

export const authService = {
  login: async (email, password) => {
    const data = await api.post('/auth/login', { email, password });
    if (data.token) {
      sessionStorage.setItem('supportdesk_token', data.token);
      sessionStorage.setItem('supportdesk_user', JSON.stringify(data.user));
    }
    return data;
  },

  register: async (userData) => {
    const data = await api.post('/auth/register', userData);
    if (data.token) {
      sessionStorage.setItem('supportdesk_token', data.token);
      sessionStorage.setItem('supportdesk_user', JSON.stringify(data.user));
    }
    return data;
  },

  registerOnly: async (userData) => {
    return await api.post('/auth/register', userData);
  },

  getMe: async () => {
    const data = await api.get('/auth/me');
    if (data.user) {
      sessionStorage.setItem('supportdesk_user', JSON.stringify(data.user));
    }
    return data.user;
  },

  updateProfile: async (profileData) => {
    const data = await api.put('/auth/profile', profileData);
    if (data.user) {
      sessionStorage.setItem('supportdesk_user', JSON.stringify(data.user));
    }
    return data;
  },

  changePassword: async (passwords) => {
    return await api.put('/auth/change-password', passwords);
  },

  logout: () => {
    sessionStorage.removeItem('supportdesk_token');
    sessionStorage.removeItem('supportdesk_user');
    try {
      localStorage.removeItem('supportdesk_token');
      localStorage.removeItem('supportdesk_user');
    } catch {}
  },

  getCurrentUser: () => {
    try {
      const user = sessionStorage.getItem('supportdesk_user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  getToken: () => {
    return sessionStorage.getItem('supportdesk_token');
  },
};

export default authService;
