<template lang="html">
	<div class="listModule">
		<div class="list_header">
			<ym-hbt :to='{name:"accountHome"}' title='账户转账'></ym-hbt>
		</div>
		<div class="list_setbar">
			<div class="list_setbar_options">
				<div class="option" v-if="multipleSelection.length==0" @click='isTable = !isTable'>
					<div class="option_yuan"><i class="iconfont" :class="isTable?'jiugongge':'liebiao'"></i></div>
				</div>
				<div class="option" v-if="multipleSelection.length==0" @click='refresh'>
					<div class="option_yuan"><i class="iconfont shuaxin"></i></div>
					<span class="option_txt">刷新</span>
				</div>
				<div class="option" v-if="multipleSelection.length==0" @click='openTransfer'>
					<div class="option_yuan"><i class="iconfont xinjian"></i></div>
					<span class="option_txt">新建</span>
				</div>
				<div class="option" v-if="multipleSelection.length==0" @click='isSelect = !isSelect'>
					<div class="option_yuan"><i class="iconfont shaixuan"></i></div>
					<span class="option_txt">筛选</span>
				</div>
				<div class="option" v-if="multipleSelection.length==0" @click='setVisible=true'>
					<div class="option_yuan"><i class="iconfont shanchu"></i></div>
					<span class="option_txt">设置</span>
				</div>
				<div class="option" v-if="multipleSelection.length>0" @click='exportExcel'>
					<div class="option_yuan"><i class="iconfont daochu1"></i></div>
					<span class="option_txt">导出</span>
				</div>
				<div class="search_input">
					<i class="iconfont sousuo"></i>
					<input type="text" v-model="option.financeSn" placeholder="流水号" class="search_input_placeholder" @change="screenBar">
				</div>
			</div>
			<div class="list_setbar_selections">
				<div class="selection" @click="option.stat=0;screen()" :class="{now:option.stat==0}">今天</div>
				<div class="selection" @click="option.stat=1;screen()" :class="{now:option.stat==1}">最近7天</div>
				<div class="selection" @click="option.stat=2;screen()" :class="{now:option.stat==2}">最近30天</div>
				<span class="clear" v-show="option.stat||option.stat===0" @click="removeOption">清除</span>
			</div>
		</div>
		<div class="list_main" :class="{se:isSelect}">
			<div class="list_main_table" v-if='isTable'>
				<div class="table">
					<el-table :data='tableData' height='100%' @selection-change="handleSelectionChange" v-loadMethod='load' modname='.el-table__body-wrapper'
					 loadmore='loadmore'>
						<el-table-column type='selection'></el-table-column>
						<el-table-column label='流水号' prop='financeSn' show-overflow-tooltip></el-table-column>
						<el-table-column v-if="tableShow.createTime" label='创建时间' show-overflow-tooltip>
							<template slot-scope='scope'>{{scope.row.createTime|time('y-m-d')}}</template>
						</el-table-column>
						<el-table-column v-if="tableShow.completeTime" label='发生时间' show-overflow-tooltip>
							<template slot-scope='scope'>{{scope.row.completeTime|time('y-m-d')}}</template>
						</el-table-column>
						<el-table-column label='收支类别' prop='type' show-overflow-tooltip>
							<template slot-scope='scope'>{{scope.row.type|reType}}</template>
						</el-table-column>
						<el-table-column v-if="tableShow.fromAccountName" label='资金账号' prop='fromAccountName' show-overflow-tooltip></el-table-column>
						<el-table-column v-if="tableShow.createName" label='经手人' prop='createName' show-overflow-tooltip></el-table-column>
						<el-table-column v-if="tableShow.money" label='发生金额' prop='money' show-overflow-tooltip></el-table-column>
					</el-table>
				</div>
				<div class="table_fot">
					<span>总数：{{total}}</span>
				</div>
			</div>
			<div class="list_main_card" v-if='!isTable'>
				<div class="card" v-loadMethod='load' loadmore='loadmore'>
					<ul class="card_ul">
						<li class="card_li" v-for='(val,key) in tableData' :key='key'>
							<div class="card_li_con">
								<div class="content">
									<div class="content_top">
										<span class="content_top_title">{{val.financeSn}}</span>
									</div>
									<div class="content_fot">
										<div class="content_fot_item">
											<span class="n">金额:</span>
											<span class='s'>{{val.money}}</span>
										</div>
										<div class="content_fot_item">
											<span class="n">账户:</span>
											<span>{{val.fromAccountName}}</span>
										</div>
										<div class="content_fot_item">
											<span class="n">类型:</span>
											<span>{{val.type | reType}}</span>
										</div>
										<div class="content_fot_item">
											<span class="n">时间:</span>
											<span>{{val.createTime|time('y-m-d')}}</span>
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
		<!-- 转账 -->
		<ym-acc ref='acc' @cb='refresh'></ym-acc>
		<!-- 设置 -->
		<el-dialog width='800px' title='设置' center :visible.sync='setVisible' v-dialogDrag>
			<div>
				<el-tabs v-model="activeName">
					<el-tab-pane label="表格字段" name="first">
						<options :data='tableOptions' @cb='updataTableOptions' @close='setVisible=false'></options>
					</el-tab-pane>
				</el-tabs>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import headBackTitle from '@/components/headBackTitle.vue'
	import accTransfer from "@/components/accTransfer.vue"
	import options from '@/components/options.vue'
	export default {
		components: {
			"ym-hbt": headBackTitle,
			'ym-acc': accTransfer,
			"options": options
		},
		data() {
			return {
				isTable: true,
				isSelect: false,
				tenantId: JSON.parse(this.$store.state.token).tenantId,
				tableData: [],
				total: 0,
				option: {},
				loadmore: false,
				pageNum: 1,
				activeName: 'first',
				setVisible: false,
				multipleSelection: [],
			}
		},
		computed: {
			tableShow: function() {
				let temp = {};
				this.tableOptions.forEach((val) => {
					temp[val.key] = val.show
				});
				return temp;
			},
			tableOptions: function() {
				return JSON.parse(this.$store.state.setJson).tableOptions.TR;
			}
		},
		methods: {
			// 获取数据
			getData(pageNum, pageSize, options, callback) {
				let params = {
					pageNum: pageNum,
					pageSize: pageSize,
					types: '5,6',
					tenantId: this.tenantId
				}
				params = Object.assign(params, options);
				this.$axios.get('/apa/financeTable/showFinanceInfo', {
						params
					})
					.then(res => {
						if (res.data && res.data.data) {
							this.tableData = this.tableData.concat(res.data.data.dataList);
							this.total = res.data.data.total;
							callback ? callback(res.data.data) : null;
						} else {
							callback ? callback(false) : null;
						}
					}, () => {
						callback ? callback(false) : null;
					})
			},
			// 无限加载
			load(callback) {
				this.getData(this.pageNum++, 30, this.option, (data) => {
					callback();
					if (data) {
						this.loadmore = data.pages > data.pageNo;
					} else {
						this.loadmore = false;
					}
				})
			},
			// 刷新
			refresh() {
				const loading = this.$loading({
					lock: true,
					text: '数据加载中...',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				this.option = {};
				this.tableData = [];
				this.pageNum = 1;
				this.getData(this.pageNum++, 30, this.option, (data) => {
					loading.close();
					if (data) {
						this.loadmore = data.pages > data.pageNo;
						this.$message.success('刷新完成');
					} else {
						this.$message.error('刷新失败');
					}
				})
			},
			// 筛选
			screen() {
				this.tableData = [];
				this.pageNum = 1;
				const loading = this.$loading({
					lock: true,
					text: '数据加载中...',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				this.load(() => {
					loading.close();
				})
			},
			// 搜素框
			screenBar() {
				this.screen()
			},
			// 清楚选项
			removeOption() {
				this.option = {};
				this.screen();
			},
			// 更新表格字段
			updataTableOptions(data) {
				let setJson = JSON.parse(this.$store.state.setJson);
				setJson.tableOptions.TR = data;
				this.$store.commit('setSetJson', setJson);
				this.upSetJson(setJson);
			},
			// 上传设置数据
			upSetJson(val) {
				let id = this.$store.state.id
				console.log(id);
				let data = {
					settingText: JSON.stringify(val),
					tenantId: this.tenantId,
					id: id
				}
				this.$axios.post('/api/userSettingTable/modifyUserSettingTable', data)
			},
			// 表格选中
			handleSelectionChange(data) {
				this.multipleSelection = data;
			},
			// 导出数据
			exportExcel() {
				if (this.multipleSelection.length === 0) return this.$message.error('请选择导出的供应商');
				let {export_json_to_excel} = require('../../../assets/excel/Export2Excel');
				require.ensure([], () => {
					var tHeader = ['流水号', '创建日期', '发生时间', '收支类别', '资金账户', '经手人','发生金额'];
					var filterVal = ['financeSn', 'createTime', 'completeTime', 'type', 'fromAccountName', 'createName','money'];
					var list = this.multipleSelection;
					var data = list.map(v => filterVal.map(j => {
						if(j=='createTime'||j=='completeTime'){
							return this.time(v[j],'y-m-d');
						}else if(j=='type'){
							if(v[j]==5) return '转出资金';
							if(v[j]==6) return '转入资金';
							return '未知类型'
						}else{
							return v[j];
						}
					}));
					export_json_to_excel(tHeader, data, '账户转账列表');
				})
			},
			/**
			 * 打开转账
			 * @method openTransfer
			 */
			openTransfer() {
				this.$refs.acc.open()
			},
		},
		mounted() {},
		filters: {
			reType: function(data) {
				if (data == 5) return '转出资金';
				if (data == 6) return '转入资金';
				return '未知类型'
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import "@/assets/css/jxc/card.scss";

	.listModule .card_li .card_li_con {
		padding-bottom: 75%;
	}

	.content_fot .content_fot_item .n {
		width: 40px;
	}

	.content_fot .content_fot_item {
		height: 25%;
	}
</style>
