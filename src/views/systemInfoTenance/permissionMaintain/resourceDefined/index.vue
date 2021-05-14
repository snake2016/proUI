<template>
  <div class="resource-defined-page">
    <div class="query1">
      <el-input
        placeholder="请输入搜索内容"
        @keyup.enter.native="getList('1','10')"
        v-model="fileTerm"
        class="input-with-select"
        size="small"
      >
        <el-select v-model="query" style="width: 120px" slot="prepend">
          <el-option key="description" label="资源描述" value="description"></el-option>
          <el-option key="resourceId" label="ID" value="resourceId"></el-option>
          <el-option key="subPath" label="路径" value="subPath"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="getList('1','10')"></el-button>
      </el-input>
      <el-button
        size="small"
        class="add-btn-res"
        @click="openedialog"
        style="width: 80px;border:1px solid #2F87FE;color:#2F87FE;margin-right:10px;"
      >新增资源</el-button>
    </div>
    <div class="titleData1">
      <el-table
        :height="tableHeight"
        :data="tableData"
        class="tables"
        :header-cell-style="{background:'#FAFAFA',color:'#222222'}"
      >
        <template slot="empty" class="noData">
          <img class="data-pic" src="@/assets/imgs/temp/noData.png" />
          <p style="margin:0px;">暂无数据</p>
        </template>
        <el-table-column prop="resourceId" width="60px" label="ID"></el-table-column>
        <el-table-column prop="description" label="资源描述"></el-table-column>
        <el-table-column prop="subPath" label="路径"></el-table-column>
        <el-table-column width="120px" label="操作">
          <template slot-scope="scope">
            <span
              style="color: rgba(47, 135, 254, 1);margin-right: 20px; cursor: pointer;"
              @click="editResource(scope.row)"
            >编辑</span>
            <span
              style="color: rgba(236, 107, 96, 1); cursor: pointer;"
              @click="deleteRes(scope.row)"
            >删除</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="page" v-if="tableData.length > 0">
        <el-pagination
          class="pageLeft"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="slot,sizes,total"
          :total="dataNum"
        >
          <span class="fontSize">显示</span>
        </el-pagination>
        <el-pagination
          class="pageRight"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="prev, pager, next, jumper"
          :total="dataNum"
        ></el-pagination>
      </div>
    </div>
    <el-dialog
      :visible.sync="showResourceModal"
      width="640px"
      top="20vh"
      :destroy-on-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="clearModal"
    >
      <div slot="title" class="header-title">
        <img class="columnIcon" src="@/assets/imgs/addResource.png" />
        <span class="title-age">{{isEdit?"修改资源":"新增资源"}}</span>
      </div>
      <div class="add-resource-defined-wrap">
        <el-form
          ref="addResourceForm"
          label-width="100px"
          label-position="left"
          class="ruleForm"
          :rules="changeResourceFormRules"
          :model="resourceJson"
        >
          <el-form-item label="资源描述：" class="item item-right" prop="description">
            <el-input size="small" v-model="resourceJson.description" placeholder="20字以内"></el-input>
          </el-form-item>
          <el-form-item label="路径：" class="item item-right" prop="subPath">
            <el-input size="small" v-model="resourceJson.subPath" placeholder="请输入路径"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          style="width: 80px;"
          class="el-button--primary"
          size="small"
          @click="sureAddResource"
        >{{isEdit?'确认修改':'确定新增'}}</el-button>
        <el-button style="width: 80px;" size="small" @click="showResourceModal=false">取消</el-button>
      </div>
    </el-dialog>
    <gc-confirm-again
      :visible="isDeleteRes"
      title="此操作将删除资源, 是否继续"
      subTitle="删除后数据将无法恢复"
      @onCancel="isDeleteRes=false"
      @onOk="onOkDeleteRes"
    />
  </div>
</template>
<script>
import {
  getResourceList,
  deleteResource,
  addResource,
  updataResourceData
} from "@/api/permissionMaintain.js";

