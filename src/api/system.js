
import request from '@/utils/request';
import qs from 'qs';
import md5 from 'js-md5';
// 登录
const login = {
  p: ['get,/pb/login'],
  r: (username, password) => {
    return request({
      'url': 'pb/login',
      'method': 'post',
      contentType: 'application/x-www-form-urlencoded',
      data: qs.stringify({
        loginName: username,
        password: md5(password)
      })
    });
  }
};
// 获取用户信息
const userList = {
  p: ['get,/user'],
  r: token => {
    return request({
      'url': '/user',
      'method': 'get',
      'params': { token }
    });
  }
};

// 获取用户信息
const roleList = {
  p: ['get,/user/info'],
  r: token => {
    return request({
      'url': '/user/info',
      'method': 'get',
      'params': { token }
    });
  }
};

// 获取角色列表
const getRoleList = {
  p: ['get,/getRole'],
  r: token => {
    return request({
      'url': '/getRole',
      'method': 'get'
    });
  }
};

// 获取角色列表
const getAllMenu = {
  p: ['get,/system/api/getAllMenu'],
  r: token => {
    return request({
      'url': '/system/api/getAllMenu',
      'method': 'get'
    });
  }
};

// 获取角色列表
const getSelectData = {
  p: ['get,/system/api/getSelectMenu'],
  r: token => {
    return request({
      'url': '/system/api/getSelectMenu',
      'method': 'get'
    });
  }
};
// 添加菜单
const addMenu = {
  p: ['get,/system/api/addMenu'],
  r: data => {
    return request({
      'url': '/system/api/addMenu',
      'method': 'post',
      data
    });
  }
};
// 添加菜单
const delResources = {
  p: ['delete,/system/api/delResources'],
  r: data => {
    return request({
      'url': '/system/api/delResources',
      'method': 'delete',
      data
    });
  }
};
export {
  login,
  userList,
  roleList,
  getRoleList,
  getAllMenu,
  getSelectData,
  addMenu,
  delResources
};
