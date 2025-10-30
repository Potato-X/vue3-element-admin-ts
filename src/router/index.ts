import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

export const dynamicRoutes: Array<RouteRecordRaw> = [
  {
    path: '/system/company',
    name: 'company',
    component: () => import('@/views/system/company.vue'),
    meta: { title: '公司管理', icon: 'Menu', menuCode: '1010', roles: ['admin', 'editor'] }
  },
  {
    path: '/system/dict',
    name: 'dict',
    component: () => import('@/views/system/dict.vue'),
    meta: { title: '系统字典', icon: 'Menu', menuCode: '1070', roles: ['admin', 'editor'] }
  },
  {
    path: '/system/menu',
    name: 'menu',
    component: () => import('@/views/system/menu.vue'),
    meta: { title: '菜单管理', icon: 'Menu', menuCode: '1060', roles: ['admin', 'editor'] },
    redirect: '/system'
  },
  {
    path: '/system/position',
    name: 'position',
    component: () => import('@/views/system/position.vue'),
    meta: { title: '职务管理', icon: 'Menu', menuCode: '1030', roles: ['admin', 'editor'] },
    redirect: '/system'
  },
  {
    path: '/system/role',
    name: 'role',
    component: () => import('@/views/system/role.vue'),
    meta: { title: '角色管理', icon: 'Menu', menuCode: '1040', roles: ['admin', 'editor'] }
  },
  {
    path: '/system/user',
    name: 'user',
    component: () => import('@/views/system/user.vue'),
    meta: { title: '用户管理', icon: 'Menu', menuCode: '1050', roles: ['admin', 'editor'] }
  }
];
export const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/login',
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
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index.vue'),
        name: 'Home',
        meta: { title: '首页', icon: 'HomeFilled', menuCode: '001', affix: true }
      },
      ...dynamicRoutes
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

export const asyncRoutes = [];

export const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes
});

export default router;
