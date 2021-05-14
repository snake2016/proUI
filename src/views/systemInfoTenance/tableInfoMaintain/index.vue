<template>
  <div class="table-info-maintain-wrap">
    <div class="table-info-maintain-nav">
      <ul class="nav-ul">
        <li
          :class="['nav-item-li', {'nav-li-active': definedType ==='vendorMaintenance'}]"
          @click="changeNav('vendorMaintenance')"
        >
          <svg
            class="icon"
            aria-hidden="true"
            slot="reference"
            style="margin-right:8px;color: red"
            path="fill: rgb(255,255,255)"
            v-if="definedType ==='vendorMaintenance'"
          >
            <use xlink:href="#el-icon-biaojuchangshangicon" />
          </svg>
          <svg
            class="icon"
            aria-hidden="true"
            slot="reference"
            style="margin-right:8px;color: red"
            path="fill: rgb(255,255,255)"
            v-else
          >
            <use xlink:href="#el-icon-biaojuchangshangicon-copy" />
          </svg>
          <span>表具厂商维护</span>
        </li>
        <li
          :class="['nav-item-li', {'nav-li-active': definedType ==='tableTypeMaintenance'}]"
          @click="changeNav('tableTypeMaintenance')"
        >
          <svg
            class="icon demo"
            aria-hidden="true"
            slot="reference"
            fill="red"
            style="margin-right:8px;"
            v-if="definedType ==='tableTypeMaintenance'"
          >
            <use xlink:href="#el-icon-biaoleixingicon-copy" />
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
            <use xlink:href="#el-icon-biaoleixingicon" />
          </svg>
          <span>表类型维护</span>
        </li>
        <li
          :class="['nav-item-li', {'nav-li-active': definedType ==='DTUtypeMaintenance'}]"
          @click="changeNav('DTUtypeMaintenance')"
        >
          <svg
            class="icon demo"
            aria-hidden="true"
            slot="reference"
            fill="red"
            style="margin-right:8px;"
            v-if="definedType ==='DTUtypeMaintenance'"
          >
            <use xlink:href="#el-icon-DTUicon-copy" />
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
            <use xlink:href="#el-icon-DTUicon" />
          </svg>
          <span>DTU类型维护</span>
        </li>
        <li
          :class="['nav-item-li', {'nav-li-active': definedType ==='ICCardTypeMain'}]"
          @click="changeNav('ICCardTypeMain')"
        >
          <svg
            class="icon demo"
            aria-hidden="true"
            slot="reference"
            fill="red"
            style="margin-right:8px;"
            v-if="definedType ==='ICCardTypeMain'"
          >
            <use xlink:href="#el-icon-ickaleixingicon-copy" />
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
            <use xlink:href="#el-icon-ickaleixingicon" />
          </svg>
          <span>IC卡类型维护</span>
        </li>
        <li
          :class="['nav-item-li', {'nav-li-active': definedType ==='thirdPartMaintenance'}]"
          @click="changeNav('thirdPartMaintenance')"
        >
          <svg
            class="icon"
            aria-hidden="true"
            slot="reference"
            style="margin-right:8px;color: red"
            path="fill: rgb(255,255,255)"
            v-if="definedType ==='thirdPartMaintenance'"
          >
            <use xlink:href="#el-icon-biaojuchangshangicon" />
          </svg>
          <svg
            class="icon"
            aria-hidden="true"
            slot="reference"
            style="margin-right:8px;color: red"
            path="fill: rgb(255,255,255)"
            v-else
          >
            <use xlink:href="#el-icon-biaojuchangshangicon-copy" />
          </svg>
          <span>第三方采集平台</span>
        </li>
      </ul>
    </div>
    <div class="table-info-maintain-content">
      <keep-alive>
        <vendorMaintenance v-if="definedType ==='vendorMaintenance'" />
        <tableTypeMaintenance v-if="definedType ==='tableTypeMaintenance'" />
        <DTUtypeMaintenance v-if="definedType ==='DTUtypeMaintenance'" />
        <thirdPartMaintenance v-if="definedType ==='thirdPartMaintenance'" />
        <ICCardTypeMain v-else />
      </keep-alive>
    </div>
  </div>
</template>
<script>
import vendorMaintenance from "./vendorMaintenance/index";// 表具厂商维护
import tableTypeMaintenance from "./tableTypeMaintenance/index";//表类型维护
import DTUtypeMaintenance from "./DTUtypeMaintenance/index";//DTU类型维护
import ICCardTypeMain from "./ICCardTypeMain/index";//IC卡类型维护
import thirdPartMaintenance from "./thirdPartMaintenance/index";// 表具厂商维护


export default {
  name: "table-info-maintain",
  components: {
    vendorMaintenance,
    tableTypeMaintenance,
    DTUtypeMaintenance,
    ICCardTypeMain,
    thirdPartMaintenance
  },
  data() {
    return {
      definedType: "vendorMaintenance"
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