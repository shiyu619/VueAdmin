import { constantRouterMap } from '@/router';
// import { getToken } from '@/utils/auth';
// import userPath from '@/router/fullpath';

const permission = {
  state: {
    auth: [],
    hashMenus: {},
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
    },
    SET_AUTH: (state, auth) => {
      state.auth = auth;
    },
    SET_HASHMENUS: (state, hashMenu) => {
      state.hashMenus = hashMenu;
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { routes, resourcePermission } = data;
        const accessedRouters = routes;
        commit('SET_ROUTERS', accessedRouters);
        commit('SET_AUTH', resourcePermission);
        resolve();
      });
    },
    GenerateAuth({ commit }, data) {
      commit('SET_AUTH', data);
    },
    set_hashMenus({ commit }, hashMenu) {
      commit('SET_HASHMENUS', hashMenu);
    }
  }
};

export default permission;
