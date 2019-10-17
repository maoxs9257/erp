<template>
  <div class="workbench">
    <div class="back">
      <el-button size="mini" type="primary" plain @click="back">返回</el-button>
    </div>
    <div class="item" v-if="purposeContract.length!==0">
      <div class="item_header">
        <span class="h1">采购合同（{{purposeContract.length}}）</span>
        <span class="more" v-if="purposeContract.length>5" @click="$router.push({name:'purchaseList'})">更多</span>
      </div>
      <div class="item_content">
        <div class="list" v-for="key in 5" :key="key">
          <span class="span1">{{purposeContract[key-1]?purposeContract[key-1].supportName:null}}</span>
          <span class="span2">{{purposeContract[key-1]?purposeContract[key-1].contractSn:null}}</span>
          <span class="span3" v-if="purposeContract[key-1]" @click="goToH(purposeContract[key-1].contractSn)">详情></span>
        </div>
      </div>
    </div>
    <div class="item" v-if="purposeForm.length!==0">
      <div class="item_header">
        <span class="h2">采购单（{{purposeForm.length}}）</span>
        <span class="more" v-if="purposeForm.length>5" @click="$router.push({name:'goodsList'})">更多</span>
      </div>
      <div class="item_content">
        <div class="list" v-for="key in 5" :key="key">
          <span class="span1">{{purposeForm[key-1]?purposeForm[key-1].supportName:null}}</span>
          <span class="span2">{{purposeForm[key-1]?purposeForm[key-1].orderSn:null}}</span>
          <span class="span3" v-if="purposeForm[key-1]" @click="goToC(purposeForm[key-1].id)">详情></span>
        </div>
      </div>
    </div>
    <div class="item" v-if="clearance.length!==0">
      <div class="item_header">
        <span class="h3">清关单（{{clearance.length}}）</span>
        <span class="more" v-if="clearance.length>5" @click="$router.push({name:'clearList'})">更多</span>
      </div>
      <div class="item_content">
        <div class="list" v-for="key in 5" :key="key">
          <span class="span1">{{clearance[key-1]?clearance[key-1].supportName:null}}</span>
          <span class="span2">{{clearance[key-1]?clearance[key-1].orderSn:null}}</span>
          <span class="span3" v-if="clearance[key-1]" @click="goToQ(clearance[key-1].id)">详情></span>
        </div>
      </div>
    </div>
    <div class="item" v-if="sellForm.length!==0">
      <div class="item_header">
        <span class="h4">销售单（{{sellForm.length}}）</span>
        <span class="more" v-if="sellForm.length>5" @click="$router.push({name:'saleList'})">更多</span>
      </div>
      <div class="item_content">
        <div class="list" v-for="key in 5" :key="key">
          <span class="span1">{{sellForm[key-1]?sellForm[key-1].fullName:null}}</span>
          <span class="span2">{{sellForm[key-1]?sellForm[key-1].orderNo:null}}</span>
          <span class="span3" v-if="sellForm[key-1]" @click="goToS(sellForm[key-1].id)">详情></span>
        </div>
      </div>
    </div>
    <div class="item" v-if="storeInForm.length!==0">
      <div class="item_header">
        <span class="h5">入库单（{{storeInForm.length}}）</span>
        <span class="more" v-if="storeInForm.length>5" @click="$router.push({name:'inList'})">更多</span>
      </div>
      <div class="item_content">
        <div class="list" v-for="key in 5" :key="key">
          <span class="span1">{{storeInForm[key-1]?storeInForm[key-1].storeName:null}}</span>
          <span class="span2">{{storeInForm[key-1]?storeInForm[key-1].orderSn:null}}</span>
          <span class="span3" v-if="storeInForm[key-1]" @click="goToI(storeInForm[key-1].id)">详情></span>
        </div>
      </div>
    </div>
    <div class="item" v-if="tallyAudit.length!==0">
      <div class="item_header">
        <span class="h6">理货（2）</span>
        <span class="more">更多</span>
      </div>
      <div class="item_content">
        <div class="list">
          <span class="span1">上海鸿树木业有限公司</span>
          <span class="span2">HZ0000125455554</span>
          <span class="span3">产品详情></span>
        </div>
      </div>
    </div>
    <div class="item" v-if="lockForm.length!==0">
      <div class="item_header">
        <span class="h6">锁定单（{{lockForm.length}}）</span>
        <span class="more" v-if="lockForm.length>5" @click="$router.push({name:'lockList'})">更多</span>
      </div>
      <div class="item_content">
        <div class="list" v-for="key in 5" :key="key">
          <span class="span1">{{lockForm[key-1]?lockForm[key-1].lockNo:null}}</span>
          <span class="span2"></span>
          <span class="span3" v-if="lockForm[key-1]" @click="goToD(lockForm[key-1].id)">详情></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      tenantId: JSON.parse(this.$store.state.token).tenantId,
      clearance:[],
      lockForm:[],
      purposeContract:[],
      purposeForm:[],
      sellForm:[],
      storeInForm:[],
      tallyAudit:[],
    }
  },
  methods:{
    // 获取消息数据
    getNews(){
      const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
      let params = {tenantId: this.tenantId};
      this.$axios.get('/api/storeTable/auditNotice',{params})
      .then(res=>{
        loading.close();
        if(res.data&&res.data.data){
          let data = res.data.data;
          this.$store.commit('setNews',data);
          this.clearance = data.clearance;
          this.lockForm = data.lockForm;
          this.purposeContract = data.purposeContract;
          this.purposeForm = data.purposeForm;
          this.sellForm = data.sellForm;
          this.storeInForm = data.storeInForm;
          this.tallyAudit = data.tallyAudit;
        }else{
          this.$message.error('获取数据失败')
        }
      },()=>{loading.close();this.$message.error('获取数据失败')})
    },
    // 合同详情  {name:'purchaseDeta',query:{id:scope.row.contractSn,backUrl:'purchaseList'}}
    goToH(id){
      this.$router.push({
        name: 'purchaseDeta',
        query:{
          id:id,
          backUrl:'workbench'
        }
      })
    },
    // 进货单详情 {name:'goodsDeta',query:{backUrl:'goodsList',id:scope.row.id}}
    goToC(id){
      this.$router.push({
        name:'goodsDeta',
        query:{
          id:id,
          backUrl:'workbench'
        }
      })
    },
    // 清关单详情 {name:'clearDeta',query:{backUrl:'clearList',id:scope.row.id}}
    goToQ(id){
      this.$router.push({
        name:'clearDeta',
        query:{
          backUrl:'workbench',
          id:id
        }
      })
    },
    // 销售单详情 { name: 'saleDeta', query: {id:scope.row.id,backName:'saleList'} }
    goToS(id){
      this.$router.push({
        name:'saleDeta',
        query:{
          id:id,
          backName:'workbench'
        }
      })
    },
    // 入库单详情 { name: 'inDeta', query: {id:scope.row.id,backUrl:'inList'} }
    goToI(id){
      this.$router.push({
        name:'inDeta',
        query:{
          id:id,
          backUrl:'workbench'
        }
      })
    },
    //锁定单  {name:'lockDeta',query:{id:scope.row.id,backUrl:'lockList'}}
    goToD(id){
      this.$router.push({
        name:'lockDeta',
        query:{
          id:id,
          backUrl:'workbench'
        }
      })
    },
    // 返回
    back(){
      let backUrl = sessionStorage.getItem('newsBack');
      if(backUrl){
        this.$router.push(backUrl);
      }else{
        this.$router.push({name:'homePage'})
      }
    },
  },
  mounted() {
    this.getNews();
  }
}
</script>
<style lang="scss" scoped>
.workbench{
  background-color: #e5e5e5;
  padding: 50px 45px;
  overflow: auto;
  position: relative;
  .back{
    position: absolute;
    top: 20px;
    left: 60px;
  }
  .item{
    margin:15px;
    float: left;
    height: 340px;
    background-color: #ffffff;
    padding: 0 30px 30px;
    box-shadow: 0 8px 20px 0 rgba(0, 0, 0, 0.08);
    .item_header{
      height: 60px;
      line-height: 60px;
      font-size: 16px;
      .more{
        float: right;
        color: #999999;
        cursor: pointer;
        &:hover{
          color: #3986EF;
        }
      }
      .h1{
        color: #3986EF;
        font-weight: 600;
      }
      .h2{
        color: #F5A623;
        font-weight: 600;
      }
      .h3{
        color: #E77762;
        font-weight: 600;
      }
      .h4{
        color: #69CE5C;
        font-weight: 600;
      }
      .h5{
        color: #50B9FF;
        font-weight: 600;
      }
      .h6{
        color: #3986EF;
        font-weight: 600;
      }
    }
    .item_content{
      .list{
        height: 50px;
        background-color: #F5F5F5;
        line-height: 50px;
        padding: 0 10px;
        span{
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .span1{
          min-width: 125px;
          width: calc(50% - 40px);
        }
        .span2{
          min-width: 125px;
          width: calc(50% - 10px);
          text-align: center;
        }
        .span3{
          width:40px;
          cursor: pointer;
          &:hover{
            color: #3986EF;
          }
        }
      }
      .list:nth-child(2n){
        background-color: #ffffff;
      }
    }
  }
}
@media (min-width: 1450px){
  .item{
    width: calc(33.3333% - 30px)
  }
}
@media (max-width: 1450px){
  .item{
    width: calc(50% - 30px);
  }
}
</style>


