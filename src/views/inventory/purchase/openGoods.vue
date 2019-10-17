<template lang="html">
	<div class="bill">
		<div class="bill_header">
			<ym-hbt :to='{name:"purchaseHome"}' title='进货开单'></ym-hbt>
		</div>
		<div class="bill_mi">
			<div class="bill_mi_item">
				<el-checkbox v-model="checkTime">时间</el-checkbox>
			</div>
			<div class="bill_mi_item">
				<el-checkbox v-model="checkMemo">备注</el-checkbox>
			</div>
		</div>
		<div class="bill_main">
			<div class="bill_main_top">
				<div class="bill_infos clearfix">
					<div class="bill_info" @click='openContract'>
						<i class="ic iconfont hetong"></i>
						<div class="bill_info_div">{{suCon.contractSn?suCon.contractSn:'选择合同'}}</div>
					</div>
					<div class="bill_info">
						<input class="bill_info_input" v-model='oderNo' type="text" placeholder="请输入提单号">
					</div>
					<div class="bill_info" v-if='suCon.combinedRateText'>
						<i class="ic iconfont icon-chanpin"></i>
						<div class="bill_info_div">{{suCon.supportName}}</div>
					</div>
					<div class="bill_info" v-if='suCon.combinedRateText'>
						<el-select v-model="dailiRate" placeholder="开代理费率">
							<el-option v-for='(val,key) in daili' :key='key' :label="val+'('+key+')'" :value="val"></el-option>
						</el-select>
					</div>
					<div class="bill_info" v-if='checkTime'>
						<i class="ic iconfont riqi"></i>
						<el-date-picker v-model="time" type="date" value-format="timestamp" placeholder="付汇时间" :picker-options="pickerOptions"></el-date-picker>
					</div>
					<div class="bill_info" v-if='checkMemo'>
						<input class="bill_info_input" type="text" v-model='memo' placeholder="备注">
					</div>
				</div>
				<div class="bill_infos clearfix">
					<div class="bill_info" @click='openGoods'>
						<i class="ic iconfont chanpin"></i>
						<div class="bill_info_div">选择产品</div>
					</div>
					<div class="bill_info" @click='openExp'>
						<div class="bill_info_div">Excal导入</div>
					</div>
					<div class="bill_info">
						<el-select v-model="moneyType" placeholder="结算币种">
							<el-option label="人民币" value="人民币"></el-option>
							<el-option label="美元" value="美元"></el-option>
							<el-option label="欧元" value="欧元"></el-option>
						</el-select>
					</div>
					<div class="bill_info">
						<input class="bill_info_input" type="text" placeholder="结算汇率" @change="moneyRate=checkNumber(moneyRate)" v-model='moneyRate'>
					</div>
				</div>
			</div>
			<div class="bill_main_fot" :style="{height:'calc(100% - '+h+'px)'}">
				<div class="bill_table">
					<el-table :data='tableData' height="100%">
						<el-table-column type='index'></el-table-column>
						<el-table-column v-if='crtoryId=="2"' show-overflow-tooltip label='包号' prop='包号'></el-table-column>
						<el-table-column show-overflow-tooltip v-if='val!=="湿度"' v-for='(val,key) in tableConfig' :key='key' :label='val'
						 :prop='val'>
						</el-table-column>
						<el-table-column align='center' show-overflow-tooltip label='单价' prop='price'></el-table-column>
						<el-table-column align='center' label='备注'>
							<template slot-scope='scoped'>
								<el-tooltip v-if="scoped.row.memo" :content='scoped.row.memo' placement='top'><i class="iconfont beizhu"></i></el-tooltip>
							</template>
						</el-table-column>
						<el-table-column label='操作'>
							<template slot-scope='scope'>
								<i class="icon_btn iconfont xiugai" @click="openMidefy(scope.row,scope.$index)"></i>
								<i class="icon_btn iconfont shanchu" @click="removeGoods(scope.$index)"></i>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div style="text-align:right;line-height: 50px;">
					<el-button type="primary" size="small" :disabled='disabled' @click='buildPostObj'>创建进货单</el-button>
				</div>
			</div>
		</div>
		<!-- 选择合同弹窗 -->
		<el-dialog width='900px' title='选择合同' center :visible.sync='contractVisible' v-dialogDrag>
			<div class="table table_style" style='height:400px'>
				<el-table :data='contractList' height='100%' border highlight-current-row @current-change='(val)=>{chCon=val}'
				 v-loading="loading">
					<el-table-column type='index' align='center'></el-table-column>
					<el-table-column label='合同号' prop='contractSn' align='center' show-overflow-tooltip></el-table-column>
					<el-table-column label='日期' prop='createTime' align='center'>
						<template slot-scope='scope'>{{scope.row.createTime|time('y-m-d')}}</template>
					</el-table-column>
					<el-table-column label='供应商' prop='supportName' align='center' show-overflow-tooltip></el-table-column>
					<el-table-column label='采购数量' prop='amount' align='center'></el-table-column>
					<el-table-column label='采购金额' prop='totalPrice' align='center'></el-table-column>
					<el-table-column label='保证金' prop='prepayPrice' align='center'></el-table-column>
				</el-table>
			</div>
			<div style='text-align:center;margin-top:30px;'>
				<el-button type="primary" plain @click='contractVisible=false'>取消</el-button>
				<el-button type="primary" @click='setContract'>确定</el-button>
			</div>
		</el-dialog>
		<!-- 选择产品 -->
		<el-dialog width='800px' title='选择产品' center :visible.sync='goodsVisible' v-dialogDrag>
			<div class="goods_top">
				<div class="dialog_tool">
					<button class="dialog_tool_btn" type="button" @click='addNewGoods'>新建商品</button>
					<div class="dialog_search">
						<i class="iconfont sousuo"></i>
						<input type="text" v-model="searchText" @change="selectGoods" class="search_input_placeholder" placeholder="品牌/等级">
					</div>
					<div class="dialog_items">
						<div class="dialog_item fi">
							<el-select v-model="crtoryId" placeholder="请选择" @change='selectGoods' :disabled='lock'>
								<el-option label="实木板材" value="2"></el-option>
								<el-option label="原木材" value="1"></el-option>
								<el-option label="人造板" value="5"></el-option>
								<el-option label="木配城" value="4"></el-option>
								<el-option label="名贵材" value="3"></el-option>
							</el-select>
						</div>
						<div class="dialog_item" :class="{fi:!!option.tree}">
							<el-select v-model="option.tree" placeholder="树种" clearable @change='selectGoods'>
								<el-option v-for="(val,key) in options.tree" :key='key' :label="val" :value="val"></el-option>
							</el-select>
						</div>
						<div class="dialog_item" :class="{fi:!!option.pai}">
							<el-select v-model="option.pai" placeholder="品牌" clearable @change='selectGoods'>
								<el-option v-for="(val,key) in options.pai" :key='key' :label="val" :value="val"></el-option>
							</el-select>
						</div>
						<div class="dialog_item" :class="{fi:!!option.lv}">
							<el-select v-model="option.lv" placeholder="等级" clearable @change='selectGoods'>
								<el-option v-for="(val,key) in options.lv" :key='key' :label="val" :value="val"></el-option>
							</el-select>
						</div>
						<span style="color:#409EFF;cursor:pointer;" v-if="clearShow" @click="option={};selectGoods()">清除</span>
					</div>
				</div>
			</div>
			<div class="goods_main table_style">
				<el-table :data='goodsList' border height='100%' highlight-current-row @current-change='(val)=>{chGo=val}'
				 v-loading="loading">
					<el-table-column label='品类' prop='pin' align='center'></el-table-column>
					<el-table-column label='树种' prop='tree' align='center'></el-table-column>
					<el-table-column label='品牌' prop='pai' align='center'></el-table-column>
					<el-table-column label='等级' prop='lv' align='center'></el-table-column>
				</el-table>
			</div>
			<div style='margin-top:30px;text-align:center'>
				<el-button type='primary' plain @click='goodsVisible=false'>取消</el-button>
				<el-button type='primary' @click='openDetail'>下一步</el-button>
			</div>
		</el-dialog>
		<!-- 添加商品详情 -->
		<el-dialog width="640px" title='添加详情' center :visible.sync='addVisible' v-dialogDrag>
			<div class="add_main">
				<div class="twoCol">
					<div class="cloumn">
						<label>品类：</label><input type="text" v-model='goods.品类' readonly>
					</div>
					<div class="cloumn">
						<label>树种：</label><input type="text" v-model='goods.树种' readonly>
					</div>
					<div class="cloumn">
						<label>品牌：</label><input type="text" v-model='goods.品牌' readonly>
					</div>
					<div class="cloumn">
						<label>等级：</label><input type="text" v-model='goods.等级' readonly>
					</div>
					<div class="cloumn" v-if='column(val)' v-for='(val,key) in tableConfig' :key='key'>
						<label>{{val}}：</label><input type="text" v-model='goods[val]'>
					</div>
					<div class="cloumn">
						<label>包号：</label><input type="text" v-model='goods.包号'>
					</div>
					<div class="cloumn">
						<label>箱号：</label><input type="text" v-model='goods.boxNo'>
					</div>
					<div class="cloumn" v-if='crtoryId==4'>
						<label>单位：</label>
						<el-select v-model="unti" placeholder="请选择">
							<el-option v-for='item in unitList' :key='item.name' :label="item.name" :value="item.ab"></el-option>
						</el-select>
					</div>
					<div class="cloumn">
						<label>价格：</label><input type="text" v-model='goods.price'>
					</div>
					<div class="cloumn">
						<label>备注：</label><input type="text" v-model='goods.memo'>
					</div>
				</div>
			</div>
			<div style='text-align:center;margin-top:30px'>
				<el-button type='primary' plain @click='addVisible=false'>取消</el-button>
				<el-button type='primary' @click='addGoods'>确定</el-button>
			</div>
		</el-dialog>
		<!-- 导入功能 -->
		<export ref='exp' @cb='getExcalData'></export>
		<!-- 导入结果 -->
		<el-dialog width='670px' title='导入结果' center :visible.sync='resultVisible' v-dialogDrag>
			<div class='result_top'>
				<div class='result_top_item'>
					<span>成功</span>
					<div class='progress'>
						<el-progress :text-inside="true" :stroke-width="15" :percentage="successProgress"></el-progress>
					</div>
					<span class='look' @click='openSuccess'>查看</span>
				</div>
				<div class='result_top_item'>
					<span>失败</span>
					<div class='progress'>
						<el-progress :text-inside="true" :stroke-width="15" :percentage="errorProgress" status="exception"></el-progress>
					</div>
					<span class='look' @click='openError'>查看</span>
				</div>
			</div>
			<div style='text-align:center;margin:10px'>
				<el-button size='small' type='primary' plain @click='resultVisible=false'>取消</el-button>
				<el-button size='small' type='primary' @click='addExcalData'>确定</el-button>
			</div>
			<!-- 成功结果 -->
			<el-dialog width='1100px' title='成功数据' center :visible.sync='successVisible' v-dialogDrag append-to-body>
				<div>
					<el-table :data='success' height='500px'>
						<el-table-column v-for='(val,key) in success[0]' :key='key' :label='key' :prop='key' show-overflow-tooltip></el-table-column>
					</el-table>
				</div>
			</el-dialog>
			<!-- 失败结果 -->
			<el-dialog width='1100px' title='问题数据' center :visible.sync='errorVisible' v-dialogDrag append-to-body>
				<div>
					<el-table :data='error' height='500px'>
						<el-table-column v-for='(val,key) in error[0]' :key='key' :label='key' :prop='key' show-overflow-tooltip></el-table-column>
					</el-table>
				</div>
			</el-dialog>
		</el-dialog>
		<!-- 产品类别 -->
		<ym-fees ref='feestype' @re='getGoodsList'></ym-fees>
		<!-- 修改 -->
		<el-dialog width="640px" title="修改" center :visible.sync="midefyVisible" v-dialogDrag>
			<div class="add_main">
				<div class="twoCol">
					<div class="cloumn" v-for='(val,key) in tableConfig' :key='key'>
						<label>{{val}}：</label><input type="text" v-model='midefyData[val]'>
					</div>
					<div class="cloumn">
						<label>包号：</label><input type="text" v-model='midefyData.包号'>
					</div>
					<div class="cloumn">
						<label>箱号：</label><input type="text" v-model='midefyData.boxNo'>
					</div>
					<div class="cloumn" v-if='crtoryId==4'>
						<label>单位：</label>
						<el-select v-model="unti" placeholder="请选择">
							<el-option v-for='item in unitList' :key='item.name' :label="item.name" :value="item.ab"></el-option>
						</el-select>
					</div>
					<div class="cloumn">
						<label>价格：</label><input type="text" v-model='midefyData.price'>
					</div>
					<div class="cloumn">
						<label>备注：</label><input type="text" v-model='midefyData.memo'>
					</div>
				</div>
			</div>
			<div style="text-align: center;margin-top: 30px">
				<el-button type="primary" plain @click="midefyVisible=false">取消</el-button>
				<el-button type="primary" @click="midefyGoodsItem">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import headBackTitle from '@/components/headBackTitle.vue';
	import feestype from '@/views/inventory/product/feestype.vue';
	import ex from '@/components/export.vue';
	export default {
		components: {
			"ym-hbt": headBackTitle,
			'ym-fees': feestype,
			"export": ex
		},
		data() {
			return {
				h: 0,
				screenWidth: 0,
				oderNo: null,
				goodsList: [],
				addVisible: false,
				goods: {},
				tenantId: JSON.parse(this.$store.state.token).tenantId,
				userId: JSON.parse(this.$store.state.token).id,
				role: JSON.parse(this.$store.state.role),
				checkMemo: true,
				checkTime: true,
				contractVisible: false,
				goodsVisible: false,
				contractList: [],
				chCon: null,
				suCon: '',
				crtoryId: '2',
				lock: false,
				loading: false,
				chGo: null,
				suGo: {},
				tableConfig: [],
				unitList: this.GLOBAL_.unit,
				unti: null,
				tableData: [],
				moneyType: '',
				moneyRate: '',
				dailiRate: '',
				daili: {},
				taxFee: '',
				time: null,
				memo: null,
				resultVisible: false,
				successProgress: 0,
				errorProgress: 0,
				successVisible: false,
				errorVisible: false,
				success: [],
				error: [],
				padDuty: '',
				pickerOptions: {
					disabledDate(time) {
						return time.getTime() < Date.now() - 8.64e7;
					}
				},
				searchText: '',
				midefyVisible: false,
				midefyData: {},
				disabled: false,
				options:{},
				option:{},
			}
		},
		computed:{
			clearShow: function() {
				for (let k in this.option) {
					if (this.option[k] || this.option[k] === 0) {
						return true;
					}
				}
				return false;
			},
		},
		methods: {
			//选择合同
			openContract() {
				const loading = this.$loading({
					lock: true,
					text: 'Loading',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				let params = {
					tenantId: this.tenantId,
					state: 3,
					purposeFormState: 0,
				}
				this.$axios.get('/apt/purposeForm/showPurposeForm', {
						params
					})
					.then(res => {
						loading.close();
						if (res.data && res.data.data) {
							this.contractVisible = true;
							this.contractList = res.data.data;
						} else {
							this.$message.error('获取信息失败')
						}
					}, () => {
						loading.close();
						this.$message.error('获取信息失败')
					})
			},
			// 选中合同
			setContract() {
				if (this.chCon) {
					this.suCon = JSON.parse(JSON.stringify(this.chCon));
					if (!!this.suCon.combinedRateText) {
						let combinedRate = JSON.parse(this.suCon.combinedRateText);
						if (!combinedRate.agentRate) combinedRate.agentRate = 0;
						if (!combinedRate.bankRate) combinedRate.bankRate = 0;
						if (!combinedRate.insureRate) combinedRate.insureRate = 0;
						let daili = {
							'无': 0.000,
							'代理费,银行费': (combinedRate.agentRate * 10000 + combinedRate.bankRate * 10000) / 10000,
							'代理费,银行费,保险费': (combinedRate.agentRate * 10000 + combinedRate.bankRate * 10000 + combinedRate.insureRate *
								10000) / 10000,
						};
						this.daili = daili;
					} else {
						this.dailiRate = 0;
					}
				}
				this.contractVisible = false;
				setTimeout(() => {
					this.h = document.getElementsByClassName('bill_main_top')[0].offsetHeight;
				})
			},
			// 打开选择商品
			openGoods() {
				this.goodsVisible = true;
				this.loading = false;
				this.getGoodsList();
			},
			// 新建商品
			addNewGoods() {
				if (this.role.erp_product_new) {
					this.$refs.feestype.open();
				} else {
					this.$message.error('没有权限')
				}
			},
			// 获取商品列表
			getGoodsList() {
				let params = {
					tenantId: this.tenantId
				};
				this.$axios.get('/api/categoryTable/showCategoryTest', {
						params
					})
					.then(res => {
						if (res.data && res.data.data) {
							let data = res.data.data;
							this.goodsListCopy = [];
							this.recursiveGoodsList(data, 0, {});
							this.selectGoods();
						} else {
							this.goodsList = [];
						}
					})
			},
			// 递归商品
			recursiveGoodsList(data, fool, obj) {
				let index = fool;
				if (index === 0) obj = {};
				let nobj = JSON.parse(JSON.stringify(obj))
				let arr = ['pin', 'tree', 'pai', 'lv'];
				for (let i in data) {
					nobj[arr[index]] = data[i].categoryName;
					if (data[i].children) {
						this.recursiveGoodsList(data[i].children, index + 1, nobj);
					} else {
						if (index === 3) {
							this.goodsListCopy.push(JSON.parse(JSON.stringify(nobj)));
						}
					}
				}
			},
			// 筛选商品
			selectGoods() {
				let crtoryName = '';
				switch (this.crtoryId) {
					case '1':
						crtoryName = '原木材';
						break;
					case '2':
						crtoryName = '实木板材';
						break;
					case '3':
						crtoryName = '名贵材';
						break;
					case '4':
						crtoryName = '木配城';
						break;
					case '5':
						crtoryName = '人造板';
						break;
					default:
						crtoryName = '';
				}
				let data = [];
				for (let i in this.goodsListCopy) {
					if (this.goodsListCopy[i].pin == crtoryName) {
						if (this.goodsListCopy[i].pai.indexOf(this.searchText) !== -1 || this.goodsListCopy[i].lv.indexOf(this.searchText) !== -1) {
							data.push(this.goodsListCopy[i])
						}
					}
				}
				this.screenData(data);
				this.tableConfig = this.GLOBAL_.tableConfig[crtoryName];
			},
			// 生成筛选项
			setOptions(data){
				console.log(data);
				let temp = {
					tree:[],
					pai:[],
					lv:[],
				}
				data.forEach((val)=>{
					temp.tree.push(val.tree);
					temp.pai.push(val.pai);
					temp.lv.push(val.lv);
				})
				temp.tree = this.uniq(temp.tree);
				temp.pai = this.uniq(temp.pai);
				temp.lv = this.uniq(temp.lv);
				this.options=temp;
			},
			// 筛选数据
			screenData(data){
				let arr = [];
				for(let i in this.option){
					for(let n=0;n<data.length;n++){
						if(this.option[i]!==''&&data[n][i]!==this.option[i]){
							data.splice(n,1);
							n--;
						}
					}
				};
				this.goodsList = data;
				this.setOptions(data);
			},
			// 商品详情
			openDetail() {
				if (!this.chGo) return this.$message.error('请选择商品');
				this.suGo = JSON.parse(JSON.stringify(this.chGo));
				this.addVisible = true;
				this.goods = {
					品类: this.suGo.pin,
					树种: this.suGo.tree,
					品牌: this.suGo.pai,
					等级: this.suGo.lv
				}
			},
			// 添加商品
			addGoods() {
				if (!this.checkGoods()) return;
				this.goods.packageNo = this.goods.包号;
				this.goods.catoryName = this.goods.品类;
				this.goods.brandName = this.goods.品牌;
				if (this.crtoryId == 1) {
					this.goods.unti = 'G';
					this.goods.amount = this.goods.根数;
				} else if (this.crtoryId == 2) {
					this.goods.unti = 'm³';
					this.goods.amount = this.goods.立方数;
				} else if (this.crtoryId == 3) {
					this.goods.unti = 'T';
					this.goods.amount = this.goods.数量;
				} else if (this.crtoryId == 5) {
					this.goods.unti = 'P';
					this.goods.amount = this.goods.数量;
				} else if (this.crtoryId == 4) {
					this.goods.unti = this.unti;
					this.goods.amount = this.goods.数量;
				}
				this.tableData.push(this.goods);
				this.lock = true;
				this.addVisible = false;
				this.goodsVisible = false;
			},
			// 检查商品属性是否填写
			checkGoods() {
				for (let i in this.tableConfig) {
					if (this.tableConfig[i] === '湿度') continue;
					if (!this.goods[this.tableConfig[i]]) {
						this.$message('请输入' + this.tableConfig[i]);
						return false
					}
				}
				if (this.crtoryId == 4 && !this.unti) {
					this.$message('请选择单位');
					return false
				}
				if (!this.goods.price) {
					this.$message('请选择价格');
					return false
				}
				return true;
			},
			// 删除商品
			removeGoods(index) {
				this.tableData.splice(index, 1);
				if (this.tableData.length == 0) this.lock = false;
				this.$message.success('删除商品成功')
			},
			// 打开修改商品
			openMidefy(data, index) {
				this.midefyVisible = true;
				this.midefyData = { ...data };
				this.index = index;
			},
			// 修改商品
			midefyGoodsItem() {
				this.tableData.splice(this.index, 1, this.midefyData);
				this.midefyVisible = false;
			},
			column(data) {
				if (data === '品类' || data === '树种' || data === '品牌' || data === '等级') return false;
				return true;
			},
			// 打开导入窗口
			openExp() {
				this.$refs.exp.open();
			},
			// 接受导入数据
			getExcalData(data, name) {
				let success = [];
				let error = [];
				data.forEach((val)=>{
					if(val.品类===name&&val.树种&&val.品牌&&val.等级){
						switch (name){
							case "实木板材":
								if(!!val.包号&&!!val.厚度&&!!val.宽度&&!!val.长度&&!!val.片数&&typeof val.立方数==="number"&&typeof val.成本单价==="number"&&!!val.柜号){
									success.push(val)
								}else{
									error.push(val);
								};
								break;
							case "原木材":
								if(!!val.口径&&!!val.长度&&!!val.立方数&&typeof val.根数==="number"&&typeof val.成本单价==="number"&&!!val.柜号){
									success.push(val)
								}else{
									error.push(val)
								};
								break;
							case "名贵材":
								if(!!val.形态&&!!val.厚度&&!!val.宽度&&!!val.长度&&typeof val.数量==="number"&&typeof val.成本单价==="number"&&!!val.柜号){
									success.push(val)
								}else{
									error.push(val)
								};
								break;
							case "木配城":
								if(!!val.产品&&!!val.厚度&&!!val.宽度&&!!val.长度&&!!val.单位&&typeof val.数量==="number"&&typeof val.成本单价==="number"&&!!val.柜号){
									success.push(val);
								}else{
									error.push(val);
								};
								break;
							case "人造板":
								if(!!val.产品&&!!val.厚度&&!!val.规格&&typeof val.数量==="number"&&typeof val.成本单价==="number"&&!!val.柜号){
									success.push(val)
								}else{
									error.push(val)
								};
								break;
						}
					}else{
						error.push(val)
					}
				})
				this.success = success;
				this.error = error;
				this.successProgress = (success.length / data.length * 100).toFixed(2) - 0;
				this.errorProgress = (error.length / data.length * 100).toFixed(2) - 0;
				this.resultVisible = true;
			},
			// 打开成功结果
			openSuccess() {
				this.successVisible = true;
			},
			// 打开错误结果
			openError() {
				this.errorVisible = true;
			},
			// 添加数据
			addExcalData() {
				let data = this.success;
				if (data.length == 0) return this.$message.error('没有数据');
				let crtoryId = '';
				switch (data[0].品类) {
					case '实木板材':
						crtoryId = '2';
						break;
					case '原木材':
						crtoryId = '1';
						break;
					case '木配城':
						crtoryId = '4';
						break;
					case '人造板':
						crtoryId = '5';
						break;
					case '名贵材':
						crtoryId = '3';
						break;
					default:
						crtoryId = '';
				}
				if (this.lock && this.crtoryId != crtoryId) {
					this.$message.error('类目不一致，无法添加。');
					return;
				}
				this.tableConfig = this.GLOBAL_.tableConfig[data[0].品类];
				for (let i in data) {
					data[i].packageNo = 'BN'+ parseInt(Math.random()*100000);
					data[i].catoryName = data[i].品类;
					data[i].brandName = data[i].品牌;
					data[i].price = data[i].成本单价;
					data[i].memo = data[i].备注;
					data[i].boxNo = data[i].柜号;
					if (crtoryId == 1) {
						data[i].unti = 'G'
						data[i].amount = data[i].根数;
					} else if (crtoryId == 2) {
						data[i].unti = 'm³'
						data[i].amount = data[i].立方数;
						data[i].packageNo = data[i].包号;
					} else if (crtoryId == 3) {
						data[i].unti = 'T'
						data[i].amount = data[i].数量;
					} else if (crtoryId == 5) {
						data[i].unti = 'P'
						data[i].amount = data[i].数量;
					} else if (crtoryId == 4) {
						data[i].unti = data[i].单位;
						data[i].amount = data[i].数量;
					}
					this.tableData.push(data[i]);
				}
				this.crtoryId = crtoryId;
				this.lock = true;
				this.resultVisible = false;
				this.$refs.exp.close();
			},
			//创建订单
			buildPostObj() {
				if (!this.role.erp_stock_new) return this.$message.error('没有权限');
				if (!this.suCon) return this.$message.error('请选择合同单');
				if (!this.oderNo) return this.$message.error('请输入提单号');
				if (this.suCon.combinedRateText && !this.dailiRate) return this.$message.error('请选择代理费');
				if (!this.time) return this.$message.error('请选择付汇时间');
				if (!this.moneyType) return this.$message.error('请选择币种');
				if (!this.moneyRate) return this.$message.error('请输入汇率');
				if (this.tableData.length === 0) return this.$message.error('请选择产品');
				this.disabled = true;
				//获取包ID
				let arr = [];
				if (this.crtoryId == 1) {
					//需要拆包
					for (let i in this.tableData) {
						let attributeValue = [];
						for (let n in this.tableConfig) {
							if (this.tableConfig[n] == '根数') {
								attributeValue.push(this.tableConfig[n] + ':1')
							} else {
								if (this.tableData[i][this.tableConfig[n]] || this.tableData[i][this.tableConfig[n]] === 0) {
									attributeValue.push(this.tableConfig[n] + ':' + this.tableData[i][this.tableConfig[n]])
								}
							}
						}
						let obj = {
							amount: 1,
							attributeValue: attributeValue,
							orderSn: this.oderNo,
							price: this.tableData[i].price,  // 换算前
							oldPrice: this.tableData[i].price* this.moneyRate, // 换算后
							state: 1,
							tenantId: this.tenantId,
							boxNo: this.tableData[i].boxNo,
							packageNo: this.tableData[i].packageNo,
							catoryId: this.crtoryId,
							catoryName: this.tableData[i].catoryName,
							brandName: this.tableData[i].brandName,
							memo: this.tableData[i].memo,
							unti: this.tableData[i].unti,
							issuingId:this.suCon.issuingId,
						};
						for (let x = 0; x < this.tableData[i].amount; x++) {
							arr.push(obj)
						}
					}
				} else {
					//不拆包
					for (let i in this.tableData) {
						let attributeValue = [];
						for (let n in this.tableConfig) {
							if (this.tableData[i][this.tableConfig[n]] || this.tableData[i][this.tableConfig[n]] === 0) {
								attributeValue.push(this.tableConfig[n] + ':' + this.tableData[i][this.tableConfig[n]])
							}
						}
						let obj = {
							amount: this.tableData[i].amount,
							attributeValue: attributeValue,
							orderSn: this.oderNo,
							price: this.tableData[i].price, // 换算前
							oldPrice: this.tableData[i].price* this.moneyRate, // 换算后
							state: 1,
							tenantId: this.tenantId,
							boxNo: this.tableData[i].boxNo,
							packageNo: this.tableData[i].packageNo,
							catoryId: this.crtoryId,
							catoryName: this.tableData[i].catoryName,
							brandName: this.tableData[i].brandName,
							memo: this.tableData[i].memo,
							unti: this.tableData[i].unti,
							issuingId:this.suCon.issuingId,
						};
						arr.push(obj)
					}
				}
				this.getBaoId(arr);
			},
			getBaoId(arr) {
				const loading = this.$loading({
					lock: true,
					text: 'Loading',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				this.$axios({
					method: 'post',
					url: '/api/storeInForm/purposeImportExcel',
					data: {
						categoryId: this.crtoryId,
						creatorId: this.userId,
						packageImportDtoList: arr,
						tenantId: this.tenantId,
					}
				}).then(res => {
					loading.close();
					if (res && res.data.data) {
						this.createData(res.data.data)
					} else {
						this.$message.error('创建采购单失败');
						this.disabled = false;
					}
				}, () => {
					loading.close();
					this.$message.error('创建采购单失败');
					this.disabled = false;
				})
			},
			createData(arr) {
				const loading = this.$loading({
					lock: true,
					text: 'Loading',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				let aa = [];
				let sumPrice = 0;
				let sumOldPrice = 0;
				let sum = 0;
				let boxArr = [];
				for (let i in arr) {
					let obj = {
						boxNo: arr[i].boxNo,
						moneyPrice: arr[i].price,
						buyPrice: arr[i].oldPrice,
						creatorId: this.userId,
						memo: arr[i].memo,
						moneyRate: this.moneyRate,
						moneyType: this.moneyType,
						packageId: arr[i].packageId,
						taxFee: 0,
						taxed: 0,
						unit: arr[i].unti,
						agentFee: arr[i].oldPrice * this.dailiRate,
						fullPrice: arr[i].oldPrice * (parseFloat(this.dailiRate) + 1),
					}
					boxArr.push(arr[i].boxNo);
					sumPrice += arr[i].oldPrice * arr[i].amount;
					sumOldPrice += arr[i].price * arr[i].amount;
					sum += parseFloat(arr[i].amount);
					aa.push(obj);
				}
				boxArr = this.uniq(boxArr);
				this.$axios({
					method: 'post',
					url: '/apt/purposeForm/addToPurposeFormInfo',
					data: {
						clearanceId: 0,
						purposeFormDetailList: aa,
						tenantId: this.tenantId,
						contractId: this.suCon.id,
						supportId: this.suCon.supportId,
						issuingId: this.suCon.issuingId,
						bankRate: 0,
						agentRate: this.dailiRate,
						outterNo: this.oderNo,
						moneyType: this.moneyType,
						moneyRate: this.moneyRate,
						taxRate: 0,
						moneyAmountPrice: sumOldPrice,
						buyAmountPrice: sumPrice,
						buyPackageNum: aa.length,
						purposeAmount: sum,
						bond: this.suCon.prepayPrice,
						bondPayment: this.suCon.prepayPrice,
						buyBoxNum: boxArr.length,
						rateTime: this.time,
						taxed: 0,
						thcPrice: 0,
						memo: this.memo,
						state: 1,
						creatorId: this.userId,
						vatAmount: 0,
						approveState: 1,
					}
				}).then(res => {
					loading.close();
					if (res && res.data.data) {
						this.$router.push({
							name: 'goodsDeta',
							query: {
								backUrl: 'openGoods',
								id: res.data.data
							}
						});
					} else {
						this.$message.error('创建采购单失败');
						this.disabled = false;
					}
				}, () => {
					loading.close();
					this.$message.error('创建采购单失败');
					this.disabled = false;
				})
			},
			// 数字验证
			checkNumber(data){
			  if(data==='') return '';
			  if(parseFloat(data)){
			    return parseFloat(data).toFixed(3);
			  }else{
			    return '';
			  }
			},
		},
		mounted() {
			this.screenWidth = document.body.offsetWidth;
			window.onresize = () => {
				this.screenWidth = document.body.offsetWidth;
			}
		},
		watch: {
			screenWidth: function() {
				this.h = document.getElementsByClassName('bill_main_top')[0].offsetHeight;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.dialog_tool .dialog_items {
		margin-right: 350px;
	}

	.goods_top {
		height: 50px;
	}

	.goods_main {
		height: 400px;
	}

	.result_top {
		margin: 20px 50px 50px;

		.result_top_item {
			margin-bottom: 20px;

			.progress {
				display: inline-block;
				width: 400px;
				margin: 0 20px;
			}

			.look {
				cursor: pointer;

				&:hover {
					color: rgb(70, 182, 246);
				}
			}
		}
	}
</style>
