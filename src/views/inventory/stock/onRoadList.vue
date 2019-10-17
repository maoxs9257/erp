<template lang="html">
	<div class="listModule">
		<div class="list_header">
			<ym-hbt :to='{name:"stockHome"}' title='在途明细'></ym-hbt>
		</div>
		<div class="list_setbar">
			<div class="list_setbar_options">
				<div v-if="multipleSelection.length==0" class="option" @click="refresh">
					<div class="option_yuan"><i class="iconfont shuaxin"></i></div>
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
						<el-select v-model="array.品类" @change="refresh" placeholder="品类">
							<el-option label="实木板材" value="实木板材"></el-option>
							<el-option label="原木材" value="原木材"></el-option>
							<el-option label="人造板" value="人造板"></el-option>
							<el-option label="木配城" value="木配城"></el-option>
							<el-option label="名贵材" value="名贵材"></el-option>
						</el-select>
					</div>
				</div>
				<div v-if="multipleSelection.length==0" class="option" @click='isSelect = !isSelect'>
					<div class="option_yuan"><i class="iconfont shaixuan"></i></div>
					<span class="option_txt">筛选</span>
				</div>
				<div v-if="multipleSelection.length==0" class="option" @click="exportExcelAll">
					<div class="option_yuan"><i class="iconfont daochu"></i></div>
					<span class="option_txt">导出全部</span>
				</div>
				<div class="option" @click="setVisible=true">
					<div class="option_yuan"><i class="iconfont cebian-shezhi"></i></div>
					<span class="option_txt">设置</span>
				</div>
				<div class="option" v-if='multipleSelection.length!==0' @click='exportExcel'>
					<div class="option_yuan"><i class="iconfont daochu"></i></div>
					<span class="option_txt">导出</span>
				</div>
				<div class="search_input">
					<i class="iconfont sousuo"></i>
					<input type="text" v-model="option.packageNo" class="search_input_placeholder" placeholder="包号/柜号/合同号/提单号" @change="screen">
				</div>
			</div>
			<div class="list_setbar_selections">
				<div class="selection" v-if="selections[key].show" :class="{now:array[selections[key].key]}" v-for="(val,key) in selections" :key='key'>
					<el-select v-model="array[selections[key].key]" :placeholder="selections[key].name" clearable @change='screen'>
						<el-option v-for="(v,k) in options[selections[key].key]" :key='k' :label="v" :value="v"></el-option>
					</el-select>
				</div>
				<span v-if="clearShow" class="clear" @click="removeOption">清除</span>
			</div>
		</div>
		<div class="list_main" :class="{se:isSelect}">
			<div class="list_main_table" v-if='isTable'>
				<div class="table" ref='reTable'>
					<el-table :data="dataList" height="100%" @selection-change="handleSelectionChange" v-loadMethod='load' modname='.el-table__body-wrapper'
					 loadmore='loadmore'>
						<el-table-column type="selection"></el-table-column>
						<el-table-column v-if="tableShow.packageNo" label="包号" prop="packageNo" show-overflow-tooltip></el-table-column>
						<el-table-column v-if="tableShow.boxNo" label="柜号" prop="boxNo" show-overflow-tooltip></el-table-column>
						<el-table-column v-if="tableShow.contractSn" label="合同号" prop="contractSn" show-overflow-tooltip></el-table-column>
						<el-table-column v-if="tableShow.outterNo" label="提单号" prop="outterNo" show-overflow-tooltip></el-table-column>
						<el-table-column v-if="tableShow[val]" v-for="(val,key) in tableConfig" :key="key" :label="val" :prop="val" show-overflow-tooltip></el-table-column>
					</el-table>
				</div>
				<div class="table_fot">
					<span>总数：{{total}}</span>
				</div>
			</div>
		</div>
		<!-- 设置 -->
		<el-dialog width="800px" title='设置' center :visible.sync='setVisible' v-dialogDrag>
			<el-tabs v-model="activeName">
				<el-tab-pane label="表格字段" name="first">
					<options :data='tableOptions' @cb='updataTableOptions' @close='setVisible=false'></options>
				</el-tab-pane>
				<el-tab-pane label="筛选字段" name="second">
					<options :data='selections' @cb='updataSelections' @close='setVisible=false'></options>
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
				isTable: true,
				isSelect: false,
				date: null,
				select: null,
				categoryId: '2',
				tenantId: JSON.parse(this.$store.state.token).tenantId,
				userId: JSON.parse(this.$store.state.token).id,
				pageNum: 1,
				dataList: [],
				total: 0,
				option: {},
				multipleSelection: [],
				setVisible:false,
				array:{品类:'实木板材'},
				options:{},
				activeName:'first'
			}
		},
		computed: {
			clearShow:function(){
			  for(let k in this.array){
			    if(k!="品类"&&(this.array[k]||this.array[k]===0)){
			      return true;
			    }
			  }
			  return false;
			},
			tableConfig: function() {
				if(this.array.品类){
					let tableConfig = this.GLOBAL_.tableConfig[this.array.品类];
					return tableConfig;
				}else{
					return [];
				}
			},
			selections:function(){
				if(this.array.品类){
					return JSON.parse(this.$store.state.setJson).selection.ORL[this.array.品类];
				}else{
					return [];
				}
			},
			tableOptions:function(){
				if(this.array.品类){
					return JSON.parse(this.$store.state.setJson).tableOptions.ORL[this.array.品类];
				}else{
					return [];
				}
			},
			tableShow:function() {
			  let temp = {};
			  this.tableOptions.forEach((val)=>{
			    temp[val.key]=val.show
			  })
			  return temp;
			}
		},
		mounted() {
			let option = this.getOption();
			this.getOptions(option);
		},
		methods: {
			// 获取数据
			getData(pageNum, pageSize, options, callback) {
				let params = {
					tenantId: this.tenantId,
					pageNum: pageNum,
					pageSize: pageSize,
				};
				params = Object.assign(params, options);
				this.$axios.get('/api/storePackage/showStoreOnPassageInfo', {
						params
					})
					.then(res => {
						if (res.data && res.data.data) {
							let data = res.data.data.dataList;
							data.forEach((val) => {
								if(val.attributeValue){
									let arr = val.attributeValue.split(',');
									for (let i in arr) {
										val[arr[i].split(':')[0]] = arr[i].split(':')[1]
									}
								}
							});
							this.dataList = this.dataList.concat(data);
							this.total = res.data.data.total;
						}
						callback ? callback(res.data.data) : null;
					}, () => {
						callback ? callback(false) : null
					})
			},
			// 获取筛选数据
			getOptions(option) {
				let params = {
					tenantId: this.tenantId
				};
				params = Object.assign(params,option)
				this.$axios.get('/api/storePackage/showStoreOnPassageInfo',{params})
				.then(res=>{
					if(res.data&&res.data.data){
						let data = res.data.data;
						data.forEach((val)=>{
							if(val.attributeValue){
								let arr = val.attributeValue.split(',');
								for(let i in arr){
									val[arr[i].split(':')[0]] = arr[i].split(':')[1];
								}
							}
						})
						let temp = {};
						for(let i in this.tableConfig){
							let configName = this.tableConfig[i];
							temp[configName] = [];
							data.forEach((val)=>{
								temp[configName].push(val[configName])
							})
						}
						for(let i in temp){
							temp[i] = this.uniq(temp[i])
						}
						this.options = temp;
					}
				})
			},
			// 无限加载
			load(callback) {
				let option = this.getOption();
				this.getData(this.pageNum++, 30, option, (data) => {
					callback();
					this.loadmore = data.pages > data.pageNo;
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
				this.dataList = [];
				this.pageNum = 1;
				let option = this.getOption();
				this.getData(this.pageNum++, 30, option, (data) => {
					loading.close();
					if (data) {
						this.getOptions(option);
						this.loadmore = data.pages > data.pageNo;
						this.$message.success('刷新完成')
					} else {
						this.$message.error('刷新失败')
					}
				})
			},
			// getOption
			getOption(){
				let option = {array:''};
				for(let i in this.array){
					if(this.array[i]||this.array[i]===0){
						option.array += i + ':' + this.array[i] + ','
					}
				}
				if(this.option.packageNo){
					option.packageNo = this.option.packageNo;
				}
				return option;
			},
			// 筛选数据
			screen(){
				this.dataList = [];
				this.pageNum = 1;
				let option = this.getOption();
				this.getOptions(option);
				this.getData(this.pageNum++, 30, option, (data) => {
					loading.close();
					if (data) {
						this.loadmore = data.pages > data.pageNo;
						this.$message.success('筛选完成')
					} else {
						this.$message.error('筛选失败')
					}
				})
			},
			//
			removeOption(){
				this.array={品类:'实木板材'};
				this.refresh();
			},
			// 更新筛选字段
			updataSelections(data){
				let setJson = JSON.parse(this.$store.state.setJson);
				setJson.selection.ORL[this.array.品类] = data;
				this.$store.commit('setSetJson',setJson);
				this.refresh();
				this.upSetJson(setJson);
			},
			// 
			updataTableOptions(data){
				let setJson = JSON.parse(this.$store.state.setJson);
				setJson.tableOptions.ORL[this.array.品类] = data;
				this.$store.commit('setSetJson',setJson);
				this.upSetJson(setJson);
			},
			// 上传设置数据
			upSetJson(val){
				let data = {
					settingText:JSON.stringify(val),
					tenantId:this.tenantId,
					userId:this.userId
				}
				this.$axios.post('/api/userSettingTable/modifyUserSettingTable',data)
			},
			// 表格选中
			handleSelectionChange(data) {
				this.multipleSelection = data;
			},
			// exportExcel
			exportExcel() {
				if (this.multipleSelection.length === 0) return this.$message.error('请选择导出的销售单');
				let {
					export_json_to_excel
				} = require('../../../assets/excel/Export2Excel');
				require.ensure([], () => {
					var tHeader = ['包号','柜号','合同号','提单号',...this.tableConfig];
					var filterVal = ['packageNo','boxNo','contractSn','outterNo',...this.tableConfig];
					var list = this.multipleSelection;
					var data = list.map(v => filterVal.map(j => v[j]));
					export_json_to_excel(tHeader, data, '在途明细');
				})
			},
			// 导出全部
			exportExcelAll(){
				const loading = this.$loading({
					lock: true,
					text: '数据加载中...',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				let params = {tenantId: this.tenantId};
				let option = this.getOption();
				params = Object.assign(params,option)
				this.$axios.get('/api/storePackage/showStoreOnPassageInfo',{params})
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						let exaclData = res.data.data;
						if (exaclData.length === 0) return this.$message.error('请选择导出的销售单');
						exaclData.forEach((val)=>{
							if(val.attributeValue){
								let arr = val.attributeValue.split(',');
								for(let i in arr){
									val[arr[i].split(':')[0]] = arr[i].split(':')[1];
								}
							}
						})
						let {
							export_json_to_excel
						} = require('../../../assets/excel/Export2Excel');
						require.ensure([], () => {
							var tHeader = ['包号','柜号','合同号','提单号',...this.tableConfig];
							var filterVal = ['packageNo','boxNo','contractSn','outterNo',...this.tableConfig];
							var list = exaclData;
							var data = list.map(v => filterVal.map(j => v[j]));
							export_json_to_excel(tHeader, data, '在途明细');
						})
					}else{
						this.$message.error('获取数据失败')
					}
				},()=>{loading.close();this.$message.error('获取数据失败')})
			}
		},
		watch:{
			multipleSelection:function(){
				// this.$refs.reTable.setAttribute('style',"width: 0;");
				// setTimeout(()=>{
				// 	this.$refs.reTable.setAttribute('style',"width: 100%;");
				// })
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>
