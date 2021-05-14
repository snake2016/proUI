<!--
 * @Author: your name
 * @Date: 2020-03-20 11:04:49
 * @LastEditTime: 2021-05-13 17:42:47
 * @LastEditors: spp
 * @Description: In User Settings Edit
 * @FilePath: \proUI\src\App.vue
-->
<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
import { LS, SS } from '@/utils/storage';
export default {
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      isRouterAlive: true
    };
  },
  mounted(){
     // 1.5.0 迭代  处理浏览器多tab登录问题
     let _this=this;
     let sTokenReal=null
     document.addEventListener("visibilitychange", function() {
        const TOKEN=LS.get('accessToken');
        const sTOKEN = sessionStorage.getItem("accessToken");
        if (document.visibilityState === 'visible') {
            sTokenReal =sTOKEN && sTOKEN.split('_')[0];
            if (sTokenReal == "null")
               sTokenReal = null

            // if(!(TOKEN==sTOKEN ||(sTokenReal && TOKEN==sTokenReal)) ){
            if(TOKEN!=sTokenReal){
                if(_this.$route.fullPath=='/login'){
                    location.reload()
                    sessionStorage.setItem("accessToken",TOKEN+'_sync')
                }else{
                    _this.$alert('登录信息发生变化, 页面即将刷新，请重新操作', '提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                            location.reload()
                            sessionStorage.setItem("accessToken",TOKEN+'_sync')
                        }
                    });
                }
            }
        }
        if (document.visibilityState === 'visible' && _this.$route.fullPath=='/login') {
            // location.reload()
            window.postMessage({ type: "FROM_PAGE", method: "connect",text:{"connect":"true"}}, "*");
            window.postMessage({ type: "FROM_PAGE", method: "send",text:{"cmd":"preLoad"}}, "*");
        }
    }); 
  },

  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true;
      });
    }
  }
};
</script>
<style lang="scss">
@import "@/styles/common.scss";
</style>

