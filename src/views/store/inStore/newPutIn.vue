<template lang="html">
	<div class="bill">
		<div class="bill_header">
<!--			自定义组件元素，返回按钮-->
			<ym-hbt :to='{name:"inStoreHome"}' title='采购单入库'></ym-hbt>
		</div>
		<div class="bill_mi">
			<span class='bill_set'>设置</span>
			<div class="bill_mi_item">
				<el-checkbox v-model="checkTime">时间</el-checkbox>
			</div>
			<div class="bill_mi_item">
				<el-checkbox v-model="checkPrice">单价</el-checkbox>
			</div>
			<div class="bill_mi_item">
				<el-checkbox v-model="checkmemo">备注</el-checkbox>
			</div>
		</div>
		<div class="bill_main">
			<div class="bill_main_top">
				<div class="bill_infos clearfix">
					<div class="bill_info">
						<i class="ic iconfont cangku"></i>
						<el-select v-model="storeKey" placeholder="选择仓库" @visible-change='showStore'>
							<el-option v-for='(val,key) in storeList' :key='key' :label="val.name" :value="key"></el-option>
						</el-select>
					</div>
					<div class="bill_info" v-if='checkTime'>
            <i class="ic iconfont riqi"></i>
						<el-date-picker v-model="time" type="date" value-format="timestamp" placeholder="选择日期"></el-date-picker>
					</div>
					<div class="bill_info" v-if='checkPrice'>
						<el-select v-model="priceKey" placeholder="选择单价">
							<el-option v-for='(val,key) in priceList' :key='key' :label="val.name+'/'+val.price" :value="key"></el-option>
						</el-select>
					</div>
					<div class="bill_info" v-if='checkmemo'>
						<input v-model='memo' class="bill_info_input" type="text" placeholder="备注">
					</div>
				</div>
				<div class="bill_infos clearfix">
					<div class="bill_info">
						<i class="ic iconfont caigoudanruku"></i>
						<el-select v-model="orderKey" placeholder="选择采购单" @visible-change='showOrd'>
							<el-option v-for='(val,key) in ordList' :key='key' :label="val.outterNo" :value="key"></el-option>
						</el-select>
					</div>
					<div class="bill_info">
            <i class="ic iconfont jinxiaocun-kaizhenggongsiguanli"></i>
						<div class="bill_info_div">{{order.issuingName?order.issuingName:'开证公司'}}</div>
					</div>
					<div class="bill_info">
						<div class="bill_info_div" @click='openDetailed'>卸柜明细</div>
					</div>
					<div class="bill_info">
						<div class="bill_info_div">{{guiNum!=0?guiNum:'进货柜数'}}</div>
					</div>
					<div class="bill_info">
						<div class="bill_info_div">{{tabsData.length>0?tabsData.length:'卸柜数量'}}</div>
					</div>
				</div>
			</div>
			<div class="bill_main_fot" :style="{height:'calc(100% - '+h+'px)'}">
				<div class="bill_table">
					<div class="bill_table_tabs">
						<el-tabs v-model='tabName' @tab-click="buildTableData">
							<el-tab-pane v-for='(val,key) in tabsData' :key='key' :label='val' :name='val'></el-tab-pane>
						</el-tabs>
					</div>
					<div class="bill_table_table">
						<el-table :data='tableList' height='100%'>
							<el-table-column show-overflow-tooltip align='center' type='index' label='序号'></el-table-column>
							<el-table-column show-overflow-tooltip align='center' label='包号' prop='packageNo'></el-table-column>
							<el-table-column show-overflow-tooltip align='center' v-for='(val,key) in tabConfig' :key='key' :label='val'
							 :prop='val'></el-table-column>
							<el-table-column show-overflow-tooltip align='center' label='备注' prop='memo'></el-table-column>
							<el-table-column show-overflow-tooltip>
								<template slot-scope='scope'>
									<i @click='openMidefy(scope.row)' class="ii iconfont xiugai"></i>
									<i @click='removeBao(scope.$index)' class="ii iconfont shanchu"></i>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</div>
				<div class="bill_create_btn">
					<a href="javascript:void(0)" @click='openAdd'>+添加</a>
					<button type="button" @click='post'>创建入库单</button>
				</div>
			</div>
		</div>
		<!-- 明细弹窗 -->
		<el-dialog class="mingXi" title='卸柜选择' center :visible.sync='mingVisible' v-dialogDrag>
			<div class="ming_main">
				<div class="ming_content">
					<div class="ming_content_top">
						<span class="content_top_title">未卸柜编号</span>
						<el-dropdown @command="handleCommand" trigger="click">
							<span class="el-dropdown-link">
								下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
							</span>
							<el-dropdown-menu slot='dropdown'>
								<el-dropdown-item :command="true">全选</el-dropdown-item>
								<el-dropdown-item :command="false">全不选</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
						<input class="content_top_input" type="text" v-model="screenText" placeholder="柜号">
						<i class="content_top_ic iconfont icon-sousuo"></i>
					</div>
					<div class="ming_content_fot">
						<div class="content_fot_item" @click='guiData[key]=true' v-show='!val&&key.indexOf(screenText)!=-1' v-for='(val,key) in guiData' :key='key'>
							<el-tooltip :content='key' placement='top'>
								<span>{{key}}</span>
							</el-tooltip>
						</div>
					</div>
				</div>
				<div class="ming_content">
					<div class="ming_content_top">
						<span class="content_top_title">安排卸柜编号</span>
					</div>
					<div class="ming_content_fot">
						<div class="content_fot_item" @click='guiData[key]=false' v-for='(val,key) in guiData' :key='key' v-show='val'>
							<el-tooltip :content='key' placement='top'>
								<span>{{key}}</span>
							</el-tooltip>
						</div>
					</div>
				</div>
			</div>
			<div style='margin-top:30px;text-align:center'>
				<el-button type='primary' plain @click='mingVisible = false'>取消</el-button>
				<el-button type='primary' @click='buildTabsData'>确定</el-button>
			</div>
		</el-dialog>
		<!-- 修改包 -->
		<el-dialog width="500px" title="修改产品信息" center :visible.sync='midefyVisible' v-dialogDrag>
			<div class="midefy_main">
				<div class="midefy_main_top">
					<div class="midefy_top_row">
						<span class="n">包号：</span>
						<span class="v">{{midefyObj.packageNo}}</span>
					</div>
					<div class="midefy_top_row">
						<span class="n">品类：</span>
						<span class="v">{{midefyObj.品类}}</span>
					</div>
					<div class="midefy_top_row">
						<span class="n">树种：</span>
						<span class="v">{{midefyObj.树种}}</span>
					</div>
					<div class="midefy_top_row">
						<span class="n">品牌：</span>
						<span class="v">{{midefyObj.品牌}}</span>
					</div>
					<div class="midefy_top_row">
						<span class="n">等级：</span>
						<span class="v">{{midefyObj.等级}}</span>
					</div>
					<div class="midefy_top_row" v-for='(val,key) in tabConfig' :key='key' v-if='val!="品类"&&val!="树种"&&val!="品牌"&&val!="等级"'>
						<span class="n">{{val}}：</span>
						<input class="vi" v-model='midefyObj[val]'>
					</div>
				</div>
        <div style="margin-top: 30px;text-align: center">
          <el-button type="primary" plain @click='midefyVisible=false'>取消</el-button>
          <el-button type="primary" @click='postMidefy'>确定</el-button>
        </div>
			</div>
		</el-dialog>
		<!-- 添加商品详情 -->
		<el-dialog class='add' title='添加详情' center :visible.sync='addVisible' v-dialogDrag>
			<div class="add_main">
				<div class="twoCol">
					<div class="cloumn">
						<label>品类：</label><input type="text" v-model='goods.品类' readonly>
					</div>
					<div class="cloumn">
						<label>树种：</label><input type="text" v-model='goods.树种'>
					</div>
					<div class="cloumn">
						<label>品牌：</label><input type="text" v-model='goods.品牌'>
					</div>
					<div class="cloumn">
						<label>等级：</label><input type="text" v-model='goods.等级'>
					</div>
					<div class="cloumn" v-if='column(val)' v-for='(val,key) in tabConfig' :key='key'>
						<label>{{val}}：</label><input type="text" v-model='goods[val]'>
					</div>
					<div class="cloumn">
						<label>包号：</label><input type="text" v-model='goods.包号'>
					</div>
					<div class="cloumn">
						<label>箱号：</label><input type="text" v-model='goods.boxNo' readonly>
					</div>
					<div class="cloumn" v-if='tableList[0]&&tableList[0].品类=="木配城"'>
						<label>单位：</label>
						<el-select v-model="unti" placeholder="请选择">
							<el-option v-for='item in unitList' :key='item.name' :label="item.name" :value="item.ab"></el-option>
						</el-select>
					</div>
					<div class="cloumn">
						<label>价格：</label><input type="text" v-model='goods.price'>
					</div>
					<div class="cloumn">
						<label>备注：</label><input type="text" v-model='goods.memo'>
					</div>
				</div>
			</div>
			<div class="dialog_fot">
				<button class="sure" @click='addGoods'>确定</button>
				<button class="pass" @click='addVisible=false'>取消</button>
			</div>

		</el-dialog>
	</div>
