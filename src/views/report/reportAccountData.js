

export const DEFAULT_BALANCE_TABLE_TITLE = [
    {
        value: "archivesNo",
        label: "档案编号",
        disable: true
    },
    {
        value: "archivesIdentity",
        label: "档案标识",
        disable: false
    },
    {
        value: "meterNo",
        label: "表具编号",
        disable: true
    },
    {
        value: "meterTypeName",
        label: "表具类型",
        disable: false
    },
    {
        value: "userName",
        label: "用户名称",
        disable: true
    },
    {
        value: "userType",
        label: "用户类型",
        disable: false
    },
    {
        value: "unionAddress",
        label: "地址",
        disable: true
    },
    {
        value: "balance",
        label: "余额 (元)",
        disable: true
    },
    {
        value: "totalRechargeQuantity",
        label: "累购气量 (m³)",

        disable: false
    },
    {
        value: "totalRechargeAmount",
        label: "累购金额 (元)",
        disable: true
    },
    {
        value: "remoteBuyNumber",
        label: "累购次数",
        disable: false
    },
    {
        value: "lastRechargeTime",
        label: "最后充值时间",
        disable: true
    }
];

export const DEFAULT_CHECKED_TABLE_TITLE = DEFAULT_BALANCE_TABLE_TITLE.filter(item=> item.disable)

export const DEFAULT_DATA = {
    // city: "", //省市数据
    userTypeDD: [], //用户类型
    reportType: "1",
    countDimen: true, //统计维度默认展示
    balance1: false, //用于判断余额统计显示的条件
    month1: false, //用于判断月账单显示的条件
    achives1: false, //用户判断余额明细时显示的条件
    achives2: false,
    company: false, //分公司默认隐藏
    companyShow: false, //分公司默认不必填
    // business: false, //营业厅默认隐藏
    dateTime: false, //时间默认不必填
    dateMonth: false, //月份默认不必填
    meterTypeOptions: [], //表类型列表
    currentPage: 1, //当前页
    //初始化总条数
    dataNum: 0,
    dataNum1: 0,
    pageSize: 10, //每页显示多少条
    filter: {
        countDimension: "1",
        // startDate1: "",
        // endDate1: "",
        billDate: "",
        userType: "",
        userSubType: "",
        mobile: "",
        userName: "",
        archivesNo: "",
        archivesIdentity: "",
        meterNo: "",
        meterTypeId: "",
        orgCodeD: "0",
        orgCodeB: "0",
        priceId: "",
        regionCode: "",
        addressAreaCode: "",
        address: "",
        // custDate:[new Date(new Date().setHours(0,0,0)),new Date(new Date().setHours(23,59,59))],
        custDate:[],
    },
    region: [], //区县
    street: [], //小区
    priceArr: [], //价格列表
    orgArr: [], //组织机构列表
    orgCodeArrD: [], //分公司列表
    orgCodeArr: [], //营业厅列表
    orgcodeY: [], //分公司下所有营业厅列表
    orgcodeQ: "", //权限为营业厅时组织机构码
    userSubclass2: [],
    tableHeight: "calc(100% - 50px)",
    dialogFormVisible: false, //自定义列
    //统计报表表头
    titleDataBalance: [
        {
            value: "userType",
            label: "用户类型"
        },
        {
            value: "priceName",
            label: "价格名称"
        },
        {
            value: "num",
            label: "户数"
        },
        {
            value: "balance",
            label: "余额 (元)"
        }
    ],
    titleDataMonth: [
        //月账单报表表头
        {
          value: "archivesNo",
          label: "档案编号"
        },
        {
          value: "userName",
          label: "用户名称"
        },
        {
          value: "userMobile",
          label: "手机号"
        },
        {
          value: "unionAddress",
          label: "地址"
        },
        {
          value: "meterNo",
          label: "表具编号"
        },

        {
          value: "beginTime",
          label: "月初抄表时间"
        },
        {
          value: "beginReading",
          label: "月初抄表底数(m³)"
        },
        {
          value: "endTime",
          label: "月末抄表时间"
        },
        {
          value: "endReading",
          label: "月末抄表底数(m³)"
        },
        {
          value: "periodConsumptionQty",
          label: "月消费气量(m³)"
        },
        {
          value: "periodConsumptionAmt",
          label: "月消费金额(元)"
        },
        {
          value: "beginBalance",
          label: "月初账户余额(元)"
        },
        {
          value: "periodRechargeAmt",
          label: "本月累充金额(元)"
        },
        {
          value: "endBalance",
          label: "月末账户余额(元)"
        }
      ],
    titleData: [], //报表表头数据
    tableData: [], //报表列表
    ops: window.scrollOps, // 滚动条

    orgStruId: "",
    orgCodeAll: [],
    businessAll: [],
    /****************************************************/
    balanceDefaultTitle: DEFAULT_BALANCE_TABLE_TITLE,
    //明细报表表头
    titleDataBalanceDetail: [
        {
            value: "archivesNo",
            label: "档案编号"
        },
        {
            value: "archivesIdentity",
            label: "档案标识"
        },
        {
            value: "meterNo",
            label: "表具编号"
        },
        {
            value: "userName",
            label: "用户名称"
        },
        {
            value: "unionAddress",
            label: "地址"
        },
        {
            value: "balance",
            label: "余额 (元)"
        },
        {
            value: "totalRechargeAmount",
            label: "累购金额 (元)"
        },
        {
            value: "lastRechargeTime",
            label: "最后充值时间"
        }
    ],
};