<template lang="html">
	<div class="listModule">
		<div class="list_header">
			<ym-hbt :to='{name:"customerHome"}' title='客户管理'></ym-hbt>
		</div>
		<div class="list_setbar">
			<div class="list_setbar_options">
				<div class="option" @click='isTable = !isTable' v-show="!multipleSelection.length>0">
					<div class="option_yuan"><i class="iconfont" :class="isTable?'jiugongge':'liebiao'"></i></div>
				</div>
				<div class="option" @click='refresh' v-show="!multipleSelection.length>0">
					<div class="option_yuan"><i class="iconfont shuaxin"></i></div>
					<span class="option_txt">刷新</span>
				</div>
				<div class="option" @click='openNew' v-show="!multipleSelection.length>0">
					<div class="option_yuan"><i class="iconfont xinjian"></i></div>
					<span class="option_txt">新建</span>
				</div>
				<div class="option" @click='isSelect = !isSelect' v-show="!multipleSelection.length>0">
					<div class="option_yuan"><i class="iconfont shaixuan"></i></div>
					<span class="option_txt">筛选</span>
				</div>
				<div class="option" @click='setVisible=true'  v-show="!multipleSelection.length>0">
					<div class="option_yuan"><i class="iconfont cebian-shezhi"></i></div>
					<span class="option_txt">设置</span>
				</div>
				<div class="option" @click='removeData' v-show="multipleSelection.length>0">
					<div class="option_yuan"><i class="iconfont shanchu"></i></div>
					<span class="option_txt">删除</span>
				</div>
				<div class="option" @click='exportExcel' v-show="multipleSelection.length>0">
					<div class="option_yuan"><i class="iconfont daochu1"></i></div>
					<span class="option_txt">导出</span>
				</div>
				<div class="search_input">
					<i class="iconfont sousuo"></i>
					<input class="search_input_placeholder" type="text" v-model="option.phone" placeholder="客户名称/联系人/手机号" @change='screenBar'>
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
						<el-table-column v-if='tableShow.phone' show-overflow-tooltip label='客户手机号' prop='phone'></el-table-column>
						<el-table-column v-if='tableShow.displayName' show-overflow-tooltip label='联系人员' prop='displayName'></el-table-column>
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
										<img :src="val.logo|imgUrl" alt="">
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
											<span class="v" style="color:#E77762">{{val.orderReceivable}}</span>
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
		<!-- 详情弹窗 -->
    <el-dialog width="800px" title="客户信息" center :visible.sync="detaVisible" v-dialogDrag>
      <el-tabs v-model="tabs"  @tab-click="handleClick">
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
                  <span class="n">公司归属:</span>
                  <span class="v">{{infoData.contactType===1?'公司':'个人'}}</span>
                </div>
                <div class="main_info_item">
                  <span class="n">客户电话:</span>
                  <span class="v">{{infoData.cPhone}}</span>
                </div>
                <div class="main_info_item">
                  <span class="n">客户传真:</span>
                  <span class="v">{{infoData.fax}}</span>
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
              </div>
            </div>
            <div class="main_foot">
              <div class="main_foot_item" @click="$router.push({name:'openSale',params:{data:infoData}})">
                <i class="iconfont jinxiaocun-xiaoshoukaidan1"></i>
                <p>销售开单</p>
              </div>
              <div class="main_foot_item">
                <i class="iconfont fasongduizhangdan"></i>
                <p>发送对账单</p>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane v-if="role.erp_customer_mod" label="修改资料" name="2">
          <div class="main">
            <div class="main_form el-form-item-14">
              <el-form :inline="true" label-width="100px" :model="midefyInfo" :rules="rules" ref="form">
                <el-form-item label="客户名称" prop="companyName">
                  <el-input style="width:200px" size="small" v-model="midefyInfo.companyName"></el-input>
                </el-form-item>
                <el-form-item label="客户地址" prop="address">
                  <el-input style="width:200px" size="small" v-model="midefyInfo.address"></el-input>
                </el-form-item>
                <el-form-item label="客户电话" prop="cPhone">
                  <el-input style="width:200px" size="small" v-model="midefyInfo.cPhone"></el-input>
                </el-form-item>
                <el-form-item label="客户传真">
                  <el-input style="width:200px" size="small" v-model="midefyInfo.fax"></el-input>
                </el-form-item>
                <el-form-item label="初期欠款">
                  <el-input-number class="input-number input__inner" style="width: 200px" size="small" v-model="midefyInfo.initialArrears"></el-input-number>
                </el-form-item>
                <el-form-item label="优惠折扣">
                  <el-input-number class="input-number input__inner" style="width: 200px" size="small" v-model="midefyInfo.discount"></el-input-number>
                </el-form-item>
                <el-form-item label="联系人" prop="displayName">
                  <el-input style="width:200px" size="small" v-model="midefyInfo.displayName"></el-input>
                </el-form-item>
                <el-form-item label="QQ">
                  <el-input style="width:200px" size="small" v-model="midefyInfo.qq"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                  <el-input style="width:200px" size="small" v-model="midefyInfo.email"></el-input>
                </el-form-item>
                <el-form-item label="公司归属" prop="contactType">
                  <el-select size="small" style="width: 200px" v-model="midefyInfo.contactType" placeholder="请选择">
                    <el-option label="公司" :value="1"></el-option>
                    <el-option label="个人" :value="2"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="备注">
                  <el-input style="width:200px" size="small" v-model="midefyInfo.memo"></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div style="margin-top: 30px;text-align: center">
              <el-button type="primary" plain @click="detaVisible=false">取消</el-button>
              <el-button type="primary" @click="submitForm">确定</el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="历史订单" name="3">
          <div class="main">
            <el-table height="100%" :data="historyList">
              <el-table-column label="序号" type="index" width="50px"></el-table-column>
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
		<!-- 设置弹窗 -->
		<el-dialog title='设置' center :visible.sync='setVisible' width='800px' v-dialogDrag>
			<div>
				<el-tabs v-model="activeName">
			    <el-tab-pane label="表格字段" name="first">
			    	<options :data='tableOptions' @cb='updataTableOptions' @close='setVisible=false'></options>
			    </el-tab-pane>
			  </el-tabs>
			</div>
		</el-dialog>
    <!-- 截图框 -->
    <xcropper ref="cropper" ></xcropper>
	</div>
