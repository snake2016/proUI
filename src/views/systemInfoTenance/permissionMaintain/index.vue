<template>
  <div class="permissionMaintainPage">
    <div class="permission-maintain-nav">
      <ul class="nav-ul">
        <li
          :class="['nav-item-li', {'nav-li-active': definedType ==='permissionsDefined'}]"
          @click="changeNav('permissionsDefined')"
        >
          <svg
            class="icon"
            aria-hidden="true"
            slot="reference"
            style="margin-right:8px;color: red"
            path="fill: rgb(255,255,255)"
            v-if="definedType ==='permissionsDefined'"
          >
            <use xlink:href="#el-icon-quanxian1" />
          </svg>
          <svg
            class="icon"
            aria-hidden="true"
            slot="reference"
            style="margin-right:8px;color: red"
            path="fill: rgb(255,255,255)"
            v-else
          >
            <use xlink:href="#el-icon-quanxianBg-copy" />
          </svg>
          <span>权限定义</span>
        </li>
        <li
          :class="['nav-item-li', {'nav-li-active': definedType ==='resourceDefined'}]"
          @click="changeNav('resourceDefined')"
        >
          <svg
            class="icon demo"
            aria-hidden="true"
            slot="reference"
            fill="red"
            style="margin-right:8px;"
            v-if="definedType ==='resourceDefined'"
          >
            <use xlink:href="#el-icon-diqiu-copy" />
          </svg>
          <svg
            class="icon demo"
            aria-hidden="true"
            slot="reference"
            fill="red"
            style="margin-right:8px;"
            path="fill: rgb(255,255,255)"
            v-else
          >
            <use xlink:href="#el-icon-diqiu" />
          </svg>
          <span>资源定义</span>
        </li>
      </ul>
    </div>
    <div class="permission-maintain-content">
      <keep-alive>
        <permissionsDefined v-if="definedType ==='permissionsDefined'" />
        <resourceDefined v-else />
      </keep-alive>
    </div>
  </div>
</template>
<script>
import permissionsDefined from "./permissionsDefined/index";
import resourceDefined from "./resourceDefined/index";

export default {
  name: "permission-maintain",
  components: {
    permissionsDefined,
    resourceDefined
  },
  data() {
    return {
      definedType: "permissionsDefined"
    };
  },
  methods: {
    changeNav(attr) {
      this.definedType = attr;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>