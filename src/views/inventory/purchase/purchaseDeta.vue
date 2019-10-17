<template lang="html">
  <div class="deta">
    <div class="deta_header">
      <ym-hbt :to='{name:back}' title='采购合同详情'></ym-hbt>
    </div>
    <div class="deta_mid">
      <div class="deta_mid_bar" :class="{short:short}">
        <div class="bar bar_left" @click="setVisible=true">
          <i class="iconfont cebian-shezhi"></i>
          <span v-show='!short'>设置</span>
        </div>
        <div class="bar bar_left" @click='openRemove'>
          <i class="iconfont shanchu"></i>
          <span v-show='!short'>删除</span>
        </div>
        <div class="bar bar_right" @click='short=!short'>
          <i v-if="!short" class="el-icon-arrow-right"></i>
          <i v-if="short" class="el-icon-arrow-left"></i>
        </div>
      </div>
      <div class="clearfix"></div>
      <div class="deta_mid_round" v-if='dataInfo.status===1'>
        <div class="option round round1" @click='examine' v-if='dataInfo.approveState!=2'>审核</div>
        <div class="option round round2 back" @click='examineBack' v-if='dataInfo.approveState==2&&dataInfo.state!=3'>已审核</div>
        <div class="option round round2 back" v-if='dataInfo.approveState==2&&dataInfo.state==3'>已审核</div>
        <div class="option"><i class="iconfont zhankai"></i></div>
        <div class="option round round1" v-if='dataInfo.state!=3' @click='openMoney'>付款</div>
        <div class="option round round2" v-if='dataInfo.state==3'>已付款</div>
      </div>
      <div class="deta_mid_main">
        <div class="deta_mid_infos">
          <div class="deta_infos_row">
            <div class="deta_row_item">
              <span class="n">采购单号：</span>
              <span class="v">{{dataInfo.contractSn}}</span>
            </div>
            <div class="deta_row_item">
              <span class="n">外部单号：</span>
              <span class="v">{{dataInfo.outterNo}}</span>
            </div>
            <div class="deta_row_item">
              <span class="n">供应商：</span>
              <span class="v">{{dataInfo.companyLineName}}</span>
            </div>
            <div class="deta_row_item">
              <span class="n">采购时间：</span>
              <span class="v">{{dataInfo.createTime|time('y-m-d')}}</span>
            </div>
          </div>
          <div class="deta_infos_row">
            <div class="deta_row_item">
              <span class="n">产地：</span>
              <span class="v">{{dataInfo.sourceFrom}}</span>
            </div>
            <div class="deta_row_item">
              <span class="n">开证公司：</span>
              <span class="v">{{dataInfo.openCompanyName?dataInfo.openCompanyName:"无"}}</span>
            </div>
            <div class="deta_row_item">
              <span class="n">采购数量：</span>
              <span class="v">{{dataInfo.amount}}</span>
            </div>
            <div class="deta_row_item">
              <span class="n">采购金额：</span>
              <span class="v">{{dataInfo.totalPrice}}</span>
            </div>
          </div>
          <div class="deta_infos_row">
            <div class="deta_row_item">
              <span class="n">保证金：</span>
              <span class="v">{{dataInfo.prepayPrice}}</span>
            </div>
            <div class="deta_row_item">
              <span class="n">创建人员：</span>
              <span class="v">{{dataInfo.creatorName}}</span>
            </div>
            <div class="deta_row_item">
              <span class="n">HTC：</span>
              <span class="v">{{dataInfo.isThc==1?'含HTC':'不含HTC'}}</span>
            </div>
          </div>
        </div>
        <div class="deta_mid_table">
          <table>
            <tr>
              <th>序号</th>
              <th v-if="tableShow.attachment">合同文档</th>
              <th v-if="tableShow.amount">采购数量</th>
              <th v-if="tableShow.totalPrice">采购金额</th>
              <th v-if="tableShow.prepayPrice">保证金</th>
              <th v-if="tableShow.memo">备注</th>
              <th v-if='dataInfo.approveState!=2'>操作</th>
            </tr>
            <tr>
              <td>1</td>
              <td v-if="tableShow.attachment"><a :href="dataInfo.attachment|imgUrl" download="合同">{{dataInfo.attachment}}</a></td>
              <td v-if="tableShow.amount">{{dataInfo.amount}}</td>
              <td v-if="tableShow.totalPrice">{{dataInfo.totalPrice}}</td>
              <td v-if="tableShow.prepayPrice">{{dataInfo.prepayPrice}}</td>
              <td v-if="tableShow.memo">{{dataInfo.memo}}</td>
              <td v-if='dataInfo.approveState!=2&&dataInfo.status===1'>
                <i class="iconfont xiugai" @click="openModify"></i>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <!-- 收款 -->
    <el-dialog class='money' title='付款' center :visible.sync='moneyVisible' v-dialogDrag>
      <div class="money_main">
        <div class="money_main_item">
          <i class="ic iconfont baozhengjin"></i>
          <div class="money_div">{{dataInfo.prepayPrice}}</div>
        </div>
        <div class="money_main_item">
          <i class="ic iconfont zhanghu"></i>
          <el-select v-model='acckey' class="input__inner-center" placeholder='选择账户'>
            <el-option v-for='(val,key) in accData' :key='key' :label='val.name' :value='key'></el-option>
          </el-select>
        </div>
        <div class="money_main_item">
          <i class="ic iconfont riqi"></i>
          <el-date-picker v-model="priceTime" type="date" placeholder="选择日期"></el-date-picker>
        </div>
        <el-input type="textarea" resize="none" v-model='memo' maxlength="30" show-word-limit placeholder="备注。。。"></el-input>
      </div>
      <div style='margin-top:30px;text-align:center'>
        <el-button type='primary' plain @click="moneyVisible=false">取消</el-button>
        <el-button type='primary' @click="payMoney">确定</el-button>
      </div>
    </el-dialog>
    <!-- 修改 -->
		<el-dialog width="600px" title='修改' center :visible.sync='modifyVisible' v-dialogDrag>
			<div class="modify_main">
				<div class="modify_main_item">
					<span class="n">采购数量</span>
          <el-input-number style="width:200px;margin-left:10px;" v-model="modifyInfo.amount" size='mini' :min="1"></el-input-number>
				</div>
				<div class="modify_main_item">
					<span class="n">采购金额</span>
          <el-input-number style="width:200px;margin-left:10px;" :precision='2' v-model="modifyInfo.totalPrice" size='mini' :min="1"></el-input-number>
				</div>
				<div class="modify_main_item">
					<span class="n">保证金</span>
          <el-input-number style="width:200px;margin-left:10px;" :precision='2' v-model="modifyInfo.prepayPrice" size='mini' :min="0"></el-input-number>
				</div>
				<div class="modify_main_item">
					<span class="n">备注</span>
          <el-input size='mini' style="width:200px;margin-left:10px;" v-model="modifyInfo.memo" placeholder="请输入内容"></el-input>
				</div>
			</div>
      <div style='margin-top:30px;text-align:center'>
        <el-button type='primary' plain @click="modifyVisible=false">取消</el-button>
        <el-button type='primary' @click="modifyContract">确定</el-button>
      </div>
		</el-dialog>
		<!-- 设置 -->
		<el-dialog width="800px" title="设置" center :visible.sync="setVisible" v-dialogDrag>
			<el-tabs v-model="activeName">
			  <el-tab-pane label="表格字段" name="first">
			  	<options :data='tableOptions' @cb='updataTableOptions' @close='setVisible=false'></options>
			  </el-tab-pane>
			</el-tabs>
		</el-dialog>
	</div>
