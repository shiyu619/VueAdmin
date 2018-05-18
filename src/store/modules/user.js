// import { login, logout, getInfo } from '@/api/user';
// import * as login from '@/api/user';
import { getInfo, login, logout } from '@/api/user';
import { getToken, setToken, removeToken } from '@/utils/auth';

const user = {
  state: {
    token: getToken(),
    id: '',
    name: '',
    avatar: '',
    resources: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_ID: (state, id) => {
      state.id = id;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim();
      console.log(login);
      return new Promise((resolve, reject) => {
        login.r(username, userInfo.password).then(response => {
          const data = response.data;
          setToken(data.token);
          commit('SET_TOKEN', data.token);
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo.r(state.token).then(response => {
          const data = response.data;
          if (data.userInfo.resources && data.userInfo.resources.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.userInfo.resources);
          } else {
            reject('getInfo: roles must be a non-null array !');
          }
          commit('SET_NAME', data.userInfo.name);
          commit('SET_ID', data.userInfo.id);
          commit('SET_AVATAR', data.userInfo.avatar);
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout.r(state.token).then(() => {
          commit('SET_TOKEN', '');
          commit('SET_ROLES', []);
          removeToken();
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        removeToken();
        resolve();
      });
    }
  }
};

export default user;
