<template lang="html">
	<div class="listModule">
		<div class="list_header">
			<ym-hbt :to='{name:"toloanHome"}' title='借出列表'></ym-hbt>
		</div>
		<div class="list_setbar">
			<div class="list_setbar_options">
				<div class="option" v-if="multipleSelection.length===0" @click='isTable = !isTable'>
					<div class="option_yuan"><i class="iconfont" :class="isTable?'jiugongge':'liebiao'"></i></div>
				</div>
				<div class="option" v-if="multipleSelection.length===0" @click='refresh'>
					<div class="option_yuan"><i class="iconfont shuaxin"></i></div>
					<span class="option_txt">刷新</span>
				</div>
				<div class="option" v-if="multipleSelection.length===0" @click='newLoanOut'>
					<div class="option_yuan"><i class="iconfont xinjian"></i></div>
					<span class="option_txt">新建</span>
				</div>
				<div class="option" v-if="multipleSelection.length===0" @click='isSelect = !isSelect'>
					<div class="option_yuan"><i class="iconfont shaixuan"></i></div>
					<span class="option_txt">筛选</span>
				</div>
				<div class="option" v-if="multipleSelection.length!==0" @click="exportExcel">
					<div class="option_yuan"><i class="iconfont daochu"></i></div>
					<span class="option_txt">导出</span>
				</div>
				<div class="option" v-if="multipleSelection.length===0" @click="setVisible=true">
					<div class="option_yuan"><i class="iconfont cebian-shezhi"></i></div>
					<span class="option_txt">设置</span>
				</div>
				<div class="search_input">
					<i class="iconfont sousuo"></i>
          <input type="text" placeholder="流水号" v-model='option.financeSn' @change='screenBar'>
				</div>
			</div>
			<div class="list_setbar_selections">
        <div class="selection" :class="{now:option.stat===0}" @click='option.stat=0;screen()'>今天</div>
        <div class="selection" :class="{now:option.stat===1}" @click='option.stat=1;screen()'>7天</div>
        <div class="selection" :class="{now:option.stat===2}" @click='option.stat=2;screen()'>30天</div>
        <div class="selection" v-if='selections[0].show' :class="{now:option[selections[0].key]}">
          <el-select v-model="option[selections[0].key]" :placeholder="selections[0].name" @change='screen' clearable>
            <el-option v-if='v&&v!==""' v-for='(v,k) in options[selections[0].key]' :label="v" :value="v" :key='k'></el-option>
          </el-select>
        </div>
        <div class="selection" v-if='selections[1].show' :class="{now:option[selections[1].key]}">
          <el-select v-model="option[selections[1].key]" :placeholder="selections[1].name" @change='screen' clearable>
            <el-option v-if='v&&v!==""' v-for='(v,k) in options[selections[1].key]' :label="formPaymentName[v]" :value="v" :key='k'></el-option>
          </el-select>
        </div>
        <div class="selection" v-if='selections[2].show' :class="{now:option[selections[2].key]||option[selections[2].key]===0}">
          <el-select v-model="option[selections[2].key]" :placeholder="selections[2].name" @change='screen' clearable>
            <el-option v-if='v&&v!==""||v===0' v-for='(v,k) in options[selections[2].key]' :label="createName[v]" :value="v" :key='k'></el-option>
          </el-select>
        </div>
        <span class="clear" v-show='clearShow' @click='removeOption'>清除</span>
			</div>
		</div>
		<div class="list_main" :class="{se:isSelect}">
			<div class="list_main_table" v-if='isTable'>
				<div class="table">
					<el-table :data='dataList' height='100%' @selection-change="handleSelectionChange" v-loadMethod='load' modname='.el-table__body-wrapper' loadmore='loadmore'>
						<el-table-column type='selection' width='50px'></el-table-column>
						<el-table-column label='流水号' prop='financeSn' show-overflow-tooltip>
							<template slot-scope='scope'>
								<a href="javascript:void(0)" @click='openLoanOut(scope.row)'>{{scope.row.financeSn}}</a>
							</template>
						</el-table-column>
						<el-table-column v-if="tableShow.createTime" label='发生时间' prop='createTime' show-overflow-tooltip>
							<template slot-scope='scope'>{{scope.row.createTime|time('y-m-d')}}</template>
						</el-table-column>
						<el-table-column v-if="tableShow.toAccountName" label='借贷人' prop='toAccountName' show-overflow-tooltip></el-table-column>
						<el-table-column v-if="tableShow.fromAccountName" label='资金账户' prop='fromAccountName' show-overflow-tooltip></el-table-column>
						<el-table-column v-if="tableShow.money" label='发生金额' prop='money' show-overflow-tooltip></el-table-column>
            <el-table-column v-if="tableShow.createName" label="创建人" prop="createName"></el-table-column>
						<el-table-column label='结清' width="50px">
							<template slot-scope='scope'>
                <i class="iconfont weijinhang icon_noFinish" v-if="scope.row.borrowingPrice!=0"></i>
                <i class="iconfont yiwancheng1 icon_finish" v-if="scope.row.borrowingPrice==0"></i>
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
								<div class="content" @click="openLoanOut(val)">
									<div class="content_top">
										<span class="content_top_round" :class="{ss:val.borrowingPrice === 0}"></span>
										<span class="content_top_title">{{val.financeSn}}</span>
									</div>
									<div class="content_fot">
										<div class="content_fot_item">
											<span class="n">金额:</span>
											<span class="v">{{val.money}}</span>
										</div>
										<div class="content_fot_item">
											<span class="n">借贷人:</span>
											<span class='v'>{{val.toAccountName}}</span>
										</div>
										<div class="content_fot_item">
											<span class="n">时间:</span>
											<span class="v">{{val.createTime|time('y-m-d')}}</span>
										</div>
										<div class="content_fot_item">
											<span class="n">待还:</span>
											<span class="v">{{val.borrowingPrice}}</span>
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
		<!-- 新建借出 -->
		<ym-loanOut ref='loanout' @re='refresh'></ym-loanOut>
		<!-- 借出资金 -->
		<el-dialog width="580px" v-dialogDrag title="借出资金" :visible.sync="dialog1" center>
			<div class='newIn'>
				<ul>
					<li>
						<span>债务人：</span><span>{{loanDeta.toAccountName}}</span>
					</li>
					<li>
						<span>借贷金额：</span><span>{{loanDeta.money}}</span>
					</li>
					<li>
						<span>借贷时间：</span><span>{{loanDeta.pushTime|time('y-m-d')}}</span>
					</li>
					<li>
						<span>等待归还：</span><span class="m">{{loanDeta.borrowingPrice}}</span>
					</li>
					<textarea cols="30" rows="10" placeholder="无备注" style="resize:none" readonly></textarea>
					<div style='margin-top:30px;text-align:center'>
						<el-button type='primary' v-if='loanDeta.borrowingPrice>0' @click="openBackMoney(loanDeta)">收回</el-button>
						<el-button type='primary' @click="getDetailed(loanDeta.id)">查看明细</el-button>
					</div>
				</ul>
			</div>
		</el-dialog>
		<!-- 资金收回 -->
		<el-dialog class="newInDialog1" v-dialogDrag title="回收资金" :visible.sync="dialog2" center>
			<div class='newIn'>
				<ul>
					<li>
						<i class="iconfont icon-shoukuan"></i>
            <el-input-number style="width: 100%;line-height: 34px" v-model="barkMoney.borrowingPrice" :min="0"></el-input-number>
					</li>
					<li>
						<i class="iconfont icon-zhanghu"></i>
						<el-select v-model="accKey" placeholder="选择账户">
							<el-option v-for="(val,key) in accData" :key='key' :label="val.name" :value='key'></el-option>
						</el-select>
					</li>
					<li>
						<i class="iconfont icon-riqi"></i>
						<el-date-picker v-model="time" type="date" placeholder="选择日期"></el-date-picker>
					</li>
					<textarea cols="30" rows="10" placeholder="备注" v-model='memo' style='resize:none'></textarea>
					<div style='margin-top:30px;text-align:center'>
						<el-button type='primary' plain @click="dialog2=false;dialog1=false">取消</el-button>
						<el-button type='primary' @click="backMoney">确定</el-button>
					</div>
				</ul>
			</div>
		</el-dialog>
		<!-- 明细 -->
		<el-dialog width="740px" title='借贷人' center :visible.sync='flowVisible' v-dialogDrag>
      <el-table :data='flowData' height='340px'>
        <el-table-column align='center' label='发生时间' width='160'>
          <template slot-scope='scope'>{{scope.row.createTime|time('y-m-d')}}</template>
        </el-table-column>
        <el-table-column align='center' label='资金账户' prop='toAccountName'></el-table-column>
        <el-table-column align='center' label='流水类型'>
          <template slot-scope='scope'>{{scope.row.type==4?"资金借出":"收账"}}</template>
        </el-table-column>
        <el-table-column align='center' label='发生金额' prop='money'></el-table-column>
        <el-table-column align='center' label='经手人' prop='createName'></el-table-column>
      </el-table>
			<div style='margin-top:30px;text-align:center'>
				<el-button type='primary' @click="flowVisible=false">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import headBackTitle from '@/components/headBackTitle.vue'
	import loanOut from '@/components/loanout.vue'
  import options from '@/components/options.vue'
	export default {
		components: {
			"ym-hbt": headBackTitle,
			'ym-loanOut': loanOut,
		  "options":options
		},
		data() {
			return {
		    isTable: true,
		    isSelect: true,
		    date: '',
		    tenantId: JSON.parse(this.$store.state.token).tenantId,
		    userId: JSON.parse(this.$store.state.token).id,
		    pageNum:1,
		    loadmore:false,
        option:{},
        total:0,
        dataList:[],
		    options:{},
		    createName:{},
		    formPaymentName:{},
		    activeName:'first',
		    setVisible:false,
		    multipleSelection:[],
		    flowVisible: false,
		    flowData: [],
		    dialog1: false,
		    dialog2: false,
		    loanDeta: {},
		    barkMoney: {},
		    accData: [],
		    accKey: '',
		    time: '',
		    memo: '',
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
			  });
			  return temp;
		  },
			selections:function(){
				return JSON.parse(this.$store.state.setJson).selection.LO;
			},
			tableOptions:function(){
				return JSON.parse(this.$store.state.setJson).tableOptions.LO;
			}
	  },
		methods: {
			//获取数据
      getData(pageNum,pageSize,options,callback){
      	let params = {
          tenantId:this.tenantId,
          type:4,
          pageNum:pageNum,
          pageSize:pageSize
        };
      	params = Object.assign(params,options);
      	this.$axios.get('/apa/financeTable/showFinanceInfo',{params})
        .then(res=>{
        	if(res.data&&res.data.data){
            this.dataList = this.dataList.concat(res.data.data.dataList);
            this.total = res.data.data.total;
          }
        	callback?callback(res.data.data):null;
        },()=>{callback?callback(false):null})
      },
      // 获取筛选项
      getOptions(options){
      	let params = {
      		tenantId:this.tenantId,
          type:4
        };
      	params = Object.assign(params,options);
        this.$axios.get('/apa/financeTable/showFinanceInfo',{params})
        .then(res=>{
        	if(res.data&&res.data.data){
        		let data = res.data.data;
        		let temp = {
        			toAccountName:[],
				      formPaymentAccountId:[],
				      creatorId:[]
            };
            let createName = {};
        		let formPaymentName = {};
        		data.forEach((val)=>{
        			temp.toAccountName.push(val.toAccountName);
        			temp.formPaymentAccountId.push(val.formPaymentAccountId);
        			temp.creatorId.push(val.creatorId);
				      createName[val.creatorId] = val.createName;
				      formPaymentName[val.formPaymentAccountId] = val.fromAccountName;
            });
        		temp.toAccountName = this.uniq(temp.toAccountName);
        		temp.formPaymentAccountId = this.uniq(temp.formPaymentAccountId);
        		temp.creatorId = this.uniq(temp.creatorId);
        		this.options = temp;
        		this.createName = createName;
        		this.formPaymentName = formPaymentName;
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
      // 筛选数据
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
      // 搜素框
      screenBar(){
        window.clearTimeout(this.timer);
        this.timer = setTimeout(()=>{
          this.screen();
        },500)
      },
      // 清除选项
      removeOption(){
        this.option={stat:null};
        this.refresh();
      },
      // 更新筛选项字段
      updataSelections(data){
        let setJson = JSON.parse(this.$store.state.setJson);
        setJson.selection.LO = data;
        this.$store.commit('setSetJson', setJson);
        this.refresh();
        this.upSetJson(setJson);
      },
      // 表格字段更新
      updataTableOptions(data){
        let setJson = JSON.parse(this.$store.state.setJson);
        setJson.tableOptions.LO = data;
        this.$store.commit('setSetJson', setJson);
        this.upSetJson(setJson);;
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
      // 表格选中
      handleSelectionChange(data){
        this.multipleSelection = data;
      },
      // 导出
      exportExcel(){
        if(this.multipleSelection.length===0) return this.$message.error('请选择导出的流水单');
        let { export_json_to_excel }=require('../../../assets/excel/Export2Excel');
        require.ensure([],()=>{
          var tHeader=['流水号','发生时间','借贷人','资金账户','发生金额','创建人'];
          var filterVal=['financeSn','createTime','toAccountName','fromAccountName','money','createName'];
          var list=this.multipleSelection;
          var data=list.map(v=>filterVal.map(j=>v[j]));
          export_json_to_excel(tHeader,data,'流水列表');
        })
      },
      // 新建借出
      newLoanOut(){
        this.$refs.loanout.open();
      },
      // 打开借出详情
      openLoanOut(data){
		   this.dialog1 = true;
		   this.loanDeta = data;
	    },
      // 打开回事资金
      openBackMoney(data){
		    const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {tenantId:this.tenantId};
        this.$axios.get('/apa/financeTable/showPaymentAccount',{params})
        .then(res=>{
        	loading.close();
        	if(res.data&&res.data.data){
            this.dialog2 = true;
            this.barkMoney = {...data};
            this.accData = res.data.data;
          }else{
        		this.$message.error('获取信息失败')
          }
        },()=>{loading.close();this.$message.error('获取信息失败')})
	    },
      // 回收借款
      backMoney(){
      	if(!this.accData[this.accKey]) return this.$message.error('请选择账户');
      	if(!this.time) return this.$message.error('请选择时间');
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {
        	id:this.barkMoney.id,
          state:this.loanDeta.borrowingPrice - this.barkMoney.borrowingPrice>0?1:2
        };
        let data = {
          borrowingPrice: this.loanDeta.borrowingPrice - this.barkMoney.borrowingPrice,
          creatorId: this.userId,
          financeSn: this.barkMoney.financeSn,
          toAccountName: this.accData[this.accKey].name,
          toAccountType: this.accData[this.accKey].displayName,
          toPaymentAccountId: this.accData[this.accKey].id,
          fromAccountName: 'undefined',
          fromAccountType: 'undefined',
          money: this.barkMoney.borrowingPrice,
          memo: this.memo,
          completeTime: Date.parse(new Date(this.time)),
          type: 7,
          tenantId: this.tenantId,
        };
        this.$axios({
			    url:'/apa/financeTable/addFinanceTableBorrowing',
          method:'post',
          params:params,
          data:data
        }).then(res=>{
        	loading.close();
        	if(res.data&&res.data.data){
            this.dialog1 = false;
            this.dialog2 = false;
            this.refresh();
          }else{
        		this.$message.error('操作失败')
          }
        },()=>{loading.close();this.$message.error('操作失败')})
      },
      // 获取借出明细
      getDetailed(id){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {
        	tenantId:this.tenantId,
          reffer: 'FIN,id:'+id
        };
        this.$axios.get('/apa/financeTable/showFinanceInfo',{params})
        .then(res=>{
        	loading.close();
          this.flowVisible = true;
          this.flowData = [this.loanDeta];
          if(res.data&&res.data.data){
            this.flowData.push.apply(this.flowData,res.data.data);
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
		},
		mounted() {
			setTimeout(() => {
				this.isSelect = false;
			}, 1500);
			this.getOptions();
		}
	}
</script>
<style>
	.newInDialog1 .el-dialog {
		width: 580px;
	}
	.newInDialog1 .el-input__inner {
		border: 0;
		height: 34px;
		width: 280px;
		text-align: center;
		padding: 0 30px;
	}
	.newInDialog1 .el-input__prefix {
		display: none;
	}
	.newInDialog1 .el-date-editor.el-input {
		width: 100%;
	}
</style>
<style lang="scss" scoped>
  @import "@/assets/css/jxc/card.scss";
  .listModule .card_li .card_li_con {
    padding-bottom: 75%;
  }
  .content_fot .content_fot_item .n{
    width: 50px;
  }
  .content_fot .content_fot_item{
    height: 25%;
  }

	.newIn {
		padding: 0 122px;
		ul {
			width: 100%;
			text-align: center;
			li {
				padding-top: 17px;
				height: 52px;
				border-bottom: #b3b3b3 solid 1px;
				position: relative;
				i {
					position: absolute;
					font-size: 25px;
					color: #b3b3b3;
					top: 15px;
					left: 5px;
					z-index: 10;
				}
				.howMoney {
					height: 34px;
					line-height: 35px;
					width: 100%;
					border: 0;
					outline: none;
					padding: 0 30px;
					font-size: 20px;
					text-align: center;
					color: #eb586a;
				}
				span {
					float: left;
					width: 110px;
					height: 35px;
					line-height: 35px;
					text-align: right;
					font-size: 14px;
					color: #666;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					&:nth-child(2) {
						width: calc(100% - 110px);
						text-align: left;
					}
				}
				span.m {
					font-size: 18px;
					color: red;
				}
			}
			textarea {
				height: 54px;
				width: 100%;
				border: #b3b3b3 solid 1px;
				outline: none;
				border-radius: 5px;
				margin-top: 36px;
			}
		}
	}
</style>
