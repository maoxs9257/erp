<template lang="html">
	<div class="listModule">
		<div class="list_header">
			<ym-hbt :to='{name:"customerHome"}' title='供应商管理'></ym-hbt>
		</div>
		<div class="list_setbar">
			<div class="list_setbar_options">
				<div class="option" v-if='multipleSelection.length===0' @click='isTable = !isTable'>
					<div class="option_yuan"><i class="iconfont" :class="isTable?'jiugongge':'liebiao'"></i></div>
				</div>
				<div class="option" v-if='multipleSelection.length===0' @click="refresh">
					<div class="option_yuan"><i class="iconfont shuaxin"></i></div>
					<span class="option_txt">刷新</span>
				</div>
				<div class="option" v-if='multipleSelection.length===0' @click="openNew">
					<div class="option_yuan"><i class="iconfont xinjian"></i></div>
					<span class="option_txt">新建</span>
				</div>
				<div class="option" v-if='multipleSelection.length===0' @click='isSelect = !isSelect'>
					<div class="option_yuan"><i class="iconfont shaixuan"></i></div>
					<span class="option_txt">筛选</span>
				</div>
				<div class="option" v-if='multipleSelection.length===0' @click="setVisible=true">
					<div class="option_yuan"><i class="iconfont cebian-shezhi"></i></div>
					<span class="option_txt">设置</span>
				</div>
				<div class="option" v-if='multipleSelection.length!==0' @click="openRemove">
					<div class="option_yuan"><i class="iconfont shanchu"></i></div>
					<span class="option_txt">删除</span>
				</div>
				<div class="option" v-if='multipleSelection.length!==0' @click="exportExcel">
					<div class="option_yuan"><i class="iconfont daochu1"></i></div>
					<span class="option_txt">导出</span>
				</div>
				<div class="search_input">
					<i class="iconfont sousuo"></i>
					<input class="search_input_placeholder" type="text" v-model='option.companyName' placeholder="供应商/联系人/手机号" @change="screenBar">
				</div>
			</div>
			<div class="list_setbar_selections">
				<div class="selection">创建时间</div>
				<div class="selection" :class="{now:option.dateState===0}" @click='option.dateState=0;optionTime=null;screen()'>今天</div>
				<div class="selection" :class="{now:option.dateState===1}" @click='option.dateState=1;optionTime=null;screen()'>7天</div>
				<div class="selection" :class="{now:option.dateState===2}" @click='option.dateState=2;optionTime=null;screen()'>30天</div>
				<div class="selection" :class="{now:optionTime}">
					<el-date-picker v-model="optionTime" @change="screenTime" type="daterange" range-separator="/" start-placeholder="选择时间"></el-date-picker>
				</div>
				<div class="selection" v-if='val.show' :class="{now:option[val.key]}" v-for='(val,key) in selections' :key='key'>
					<el-select v-model="option[val.key]" :placeholder="val.name" @change='screen' clearable>
						<el-option v-if='v&&v!==""' v-for='(v,k) in options[val.key]' :label="v" :value="v" :key='k'></el-option>
					</el-select>
				</div>
				<span class="clear" v-if='clearShow' @click="removeOption">清除</span>
			</div>
		</div>
		<div class="list_main" :class="{se:isSelect}">
			<div class="list_main_table" v-if='isTable'>
				<div class="table">
					<el-table :data='dataList' @selection-change="handleSelectionChange" height='100%' v-loadMethod='load' modname='.el-table__body-wrapper'
					 loadmore='loadmore'>
						<el-table-column type='selection'></el-table-column>
						<el-table-column show-overflow-tooltip label='供应商'>
							<template slot-scope='scope'>
								<a href="javascript:void(0)" @click='openSupplier(scope.row.id)'>{{scope.row.companyName}}</a>
							</template>
						</el-table-column>
						<el-table-column v-if='tableShow.address' show-overflow-tooltip label='地址' prop='address'></el-table-column>
						<el-table-column v-if='tableShow.displayName' show-overflow-tooltip label='联系人' prop='displayName'></el-table-column>
						<el-table-column v-if='tableShow.phone' show-overflow-tooltip label='手机号' prop='phone'></el-table-column>
						<el-table-column v-if='tableShow.email' show-overflow-tooltip label='Email' prop='email'></el-table-column>
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
								<div class="content" @click="openSupplier(val.id)">
									<div class="content_left">
										<img :src="val.avatar|imgUrl">
									</div>
									<div class="content_right">
										<div class="content_right_row row1">
											<span class="v">{{val.companyName}}</span>
										</div>
										<div class="content_right_row row2">
											<span class="v">{{val.address}}</span>
										</div>
										<div class="content_right_row row2">
											<span class="v">{{val.displayName}}</span>
										</div>
										<div class="content_right_row row2">
											<span class="v">{{val.phone}}</span>
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
		<!-- 详情 -->
		<el-dialog width="800px" title="供应商详情" center :visible.sync="detaVisible" v-dialogDrag>
			<el-tabs v-model="tabs" @tab-click="handleClick">
				<el-tab-pane label="供应商信息" name="1">
					<div class="main">
						<div class="main_top">
							<div class="main_img">
								<img :src="infoData.avatar|imgUrl" alt="">
								<i class="iconfont" @click="openCropper">上传图片</i>
							</div>
							<div class="main_info">
								<div class="main_info_item">
									<span class="n">供应商:</span>
									<span class="v">{{infoData.companyName}}</span>
								</div>
								<div class="main_info_item">
									<span class="n">联系地址:</span>
									<span class="v">{{infoData.address}}</span>
								</div>
								<div class="main_info_item">
									<span class="n">联系人员:</span>
									<span class="v">{{infoData.displayName}}</span>
								</div>
								<div class="main_info_item">
									<span class="n">手机号:</span>
									<span class="v">{{infoData.phone}}</span>
								</div>
								<div class="main_info_item">
									<span class="n">QQ:</span>
									<span class="v">{{infoData.qq}}</span>
								</div>
								<div class="main_info_item">
									<span class="n">Email:</span>
									<span class="v">{{infoData.email}}</span>
								</div>
								<div class="main_info_item">
									<span class="n">应付金额:</span>
									<span class="v">{{infoData.shouldCost}}</span>
								</div>
								<div class="main_info_item">
									<span class="n">初期欠款:</span>
									<span class="v">{{infoData.initialArrears}}</span>
								</div>
								<div class="main_info_item">
									<span class="n">备注:</span>
									<span class="v">{{infoData.memo}}</span>
								</div>
							</div>
						</div>
						<div class="main_foot">
							<div class="main_foot_item" @click="$router.push({name:'openPurchase',params:{data:infoData}})">
								<i class="iconfont jinxiaocun-xiaoshoukaidan1"></i>
								<p>创建采购</p>
							</div>
							<div class="main_foot_item" @click="">
								<i class="iconfont fasongduizhangdan"></i>
								<p>发送对账单</p>
							</div>
						</div>
					</div>
				</el-tab-pane>
				<el-tab-pane v-if="role.erp_supplier_mod" label="资料修改" name="2">
					<div class="main">
						<div class="main_form">
							<el-form :inline="true" label-width="100px" :model='midefyInfo' :rules='rules' ref="form">
								<el-form-item label='供应商名' prop='companyName'>
									<el-input size='small' v-model='midefyInfo.companyName'></el-input>
								</el-form-item>
								<el-form-item label='联系人' prop='displayName'>
									<el-input size='small' v-model='midefyInfo.displayName'></el-input>
								</el-form-item>
								<el-form-item label='手机号' prop='phone'>
									<el-input size='small' v-model='midefyInfo.phone'></el-input>
								</el-form-item>
								<el-form-item label='联系地址' prop='address'>
									<el-input size='small' v-model='midefyInfo.address'></el-input>
								</el-form-item>
								<el-form-item label='QQ'>
									<el-input size='small' v-model='midefyInfo.qq'></el-input>
								</el-form-item>
								<el-form-item label='Email'>
									<el-input size='small' v-model='midefyInfo.email'></el-input>
								</el-form-item>
								<el-form-item label='初期欠款' prop='initialArrears'>
									<el-input size='small' v-model='midefyInfo.initialArrears'></el-input>
								</el-form-item>
								<el-form-item label='备注'>
									<el-input size='small' v-model='midefyInfo.memo'></el-input>
								</el-form-item>
							</el-form>
						</div>
						<div style="margin-top:30px;text-align: center">
							<el-button type="primary" plain @click="detaVisible=false">取消</el-button>
							<el-button type="primary" @click="submitForm">确定</el-button>
						</div>
					</div>
				</el-tab-pane>
				<el-tab-pane label="采购记录" name="3">
					<div class="main">
						<el-table height="100%" :data="history">
							<el-table-column label='序号' type='index' width="50px"></el-table-column>
							<el-table-column show-overflow-tooltip label='采购单号'>
								<template slot-scope='scope'><a href="javascript:void(0)">{{scope.row.orderSn}}</a></template>
							</el-table-column>
							<el-table-column show-overflow-tooltip label='采购时间' prop='createTime'>
								<template slot-scope="scope">{{scope.row.createTime|time('y-m-d')}}</template>
							</el-table-column>
							<el-table-column show-overflow-tooltip label='外部单号' prop='outterNo'></el-table-column>
							<el-table-column show-overflow-tooltip label='金额' prop='buyAmountPrice'>
								<template slot-scope="scope">{{(scope.row.buyAmountPrice*(1+parseFloat(scope.row.agentRate)+parseFloat(scope.row.taxRate))).toFixed(2)}}</template>
							</el-table-column>
							<el-table-column show-overflow-tooltip label='数量' prop='purposeAmount'></el-table-column>
						</el-table>
					</div>
				</el-tab-pane>
				<el-tab-pane label="采购统计" name="4">
					<div class="main">
						<div class="main_table">
							<el-table :data='tong' height='100%'>
								<el-table-column type="index" label="序号"></el-table-column>
								<el-table-column label="年份" prop="yearTime" show-overflow-tooltip></el-table-column>
								<el-table-column label="月份" prop="monthTime" show-overflow-tooltip></el-table-column>
								<el-table-column label="数量" prop="num" show-overflow-tooltip></el-table-column>
								<el-table-column label="采购金额(元)" prop="totalPrice" show-overflow-tooltip></el-table-column>
							</el-table>
						</div>
						<div class="main_echart" id="myChart"></div>
					</div>
				</el-tab-pane>
			</el-tabs>
		</el-dialog>
		<!-- 新建供应商 -->
		<newCompany :type='1' ref='newCompany' @cb='refresh'></newCompany>
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
		<!-- 截图框 -->
		<xcropper ref="cropper"></xcropper>
	</div>
