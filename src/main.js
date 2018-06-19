import Vue from 'vue';

import 'normalize.css/normalize.css';// A modern alternative to CSS resets
import permission from './permission/index';
import dayjs from 'dayjs';
import ElementUI from 'element-ui';
import { Message } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/components/LjTable';
import '@/styles/index.scss'; // global css
import App from './App';
import router from './router';
import store from './store';

import '@/icons'; // icon
import '@/permission'; // permission control

Vue.use(ElementUI);

Vue.config.productionTip = false;
// 权限指令
Vue.directive('has', {
  bind: function(el, binding) {
    if (!Vue.prototype.$_has(binding.value)) {
      el.parentNode.removeChild(el);
    }
  }
});
Vue.prototype.toast = message => {
  Message({
    message,
    type: 'success'
  });
};
Vue.prototype.errToast = message => {
  Message({
    message,
    type: 'error'
  });
};
Vue.filter('formatterTime', (value) => {
  return dayjs(value).format('YYYY-MM-DD'); // parse
});
Vue.directive('has', {
  bind: function(el, binding) {
    if (!Vue.prototype.$_has(binding.value)) {
      el.parentNode.removeChild(el);
    }
  }
});
new Vue({
  data() {
    return {
      auth: permission
    };
  },
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});
