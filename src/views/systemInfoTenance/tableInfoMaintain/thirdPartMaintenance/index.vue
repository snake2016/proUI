<template>
  <div class="vendor-maintenance-wrap">
    <div class="query1">
      <el-input
        placeholder="请输入内容"
        @keyup.enter.native="findList(1,10)"
        v-model="fileTerm"
        class="input-with-select"
        size="small"
      >
        <div style="width: 90px" slot="prepend">采集平台名称</div>
        <el-button slot="append" icon="el-icon-search" @click="findList(1,10)"></el-button>
      </el-input>
      <el-button
        class="add-btn"
        v-has="'meterManufacturer_add'"
        size="small"
        @click="addNewVendor"
      >新增第三方采集平台</el-button>
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
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="authType" label="鉴权方式">
             <template slot-scope="scope">{{scope.row.authType==1?'hmac':'不鉴权'}}</template>
        </el-table-column>
        <el-table-column prop="callBackUrl" label="回调地址"></el-table-column>
        <el-table-column prop="hmacKey" label="hmacKey"></el-table-column>
        <el-table-column prop="hmacSecret" label="hmacSecret"></el-table-column>
        <el-table-column prop="thirdPartKey" label="thirdPartKey"></el-table-column>
        <el-table-column prop="thirdPartSecret" label="thirdPartSecret"></el-table-column>
        <el-table-column label="操作" width="70px">
          <template slot-scope="scope">
            <span
              style="color: rgba(47, 135, 254, 1);margin-right: 20px;cursor:pointer"
              @click="changeThirdPart(scope.row)"
            >{{isShow?'修改':'详情'}}</span>
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
      custom-class="create-vendor-main"
      :visible.sync="showDialog"
      width="920px"
      top="20vh"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="clearDialog"
    >
      <div slot="title" class="header-title">
        <img class="columnIcon" src="@/assets/imgs/vendoicon.png" />
        <span class="title-age">{{isEdit?(isShow?'修改采集平台信息':'详情'):'新增采集平台'}}</span>
      </div>
      <div class="dialog_changeDTU">
        <el-form
          ref="vendorForm"
          label-width="100px"
          label-position="left"
          class="create-vendor-main-form"
          :model="details"
          :rules="rules"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="名称："
                style="padding-right: 20px;"
                class="item item-right"
                prop="name"
              >
                <el-input
                  size="small"
                  :disabled="!isShow"
                  v-model="details.name"
                  placeholder="请输入名称"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item
                label="鉴权方式："
                style="padding-left: 50px;"
                class="item item-right"
                prop="authType"
              >
                  <el-radio-group v-model="details.authType" :disabled="!isShow">
                    <el-radio :label="0">不鉴权</el-radio>
                    <el-radio :label="1">hmac</el-radio>
                  </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="18">
              <el-form-item
                label="回调地址："
                style="padding-right: 20px;"
                class="item item-right"
                prop="callBackUrl"
              >
                <el-input
                  size="small"
                  :disabled="!isShow"
                  v-model="details.callBackUrl"
                  placeholder="请输入回调地址"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer" v-if="isShow">
        <el-button
          style="width: 80px;"
          class="el-button--primary"
          size="small"
          @click="sureOk"
        >{{isEdit?'确认修改':'确认新增'}}</el-button>
        <el-button style="width: 80px" size="small" @click="clearDialog">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {  
  addThirdPart,
  updateThirdPart,
  queryThirdPartList,
  getThirdPartById
} from "@/api/tableInfoMaintain.js";
export default {
  name: "third_part",
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
      query: "name",
      fileTerm: "",
      showDialog: false,
      ops: window.scrollOps, // 滚动条
      //  弹框里面的内容
      isEdit: false,
      details: {
        callBackUrl: "",
        authType:'',
        name: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: "采集平台名称不能为空",
            trigger: ["change","blur"]
          },
          {
            validator: (rule, value, callback) => {
              if (value == null || value.toString().trim() == "") {
                callback("采集平台名称不能为空");
                return;
              }
              if (value.toString().trim().length > 128) {
                callback("请勿超过128字数");
                return;
              }
              callback();
            }
          }
        ],
        authType: [
          {
            required: true,
            message: "鉴权方式不能为空",
            trigger: ["change","blur"]
          }
        ],
        callBackUrl: [
          {
            required: true,
            message: "回调地址不能为空",
            trigger: ["change","blur"]
          },
           {
            validator: (rule, value, callback) => {
              if (value == null || value.toString().trim() == "") {
                callback("回调地址不能为空");
                return;
              }
              if (value.toString().trim().length > 128) {
                callback("请勿超过128字数");
                return;
              }
              callback();
            }
          }
        ],
      },
      isShow: true
    };
  },
  computed: {},
  created() {
    this.findList(1, 10);
  },
  components: {},
  methods: {
    //新增表具厂商
    addNewVendor() {
      this.showDialog = true
    },
    // 切换查询条件
    queryFun(val) {
      this.fileTerm = "";
    },
    // changeThirdPart(row){
    //     this.showDialog = true;
    //     this.isEdit = true;
    //     this.details = row;
    // },
    // 精准查询列表
    findList(page, size) {
      // 传参
      let _attr = {
        current: page,
        size: size
      };
      this.currentPage = page;
      this.pageSize = size;
      _attr[this.query] = this.fileTerm.trim();
      const loading = this.$loading({
        target: ".List",
        background: "rgba(255,255,255,0.7)"
      });
      queryThirdPartList(_attr)
        .then(res => {
          loading.close();
          if (res.data.code == 0) {
            this.tableData = res.data.data.records || [];
            this.dataNum = res.data.data.total || 0;
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          loading.close();
          this.tableData = [];
          this.$message.error(err.message);
        });
    },
    //改变每页显示条数
    handleSizeChange(size) {
      this.pageSize = size;
      this.findList(this.currentPage, size);
    },
    //翻页方法
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.findList(currentPage, this.pageSize);
    },
     clearDialog() {
        this.details= {
            callBackUrl: "",
            authType:'',
            name: "",
        }
      this.$refs.vendorForm.resetFields();
      this.showDialog = false;
      this.isEdit = false;
    },
    sureOk() {
      let that = this;
      for (let i in that.details) {
        if (
          typeof that.details[i] == "string" &&
          that.details[i].constructor == String
        ) {
          that.details[i] = that.details[i].trim();
        }
      }
      this.$refs.vendorForm.validate(valid => {
        if (valid) {
          const loading = this.$loading({
            target: ".List",
            background: "rgba(255,255,255,0.7)"
          });
          if (that.isEdit) {
            let attr = {
              thirdPartId:that.details.thirdPartId,
              name: that.details.name,
              authType: that.details.authType,
              callBackUrl: that.details.callBackUrl
            };
            updateThirdPart(attr)
              .then(res => {
                loading.close();
                if (res.data.code == 0) {
                  that.$message.success("修改成功");
                  that.findList(that.currentPage, that.pageSize);
                  that.clearDialog();
                } else {
                  that.$message.error(res.data.message);
                }
              })
              .catch(err => {
                loading.close();
                that.$message.error(err.message);
              });
          } else {
            let attr = {
              name: that.details.name,
              authType: that.details.authType,
              callBackUrl: that.details.callBackUrl
            };
            addThirdPart(attr)
              .then(res => {
                loading.close();
                if (res.data.code == 0) {
                  that.$message.success("新增成功");
                  that.findList(that.currentPage, that.pageSize);
                  that.clearDialog();
                } else {
                  that.$message.error(res.data.message);
                }
              })
              .catch(err => {
                loading.close();
                that.$message.error(err.message);
              });
          }
        } else {
          return false;
        }
      });
    },
   changeThirdPart(attr) {
      const loading = this.$loading({
        target: ".List",
        background: "rgba(255,255,255,0.7)"
      });
      debugger
      getThirdPartById({
        thirdPartId: attr.thirdPartId
      }).then(res => {
          loading.close();
          if (res.data.code == 0) {
            this.details = res.data.data;
            // this.showICTypeDialog = true;
            // this.isEdit = true;
            this.showDialog = true;
            this.isEdit = true;
            // this.details = row;
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          loading.close();
          this.$message.error(err.message);
        });
    },
},
  mounted() {}
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
::v-deep .el-dialog__header {
  border-bottom: 1px solid #e6e6e6;
  padding: 16px 40px;
}
::v-deep .create-vendor-main .el-dialog__body {
  .dialog_changeDTU {
    width: 100%;
    min-height: 210px;
    max-height: 390px;
    padding: 24px 40px 0;
    position: relative;
    overflow: auto;
    .operation {
      color: #ababab;
      font-size: 14px;
      margin-bottom: 0;
      margin-top: 26px;
      .operation_div {
        display: inline-block;
        margin-right: 20px;
      }
    }
  }
}
</style>