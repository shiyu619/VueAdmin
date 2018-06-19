
import request from '@/utils/request';
import md5 from 'js-md5';
// 登录
const login = {
  p: ['get,/pb/login'],
  r: (username, password) => {
    return request({
      'url': 'system/api/login',
      'method': 'post',
      data: {
        loginName: username,
        password: md5(password)
      }
    });
  }
};
// 获取用户信息
const userList = {
  p: ['get,/system/api/getUserList'],
  r: token => {
    return request({
      'url': '/system/api/getUserList',
      'method': 'get',
      'params': { token }
    });
  }
};

// 设置用户角色
const updateUserRole = {
  p: ['get,/user/info'],
  r: data => {
    return request({
      'url': 'system/api/updateUserRole',
      'method': 'post',
      data
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
// 获取角色列表
const getRoleList = {
  p: ['delete,/system/api/getRoles'],
  r: data => {
    return request({
      'url': '/system/api/getRoles',
      'method': 'get',
      data
    });
  }
};
// 获取权限列表
const getRole = {
  p: ['delete,/system/api/getRole'],
  r: id => {
    return request({
      'url': '/system/api/getRole',
      'method': 'post',
      data: { id }
    });
  }
};
// 修改角色权限
const updateRole = {
  p: ['delete,/system/api/updateRole'],
  r: data => {
    return request({
      'url': '/system/api/updateRole',
      'method': 'post',
      data
    });
  }
};
export {
  login,
  userList,
  updateUserRole,
  getRoleList,
  getAllMenu,
  getSelectData,
  addMenu,
  delResources,
  getRole,
  updateRole
};
