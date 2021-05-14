/*
 * @Author: spp
 * @Date: 2020-11-12 16:58:34
 * @LastEditors: spp
 * @LastEditTime: 2021-01-19 13:58:19
 * @FilePath: \ui\src\views\tenantConfig\detail\index.js
 */
import { hasLetter, convertUTC } from "@/utils/index.js"
export default {
  components: {},
  props: {},
  data() {
    return {
		tabs: [
			{ name: '基本信息', value: 1 },
			{ name: '结构和权限', value: 2 },
			{ name: '表类型开通', value: 3 },
			{ name: 'DTU类型开通', value: 4 },
			{ name: '操作记录', value: 5 },
			{ name: '消息业务配置', value: 6 },
		],
		curTab: 1,
		hasLetter: hasLetter,
		convertUTC: convertUTC,
		userGrade: this.$ls.get('userGrade'),
		btAuthList: this.$store.state.btAuthList,
	};
  },
  props: {
    sp_id: {
      type: String,
      require: true,
      default() { return "" }
    },
  },
  beforeRouteUpdate(to, from, next) {
    next();
    this.pageInit();
  },
  created() {
    if (this.userGrade == 2) {
      this.tabs = [
        { name: "基本信息", value: 1 },
        { name: "组织机构分配", value: 2 },
        { name: "权限模板", value: 7 },
        { name: "表类型开通", value: 3 },
        { name: "DTU类型开通", value: 4 },
        { name: "操作记录", value: 5 },
        { name: "证书管理", value: 8 }
      ]
    } else {
      this.tabs = [
        { name: "基本信息", value: 1 },
        { name: "组织机构分配", value: 2 },
        { name: "权限模板", value: 7 },
        { name: "表类型开通", value: 3 },
        { name: "DTU类型开通", value: 4 },
        { name: "操作记录", value: 5 },
        { name: "消息业务配置", value: 6 },
        { name: "证书管理", value: 8 },
      ]
    }
  },
  mounted() { },
  methods: {
    // 切换tab
    switchTab(value) {
      if (value != 1 && this.tenantId == null) {
        this.$message.info("租户尚未创建，无法访问");
        return;
      }
      this.curTab = value;
      // 组织结构和权限
      if (value == 2) {
        this.getOrgTemplate(); // 获取机构权限模板树
      }
      // 权限
      else if (value == 7) {
        this.getPermission(); // 获取权限
      }
      // 表类型和DTU类型列表
      else if (value == 3 || value == 4) {
        this.ungrantDevice_searchData.type = value == 3 ? 1 : 2;
        this.ungrantDevice_searchData.deviceTypeName = "";
        this.ungrantDevicePD = { page: 1, total: 0, size: 10}
        this.getUngrantDevice(); // 未授权设备列表
        this.getGrantedDevice(); // 已授权设备列表
      }
      else if (value == 5) {
        this.operationRecordsPD = { page: 1, total: 0, size: 10};
        this.getOperationRecords(); // 获取操作记录
      }
      else if (value == 6) {
        // 初始化
        this.messageServicePD = { page: 1, total: 0, pageSize: 10 };
        this.activeService = 2
        this.getMessageList();//获取短信消息列表
      }
    }
  },
}