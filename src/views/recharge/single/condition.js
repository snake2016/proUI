/* 档案查询mixin混入 */
import {
  getRegionList,
  getAreaList,
  getArchivesList, // 档案查询
} from "@/api/archivesAPI.js"
export default {
  data() {
    return {
      cdOptions: [
        { label: '用户名称', value: 'userName' },
        { label: '手机号', value: 'tel' },
        { label: '表具地址', value: 'address' },
        { label: '表具编号', value: 'meterNo' },
        { label: '档案编号', value: 'archivesNo' },
        { label: '档案标识', value: 'archivesIdentity' },
      ],
      // 下拉选择值
      cdValue: 'userName',
      // 搜索值
      searchData: {
        userName: '', // 用户名
        tel: '', // 手机号
        regionCode: '', // 区县-编码
        addressAreaCode: '', // 街道小区-编码
        addressName: '', // 详细地址
        meterNo: '', // 表具编号
        archivesNo: '', // 档案编码
        archivesIdentity: '', // 档案标识
      },
      searchResult: [], // 搜索结果
      showResult: true, // 是否显示搜索列表
      loadDisabled: false, // 是否禁止加载更多
      cdPage: 1, // 当前页
      cdSize: 10, // 每页条数
      areaList: [], // 区县列表
      streetList: [], // 街道小区列表
      // 输入框校验
      searchDataRules: {
        userName: [
          {
            validator: (rule, value, callback) => {
              value = value.trim();
              if (this.cdValue == 'userName') {
                if (!value) {
                  callback(new Error('用户名称不可为空'));
                } else if (value.length < 2) {
                  callback(new Error('请至少输入两个字符'));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        tel: [
          {
            validator: (rule, value, callback) => {
              value = value.trim();
              if (this.cdValue == 'tel' && !value) {
                callback(new Error('手机号不可为空'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        regionCode: [
          {
            validator: (rule, value, callback) => {
              value = value.trim();
              if (this.cdValue == 'address' && !value) {
                callback(new Error('区不可为空'));
              } else {
                callback();
              }
            },
            trigger: 'change'
          }
        ],
        addressName: [
          {
            validator: (rule, value, callback) => {
              value = value.trim();
              if (this.cdValue == 'address') {
                if (!value) {
                  callback(new Error('详细地址不可为空'));
                }
                else if (value.length < 2) {
                  callback(new Error('请至少输入两个字符'));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        meterNo: [
          {
            validator: (rule, value, callback) => {
              value = value.trim();
              if (this.cdValue == 'meterNo' && !value) {
                callback(new Error('表具编号不可为空'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        archivesNo: [
          {
            validator: (rule, value, callback) => {
              value = value.trim();
              if (this.cdValue == 'archivesNo' && !value) {
                callback(new Error('档案编号不可为空'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        archivesIdentity: [
          {
            validator: (rule, value, callback) => {
              value = value.trim();
              if (this.cdValue == 'archivesIdentity' && !value) {
                callback(new Error('档案标识不可为空'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
      },
    }
  },
  created: function () {
    // this.getAreaList();
  },
  methods: {
    // 搜索条件发生变化
    searchDataChange(value) {
      // 重置校验
      this.$refs['searchData'].resetFields();
      this.cdPage = 1;
      this.searchResult = [];
      if (this.cdValue == 'address') {
        this.getAreaList();
      }
    },
    // 获取区县列表
    getAreaList() {
      let tenantPlaceCode = this.$ls.get('tenantPlaceCode');
      let cityCode = '';
      if (tenantPlaceCode && tenantPlaceCode.city) {
        cityCode = tenantPlaceCode.city;
      } else {
        this.$message.error("无法查询区县：租户配置信息中未发现省市信息");
        return;
      }
      this.areaList = [];
      this.streetList = [];
      this.addr_detail = '';
      const loading = this.$loading({
        target: ".load-area",
        background: "rgba(255,255,255,0.7)"
      })
      getRegionList({ regionCode: cityCode })
        .then(res => {
          loading.close();
          if (res.data.code == 0) {
            if (res.data && res.data.data && res.data.data.records) {
              this.areaList = res.data.data.records;
            } else {
              this.$message.error("区县查询发生错误-数据格式错误")
            }
          } else {
            let msg = "返回码错误";
            res.data && res.data.message ? msg = res.data.message : 0;
            this.$message.error("区县查询失败：" + msg);
          }
        }).catch(err => {
          loading.close();
          this.$message.error("区县查询发生错误-接口请求失败")
        })
    },
    // 区县变化监听
    areaChange() {
      // 区县变化时，街道小区列表清空
      this.streetList = [];
      this.searchData.addressAreaCode = ""; // 清空已选择的小区
      this.searchData.addr_detail = ''; // 清空已输入的详细地址
      const loading = this.$loading({
        target: ".load-street",
        background: "rgba(255,255,255,0.7)"
      })
      getAreaList(
        {
          regionCode: this.searchData.regionCode,
          size: 9999,
        }
      )
        .then(res => {
          loading.close();
          if (res.data.code == 0) {
            if (res.data && res.data.data && res.data.data.records) {
              this.streetList = res.data.data.records;
            } else {
              this.$message.error("街道小区乡镇村庄查询发生错误-数据格式错误")
            }
          } else {
            let msg = res.data && res.data.message ? res.data.message : "返回码错误";
            this.$message.error("街道小区乡镇村庄查询失败：" + msg);
          }
        }).catch(err => {
          loading.close();
          this.$message.error("街道小区查询发生错误-接口请求失败")
        })
    },
    // 搜索
    search(from) {
      let blankMsg = '搜索结果为空';
      if (from == 2) { blankMsg = '没有更多内容啦' }
      this.showResult = true;
      let loadClass = ".contain .sec-left"
      // let loadClass = ".searchBox-loading";
      // if (this.searchResult.length){
      //   loadClass = ".searchLoading";
      // }
      this.$refs['searchData'].validate(valid => {
        if (valid) {
          let data = {};
          switch (this.cdValue) {
            case 'userName':
              data = {};
              data.userName = String(this.searchData.userName).trim(); // 用户名称
              break;
            case 'tel':
              data = {};
              data.userMobile = String(this.searchData.tel).trim(); // 手机号码
              break;
            case 'address':
              data = {};
              data.regionCode = this.searchData.regionCode; // 区县编号
              data.addressAreaCode = this.searchData.addressAreaCode; // 小区编号
              data.addressName = String(this.searchData.addressName).trim(); // 地址描述
              break;
            case 'meterNo':
              data = {};
              data.meterNo = String(this.searchData.meterNo).trim(); // 表具编号
              break;
            case 'archivesNo':
              data.archivesNo = String(this.searchData.archivesNo).trim(); // 档案编号
              break;
            case 'archivesIdentity':
              data = {};
              data.archivesIdentity = String(this.searchData.archivesIdentity).trim(); // 档案标识
              break;
            default:
              break;
          }
          for (let i in data) {
            if (typeof data[i] == 'string' && data[i].constructor == String) {
              data[i] = data[i].trim();
            }
          }
          const loading = this.$loading({
            target: loadClass,
            background: "rgba(255,255,255,0.7)"
          });
          getArchivesList(
            {
              size: 10,
              current: this.cdPage,
              ...data
            }
          ).then(res => {
            loading.close();
            if (res.data.code == 0) {
              if (res.data && res.data.data && res.data.data.records) {
                if (res.data.data.records.length == 0) {
                  this.$message.info(blankMsg);
                  this.loadDisabled = true;
                  return;
                }
                // 当前页的条数小于size值时，说明没有更多数据了
                if (res.data.data.records.length < this.cdSize) {
                  this.loadDisabled = true;
                }
                let old = this.searchResult;
                this.searchResult = old.concat(res.data.data.records)
              } else {
                this.$message.error("档案查询发生错误-数据格式错误");
              }
            } else {
              let msg = res.data && res.data.message ? res.data.message : "返回码错误";
              this.$message.error("档案查询失败：" + msg);
            }
          }).catch(err => {
            loading.close();
            this.$message.error("档案查询发生错误-接口请求失败");
          });
        } else { }
      })
    },
    // 滚动加载
    addPage() {
      this.cdPage = this.cdPage + 1;
      this.search(2);
    },
    // 初始化搜索页
    initPage() {
      this.cdPage = 1;
      this.searchResult = [];
      this.loadDisabled = false;
      this.search(1);
    },
    // 搜索结果中的项处理
    cd_resolve(item, keyName, type) {
      if (item && item instanceof Object) {
        switch (type) {
          // 情况1
          case 1:
            if (item[keyName]) {
              return item[keyName];
            } else {
              return "--";
            }
          // 情况2，表具地址
          case 2:
            if (!item) { return "--"; }
            let qu = item.regionName ? item.regionName : "";
            let xiaoqu = item.addressAreaName ? item.addressAreaName : "";
            let miaoshu = item.addressName ? item.addressName : "";
            return qu + xiaoqu + miaoshu;
          default:
            return ""
        }
      } else {
        return "--";
      }
    },
    // 关闭搜索结果
    closeSearch() {
      this.showResult = false;
      this.cdPage = 1;
      this.searchResult = [];
    },
  },
}