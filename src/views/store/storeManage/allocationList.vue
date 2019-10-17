<template>
	<div class="listModule">
		<div class="list_header">
			<v-header :to="{name:'storeManageHome'}" title="库存调拨"></v-header>
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
					<div class="option_yuan"><i class="iconfont daochu"></i></div>
					<span class="option_txt">导出</span>
				</div>
				<div class="search_input">
					<i class="iconfont sousuo"></i>
					<input type="text" v-model='option.id' @change='screenBar'>
				</div>
			</div>
			<div class="list_setbar_selections">
				<div class="selection" v-if='selections[0].show' :class="{now:option[selections[0].key]}">
					<el-select v-model="option[selections[0].key]" :placeholder="selections[0].name" @change='screen' clearable>
						<el-option v-for='(v,k) in options[selections[0].key]' :label="onName[v]" :value="v" :key='k'></el-option>
					</el-select>
				</div>
				<div class="selection" v-if='selections[1].show' :class="{now:option[selections[1].key]}">
					<el-select v-model="option[selections[1].key]" :placeholder="selections[1].name" @change='screen' clearable>
						<el-option v-for='(v,k) in options[selections[1].key]' :label="toName[v]" :value="v" :key='k'></el-option>
					</el-select>
				</div>
				<div class="selection" v-if='selections[2].show' :class="{now:option[selections[2].key]||option[selections[2].key]===0}">
					<el-select v-model="option[selections[2].key]" :placeholder="selections[2].name" @change='screen' clearable>
						<el-option v-for='(v,k) in options[selections[2].key]' :label="stateList[v]" :value="v" :key='k'></el-option>
					</el-select>
				</div>
				<span class="clear" v-if='clearShow' @click='removeOption'>清除</span>
			</div>
		</div>
		<div class="list_main" :class="{se:isSelect}">
			<div class="list_main_table" v-if='isTable'>
				<div class="table">
					<el-table :data="dataList" height="100%"  @selection-change="handleSelectionChange" v-loadMethod='load' modname='.el-table__body-wrapper' loadmore='loadmore'>
						<el-table-column type="selection" width="55"></el-table-column>
						<el-table-column label="调拨单号">
							<template slot-scope='scope'>
								<router-link :to="{name:'allocationDeta',query:{allotId:scope.row.id,backurl:'allocationList'}}">{{scope.row.id}}</router-link>
							</template>
						</el-table-column>
						<el-table-column v-if='tableShow.createTime' label='调拨时间'>
							<template slot-scope="scope">{{scope.row.createTime|time('y-m-d')}}</template>
						</el-table-column>
						<el-table-column v-if='tableShow.onName' label="调出仓库" prop='onName'></el-table-column>
						<el-table-column v-if='tableShow.toName' label="调入仓库" prop='toName'></el-table-column>
						<el-table-column v-if='tableShow.packageNum' label='调库件数' prop='packageNum'></el-table-column>
						<el-table-column v-if='tableShow.sptAmount' label="调库数量" prop='sptAmount'></el-table-column>
						<el-table-column v-if='tableShow.state' label="调库状态">
							<template slot-scope='scope'>
								<i v-if="scope.row.state!==2" class="dui iconfont icon-wancheng"></i>
								<i v-if="scope.row.state===2" class="duic iconfont icon-wancheng"></i>
							</template>
						</el-table-column>
						<el-table-column v-if='tableShow.creatorName' label="创建人员" prop='creatorName'></el-table-column>
					</el-table>
				</div>
				<div class="table_fot">
					<span>总数：{{total}}</span>
				</div>
			</div>
			<div class="list_main_card" v-show='!isTable'>

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
	import header from "@/components/headBackTitle.vue"
	import options from '@/components/options.vue'
	export default {
		data() {
			return {
				tenantId: JSON.parse(this.$store.state.token).tenantId,
				isSelect:true,
				isTable:true,
				setVisible:false,
				multipleSelection:[],
				dataList:[],
				pageNum:1,
				option:{stat:null},
				options:{},
				onName:{},
				toName:{},
				stateList:{1:'待审核',9:'完成'},
				activeName:'first',
				total:0,
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
	      console.log(temp);
	      return temp;
	    },
			selections:function(){
				return JSON.parse(this.$store.state.setJson).selection.AL;
			},
			tableOptions:function(){
				return JSON.parse(this.$store.state.setJson).tableOptions.AL;
			}
	  },
		mounted: function() {
			setTimeout(() => {
				this.isSelect = false;
			}, 1500)
			this.getOptions({})
		},
		methods: {
			/**
	    * 获取数据
	    * @method getData
	    * @param pageNum 页码
	    * @param pageSize 页面大小
	    * @param options 筛选项
	    */
			getData(pageNum,pageSize,options,callback){
				let params = {
					tenantId: this.tenantId,
						pageNum:pageNum,
						pageSize:pageSize,
				}
				params = Object.assign(params,options);
				this.$axios.get('/api/storeExchangeForm/showStoreExchangeForm',{params})
				.then(res=>{
					if(res.data&&res.data.data){
						this.dataList = this.dataList.concat(res.data.data.dataList)
	          this.total = res.data.data.total;
					}
					callback?callback(res.data.data):null
				},()=>{
	        callback?callback(false):null
	      })
			},
			/**
	    * 获取筛选项
	    * @method getOptions
	    */
	    getOptions(options){
	      let params = {
	        tenantId: this.tenantId,
	      }
	      params = Object.assign(params,options);
	      this.$axios.get('/api/storeExchangeForm/showStoreExchangeForm',{params})
	      .then(res=>{
	        if(res.data&&res.data.data){
	          let data = res.data.data;
	          let temp = {
	            inWareStoreId:[],
	            toWareStoreId:[],
	            state:[],
						};
						let onName = {};
						let toName = {};
	          data.forEach((val)=>{
	            temp.inWareStoreId.push(val.fromWarestoreId);
	            temp.toWareStoreId.push(val.toWarestoreId);
							temp.state.push(val.state);
							onName[val.fromWarestoreId] = val.onName;
							toName[val.toWarestoreId] = val.toName;
	          })
	          temp.inWareStoreId = this.uniq(temp.inWareStoreId)
	          temp.toWareStoreId = this.uniq(temp.toWareStoreId)
	          temp.state = this.uniq(temp.state)
	          console.log(temp)
						this.options = temp;
						this.onName = onName;
						this.toName = toName;
	        }
	      })
	    },
			/**
	    * 无限加载
	    * @method load
	    */
	    load(callback){
	      this.getData(this.pageNum++,30,this.option,(data)=>{
	        callback();
	        this.loadmore = data.pages>data.pageNo
	      })
	    },
			/**
	    * 刷新
	    * @method refresh
	    */
			refresh(){
	      const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
	      this.option = {stat:''};
	      this.dataList = [];
	      this.pageNum = 1;
	      this.getData(this.pageNum++,30,this.option,(data)=>{
	        loading.close();
	        this.loadmore = data.pages>data.pageNo;
	        if(data){
	          this.getOptions(this.option);
	          this.$message.success('刷新完成')
	        }else{
	          this.$message.error('刷新失败')
	        }
	      })
			},
			/**
	    * 筛选数据
	    * @method screen
	    */
	    screen(){
	      this.dataList = [];
	      this.pageNum = 1;
	      for(let k in this.option){if(!this.option[k]&&this.option[k]!==0)delete this.option[k]};
	      const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
	      this.getData(this.pageNum++,30,this.option,()=>{
	        loading.close();
	        this.getOptions(this.option);
	      })
			},
			/**
	    * 搜索框
	    * @method screenBar
	    */
	    screenBar(){
	      window.clearTimeout(this.timer)
	      this.timer = setTimeout(()=>{
	        this.screen();
	      },500)
	    },
			/**
	    * 清楚选项
	    * @method removeOption
	    */
	    removeOption(){
	      this.option={};
	      this.refresh();
			},
			/**
	    * 更新筛选项字段
	    * @method updataSelections
	    */
	    updataSelections(data){
	      let setJson = JSON.parse(this.$store.state.setJson);
	      setJson.selection.AL = data;
	      this.$store.commit('setSetJson', setJson);
	      this.refresh();
	      this.upSetJson(setJson);
	    },
	    /**
	    * 表格字段更新
	    * @method updataTableOptions
	    */
	    updataTableOptions(data){
	      let setJson = JSON.parse(this.$store.state.setJson);
	      setJson.tableOptions.AL = data;
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
	    handleSelectionChange(data){
	      this.multipleSelection = data;
			},
			/**
	    * 导出供应商
	    * @method exportExcel
	    **/
	    exportExcel(){
	      if(this.multipleSelection.length===0) return this.$message.error('请选择导出的供应商');
	      let { export_json_to_excel }=require('../../../assets/excel/Export2Excel');
	      require.ensure([],()=>{
	          var tHeader=['调拨单号','调拨时间','调出仓库','调入仓库','调库件数','调库数量','调库状态','创建人员'];
	          var filterVal=['id','createTime','onName','toName','packageNum','sptAmount','state','creatorName'];
	          var list=this.multipleSelection;
	          var data=list.map(v=>filterVal.map(
							j=>{
								if(j==='state'){
									return v[j]===0?'无需审核':v[j]===1?'待审核':v[j]===2?'审核通过':'审核拒绝'
								}else{
									return v[j]
								}
							}
						));
	          export_json_to_excel(tHeader,data,'库存调拨列表');
	  　　})
	    },
		},
		components: {
			"v-header": header,
			"options":options
		}
	};
</script>
<style lang="scss" scoped>
	.dui {
		font-size: 20px;
		color: #666;
	}
	.duic {
		font-size: 20px;
		color: #57d47a;
	}
</style>
