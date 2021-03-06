import Vue from 'vue';

import 'normalize.css/normalize.css';// A modern alternative to CSS resets

import ElementUI from 'element-ui';
import { Message } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en'; // lang i18n

import '@/styles/index.scss'; // global css

import App from './App';
import router from './router';
import store from './store';

import '@/icons'; // icon
import '@/permission'; // permission control

Vue.use(ElementUI, { locale });

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
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});
