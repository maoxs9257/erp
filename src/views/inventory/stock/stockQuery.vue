<template>
	<div class="listModule">
		<div class="list_header">
			<v-head title="库存查询" :to="{name:'stockHome'}"></v-head>
		</div>
		<div class="list_setbar">
			<div class="list_setbar_options">
				<div v-if="multipleSelection.length==0" class="option" @click="categoryChange">
					<div class="option_yuan"><i class="iconfont shuaxin"></i></div>
					<span class="option_txt">刷新</span>
				</div>
				<div v-if="multipleSelection.length==0" class="option">
					<div class="option_yuan">
						<i class="iconfont zaikukucun" v-if="state==0"></i>
						<i class="iconfont yishou" v-if="state==3"></i>
					</div>
					<div class="option_select">
						<el-select v-model="state" placeholder="状态" @change="categoryChange">
							<el-option label="在库库存" value="0"></el-option>
							<el-option label="已售商品" value="3"></el-option>
						</el-select>
					</div>
				</div>
				<div v-if="multipleSelection.length==0" class="option">
					<div class="option_yuan">
						<i class="iconfont shimu" v-if="categoryId==2"></i>
						<i class="iconfont mupeicheng" v-if="categoryId==4"></i>
						<i class="iconfont mingguicai" v-if="categoryId==3"></i>
						<i class="iconfont yuanmu" v-if="categoryId==1"></i>
						<i class="iconfont renzaoban" v-if="categoryId==5"></i>
					</div>
					<div class="option_select">
						<el-select v-model="categoryId" placeholder="品类" @change="categoryChange">
							<el-option label="实木板材" value="2"></el-option>
							<el-option label="原木材" value="1"></el-option>
							<el-option label="人造板" value="5"></el-option>
							<el-option label="木配城" value="4"></el-option>
							<el-option label="名贵材" value="3"></el-option>
						</el-select>
					</div>
				</div>
				<div v-if="multipleSelection.length==0" class="option" @click="isSelect = !isSelect">
					<div class="option_yuan"><i class="iconfont shaixuan"></i></div>
					<span class="option_txt">筛选</span>
				</div>
				<div v-if="multipleSelection.length==0&&!switchValue" class="option" @click="exportExcelAll">
					<div class="option_yuan"><i class="iconfont daochu"></i></div>
					<span class="option_txt">全部导出</span>
				</div>
				<div v-if="multipleSelection.length==0&&switchValue" class="option" @click="exportExcelAll1">
					<div class="option_yuan"><i class="iconfont daochu"></i></div>
					<span class="option_txt">全部导出</span>
				</div>
				<div v-if="multipleSelection.length==0" class="option" @click='setVisible=true'>
					<div class="option_yuan"><i class="iconfont cebian-shezhi"></i></div>
					<span class="option_txt">设置</span>
				</div>
				<div v-if="multipleSelection.length>0" class="option" @click="exportExcel">
					<div class="option_yuan"><i class="iconfont daochu"></i></div>
					<span class="option_txt">导出</span>
				</div>
				<div v-if="multipleSelection.length>0" class="option" @click="openPrice">
					<div class="option_yuan"><i class="iconfont daochu"></i></div>
					<span class="option_txt">批量修改价格</span>
				</div>
				<div class="option">
					<el-switch v-model="switchValue" @change="switchChange"></el-switch>
					库存汇总
				</div>
				<div class="search_input" v-if="!switchValue">
				  <i class="iconfont sousuo"></i>
				  <input type="text" v-model="option1.likeName" @change="screenBar" class="search_input_placeholder" placeholder="包号/柜号/合同号/提单号">
				</div>
			</div>
			<div class="list_setbar_selections" v-if="switchValue">
				<div class="selection" :class="{now:option[selections[0].key]}">
					<el-select v-model="option[selections[0].key]" :placeholder="selections[0].name" clearable @change="screenData">
						<el-option v-for="(v,k) in options[selections[0].key]" :label="warestoreName[v]" :value="v" :key="k"></el-option>
					</el-select>
				</div>
				<div class="selection" v-if="val.show&&key!=0" v-for="(val,key) in selections" :key="key" :class="{now:option[val.key]}">
					<el-select v-model="option[val.key]" :placeholder="val.name" clearable @change="screenData">
						<el-option v-for="(v,k) in options[val.key]" :label="v" :value="v" :key="k"></el-option>
					</el-select>
				</div>
				<span class="clear" v-if='clearShow' @click='removeOption'>清除</span>
			</div>
			<div class="list_setbar_selections" v-if="!switchValue">
				<div class="selection" v-if="val.show" v-for="(val,key) in selections" :key="key" :class="{now:attribute[val.key]}">
					<el-select v-model="attribute[val.key]" :placeholder="val.name" clearable @change='screen'>
						<el-option v-for="(v,k) in options1[val.key]" :label="v" :value="v" :key="k"></el-option>
					</el-select>
				</div>
				<span class="clear" v-if="clearShow1" @click="removeAttribute">清楚</span>
			</div>
		</div>
		<div class="list_main" :class="{se:isSelect}">
			<div class="list_main_table" v-if="switchValue">
				<div class="table">
					<el-table :data="dataList" height="100%" @selection-change="handleSelectionChange">
						<el-table-column type="selection"></el-table-column>
						<el-table-column label="仓库名" show-overflow-tooltip prop="storeName"></el-table-column>
						<el-table-column v-if="tableShow[val]" v-for="(val,key) in tableConfig" :key="key" :label="val" :prop="val"
						 show-overflow-tooltip align="center"></el-table-column>
						<el-table-column fixed="right" label="库存件数" show-overflow-tooltip align="center">
							<template slot-scope='scope'>
								<a href="javascript:void(0)" @click="openStock(scope.row)">{{scope.row.packageNum}}</a>
							</template>
						</el-table-column>
						<el-table-column fixed="right" label="可售件数" prop="packageNums" show-overflow-tooltip align="center"></el-table-column>
						<el-table-column fixed="right" label="参考价">
							<template slot-scope="scope"><a href="javascript:void(0)" @click="openModifyPrice(scope.row)">{{scope.row.price}}</a></template>
						</el-table-column>
					</el-table>
				</div>
				<div class="table_fot">
					<span>总数：{{dataList.length}}</span>
				</div>
			</div>
			<div class="list_main_table" v-if="!switchValue">
				<div class="table">
					<el-table :data="dataList" height="100%" @selection-change="handleSelectionChange" v-loadMethod='load' modname='.el-table__body-wrapper'
					 loadmore='loadmore'>
						<el-table-column type="selection"></el-table-column>
						<el-table-column v-if="tableShow.包号" show-overflow-tooltip label="包号" prop="packageNo"></el-table-column>
						<el-table-column v-if="tableShow.柜号" show-overflow-tooltip label="柜号" prop="boxNo"></el-table-column>
						<el-table-column v-if="tableShow.合同号" show-overflow-tooltip label="合同号" prop="purposeFormId"></el-table-column>
						<el-table-column v-if="tableShow.提单号" show-overflow-tooltip label="提单号" prop="outterNo"></el-table-column>
						<el-table-column v-if="tableShow.仓库名称" show-overflow-tooltip label="仓库名称" prop="warestoreName"></el-table-column>
						<el-table-column v-if="tableShow[val]" show-overflow-tooltip v-for="(val,key) in tableConfig" :label="val" :prop="val" :key='key'></el-table-column>
						<el-table-column v-if="tableShow.开证公司" show-overflow-tooltip label="开证公司" prop="issuingName"></el-table-column>
						<el-table-column v-if="tableShow.入库时间" show-overflow-tooltip label="入库时间">
							<template slot-scope="scope">{{scope.row.storeInTime|time('y-m-d')}}</template>
						</el-table-column>
						<el-table-column label="库龄">
							<template slot-scope="scope">{{scope.row.storeInTime|inDays}}</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="table_fot">
					<span>总数：{{total}}</span>
				</div>
			</div>
		</div>
		<!-- 库存详细 -->
		<el-dialog width="900px" v-dialogDrag :visible.sync="isPersonneShow" center title="库存详情">
			<div class="details-a">
				<div class="dialogTop">
					<span class="one">现货库存</span>
					<div class="topmi">
						<span>{{detailTitle.品类}}</span>-
						<span>{{detailTitle.树种}}</span>-
						<span>{{detailTitle.品牌}}</span>-
						<span v-if="categoryId==='2'">{{detailTitle.长度}}*{{detailTitle.宽度}}*{{detailTitle.厚度}}</span>
						<span v-if="categoryId==='1'">{{detailTitle.直径}}</span>-
						<span>{{detailTitle.片数}}</span>
					</div>
					<span style="margin-left: 563px">库存件数:{{detailTitle.packageNum}}</span>
					<span>可用件数:{{detailTitle.packageNums}}</span>
				</div>
				<div class="dialogFot">
					<el-table :data="detailData" height="100%">
						<el-table-column label="序号" type="index" align="center"></el-table-column>
						<el-table-column label="包号" prop="packageNo" show-overflow-tooltip></el-table-column>
						<el-table-column label="柜号" prop="boxNo" show-overflow-tooltip></el-table-column>
						<el-table-column label="合同号" prop="contractSn" show-overflow-tooltip></el-table-column>
						<el-table-column label="提单号" prop="orderSn" show-overflow-tooltip></el-table-column>
						<el-table-column label="产地" prop="产地"></el-table-column>
						<el-table-column label="入库时间" show-overflow-tooltip>
							<template slot-scope="scope">{{scope.row.storeInTime|time('y-m-d')}}</template>
						</el-table-column>
						<el-table-column label="库龄" prop="storageTime" show-overflow-tooltip></el-table-column>
						<el-table-column label="实时成本" prop="buyPrice" show-overflow-tooltip></el-table-column>
						<el-table-column label="备注" show-overflow-tooltip>
							<template slot-scope="scope">
								<el-tooltip class="item" effect="dark" :content="scope.row.memo" placement="top">
									<i class="iconfont icon-weiwancheng"></i>
								</el-tooltip>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</div>
		</el-dialog>
		<!-- 修改参考价格 -->
		<el-dialog width="530px" title="修改参考价格" center :visible.sync="priceVisible" v-dialogDrag>
			<div class="prices">
				<el-form size="mini" label-width="90px" inline>
					<el-form-item v-for="(val,key) in tableConfig" :key="key" :label="val+'：'">
						<div style="width: 130px">{{priceData[val]}}</div>
					</el-form-item>
					<el-form-item label="仓库名：">
						<div style="width:130px">{{priceData.storeName}}</div>
					</el-form-item>
					<el-form-item label="参考价格：">
						<el-input-number v-model="priceData.price" :min="0"></el-input-number>
					</el-form-item>
				</el-form>
			</div>
			<div style="margin-top: 30px;text-align: center">
				<el-button type="primary" plain @click="priceVisible=false">取消</el-button>
				<el-button type="primary" @click="surePrice">确定</el-button>
			</div>
		</el-dialog>
		<!-- 设置 -->
		<el-dialog title='设置' center :visible.sync='setVisible' width='800px' v-dialogDrag>
			<div>
				<el-tabs v-model="activeName">
					<el-tab-pane label="表格字段" name="first">
						<options v-if="setVisible" :data='tableOptions' @cb='updataTableOptions' @close='setVisible=false'></options>
					</el-tab-pane>
					<el-tab-pane label="筛选字段" name="second">
						<options v-if="setVisible" :data='selections' @cb='updataSelections' @close='setVisible=false'></options>
					</el-tab-pane>
				</el-tabs>
			</div>
		</el-dialog>
		<!-- 批量修改 -->
		<el-dialog width="400px" title="批量修改参考价格" center :visible.sync="allPriceVisible" v-dialogDrag>
			<div style="padding: 0 60px">
				<el-form>
					<el-form-item label="参考价：">
						<el-input-number size="mini" class="input-number input__inner" v-model="allPrice"></el-input-number>
					</el-form-item>
				</el-form>
			</div>
			<div style="margin-top:30px;text-align:center">
				<el-button type="primary" plain @click="allPriceVisible=false">取消</el-button>
				<el-button type="primary" @click="sureAllPrice">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<style lang="scss" scoped>
	/*现货库存弹窗*/
	.details-a {
		.dialogTop {
			height: 50px;
			position: relative;
			span {
				padding: 0 3px;
				height: 30px;
				line-height: 50px;
				margin: 0 10px;
			}
			span.one {
				border: 1px solid #00A0E9;
				color: #00A0E9;
				-webkit-border-radius: 3px;
				-moz-border-radius: 3px;
				border-radius: 3px;
			}
			.topmi {
				position: absolute;
				top: 0;
				left: 100px;
				right: 200px;
				height: 50px;
			}
		}
		.dialogFot {
			height: 445px;
		}
	}
