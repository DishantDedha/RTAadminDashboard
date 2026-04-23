import axiosInstance from '../../lib/axios';

export const getEmeetingsAdminApi = () => axiosInstance.get('/events/emeetings/admin');
export const createEmeetingApi = (data) => axiosInstance.post('/events/emeetings', data);
export const updateEmeetingApi = (id, data) => axiosInstance.put(`/events/emeetings/${id}`, data);
export const deleteEmeetingApi = (id) => axiosInstance.delete(`/events/emeetings/${id}`);

export const getEvotingAdminApi = () => axiosInstance.get('/events/evoting/admin');
export const createEvotingApi = (data) => axiosInstance.post('/events/evoting', data);
export const updateEvotingApi = (id, data) => axiosInstance.put(`/events/evoting/${id}`, data);
export const deleteEvotingApi = (id) => axiosInstance.delete(`/events/evoting/${id}`);