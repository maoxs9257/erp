<template lang="html">
	<div class="listModule">
		<div class="list_header">
			<ym-hbt :to='{name:"repayHome"}' title='客户应收'></ym-hbt>
		</div>
		<div class="list_setbar">
			<div class="list_setbar_options">
				<div class="option" v-show='multipleSelection.length==0' @click='isTable = !isTable'>
					<div class="option_yuan"><i class="iconfont" :class="isTable?'jiugongge':'liebiao'"></i></div>
				</div>
				<div class="option" v-show='multipleSelection.length==0' @click='refresh'>
					<div class="option_yuan"><i class="iconfont shuaxin"></i></div>
					<span class="option_txt">刷新</span>
				</div>
				<div class="option" v-show='multipleSelection.length==0' @click='openNew'>
					<div class="option_yuan"><i class="iconfont xinjian"></i></div>
					<span class="option_txt">新建</span>
				</div>
				<div class="option" v-show='multipleSelection.length==0' @click='isSelect = !isSelect'>
					<div class="option_yuan"><i class="iconfont shaixuan"></i></div>
					<span class="option_txt">筛选</span>
				</div>
				<div class="option" v-show='multipleSelection.length==0' @click='setVisible=true'>
					<div class="option_yuan"><i class="iconfont cebian-shezhi"></i></div>
					<span class="option_txt">设置</span>
				</div>
				<div class="option" v-show="multipleSelection.length>0" @click='exportExcel'>
					<div class="option_yuan"><i class="iconfont daochu"></i></div>
					<span class="option_txt">导出</span>
				</div>
				<div class="search_input">
					<i class="iconfont sousuo"></i>
					<input type="text" class="search_input_placeholder" placeholder='客户/联系人/手机号' v-model='option.phone' @change='screenBar'>
				</div>
			</div>
			<div class="list_setbar_selections">
        <div class="selection">创建时间</div>
        <div class="selection" :class="{now:option.dateState===0}" @click='option.dateState=0;optionTime="";screen()'>今天</div>
        <div class="selection" :class="{now:option.dateState===1}" @click='option.dateState=1;optionTime="";screen()'>7天</div>
        <div class="selection" :class="{now:option.dateState===2}" @click='option.dateState=2;optionTime="";screen()'>30天</div>
        <div class="selection" :class="{now:optionTime}">
          <el-date-picker v-model="optionTime" @change="screenTime" type="daterange" range-separator="/" start-placeholder="选择时间"></el-date-picker>
        </div>
				<span class="clear" v-show='clearShow' @click="removeOption">清除</span>
			</div>
		</div>
		<div class="list_main" :class="{se:isSelect}">
			<div class="list_main_table" v-if='isTable'>
				<div class="table">
					<el-table :data='dataList' @selection-change="handleSelectionChange" height='100%' v-loadMethod='load' modname='.el-table__body-wrapper' loadmore='loadmore'>
						<el-table-column type='selection'></el-table-column>
						<el-table-column show-overflow-tooltip label='客户名称' prop='fullName'>
							<template slot-scope='scope'>
								<a href="javascript:void(0)" @click='openCustomer(scope.row)'>{{scope.row.fullName}}</a>
							</template>
						</el-table-column>
						<el-table-column v-if='tableShow.phone' show-overflow-tooltip label='联系人员' prop='displayName'></el-table-column>
						<el-table-column v-if='tableShow.displayName' show-overflow-tooltip label='手机号' prop='phone'></el-table-column>
						<el-table-column v-if='tableShow.discount' show-overflow-tooltip label='折扣优惠' prop='discount'></el-table-column>
						<el-table-column v-if='tableShow.orderReceivable' show-overflow-tooltip label='应收款' prop='orderReceivable'></el-table-column>
						<el-table-column v-if='tableShow.initialArrears' show-overflow-tooltip label='初期欠款' prop='initialArrears'></el-table-column>
					</el-table>
				</div>
				<div class="table_fot">
					<span>总数：{{total}}</span>
				</div>
			</div>
			<div class="list_main_card" v-if='!isTable'>
				<div class="card" v-loadMethod='load' loadmore='loadmore'>
					<ul class="card_ul">
						<li class="card_li" v-for='(val,key) in dataList' :key='key'>
							<div class="card_li_con">
								<div class="content" @click="openCustomer(val)">
									<div class="content_left">
										<img :src="val.logo|imgUrl">
									</div>
									<div class="content_right">
										<div class="content_right_row row1">
											<span class="v">{{val.fullName}}</span>
										</div>
										<div class="content_right_row row2">
											<span class="v">{{val.address}}</span>
										</div>
										<div class="content_right_row row2">
											<span class="v">{{val.displayName}}</span>
										</div>
										<div class="content_right_row row2">
											<span class="v">{{val.orderReceivable}}</span>
										</div>
									</div>
								</div>
							</div>
						</li>
					</ul>
				</div>
				<div class="card_fot">
					<span>总数：{{total}}</span>
				</div>
			</div>
		</div>
		<!-- 设置弹窗 -->
		<el-dialog title='设置' center :visible.sync='setVisible' width='800px' v-dialogDrag>
			<div>
				<el-tabs v-model='activeName'>
					<el-tab-pane label='表格字段' name='first'>
						<options :data='tableOptions' @cb='updataTableOptions' @close='setVisible=false'></options>
					</el-tab-pane>
				</el-tabs>
			</div>
		</el-dialog>
		<!-- 详情弹窗 -->
    <el-dialog width="800px" title="客户详情" center :visible.sync="visible" v-dialogDrag>
      <el-tabs v-model="tabs" @tab-click="handleClick">
        <el-tab-pane label="客户信息" name="1">
          <div class="main">
            <div class="main_top">
              <div class="main_img">
                <img :src="infoData.logo|imgUrl" alt="">
                <i class="iconfont " @click="openCropper">上传图片</i>
              </div>
              <div class="main_info">
                <div class="main_info_item">
                  <span class="n">客户名称:</span>
                  <span class="v">{{infoData.companyName}}</span>
                </div>
                <div class="main_info_item">
                  <span class="n">地址:</span>
                  <span class="v">{{infoData.address}}</span>
                </div>
                <div class="main_info_item">
                  <span class="n">客户类别:</span>
                  <span class="v">{{infoData.contactType===1?'公司':'个人'}}</span>
                </div>
                <div class="main_info_item">
                  <span class="n">客户电话:</span>
                  <span class="v">{{infoData.cPhone}}</span>
                </div>
                <div class="main_info_item">
                  <span class="n">联系人:</span>
                  <span class="v">{{infoData.displayName}}</span>
                </div>
                <div class="main_info_item">
                  <span class="n">订单应收:</span>
                  <span class="v">{{infoData.receivableAmount}}</span>
                </div>
                <div class="main_info_item">
                  <span class="n">客户归属:</span>
                  <span class="v">{{infoData.departName}}</span>
                </div>
                <div class="main_info_item">
                  <span class="n">初期欠款:</span>
                  <span class="v">{{infoData.initialArrears}}</span>
                </div>
                <div class="main_info_item">
                  <span class="n">累计销售:</span>
                  <span class="v">{{infoData.totalMoney}}</span>
                </div>
                <div class="main_info_item">
                  <span class="n">优惠折扣:</span>
                  <span class="v">{{infoData.preferentialAmount}}</span>
                </div>
                <div class="main_info_item">
                  <span class="n">QQ:</span>
                  <span class="v">{{infoData.qq}}</span>
                </div>
                <div class="main_info_item">
                  <span class="n">预付款:</span>
                  <span class="v">{{infoData.prepayAmount}}</span>
                </div>
              </div>
            </div>
            <div class="main_foot">
              <div class="main_foot_item" @click="openMoney">
                <i class="iconfont jinxiaocun-xiaoshoukaidan"></i>
                <p>收款</p>
              </div>
              <div class="main_foot_item">
                <i class="iconfont fasongduizhangdan"></i>
                <p>发送对账单</p>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="修改信息" name="2">
          <div class="main">
            <div class="main_form">
              <el-form :inline="true" label-width="100px" :model="midefyInfo" :rules="rules" ref="form">
                <el-form-item label="客户名称" prop="companyName">
                  <el-input size="small" v-model="midefyInfo.companyName"></el-input>
                </el-form-item>
                <el-form-item label="客户地址" prop="address">
                  <el-input size="small" v-model="midefyInfo.address"></el-input>
                </el-form-item>
                <el-form-item label="客户电话" prop="cPhone">
                  <el-input size="small" v-model="midefyInfo.cPhone"></el-input>
                </el-form-item>
                <el-form-item label="初期欠款">
                  <el-input-number class="input-number input__inner" style="width: 200px" size="small" v-model="midefyInfo.initialArrears"></el-input-number>
                </el-form-item>
                <el-form-item label="优惠折扣">
                  <el-input-number class="input-number input__inner" style="width: 200px" size="small" v-model="midefyInfo.discount"></el-input-number>
                </el-form-item>
                <el-form-item label="联系人" prop="displayName">
                  <el-input size="small" v-model="midefyInfo.displayName"></el-input>
                </el-form-item>
                <el-form-item label="联系人QQ">
                  <el-input size="small" v-model="midefyInfo.qq"></el-input>
                </el-form-item>
                <el-form-item label="联系人邮箱">
                  <el-input size="small" v-model="midefyInfo.email"></el-input>
                </el-form-item>
                <el-form-item label="客户归属">
                  <el-input size="small" v-model="midefyInfo.departName"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                  <el-input size="small" v-model="midefyInfo.memo"></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div style="margin-top: 30px;text-align: center">
              <el-button type="primary" plain @click="visible=false">取消</el-button>
              <el-button type="primary" @click="submitForm">确定</el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="历史订单" name="3">
          <div class="main">
            <el-table height="100%" :data="historyList">
              <el-table-column label="序号" type="index"></el-table-column>
              <el-table-column label="销售单号">
                <template slot-scope="scope"><a href="javascript:void(0)">{{scope.row.orderNo}}</a></template>
              </el-table-column>
              <el-table-column label="销售时间">
                <template slot-scope="scope">{{scope.row.createTime|time('y-m-d')}}</template>
              </el-table-column>
              <el-table-column label='销售数量' prop='orderPackages'></el-table-column>
              <el-table-column label='销售金额' prop='prepayAmount'></el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="销售统计" name="4">
          <div class="main">
            <div class="main_table">
              <el-table height="100%" :data="tongji">
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column label="月份" prop="month"></el-table-column>
                <el-table-column label="数量" prop="orderPackages"></el-table-column>
                <el-table-column label="销售额" prop="total"></el-table-column>
              </el-table>
            </div>
            <div class="main_echart" id="myChart"></div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
		<!-- 添加客户 -->
		<newcustomer ref="newcustomer" @fin="refresh"></newcustomer>
		<!-- 收款 -->
		<el-dialog class="paysale" width="720px" title='销售收款' center :visible.sync='moneyVisible' v-dialogDrag>
      <el-form :inline="true" class="demo-form-inline" label-width="100px" size="small">
        <el-form-item label="付款金额">
          <el-input v-model="payPrice" disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="付款账号">
          <el-select v-model="accKey" placeholder="请选择">
            <el-option v-for='(val,key) in account' :label="val.name" :value="key" :key='key'></el-option>
          </el-select>
        </el-form-item>
      </el-form>
			<el-table :data='saleOrder' @selection-change='changeSelection' height='350'>
				<el-table-column type='selection'></el-table-column>
				<el-table-column show-overflow-tooltip label='销售单号' prop='orderNo'></el-table-column>
				<el-table-column show-overflow-tooltip label='待付金额' prop='receivableAmount'></el-table-column>
				<el-table-column label='优惠金额'>
					<template slot-scope='scope'>
            <el-input-number size="mini" @change="changePre(scope.row)" v-model="scope.row.preferentialAmount" :min="0" :max="scope.row.receivableAmount" style="width: 120px"></el-input-number>
					</template>
				</el-table-column>
				<el-table-column label='本次付款'>
					<template slot-scope='scope'>
            <el-input-number size="mini" @change="changePayPrice(scope.row)" v-model="scope.row.payPrice" :min="0" :max="scope.row.receivableAmount" style="width: 120px;"></el-input-number>
					</template>
				</el-table-column>
			</el-table>
      <div style="margin-top:30px;text-align:center;">
        <el-button type="primary" plain @click="moneyVisible=false">取消</el-button>
        <el-button type="primary" @click="getMoney">确定</el-button>
      </div>
		</el-dialog>
    <!-- 截图框 -->
    <xcropper ref="cropper" ></xcropper>
	</div>
