import axios from 'axios';
import apis from './api/apis';
import { toast } from 'sonner';
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
    const response = await axiosInstance.post('/auth/token/refresh/', { refresh:refreshToken });
    const newAccessToken = response.data.accessToken;

    // Update localStorage with new access token
    localStorage.setItem('refresh_token', newAccessToken);

    return newAccessToken;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
};

// Request interceptor to attach token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    // console.log(config)
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
  async(error) => {
    console.log(error.response)
    if (error.response && error.response.status === 401) {
   const { data } = error.response;
   
   if(data?.detail)
   {
    toast.error("Invalid token. Please login again")
    localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token')
   }
   else if(data?.error)
   {
    toast.error(data?.error)
    localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token')
   }
     else{ localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token'); // Remove this if not using refresh tokens
       window.location.href = '/login';
       toast.error('Session expired. Please log in again.');
       window.location.href = '/login';
     } 
    }

    if (error.response && error.response.status === 404) {
      
          if (!isRefreshing) {
            // isRefreshing = true;
            try {
              //return response
              const newAccessToken = await refreshAccessToken();
            
              originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
              return axiosInstance(originalRequest);
            } catch (refreshError) {
              window.location.href = '/login';
              // Handle refresh token failure (e.g., redirect to login)
              console.error('Refresh token failed:', refreshError);
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              toast.error('Session expired. Please log in again.');
              
              return Promise.reject(refreshError);
            } finally {
              isRefreshing = false;
            }
          } else if(error.response && error.response.status === 401){
            resolve(axiosInstance(originalRequest));
          }
         
          else {
            // While refreshing, queue the original request
            return new Promise((resolve, reject) => {
              refreshSubscribers.push((accessToken) => {
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                resolve(axiosInstance(originalRequest));
              });
            });
          }
        }

      if(error.response && error.response.status === 500 && ! (localStorage.getItem('access_token')))
          {
           window.location.href="/login"
          }

    return Promise.reject(error);
  }
  // async (error) => {
  //   const originalRequest = error.config;

  //   // Handle token expiration or unauthorized errors
  //   if (error.response && error.response.status === 401) {
      
  //     if (!isRefreshing) {
  //       // isRefreshing = true;
  //       try {
  //         //return response
  //         // const newAccessToken = await refreshAccessToken();
  //         // Retry original request with new token
  //         // originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
  //         return axiosInstance(originalRequest);
  //       } catch (refreshError) {
  //         window.location.href = '/login';
  //         // Handle refresh token failure (e.g., redirect to login)
  //         console.error('Refresh token failed:', refreshError);
  //         localStorage.removeItem('token');
  //         localStorage.removeItem('refresh_token');
  //         toast.error('Session expired. Please log in again.');
          
  //         return Promise.reject(refreshError);
  //       } finally {
  //         isRefreshing = false;
  //       }
  //     } else {
  //       // While refreshing, queue the original request
  //       return new Promise((resolve, reject) => {
  //         refreshSubscribers.push((accessToken) => {
  //           originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
  //           resolve(axiosInstance(originalRequest));
  //         });
  //       });
  //     }
  //   }

  //   // Handle other HTTP errors
  //   return Promise.reject(error);
  // }
);

// Mock API responses for testing purposes
// const mock = new MockAdapter(axiosInstance);
// mock.onPost('/login').reply(200, { message: 'Simulated Response Data' });

export default axiosInstance;
