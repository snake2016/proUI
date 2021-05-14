<!--
 * @Author: spp
 * @Date: 2021-04-19 15:37:48
 * @LastEditors: spp
 * @LastEditTime: 2021-05-13 14:47:09
 * @FilePath: \proUI\src\layout\index.vue
-->
<template>
<el-container>
  <el-aside width="auto">
      <gc-nav-menu></gc-nav-menu>
  </el-aside>
  <el-container>
    <el-header>
        <gc-header></gc-header>
    </el-header>
    <el-main>
        <!-- <keep-alive :include="keepComs"> -->
        <keep-alive>
          <router-view :key="key"/>
        </keep-alive>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
import GcHeader from './gcHeader/index.vue';
import GcNavMenu from './gcNavMenu/index.vue';
// import gcHeader from "./mod/gcHeader";
// import gcMultiTab from "./mod/gcMultiTab";
// import notice from "./notice.js";
// import { DataList } from "@/api/archivesAPI.js";
export default {
  name: "BasicLayout",
  components: {
    // gcMultiTab,
    GcNavMenu,
    GcHeader
  },
//   mixins: [notice],
//   data() {
//     return {
//       ops: window.scrollOps // 滚动条
//     };
//   },
  computed: {
    // 缓存的组件
    // keepComs: {
    //   get: function() {
    //     return this.$store.state.keepComs;
    //   },
    //   set: function() {}
    // },
    key() {
        return this.$route.name !== undefined? this.$route.name + +new Date(): this.$route + +new Date()
    }
  },
//   created() {
//     // 获取数据字典
//     DataList()
//       .then(res => {
//         this.$ls.set("DataList", res.data);
//       })
//       .catch(err => {
//         console.error("数据字典获取出错", err);
//       });
//   },
//   methods: {},
//   beforeDestroy() {},
//   mounted() {},
//   updated() {},

//   // FEAT: 页面刷新重新连接 notice websocket
//   beforeRouteEnter: (to, from , next) => {
//     next((vm) => {
//       const isConnected = vm.$store.state.socket.isConnected
//       if(!isConnected) {
//         vm.$connect()
//       }
//     })
//   },
};
</script>

<style scoped lang="scss">
.el-container{
    height: 100%;
    .el-header{
        height: auto !important
    }
}
.banner {
  width: 100%;
  height: 36px;
//   background: url("~@/assets/imgs/banner.png") no-repeat center;
  background-size: cover;
  transition: height 0.3s;
  &.show {
    height: 36px;
  }
  &.hide {
    height: 0;
  }
  .banner-content {
    width: 60%;
    height: 100%;
    margin: auto;
    color: #ffffff;
    font-size: 12px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    overflow: hidden;
    white-space: nowrap;
    .content-icon {
      display: inline-block;
      .icon {
        width: 16px;
        height: 16px;
        margin-right: 8px;
        vertical-align: middle;
      }
    }
    .content-notice {
      width: calc(100% - 24px);
      overflow: hidden;
      // 公告父容器
      .notice {
        position: relative;
        height: 20px;
        white-space: nowrap;
        // 公告子元素
        #notifi {
          position: absolute;
          display: inline-flex;
          align-items: center;
          top: 0;
          height: 100%;
          white-space: nowrap;
        }
      }
      .hide {
        position: absolute;
        z-index: -9999;
        top: -9999px;
        white-space: nowrap;
      }
    }
  }
}

.el-main {
  width: 100%;
  max-width: 1600px;
  height: calc(100% - 96px);
  margin: 0 auto;
  padding: 14px 0 11px 0;
  box-sizing: border-box;
  background-color: #ebf1f6;

  overflow: hidden;
}
.workBench-content {
  height: calc(100% - 41px);
  background-color: #f7f8fd;
  padding: 14px 20px;
  box-sizing: border-box;
  border-radius: 4px;
  /* 解决高度过低时候工作台显示不完整 */
  overflow: auto;
}
@media screen and (max-width: 1600px) {
  .el-main {
    $a: 32px;
    padding-left: $a;
    padding-right: $a;
  }
}
</style>
