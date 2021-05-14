import {
	orgstrutemplateTree,
	orgstrutureList_sys,
	orgstrutureList,
	orgstrutureChoose,
	permissionTreeGet,
	permissionTreeSet,
	roletemplateList,
	roletemplateApply,
	getTemplateList,
	getTemplateTree,
    bindTemplate,
    getTemplateRef
} from '@/api/tenant.js';
import waterSel from '@assets/imgs/tenantConfig/1.5.0/water_sel.svg'
import waterNor from '@assets/imgs/tenantConfig/1.5.0/water_nor.svg'
import gasSel from '@assets/imgs/tenantConfig/1.5.0/gas_sel.svg'
import gasNor from '@assets/imgs/tenantConfig/1.5.0/gas_nor.svg'

let orgFixCheckedName = ["分公司", "营业厅", "网上营业厅"]; // 固定勾选的组织机构名称
export default {
	components: {},
	props: {},
	data() {
		let that = this;
		return {
            /************** 1.5.0 租户权限配置模板 ***************/ 
            realm: 'gas', // 租户类型：gas，water
            templateList: [
            ],
            iconList: {
                water: {
                    nor: waterNor,
                    sel: waterSel 
                },
                gas: {
                    nor: gasNor,
                    sel: gasSel 
                }
            },
            templateId: '',
            /************** 1.5.0 租户权限配置模板 ***************/ 
			leftProps: {
				children: 'children',
				label: function(data, node) {
					if (data.org_stru_template && data.org_stru_template) {
						return data.org_stru_template.name;
					} else {
								console.error('leftProps的label出现错误!');
							}
				},
				disabled: function(data, node) {
					if (!that.btAuthList['组织机构分配']) {
						return true;
					} else if (data.org_stru_template) {
						if (
							orgFixCheckedName.indexOf(
								data.org_stru_template.name
							) > -1
						) {
							return true;
						}
					}
				},
			}, // 组织机构树配置
			rightProps: {
				children: 'children',
				label: 'description',
				disabled: function(data, node) {
					if (!that.btAuthList['权限分配']) {
														return true;
													}
				},
			},
			templateRoleProps: {
				children: 'children',
				label: 'name',
			}, // 模板角色配置
			orgDisabled: false, // 判断组织机构是否选择过，选择过的不能再修改
			orgDefaultKey: [], // 组织机构默认勾选
			orgFixChecked: [], // 固定勾选的组织机构id(分公司、营业厅、网上营业厅)
			permissionDefaultKey: [], // 权限默认勾选
			templateRoleDefaultKey: [], // 模板角色默认勾选

			permissionTree: [], // 权限列表
			orgsTemplateTree: [], // 组织机构列表
			templateRoleTree: [], // 模板角色列表
			templateRoleoverride: false, // 修改模板角色时覆盖同名角色
			// 所有节点，用来全选
			treeAllKeys: {
				left: [], // 组织机构
				right: [], // 权限
				templateRole: [], // 模板角色
			},
			// uiDisplay: {
			//   templateRole: false,
			// },
		};
    },
    watch: {
        templateId() {
            this._getTemplateTree()
        }
    },
	mounted() {},
	methods: {
		// 获取组织机构模板树
		getOrgTemplate() {
			const loading = this.$loading({
				target: '.JGQX .box.left',
				background: 'rgba(255,255,255,0.7)',
			});
			this.orgsTemplateTree = [];
			orgstrutemplateTree()
				.then((res) => {
					loading.close();
					if (res.data && res.data.code == 0) {
						let list = [];
						if (res.data.data && res.data.data.length) {
							list = res.data.data;
							this.getAllKeys(res.data.data, 'left');
							// this.orgDefaultNoteInt(res.data.data);
						}
						this.orgsTemplateTree = list;
						this.getCurOrgKey(); // 获取租户当前的组织机构
					} else {
						let msg = '获取组织机构模板失败-返回码错误';
						if (res.data.message) {
							msg = res.data.message;
						}
						this.$message.error(msg);
					}
				})
				.catch((err) => {
					loading.close();
					if (err != 401 && err != 403) {
						this.$message.error('获取组织机构模板时发生错误');
						console.error('获取组织机构模板时发生错误', err);
					}
				});
		},
		// 获取所有的key值
		getAllKeys(list, treeName) {
			this.treeAllKeys[treeName] = [];
			// 判断条件和值
			let judgeExp = null;
			// 需要的key值
			let valueReturn = null;
			if (treeName == 'left') {
				// 组织机构
				judgeExp = (item) => {
					return (
						item.org_stru_template &&
						item.org_stru_template.id != null
					);
				};
				valueReturn = (item) => {
					return item.org_stru_template.id;
				};
			} else if (treeName == 'templateRole') {
				// 模板角色组
				judgeExp = (item) => {
					return item.id != null;
				};
				valueReturn = (item) => {
					return item.id;
				};
			}
			// 递归取key
			let ergodic = (arr) => {
				if (arr.length > 0) {
					arr.map((item) => {
						// 组织机构查找出固定筛选的几个
						if (treeName == 'left') {
							if (
								item.org_stru_template &&
								orgFixCheckedName.indexOf(
									item.org_stru_template.name
								) > -1
							) {
								this.orgFixChecked.push(item.id);
							}
						}
						if (judgeExp(item)) {
							this.treeAllKeys[treeName].push(valueReturn(item));
						}
						if (item.children && item.children.length) {
							ergodic(item.children);
						}
					});
				}
			};
			this.orgFixChecked = [];
			ergodic(list);
		},
		// 全选功能
		setAllkeys(treeName) {
			if (treeName == 'left') {
				// 组织机构权限
				this.$refs.orgTree.setCheckedKeys(this.treeAllKeys.left);
			} else if (treeName == 'right') {
				// 权限分配
				this.$refs.permissionTree.setCheckedKeys(
					this.treeAllKeys.right
				);
			} else if (treeName == 'templateRole') {
				// 角色模板组
				this.$refs.templateRoleTree.setCheckedKeys(
					this.treeAllKeys.templateRole
				);
			} else {
				console.error('setAllkeys函数参数错误');
			}
		},
		// 清空功能
		clearTreeChecked(treeName) {
			if (treeName == 'left') {
				// 组织机构权限
				this.$refs.orgTree.setCheckedKeys(this.orgFixChecked);
			} else if (treeName == 'right') {
				// 权限分配
				this.$refs.permissionTree.setCheckedKeys([]);
			} else if (treeName == 'templateRole') {
				// 角色模板组
				this.$refs.templateRoleTree.setCheckedKeys([]);
			} else {
				console.error('clearTreeChecked函数参数错误');
			}
		},
		// 获取租户当前的组织机构
		getCurOrgKey() {
			let resFunc = () => {}; // 请求方法
			let resData = undefined; // 请求参数
			if (
				this.$ls.get('userGradeName') == '超级管理员' ||
				this.$ls.get('userGradeName') == '普通管理员' ||
				this.$ls.get('userGradeName') == '运维操作员'
			) {
				if (!this.tenantId) {
					this.$message.error(
						'无法获取租户当前的组织机构，租户ID为空'
					);
					return;
				}
				resFunc = orgstrutureList_sys;
				resData = { tid: this.tenantId };
			} else {
				resFunc = orgstrutureList;
			}
			const loading = this.$loading({
				target: '.JGQX .box.left',
				background: 'rgba(255,255,255,0.7)',
			});
			resFunc(resData)
				.then((res) => {
					loading.close();
					if (res.data && res.data.code == 0) {
						this.orgDefaultKey = [];
						if (res.data.data && res.data.data.length) {
							this.orgDefaultKey = res.data.data.map((item) => {
								return item.src_template_id;
							});
						}
						if (this.orgDefaultKey.length) {
							this.orgDisabled = true; // 已选择过组织机构不能再次选择
							this.$refs.orgTree.setCheckedKeys(
								this.orgDefaultKey
							);
							this.leftProps.disabled = function(data, node) {
								return true;
							};
						} else {
							this.$refs.orgTree.setCheckedKeys(
								this.orgFixChecked
							);
						}
					} else {
						let msg =
							res.data && res.data.message
								? res.data.message
								: '返回码错误';
						this.$message.error(
							'获取租户当前的组织机构失败：' + msg
						);
					}
				})
				.catch((err) => {
					loading.close();
					if (err != 401 && err != 403) {
						this.$message.error('获取租户当前的组织机构时发生错误');
						console.error('获取租户当前的组织机构时发生错误', err);
					}
				});
		},
		// 默认选中的节点
		orgDefaultNoteInt(arr) {
			let result = [];
			let findDefault = (arr) => {
				if (arr.length > 0) {
					arr.map((item) => {
						if (item.org_stru_template.name == '分公司') {
							result.push(item.org_stru_template.id);
						}
						if (item.children.length > 0) {
							findDefault(item.children);
						}
					});
				}
			};
			findDefault(arr);
			this.orgDefaultKey = result;
		},
		// 修改组织机构
		orgstrutureSet() {
			if (!this.tenantId) {
				this.$message.error('无法修改组织机构：租户ID为空');
				return;
			}
			let checkedKeys = this.$refs.orgTree.getCheckedKeys();
			if (!checkedKeys || !checkedKeys.length) {
				this.$message.error('组织机构选择项不可为空');
				return;
			} else {
				let rf = []; // 修正选择结果
				// 把中间未选择的空节点选择上
				(() => {
					// 判断children中是否有选中的节点
					let j1 = (arr) => {
						let t = false;
						let jt = (arrs) => {
							if (arrs && arrs.length) {
								for (let i = 0; i < arrs.length; i++) {
									if (checkedKeys.indexOf(arrs[i].id) > -1) {
										t = true;
										break;
									} else {
										if (
											arrs[i].children &&
											arrs[i].children.length
										) {
											jt(arrs[i].children);
										}
									}
								}
							}
						};
						jt(arr);
						return t;
					};
					let s1 = checkedKeys[0];
					let s2 = checkedKeys[checkedKeys.length - 1];
					let stop = null; //1开始收集，2结束收集
					let d = (arrs) => {
						arrs.map((item) => {
							if (stop == 1) {
								if (
									checkedKeys.indexOf(item.id) > -1 ||
									j1(item.children)
								) {
									rf.push(item.id);
								}
								// 找到结束节点
								if (item.id == s2) {
									stop = 2;
								} else {
									if (item.children && item.children.length) {
										d(item.children);
									}
								}
							} else if (stop == 2) {
							} else {
								// 找到开始节点
								if (item.id == s1) {
									stop = 1;
									rf.push(item.id);
								}
								if (item.children && item.children.length) {
									d(item.children);
								}
							}
						});
					};
					d(this.orgsTemplateTree);
				})();
				checkedKeys = rf;
				this.$refs.orgTree.setCheckedKeys(rf);
				this.orgstrutureSetGo(checkedKeys);
			}
		},
		// 二次确认修改组织机构
		orgstrutureSetGo(checkedKeys) {
			const loading = this.$loading({
				target: '.JGQX .box.left',
				background: 'rgba(255,255,255,0.7)',
			});
			orgstrutureChoose(
				{
					org_stru_list: checkedKeys,
				},
				{ params: { tid: this.tenantId } }
			)
				.then((res) => {
					loading.close();
					if (res.data && res.data.code == 0) {
						this.$message.success('修改组织机构成功');
						this.getCurOrgKey();
					} else {
								let msg = '修改组织机构失败-返回码错误';
								if (res.data.message) {
									msg = res.data.message;
								}
								this.$message.error(msg);
							}
				})
				.catch((err) => {
					loading.close();
					if (err != 401 && err != 403) {
						this.$message.error('修改组织机构时发生错误');
						console.error('修改组织机构时发生错误', err);
					}
				});
        },
        /************ 1.5.0租户权限模板开始 *************/ 
		// 获取权限树模板
		async getPermission() {
            const loading = this.$loading({
                target: ".JGQX .box.right",
                background: "rgba(255,255,255,0.7)"
            });
            await getTemplateList({
                realm: this.realm
            })
            .then(res=>{
                this.templateList = res.data.data
            })
            .catch(err=>{
                console.log('err: ',err)
            })
            await getTemplateRef({
                tenantId: this.tenantId
            })
            .then(res=>{
                const data = res.data.data
               if (data&&data.templateId) {
                   this.templateId = data.templateId
                   console.log('data: ', this.templateId)
               } else {
                this.templateId = this.templateList[0] && this.templateList[0].templateId
               }
            })
            .finally(()=>{
                loading.close()
            })
            
        },
        // 选中模板
        handleTemplateCheck(item) {
            this.templateId = item.templateId
        },
        // 获取租户模板关系
        _getTemplateRef() {
            // /auth/authz/permission/template/scope/ref
           
            // .catch(err=>{
            //     console.log('err: ',err)
            // })
            // .finally(()=>{
            // })
        },
        // 获取权限模板列表
        _getTemplateList() {
            
        },
        // 获取权限模板对应tree
		_getTemplateTree() {
            getTemplateTree({
                templateId: this.templateId
            })
            .then(res=>{
                this.getPermissionList(res.data.data)
            })
            .catch(err=>{
                console.log('err: ',err)
            })
            .finally(()=>{
                
            })
        },
        // 绑定租户模板
        bindTemplateToTenant() {
            const loading = this.$loading({
				target: '.JGQX .box.right',
				background: 'rgba(255,255,255,0.7)',
			});
            bindTemplate({
                templateId: this.templateId,
                tenantId: this.tenantId 
            })
            .then(res=>{
					if (res.data && res.data.code == 0) {
						this.$message.success('权限分配成功');
					} else {
						let msg = '权限分配失败-返回码错误';
						if (res.data.message) {
							msg = res.data.message;
						}
						this.$message.error(msg);
					}
            })
            .catch((err)=>{
                
					if (err != 401 && err != 403) {
						this.$message.error('权限分配时发生错误');
						console.error('权限分配时发生错误', err);
					}
            })
            .finally(()=>{
                loading.close();
            })
        },
		/************ 1.5.0租户权限模板结束 *************/ 
		// getPermission() {
		//   if (this.tenantId == null) {
		//     this.permissionTree = []; this.$message.error("无法获取权限列表：租户ID为空"); return;
		//   }
		//   const loading = this.$loading({
		//     target: ".JGQX .box.right",
		//     background: "rgba(255,255,255,0.7)"
		//   });
		//   this.permissionTree = [];
		//   permissionTreeGet({
		//     tenantId: this.tenantId,
		//   }).then(res => {
		//     loading.close();
		//     if (res.data && res.data.code == 0) {
		//       if (res.data.data) {
		//         this.getPermissionList(res.data.data); // 处理权限树
		//       }
		//     } else {
		//       let msg = "获取权限列表失败-返回码错误";
		//       if (res.data.message) {
		//         msg = res.data.message;
		//       }
		//       this.$message.error(msg);
		//     }
		//   }).catch(err => {
		//     loading.close();
		//     if (err != 401 && err != 403) {
		//       this.$message.error("获取权限列表时发生错误");
		//       console.error("获取权限列表时发生错误", err);
		//     }
		//   })
		// },
		// 获取当前租户的权限列表
		getPermissionList(data) {
			let list = [];
			if (data.children && data.children.length) {
				list = data.children;
			} else if (data.permissionList && data.permissionList) {
				list = data.permissionList;
			}
			let checkKeys = []; // 当前已勾选
			let allKeys = []; // 全选数据
			let getTree = (arr) => {
				let rArr = [];
				arr.map((item, index) => {
					let addItem = {};
					// 节点id分groupId和permissionId，为了唯一性添加前缀
					if (item.groupId) {
                        addItem = {
                            keyId: `g-${item.groupId}`,
                            description: item.description,
                        };
                        // g-id为父节点，不勾选
                        // item.check ? checkKeys.push(addItem.keyId) : null;
                        
                        item.enable
                            ? allKeys.push(addItem.keyId)
                            : (addItem.disabled = true); // 全选和不可选
                    } else if (item.permissionId) {
                        addItem = {
                            keyId: `p-${item.permissionId}`,
                            description:
                                item.description,
                            enable: item.enable,
                        };
                        item.check
                            ? checkKeys.push(
                                    addItem.keyId
                                )
                            : null;
                        item.enable
                            ? allKeys.push(
                                    addItem.keyId
                                )
                            : (addItem.disabled = true); // 全选和不可选
                    } else {
						throw '节点id缺失：' + item.description;
                    }
                    item.disabled = true
					// 递归生成children,children和permissionList均属于子节点
					let childItem = [];
					let permissionItem = [];
					if (item.children && item.children.length) {
						childItem = getTree(item.children);
					}
					if (item.permissionList && item.permissionList.length) {
						permissionItem = getTree(item.permissionList);
					}
					childItem.length || permissionItem.length
						? (addItem.children = childItem.concat(permissionItem))
                        : null;
                        addItem.disabled = true
                        addItem.label = item.description
					rArr.push(addItem);
                });
                
				return rArr;
            };
            
			try {
				this.permissionTree = getTree(list); // 权限树
				this.permissionDefaultKey = checkKeys; // 当前已勾选项
				this.treeAllKeys.right = allKeys; // 全选项
			} catch (error) {
				this.$message.error('权限树生成发生错误');
				console.error('权限树生成发生错误', error);
			}
		},
		// 设置权限
		permissionSet() {
			if (!this.tenantId) {
				this.$message.error('无法分配权限：租户ID为空');
				return;
			}
			let checkedKeys = this.$refs.permissionTree.getCheckedKeys();
			if (!checkedKeys || !checkedKeys.length) {
				this.$message.error('权限选择项不可为空');
				return;
			}
			let resKeys = [];
			checkedKeys.map((item) => {
				if (item.length > 2 && item[0] == 'p') {
					resKeys.push(item.split('-')[1]);
				}
			});
			const loading = this.$loading({
				target: '.JGQX .box.right',
				background: 'rgba(255,255,255,0.7)',
			});
			permissionTreeSet({
				tenantId: this.tenantId,
				permissionIds: resKeys,
			})
				.then((res) => {
					loading.close();
					if (res.data && res.data.code == 0) {
						this.$message.success('权限分配成功');
					} else {
						let msg = '权限分配失败-返回码错误';
						if (res.data.message) {
							msg = res.data.message;
						}
						this.$message.error(msg);
					}
				})
				.catch((err) => {
					loading.close();
					if (err != 401 && err != 403) {
						this.$message.error('权限分配时发生错误');
						console.error('权限分配时发生错误', err);
					}
				});
		},
		// 获取角色模板
		getRoletemplateList() {
			const loading = this.$loading({
				target: '.JGQX .box.r2',
				background: 'rgba(255,255,255,0.7)',
			});
			this.templateRoleTree = [];
			roletemplateList()
				.then((res) => {
					loading.close();
					if (res.data && res.data.code == 0) {
						let list = [];
						if (res.data.data && res.data.data.length) {
							list = res.data.data;
							this.getAllKeys(res.data.data, 'templateRole');
						}
						this.templateRoleTree = list;
					} else {
						let msg = '获取角色模板组失败-返回码错误';
						if (res.data.message) {
							msg = res.data.message;
						}
						this.$message.error(msg);
					}
				})
				.catch((err) => {
					loading.close();
					if (err != 401 && err != 403) {
						this.$message.error('获取角色模板组时发生错误');
						console.error('获取角色模板组时发生错误', err);
					}
				});
		},
		// 角色模板选择变化
		templateRoleCheckChange(data, checked, indeterminate) {
			if (checked) {
				this.$refs.templateRoleTree.setCheckedNodes([data]);
			}
		},
		// 设置角色模板组
		setRoletemplate() {
			let checkedKeys = null;
			if (this.$refs.templateRoleTree.getCheckedKeys().length) {
				checkedKeys = this.$refs.templateRoleTree.getCheckedKeys()[0];
			} else {
				this.$message.error('未选择任何模板');
				return;
			}
			const loading = this.$loading({
				target: '.JGQX .box.r2',
				background: 'rgba(255,255,255,0.7)',
			});
			roletemplateApply(
				{
					override: this.templateRoleoverride,
					role_template_id: checkedKeys,
				},
				{ params: { tid: this.tenantId } }
			)
				.then((res) => {
					loading.close();
					if (res.data && res.data.code == 0) {
						this.$message.success('修改角色模板组成功');
					} else {
						let msg = '修改角色模板组失败-返回码错误';
						if (res.data.message) {
							msg = res.data.message;
						}
						this.$message.error(msg);
					}
				})
				.catch((err) => {
					loading.close();
					if (err != 401 && err != 403) {
						let msg = '修改角色模板组时发生错误';
						this.$message.error(msg);
						console.error(msg, err);
					}
				});
		},
	},
};