<script type="text/javascript">
  /**
  * 全局变量
  * navConfig:项目导航配置文件；
  *tableConfig:表头字段
  *unit:单位合集
  */
  const navConfig = {
    "store":{
      "出入":[
        {"name":"出库管理","url":"outStoreHome","icon":"cebian-chukuguanli"},
        {"name":"入库管理","url":"inStoreHome","icon":"cebian-rukuguanli"},
        {"name":"仓库管理","url":"storeManageHome","icon":"cebian-cangkuguanli"}
      ],
      "管理":[
        {"name":"统计报表","url":"storeCount","icon":"cebian-tongji"},
        {"name":"工具设置","url":"set","icon":"cebian-shezhi"}
      ]
    },
    "finance":{
      "基础":[
        {"name":"收支记账","url":"chargeHome","icon":"cebian-shouzhijizhang"},
        {"name":"应收应付","url":"repayHome","icon":"cebian-yingshouyingfu"}
      ],
      "出入":[
        {"name":"资金账户","url":"accountHome","icon":"cebian-zijinzhanghao"},
        {"name":"借入借出","url":"toloanHome","icon":"cebian-jierujiechu"},
        // {"name":"固定资产","url":"","icon":""}
      ],
      "管理":[
        {"name":"统计报表","url":"financeCount","icon":"cebian-tongji"},
        {"name":"工具设置","url":"financeSet","icon":"cebian-shezhi"}
      ]
    },
    "inventory":{
      "基础":[
        {"name":"产品管理","url":"productHome","icon":"cebian-chanpinguanli"},
        {"name":"往来单位","url":"customerHome","icon":"cebian-wanglaidanwei"}
      ],
      "进销存":[
        {"name":"销售管理","url":"saleHome","icon":"cebain-xiaoshouguanli"},
        {"name":"采购进货","url":"purchaseHome","icon":"cebian-caigoujinhuo"},
        {"name":"仓库库存","url":"stockHome","icon":"cebian-kucunhuizong"}
      ],
      "管理":[
        {"name":"统计报表","url":"inventoryCount","icon":"cebian-tongji"},
        {"name":"工具设置","url":"inventorySet","icon":"cebian-shezhi"}
      ]
    }
  }
  const tableConfig ={
    "实木板材":["品类","树种","品牌","等级","厚度","宽度","长度","片数","立方数","产地","水份"],
    "原木材":["品类","树种","品牌","等级","口径","长度","根数","产地","水份"],
    "木配城":["品类","产品","树种","品牌","等级","厚度","宽度","长度","数量"],
    "人造板":["品类","产品","树种","品牌","等级","厚度","数量"],
    "名贵材":["品类","树种","品牌","形态","等级","厚度","宽度","长度","数量"]
  }
  const unit = [
    {name:'立方米',ab:'m³'},
    {name:'片数',ab:'P'},
    {name:'吨数',ab:'T'},
    {name:'根数',ab:'G'}
  ]

  export default{
    navConfig,
    tableConfig,
    unit,
  }
</script>
