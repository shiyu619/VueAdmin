/**
 * Created by jiachenpan on 16/11/18.
 */
var _ = require('lodash');
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  if (typeof time === 'object') {
    date = time;
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000;
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1];
    if (result.length > 0 && value < 10) {
      value = '0' + value;
    }
    return value || 0;
  });
  return time_str;
}

export function formatTime(time, option) {
  time = +time * 1000;
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return '刚刚';
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前';
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前';
  } else if (diff < 3600 * 24 * 2) {
    return '1天前';
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分';
  }
}

// 菜单数据组织
export const buildMenu = function(array, ckey) {
  const menuData = [];
  // idList
  const indexKeys = Array.isArray(array) ? array.map((e) => { return e.id; }) : [];
  // parent id
  ckey = ckey || 'parent_id';
  array.forEach(function(e, i) {
    // top level
    if (!e[ckey] || (e[ckey] === e.id)) {
      delete e[ckey];
      menuData.push(_.cloneDeepWith(e)); // 深拷贝
    } else if (Array.isArray(indexKeys)) {
      // 检测ckey有效性
      const parentIndex = indexKeys.findIndex(function(id) {
        return id === e[ckey];
      });
      if (parentIndex === -1) {
        menuData.push(e);
      }
    }
  });
  const findChildren = function(parentArr) {
    if (Array.isArray(parentArr) && parentArr.length) {
      parentArr.forEach(function(parentNode) {
        array.forEach(function(node) {
          if (parentNode.id === node[ckey]) {
            if (parentNode.children) {
              parentNode.children.push(node);
            } else {
              parentNode.children = [node];
            }
          }
        });
        if (parentNode.children) {
          findChildren(parentNode.children);
        }
      });
    }
  };
  findChildren(menuData);
  return menuData;
};