</template>

<script>
	import headBackTitle from '@/components/headBackTitle.vue'
	import options from '@/components/options.vue'
	import echarts from 'echarts';
	import newcustomer from './newcustomer'
	import xcropper from '@/components/xcropper'

	export default {
		components: {
			"ym-hbt": headBackTitle,
			"newcustomer":newcustomer,
			"options":options,
      "xcropper":xcropper
		},
		data() {
			return {
				isTable: true,
				isSelect: true,
				date: null,
				tenantId: JSON.parse(this.$store.state.token).tenantId,
				userId: JSON.parse(this.$store.state.token).id,
				dataList: [],
				detaVisible: false,
				tabs: '1',
				infoData: {},
				midefyInfo: {
					companyName:'',
					address:'',
					displayName:'',
					cPhone:'',
          contactType:'',
				},
				historyList: [],
        tongji: [],
				metaData: [],
				addVisible: false,
				addInfo: {},
				setVisible: false,
				setext: '',
				role: JSON.parse(this.$store.state.role),
				rules:{
					companyName:[{required:true,message:'请输入客户名称',trigger:'blur'},{min:2,max:10,message:'长度在2 - 10 个字符之间',trigger:'blur'}],
					address:[{required:true,message:'请输入客户地址',trigger:'blur'},{min:2,max:50,message:'长度在2 - 50 个字符之间',trigger:'blur'}],
					cPhone:[{required:true,message:'请输入客户电话',trigger:'blur'}],
					displayName:[{required:true,message:'请输入联系人名称',trigger:'blur'},{min:2,max:10,message:'长度在2 - 10 个字符之间',trigger:'blur'}],
			    contactType:[{required:true,message:'请选择客户类型',trigger:'blur'}],
				},
				multipleSelection:[],
				pageNum: 1,
				disabled:false,
				loadmore:false,
				options:{},
				option:{dateState:null},
				activeName:'first',
				total:0,
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
				return JSON.parse(this.$store.state.setJson).tableOptions.CU;
			}
		},
		methods: {
			/**
      * 刷新客户列表数据
      * @method refresh
      * */
			refresh(){
				const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				//重新请求数据
				this.dataList = [];
				this.pageNum = 1;
				this.option = {dateState:null};
				this.getData(this.pageNum++,30,{},(data)=>{
					loading.close();
					this.loadmore = data.pages>data.pageNo;
					if(data){
						this.$message.success('刷新完成')
					}else{
						this.$message.error('刷新失败')
					}
				})
			},
			/**
			* 无限加载
			* @method load
			**/
			load(callback){
				this.getData(this.pageNum++,30,this.option,(data)=>{
					callback();
					this.loadmore = data.pages>data.pageNo
				})
			},
			/**
      * 获取客户列表数据
      * @method getData
      * @param pageNum 请求页码
      * @param pageSize 每页数据条数
      * @param options 筛选项对象
      * @param { function } callback 回调函数
			**/
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
						callback?callback(res.data.data):null
					},()=>{
						callback?callback(false):null
					})
			},
			/**
			* 搜索框
			* @method screenBar
			*/
			screenBar(){
				window.clearTimeout(this.timer);
				this.timer = setTimeout(()=>{
					this.screen();
				},500)
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
      // 时间段筛选
		  screenTime(){
        this.option.dateState = null;
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
				this.screen();
			},
			/**
			* 导出客户
			* @method exportExcel
			**/
			exportExcel(){
				if(this.multipleSelection.length===0) return this.$message.error('请选择导出的客户');
				let { export_json_to_excel }=require('../../../assets/excel/Export2Excel');
        require.ensure([],()=>{
          let tHeader = ['客户名称', '客户手机号', '联系人员', '优惠折扣', '应收款', '初期欠款'];
          let filterVal = ['fullName', 'phone', 'displayName', 'discount', 'orderReceivable', 'initialArrears'];
          let list = this.multipleSelection;
          let data = list.map(v => filterVal.map(j => v[j]));
          export_json_to_excel(tHeader,data,'客户列表');
    　　})
			},
			/**
			* 删除客户
			* @method removeData
			**/
			removeData(){
				const loading = this.$loading({lock: true, text: '删除客户中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				if(this.multipleSelection.length===0) return this.$message.error('请选择要删除的客户');
				let data = [];
				this.multipleSelection.forEach((val)=>{
					data.push(val.id)
				});
				this.$axios.post('/aps/customerCompany/updateCustomerByIds',data)
					.then(res=>{
						loading.close();
						if(res.data&&res.data.data){
							this.refresh();
						}
					},()=>{
						loading.close();
						this.$message.error('客户删除失败')
					})
			},
			/**
      * 打开新建客户窗口
      * @method openNew
      * */
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
      * @param data 客户信息
      * */
			openCustomer(data){
				const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let params = {companyId:data.id};
				this.$axios.get('/aps/customerCompany/showCustomerContace',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.detaVisible = true;
            this.tabs = '1';
            this.infoData = res.data.data;
            this.infoData.companyName = data.fullName;
            this.infoData.initialArrears = data.initialArrears;
            this.infoData.discount = data.discount;
            this.infoData.address = data.address;
            this.infoData.cId = data.id;
            this.infoData.cPhone = data.phone;
            this.infoData.logo = data.logo;
            this.infoData.fax = data.fax;
            this.midefyInfo = JSON.parse(JSON.stringify(this.infoData));
          }else{
            this.$message.error('获取客户信息失败')
          }
        },()=>{
          loading.close();
          this.$message.error('获取客户信息失败')
        })
			},
      /**
      * @method handleClick
      */
      handleClick(){
        if(this.tabs === '3') this.getHistoryList();
        if(this.tabs === '4') this.getTongList();
      },
			/**
			 * 验证修改信息
			 * @method submitForm
			 * */
			submitForm(){
				this.$refs.form.validate((val)=>{
					if(val){
						if(this.role.erp_customer_mod){
				      this.modifyCustomer();
            }else{
							this.$message.error('没有修改权限')
            }
					}else{
						this.$message.error('请验证信息是否填写正确')
					}
				})
			},
			/**
			 * 修改客户信息
			 * @method modifyCustomer
			 * */
			modifyCustomer(){
				const loading = this.$loading({lock: true, text: '修改客户信息', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let data = {
					id: this.midefyInfo.cId,
					fullName: this.midefyInfo.companyName,
					address: this.midefyInfo.address,
					initialArrears: this.midefyInfo.initialArrears,
					discount: this.midefyInfo.discount,
					phone:this.midefyInfo.cPhone,
					tenantId: this.tenantId,
          fax:this.midefyInfo.fax,
				};
				this.$axios.post('/aps/customerCompany/modifyCustomerCompanyW',data)
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.modifyPeople();
          }else{
            this.$message.error('修改客户信息失败')
          }
        },()=>{
          loading.close();
          this.$message.error('修改客户信息失败')
        })
			},
			/**
			 * 修改联系人信息
			 * @method modifyPeople
			 * */
			modifyPeople(){
				const loading = this.$loading({lock: true, text: '修改联系人信息', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let data = {
					id: this.midefyInfo.id,
					displayName: this.midefyInfo.displayName,
					qq: this.midefyInfo.qq,
					email: this.midefyInfo.email,
					departName: this.midefyInfo.departName,
					memo: this.midefyInfo.memo,
					creatorId: this.userId,
					tenantId: this.tenantId,
			    contactType:this.midefyInfo.contactType,
				};
				this.$axios.post('/aps/customerCompany/modifyCustomerContactW',data)
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.detaVisible = false;
            this.refresh();
          }else{
            this.$message.error('修改联系人信息失败')
          }
        },()=>{
          loading.close();
          this.$message.error('修改联系人信息失败')
        })
			},
			/**
			 * 获取历史订单信息
			 * @method getHistoryList
			 * */
			getHistoryList() {
				const loading = this.$loading({lock: true, text: 'loading...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let params = {
					contactId:this.infoData.id,
				};
				this.$axios.get('/aps/sell/showCustomerSell',{params})
        .then(res => {
          loading.close();
          if (res && res.data.data) {
            this.historyList = res.data.data;
          } else {
            this.historyList = [];
            this.$message.error('获取历史订单信息失败')
          }
        },()=>{
          loading.close();
          this.historyList = [];
          this.$message.error('获取历史订单信息失败')
        })
			},
			/**
			 * 表格选中
			 * @method handleSelectionChange
			 * */
			handleSelectionChange(data){
				this.multipleSelection = data;
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
				setJson.tableOptions.CU = data;
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
			//获取销售统计
			getTongList() {
				this.$axios({
					method: 'get',
					url: '/aps/customerCompany/showTotalSell/' + this.infoData.id,
				}).then(res => {
					if (res && res.data.data) {
						this.tongji = res.data.data;
						this.StatisticsData(res.data.data);
					}
				})
			},
			//统计图数据
			StatisticsData(data) {
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
					grid: {top: 20,bottom: 20,left:100,right:20,},
					xAxis: [{
						type: 'category',
						axisTick:{alignWithLabel:true},
						axisLine:{onZero:false,lineStyle:{color:"#5793f3"}},
						axisPointer: {
							label: {
								formatter: function(params) {
									return '月份 ' + params.value +
										(params.seriesData.length ? '：' + params.seriesData[0].data : '');
								}
							}
						},
						data: xVal
					}],
					yAxis: [{
						type: 'value'
					}],
					series: [{
						name: '',
						type: 'line',
						smooth: true,
						data: yVal
					}]
				};
				myChart.setOption(option);
			},
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
		mounted() {
			//检验当前用户是否有访问权限
			if(this.role.erp_customer_look){
				setTimeout(() => {this.isSelect = false}, 1500);
			}else{
				this.$message.error('您没有访问客户的权限');
				this.$router.push({
					name: 'customerHome'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
  @import "@/assets/css/jxc/wldw/customer.scss";
	.listModule .card_li .card_li_con {
		padding-bottom: 60%;
	}
</style>
