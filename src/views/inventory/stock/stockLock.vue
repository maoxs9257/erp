<template>
	<div class="bill">
		<div class="bill_header">
			<v-head title="库存锁定" :to="{name:'stockHome'}"></v-head>
		</div>
		<div class="bill_mi">
			<div class="bill_mi_item">
				<el-checkbox v-model="checkMemo">备注</el-checkbox>
			</div>
			<div class="bill_mi_item">
				<el-checkbox v-model="checkKe">客户</el-checkbox>
			</div>
		</div>
		<div class="bill_main">
			<div class="bill_main_top">
				<div class="bill_infos clearfix">
					<div class="bill_info" @click="openGoods">
						<i class="ic iconfont chanpin"></i>
						<div class="bill_info_div">选择商品</div>
					</div>
					<div class="bill_info" v-if="checkKe" @click="openCustomer">
            <i class="ic iconfont kehu"></i>
						<div class="bill_info_div">{{customer.fullName?customer.fullName:'选择客户'}}</div>
					</div>
					<div class="bill_info">
            <i class="ic iconfont riqi"></i>
						<el-date-picker v-model="time" type="date" placeholder="截止时间"></el-date-picker>
					</div>
					<div class="bill_info" v-if='checkMemo'>
						<input class="bill_info_input" type="text" v-model='memo' placeholder="备注">
					</div>
				</div>
			</div>
			<div class="bill_main_fot" :style="{height:'calc(100% - '+h+'px)'}">
				<div class="bill_table">
					<el-table :data="tableList" height="100%">
					<el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
					<el-table-column label="仓库" prop="warestoreName" align="center" show-overflow-tooltip></el-table-column>
					<el-table-column v-for="(val,key) in  tableConfig1" :label="val" :prop="val" :key="key"></el-table-column>
					<el-table-column fixed="right" label="数量" width="120" align="center">
						<template slot-scope="scope">
							<el-input-number style='width:100%' size='mini' v-model="scope.row.num" @change="count(tableList)" :min="0" :max="scope.row.cNum"></el-input-number>
						</template>
					</el-table-column>
					<el-table-column fixed="right" label="销售单价" width="100" align="center">
						<template slot-scope="scope">
							<el-input-number class="nnn" style="width:100%" size='mini' v-model="scope.row.salePrice" :min="0"></el-input-number>
						</template>
					</el-table-column>
				</el-table>
				</div>
				<div class="bill_create_btn">
					<button type="button" @click="createOrder">创建锁定单</button>
				</div>
			</div>
		</div>
		<!-- 添加商品 -->
		<el-dialog width='1000px' v-dialogDrag :visible.sync="isaddGoods" center title="添加商品">
			<div class="war_add_box">
				<div class="v-form">
					<div class="v_from_left ac">
						<el-select v-model="categoryId" @change="openGoods">
							<el-option label="实木板材" value="2"></el-option>
							<el-option label="原木材" value="1"></el-option>
							<el-option label="人造板" value="5"></el-option>
							<el-option label="木配城" value="4"></el-option>
							<el-option label="名贵材" value="3"></el-option>
						</el-select>
					</div>
					<div class="v_from_right"><span>已选商品</span><span>{{checkSum}}</span></div>
				</div>
				<div class="v-table tableStyle">
					<el-table :data="goodsList" height="100%" border>
						<el-table-column label="序号" width="50" align="center" type="index"></el-table-column>
						<el-table-column label="仓库" prop="warestoreName" align="center" show-overflow-tooltip></el-table-column>
						<el-table-column align="center" v-for="(val,key) in tableConfig" :key="key" :label="val" :prop="val"></el-table-column>
						<el-table-column fixed="right" label="可用件数" prop="cNum" align="center"></el-table-column>
						<el-table-column fixed="right" align="center" label="数量" width="120">
							<template slot-scope="scope">
								<el-input-number style="width:100%" size='mini' v-model="scope.row.num" @change="count(goodsList)" :min="0" :max="scope.row.cNum"></el-input-number>
							</template>
						</el-table-column>
						<el-table-column fixed="right" align="center" width="100" label="价格">
							<template slot-scope="scope">
								<input class="inp" type="number" min="0" v-model="scope.row.salePrice">
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div style="margin-top:30px;text-align:center">
					<el-button type='primary' plain @click="closeGoods">取消</el-button>
					<el-button type='primary' @click="addTableList">确定</el-button>
				</div>
			</div>
		</el-dialog>
		<!-- 选择客户 -->
		<custpmer ref='customer' @cb='selectCustomer' @create='createCustomer'></custpmer>
		<newcustomer ref='newcustomer' @fin='finish'></newcustomer>
	</div>
