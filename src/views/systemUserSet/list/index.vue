<template>
  <div class="fill">
    <div class="bt-box">
      <el-button size="small" plain type="primary" @click="showDialog(true)">新增系统用户</el-button>
    </div>
    <div class="tb-box">
      <div class="noData" v-if="!userList.length">
        暂无数据
      </div>
      <el-table
        class="table"
        :data="userList"
        v-if="userList.length">
        <el-table-column prop="name" label="用户名称" width=""></el-table-column>
        <el-table-column label="角色" width="">
          <template slot-scope="scope">
            <div>
              {{roleQL[scope.row.roleId]}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="是否启用白名单" width="">
          <template slot-scope="scope">
            <div>
              {{scope.row.isWhiteList ? "是" : "否"}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机" width="">
          <template slot-scope="scope">
            <div>
              {{scope.row.mobile ? scope.row.mobile : "--"}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="department" label="部门" width="">
          <template slot-scope="scope">
            <div>
              {{scope.row.department ? scope.row.department : "--"}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" width="">
          <template slot-scope="scope">
            <div>
              {{scope.row.remark ? scope.row.remark : "--"}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="">
          <template slot-scope="scope">
            <div class="btSpan" @click="enableUser(scope.row)">{{scope.row.isEnabled ? "禁用" : "启用"}}</div>
            <div class="btSpan" @click="showEdit(scope.row)">编辑</div>
            <div class="btSpan last" @click="goDetail(scope.row)">查看详情</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="fenye" v-if="userList.length">
        <el-pagination
          class="pageLeft"
          background
          @size-change="sizeChange"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageData.size"
          layout="slot,sizes,total"
          :total="pageData.total">
          <span class="fontSize">显示</span>
        </el-pagination>
        <el-pagination
          background
          layout="prev, pager, next, jumper"
          :current-page.sync="pageData.current"
          @current-change="getList"
          :page-size="pageData.size"
          :total="pageData.total"
        ></el-pagination>
      </div>
    </div>
    <el-dialog
      class="edit-dialog"
      :visible.sync="editDialogShow"
      :close-on-click-modal="false"
      @closed="editDialogClosed"
      width="840px">
      <span slot="title" class="dialog-title">{{isAdd ? "新增系统用户" : "编辑系统用户"}}</span>
      <div class="d-box">
        <el-form ref="userData" :model="userData" :rules="userDataRules">
          <div class="row-2">
            <el-form-item class="fo-item" prop="name">
              <div class="label require">用户名称：</div>
              <el-input
                v-model="userData.name"
                class
                size="small"></el-input>
            </el-form-item>
          </div>
          <div class="row-2">
            <el-form-item class="fo-item" prop="roleId">
              <div class="label require">角色：</div>
              <el-select v-model="userData.roleId" placeholder="请选择" size="small">
                <el-option v-for="(value, key) in roleQL" :label="value" :value="key" :key="key"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="row-2">
            <el-form-item class="fo-item" prop="mobile">
              <div class="label">手机：</div>
              <el-input
                v-model="userData.mobile"
                class
                size="small"></el-input>
            </el-form-item>
          </div>
          <div class="row-2">
            <el-form-item class="fo-item" prop="department">
              <div class="label">部门：</div>
              <el-input
                v-model="userData.department"
                class
                size="small"></el-input>
            </el-form-item>
          </div>
          <div class="row-2 remark" style="margin-bottom: 0;height: auto;">
            <el-form-item class="fo-item" prop="remark">
              <div class="label">备注：</div>
              <el-input
                v-model="userData.remark"
                type="textarea"
                resize="none"
                :autosize="{ minRows: 2, maxRows: 4}"
                :rows="2"
                class
                size="small"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="saveUser">确定</el-button>
        <el-button size="small" @click="editDialogShow = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import indexMix from './index.js';
export default {
  name: "system-user-set-list",
  mixins: [indexMix]
}
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>