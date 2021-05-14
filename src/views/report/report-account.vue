<template>
  <div class="list">
    <!-- 筛选项部分 -->
    <div class="filter">
      <div class="filter-title">
        <img src="@/assets/imgs/report/report_title.png" alt />
        <span class="title">账户类型报表筛选</span>
      </div>
      <div class="term-title">
        <el-select v-model="reportType" @change="changeFilter(reportType, filter.countDimension)">
          <el-option label="统计" value="1"></el-option>
          <el-option label="明细" value="2"></el-option>
          <span slot="prefix" class="title-tips">报表类型:</span>
        </el-select>
      </div>
      <div class="filter-term">
        <vue-scroll :ops="ops" ref="vs">
          <el-form
            label-position="top"
            label-width="100px"
            :model="filter"
            ref="rule_filter"
            :rules="rules_filter"
          >
            <span id="a2"></span>
            <el-form-item label="统计维度" v-show="countDimen" prop="countDimension">
              <el-select
                v-model="filter.countDimension"
                @change="
									changeFilter(
										reportType,
										filter.countDimension
									)
								"
							>
								<el-option label="余额" value="1"></el-option>
								<el-option label="月账单" value="2"></el-option>
							</el-select>
						</el-form-item>
						<!-- <el-form-item
							label="开户开始时间"
							prop="startDate1"
							:required="dateTime"
							v-show="balance1"
						>
							<el-date-picker
								:picker-options="pickerBefore"
								type="datetime"
								v-model="filter.startDate1"
								placeholder="选择开户开始时间"
							></el-date-picker>
						</el-form-item>
						<el-form-item
							label="开户结束时间"
							prop="endDate1"
							:required="dateTime"
							v-show="balance1"
						>
							<el-date-picker
								type="datetime"
								placeholder="选择开户结束时间"
								v-model="filter.endDate1"
								:picker-options="pickerAfter"
							></el-date-picker>
						</el-form-item> -->
                         <el-form-item label="开户时间" prop="custDate" v-show="balance1" :required="dateTime">
                            <customDatePicker 
                            :value="filter.custDate" 
                            @change="(val)=>{ filter.custDate = val}"
                            ></customDatePicker>
                        </el-form-item>
						<el-form-item
							label="账单年月"
							prop="billDate"
							v-show="month1"
							:required="dateMonth"
						>
							<el-date-picker
								v-model="filter.billDate"
								type="month"
								placeholder="选择月"
								:picker-options="pickerMonth"
								value-format="yyyy-MM"
							></el-date-picker>
						</el-form-item>
						<el-form-item
							label="分公司"
							prop="orgCodeD"
							v-show="company"
							:required="companyShow"
						>
							<el-select
								v-model="filter.orgCodeD"
								@change="orgFun(filter.orgCodeD)"
							>
								<el-option label="全部" value="0"></el-option>
								<el-option
									v-for="item in orgCodeArrD"
									:key="item.org_code"
									:label="item.name"
									:value="item.org_code"
								></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="营业厅" prop="orgCodeB">
							<el-select
								v-model="filter.orgCodeB"
								placeholder="全部"
							>
								<el-option label="全部" value="0"></el-option>
								<el-option
									v-for="item in orgCodeArr"
									:key="item.org_code"
									:label="item.name"
									:value="item.org_code"
								></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="用户类型" prop="userType">
							<el-select v-model="filter.userType">
								<el-option label="全部" value></el-option>
								<el-option
									:label="item.sortName"
									:value="item.sortValue"
									v-for="item in userTypeDD"
									:key="item.sortValue"
								></el-option>
							</el-select>
						</el-form-item>
						<el-form-item
							label="用户名称"
							v-show="achives2"
							prop="userName"
						>
							<el-input
								placeholder="用户名称"
								v-model="filter.userName"
							></el-input>
						</el-form-item>
						<el-form-item
							label="手机号"
							v-show="achives1"
							prop="mobile"
						>
							<el-input
								placeholder="手机号"
								v-model="filter.mobile"
							></el-input>
						</el-form-item>
						<el-form-item
							label="档案编号"
							v-show="achives2"
							prop="archivesNo"
						>
							<el-input
								placeholder="档案编号"
								v-model="filter.archivesNo"
							></el-input>
						</el-form-item>
						<el-form-item
							label="表具编号"
							v-show="achives2"
							prop="meterNo"
						>
							<el-input
								placeholder="表具编号"
								v-model="filter.meterNo"
							></el-input>
						</el-form-item>
						<el-form-item
							label="表具类型"
							prop="meterTypeId"
							v-show="achives2"
						>
							<el-select
								v-model="filter.meterTypeId"
								filterable
								placeholder="全部"
							>
								<el-option label="全部" value></el-option>
								<el-option
									v-for="(item, index) in meterTypeOptions"
									:label="item.deviceTypeName"
									:value="item.deviceTypeId"
									:key="index"
								></el-option>
							</el-select>
						</el-form-item>
						<el-form-item
							label="价格名称"
							v-show="balance1"
							prop="priceId"
						>
							<el-select
								class="community"
								v-model="filter.priceId"
								filterable
								placeholder="全部"
							>
								<el-option label="全部" value></el-option>
								<el-option
									v-for="item in priceArr"
									:key="item.priceId"
									:label="item.priceName"
									:value="item.priceId"
								></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="区县" prop="regionCode">
							<el-select
								v-model="filter.regionCode"
								placeholder="区/县"
								filterable
								@change="getAreaDataVal(filter.regionCode)"
							>
								<el-option label="全部" value></el-option>
								<el-option
									v-for="item in region"
									:key="item.regionCode"
									:label="item.regionName"
									:value="item.regionCode"
								></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="小区" prop="addressAreaCode">
							<el-select
								v-model="filter.addressAreaCode"
								filterable
								placeholder="街道/小区/乡镇/村庄"
							>
								<el-option label="全部" value></el-option>
								<el-option
									v-for="item in street"
									:key="item.addressAreaCode"
									:label="item.addressAreaName"
									:value="item.addressAreaCode"
								></el-option>
							</el-select>
						</el-form-item>
						<el-form-item
							label="详细地址"
							prop="address"
							v-show="achives2"
						>
							<el-input
								placeholder="详细地址"
								v-model="filter.address"
							></el-input>
						</el-form-item>
					</el-form>
				</vue-scroll>
			</div>
			<div class="filter-func-btn">
				<el-button
					class="filter-func-btn-size"
					@click="resetForm('rule_filter', filter.countDimension)"
					>重置</el-button
				>
				<el-button
					type="primary"
					class="filter-func-btn-size"
					@click="
						submitFilter(
							'rule_filter',
							reportType,
							filter.countDimension,
							'1',
							'10'
						)
					"
        >筛选</el-button>
      </div>
    </div>
    <!-- 报表内容区 -->
    <div class="table">
      <div class="query-func-btn">
        <el-dropdown class="oneMore" trigger="click" @command="downloadFun">
          <el-button
            plain
            size="small"
            :class="tableData != '' ? 'importBtn' : 'default'"
            :disabled="tableData.length <= 0"
          >
            导出报表
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>

          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              :command="
								Down('pdf', reportType, filter.countDimension)
							"
            >PDF下载</el-dropdown-item>
            <el-dropdown-item
              :command="
								Down('excel', reportType, filter.countDimension)
							"
            >Excel下载</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button
          size="small"
          @click="customizeCol"
          v-if="reportType == 2 && tableData.length"
          style="margin-left:10px;"
        >自定义列</el-button>
      </div>
      <div class="titleData">
        <div class="noData" v-if="!tableData.length">
          <img class="data-pic" src="@/assets/imgs/temp/noData.png" />
          <p style="margin:0px;">暂无数据</p>
        </div>
        <!-- 列表 -->
        <el-table
          :height="tableHeight"
          :data="tableData"
          class="tables"
          v-if="tableData.length"
          :header-cell-style="{
						background: '#FAFAFA',
						color: '#222222',
					}"
        >
          <el-table-column
            v-for="item in titleData"
            :prop="item.value"
            :label="item.label"
            :key="item.value"
            min-width="144"
            :formatter="nullFormatter"
          ></el-table-column>
        </el-table>
        <!-- 分页部分 -->
        <div class="page" v-if="tableData.length > 0">
          <el-pagination
            class="pageLeft"
            background
            @size-change="handleSizeChange"
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
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            layout="prev, pager, next, jumper"
            :total="dataNum"
          ></el-pagination>
        </div>
      </div>
    </div>

    <!-- 自定义列弹窗 -->
    <customize-col-dialog
      ref="customizeColDialog"
      :default-options="balanceCheckedTitle"
      :options="balanceDefaultTitle"
      @on-options-change="handleColChange"
    ></customize-col-dialog>
  </div>
