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
        <el-select v-model="query" style="width: 130px" slot="prepend">
          <el-option key="manufacturerCode" label="厂商编码" value="manufacturerCode"></el-option>
          <el-option key="manufacturerName" label="厂商名称" value="manufacturerName"></el-option>
          <el-option key="contactName" label="联系人" value="contactName"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="findList(1,10)"></el-button>
      </el-input>
      <el-button
        class="add-btn"
        v-has="'meterManufacturer_add'"
        size="small"
        @click="addNewVendor"
      >新增表具厂商</el-button>
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
        <el-table-column prop="manufacturerCode" label="厂商编码"></el-table-column>
        <el-table-column prop="manufacturerName" label="厂商名称"></el-table-column>
        <el-table-column prop="manufacturerAddress" label="厂商地址"></el-table-column>
        <el-table-column prop="contactName" label="联系人"></el-table-column>
        <el-table-column prop="contactPhone" label="联系电话"></el-table-column>
        <el-table-column prop="fax" label="传真"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column label="操作" width="70px">
          <template slot-scope="scope, data">
            <span
              style="color: rgba(47, 135, 254, 1);margin-right: 20px;cursor:pointer"
              @click="changeManufacturer(scope.row)"
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
        <span class="title-age">{{isEdit?(isShow?'修改表具厂商':'详情'):'新增表具厂商'}}</span>
      </div>
      <div class="dialog_changeDTU">
        <el-form
          ref="vendorForm"
          label-width="120px"
          label-position="left"
          class="create-vendor-main-form"
          :model="details"
          :rules="vendoMaintenanceRules"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="厂商编码："
                style="padding-right: 20px;"
                class="item item-right"
                prop="manufacturerCode"
              >
                <el-input
                  size="small"
                  :disabled="!isShow"
                  v-model="details.manufacturerCode"
                  placeholder="请输入厂商编码"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="厂商名称："
                style="padding-right: 20px;"
                class="item item-right"
                prop="manufacturerName"
              >
                <el-input
                  size="small"
                  :disabled="!isShow"
                  v-model="details.manufacturerName"
                  placeholder="请输入厂商名称"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label="厂商地址："
                style="padding-right: 20px;"
                class="item item-right"
                prop="manufacturerAddress"
              >
                <el-input
                  size="small"
                  :disabled="!isShow"
                  v-model="details.manufacturerAddress"
                  placeholder="请输入厂商地址"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="联系人："
                style="padding-right: 20px;"
                class="item item-right"
                prop="contactName"
              >
                <el-input
                  size="small"
                  :disabled="!isShow"
                  v-model="details.contactName"
                  placeholder="请输入联系人"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="联系电话："
                style="padding-right: 20px;"
                class="item item-right"
                prop="contactPhone"
              >
                <el-input
                  size="small"
                  :disabled="!isShow"
                  v-model="details.contactPhone"
                  placeholder="请输入联系电话"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="传真："
                style="padding-right: 20px;"
                class="item item-right"
                prop="fax"
              >
                <el-input
                  size="small"
                  :disabled="!isShow"
                  v-model="details.fax"
                  placeholder="请输入传真"
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
  getManufacturerList,
  addManufacturer,
  getManufacturerDetails,
  updateManufacturer
} from "@/api/tableInfoMaintain.js";
export default {
  name: "vendor-maintenance",
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
      query: "manufacturerCode",
      fileTerm: "",
      showDialog: false,
      ops: window.scrollOps, // 滚动条
      //  弹框里面的内容
      isEdit: false,
      details: {
        contactName: "",
        contactPhone: "",
        createStaffId: "",
        createTime: "",
        fax: "",
        manufacturerAddress: "",
        manufacturerCode: "",
        manufacturerId: "",
        manufacturerName: "",
        modifyStaffId: "",
        modifyTime: ""
      },
      vendoMaintenanceRules: {
        manufacturerCode: [
          {
            required: true,
            message: "厂商编号不能为空",
            trigger: "change"
          },
          {
            validator: (rule, value, callback) => {
              if (value == null || value.toString().trim() == "") {
                callback("厂商编号不能为空");
                return;
              }
              if (value.toString().trim().length > 32) {
                callback("请勿超过32字数");
                return;
              }
              callback();
            }
          }
        ],
        manufacturerName: [
          {
            required: true,
            message: "厂商名称不能为空",
            trigger: "change"
          },
          {
            validator: (rule, value, callback) => {
              if (value == null || value.toString().trim() == "") {
                callback("厂商名称不能为空");
                return;
              }
              if (value.toString().trim().length > 32) {
                callback("请勿超过32字数");
                return;
              }
              callback();
            }
          }
        ],
        manufacturerAddress: [
          {
            required: true,
            message: "厂商地址不能为空",
            trigger: "change"
          },
          {
            validator: (rule, value, callback) => {
              if (value == null || value.toString().trim() == "") {
                callback("厂商地址不能为空");
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
        contactName: [
          {
            required: true,
            message: "联系人不能为空",
            trigger: "change"
          },
          {
            validator: (rule, value, callback) => {
              if (value == null || value.toString().trim() == "") {
                callback("联系人不能为空");
                return;
              }
              if (value.toString().trim().length > 32) {
                callback("请勿超过32字数");
                return;
              }
              callback();
            }
          }
        ],
        contactPhone: [
          {
            validator: (rule, value, callback) => {
              if (value == null || value.toString().trim() == "") {
                callback();
                return;
              }
              if (value.toString().trim().length > 16) {
                callback("请勿超过16字数");
                return;
              }
              callback();
            }
          }
        ],
        fax: [
          {
            validator: (rule, value, callback) => {
              if (value == null || value.toString().trim() == "") {
                callback();
                return;
              }
              if (value.toString().trim().length > 32) {
                callback("请勿超过32字数");
                return;
              }
              callback();
            }
          }
        ]
      },
      userRoleName: "",
      isShow: true
    };
  },
  computed: {},
  created() {
    this.userRoleName = this.$ls.get("userGradeName");
    this.findList(1, 10);
    this.isShow = this.$_has("meterManufacturer_modify");
  },
  components: {},
  methods: {
    //新增表具厂商
    addNewVendor() {
      this.showDialog = true;
    },
    // 切换查询条件
    queryFun(val) {
      this.fileTerm = "";
    },
    changeManufacturer(attr) {
      const loading = this.$loading({
        target: ".List",
        background: "rgba(255,255,255,0.7)"
      });
      getManufacturerDetails({
        manufacturerId: attr.manufacturerId
      })
        .then(res => {
          loading.close();
          if (res.data.code == 0) {
            this.showDialog = true;
            this.isEdit = true;
            if (res.data.data) {
              this.details = res.data.data;
            }
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          loading.close();
          this.$message.error(err.message);
        });
    },
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
      // , { baseURL: "/costDetails/"}
      getManufacturerList(_attr)
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
      this.details = {
        contactName: "",
        contactPhone: "",
        createStaffId: "",
        createTime: "",
        fax: "",
        manufacturerAddress: "",
        manufacturerCode: "",
        manufacturerId: "",
        manufacturerName: "",
        modifyStaffId: "",
        modifyTime: ""
      };
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
              contactName: that.details.contactName,
              contactPhone: that.details.contactPhone,
              fax: that.details.fax,
              manufacturerAddress: that.details.manufacturerAddress,
              manufacturerCode: that.details.manufacturerCode,
              manufacturerId: that.details.manufacturerId,
              manufacturerName: that.details.manufacturerName
            };
            updateManufacturer(attr)
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
              contactName: that.details.contactName,
              contactPhone: that.details.contactPhone,
              fax: that.details.fax,
              manufacturerAddress: that.details.manufacturerAddress,
              manufacturerCode: that.details.manufacturerCode,
              manufacturerName: that.details.manufacturerName
            };
            addManufacturer(attr)
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
    }
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