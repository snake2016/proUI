<!--
 * @Author: spp
 * @Date: 2020-11-27 17:28:55
 * @LastEditors: spp
 * @LastEditTime: 2021-05-13 17:43:01
 * @FilePath: \proUI\src\layout\gcMultiTab\index.vue
-->
<template>
  <div>
    <el-tabs
      @tab-remove="removeTab"
      @tab-click="tabClick"
      v-model="activeIndex"
      @contextmenu.native.prevent="openContextMenu($event)"
      type="card"
    >
      <el-tab-pane
        v-for="item in openTabs"
        :key="item.name"
        :label="item.title || item.meta.title"
        :name="item.name"
        :closable="item.name !== 'workBench'"
      >
      </el-tab-pane>
    </el-tabs>

    <transition name="fade">
      <div
        v-show="contextMenuVisible"
        :style="{ left: contextMenuLeft + 'px', top: contextMenuTop + 'px' }"
        class="context-menu"
      >
        <div class="triangle"></div>
        <div class="menu-list" @click="closeAllTabs">关闭所有标签</div>
      </div>
    </transition>
  </div>
</template>

<script>
import _ from 'underscore';
// import { hasQuery } from '@/utils/index';
import { LS, SS } from '@/utils/storage';
export default {
  data() {
    return {
      contextMenuVisible: false,
      contextMenuLeft: 0,
      contextMenuTop: 0,
    };
  },
  created() {
    // 刷新时以当前路由做为tab加入tabs
    // 当前路由不是首页时，添加首页以及另一页到store里，并设置激活状态
    // 当当前路由是首页时，添加首页到store，并设置激活状态
    this.initTabs();
    const inOpenTab = (name) =>  _.findIndex(this.openTabs, { name })>-1;
    
    if (inOpenTab(this.$route.name)) {
      this.activeIndex=this.$route.name;

    }
  },
  computed: {
    // isAdmin() {
    //   let userinfo = this.$store.state.permission.userinfo;
    //   return userinfo.userLevel == 0;
    // },
    openTabs() {
      return this.$store.state.tagsView.openTabs;
    },
    activeIndex: {
      get() {
        return this.$store.state.tagsView.activeIndex;
      },
      set(val) {
        this.$store.commit('tagsView/SET_ACTIVE_INDEX', val);
      },
    },
  },
  watch: {
    $route(to) {
        this.$store.commit('tagsView/SET_ACTIVE_INDEX', to.name);
    }
//       //判断路由是否已经打开
//       //已经打开的 ，将其置为active，对比全路径fullPath
//       //未打开的，将其放入队列里，这里加个判断，带参数的不添加
//       let flag = false;
//       let autoCompName = to.name
//         ? to.name
//         : to.fullPath && to.fullPath.replace(/\//, '');

//       for (let item of this.openTabs) {
//         if (item.name === autoCompName) {
//           this.$store.commit('tagsView/SET_ACTIVE_INDEX', {
//             name: autoCompName,
//             path: to.path,
//           });
//           flag = true;
//           break;
//         }
//       }

//       if (!flag && !hasQuery(to.fullPath)) {
//         this.$store.commit('tagsView/ADD_TABS', {
//           path: to.path,
//           name: autoCompName,
//           title: to.meta.title,
//           titleList: to.meta.titleList,
//         });
//         this.$store.commit('tagsView/SET_ACTIVE_INDEX', {
//           name: autoCompName,
//           path: to.path,
//         });
//       }
//     },

//     contextMenuVisible() {
//       if (this.contextMenuVisible) {
//         document.body.addEventListener('click', this.closeContextMenu);
//       } else {
//         document.body.removeEventListener('click', this.closeContextMenu);
//       }
//     },
  },

  methods: {
    initTabs() {
      let localOpenTab = LS.get('openTabs') || [];
      let ifHasDashboard =
        _.findIndex(localOpenTab, { name: 'workBench' }) > -1;

      this.$store.commit(
        'tagsView/RESET_TABS',
        this.isAdmin || this.isAdmin == undefined
          ? [...localOpenTab]
          : [
              ...(ifHasDashboard
                ? []
                : [
                    {
                      path: '/workBench',
                      name: 'workBench',
                      meta: { title: '首页', icon: 'iconhome' },
                      title: '首页',
                    },
                  ]),
              ...localOpenTab,
            ]
      );
    },
    //tab标签点击时，切换相应的路由
    tabClick(tab,event) {
      // FEAT: 刷新页面后清空所有组件缓存，但 tab 标签保留 -> 点击 tab 重新添加进缓存组件
    //   this.$store.commit('tagsView/add_cache_component', {
    //     compName: e.paneName.replace(/\/.*/, ''),
    //     compId: e.paneName.match(/\/(.+)/) ? e.paneName.match(/\/(.+)/)[1] : '',
    //   });
      let tname=tab.name;
      let curtab=this.openTabs.findIndex(it=>it.name==tname)
      let routerPath=this.openTabs[curtab].meta.parentPath+'/'+tname
      this.$router.push({ path: routerPath });
    },
    toggleMenu() {
      this.$store.commit('app/TOGGLE_SIDEBAR');
    },

    isActive(route) {
      return (
        route ===
        (this.$route.name ||
          (this.$route.fullPath && this.$route.fullPath.replace(/\//, '')))
      );
    },
    isAffix(tag) {
      return tag.meta && tag.meta.affix;
    },
    removeTab(view) {
      let viewindex = _.findIndex(this.openTabs, { name: view });
      this.$store.dispatch('tagsView/delete_tabs', view).then(({ openTabs }) => {
        if (this.isActive(view)) {
          this.toLastView(openTabs, view, viewindex);
        }
      });
    },
    toLastView(visitedViews, view, viewindex) {
      // FEAT: viewindex - 1
      const latestView = visitedViews[viewindex - 1];
      if (latestView) {
        this.$router.push(`/${latestView.path.replace(/\//, '')}`);
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'workBench') {
          // to reload home page
          this.$router.replace({ path: '/redirect' + view.path });
        } else {
          this.$router.push('/');
        }
      }
    },
    // FEAT: add right click event
    openContextMenu(e) {
      if (
        e.srcElement.id &&
        window.localStorage.getItem('openTabs') &&
        JSON.parse(window.localStorage.getItem('openTabs')).length > 1 &&
        !this.contextMenuVisible
      ) {
        this.contextMenuVisible = true;
        this.contextMenuLeft = e.x - 10;
        this.contextMenuTop = 45;
      }
    },

    closeAllTabs() {
      this.contextMenuVisible = false;
      LS.remove('openTabs');
    //   this.initTabs();
      this.$router.push('/');
    },

    closeContextMenu() {
      this.contextMenuVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-tabs--card {
  .el-tabs__header {
    .el-tabs__nav {
      border: 0;
    }
    .el-tabs__item {
      border-left: 0;
    }
    .el-tabs__item.is-active {
      border-bottom: 2px solid #404cbf;
      color: #404cbf;
      background: antiquewhite;
    }
    .el-icon-close:before {
      transform: scale(1);
    }
  }
}

::v-deep .el-tabs__item {
  height: 32px;
  line-height: 32px;
  padding: 0 10px;
}
::v-deep .el-tabs__nav-wrap::after {
  background: none;
}
::v-deep .el-tabs__nav-next,
::v-deep .el-tabs__nav-prev {
  line-height: 32px;
  font-size: 18px;
}

::v-deep .el-tabs__item:focus.is-active.is-focus:not(:active) {
  box-shadow: none !important;
}

.context-menu {
  margin: 0;
  background: #666;
  z-index: 3000;
  position: absolute;
  padding: 4px 0;
  border-radius: 4px;
  font-size: 13px;
  color: #9fa7ae;

  .triangle {
    width: 0;
    height: 0;
    padding: 0;
    margin: 0;
    border-style: solid;
    border-width: 5px;
    border-color: transparent transparent #666;
    position: absolute;
    top: -10px;
    left: 20px;
  }

  .menu-list {
    margin: 0;
    padding: 7px 14px;
  }

  .menu-list:hover {
    cursor: pointer;
    color: #fff;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