</template>

<script>
import headBackTitle from '@/components/headBackTitle.vue'
import options from '@/components/options.vue'
export default {
  components:{
    "ym-hbt":headBackTitle,
		"options":options
  },
  data(){
    return{
      short:false,
      back:this.$route.query.backUrl,
      dataInfo:{},
      userId:JSON.parse(this.$store.state.token).id,
      tenantId:JSON.parse(this.$store.state.token).tenantId,
      moneyVisible:false,
			modifyVisible:false,
      price:'',
      acckey:'',
      accData:[],
      memo:'',
      priceTime:'',
			role:JSON.parse(this.$store.state.role),
			modifyInfo:{},
			setVisible:false,
			activeName:'first'
    }
  },
	computed:{
	  tableShow:function() {
	    let temp = {};
	    this.tableOptions.forEach((val)=>{
	      temp[val.key]=val.show
	    })
	    return temp;
	  },
		tableOptions:function(){
			return JSON.parse(this.$store.state.setJson).tableOptions.PD;
		}
	},
  methods:{
    /**
    * 获取意向单详情
    * @method getData
    * @param id 意向单id
    */
    getData(id){
      const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
      let params = {porposeNo:id};
      this.$axios.get('/apt/purposeForm/showPurposeInfo',{params})
      .then(res=>{
        loading.close();
        if(res.data&&res.data.data){
          this.dataInfo = res.data.data;
        }else{
          this.$message.error('获取意向单失败')
        }
      },()=>{
        loading.close();
        this.$message.error('获取意向单失败')
      })
    },
    /**
    * 删除合同单
    * @method removeData
    */
		openRemove(id){
			if(this.dataInfo.approveState===2) return this.$message.error('合同单已审核，无法作废');
			this.$confirm('此操作将永久删除, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.removeData(id);
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});          
			});
		},
    removeData(id){
			const loading = this.$loading({lock: true, text: '删除合同单', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
      let data = [this.dataInfo.id];
      this.$axios.post('/apt/purposeForm/deletePurposeContract',data)
      .then(res=>{
				loading.close();
        if(res.data&&res.data.data){
          this.$router.push({name:'purchaseList'})
        }else{
          this.$message.error('删除失败')
        }
      },()=>{loading.close();this.$message.error('删除失败')})
    },
    /**
    * 审核合同
    * @method examine
    */
    examine(){
      if(!this.role.erp_purchase_mod) return this.$message.error('没有权限');
      let data = {
        opType:4,
        operatorId:this.userId,
        purposeOrderId:this.dataInfo.id,
        tenantId:this.tenantId,
      }
      this.$axios.post('/apt/purposeForm/modifyPurposeContractCheck',data)
      .then(res=>{
        if(res.data&&res.data.data){
          this.dataInfo.approveState = 2;
        }
      })
    },
    /**
    * 审核回退
    * @method examineBack
    */
    examineBack(){
      if(!this.role.erp_purchase_mod) return this.$message.error('没有权限');
      let data = {
        approveState:1,
        approverId:this.userId,
        id:this.dataInfo.id,
        tenantId:this.tenantId,
        updateTime:new Date(),
      }
      this.$axios.post('/apt/purposeForm/modifyPurposeContract',data)
      .then(res=>{
        this.dataInfo.approveState = 1;
      })
    },
    /**
    * 打开收费窗口
    * @method openMoney
    */
    openMoney(){
			if(!this.role.erp_pay_new) return this.$message.error('没有权限');
			if(this.dataInfo.approveState!==2)return this.$message('订单未审核');
      this.getAccount();
    },
    /**
    * 获取账户信息
    * @method getAccount
    */
    getAccount(){
      let loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
      this.$axios.get('/aps/sell/showByUserPayment/'+this.tenantId)
      .then(res=>{
        loading.close();
        if(res.data&&res.data.data){
          this.moneyVisible = true;
          this.accData = res.data.data;
        }else{
          this.$message.error('失败')
        }
      },()=>{
        loading.close();
        this.$message.error('失败')
      })
    },
    /**
    * 收钱
    * @method payMoney
    */
    payMoney(){
		  if(!this.role.erp_pay_new) return this.$message.error('没有权限');
		  if(!this.accData[this.acckey]) return this.$message.error('请选择账户');
		  if(!this.priceTime) return this.$message.error('请选择时间');
      let loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
      let data ={
        financeTable:{
          creatorId:this.userId,
          formPaymentAccountId:this.accData[this.acckey].id,
          fromAccountName:this.accData[this.acckey].name,
          fromAccountType:this.accData[this.acckey].displayName,
          money:this.dataInfo.prepayPrice,
          memo:this.memo,
          pushTime:new Date(this.priceTime),
          reffer:this.dataInfo.id,
          tenantId:this.tenantId,
          toAccountName:'undefined',
          toAccountType:'undefined',
          type:15,
        },
        purposeFormPayment:{
          contactId:this.dataInfo.supportId,
          contractId:this.dataInfo.id,
          creatorId:this.userId,
          memo:this.memo,
          payAmount:this.dataInfo.prepayPrice,
          payTime:new Date(this.priceTime),
          paymentAccountId:this.accData[this.acckey].id,
          tenantId:this.tenantId,
          purposeFormId:0
        },
        state:3
      };
      this.$axios.post('/apa/financeTable/contractPayment',data)
      .then(res=>{
        loading.close();
        if(res.data&&res.data.data){
          this.moneyVisible = false;
          this.dataInfo.state = 3;
        }else{
          this.$message.error('支付保证金失败');
        }
      },()=>{loading.close();this.$message.error('支付保证金失败')})
    },
    /**
    * 修改合同状态
    * @method modifyState
    */
    modifyState(callback){
      let data = {
        accountantId:this.userId,
        id:this.dataInfo.id,
        state:3
      };
      this.$axios.post('/apt/purposeForm/modifyPurposeContract',data)
      .then(res=>{
        if(res.data&&res.data.data){
          callback(true)
        }else{
          callback(false)
        }
      },()=>{callback(false)})
    },
    /**
    * 打开修改窗口
    * @method openModify
    */
    openModify(){
      if(!this.role.erp_purchase_mod) return this.$message.error('没有权限');
      this.modifyVisible=true;
      this.modifyInfo = JSON.parse(JSON.stringify(this.dataInfo));
    },
    /**
    * 修改合同
    * @method modifyContract
    */
    modifyContract(){
      if(!this.role.erp_purchase_mod) return this.$message.error('没有权限');
      let loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
      let data = {
        amount:this.modifyInfo.amount,
        prepayPrice:this.modifyInfo.prepayPrice,
        totalPrice:this.modifyInfo.totalPrice,
        updateTime:new Date(),
        id:this.modifyInfo.id,
        memo:this.modifyInfo.memo,
      };
      this.$axios.post('/apt/purposeForm/modifyPurposeContract',data)
      .then(res=>{
        loading.close();
        if(res.data&&res.data.data){
          this.modifyVisible=false;
          let id = this.$route.query.id;
          this.getData(id);
        }else{
          this.$message.error('修改失败')
        }
      },()=>{loading.close();this.$message.error('修改失败')})
    },
    // 表格字段更新
    updataTableOptions(data){
      let setJson = JSON.parse(this.$store.state.setJson);
      setJson.tableOptions.PD = data;
      this.$store.commit('setSetJson', setJson);
      this.upSetJson(setJson);
    },
    // 上传设置数据
    upSetJson(val) {
    	let data = {
    		settingText: JSON.stringify(val),
    		tenantId: this.tenantId,
    		userId: this.userId
    	}
    	this.$axios.post('/api/userSettingTable/modifyUserSettingTable', data)
    },
	},
  mounted(){
    let id = this.$route.query.id;
    this.getData(id);
  }
}
</script>
<style>
.money .el-dialog{
  width: 520px;
}
.modify_main_item .el-input-number span{
  display: none;
}
.money_main_item .el-input__inner{
  padding: 0 50px;
  border: 0;
  border-radius: 0;
  border-bottom: 1px solid #dddddd;
  text-align: center;
}
.money_main_item .el-select{
  display: block;
}
.money_main_item .el-date-editor.el-input{
  width: 100%
}
.money_main_item .el-input__icon{
  display: none;
}
.modify_main_item .el-input-number .el-input__inner{
  padding-left: 15px;
  padding-right: 15px;
  text-align: left;
}
</style>
<style lang="scss" scoped>
.deta_mid{
  position: relative;
  .fei{
    position: absolute;
    width: 200px;
    height: 200px;
    right: 0;
    i{
      font-size: 150px;
      color: red;
    }
  }
}