</template>

<script>
	import headBackTitle from '@/components/headBackTitle.vue'
	export default {
		components: {
			"ym-hbt": headBackTitle,
		},
		data() {
			return {
				value: '',
				tenantId: JSON.parse(this.$store.state.token).tenantId,
		    role: JSON.parse(this.$store.state.role),
				h: 0,
				screenWidth: 0,
				checkmemo: true,
				checkTime: true,
				checkPrice: true,
				midefyVisible: false,
				addVisible: false,
				tabName: '',
				tabsData: [],
				storeList: [],
				storeKey: '',
				priceList: [],
				priceKey: '',
				time: '',
				memo: '',
				ordList: [],
				orderKey: '',
				order: {},
				mingVisible: false,
				guiData: {},
				tableList: [],
				tabConfig: [],
				userId: JSON.parse(this.$store.state.token).id,
				midefyObj: {},
				goods: {},
				tableConfig: [],
				nowCrtoryId: '',
				unitList: this.GLOBAL_.unit,
				unti: '',
		    screenText:'',
			}
		},
		computed: {
			guiNum: function() {
				let a = 0;
				for (let i in this.guiData) {
					a++;
				}
				return a;
			},
		},
		methods: {
			/**
			* 获取仓库列表
			* @method getStoreList
			*/
			getStoreList(){
				const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let params = {tenantId: this.tenantId};
				this.$axios.get('/api/storeInForm/showStoreInfor',{params})
				.then(res=>{
					if(res.data&&res.data.data){
						this.storeList = res.data.data;
					}
					loading.close()
				},()=>{loading.close()})
			},
			/**
			* 显示仓库列表
			* @method showStore
			*/
			showStore(data){
				if(data){
					this.storeList = [];
					setTimeout(()=>{this.getStoreList();})
				}
			},
			/**
			* 获取采购单列表
			* @method getOrdList
			*/
			getOrdList(){
				const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let params = {
					tenantId: this.tenantId,
					state: 4,
				}
				this.$axios.get('/api/storeInForm/showPurposeInfor',{params})
				.then(res=>{
					if(res.data&&res.data.data){
						this.ordList = res.data.data;
					}
					loading.close();
				},()=>{loading.close()})
			},
			/**
			* 显示采购单
			* @method showOrd
			*/
			showOrd(data){
				if(data){
					this.ordList = [];
					setTimeout(()=>{this.getOrdList()})
				}
			},
			/**
			* 打开明细窗口
			* @method openDetailed
			*/
			openDetailed(){
				if(!this.order.id) return this.$message.error('请选择采购单');
				const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let params = {
					tenantId: this.tenantId,
					purposeId: this.order.id,
					type: 1
				};
				this.$axios.get('/api/storeInForm/showBoxByPurposeForId',{params})
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						this.mingVisible = true;
						this.metaData = res.data.data;
						this.guiData = this.buildGuiData(this.metaData);
						this.buildTableData();
					}else{
						this.$message.error('该订单没有待卸箱柜')
					}
				},()=>{
					this.$message.error('获取鞋柜明细失败');
					loading.close();
				})
			},
			//鞋柜弹窗数据
			buildGuiData(data) {
				let obj = {};
				for (let i in data) {
					obj[i] = !!this.guiData[i];
				}
				return obj;
			},
		  handleCommand(command){
        for(let i in this.guiData){
        	this.guiData[i] = command;
        }
      },
			buildTabsData() {
				let arr = [];
				for (let i in this.guiData) {
					if (this.guiData[i]) arr.push(i);
				}
				if(arr.length>0){
					this.tabsData = arr;
					this.tabName = arr[0];
			    this.buildTableData();
        }else{
					this.tabsData = [];
					this.tableList = [];
					this.tabConfig = [];
        }
				this.mingVisible = false;
			},
			//生成表格数据
			buildTableData() {
				if (this.tabName == '') return;
				let data = this.metaData[this.tabName];
				for (let i in data) {
					if (data[i].goodsTable && data[i].goodsTable.attributeValue) {
						Object.assign(data[i], this.proData(data[i].goodsTable.attributeValue));
					}
				}
				this.tabConfig = this.GLOBAL_.tableConfig[data[0].品类];
				this.tableList = data;
			},
			//
			buildPostData(arr) {
				let data = arr;
				for (let i in this.tabsData) {
					let a = this.metaData[this.tabsData[i]];
					for (let n in a) {
						if (!a[n].state) {
							data.push(a[n]);
						}
					}
				}
				let postData = {};
				postData.storeActionPayment = {
					actionType: 1,
					creatorId: this.userId,
					handingPriceId: this.priceList[this.priceKey].id,
					memo: this.memo,
					price: this.priceList[this.priceKey].price,
					tenantId: this.tenantId,
					warestoreId: this.storeList[this.storeKey].id,
					num: this.tabsData.length,
				};
				postData.storeInForm = {
					approveState: 1,
					creatorId: this.userId,
					memo: this.memo,
					packageNum: data.length,
					purposeId: this.ordList[this.orderKey].id,
					state: 1,
					status: 1,
					storageType: 1,
					storeInTime: Date.parse(new Date(this.time)),
					supportId: this.ordList[this.orderKey].supportId,
					tenantId: this.tenantId,
					warestoreId: this.storeList[this.storeKey].id,
					boxNum: this.tabsData.length,
				};
				postData.storeInFormDetail = [];
				for (let i in data) {
					let obj = {};
					obj.agentFee = data[i].agentFee;
					obj.boxNo = data[i].boxNo;
					obj.creatorId = this.userId;
					obj.buyPrice = data[i].buyPrice;
					obj.fullPrice = data[i].fullPrice;
					obj.memo = this.memo;
					obj.moneyPrice = data[i].moneyPrice;
					obj.moneyRate = data[i].moneyRate;
					obj.moneyType = data[i].moneyType;
					obj.packageId = data[i].packageId;
					obj.taxFee = data[i].taxFee;
					obj.unit = data[i].unit;
					obj.warestoreId = this.storeList[this.storeKey].id;
					postData.storeInFormDetail.push(obj);
				};
		    const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				this.$axios({
					method: 'post',
					url: '/api/storeInForm/createStoreInForm',
					data: postData,
					ansyc: false
				}).then(res => {
					loading.close();
					if (res && res.data.data) {
						this.$router.push({
							name: 'inDeta',
							query: {
								backUrl: 'newPutIn',
								id: res.data.data
							}
						})
					}else{
						this.$message.error('创建进货单失败')
          }
				},()=>{loading.close();this.$message.error('创建进货单失败')})
			},
			//创建入库单
			post() {
				if(!this.role.erp_instore_new) return this.$message.error('没有权限');
				if (this.storeKey === '') return this.$message.error('选择仓库');
				if (this.time === '') return this.$message.error('选择入库时间');
				if (this.priceKey === '') return this.$message.error('选择卸柜价格');
				if (this.tabsData.length === 0) return this.$message.error('选择卸柜内容');
				this.getPackageId();
			},
			//删除某个包
			removeBao(index) {
				this.tableList.splice(index, 1);
				this.metaData[this.tabName].splice(index, 1);
			},
			//修改包
			openMidefy(obj) {
				if(!this.role.erp_stock_mod) return this.$message.error('没有权限');
				this.midefyVisible = true;
				this.midefyObj = JSON.parse(JSON.stringify(obj))
			},
			postMidefy() {
		    if(!this.role.erp_stock_mod) return this.$message.error('没有权限');
				this.midefyVisible = false;
				let arr = [];
				for (let i in this.tabConfig) {
					arr.push(this.tabConfig[i] + ':' + this.midefyObj[this.tabConfig[i]]);
				}
				this.$axios({
					method: 'post',
					url: '/api/storeInForm/modificationPackage',
					data: {
						specificatipn: arr,
						tenantId: this.tenantId,
						unit: this.midefyObj.unit,
						goodsId: this.midefyObj.goodsId,
						id: this.midefyObj.packageId,
						catoryId: this.midefyObj.catoryId,
						creatorId: this.userId,
					}
				}).then(res => {
					if (res && res.data.data) {
						for (let i in this.tableList) {
							if (this.midefyObj.id == this.tableList[i].id) {
								this.getOrdInfo();
								break;
							}
						}
					}
				})
			},
			//打开添加
			openAdd() {
				if (this.tabConfig.length > 0) {
					this.addVisible = true;
					this.goods = {};
					this.goods.品类 = this.tableList[0].品类;
					this.goods.boxNo = this.tabName;
				}else{
					this.$message.error('请选择柜号')
				}
			},
			column(data) {
				return  !(data === '品类' || data === '树种' || data === '品牌' || data === '等级');
			},
			addGoods() {
				this.goods.packageNo = this.goods.包号;
				this.goods.catoryName = this.goods.品类;
				this.goods.brandName = this.goods.品牌;
				if (this.goods.品类 == '原木材') {
					this.goods.unti = 'G';
					this.goods.amount = this.goods.根数;
				} else if (this.goods.品类 == '实木板材') {
					this.goods.unti = 'm³';
					this.goods.amount = this.goods.立方数;
				} else if (this.goods.品类 == '名贵材') {
					this.goods.unti = 'T';
					this.goods.amount = this.goods.数量;
				} else if (this.goods.品类 == '人造板') {
					this.goods.unti = 'P';
					this.goods.amount = this.goods.数量;
				} else if (this.goods.品类 == '木配城') {
					this.goods.unti = this.unti;
					this.goods.amount = this.goods.数量;
				}
				this.goods.state = 12;
				this.metaData[this.tabName].push(this.goods);
				this.addVisible = false;
			},
			//获取包ID
			getPackageId() {
		    const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let data = [];
				for (let i in this.tabsData) {
					let a = this.metaData[this.tabsData[i]]
					for (let n in a) {
						if (a[n].state == 12) {
							data.push(a[n])
						}
					}
				}
				let arr = [];
				for (let i in data) {
					let attributeValue = [];
					for (let n in this.tabConfig) {
						if(this.tabConfig[n]!=='立方数'){
				      attributeValue.push(this.tabConfig[n] + ':' + data[i][this.tabConfig[n]])
            }
					}
					let obj = {
						amount: data[i].amount,
						attributeValue: attributeValue,
						orderSn: this.ordList[this.orderKey].outterNo,
						price: data[i].price * this.ordList[this.orderKey].moneyRate,
						oldPrice: data[i].price,
						state: 1,
						tenantId: this.tenantId,
						boxNo: data[i].boxNo,
						packageNo: data[i].packageNo,
						catoryId: this.tableList[0].goodsTable.catoryId,
						catoryName: data[i].品类,
						brandName: data[i].品牌,
						memo: data[i].memo,
						unti: data[i].unti,
					};
					arr.push(obj);
				}
				this.$axios({
					method: 'post',
					url: '/api/storeInForm/purposeImportExcel',
					data: {
						categoryId: this.tableList[0].goodsTable.catoryId,
						creatorId: this.userId,
						packageImportDtoList: arr,
						tenantId: this.tenantId,
					}
				}).then(res => {
					loading.close();
					if (res.data && res.data.data) {
						let data = res.data.data;
						for (let i in data) {
							data[i].agentFee = data[i].price * this.ordList[this.orderKey].agentRate;
							data[i].buyPrice = data[i].oldPrice;
							data[i].creatorId = this.userId;
							data[i].fullPrice = data[i].price * (1 + parseFloat(this.ordList[this.orderKey].taxRate) + parseFloat(this.ordList[
								this.orderKey].agentRate))
							data[i].moneyPrice = data[i].price;
							data[i].moneyRate = this.ordList[this.orderKey].moneyRate;
							data[i].taxFee = this.ordList[this.orderKey].taxRate;
							data[i].moneyType = this.ordList[this.orderKey].moneyType;
							data[i].unit = data[i].unti
						}
						this.buildPostData(data);
					} else {
						this.buildPostData([]);
					}
				},()=>{loading.close();this.$message.error('创建进货单失败')})
			},
		},
		mounted() {
			this.screenWidth = document.body.offsetWidth;
			window.onresize = () => {
				this.screenWidth = document.body.offsetWidth;
			}
		},
		watch: {
			screenWidth: function() {
				this.h = document.getElementsByClassName('bill_main_top')[0].offsetHeight;
			},
			storeKey: function() {
				if (this.storeList[this.storeKey].storeHandingPrices) {
					this.priceList = this.storeList[this.storeKey].storeHandingPrices;
					this.priceKey = '';
				}
			},
			orderKey: {
				handler: function() {
					this.order = this.ordList[this.orderKey];
					this.guiData = {};
					this.tabsData = [];
					this.tableList = [];
				},
				deep: true
			}
		}
	}
