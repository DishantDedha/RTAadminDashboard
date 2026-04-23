import axiosInstance from '../../lib/axios';

export const getSubmissionsApi = (page = 1, limit = 10) =>
  axiosInstance.get(`/submissions?page=${page}&limit=${limit}`);

export const getSubmissionDetailsApi = (type, id) =>
  axiosInstance.get(`/submissions/${type}/${id}`);

export const getExemptionFormsApi = (page = 1, limit = 10) =>
  axiosInstance.get(`/submissions/exemption-forms?page=${page}&limit=${limit}`);

export const getSubmissionStatsApi = () => axiosInstance.get('/submissions/stats');