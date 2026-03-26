import axios from 'axios';
import { store } from '@/app/store';
import { setTokenExpired } from '@/app/store/authSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://wms.giri.in:8083/api/v1',
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const companyId = import.meta.env.VITE_COMPANYID || 1;

    // If it's a POST/PUT/PATCH and data is a regular object or missing
    if (['post', 'put', 'patch'].includes(config.method || '')) {
      if (config.data instanceof FormData) {
        if (!config.data.has('companyid')) {
          config.data.append('companyid', companyId.toString());
        }
      } else if (config.data && typeof config.data === 'object' && !(config.data instanceof URLSearchParams)) {
        config.data.companyid = config.data.companyid || Number(companyId);
      } else if (!config.data) {
        config.data = { companyid: Number(companyId) };
      }
    }

    // If it's a GET/DELETE request
    if (['get', 'delete'].includes(config.method || '')) {
      config.params = config.params || {};
      if (!config.params.companyid) {
        config.params.companyid = Number(companyId);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const message = error.response?.data?.message || "";
      if (message.includes("Token has expired") || message.includes("login again")) {
        store.dispatch(setTokenExpired());
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('userData');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
