
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
const getInfo = {
  p: ['get,/user/info'],
  r: token => {
    return request({
      'url': '/user/info',
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
