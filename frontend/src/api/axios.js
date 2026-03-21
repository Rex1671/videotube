import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Prevent infinite loop if the refresh-token endpoint itself fails or login fails
    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      originalRequest.url !== '/users/login' && 
      originalRequest.url !== '/users/refresh-token'
    ) {
      originalRequest._retry = true;
      try {
        await api.post('/users/refresh-token');
        return api(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
