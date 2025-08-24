import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

class ApiService {
  static init(): void {
    axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    
    // Request interceptor untuk debugging
    axios.interceptors.request.use(
      (config) => {
        console.log('🚀 API Request:', {
          method: config.method?.toUpperCase(),
          url: `${config.baseURL}${config.url}`,
          data: config.data,
          headers: config.headers
        });
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor untuk debugging
    axios.interceptors.response.use(
      (response) => {
        console.log('✅ API Response:', {
          status: response.status,
          statusText: response.statusText,
          url: response.config.url,
          data: response.data
        });
        return response;
      },
      (error) => {
        console.error('❌ Response Error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          data: error.response?.data,
          message: error.message
        });
        return Promise.reject(error);
      }
    );
  }

  static setHeader(token: string): void {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  static removeHeader(): void {
    axios.defaults.headers.common = {};
  }

  static get<T>(resource: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return axios.get<T>(resource, config);
  }

  static post<T>(resource: string, data: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return axios.post<T>(resource, data, config);
  }

  static put<T>(resource: string, data: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return axios.put<T>(resource, data, config);
  }

  static delete<T>(resource: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return axios.delete<T>(resource, config);
  }
}

export default ApiService;