</script>
<style lang="scss">
	.mingXi .el-dialog {
		width: 640px;
	}

	.add .el-dialog {
		width: 640px;
	}

	.ii {
		display: none;
		font-size: 22px;
	}

	.ii:hover {
		color: #00A0E9
	}

	.el-table__row:hover .ii {
		display: inline-block;
		cursor: pointer;
	}
</style>
<style lang="scss" scoped>
	.add_main {
		padding: 0 30px;
	}

	.bill_create_btn a {
		line-height: 50px;
	}

	.midefy_main {
		padding-bottom: 20px;

		.midefy_main_top {
			padding: 0 50px;

			.midefy_top_row {
				height: 40px;
				position: relative;

				.n {
					position: absolute;
					line-height: 40px;
					width: 60px;
					text-align: right;
				}

				.v {
					position: absolute;
					left: 85px;
					width: calc(100% - 85px);
					line-height: 40px;
					padding: 0 10px;
				}

				.vi {
					position: absolute;
					left: 85px;
					top: 8px;
					height: 24px;
					border: 1px solid #ddd;
					border-radius: 4px;
					width: calc(100% - 85px);
					padding: 0 10px;

					&:focus {
						border: 1px solid #00A0E9;
					}
				}
			}
		}

		.dialog_fot {
			margin-top: 20px;
		}
	}


	.ming_main {
		height: 370px;

		.ming_content {
			height: 40%;
			padding-top: 10px;

			&:nth-child(1) {
				border-bottom: 1px solid #dddddd;
        height: 60%;
			}

			.ming_content_top {
				height: 25px;
				line-height: 25px;
				overflow: hidden;

				.content_top_title {
					margin-right: 10px;
				}

				.content_top_input {
					float: right;
					border-radius: 20px;
					border: 1px solid #dddddd;
					height: 25px;
					width: 170px;
					padding-left: 20px;

					&:focus {
						border: 1px solid #00A0E9;
					}
				}

				.content_top_ic {
					float: right;
					margin-right: -22px;
					line-height: 28px;
					color: #00A0E9;
				}
			}

			.ming_content_fot {
				height: calc(100% - 25px);
				overflow: auto;
				margin: 0 auto;

				.content_fot_item {
					float: left;
					border: 1px solid #00A0E9;
					width: 100px;
					margin: 4px;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
          padding: 0 10px;
          text-align: center;
				}
			}
		}
	}

	.dialog_fot {
		margin-top: 10px;
	}

	.dialog_fot {
		margin-bottom: 20px;
	}

	.bill_table_tabs {
		height: 40px;
		overflow: hidden;
	}

	.bill_table_table {
		height: calc(100% - 40px);
	}
</style>
