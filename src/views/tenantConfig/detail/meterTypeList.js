import { ungrantDeviceList, grantedDeviceList, granteDevice, ungranteDevice } from "@/api/tenant.js"
import { meterCategoryQueryList } from "@/utils/queryList/queryList.js"
import { queryAllThirdPartList } from "@/api/tableInfoMaintain.js";
export default {
  components: {},
  props: {},
  data() {
    return {
      // 未授予的设备搜索条件
      ungrantDevice_searchData: {
        deviceTypeName: "", // 表类型名称
        type: 1, // 设备类型: 1表具类型 2-dtu类型
      },
      ungrantDeviceList: [], // 未授予设备列表
      // 分页数据
      ungrantDevicePD: {
        page: 1,
        total: 0,
        size: 10,
      },
      grantedList: [], // 已授予的设备列表
      grantDialogVisible:false,
      third_part_id:0,
      third_part_list:[]
    }
  },
  computed: {
    meterListLabel_deviceTypeName: function () {
      if (this.ungrantDevice_searchData.type == 1) {
        return "表类型名称";
      } else {
        return "DTU类型名称";
      }
    }
  },
  mounted() {},
  methods: {
    // 每页条数变化
    sizeChange_meterList(size) {
      this.ungrantDevicePD.size = size;
      this.getUngrantDevice(1);
    },
    // 获取未授予的设备类型
    getUngrantDevice(initPage) {
      if (initPage === 1) { this.ungrantDevicePD.page = 1; } // 初始化搜索页码
      if (!this.tenantId) {
        this.$message.error("获取未授予的设备类型失败：租户ID为空");
        return;
      }
      const loading = this.$loading({
        target: ".content.meterList",
        background: "rgba(255,255,255,0.7)"
      });
      this.ungrantDeviceList = [];
      ungrantDeviceList({
        current: this.ungrantDevicePD.page,
        size: this.ungrantDevicePD.size,
        tenantId: this.tenantId,
        deviceTypeName: this.ungrantDevice_searchData.deviceTypeName,
        type: this.ungrantDevice_searchData.type,
      }).then(res => {
        if (res.data && res.data.code == 0) {
          let list = [];
          if (res.data.data.records.length) {
            list = res.data.data.records.map(item => {
              if (this.ungrantDevice_searchData.type == 1) {
                item.deviceTypeCategoryTxt = meterCategoryQueryList[item.deviceTypeCategory];
              }
              return item;
            })
          }
          this.ungrantDeviceList = list;
          this.ungrantDevicePD.total = res.data.data.total;
          loading.close();
        } else {
          loading.close();
          let msg = "获取未授予的设备类型失败-返回码错误";
          if (res.data.message) {
            msg = res.data.message;
          }
          this.$message.error(msg);
        }
      }).catch(err => {
        loading.close();
        if (err != 401 && err != 403) {
          this.$message.error("获取未授予的设备类型失败时发生错误");
          console.error("获取未授予的设备类型失败时发生错误", err);
        }
      })
    },
    // 获取已授予的设备类型
    getGrantedDevice() {
      if (!this.tenantId) {
        this.$message.error("获取已授予的设备类型失败：租户ID为空");
        return;
      }
      this.grantedList = [];
      let resData = { tenantId: this.tenantId };
      resData.type = this.ungrantDevice_searchData.type == 1 ? 1 : 2;
      const loading = this.$loading({
        target: ".content.meterList .right-box",
        background: "rgba(255,255,255,0.7)"
      });
      grantedDeviceList(resData).then(res => {
        loading.close();
        if (res.data && res.data.code == 0 && res.data.data && res.data.data.records) {
          let list = [];
          if (res.data.data.records.length) {
            list = res.data.data.records.map(item => {
              if (this.ungrantDevice_searchData.type == 1) {
                item.deviceTypeCategoryTxt = meterCategoryQueryList[item.deviceTypeCategory];
              }
              return item;
            })
          }
          this.grantedList = list;
        } else {
          let msg = "获取已授予设备类型失败-返回码错误";
          if (res.data.message) { msg = res.data.message; }
          this.$message.error(msg);
        }
      }).catch(err => {
        loading.close();
        if (err != 401 && err != 403) {
          this.$message.error("获取已授予设备类型时发生错误");
          console.error("获取已授予设备类型时发生错误", err);
        }
      })
    },
    // 设备授予前添加数据来源
    beforeGrant(id){
        this.findList();
        this.grantDialogVisible=true;
        this.currentGrantId=id
        this.third_part_id=0
    },
    // 获取平台列表
    findList(page, size) {
        const loading = this.$loading({
          target: ".List",
          background: "rgba(255,255,255,0.7)"
        });
        queryAllThirdPartList()
          .then(res => {
            loading.close();
            if (res.data.code == 0) {
              this.third_part_list = res.data.data
            } else {
              this.$message.error(res.data.message);
            }
          })
          .catch(err => {
            loading.close();
            this.third_part_list = [];
            this.$message.error(err.message);
          });
    },
    gotoGrant(){
        this.grantDialogVisible=false;
        this.grant()
    },
    // 设备授予
    grant() {
      let id =this.currentGrantId;
      if (id == null || id == undefined) {
        this.$message.error("无法完成授予：设备ID为空");
        return;
      }
      const loading = this.$loading({
        background: "rgba(255,255,255,0.7)"
      });
      granteDevice({
        tenantId: this.tenantId,
        type: this.ungrantDevice_searchData.type,
        deviceTypeIds: [id],
        thirdPartId:this.third_part_id
      }).then(res => {
        loading.close();
        if (res.data && res.data.code == 0) {
          // this.ungrantDeviceList.splice(index, 1); // 删除授予成功的列表项
          this.$message.success("设备授予成功");
          if (this.ungrantDeviceList.length == 1) {
            this.getUngrantDevice(1); // 重新获取未授予的设备列表-返回第一页
          } else {
            this.getUngrantDevice(); // 重新获取未授予的设备列表
          }
          this.getGrantedDevice(); // 重新获取已授予的设备列表
        } else {
          let msg = "设备授予失败-返回码错误";
          if (res.data.message) { msg = res.data.message; }
          this.$message.error(msg);
        }
      }).catch(err => {
        loading.close();
        if (err != 401 && err != 403) {
          this.$message.error("设备授予时发生错误");
          console.error("设备授予时发生错误", err);
        }
      })
    },
    // 设备类型撤销授予
    ungrant(id, index) {
      if (id == null || id == undefined) {
        this.$message.error("无法完成撤销：设备ID为空");
        return;
      }
      const loading = this.$loading({
        background: "rgba(255,255,255,0.7)"
      });
      ungranteDevice({
        tenantId: this.tenantId,
        type: this.ungrantDevice_searchData.type,
        deviceTypeIds: [id],
      }).then(res => {
        loading.close();
        if (res.data && res.data.code == 0) {
          // this.grantedList.splice(index, 1); // 删除已授予列表中对应项
          this.$message.success("撤销授予成功");
          this.getUngrantDevice(); // 重新获取未授予的设备列表
          this.getGrantedDevice(); // 重新获取已授予的设备列表
        } else {
          let msg = "撤销授予失败-返回码错误";
          if (res.data.message) { msg = res.data.message; }
          this.$message.error(msg);
        }
      }).catch(err => {
        loading.close();
        if (err != 401 && err != 403) {
          this.$message.error("撤销授予时发生错误");
          console.error("撤销授予时发生错误", err);
        }
      })
    },
  }
}