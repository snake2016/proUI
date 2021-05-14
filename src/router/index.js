/*
 * @Author: spp
 * @Date: 2020-11-12 16:58:33
 * @LastEditors: spp
 * @LastEditTime: 2021-05-13 17:20:31
 * @FilePath: \proUI\src\router\index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import { routes } from './router.config'
import { LS } from '@/utils/storage';

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  routes: routes,
  srcollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        selector: to.hash
      }
    }
  }
})
// 路由权限控制
router.beforeEach((to, from, next) => {
  if (LS.get("token")) {
    let a = to.name;
    let authlist = LS.get("authlist");
    if (!authlist) {
      // 没有任何权限信息时跳转到登录页面
      if (to.path === '/login') {
        next();
      } else if (to.path === '/om-login') {
        next();
      } else {
        if (LS.get('userInfo').isCrossDomain) {
          next({ path: '/om-login' });
        } else {
          next({ path: '/login' });
        }
      }
      return;
    }
    if (a && authlist[a]) {
      // 复制页面地址 新tab打开时自动注入
      if(!sessionStorage.getItem('token')){
        let localToken=LS.get('token') 
        sessionStorage.setItem('token', (localToken+'_auto'))
      }
      next();
    } else {
      // 遗留待优化：此处只能用alert，不能用第三方封装的基于dom的弹窗。
      // alert("抱歉：您访问的页面不存在或者您没有权限访问！")
      Vue.prototype.$notify({
        title: '提示',
        message: "暂无权限访问，请联系系统管理员！",
        offset: 60
      });
      next(false);
    }
  } else {
    if (to.path === '/login') {
      next()
    } else if (to.path === '/om-login') {
      next()
    } else {
      next({ path: '/login' })
    }
  }
})

export default router