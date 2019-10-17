<template lang="html">
	<div class="listModule">
		<div class="list_header">
			<ym-hbt :to='{name:"saleHome"}' title='待交付订单'></ym-hbt>
		</div>
		<div class="list_setbar">
			<div class="list_setbar_options">
				<div class="option" @click='isTable = !isTable'>
					<div class="option_yuan"><i class="iconfont" :class="isTable?'icon-gongge1':'icon-liebiao1'"></i></div>
				</div>
				<div class="option" @click='getData'>
					<div class="option_yuan"><i class="iconfont icon-shuaxin1"></i></div>
					<span class="option_txt">刷新</span>
				</div>
				<div class="option" @click='isSelect = !isSelect'>
					<div class="option_yuan"><i class="iconfont icon-shaixuan1"></i></div>
					<span class="option_txt">筛选</span>
				</div>
				<div class="option" @click='toExcal'>
					<div class="option_yuan"><i class="iconfont icon-daochu1"></i></div>
					<span class="option_txt">导出</span>
				</div>
				<div class="option" @click='openSet'>
					<div class="option_yuan"><i class="iconfont icon-gongjushezhi1"></i></div>
					<span class="option_txt">设置</span>
				</div>
				<div class="search_input">
					<i class="iconfont icon-sousuo"></i>
					<input type="text" v-model='se'>
				</div>
			</div>
			<div class="list_setbar_selections">
				<div class="selection" :class="{now:n==1}" @click='setTime(1)'>今天</div>
				<div class="selection" :class="{now:n==7}" @click='setTime(7)'>7天</div>
				<div class="selection" :class="{now:n==30}" @click='setTime(30)'>30天</div>
				<div class="selection" :class="{now:date,now1:date}">
					<el-date-picker v-model="date" type="daterange" start-placeholder="选择时间"></el-date-picker>
				</div>
				<div class="selection" v-show='selectShow[val]' v-if="val!='是否含税'&&val!='审核'&&val!='理货'" :class="{now:select[val]}"
				 v-for='(val,key) in selectConfig' :key='key'>
					<el-select v-model="select[val]" :placeholder="val">
						<el-option v-for='(v,k) in selectData[val]' :key='k' :label="v" :value="v"></el-option>
					</el-select>
				</div>
				<div class="selection" v-show='selectShow.是否含税' :class="{now:select['是否含税']||select['是否含税']===null}">
					<el-select v-model="select['是否含税']" placeholder="是否含税">
						<el-option v-for='(v,k) in selectData["是否含税"]' :key='k' :label='v?v==1?"含税":"不含税":"未知"' :value="v"></el-option>
					</el-select>
				</div>
				<div class="selection" v-show='selectShow.审核' :class="{now:select['审核']||select['审核']==0}">
					<el-select v-model="select['审核']" placeholder="审核">
						<el-option v-for='(v,k) in selectData["审核"]' :key='k' :label="v?v==2?'已审核':'未审核':'unknown'" :value="v"></el-option>
					</el-select>
				</div>
				<div class="selection" v-show='selectShow.理货' :class="{now:select['理货']||select['理货']==0||select['理货']===null}">
					<el-select v-model="select['理货']" placeholder="理货">
						<el-option v-for='(v,k) in selectData["理货"]' :key='k' :label="v?v==2?'已理货':'未理货':'unknown'" :value="v"></el-option>
					</el-select>
				</div>
				<span class="clear" v-show='JSON.stringify(select) !="{}"||n!=""||date!=""' @click='select={};form="";date="";n=""'>清除</span>
			</div>
		</div>
		<div class="list_main" :class="{se:isSelect}">
			<div class="list_main_table" v-show='isTable'>
				<div class="table">
					<el-table :data='dataList' height='100%' @selection-change='handleSelectionChange'>
						<el-table-column align='center' type='selection'></el-table-column>
						<el-table-column align='center' label='销售单号' show-overflow-tooltip>
							<template slot-scope='scope'>
								<router-link :to="{ name: 'saleDeta', params: {id:scope.row.id,backName:'unfinOder'} }">{{scope.row.orderNo}}</router-link>
							</template>
						</el-table-column>
						<el-table-column v-if='tableShow.销售时间' align='center' label='销售时间' show-overflow-tooltip>
							<template slot-scope='scope'>{{ymd(scope.row.createTime)}}</template>
						</el-table-column>
						<el-table-column v-if='tableShow.销售时间' align='center' label='销售部门' prop='deptName' show-overflow-tooltip></el-table-column>
						<el-table-column v-if='tableShow.销售员' align='center' label='销售员' prop='creatorName' show-overflow-tooltip></el-table-column>
						<el-table-column v-if='tableShow.客户名称' align='center' label='客户名称' prop='contactName' show-overflow-tooltip></el-table-column>
						<el-table-column v-if='tableShow.数量' align='center' label='数量' width='50' prop='orderPackages'></el-table-column>
						<el-table-column v-if='tableShow.金额' align='center' label='金额' width='90' prop='orderAmount'></el-table-column>
						<el-table-column v-if='tableShow.是否含税' align='center' label='是否含税'>
							<template slot-scope='scope'>{{scope.row.isTax?scope.row.isTax==1?"含税":"不含税":"null"}}</template>
						</el-table-column>
						<el-table-column align='center' label='审核' width='50'>
							<template slot-scope='scope'>
								<i class="iconfont icon-xuanzhong1" :class="{g:scope.row.审核==2}"></i>
							</template>
						</el-table-column>
						<el-table-column align='center' label='理货' width='50'>
							<template slot-scope='scope'>
								<i class="iconfont icon-xuanzhong1" :class="{g:scope.row.理货==2}"></i>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="table_fot">
					<span>总数：{{dataList.length}}</span>
					<span>总数：{{multipleSelection.length}}</span>
				</div>
			</div>
			<div class="list_main_card" v-show='!isTable'>
				<div class="card">
					<ul class="card_ul">
						<li class="card_li" v-for='(val,key) in dataList' :key='key'>
							<div class="card_li_con">
								<div class="content" @click="$router.push({name:'saleDeta',params:{id:val.id,backName:'unfinOder'}})">
									<div class="content_top">
										<span class="content_top_round" :class="{ss:val.审核==2}"></span>
										<span class="content_top_title">{{val.contactName}}</span>
									</div>
									<div class="content_fot">
										<div class="content_fot_item">
											<span>{{val.creatorName}}</span>
										</div>
										<div class="content_fot_item">
											<span class="n">销售单号:</span>
											<span>{{val.orderNo}}</span>
										</div>
										<div class="content_fot_item">
											<span class="n">预售金额:</span>
											<span class='s'>{{val.orderAmount}}</span>
										</div>
										<div class="content_fot_item">
											<span class="n">理货状态:</span>
											<span>{{val.理货==2?'已理货':'未理货'}}</span>
										</div>
										<div class="content_fot_item">
											<span class="n">确认状态:</span>
											<span>{{val.state==5?'已确认':'未确认'}}</span>
										</div>
									</div>
								</div>
							</div>
						</li>
					</ul>
				</div>
				<div class="card_fot">
					<span>总数：{{dataList.length}}</span>
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
				tabs: '1',
				se: '',
				isTable: true,
				isSelect: true,
				setVisible: false,
				date: null,
				select: {},
				tenantId: JSON.parse(this.$store.state.token).tenantId,
				dataList: [],
				tableShow: {
					销售时间: true,
					销售部门: true,
					销售员: true,
					客户名称: true,
					数量: true,
					金额: true,
					是否含税: true
				},
				multipleSelection: [],
				selectConfig: ['销售部门', '销售员', '客户名称', '是否含税', '审核', '理货'],
				selectShow: {
					销售部门: true,
					销售员: true,
					客户名称: true,
					是否含税: true,
					审核: true,
					理货: true,
				},
				selectData: {},
				form: '',
				to: '',
				n: '',
			}
		},
		methods: {
			//获取列表数据
			getData() {
				this.$axios({
					method: 'get',
					url: '/aps/sell/showSellsList',
					params: {
						tenantId: this.tenantId,
					}
				}).then(res => {
					if (res.data.data) {
						this.metaData = this.buildMetaData(res.data.data);
						this.buildSelect();
						this.doDatalist();
					}
				})
			},
			buildMetaData(data) {
				for (let i in data) {
					let obj = {
						"销售部门": data[i].deptName,
						"销售员": data[i].creatorName,
						"客户名称": data[i].contactName,
						"是否含税": data[i].isTax,
						"审核": data[i].openApproveStatet,
						"理货": data[i].checkApproveState
					}
					Object.assign(data[i], obj);
				}
				return data;
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			//筛选项数据
			buildSelect() {
				this.selectData = this.buildSelectData(this.metaData, this.selectConfig)
			},
			doDatalist() {
				let data = this.doTime(this.metaData, this.form, this.to, 'createTime')
				data = this.doList(data, this.select);
				if (this.se != '') {
					for (let i = 0; i < data.length; i++) {
						if (data[i].orderNo.indexOf(this.se) == -1) {
							data.splice(i, 1);
							i--;
						}
					}
				}
				this.dataList = data;
			},
			setTime(i) {
				this.to = new Date(this.ymd(new Date())) - 1 + 16 * 60 * 60 * 1000;
				this.form = this.to - i * 24 * 60 * 60 * 1000 + 1;
				this.doDatalist();
				this.n = i;
				this.date = ''
			},
			toExcal() {
				let data = [];
				if (this.multipleSelection.length == 0) {
					data = this.dataList;
				} else {
					data = this.multipleSelection;
				}
				let str =
					'<tr><th>销售单号</th><th>销售部门</th><th>销售员</th><th>客户名称</th><th>数量</th><th>金额</th><th>是否含税</th><th>审核</th><th>理货</th></tr>';
				for (let i in data) {
					str += '<tr>';
					str += '<td>' + data[i].orderNo + '</td>';
					str += '<td>' + data[i].deptName + '</td>';
					str += '<td>' + data[i].creatorName + '</td>';
					str += '<td>' + data[i].contactName + '</td>';
					str += '<td>' + data[i].orderPackages + '</td>';
					str += '<td>' + data[i].orderAmount + '</td>';
					str += '<td>' + (data[i].isTax ? data[i].isTax == 1 ? '含税' : '不含税' : 'unknown') + '</td>';
					str += '<td>' + (data[i].审核 ? data[i].审核 == 2 ? '已审核' : '未审核' : 'unknown') + '</td>';
					str += '<td>' + (data[i].理货 ? data[i].理货 == 2 ? '已理货' : '未理货' : 'unknown') + '</td>';
					str += '</tr>';
				}
				this.excal(str, '销售列表', '销售列表')
			},
			openSet() {
				this.setVisible = true;
			},
			upSelectShow(data) {
				this.selectShow = JSON.parse(JSON.stringify(data));
				this.setVisible = false;
			},
			upTableShow(data) {
				this.tableShow = JSON.parse(JSON.stringify(data));
				this.setVisible = false;
			}
		},
		mounted() {
			this.getData();
			setTimeout(() => {
				this.isSelect = false;
			}, 1500)
		},
		watch: {
			select: {
				handler: function() {
					setTimeout(() => {
						this.doDatalist();
					})
				},
				deep: true
			},
			date: function() {
				if (!this.date) return;
				this.form = this.date[0];
				this.to = this.date[1] - 1 + 24 * 60 * 60 * 1000;
				this.doDatalist();
				this.n = '';
			},
			se: function() {
				this.doDatalist();
			}
		}
	}
</script>
<style lang="scss">
	.set_tabs .el-dialog {
		width: 650px;
		height: 500px;
		top: calc(50% - 250px);
		left: calc(50% - 325px);
	}
</style>
<style lang="scss" scoped>
	.table i {
		font-size: 20px;
	}

	.table .g {
		color: #00a0e9
	}

	.content_top {
		height: 40px;
		background: #ffffff;
		line-height: 35px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;

		.content_top_round {
			background: #dddddd;
			display: inline-block;
			width: 8px;
			height: 8px;
			border-radius: 50%;
			margin-left: 5px;
		}

		.content_top_round.ss {
			background: rgb(14, 255, 9);
		}
	}

	.content_fot {
		height: calc(100% - 40px);
		background: #eeeeee;

		.content_fot_item {
			height: 20%;
			padding: 0 10px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;

			span {
				display: inline-block;
				line-height: 25px;
			}

			.n {
				width: 65px;
			}

			.s {
				color: rgb(250, 205, 105);
			}
		}
	}
</style>
