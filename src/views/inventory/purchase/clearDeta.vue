<template lang="html">
	<div class="deta">
		<div class="deta_header">
			<ym-hbt :to='{name:back}' title='清关单详情'></ym-hbt>
		</div>
		<div class="deta_mid">
			<div class="deta_mid_bar" :class="{short:short}">
				<div class="bar bar_left" @click="setVisible=true">
					<i class="iconfont cebian-shezhi"></i>
					<span v-show='!short'>设置</span>
				</div>
				<div class="bar bar_left">
					<i class="iconfont daochu"></i>
					<span v-show='!short'>导出</span>
				</div>
				<div class="bar bar_right" @click='short=!short'>
					<i v-if="!short" class="el-icon-arrow-right"></i>
					<i v-if="short" class="el-icon-arrow-left"></i>
				</div>
			</div>
			<div class="clearfix"></div>
			<div class="deta_mid_round">
				<div class="option round round1" v-if='detaInfo.clearanceApproveState==1' @click='shenHe'>审核</div>
				<div class="option round round2" v-if='detaInfo.clearanceApproveState==2'>已审核</div>
				<div class="option"><i class="iconfont zhankai"></i></div>
				<div class="option round round1" v-if='detaInfo.state <4' @click='sure'>确认</div>
				<div class="option round round2" v-if='detaInfo.state >=4'>已清关</div>
				<div class="option"><i class="iconfont zhankai"></i></div>
				<div class="option round round1" v-if='detaInfo.clearancePayment==0&&detaInfo.clearancePrice>0' @click='openMoney'>付款</div>
				<div class="option round round2" v-if='detaInfo.clearancePrice==0||detaInfo.clearancePayment==detaInfo.clearancePrice'>已付款</div>
				<div class="option round round3" v-if='detaInfo.clearancePrice-detaInfo.clearancePayment>0&&detaInfo.clearancePayment>0'
				 @click='openMoney'>付款</div>
			</div>
			<div class="deta_mid_main">
				<div class="deta_mid_infos">
					<div class="deta_infos_row">
						<div class="deta_row_item">
							<span class="n">提单号：</span>
							<span class="v">{{detaInfo.outterNo}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">时间：</span>
							<span class="v">{{detaInfo.createTime|time('y-m-d')}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">清关公司：</span>
							<span class="v">{{detaInfo.lineCompanyName}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">开证公司：</span>
							<span class="v">{{detaInfo.openCompanyName}}</span>
						</div>
					</div>
					<div class="deta_infos_row">
						<div class="deta_row_item">
							<span class="n">清关总价：</span>
							<span class="v">{{detaInfo.clearancePrice}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">应付金额：</span>
							<span class="v">{{detaInfo.clearancePrice-detaInfo.clearancePayment}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">创建人：</span>
							<span class="v">{{detaInfo.creatorName}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">备注：</span>
							<span class="v">{{detaInfo.memo==='null'?"":detaInfo.memo}}</span>
						</div>
					</div>
				</div>
				<div class="deta_mid_table">
					<table>
						<tr>
							<th>序号</th>
							<th v-if="tableShow.orderSn">提单号</th>
							<th v-if="tableShow.clearLine">路线</th>
							<th v-if="tableShow.clearPrice">单价</th>
							<th v-if="tableShow.thcPrice&&detaInfo.isThc==1">THC</th>
							<th v-if="tableShow.buyBoxNum">总柜数</th>
							<th v-if="tableShow.clearancePrice">金额</th>
							<th v-if="tableShow.purposeAmount">总数量</th>
							<th v-if="tableShow.dan">清关单价</th>
						</tr>
						<tr>
							<td>1</td>
							<td v-if="tableShow.orderSn">{{detaInfo.orderSn}}</td>
							<td v-if="tableShow.clearLine">{{detaInfo.clearLine}}</td>
							<td v-if="tableShow.clearPrice">{{detaInfo.clearPrice}}</td>
							<td v-if="tableShow.thcPrice&&detaInfo.isThc==1">{{detaInfo.thcPrice}}</td>
							<td v-if="tableShow.buyBoxNum">{{detaInfo.buyBoxNum}}</td>
							<td v-if="tableShow.clearancePrice">{{detaInfo.clearancePrice}}</td>
							<td v-if="tableShow.purposeAmount">{{detaInfo.purposeAmount}}</td>
							<td v-if="tableShow.dan">{{(detaInfo.clearancePrice/detaInfo.purposeAmount).toFixed(2)}}</td>
						</tr>
					</table>
				</div>
			</div>
		</div>
		<!-- 收款 -->
		<el-dialog width='520px' title='付款' center :visible.sync='moneyVisible' v-dialogDrag>
			<div class="money_main">
				<div class="money_main_item">
					<i class="ic iconfont baozhengjin"></i>
					<input type="text" v-model='qingPrice'>
				</div>
				<div class="money_main_item">
					<i class="ic iconfont zhanghu"></i>
					<el-select v-model='acckey' placeholder='选择账户'>
						<el-option v-for='(val,key) in accData' :key='key' :label='val.name' :value='key'></el-option>
					</el-select>
				</div>
				<div class="money_main_item">
					<i class="ic iconfont riqi"></i>
					<el-date-picker v-model="priceTime" type="date" placeholder="选择日期"></el-date-picker>
				</div>
				<el-input type="textarea" maxlength="30" show-word-limit resize="none" v-model='memo' placeholder="备注。。。"></el-input>
			</div>
			<div style='margin-top:30px;text-align:center'>
				<el-button type='primary' plain @click='moneyVisible=false'>取消</el-button>
				<el-button type='primary' @click='postMoney'>确定</el-button>
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
		  "options":options,
		},
		data() {
			return {
				short: false,
				moneyVisible: false,
				back: this.$route.query.backUrl,
				id: this.$route.query.id,
				detaInfo: {},
				userId: JSON.parse(this.$store.state.token).id,
				tenantId: JSON.parse(this.$store.state.token).tenantId,
				memo: '',
				priceTime: '',
				acckey: '',
				accData: [],
				role: JSON.parse(this.$store.state.role),
				qingPrice:'',
        setVisible:false,
        activeName:'first',
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
				return JSON.parse(this.$store.state.setJson).tableOptions.CD;
			}
	  },
		methods: {
			//获取详情
			getDeta() {
				this.$axios({
					method: 'get',
					url: '/apt/purposeForm/showPurposeFormDetailInfo',
					params: {
						purposeId: this.id,
					}
				}).then(res => {
					if (res && res.data.data) {
						for (let i in res.data.data) {
							this.getDetaInfo(i);
							this.getTable(res.data.data[i]);
							break;
						}
					}
				})
			},
			getDetaInfo(str) {
				let s = str.indexOf('(');
				let e = str.lastIndexOf(')');
				str = str.substring(s + 1, e);
				let arr = str.split(',');
				let obj = {}
				for (let i in arr) {
					obj[arr[i].split('=')[0].replace(/(^\s*)/g, "")] = arr[i].split('=')[1];
				}
				this.detaInfo = obj;
				console.log(this.detaInfo)
				this.qingPrice = this.detaInfo.clearancePrice- this.detaInfo.clearancePayment
			},
			getTable(arr) {
				for (let i in arr) {
					Object.assign(arr[i], this.proData(arr[i].attributeValue))
				}
				this.tableData = arr;
			},
			//审核
			shenHe() {
				if (!this.role.erp_clearance_mod) return this.$message.error('没有权限');
		    const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				this.$axios({
					method: 'post',
					url: '/apt/purposeForm/modifyPurposeFormLine',
					data: {
						id: this.id,
						clearanceApproveState: 2,
						clearanceApproveTime: new Date(),
						clearanceApproverId: this.userId,
					}
				}).then(res => {
					loading.close();
					if (res.data && res.data.data) {
						this.getDeta();
					}else{
						this.$message.error('审核失败')
          }
				},()=>{loading.close();this.$message.error('审核失败')})
			},
			//确认
			sure() {
				if (!this.role.erp_clearance_mod) return this.$message.error('没有权限');
		    const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				this.$axios({
					method: 'post',
					url: '/apt/purposeForm/modifyPurposeFormLine',
					data: {
						id: this.id,
						updateTime: new Date(),
						state: 4,
					}
				}).then(r => {
					loading.close();
					if (r && r.data.data) {
						this.getDeta();
					}else{
						this.$message.error('确认失败')
          }
				},()=>{loading.close();this.$message.error('确认失败')})
			},
			//获取账户信息
			getPayment() {
				this.$axios({
					method: 'get',
					url: '/aps/sell/showByUserPayment/' + this.tenantId,
				}).then(res => {
					if (res.data.data) {
						this.accData = res.data.data;
					}
				})
			},
			openMoney() {
				if (!this.role.erp_pay_new) return this.$message.error('没有权限');
				if(this.detaInfo.clearanceApproveState==2){
					this.moneyVisible = true;
					this.getPayment();
				}else{
					this.$message.error('请审核清关单')
				}
			},
			//付款
			postMoney() {
				if(!this.role.erp_pay_new) return this.$message.error('没有权限');
				this.moneyVisible = false;
				let data = {
					tenantId: this.tenantId,
					creatorId: this.userId,
					fromAccountName: this.accData[this.acckey].name,
          formAccountType: this.accData[this.acckey].displayName,
          formPaymentAccountId: this.accData[this.acckey].id,
					type: 10,
					updateTime: new Date(),
					pushTime: new Date(this.priceTime),
					status: 1,
					money: this.qingPrice,
					memo: this.memo,
					toAccountName: 'undefind',
					toAccountType: 'undefind',
          reffer:this.id
				};
				this.$axios({
					method: 'post',
					url: '/apa/financeTable/addFinanceTable',
					data: data
				}).then(res => {
					if (res && res.data.data) {
						this.$axios({
							method: 'post',
							url: '/apt/purposeForm/modifyPurposeFormLine',
							data: {
								id: this.id,
								clearancePayment: parseFloat(this.detaInfo.clearancePayment) + parseFloat(this.qingPrice),
							}
						}).then(r => {
							if (r && r.data.data) {
								this.getDeta();
							}
						})
					}
				})
			},
      // 表格字段更新
      updataTableOptions(data){
        let setJson = JSON.parse(this.$store.state.setJson);
        setJson.tableOptions.CD = data;
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
			this.getDeta();
		}
	}
</script>
<style>
	.money_main_item .el-input__inner {
		padding: 0 50px;
		border: 0;
		border-radius: 0;
		border-bottom: 1px solid #dddddd;
		text-align: center;
	}
	.money_main_item .el-select {
		display: block;
	}
	.money_main_item .el-date-editor.el-input {
		width: 100%
	}
	.money_main_item .el-input__icon {
		display: none;
	}
</style>
<style lang="scss" scoped>
	.money_main {
		padding: 0 100px 10px;
		.money_main_item {
			height: 40px;
			margin-bottom: 10px;
			position: relative;
			.money_div {
				width: 100%;
				height: 40px;
				border-bottom: 1px solid #dddddd;
				padding: 0 50px;
				text-align: center;
				line-height: 40px;
			}
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
	.deta_mid_table table {
		width: 100%;
		tr {
			height: 40px;
			border-bottom: 1px solid #ddd;
			text-align: center;
			color: #777;
		}
	}
	.deta_mid_bar.short {
		width: 150px;
	}
</style>
