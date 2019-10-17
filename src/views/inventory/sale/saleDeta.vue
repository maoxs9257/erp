<template lang="html">
	<div class="deta">
		<div class="deta_header">
			<ym-hbt :to='{name:backName}' title='销售详情'></ym-hbt>
		</div>
		<div class="deta_mid">
			<div class="deta_mid_bar" :class="{short:short}">
				<div class="bar bar_left" @click="setVisible=true;activeName='first'">
					<i class="iconfont cebian-shezhi"></i>
					<span v-show='!short'>设置</span>
				</div>
				<div class="bar bar_left">
					<i class="iconfont daochu"></i>
					<span v-show='!short'>导出</span>
				</div>
				<div class="bar bar_right" @click='short=!short'>
					<i class="iconfont icon-you"></i>
				</div>
			</div>
			<div class="clearfix"></div>
			<div class="deta_mid_round">
				<div class="option round round1" v-if='!info.openApproveStatet'>审核</div>
				<div class="option round round1" @click='openExamine' v-if='info.openApproveStatet==1'>审核</div>
				<div class="option round round2" v-if='info.openApproveStatet==2'>已审核</div>
				<div class="option round round4" v-if='info.openApproveStatet==3'>审核拒绝</div>
				<div class="option"><i class="iconfont zhankai"></i></div>
        <div class="option round round1" v-if='!info.checkApproveState'>理货</div>
				<div class="option round round1" v-if='info.checkApproveState==1' @click='getStoreOutInfo'>理货</div>
				<div class="option round round2" v-if='info.checkApproveState==2' @click='getStoreOutInfo'>已理货</div>
				<div class="option"><i class="iconfont zhankai"></i></div>
        <div class="option round round1" v-if='!info.state'>确认</div>
				<div class="option round round1" @click='changeState' v-if='info.state==1||info.state==2'>确认</div>
				<div class="option round round2" v-if='info.state==3||info.state==7'>已确认</div>
				<div class="option"><i class="iconfont zhankai"></i></div>
        <div class="option round round1" v-if='!info.openApproveStatet'>收款</div>
				<div class="option round round1" v-if='info.prepayAmount==0' @click='openMoney'>收款</div>
				<div class="option round round3" v-if='info.receivableAmount>0&&info.prepayAmount>0' @click='openMoney'>收款</div>
				<div class="option round round2" v-if='info.receivableAmount==0'>收款</div>
				<div class="option"><i class="iconfont zhankai"></i></div>
				<div class="option round" v-if='info.state!=7'>出库</div>
				<div class="option round round3" v-if='info.state==6'>出库中</div>
				<div class="option round round2" v-if='info.state==7'>出库</div>
			</div>
			<div class="deta_mid_main">
				<div class="deta_mid_infos">
					<div class="deta_infos_row">
						<div class="deta_row_item" title='sadadad'>
							<span class="n">销售单号：</span>
							<span class="v">{{info.orderNo}}</span>
						</div>
						<div class="deta_row_item" title='sadadad'>
							<span class="n">车号：</span>
							<span class="v">{{info.carNo}}</span>
						</div>
						<div class="deta_row_item" title='sadadad'>
							<span class="n">销售员：</span>
							<span class="v">{{info.creatorName}}</span>
						</div>
						<div class="deta_row_item" title='sadadad'>
							<span class="n">销售时间：</span>
							<span class="v">{{info.createTime|time('y-m-d')}}</span>
						</div>
					</div>
					<div class="deta_infos_row">
						<div class="deta_row_item" title='sadadad'>
							<span class="n">客户名称：</span>
							<span class="v">{{info.fullName}}</span>
						</div>
						<div class="deta_row_item" title='sadadad'>
							<span class="n">联系电话：</span>
							<span class="v">{{info.phone}}</span>
						</div>
						<div class="deta_row_item" title='sadadad'>
							<span class="n">收货人：</span>
							<span class="v">{{info.displayName}}</span>
						</div>
						<div class="deta_row_item" title='sadadad'>
							<span class="n">销售部门：</span>
							<span class="v">{{info.deptName}}</span>
						</div>
					</div>
					<div class="deta_infos_row">
						<div class="deta_row_item" title='sadadad'>
							<span class="n">预销售金额：</span>
							<span class="v">{{info.orderAmount}}</span>
						</div>
						<div class="deta_row_item" title='sadadad'>
							<span class="n">实销售金额：</span>
							<span class="v">{{liTable|sumPrice}}</span>
						</div>
						<div class="deta_row_item" title='sadadad'>
							<span class="n">已付金额：</span>
							<span class="v">{{info.prepayAmount}}</span>
						</div>
						<div class="deta_row_item" title='sadadad'>
							<span class="n">待收金额：</span>
							<span class="v">{{info.receivableAmount}}</span>
						</div>
					</div>
					<div class="deta_infos_row">
						<div class="deta_row_item" title='sadadad'>
							<span class="n">优惠金额：</span>
							<span class="v">{{info.preferentialAmount}}</span>
						</div>
						<div class="deta_row_item" title='sadadad'>
							<span class="n">备注：</span>
							<span class="v">{{info.memo==="null"?"":info.memo}}</span>
						</div>
					</div>
				</div>
				<div class="deta_mid_table">
					<div class="deta_mid_top">
						<el-table :data='table'>
							<el-table-column type='index' label='序号'></el-table-column>
							<el-table-column v-if="tableShow[val]" show-overflow-tooltip v-for='(val,key) in tableConfig' :key='key' :label='val' :prop='val'></el-table-column>
							<el-table-column v-if="tableShow.wareName" show-overflow-tooltip label='仓库' prop='wareName'></el-table-column>
							<el-table-column label='数量' prop='goodsNum'></el-table-column>
							<el-table-column label='单价' prop='price'></el-table-column>
							<el-table-column label='销售金额' prop='totalAmount'></el-table-column>
							<el-table-column v-if='info.openApproveStatet!=2'>
								<template slot-scope='scope'>
									<i @click='openModifyGoods(scope.row)' class="i1 iconfont xiugai"></i>
									<i @click='openRemove(scope.row)' class="i1 iconfont shanchu"></i>
								</template>
							</el-table-column>
						</el-table>
					</div>
					<div class="deta_mid_fot" v-if='info.checkApproveState==2'>
						<div class="deta_infos_row deta_mid_fot_row clearfix">
							<div class="deta_row_item">
								<span class="n">出库数量：</span>
								<span class="v">{{liTable|sumAmount}}</span>
							</div>
							<div class="deta_row_item">
								<span class="n">出库件数：</span>
								<span class="v">{{liTable.length}}</span>
							</div>
						</div>
						<el-table :data='liTable'>
							<el-table-column type='index' label='序号'></el-table-column>
							<el-table-column show-overflow-tooltip v-for='(val,key) in tableConfig' :key='key' :label='val' :prop='val'></el-table-column>
							<el-table-column label='单价' prop='price'></el-table-column>
							<el-table-column label='销售金额' prop='salePrice'></el-table-column>
						</el-table>
					</div>
				</div>
			</div>
		</div>
		<!-- 修改商品信息 -->
		<el-dialog class="modify" title='修改信息' center :visible.sync='modifyVisible' v-dialogDrag>
			<div class="modify_box">
				<div class="modify_box_top">
					<div class="box_item" v-for='(val,key) in tableConfig' :key='key'>
						<span class="n">{{val}}：</span>
						<span class="v">{{modifyData[val]}}</span>
					</div>
				</div>
				<div class="modify_box_fot">
					<div class="box_item">
						<span class="n">最大件数：</span>
						<span class="v">{{modifyData.maxNum}}</span>
					</div>
					<div class="box_item">
						<span class="n">件数：</span>
						<el-input-number style="margin-left:20px;width:200px" size='mini' v-model="modifyData.goodsNum" :min="1" :max="modifyData.maxNum"></el-input-number>
					</div>
					<div class="box_item">
						<span class="n">单价：</span>
						<el-input-number style="margin-left:20px;width:200px" size='mini' v-model="modifyData.price" :precision="2" :min='0'></el-input-number>
					</div>
					<div class="box_item">
						<span class="n">总价：</span>
						<span class="v">{{modifyData.price*modifyData.goodsNum}}</span>
					</div>
				</div>
			</div>
			<div class="dialog_fot">
				<button type="button" @click='modifyGoods' class="sure">确定</button>
				<button type="button" class="pass" @click='modifyVisible=false'>取消</button>
			</div>
		</el-dialog>
		<!-- 订单审核 -->
		<el-dialog class="examine" title='订单审核' center :visible.sync='examineVisible' v-dialogDrag>
			<div class="examine_main">
				<div class="examine_main_top">
					<div class="examine_row">
						<div class="examine_row_item">
							<span class="left">销售单号:</span>
							<span class="right">{{info.orderNo}}</span>
						</div>
						<div class="examine_row_item">
							<span class="left">车号:</span>
							<span class="right">{{info.carNo}}</span>
						</div>
						<div class="examine_row_item">
							<span class="left">销售员:</span>
							<span class="right">{{info.creatorName}}</span>
						</div>
						<div class="examine_row_item">
							<span class="left">销售时间:</span>
							<span class="right">{{info.createTime|time('y-m-d')}}</span>
						</div>
					</div>
					<div class="examine_row">
						<div class="examine_row_item">
							<span class="left">客户名称:</span>
							<span class="right">{{info.fullName}}</span>
						</div>
						<div class="examine_row_item">
							<span class="left">联系电话:</span>
							<span class="right">{{info.phone}}</span>
						</div>
						<div class="examine_row_item">
							<span class="left">收货人:</span>
							<span class="right">{{info.displayName}}</span>
						</div>
						<div class="examine_row_item">
							<span class="left">销售部门:</span>
							<span class="right">{{info.deptName}}</span>
						</div>
					</div>
				</div>
				<div class="examine_main_fot">
					<el-table :data='table' height='100%'>
						<el-table-column align='center' type='index' label='序号'></el-table-column>
						<el-table-column align='center' v-for='(val,key) in tableConfig' :key='key' :label="val" :prop='val'></el-table-column>
					</el-table>
				</div>
			</div>
			<div class="dialog_fot">
				<button type="button" @click='create' class="sure">通过</button>
				<button type="button" @click='examine(3)' class="pass">拒绝</button>
			</div>
		</el-dialog>
		<!-- 理货 -->
		<el-dialog class="tally" title='理货' center :visible.sync='tallyVisible' v-dialogDrag>
			<div class="tally_main">
				<el-tabs v-model="activeName">
					<el-tab-pane v-for='(val,key) in tallyData' :key='key' :label='key' :name='key'></el-tab-pane>
