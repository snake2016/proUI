/*
 * @Author: ljj
 * @Date: 2020-08-19 09:38:04
 * @LastEditTime: 2021-05-08 16:54:52
 * @LastEditors: spp
 * @Description: 按钮权限控制
 * @FilePath: \proUI\src\directive\has.js
 */

import Vue from 'vue'
import  {LS} from '@/utils/storage.js'

// 权限检查
Vue.prototype.$_has = function (value) {
//   let btnAuth = LS.get.get("btAuthList") || null;
  let btnAuth = LS.get("authlist") || null;
  let btnArr = btnAuth ? Object.keys(btnAuth) : null;
  if (btnArr) {
    let index = btnArr.indexOf(value);
    if (index != -1) {
      return true;
    } else {
      return false;
    }
  } else {
    return false
  }
}

const has = {
  bind: function (el, binding, vnode) {
    let value = binding.value || '';
    // 判断按钮是否显示
    if (!Vue.prototype.$_has(value)) {
      el.style.display = 'none';
    }
  }
}

export default has

