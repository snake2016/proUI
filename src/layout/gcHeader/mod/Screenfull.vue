<template>
  <div>
    <i class="el-icon-full-screen" @click="handleToggle"></i>
  </div>
</template>

<script>
import screenfull from "screenfull";

export default {
  name: "Screenfull",
  data() {
    return {
      isFullscreen: false,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    handleToggle() {
      screenfull.toggle();
    },
    change() {
      this.isFullscreen = screenfull.isFullscreen;
    },
    init() {
      if (screenfull.enabled) {
        screenfull.on("change", this.change);
      }
    },
  },
  beforeDestroy() {
    if (screenfull.enabled) {
      screenfull.off("change", this.change);
    }
  },
};
</script>