<!-- 添加设置和导出 -->
					<div class="deta_mid_bar" :class="{short:short}">
						<div class="bar bar_left" @click="setVisible=true;activeName='first'">
							<span v-show='!short'>设置</span>
						</div>
						<div class="bar bar_left">
							<span v-show='!short'>导出</span>
						</div>
					</div>
				</el-tabs>
				<el-table :data='tallyData[activeName]'>
					<el-table-column align='center' type='index' label='序号'></el-table-column>
					<el-table-column align='center' width='63' show-overflow-tooltip v-for='(val,key) in tableConfig' :label='val'
					 :prop='val' :key='key'></el-table-column>
					<el-table-column align='center' label='可用库存' prop='goodsNum'></el-table-column>
					<el-table-column align='center' label='出库库存' prop='chuNum'></el-table-column>
					<el-table-column align='center' width='60' label='理货' prop='loState' fixed='right'>
						<template slot-scope='scope'>
              <i class="iconfont weijinhang icon_noFinish" v-if="scope.row.storeState!=2&&scope.row.storeState!=9"></i>
              <i class="iconfont yiwancheng1 icon_finish" v-if="scope.row.storeState==2||scope.row.storeState==9"></i>
						</template>
					</el-table-column>
					<el-table-column align='center' width='60' label='出库' prop='loState' fixed='right'>
						<template slot-scope='scope'>
              <i class="iconfont weijinhang icon_noFinish" v-if="scope.row.storeState!=9"></i>
              <i class="iconfont yiwancheng1 icon_finish" v-if="scope.row.storeState==9"></i>
						</template>
					</el-table-column>
				</el-table>
				<!-- 出库明细 -->
				<div class="tally_main_fot">
					<div class="tally_fot_title">
						<div class="tally_title_item">
							<i class="iconfont "></i>
