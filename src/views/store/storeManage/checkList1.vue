<template>
	<div class="listModule">
		<div class="list_header">
			<v-header :to="{name:'storeManageHome'}" title="盘点列表"></v-header>
		</div>
		<div class="list_setbar">
			<div class="list_setbar_options">
				<div class="option" v-if="multipleSelection.length==0" @click="isTable=!isTable">
					<div class="option_yuan"><i class="iconfont" :class="isTable?'jiugongge':'liebiao'"></i></div>
				</div>
				<div class="option" v-if="multipleSelection.length==0" @click="refresh">
					<div class="option_yuan"><i class="iconfont shuaxin"></i></div>
					<span class="option_txt">刷新</span>
				</div>
				<div class="option" v-if="multipleSelection.length==0" @click="isSelect=!isSelect">
					<div class="option_yuan"><i class="iconfont shaixuan"></i></div>
					<span class="option_txt">筛选</span>
				</div>
				<div class="option" v-if="multipleSelection.length>0" @click="exportExcel">
					<div class="option_yuan"><i class="iconfont daochu"></i></div>
					<span class="option_txt">导出</span>
				</div>
				<div class="option" v-if="multipleSelection.length==0" @click="setVisible=true">
					<div class="option_yuan"><i class="iconfont cebian-shezhi"></i></div>
					<span class="option_txt">设置</span>
				</div>
				<div class="search_input">
					<i class="iconfont sousuo"></i>
					<input type="text" v-model="option.likeNwme" class="search_input_placeholder" placeholder="盘点单号" @change="screenBar">
				</div>
			</div>
			<div class="list_setbar_selections">
				<div class="selection" :class="{now:option.stat===0}" @click='option.stat=0;screen()'>今天</div>
				<div class="selection" :class="{now:option.stat===1}" @click='option.stat=1;screen()'>7天</div>
				<div class="selection" :class="{now:option.stat===2}" @click='option.stat=2;screen()'>30天</div>
				<div class="selection" v-if="selections[0].show">
					<el-select v-model="option[selections[0].key]" :placeholder="selections[0].name" @change="screen" clearable>
						<el-option v-for="(v,k) in options[selections[0].key]" :key='k' :label="WareStore[v]" :value="v"></el-option>
					</el-select>
				</div>
				<div class="selection" v-if="selections[1].show">
					<el-select v-model="option[selections[1].key]" :placeholder="selections[1].name" @change="screen" clearable>
						<el-option v-for="(v,k) in options[selections[1].key]" :key='k' :label="creator[v]" :value="v"></el-option>
					</el-select>
				</div>
				<span class="clear" v-if="clearShow" @click="removeOption">清除</span>
			</div>
		</div>
		<div class="list_main" :class="{se:isSelect}">
			<div class="list_main_table" v-if='isTable'>
				<div class="table">
					<el-table :data="dataList" height="100%" @selection-change="handleSelectionChange" v-loadMethod='load' modname='.el-table__body-wrapper' loadmore='loadmore'>
						<el-table-column type="selection"></el-table-column>
						<el-table-column label="盘点单号">
							<template slot-scope='scope'>
								<router-link :to="{name:'checkDeta',query:{checkId:scope.row.id}}">{{scope.row.id}}</router-link>
							</template>
						</el-table-column>
						<el-table-column label="盘点时间" v-if="tableShow.createTime">
							<template slot-scope="scope">{{scope.row.createTime|time('y-m-d')}}</template>
						</el-table-column>
						<el-table-column label="盘点仓库" prop="warestoreName" v-if="tableShow.warestoreName"></el-table-column>
						<el-table-column label="库存总件数" v-if="tableShow.storeCount">
							<template slot-scope="scope">{{scope.row.storePriceAmountDto?scope.row.storePriceAmountDto.storeCount:0}}</template>
						</el-table-column>
						<el-table-column label="库存总数量" v-if="tableShow.storeNum">
							<template slot-scope="scope">{{scope.row.storePriceAmountDto|storeNum}}</template>
						</el-table-column>
						<el-table-column label="盘点总件数" prop="packageNum" v-if="tableShow.packageNum"></el-table-column>
						<el-table-column label="盘点人" prop="creatorName" v-if="tableShow.creatorName"></el-table-column>
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
								<div class="content" @click="$router.push({name:'checkDeta',query:{checkId:val.id}})">
									<div class="content_top">
										<span>{{val.id}}</span>
									</div>
									<div class="content_fot">
										<div class="content_fot_item">
											<span class="n">盘点时间:</span>
											<span class="v">{{val.createTime|time('y-m-d')}}</span>
										</div>
										<div class="content_fot_item">
											<span class="n">盘点仓库:</span>
											<span class='v'>{{val.warestoreName}}</span>
										</div>
										<div class="content_fot_item">
											<span class="n">库存件数:</span>
											<span class="v">{{val.storePriceAmountDto?val.storePriceAmountDto.storeCount:0}}</span>
										</div>
										<div class="content_fot_item">
											<span class="n">盘点件数:</span>
											<span class="v">{{val.packageNum}}</span>
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
		<el-dialog width="800px" title="设置" center :visible.sync="setVisible" v-dialogDrag>
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
	import header from "@/components/headBackTitle.vue"
	import options from '@/components/options.vue'
	export default {
		data() {
			return {
				isSelect: false,
				isTable: true,
				tenantId: JSON.parse(this.$store.state.token).tenantId,
				dataList:[],
				total:0,
				pageNum:1,
				option:{stat:null},
				loadmore:false,
				options:{},
				WareStore:{},
				creator:{},
				multipleSelection:[],
				activeName:'first',
				setVisible:false,
			}
		},
		computed:{
			clearShow:function(){
			  for(let k in this.option){
			    if(this.option[k]||this.option[k]===0){
			      return true;
			    }
			  }
			  return false;
			},
			tableShow:function() {
			  let temp = {};
			  this.tableOptions.forEach((val)=>{
			    temp[val.key]=val.show
			  })
			  return temp;
			},
			selections:function(){
				return JSON.parse(this.$store.state.setJson).selection.CHECK;
			},
			tableOptions:function(){
				return JSON.parse(this.$store.state.setJson).tableOptions.CHECK;
			}
		},
		mounted: function() {
			this.getOptions({});
		},
		methods: {
			// 获取数据
			getData(pageNum,pageSize,options,callback) {
				const loading = this.$loading({
					lock: true,
					text: '数据加载中...',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				let params = {
					tenantId:this.tenantId,
					pageSize:pageSize,
					pageNum:pageNum
				}
				params = Object.assign(params,options);
				this.$axios.get('/api/storeInventoryForm/StoreInventoryForm',{params})
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						this.dataList = this.dataList.concat(res.data.data.dataList);
						this.total = res.data.data.total;
					}
					callback?callback(res.data.data):null;
				},()=>{loading.close();callback?callback(false):null;})
			},
			//获取筛选项
			getOptions(option){
				let params = {
					tenantId:this.tenantId
				}
				params = Object.assign(params,option);
				this.$axios.get('/api/storeInventoryForm/StoreInventoryForm',{params})
				.then(res=>{
					if(res.data&&res.data.data){
						let data = res.data.data;
						let temp = {
							WareStoreId:[],
							creatorId:[],
						};
						let WareStore={};
						let creator={};
						data.forEach((val)=>{
							temp.WareStoreId.push(val.warestoreId);
							temp.creatorId.push(val.creatorId);
							WareStore[val.warestoreId] = val.warestoreName;
							creator[val.creatorId] = val.creatorName;
						})
						temp.WareStoreId = this.uniq(temp.WareStoreId);
						temp.creatorId = this.uniq(temp.creatorId);
						this.options = temp;
						this.WareStore = WareStore;
						this.creator = creator;
					}
				})
			},
			// 无限加载
			load(callback){
				this.getData(this.pageNum++,30,this.option,(data)=>{
					callback();
					this.loadmore = data.pages>data.pageNo;
				})
			},
			// 刷新
			refresh(){
				this.option = {stat:null};
				this.dataList = [];
				this.pageNum = 1;
				this.getData(this.pageNum++,30,this.option,(data)=>{
					this.loadmore = data.pages>data.pageNo;
					if(data){
						this.$message.success('刷新完成')
					}else{
						this.$message.error('刷新失败')
					}
				})
			},
			// 筛选数据
			screen(){
				this.dataList = [];
				this.pageNum = 1;
				this.getData(this.pageNum++,30,this.option,()=>{
					this.getOptions(this.option);
				})
			},
			// 搜素框
			screenBar(){
				this.screen();
			},
			// 清除筛选项
			removeOption(){
				this.option = {stat:null};
				this.refresh();
			},
			// 表格选中
			handleSelectionChange(val){
				this.multipleSelection = val
			},
			// 导出
			exportExcel(){
				if(this.multipleSelection.length===0) return this.$message.error('请选择导出的数据');
				let { export_json_to_excel }=require('../../../assets/excel/Export2Excel');
				require.ensure([],()=>{
					var tHeader=['盘点单号','盘点时间','盘点仓库','库存总件数','库存总数量','盘点总件数','盘点人'];
					var filterVal=['id','createTime','warestoreName','storeCount','storeNum','packageNum','creatorName'];
					var list=this.multipleSelection;
					var data=list.map(v=>filterVal.map(
						j=>{
							if(j==='storeCount'){
								return v.storePriceAmountDto.storeCount?v.storePriceAmountDto.storeCount:0;
							}else if(j==='storeNum'){
								return (v.storePriceAmountDto.cubicCount?v.storePriceAmountDto.cubicCount+'m³':'')+(v.storePriceAmountDto.tonCount?'/'+v.storePriceAmountDto.tonCount+'T':'')
								+(v.storePriceAmountDto.numberCount?'/'+v.storePriceAmountDto.numberCount+'P':'');
							}else{
								return v[j]
							}
						}
					));
					export_json_to_excel(tHeader,data,'盘点单列表');
		　　})
			},
			// 更新筛选字段
			updataSelections(data){
				let setJson = JSON.parse(this.$store.state.setJson);
				setJson.selection.CHECK = data;
				this.$store.commit('setSetJson', setJson);
				this.refresh();
				this.upSetJson(setJson);
			},
			// 更新表格字段
			updataTableOptions(data){
			  let setJson = JSON.parse(this.$store.state.setJson);
			  setJson.tableOptions.CHECK = data;
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
		},
		components: {
			"v-header": header,
			"options":options
		},
		filters:{
			storeNum:function(data){
				if(data){
					return (data.cubicCount?data.cubicCount+'m³':'')+(data.tonCount?'/'+data.tonCount+'T':'')
					+(data.numberCount?'/'+data.numberCount+'P':'');
				}else{
					return 0
				}
			}
		}
	};
</script>
<style lang="scss" scoped>
	@import "@/assets/css/jxc/card.scss";
	.listModule .card_li .card_li_con {
	  padding-bottom: 90%;
	}
	.content_fot .content_fot_item{
	  height: 25%;
	}
</style>
