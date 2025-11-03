import { request } from './Axios';

const baseURL = import.meta.env.VITE_BASE_API;
/**
 * 角色管理查询
 * @param {*} param
 * @returns
 */
export  function GetRole<T>(params?: any) {
  return request<T>({
    url: `${baseURL}/BaseRole/GetRole`,
    method: 'post',
    params
  });
}

/**
 * 批量删除菜单
 * @param {*} param
 * @returns
 */
export function BatchDeleteRole(data?: any) {
  return request({
    url: `${baseURL}/BaseRole/BatchDeleteRole`,
    method: 'delete',
    data
  });
}
/**
 * 新增或编辑角色权限
 * @param {*} param
 * @returns
 */
export function AddOrEditRole(data?: any) {
  return request({
    url: `${baseURL}/BaseRole/AddOrEditRole`,
    method: 'post',
    data
  });
}
