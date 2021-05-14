<template>    
  <div class="permissionMaintainPage">
    <div class='permission-maintain-nav'>
      <ul class='nav-ul'>
        <li :class="['nav-item-li', {'nav-li-active': definedType ==='templateRole'}]" @click="changeNav('templateRole')">
          <svg
            class="icon"
            aria-hidden="true"
            slot="reference"
            style="margin-right:8px;color: red"
            path='fill: rgb(255,255,255)'
            v-if="definedType ==='templateRole'"
          >
            <use xlink:href="#el-icon-mobanjiaoseicon" />
          </svg>
          <svg
            class="icon"
            aria-hidden="true"
            slot="reference"
            style="margin-right:8px;color: red"
            path='fill: rgb(255,255,255)'
            v-else
          >
            <use xlink:href="#el-icon-mobanjiaoseicon-copy" />
          </svg>
          <span>模板角色</span>
        </li>
        <li :class="['nav-item-li', {'nav-li-active': definedType ==='templateRoleGroup'}]" @click="changeNav('templateRoleGroup')">
          <svg
            class="icon"
            aria-hidden="true"
            slot="reference"
            style="margin-right:8px;color: red"
            path='fill: rgb(255,255,255)'
            v-if="definedType ==='templateRoleGroup'"
          >
            <use xlink:href="#el-icon-jiaosezuicon-copy" />
          </svg>
          <svg
            class="icon"
            aria-hidden="true"
            slot="reference"
            style="margin-right:8px;color: red"
            path='fill: rgb(255,255,255)'
            v-else
          >
            <use xlink:href="#el-icon-jiaosezuicon" />
          </svg>
          <span>模板角色组</span>
        </li>
        <li :class="['nav-item-li', {'nav-li-active': definedType ==='operationRecords'}]" @click="changeNav('operationRecords')">
         <svg
            class="icon"
            aria-hidden="true"
            slot="reference"
            style="margin-right:8px;color: red"
            path='fill: rgb(255,255,255)'
            v-if="definedType ==='operationRecords'"
          >
            <use xlink:href="#el-icon-caozuojiluicon-copy" />
          </svg>
          <svg
            class="icon"
            aria-hidden="true"
            slot="reference"
            style="margin-right:8px;color: red"
            path='fill: rgb(255,255,255)'
            v-else
          >
            <use xlink:href="#el-icon-caozuojiluicon" />
          </svg>
          <span>操作记录</span>
        </li>
      </ul>
    </div>
    <div class='permission-maintain-content'>
      <keep-alive >
         <templateRole v-if="definedType ==='templateRole'"/>
         <templateRoleGroup   v-if="definedType ==='templateRoleGroup'"/>
         <operationRecords v-else/>
      </keep-alive>
    </div>
  </div>
</template>
<script>
import templateRole from './templateRole/index.vue';
import templateRoleGroup from './templateRoleGroup/index.vue';
import operationRecords from './operationRecords/index.vue';

export default {
  name: "tempate-maintain",
  components:{
    templateRole,
    templateRoleGroup,
    operationRecords
  },
  data(){
    return {
      definedType: 'templateRole'
    } 
  },
  methods:{
    changeNav(attr){
      this.definedType = attr;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>