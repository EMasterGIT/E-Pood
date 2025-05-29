import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api', // <--- Make sure this matches your backend URL
  timeout: 10000,
});

// Request interceptor to add the Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Get token
    console.log('Axios Interceptor: Token from localStorage:', token ? 'Found' : 'Not found'); // ADD THIS LOG
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Set header
      console.log('Axios Interceptor: Authorization header set.'); // ADD THIS LOG
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;