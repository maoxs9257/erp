<template>
	<el-dialog width="700px" center :visible.sync="newcus" title="新建客户" v-dialogDrag>
		<div class="main customer_form">
			<el-form :inline="true" :model="newData" :rules="rules" label-width="100px" ref="form">
				<el-form-item label="客户名称" prop="fullName">
					<el-input style="width:200px" size="small" v-model="newData.fullName"></el-input>
				</el-form-item>
				<el-form-item label="客户地址" prop="address">
					<el-input style="width:200px" size="small" v-model="newData.address"></el-input>
				</el-form-item>
				<el-form-item label="客户电话" prop="phone">
					<el-input style="width:200px" size="small" v-model="newData.phone"></el-input>
				</el-form-item>
				<el-form-item label="客户传真">
					<el-input style="width:200px" size="small" v-model="newData.fax"></el-input>
				</el-form-item>
        <el-form-item label="QQ">
          <el-input style="width:200px" size="small" v-model="newData.qq"></el-input>
        </el-form-item>
				<el-form-item label="联系人" prop="displayName">
					<el-input style="width:200px" size="small" v-model="newData.displayName"></el-input>
				</el-form-item>
				<el-form-item label="公司归属" prop="contactType">
					<el-select size="small" v-model="newData.contactType" placeholder="请选择">
						<el-option label="公司" value="1"></el-option>
						<el-option label="个人" value="2"></el-option>
					</el-select>
				</el-form-item>
        <el-form-item label="备注">
          <el-input style="width:200px" size="small" v-model="newData.memo"></el-input>
        </el-form-item>
			</el-form>
			<div class="fotbtn">
				<el-button type="primary" plain @click="close">取消</el-button>
				<el-button type="primary" @click="submitForm">确定</el-button>
			</div>
		</div>
	</el-dialog>
</template>

<script>
	export default {
		name: "newcustomer",
		data(){
			return{
				newcus:false,
				newData:{
					fullName:'',
					address:'',
					phone:'',
					fax:'',
					displayName:'',
					phone1:'',
					contactType:'',
				},
				rules:{
					fullName:[{required:true,message:'请输入客户名称',trigger:'blur'},{min:2,max:10,message:'长度在2 - 10 个字符之间',trigger:'blur'}],
					address:[{required:true,message:'请输入客户地址',trigger:'blur'},{min:2,max:50,message:'长度在2 - 50 个字符之间',trigger:'blur'}],
					phone:[{required:true,message:'请输入客户电话',trigger:'blur'}],
					displayName:[{required:true,message:'请输入联系人名称',trigger:'blur'},{min:2,max:10,message:'长度在2 - 10 个字符之间',trigger:'blur'}],
					contactType:[{required:true,message:'请选择客户类型',trigger:'blur'}],
				},
				tenantId: JSON.parse(this.$store.state.token).tenantId,
				userId: JSON.parse(this.$store.state.token).id,
        role: JSON.parse(this.$store.state.role),
			}
		},

		methods:{
			/**
			 * 打开窗口
			 * @method open
			 * */
			open(){
				this.newcus = true;
				this.newData = {};
			},
			/**
			 * 关闭窗口
			 * @method close
			 * */
			close(){
				this.newcus = false;
			},
			/**
			 * 表单验证
			 * @method submitForm
			 * */
			submitForm(){
				this.$refs.form.validate((val)=>{
					if(val){
            if(this.role.erp_customer_new){
                this.create();
            }else{
              this.$message.error('没有新建客户权限')
            }
					}else{
						this.$message.error('请验证信息是否填写正确')
					}
				})
			},
			/**
			 * 创建客户
			 * @method create
			 * */
			create(){
				const loading = this.$loading({lock: true, text: '客户创建中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let data={
					customerCompany:{
						address: this.newData.address,
						creatorId: this.userId,
						fax: this.newData.fax,
						fullName: this.newData.fullName,
						locked: 0,
						phone: this.newData.phone,
						tenantId: this.tenantId,
						type: 0,
            memo:this.newData.memo,
					},
					customerContact:{
						contactType: this.newData.contactType,
						creatorId: this.userId,
						displayName: this.newData.displayName,
						locked: 0,
						phone: this.newData.phone,
						tenantId: this.tenantId,
            qq:this.newData.qq,
            memo:this.newData.memo,
					}
				};
				this.$axios.post('/aps/customerCompany/addCustomerCompanyDtoW',data)
					.then(res=>{
						loading.close();
						if(res.data&&res.data.data){
							this.$message.success('客户创建成功');
							this.$emit('fin');
							this.newcus = false;
						}else{
							this.$message.error('客户创建失败')
						}
					},()=>{
						loading.close();
						this.$message.error('客户创建失败')
					})
			}
		}
	}
</script>
<style>
	.customer_form .el-select .el-input__inner{
		width: 200px;
	}
	.customer_form .el-form-item{
		margin-bottom: 16px;
	}

</style>
<style scoped lang="scss">
.main{
	.fotbtn{
		text-align: center;
		margin-top: 14px;
	}
}
</style>
