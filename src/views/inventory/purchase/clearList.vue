<template lang="html">
	<div class="listModule">
		<div class="list_header">
			<ym-hbt :to='{name:"purchaseHome"}' title='清关单列表'></ym-hbt>
		</div>
		<div class="list_setbar">
			<div class="list_setbar_options">
				<div class="option" v-if='multipleSelection.length==0' @click='isTable = !isTable'>
					<div class="option_yuan"><i class="iconfont" :class="isTable?'jiugongge':'liebiao'"></i></div>
				</div>
				<div class="option" v-if='multipleSelection.length==0' @click='refresh'>
					<div class="option_yuan"><i class="iconfont shuaxin"></i></div>
					<span class="option_txt">刷新</span>
				</div>
				<div class="option" v-if='multipleSelection.length==0' @click='isSelect = !isSelect'>
					<div class="option_yuan"><i class="iconfont shaixuan"></i></div>
					<span class="option_txt">筛选</span>
				</div>
				<div class="option" v-if='multipleSelection.length==0' @click='setVisible=true'>
					<div class="option_yuan"><i class="iconfont cebian-shezhi"></i></div>
					<span class="option_txt">设置</span>
				</div>
				<div class="option" v-if='multipleSelection.length!==0' @click='exportExcel'>
					<div class="option_yuan"><i class="iconfont daochu1"></i></div>
					<span class="option_txt">导出</span>
				</div>
				<div class="search_input">
					<i class="iconfont sousuo"></i>
					<input type="text" class="search_input_placeholder" v-model='option.orderSn' @change='screenBar' placeholder='提单号'>
				</div>
			</div>
			<div class="list_setbar_selections">
				<div class="selection" :class="{now:option.dateState===0}" @click='option.dateState=0;screen()'>今天</div>
				<div class="selection" :class="{now:option.dateState===1}" @click='option.dateState=1;screen()'>7天</div>
				<div class="selection" :class="{now:option.dateState===2}" @click='option.dateState=2;screen()'>30天</div>
				<div class="selection" v-if='selections[0].show' :class="{now:option[selections[0].key]}">
					<el-select v-model="option[selections[0].key]" :placeholder="selections[0].name" @change='screen' clearable>
						<el-option v-if='v&&v!==""' v-for='(v,k) in options[selections[0].key]' :label="clearList[v]" :value="v" :key='k'></el-option>
					</el-select>
				</div>
				<div class="selection" v-if='selections[1].show' :class="{now:option[selections[1].key]}">
					<el-select v-model="option[selections[1].key]" :placeholder="selections[1].name" @change='screen' clearable>
						<el-option v-if='v&&v!==""' v-for='(v,k) in options[selections[1].key]' :label="supportList[v]" :value="v" :key='k'></el-option>
					</el-select>
				</div>
				<div class="selection" v-if='selections[2].show' :class="{now:option[selections[2].key]||option[selections[2].key]===0}">
					<el-select v-model="option[selections[2].key]" :placeholder="selections[2].name" @change='screen' clearable>
						<el-option v-if='v&&v!==""||v===0' v-for='(v,k) in options[selections[2].key]' :label="openList[v]" :value="v"
						 :key='k'></el-option>
					</el-select>
				</div>
				<div class="selection" v-if='selections[3].show' :class="{now:option[selections[3].key]||option[selections[2].key]===0}">
					<el-select v-model="option[selections[3].key]" :placeholder="selections[3].name" @change='screen' clearable>
						<el-option v-if='v&&v!==""||v===0' v-for='(v,k) in options[selections[3].key]' :label="statusList[v]" :value="v"
						 :key='k'></el-option>
					</el-select>
				</div>
				<span class="clear" v-if='clearShow' @click='removeOption'>清除</span>
			</div>
		</div>
		<div class="list_main" :class="{se:isSelect}">
			<div class="list_main_table" v-if='isTable'>
				<div class="table">
					<el-table :data='dataList' height='100%' @selection-change="handleSelectionChange" v-loadMethod='load' modname='.el-table__body-wrapper'
					 loadmore='loadmore'>
						<el-table-column type='selection'></el-table-column>
						<el-table-column align='center' label='提单号' show-overflow-tooltip>
							<template slot-scope='scope'>
								<a @click="goTo({name:'clearDeta',query:{backUrl:'clearList',id:scope.row.id}},'erp_clearance_look')">{{scope.row.outterNo}}</a></template>
						</el-table-column>
						<el-table-column v-if='tableShow.createTime' show-overflow-tooltip label='日期'><template slot-scope='scope'>{{scope.row.createTime|time('y-m-d')}}</template></el-table-column>
						<el-table-column v-if='tableShow.lineCompanyName' show-overflow-tooltip label='清关公司' prop='lineCompanyName'></el-table-column>
						<el-table-column v-if='tableShow.supportCompanyName' label='供应商' prop='supportCompanyName' show-overflow-tooltip></el-table-column>
						<el-table-column v-if='tableShow.openCompanyName' show-overflow-tooltip label='开公司' prop='openCompanyName'></el-table-column>
						<el-table-column v-if='tableShow.thcPrice' show-overflow-tooltip label='THC' prop='thcPrice'></el-table-column>
						<el-table-column v-if='tableShow.buyBoxNum' show-overflow-tooltip label='清关总柜数' prop='buyBoxNum'></el-table-column>
						<el-table-column v-if='tableShow.buyPackageNum' show-overflow-tooltip label='清关总数量' prop='purposeAmount'></el-table-column>
						<el-table-column v-if='tableShow.clearanceApproveState' show-overflow-tooltip label='审核' align="center">
							<template slot-scope='scope'>
								<i class="iconfont weijinhang icon_noFinish" v-if="scope.row.clearanceApproveState!=2"></i>
								<i class="iconfont yiwancheng1 icon_finish" v-if="scope.row.clearanceApproveState==2"></i>
							</template>
						</el-table-column>
						<el-table-column show-overflow-tooltip label='确认' align="center">
							<template slot-scope='scope'>
								<i class="iconfont weijinhang icon_noFinish" v-if="scope.row.state!=4"></i>
								<i class="iconfont yiwancheng1 icon_finish" v-if="scope.row.state==4"></i>
							</template>
						</el-table-column>
						<el-table-column show-overflow-tooltip label='付款' align="center">
							<template slot-scope='scope'>
								<i class="iconfont weijinhang icon_noFinish" v-if="scope.row.clearancePayment!==scope.row.clearancePrice"></i>
								<i class="iconfont yiwancheng1 icon_finish" v-if="scope.row.clearancePayment===scope.row.clearancePrice"></i>
							</template>
						</el-table-column>
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
								<div class="content" @click="goTo({name:'clearDeta',query:{backUrl:'clearList',id:val.id}},'erp_clearance_look')">
									<div class="content_top">
										<span class="content_top_title">{{val.lineCompanyName}}</span>
									</div>
									<div class="content_fot">
										<div class="content_fot_item">
											<span class="n">提单号:</span>
											<span class="v">{{val.orderSn}}</span>
										</div>
										<div class="content_fot_item">
											<span class="n">数量:</span>
											<span class='v'>{{val.buyBoxNum}}</span>
										</div>
										<div class="content_fot_item">
											<span class="n">金额:</span>
											<span class="v">{{val.buyAmountPrice}}</span>
										</div>
										<div class="content_fot_item">
											<span class="n">时间:</span>
											<span class="v">{{val.createTime|time('y-m-d')}}</span>
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
		<!-- 设置 -->
		<el-dialog title='设置' center :visible.sync='setVisible' width='800px' v-dialogDrag>
			<div>
				<el-tabs v-model="activeName">
					<el-tab-pane label="表格字段" name="first">
						<options :data='tableOptions' @cb='updataTableOptions' @close='setVisible=false'></options>
					</el-tab-pane>
					<el-tab-pane label="筛选字段" name="second">
						<options :data='selections' @cb='updataSelections' @close='setVisible=false'></options>
					</el-tab-pane>
				</el-tabs>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import headBackTitle from '@/components/headBackTitle.vue'
	import options from '@/components/options.vue'
	export default {
		components: {
			"ym-hbt": headBackTitle,
			"options": options
		},
		data() {
			return {
				isTable: true,
				isSelect: true,
				date: null,
				select: null,
				dataList: [],
				tenantId: JSON.parse(this.$store.state.token).tenantId,
				role: JSON.parse(this.$store.state.role),
				pageNum: 0,
				loadmore: false,
				total: 0,
				options: {},
				option: {},
				supportList: {},
				clearList: {},
				openList: {},
				statusList: {
					0: '无须审核',
					1: '待审核',
					2: '审核通过',
					3: '审核拒绝'
				},
				setVisible: false,
				activeName: 'first',
				multipleSelection: [],
			}
		},
		computed: {
			clearShow: function() {
				for (let k in this.option) {
					if (this.option[k] || this.option[k] === 0) {
						return true;
					}
				}
				return false;
			},
			tableShow: function() {
				let temp = {};
				this.tableOptions.forEach((val) => {
					temp[val.key] = val.show
				});
				return temp;
			},
			selections: function() {
				return JSON.parse(this.$store.state.setJson).selection.CL;
			},
			tableOptions: function() {
				return JSON.parse(this.$store.state.setJson).tableOptions.CL;
			}
		},
		methods: {
			/**
			 * 获取供应商数据
			 * @method getData
			 * @param pageNum 页码
			 * @param pageSize 页面大小
			 * @param options 筛选项
			 */
			getData(pageNum, pageSize, options, callback) {
				let params = {
					tenantId: this.tenantId,
					status: 1,
					pageNum: pageNum,
					pageSize: pageSize,
					clearanceApproveState: 0,
				}
				params = Object.assign(params, options);
				this.$axios.get('/apt/purposeForm/showPurposeFormPageList', {
						params
					})
					.then(res => {
						if (res.data && res.data.data) {
							this.dataList = this.dataList.concat(res.data.data.dataList)
							this.total = res.data.data.total;
						}
						callback ? callback(res.data.data) : null
					}, () => {
						callback ? callback(false) : null
					})
			},
			/**
			 * 获取筛选项
			 * @method getOptions
			 */
			getOptions(options) {
				let params = {
					tenantId: this.tenantId,
					status: 1,
					clearanceApproveState: 0,
				}
				params = Object.assign(params, options);
				this.$axios.get('/apt/purposeForm/showPurposeFormListCondition', {
						params
					})
					.then(res => {
						if (res.data && res.data.data) {
							let data = res.data.data;
							let temp = {
								contactId: [],
								clearanceId: [],
								clearanceApproveState: [],
								openCompanyId: [],
							};
							let supportList = {};
							let clearList = {};
							let openList = {};
							data.forEach((val) => {
								temp.clearanceId.push(val.clearanceId);
								temp.contactId.push(val.supportId);
								temp.openCompanyId.push(val.issuingId);
								temp.clearanceApproveState.push(val.clearanceApproveState)
								supportList[val.supportId] = val.supportCompanyName;
								clearList[val.clearanceId] = val.lineCompanyName;
								openList[val.issuingId] = val.openCompanyName;
							})
							temp.contactId = this.uniq(temp.contactId)
							temp.clearanceId = this.uniq(temp.clearanceId)
							temp.openCompanyId = this.uniq(temp.openCompanyId)
							temp.clearanceApproveState = this.uniq(temp.clearanceApproveState)
							this.options = temp;
							this.supportList = supportList;
							this.clearList = clearList;
							this.openList = openList;
						}
					})
			},
			/**
			 * 无限加载
			 * @method load
			 */
			load(callback) {
				this.getData(this.pageNum++, 30, this.option, (data) => {
					callback();
					this.loadmore = data.pages > data.pageNo
				})
			},
			/**
			 * 刷新
			 * @method refresh
			 */
			refresh() {
				const loading = this.$loading({
					lock: true,
					text: '数据加载中...',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				this.option = {
					dateState: ''
				};
				this.dataList = [];
				this.pageNum = 1;
				this.getData(this.pageNum++, 30, this.option, (data) => {
					loading.close();
					this.loadmore = data.pages > data.pageNo;
					if (data) {
						this.getOptions(this.option);
						this.$message.success('刷新完成')
					} else {
						this.$message.error('刷新失败')
					}
				})
			},
			/**
			 * 筛选数据
			 * @method screen
			 */
			screen() {
				this.dataList = [];
				this.pageNum = 1;
				for (let k in this.option) {
					if (!this.option[k] && this.option[k] !== 0) delete this.option[k]
				};
				const loading = this.$loading({
					lock: true,
					text: '数据加载中...',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				this.getData(this.pageNum++, 30, this.option, () => {
					loading.close();
					this.getOptions(this.option);
				})
			},
			/**
			 * 搜索框
			 * @method screenBar
			 */
			screenBar() {
				window.clearTimeout(this.timer)
				this.timer = setTimeout(() => {
					this.screen();
				}, 500)
			},
			/**
			 * 清楚选项
			 * @method removeOption
			 */
			removeOption() {
				this.option = {
					dateState: ''
				};
				this.refresh();
			},
			/**
			 * 更新筛选项字段
			 * @method updataSelections
			 */
			updataSelections(data) {
				let setJson = JSON.parse(this.$store.state.setJson);
				setJson.selection.CL = data;
				this.$store.commit('setSetJson', setJson);
				this.refresh();
				this.upSetJson(setJson);
			},
			/**
			 * 表格字段更新
			 * @method updataTableOptions
			 */
			updataTableOptions(data) {
				let setJson = JSON.parse(this.$store.state.setJson);
				setJson.tableOptions.CL = data;
				this.$store.commit('setSetJson', setJson);
				this.upSetJson(setJson);
			},
			/**
			 * 表格选中
			 * @method handleSelectionChange
			 * */
			handleSelectionChange(data) {
				this.multipleSelection = data;
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
			 * 导出供应商
			 * @method exportExcel
			 **/
			exportExcel() {
				if (this.multipleSelection.length === 0) return this.$message.error('请选择导出的供应商');
				let {
					export_json_to_excel
				} = require('../../../assets/excel/Export2Excel');
				require.ensure([], () => {
					var tHeader = ['进货单号', '日期', '清关公司', '供应商', '开公司', 'THC', '清关总柜数', '清关总柜数', '审核'];
					var filterVal = ['orderSn', 'createTime', 'lineCompanyName', 'supportCompanyName', 'openCompanyName', 'thcPrice',
						'buyBoxNum', 'buyPackageNum', 'clearanceApproveState'
					];
					var list = this.multipleSelection;
					var data = list.map(v => filterVal.map(
						j => {
							if (j === 'clearanceApproveState') {
								return v[j] === 0 ? '无需审核' : v[j] === 1 ? '待审核' : v[j] === 2 ? '审核通过' : '审核拒绝'
							} else {
								return v[j]
							}
						}
					));
					export_json_to_excel(tHeader, data, '清关单列表');
				})
			},

			goTo(name, code) {
				if (!this.role[code]) {
					this.$message.error('没有权限');
				} else {
					this.$router.push(name)
				}
			},

		},
		mounted() {
			setTimeout(() => {
				this.isSelect = false;
			}, 1500);
			this.getOptions({})
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/assets/css/jxc/card.scss";

	.listModule .card_li .card_li_con {
		padding-bottom: 70%;
	}

	.content_fot .content_fot_item .n {
		width: 50px;
	}

	.content_fot .content_fot_item {
		height: 25%;
	}
</style>