</template>

<script>
	import head from "@/components/headBackTitle.vue"
	import custpmer from '../sale/customerSelection'
	import newcustomer from '../customer/newcustomer'
	export default {
		data() {
			return {
				tenantId: JSON.parse(this.$store.state.token).tenantId,
				userId: JSON.parse(this.$store.state.token).id,
		    role: JSON.parse(this.$store.state.role),
				h:0,
				screenWidth:'',
				checkMemo:true,
				checkKe:true,
				customer:{},
				time:'',
				isaddGoods:false,
				categoryId:'2',
				goodsList: [],
				tableConfig:[],
				tableConfig1:[],
				checkSum: 0,
				tableList: [],
				memo: '',
			}
		},
		mounted() {
			this.screenWidth = document.body.offsetWidth;
			window.onresize = () => {
				this.screenWidth = document.body.offsetWidth;
			}
		},
		methods: {
			/**
			 * 打开客户
			 * @method openCustomer
			 */
			openCustomer(){
				this.$refs.customer.open();
			},
			/**
			 * 选择客户
			 * @method selectCustomer
			 */
			selectCustomer(data){
				this.customer = data;
			},
			/**
			 * 打开新建客户
			 * @method createCustomer
			 */
			createCustomer(){

				this.$refs.newcustomer.open();
			},
			/**
			 * 添加完成
			 * @method finish
			 */
			finish(){
				this.$refs.customer.refresh();
			},
			/**
			 * 打开商品窗口
			 * @method openGoods
			 */
			openGoods(){
				const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let params = {
					tenantId: this.tenantId,
					categoryId:this.categoryId,
				}
				this.$axios.get('/api/storeInForm/showGoogsTable',{params})
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						this.goodsList = this.proData(res.data.data);
						let categoryName = '';
						switch (this.categoryId){
							case '1' : categoryName = '原木材'; break;
							case '2' : categoryName = '实木板材'; break;
							case '3' : categoryName = '名贵材'; break;
							case '4' : categoryName = '木配城'; break;
							case '5' : categoryName = '人造板'; break;
							default : categoryName = '';
						}
						this.tableConfig = this.GLOBAL_.tableConfig[categoryName];
						this.isaddGoods = true;
					}else{
						this.$message.error('获取商品失败');
					}
				},()=>{loading.close();this.$message.error('获取商品失败')})
			},
			/**
			 * 关闭商品窗口
			 * @method closeGoods
			 */
			closeGoods() {
				this.isaddGoods = false;
			},
			/**
			 * 处理商品
			 * @method proData
			 */
			proData(data) {
				for (let i in data) {
					data[i].cNum = data[i].packageNumber - data[i].lockedNumber;
					data[i].num = 0;
					for(let n in this.tableList){
						if(this.tableList[n].id == data[i].id){
							data[i].num = this.tableList[n].num;
						}
					}
					if (!data[i].attributeValue) continue;
					let arr = data[i].attributeValue.split(',');
					for (let n in arr) {
						if (arr[n] !== '') {
							data[i][arr[n].split(':')[0]] = arr[n].split(':')[1]
						}
					}
			    data[i].立方数 = data[i].amount;
				}
				return data;
			},
			/**
			 * 确定商品
			 * @method addTableList
			 */
			addTableList(){
				let arr = [];
				for(let i in this.goodsList){
					if(this.goodsList[i].num > 0){
						arr.push(this.goodsList[i])
					}
				}
				this.tableList = arr;
				this.tableConfig1 = this.tableConfig;
				this.isaddGoods = false;
			},
			/**
			 * 创建锁定单
			 * @method createOrder
			 */
			createOrder(){
				if(!this.role.erp_lockgoods_new) return this.$message.error('没有权限');
				if(this.time==='') return this.$message.error('请选择截止时间');
				if(this.tableList.length === 0) return this.$message.error('请选择数据');
				const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let amount = 0;
				let arr = [];
				for(let i in this.tableList){
					let obj = {
						creatorId: this.userId,
						goodsId: this.tableList[i].id,
						goodsNum: this.tableList[i].num,
						warestoreId: this.tableList[i].warestoreId,
						salePrice: this.tableList[i].salePrice
					}
					arr.push(obj);
			    amount += parseFloat(this.tableList[i].amount)
				}
        let data = {
          lockForm:{
            tenantId: this.tenantId,
            contactId: this.customer.id,
            creatorId: this.userId,
            lockNo: '',
            orderPackages: this.checkSum,
            memo: this.memo,
            checkApproveState: 1,
            expireTime: Date.parse(new Date(this.time)),
			      amount:amount,
          }
        };
				data.lockFormDetails = arr;
				this.$axios.post('/api/lockForm/AddLockFormInfo',data)
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						this.$router.push({
							name:'lockDeta',
							query:{id: res.data.data,backUrl:'stockLock'}
						})
					}else{
						this.$message.error('创建锁定单失败')
					}
				},()=>{loading.close();this.$message.error('创建锁定单失败')})
			},
			/**
			 * 计算选择数量
			 * @method count
			 */
			count(data) {
				let sum = 0;
				for (let i in data) {
					sum += data[i].num
				}
				this.checkSum = sum;
			},
		},
		watch: {
			screenWidth: function() {
				this.h = document.getElementsByClassName('bill_main_top')[0].offsetHeight;
			},
		},
		components: {
			"v-head": head,
			"newcustomer":newcustomer,
			"custpmer":custpmer,
		},
	};
