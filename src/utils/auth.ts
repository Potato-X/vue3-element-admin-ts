import { IMenuItem, IUserInfo } from '@/@types/store';
import Cookies from 'js-cookie';

const TokenKey = 'token';
const RoleKey = 'roles';
const nameKey = 'name';
const avatarKey = 'avatar';
const menu = 'menu';
const flatmenu = 'flatmenu';
const userinfo = 'userinfo';
export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token: string) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

export function getRoles() {
  const role = localStorage.getItem(RoleKey);
  if (role) {
    return JSON.parse(role);
  }
  return null;
}

export function setRoles(role: any) {
  return localStorage.setItem(RoleKey, JSON.stringify(role));
}
export function setMenus(menus: IMenuItem[]) {
  return localStorage.setItem(menu, JSON.stringify(menus));
}
export function setFlatMenus(menus: IMenuItem[]) {
  return localStorage.setItem(flatmenu, JSON.stringify(menus));
}
export function getMenus() {
  const menus = localStorage.getItem(menu);
  if (menus) {
    return JSON.parse(menus) as IMenuItem[];
  }
  return [];
}
export function getFlatMenus() {
  const flatmenus = localStorage.getItem(flatmenu);
  if (flatmenus) {
    return JSON.parse(flatmenus) as IMenuItem[];
  }
  return [];
}
export function getUserInfo() {
  const _userinfo = localStorage.getItem(userinfo);
  if (_userinfo) {
    return JSON.parse(_userinfo) as IUserInfo;
  }
  return null;
}

export function setUserInfo(userinf: IUserInfo) {
  return localStorage.setItem(userinfo, JSON.stringify(userinf));
}
export function removeRoles() {
  return localStorage.removeItem(RoleKey);
}

export function getName() {
  return localStorage.getItem(nameKey);
}

export function setName(name: string) {
  return localStorage.setItem(nameKey, name);
}

export function removeName() {
  return localStorage.removeItem(nameKey);
}

export function getAvatar() {
  return localStorage.getItem(avatarKey);
}

export function setAvatar(avatar: string) {
  return localStorage.setItem(avatarKey, avatar);
}

export function removeAvatar() {
  return localStorage.removeItem(avatarKey);
}
