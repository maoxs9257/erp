<template lang="html">
	<div class="bill">
		<div class="bill_header">
			<ym-hbt :to='{name:"purchaseHome"}' title='清关开单'></ym-hbt>
		</div>
		<div class="bill_mi">
			<span class='bill_set'>设置</span>
			<div class="bill_mi_item">
				<el-checkbox v-model="checkVat">增值税</el-checkbox>
			</div>
			<div class="bill_mi_item">
				<el-checkbox v-model="checkMemo">备注</el-checkbox>
			</div>
		</div>
		<div class="bill_main">
			<div class="bill_main_top">
				<div class="bill_infos clearfix">
					<div class="bill_info" @click='openClear'>
						<i class="ic iconfont jinxiaocun-qingguangongsiguanli"></i>
						<div class="bill_info_div">{{suCle.companyName?suCle.companyName:'选择清关公司'}}</div>
					</div>
					<div class="bill_info" v-if='checkMemo'>
						<input class="bill_info_input" type="text" placeholder="备注">
					</div>
				</div>
				<div class="bill_infos clearfix">
					<div class="bill_info" @click='openIn'>
						<i class="ic iconfont icon-hetong"></i>
						<div class="bill_info_div">{{suIn.orderSn?suIn.orderSn:'选择提单号'}}</div>
					</div>
					<div class="bill_info">
						<div class="bill_info_div">{{suIn?suIn.outterNo?suIn.outterNo:'无外部单号':'外部单号'}}</div>
					</div>
					<div class="bill_info">
						<i class="ic iconfont icon-hetong"></i>
						<div class="bill_info_div">{{suIn.purposeAmount?suIn.purposeAmount:"清关总数量"}}</div>
					</div>
					<div class="bill_info">
						<i class="ic iconfont icon-hetong"></i>
						<div class="bill_info_div">{{suIn.buyBoxNum?suIn.buyBoxNum:"清关总柜量"}}</div>
					</div>
					<div class="bill_info" v-if='suIn.isThc==0'>
						<input class="bill_info_input" v-model='HTCprice' @change="HTCprice=checkNumber(HTCprice)" placeholder="输入HTC费用">
					</div>
					<div class="bill_info">
						<el-select v-model="clearKey" placeholder="选择清关路线" @visible-change='showClearLine'>
							<el-option v-for='(val,key) in clearList' :label="val.name" :value="key" :key='key'></el-option>
						</el-select>
					</div>
					<div class="bill_info">
						<div class="bill_info_div">{{clearObj.price?clearObj.price:'清关价格'}}</div>
					</div>
					<div class="bill_info" v-if='checkVat'>
						<el-select v-model="vat" @change="" placeholder="是否有增值税">
							<el-option label="有增值税" value="1"></el-option>
							<el-option label="没有增值税" value="2"></el-option>
						</el-select>
					</div>
          <div class="bill_info" v-if='checkVat&&vat==1'>
            <el-select v-model="padDuty" placeholder="是否垫税">
              <el-option label="自己支付" :value="1"></el-option>
              <el-option label="开证公司垫付" :value="0"></el-option>
            </el-select>
          </div>
					<div class="bill_info" v-if='checkVat&&vat==1'>
						<input class="bill_info_input" v-model='vatPrice' @change="vatPrice=checkNumber(vatPrice)" placeholder="增值税率">
					</div>
					<div class="bill_info" v-if='checkVat&&vat==1'>
						<i class="ic iconfont icon-riqi"></i>
						<el-date-picker v-model="vatTime" type="date" value-format="timestamp" placeholder="付税时间"></el-date-picker>
					</div>
				</div>
			</div>
			<div class="bill_main_fot" :style="{height:'calc(100% - '+h+'px)'}">
				<div class="bill_table">
					<table>
						<tr>
							<th>序号</th>
							<th>提单号</th>
							<th>时间</th>
							<th>路线</th>
							<th>单价</th>
							<th v-if='suIn.isThc==0'>THC</th>
							<th>总柜数</th>
							<th>金额</th>
							<th>总数量</th>
							<th>清关单价</th>
						</tr>
						<tr>
							<td>1</td>
							<td>{{suIn.orderSn}}</td>
							<td>{{vatTime|time('y-m-d')}}</td>
							<td>{{clearObj.name}}</td>
							<td>{{clearObj.price}}</td>
							<td v-if='suIn.isThc==0'>{{HTCprice}}</td>
							<td>{{suIn.buyBoxNum}}</td>
							<td>{{sumPrice}}</td>
							<td>{{suIn.purposeAmount}}</td>
							<td>{{suIn.purposeAmount?(sumPrice/suIn.purposeAmount).toFixed(2):''}}</td>
						</tr>
					</table>
				</div>
				<div class="bill_create_btn">
					<button type="button" @click='createClearD'>创建清关单</button>
				</div>
			</div>
		</div>
		<!-- 选择清关公司 -->
		<company :type='2' ref='clear' @cb='selectClear' @create='createClear'></company>
		<!-- 选择合同弹窗 -->
		<el-dialog width='840px' title='选择进货单' center :visible.sync='contractVisible' v-dialogDrag>
			<div class="contract_table">
				<div class="table table_style">
					<el-table :data='inData' height='100%' border highlight-current-row @current-change='(val)=>{chIn=val}'>
						<el-table-column type='index'></el-table-column>
						<el-table-column label='采购单号' prop='outterNo' show-overflow-tooltip></el-table-column>
						<el-table-column label='供应商' prop='supportCompanyName'show-overflow-tooltip></el-table-column>
						<el-table-column label='采购柜数' prop='buyBoxNum' show-overflow-tooltip></el-table-column>
						<el-table-column label='采购金额' prop='buyAmountPrice' show-overflow-tooltip></el-table-column>
						<el-table-column label='采购数量' prop='purposeAmount' show-overflow-tooltip></el-table-column>
						<el-table-column label='保证金' prop='bond' show-overflow-tooltip></el-table-column>
					</el-table>
				</div>
			</div>
			<div style='margin-top:30px;text-align:center'>
				<el-button type='primary' plain @click='contractVisible=false'>取消</el-button>
				<el-button type='primary' @click='sureIn'>确定</el-button>
			</div>
		</el-dialog>
		<!-- 新建清关公司 -->
		<newcompany :type='2' ref='newclear' @cb='createClearFinish'></newcompany>
	</div>
