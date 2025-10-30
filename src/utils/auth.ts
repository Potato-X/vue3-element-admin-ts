import { IMenuItem } from '@/@types/store';
import Cookies from 'js-cookie';

const TokenKey = 'token';
const RoleKey = 'roles';
const nameKey = 'name';
const avatarKey = 'avatar';
const menu = 'menu';
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
  return Cookies.get(RoleKey);
}

export function setRoles(role: string) {
  return Cookies.set(RoleKey, role);
}
export function setMenus(menus: IMenuItem[]) {
  return localStorage.setItem(menu, JSON.stringify(menus));
}

export function getMenus() {
  const menus = localStorage.getItem(menu);
  if (menus) {
    return JSON.parse(menus) as IMenuItem[];
  }
  return [];
}
export function removeRoles() {
  return Cookies.remove(RoleKey);
}

export function getName() {
  return Cookies.get(nameKey);
}

export function setName(name: string) {
  return Cookies.set(nameKey, name);
}

export function removeName() {
  return Cookies.remove(nameKey);
}

export function getAvatar() {
  return Cookies.get(avatarKey);
}

export function setAvatar(avatar: string) {
  return Cookies.set(avatarKey, avatar);
}

export function removeAvatar() {
  return Cookies.remove(avatarKey);
}
