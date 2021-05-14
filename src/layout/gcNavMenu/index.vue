<!--
 * @Description: 
 * @version: 
 * @Author: zhaobo
 * @Date: 2021-05-10 09:34:53
 * @LastEditors: spp
 * @LastEditTime: 2021-05-13 16:17:12
-->
<template>
  <div class="homeContainer">
    <div class="navLeft">
      <nav-left  
      :menu-list="permission_routes" 
      :isCollapse="isCollapse" 
      :current-active="currentActive"
      @nav-change="handleNavChange"
      ></nav-left>
    </div>
    
    <transition name="move">
      <sub-nav class="subNav" 
      :current-active-title="currentActiveTitle" 
      v-show="!isCollapse" 
      :subMenuList="currentActivechildren"></sub-nav>
    </transition>
    
  </div>  
</template>

<script>
import { mapGetters } from 'vuex'
import NavLeft from './mod/navLeft'
import SubNav from './mod/subNav'

export default {
  name: 'home',
  components: {
    NavLeft,
    SubNav
  },
  computed: {
    ...mapGetters([
      'isCollapse'
    ]),
  },
  created(){
      this._handleRouter(this.$route.path)
  },
  watch:{
      $route:{
         handler(to,from){ 
            this._handleRouter(to.path)
         }
      }
  },
  data() {
    let permission_routes=this.$store.getters.permission_routes;
    let curRouter=permission_routes[0];
    return { 
      permission_routes,
      currentActive: curRouter.name,
      currentActiveTitle: curRouter.title,
      currentActivechildren:curRouter.children,
    }
  },
  methods: {
    _handleRouter(path){
        let fullpathArr=path && path.split('/');
        this.currentActive=fullpathArr[0] || fullpathArr[1];

        let index=this.permission_routes.findIndex(it=>it.name==this.currentActive)
        this.currentActiveTitle = this.permission_routes[index].title
        this.currentActivechildren=this.permission_routes[index].children
    },
    handleNavChange(item){
      this.currentActive = item.name
      this.currentActiveTitle = item.title
      this.currentActivechildren=item.children
    },
  }
}
</script>

<style lang="scss" scoped>
  .homeContainer {
    display: flex;
    height: 100%;
    
    .navLeft {
      position: relative;
      z-index: 9;
      flex: 0 0 65px;
    }

    .subNav {
      position: relative;
      z-index: 1;
      flex: 0 0 210px;
      // transform: translateX(0);
      &.move-enter-active, &.move-leave-active {
        transition: transform ease 0.1s;
      }
      &.move-leave, &.move-enter-to {
        transform: translateX(0);
      }
      &.move-enter, &.move-leave-to {
        transform: translateX(-100%);
      }
    }
    // .content {
    //   width: calc(100%-275px);
    //   transition: width ease 0.1s;
    
    //   &.lg {
    //      width: calc(100%-65px);
    //   }
      
    //   .el-icon {
    //     display: inline-block;
    //     margin-left: 20px;
    //     font-size: 24px;
    //     color: #2F87FE;
    //   }
    // }
  }
</style>
