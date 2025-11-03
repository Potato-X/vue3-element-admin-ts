import { getToken, removeAvatar, removeName, removeRoles, removeToken } from '@/utils/auth';
import axios, { AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ElMessage, ElLoading, LoadingInstance } from 'element-plus';

let loadInstance: LoadingInstance | null = null;
let loadingRequestCount = 0;
const showFullScreenLoading = () => {
  if (loadingRequestCount === 0) {
    loadInstance = ElLoading.service({
      lock: true,
      text: '正在加载中...',
      background: 'rgba(0, 0, 0, 0.3)'
    });
  }
  loadingRequestCount++;
};
const tryCloseFullScreenLoading = () => {
  if (loadingRequestCount <= 0) return;
  loadingRequestCount--;
  if (loadingRequestCount === 0 && loadInstance) {
    loadInstance.close();
    loadInstance = null;
  }
};

const service = axios.create({
  // baseURL: import.meta.env.VITE_BASE_API,
  timeout: 10000 // request timeout
});

// 发起请求之前的拦截器
service.interceptors.request.use(
  (config: any) => {
    if (!config.hideLoading) {
      showFullScreenLoading();
    }
    // 如果有token 就携带tokon
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  (error: any) => {
    tryCloseFullScreenLoading();
    return Promise.reject(error);
  }
);

interface IResponse<T=any> {
  success: boolean;
  message: string;
  data: T;
}
// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    tryCloseFullScreenLoading();
    console.log("response.data===>",response.data)
    return response.data;
  },
  (error: any) => {
    if (error.response && error.response.status === 401) {
      removeToken();
      removeRoles();
      removeName();
      removeAvatar();
      location.reload();
    }
    tryCloseFullScreenLoading();
    ElMessage({
      type: 'error',
      message: error.message
    });
    return Promise.reject(error);
  }
);
export const request = async<T>(options: AxiosRequestConfig) => {
  const res =  await service(options);
  return res as unknown as IResponse<T>
};
export default service;
