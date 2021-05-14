import { tenantChangeLog } from "@/api/tenant.js"
import { isJson } from "../../../utils/common";
export default {
  components: {},
  props: {},
  data() {
    return {
      operationRecords: [], // 操作记录
      operationRecordsPD: {
        page: 1,
        total: 0,
        size: 10,
      },
    }
  },
  mounted() { },
  methods: {
    // 每页条数变化
    sizeChange_operate(size) {
      this.operationRecordsPD.size = size;
      this.getOperationRecords(1);
    },
    // 获取记录
    getOperationRecords(initSearch) {
      if (initSearch === 1) { this.operationRecordsPD.page } // 重新搜索
      // if (!this.tenantId) { this.operationRecords = []; this.$message.error("无法获取操作记录：租户ID为空"); return; }
      const loading = this.$loading({
        target: ".operation-record",
        background: "rgba(255,255,255,0.7)"
      });
      this.operationRecords = [];
      this.operationRecordsPD.total = 0;
      tenantChangeLog({
        page: this.operationRecordsPD.page - 1,
        size: this.operationRecordsPD.size,
        tenantId: this.tenantId ? this.tenantId : undefined,
      }).then(res => {
        loading.close();
        if (res.data && res.data.code == 0 && res.data.data) {
          let list = [];
          if (res.data.data.length) {
            list = res.data.data.map(item => {
              item.operate_time = this.convertUTC(item.operate_time);
              item.beforeJSON = JSON.stringify(item.before);
              item.afterJSON = JSON.stringify(item.after);
              return item;
            })
          }
          this.operationRecords = list;
          this.operationRecordsPD.total = res.data.total_count;
        } else {
          let msg = "获取操作记录失败-返回码错误";
          if (res.data.message) {
            msg = res.data.message;
          }
          this.$message.error(msg);
        }
      }).catch(err => {
        loading.close();
        if (err != 401 && err != 403) {
          this.$message.error("获取操作记录时发生错误");
        }
      })
    },
  }
}