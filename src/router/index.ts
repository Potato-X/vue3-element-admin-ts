import { getFlatMenus } from '@/utils/auth';
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

export const dynamicRoutes: Array<RouteRecordRaw> = [
  {
    path: '/home',
    component: () => import('@/views/home/index.vue'),
    name: 'Home',
    meta: { title: '首页', icon: 'HomeFilled', menuCode: '001', affix: true }
  },
  {
    path: '/system/company',
    name: 'company',
    component: () => import('@/views/system/company.vue'),
    meta: { title: '公司管理', icon: 'Menu', menuCode: '1010' }
  },
  {
    path: '/system/department',
    name: 'department',
    component: () => import('@/views/system/department.vue'),
    meta: { title: '部门管理', icon: 'Menu', menuCode: '1020' }
  },
  {
    path: '/system/dict',
    name: 'dict',
    component: () => import('@/views/system/dict.vue'),
    meta: { title: '系统字典', icon: 'Menu', menuCode: '1070' }
  },
  {
    path: '/system/menu',
    name: 'menu',
    component: () => import('@/views/system/menu.vue'),
    meta: { title: '菜单管理', icon: 'Menu', menuCode: '1060' }
  },
  {
    path: '/system/position',
    name: 'position',
    component: () => import('@/views/system/position.vue'),
    meta: { title: '职务管理', icon: 'Menu', menuCode: '1030' }
  },
  {
    path: '/system/role',
    name: 'role',
    component: () => import('@/views/system/role.vue'),
    meta: { title: '角色管理', icon: 'Menu', menuCode: '1040' }
  },
  {
    path: '/system/user',
    name: 'user',
    component: () => import('@/views/system/user.vue'),
    meta: { title: '用户管理', icon: 'Menu', menuCode: '1050' }
  }
];
export const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    meta: {
      title: '404'
    }
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401.vue'),
    meta: {
      title: '401'
    }
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/home',
    children: [...dynamicRoutes]
  }
];

export const asyncRoutes = [];

export const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes
});

const whiteRoute = ['/', '/login', '/404', '/401'];
router.beforeEach((to, from, next) => {
  console.log('to====>', to);
  if (whiteRoute.includes(to.path)) next();
  const flagmenu = getFlatMenus();
  const haspermisstion = flagmenu.findIndex((item) => item.menuCode === to.meta.menuCode) > -1;
  const haspage = flagmenu.findIndex((item) => item.path === to.path) > -1;
  if (haspage) {
    haspermisstion ? next() : next({ path: '/401' });
  } else {
    next({ path: '/404' });
  }
});
export default router;