export default {
  name: "resource-defined",
  data() {
    return {
      tableHeight: "calc(100% - 52px)",
      //当前页
      currentPage: 1,
      //初始化总条数
      dataNum: 0,
      //每页显示多少条
      pageSize: 10,
      // 列表数据
      tableData: [],
      // 查询下拉数据
      query: "description",
      showResourceModal: false,
      isEdit: false,
      fileTerm: "",
      resourceJson: {
        description: "",
        subPath: ""
      },
      changeResourceFormRules: {
        description: [
          {
            required: true,
            message: "资源描述不能为空",
            trigger: "change"
          },
          {
            validator: (rule, value, callback) => {
              if (value == null || value.toString().trim() == "") {
                callback("资源描述不能为空");
                return;
              }
              if (value.toString().trim().length > 20) {
                callback("请勿超过20字数");
                return;
              }
              callback();
            }
          }
        ],
        subPath: [
          {
            required: true,
            message: "路径不能为空",
            trigger: "change"
          },
          {
            validator: (rule, value, callback) => {
              if (value == null || value.toString().trim() == "") {
                callback("路径不能为空");
                return;
              }
              callback();
            }
          }
        ]
      },
      isDeleteRes: false,
      tempData: "",
      ops: window.scrollOps // 滚动条
    };
  },
  computed: {},
  components: {},
  methods: {
    // 获取资源列表（能分页的）
    getList(page, size) {
      let _params = {
        size: size,
        current: page
      };
      _params[this.query] = this.fileTerm.trim();
      const loading = this.$loading({
        target: ".List",
        background: "rgba(255,255,255,0.7)"
      });
      getResourceList(_params)
        .then(res => {
          loading.close();
          if (res.data.code == "00") {
            this.tableData = res.data.data.records || [];
            this.dataNum = res.data.data.total || 0;
            this.currentPage = res.data.data.current;
            this.pageSize = res.data.data.size;
          }
        })
        .catch(() => {
          loading.close();
        });
    },
    // 确认删除资源
    onOkDeleteRes() {
      deleteResource({
        id: attr.resourceId
      })
        .then(res => {
          this.isDeleteRes = false;
          if (res.data.code == "00") {
            this.$message({
              type: "success",
              message: "删除资源成功"
            });
            this.getList(1, this.pageSize);
          } else {
            this.$message({
              type: "error",
              message: res.data.message
            });
          }
        })
        .catch(err => {
          this.isDeleteRes = false;
          this.$message({
            type: "error",
            message: err.message
          });
        });
    },
    //  删除资源
    deleteRes(attr) {
      this.isDeleteRes = true;
      this.tempData = attr;
    },
    sureAddResource() {
      this.$refs.addResourceForm.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            this.updateResource();
          } else {
            this.addRes();
          }
        } else {
          return false;
        }
      });
    },
    //  新增资源
    addRes() {
      let loadBtning = this.$loading({
        target: ".List",
        background: "rgba(255,255,255,0.7)"
      });
      for (let i in this.resourceJson) {
        if (
          typeof this.resourceJson[i] == "string" &&
          this.resourceJson[i].constructor == String
        ) {
          this.resourceJson[i] = this.resourceJson[i].trim();
        }
      }
      addResource({
        subPath: this.resourceJson.subPath,
        description: this.resourceJson.description
      })
        .then(res => {
          loadBtning.close();
          if (res.data.code == "00") {
            this.$message({
              type: "success",
              message: "新增资源成功"
            });
            this.showResourceModal = false;
            this.getList(1, this.pageSize);
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          loadBtning.close();
          this.$message.error(err.message);
        });
    },
    // 清除数据
    clearModal() {
      this.resourceJson = {
        description: "",
        subPath: ""
      };
      this.isEdit = false;
      this.showResourceModal = false;
    },
    openedialog() {
      this.showResourceModal = true;
      setTimeout(() => {
        this.$refs.addResourceForm.clearValidate(["description", "subPath"]);
      }, 10);
    },
    // 编辑资源
    editResource(attr) {
      this.isEdit = true;
      this.showResourceModal = true;
      let _attr = _.cloneDeep(attr);
      this.resourceJson = _attr;
      setTimeout(() => {
        this.$refs.addResourceForm.clearValidate(["description", "subPath"]);
      }, 10);
    },
    // 更新资源数据
    updateResource() {
      let loadBtning = this.$loading({
        target: ".List",
        background: "rgba(255,255,255,0.7)"
      });
      for (let i in this.resourceJson) {
        if (
          typeof this.resourceJson[i] == "string" &&
          this.resourceJson[i].constructor == String
        ) {
          this.resourceJson[i] = this.resourceJson[i].trim();
        }
      }
      updataResourceData(this.resourceJson)
        .then(res => {
          loadBtning.close();
          if (res.data.code == "00") {
            this.$message({
              type: "success",
              message: "修改资源成功"
            });
            this.showResourceModal = false;
            this.isEdit = false;
            this.getList(this.currentPage, this.pageSize);
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          loadBtning.close();
          this.$message.error(err.message);
        });
    },
    // 切换查询条件
    queryFun(val) {
      this.fileTerm = "";
    },
    //改变每页显示条数
    handleSizeChange(size) {
      this.pageSize = size;
      this.getList(this.currentPage, size);
    },
    //翻页方法
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.getList(currentPage, this.pageSize);
    }
  },
  created() {
    this.getList(1, 10);
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
::v-deep .el-dialog__header {
  border-bottom: 1px solid #e6e6e6;
  padding: 16px 40px;
}
::v-deep .el-dialog__footer {
  height: 60px;
  padding: 16px 40px;
}
.add-resource-defined-wrap {
  height: 210px;
  padding: 24px 35px 0 40px;
  padding: relative;
  .operation {
    position: absolute;
    left: 40px;
    bottom: 0px;
  }
  .dialog_resource--content {
    width: 100%;
    padding: 24px 0;
  }
}
</style>