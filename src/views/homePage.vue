<template lang="html">
  <div class="homepage">
    <div class="homepage_top">
      <img class="logo" src="../assets/imgs/logo.png" alt="">
      <span class="title">{{info.companyName}}</span>
    </div>
    <div class="homepage_centent">
      <div class="homepage_centent_item">
        <a @click='inventory'>
          <i class="i1 iconfont jinxiaocun"></i>
          <p>进销存</p>
        </a>
      </div>
      <div class="homepage_centent_item">
        <a @click='finance'>
          <i class="i2 iconfont caiwu"></i>
          <p>财务记账</p>
        </a>
      </div>
      <div class="homepage_centent_item">
        <a @click='store'>
          <i class="i3 iconfont cebian-cangkuguanli"></i>
          <p>仓库管理</p>
        </a>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  computed:{
    info:function () {
      return JSON.parse(this.$store.state.token);
    },
    role:function () {
      return JSON.parse(this.$store.state.role)
    }
  },
  methods:{
    // 进销存
    inventory(){
    	let inventory = sessionStorage.getItem('inventory');
    	if(inventory){
		    this.$store.commit('setHeadBack',JSON.stringify({name:"进销存",url:"inventoryHomePage"}));
		    this.$router.push({name:'productHome'})
      }else{
    		sessionStorage.setItem('inventory','true');
		    this.$store.commit('setHeadBack',JSON.stringify({name:"进销存",url:"inventoryHomePage"}));
		    this.$router.push({name:'inventoryHomePage'})
      }
    },
    // 财务
    finance(){
    	let finance = sessionStorage.getItem('finance');
    	if(finance){
		    this.$store.commit('setHeadBack',JSON.stringify({name:"财务记账",url:"financeHomePage"}));
		    this.$router.push({name:'chargeHome'})
      }else{
    		sessionStorage.setItem('finance','true');
		    this.$store.commit('setHeadBack',JSON.stringify({name:"财务记账",url:"financeHomePage"}));
		    this.$router.push({name:'financeHomePage'})
      }
    },
    // 仓库
    store(){
			let store = sessionStorage.getItem('store');
			if(store){
		    this.$store.commit('setHeadBack',JSON.stringify({name:"仓库管理",url:"storeHomePage"}));
		    this.$router.push({name:'outStoreHome'})
      }else{
				sessionStorage.setItem('store','true');
        this.$store.commit('setHeadBack',JSON.stringify({name:"仓库管理",url:"storeHomePage"}));
        this.$router.push({name:'storeHomePage'})
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.homepage{
  background-color: #e5e5e5;
  position: absolute;
}
.homepage_top{
  position: absolute;
  top: 50px;
  left: 0;
  width: 100%;
  text-align: center;
  img{
    width: 47px;
    height: 47px;
    vertical-align: middle;
  }
  span{
    vertical-align: middle;
    font-size: 16px;
    margin-left: 10px;
    color: #666666;
  }
}
.homepage_centent{
  position: absolute;
  width: 100%;
  top:50%;
  transform: translateY(-50%);
  text-align: center;
  .homepage_centent_item{
    display: inline-block;
    width:125px;
    height: 110px;
    border-radius: 4px;
    border:#ffffff 2px solid;
    margin: 0 38px;
    text-align: center;
    box-sizing: content-box;
    overflow: hidden;
    cursor: pointer;
    box-shadow: 0 8px 20px 0 rgba(0, 0, 0, 0.08);
    &:hover{
      border:2px solid #69aeff;
    }
    a{
      display: block;
      width: 100%;
      height: 100%;
      background-color: #ffffff;
    }
    i{
      font-size: 50px;
      line-height: 50px;
      padding-top: 18px;
      float: left;
      width: 100%;
      color: #3986EF;
    }
    p{
      line-height: 26px;
      color: #666666;
      font-size: 14px;
      float: left;
      width: 100%;
    }
  }
}
</style>
