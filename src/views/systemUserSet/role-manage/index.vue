<!--
 * @Author: spp
 * @Date: 2021-04-19 14:49:34
 * @LastEditors: spp
 * @LastEditTime: 2021-05-06 14:53:33
 * @FilePath: \proUI\src\views\systemUserSet\role-manage\index.vue
-->
<template>
  <div class="fill">
    <div class="left-box">
      <div class="head-box">
        <img src="@/assets/imgs/系统用户角色管理-列表.png" alt="" class="f-img">
        <div class="label">角色列表</div>
        <div class="add-box" @click="createRole">
          <img src="@/assets/imgs/系统用户角色管理-增加角色.png" alt="">
        </div>
      </div>
      <div class="content i-l">
        <div class="role-i" 
        :class="[roleActiveIndex == index ? 'active' : '', item.roleId==-99 ? 'null' : '']" 
        v-for="(item, index) in roleList" :key="item.roleId" 
        @click="editRole(item, index)">
          {{item.name}}
        </div>
      </div>
      <div class="zhe1 i1"></div>
      <div class="zhe1 i2"></div>
    </div>
    <div class="right-box">
      <div class="head-box">
        <img src="@/assets/imgs/角色管理-角色权限.png" alt="" class="f-img">
        <div class="label">角色权限</div>
      </div>
      <div class="content">
        <div class="title">基本信息</div>
        <div class="r-name">
          <div class="label">角色名称：</div>
          <el-form ref="roleName" :model="roleName" :rules="roleNameRules">
            <el-form-item class="val" prop="name">
              <el-input
                v-model="roleName.name"
                :title="roleName.name"
                placeholder="请填写"
                size="small"></el-input>
            </el-form-item>
          </el-form>
          <el-button type="primary" size="small" @click="saveRole">保存</el-button>
          <el-button size="small" @click="cancel">取消</el-button>
        </div>
        <div class="title">权限分配</div>
        <el-tree
          ref="permissionTree"
          class="permissionTree"
          empty-text='请先选择角色或保存角色后再分配权限'
          :data="permissionTree"
          :props="permissionProps"
          :default-checked-keys="permissionDefaultKey"
          node-key="groupName"
          show-checkbox
          highlight-current
          :expand-on-click-node="false"
          :check-on-click-node="true"></el-tree>
        <div class="bt-opt">
          <el-button type="primary" size="small" @click="savePermission" :disabled="roleName.roleId==null || roleName.roleId==-99">保存</el-button>
          <el-button size="small" @click="cancel">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import indexMix from './index.js';
export default {
  name: "system-user-set-roleManage",
  mixins: [indexMix]
}
</script>

<style scoped lang="scss">
// @import "@/assets/css/el-form-reset.scss";
@import "./index.scss";
</style>