</script>

<style lang="scss">
	.v_from_left .el-input__inner{
		height: 25px;
		line-height: 25px;
		padding-left: 2px;
		padding-right: 18px;
	}
	.v_from_left .el-select .el-input__icon{
		width:18px;
		line-height: 25px;
	}
	.v-table .el-input-number .el-input__inner{
		padding-left: 28px;
		padding-right: 28px;
	}
	.bill_table .el-table__fixed-body-wrapper{
		top:40px !important;
	}
	.bill_table .el-input-number .el-input__inner{
		padding-left: 28px;
		padding-right: 28px;
	}
	.bill_table .el-input-number.nnn .el-input__inner{
		padding-left: 5px;
		padding-right: 5px;
	}
	.bill_table .el-input-number.nnn span{
		display: none;
	}
</style>

<style scoped lang="scss">
	.war_add_box {
		.v-form {
			margin: 0 0 20px;
			height: 42px;
			border-bottom: 2px #ccc dotted;
			position: relative;

			.v_from_right {
				position: absolute;
				right: 0px;
				width: 100px;
				line-height: 40px;

				span:nth-child(2) {
					background-color: #f7a2a2;
					color: #ffffff;
					padding: 0 2px;
					-webkit-border-radius: 3px;
					-moz-border-radius: 3px;
					border-radius: 3px;
				}
			}

			.v_from_left {
				position: absolute;
				left: 0;
				top: 8px;
				width: 80px;
			}

			.v_from_main {
				margin: 0 105px 0 85px;

				.mainItem {
					float: left;
					margin-top: 8px;
					height: 25px;
					width: 50px;
					margin-left: 5px;
				}

				.clear {
					float: left;
					margin-top: 13px;
					margin-left: 5px;
					cursor: pointer;
					color: #666;

					&:hover {
						color: #00A0E9;
					}
				}
			}
		}

		.v-table {
			height: 430px;

			.inp {
				width: 100%;
				background-color: rgb(255, 253, 231);
				border: 1px solid rgb(255, 229, 126);
				outline: none;
				text-align: center;
			}
		}

		.btn {
			height: 30px;
			text-align: center;
			margin-top: 20px;

			button {
				width: 100px;
				height: 28px;
				border: 1px solid #d2d2d2;
				-webkit-border-radius: 5px;
				-moz-border-radius: 5px;
				border-radius: 5px;
				background-color: #ffffff;
				color: #666;

				&:hover {
					background-color: #f1f7ff;
				}

				&:nth-child(1) {
					border-color: #00A0E9;
					color: #00A0E9;

					&:hover {
						color: #ffffff;
						background-color: #00A0E9;
					}
				}
			}
		}
	}
</style>
