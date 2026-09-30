const API_BASE_URL = '/api';

export const request = async (endpoint, options = {}) => {
  const token = sessionStorage.getItem('supportdesk_token');

  const headers = {
    ...options.headers,
  };

  // If payload is not FormData, default to application/json
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // If unauthorized, clear token and notify
    if (response.status === 401 && !endpoint.includes('/auth/login')) {
      sessionStorage.removeItem('supportdesk_token');
      sessionStorage.removeItem('supportdesk_user');
      try {
        localStorage.removeItem('supportdesk_token');
        localStorage.removeItem('supportdesk_user');
      } catch {}
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?expired=true';
      }
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || 'Something went wrong');
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export default {
  get: (url, options = {}) => request(url, { ...options, method: 'GET' }),
  post: (url, body, options = {}) => {
    const isFormData = body instanceof FormData;
    return request(url, {
      ...options,
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body),
    });
  },
  put: (url, body, options = {}) => {
    const isFormData = body instanceof FormData;
    return request(url, {
      ...options,
      method: 'PUT',
      body: isFormData ? body : JSON.stringify(body),
    });
  },
  delete: (url, options = {}) => request(url, { ...options, method: 'DELETE' }),
};