</template>

<script>
import headBackTitle from '@/components/headBackTitle.vue'
import options from '@/components/options.vue'
import newcustomer from '../../inventory/customer/newcustomer'
import echarts from 'echarts'
import xcropper from '@/components/xcropper'
export default {
  components: {
    "ym-hbt": headBackTitle,
    "newcustomer":newcustomer,
    "options":options,
    "xcropper":xcropper
  },
  data() {
    let checkPhone = (rule, value, callback)=>{
      if (!(/^1[3456789]\d{9}$/.test(value))) {
        callback(new Error('请输入正确的手机号'));
      } else {
        callback();
      }
    };
    return {
      accKey: '',
      account:[],
      isSelect: true,
      isTable: true,
      moneyVisible: false,
      tenantId: JSON.parse(this.$store.state.token).tenantId,
      userId: JSON.parse(this.$store.state.token).id,
      role: JSON.parse(this.$store.state.role),
      dataList:[],
      total:0,
      loadmore:false,
      pageNum:1,
      option:{dateState:null},
      options:{},
      activeName:'first',
      setVisible:false,
      multipleSelection:[],
      detaVisible:false,
      tabs:"1",
      visible:false,
      infoData: {},
      midefyInfo:{},
      rules:{
        companyName:[{required:true,message:'请输入客户名称',trigger:'blur'},{min:2,max:10,message:'长度在2 - 10 个字符之间',trigger:'blur'}],
        address:[{required:true,message:'请输入客户地址',trigger:'blur'},{min:2,max:50,message:'长度在2 - 50 个字符之间',trigger:'blur'}],
        phone:[{required:true,message:'请输入联系人电话',trigger:'blur'},{ validator: checkPhone, trigger: 'blur' }],
        cPhone:[{required:true,message:'请输入客户电话',trigger:'blur'},{ validator: checkPhone, trigger: 'blur' }],
        displayName:[{required:true,message:'请输入联系人名称',trigger:'blur'},{min:2,max:10,message:'长度在2 - 10 个字符之间',trigger:'blur'}],
      },
      historyList: [],
      tongji:[],
      saleOrder:[],
      selectSale:[],
      payPrice:0,
		  optionTime:'',
    }
  },
  computed:{
    clearShow:function(){
      for(let k in this.option){
        if(this.option[k]||this.option[k]===0){
          return true;
        }
      }
      return false;
    },
    tableShow:function() {
      let temp = {};
      this.tableOptions.forEach((val)=>{
        temp[val.key]=val.show
      });
      return temp;
    },
		tableOptions:function(){
			return JSON.parse(this.$store.state.setJson).tableOptions.RCU;
		}
  },
  methods: {
    /**
    * 获取客户列表数据
    * @method getData
    */
    getData(pageNum,pageSize,options,callback){
      let params = {
        tenantId:this.tenantId,
        pageNum:pageNum,
        pageSize:pageSize
      };
      params = Object.assign(params,options);
      this.$axios.get('/aps/customerCompany/showCustomerCompanyPage',{params})
      .then(res=>{
        if(res.data&&res.data.data){
          this.dataList = this.dataList.concat(res.data.data.dataList);
          this.total = res.data.data.total;
        }
        callback?callback(res.data.data):null;
      },()=>{callback?callback(false):null})
    },
    /**
    * 无限加载
    * @method load
    */
    load(callback){
      this.getData(this.pageNum++,30,this.option,(data)=>{
        callback();
        this.loadmore = data.pages>data.pageNo;
      })
    },
    /**
    * 刷新
    * @method refresh
    */
    refresh(){
      const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
      this.dataList = [];
      this.pageNum = 1;
      this.option = {dateState:null};
      this.getData(this.pageNum++,30,{},(data)=>{
        loading.close();
        this.loadmore = data.pages>data.pageNo;
        if(data){
          this.$message.success('刷新完成');
        }else{
          this.$message.error('刷新失败');
        }
      })
    },
    /**
    * 筛选数据
    * @method screen
    */
    screen(){
      this.dataList = [];
      this.pageNum = 1;
      const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
      let data = {...this.option};
      for(let i in data){if(!data[i]&&data[i]!==0){delete data[i]}}
      this.getData(this.pageNum++,30,data,()=>{
        loading.close();
      })
    },
    /**
    * 搜素框
    * @method screenBar
    */
    screenBar(){
      window.clearTimeout(this.timer);
      this.timer = setTimeout(()=>{
        this.screen();
      },500)
    },
	  // 时间段筛选
	  screenTime(){
		  this.option ={dateState:null};
		  this.$set(this.option,'dateTime',this.time(this.optionTime[0], 'Y/M/D h/m/s') + ',' + this.time(this.optionTime[1], 'Y/M/D h/m/s'));
		  this.screen();
	  },
    /**
    * 清楚选项
    * @method removeOption
    */
    removeOption(){
      this.option.dateState=null;
      this.option.dateTime = null;
      this.optionTime = null;
      this.refresh();
    },
    /**
    * 筛选字段跟新
    * @method updataSelections
    */
    updataSelections(data){
      this.selections = JSON.parse(JSON.stringify(data));
      this.refresh();
    },
    /**
    * 表格字段更新
    * @method updataTableOptions
    */
    updataTableOptions(data){
      let setJson = JSON.parse(this.$store.state.setJson);
      setJson.tableOptions.RCU = data;
      this.$store.commit('setSetJson', setJson);
      this.upSetJson(setJson);
    },
		// 上传设置数据
		upSetJson(val) {
			let data = {
				settingText: JSON.stringify(val),
				tenantId: this.tenantId,
				userId: this.userId
			}
			this.$axios.post('/api/userSettingTable/modifyUserSettingTable', data)
		},
    /**
    * 表格选中
    * @method handleSelectionChange
    */
    handleSelectionChange(data){
      this.multipleSelection = data;
    },
    /**
    * 导出客户
    * @method exportExcel
    */
    exportExcel(){
      if(this.multipleSelection.length===0) return this.$message.error('请选择导出的客户');
      let { export_json_to_excel }=require('../../../assets/excel/Export2Excel');
      require.ensure([],()=>{
        var tHeader=['客户名称','客户手机号','联系人员','优惠折扣','应收款','初期欠款'];
        var filterVal=['fullName','phone','displayName','discount','orderReceivable','initialArrears'];
        var list=this.multipleSelection;
        var data=list.map(v=>filterVal.map(j=>v[j]));
        export_json_to_excel(tHeader,data,'客户列表');
　　  })
    },
    /**
    * 打开新建客户窗口
    * @method openNew
    */
    openNew(){
      if(this.role.erp_customer_new){
        this.$refs.newcustomer.open()
      }else{
        this.$message.error('您没有新建客户的权限')
      }
    },
    /**
    * 打开客户信息窗口
    * @method openCustomer
    */
    openCustomer(data){
      const loading = this.$loading({lock:true,text:'数据加载中...',spinner:'el-icon-loading',background:'rgba(0,0,0,0.7)'});
      let params = {companyId:data.id};
      this.$axios.get('/aps/customerCompany/showCustomerContace',{params})
      .then(res=>{
        loading.close();
        if(res.data&&res.data.data){
          this.visible = true;
          this.infoData = res.data.data;
          this.infoData.companyName = data.fullName;
          this.infoData.initialArrears = data.initialArrears;
          this.infoData.discount = data.discount;
          this.infoData.address = data.address;
          this.infoData.cId = data.id;
          this.infoData.cPhone = data.phone;
          this.infoData.logo = data.logo;
          this.midefyInfo = JSON.parse(JSON.stringify(this.infoData));
        }else{
          this.$message.error('获取客户信息失败')
        }
      },()=>{loading.close();this.$message.error('获取客户信息失败')})
    },
    /**
    * @method handleClick
    */
    handleClick(){
      if(this.tabs === '3') this.getHistoryOrder();
      if(this.tabs === '4') this.getTongji();
    },
    /**
    * 历史订单
    * @method getHistoryOrder
    * @param data
    */
    getHistoryOrder(){
      const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
      let params = {contactId: this.infoData.id};
      this.$axios.get('/aps/sell/showCustomerSell',{params})
      .then(res=>{
        loading.close();
        if(res.data&&res.data.data){
          this.historyList = res.data.data;
        }else{
          this.historyList = [];
          this.$message.error('获取信息失败')
        }
      },()=>{loading.close();this.$message.error('获取信息失败')})
    },
    /**
    * 统计数据
    * @method getTongji
    */
    getTongji(){
      const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
      this.$axios.get('/aps/customerCompany/showTotalSell/'+this.infoData.id)
      .then(res=>{
        loading.close();
        if(res.data&&res.data.data){
          this.tongji = res.data.data;
          this.statisticsData(this.tongji);
        }else{
          this.$message.error('获取信息失败')
        }
      },()=>{loading.close();this.$message.error('获取信息失败')})
    },
    /**
    * @method statisticsData
    */
    statisticsData(data) {
      let xVal = [];
      let yVal = [];
      for (let i in data) {
        xVal.push(data[i].month);
        yVal.push(data[i].total);
      }
      let myChart = echarts.init(document.getElementById('myChart'));
      let option = {
        tooltip: {
          trigger: 'none',
          axisPointer: {
            type: 'cross'
          }
        },
        grid: {
          top: 10,
          bottom: 20
        },
        xAxis: [{
          type: 'category',
          axisTick: {
            alignWithLabel: true
          },
          axisLine: {
            onZero: false,
            lineStyle: {
              color: "#5793f3"
            }
          },
          axisPointer: {
            label: {
              formatter: function(params) {
                return '月份 ' + params.value + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
              }
            }
          },
          data: xVal
        }],
        yAxis: [{
          type: 'value'
        }],
        series: [{
          name: '2016 降水量',
          type: 'line',
          smooth: true,
          data: yVal
        }]
      };
      myChart.setOption(option);
    },
    /**
    * 验证表格
    * @method submitForm
    */
    submitForm(){
      this.$refs.form.validate((val)=>{
        if(val){
          this.sureMidefyPeople();
        }else{
          this.$message.error('请验证信息是否填写正确')
        }
      })
    },
    /**
    * 修改客户信息
    * @method sureMidefy
    */
    sureMidefy() {
      this.visible = false;
      this.$axios({
        method: 'post',
        url: "/aps/customerCompany/modifyCustomerCompanyW",
        data: {
          id: this.midefyInfo.cId,
          fullName: this.midefyInfo.companyName,
          address: this.midefyInfo.address,
          initialArrears: this.midefyInfo.initialArrears,
          discount: this.midefyInfo.discount,
          tenantId: this.tenantId,
          creatorId: this.userId,
          updateTime: new Date(),
        }
      }).then(res => {
        if (res && res.data.data) {
          this.getData();
        }
      })
    },
    /**
    * 修改联系人信息
    * @method sureMidefyPeople
    */
    sureMidefyPeople() {
      this.$axios({
        method: 'post',
        url: '/aps/customerCompany/modifyCustomerContactW',
        data: {
          id: this.midefyInfo.id,
          displayName: this.midefyInfo.displayName,
          phone: this.midefyInfo.phone,
          qq: this.midefyInfo.qq,
          email: this.midefyInfo.email,
          departName: this.midefyInfo.departName,
          memo: this.midefyInfo.memo,
          creatorId: this.userId,
          tenantId: this.tenantId,
        }
      }).then(res => {
        if (res && res.data.data) {
          this.sureMidefy();
        }
      })
    },
    /**
    * 打开收款
    * @method openMoney
    */
    openMoney(){
      const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
      this.$axios.all([this.getAccount(),this.getSale()])
        .then(this.$axios.spread((acct,perms)=>{
          loading.close();
          if(acct.data&&acct.data.data&&perms.data&&perms.data.data){
            this.moneyVisible = true;
            this.account = acct.data.data;
            let data = perms.data.data;
            data.forEach((val)=>{
              val.payPrice = val.receivableAmount;
            });
            this.saleOrder = data;
          }else{
            this.$message.error('获取信息失败');
          }
        }),()=>{loading.close();this.$message.error('获取信息失败')})
    },
    /**
    * 获取账号信息
    * @method getAccount
    */
    getAccount(){
      let params = {tenantId:this.tenantId};
      return this.$axios.get('/apa/financeTable/showPaymentAccount',{params});
    },
    /**
    * 获取销售单
    * @method getSale
    */
    getSale(){
      let params = {contactId:this.infoData.id};
      return this.$axios.get('/aps/sell/showCustomerSell',{params});
    },
    /**
    * 修改优惠金额
    * @method changePre
    */
    changePre(data){
      let pay = data.receivableAmount - data.preferentialAmount;
      if(data.payPrice>pay){
          data.payPrice = pay;
      }
      this.sumNum();
    },
    /**
    * 修改付款金额
    * @method changePayPrice
    */
    changePayPrice(data){
      let pro = data.receivableAmount - data.payPrice;
      if(data.preferentialAmount>pro){
        data.preferentialAmount = pro;
      }
      this.sumNum();
    },
    /**
    * 选择收款销售单
    * @method changeSelection
    */
    changeSelection(data){
      this.selectSale = data;
      this.sumNum();
    },
    /**
    * 计算付款金额
    * @method sumNum
    */
    sumNum(){
      let payPrice = 0;
      for(let i in this.selectSale){
        payPrice += this.selectSale[i].payPrice;
      }
      this.payPrice = payPrice;
    },
    /**
    * 收款
    * @method getMoney
    */
    getMoney(){
      if(!this.role.erp_pay_new) return this.$message.error('没有权限');
    	if(this.selectSale.length===0) return this.$message.error('请选择付款销售单');
    	if(!this.account[this.accKey]) return this.$message.error('请选择账户');
		  const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
    	let str = '';
    	for (let i in this.selectSale){
    		str += this.selectSale[i].id + ','
      }
      let data = {
      	tenantId:this.tenantId,
        creatorId:this.userId,
		    toAccountName: this.account[this.accKey].name,
		    toAccountType: this.account[this.accKey].displayName,
		    toPaymentAccountId: this.account[this.accKey].id,
		    type: 9,
		    updateTime: new Date(),
		    pushTime: new Date(),
		    status: 1,
        reffer:str,
        money:this.payPrice,
		    fromAccountName: 'undefined',
		    fromAccountType: 'undefined',
      };
    	this.$axios.post('/apa/financeTable/addFinanceTable',data)
      .then(res=>{
        if(res.data&&res.data.data){
          this.x = 0;
          this.n = this.selectSale.length;
          for(let i in this.selectSale){
			      this.postPayPrice(this.selectSale[i],loading);
          }
        } else {
			    loading.close();
        	this.$message.error('收款失败')
        }
      },()=>{loading.close();this.$message.error('收款失败')})
    },
    //销售付款
    postPayPrice(data,loading) {
      this.$axios({
        method: 'post',
        url: '/api/storeOutForm/Receivables',
        data: {
          sellForm: {
            id: data.id,
			      preferentialAmount:data.preferentialAmount,
			      prepayAmount:data.prepayAmount + data.payPrice,
			      receivableAmount:data.orderAmount - data.preferentialAmount - data.prepayAmount - data.payPrice,
          },
          collectMoney: {
            actualMoney: data.payPrice,
            discountPrice: data.preferentialAmount,
            operatorId: this.userId,
            orderSn: data.orderNo,
          }
        }
      }).then(res => {
      	this.x++;
      	if(this.x===this.n){
      		loading.close();
          this.moneyVisible = false;
          this.visible = false;
          this.refresh();
        }
      },()=>{
        this.x++;
        if(this.x===this.n){
          loading.close();
			    this.moneyVisible = false;
			    this.visible = false;
			    this.refresh();
        }
      })
    },
    //修改客户待付金额
    //打开截图框
    openCropper(){
      let option = {
        title:'修改logo',
        msg:'大小不超过2M',
        autoCropWidth:200,
        autoCropHeight:200,
        fixedNumber:[1,1],
      };
      this.$refs.cropper.open(option,(val)=>{
        const loading = this.$loading({lock: true, text: '修改客户信息', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let data = {
          id:this.midefyInfo.cId,
          tenantId:this.tenantId,
          logo:val
        };
        this.$axios.post('/aps/customerCompany/modifyCustomerCompanyW',data)
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.infoData.logo = val;
            this.refresh();
          }else{
            this.$message.error('修改头像失败');
          }
        },()=>{loading.close();this.$message.error('修改头像失败')})
      })
    }
  },
  watch: {
    payList: {
      handler: function() {
        this.sumPrice()
      },
      deep: true,
    }
  },
  mounted() {
    setTimeout(() => {
      this.isSelect = false;
    }, 1500);
  }
};
</script>
<style>
  .paysale .el-input-number span{
    display: none;
  }
  .paysale .el-input-number .el-input__inner{
    padding-right: 10px;
    padding-left: 10px;
  }
