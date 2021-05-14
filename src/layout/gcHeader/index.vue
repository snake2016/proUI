<!--
 * @Author: spp
 * @Date: 2021-04-19 15:40:06
 * @LastEditors: spp
 * @LastEditTime: 2021-05-13 15:55:31
 * @FilePath: \proUI\src\layout\gcHeader\index.vue
-->
<template>
  <div class="gcHeader">
    <!-- <div class="headerBox">
      <logo :title="userLevel!=0&&tenantType=='water'?'金卡云 · 智慧水务':userLevel!=0&&tenantType=='gas'?'金卡云 · 智慧燃气':''" />
      <div class="right-menu">
        <gcNavMenu></gcNavMenu>
        <user-menu></user-menu>
      </div>
    </div> -->
    <el-row :gutter="10" class="nav-wraper">
        <el-col :span="6">
            <div class="content" :class="{lg: isCollapse}">
                <i class="el-icon" :class="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'"  @click="toggleSidebar"></i>
            </div>
            <!-- 面包屑部分 纯展示 路由中配置 -->
            {{fullPathTitle}}
        </el-col>
        <el-col :span="6" :offset="12" class="right-panel">
            <div class='box-icon'><i class="el-icon-search"></i></div>
            <screenfull class="box-icon" />
            <div class='box-user'>
              <img class="avatar" :src="defaultAvatar" alt="" />
              <span>陈未未</span>
              <i class="el-icon-arrow-down"></i>
            </div>
        </el-col>
    </el-row>
    <el-row :gutter="10">
        <el-col :span="24">
            <gc-multi-tab></gc-multi-tab>
        </el-col>
    </el-row>
  </div>
</template>

<script>
// import Logo from "./Logo";
// import UserMenu from "./UserMenu";
import GcMultiTab from '../gcMultiTab/index.vue';
import { mapGetters } from 'vuex'
import Screenfull from './mod/Screenfull.vue'

export default {
  name: "gcHeader",
  components: {
    GcMultiTab,
    Screenfull,
//     Logo,
//     UserMenu
  },
    computed: {
    ...mapGetters([
      'isCollapse'
    ]),
  },
  watch:{
     $route:{
         handler(to,from){
             this.fullPathTitle=to.meta.fullPathTitle || to.meta.title
         }
     }
  },
  data(){
      return {
          fullPathTitle:this.$route.meta.fullPathTitle || this.$route.meta.title,
          defaultAvatar: require("@/assets/imgs/temp/woman.png"),
      }
  },
  methods:{
    toggleSidebar: function() {
      this.$store.commit('app/TOGGLE_SIDEBAR');
    },

  }
//   computed: {
//     tenantType: function() {
//       return this.$store.state.tenantType;
//     },
//     userLevel:function(){
//       return this.$store.state.userInfo.userLevel;
//     }
//   },
};
</script>

<style lang="scss" scoped>
.gcHeader{
    background: #fff;
    // display: flex;
    // justify-content: space-between
    .row{
        width: 100%;
    }
}
.nav-wraper {
  height: 50px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
  .right-panel {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .box-icon {
      padding: 10px;
      font-size: 16px;
      color: #333;
      cursor: pointer;
    }

    .box-user {
      display: flex;
      align-items: center;
      padding-left: 15px;
      padding-right: 30px;

      .avatar {
        margin-right: 15px;
      }

      .el-icon-arrow-down {
        margin-left: 5px;
        font-size: 13px;
        font-weight: bold;
        cursor: pointer;
      }
    }
  }
}
.content {
      float: left;
      width: calc(100%-275px);
      transition: width ease 0.1s;
      margin-right: 20px;
      &.lg {
         width: calc(100%-65px);
      }
      
      .el-icon {
        display: inline-block;
        margin-left: 20px;
        font-size: 20px;
        color: #2F87FE;
        cursor: pointer;
      }
    }
// .gcHeader {
//   height: 58px;
//   background: rgba(47, 135, 254, 1);
//   box-shadow: 0px 2px 21px 0px rgba(0, 0, 0, 0.05);
//   padding: 0 30px;
//   .headerBox {
//     width: 100%;
//     max-width: 1600px;
//     margin: 0 auto;
//     height: 58px;
//   }
// }
// .right-menu {
//   float: right;
//   display: flex;
//   align-items: center;
//   height: 58px;
// }
</style>

