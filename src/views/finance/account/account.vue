<template lang="html">
	<div class="listModule">
		<div class="list_header">
			<ym-hbt :to='{name:"accountHome"}' title='资金账户'></ym-hbt>
		</div>
		<div class="list_setbar">
			<div class="list_setbar_options">
				<div class="option" @click='isTable = !isTable'>
					<div class="option_yuan"><i class="iconfont" :class="isTable?'jiugongge':'liebiao'"></i></div>
				</div>
				<div class="option" @click="getData">
					<div class="option_yuan"><i class="iconfont shuaxin"></i></div>
					<span class="option_txt">刷新</span>
				</div>
				<div class="option" @click="openNewAccount">
					<div class="option_yuan"><i class="iconfont xinjian"></i></div>
					<span class="option_txt">新建</span>
				</div>
				<div class="search_input">
					<i class="iconfont sousuo"></i>
					<input type="text" name="" value="">
				</div>
			</div>
		</div>
		<div class="list_main">
			<div class="list_main_table" v-show='isTable'>
				<div class="table">
					<el-table :data="accData" height='100%'>
						<el-table-column type="index" label='序号'></el-table-column>
						<el-table-column label='账户名称'>
							<template slot-scope='scope'><a href="javascript:void(0)" @click="openAccount(scope.row)">{{scope.row.name}}</a></template>
						</el-table-column>
						<el-table-column label='账户余额' prop='remainingSum'>
							<template slot-scope='scope'>{{scope.row.remainingSum|eMoney}}</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="table_fot">
					<span>总数：{{accData.length}}</span>
				</div>
			</div>
			<div class="list_main_card" v-show='!isTable'>
				<div class="card">
					<ul class="card_ul">
						<li class="card_li" v-for='(val,key) in accData' :key='key'>
							<div class="card_li_con">
								<div class="content" @click="openAccount(val)">
									<div class="content_left">
										<img :src="val.image|imgUrl">
									</div>
									<div class="content_right">
										<div class="content_right_row row1">
											<span class="n">名称:</span>
											<span class="v">{{val.name}}</span>
										</div>
										<div class="content_right_row row2">
											<span class="n">余额:</span>
											<span class="v">{{val.remainingSum}}</span>
										</div>
									</div>
								</div>
							</div>
						</li>
					</ul>
				</div>
				<div class="card_fot">
					<span>总数：accData.length</span>
				</div>
			</div>
		</div>
		<!-- 账号详情 -->
		<el-dialog :title='account.name' width='600px' :visible.sync='accountVisible' center v-dialogDrag>
			<div class="accountMain">
				<div class="mainLeft">
					<div class="accImg">
						<img :src="account.image|imgUrl">
						<i class="iconfont icon-shuaxin" @click='openCropper'>更新图片</i>
					</div>
				</div>
				<div class="mainRight">
					<div class="item"><span>余额：</span><span>{{account.remainingSum}}</span></div>
					<div class="item"><span>类型：</span><span>{{account.displayName}}</span></div>
					<div class="item"><a href="javascript:void(0)" @click='$refs.ch1.open()'>修改删除</a></div>
				</div>
			</div>
			<div class="accountFot">
				<div class="d1" @click="$refs.ch2.open()">
					<i class="iconfont cebian-shouzhijizhang"></i>
					<p>收支记账</p>
				</div>
				<div class="d2" @click="openTransfer">
					<i class="iconfont caiwu-zhanghaozhuanzhang"></i>
					<p>转账</p>
				</div>
				<div class="d3" @click="flowVisible=true">
					<i class="iconfont caiwu-caiwuliushui"></i>
					<p>资金流水</p>
				</div>
			</div>
		</el-dialog>
		<!-- 修改删除 -->
		<ym-choice ref='ch1' title='修改删除'>
			<ym-choiceoption title='修改' @open='openModify' icon='xiugai' slot='one'></ym-choiceoption>
			<ym-choiceoption title='删除' @open='removeAccount' icon='shanchu' slot='two'></ym-choiceoption>
		</ym-choice>
		<!-- 收支记账 -->
		<ym-choice ref='ch2' title='收支记账'>
			<ym-choiceoption title='记收入' @open='seeRoleIn' icon='caiwu-jizhangshouru' slot='one'></ym-choiceoption>
			<ym-choiceoption title='记支出' @open='seeRoleOut' icon='caiwu-jizhangzhichu' slot='two'></ym-choiceoption>
		</ym-choice>
		<!-- 记收入 -->
		<ym-inm ref='inMoney'></ym-inm>
		<!-- 记支出 -->
		<ym-outm ref='outMoney'></ym-outm>
		<!-- 转账 -->
		<ym-acc ref='acc'></ym-acc>
		<!-- 资金流水 -->
    <el-dialog width="900px" title="资金流水" center :visible.sync="flowVisible" v-dialogDrag>
      <div class="flow_top">
        <el-select size="mini" v-model="types" placeholder="请选择">
          <el-option label="收入" value="1"></el-option>
          <el-option label="支出" value="2"></el-option>
          <el-option label="借入" value="3"></el-option>
          <el-option label="借出" value="4"></el-option>
          <el-option label="转入" value="5"></el-option>
          <el-option label="转出" value="6"></el-option>
          <el-option label="借出还款" value="7"></el-option>
          <el-option label="借入还款" value="8"></el-option>
          <el-option label="销售收入" value="9"></el-option>
          <el-option label="采购支出" value="10"></el-option>
          <el-option label="其他收入" value="11"></el-option>
          <el-option label="其他支出" value="12"></el-option>
          <el-option label="仓储费" value="13"></el-option>
          <el-option label="卸柜费和其他仓库费用" value="14"></el-option>
          <el-option label="合同保证金" value="15"></el-option>
        </el-select>
      </div>
      <div class="flow_main table_style">
        <el-table :data="financeDtoList" height="100%" border>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="流水号" show-overflow-tooltip>
            <template slot-scope="scope"><a href="javascript:void(0)">{{scope.row.financeSn}}</a></template>
          </el-table-column>
          <el-table-column label="发生时间">
            <template slot-scope="scope">{{scope.row.pushTime|time('y-m-d')}}</template>
          </el-table-column>
          <el-table-column label="流水类型">
            <template slot-scope="scope">{{scope.row.type|type}}</template>
          </el-table-column>
          <el-table-column label="发生金额" prop="money"></el-table-column>
          <el-table-column label="余额" prop="remainingSum"></el-table-column>
          <el-table-column label="备注">
            <template slot-scope="scope">
              <el-tooltip effect="dark" :content="scope.row.memo" placement="top">
                <i class="el-icon-warning"></i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="相关内容">
            <template slot-scope="scope">
              <a href="javascript:void(0)">更多</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
		<!-- 资金流水详情 -->
		<el-dialog class="flowDetail" v-dialogDrag title='资金流水详情' :visible.sync="showFlowDetailDialog" center>
			<div class="detailBox">
				<div class="detailBoxTop ">
					<ul>
						<li><label>录入时间</label><span>{{moneyFlowDet.createTime|time('y-m-d')}}</span></li>
						<li><label>发声时间</label><span>{{moneyFlowDet.pushTime|time('y-m-d')}}</span></li>
						<li><label>发生金额</label><span style="color:#a74802">{{moneyFlowDet.money}}</span></li>
						<li><label>资金账户</label><span>{{moneyFlowDet.fromAccountName}}</span></li>
					</ul>
				</div>
				<div class="detailBoxTop ">
					<ul>
						<li><label>流水类型</label><span>{{moneyFlowDet.type | type}}</span></li>
						<li><label>经手人</label><span>{{moneyFlowDet.handledByName}}</span></li>
						<li><label>相关单号</label><span>{{moneyFlowDet.reffer|reffer}}</span></li>
						<li><label>备注</label><span>{{moneyFlowDet.memo}}</span></li>
					</ul>
				</div>
			</div>
			<div class="dialog_fot">
				<button class="sure" @click="showFlowDetailDialog=false">确定</button>
			</div>
		</el-dialog>
		<!-- 新建账户 -->
		<newacc ref='newacc' @cb='getData'></newacc>
		<!-- 图片剪裁框 -->
		<cropper ref='cropper'></cropper>
		<!-- 修改账户 -->
		<modifyacc ref='modify' @cb='setAccount'></modifyacc>
	</div>
