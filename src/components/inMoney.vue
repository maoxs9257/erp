<template>
	<el-dialog width='580px' v-dialogDrag title="计收入" :visible.sync="visible" center>
		<div class="main">
			<div class="main_item">
				<i class="iconfont baozhengjin"></i>
				<el-input-number style='width:100%' v-model="money" :min="0"></el-input-number>
			</div>
			<div class="main_item">
				<i class="iconfont zafei"></i>
				<el-cascader style='width:100%' :options="optionDatas" expand-trigger="hover" v-model="selectValue"></el-cascader>
				<i @click="openFees" class="type iconfont xiugai"></i>
			</div>
			<div class="main_item">
				<i class="iconfont zhanghu"></i>
				<el-select v-model="accKey" style='width:100%'>
					<el-option v-for="(val,key) in accData" :key='key' :label="val.name" :value='key'></el-option>
				</el-select>
			</div>
			<div class="main_item">
				<i class="iconfont riqi"></i>
				<el-date-picker style='width:100%' v-model="time" type="date" placeholder="选择日期"></el-date-picker>
			</div>
			<el-input type="textarea" resize='none' :autosize="{minRows:3,maxRow:3}" maxlength="50" show-word-limit placeholder="请输入内容" v-model="memo"></el-input>
			<div style='text-align:center;margin-top:30px'>
				<el-button type='primary' @click='save'>保存</el-button>
				<el-button type='primary' @click='saveAgain'>再记一笔</el-button>
			</div>
		</div>
		<v-fees ref="fees"></v-fees>
	</el-dialog>
</template>

