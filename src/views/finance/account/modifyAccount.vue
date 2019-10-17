<template>
	<el-dialog title='修改账户信息' width='500px' :visible.sync='visible' center v-dialogDrag>
		<div style='padding:0 70px 20px'>
			<el-form :model='account' ref='form' :rules='rules' size='mini' label-width='95px'>
				<el-form-item label='账户名称：' prop='name'>
					<el-input v-model='account.name'></el-input>
				</el-form-item>
				<el-form-item label='账户类型：'  prop='displayName'>
					<el-select v-model='account.displayName' style='width:100%'>
						<el-option lable='现金' value='现金'></el-option>
						<el-option lable='支付宝' value='支付宝'></el-option>
						<el-option lable='微信' value='微信'></el-option>
						<el-option lable='银行' value='银行'></el-option>
						<el-option lable='信用卡' value='信用卡'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label='绑定部门：' prop='deptName'>
					<div class="dept" @click='openDept'>{{account.deptName}}</div>
				</el-form-item>
				<el-form-item label='银行卡号：' prop='code'>
					<el-input v-model='account.code'></el-input>
				</el-form-item>
				<el-form-item label='开户名称：' prop='openName'>
					<el-input v-model='account.openName'></el-input>
				</el-form-item>
				<el-form-item label='备注说明：'>
					<el-input v-model='account.description'></el-input>
				</el-form-item>
			</el-form>
		</div>
		<div style="text-align:center;margin-bottom:20px">
			<el-button size='small' type='primary' plain>取消</el-button>
			<el-button size='small' type='primary' @click='submitForm'>确定</el-button>
		</div>
		<department ref='dept' @cb='setDept'></department>
	</el-dialog>
</template>
<script>
import department from '@/components/department.vue'
export default{
	data(){
		return{
			visible:false,
			account:{
				name:'',
				displayName:'',
				deptName:''
			},
			rules:{
				name:[{required:true,message:'请输入账户名称',trigger:'blur'},{min:3,max:5,message:'长度在3到5个字符',trigger:'blur' }],
				displayName:[{required:true,message:'请选择账户类型',trigger:'change'}],
				deptName:[{required:true,message:'请选择部门',trigger:'change'}],
				code:[{required:true,message:'请输入银行卡号',trigger:'blur'}],
				openName:[{required:true,message:'请输入开户名称',trigger:'blur'}],
			}
		}
	},
	methods:{
		/**
		* 打开
		* @method open
		*/
		open(data){
			this.visible = true;
			this.account = JSON.parse(JSON.stringify(data));
			this.account.deptName = data.deptList[data.deptId];
			this.account.openName = JSON.parse(data.configure).openName;
			console.log(this.account)
		},
		/**
		* 关闭
		* @method close
		*/
		close(){
			this.visible = false;
		},
		/**
		* 打开部门
		* @method openDept
		*/
		openDept(){
			this.$refs.dept.open();
		},
		/**
		* 设置部门
		* @method setDept
		*/
		setDept(data){
			this.$set(this.account,'deptName',data.name)
			this.account.deptId = data.id;
			console.log(this.account)
		},
		/**
		* 表单检验
		* @method submitForm
		*/
		submitForm(){
			this.$refs.form.validate((valid) => {
				if (valid) {
					this.modifyAccount();
				} else {
					return false;
				}
	        });
		},
		/**
		* 修改账户信息
		* @method modifyAccount
		*/
		modifyAccount(){
			let loading = this.$loading({lock: true, text: '数据更新中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
			let data = this.account;
			data.configure = JSON.stringify({openName:this.account.openName});
			this.$axios.post('/apa/financeTable/modifyUserPaymentAccount',data)
			.then(res=>{
				loading.close();
				if(res.data&&res.data.data){
					this.close();
					data.deptList={[data.deptId]:data.deptName};
					this.$emit('cb',data)
				}else{
					this.$message.error('修改失败')
				}
			},()=>{loading.close();this.$message.error('修改失败')})
		}
	},
	components:{
		department
	}
};
</script>
<style scoped>
.dept{
	height: 28px;
	width: 100%;
	border:1px solid #DCDFE6;
	border-radius: 5px;
	padding: 0 15px;
	font-size: 12px;
}
.is-error .dept{
	border: 1px solid #F56C6C;
}
</style>