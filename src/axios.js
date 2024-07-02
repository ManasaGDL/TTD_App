import axios from 'axios';


const axiosInstance = axios.create({
  baseURL: 'http://13.201.33.169:8000'
});

// Function to refresh access token
const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token'); // Assuming you store refreshToken in localStorage
    if (!refreshToken) {
      throw new Error('No refreshToken available');
    }

    // Example: Call your API endpoint to refresh token
    const response = await axiosInstance.post('/refresh_token', { refreshToken });
    const newAccessToken = response.data.accessToken;

    // Update localStorage with new access token
    localStorage.setItem('token', newAccessToken);

    return newAccessToken;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
};

// Request interceptor to attach token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(config)
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration and refresh
let isRefreshing = false;
let refreshSubscribers = [];

axiosInstance.interceptors.response.use(
  (response) => {
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration or unauthorized errors
    if (error.response && error.response.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newAccessToken = await refreshAccessToken();
          // Retry original request with new token
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Handle refresh token failure (e.g., redirect to login)
          console.error('Refresh token failed:', refreshError);
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        // While refreshing, queue the original request
        return new Promise((resolve, reject) => {
          refreshSubscribers.push((accessToken) => {
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }
    }

    // Handle other HTTP errors
    return Promise.reject(error);
  }
);

// Mock API responses for testing purposes
// const mock = new MockAdapter(axiosInstance);
// mock.onPost('/login').reply(200, { message: 'Simulated Response Data' });

export default axiosInstance;