<script>
	import fees from '@/components/feestype.vue'
	export default {
		data() {
			return {
				tenantId: JSON.parse(this.$store.state.token).tenantId,
				userId: JSON.parse(this.$store.state.token).id,
				visible: false,
				selectValue: [],
				optionDatas: [],
				money: '',
				accData: [],
				accKey: '',
				time: '',
				memo: '',
				role: JSON.parse(this.$store.state.role),
			};
		},
		methods: {
			/**
			* 打开
			* @nethod open
			*/
			open(data){
				if(data){
					//修改
				}else{
					//新建
					this.newIncome();
				}
			},
			/**
			* 关闭
			* @method close
			*/
			close(){
				this.visible = false;
			},
			/**
			* 新建收入
			* @method newIncome
			*/
			newIncome(){
				if(!this.role.erp_inout_new) return this.$message.error('没有权限');
				this.visible = true;
				this.money = 0;
				this.selectValue = [];
				this.accKey = '';
				this.time = '';
				this.memo = ''
				this.getType();
				this.getAccount();
			},
			/**
			* 获取收支类别
			* @method getType
			*/
			getType(){
				let loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let params = {tenantId: this.tenantId};
				this.$axios.get('/apa/financeTable/showExpenseCategoryInfo',{params})
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						this.optionDatas = this.buildType(res.data.data)
					}else{
						this.$message.error('获取信息失败')
					}
				},()=>{loading.close();this.$message.error('获取信息失败')})
			},
			buildType(data) {
				let arr = []
				for (let i in data) {
					let obj = {}
					obj.value = data[i].id
					obj.label = data[i].name
					if (data[i].expenseCategoryDtoList) {
						obj.children = this.buildType(data[i].expenseCategoryDtoList)
					}
					arr.push(obj)
				}
				return arr
			},
			/**
			* 获取账户
			* @method getAccount
			*/
			getAccount(){
				let loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let params = {tenantId: this.tenantId};
				this.$axios.get('/apa/financeTable/showPaymentAccount',{params})
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						this.accData = res.data.data
					}else{
						this.$message.error('获取信息失败')
					}
				},()=>{loading.close();this.$message.error('获取信息失败')})
			},
			/**
			* 保存
			* @method save
			*/
			save(){
				this.createIncome(()=>{
					this.$emit('re');
					this.close();
				})
			},
			/**
			* 再记一笔
			* @method saveAgain
			*/
			saveAgain(){
				this.createIncome(()=>{
					this.money = 0;
					this.selectValue = [];
					this.accKey = '';
					this.time = '';
					this.memo = '';
			    this.$emit('re');
				})
			},
			/**
			* 创建收入
			* @method createIncome
			*/
			createIncome(callback){
				if(!this.role.erp_inout_new) return this.$message.error('没有权限');
				if(!this.money) return this.$message.error('请输入金钱');
				if(this.selectValue.length==0) return this.$message.error('请选择收支类型');
				if(!this.accData[this.accKey]) return this.$message.error('请选择账户');
				if(!this.time) return this.$message.error('请选择时间');
				let loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let data = {
					completeTime:Date.parse(new Date(this.time)),
					creatorId:this.userId,
					expenseCategoryId: this.selectValue[this.selectValue.length - 1],
					fromAccountName: 'undefind',
					fromAccountType: 'undefind',
					memo: this.memo,
					money: this.money,
					state: 2,
					tenantId: this.tenantId,
					toAccountName: this.accData[this.accKey].name,
					toAccountType: this.accData[this.accKey].displayName,
					toPaymentAccountId: this.accData[this.accKey].id,
					type: 1,
					updateTime: Date.parse(new Date(this.time)),
					remainingSum: this.money
				}
				this.$axios.post('/apa/financeTable/addFinanceTable',data)
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						callback();
					}else{
						this.$message.error('创建失败')
					}
				},()=>{loading.close();this.$message.error('创建失败')})
			},
			//赋值
			assignment(data) {
				this.isnew = false;
				this.money = data.money;
				this.selectValue = this.makeSureType(data.expenseCategoryDto);
				this.accid = data.formPaymentAccountId;
				this.time = data.time;
				this.peopleName = data.peopleName;
				this.peopleId = data.peopleId;
				this.memo = data.memo;
				this.id = data.id
			},
			//确定账户
			makeSureAcc(data) {
				console.log(data);
				for (let i in data) {
					if (data[i].id == this.accid) {
						this.accKey = parseInt(i)
					}
				}
			},
			//确定赋值中的支出类别
			makeSureType(data) {
				let arr = [];
				if (data) {
					arr.push(data.id);
					if (data.expenseCategoryDtoList.length > 0) {
						arr.push(data.expenseCategoryDtoList[0].id)
					}
				}
				return arr
			},
			//生成收支类别渲染数据



			//修改之处
			medifyIn() {
				this.$axios({
					method: 'post',
					url: '/apa/financeTable/modifyFinanceTable',
					data: {
						expenseCategoryId: this.selectValue[this.selectValue.length - 1],
						toPaymentAccountId: this.accData[this.accKey].id,
						toAccountName: this.accData[this.accKey].name,
						toAccountType: this.accData[this.accKey].displayName,
						handledById: this.peopleId,
						memo: this.memo,
						money: this.money,
						state: 2,
						tenantId: this.tenantId,
						fromAccountType: 'undefind',
						fromAccountName: 'undefind',
						type: 1,
						updateTime: Date.parse(new Date(this.time)),
						id: this.id
					}
				}).then(res => {
					this.showNewInDialog2 = false
					this.$emit('re')
				})
			},
			//打开类别弹窗
			openFees() {
				this.$refs.fees.open()
			}
		},
		components: {
			"v-fees": fees
		}
	};
</script>

<style>
.main_item .el-input__inner{
	border-top:none;
	border-left: none;
	border-right: none;
	border-radius: 0;
	text-align: center;
	padding-left: 30px;
	padding-right: 30px;
}
.main_item .el-input-number span{
	display: none;
}
.main_item .el-cascader span{
	display: none;
}
.main_item .el-date-editor span{
	display: none;
}
.main_item .el-input-number .el-input__inner{
	color: red;
	font-size: 20px;
}
</style>
<style lang="scss" scoped>
.main{
	padding:0 120px;
	.main_item{
		position:relative;
		margin-bottom:15px;
		height:35px;
		i{
			position:absolute;
			font-size:25px;
			top:3px;
			z-index:1;
			color:#999;
		}
		i.type{
			right:5px;
			cursor:pointer;
			&:hover{
				color:#50b9ff;
			}
		}
	}
}
</style>
