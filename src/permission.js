import router from './router';
import Vue from 'vue';
import store from './store';
import NProgress from 'nprogress'; // Progress 进度条
import 'nprogress/nprogress.css';// Progress 进度条样式
import { Message } from 'element-ui';
import { getToken } from '@/utils/auth'; // 验权
import userPath from './router/fullpath';
import * as util from '@/utils';
const _ = require('lodash');

function getRoutes(menus) {
  if (!menus) {
    return console.warn(menus);
  }
  let allowedRouter = [];
  // 将菜单数据转成多维数组格式
  const arrayMenus = util.buildMenu(_.cloneDeepWith(menus));

  // 将多维数组转成对象格式
  const hashMenus = {};
  const setMenu2Hash = function(array, base) {
    array.map(key => {
      if (key.url) {
        const hashKey = ((base ? base + '/' : '') + key.url).replace(
          /^\//,
          ''
        );

        hashMenus['/' + hashKey] = true;
        if (Array.isArray(key.children)) {
          setMenu2Hash(key.children, key.url);
        }
      }
    });
  };
  setMenu2Hash(arrayMenus);
  store.dispatch('set_hashMenus', hashMenus);
  // 筛选本地路由方法
  const findLocalRoute = function(array, base) {
    const replyResult = [];
    array.forEach(function(route) {
      const pathKey = (base ? base + '/' : '') + route.path;
      if (hashMenus[pathKey]) {
        if (Array.isArray(route.children)) {
          route.children = findLocalRoute(route.children, route.path);
        }
        const obj = {};
        for (const key in route) {
          if (route.hasOwnProperty(key)) {
            obj[key] = route[key];
          }
        }
        replyResult.push(obj);
      }
    });
    if (base) {
      return replyResult;
    } else {
      allowedRouter = allowedRouter.concat(replyResult);
    }
  };

  const originPath = _.cloneDeepWith(userPath);
  findLocalRoute(originPath);
  return allowedRouter;
}
const whiteList = ['/login']; // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start();
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' });
      NProgress.done(); // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.resources.length === 0) {
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          const route = [];
          const resourcePermission = {};
          res.data.resources.forEach(item => {
            const key = 'get' + ',' + item.url;
            if (item.type === 1) {
              route.push(item);
            } else {
              resourcePermission[key] = true;
            }
          });
          const routes = getRoutes(route);
          // 权限检验方法
          Vue.prototype.$_has = function(rArray) {
            let resources = [];
            let permission = true;
            // 提取权限数组
            if (Array.isArray(rArray)) {
              rArray.forEach(function(e) {
                resources = resources.concat(e);
              });
            } else {
              resources = resources.concat(rArray);
            }
            // 校验权限
            resources.forEach(function(p) {
              if (!resourcePermission[p]) {
                permission = false;
              }
            });
            return permission;
          };
          routes.push({ path: '*', redirect: '/404', hidden: true });
          console.log(resourcePermission);

          store.dispatch('GenerateRoutes', { routes, resourcePermission }).then(() => { // 根据roles权限生成可访问的路由表
            router.addRoutes(store.getters.addRouters); // 动态添加可访问路由表{ path: '*', redirect: '/404', hidden: true }
            next({ ...to, replace: true }); // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          });
          next();
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again');
            next({ path: '/' });
          });
        });
      } else {
        next();
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next('/login');
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done(); // 结束Progress
});
