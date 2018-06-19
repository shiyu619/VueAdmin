
import Layout from '../views/layout/Layout';
export default [
  {
    path: '/scenic',
    component: Layout,
    redirect: '/scenic/index',
    name: 'dashboard',
    meta: { title: '景区管理', icon: 'user' },
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/system/addUserForm'),
        meta: { title: '景区管理', icon: 'user' }
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/system/role'),
        meta: { title: '语言管理', icon: 'user' }
      },
      {
        path: 'menu',
        name: 'systemMenu',
        component: () => import('@/views/system/menu'),
        meta: { title: '国家管理', icon: 'user' }
      },
      {
        path: 'log',
        name: 'log',
        component: () => import('@/views/system/user'),
        meta: { title: '呵呵哒', icon: 'user' }
      }
    ]
  },

  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    name: 'system',
    meta: { title: '系统管理', icon: 'user' },
    children: [
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/system/user'),
        meta: { title: '用户管理', icon: 'user' }
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/system/role'),
        meta: { title: '角色管理', icon: 'user' }
      },
      {
        path: 'menu',
        name: 'systemMenu',
        component: () => import('@/views/system/menu'),
        meta: { title: '菜单管理', icon: 'user' }
      },
      {
        path: 'log',
        name: 'log',
        component: () => import('@/views/system/user'),
        meta: { title: '系统日志', icon: 'user' }
      }
    ]
  }
];
