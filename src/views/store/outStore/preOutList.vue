<template lang="html">
	<div class="listModule">
		<div class="list_header">
			<ym-hbt :to='{name:"outStoreHome"}' title='预出库列表'></ym-hbt>
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
					<input class="search_input_placeholder" type="text" placeholder="出库单号" v-model='option.storeOutFormId' @change='screenBar'>
				</div>
			</div>
			<div class="list_setbar_selections">
				<div class="selection" :class="{now:option.stat===0}" @click='option.stat=0;screen()'>今天</div>
        <div class="selection" :class="{now:option.stat===1}" @click='option.stat=1;screen()'>7天</div>
        <div class="selection" :class="{now:option.stat===2}" @click='option.stat=2;screen()'>30天</div>
				<div class="selection" v-if='selections[0].show' :class="{now:option[selections[0].key]}">
					<el-select v-model="option[selections[0].key]" :placeholder="selections[0].name" @change='screen' clearable>
						<el-option v-if='v&&v!==""' v-for='(v,k) in options[selections[0].key]' :label="creatorIdList[v]" :value="v" :key='k'></el-option>
					</el-select>
				</div>
				<div class="selection" v-if='selections[1].show' :class="{now:option[selections[1].key]}">
					<el-select v-model="option[selections[1].key]" :placeholder="selections[1].name" @change='screen' clearable>
						<el-option v-if='v&&v!==""' v-for='(v,k) in options[selections[1].key]' :label="v" :value="v" :key='k'></el-option>
					</el-select>
				</div>
				<div class="selection" v-if='selections[2].show' :class="{now:option[selections[2].key]||option[selections[2].key]===0}">
					<el-select v-model="option[selections[2].key]" :placeholder="selections[2].name" @change='screen' clearable>
						<el-option v-if='v&&v!==""||v===0' v-for='(v,k) in options[selections[2].key]' :label="warestoreIdList[v]" :value="v" :key='k'></el-option>
					</el-select>
				</div>
				<span class="clear" v-show='clearShow' @click='removeOption'>清除</span>
			</div>
		</div>
		<div class="list_main" :class="{se:isSelect}">
			<div class="list_main_table" v-if='isTable'>
				<div class="table">
					<el-table :data='dataList' height='100%' @selection-change="handleSelectionChange" v-loadMethod='load' modname='.el-table__body-wrapper' loadmore='loadmore'>
						<el-table-column type='selection'></el-table-column>
						<el-table-column label='出库单号' show-overflow-tooltip>
							<template slot-scope='scope'>
								<a href="javascript:void(0)" @click="goTo({name:'proOutDeta',query:{id:scope.row.id}})">{{scope.row.id}}</a>
							</template>
						</el-table-column>
						<el-table-column v-if='tableShow.orderNo' label='销售单号' prop='orderNo' show-overflow-tooltip></el-table-column>
						<el-table-column v-if='tableShow.carNo' label='物流车号' prop='carNo' show-overflow-tooltip></el-table-column>
						<el-table-column v-if='tableShow.packageNum' label='包数' prop='packageNum' show-overflow-tooltip></el-table-column>
						<el-table-column v-if='tableShow.storeName' label='仓库' prop='storeName' show-overflow-tooltip></el-table-column>
						<el-table-column v-if='tableShow.receiverName' label='收货人' prop='receiverName' show-overflow-tooltip></el-table-column>
						<el-table-column v-if='tableShow.creatorName' label='创建人' prop='creatorName' show-overflow-tooltip></el-table-column>
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
								<div class="content" @click="goTo({name:'proOutDeta',query:{id:val.id}})">
									<div class="content_top">
										<span class="content_top_round"></span>
										<span class="content_top_title">{{val.carNo}}</span>
									</div>
									<div class="content_fot">
										<div class="content_fot_item">
											<span class="n">仓库:</span>
											<span class="v">{{val.storeName}}</span>
										</div>
										<div class="content_fot_item">
											<span class="n">数量:</span>
											<span class='v'>{{val.boxNum}}</span>
										</div>
										<div class="content_fot_item">
											<span class="n">理货状态:</span>
											<span class="v">未理货</span>
										</div>
                    <div class="content_fot_item">
                      <span class="n">时间:</span>
                      <span class="v">{{val.storeOutTime|time('y-m-d')}}</span>
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
			"options":options
		},
		data() {
			return {
				isTable: true,
				isSelect: true,
				tenantId: JSON.parse(this.$store.state.token).tenantId,
				role: JSON.parse(this.$store.state.role),
				pageNum:1,
				dataList:[],
				total:0,
				loadmore:false,
				options:{},
				option:{stat:null},
				creatorIdList:{},
				warestoreIdList:{},
				multipleSelection:[],
				setVisible:false,
				activeName:'first',
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
				return JSON.parse(this.$store.state.setJson).selection.PO;
			},
			tableOptions:function(){
				return JSON.parse(this.$store.state.setJson).tableOptions.PO;
			}
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
					state: 1,
					pageNum:pageNum,
					pageSize:pageSize
	      }
	      params = Object.assign(params,options);
	      this.$axios.get('/api/storeOutForm/showStoreOutForm',{params})
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
					state: 1,
	      }
	      params = Object.assign(params,options);
	      this.$axios.get('/api/storeOutForm/showStoreOutForm',{params})
	      .then(res=>{
	        if(res.data&&res.data.data){
	          let data = res.data.data;
	          let temp = {
	            creatorId:[],
	            receiverName:[],
							warestoreId:[],
	          };
	          let creatorIdList = {};
						let warestoreIdList = {};
	          data.forEach((val)=>{
	            temp.creatorId.push(val.creatorId);
	            temp.receiverName.push(val.receiverName);
							temp.warestoreId.push(val.warestoreId);
	            creatorIdList[val.creatorId] = val.creatorName;
							warestoreIdList[val.warestoreId] = val.storeName;
	          })
	          temp.creatorId = this.uniq(temp.creatorId)
	          temp.receiverName = this.uniq(temp.receiverName)
						temp.warestoreId = this.uniq(temp.warestoreId)
	          this.options = temp;
	          this.creatorIdList = creatorIdList;
						this.warestoreIdList = warestoreIdList;
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
	      this.option = {stat:null};
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
	      this.option={stat:''};
	      this.refresh();
	    },
			/**
	    * 更新筛选项字段
	    * @method updataSelections
	    */
	    updataSelections(data){
	      let setJson = JSON.parse(this.$store.state.setJson);
	      setJson.selection.PO = data;
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
	      setJson.tableOptions.PO = data;
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
	          var tHeader=['出库单号','销售单号','物流车号','数量','仓库','收货人','创建人'];
	          var filterVal=['id','orderNo','carNo','boxNum','storeName','receiverName','creatorName'];
	          var list=this.multipleSelection;
	          var data=list.map(v=>filterVal.map(j=>v[j]));
	          export_json_to_excel(tHeader,data,'预出库单列表');
	  　　})
	    },

			goTo(name) {
				if (!this.role.erp_outstore_look) {
					this.$message.error('没有权限')
				} else {
					this.$router.push(name)
				}
			},
		},
		mounted() {
			setTimeout(() => {
				this.isSelect = false;
			}, 1500)
			this.getOptions({})
		}
	}
</script>

<style lang="scss" scoped>
  @import "@/assets/css/jxc/card.scss";
	.listModule .card_li .card_li_con {
		padding-bottom: 80%;
	}
  .content_fot .content_fot_item{
    height: 25%;
  }
</style>