.modify_main{
	padding: 0 100px;
	.modify_main_item{
		height: 30px;
		line-height: 30px;
		margin-top: 20px;
		span.n{
			display: inline-block;
			width: 80px;
			text-align: right
		}
		input{
			width: 220px;
			height: 25px;
			border: 1px solid #ddd;
			margin-left:10px;
			border-radius: 3px;
			padding: 0 5px;
			&:focus{
				border:1px solid #00a0e9;
			}
		}
	}
}
.money_main{
  padding: 0 100px;
  .money_main_item{
    height: 40px;
    margin-bottom: 10px;
    position: relative;
    .money_div{
      width: 100%;
      height: 40px;
      border-bottom: 1px solid #dddddd;
      padding: 0 50px;
      text-align: center;
      line-height: 40px;
    }
    input{
      border: 0;
      border-bottom: 1px solid #dddddd;
      width: 100%;
      height: 40px;
      padding: 0 50px;
      text-align: center;
      &:focus{
        border-bottom: 1px solid #00a0e9;
      }
    }
    .ic{
      position: absolute;
      top:2px;
      left: 8px;
      font-size: 24px;
      z-index: 1;
    }
    .sp{
      position: absolute;
      top: 0;
      right: 0;
      font-size: 12px;
      line-height: 40px;
    }

  }
  .money_main_textarea{
    width: 100%;
    height: 80px;
    border-color: #dddddd;
  }
}
.deta .deta_mid_bar.short{
  width: 160px;
}
.deta_mid_table table{
  width: 100%;
  text-align: center;
  tr{
    height: 40px;
    border-bottom: 1px solid #ddd;
    i{
      font-size: 25px;
      &:hover{
        color: #00a0e9;
      }
    }
  }
}
</style>
