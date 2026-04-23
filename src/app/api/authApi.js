import axiosInstance from '../../lib/axios';

export const registerApi = async (formData) => {
  const response = await axiosInstance.post('/auth/register', formData);
  return response.data;
};

export const loginApi = async ({ pan, password }) => {
  const response = await axiosInstance.post('/auth/login', { pan, password, portalType: 'admin' });
  return response.data;
};

export const sendOtpApi = async ({ pan }) => {
  const response = await axiosInstance.post('/auth/send-otp', { pan });
  return response.data;
};

export const loginWithOtpApi = async ({ pan, otp }) => {
  const response = await axiosInstance.post('/auth/login-otp', { pan, otp });
  return response.data;
};

export const forgotPasswordApi = async ({ pan }) => {
  const response = await axiosInstance.post('/auth/forgot-password', { pan });
  return response.data;
};

export const verifyOtpApi = async ({ pan, otp }) => {
  const response = await axiosInstance.post('/auth/verify-otp', { pan, otp });
  return response.data;
};

export const resetPasswordApi = async ({ resetToken, newPassword }) => {
  const response = await axiosInstance.post('/auth/reset-password', { resetToken, newPassword });
  return response.data;
};

export const getMeApi = async () => {
  const response = await axiosInstance.get('/auth/me');
  return response.data;
};