<!--							去掉打印-->
							<!-- <span>打印</span> -->
						</div>
						<p>出货明细</p>
					</div>
					<el-table :data='liTable'>
						<el-table-column align='center' type='index' label='序号'></el-table-column>
						<el-table-column align='center' v-for='(val,key) in tableConfig' :label='val' :prop='val' :key='key'></el-table-column>
					</el-table>
				</div>
			</div>
		</el-dialog>
		<!-- 收款 -->
		<el-dialog width='520px' title='收款' center :visible.sync='moneyVisible' v-dialogDrag>
			<div class="money_main">
				<div class="money_main_item">
					<i class="ic iconfont shifu"></i>
					<el-input-number style='width:100%' :precision="2" v-model="price" @change='changePrice' :min="0" :max='info.receivableAmount'></el-input-number>
					<span class="sp" @click='showPreferentialAmount=true'>{{showPreferentialAmount?'实付金额':'显示优惠'}}</span>
				</div>
				<div class="money_main_item" v-if='info.preferentialAmount>0||showPreferentialAmount'>
					<i class="ic iconfont youhuijine"></i>
					<el-input-number style='width:100%' @change='changePreferentialAmount' :precision="2" v-model="preferentialAmount" :min="0" :max='info.receivableAmount'></el-input-number>
					<span class="sp">优惠金额</span>
				</div>
				<div class="money_main_item">
					<i class="ic iconfont zhanghu"></i>
					<el-select v-model='acckey' placeholder='选择账户' style='width:100%'>
						<el-option v-for='(val,key) in accData' :key='key' :label='val.name' :value='key'></el-option>
					</el-select>
				</div>
				<div class="money_main_item">
					<i class="ic iconfont riqi"></i>
					<el-date-picker style='width:100%' v-model="priceTime" type="date" placeholder="选择日期"></el-date-picker>
				</div>
				<el-input type="textarea" placeholder="请输入内容" :autosize="{minRows:3}" v-model="memo" maxlength="50" show-word-limit></el-input>
			</div>
			<div style="text-align:center">
				<el-button size='small' type='primary' plain @click='moneyVisible=false'>取消</el-button>
				<el-button size='small' type='primary' @click='collectMoney'>确定</el-button>
			</div>
		</el-dialog>
    <!-- 设置 -->
    <el-dialog title='设置' center :visible.sync='setVisible' width='800px' v-dialogDrag>
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
		  "options":options
		},
		data() {
			return {
				userId: JSON.parse(this.$store.state.token).id,
				tenantId: JSON.parse(this.$store.state.token).tenantId,
				short: false,
				id: this.$route.query.id,
				backName: this.$route.query.backName,
				info: {},
				table: [],
				tableConfig: [],
				modifyVisible: false,
				modifyData: {},
				examineVisible: false,
				tallyVisible: false,
				tallyData: {},
				activeName: '',
				liTable: [],
				moneyVisible: false,
				preferentialAmount: 0,
				price: 0,
				priceTime: '',
				accData: [],
				acckey: '',
				memo: '',
				showPreferentialAmount: false,
				role: JSON.parse(this.$store.state.role),
		    setVisible:false,
			}
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
				if(this.table[0]){
					return JSON.parse(this.$store.state.setJson).tableOptions.SD[this.table[0].品类];
				}else{
					return [];
				}
			},
	  },
		methods: {
			// 获取数据
			getData(){
				if(!this.id) return this.$message.error('缺少订单信息');
				let params = {id:this.id};
				this.$axios.get('/aps/sell/showSellFormInfo',{params})
				.then(res=>{
					if(res.data&&res.data.data){
						let data = res.data.data;
						for(let i in data){
							this.info = this.stringToObject(i);
							this.table =this.setTable(data[i])
						}
						this.getLiData(this.info.checkApproveState);
					}
				})
			},
			// 字符串装对象
			stringToObject(string){
				let start = string.indexOf('(');
				let end = string.indexOf(')');
				string = string.substring(start + 1, end);
				let arr = string.split(',')
				let obj = {}
				for (let i in arr) {
					obj[arr[i].split('=')[0].replace(/\s/, '')] = arr[i].split('=')[1]
				}
				return obj;
			},
			//	商品数据
			setTable(arr) {
				let sumPrice = 0;
				for (let i in arr) {
					Object.assign(arr[i], this.proData(arr[i].arrtibuteValue));
					arr[i].立方数 = arr[i].amount;
				}
				this.tableConfig = this.GLOBAL_.tableConfig[arr[0].品类];
				return arr
			},
			// 删除商品
			openRemove(data){
				this.$confirm('此操作将永久删除, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.removeGoods(data)
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			removeGoods(data){
				if (!this.role.erp_sale_mod) return this.$message.error('没有修改权限');
				let loading = this.$loading({lock: true, text: '删除商品', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let data1 = {
					id: data.sellDetailId,
					status: 0
				}
				this.$axios.post('/aps/sell/modifySellFormDetail',data1)
				.then(res=>{
					if(res.data&&res.data.data){
						let data2 = {
							id: this.id,
							tenantId: this.tenantId,
							orderPackages:this.info.orderPackages - data.goodsNum,
							orderAmount: this.info.orderAmount - data.totalAmount,
							receivableAmount: this.info.orderAmount - data.totalAmount - this.info.prepayAmount - this.info.preferentialAmount,
						}
						this.modifySale(data2,(v)=>{
							loading.close();
							if(v){
								this.$message.success('修改成功');
								this.getData();
							}else{
								this.$message.error('修改失败')
							}
						})
					}
				})
			},
			// 打开商品修改窗口
			openModifyGoods(data){
				if (!this.role.erp_sale_mod) {
					this.$message.error('没有修改权限')
				} else {
					this.modifyVisible = true;
					this.modifyData = JSON.parse(JSON.stringify(data));
					this.modifyData.maxNum = this.modifyData.packageNumber - this.modifyData.lockedNumber + this.modifyData.goodsNum;
				}
			},
			// 修改商品
			modifyGoods(){
				if(!this.role.erp_sale_mod) return this.$message.error('没有权限');
				let loading = this.$loading({lock: true, text: '修改中', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let data = {
					id:this.modifyData.sellDetailId,
					goodsNum:this.modifyData.goodsNum,
					packageId:this.modifyData.id,
					salePrice: this.modifyData.price
				}
				this.$axios.post('/aps/sell/modifySellFormDetail',data)
				.then(res=>{
					if(res.data&&res.data.data){
						let sumPrice=0;
						let num = 0;
						for (let i in this.table) {
							if (this.table[i].id == this.modifyData.id) {
								this.table[i].goodsNum = this.modifyData.goodsNum;
								this.table[i].price = this.modifyData.price;
								this.table[i].totalAmount = this.modifyData.price * this.modifyData.goodsNum;
							}
							sumPrice += parseFloat(this.table[i].totalAmount);
							num += this.table[i].goodsNum
						}
						let data = {
							id: this.id,
							orderAmount: sumPrice,
							orderPackages:num,
							receivableAmount: sumPrice - this.info.prepayAmount - this.info.preferentialAmount,
							tenantId: this.tenantId,
						}
						this.modifySale(data,(v)=>{
							this.modifyVisible=false;
							loading.close();
							if(v){
								this.$message.success('修改成功');
								this.getData();
							}else{
								this.$message.error('修改失败')
							}
						})
					}else{
						loading.close()
					}
				},()=>{loading.close()})
			},
			// 修改销售单
			modifySale(data,callback){
				this.$axios.post('/aps/sell/modifySellDetail',data)
				.then(res=>{
					if(res.data&&res.data.data){
						callback(true);
					}else{
						callback(false);
					}
				},()=>{callback(false)})
			},
			// 打开审核窗口
			openExamine() {
				if (!this.role.erp_sale_mod) {
					this.$message.error('没有修改权限')
				} else {
					this.examineVisible = true;
				}
			},
			// 审核销售单
			examine(i){
				let loading = this.$loading({lock: true, text: '审核中', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let data = {
					id:this.id,
					openApproveStatet: i,
					openApproverId: this.userId,
					openApproveTime:new Date(),
				}
				this.$axios.post('/aps/sell/modifySellDetail',data)
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						this.examineVisible = false;
						this.getData();
					}else{
						this.$message.error('审核失败')
					}
				},()=>{loading.close();this.$message.error('审核失败')})
			},
			// 创建预出库单并修改审核状态
			create(){
				let loading = this.$loading({lock: true, text: '创建中', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let params = {
					sellId: this.id,
					tenantId: this.tenantId,
					createorId: this.userId,
					openApproveStatet: 2,
					openApproverId: this.userId,
					openApproveTimeString:this.time(new Date(),'y-m-d'),
          state:2,
				}
				this.$axios.get('/aps/sell/createStoreOutForm',{params})
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						this.examineVisible = false;
						this.getData();
					}
				},()=>{loading.close()})
			},
			// 获取理货商品数据
			getLiData(state){
				let goodsId = '';
				for (let i in this.table) {
					goodsId += this.table[i].id + ','
				}
				let params = {
					sellFormId: this.id,
					goodsId: goodsId
				}
				this.$axios.get('/aps/sell/showGoodsDetail',{params})
				.then(res=>{
					if(res.data&&res.data.data){
						let data = res.data.data;
						for(let i in data){
							data[i].立方数 =data[i].amount;
							data[i] = Object.assign(data[i],this.proData(data[i].attributeValue));
							for(let n in this.table){
								if(this.table[n].id===data[i].goodsId){
									data[i].salePrice = this.table[n].price
								}
							}
						};
						this.liTable = data;
					}
				})
			},
			// 确认销售单
			changeState(){
				if (!this.role.erp_sale_mod) return this.$message.error('没有权限');
				if(this.info.openApproveStatet!=2) return this.$message.error('请先审核');
				if (this.info.checkApproveState!=2) return this.$message.error('请先理货');
				let price = 0;
				for(let i in this.liTable){
					price += this.liTable[i].salePrice
				}
				let data = {
					id: this.id,
					state:3,
					orderAmount:price
				};
				let params = {
				    id:this.id,
            orderAmount:price
				};
				this.$axios.get('/api/storeOutForm/confirm',{params})
				.then(res=>{
					if(res.data&&res.data.data){
						this.info.state = 3;
						this.info.orderAmount = price;
					}
				})
			},
			// 获取出库单信息
			getStoreOutInfo(){
				let loading = this.$loading({lock: true, text: '数据更新中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let params = {
					tenantId:this.tenantId,
					sellFormId:this.id
				};
				this.$axios.get('/api/storeOutForm/showStoreOutForm',{params})
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						this.createLiGoods(res.data.data)
					}else{
						this.$message.error('获取仓库理货信息失败')
					}
				},()=>{loading.close();this.$message.error('获取仓库理货信息失败')})
			},
			// 处理理货数据
			createLiGoods(data){
				let liData = this.liTable;
				let storeState = {};
				for(let i in data){
					storeState[data[i].warestoreId] = data[i].state
				}
				for(let i in liData){
					liData[i].storeState = storeState[liData[i].warestoreId]
				}
				let storeGoodsData = {};
				for(let i in this.table){
					for(let n in liData){
						if(this.table[i].id==liData[n].goodsId){
							this.table[i].storeState = liData[n].storeState;
							break;
						}
					};
					this.table[i].chuNum = this.setChuNum(this.table[i].id);
					if (storeGoodsData[this.table[i].wareName]) {
						storeGoodsData[this.table[i].wareName].push(this.table[i])
					} else {
						storeGoodsData[this.table[i].wareName] = [this.table[i]];
					}
				}
				this.tallyData = storeGoodsData;
				for (let i in storeGoodsData) {
					this.activeName = i;
					break;
				}
				this.tallyVisible = true;
			},
			// 打开收费弹窗
			openMoney(){
				if(!this.role.erp_pay_new) return this.$message.error('没有权限');
				let loading = this.$loading({lock: true, text: '收费中', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				this.$axios.get('/aps/sell/showByUserPayment/'+this.tenantId)
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						this.accData = res.data.data;
						this.moneyVisible = true;
						this.showPreferentialAmount = false;
						this.preferentialAmount = this.info.preferentialAmount;
						this.price = this.info.receivableAmount;
					}else{
						this.$message.error('获取账户信息失败')
					}
				},()=>{loading.close();this.$message.error('获取账户信息失败')})
			},
			// 修改优惠金额
			changePreferentialAmount(){
				this.price = this.info.receivableAmount - this.preferentialAmount
			},
			// 修改金额
			changePrice(){
				if(this.info.receivableAmount<this.price+this.preferentialAmount){
					this.preferentialAmount = this.info.receivableAmount - this.price;
				}
			},
			// 收钱
			collectMoney(){
				if(!this.role.erp_pay_new) return this.$message.error('没有权限');
				let loading = this.$loading({lock: true, text: '付款中', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let data = {
					tenantId: this.tenantId,
					creatorId: this.userId,
					toAccountName: this.accData[this.acckey].name,
					toAccountType: this.accData[this.acckey].displayName,
					toPaymentAccountId: this.accData[this.acckey].id,
					type: 9,
					updateTime: new Date(),
					pushTime: new Date(this.priceTime),
					status: 1,
					reffer: this.info.orderNo,
					money: this.price,
					memo: this.memo,
					fromAccountName: 'undefind',
					fromAccountType: 'undefind',
				};
				this.$axios.post('/apa/financeTable/addFinanceTable',data)
				.then(res=>{
					if(res.data&&res.data.data){
						this.modifySalePrice(loading);
					}else{
						loading.close();
						this.$message.error('付款失败')
					}
				},()=>{loading.close();this.$message.error('付款失败')})
			},
			// 修改销售单价钱
			modifySalePrice(loading){
				let data = {
					sellForm: {
						orderAmount: this.info.orderAmount, // 总价
						prepayAmount: parseFloat(this.info.prepayAmount) + parseFloat(this.price),  //衣服
						receivableAmount: this.info.orderAmount - this.preferentialAmount - this.price - this.info.prepayAmount, // 待付
						preferentialAmount: this.preferentialAmount, //
						id: this.id
					},
					collectMoney: {
						actualMoney: this.price,
						discountPrice: this.preferentialAmount,
						operatorId: this.userId,
						orderSn: this.info.orderNo
					}
				};
				this.$axios.post('/api/storeOutForm/Receivables',data)
				.then(res=>{
					loading.close();
					this.moneyVisible = false;
					this.getData();
				},()=>{loading.close();this.$message.error('修改销售单失败')})
			},
			//删除详情
			removeDeta() {
				if (!this.role.erp_sale_del) {
					this.$message.error('没有删除权限');
					return;
				}
				this.$axios({
					method: 'post',
					url: '/aps/sell/modifySellDetail',
					data: {
						id: this.id,
						status: 0
					}
				}).then(res => {
				})
			},
			// 添加详情
			//设置预览出库数量
			setChuNum(id) {
				let num = 0;
				for (let i in this.liTable) {
					if (id == this.liTable[i].goodsId) {
						num++
					}
				}
				return num;
			},
      // 表格字段更新
      updataTableOptions(data){
      	let setJson = JSON.parse(this.$store.state.setJson);
      	setJson.tableOptions.SD[this.table[0].品类] = data;
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
		},
		mounted() {
			this.getData();
		},
		filters:{
			sumAmount:function(data){
				let num = 0;
				for(let i in data){
					num += data[i].amount
				}
				return num;
			},
			sumPrice:function(data){
				let price = 0;
				for(let i in data){
					price += data[i].salePrice
				}
				return price;
			}
		}
	};
</script>
<style>
	.modify .el-dialog {
		width: 460px;
	}
	.examine .el-dialog {
		width: 900px;
	}
	.tally .el-dialog {
		width: 980px;
	}

	.money_main_item .el-input-number span{
		display: none;
	}

	.money_main_item .el-input__inner{
		border-top:none;
		border-left:none;
		border-right:none;
		border-radius: 0;
	}
	.money_main_item .el-select .el-input__inner{
		text-align: center;
		padding-left: 30px;
	}
	.money_main_item .el-date-editor .el-input__inner{
		text-align: center;
	}
	.money_main_item .el-date-editor i{
		display: none;
	}
</style>
<style lang="scss" scoped>
	
  .deta_mid_top .el-table tr{
    &:hover .i1{
      color: #0d8ce2;
    }
    .i1{
      font-size: 18px;
      cursor: pointer;
      color: #ffffff;
    }
  }

	.money_main {
		padding: 0 100px 30px;

		.money_main_item {
			height: 40px;
			margin-bottom: 10px;
			position: relative;

			input {
				border: 0;
				border-bottom: 1px solid #dddddd;
				width: 100%;
				height: 40px;
				padding: 0 50px;
				text-align: center;

				&:focus {
					border-bottom: 1px solid #00a0e9;
				}
			}

			.ic {
				position: absolute;
				top: 2px;
				left: 8px;
				font-size: 24px;
				z-index: 1;
			}

			.sp {
				position: absolute;
				top: 0;
				right: 0;
				font-size: 12px;
				line-height: 40px;
			}

		}

		.money_main_textarea {
			width: 100%;
			height: 80px;
			border-color: #dddddd;
		}
	}


	.deta_mid_main {
		height: calc(100% - 140px);
		overflow: auto;
	}
	.examine .dialog_fot .sure {
		color: #ffffff;
		background: #409EFF;
		border-color: #409EFF;
	}

	.examine .dialog_fot .pass {
		color: #ffffff;
		background: #E77762;
		border-color: #E77762;
	}

	.examine_main {
		padding: 0 30px 30px;

		.examine_main_top {
			border-bottom: 1px solid #dddddd;

			.examine_row {
				height: 40px;
				line-height: 40px;
				border-bottom: 1px dashed #dddddd;

				&:last-child {
					border: none;
				}

				.examine_row_item {
					float: left;
					width: 25%;
					line-height: 40px;

					.left {
						display: inline-block;
						width: 90px;
						text-align: right;
					}

					.right {
						width: calc(100% - 95px);
					}

					span {
						font-size: 12px;
						color: #666666;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						vertical-align: middle;
						display: inline-block;
					}
				}
			}
		}

		.examine_main_fot {
			height: 300px
		}
	}


	//修改商品信息
	.modify_box {
		padding: 20px 50px;

		.modify_box_top {
			border-bottom: 1px solid #d8d8d8;
		}

		.modify_box_fot {
			padding-top: 20px;
		}

		.box_item {
			height: 30px;
			line-height: 30px;
			margin-bottom: 5px;

			span {
				float: left;
			}

			.n {
				width: 80px;
				text-align: right;
			}

			.v {
				width: calc(100% - 85px);
				padding: 0 20px;
				text-indent: 1em;
			}

			input.v {
				padding: 0;
				height: 30px;
				border-radius: 3px;
				border: 1px solid #d8d8d8;
				width: calc(100% - 150px);
				margin-left: 20px;

				&:focus {
					border-color: #00a0e9;
				}
			}
		}
	}

	.tally_main {
		padding: 0 30px;
		height: 480px;
		overflow: auto;

		i {
			font-size: 18px;
		}

		.nn {
			color: #9bc657;
		}

		.tally_fot_title {
			height: 35px;

			p {
				line-height: 35px;
				text-align: center;
				font-size: 16px;
			}

			.tally_title_item {
				float: right;
				margin-top: 5px;
				height: 20px;
			}
		}
	}

	.deta_mid_top {
		padding-bottom: 40px;
		border-bottom: 2px dashed #dddddd;
	}
	.deta_mid_fot{
		padding-bottom: 40px;
	}
	.deta_mid_fot_row {
		border-bottom: 1px solid #dddddd;
	}
</style>