</template>

<script>
	import headBackTitle from '@/components/headBackTitle.vue'
	import newCompany from './newCompany'
	import options from '@/components/options.vue'
	import xcropper from "@/components/xcropper"
	import echarts from 'echarts';
	export default {
		components: {
			"ym-hbt": headBackTitle,
			"newCompany": newCompany,
			"options": options,
			"xcropper": xcropper
		},
		data() {
			let checkPhone = (rule, value, callback) => {
				if (!(/^1[3456789]\d{9}$/.test(value))) {
					callback(new Error('请输入正确的手机号'));
				} else {
					callback();
				}
			};
			let checkNumber = (rule, value, callback) => {
				value = value - 0;
				if (value === value && Object.prototype.toString.call(value) === '[object Number]') {
					callback();
				} else {
					callback(new Error('请输入数字'));
				}
			};
			return {
				tabs: '1',
				infoData: {},
				midefyInfo: {},
				rules: {
					companyName: [{
						required: true,
						message: '请输入供应商名称',
						trigger: 'blur'
					}, {
						min: 2,
						max: 10,
						message: '长度在2 - 10 个字符之间',
						trigger: 'blur'
					}],
					address: [{
						required: true,
						message: '请输入地址',
						trigger: 'blur'
					}, {
						min: 2,
						max: 20,
						message: '长度在2 - 20 个字符之间',
						trigger: 'blur'
					}],
					displayName: [{
						required: true,
						message: '请输入联系人名称',
						trigger: 'blur'
					}, {
						min: 2,
						max: 10,
						message: '长度在2 - 10 个字符之间',
						trigger: 'blur'
					}],
					phone: [{
						required: true,
						message: '请输入电话',
						trigger: 'blur'
					}, {
						validator: checkPhone,
						trigger: 'blur'
					}],
					initialArrears: [{
						required: true,
						message: '请输入初期欠款',
						trigger: 'blur'
					}, {
						validator: checkNumber,
						trigger: 'blur'
					}],
					companyType: [{
						required: true,
						message: '请选择公司类型',
						trigger: 'blur'
					}]
				},
				purList: [],
				tongList: [],
				tenantId: JSON.parse(this.$store.state.token).tenantId,
				role: JSON.parse(this.$store.state.role),
				isTable: true,
				isSelect: true,
				detaVisible: false,
				setVisible: false,
				dataList: [],
				pageNum: 1,
				options: {},
				option: {
					dateState: null
				},
				loadmore: false,
				activeName: 'first',
				multipleSelection: [],
				total: 0,
				history: [],
				tong: [],
				optionTime: '',
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
				return JSON.parse(this.$store.state.setJson).selection.SU;
			},
			tableOptions: function() {
				return JSON.parse(this.$store.state.setJson).tableOptions.SU;
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
					contactType: 1,
					pageNum: pageNum,
					pageSize: pageSize,
				};
				params = Object.assign(params, options);
				this.$axios.get('/aps/customerCompany/showOpenEvidencePage', {
						params
					})
					.then(res => {
						if (res.data.data) {
							this.dataList = this.dataList.concat(res.data.data.dataList);
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
					contactType: 1,
				};
				params = Object.assign(params, options);
				this.$axios.get('/aps/customerCompany/showOpenEvidenceList', {
						params
					})
					.then(res => {
						if (res.data && res.data.data) {
							let data = res.data.data;
							let temp = {
								address: [],
								email: [],
							};
							data.forEach((val) => {
								temp.address.push(val.address);
								temp.email.push(val.email);
							});
							temp.address = this.uniq(temp.address);
							temp.email = this.uniq(temp.email);
							this.options = temp;
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
					dateState: null
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
				const loading = this.$loading({
					lock: true,
					text: '数据加载中...',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				this.load(() => {
					loading.close();
					this.getOptions(this.option);
				})
			},
			/**
			 * 搜索框
			 * @method screenBar
			 */
			screenBar() {
				window.clearTimeout(this.timer);
				this.timer = setTimeout(() => {
					this.screen();
				}, 500)
			},
			// 搜素时间
			screenTime() {
				this.option.dateState = null;
				this.$set(this.option, 'dateTime', this.time(this.optionTime[0], 'Y/M/D h/m/s') + ',' + this.time(this.optionTime[1],
					'Y/M/D h/m/s'));
				this.screen();
			},
			/**
			 * 清楚选项
			 * @method removeOption
			 */
			removeOption() {
				this.option = {
					dateState: null,
					dateTime: null
				};
				this.optionTime = null;
				this.screen();
			},
			/**
			 * 打开新建供应商窗口
			 * @method openNew
			 */
			openNew() {
				if (this.role.erp_supplier_new) {
					this.$refs.newCompany.open()
				} else {
					this.$message.error('没有新建供应商权限')
				}
			},
			/**
			 * 更新筛选项字段
			 * @method updataSelections
			 */
			updataSelections(data) {
				let setJson = JSON.parse(this.$store.state.setJson);
				setJson.selection.SU = data;
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
				setJson.tableOptions.SU = data;
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
			/**
			 * 表格选中
			 * @method handleSelectionChange
			 * */
			handleSelectionChange(data) {
				this.multipleSelection = data;
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
					var tHeader = ['供应商', '地址', '联系人', '手机号', 'Email'];
					var filterVal = ['companyName', 'address', 'displayName', 'phone', 'email'];
					var list = this.multipleSelection;
					var data = list.map(v => filterVal.map(j => v[j]));
					export_json_to_excel(tHeader, data, '供应商列表');
				})
			},
			// 删除公司
			openRemove() {
				if (!this.role.erp_supplier_del) return this.$message.error('没有权限');
				this.$confirm('此操作将删除供应商信息, 是否继续?', '提示', {
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
			remove() {
				const loading = this.$loading({
					lock: true,
					text: '删除供应商',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				let arr = this.multipleSelection;
				let data = [];
				arr.forEach((val)=>{
					data.push(val.id);
				})
				this.$axios.post('/aps/customerCompany/delCompany',data)
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						this.refresh();
					}else{
						this.$message.error('删除失败')
					}
				},()=>{loading.colse();this.$message.error('删除失败')})
			},
			/**
			 * 打开供应商
			 * @method openSupplier
			 */
			openSupplier(id) {
				const loading = this.$loading({
					lock: true,
					text: '数据加载中...',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				let params = {
					id: id
				};
				this.$axios.get('/aps/customerCompany/showPartnerContact', {
						params
					})
					.then(res => {
						loading.close();
						if (res.data && res.data.data) {
							this.detaVisible = true;
							this.tabs = '1';
							this.infoData = res.data.data;
							this.midefyInfo = JSON.parse(JSON.stringify(this.infoData));
						} else {
							this.$message.error('获取供应商数据失败')
						}
					}, () => {
						loading.close();
						this.$message.error('获取供应商数据失败');
					})
			},
			/**
			 * 新建采购单
			 * @method seeNewCai
			 */
			seeNewCai() {
				if (!this.role.erp_purchase_new) {
					this.$message.error('没有采购开单权限');
				} else {
					this.$router.push({
						name: 'openPurchase'
					});
				}
			},
			/**
			 * @method handleClick
			 */
			handleClick() {
				if (this.tabs === '3') this.getPur();
				if (this.tabs === '4') this.getTong();
			},
			/**
			 * 表单检验
			 * @method submitForm
			 */
			submitForm() {
				this.$refs.form.validate((val) => {
					if (val) {
						if (this.role.erp_supplier_mod) {
							this.modifySupplier();
						} else {
							this.$message.error('没有修改权限')
						}
					} else {
						this.$message.error('请验证信息是否填写正确');
					}
				})
			},
			/**
			 * 修改供应商
			 * @method modifySupplier
			 */
			modifySupplier() {
				const loading = this.$loading({
					lock: true,
					text: '修改供应商信息',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				let data = this.midefyInfo;
				this.$axios.post('/aps/customerCompany/modifyPartnerCantact', data)
					.then(res => {
						loading.close();
						if (res.data && res.data.data) {
							this.detaVisible = false;
							this.refresh();
						} else {
							this.$message.error('修改供应商信息失败')
						}
					}, () => {
						loading.close();
						this.$message.error('修改供应商信息失败')
					})
			},
			//获取采购记录
			getPur() {
				this.$axios({
					method: 'get',
					url: '/apt/purposeForm/showIssuingPurpose',
					params: {
						issuingId: this.infoData.id,
						type: 1,
					}
				}).then(res => {
					if (res && res.data.data) {
						this.history = res.data.data;
					}
				})
			},
			//采购统计
			getTong() {
				this.$axios({
					method: 'get',
					url: '/apt/purposeForm/showIssuingPurposeSummary',
					params: {
						issuingId: this.infoData.id,
						type: 1,
					}
				}).then(res => {
					if (res && res.data.data) {
						this.tong = res.data.data;
						this.StatisticsData(this.tong);
					}
				})
			},
			//统计图数据
			StatisticsData(data) {
				let xVal = [];
				let yVal = [];
				for (let i in data) {
					xVal.push(data[i].monthTime);
					yVal.push(data[i].num);
				}
				let myChart = echarts.init(document.getElementById('myChart'));
				let option = {
					tooltip: {
						trigger: 'none',
						axisPointer: {
							type: 'cross'
						}
					},
					grid: {
						top: 20,
						bottom: 20
					},
					xAxis: [{
						type: 'category',
						axisTick: {
							alignWithLabel: true
						},
						axisLine: {
							onZero: false,
							lineStyle: {
								color: "#5793f3"
							}
						},
						axisPointer: {
							label: {
								formatter: function(params) {
									return '月份 ' + params.value +
										(params.seriesData.length ? '：' + params.seriesData[0].data : '');
								}
							}
						},
						data: xVal
					}],
					yAxis: [{
						type: 'value'
					}],
					series: [{
						name: '',
						type: 'line',
						smooth: true,
						data: yVal
					}]
				};
				myChart.setOption(option);
			},
			//打开截图框
			openCropper() {
				let option = {
					title: '修改图片',
					msg: '大小不超过2M',
					autoCropWidth: 200,
					autoCropHeight: 200,
					fixedNumber: [1, 1],
				};
				this.$refs.cropper.open(option, (val) => {
					const loading = this.$loading({
						lock: true,
						text: '修改客户信息',
						spinner: 'el-icon-loading',
						background: 'rgba(0, 0, 0, 0.7)'
					});
					let data = {
						id: this.infoData.id,
						tenantId: this.tenantId,
						avatar: val
					};
					this.$axios.post('/aps/customerCompany/modifyPartnerCantact', data)
						.then(res => {
							loading.close();
							if (res.data && res.data.data) {
								this.infoData.avatar = val;
								this.refresh();
							} else {
								this.$message.error('修改头像失败');
							}
						}, () => {
							loading.close();
							this.$message.error('修改头像失败')
						})
				})
			}
		},
		mounted() {
			this.getOptions(this.option);
		}
	}
</script>
<style lang="scss" scoped>
	@import "@/assets/css/jxc/wldw/customer.scss";

	.listModule .card_li .card_li_con {
		padding-bottom: 60%;
	}
</style>
