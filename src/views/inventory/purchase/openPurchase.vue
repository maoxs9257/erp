<template lang="html">
  <div class="bill">
    <div class="bill_header">
      <ym-hbt :to='{name:"purchaseHome"}' title='合同意向单'></ym-hbt>
    </div>
    <div class="bill_mi">
      <div class="bill_mi_item">
        <el-checkbox v-model="checkAddress">产地</el-checkbox>
      </div>
      <div class="bill_mi_item">
        <el-checkbox v-model="checkMemo">备注</el-checkbox>
      </div>
    </div>
    <div class="bill_main">
      <div class="bill_main_top">
        <div class="bill_infos clearfix">
          <div class="bill_info" @click='openSupplier'>
            <i class="ic iconfont gongyingshang"></i>
            <div class="bill_info_div">{{susup.companyName?susup.companyName:"选择供应商"}}</div>
          </div>
          <div class="bill_info">
            <el-select v-model="isClear" placeholder="是否需要清关">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </div>
          <div class="bill_info">
            <el-select v-model="isHTC" placeholder="HTC">
              <el-option label="单价含HTC" value="2"></el-option>
              <el-option label="单价不含HTC" value="3"></el-option>
            </el-select>
          </div>
          <div class="bill_info">
            <i class="ic iconfont cebain-xiaoshouguanli"></i>
            <input class="bill_info_input" type="text" v-model='outNo' placeholder="外部单号">
          </div>
          <div class="bill_info" v-if='checkAddress'>
            <input class="bill_info_input" type="text" v-model='address' placeholder="产地">
          </div>
          <div class="bill_info" v-if='checkMemo'>
            <input class="bill_info_input" type="text" v-model='memo' placeholder="备注">
          </div>
        </div>
        <div class="bill_infos clearfix">
          <div class="bill_info" @click='openOpen'>
            <i class="ic iconfont jinxiaocun-kaizhenggongsiguanli"></i>
            <div class="bill_info_div">{{suOE.companyName?suOE.companyName:'选择开证公司'}}</div>
            <span style="position:absolute;left:220px;top:25px;color:red;font-size:12px;width:330px;">*如果没有开公司，则可以不选（订单直接和供应商结算）</span>
          </div>
        </div>
        <div class="bill_infos clearfix">
          <div class="bill_info">
            <i class="ic iconfont hetong"></i>
            <div class="bill_info_div" @click="$refs.uploads.click()">
              {{contract?contract:'上传合同文件'}}
              <i v-if="contract" class="iconfont guanbi" @click.stop="contract=''"></i>
            </div>
          </div>
<!--          <div class="bill_info">-->
<!--            <input class="bill_info_input" type="text" v-model='contractNo' placeholder="合同编号">-->
<!--          </div>-->
          <div class="bill_info">
            <input class="bill_info_input" type="text" v-model='price' @change="price=checkNumber(price)" placeholder="采购金额">
          </div>
          <div class="bill_info">
            <input class="bill_info_input" type="text" v-model='num' @change="num=checkNumber(num)" placeholder="采购数量">
          </div>
          <div class="bill_info">
            <input class="bill_info_input" type="text" v-model='suPrice' @change="suPrice=checkNumber(suPrice)" placeholder="保证金额">
          </div>
        </div>
      </div>
      <div class="bill_main_fot">
        <div style="margin-top: 30px;text-align: right;">
          <el-button type="primary" :disabled='disabled' @click='create'>创建采购意向单</el-button>
        </div>
      </div>
    </div>
    <!-- 选择供应商 -->
    <company :type='1' ref='supplier' @cb='selectSupplier' @create='createSupplier'></company>
    <!-- 选择开公司 -->
    <company :type='3' ref='open' @cb='selectOpen' @create='createOpen'></company>
		<!-- 新建供应商 -->
    <newcompany :type='1' ref='newsupplier' @cb='createSupplierFinish'></newcompany>
		<!-- 新建开公司 -->
    <newcompany :type='3' ref='newopen' @cb='createOpenFinish'></newcompany>
    <input type="file" ref="uploads" style="position:absolute; clip:rect(0 0 0 0);" @click="$event.target.value=''" @change="uploadWord($event,1)">
	</div>
</template>

