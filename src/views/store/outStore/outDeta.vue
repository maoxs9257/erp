<template lang="html">
	<div class="deta">
		<div class="deta_header">
			<ym-hbt :to='{name:"outList"}' title="出库详情"></ym-hbt>
		</div>
		<div class="deta_mid">
			<div class="clearfix"></div>
			<div class="deta_mid_round">
				<div class="option round round2">理货</div>
				<div class="option"><i class="iconfont zhankai"></i></div>
				<div class="option round" :class="{round2:sellState.state==3||sellState.state==7}">确认</div>
				<div class="option"><i class="iconfont zhankai"></i></div>
				<div class="option round round1" v-if='info.state!=9' @click="outPost">出库</div>
				<div class="option round round2" v-if='info.state==9'>已出库</div>
			</div>
			<div class="deta_main">
				<p class="title">预装车详单</p>
				<div class="deta_mid_infos">
					<div class="deta_infos_row">
						<div class="deta_row_item">
							<span class="n">出库单号：</span>
							<span class="v">{{info.id}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">销售单号：</span>
							<span class="v">{{info.orderNo}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">车号：</span>
							<span class="v">{{info.carNo}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">出库日期：</span>
							<span class="v">{{info.storeOutTime|time('y-m-d')}}</span>
						</div>
					</div>
					<div class="deta_infos_row">
						<div class="deta_row_item">
							<span class="n">仓库：</span>
							<span class="v">{{info.storeName}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">开证公司：</span>
							<span class="v">{{info.issuName}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">装车件数：</span>
							<span class="v">{{liData.length}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">装车数量：</span>
							<span class="v">{{liData|amount}}</span>
						</div>
					</div>
					<div class="deta_infos_row">
						<div class="deta_row_item">
							<span class="n">创建人员：</span>
							<span class="v">{{info.creatorName}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">备注：</span>
							<span class="v">{{info.memo}}</span>
						</div>
					</div>
				</div>
				<div class="deta_mid_table">
					<el-table :data='carData'>
						<el-table-column type='index' label='序号'></el-table-column>
						<el-table-column show-overflow-tooltip v-for='(val,key) in carTableConfig' :key='key' :label='val' :prop='val'></el-table-column>
						<el-table-column label='提货件数' fixed='right' prop='require'></el-table-column>
						<el-table-column width='' fixed='right' label='已提' prop='num'></el-table-column>
					</el-table>
				</div>
				<p class="title">理货详情单</p>
				<div class="deta_mid_table">
					<el-table :data='liData'>
						<el-table-column type='index' label='序号'></el-table-column>
						<el-table-column show-overflow-tooltip label='包号' prop='packageNo'></el-table-column>
						<el-table-column show-overflow-tooltip v-for='(val,key) in carTableConfig' :key='key' :label='val' :prop='val'></el-table-column>
					</el-table>
				</div>
				<div class="deta_mid_btn">
					<button v-if='!info.state==2' @click='post' type="button">确认理货</button>
				</div>
			</div>
		</div>
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
				short: false,
				id: this.$route.query.id,
				tenantId: JSON.parse(this.$store.state.token).tenantId,
				userId: JSON.parse(this.$store.state.token).id,
		    role: JSON.parse(this.$store.state.role),
				info: {},
				carTableConfig: [],
				carData: [],
				value: '',
				checkTableConfig: [],
				checkData: [],
				liData: [],
				cunData: {},
				selection: [],
				sellState: {},
			}
		},
		methods: {
			// 获取数据
			getData(){
				const loading = this.$loading({
					lock: true,
					text: '获取出库数据',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				let params = {
					tenantId:this.tenantId,
					storeOutFormId:this.id
				}
				this.$axios.get('/api/storeOutForm/showStoreOutFormInfor',{params})
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						this.getSellState(res.data.data.sellFormId);
						this.info = res.data.data;
						this.carData = this.proCarData(res.data.data.goodsTableDtoList);
						let arr = this.proLiData(res.data.data.storeOutFornDtaiListlDtoList)
						this.getCunData(arr);
					}else{
						this.$message.error('获取数据失败')
					}
				},()=>{loading.close();this.$message.error('获取数据失败')})
				
			},
			//预装车数据
			proCarData(data) {
				for (let i in data) {
					Object.assign(data[i], this.proData(data[i].attributeValue))
					data[i].num = this.setNum(data[i].id);
				}
				for (let i in data) {
					if (data[i].品类) {
						this.carTableConfig = this.GLOBAL_.tableConfig[data[i].品类]
						break;
					}
				}
				return data;
			},
			proLiData(data) {
				for (let i in data) {
					Object.assign(data[i], this.proData(data[i].goodsTable.attributeValue))
				}
				return data;
			},
			//计算数量
			setNum(i) {
				if (!!this.cunData[i]) {
					return this.cunData[i].length;
				}
				return 0;
			},
			//表格选中事件
			handleSelectionChange(val) {
				this.selection = val;
			},
			//生成理货数据
			buildLiData() {
				let data = [];
				for (let i in this.cunData) {
					data.push.apply(data, this.cunData[i])
				}
				this.liData = data;
				let cardata = [];
				for (let i in this.carData) {
					cardata.push(this.carData[i]);
					cardata[i].num = this.setNum(this.carData[i].id)
				}
				this.carData = cardata;
			},
			//判断是否选中
			checkSestion(data, id) {
				let arr = this.cunData[id]
				for (let i in data) {
					for (let n in arr) {
						if (data[i].id == arr[n].id) {
							this.$refs.cc.toggleRowSelection(data[i])
						}
					}
				}
			},
			//生成存储数据
			getCunData(data) {
				let obj = {}
				for (let i in data) {
					if (obj[data[i].goodsId]) {
						obj[data[i].goodsId].push(data[i])
					} else {
						obj[data[i].goodsId] = [data[i]]
					}
				}
				this.cunData = obj;
				this.buildLiData();
			},

			post() {
				this.postData();
			},
			//理货确认
			postData() {
				let obj = {
					storeOutForm: {
						id: this.id,
						tenantId: this.tenantId,
					}
				};
				obj.storeOutFormDetails = [];
				for (let i in this.liData) {
					let nobj = {
						boxNo: 0,
						creatorId: this.userId,
						id: this.liData[i].id,
						memo: this.liData[i].memo,
						packageId: this.liData[i].id,
						salePrice: this.liData[i].salePrice,
						storeOutFormId: this.id,
						stutes: 1,
						unit: this.liData[i].unit,
						warestoreId: this.liData[i].warestoreId,
					}
					obj.storeOutFormDetails.push(nobj)
				}
				this.$axios({
					method: 'post',
					url: '/api/storeOutForm/createStoreOutFormDatill',
					data: obj
				}).then(res => {
				})
			},
			//获取出库单状态
			getSellState(id) {
				this.$axios({
					method: 'get',
					url: '/aps/sell/showSellFormInfo',
					params: {
						id: id
					}
				}).then(res => {
					if (res.data.data) {
						for (let i in res.data.data) {
							this.sellState = this.setInfo(i);
							break;
						}
					}
				})
			},
			setInfo(str) {
				let start = str.indexOf('(');
				let end = str.indexOf(')');
				str = str.substring(start + 1, end);
				let arr = str.split(',')
				let obj = {}
				for (let i in arr) {
					obj[arr[i].split('=')[0].replace(/\s/, '')] = arr[i].split('=')[1]
				}
				return obj;
			},
			//出库状态
			outPost() {
        if(!this.role.erp_outstore_mod) return this.$message.error('没有权限');
				this.info.tenantId = this.tenantId;
				this.info.creatorId = this.userId;
				this.$axios({
					method: 'post',
					url: '/api/storeOutForm/accomplishStoreOutForInfors',
					data: {
						storeOutForm: this.info,
						storeOutFormDetails: this.liData,
					}
				}).then(res => {
					this.getData();
				})
			}
		},
		mounted() {
			this.getData();
		},
		filters:{
			amount:function(data){
				if(data&&data.length){
					let sum = 0;
					data.forEach((val)=>{
						sum += parseFloat(val.amount)
					})
					return sum;
				}else{
					return 0
				}
			}
		}
	};
</script>
<style lang='scss'>
	.check .el-dialog {
		width: 1000px;
		height: 600px;
	}
</style>
<style lang="scss" scoped>
	.deta_main {
		height: calc(100% - 130px);
		overflow: auto;
	}

	.deta_main .title {
		text-align: center;
		padding: 10px 0;
		font-size: 18px;
	}

	.deta_mid_table .jj {
		font-size: 18px;
		color: #00A0E9
	}

	.check .checkTop {
		height: 50px;
		padding: 0 30px;
	}

	.check .dialog_items {
		margin-right: 250px;
	}

	.check .dialog_search {
		right: 30px;
	}

	.check_main {
		padding: 0 30px;

		.table {
			height: 450px;
		}
	}

	.dialog_fot {
		margin-top: 15px;
	}

	.deta_mid_btn {
		height: 70px;
		text-align: right;
		padding: 20px 30px;

		button {
			width: 100px;
			height: 30px;
			color: #ffffff;
			background: #00a0e9;
			border-radius: 5px;
			border: 0;
		}
	}
</style>
