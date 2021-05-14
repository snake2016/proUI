/*
 * @Author: spp
 * @Date: 2020-11-12 16:58:31
 * @LastEditors: spp
 * @LastEditTime: 2021-05-07 09:31:46
 * @FilePath: \proUI\src\api\intercept.js
 */
/**
 * axios 数据拦截
 */
import Vue from "vue"
import axios from 'axios'
import store from '@/store'
import router from "@/router/index.js"
import {LS} from '@/utils/storage.js'

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 60000
})

const err = (error) => {
  if(!error.response){
    return Promise.reject(error);
  }

  if (error.response) {
    let status = error.response.status
    if (status === 403) {
      Vue.prototype.$notify({
        title: '提示',
        message: "暂无权限访问，请联系系统管理员！",
        offset: 60
      });
      return Promise.reject(403);
    }
    
    if (status === 401) {
      // 账号长时间未登录或在别处登录，请重新登录
      Vue.prototype.$notify({
        title: '提示',
        message: "账号长时间未登录或在别处登录，请重新登录！",
        offset: 60
      });
      setTimeout(() => {
        store.commit('CLEAR_UESR');
        router.push({ path: "/login" }).catch(err => { console.error(err) })
      }, 1000)
      return Promise.reject(401);
    }
    
    return Promise.reject(error);
  }
};

service.interceptors.request.use(function (config) {
  const TOKEN = LS.get("accessToken");
  config.headers.common['accessToken'] = TOKEN
  
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  return response.data.data
}, err)


export default service