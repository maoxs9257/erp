<template>
	<el-dialog width="673px" v-dialogDrag title='账户转账' :visible.sync="showTransferDialog" center>
		<!-- 转账界面 -->
		<div class="transferMain">
			<div class="transferMainLeft transferMainBox">
				<div class="sign">转出</div>
				<ul>
					<li><label>转出账号</label>
						<el-select v-model="fromKey" @change='checkFromAcc'>
							<el-option :label='val.name' :value='key' v-for="(val,key) in accList" :key='key'></el-option>
						</el-select>
					</li>
					<li><label>账号余额</label><span>{{fromData.remainingSum}}</span></li>
					<li><label>转账金额</label><input type="number" v-model='price' @change='checkPrice'></li>
					<li><label>备注</label><input type="text" v-model='memo'></li>
				</ul>
			</div>
			<div class="transferMainI"><i class="iconfont icon-zhankai"></i></div>
			<div class="transferMainRight transferMainBox">
				<div class="sign">转人</div>
				<ul>
					<li><label>转入账号</label>
						<el-select v-model="toKey" @change='checkToAcc'>
							<el-option :label='val.name' :value='key' v-for="(val,key) in accList" :key='key'></el-option>
						</el-select>
					</li>
					<li><label>账号余额</label><span>{{toData.remainingSum}}</span></li>
					<li><label>转账时间</label>
						<el-date-picker v-model="date" type="date" placeholder="选择日期" :picker-options="pickerOptions0"></el-date-picker>
					</li>
				</ul>
			</div>
		</div>
		<div style="margin-top:30px;text-align:center">
			<el-button type='primary' plain @click="showTransferDialog=false">取消</el-button>
			<el-button type='primary' @click="accSure">确定</el-button>
		</div>
	</el-dialog>
</template>

<script>
	export default {
		data() {
			return {
				showTransferDialog: false,
				date: '',
				memo: '',
				fromKey: '',
				toKey: '',
				tenantId: JSON.parse(this.$store.state.token).tenantId,
				userId: JSON.parse(this.$store.state.token).id,
				accList: [],
				fromData: {},
				toData: {},
				price: 0,
				role: JSON.parse(this.$store.state.role),
				pickerOptions0: {
					disabledDate(time) {
						return time.getTime() > Date.now() - 8.64e6
					}
				},
			};
		},
		methods: {
			open() {
				if (!this.role.erp_tranacc_new) return  this.$message.error('没有权限');

				this.fromKey = '';
				this.toKey = '';
				this.price = 0;
				this.memo = '';
				this.date = '';
				this.accList = [];
				this.getAccList()
			},
			//获取账户列表
			getAccList() {
		    const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				this.$axios({
					method: "get",
					url: '/apa/financeTable/showPaymentAccount',
					params: {
						tenantId: this.tenantId
					}
				}).then(res => {
					loading.close();
					if(res.data&&res.data.data){
			      this.accList = res.data.data;
			      this.showTransferDialog = true;
          }else{
						this.$message.error('获取数据失败')
          }
				},()=>{loading.close();this.$message.error('获取数据失败')})
			},
			//转出转入账户不能是同一个账户
			checkFromAcc() {
				if (this.fromKey == this.toKey && this.fromKey + '' != '' && this.toKey + '' != '') {
					this.fromKey = ""
					this.$notify({
						title: '警告',
						message: '转出转入账户不能相同',
						type: 'warning'
					});
					this.fromData = {}
					return
				}
				this.fromData = this.accList[this.fromKey]
			},
			checkToAcc() {
				if (this.fromKey == this.toKey && this.fromKey + '' != '' && this.toKey + '' != '') {
					this.toKey = ""
					this.$notify({
						title: '警告',
						message: '转出转入账户不能相同',
						type: 'warning'
					});
					this.toData = {}
					return
				}
				this.toData = this.accList[this.toKey]
			},
			//转出金额最大为账户余额
			checkPrice() {
				if (this.price > this.accList[this.fromKey].remainingSum) {
					this.price = this.accList[this.fromKey].remainingSum
				}
			},
			//转账
			accSure() {
				if (!this.role.erp_tranacc_new) {
					this.$message.error('没有权限');
					return;
				}
				const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				this.$axios({
					method: 'post',
					url: '/apa/financeTable/addFinanceTable',
					data: {
						completeTime: Date.parse(new Date(this.date)),
						creatorId: this.userId,
						formPaymentAccountId: this.accList[this.fromKey].id,
						fromAccountName: this.accList[this.fromKey].name,
						fromAccountType: this.accList[this.fromKey].displayName,
						handledById: this.userId,
						memo: this.memo,
						money: this.price,
						state: 2,
						tenantId: this.tenantId,
						toAccountName: this.accList[this.toKey].name,
						toAccountType: this.accList[this.toKey].displayName,
						toPaymentAccountId: this.accList[this.toKey].id,
						type: 5,
						remainingSum: this.price
					}
				}).then(res => {
					loading.close();
					if(res.data&&res.data.data){
						this.showTransferDialog = false;
						this.$emit('cb');
					}else{
						this.$message.error('转账失败')
					}
				},()=>{loading.close();this.$message.error('转账失败')})
			}
		}
	};
</script>

<style>
	.transferMainBox .el-input__inner {
		height: 28px;
		width: 134px;
	}
	.transferMainBox .el-input__icon {
		line-height: 28px;
	}
	.transferMainBox .el-date-editor.el-input {
		width: 132px;
	}
</style>
<style lang="scss" scoped>
	/* 账户转账 */
	.transferMain {
		width: 640px;
		margin: 0 auto;

		.transferMainBox {
			display: inline-block;
			width: 280px;
			border: 1px solid #dcdfe6;
			position: relative;
			overflow: hidden;
			vertical-align: middle;

			.sign {
				position: absolute;
				top: 10px;
				left: -76px;
				height: 30px;
				width: 200px;
				color: #fff;
				font-size: 16px;
				line-height: 30px;
				text-align: center;
				transform: rotate(-45deg);
			}

			ul {
				width: 220px;
				margin: 0 auto;

				li {
					height: 30px;
					margin-bottom: 24px;

					label {
						display: inline-block;
						width: 60px;
						font-size: 14px;
						color: #666;
						text-align: right;
						margin-right: 5px;
					}

					input {
						width: 132px;
						height: 26px;
						padding: 0;
						margin: 0;
						border: 1px solid #dcdfe6;
						margin-left: 3px;
						outline: none;
						border-radius: 4px;
						text-indent: 3px;
					}

					span {
						color: #999;
						text-indent: 2px;
						display: inline-block;
						line-height: 28px;
						width: 132px;
						margin-left: 3px;
					}
				}
			}
		}

		.transferMainLeft {
			padding-top: 50px;

			.sign {
				background-color: rgb(255, 122, 60);
			}
		}

		.transferMainRight {
			padding-top: 100px;

			.sign {
				background-color: rgb(111, 186, 86);
			}
		}

		.transferMainI {
			display: inline-block;
			vertical-align: middle;
			margin: 0 22px;

			i {
				font-size: 20px;
				color: #999;
			}
		}
	}
</style>
