import api from './api';

export const categoryService = {
  getCategories: async (all = false) => {
    return await api.get(`/categories${all ? '?all=true' : ''}`);
  },

  createCategory: async (categoryData) => {
    return await api.post('/categories', categoryData);
  },

  updateCategory: async (id, categoryData) => {
    return await api.put(`/categories/${id}`, categoryData);
  },

  toggleCategoryStatus: async (id) => {
    return await api.put(`/categories/${id}/status`, {});
  },

  deleteCategory: async (id) => {
    return await api.delete(`/categories/${id}`);
  },
};

export default categoryService;