</template>

<script>
	import headBackTitle from '@/components/headBackTitle.vue'
	import choice from '@/components/choice.vue'
	import choiceOption from '@/components/choiceOption.vue'
	import inMoney from '@/components/inMoney.vue'
	import outMoney from '@/components/outMoney.vue'
	import accTransfer from "@/components/accTransfer.vue"
	import newacc from './newAccount.vue'
	import cropper from '@/components/xcropper.vue'
	import modifyacc from './modifyAccount.vue'
	export default {
		components: {
			"ym-hbt": headBackTitle,
			'ym-choice': choice,
			'ym-choiceoption': choiceOption,
			'ym-inm': inMoney,
			'ym-outm': outMoney,
			'ym-acc': accTransfer,
			"newacc":newacc,
			"cropper":cropper,
			"modifyacc":modifyacc,
		},
		data() {
			return {
				isTable: true,
				tenantId: JSON.parse(this.$store.state.token).tenantId,
				accData: [],
				financeDtoList: [],
				showFlowDetailDialog: false,
				moneyFlowDet: {},
				role:JSON.parse(this.$store.state.role),
				account:{},
				accountVisible:false,
        flowVisible:false,
        types:null,
			}
		},
		methods: {
			/**
			* 获取账户列表
			* @method getData
			*/
			getData(){
				let loading = this.$loading({lock: true, text: '数据更新中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let params = {
					tenantId: this.tenantId
				};
				this.$axios.get('/apa/financeTable/showPaymentAccount',{params})
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						this.accData = res.data.data
					}else{
						this.$message.error('获取账户信息失败')
					}
				},()=>{loading.close();this.$message.error('获取账户信息失败')})
			},
			/**
			* 打开新建账户窗口
			* @method openNewAccount
			*/
			openNewAccount(){
				this.$refs.newacc.open();
			},
			/**
			* 打开账户详情
			* @method openAccount
			*/
			openAccount(data){
				let loading = this.$loading({lock: true, text: '数据更新中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let params = {
					tenantId: this.tenantId,
					paymentAccountId: data.id
				};
				this.$axios.get('/apa/financeTable/showPaymentAccount',{params})
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						this.accountVisible = true;
						this.account = res.data.data;
						this.financeDtoList = res.data.data.financeDtoList;
					}else{
						this.$message.error('获取账户信息失败')
					}
				},()=>{loading.close();this.$message.error('获取账户信息失败')})
			},
			/**
			* 打开截图框
			* @method openCropper
			*/
			openCropper(){
				let option = {
					title:'上传账户图片',
					msg:'建议大小2M',
					autoCropWidth:240,
					autoCropHeight:160,
					fixedNumber:[3,2],
				};
				this.$refs.cropper.open(option,(v)=>{
					let data = {
						tenantId: this.tenantId,
						image:v,
						id:this.account.id
					};
					this.modifyAccount(data,(val)=>{
						this.account.image = v
					})
				})
			},
			/**
			* 修改账户
			* @method modifyAccount
			*/
			modifyAccount(data,callback){
				let loading = this.$loading({lock: true, text: '数据更新中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				this.$axios.post('/apa/financeTable/modifyUserPaymentAccount',data)
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						callback(res.data.data)
					}else{
						this.$message.error('修改账户失败')
					}
				},()=>{loading.close();this.$message.error('修改账户失败')})
			},
			/**
			* 打开修改账户
			* @method openModify
			*/
			openModify(){
				if(!this.role.erp_account_mod) return this.$message.error('没有权限');
				this.$refs.modify.open(this.account);
			},
			/**
			* 接受修改结果
			* @method setAccount
			*/
			setAccount(data){
				this.account = JSON.parse(JSON.stringify(data));
				console.log(this.account)
			},
			/**
			* 删除账户
			* @method removeAccount
			*/
			removeAccount(){
				this.$message.success('暂时无法删除资金账户')
			},
			/**
			* 打开转账
			* @method openTransfer
			*/
			openTransfer(){
				this.$refs.acc.open()
			},
      /**
      * 记账收入
      * @method seeRoleIn
      */
			seeRoleIn(){
				if(!this.role.erp_inout_new){
					this.$message.error('没有权限');
				}else{
					this.$refs.inMoney.open(null)
				}
			},
      /**
      * 记账支出
      * @method seeRoleOut
      */
			seeRoleOut(){
				if(!this.role.erp_inout_new){
					this.$message.error('没有权限');
				}else{
					this.$refs.outMoney.open(null)
				}
			}
		},
		mounted() {
			this.getData();
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
          case 15: return '保证金';
					default: return '其他';
				}
			},
			reffer: function(data) {
				console.log(data)
				if (!!data) {
					data = JSON.parse('{"id":1,"type":1,"no":"XS00001"}');
					if (data.no) {
						return data.no;
					} else {
						return data.id;
					}
				} else {
					return;
				}
			},
		}
	};
