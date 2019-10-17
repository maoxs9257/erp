<template>
	<div class="allotde deta">
		<div class="deta_header">
			<v-header :to="{name:'storeManageHome'}" title='盘点单详情'></v-header>
		</div>
		<div class="deta_mid">
			<div class="clearfix"></div>
			<div class="deta_mid_round">
				<div v-if="radio2!=2" class="option round round2">已盘点</div>
				<div v-if="radio2==2" class="option round round1">盘点</div>
				<div class="option"><i class="iconfont zhankai"></i></div>
				<div v-if="state!=9" class="option round round1">调整</div>
				<div v-if="state==9" class="option round round2">已调整</div>
			</div>
			<div class="allotmain">
				<div class="infotitle">
					<div class="infobox">
						<div class="item">
							<span class="itemleft">盘点单号：</span><span class="itemright">{{checkId}}</span>
						</div>
						<div class="item">
							<span class="itemleft">盘点仓库：</span><span class="itemright">{{detailInfo.warestoreName}}</span>
						</div>
						<div class="item">
							<span class="itemleft">盘点状态：</span><span class="itemright">{{detailInfo.state=='1'?'已盘库':'未盘库'}}</span>
						</div>
						<div class="item">
							<span class="itemleft">盘点时间：</span><span class="itemright">{{detailInfo.createTime|time('y-m-d')}}</span>
						</div>
						<div class="item">
							<span class="itemleft">库存总件数：</span><span class="itemright">{{detailInfo.storePriceAmountDto?detailInfo.storePriceAmountDto.storeCount:''}}</span>
						</div>
						<div class="item">
							<span class="itemleft">库存总数量：</span><span class="itemright">{{detailInfo.storePriceAmountDto|getNum}}</span>
						</div>
						<div class="item">
							<span class="itemleft">盘点总件数：</span><span class="itemright">{{detailInfo.packageNum}}</span>
						</div>
						<div class="item">
							<span class="itemleft">盘点人：</span><span class="itemright">{{detailInfo.creatorName}}</span>
						</div>
						<div class="item">
							<span class="itemleft">备注：</span><span class="itemright">{{detailInfo.memo}}</span>
						</div>
					</div>
				</div>
				<div class="tabbox">
					<div class="tabBar">
						<el-radio-group v-model="radio2">
							<el-radio :label="1">已盘库存</el-radio>
							<el-radio :label="2">未盘库存</el-radio>
						</el-radio-group>
						<el-select v-model="categoryId" placeholder="请选择">
							<el-option :label="val" :value='key' v-for="(val,key) in category" :key="key"></el-option>
						</el-select>
						<div class="shai" @click="showSelect=!showSelect">
							<el-button size="mini" type="primary" plain icon="el-icon-search" circle></el-button>
							<span>筛选</span>
						</div>
						<div class="divBtn">
							<el-button type="primary" size="small">清楚无效数据</el-button>
						</div>
					</div>
					<div class="selectBar">
						<el-select clearable :class="{ff:select[key]&&select[key]!=''}" v-model="select[key]" :placeholder="key" v-for="(val,key) in selectData"
						 :key="key">
							<el-option v-for="(val,key) in selectData[key]" :label="val" :key='key' :value="val"></el-option>
						</el-select>
						<a href="javascript:void(0)" v-show='JSON.stringify(select)!="{}"' @click="select={}">清楚过滤</a>
					</div>
					<div class="deTable" v-show="radio2==1" :class="{ss:showSelect}">
						<el-table :data='detailData' v-if="detailData.length>0" show-summary :summary-method="sumFun" height="100%">
							<el-table-column type="index" label='序号'></el-table-column>
							<el-table-column prop="packageNo" label='包号' show-overflow-tooltip></el-table-column>
							<el-table-column prop="warestoreName" label='仓库' show-overflow-tooltip></el-table-column>
							<el-table-column v-for="(val,key) in detailData[0].data" :key='key' :label="key" show-overflow-tooltip>
								<template slot-scope='scope'>{{scope.row.data[key]}}</template>
							</el-table-column>
							<el-table-column label="状态">
								<template slot-scope='scope'>{{scope.row.state>2?"出库":"在库"}} <i v-if='scope.row.state>2' class="iconfont icon-jinggao"></i></template>
							</el-table-column>
							<el-table-column label="备注">
								<template slot-scope='scope'>
									<el-tooltip v-if="scope.row.memo" class="item" effect="dark" :content="scope.row.memo" placement="top">
										<i class="iconfont icon-tanhao"></i>
									</el-tooltip>
								</template>
							</el-table-column>
						</el-table>
					</div>
					<div class="deTable" v-show="radio2==2" :class="{ss:showSelect}">
						<!-- 未盘点 -->
						<el-table :data='detailData' v-if="detailData.length>0" @selection-change="handleSelectionChange" height="100%">
							<el-table-column type="selection"></el-table-column>
							<el-table-column prop="packageNo" label='包号' show-overflow-tooltip></el-table-column>
							<el-table-column prop="warestoreName" label='仓库' show-overflow-tooltip></el-table-column>
							<el-table-column v-for="(val,key) in detailData[0].data" :key='key' :label="key" show-overflow-tooltip>
								<template slot-scope='scope'>{{scope.row.data[key]}}</template>
							</el-table-column>
							<el-table-column label="状态">
								<template slot-scope='scope'>{{scope.row.state>2?"出库":"在库"}} <i v-if='scope.row.state>2' class="iconfont icon-jinggao"></i></template>
							</el-table-column>
							<el-table-column label="备注">
								<template slot-scope='scope'>
									<el-tooltip v-if="scope.row.memo" class="item" effect="dark" :content="scope.row.memo" placement="top">
										<i class="iconfont icon-tanhao"></i>
									</el-tooltip>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import header from "@/components/headBackTitle.vue"
	import print from "@/components/print.vue"
	export default {
		data() {
			return {
				tenantId: JSON.parse(this.$store.state.token).tenantId,
				checkId: this.$route.query.checkId,
				showSelect: false,
				detailInfo: {},
				detailData: [],
				table: [],
				category: {},
				approveState: 1, //审核状态
				state: 1, //调整状态
				categoryId: '',
				radio2: 1,
				selectData: {},
				select: {},
				ddd: [],
				time: '',
				memo: '',
				multipleSelection: [],
				pickerOptions: {
					disabledDate(time) {
						return time.getTime() < Date.now() - 8.64e7;
					}
				},
			}
		},
		methods: {
			//获取数据
			getData() {
				this.$axios({
					method: 'get',
					url: '/api/storeInventoryForm/StoreInventoryForm',
					params: {
						tenantId: this.tenantId,
						id: this.checkId
					}
				}).then(res => {
					console.log(res)
					if (res && res.data && res.data.data) {
						this.detailInfo = res.data.data[0]
						this.time = this.detailInfo.createTime
						this.memo = this.detailInfo.memo
						this.getTableData()
					} else {

					}
				}, err => {

				})
			},
			//获取已盘库存
			getTableData() {
				this.$axios({
					method: 'get',
					url: '/api/storeInventoryForm/showStoreInventoryFormDatil',
					params: {
						tenantId: this.tenantId,
						storeInventoryFormId: this.checkId
					}
				}).then(res => {
					console.log(res)
					if (res && res.data && res.data.data) {
						let arr = []
						for (var i in res.data.data) {
							let obj = {}
							obj.catoryId = res.data.data[i].goodsTable.catoryId
							obj.packageNo = res.data.data[i].packageNo
							obj.warestoreName = res.data.data[i].goodsTable.warestoreName
							obj.state = res.data.data[i].state
							obj.memo = res.data.data[i].memo
							obj.attributeValue = res.data.data[i].goodsTable.attributeValue
							obj.catoryName = res.data.data[i].goodsTable.catoryName
							arr.push(obj)
						}
						this.table = this.proTableData(arr)
						this.categoryIdChenge()
						this.buildDetailData()
					}
				}, err => {
				})
			},
			//获取未盘库存
			getTableDatas() {
				this.$axios({
					method: 'get',
					url: '/api/storeInventoryForm/showStoreInventoryFormNotStore',
					params: {
						tenantId: this.tenantId,
						storeInventoryFormId: this.checkId,
						warestoreId: this.detailInfo.warestoreId
					}
				}).then(res => {
					if (res && res.data && res.data.data) {
						let arr = []
						for (var i in res.data.data) {
							let obj = {}
							obj.catoryId = res.data.data[i].goodsTableList.catoryId
							obj.packageNo = res.data.data[i].packageNo
							obj.warestoreName = res.data.data[i].goodsTableList.warestoreName
							obj.state = res.data.data[i].state
							obj.memo = res.data.data[i].memo
							obj.attributeValue = res.data.data[i].goodsTableList.attributeValue
							obj.catoryName = res.data.data[i].goodsTableList.catoryName
							arr.push(obj)
						}
						this.table = this.proTableData(arr)
						this.categoryIdChenge()
						this.buildDetailData()
					}
				}, err => {
				})
			},
			//处理数据
			proTableData(data) {
				let obj = {}
				let objCate = {}
				this.category = {}
				for (var i in data) {
					let key = data[i].catoryId
					if (obj[key]) {
						obj[key].push(data[i])
					} else {
						obj[key] = [data[i]]
					}

					if (!this.category[key]) {
						this.$set(this.category, key, data[i].catoryName)
					}
				}
				return obj
			},
			categoryIdChenge() {
				for (var i in this.category) {
					if (this.categoryId == i) {
						return
					}
				}
				for (var i in this.category) {
					this.categoryId = i;
					return;
				}
			},
			//生成数据
			buildDetailData() {
				let data = this.table[this.categoryId]
				let arr = []
				this.selectData = {}
				this.select = {}
				for (var i in data) {
					let obj = {}
					obj.packageNo = data[i].packageNo
					obj.warestoreName = data[i].warestoreName
					obj.state = data[i].state
					obj.memo = data[i].memo

					let newarr = data[i].attributeValue.split(',')
					obj.data = {}
					for (var k in newarr) {
						if (newarr[k] != '') {
							let newobj = {}
							obj.data[newarr[k].split(':')[0]] = newarr[k].split(':')[1].replace(/\s+/g, "")
						}
						if (newarr[k] != '') {
							if (this.selectData[newarr[k].split(':')[0]]) {
								this.selectData[newarr[k].split(':')[0]].push(newarr[k].split(':')[1].replace(/\s+/g, ""))
							} else {
								this.selectData[newarr[k].split(':')[0]] = [newarr[k].split(':')[1].replace(/\s+/g, "")]
							}
						}
					}
					arr.push(obj)
				}
				for (let i in this.selectData) {
					this.selectData[i] = this.uniq(this.selectData[i])
				}
				this.ddd = arr
				this.doSelect()
			},
			//筛选
			doSelect() {
				let data = JSON.parse(JSON.stringify(this.ddd))
				console.log(data)
				for (let i = 0; i < data.length; i++) {
					for (let key in this.select) {
						if (this.select[key] != '' && this.select[key] != data[i].data[key]) {
							data.splice(i, 1)
							i--
							break
						}
					}
				}
				this.detailData = data
			},
			//清楚删选
			//表尾合计
			sumFun(param) {
				const {
					columns,
					data
				} = param
				const sums = []

				for (let i = 0, len = columns.length; i < len; i++) {
					if (i == 0) {
						sums[i] = '合计'
					}
					if (columns[i].label == '立方数') {
						let sum = 0
						for (let n in data) {
							sum += parseFloat(data[n].data[columns[i].label])
						}
						sums[i] = sum
					}
				}
				return sums
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
		},
		mounted: function() {
			this.getData()
		},
		watch: {
			categoryId: function(val, oldval) {
				this.buildDetailData()
			},
			radio2: function() {
				if (this.radio2 == '1') {
					this.getTableData()
				} else {
					this.getTableDatas()
				}
			},
			select: {
				handler: function() {
					for (let i in this.select) {
						if (this.select[i] == '') {
							delete this.select[i]
						}
					}
					this.doSelect()
				},
				deep: true
			}
		},
		filters: {
			getNum: function(data) {
				if(data){
					return (data.cubicCount?data.cubicCount+'m³':'')+(data.tonCount?'/'+data.tonCount+'T':'')
					+(data.numberCount?'/'+data.numberCount+'P':'');
				}else{
					return 0
				}
			}
		},
		components: {
			"v-header": header,
			"v-print": print,
		}
	}
</script>
<style>
	.tabBar .el-select {
		margin: 0 10px;
		height: 48px;
		width: 131px;
		line-height: 48px;
	}
	.tabBar .el-input--suffix .el-input__inner {
		height: 29px;
	}
	.selectBar .el-select {
		line-height: 45px;
		margin: 0 5px;
	}
	.selectBar .el-input__inner {
		padding: 0 20px 0 0;
		width: 80px;
		outline: none;
		border: 0;
		text-align: center;
	}
	.selectBar .ff .el-input__inner {
		border: #00A0E9 solid 1px;
	}
	.selectBar .ff.el-select .el-input .el-select__caret {
		color: #00A0E9;
	}
	.selectBar .el-input__suffix {
		right: 0;
	}
</style>
<style lang="scss" scoped>
	.divBtn {
		float: right;
		margin-top: 8px;
	}
	.selectBar {
		height: 45px;
		width: 100%;
		border-bottom: #ddd solid 1px;
		a {
			font-size: 14px;
			color: #00A0E9;
		}
	}
	.deTable {
		position: absolute;
		top: 48px;
		bottom: 0;
		left: 0;
		right: 0;
		transition: 1s;
	}
	.deTable.ss {
		top: 94px;
	}
	.allotde {
		position: relative;
		height: 100%;
		.allotmain {
			position: absolute;
			top: 170px;
			bottom: 0;
			left: 30px;
			right: 30px;
			border-top: #e0e0e0 solid 1px;
			.tabbox {
				position: absolute;
				width: 100%;
				top: 134px;
				bottom: 0;
				border-top: #e0e0e0 solid 1px;
				.tabBar {
					height: 48px;
					padding: 0 10px;
					background-color: #f4f4f4;
					.shai {
						display: inline-block;
						margin-left: 50px;
					}
				}
			}
		}
	}
	.infotitle {
		width: 100%;
		.infobox {
			&:after {
				display: block;
				content: '';
				overflow: hidden;
				height: 0;
				clear: both;
			}
			.item {
				position: relative;
				float: left;
				width: 25%;
				height: 45px;
				border-bottom: #c3c3c3 dashed 1px;
				span {
					display: block;
					line-height: 45px;
					color: #666;
					font-size: 14px;
				}
				.itemleft {
					text-align: right;
					width: 90px;
				}
				.itemright {
					position: absolute;
					height: 100%;
					top: 0;
					left: 90px;
					right: 0;
					text-align: left;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}
	}
</style>
