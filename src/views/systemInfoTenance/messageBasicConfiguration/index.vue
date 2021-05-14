<template>
  <div class="message">
    <div class="message-left">
      <div class="small-box">
        <div
          class="item-title"
          :class="[defaultBlock==='template'?'active-bg':'']"
          @click="defaultBlock='template'"
        >
          <svg
            class="icon"
            aria-hidden="true"
            :class="[defaultBlock==='template'?'active-svg':'']"
          >
            <use xlink:href="#el-icon-xiaoximobanicon" />
          </svg>
          <span :class="[defaultBlock==='template'?'active-text':'']">消息模板维护</span>
        </div>
        <div
          class="item-title"
          :class="[defaultBlock==='sign'?'active-bg':'']"
          @click="defaultBlock='sign'"
        >
          <svg class="icon" aria-hidden="true" :class="[defaultBlock==='sign'?'active-svg':'']">
            <use xlink:href="#el-icon-duanxinqianmingicon" />
          </svg>
          <span :class="[defaultBlock==='sign'?'active-text':'']">短信签名维护</span>
        </div>
      </div>
    </div>
    <div class="message-right">
      <keep-alive>
        <messageTemplate v-if="defaultBlock==='template'"></messageTemplate>
        <messageSign v-else-if="defaultBlock==='sign'"></messageSign>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import messageTemplate from "./messageTemplate/index";
import messageSign from "./messageSign/index";
export default {
  name: "message-basic-configuration",
  components: {
    messageTemplate,
    messageSign
  },
  mixins: [],
  props: {},
  data() {
    return {
      defaultBlock: "template"
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>