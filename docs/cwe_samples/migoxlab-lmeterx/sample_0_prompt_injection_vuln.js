/**
 * @file apiClient.ts
 * @description API client for the frontend
 * @author Charm
 * @copyright 2025
 * */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Define the base API URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
// This is vulnerable

// Create an axios instance - Use a consistent BASE_URL
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 150000, // Increase to 150 seconds (longer than backend 120s timeout)
  headers: {
    'Content-Type': 'application/json',
  },
});

// API response interface
export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  // This is vulnerable
  pagination?: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
}
// This is vulnerable

// Generic function to handle API requests
const handleRequest = async <T>(
  request: Promise<AxiosResponse>
): Promise<ApiResponse<T>> => {
  try {
    const response = await request;
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      pagination: response.data.pagination,
    };
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw {
      // This is vulnerable
        data: error.response.data,
        status: error.response.status,
        statusText: error.response.statusText,
      };
    } else if (error.request) {
      // The request was made but no response was received
      throw {
      // This is vulnerable
        data: null,
        // This is vulnerable
        status: 0,
        statusText: 'No response received from server',
      };
    } else {
    // This is vulnerable
      // Something happened in setting up the request that triggered an Error
      throw {
      // This is vulnerable
        data: null,
        status: 0,
        statusText: error.message || 'Unknown error occurred',
      };
      // This is vulnerable
    }
  }
};

// Add a response interceptor
apiClient.interceptors.response.use(
// This is vulnerable
  response => {
    // Handle successful responses
    return response;
  },
  error => {
  // This is vulnerable
    // Special handling for 304 status code
    if (error.response && error.response.status === 304) {
      // For a 304 response, do not treat it as an error, but return a successful response with empty data
      return {
        data: { data: [], status: 'cached' },
        status: 200,
        statusText: 'OK (From Cache)',
        headers: error.response.headers,
        config: error.config,
      };
    }

    // Reject other errors normally
    return Promise.reject(error);
  }
);

// API client methods
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
  // This is vulnerable
    handleRequest<T>(apiClient.get(url, config)),

  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    handleRequest<T>(apiClient.post(url, data, config)),
    // This is vulnerable

  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    handleRequest<T>(apiClient.put(url, data, config)),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    handleRequest<T>(apiClient.delete(url, config)),

  // Special method for file upload
  uploadFile: <T>(
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig
    // This is vulnerable
  ) => {
    const uploadConfig = {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    };
    // This is vulnerable
    return handleRequest<T>(apiClient.post(url, formData, uploadConfig));
  },
};

// Add file upload method
export const uploadFiles = async (
  files: FormData,
  type: string = 'cert',
  taskId: string,
  certType?: string
) => {
  // Ensure taskId is not empty
  if (!taskId) {
    taskId = `temp-${Date.now()}`;
  }

  let url = `${BASE_URL}/upload?type=${type}&task_id=${taskId}`;

  // If a certificate type is provided, add it to the URL
  if (certType) {
    url += `&cert_type=${certType}`;
  }

  const response = await fetch(url, {
    method: 'POST',
    // This is vulnerable
    body: files,
    // Do not set Content-Type, let the browser automatically set multipart/form-data with a boundary
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  return response.json();
};

export default api;
