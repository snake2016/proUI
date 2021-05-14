<template>
  <div class="fill">
    <template v-for="item in tabList">
      <indexCom :key="item.name" v-show="tabActive == item.name" :sp_id="item.sp_id"></indexCom>
    </template>
    <template v-for="item in moreTabList">
      <indexCom :key="item.name" v-show="tabActive == item.name" :sp_id="item.sp_id"></indexCom>
    </template>
  </div>
</template>
<script>
import indexCom from "./index.vue";
export default {
  name: "system-user-set-detail",
  components: {
    indexCom
  },
  data() {
    return {};
  },
  computed: {
    tabList: {
      get: function() {
        return this.$store.state.tabList.filter(item => {
          return item.spMode && item.keepName == "system-user-set-detail";
        });
      },
      set: function() {}
    },
    moreTabList: {
      get: function() {
        return this.$store.state.moreTabList.filter(item => {
          return item.spMode && item.keepName == "system-user-set-detail";
        });
      },
      set: function() {}
    },
    tabActive: {
      get: function() {
        return this.$store.state.tabActive;
      },
      set: function() {}
    }
  },
  // 组件激活时触发
  activated() {
    this.tabRefresh();
  },
  // 组件之间切换触发
  beforeRouteUpdate(to, from, next) {
    this.tabRefresh();
    next();
  },
  mounted() {},
  methods: {
    // 从父组件触发，触发至子组件的一些操作
    tabRefresh() {
      if (this.$children && this.$children.length) {
        this.$children.forEach(item => {
          if ("systemUserSetDetail_"+item.sp_id == this.tabActive) { // 只触发当前激活标签上的方法
            item.childTabActive();
          }
        })
      }
    },
  },
  watch: {
  }
};
</script>
<style scoped="">
</style>
