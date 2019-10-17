<template>
	<div class="listModule">
		<div class="list_header">
			<v-head title="锁定列表" :to="{name:'stockHome'}"></v-head>
		</div>
		<div class="list_setbar">
			<div class="list_setbar_options">
				<div class="option" v-if='multipleSelection.length==0' @click="isTable=!isTable">
					<div class="option_yuan"><i class="iconfont" :class="isTable?'jiugongge':'liebiao'"></i></div>
				</div>
				<div class="option" v-if='multipleSelection.length==0' @click="refresh">
					<div class="option_yuan"><i class="iconfont shuaxin"></i></div>
					<span class="option_txt">刷新</span>
				</div>
				<div class="option" v-if='multipleSelection.length==0' @click="$router.push({name:'stockLock'})">
					<div class="option_yuan"><i class="iconfont xinjian"></i></div>
					<span class="option_txt">新建</span>
				</div>
				<div class="option" v-if='multipleSelection.length==0' @click='isSelect = !isSelect'>
					<div class="option_yuan"><i class="iconfont shaixuan"></i></div>
					<span class="option_txt">筛选</span>
				</div>
				<div class="option" v-if='multipleSelection.length==0' @click="setVisible=true">
          <div class="option_yuan"><i class="iconfont cebian-shezhi"></i></div>
          <span class="option_txt">设置</span>
        </div>
				<div class="option" v-if='multipleSelection.length!==0'>
					<div class="option_yuan"><i class="iconfont daochu"></i></div>
					<span class="option_txt">导出</span>
				</div>
				<div class="search_input">
					<i class="iconfont sousuo"></i>
					<input type="text" v-model="option.lockFormNo" @change='screenBar' class="search_input_placeholder" placeholder="锁定单号">
				</div>
			</div>
			<div class="list_setbar_selections">
				<div class="selection" :class="{now:option.stat===0}" @click='option.stat=0;screen()'>今天</div>
        <div class="selection" :class="{now:option.stat===1}" @click='option.stat=1;screen()'>7天</div>
        <div class="selection" :class="{now:option.stat===2}" @click='option.stat=2;screen()'>30天</div>
				<div class="selection" v-if='selections[0].show' :class="{now:option[selections[0].key]}">
					<el-select v-model="option[selections[0].key]" :placeholder="selections[0].name" @change='screen' clearable>
						<el-option v-for='(v,k) in options[selections[0].key]' :label="creatorList[v]" :value="v" :key='k'></el-option>
					</el-select>
				</div>
				<div class="selection" v-if='selections[1].show' :class="{now:option[selections[1].key]}">
					<el-select v-model="option[selections[1].key]" :placeholder="selections[1].name" @change='screen' clearable>
						<el-option v-if='v&&v!==""' v-for='(v,k) in options[selections[1].key]' :label="contactList[v]" :value="v" :key='k'></el-option>
					</el-select>
				</div>
				<span class="clear" v-if='clearShow' @click='removeOption'>清除</span>
			</div>
		</div>
		<div class="list_main" :class="{se:isSelect}">
			<div class="list_main_table" v-if='isTable'>
				<div class="table">
					<el-table :data="dataList" height="100%" v-loadMethod='load' modname='.el-table__body-wrapper' loadmore='loadmore'>
						<el-table-column type="selection" width="55"></el-table-column>
						<el-table-column label="锁定单号" show-overflow-tooltip>
							<template slot-scope="scope">
								<router-link :to="{name:'lockDeta',query:{id:scope.row.id,backUrl:'lockList'}}">{{ scope.row.lockNo }}</router-link>
							</template>
						</el-table-column>
						<el-table-column v-if="tableShow.createTime" label="日期">
							<template slot-scope="scope">{{scope.row.createTime|time('y-m-d')}}</template>
						</el-table-column>
						<el-table-column v-if="tableShow.creatorName" label="创建人员" prop="creatorName"></el-table-column>
						<el-table-column v-if="tableShow.amount" label="锁定数量" prop="amount"></el-table-column>
						<el-table-column v-if="tableShow.orderPackages" label="锁定件数" prop='orderPackages'></el-table-column>
						<el-table-column v-if="tableShow.expireTime" label="截止时间" prop="expireTime">
							<template slot-scope="scope">{{scope.row.expireTime|time('y-m-d')}}</template>
						</el-table-column>
						<el-table-column v-if="tableShow.fullName" label="客户名称" prop="fullName"></el-table-column>
						<el-table-column v-if="tableShow.memo" prop="allot" label="备注">
							<template slot-scope="scope">
								<el-tooltip class="item" effect="dark" :content="scope.row.memo" placement="top">
									<i v-if="scope.row.memo" class="el-icon-warning"></i>
								</el-tooltip>
							</template>
						</el-table-column>
						<el-table-column label="审核">
							<template slot-scope="scope">
								<i class="iconfont yiwancheng1" :class="scope.row.checkApproveState==2?'icon_finish':'icon_noFinish'"></i>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="table_fot">
					<span>总数：{{total}}</span>
				</div>
			</div>
			<div class="list_main_card" v-if='!isTable'>
				<div class="card">
					<ul class="card_ul">
						<li class="card_li" v-for='(val,key) in dataList' :key='key'>
							<div class="card_li_con">
								<div class="content" @click="goTo({name:'goodsDeta',query:{backUrl:'goodsList',id:val.id}},'erp_stock_look')">
									<div class="content_top">
										<span class="content_top_title">{{val.lockNo}}</span>
									</div>
									<div class="content_fot">
										<div class="content_fot_item">
											<span class="n">创建人</span>
											<span class="v">{{val.creatorName}}</span>
										</div>
										<div class="content_fot_item">
											<span class="n">日期</span>
											<span class='v'>{{val.createTime|time('y-m-d')}}</span>
										</div>
										<div class="content_fot_item">
											<span class="n">锁定件数</span>
											<span class="v">{{val.orderPackages}}</span>
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
	import head from "@/components/headBackTitle.vue"
	import options from '@/components/options.vue'
	export default {
		data() {
			return {
				tenantId: JSON.parse(this.$store.state.token).tenantId,
				shai: false,
				showSet: false,
				card: true,
				timer: true,
				selectStr: '',
				time: '',
				tabs: 1,
				t: '',
				selectData: {},
				select: {},
				tableList: [],
				fromTime: '',
				toTime: '',
				headShowObj: {},
				selectShowObj: {},

				warTable: [],
				showSelect: false, //是否显示筛选项
				isPersonneShow: false, //数据显示样式   表格/卡片
				datas: [],
				str: "",
				tableDatas: [],
				showhead: {},

				isTable:true,
				isSelect:false,
				multipleSelection:[],
				total:0,
				pageNum:1,
				option:{stat:null},
				options:{},
				creatorList:{},
				contactList:{},
				loadmore:false,
				dataList:[],
				setVisible:false,
				activeName:'first',
			}
		},
		mounted: function() {
			this.getOptions({});
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
				return JSON.parse(this.$store.state.setJson).selection.lockl
			},
			tableOptions:function(){
				return JSON.parse(this.$store.state.setJson).tableOptions.lockl
			}
		},
		methods: {
			/**
			 * 获取锁定数据
			 * @method getData
			 */
			getData(pageNum,pageSize,options,callback){
				let params = {
					tenantId:this.tenantId,
					pageNum:pageNum,
	        pageSize:pageSize,
				}
				params = Object.assign(params,options);
				this.$axios.get('/api/lockForm/showLockFormController',{params})
				.then(res=>{
					if(res.data&&res.data.data){
						this.dataList = this.dataList.concat(res.data.data.dataList);
						this.total = res.data.data.total;
					}
					callback?callback(res.data.data):null
				},()=>{callback?callback(false):null})
			},
			/**
			 * 获取筛选项
			 * @method getOptions
			 */
			getOptions(options){
				let params = {tenantId:this.tenantId};
				params = Object.assign(params,options);
				this.$axios.get('/api/lockForm/showLockFormController',{params})
				.then(res=>{
					if(res.data&&res.data.data){
						let data = res.data.data;
						let temp = {
							creatorId:[],
							contactId:[],
						}
						let creatorList = {};
						let contactList = {};
						data.forEach((val)=>{
							temp.creatorId.push(val.creatorId);
							temp.contactId.push(val.contactId);
							creatorList[val.creatorId] = val.creatorName;
							contactList[val.contactId] = val.fullName;
						})
						temp.creatorId = this.uniq(temp.creatorId);
						temp.contactId = this.uniq(temp.contactId);
						this.options = temp;
						this.creatorList = creatorList;
						this.contactList = contactList;
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
						this.$message.success('刷新完成');
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
	      this.option={stat:null};
	      this.refresh();
			},
			/**
	    * 更新筛选项字段
	    * @method updataSelections
	    */
	    updataSelections(data){
	      let setJson = JSON.parse(this.$store.state.setJson);
	      setJson.selection.lockl = data;
	      this.$store.commit('setSetJson',setJson);
	      this.refresh();
				this.upSetJson(setJson);
	    },
	    /**
	    * 表格字段更新
	    * @method updataTableOptions
	    */
	    updataTableOptions(data){
				let setJson = JSON.parse(this.$store.state.setJson);
				setJson.tableOptions.lockl = data;
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
			//获取锁定列表
			getDataList() {
				this.$axios({
					method: "get",
					url: "/api/lockForm/showLockFormController",
					params: {
						tenantId: this.tenantId
					}
				}).then(res => {
					if (res && res.data.data) {
						this.metaData = res.data.data;

						this.selectData = this.carSelectData(this.selObj, this.metaData, this);

						this.doSelectData();
					} else {
						this.tableList = [];
					}
				})
			},
			//选择时间
			checkTime(t) {
				this.time = '';
				this.t = t;
				this.toTime = Date.parse(new Date());
				this.fromTime = this.toTime - t * 24 * 60 * 60 * 1000;
				this.doSelectData()
			},
			//选择时间段
			checkDate() {
				this.t = '';
				this.toTime = Date.parse(new Date(this.time[1])) + 24 * 60 * 60 * 1000 - 1;
				this.fromTime = Date.parse(new Date(this.time[0]));
				this.doSelectData()
			},
			//晒选数据
			doSelectData() {
				let data = this.selectTime(this.fromTime, this.toTime, this.metaData, 'createTime');
				this.tableList = this.selectOption(this.selObj, data, this.select)
			},
			//清除筛选项
			clear() {
				this.t = '';
				this.time = '';
				this.select = {};
				this.fromTime = '';
				this.toTime = '';
				this.doSelectData();
			},
			//选择
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			//时间
			getLabel(v, k) {
				if (k === '截止时间') {
					return this.getYMD(v);
				}
				return v;
			},
			//刷新
			Refresh() {
				if (this.timer) {
					this.getDataList();
					this.timer = false;
					setTimeout(() => {
						this.timer = true;
					}, 5000)
				} else {
					this.$message('刷新太频繁');
				}
			},
			//新建
			buildNew() {
				this.$router.push({
					name: 'warlock'
				})
			},
			//导出
			toExcal() {
				let data = [];
				if (this.multipleSelection.length > 0) {
					data = this.multipleSelection;
				} else {
					data = this.tableList;
				}
				let str =
					'<tr><th>锁定单号</th><th>日期</th><th>创建人员</th><th>部门</th><th>锁定件数</th><th>锁定数量</th><th>截止时间</th><th>客户名称</th><th>备注</th></tr>'
				for (let i in data) {
					str += '<tr>';
					str += '<td>' + data[i].lockNo + '</td>';
					str += '<td>' + this.getYMD(data[i].createTime) + '</td>';
					str += '<td>' + data[i].creatorName + '</td>';
					str += '<td>' + this.bumen(data[i].userVO) + '</td>';
					str += '<td>' + data[i].orderPackages + '</td>';
					str += '<td>' + data[i].amount + '</td>';
					str += '<td>' + this.getYMD(data[i].expireTime) + '</td>';
					str += '<td>' + this.gongsi(data[i].userVO) + '</td>';
					str += '<td>' + data[i].memo + '</td>';
					str += '</tr>';
				}
				this.excal({
					tableStr: str,
					tableName: '库存锁定列表' + this.getYMDHMS(),
					tableWorksheet: '库存锁定'
				})
			},
			//部门
			bumen(data) {
				if (!data) return;
				if (data && data.deptName) return data.deptName;
				return
			},
			gongsi(data) {
				if (!data) return;
				if (data && data.companyName) return data.companyName;
				return
			},
			//生成表头控制
			buildHeadShow() {
				this.headShowObj = this.carHeadShow(this.midObj, this.headShowObj)
			},
			//生成筛选控制
			buildSelectShowObj() {
				this.selectShowObj = this.carHeadShow(this.selObj, this.selectShowObj)
			},
			//更新控制对象
			upHead(data) {
				this.headShowObj = data;
				this.showSet = false;
			},
			upSelect(data) {
				this.selectShowObj = data;
				this.showSet = false;
			},
			//关闭设置
			close() {
				this.showSet = false;
			},
			//过滤数据
			getValue(data, k) {
				if (k === '日期' || k === '截止时间') {
					return this.getYMD(data)
				}
				return data
			},
			//跳转到详情
			jumpPath(id) {
				this.$router.push({
					name: 'wardetail',
					params: {
						id: id
					}
				})
			}
		},
		filters: {
			filterDep: function(data) {
				if (!data) return;
				if (data && data.deptName) return data.deptName;
				return
			},
			filterName: function(data) {
				if (!data) return;
				if (data && data.companyName) return data.companyName;
				return
			}
		},
		components: {
			"v-head": head,
			"options":options
		}
	}
</script>
<style lang="scss" scoped>
	@import "@/assets/css/jxc/card.scss";
	.listModule .card_li .card_li_con {
		padding-bottom: 70%;
	}
	.content_fot .content_fot_item .n{
		width: 60px;
	}
	.content_fot .content_fot_item{
		height: 33%;
	}
</style>
