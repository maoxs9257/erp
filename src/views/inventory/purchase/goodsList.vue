<template lang="html">
	<div class="listModule">
		<div class="list_header">
			<ym-hbt :to='{name:"purchaseHome"}' title='进货单列表'></ym-hbt>
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
				<div class="option" v-if='multipleSelection.length!==0' @click="exportExcel">
					<div class="option_yuan"><i class="iconfont daochu1"></i></div>
					<span class="option_txt">导出</span>
				</div>
				<div class="search_input">
					<i class="iconfont sousuo"></i>
					<input type="text" class="search_input_placeholder" v-model='option.orderSn' @change='screenBar' placeholder="提单号">
				</div>
			</div>
			<div class="list_setbar_selections">
				<div class="selection" :class="{now:option.dateState===0}" @click='option.dateState=0;screen()'>今天</div>
        <div class="selection" :class="{now:option.dateState===1}" @click='option.dateState=1;screen()'>7天</div>
        <div class="selection" :class="{now:option.dateState===2}" @click='option.dateState=2;screen()'>30天</div>
				<div class="selection" v-if='selections[0].show' :class="{now:option[selections[0].key]}">
					<el-select v-model="option[selections[0].key]" :placeholder="selections[0].name" @change='screen' clearable>
						<el-option v-if='v&&v!==""' v-for='(v,k) in options[selections[0].key]' :label="openList[v]" :value="v" :key='k'></el-option>
					</el-select>
				</div>
				<div class="selection" v-if='selections[1].show' :class="{now:option[selections[1].key]}">
					<el-select v-model="option[selections[1].key]" :placeholder="selections[1].name" @change='screen' clearable>
						<el-option v-if='v&&v!==""' v-for='(v,k) in options[selections[1].key]' :label="supportList[v]" :value="v" :key='k'></el-option>
					</el-select>
				</div>
				<div class="selection" v-if='selections[2].show' :class="{now:option[selections[2].key]||option[selections[2].key]===0}">
					<el-select v-model="option[selections[2].key]" :placeholder="selections[2].name" @change='screen' clearable>
						<el-option v-if='v&&v!==""||v===0' v-for='(v,k) in options[selections[2].key]' :label="statusList[v]" :value="v" :key='k'></el-option>
					</el-select>
				</div>
				<div class="selection" v-if='selections[3].show' :class="{now:option[selections[3].key]||option[selections[3].key]===0}">
					<el-select v-model="option[selections[3].key]" :placeholder="selections[3].name" @change='screen' clearable>
						<el-option v-if='v&&v!==""||v===0' v-for='(v,k) in options[selections[3].key]' :label="needClearList[v]" :value="v" :key='k'></el-option>
					</el-select>
				</div>
				<span class="clear" v-if='clearShow' @click='removeOption'>清除</span>
			</div>
		</div>
		<div class="list_main" :class="{se:isSelect}">
			<div class="list_main_table" v-if='isTable'>
				<div class="table">
					<el-table :data='dataList' height='100%' @selection-change="handleSelectionChange" v-loadMethod='load' modname='.el-table__body-wrapper' loadmore='loadmore'>
						<el-table-column type='selection'></el-table-column>
						<el-table-column  label='提单号' show-overflow-tooltip>
							<template slot-scope='scope'><a @click="goTo({name:'goodsDeta',query:{backUrl:'goodsList',id:scope.row.id}},'erp_stock_look')">{{scope.row.outterNo}}</a></template>
						</el-table-column>
						<el-table-column v-if='tableShow.createTime' label='时间' show-overflow-tooltip>
							<template slot-scope='scope'>{{scope.row.createTime|time('y-m-d')}}</template>
						</el-table-column>
						<el-table-column v-if='tableShow.contractId' label='合同号' prop='contractId' show-overflow-tooltip></el-table-column>
						<el-table-column v-if='tableShow.openCompanyName' label='开公司' prop='openCompanyName' show-overflow-tooltip></el-table-column>
						<el-table-column v-if='tableShow.supportCompanyName' label='供应商' prop='supportCompanyName' show-overflow-tooltip></el-table-column>
						<el-table-column v-if='tableShow.buyPackageNum' label='采购数量' prop='buyPackageNum' show-overflow-tooltip></el-table-column>
						<el-table-column v-if='tableShow.buyAmountPrice' label='采购金额' prop='buyAmountPrice' show-overflow-tooltip></el-table-column>
						<el-table-column align='center' v-if='tableShow.approveState' label='审核' prop=''>
							<template slot-scope='scope'>
                <i class="iconfont weijinhang icon_noFinish" v-if="scope.row.approveState!=2"></i>
                <i class="iconfont yiwancheng1 icon_finish" v-if="scope.row.approveState==2"></i>
							</template>
						</el-table-column>
						<el-table-column align="center" v-if='tableShow.needClear' label='清关'>
							<template slot-scope='scope'>
                <i class="iconfont weijinhang icon_noFinish" v-if="scope.row.needClear==1&&scope.row.clearanceApproveState!=2"></i>
                <i class="iconfont yiwancheng1 icon_finish" v-if="scope.row.needClear==1&&scope.row.clearanceApproveState==2"></i>
							</template>
						</el-table-column>
            <el-table-column align="center" label="入库">
              <template slot-scope="scope">
                <i class="iconfont weijinhang icon_noFinish" v-if="scope.row.state!=6"></i>
                <i class="iconfont yiwancheng1 icon_finish" v-if="scope.row.state==6"></i>
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
								<div class="content" @click="goTo({name:'goodsDeta',query:{backUrl:'goodsList',id:val.id}},'erp_stock_look')">
									<div class="content_top">
										<span class="content_top_round" :class="{ac:val.approveState==2}"></span>
										<span class="content_top_title">{{val.supportCompanyName}}</span>
									</div>
									<div class="content_fot">
										<div class="content_fot_item">
											<span class="n">合同:</span>
											<span class="v">{{val.contractId}}</span>
										</div>
										<div class="content_fot_item">
											<span class="n">提单:</span>
											<span class='v'>{{val.outterNo}}</span>
										</div>
										<div class="content_fot_item">
											<span class="n">数量:</span>
											<span class="v">{{val.buyPackageNum}}</span>
										</div>
										<div class="content_fot_item">
											<span class="n">金额:</span>
											<span class="v">{{val.buyAmountPrice}}</span>
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
				date: null,
				select: null,
				tenantId: JSON.parse(this.$store.state.token).tenantId,
				dataList: [],
				role: JSON.parse(this.$store.state.role),
				options:{},
				option:{dateState:''},
				total:0,
				pageNum:1,
				loadmore:false,
				openList:{},
				supportList:{},
				needClearList:{0:'不需要清关',1:'需要清关'},
				statusList:{0:'无须审核',1:'待审核',2:'审核通过',3:'审核拒绝'},
				setVisible:false,
				activeName:'first',
				multipleSelection:[]
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
				return JSON.parse(this.$store.state.setJson).selection.GL;
			},
			tableOptions:function(){
				return JSON.parse(this.$store.state.setJson).tableOptions.GL;
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
	    getData(pageNum,pageSize,options,callback){
	      let params = {
	        tenantId: this.tenantId,
	        status:1,
	        pageNum:pageNum,
	        pageSize:pageSize,
	      }
	      params = Object.assign(params,options);
	      this.$axios.get('/apt/purposeForm/showPurposeFormPageList',{params})
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
	        status:1
	      }
	      params = Object.assign(params,options);
	      this.$axios.get('/apt/purposeForm/showPurposeFormListCondition',{params})
	      .then(res=>{
	        if(res.data&&res.data.data){
	          let data = res.data.data;
	          let temp = {
	            contactId:[],
	            openCompanyId:[],
	            approveState:[],
							needClear:[]
	          };
	          let supportList = {};
						let openList = {};
	          data.forEach((val)=>{
	            temp.openCompanyId.push(val.issuingId);
	            temp.contactId.push(val.supportId)
							temp.approveState.push(val.approveState)
	            temp.needClear.push(val.needClear)
	            supportList[val.supportId] = val.supportCompanyName;
							openList[val.issuingId] = val.openCompanyName;
	          })
	          temp.contactId = this.uniq(temp.contactId)
	          temp.openCompanyId = this.uniq(temp.openCompanyId)
	          temp.approveState = this.uniq(temp.approveState)
						temp.needClear = this.uniq(temp.needClear)
	          this.options = temp;
	          this.supportList = supportList;
						this.openList = openList;
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
	      this.option = {dateState:''};
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
	      this.option={dateState:''};
	      this.refresh();
	    },
			/**
	    * 更新筛选项字段
	    * @method updataSelections
	    */
	    updataSelections(data){
	      let setJson = JSON.parse(this.$store.state.setJson);
	      setJson.selection.GL = data;
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
	      setJson.tableOptions.GL = data;
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
	          var tHeader=['提单号','时间','合同号','开公司','供应商','采购数量','采购金额','审核状态','清关'];
	          var filterVal=['orderSn','createTime','contractId','openCompanyName','supportCompanyName','buyPackageNum','buyAmountPrice','approveState','needClear'];
	          var list=this.multipleSelection;
	          var data=list.map(v=>filterVal.map(
							j=>{
								if(j==='approveState'){
									return v[j]===0?'无需审核':v[j]===1?'待审核':v[j]===2?'审核通过':'审核拒绝'
								}else if(j==='needClear'){
									if(v[j]===0){
										return '不需要清关'
									}else{
										return '需要清关'
									}
								}else{
									return v[j]
								}
							}
						));
	          export_json_to_excel(tHeader,data,'进货单列表');
	  　　})
	    },
			goTo(name, code) {
				if (!this.role[code]) {
					this.$message.error('没有权限');
				} else {
					this.$router.push(name);
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
  .content_fot .content_fot_item .n{
    width: 40px;
  }
  .content_fot .content_fot_item{
    height: 25%;
  }
</style>
