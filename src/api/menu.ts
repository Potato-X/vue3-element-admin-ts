import request from './Axios';

const baseURL = import.meta.env.VITE_BASE_API;
/**
 * 获取菜单树层级以及下面的按钮
 * @param {*} param
 * @returns
 */
export function GetMenuTree(params?: any) {
  return request({
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
