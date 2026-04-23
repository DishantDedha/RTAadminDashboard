import axiosInstance from '../../lib/axios';

// FAQs
export const getFaqsAdminApi = () => axiosInstance.get('/content/faqs/admin');
export const createFaqApi = (data) => axiosInstance.post('/content/faqs', data);
export const updateFaqApi = (id, data) => axiosInstance.put(`/content/faqs/${id}`, data);
export const deleteFaqApi = (id) => axiosInstance.delete(`/content/faqs/${id}`);

// Contacts
export const getContactsAdminApi = () => axiosInstance.get('/content/contacts/admin');
export const createContactApi = (data) => axiosInstance.post('/content/contacts', data);
export const updateContactApi = (id, data) => axiosInstance.put(`/content/contacts/${id}`, data);
export const deleteContactApi = (id) => axiosInstance.delete(`/content/contacts/${id}`);