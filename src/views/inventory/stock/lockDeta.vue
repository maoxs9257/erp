<template>
	<div class="deta">
		<div class="deta_header">
			<ym-hbt :to='{name:backUrl}' title='锁定详情'></ym-hbt>
		</div>
		<div class="deta_mid">
			<div class="deta_mid_bar" :class="{short:short}">
				<div class="bar bar_left" @click="setVisible=true">
					<i class="iconfont cebian-shezhi"></i>
					<span v-show='!short'>设置</span>
				</div>
				<div class="bar bar_left" @click="sureRemove">
					<i class="iconfont shanchu"></i>
					<span v-show='!short'>删除</span>
				</div>
				<div class="bar bar_right" @click='short=!short'>
					<i v-if="!short" class="el-icon-arrow-right"></i>
					<i v-if="short" class="el-icon-arrow-left"></i>
				</div>
			</div>
			<div class="clearfix"></div>
			<div class="deta_mid_round">
				<div class="option round round1" @click="examine" v-if="info.checkApproveState===1">审核</div>
				<div class="option round round2" v-if="info.checkApproveState===2">已审核</div>
			</div>
			<div class="deta_mid_main">
				<div class="deta_mid_infos">
					<div class="deta_infos_row">
						<div class="deta_row_item" :title='info.lockNo'>
							<span class="n">锁定单号：</span>
							<span class="v">{{info.lockNo}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">客户名称：</span>
							<span class="v">{{info.fullName}}</span>
						</div>
						<div class="deta_row_item" title='sadadad'>
							<span class="n">锁定件数：</span>
							<span class="v">{{info.orderPackages}}</span>
						</div>
						<div class="deta_row_item" title='sadadad'>
							<span class="n">锁定数量：</span>
							<span class="v">{{info.amount}}</span>
						</div>
					</div>
					<div class="deta_infos_row">
						<div class="deta_row_item">
							<span class="n">时间：</span>
							<span class="v">{{info.createTime|time('y-m-d')}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">操作人员：</span>
							<span class="v">{{info.creatorName}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">截止时间：</span>
							<span class="v">{{info.expireTime|time('y-m-d')}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">备注：</span>
							<span class="v">{{info.memo}}</span>
						</div>
					</div>
				</div>
				<div class="deta_mid_table">
					<el-table :data="tableList" height="100%">
						<el-table-column type="index" label="序号"></el-table-column>
						<el-table-column v-if="tableShow[val]" show-overflow-tooltip v-for='(val,key) in tableConfig' :key='key' :label="val" :prop="val"></el-table-column>
						<el-table-column v-if="tableShow.goodsNum" prop="goodsNum" label="数量" show-overflow-tooltip></el-table-column>
					</el-table>
				</div>
			</div>
		</div>
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
				showModify: false,
				modify: {},
				userId: JSON.parse(this.$store.state.token).id,
				tenantId: JSON.parse(this.$store.state.token).tenantId,
				short: false,
				id: this.$route.query.id,
				backUrl: this.$route.query.backUrl,
				info: {},
				tableList: [],
				tableConfig: [],
				role: JSON.parse(this.$store.state.role),
				setVisible:false,
				activeName:'first',
			}
		},
		computed:{
			tableShow:function() {
			  let temp = {};
				console.log(this.tableOptions)
			  this.tableOptions.forEach((val)=>{
			    temp[val.key]=val.show
			  })
			  return temp;
			},
			tableOptions:function(){
				if(this.tableList[0]){
					return JSON.parse(this.$store.state.setJson).tableOptions.LOCK[this.tableList[0].品类]
				}else{
					return [];
				}
				
			}
		},
		methods: {
			/**
			 * 获取数据
			 * @method getData
			 */
			getData() {
				const loading = this.$loading({
					lock: true,
					text: '数据加载中...',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				let params = {
					lockFormId: this.id
				}
				this.$axios.get('/api/lockForm/showLockFormDetailController', {
						params
					})
					.then(res => {
						loading.close();
						if (res.data && res.data.data) {
							this.info = res.data.data;
							let data = res.data.data.lockFromDetailDtos;
							for (let i in data) {
								let arr = data[i].attributeValue.split(',');
								for (let n in arr) {
									data[i][arr[n].split(':')[0]] = arr[n].split(':')[1];
								}
							}
							if(data[0]){
								this.tableConfig = this.GLOBAL_.tableConfig[data[0].品类];
							}else{
								this.tableConfig = [];
							}
							this.tableList = data;
						} else {
							this.$message.error('获取数据失败');
						}
					}, () => {
						loading.close();
						this.$message.error('获取数据失败')
					})
			},
			sureRemove() {
				if (!this.role.erp_lockgoods_del) return this.$message.error('没有权限');
				if(this.info.checkApproveState===2) return this.$message.error('已审核，无法删除');
				this.$confirm('此操作将删除本条数据, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.remove();
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			// 删除
			remove() {
				const loading = this.$loading({
					lock: true,
					text: '数据加载中...',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				this.$axios.post('/api/lockForm/deleteLockFormById?id='+this.id)
				.then(res => {
					loading.close();
					if (res.data && res.data.data) {
							this.$router.push({name:'lockList'})
					} else {
						this.$message.error('删除失败')
					}
				}, () => {
					loading.close();
					this.$message.error('删除失败')
				})
			},
			//审核接口
			examine() {
				this.$axios({
					method: 'post',
					url: '/api/lockForm/checkLockForm',
					data: {
						checkApproveState: 2,
						checkApproveTime: Date.parse(new Date()),
						checkApproverId: this.userId,
						creatorId: this.userId,
						id: this.id,
						tenantId: this.tenantId
					}
				}).then(res => {
					console.log(res);
					if (res && res.data.data) {
						this.getData();
					}
				})
			},
			// 更新表格数据
			updataTableOptions(data){
				let setJson = JSON.parse(this.$store.state.setJson);
				setJson.tableOptions.LOCK[this.tableList[0].品类] = data;
				this.$store.commit('setSetJson',setJson);
				this.upSetJson(setJson);
			},
			// 上传设置数据
			upSetJson(val){
				let data = {
					settingText:JSON.stringify(val),
					tenantId:this.tenantId,
					id:this.id
				}
				this.$axios.post('/api/userSettingTable/modifyUserSettingTable',data)
			},
		},
		mounted: function() {
			this.getData();
		},
	};
</script>

<style scoped lang="scss">
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