</template>

<script>
	import headBackTitle from '@/components/headBackTitle.vue'
	import company from './companySelection'
	import newCompany from '../customer/newCompany'
	export default {
		components: {
			"ym-hbt": headBackTitle,
			"company":company,
			"newcompany":newCompany
		},
		data() {
			return {
				value: null,
				customerVisible: false,
				contractVisible: false,
				checkMemo: true,
				checkTime: true,
				checkVat: true,
				h: 0,
				screenWidth: 0,
				clearList: [],
				tenantId: JSON.parse(this.$store.state.token).tenantId,
				chCle: {},
				suCle: {},
				inData: [],
				chIn: {},
				suIn: {},
				HTCprice: 0,
				clearKey: '',
				clearObj: {},
				time: '',
				vat: '',
				vatPrice: '',
				vatTime: '',
				role: JSON.parse(this.$store.state.role),
		    padDuty:'',
			}
		},
		computed: {
			sumPrice: function() {
        if(!this.clearObj.price||!this.suIn.buyBoxNum) return '';
        if(this.suIn.isThc==0) return (parseFloat(this.HTCprice) + parseFloat(this.clearObj.price)) * parseFloat(this.suIn.buyBoxNum);
		    return (parseFloat(this.clearObj.price)) * parseFloat(this.suIn.buyBoxNum);
			}
		},
		methods: {
			/**
			* 打开清关公司窗口
			* @method openClear
			*/
			openClear(){
				this.$refs.clear.open();
			},
			/**
	    * 选择清关公司
	    * @method selectClear
	    */
	    selectClear(data){
	      this.suCle = data;
	    },
			/**
			* 显示清关路线
			* @method showClearLine
			*/
			showClearLine(data){
				if(data){
					this.clearList = [];
					setTimeout(()=>{this.getClearLine()})
				}
			},
			/**
			* 获取清关路线
			* @method getClearLine
			*/
			getClearLine() {
				if (!this.role.erp_clearroad_look) {
					return this.$message.error('没有权限');
				}
				if(!this.suCle.id) return this.$message.error('请选择清关公司');
				const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let params = {contactId: this.suCle.id};
				this.$axios.get( '/aps/customerCompany/showCompanyLine',{params})
				.then(res => {
					if (res.data && res.data.data) {
						this.clearList = res.data.data;
					}
					loading.close();
				},()=>{loading.close()})
			},
			/**
			* 打开新建清关公司
			* @method createClear
			*/
			createClear(){
				if(this.role.erp_clear_new){
			    this.$refs.newclear.open();
        }else{
					this.$message.error('没有权限')
        }
			},
			/**
			* 新建清关公司完成
			* @method createClearFinish
			*/
			createClearFinish(){
				this.$refs.clear.refresh()
			},
			//选择进货单
			openIn() {
				if (!this.role.erp_stock_look) return this.$message.error('没有权限');
				this.contractVisible = true;
				this.$axios({
					method: 'get',
					url: '/apt/purposeForm/showPurposeFormList',
					params: {
						tenantId: this.tenantId,
						state: 2,
						needClear: 2,
					}
				}).then(res => {
					if (res && res.data.data) {
						this.inData = res.data.data
					} else {
						this.inData = []
					}
				})
			},
			sureIn() {
				this.suIn = JSON.parse(JSON.stringify(this.chIn));
				this.contractVisible = false;
			},
			//创建清关订单
			createClearD() {
				if (!this.role.erp_clearance_new) return this.$message.error('没有权限');
        if(!this.suCle.id) return this.$message.error('请选择清关公司');
        if(!this.suIn.id) return this.$message.error('请选择订单');
        if(this.isThc==1&&!this.HTCprice) return this.$message.error('请输入HTC价格');
        if(!this.clearObj.id) return this.$message.error('请选择清关路线');
        if(!this.vat) return this.$message.error('请选择是否含有增值税');
        if(this.vat==1&&this.padDuty!==1&&this.padDuty!==0) return this.$message.error('请选择垫付方式');
        if(this.vat==1&&!this.vatPrice) return this.$message.error('请输入增值税');
        if(this.vat==1&&!this.vatTime) return this.$message.error('请选择时间');
		    const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				this.$axios({
					method: 'post',
					url: '/apt/purposeForm/clearancePurposeFormLine',
					data: {
						clearanceId: this.suCle.id,
						id: this.suIn.id,
						lineId: this.clearObj.id,
						memo: this.memo,
						thcPrice: this.HTCprice,
						clearanceApproveState: 1,
						clearancePrice: (parseFloat(this.HTCprice) + parseFloat(this.clearObj.price)) * this.suIn.buyBoxNum,
						clearancePayment: 0,
						vatAmount: this.vat == 1 ? this.vatPrice : 0,
						vatTime: this.vat == 1 ? this.vatTime : '',
			      padDutyState:this.padDuty,
					}
				}).then(res => {
					loading.close();
					if (res.data && res.data.data) {
						this.$router.push({
							name: 'clearDeta',
							query: {
								backUrl: 'openClear',
								id: this.suIn.id
							}
						});
					}else{
						this.$message.error('创建清关单失败')
          }
				},()=>{loading.close();this.$message.error('创建清关单失败')})
			},
      /**
       * 数字验证
       * @method checkNumber
       */
      checkNumber(data){
        if(data==='') return '';
        if(parseFloat(data)){
          return parseFloat(data).toFixed(3);
        }else{
          return '';
        }
      },
		},
		mounted() {
			this.screenWidth = document.body.offsetWidth;
			window.onresize = () => {
				this.screenWidth = document.body.offsetWidth;
			}
		},
		watch: {
			screenWidth: function() {
				this.h = document.getElementsByClassName('bill_main_top')[0].offsetHeight;
			},
			clearKey: function() {
				if (!this.clearList[this.clearKey]) {
					this.clearObj = {};
				} else {
					this.clearObj = this.clearList[this.clearKey];
				}
			},
      vat:function () {
				setTimeout(()=>{
			    this.h = document.getElementsByClassName('bill_main_top')[0].offsetHeight;
        })
	    }
		}
	}
</script>
<style lang="scss" scoped>
	.bill_table table {
		width: 100%;
		text-align: center;

		tr {
			height: 40px;
			border-bottom: 1px solid #ddd;
		}
	}

	.contract_table {
		height: 450px;
		.table {
			height: 100%;
		}
	}
</style>
