<!--
 * @Description: 
 * @version: 
 * @Author: zhaobo
 * @Date: 2021-05-10 11:11:26
 * @LastEditors: spp
 * @LastEditTime: 2021-05-13 17:01:05
-->
<template>
  <div class="submenu-wrapper">
    <div class="submenu-item" :class="{'active': currentActive === item.name}" 
        v-for="item in subMenuList" :key="item.name" @click="onSubMenuChange(item)">
      <i :class="item.icon" class="el-icon"></i>
      {{item.title}}
    </div>
  </div>
</template>
<script>

export default {
    props: {
        subMenuList: {
            type: Array,
        },
    },
  data() {
    // const defaultSubmenuList = [
    //   {
    //     icon: 'el-icon-menu',
    //     title: '导航一',
    //     path: '/',
    //     name: 'nav1'
    //   },
    //   {
    //     icon: 'el-icon-document',
    //     title: '导航二',
    //     path: '/',
    //     name: 'nav2'
    //   },
    //   {
    //     icon: 'el-icon-setting',
    //     title: '导航三',
    //     path: '/',
    //     name: 'nav3'
    //   },
    // ]
    return {
    //   subMenuList: defaultSubmenuList,
      currentActive: ''
    }
  },
  created(){
    this.currentActive=this.$route.name
  },
  watch:{
    $route(to) {
        this.currentActive=to.name
    },
  },
  methods:{
      onSubMenuChange(item){
        this.currentActive = item.name
        this.$router.push({
            ...item,
        });
        this.$store.commit('tagsView/ADD_TABS', {
            ...item
        });
        
      }
  }
} 
</script>
<style lang="scss" scoped>
  $pale-item-hover-bg-color: #D8E8FE;
  $pale-bg-color: #D8E8FE;
  $pale-item-hover-font-color: #2F87FE;
  $pale-font-color: #4A4A4A;
  $pale-item-border-radius: 8px;
  $item-hover-bg-color: rgba(255, 255, 255, 0.2);
  $bg-color: #2F87FE;
  $item-hover-font-color: white;
  $font-color: #ABCFFE;
  $item-border-radius: 0;
  .submenu-wrapper {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    .submenu-item {
      display: flex;
      line-height: 44px;
      font-size: 13px;
      font-weight: 500;
      color: $font-color;
      border-radius: $item-border-radius;
      overflow: hidden;
      &.active, &:hover {
        background: $item-hover-bg-color;
        color: $item-hover-font-color;
      }
      .el-icon {
        margin: 0 8px 0 14px;
        line-height: 44px;
      }
    }
  }
  .submenu-wrapper.pale {
    .submenu-item {
      border-radius: $pale-item-border-radius;
      color: $pale-font-color;
      &.active, &:hover {
        background: $pale-item-hover-bg-color;
        color: $pale-item-hover-font-color;
      }
    }
  }

  
</style>