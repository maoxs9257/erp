<template>
	<div class="listModule">
		<div class="list_header">
			<v-head title="库存流水" :to="{name:'stockHome'}"></v-head>
		</div>
		<div class="list_setbar">
			<div class="list_setbar_options">
				<div v-if="multipleSelection.length==0" class="option" @click="refresh">
					<div class='option_yuan'><i class="iconfont shuaxin"></i></div>
					<span class="option_txt">刷新</span>
				</div>
				<div v-if="multipleSelection.length==0" class="option">
					<div class='option_yuan'>
						<i class="iconfont shimu" v-if="categoryId==2"></i>
						<i class="iconfont mupeicheng" v-if="categoryId==4"></i>
						<i class="iconfont mingguicai" v-if="categoryId==3"></i>
						<i class="iconfont yuanmu" v-if="categoryId==1"></i>
						<i class="iconfont renzaoban" v-if="categoryId==5"></i>
					</div>
					<div class="option_select">
						<el-select v-model="categoryId" @change="getDataList" placeholder="品类">
							<el-option label="实木板材" value="2"></el-option>
							<el-option label="原木材" value="1"></el-option>
							<el-option label="人造板" value="5"></el-option>
							<el-option label="木配城" value="4"></el-option>
							<el-option label="名贵材" value="3"></el-option>
						</el-select>
					</div>
				</div>
				<div v-if="multipleSelection.length==0" class="option">
					<div class='option_yuan'>
						<i class="iconfont shimu" v-if="type==1"></i>
						<i class="iconfont mupeicheng" v-if="type==2"></i>
					</div>
					<div class="option_select" style="width:50px">
						<el-select v-model="type" @change="proData" placeholder="品类">
							<el-option label="入库" value="2"></el-option>
							<el-option label="出库" value="1"></el-option>
						</el-select>
					</div>
				</div>
				<div v-if="multipleSelection.length>0" class="option" @click="exportExcel">
					<div class='option_yuan'><i class="iconfont daochu"></i></div>
					<span class="option_txt">导出</span>
				</div>
				<div v-if="multipleSelection.length==0" class="option" @click="isSelect = !isSelect">
					<div class="option_yuan"><i class="iconfont shaixuan"></i></div>
					<span class="option_txt">筛选</span>
				</div>
				<div v-if="multipleSelection.length==0" class="option" @click="setVisible=true">
					<div class='option_yuan'><i class="iconfont cebian-shezhi"></i></div>
					<span class="option_txt">设置</span>
				</div>
				<div class="search_input">
					<i class="iconfont sousuo"></i>
					<input type="text" v-model="searchText" class="search_input_placeholder" placeholder="订单编号/包号" @change="searchId">
				</div>
			</div>
			<div class="list_setbar_selections">
				<div class="selection" :class="{now:timeState===1}" @click="timeState=1;searchId()">今天</div>
				<div class="selection" :class="{now:timeState===3}" @click="timeState=3;searchId()">本周</div>
				<div class="selection" :class="{now:timeState===2}" @click="timeState=2;searchId()">本月</div>
				<div class="selection" v-if="selections[key].show" v-for="(val,key) in selections" :key="key" :class="{now:option[val.key]}">
					<el-select v-model="option[val.key]" :placeholder="val.name" clearable @change="searchId">
						<el-option v-for="(v,k) in options[val.key]" :label="v" :value="v" :key="k"></el-option>
					</el-select>
				</div>
				<span class="clear" v-if='clearShow||!!timeState' @click='timeState=null;removeOption()'>清除</span>
			</div>
		</div>
		<div class="list_main" :class="{se:isSelect}">
			<div class="list_main_table">
				<div class="table">
					<el-table :data="tableList" width='100%' height="100%" @selection-change="handleSelectionChange" v-loadMethod='load' modname='.el-table__body-wrapper'
					 loadmore='loadmore'>
						<el-table-column type="selection"></el-table-column>
						<el-table-column label="订单编号" show-overflow-tooltip>
							<template slot-scope="scope">
								<a href="javascript:void(0)">{{scope.row.id}}</a>
							</template>
						</el-table-column>
						<el-table-column label="包号" prop="packageNo" show-overflow-tooltip></el-table-column>
						<el-table-column v-if="tableShow[val]" v-for="(val,key) in tableConfig" :key="key" :label="val" :prop="val"
						 show-overflow-tooltip></el-table-column>
						<el-table-column label="时间" show-overflow-tooltip width="100">
							<template slot-scope="scope">{{ scope.row.time|time('y-m-d')}}</template>
						</el-table-column>
						<el-table-column label="仓库名" prop="name" show-overflow-tooltip></el-table-column>
						<el-table-column label="类型">
							<template slot-scope="scope">{{ scope.row.storageType|fileType}}</template>
						</el-table-column>
						<el-table-column label="往来单位">
							<template slot-scope="scope">{{ scope.row.displayName }}</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="table_fot">
					<span>总数:{{total}}</span>
				</div>
			</div>
		</div>
		<!-- 入库单详情 -->
		<div class="war-shenghe">
			<el-dialog v-dialogDrag :visible.sync="showDetailInfo" center title="入库单详情">
				<ul class="v-form">
					<!-- <li>
						<div class="silp"><span class="key">入库单编号 : </span><span class="value">{{auditDataform[0].orderSn}}</span></div>
						<div class="silp"><span class="key">供应商 : </span><span class="value">{{auditDataform[0].supportName}}</span></div>
						<div class="silp"><span class="key">开证公司 : </span><span class="value">{{auditDataform[0].issuingName}}</span></div>
						<div class="silp"><span class="key">结算币种 : </span><span class="value"></span></div>
					</li>
					<li>
						<div class="silp nowrap"><span class="key">入库数量 : </span><span class="value">{{auditDataform[0].amounts}}</span></div>
						<div class="silp"><span class="key">采购单价 : </span><span class="value"></span></div>
						<div class="silp"><span class="key">付汇时间 : </span><span class="value">{{auditDataform[0].rateTime | getDay}}</span></div>
						<div class="silp"><span class="key">汇率 : </span><span class="value"></span></div>
					</li>
                    <li>
						<div class="silp nowrap"><span class="key">已付金额 : </span><span class="value"></span></div>
						<div class="silp"><span class="key">待付金额 : </span><span class="value">{{auditDataform[0].untiPrice}}</span></div>
						<div class="silp"><span class="key">入库时间 : </span><span class="value">{{auditDataform[0].storeInTime | getDay}}</span></div>
						<div class="silp"><span class="key">制单人 : </span><span class="value">{{auditDataform[0].creatorName}}</span></div>
					</li> -->
				</ul>
				<div class="v-table">
					<el-table v-if="auditDataTable.length!=0" :data="auditDataTable" style="width: 100%;" max-height="260">
						<el-table-column type="index" label="序号" width="50" show-overflow-tooltip>
						</el-table-column>
						<el-table-column :label="key" v-for="(item, key) in auditDataTable[0].data" :key="key" show-overflow-tooltip>
							<template slot-scope="scope">
								{{scope.row.data[key]}}
							</template>
						</el-table-column>
						<el-table-column label="成本单价" width="100" show-overflow-tooltip>
							<template slot-scope="scope">{{scope.row.id}}</template>
						</el-table-column>
						<el-table-column label="采购金额" width="100" show-overflow-tooltip>
							<template slot-scope="scope">{{scope.row.buyPrice}}</template>
						</el-table-column>
					</el-table>
					<div class="v-btn">

					</div>
				</div>
			</el-dialog>
		</div>
		<!-- 销售单详情 -->
		<div class="war-shenghe">
			<el-dialog v-dialogDrag :visible.sync="showxiaoInfo" center title="销售单详情">
				<ul class="v-form">
					<li>
						<div class="silp"><span class="key">销售单号 : </span><span class="value">{{toFormxiao.orderNo}}</span></div>
						<div class="silp"><span class="key">车号 : </span><span class="value">{{toFormxiao.carNo}}</span></div>
						<div class="silp"><span class="key">销售员 : </span><span class="value">{{toFormxiao.creatorName}}</span></div>
						<div class="silp"><span class="key">销售时间 : </span><span class="value">{{toFormxiao.sellTime|time('y-m-d')}}</span></div>
					</li>
					<li>
						<div class="silp nowrap"><span class="key">客户名称 : </span><span class="value">{{toFormxiao.fullName}}</span></div>
						<div class="silp"><span class="key">联系电话 : </span><span class="value">{{toFormxiao.phone}}</span></div>
						<div class="silp"><span class="key">收货人 : </span><span class="value">{{toFormxiao.displayName}}</span></div>
						<div class="silp"><span class="key">发货信息 : </span><span class="value">{{toFormxiao.displayName}}</span></div>
					</li>
					<li>
						<div class="silp nowrap"><span class="key">销售金额 : </span><span class="value">{{toFormxiao.fullName}}</span></div>
						<div class="silp"><span class="key">已收金额 : </span><span class="value">{{toFormxiao.phone}}</span></div>
						<div class="silp"><span class="key">待收金额 : </span><span class="value">{{toFormxiao.displayName}}</span></div>
						<div class="silp"><span class="key">是否含税 : </span><span class="value">{{toFormxiao.displayName}}</span></div>
					</li>
				</ul>
				<div class="v-table">
					<el-table v-if="xiaoTable.length!=0" :data="xiaoTable" style="width: 100%;" max-height="250">
						<el-table-column type="index" label="序号" width="50" show-overflow-tooltip>
						</el-table-column>
						<el-table-column label="仓库" show-overflow-tooltip>
							<template slot-scope="scope">{{scope.row.id}}</template>
						</el-table-column>
						<el-table-column :label="key" show-overflow-tooltip v-for="(item, key) in xiaoTable[0].brr" :key="key">
							<template slot-scope="scope">
								{{scope.row.brr[key]}}
							</template>
						</el-table-column>
						<el-table-column label="单价" width="100" show-overflow-tooltip>
							<template slot-scope="scope">{{scope.row.price}}</template>
						</el-table-column>
						<el-table-column label="金额" width="100" show-overflow-tooltip>
							<template slot-scope="scope">{{scope.row.id}}</template>
						</el-table-column>
					</el-table>
					<div class="v-btn">

					</div>
				</div>
			</el-dialog>
		</div>
		<!-- 设置 -->
		<el-dialog title='设置' center :visible.sync='setVisible' width='800px' v-dialogDrag>
			<div v-if="setVisible">
				<el-tabs v-model="activeName">
					<el-tab-pane label="表格字段" name="first">
						<options :data='tableOptions' @cb='updataTableOptions' @close='setVisible=false'></options>
					</el-tab-pane>
					<el-tab-pane label="筛选字段" name="second">
						<options v-if="setVisible" :data='selections' @cb='updataSelections' @close='setVisible=false'></options>
					</el-tab-pane>
				</el-tabs>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import head from "@/components/headBackTitle.vue"
	import options from '@/components/options.vue'
	export default {
		data() {
			return {
				tenantId: JSON.parse(this.$store.state.token).tenantId,
				isSelect: false,
				dataList: [],
				showDetailInfo: false,
				xiaoTable: [],
				showxiaoInfo: false,
				toFormxiao: {},
				auditDataTable: [],
				categoryId: '2',
				type: '2',
				tableConfig: [],
				pageNum: 1,
				loadmore: true,
				tableList: [],
				total: 0,
				searchText: '',
				multipleSelection: [],
				setVisible: false,
				activeName: 'first',
				options: {},
				option: {},
				timeState:null,
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
			clearShow: function() {
				for (let k in this.option) {
					if (this.option[k] || this.option[k] === 0) {
						return true;
					}
				}
				return false;
			},
			selections: function() {
				return JSON.parse(this.$store.state.setJson).selection.SF[this.categoryId]
			},
			tableOptions: function() {
				return JSON.parse(this.$store.state.setJson).tableOptions.SF[this.categoryId]
			}
		},
		mounted() {
			this.getDataList();
		},
		methods: {
			//获取数据
			getDataList() {
				const loading = this.$loading({
					lock: true,
					text: '数据加载中...',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				let params = {
					tenantId: this.tenantId,
					catoryId: this.categoryId,
				};
				this.$axios.get('/api/storePackage/showStoreInOurFormInfo', {
						params
					})
					.then(res => {
						loading.close();
						if (res.data && res.data.data) {
							this.mateData = res.data.data;
							switch (this.categoryId) {
								case '1':
									this.tableConfig = this.GLOBAL_.tableConfig['原木材'];
									break;
								case '2':
									this.tableConfig = this.GLOBAL_.tableConfig['实木板材'];
									break;
								case '3':
									this.tableConfig = this.GLOBAL_.tableConfig['名贵材'];
									break;
								case '4':
									this.tableConfig = this.GLOBAL_.tableConfig['木配城'];
									break;
								case '5':
									this.tableConfig = this.GLOBAL_.tableConfig['人造板'];
									break;
								default:
									this.tableConfig = [];
							}
							this.proData();
						} else {
							this.mateData = {};
							this.dataList = [];
							this.$message.error('获取数据失败')
						}
					}, () => {
						loading.close();
						this.$message.error('获取数据失败')
					});
			},
			// 区分出入库数据&筛选数据
			proData() {
				let data = this.type == 1 ? this.mateData.storeOutFromInfolist : this.mateData.storeInFromInfolist;
				data.forEach((val) => {
					val.time = this.type == 1 ? val.storeOutTime : val.storeInTime;
					let arr = val.attributeValue.split(',');
					for (let i in arr) {
						val[arr[i].split(':')[0]] = arr[i].split(':')[1]
					}
				});
				this.dataList = data;
				this.searchId();
			},
			// 订单编号搜素
			searchId() {
				let data = this.type == 1 ? this.mateData.storeOutFromInfolist : this.mateData.storeInFromInfolist;
				let arr = [];
				for (let i in data) {
					if ((data[i].id + '').indexOf(this.searchText) != -1||(data[i].packageNo+'').indexOf(this.searchText)!= -1) {
						arr.push(data[i]);
					}
				}
				// 筛选
				for (let i in this.option) {
					for (let n = 0; n < arr.length; n++) {
						if (this.option[i]!==""&&arr[n][i]!==this.option[i]) {
							arr.splice(n, 1);
							n--;
						}
					}
				}
				this.screenTime(arr);
				this.refresh();
			},
			// 时间筛选
			screenTime(arr){
				if(this.timeState===1){
					let time2 = this.time(new Date(),'y-m-d');
					for (let n = 0; n < arr.length; n++) {
						let time = this.time(arr[n].time,'y-m-d');
						if (time!==time2) {
							arr.splice(n, 1);
							n--;
						}
					}
				}else if(this.timeState===2){
					let time2 = this.time(new Date(),'y-m');
					for (let n = 0; n < arr.length; n++) {
						let time = this.time(arr[n].time,'y-m');
						if (time!==time2) {
							arr.splice(n, 1);
							n--;
						}
					}
				}else{
					let time2 = this.time(new Date(),'y-w');
					console.log(time2)
					for (let n = 0; n < arr.length; n++) {
						let time = this.time(arr[n].time,'y-w');
						if (time!==time2) {
							arr.splice(n, 1);
							n--;
						}
					}
				}
				this.dataList = arr;
				this.setOptions();
			},
			// 筛选项
			setOptions() {
				let arr = [...this.dataList];
				let obj = {};
				for (let i in this.tableConfig) {
					let config = this.tableConfig[i];
					if (config == '品类' || config == '水份' || config == '产地' || config == '片数' || config == '立方数') continue;
					obj[config] = [];
					arr.forEach((val) => {
						obj[config].push(val[config])
					});
					obj[config] = this.uniq(obj[config])
				}
				obj.name=[];
				arr.forEach((val)=>{
					obj.name.push(val.name)
				})
				obj.name=this.uniq(obj.name)
				this.options = obj;
			},
			// 删除筛选
			removeOption() {
				this.option = {};
				this.searchId();
			},
			
			// 分页 加快页面加载速度
			getData(pageNum, callback) {
				let data = this.dataList;
				let si = pageNum * 30 - 30;
				let arr = [];
				for (let i = si; i < data.length && i < si + 30; i++) {
					arr.push(data[i]);
				}
				this.tableList = [...this.tableList, ...arr];
				this.total = data.length;
				callback ? callback() : null;
			},
			// 无限加载
			load(callback) {
				this.getData(this.pageNum++, () => {
					callback();
					this.loadmore = this.tableList.length < this.total;
				})
			},
			// 刷新
			refresh() {
				this.pageNum = 1;
				this.tableList = [];
				setTimeout(() => {
					this.getData(this.pageNum, () => {
						this.loadmore = this.tableList.length < this.total;
						this.$message.success('刷新成功');
					});
				})
			},
			// 数据选中
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			// 导出
			exportExcel() {
				if (this.multipleSelection.length === 0) return this.$message.error('请选择导出的客户');
				let {
					export_json_to_excel
				} = require('../../../assets/excel/Export2Excel');
				require.ensure([], () => {
					let header = ['订单编号', '包号'];
					let filter = ['id', 'packageNo'];
					for (let i in this.tableConfig) {
						header.push(this.tableConfig[i]);
						filter.push(this.tableConfig[i]);
					}
					header = [...header, ...['时间', '仓库名', '类型', '往来单位']];
					filter = [...filter, ...['time', 'name', 'storageType', 'displayName']];
					let tHeader = header;
					let filterVal = filter;
					let list = this.multipleSelection;
					let data = list.map(v => filterVal.map(j => {
						if (j == 'time') {
							return this.time(v[j], 'y-m-d');
						}
						if (j == 'storageType') {
							return v[j] == 1 ? '采购入库' : '销售出库'
						}
						return v[j];
					}));
					export_json_to_excel(tHeader, data, '库存流水');
				})
			},
			// 更新表格字段
			updataTableOptions(data) {
				let setJson = JSON.parse(this.$store.state.setJson);
				setJson.tableOptions.SF[this.categoryId] = data;
				this.$store.commit('setSetJson', setJson);
				this.upSetJson(setJson)
			},
			/**
			 * 更新筛选项字段
			 * @method updataSelections
			 */
			updataSelections(data) {
				let setJson = JSON.parse(this.$store.state.setJson);
				setJson.selection.SF[this.categoryId] = data;
				this.$store.commit('setSetJson', setJson);
				this.option = {};
				this.searchId();
				this.upSetJson(setJson)
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
		filters: {
			fileType: function(data) {
				if (data == '1') return '采购入库';
				if (data == '2') return '销售出库';
				if (data == '3') return '销售退货';
				if (data == '4') return '其他入库';
				if (data == '5') return '调拨';
				if (data == '6') return '盘库';
				if (data == '7') return '盘盈';
				return data;
			}
		},
		components: {
			"v-head": head,
			"options": options
		},
	}
</script>
