import request from './Axios';

const baseURL = import.meta.env.VITE_BASE_API;
/**
 * 获取工厂数据
 * @param {*} param
 * @returns
 */
export function GetFactory(params?: any) {
  return request({
    url: `${baseURL}/BaseFactory/GetFactory`,
    method: 'post',
    params
  });
}