</style>
<style lang="scss" scoped>
  .main{
    height: 400px;
    .main_top{
      height: 290px;
      position: relative;
      .main_img{
        position: absolute;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        top: 20px;
        left: 50px;
        border: 1px solid #cccccc;
        overflow: hidden;
        &:hover{
          i{
            display: block;
          }
        }
        img{
          width:100%;
          height: 100%;
        }
        i{
          position: absolute;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0,0,0,0.5);
          color: #cccccc;
          text-align: center;
          line-height: 95px;
          cursor: pointer;
          display: none;
          font-weight: bold;
        }
      }
      .main_info{
        margin-left: 200px;
        height: 100%;
        .main_info_item{
          float: left;
          width: 50%;
          height: 30px;
          padding-left: 20px;
          padding-right: 20px;
          line-height: 30px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-top: 15px;
          span{
            display: inline-block;
          }
          .n{
            width: 80px;
            text-align: right;
          }
        }
      }
    }
    .main_foot{
      height: 110px;
      text-align:center;
      padding-top: 12px;
      border-top: 1px solid #e5e5e5;
      .main_foot_item{
        display: inline-block;
        width: 95px;
        height: 95px;
        border-radius: 50%;
        margin-left: 20px;
        margin-right: 20px;
        cursor:pointer;
        color: #666666;
        padding-top: 13px;
        &:hover{
          background-color: #409EFF;
          color: #ffffff;
        }
        i{
          font-size: 40px;
          line-height: 40px;
        }
      }
    }
    .main_form{
      height: 330px;
      padding:0 58px;
    }
    .main_table{
      height: 200px;
    }
    .main_echart{
      height: 200px;
    }
  }
	.listModule .card_li .card_li_con {
		padding-bottom: 60%;
	}

	.content_left {
		float: left;
		width: 40%;
		height: 100%;
		background: #fff;
		position: relative;

		img {
			width: 50px;
			height: 50px;
			border-radius: 50%;
			position: absolute;
			left: calc(50% - 25px);
			top: calc(50% - 25px);
		}
	}

	.content_right {
		float: left;
		width: 60%;
		height: 100%;
		background: #F9F9FB;
		padding: 0 10px;

		.content_right_row {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
      font-size:14px;
      line-height: 20px;
		}
    .row1{
      margin-top: 15px;
      margin-bottom: 10px;
    }
    .row2{
      margin-bottom: 5px;
    }
	}
</style>
