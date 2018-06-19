
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
const getInfo = {
  p: ['get,system/api/userInfo'],
  r: token => {
    return request({
      'url': 'system/api/userInfo',
      'method': 'get',
      'params': { token }
    });
  }
};
// 获取用户信息
const logout = {
  p: ['get,/user/info'],
  r: token => {
    return request({
      'url': '/user/info',
      'method': 'get',
      'params': { token }
    });
  }
};

export {
  login,
  getInfo,
  logout
};
