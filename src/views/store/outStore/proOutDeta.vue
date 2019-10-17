<template lang="html">
	<div class="deta">
		<div class="deta_header">
			<ym-hbt :to='{name:"preOutList"}' title="预出库详情"></ym-hbt>
		</div>
		<div class="deta_mid">
			<div class="clearfix"></div>
			<div class="deta_mid_round">
				<div class="option round round1">理货</div>
				<div class="option"><i class="iconfont zhankai"></i></div>
				<div class="option round">确认</div>
				<div class="option"><i class="iconfont zhankai"></i></div>
				<div class="option round">收款</div>
				<div class="option"><i class="iconfont zhankai"></i></div>
				<div class="option round">出库</div>
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
							<span class="v">{{liData|sum}}</span>
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
						<el-table-column align='center' width='' fixed='right' label='已提' prop='num'></el-table-column>
						<el-table-column fixed='right' width='40'>
							<template slot-scope='scope'>
								<i @click='openGoods(scope.row)' class="jj iconfont xinjian"></i>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<p class="title">理货详情单</p>
				<div class="deta_mid_table">
					<el-table :data='liData'>
						<el-table-column type='index' label='序号'></el-table-column>
						<el-table-column show-overflow-tooltip label='包号' prop='packageNo'></el-table-column>
						<el-table-column show-overflow-tooltip v-for='(val,key) in carTableConfig' :key='key' :label='val' :prop='val'></el-table-column>
						<el-table-column show-overflow-tooltip label='操作'>
							<template slot-scope='scope'>
								<i @click='removeLiData(scope.row,scope.$index)' class="iconfont shanchu"></i>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="deta_mid_btn">
					<button @click='post' type="button">确认理货</button>
				</div>
			</div>
		</div>
		<!-- 选择商品 -->
		<el-dialog width="1000px" title="选择商品" center :visible.sync='checkVisible' v-dialogDrag>
			<div class="checkProOut">
				<div class="table table_style" v-if='checkVisible'>
					<el-table v-loading='goodsLoad' ref='cc' :data='checkData' height='500px' border @selection-change="handleSelectionChange" v-loadMethod='load' modname='.el-table__body-wrapper' loadmore='loadmore'>
						<el-table-column :selectable="checkSelectable" type='selection'></el-table-column>
						<el-table-column show-overflow-tooltip label='包号' prop='packageNo' width='120px'></el-table-column>
						<el-table-column show-overflow-tooltip v-for='(val,key) in checkTableConfig' :key='key' :label='val' :prop='val'></el-table-column>
					</el-table>
				</div>
			</div>
			<div style='margin-top:30px;text-align:center'>
				<el-button type='primary' plain @click='checkVisible=false'>取消</el-button>
				<el-button type='primary' @click='addLiData'>确定</el-button>
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
				short: false,
				id: this.$route.query.id,
				tenantId: JSON.parse(this.$store.state.token).tenantId,
				userId: JSON.parse(this.$store.state.token).id,
		    role: JSON.parse(this.$store.state.role),
				info: {},
				carTableConfig: [],
				carData: [],
				checkVisible: false,
				value: '',
				checkTableConfig: [],
				checkData: [],
				liData: [],
				cunData: {},
				selection: [],
				selectionCopy:[],
				pageNum:1,
				option:{},
				loadmore:false,
				goodsLoad:false,
				maxNum:0,
			}
		},
		methods: {
			/**
			* 获取数据
			* @method getData
			*/
			getData(){
				if(!this.id) return ;
				let params = {
					tenantId: this.tenantId,
					storeOutFormId: this.id
				};
				this.$axios.get('/api/storeOutForm/showStoreOutFormInfor',{params})
				.then(res=>{
					if(res.data&&res.data.data){
						this.info = res.data.data;
						let data = res.data.data.goodsTableDtoList;
						for(let i in data){
							Object.assign(data[i],this.proData(data[i].attributeValue))
							data[i].num = 0;
						}
						if(data[0]&&data[0].品类){
							this.carTableConfig = this.GLOBAL_.tableConfig[data[0].品类]
						}
						this.carData = data;
					}
				})
			},
			/**
			* 打开选择商品
			*	@method openGoods
			*/
			openGoods(data){
				this.maxNum = data.require;
				this.checkTableConfig = this.GLOBAL_.tableConfig[data.品类];
				this.checkData = [];
				this.pageNum = 1;
				this.checkVisible = true;
				this.option.goodsId=data.id;
				this.salePrice = data.salePrice;
			},
			/**
			* 获取商品数据
			* @method getList
			*/
			getList(pageNum,pageSize,options,callback){
				this.goodsLoad = true;
				let params = {
					pageNum:pageNum,
					pageSize:pageSize,
					tenantId: this.tenantId,
				}
				params = Object.assign(params,options);
				this.$axios.get('/api/lockForm/showStorePackageListPage',{params})
				.then(res=>{
					this.goodsLoad = false;
					if(res.data&&res.data.data){
						let data = res.data.data.dataList;
						for(let i in data){
							Object.assign(data[i],this.proData(data[i].attibuteValue))
						}
						this.checkData = this.checkData.concat(data);
						callback(res.data.data);
					}else{
						callback(false);
					}
				},()=>{
					this.goodsLoad = false;
					callback(false);
				})
			},
			/**
			* 无限加载
			* @method load
			*/
			load(callback){
				let selectionGoods = this.selection.concat(this.liData);
				this.selectionCopy=selectionGoods
				this.getList(this.pageNum++,20,this.option,(data)=>{
					callback();
	        this.loadmore = data.pages>data.pageNo;
					setTimeout(()=>{
						this.checkGoods();
					})
				})
			},
			/**
			* 选择商品
			* @method handleSelectionChange
			*/
			handleSelectionChange(data){
				this.selection = data;
			},
			/**
			* 添加 理货商品
			* @method addLiData
			*/
			addLiData(){
				if(this.selection.length===0){
					return this.$message.error('请选择商品');
				}
				this.checkVisible = false;
				let lidata = this.liData;
				let selection = this.selection;
				selection.forEach((val)=>{
					val.salePrice = this.salePrice;
        });
				for(let i=0;i<lidata.length;i++){
					if(lidata[i].goodsId==selection[0].goodsId){
						lidata.splice(i,1);
						i--;
					}
				}
				lidata = lidata.concat(selection);
				this.liData = lidata;
				this.setCarNum(this.selection);
				this.selection = [];
			},
			/**
			* 检查表格数据是否被选择
			* @method checkGoods
			*/
			checkGoods(){
				let arr = this.selectionCopy.length===0?this.liData:this.selectionCopy;
				let data = this.checkData;
				for(let i in arr){
					for(let n in data){
						if(arr[i].id==data[n].id){
							this.$refs.cc.toggleRowSelection(data[n],true)
						}
					}
				}
			},
			/**
			* 计算预装车单已选数量
			* @method setCarNum
			*/
			setCarNum(data){
				for(let i in this.carData){
					if(this.carData[i].id===data[0].goodsId){
						let temp = this.carData[i];
						temp.num = data.length
						this.carData.splice(i,1,temp);
						return ;
					}
				}
			},
			/**
			* 是否禁用表格选择功能
			* @method checkSelectable
			*/
			checkSelectable(row){
				if(this.selection.length===0) return true;
				for(let i in this.selection){
					if(row.id===this.selection[i].id){
						return true;
					}else if(this.selection.length<this.maxNum){
						return true;
					}
				}
				return false;
			},
			/**
			* 删除理货商品
			* @method removeLiData
			*/
			removeLiData(data,index){
				this.liData.splice(index,1);
				for(let i in this.carData){
					if(this.carData[i].id===data.goodsId){
						let temp = this.carData[i];
						temp.num--;
						this.carData.splice(i,1,temp);
						return ;
					}
				}
			},
			/**
			* 确认理货
			* @
			*/
			post() {
        if(!this.role.erp_outstore_new) return this.$message.error('没有权限');
        if(this.liData.length===0) return this.$message.error('请选择理货数据');
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
						status: 1,
						unit: this.liData[i].unit,
						warestoreId: this.info.warestoreId,
					};
					obj.storeOutFormDetails.push(nobj);
				}
				this.$axios({
					method: 'post',
					url: '/api/storeOutForm/createStoreOutFormDatill',
					data: obj
				}).then(res => {
					if (res && res.data.data) {
						this.$router.push({
							name: 'outDeta',
							query: {
								id: this.id,
							}
						})
					}
				})
			},
		},
		mounted() {
			this.getData();
		},
		filters:{
			sum:function(data){
				let num = 0;
				for(let i in data){
					num += data[i].amount
				}
				return num;
			}
		}
	}
</script>
<style lang='scss'>
	.checkProOut th .el-checkbox {
		display:none
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
