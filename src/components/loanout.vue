<template>
<el-dialog width='580px' v-dialogDrag title="新建借出" :visible.sync="visible" center>
  <div class='newIn'>
      <div class="item">
        <i class="iconfont kehu"></i>
        <el-input v-model="people" placeholder="借款人"></el-input>
      </div>
      <div class="item">
        <i class="iconfont zafei"></i>
        <el-input-number style='width:100%' v-model="money" :min="0"></el-input-number>
      </div>
      <div class="item">
        <i class="iconfont zhanghu"></i>
        <el-select v-model="accKey" placeholder="选择账户" style='width:100%'>
            <el-option v-for="(val,key) in accData" :key='key' :label="val.name" :value='key'></el-option>
          </el-select>
      </div>
      <div class="item">
        <i class="iconfont riqi"></i>
        <el-date-picker style='width:100%' v-model="time" type="date" placeholder="选择日期"></el-date-picker>
      </div>
      <el-input type="textarea" resize='none' :autosize="{minRows:3,maxRow:3}" placeholder="请输入内容" v-model="memo"></el-input>
      <div style="text-align:center;margin-top:30px">
        <el-button type='primary' @click='save'>保存</el-button>
        <el-button type='primary' @click='saveAgain'>再记一笔</el-button>
      </div>
    </div>
</el-dialog>
</template>

<script>
export default {
  data() {
    return {
      tenantId:JSON.parse(this.$store.state.token).tenantId,
      userId:JSON.parse(this.$store.state.token).id,
      visible: false,
      people: '',
      money: 0,
      accKey: '',
      accData: [],
      time: '',
      memo: '',
    }
  },
  methods: {
    /**
    * 打开
    * @method open
    */
    open() {
      let loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
      let params = {tenantId: this.tenantId}
      this.$axios.get('/apa/financeTable/showPaymentAccount',{params})
      .then(res=>{
        loading.close();
        if(res.data&&res.data.data){
          this.visible = true
          this.people = ''
          this.money = 0
          this.accKey = ''
          this.time = ''
          this.memo = ''
          this.accData = res.data.data
        }else{
          this.$message.error('获取数据失败')
        }
      },()=>{loading.close();this.$message.error('获取数据失败');})
    },
    /**
    * 关闭
    * @method close
    */
    close(){
      this.visible = false;
    },
    /**
    * 保存
    * @method save
    */
    save() {
      this.createLend(() => {
        this.close();
        this.$emit('re');
      })
    },
    /**
    * 再记一笔
    * @method saveAgain
    */
    saveAgain() {
      this.createLend(() => {
        this.people = '';
        this.money = '';
        this.accKey = '';
        this.time = '';
        this.memo = '';
        this.$emit('re');
      })
    },
    /**
    * 新建借出
    * @method createLend
    */
    createLend(callback){
      if(!this.people) return this.$message.error('请输入借款人');
      if(!this.money) return this.$message.error('请输入金钱');
      if(!this.accData[this.accKey]) return this.$message.error('请选择账户');
      if(!this.time) return this.$message.error('请选择时间');
      let loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
      let data = {
        completeTime: Date.parse(new Date(this.time)),
        creatorId: this.userId,
        type: 4,
        toAccountName: this.people,
        toAccountType: 'undefined',
        formPaymentAccountId: this.accData[this.accKey].id,
        fromAccountName: this.accData[this.accKey].name,
        fromAccountType: this.accData[this.accKey].displayName,
        state: 1,
        tenantId: this.tenantId,
        money: this.money,
        remainingSum: this.money,
        borrowingPrice: this.money
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
  }
};
</script>
<style lang="scss">
  .newIn .el-input .el-input__inner{
    border-top:none;
    border-left:none;
    border-right:none;
    border-radius:0;
    text-align:center;
    padding-left:30px;
    padding-right:30px;
  }
  .newIn .el-input-number span{
    display:none;
  }
  .el-input__prefix{
    display:none
  }
</style>
<style lang="scss" scoped>
  .newIn {
    padding: 0 130px;
    .item{
      height:35px;
      margin-bottom:15px;
      position:relative;
      i{
        position:absolute;
        z-index:1;
        font-size:22px;
        top:3px;
      }
    }
  }
</style>