</template>

<script>
	import {
		getRegionList,
		getAreaList,
		searchMeterTypeList,
		getPricesListAll,
		getSysDataList,
	} from '@/api/archivesAPI';
	import {
		orgstrutureTree,
		orgstrutureList,
		orgstrutureList_sys,
		orgstrutureSysTree,
	} from '@/api/tenant.js';
	import { getTenantPlace_sys } from '@/api/loginAPI.js';
	import {
		exportReport,
		gasReportBalanceDetail,
		gasReportBalance,
		gasReportBalanceMonth,
	} from '@/api/reportAPI';
    import { removeNullParams,getFormateDate } from '@/utils/index.js';
	//v1.3.0 明细类报表增加自定义列功能
	import CustomizeColDialog from '@com/customizeColDialog/customizeColDialog.vue';
	import {
		getAccountTitle,
		setAccountTitle,
	} from '@com/customizeColDialog/titleData';
	import {
		DEFAULT_DATA,
		DEFAULT_BALANCE_TABLE_TITLE,
	} from './reportAccountData';
    
    import customDatePicker from './customDatePicker'
	export default {
		name: 'report-account',
		data() {
			//账户类报表类型：明细，统计-余额，统计-月账单
			return {
                ...DEFAULT_DATA,
				rules_filter: {
					countDimension: [
						{
							required: true,
							message: '请选择统计维度',
							trigger: 'change',
						},
					],
					// startDate1: [
					// 	{
					// 		validator: (rule, value, callback) => {
					// 			if (
					// 				(value == null || value == '') &&
					// 				this.dateTime
					// 			) {
					// 				callback(new Error('请选择时间'));
					// 				return;
					// 			}
					// 			callback();
					// 		},
					// 	},
					// ],
					// endDate1: [
					// 	{
					// 		validator: (rule, value, callback) => {
					// 			if (
					// 				(value == null || value == '') &&
					// 				this.dateTime
					// 			) {
					// 				callback(new Error('请选择时间'));
					// 				return;
					// 			}
					// 			callback();
					// 		},
					// 	},
                    // ],
                    custDate:[
                        {
							validator: (rule, value, callback) => {
								if (
									(value == null || value == '') &&
									this.dateTime
								) {
									callback(new Error('请选择时间'));
									return;
								}
								callback();
							},
						},
                    ],
					billDate: [
						{
							validator: (rule, value, callback) => {
								if (
									(value == null || value == '') &&
									this.dateMonth
								) {
									callback(new Error('请选择月份'));
									return;
								}
								callback();
							},
						},
					],
					orgCodeD: [
						{
							validator: (rule, value, callback) => {
								if (
									(value == null ||
										value == '' ||
										value == '0') &&
									this.companyShow
								) {
									callback(new Error('请选择分公司'));
									return;
								}
								callback();
							},
						},
					],
				},
				//时间插件限制
				// pickerBefore: {
				// 	disabledDate: (time) => {
				// 		let beginDateVal = this.filter.endDate1;
				// 		if (beginDateVal) {
				// 			return time.getTime() > beginDateVal.getTime();
				// 		}
				// 	},
				// },
				// pickerAfter: {
				// 	disabledDate: (time) => {
				// 		let beginDateVal1 = this.filter.startDate1;
				// 		if (beginDateVal1) {
				// 			return (
				// 				time.getTime() <=
				// 				beginDateVal1.getTime() - 24 * 60 * 60 * 1000
				// 			);
				// 		}
				// 	},
				// },
				pickerMonth: {
					disabledDate: (time) => {
						let date = new Date();
						if (date) {
							return (
								(time.getMonth() >= date.getMonth() &&
									time.getFullYear() == date.getFullYear()) ||
								time.getFullYear() > date.getFullYear()
							);
						}
					},
				},
				balanceCheckedTitle: [], //选中的列 表头
			};
		},
		components: { CustomizeColDialog,customDatePicker },
		methods: {
			nullFormatter(row, column) {
				// 列表项筛选为空显示'--'
				const value = row[column.property];
				if (value === "" || value === null) return "--";
				return value;
			},
			handleColChange(cols) {
				this.titleData = cols;
				setAccountTitle(cols);
			},
			//自定义表头
			customizeCol() {
				this.balanceCheckedTitle = getAccountTitle().map(
					(item) => item.value
				);
				this.$refs.customizeColDialog.showDialog();
			},
			// 表单重置方法
			resetForm(formName, c) {
				this.$refs[formName].resetFields();
				// this.filter.startTime = '';
                // this.filter.endTime = '';
                this.filter.custDate=[]
				this.filter.countDimension = c;
				this.tableData = [];
				this.orgFun(this.filter.orgCodeD);
			},
			// 系统级获取租户所在省市
			getTenantPlaceVal(c) {
				this.region = [];
				this.filter.regionCode = '';
				let tenantObj = {};
				tenantObj['tid'] = this.tenantId;
				tenantObj['code'] = c;
				getTenantPlace_sys(tenantObj)
					.then((res) => {
						if (res.data.code == 0) {
							let city = res.data.data.basic;
							if (Object.keys(city).length != 0) {
								this.getRegionNameVal(city.city);
							}
						}
					})
					.catch((err) => {
						this.$message.error('省市查询错误-接口请求失败');
					});
			},
			getRegionNameVal(data) {
				//市select事件
				this.region = [];
				this.street = [];
				this.filter.addressAreaCode = '';
				getRegionList({ regionCode: data })
					.then((res) => {
						if (res.data.code == 0) {
							if (
								res.data &&
								res.data.data &&
								res.data.data.records
							) {
								this.region = res.data.data.records;
							} else {
								this.$message.error(
									'区查询发生错误-数据格式错误！'
								);
							}
						} else {
							this.$message.error(
								`区查询数据查询失败-${res.data.message}`
							);
						}
					})
					.catch((err) => {
						this.$message.error('区查询发生错误-接口请求失败');
					});
			},
			getAreaDataVal(data) {
				//小区select事件
				this.street = [];
				if (this.filter.addressAreaCode) {
					this.filter.addressAreaCode = '';
				}
				if (data == '') {
					this.street = [];
				} else {
					// 系统级登陆
					if (this.isAdmin == 0) {
						getAreaList({
							regionCode: data,
							size: 9999,
							tenantId: this.tenantId,
							orgCode: this.filter.orgCodeD,
						})
							.then((res) => {
								if (res.data.code == 0) {
									if (
										res.data &&
										res.data.data &&
										res.data.data.records
									) {
										this.street = res.data.data.records;
									} else {
										this.$message.error(
											'小区查询发生错误-数据格式错误！'
										);
									}
								} else {
									this.$message.error(
										`小区查询数据查询失败-${res.data.message}`
									);
								}
							})
							.catch((err) => {
								this.$message.error(
									'小区查询发生错误-接口请求失败'
								);
							});
					} else {
						getAreaList({
							regionCode: data,
							size: 9999,
						})
							.then((res) => {
								if (res.data.code == 0) {
									if (
										res.data &&
										res.data.data &&
										res.data.data.records
									) {
										this.street = res.data.data.records;
									} else {
										this.$message.error(
											'小区查询发生错误-数据格式错误！'
										);
									}
								} else {
									this.$message.error(
										`小区查询数据查询失败-${res.data.message}`
									);
								}
							})
							.catch((err) => {
								this.$message.error(
									'小区查询发生错误-接口请求失败'
								);
							});
					}
				}
			},
			//获取价格列表
			getPricesListData(e) {
				if (e) {
					getPricesListAll({ tenantId: this.tenantId, orgCode: e })
						.then((res) => {
							if (res.data.code == 0) {
								this.priceArr = res.data.data.records;
							} else {
								this.$message.error('价格查询失败');
							}
						})
						.catch((res) => {
							this.$message.error(
								'价格查询发生错误-接口请求失败'
							);
						});
				} else {
					getPricesListAll()
						.then((res) => {
							if (res.data.code == 0) {
								this.priceArr = res.data.data.records;
							} else {
								this.$message.error('价格查询失败');
							}
						})
						.catch((res) => {
							this.$message.error(
								'价格查询发生错误-接口请求失败'
							);
						});
				}
            },
            resetOnSwitch() {
                this.titleData = [];
					this.tableData = [];
					this.filter.custDate=[]
					// this.filter.startDate1 = '';
					// this.filter.endDate1 = '';
					this.filter.billDate = '';
					this.filter.orgCodeD = '0';
					this.filter.orgCodeB = '0';
					this.filter.userType = '';
					this.filter.userName = '';
					this.filter.mobile = '';
					this.filter.archivesNo = '';
					this.filter.meterNo = '';
					this.filter.meterTypeId = '';
					this.filter.priceId = '';
					this.filter.regionCode = '';
					this.filter.addressAreaCode = '';
					this.filter.address = '';
					this.orgFun(this.filter.orgCodeD);
					this.$nextTick(function() {
						this.$refs['rule_filter'].clearValidate();
					});
            },
			// 切换筛选报表条件
			changeFilter(et, cd) {
				if (et == 2) {
					this.countDimen = false;
					this.achives1 = true;
					this.achives2 = true;
					this.balance1 = false;
					this.month1 = false;
					this.dateTime = false;
                    this.dateMonth = false;
                    this.filter.countDimension = "1";
					
				} else if (et == 1 && cd == 1) {
					this.countDimen = true;
					this.balance1 = true;
					this.achives1 = false;
					this.achives2 = false;
					this.month1 = false;
					this.dateTime = true;
					this.dateMonth = false;
					
				} else if (et == 1 && cd == 2) {
					this.countDimen = true;
					this.balance1 = false;
					this.achives1 = false;
					this.dateTime = false;
					this.dateMonth = true;
					this.achives2 = true;
					this.month1 = true;
					
                }
                this.resetOnSwitch()
			},
			// 查询报表
			submitFilter(formName, reportT, cDimension, page, size) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						// if (this.filter.startDate1) {
						// 	let startTime = this.filter.startDate1;
						// 	let endTime = this.filter.endDate1;
						// 	let startDate = new Date(startTime).toJSON();
						// 	// 开始时间格式化
						// 	startDate = new Date(
						// 		+new Date(startTime) + 8 * 3600 * 1000
						// 	)
						// 		.toISOString()
						// 		.replace(/T/g, ' ')
						// 		.replace(/\.[\d]{3}Z/, '');
						// 	let endDate = new Date(endTime).toJSON();
						// 	// 结束时间格式化
						// 	endDate = new Date(
						// 		+new Date(endTime) + 8 * 3600 * 1000
						// 	)
						// 		.toISOString()
						// 		.replace(/T/g, ' ')
						// 		.replace(/\.[\d]{3}Z/, '');
						// 	this.filter['startTime'] = startDate;
						// 	this.filter['endTime'] = endDate;
						// }
						let orgArr = [];
						if (this.filter.orgCodeB == '0') {
							this.orgCodeArr.map((key) => {
								orgArr.push(key.org_code);
							});
						} else {
							orgArr.push(this.filter.orgCodeB);
						}
						this.filter['orgCode'] = orgArr;
						this.filter['size'] = size;
						this.filter['current'] = page;
						if (this.isAdmin == 0) {
							this.filter['tenantId'] = this.tenantId;
						}
						for (let i in this.filter) {
							if (
								typeof this.filter[i] == 'string' &&
								this.filter[i].constructor == String
							) {
								this.filter[i] = this.filter[i].trim();
							}
						}
						const loading = this.$loading({
							target: '.List',
							background: 'rgba(255,255,255,0.7)',
						});
						let reqPromise;
						if (reportT == 1 && cDimension == 1) {
                            // 统计-余额
							this.titleData = this.titleDataBalance;
							reqPromise = () =>
								gasReportBalance(removeNullParams(this.filter));
						} else if (reportT == 1 && cDimension == 2) {
                            // 统计-月账单
							this.titleData = this.titleDataMonth;
							reqPromise = () =>
								gasReportBalanceMonth(
									removeNullParams(this.filter)
								);
						} else if (reportT == 2) {
                            // 明细
							this.titleData = getAccountTitle();
							reqPromise = () =>
								gasReportBalanceDetail(
									removeNullParams(this.filter)
								);
						}
						reqPromise()
							.then((res) => {
								loading.close();
								let data = res.data.data;
								if (res.data.code == 0) {
									if (data) {
										this.currentPage = data.current;
										this.dataNum = data.total;
										this.pageSize = data.size;
										if (data.records.length > 0) {
											this.tableData = data.records;
										} else {
											this.tableData = [];
											this.$message.info('查询结果为空');
										}
									} else {
										this.tableData = [];
									}
								} else {
									this.tableData = [];
									this.$message.error(res.data.message);
								}
							})
							.catch((err) => {
								loading.close();
								if (err != 401 && err != 403) {
									this.$message.error('获取报表时发生错误');
									console.error('获取报表时发生错误', err);
								}
							});
					} else {
						this.$refs['vs'].scrollIntoView('#a2', 500);
					}
				});
			},
			//改变每页显示条数
			handleSizeChange(size) {
				this.pageSize = size;
				this.submitFilter(
					'rule_filter',
					this.reportType,
					this.filter.countDimension,
					'1',
					size
				);
			},
			//翻页方法
			handleCurrentChange: function(currentPage) {
				this.currentPage = currentPage;
				this.submitFilter(
					'rule_filter',
					this.reportType,
					this.filter.countDimension,
					currentPage,
					this.pageSize
				);
			},
			// 获取表类型
			getMeterTypeList(e) {
				if (e) {
					searchMeterTypeList({ type: 1, tenantId: this.tenantId })
						.then((res) => {
							if (res.data.code == 0) {
								let datas = res.data.data.records;
								let middleArr = datas.filter((item) => {
									return item.remoteMode != 0;
								});
								this.meterTypeOptions = middleArr;
							} else {
								this.$message.error(
									`表类型查询失败-${res.data.message}`
								);
							}
						})
						.catch((err) => {
							this.$message.error('表类型查询失败-接口请求失败');
						});
				} else {
					searchMeterTypeList({ type: 1 })
						.then((res) => {
							if (res.data.code == 0) {
								let datas = res.data.data.records;
								let middleArr = datas.filter((item) => {
									return item.remoteMode != 0;
								});
								this.meterTypeOptions = middleArr;
							} else {
								this.$message.error(
									`表类型查询失败-${res.data.message}`
								);
							}
						})
						.catch((err) => {
							this.$message.error('表类型查询失败-接口请求失败');
						});
				}
			},
			// 获取组织机构
			// 获取组织机构模板树
			getOrgTemplate() {
				orgstrutureList()
					.then((res) => {
						let data = res.data.data;
						if (data.length > 0) {
							data.map((item) => {
								if (item.name == '分公司') {
									this.orgStruId = item.id;
								}
							});
						}
						orgstrutureTree()
							.then((res) => {
								let data1 = res.data.data;
								// 递归寻找分公司
								let faResult_orgArr = [];
								let faResult_orgCodeArrD = [];
								let fa = (arr, id) => {
									arr.map((item) => {
										if (
											item.tenant_organization &&
											item.tenant_organization
												.org_stru_id == id
										) {
											faResult_orgArr.push(item);
											faResult_orgCodeArrD.push(
												item.tenant_organization
											);
										}
										if (
											item.children &&
											item.children.length
										) {
											fa(item.children, id);
										}
									});
								};
								fa(data1, this.orgStruId);
								this.orgArr = faResult_orgArr;
								this.orgCodeArrD = faResult_orgCodeArrD;
								//循环得出所有营业厅列表
								// for (let i = 0; i < this.orgArr.length; i++) {
								//   for (let j = 0; j < this.orgArr[i].children.length; j++) {
								//     this.orgCodeAll.push(
								//       this.orgArr[i].children[j].tenant_organization
								//     );
								//   }
								// }
								// //循环拿到所有营业厅的orgcode
								// for (let i = 0; i < this.orgCodeAll.length; i++) {
								//   this.businessAll.push(this.orgCodeAll[i].org_code);
								// }
							})
							.catch((err) => {
								if (err != 401 && err != 403) {
									this.$message.error(
										'获取组织机构模板时发生错误'
									);
									console.error(
										'获取组织机构模板时发生错误',
										err
									);
								}
							});
					})
					.catch((err) => {
						if (err != 401 && err != 403) {
							this.$message.error('获取组织机构模板时发生错误');
							console.error('获取组织机构模板时发生错误', err);
						}
					});
			},
			// 组织机构系统级
			getOrgTemplate_sys(id) {
				orgstrutureList_sys({ tid: id })
					.then((res) => {
						let data = res.data.data;
						if (data.length > 0) {
							data.map((item) => {
								if (item.name == '分公司') {
									this.orgStruId = item.id;
								}
							});
						}
						orgstrutureSysTree({ tid: id })
							.then((res) => {
								let data1 = res.data.data;
								// 递归寻找分公司
								let faResult_orgArr = [];
								let faResult_orgCodeArrD = [];
								let fa = (arr, id) => {
									arr.map((item) => {
										if (
											item.tenant_organization &&
											item.tenant_organization
												.org_stru_id == id
										) {
											faResult_orgArr.push(item);
											faResult_orgCodeArrD.push(
												item.tenant_organization
											);
										}
										if (
											item.children &&
											item.children.length
										) {
											fa(item.children, id);
										}
									});
								};
								fa(data1, this.orgStruId);
								this.orgArr = faResult_orgArr;
								this.orgCodeArrD = faResult_orgCodeArrD;
								//循环得出所有营业厅列表
								//   for (let i = 0; i < this.orgArr.length; i++) {
								//     for (let j = 0; j < this.orgArr[i].children.length; j++) {
								//       this.orgCodeAll.push(
								//         this.orgArr[i].children[j].tenant_organization
								//       );
								//     }
								//   }
								//   //循环拿到所有营业厅的orgcode
								//   for (let i = 0; i < this.orgCodeAll.length; i++) {
								//     this.businessAll.push(this.orgCodeAll[i].org_code);
								//   }
							})
							.catch((err) => {
								if (err != 401 && err != 403) {
									this.$message.error(
										'获取组织机构模板时发生错误'
									);
									console.error(
										'获取组织机构模板时发生错误',
										err
									);
								}
							});
					})
					.catch((err) => {
						if (err != 401 && err != 403) {
							this.$message.error('获取组织机构模板时发生错误');
							console.error('获取组织机构模板时发生错误', err);
						}
					});
			},
			// 分公司联动营业厅
			orgFun(e) {
				if (e == '0') {
					if (this.isAdmin == 0) {
						this.filter.regionCode = '';
						this.region = [];
						this.filter.addressAreaCode = '';
						this.street = [];
						this.filter.orgCodeB = '0';
						this.orgCodeArr = [];
						this.filter.priceId = '';
						this.priceArr = [];
					}
				} else {
					this.filter.orgCodeB = '0';
					this.orgCodeArr = [];
					this.filter.priceId = '';
					this.priceArr = [];
					this.orgArr.map((item) => {
						if (e == item.tenant_organization.org_code) {
							item.children.map((orgChildren) => {
								this.orgCodeArr.push(
									orgChildren.tenant_organization
								);
							});
						}
					});
					// 获取租户下分公司的的省市
					this.getTenantPlaceVal(e);
					// 获取租户下分公司的价格
					this.getPricesListData(e);
				}
			},
			// 导出报表
			Down(e, r, d) {
				return {
					command: e,
					report: r,
					dimension: d,
				};
			},
			// 下载导出导出
			downloadFun(command) {
				const loading = this.$loading({
					text: '下载中，请稍后...',
					customClass: 'loadingSP',
					background: 'rgba(255,255,255,0.8)',
				});
				if (
					command.command == 'pdf' &&
					command.report == '1' &&
					command.dimension == '1'
				) {
					let myObj = {
						method: 'post',
						url: '/cpm/report/balance-statistics/export/pdf',
						fileName: '账户余额统计报表.pdf',
						data: removeNullParams(this.filter),
					};
					exportReport(myObj, 'pdf', '', loading);
				} else if (
					command.command == 'excel' &&
					command.report == '1' &&
					command.dimension == '1'
				) {
					let myObj = {
						method: 'post',
						url: '/cpm/report/balance-statistics/export/excel',
						fileName: '账户余额统计报表.xls',
						data: removeNullParams(this.filter),
					};
					exportReport(myObj, 'excel', '', loading);
				} else if (
					command.command == 'pdf' &&
					command.report == '1' &&
					command.dimension == '2'
				) {
					let myObj = {
						method: 'post',
						url: '/etf/monthly-bill/export/pdf',
						fileName: '账户月账单统计报表.pdf',
						data: removeNullParams(this.filter),
					};
					exportReport(myObj, 'pdf', '', loading);
				} else if (
					command.command == 'excel' &&
					command.report == '1' &&
					command.dimension == '2'
				) {
					let myObj = {
						method: 'post',
						url: '/etf/monthly-bill/export/excel',
						fileName: '账户月账单统计报表.xls',
						data: removeNullParams(this.filter),
					};
					exportReport(myObj, 'excel', '', loading);
				} else if (command.command == 'pdf' && command.report == '2') {
					let myObj = {
						method: 'post',
						url: '/cpm/report/balance-detail/export/pdf',
						fileName: '账户余额明细报表.pdf',
						data: {
							...removeNullParams(this.filter),
							customColumn: this.titleData.map(
								(item) => item.value
							),
						},
					};
					console.log('data', myObj.data);
					exportReport(myObj, 'pdf', '', loading);
				} else if (
					command.command == 'excel' &&
					command.report == '2'
				) {
					let myObj = {
						method: 'post',
						url: '/cpm/report/balance-detail/export/excel',
						fileName: '账户余额明细报表.xls',
						data: {
							...removeNullParams(this.filter),
							customColumn: this.titleData.map(
								(item) => item.value
							),
						},
					};
					exportReport(myObj, 'excel', '', loading);
				}
			},
			// 数据字典
			dataDepement() {
				getSysDataList({
					codes: 'userType,business,resident',
				}).then((res) => {
					if (res.data.code == 0) {
						this.userTypeDD = res.data.data.userType || []; //用户类型
					} else {
					}
				});
			},
		},

		mounted() {
			this.dataDepement();
			let orgcodeName = this.$ls.get('userInfo');
			this.isAdmin = orgcodeName.userLevel;
			this.isTenantAdmin = orgcodeName.isTenantAdmin;
			// 系统级登陆
			if (this.isAdmin == 0) {
				this.company = true;
				this.companyShow = true;
				this.getOrgTemplate_sys(this.tenantId);
				this.getMeterTypeList(this.tenantId); //默认加载表类型
				this.orgFun('0');
				// 营业厅列表初始化
				this.filter.orgCodeB = '0';
				this.orgCodeArr = [];
			} else {
				// 租户级登陆
				if (this.isTenantAdmin == true) {
					this.company = true;
					this.companyShow = true;
					this.getOrgTemplate();
					this.orgFun('0');
					this.getPricesListData(); //默认加载价格列表
					this.getMeterTypeList(); //默认加载表类型
					if (this.city == undefined) {
						let citys = this.$ls.get('tenantPlaceCode').city;
						this.getRegionNameVal(citys); //默认加班区县列表
					} else {
						this.getRegionNameVal(this.city); //默认加班区县列表
					}
					// 营业厅列表初始化
					this.filter.orgCodeB = '0';
					this.orgCodeArr = this.$store.state.userInfo.businessHalls;
				} else {
					this.company = false;
					this.companyShow = false;
					if (this.city == undefined) {
						let citys = this.$ls.get('tenantPlaceCode').city;
						this.getRegionNameVal(citys); //默认加班区县列表
					} else {
						this.getRegionNameVal(this.city); //默认加班区县列表
					}
					this.getPricesListData(); //默认加载价格列表
					this.getMeterTypeList(); //默认加载表类型
					// 营业厅列表初始化
					this.filter.orgCodeB = '0';
					this.orgCodeArr = this.$store.state.userInfo.businessHalls;
				}
			}
			this.changeFilter('1', '1'); //默认查询条件
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo;
			},
			city() {
				return this.$store.state.tenantPlaceCode.city;
			},
			tenantId() {
				return this.$store.state.sysCheckedTenant.id;
			},
		},
		watch: {
			city() {
				this.filter.regionCode = '';
				this.filter.orgCodeB = '0';
				this.getRegionNameVal(this.city);
			},
			userInfo(vr) {
				this.orgCodeArr = vr.businessHalls;
			},
			tenantId() {
				// 营业厅列表初始化
				this.filter.orgCodeD = '0';
				this.orgCodeArrD = [];
				this.filter.meterTypeId = '';
				this.meterTypeOptions = [];
				// 小区初始化
				this.street = [];
				this.filter.addressAreaCode = '';
				this.getOrgTemplate_sys(this.tenantId);
				this.getMeterTypeList(this.tenantId);
				this.orgFun('0');
            },
            "filter.custDate":{
                handler(newVal, oldVal) {
                    this.filter['startTime']=typeof newVal[0] == 'object'?getFormateDate(newVal[0],0):newVal[0]
                    this.filter['endTime']=typeof newVal[1] == 'object'?getFormateDate(newVal[1],1):newVal[1]
                },
                immediate: true,
            }
		},
	};
