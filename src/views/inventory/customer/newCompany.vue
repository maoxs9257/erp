<template>
  <el-dialog center :title='title' :visible.sync='visible' width='700px' v-dialogDrag>
    <div class="newCompany">
      <el-form :inline="true" :model='data' :rules='rules' label-width="100px" ref='form'>
        <el-form-item label='公司名称：' prop='companyName'>
          <el-input style="width:200px" v-model='data.companyName' size='small'></el-input>
        </el-form-item>
        <el-form-item label='地址：' prop='address'>
          <el-input style="width:200px" v-model='data.address' size='small'></el-input>
        </el-form-item>
        <el-form-item label='联系人：' prop='displayName'>
          <el-input style="width:200px" size='small' v-model='data.displayName'></el-input>
        </el-form-item>
        <el-form-item label='电话号码：' prop='phone'>
          <el-input style="width:200px" size='small' v-model='data.phone'></el-input>
        </el-form-item>
        <el-form-item label='电子邮件：'>
          <el-input style="width:200px" size='small' v-model='data.email'></el-input>
        </el-form-item>
        <el-form-item label='QQ：'>
          <el-input style="width:200px" size='small' v-model='data.qq'></el-input>
        </el-form-item>
        <el-form-item label='代理费率：' v-if='type===3' prop='agentRate'>
          <el-input style="width:200px" size='small' v-model='data.agentRate'></el-input>
        </el-form-item>
        <el-form-item label='银行费率：' v-if='type===3' prop='bankRate'>
          <el-input style="width:200px" size='small' v-model='data.bankRate'></el-input>
        </el-form-item>
        <el-form-item label='保险费率：' v-if='type===3' prop='insureRate'>
          <el-input style="width:200px" size='small' v-model='data.insureRate'></el-input>
        </el-form-item>
        <el-form-item label='供应产地：' v-if='type===1'>
          <el-input style="width:200px" size='small' v-model='data.sourceFrom'></el-input>
        </el-form-item>
        <el-form-item label='初期欠款：' prop='initialArrears'>
          <el-input style="width:200px" size='small' v-model='data.initialArrears'></el-input>
        </el-form-item>
        <el-form-item label='公司类型：' prop='companyType'>
          <el-select size="small" v-model="data.companyType" placeholder="请选择">
						<el-option label="公司" value="1"></el-option>
						<el-option label="个人" value="2"></el-option>
					</el-select>
        </el-form-item>
        <el-form-item label='备注：'>
          <el-input style="width:200px" size='small' v-model='data.memo'></el-input>
        </el-form-item>
      </el-form>
      <div class="main_btn">
        <el-button type="primary" plain @click='close'>取消</el-button>
        <el-button type="primary" @click='submitForm'>确定</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props:['type'],
  computed:{
    title:function () {
      return this.type===1?'新建供应商':this.type===3?'新建开证公司':'新建清关公司';
    }
  },
  data(){
    let checkPhone = (rule, value, callback)=>{
      if (!(/^1[3456789]\d{9}$/.test(value))) {
        callback(new Error('请输入正确的手机号'));
      } else {
        callback();
      }
    };
    let checkNumber = (rule,value,callback)=>{
      value = value - 0;
      if(value===value&&Object.prototype.toString.call(value) === '[object Number]'){
        callback();
      }else{
        callback(new Error('请输入数字'));
      }
    }
    return{
      visible:false,
      userId:JSON.parse(this.$store.state.token).id,
      tenantId:JSON.parse(this.$store.state.token).tenantId,
      data:{
        companyName:'',
        address:'',
        displayName:'',
        phone:'',
        initialArrears:0,
        companyType:'',
        agentRate:'',
        bankRate:'',
        insureRate:''
      },
      rules:{
        companyName:[{required:true,message:'请输入名称',trigger:'blur'},{min:2,max:10,message:'长度在2 - 10 个字符之间',trigger:'blur'}],
        address:[{required:true,message:'请输入地址',trigger:'blur'},{min:2,max:20,message:'长度在2 - 20 个字符之间',trigger:'blur'}],
        displayName:[{required:true,message:'请输入联系人名称',trigger:'blur'},{min:2,max:10,message:'长度在2 - 10 个字符之间',trigger:'blur'}],
        phone:[{required:true,message:'请输入电话',trigger:'blur'}],
        initialArrears:[{required:true,message:'请输入初期欠款',trigger:'blur'},{ validator: checkNumber, trigger: 'blur' }],
        companyType:[{required:true,message:'请选择公司类型',trigger:'blur'}],
        agentRate:[{required:true,message:'请输入代理费率',trigger:'blur'},{ validator: checkNumber, trigger: 'blur' }],
        bankRate:[{required:true,message:'请输入银行费率',trigger:'blur'},{ validator: checkNumber, trigger: 'blur' }],
        insureRate:[{required:true,message:'请输入保险费率',trigger:'blur'},{ validator: checkNumber, trigger: 'blur' }],
      },
		  role: JSON.parse(this.$store.state.role),
    }
  },
  methods:{
    /**
    * 打开窗口
    * @method open
    */
    open(){
      this.visible = true;
      this.data = {
        companyName:'',
        address:'',
        displayName:'',
        phone:'',
        initialArrears:0,
        companyType:''
      }
    },
    /**
    * 关闭窗口
    * @method close
    */
    close(){
      this.visible = false;
    },
    /**
    * 表单验证
    * @method submitForm
    */
    submitForm(){
      this.$refs.form.validate((val)=>{
        if(val){
        	this.create();
        }else{
          this.$message.error('请验证信息是否填写正确')
        }
      })
    },
    /**
    * 添加公司
    * @method create
    */
    create(){
      const loading = this.$loading({lock: true, text: '创建中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
      let data = this.data;
      data.contactType = this.type;
      data.creatorId=this.userId;
      data.locked = 0;
      data.lockedReason = '';
      data.tenantId = this.tenantId;
      data.starLevel = 1;
      this.$axios.post('/aps/customerCompany/insertPartner',data)
        .then(res=>{
          loading.close();
          if(res.data.data){
            this.$message.success('创建成功');
            this.visible = false;
            this.$emit('cb')
          }else{
            this.$message.error('创建失败')
          }
        },()=>{
          loading.close();
          this.$message.error('创建失败')
        })
    }
  }
}
</script>
<style>
  .newCompany .el-form-item{
    margin-bottom: 16px;
  }
  .newCompany .el-select .el-input__inner{
		width: 200px;
	}
</style>
<style lang="scss" scoped>
.newCompany{
  .main_btn{
    margin-top: 10px;
    text-align:center;
  }
}
</style>
