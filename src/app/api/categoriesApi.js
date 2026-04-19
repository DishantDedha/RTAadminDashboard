import axiosInstance from '../../lib/axios.js';

export const getCategoriesApi = () => axiosInstance.get('/categories');
export const createCategoryApi = (name) => axiosInstance.post('/categories', { name });
export const deleteCategoryApi = (id) => axiosInstance.delete(`/categories/${id}`);

export const createSubCategoryApi = (categoryId, name) =>
  axiosInstance.post(`/categories/${categoryId}/sub-categories`, { name });
export const deleteSubCategoryApi = (id) =>
  axiosInstance.delete(`/categories/sub-categories/${id}`);

export const createDocumentApi = (subCategoryId, label, is_required) =>
  axiosInstance.post(`/categories/sub-categories/${subCategoryId}/documents`, { label, is_required });
export const deleteDocumentApi = (id) =>
  axiosInstance.delete(`/categories/documents/${id}`);