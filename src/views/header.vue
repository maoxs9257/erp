<template lang="html">
  <div class="header">
    <div class="header_left">
      <div class="header_left_content">
        <router-link :to="{ name: 'homePage'}">
          <img src="../assets/imgs/left.png" alt="">
          <!-- <i class="iconfont icon-caidan"></i> -->
        </router-link>
       <router-link v-if='nowModule' :to="{ name: nowModule.url}">
          <span>{{nowModule.name}}</span>
        </router-link>
      </div>
    </div>
    <div class="header_right">
      <div class="header_right_content">
        <div class="login">
					<span class="login_name">{{userInfo?userInfo.userName:''}}</span>
          <span class='login_ic' @click='openNews'><i class='iconfont xiaoxi'></i>{{news}}</span>
					<span class="login_out" @click="loginOut">退出</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return{
    }
  },
  methods:{
		//退出
		loginOut(){
			this.$store.commit('loginout');
			this.$store.commit('removeRole');
			this.$router.push({name:'login'});
      sessionStorage.clear();
		},
    // 打开消息中心
    openNews(){
      if(this.$route.name!=='workbench'){
        sessionStorage.setItem('newsBack',this.$route.fullPath);
        this.$router.push({name:"workbench"})
      }else{
      	let url = sessionStorage.getItem('newsBack');
      	if(url){
			    this.$router.push(url)
        }else{
			    this.$router.push({name:"homePage"})
        }
      }
    }
  },
	computed: {
		userInfo:function(){
			return JSON.parse(this.$store.state.token);
		},
		nowModule:function(){
			return JSON.parse(this.$store.state.headBack);
		},
    news:function () {
      let data = this.$store.state.news;
      let num = 0;
      for(let i in data){
        num += data[i].length
      }
      return num
    }
	},
}
</script>
<style lang="scss" scoped>
.header{
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  height: 40px;
  width: 100%;
  background-color: #3e3e3e;
}
.header_left{
  float: left;
  height: 40px;
  margin-left: 25px;
  .header_left_content{
    margin-top: 5px;
  }
  img{
    width: 30px;
    height: 30px;
    margin-right: 8px;
    vertical-align: middle;
  }
  span{
    color: #ffffff;
    line-height: 25px;
    vertical-align: middle;
    font-size: 14px;
  }
}
.header_right{
	float: right;
	height: 40px;
	margin-right: 15px;
	.header_right_content{
		height: 40px;
		line-height: 40px;
		color: #E5EADD;
    font-size: 14px;
		.login_out{
			margin-left: 20px;
			cursor: pointer;
		}
    .login_ic{
      margin-left: 5px;
      cursor: pointer;
      i{
        font-size: 20px;
        vertical-align: middle;
      }
    }
	}
}
</style>
