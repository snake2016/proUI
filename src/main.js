/*
 * @Author: spp
 * @Date: 2020-11-12 16:58:33
 * @LastEditors: spp
 * @LastEditTime: 2021-05-13 17:19:58
 * @FilePath: \proUI\src\main.js
 */
import { LS, SS } from '@/utils/storage';
Window.LS=LS;
Window.SS=SS

import Vue from 'vue'
import '@/assets/iconfont/iconfont.js'
import router from '@/router'
import store from '@/store'
import App from './App.vue'

// 引入ElementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { message } from '@/utils/resetMessage.js';
import { notify } from '@/utils/resetNotify.js';
Vue.use(ElementUI);
Vue.prototype.$message = message;
Vue.prototype.$notify = notify;

// 引入vuescroll
import vuescroll from 'vuescroll';
import 'vuescroll/dist/vuescroll.css';
Vue.use(vuescroll);

// 引入时间控件
require('dayjs')

import directives from '@/directive'
Vue.use(directives)

import filters from '@/filters'
Vue.use(filters)

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