<script>
import headBackTitle from '@/components/headBackTitle.vue'
import company from './companySelection'
import newCompany from '../customer/newCompany'
export default {
  components:{
    "ym-hbt":headBackTitle,
    "company":company,
    "newcompany":newCompany
  },
  data(){
    return{
      checkMemo:true,
      checkAddress:true,
      checkOut:true,
      customerVisible:false,
      customerVisibleCopy:false,
			metaList:[],
      supplierList:[],
      tenantId:JSON.parse(this.$store.state.token).tenantId,
      userId:JSON.parse(this.$store.state.token).id,
      isHTC:'',
      chsup:{},
      susup:{},
      isClear:'',
      address:'',
      memo:'',
			opMetaList:[],
      openEList:[],
      chOE:{},
      suOE:{},
      contractNo:'',
      price:null,
      num:'',
      suPrice:'',
      outNo:'',
			role:JSON.parse(this.$store.state.role),
			suText:'',
			opText:'',
      contract:null,
			disabled:false,
    }
  },
  methods:{
    /**
    * 打开供应商窗口
    * @method openSupplier
    */
    openSupplier(){
      this.$refs.supplier.open();
    },
    /**
    * 选择供应商
    * @method selectSupplier
    */
    selectSupplier(data){
      this.susup = data;
    },
    /**
    * 打开开证公司窗口
    * @method openOpen
    */
    openOpen(){
      this.$refs.open.open();
    },
    /**
    * 选择开证公司
    * @method selectOpen
    */
    selectOpen(data){
      this.suOE = data;
    },
    /**
    * 打开新建供应商
    * @method createSupplier
    */
    createSupplier(){
    	if(this.role.erp_supplier_new){
		    this.$refs.newsupplier.open()
      }else{
    		this.$message.error('没有权限')
      }
    },
    /**
    * 新建供应商完成
    * @method createSupplierFinish
    */
    createSupplierFinish(){
      this.$refs.supplier.refresh();
    },
    /**
    * 打开新建开公司
    * @method createOpen
    */
    createOpen(){
    	if(this.role.erp_open_new){
		    this.$refs.newopen.open()
      }else{
    		this.$message.error('没有权限')
      }
    },
    /**
    * 新建开公司完成
    * @method createOpenFinish
    */
    createOpenFinish(){
      this.$refs.open.refresh();
    },
    // 上传合同文本
	  uploadWord(e,num){
      let loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
      let file = e.target.files[0];
      
			let formFile = new FormData();
			formFile.append('file',file);
			this.$axios({
				method:'post',
				url:'/api/storeTable/pictureUpload',
				headers:{"Content-Type":"multipart/form-data","Accept":"*/*"},
				data:formFile
			}).then(res=>{
				loading.close();
				if(res.data&&res.data.data){
					this.contract = res.data.data;
				}else{
					this.$message.error('上传合同失败')
				}
			},()=>{loading.close();this.$message.error('上传合同失败')})
    },
    /**
    * 数字验证
    * @method checkNumber
    */
    checkNumber(data){
      if(data==='') return '';
      if(parseFloat(data)){
        return parseFloat(data);
      }else{
        return '';
      }
    },
    /**
    * 创建采购意向单
    * @method create
    */
    create(){
			if(!this.role.erp_purchase_new) return this.$message.error('没有新建权限');
			if(!this.susup.id) return this.$message.error('请选择供应商');
			if(this.isClear==='') return this.$message.error('请选择是否需要清关');
			if(this.isHTC==='') return this.$message.error('请选择是否包含HTC');
			if(!this.outNo) return this.$message.error('请输入外部单号');
      if(!this.price) return this.$message.error('请输入采购金额');
      if(this.price<0) return this.$message.error('请输入正确金额');
      if(!this.num) return this.$message.error('请输入采购数量');
      if(this.num<0) return this.$message.error('请输入正确数量');
      if(!this.suPrice) return this.$message.error('请输入保证金');
      if(this.suPrice<0) return this.$message.error('请输入正确金额');
      const loading = this.$loading({lock: true,text: 'Loading',spinner: 'el-icon-loading',background: 'rgba(0, 0, 0, 0.7)'});
			this.disabled=true;
      let jsonText = null;
      if(!!this.suOE.id){
        jsonText = JSON.stringify({agentRate:this.suOE.agentRate,bankRate:this.suOE.bankRate,insureRate:this.suOE.insureRate})
      }
      this.$axios({
        method: 'post',
        url: '/apt/purposeForm/addToPurposeForm',
        data: {
          isThc: this.isHTC == 2 ? 1 : 0, //1:含htc，0:不含htc
          issuingId: this.suOE.id?this.suOE.id:0, //开证公司id 不需要开证为0
          needClear: this.isClear, //需要清关 （0：不需要，1：需要）
          prepayPrice: this.suPrice, //保证金
          supportId: this.susup.id, // 供应商id
          tenantId: this.tenantId,
          totalPrice: this.price, //采购金额
          amount: this.num, //采购数量
          sourceFrom: this.address, //产地
          approveState: 1, // 审核状态
          memo: this.memo,
          creatorId:this.userId,
          title:'',
          outterNo:this.outNo, //外部单号
          combinedRateText:jsonText, //费率 （保险费率+银行费率+代理费率）
			    attachment:this.contract,
        }
      }).then(res=>{
        loading.close();
        if(res&&res.data.data){
          this.$router.push({
            name:'purchaseDeta',
            query:{
              id:res.data.data,
              backUrl:"openPurchase",
            }
          })
        }else{
          this.$message.error('创建合同单失败');
					this.disabled=false;
        }
      },()=>{loading.close();this.$message.error('创建合同单失败');this.disabled=false})
    }
  },
  mounted() {
  	let data = this.$route.params.data;
  	if(data){
  		this.susup = data;
    }else{
  		this.susup = {};
    }
  }
};
</script>
<style>
.customer .el-dialog{
  width:760px;
  height: 560px;
}
</style>
<style lang="scss" scoped>
.customer_top{
  height: 50px;
  padding:0 30px;
}
.customer_main{
  height: 400px;
  padding:0 30px;
}
.dialog_fot{
  margin-top: 20px;
}
</style>
