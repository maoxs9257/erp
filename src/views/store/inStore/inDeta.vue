<template lang="html">
	<div class="deta">
		<div class="deta_header">
			<ym-hbt :to='{name:back}' title="入库详情"></ym-hbt>
		</div>
		<div class="deta_mid">
			<div class="deta_mid_bar" :class="{short:short}">
				<div class="bar bar_left" @click="setVisible=true">
					<i class="iconfont cebian-shezhi"></i>
					<span v-show='!short'>设置</span>
				</div>
				<div class="bar bar_left">
					<i class="iconfont daochu"></i>
					<span v-show='!short'>导出</span>
				</div>
				<div class="bar bar_right" @click='short=!short'>
          <i v-if="!short" class="el-icon-arrow-right"></i>
          <i v-if="short" class="el-icon-arrow-left"></i>
				</div>
			</div>
			<div class="clearfix"></div>
			<div class="deta_mid_round">
				<div class="option round round1" v-if='inInfo.approveState==1' @click='examine'>审核</div>
				<div class="option round round2" v-if='inInfo.approveState==2&&inInfo.state!=9' @click='examineBack'>已审核</div>
				<div class="option round round2" v-if='inInfo.approveState==2&&inInfo.state==9'>已审核</div>
				<div class="option"><i class="iconfont zhankai"></i></div>
				<div class="option round round1" @click='inStore' v-if='inInfo.state!=9'>入库</div>
				<div class="option round round2" v-if='inInfo.state==9'>已入库</div>
			</div>
			<div class="deta_main">
				<div class="deta_mid_infos">
					<div class="deta_infos_row">
						<div class="deta_row_item">
							<span class="n">入库单号：</span>
							<span class="v">{{inInfo.id}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">仓库：</span>
							<span class="v">{{inInfo.storeName}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">入库总件数：</span>
							<span class="v">{{inInfo.packageNum}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">入库箱数：</span>
							<span class="v">{{inInfo.boxNum}}</span>
						</div>
					</div>
					<div class="deta_infos_row">
						<div class="deta_row_item">
							<span class="n">提单号：</span>
							<span class="v">{{inInfo.orderSn}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">供应商：</span>
							<span class="v">{{inInfo.supportName}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">开证公司：</span>
							<span class="v">{{inInfo.issuingName?inInfo.issuingName:'无'}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">卸柜费：</span>
							<span class="v">{{inInfo.handingPrice}}</span>
						</div>
					</div>
					<div class="deta_infos_row">
						<div class="deta_row_item">
							<span class="n">入库时间：</span>
							<span class="v">{{inInfo.storeInTime|time('y-m-d')}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">制单人：</span>
							<span class="v">{{inInfo.creatorName}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">备注：</span>
							<span class="v">{{inInfo.memo}}</span>
						</div>
					</div>
				</div>
			</div>
			<div class="deta_table">
				<div class="deta_table_tabs">
					<el-tabs v-model='tabName' @tab-click="getTableData">
						<el-tab-pane v-for='(val,key) in tabsData' :key='key' :label='val' :name='val'></el-tab-pane>
					</el-tabs>
				</div>
				<div class="deta_table_table">
					<el-table :data='tableList' height='100%'>
						<el-table-column type='index' label='序号'></el-table-column>
						<el-table-column v-if="tableShow[val]" v-for='(val,key) in tabConfig' :key='key' :label='val' :prop='val' show-overflow-tooltip></el-table-column>
						<el-table-column v-if="tableShow.memo" label='备注' prop='memo' align="center">
							<template slot-scope='scope'>
								<el-tooltip :content="scope.row.memo" placement="top"><i class="iconfont beizhu" v-if='scope.row.memo!==""'></i></el-tooltip>
							</template>
						</el-table-column>
						<el-table-column v-if='inInfo.approveState===1' label='操作'>
							<template slot-scope='scope'>
								<i @click='openMidefy(scope.row)' class="ii iconfont xiugai"></i>
								<i @click='removeBao(scope.row)' class="ii iconfont shanchu"></i>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</div>
			<div style="padding:0 30px;line-height:50px;">
        <el-button v-if='inInfo.approveState===1' size="mini" type="primary" @click='openAdd'>添加</el-button>
			</div>
		</div>
		<!-- 修改包 -->
		<el-dialog width="560px" title="修改产品信息" center :visible.sync='midefyVisible' v-dialogDrag>
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
		<el-dialog width="640px" title='添加详情' center :visible.sync='addVisible' v-dialogDrag>
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
					<div class="cloumn" v-if='column(val)' v-for='(val,key) in tabConfigEl' :key='key'>
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
			<div style='margin-top:30px;text-align:center'>
				<el-button type='primary' plain @click='addVisible=false'>取消</el-button>
				<el-button type='primary' @click='addGoods'>确定</el-button>
			</div>
		</el-dialog>
		<!-- 设置 -->
		<el-dialog width="800px" title="设置" center :visible.sync="setVisible" v-dialogDrag>
			<el-tabs v-model="activeName">
			  <el-tab-pane label="表格字段" name="first">
			  	<options :data='tableOptions' @cb='updataTableOptions' @close='setVisible=false'></options>
			  </el-tab-pane>
			</el-tabs>
		</el-dialog>
	</div>
</template>

<script>
	import headBackTitle from '@/components/headBackTitle.vue'
	import options from '@/components/options.vue'
	export default {
		components: {
			"ym-hbt": headBackTitle,
			"options":options
		},
		data() {
			return {
				short: false,
				midefyVisible: false,
				addVisible: false,
				id: this.$route.query.id,
				back: this.$route.query.backUrl,
				tenantId: JSON.parse(this.$store.state.token).tenantId,
				userId: JSON.parse(this.$store.state.token).id,
		    role: JSON.parse(this.$store.state.role),
				tabsData: [],
				tabName: '',
				inInfo: {},
				tableList: [],
				metaData: {},
				midefyObj: {},
				goods: {},
				unti: '',
				unitList: this.GLOBAL_.unit,
				tabConfigEl: [],
				activeName:'first',
				setVisible:false,
			}
		},
		computed:{
			tableShow:function() {
				let temp = {};
				this.tableOptions.forEach((val)=>{
					temp[val.key]=val.show
				});
				return temp;
			},
			tableOptions:function(){
				if(this.tableList[0]&&this.tableList[0].品类){
					return JSON.parse(this.$store.state.setJson).tableOptions.ID[this.tableList[0].品类];
				}else{
					return [];
				}
			},
			tabConfig:function(){
				if(this.tableList[0]){
					return this.GLOBAL_.tableConfig[this.tableList[0].品类];
				}else{
					return [];
				}
			}
		},
		methods: {
			//获取详情数据
			getData() {
				this.$axios({
					method: 'get',
					url: '/api/storeInForm/showStoreInFormDaetailInfors',
					params: {
						tenantId: this.tenantId,
						type: 1,
						storeInFormId: this.id
					}
				}).then(res => {
					if (res && res.data.data) {
						this.inInfo = res.data.data;
						this.metaData = res.data.data.map;
						this.getTabsData(res.data.data.map);
					}
				})
			},
			getTabsData(obj) {
				let arr = [];
				for (let i in obj) {
					arr.push(i);
				}
				this.tabsData = arr;
				if (this.tabName) {
					this.tabName = arr[0];
				}
				this.getTableData();
			},
			getTableData() {
				let data = this.metaData[this.tabName];
				for (let i in data) {
					data[i].立方数 = data[i].amount;
					if (data[i].goodsTable && data[i].goodsTable.attributeValue) {
						Object.assign(data[i], this.proData(data[i].goodsTable.attributeValue));
					}
				}
				this.tableList = data;
			},
			//审核
			examine() {
				if(!this.role.erp_instore_mod) return this.$message.error('没有权限');
				this.$axios({
					method: 'post',
					url: '/api/storeInForm/checkStoreInForm',
					data: {
						approveState: 2,
						approveTime: Date.parse(new Date()),
						approverId: this.userId,
						id: this.inInfo.id,
						tenantId: this.tenantId,
						warestoreId: this.inInfo.warestoreId
					}
				}).then(res => {
					if (res && res.data.data) {
						this.getData();
					}
				})
			},
			//审核
			examineBack() {
				if(!this.role.erp_instore_mod) return this.$message.error('没有权限');
				this.$axios({
					method: 'post',
					url: '/api/storeInForm/checkStoreInForm',
					data: {
						approveState: 1,
						approveTime: Date.parse(new Date()),
						approverId: this.userId,
						id: this.inInfo.id,
						tenantId: this.tenantId,
						warestoreId: this.inInfo.warestoreId
					}
				}).then(res => {
					if (res && res.data.data) {
						this.getData();
					}
				})
			},
			//入库
			inStore() {
				if(!this.role.erp_instore_mod) this.$message.error('没有权限');
				if (this.inInfo.approveState == 2) {
					let arr = [];
					for (let i in this.metaData) {
						for (let k in this.metaData[i]) {
							arr.push(this.metaData[i][k])
						}
					}
					this.inInfo.tenantId = this.tenantId;
					this.inInfo.creatorId = this.userId;
					this.$axios({
						method: 'post',
						url: '/api/storeInForm/accomplishStoreInForInfors',
						data: {
							storeInForm: this.inInfo,
							storeInFormDetailDtoList: arr
						}
					}).then(res => {
						if (res && res.data.data) {
							this.getData();
						}
					})
				}else{
          this.$message('请审核订单')
        }
			},
			//删除
			removeBao(data) {
		    if(!this.role.erp_instore_del) this.$message.error('没有权限');
				this.$axios({
					method: 'post',
					url: '/api/storeInForm/deleteStoreInFormDetail',
					data: {
						boxNo: data.boxNo,
						creatorId: this.userId,
						id: data.id,
						packageId: data.packageId,
						state: '00',
						storeInFormId: data.storeInFormId,
						warestoreId: data.warestoreId
					}
				}).then(res => {
					if (res && res.data.data) {
						//修改入库件数
						this.$axios({
							method: 'post',
							url: '/api/storeInForm/modifyStoreInForm',
							data: {
								id: this.id,
								packageNum: this.inInfo.packageNum - 1,
								creatorId: this.userId,
								tenantId: this.tenantId,
								warestoreId: this.inInfo.warestoreId,
							}
						}).then(r => {
							if (r && r.data.data) {
								this.getData();
							}
						})
					}
				})
			},
			//修改
			openMidefy(data) {
		    if(!this.role.erp_instore_mod) this.$message.error('没有权限');
				this.midefyVisible = true;
				this.midefyObj = JSON.parse(JSON.stringify(data));
			},
			postMidefy() {
		    if(!this.role.erp_instore_mod) return this.$message.error('没有权限');
				const loading = this.$loading({lock: true, text: 'Loading',});
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
					loading.close();
					if (res && res.data.data) {
						for (let i in this.tableList) {
							if (this.midefyObj.id == this.tableList[i].id) {
								this.getData();
								break;
							}
						}
					}
				}, err => {
					loading.close();
				})
			},
			//打开添加
			openAdd() {
				//根据id获取采购单
        if(!this.role.erp_instore_mod) return this.$message.error('没有权限');
				this.$axios({
					method: 'get',
					url: '/apt/purposeForm/showPurposeFormDetailInfo',
					params: {
						purposeId: this.inInfo.purposeId
					}
				}).then(res => {
					if (res && res.data.data) {
						for (let i in res.data.data) {
							this.money(i, res.data.data[i].dataList[0]);
							break;
						}
					}
				})
			},
			column(data) {
				if (data === '品类' || data === '树种' || data === '品牌' || data === '等级') return false;
				return true;
			},
			money(str, dd) {
				let s = str.indexOf('(');
				let e = str.lastIndexOf(')');
				str = str.substring(s + 1, e);
				let arr = str.split(',');
				let obj = {};
				for (let i in arr) {
					obj[arr[i].split('=')[0].replace(/(^\s*)/g, "")] = arr[i].split('=')[1]
				}
				this.moe = obj;
				let lei = this.proData(dd.attributeValue);
				this.tabConfigEl = this.GLOBAL_.tableConfig[lei.品类];
				this.goods.品类 = lei.品类;
				this.goods.boxNo = this.tabName;
				this.addVisible = true;
			},
			addGoods() {
				//判断是否需要拆分
				let arr = [];
				let attributeValue = [];
				for (let n in this.tabConfigEl) {
					attributeValue.push(this.tabConfigEl[n] + ':' + this.goods[this.tabConfigEl[n]])
				}
				let obj = {
					attributeValue: attributeValue,
					orderSn: this.moe.outterNo,
					price: this.goods.price * this.moe.moneyRate,
					oldPrice: this.goods.price,
					state: 1,
					tenantId: this.tenantId,
					boxNo: this.tabName,
					packageNo: this.goods.packageNo,
					catoryId: this.returnCatoryId(this.goods.品类),
					catoryName: this.goods.品类,
					brandName: this.goods.品牌,
					memo: this.goods.memo,
				}
				if (this.goods.品类 == '原木材') {
					this.goods.unti = 'G'
					this.goods.amount = this.goods.根数;
				} else if (this.goods.品类 == '实木板材') {
					this.goods.unti = 'm³'
					this.goods.amount = this.goods.立方数;
				} else if (this.goods.品类 == '名贵材') {
					this.goods.unti = 'T'
					this.goods.amount = this.goods.数量;
				} else if (this.goods.品类 == '人造板') {
					this.goods.unti = 'P'
					this.goods.amount = this.goods.数量;
				} else if (this.goods.品类 == '木配城') {
					this.goods.unti = this.unti;
					this.goods.amount = this.goods.数量;
				}
				if (this.goods.品类 == '原木材') {
					obj.amount = 1;
					obj.unti = this.goods.unti;
					for (let i in this.goods.amount) {
						arr.push(obj);
					}
				} else {
					obj.amount = this.goods.amount;
					obj.unti = this.goods.unti;
					arr.push(obj);
				}
				this.$axios({
					method: 'post',
					url: '/api/storeInForm/purposeImportExcel',
					data: {
						categoryId: this.returnCatoryId(this.goods.品类),
						creatorId: this.userId,
						packageImportDtoList: arr,
						tenantId: this.tenantId,
					}
				}).then(res => {
					if (res && res.data.data) {
						let a = res.data.data;
						let data = [];
						for (let i in a) {
							let aobj = {
								agentFee: a[i].price * this.moe.agentRate,
								boxNo: a[i].boxNo,
								buyPrice: a[i].price,
								creatorId: this.userId,
								fullPrice: a[i].price * (1 + parseFloat(this.moe.agentRate) + parseFloat(this.moe.taxRate)),
								memo: a[i].memo,
								moneyPrice: a[i].oldPrice,
								moneyRate: this.moe.moneyRate,
								moneyType: this.moe.moneyType,
								packageId: a[i].packageId,
								state: 12,
								status: 1,
								storeInFormId: this.id,
								taxFee: this.moe.taxRate,
								unit: a[i].unti,
								warestoreId: this.inInfo.warestoreId,
							}
							data.push(aobj);
						}
						this.$axios({
							method: 'post',
							url: '/api/storeInForm/addStoreInFormDetailList',
							data: data,
						}).then(r => {
							if (r && r.data.data) {
								this.getData();
								this.addVisible = false;
							}
						})
					}
				})
			},
			returnCatoryId(str) {
				if (str == '原木材') return 1;
				if (str == '实木板材') return 2;
				if (str == '名贵材') return 3;
				if (str == '木配城') return 4;
				if (str == '人造板') return 5;
				return null;
			},
			// 表格字段更新
			updataTableOptions(data){
				let setJson = JSON.parse(this.$store.state.setJson);
				setJson.tableOptions.ID[this.tableList[0].品类] = data;
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
		},
		mounted() {
			if (!this.id) {
				return;
			}
			this.getData();
		}
	}
</script>

<style lang="scss" scoped>
	.midefy_main {
		width: 100%;
		.midefy_main_top {
			padding: 0 80px;
			.midefy_top_row {
				height: 40px;
				line-height: 40px;
				span {
					display: inline-block;
					overflow: hidden;
					text-overflow: ellipsis;
					word-spacing: normal;
					vertical-align: middle;
				}
				span.n {
					width: 80px;
					text-align: right;
					margin-right: 5px;
				}
				span.v {
					width: 200px;
					padding: 0 5px;
				}
				input {
					vertical-align: middle;
					width: 200px;
					height: 25px;
					border-radius: 4px;
					border: 1px solid #ddd;
					padding: 0 5px;
					&:focus {
						border: 1px solid #00a0e9;
					}
				}
			}
		}
	}
	.deta_fot {
		padding: 0 30px;
	}
	.dialog_fot {
		margin-bottom: 20px;
	}
	.deta_mid_bar.short {
		width: 150px;
	}
	.deta_table {
		height: calc(100% - 341px);
		.deta_table_tabs {
			height: 40px;
			overflow: hidden;
		}
		.deta_table_table {
			height: calc(100% - 40px);
		}
	}
</style>
