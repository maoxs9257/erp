<template lang="html">
	<div class="bill">
		<div class="bill_header">
			<ym-hbt :to='{name:"inStoreHome"}' title='退货入库'></ym-hbt>
		</div>
		<div class="bill_mi">
			<span class='bill_set'>设置</span>
			<div class="bill_mi_item">
				<el-checkbox v-model="checkTime">时间</el-checkbox>
			</div>
			<div class="bill_mi_item">
				<el-checkbox v-model="checkMemo">备注</el-checkbox>
			</div>
		</div>
		<div class="bill_main">
			<div class="bill_main_top">
				<div class="bill_infos clearfix">
					<div class="bill_info">
						<i class="ic iconfont icon-hetong"></i>
						<el-select v-model="storeKey" placeholder="选择仓库">
							<el-option v-for='(val,key) in storeList' :key='key' :label="val.name" :value="key"></el-option>
						</el-select>
					</div>
					<div class="bill_info">
						<el-select v-model="priceKey" placeholder="卸柜单价">
							<el-option v-for='(val,key) in priceList' :key='key' :label="val.price" :value="key"></el-option>
						</el-select>
					</div>
					<div class="bill_info" v-if='checkTime'>
						<el-date-picker v-model="time" type="date" value-format="timestamp" placeholder="选择日期"></el-date-picker>
					</div>
					<div class="bill_info" v-if='checkMemo'>
						<input class="bill_info_input" v-model='memo' type="text" placeholder="备注">
					</div>
				</div>
				<div class="bill_infos clearfix">
					<div class="bill_info">
						<i class="ic iconfont icon-hetong"></i>
						<el-select v-model="returnId" placeholder="选择退货单">
							<el-option v-for='(val,key) in returnList' :key='key' :label="val.returnSellSn" :value="val.id"></el-option>
						</el-select>
					</div>
				</div>
			</div>
			<div class="bill_main_fot" :style="{height:'calc(100% - '+h+'px)'}">
				<div class="bill_table">
					<el-table :data='returnData' height='100%'>
						<el-table-column label='序号' type='index'></el-table-column>
						<el-table-column v-for='(val,key) in tabConfig' :key='key' :label='val' :prop='val'></el-table-column>
						<el-table-column label='备注' prop='memo'></el-table-column>
					</el-table>
				</div>
				<div class="bill_create_btn">
					<button type="button" @click="createIn">创建进货单</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import headBackTitle from '@/components/headBackTitle.vue'
	export default {
		components: {
			"ym-hbt": headBackTitle,
		},
		data() {
			return {
				tenantId: JSON.parse(this.$store.state.token).tenantId,
				userId: JSON.parse(this.$store.state.token).id,
		    role: JSON.parse(this.$store.state.role),
				value: null,
				h: 0,
				screenWidth: 0,
				checkTime: true,
				checkPrice: true,
				checkMemo: true,
				storeList: [],
				storeKey: '',
				priceList: [],
				priceKey: '',
				time: '',
				memo: '',
				returnList: [],
				returnId: '',
				returnData: [],
				tabConfig: [],
			}
		},
		methods: {
			//获取仓库列表 storagelist
			getStorageList() {
				this.$axios({
					method: 'get',
					url: '/api/storeInForm/showStoreInfor',
					params: {
						tenantId: this.tenantId
					}
				}).then(res => {
					if (res && res.data.data) {
						this.storeList = res.data.data;
					} else {
						this.storeList = [];
					}
				})
			},
			//获取退货单
			getReturn() {
				this.$axios({
					method: 'get',
					url: '/api/storeInForm/showReturnSell',
					params: {
						tenantId: this.tenantId,
						approveState: 2,
						state: 1,
					}
				}).then(res => {
					if (res && res.data.data) {
						this.returnList = res.data.data
					} else {
						this.returnList = [];
					}
				})
			},
			//获取退货数据
			getReturnData() {
				this.returnData = [];
				this.$axios({
					method: 'get',
					url: '/api/storeInForm/showReturnSellPackage',
					params: {
						returnSellFormId: this.returnId
					}
				}).then(res => {
					if (res && res.data.data) {
						let data = res.data.data;
						for (let i in data) {
							Object.assign(data[i], this.proData(data[i].attributeValue))
						}
						this.tabConfig = this.GLOBAL_.tableConfig[data[0].品类]
						this.returnData = data;
					}
				})
			},
			//创建退货入库单
			createIn() {
		    if(!this.role.erp_instore_new) return this.$message.error('没有权限');
        if(!this.storeList[this.storeKey]) return this.$message.error('选择仓库');
        if(!this.returnId) return this.$message.error('选择退货单');
        if(!this.priceList[this.priceKey]) return this.$message.error('选择卸柜单价');
        if(!this.time) return this.$message.error('选择时间');

				let PackageId = [];
				for (let i in this.returnData) {
					PackageId.push(this.returnData[i].id);
				}
				let obj = {};
				obj.returnSellId = this.returnId;
				obj.returnSellPackageId = PackageId;
				obj.storeInForm = {
					approveState: 1,
					boxNum: 0,
					creatorId: this.userId,
					memo: this.memo,
					packageNum: this.returnData.length,
					purposeId: this.returnId,
					state: 1,
					storageType: 3,
					storeInTime: this.time,
					tenantId: this.tenantId,
					warestoreId: this.storeList[this.storeKey].id
				};
				obj.storeInFormDetail = [];
				for (let i in this.returnData) {
					let nobj = {};
					nobj.boxNo = '';
					nobj.buyPrice = this.returnData[i].packagePrice;
					nobj.creatorId = this.userId;
					nobj.fullPrice = this.returnData[i].packagePrice;
					nobj.memo = this.memo;
					nobj.moneyPrice = this.returnData[i].packagePrice;
					nobj.moneyRate = 1;
					nobj.moneyType = '人民币';
					nobj.packageId = this.returnData[i].packageId;
					nobj.unit = this.returnData[i].unit;
					nobj.warestoreId = this.storeList[this.storeKey].id;
					obj.storeInFormDetail.push(nobj);
				}
				obj.storeActionPayment = {
					actionType: 1,
					creatorId: this.userId,
					handingPriceId: this.priceList[this.priceKey].id,
					memo: this.memo,
					num: 1,
					payName: this.priceList[this.priceKey].name,
					price: this.priceList[this.priceKey].price,
					tenantId: this.tenantId,
					warestoreId: this.storeList[this.storeKey].id
				}
				this.$axios({
					method: 'post',
					url: '/api/storeInForm/addReturnSellStoreInForm',
					data: obj,
				}).then(res => {
					if (res && res.data.data) {
						this.$router.push({
							name: 'inDeta',
							params: {
								id: res.data.data,
								backUrl: 'returnPutIn',
							}
						})
					}
				})
			}
		},
		mounted() {
			this.getStorageList();
			this.getReturn();
			this.screenWidth = document.body.offsetWidth;
			window.onresize = () => {
				this.screenWidth = document.body.offsetWidth;
			}
		},
		watch: {
			screenWidth: function() {
				this.h = document.getElementsByClassName('bill_main_top')[0].offsetHeight;
			},
			storeKey: function() {
				this.priceList = this.storeList[this.storeKey].storeHandingPrices
				this.priceId = ''
			},
			returnId: function() {
				this.getReturnData()
			}
		}
	}
</script>

<style lang="css" scoped>
</style>