</script>

<style lang="scss" scoped>
.list {
  width: 100%;
  height: 100%;
  background: #f8f9fe;
  .filter {
    width: 270px;
    height: 100%;
    background: #ffffff;
    display: inline-block;
    float: left;
    padding-bottom: 14px;
    border-radius: 4px;
    ::v-deep .el-input__inner {
      width: 238px;
      height: 32px;
      line-height: 32px;
    }
    ::v-deep .el-input__icon {
      line-height: 32px;
    }
    .filter-title {
      height: 64px;
      padding: 20px 16px 20px 16px;
      img {
        width: 24px;
        height: 24px;
        vertical-align: middle;
        margin-right: 8px;
        margin-bottom: 5px;
      }
      .title {
        color: #222222;
        font-size: 16px;
        font-weight: 500;
        font-family: "SourceHanSansCN-Medium", "SourceHanSansCN";
      }
    }
    .term-title {
      width: 100%;
      height: 52px;
      padding: 10px 16px 10px 16px;
      background: #eaf3fe;
      ::v-deep .el-input__inner {
        color: #2f87fe;
      }
      ::v-deep .el-input--prefix .el-input__inner {
        padding-left: 70px;
      }
      .title-tips {
        display: inline-block;
        margin-top: 6px;
        color: #2f87fe;
      }
    }
    .filter-term {
      height: calc(100% - 162px);
      padding: 20px 0 0 16px;
      ::v-deep .el-form--label-top .el-form-item__label {
        padding: 0;
      }
      ::v-deep .el-form-item__label {
        line-height: 30px;
      }
      ::v-deep .el-form-item__content {
        line-height: 32px;
      }
    }
    .filter-func-btn {
      padding-top: 14px;
      box-shadow: 0px -1px 4px 0px rgba(0, 33, 77, 0.1);
      width: 270px;
      height: 60px;
      float: right;
      .filter-func-btn-size {
        width: 110px;
        height: 32px;
        font-size: 12px;
        padding: 9px 15px;
        margin-left: 16px;
      }
    }
  }
  .table {
    width: calc(100% - 294px);
    height: 100%;
    background: #ffffff;
    margin-left: 24px;
    display: inline-block;
    padding: 24px 20px 14px;
    border-radius: 4px;
    .query-func-btn {
      margin-bottom: 24px;
      float: right;
      .importBtn {
        background: #fff;
        border-color: #2f87fe;
        color: #2f87fe;
      }
      // 导出列表按钮样式
      ::v-deep .el-dropdown {
        margin-left: 8px;
        .el-button {
          padding: 0;
          width: 110px;
          height: 32px;
          color: #2f87fe;
          background: #fff;
          border: 1px solid rgba(47, 135, 254, 1);
        }
        .el-button.is-disabled {
          background: #f7f7f7;
          color: #d1d1d1;
          border: 1px solid rgba(216, 216, 216, 1);
        }
        .reverse {
          transform: rotateZ(-180deg);
          transition: 0.3s;
        }
        .no-reverse {
          transform: rotateZ(0);
          transition: 0.3s;
        }
      }
    }
    .columnIcon {
      vertical-align: middle;
      margin-right: 8px;
    }
    ::v-deep .el-table__body-wrapper {
      width: auto !important;
      min-width: 100% !important;
      height: calc(100% - 48px) !important;
    }
    ::v-deep .el-table__header-wrapper {
      width: auto !important;
      min-width: 100% !important;
    }
    .titleData {
      height: calc(100% - 56px);
      ::v-deep .el-table__empty-text {
        line-height: 30px !important;
        position: fixed;
        top: 47%;
        left: 50%;
        width: 200px;
      }
      .page {
        height: 30px;
        margin-top: 20px;
      }
      .pageLeft {
        float: left;
      }
      .pageRight {
        float: right;
      }
      .noData {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        z-index: 1;
        color: #999;
      }
      ::v-deep .el-table .cell {
        text-overflow: clip;
      }
    }
    ::v-deep .el-table::before {
      display: none;
    }
  }
}
</style>
