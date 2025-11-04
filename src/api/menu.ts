import {request} from './Axios';

const baseURL = import.meta.env.VITE_BASE_API;
/**
 * 获取菜单树层级以及下面的按钮
 * @param {*} param
 * @returns
 */
export function GetMenuTree<T>(params?: any) {
  return request<T>({
    url: `${baseURL}/BaseMenu/GetMenuTree`,
    method: 'post',
    params
  });
}

/**
 * 新增或编辑按钮
 * @param {*} param
 * @returns
 */
export function AddMenuWithButtons(data?: any) {
  return request({
    url: `${baseURL}/BaseMenu/AddMenuWithButtons`,
    method: 'post',
    data
  });
}

/**
 * 批量删除菜单
 * @param {*} param
 * @returns
 */
export function DeleteMenu(data?: any) {
  return request({
    url: `${baseURL}/BaseMenu/DeleteMenu`,
    method: 'delete',
    data
  });
}