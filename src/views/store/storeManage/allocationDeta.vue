
<template>
	<div class="deta">
		<div class="deta_header">
			<v-header :to="{name:back}" title='调拨单详情'></v-header>
		</div>
		<div class="deta_mid">
			<div class="deta_mid_bar" :class="{short:short}">
				<div class="bar bar_left">
					<i class="iconfont icon-gongjushezhi"></i>
					<span v-show='!short'>设置</span>
				</div>
				<div class="bar bar_left">
					<i class="iconfont icon-bianji"></i>
					<span v-show='!short'>修改</span>
				</div>
				<div class="bar bar_left">
					<i class="iconfont icon-shanchu"></i>
					<span v-show='!short'>删除</span>
				</div>
				<div class="bar bar_left">
					<i class="iconfont icon-dayin"></i>
					<span v-show='!short'>打印</span>
				</div>
				<div class="bar bar_right" @click='short=!short'>
					<i class="iconfont icon-you"></i>
				</div>
			</div>
			<div class="clearfix"></div>
			<div class="deta_mid_round">
				<div class="option round round1" v-if='infos.approveState!=2' @click="examine">审核</div>
				<div class="option round round2" v-if='infos.approveState==2'>已审核</div>
				<div class="option"><i class="iconfont zhankai"></i></div>
				<div class="option round round1" v-if="infos.state!=9" @click="repositories">调库</div>
				<div class="option round round2" v-if="infos.state==9">已调库</div>
			</div>
			<div class="deta_mid_main">
				<div class="deta_mid_infos">
					<div class="deta_infos_row">
						<div class="deta_row_item">
							<span class="n">调拨单号：</span>
							<span class="v">{{allotId}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">创建人：</span>
							<span class="v">{{infos.creatorName}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">调拨时间：</span>
							<span class="v">{{infos.storeOutTime|time('y-m-d')}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">调出仓库：</span>
							<span class="v">{{infos.onName}}</span>
						</div>
					</div>
					<div class="deta_infos_row">
						<div class="deta_row_item">
							<span class="n">调入仓库：</span>
							<span class="v">{{infos.toName}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">调拨件数：</span>
							<span class="v">{{infos.packageNum}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">调拨数量：</span>
							<span class="v">{{infos.sptAmount}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">备注：</span>
							<span class="v">{{infos.memo}}</span>
						</div>
					</div>
				</div>
				<div class="deta_mid_table">
					<el-table :data="infoData" style="width: 100%">
					<el-table-column type="index" label="序号" width="50"></el-table-column>
					<el-table-column prop="packageNo" label="包号" show-overflow-tooltip></el-table-column>
					<el-table-column min-width="60" v-for='(val,key) in tableConfig' :key="key" :label="val" show-overflow-tooltip>
						<template slot-scope="scope">{{scope.row[val]}}</template>
					</el-table-column>
					<el-table-column width="40">
						<template slot-scope='scope'>
							<el-tooltip class="item" effect="dark" :content="scope.row.memo" placement="left">
								<i class="iconfont icon-tanhao"></i>
							</el-tooltip>
						</template>
					</el-table-column>
				</el-table>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import header from "@/components/headBackTitle.vue"
	export default {
		data() {
			return {
				short: false,
				allotId: this.$route.query.allotId,
				back: this.$route.query.backurl,
				tenantId: JSON.parse(this.$store.state.token).tenantId,
				userId: JSON.parse(this.$store.state.token).id,
		    role: JSON.parse(this.$store.state.role),
				infos:{},
				infoData:[],
				tableConfig:[],
			}
		},
		methods: {
			/**
			 * 获取数据
			 * @method getData
			 */
			getData(){
				const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let params = {
					tenantId: this.tenantId,
					creatorId: this.userId,
					id: this.allotId
				}
				this.$axios.get('/api/storeExchangeForm/showStoreExchangeForm',{params})
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						this.infos = res.data.data;
						let data = this.infos.storeExchangeFormDetailDtoList;
						for(let i in data){
							data[i] = Object.assign(data[i],this.strToObj(data[i].goodsTable.attributeValue))
						}
						this.tableConfig = this.GLOBAL_.tableConfig[data[0].品类];
						this.infoData = data;
					}else{
						this.$message.error('获取数据失败')
					}
				},()=>{loading.close();this.$message.error('获取数据失败')})
			},
			/**
			 * 审核
			 * @method examine
			 */
			examine(){
				if(!this.role.erp_allocation_mod) return this.$message.error('没有权限');
				const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let data = {
					approveState: 2,
					approveTime:new Date(),
					approverId:this.userId,
					tenantId:this.tenantId,
					id: this.allotId,
					fromWarestoreId:this.infos.fromWarestoreId
				}
				this.$axios.post('/api/storeExchangeForm/checkStoreExchangeForm',data)
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						this.infos.approveState = 2;
						this.$message.success('审核成功')
					}else{
						this.$message.error('审核失败')
					}
				},()=>{loading.close();this.$message.error('审核失败')})
			},
			/**
			 * 调库
			 * @method repositories
			 */
			repositories(){
				if(!this.role.erp_allocation_mod) return this.$message.error('没有权限');
				const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let data = {
					storeExchangeForm:{
						storeInTime: (new Date()).valueOf(),
						id: this.allotId,
						creatorId: this.userId,
						tenantId: this.tenantId,
						toWarestoreId: this.infos.toWarestoreId
					},
					storeExchangeFormDetailList:this.infoData
				}
				this.$axios.post('/api/storeExchangeForm/accomplishStoreExchangeForm',data)
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						this.infos.state = 9;
						this.$message.success('调库成功')
					}else{
						this.$message.error('调库失败')
					}
				},()=>{loading.close();this.$message.error('调库失败')})
			},
			//字符串转对象数组
			strToObj(str) {
				var arr = str.split(','),
					obj = {}
				for (var i in arr) {
					if (arr[i] != '') {
						obj[arr[i].split(':')[0]] = arr[i].split(':')[1]
					}
				}
				return obj
			},
		},
		created: function() {
			this.getData()
		},
		components: {
			"v-header": header,
		}
	}
</script>
<style>
</style>
<style lang="scss" scoped>
	.deta_mid_main {
		height: calc(100% - 140px);
	}
	.deta .deta_mid .deta_mid_table {
		height: calc(100% - 101px);
		padding-bottom: 30px;
	}
	.deta_mid_bar.short {
		width: 200px;
	}
</style>