</style>

<script>
	import head from "@/components/headBackTitle.vue"
	import options from '@/components/options.vue'
	export default {
		data() {
			return {
				isPersonneShow: false,
				categoryList: [],
				categoryKey: 0,
				multipleSelection: [],
				detailData: [],
				detailTitle: {},
				userId: JSON.parse(this.$store.state.token).id,
				tenantId: JSON.parse(this.$store.state.token).tenantId,
				setId: this.$store.state.id,
				isSelect: false,
				state: '0',
				categoryId: '2',
				dataList: [],
				priceVisible: false,
				priceData: {},
				setVisible: false,
				activeName: 'first',
				options: {},
				option: {},
				metaData: [],
				allPriceVisible: false,
				allPrice: 0,
				warestoreName:{},
				switchValue:true,
				pageNum:1,
				option1:{attribute:'品类:实木板材'},
				loadmore:false,
				total:0,
				options1:{},
				attribute:{},
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
			clearShow1:function(){
				for (let k in this.attribute) {
					if (this.attribute[k] || this.attribute[k] === 0) {
						return true;
					}
				}
				return false;
			},
			selections: function() {
				if(this.switchValue){
					return JSON.parse(this.$store.state.setJson).selection.SQ[this.categoryId];
				}else{
					return JSON.parse(this.$store.state.setJson).selection.SQT[this.categoryId];
				}
			},
			tableOptions:function(){
				if(this.switchValue){
					return JSON.parse(this.$store.state.setJson).tableOptions.SQ[this.categoryId];
				}else{
					return JSON.parse(this.$store.state.setJson).tableOptions.SQT[this.categoryId];
				}
			},
			tableConfig:function(){
				let tableConfig = [];
				switch (this.categoryId) {
					case '1':
						tableConfig = this.GLOBAL_.tableConfig['原木材'];
						break;
					case '2':
						tableConfig = this.GLOBAL_.tableConfig['实木板材'];
						break;
					case '3':
						tableConfig = this.GLOBAL_.tableConfig['名贵材'];
						break;
					case '4':
						tableConfig = this.GLOBAL_.tableConfig['木配城'];
						break;
					case '5':
						tableConfig = this.GLOBAL_.tableConfig['人造板'];
						break;
					default:
						tableConfig = [];
				}
				return tableConfig;
			},
		},
		mounted() {
			if(this.switchValue) this.getData();
		},
		methods: {
			/**
			 * 获取数据  聚合
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
					tenantId: this.tenantId,
					catoryId: this.categoryId,
					state: this.state === "0" ? "" : this.state
				};
				this.$axios.get('/api/storePackage/showStroePackageQuery', {
						params
					})
					.then(res => {
						loading.close();
						if (res.data && res.data.data) {
							let data = res.data.data;
							for (let i in data) {
								let arr = data[i].attibuteValue.split(',');
								for (let n in arr) {
									if (arr[n] !== '') {
										data[i][arr[n].split(':')[0]] = arr[n].split(':')[1]
									}
								}
							}
							this.metaData = data;
						} else {
							this.metaData = [];
							this.$message.error('获取数据失败');
						}
						this.screenData();
					}, () => {
						loading.close();
						this.$message.error('获取数据失败')
					})
			},
			// 类目筛选
			setOptions() {
				let data = this.dataList;
				let obj = {};
				for (let i in this.tableConfig) {
					let configName = this.tableConfig[i];
					if (configName == '品类' || configName == '水份' || configName == '立方数' || configName == '根数'||configName=='产地') continue;
					obj[configName] = [];
					for (let n in data) {
						if (data[n][configName] || data[n][configName] == 0) {
							obj[configName].push(data[n][configName])
						}
					}
					obj[configName] = this.uniq(obj[configName])
				}
				obj.warestoreId = [];
				let warestoreName = {};
				for(let i in data){
					obj.warestoreId.push(data[i].warestoreId);
					warestoreName[data[i].warestoreId] = data[i].storeName
				}
				obj.warestoreId = this.uniq(obj.warestoreId);
				this.options = obj;
				this.warestoreName = warestoreName;
			},
			// 数据筛选
			screenData() {
				let data = [...this.metaData];
				for (let i in this.option) {
					if (!this.option[i]) break;
					for (let n = 0; n < data.length; n++) {
						if (data[n][i]+''!==this.option[i]) {
							data.splice(n, 1);
							n--;
						}
					}
				}
				this.dataList = data;
				this.setOptions();
			},
			// 获取数据  未聚合
			getData2(pageNum,pageSize,options,callback){
				const loading = this.$loading({
					lock: true,
					text: '数据加载中...',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				let params = {
					tenantId: this.tenantId,
					pageNum: pageNum,
					pageSize: pageSize,
					state: this.state === "0" ? "" : this.state
				};
				params = Object.assign(params,options);
				this.$axios.get('/api/storePackage/showWarehouseInventoryPackages',{params})
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						let data = res.data.data.dataList;
						for (let i in data) {
							let arr = data[i].attributeValue.split(',');
							for (let n in arr) {
								if (arr[n] !== '') {
									data[i][arr[n].split(':')[0]] = arr[n].split(':')[1]
								}
							}
						}
						this.dataList = this.dataList.concat(data);
						this.total = res.data.data.total;
					}
					callback?callback(res.data.data):null;
				},()=>{loading.close();callback?callback(res.data.data):null})
			},
			// 获取筛选数据 未聚合
			getOptions(options){
				let params = {
					tenantId:this.tenantId,
					state: this.state === "0" ? "" : this.state
				}
				params = Object.assign(params,options);
				this.$axios.get('/api/storePackage/showWarehouseInventoryPackages',{params})
				.then(res=>{
					if(res.data&&res.data.data){
						let data = res.data.data;
						data.forEach((val)=>{
							let arr = val.attributeValue.split(',');
							for(let i in arr){
								val[arr[i].split(":")[0]]=arr[i].split(":")[1];
							}
						})
						let obj = {};
						for(let i in this.tableConfig){
							let configName = this.tableConfig[i];
							if (configName == '品类' || configName == '水份' || configName == '立方数' || configName == '根数'||configName=='产地') continue;
							obj[configName] = [];
							data.forEach((val)=>{
								obj[configName].push(val[configName]);
							})
							obj[configName] = this.uniq(obj[configName])
						}
						console.log(obj);
						this.options1 = obj;
					}
				})
			},
			// 无限加载
			load(callback){
				if(this.categoryId==='1') this.option1.attribute="品类:原木材";
				if(this.categoryId==='2') this.option1.attribute="品类:实木板材"; 
				if(this.categoryId==='3') this.option1.attribute="品类:名贵材"; 
				if(this.categoryId==='4') this.option1.attribute="品类:木配城"; 
				if(this.categoryId==='5') this.option1.attribute="品类:人造板"; 
				for(let i in this.attribute){
					this.option1.attribute += ','+i+':'+this.attribute[i];
				}
				this.getData2(this.pageNum++,30,this.option1,(data)=>{
					callback();
					this.loadmore = data.pages>data.pageNo;
				})
			},
			// 搜素框
			screenBar(){
				this.screen();
			},
			screen(){
				this.dataList = [];
				this.pageNum=1;
				console.log(this.attribute);
				for(let i in this.attribute){
					this.option1.attribute += ','+i+':'+this.attribute[i];
				}
				this.getData2(this.pageNum++,30,this.option1,(data)=>{
					this.getOptions(this.option1);
					this.loadmore = data.pages>data.pageNo;
				})
			},
			// 清楚选项
			removeAttribute(){
				this.attribute = {};
				this.refresh();
			},
			// 刷新
			refresh(){
				this.dataList = [];
				this.pageNum = 1;
				if(this.categoryId==='1') this.option1 = {attribute:"品类:原木材"}; 
				if(this.categoryId==='2') this.option1 = {attribute:"品类:实木板材"}; 
				if(this.categoryId==='3') this.option1 = {attribute:"品类:名贵材"}; 
				if(this.categoryId==='4') this.option1 = {attribute:"品类:木配城"}; 
				if(this.categoryId==='5') this.option1 = {attribute:"品类:人造板"}; 
				this.getData2(this.pageNum++, 30, this.option1, (data) => {
					if (data) {
						this.getOptions(this.option1);
						this.loadmore = data.pages > data.pageNo;
						this.$message.success('刷新完成')
					} else {
						this.$message.error('刷新失败')
					}
				})
			},
			// 开关状态改变
			switchChange(val){
				if(val){
					this.dataList = [];
					this.getData();
				}else{
					this.dataList = [];
					this.pageNum = 1;
					if(this.categoryId==='1') this.option1 = {attribute:"品类:原木材"};
					if(this.categoryId==='2') this.option1 = {attribute:"品类:实木板材"}; 
					if(this.categoryId==='3') this.option1 = {attribute:"品类:名贵材"}; 
					if(this.categoryId==='4') this.option1 = {attribute:"品类:木配城"}; 
					if(this.categoryId==='5') this.option1 = {attribute:"品类:人造板"}; 
					this.getOptions(this.option1);
				}
			},
			// 切换类目  跟新数据
			categoryChange(){
				if(this.switchValue){
					this.dataList = [];
					this.getData();
				}else{
					this.refresh();
				}
			},
			removeOption() {
				this.option = {};
				this.screenData();
			},
			// 更新筛选项字段
			updataSelections(data) {
				let setJson = JSON.parse(this.$store.state.setJson);
				if(this.switchValue){
					setJson.selection.SQ[this.categoryId] = data;
					this.option = {};
					this.screenData();
				}else{
					setJson.selection.SQT[this.categoryId] = data;
					this.attribute = {};
					this.refresh();
				}
				this.$store.commit('setSetJson', setJson);
				this.upSetJson(setJson);
			},
			// 打开库存详情
			openStock(data) {
				const loading = this.$loading({
					lock: true,
					text: '数据加载中...',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				let params = {
					goodsId: data.goodsId,
					warestoreId: data.warestoreId,
					tenantId: this.tenantId,
					state: this.state === '0' ? null : this.state
				};
				this.$axios.get('/api/storePackage/showStoreQueryPackage', {
						params
					})
					.then(res => {
						loading.close();
						if (res.data && res.data.data) {
							this.isPersonneShow = true;
							this.detailTitle = data;
							let detailData = res.data.data;
							for (let i in detailData) {
								let arr = detailData[i].attributeValue.split(',');
								arr.forEach((val) => {
									detailData[i][val.split(':')[0]] = val.split(':')[1];
								})
							}
							this.detailData = detailData;
						} else {
							this.$message.error('获取详情数据失败')
						}
					}, () => {
						loading.close();
						this.$message.error('获取详情数据失败')
					})
			},
			// 打开修改参考价格
			openModifyPrice(data) {
				this.priceVisible = true;
				this.priceData = { ...data
				};
			},
			// 修改参考价格
			surePrice() {
				const loading = this.$loading({
					lock: true,
					text: '数据加载中...',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				let data = [{
					price: this.priceData.price,
					goodsNo: this.priceData.goodsNo,
					id: this.priceData.goodsId,
					tenantId: this.tenantId,
				}];
				this.$axios.post('/api/storePackage/modifyGoodsPrice', data)
					.then(res => {
						loading.close();
						if (res.data && res.data.data) {
							this.priceVisible = false;
							this.getData();
						} else {
							this.$message.error('修改参考价格失败')
						}
					}, () => {
						loading.close();
						this.$message.error('修改参考价格失败')
					})
			},
			//表格选中数据
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			updataTableOptions(data) {
				let setJson = JSON.parse(this.$store.state.setJson);
				if(this.switchValue){
					setJson.tableOptions.SQ[this.categoryId] = data;
				}else{
					setJson.tableOptions.SQT[this.categoryId] = data;
				}
				this.$store.commit('setSetJson',setJson);
				this.upSetJson(setJson);
			},
			// 上传设置数据
			upSetJson(val) {
				let data = {
					settingText: JSON.stringify(val),
					tenantId: this.tenantId,
					userId: this.userId,
					id: this.setId
				}
				this.$axios.post('/api/userSettingTable/modifyUserSettingTable', data)
			},
			// 导出
			exportExcel() {
				if (this.multipleSelection.length === 0) return this.$message.error('请选择导出的数据');
				let {
					export_json_to_excel
				} = require('../../../assets/excel/Export2Excel');
				require.ensure([], () => {
					var tHeader = ['仓库名'];
					var filterVal = ['storeName'];
					for (let i in this.tableConfig) {
						tHeader.push(this.tableConfig[i]);
						filterVal.push(this.tableConfig[i]);
					}
					tHeader = tHeader.concat(['库存件数', '可售件数', '参考价']);
					filterVal = filterVal.concat(['packageNum', 'packageNums', 'price']);
					var list = this.multipleSelection;
					var data = list.map(v => filterVal.map(j => v[j]));
					export_json_to_excel(tHeader, data, '在库库存');
				})
			},
			// 导出所有
			exportExcelAll1(){
				let {
					export_json_to_excel
				} = require('../../../assets/excel/Export2Excel');
				require.ensure([], () => {
					var tHeader = ['仓库名'];
					var filterVal = ['storeName'];
					for (let i in this.tableConfig) {
						tHeader.push(this.tableConfig[i]);
						filterVal.push(this.tableConfig[i]);
					}
					tHeader = tHeader.concat(['库存件数', '可售件数', '参考价']);
					filterVal = filterVal.concat(['packageNum', 'packageNums', 'price']);
					var list = this.dataList;
					var data = list.map(v => filterVal.map(j => v[j]));
					export_json_to_excel(tHeader, data, '在库库存');
				})
			},
			// 导出所有
			exportExcelAll(){
				const loading = this.$loading({
					lock: true,
					text: '数据加载中...',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				let params = {
					tenantId:this.tenantId,
					state: this.state === "0" ? "" : this.state
				}
				params = Object.assign(params,this.option1);
				this.$axios.get('/api/storePackage/showWarehouseInventoryPackages',{params})
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						let excelData = res.data.data;
						excelData.forEach((val)=>{
							let arr = val.attributeValue.split(',');
							for(let i in arr){
								val[arr[i].split(":")[0]]=arr[i].split(":")[1];
							}
						})
						if (excelData.length === 0) return this.$message.error('请选择导出的数据');
						let {
							export_json_to_excel
						} = require('../../../assets/excel/Export2Excel');
						require.ensure([], () => {
							var tHeader = ['包号','柜号','合同号','提单号','仓库名','开证公司','入库时间'];
							var filterVal = ['packageNo','boxNo','purposeFormId','outterNo','warestoreName','issuingName','storeInTime'];
							tHeader = tHeader.concat(this.tableConfig);
							filterVal = filterVal.concat(this.tableConfig);
							var list = excelData;
							var data = list.map(v => filterVal.map(j =>{
								if(j=='storeInTime'){
									return this.time(v[j],'y-m-d');
								}else{
									return v[j]
								}
							}));
							export_json_to_excel(tHeader, data, '在库库存');
						})
					}else{
						this.$message.error('获取数据失败')
					}
				},()=>{loading.close();this.$message.error("获取数据失败")})
			},
			// 打开批量修改价格弹窗
			openPrice() {
				this.allPriceVisible = true;
			},
			// 批量修改价格弹窗
			sureAllPrice() {
				const loading = this.$loading({
					lock: true,
					text: '修改价格',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				let data = [];
				for (let i in this.multipleSelection) {
					data.push({
						price: this.allPrice,
						goodsNo: this.multipleSelection[i].goodsNo,
						id: this.multipleSelection[i].goodsId,
						tenantId: this.tenantId
					})
				}
				this.$axios.post('/api/storePackage/modifyGoodsPrice', data)
					.then(res => {
						loading.close();
						if (res.data && res.data.data) {
							this.allPriceVisible = false;
							this.getData();
							this.$message.success('参考价修改成功')
						} else {
							this.$message.error('参考价修改失败')
						}
					}, () => {
						loading.close();
						this.$message.error('参考价修改失败')
					})
			}
		},
		components: {
			"v-head": head,
			"options": options
		},
		filters:{
			inDays:function(data){
				if(data){
					let timespit = Date.parse(data)
					let nowspit = Date.parse(new Date());
					return Math.ceil((nowspit-timespit)/1000/24/60/60);
				}else{
					return ""
				}
			}
		}
	}
</script>