</script>
<style lang="scss">
	.flowDetail .el-dialog {
		width: 500px;
		height: 600px;
	}
</style>
<style lang="scss" scoped>
	@import "@/assets/css/jxc/wldw/customer.scss";
	.listModule .card_li .card_li_con {
		padding-bottom: 60%;
	}
  .flow_top{
    height: 50px;
    line-height: 50px;
  }
  .flow_main{
    height: 500px;
  }

	/* 资金流水详情 */
	.detailBox {
		width: 330px;
		height: 520px;
		margin: 0 auto;

		.detailBoxTop {
			width: 100%;
			padding-top: 40px;

			&:nth-child(1) {
				border-bottom: 1px solid #dcdfe6;
			}

			ul {
				width: 300px;
				margin: 0 auto;

				li {
					height: 30px;
					line-height: 30px;
					margin-bottom: 20px;

					label {
						display: inline-block;
						width: 60px;
						text-align: right;
					}

					span {
						margin-left: 15px;
					}
				}
			}
		}
	}

	/* 账号详情 */
	.accountMain{
		height:180px;
		.mainLeft{
			float:left;
			width:200px;
			height:100%;
			position:relative;
			.accImg{
				position:absolute;
				width:120px;
				height:80px;
				top:50px;
				left:50%;
				transform:translateX(-50%);
				border:1px solid #ccc;
				img{
					width:100%;
					height:100%;
				}
				i{
					position:absolute;
					top:0;
					left:0;
					width:100%;
					height:100%;
					background-color:rgba(0,0,0,0.5);
					color:#fff;
					text-align:center;
					line-height:80px;
					display:none;
					cursor:pointer;
				}
				&:hover i{
					display:block;
				}
			}
		}
		.mainRight{
			float:left;
			width:calc(100% - 200px);
			height:100%;
			padding:50px 20px 0 20px;
			.item{
				float:left;
				width:50%;
				margin-bottom:20px;
				overflow: hidden;
				text-align: center;
				white-space: nowrap;
			}
		}
	}
	.accountFot {
		height: 100px;
    text-align: center;
		div {
			display: inline-block;
			width: 100px;
			height: 100px;
			background-color: rgb(241, 247, 255);
      margin-left: 30px;
      margin-right: 30px;
      border-radius: 50%;
      cursor: pointer;
			i {
				font-size: 30px;
				line-height: 60px;
				color: #666;
			}

			p {
				color: #666;
				font-size: 14px;
			}

			&:hover {
				i {
					color: #fff;
				}

				p {
					color: #fff;
				}
			}
		}

		.d1:hover {
			background-color: rgb(175, 119, 197);
		}

		.d2:hover {
			background-color: rgb(102, 188, 237);
		}

		.d3:hover {
			background-color: rgb(65, 218, 144);
		}
	}
</style>
