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
  name: "single-recharge",
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
          return item.spMode && item.keepName == "single-recharge";
        });
      },
      set: function() {}
    },
    moreTabList: {
      get: function() {
        return this.$store.state.moreTabList.filter(item => {
          return item.spMode && item.keepName == "single-recharge";
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
  mounted() {},
  methods: {}
};
</script>

<style scoped="">
</style>
