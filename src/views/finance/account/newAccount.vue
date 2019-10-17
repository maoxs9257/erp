<template>
	<el-dialog title='新建账户' width='500px' center :visible.sync='visible' v-dialogDrag>
		<div style="padding:0 100px 0 50px;" class="newAcc">
			<el-form size='mini' ref='form' :model='newAcc' :rules='rules' label-width='100px'>
				<el-form-item label='账户名称：' prop='name'>
					<el-input size='mini' v-model='newAcc.name'></el-input>
				</el-form-item>
				<el-form-item label='账户余额：'>
					<el-input-number v-model="newAcc.remainingSum" :min="0"></el-input-number>
				</el-form-item>
				<el-form-item label='账户类型：' prop='displayName'>
					<el-select v-model='newAcc.displayName' style='width:100%'>
						<el-option label='现金' value='现金'></el-option>
						<el-option label='支付宝' value='支付宝'></el-option>
						<el-option label='微信' value='微信'></el-option>
						<el-option label='银行' value='银行'></el-option>
						<el-option label='信用卡' value='信用卡'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label='账户归属：' prop='type'>
					<el-select v-model='newAcc.type' style='width:100%'>
						<el-option label='个人' value='1'></el-option>
						<el-option label='公司' value='2'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label='绑定部门：' prop='deptName'>
					<div class="dept" @click='openDept'>{{newAcc.deptName}}</div>
				</el-form-item>
				<el-form-item label='银行卡号：' prop='code'>
					<el-input size='mini' v-model='newAcc.code'></el-input>
				</el-form-item>
				<el-form-item label='开户名称：' prop='openName'>
					<el-input size='mini' v-model='newAcc.openName'></el-input>
				</el-form-item>
				<el-form-item label='开户银行：' prop='openingBank'>
					<el-input size='mini' v-model='newAcc.openingBank'></el-input>
				</el-form-item>
				<el-form-item label='备注：'>
					<el-input size='mini' v-model='newAcc.description'></el-input>
				</el-form-item>
			</el-form>
		</div>
		<div style="text-align:center;margin-top:30px;">
			<el-button type='primary' plain @click="visible=false">取消</el-button>
			<el-button type='primary' @click='submitForm'>确定</el-button>
		</div>
		<department ref='dept' @cb='setDept'></department>
	</el-dialog>
</template>
<script>
import department from '@/components/department.vue'
export default{
	data(){
		return {
			visible:false,
			tenantId:JSON.parse(this.$store.state.token).tenantId,
			newAcc:{
				name:'',
				remainingSum:0,
				displayName:'',
				type:'',
				deptId:'',
				deptName:'',
				code:'',
				openName:'',
				openingBank:'',
				description:''
			},
			dept:{},
			rules:{
				name:[{required:true,message:'请输入账户名称',trigger:'blur'},{min:3,max:5,message:'长度在3到5个字符',trigger:'blur' }],
				displayName:[{required:true,message:'请选择账户类型',trigger:'change'}],
				type:[{required:true,message:'请选择账户归属',trigger:'change'}],
				deptName:[{required:true,message:'请选择部门',trigger:'change'}],
				code:[{required:true,message:'请输入银行卡号',trigger:'blur'}],
				openName:[{required:true,message:'请输入开户名称',trigger:'blur'}],
				openingBank:[{required:true,message:'请输入开户名称',trigger:'blur'},{min:4,message:'长度最少4个字符',trigger:'blur' }]
			}
		}
	},
	methods:{
		/**
		* 打开新建窗口
		* @method open
		*/
		open(){
			this.visible = true;
			this.dept = {};
			this.newAcc = {
				remainingSum:0,
				displayName:'',
				type:'',
				deptId:'',
				deptName:'',
				code:'',
				openName:'',
				openingBank:'',
				description:''
			}
		},
		/**
		* 关闭新建窗口
		* @method close
		*/
		close(){
			this.visible = false;
		},
		/**
		* 打开部门窗口
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
			this.newAcc.deptId = data.id;
			this.newAcc.deptName = data.name;
		},
		/**
		* 表单验证
		* @method submitForm
		*/
		submitForm(){
			this.$refs.form.validate((valid) => {
        if (valid) {
          this.createAccount();
        } else {
          this.$message.error('请检验表单');
          return false;
        }
      });
		},
		/**
		* 新建账户
		* @method createAccount
		*/
		createAccount(){
			let loading = this.$loading({lock: true, text: '数据更新中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
			let data = this.newAcc;
			data.configure = JSON.stringify({openName:this.newAcc.openName});
			data.tenantId = this.tenantId;
			this.$axios.post('/apa/financeTable/addUserPaymentAccount',data)
			.then(res=>{
				loading.close();
				if(res.data&&res.data.data){
					this.close();
					this.$emit('cb');
				}else{
					this.$message.error('新建失败')
				}
			},()=>{loading.close();this.$message.error('新建失败')})
		}
	},
	components:{
		department
	}
};
</script>
<style>
.newAcc .el-input-number{
	width:100%;
}
.newAcc .el-input-number .el-input__inner{
	text-align: left;
	padding:0 15px;
}
.newAcc .el-input-number span{
	display: none;
}
</style>
<style scoped>
	.dept{
		height: 28px;
		border: 1px solid #DCDFE6;
		border-radius: 5px;
		padding: 0 15px;
	}
</style>
