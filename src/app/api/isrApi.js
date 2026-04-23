import axiosInstance from '../../lib/axios';

export const getIsrFormsAdminApi = () => axiosInstance.get('/isr/admin');

export const createIsrFormApi = (formData) =>
  axiosInstance.post('/isr', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateIsrFormApi = (id, data) => axiosInstance.put(`/isr/${id}`, data);
export const deleteIsrFormApi = (id) => axiosInstance.delete(`/isr/${id}`);