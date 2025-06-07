import axios from 'axios';

const BACKEND_URL = 'https://user-login-backend-duu3.onrender.com';

// Log the environment variable for debugging
console.log('API URL:', BACKEND_URL);

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false, // Set to false since we're using token-based auth
  timeout: 10000
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Log the full URL being called
    console.log('Making request to:', config.baseURL + config.url);
    console.log('Request config:', {
      method: config.method,
      url: config.url,
      data: config.data,
      headers: config.headers
    });
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      config: {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        method: error.config?.method
      }
    });

    // Handle specific error cases
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server. Is the backend running?');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api; 