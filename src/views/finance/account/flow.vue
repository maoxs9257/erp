<template lang="html">
	<div class="listModule">
		<div class="list_header">
			<ym-hbt :to='{name:"accountHome"}' title='财务流水'></ym-hbt>
		</div>
		<div class="list_setbar">
			<div class="list_setbar_options">
				<div class="option" @click='isTable = !isTable'>
					<div class="option_yuan"><i class="iconfont" :class="isTable?'jiugongge':'liebiao'"></i></div>
				</div>
				<div class="option" @click="refresh">
					<div class="option_yuan"><i class="iconfont shuaxin"></i></div>
					<span class="option_txt">刷新</span>
				</div>
				<div class="option" @click='isSelect = !isSelect'>
					<div class="option_yuan"><i class="iconfont shaixuan"></i></div>
					<span class="option_txt">筛选</span>
				</div>
				<div class="option" @click='setVisible=true'>
					<div class="option_yuan"><i class="iconfont shaixuan"></i></div>
					<span class="option_txt">设置</span>
				</div>
				<div class="search_input">
					<i class="iconfont sousuo"></i>
					<input type="text" v-model="option.financeSn" placeholder="流水号" class="search_input_placeholder" @change="screenBar">
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
					<el-table :data='tableData' height='100%' v-loadMethod='load' modname='.el-table__body-wrapper' loadmore='loadmore'>
						<el-table-column show-overflow-tooltip label='流水号' prop='financeSn'></el-table-column>
						<el-table-column v-if="tableShow.completeTime" show-overflow-tooltip label='转账时间'>
							<template slot-scope='scope'>{{scope.row.completeTime|time('y-m-d')}}</template>
						</el-table-column>
						<el-table-column v-if="tableShow.type" show-overflow-tooltip label='收支类别'>
							<template slot-scope='scope'>{{scope.row.type|type}}</template>
						</el-table-column>
						<el-table-column v-if="tableShow.accName" show-overflow-tooltip label='资金账户'>
							<template slot-scope='scope'>{{scope.row|accName}}</template>
						</el-table-column>
						<el-table-column v-if="tableShow.createName" show-overflow-tooltip label='经手人' prop='createName'></el-table-column>
						<el-table-column v-if="tableShow.money" show-overflow-tooltip label='发生金额' prop='money'></el-table-column>
						
					</el-table>
				</div>
				<div class="table_fot">
					<span>总数：{{total}}</span>
				</div>
			</div>
			<div class="list_main_card" v-if='!isTable'>
				<div class="card">
					<ul class="card_ul">
						<li class="card_li" v-for='(val,key) in tableData' :key='key'>
							<div class="card_li_con">
								<div class="content">
									<div class="content_top">
										<span class="content_top_title">{{val.financeSn}}</span>
									</div>
									<div class="content_fot">
										<div class="content_fot_item">
											<span class="n">金额:</span>
											<span class='s'>{{val.money}}</span>
										</div>
										<div class="content_fot_item">
											<span class="n">账户:</span>
											<span>{{val | accName}}</span>
										</div>
										<div class="content_fot_item">
											<span class="n">类型:</span>
											<span>{{val.type | type}}</span>
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
		<!-- 设置 -->
		<el-dialog width="800px" title="设置" center :visible.sync='setVisible' v-dialogDrag>
			<div>
				<el-tabs v-model="activeName">
					<el-tab-pane label="表格字段" name="first">
						<options :data='tableOptions' @cb='updataTableOptions' @close='setVisible=false'></options>
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
			"options": options
		},
		data() {
			return {
				isTable: true,
				isSelect: false,
				tenantId: JSON.parse(this.$store.state.token).tenantId,
				tableData:[],
				total:0,
				pageNum:1,
				option:{},
				loadmore:false,
				setVisible:false,
				activeName:'first'
			}
		},
		computed:{
			tableShow: function() {
				let temp = {};
				this.tableOptions.forEach((val) => {
					temp[val.key] = val.show
				});
				return temp;
			},
			tableOptions: function() {
				return JSON.parse(this.$store.state.setJson).tableOptions.FLOW;
			}
		},
		methods: {
			// 获取数据
			getData(pageNum,pageSize,options,callback){
				let params = {
					pageNum: pageNum,
					pageSize:pageSize,
					tenantId:this.tenantId
				}
				params = Object.assign(params,options);
				this.$axios.get('/apa/financeTable/showFinanceInfo',{params})
				.then(res=>{
					if(res.data&&res.data.data){
						this.tableData = this.tableData.concat(res.data.data.dataList);
						this.total = res.data.data.total;
						callback?callback(res.data.data):null;
					}else{
						callback?callback(false):null;
					}
				},()=>{callback?callback(false):null})
			},
			// 无限加载
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
			// 刷新
			refresh(){
				const loading = this.$loading({
					lock: true,
					text: '数据加载中...',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				this.option = {};
				this.tableData = [];
				this.pageNum = 1;
				this.getData(this.pageNum++,30,this.option,(data)=>{
					loading.close();
					if(data){
						this.loadmore = data.pages>data.pageNo;
						this.$message.success('刷新完成');
					}else{
						this.$message.error('刷新失败');
					}
				})
			},
			// 筛选
			screen(){
				this.tableData = [];
				this.pageNum = 1;
				const loading = this.$loading({
					lock: true,
					text: '数据加载中...',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				this.load(() => {
					loading.close();
				})
			},
			// 搜素框
			screenBar(){
				this.screen();
			},
			// 清楚选项
			removeOption(){
				this.option = {};
				this.screen();
			},
			// 更新表格字段
			updataTableOptions(data) {
				let setJson = JSON.parse(this.$store.state.setJson);
				setJson.tableOptions.FLOW = data;
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
		mounted() {
		},
		filters: {
			type: function(data) {
				switch (data) {
					case 1: return '收入';
					case 2: return '支出';
					case 3: return '借入';
					case 4: return '借出';
					case 5: return '转入';
					case 6: return '转出';
					case 7: return '借出收款';
					case 8: return '借入还款';
					case 9: return '销售收入';
					case 10: return '采购支出';
					case 11: return '其他收入';
					case 12: return '其他支出';
					case 13: return '仓储费';
					case 14: return '卸柜费';
          case 15: return "保证金";
					default: return '其他';
				}
			},
			accName: function(data) {
				switch (data.type) {
					case 1:
					case 3:
					case 5:
					case 7:
					case 9:
					case 11:
					case 13:
          case 15:
						return data.toAccountName;
					case 2:
					case 4:
					case 6:
					case 8:
					case 10:
					case 12:
					case 14:
						return data.fromAccountName;
				}
			}
		},

	};
</script>

<style lang="scss" scoped>
  @import "@/assets/css/jxc/card.scss";
  .listModule .card_li .card_li_con {
    padding-bottom: 75%;
  }
  .content_fot .content_fot_item .n{
    width: 40px;
  }
  .content_fot .content_fot_item{
    height: 25%;
  }
</style>
