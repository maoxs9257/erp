<template>
	<div class="listModule">
		<div class="list_header">
			<v-head :to='{name:"chargeHome"}' title="支出列表"></v-head>
		</div>
		<div class="list_setbar">
			<div class="list_setbar_options">
				<div class="option" @click='isTable = !isTable'>
          <div class="option_yuan"><i class="iconfont"  :class="isTable?'jiugongge':'liebiao'"></i></div>
        </div>
				<div class="option"  @click="refresh">
          <div class="option_yuan"><i class="iconfont shuaxin"></i></div>
          <span class="option_txt">刷新</span>
        </div>
				<div class="option" @click="openoutmoney(null)">
          <div class="option_yuan"><i class="iconfont xinjian"></i></div>
          <span class="option_txt">新建</span>
        </div>
				<div class="option" @click='isSelect = !isSelect'>
          <div class="option_yuan"><i class="iconfont shaixuan"></i></div>
          <span class="option_txt">筛选</span>
        </div>
				<div class="option" @click='setVisible=true'>
          <div class="option_yuan"><i class="iconfont cebian-shezhi"></i></div>
          <span class="option_txt">设置</span>
        </div>
				<div class="search_input">
          <i class="iconfont sousuo"></i>
          <input type="text" class="search_input_placeholder" v-model='option.financeSn' @change='screenBar' placeholder="流水号">
        </div>
			</div>
			<div class="list_setbar_selections">
				<div class="selection" @click="option.stat=0;screen()" :class="{now:option.stat==0}">今天</div>
				<div class="selection" @click="option.stat=1;screen()" :class="{now:option.stat==1}">最近7天</div>
				<div class="selection" @click="option.stat=2;screen()" :class="{now:option.stat==2}">最近30天</div>
				<span class="clear" v-show="option.stat||option.stat===0" @click="removeOption">清除</span>
			</div>
		</div>
		<div class="list_main" :class="{se:isSelect}">
			<div class="list_main_table" v-if='isTable'>
				<div class="table">
					<el-table height="100%" :data='tableData' v-loadMethod='load' modname='.el-table__body-wrapper' loadmore='loadmore'>
						<el-table-column type="selection"></el-table-column>
						<el-table-column label='流水号' show-overflow-tooltip>
							<template slot-scope='scope'>
								<a href="javascript:void(0)" @click="openModifyOut(scope.row)">{{scope.row.financeSn}}</a>
							</template>
						</el-table-column>
						<el-table-column v-if='tableShow.pushTime' label='发生时间' show-overflow-tooltip>
							<template slot-scope='scope'>{{scope.row.pushTime|time('y-m-d')}}</template>
						</el-table-column>
						<el-table-column v-if='tableShow.type' label='收支类别' show-overflow-tooltip>
							<template slot-scope='scope'>{{scope.row.expenseName}}</template>
						</el-table-column>
						<el-table-column v-if='tableShow.fromAccountName' label='资金账户' prop="fromAccountName" show-overflow-tooltip></el-table-column>
						<el-table-column v-if='tableShow.money' label='发生金额' prop="money" show-overflow-tooltip></el-table-column>
					</el-table>
				</div>
				<div class="table_fot">
					<span>总数：{{total}}</span>
				</div>
			</div>
			<div class="list_main_card" v-if='!isTable'>
				<div class="card" v-loadMethod='load' loadmore='loadmore'>
					<ul class="card_ul">
            <li class="card_li" v-for='(val,key) in tableData'>
              <div class="card_li_con">
                <div class="content" @click="openModifyOut(val)">
                  <div class="content_top">
                    <span class="content_top_title">{{val.financeSn}}</span>
                  </div>
                  <div class="content_fot">
                    <div class="content_fot_item">
                      <span class="n">金额:</span>
                      <span>{{val.money}}</span>
                    </div>
                    <div class="content_fot_item">
                      <span class="n">账户:</span>
                      <span class='s'>{{val.fromAccountName}}</span>
                    </div>
                    <div class="content_fot_item">
                      <span class="n">类型:</span>
                      <span>{{val.expenseName}}</span>
                    </div>
                    <div class="content_fot_item">
                      <span class="n">时间:</span>
                      <span>{{val.createTime|time('y-m-d')}}</span>
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
		<!-- 计费用 -->
		<v-outmaney ref="outmoney" @re="refresh"></v-outmaney>
		<!-- 设置 -->
		<el-dialog title='设置' center :visible.sync='setVisible' width='800px' v-dialogDrag>
			<div style="padding:0 20px 20px">
				<el-tabs v-model="activeName">
			    <el-tab-pane label="表格字段" name="first">
			    	<options :data='tableOptions' @cb='updataTableOptions' @close='setVisible=false'></options>
			    </el-tab-pane>
			  </el-tabs>
			</div>
		</el-dialog>
		<!-- 修改 -->
		<el-dialog width="580px" title="修改支出" center :visible.sync="modifyVisible" v-dialogDrag>
			<div class="modify_top">
				<div class="modify_top_item">
					<i class="iconfont baozhengjin"></i>
					<el-input-number class="input-number" style="width: 100%;" v-model="modifyData.money" :min="0"></el-input-number>
				</div>
				<div class="modify_top_item">
					<i class="iconfont zafei"></i>
					{{modifyData.expenseName}}
				</div>
				<div class="modify_top_item">
					<i class="iconfont zhanghu"></i>
					{{modifyData.fromAccountName}}
				</div>
				<div class="modify_top_item">
					<i class="iconfont riqi"></i>
					{{modifyData.createTime|time('y-m-d')}}
				</div>
			</div>
			<div style="text-align: center;margin-top: 30px;">
				<el-button type="primary" plain @click="modifyVisible=false">取消</el-button>
				<el-button type="primary" @click="modifyOut">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import head from '@/components/headBackTitle.vue'
	import outmaney from "@/components/outMoney.vue"
	import options from '@/components/options.vue'
	export default {
		data() {
			return {
				tenantId:JSON.parse(this.$store.state.token).tenantId,
				isTable:true,
				isSelect:false,
				tableData:[],
				pageNum:1,
				option:{stat:null,types:[2]},
				loadmore:false,
				total:0,
				setVisible:false,
				activeName:'first',
				modifyVisible:false,
				modifyData:{},
			};
		},
		computed:{
			tableShow:function() {
				let temp = {};
				this.tableOptions.forEach((val)=>{
					temp[val.key]=val.show
				});
				return temp;
			},
			tableOptions:function(){
				return JSON.parse(this.$store.state.setJson).tableOptions.OM;
			}
		},
		methods:{
			/**
			* 获取数据
			* @method getDeta
			*/
			getData(pageNum,pageSize,options,callback){
				let data = {
					tenantId:this.tenantId,
				};
				data = Object.assign(data,options);
				this.$axios({
					method:'post',
					url:'/apa/financeTable/showFinanceListByDto',
					data:data,
					params:{pageNum,pageSize}
				}).then(res=>{
					if(res.data&&res.data.data){
						this.tableData = this.tableData.concat(res.data.data.dataList);
						this.total = res.data.data.total;
						callback?callback(res.data.data):null
					}else{
						callback?callback(false):null;
					}
				},()=>{
					callback?callback(false):null;
				})
			},
			/**
			* 无线加载
			* @method load
			*/
			load(callback){
				this.getData(this.pageNum++,30,this.option,(data)=>{
					callback();
					if(data){
						this.loadmore = data.pages>data.pageNo;
					}else{
						this.loadmore = false;
					}
				})
			},
			/**
			* 刷新
			* @method refresh
			*/
			refresh(){
				const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				this.option = {stat:null,types:[2]};
				this.tableData = [];
				this.pageNum = 1;
				this.getData(this.pageNum++,30,this.option,(data)=>{
					loading.close();
					this.loadmore = data.pages>data.pageNo;
					if(data){
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
				this.tableData = [];
				this.pageNum = 1;
				for(let k in this.option){if(!this.option[k]&&this.option[k]!==0)delete this.option[k]};
				const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				this.load(()=>{
					loading.close();
				})
			},
			/**
			* 搜索框
			* @method screenBar
			*/
			screenBar(){
				window.clearTimeout(this.timer);
				this.timer = setTimeout(()=>{
					this.screen();
				},500)
			},
			/**
			* 清楚选项
			* @method removeOption
			*/
			removeOption(){
				this.option={stat:null,types:[2]};
				this.screen();
			},
			/**
			* 表格字段更新
			* @method updataTableOptions
			*/
			updataTableOptions(data){
				let setJson = JSON.parse(this.$store.state.setJson);
				setJson.tableOptions.OM = data;
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
			* 新建支出
			* @method openoutmoney
			*/
			openoutmoney(){
				this.$refs.outmoney.open(null)
			},
			// 打开修改支出
			openModifyOut(data){
				this.modifyData = {...data};
				this.modifyVisible = true;
			},
			// 修改支出
			modifyOut(){
				let loading = this.$loading({lock: true, text: '修改支出', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let data = {
					id:this.modifyData.id,
					money:this.modifyData.money,
					type:2
				}
				this.$axios.post('/apa/financeTable/modifyFinanceTableOneTwo',data)
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						this.refresh();
						this.modifyVisible=false;
					}else{
						this.$message.error('修改失败');
					}
				},()=>{loading.close();this.$message.error('修改失败')})
			}
		},
		components:{
			"v-head":head,
			"v-outmaney":outmaney,
			"options":options
		}
	};
</script>

<style lang="scss" scoped>
  @import "@/assets/css/jxc/card.scss";
  .listModule .card_li .card_li_con{
    padding-bottom: 75%;
  }
  .content_fot .content_fot_item .n{
    width: 40px;
  }
  .content_fot .content_fot_item{
    height: 25%;
  }
	.modify_top{
		padding: 0 120px;
		.modify_top_item{
			height: 41px;
			padding: 0 30px;
			border-bottom: 1px solid #E5E5E5;
			position: relative;
			margin-top: 15px;
			line-height: 40px;
			text-align: center;
			i{
				position: absolute;
				font-size: 25px;
				color: #999999;
				top: 3px;
				left: 0;
			}
		}
	}
</style>
<style>
	.modify_top .modify_top_item .el-input__inner{
		border: 0px solid #FFFFFF;
		color: red;
		font-size: 18px;
	}
</style>
