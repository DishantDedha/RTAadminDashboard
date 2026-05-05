import axiosInstance from '../../lib/axios';

export const getAllVerificationsApi = (page = 1, limit = 10, status = '') =>
  axiosInstance.get(`/verification?page=${page}&limit=${limit}&status=${status}`);

export const reviewVerificationApi = (id, data) =>
  axiosInstance.patch(`/verification/${id}/review`, data);