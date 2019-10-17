<template>
  <div id="app">
    <ym-header></ym-header>
    <transition :name='name'>
      <router-view class="page"></router-view>
    </transition>
  </div>
</template>

<script>
import header from '@/views/header.vue'

export default {
  name: 'App',
  components:{
    'ym-header':header,
  },
  data(){
    return{
      name:null,
    }
  },
  watch:{
    '$route'(to,from){
      this.name=to.params.ani
    }
  },
};
</script>
<style lang="css">
  @import '//at.alicdn.com/t/font_1323037_heccle0vbpo.css';
  @import "/assets/css/elementReset.css";
  html{
    min-width: 1200px;
    min-height: 600px;
  }
</style>
<style scoped>
  #app{
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
  }
  .page{
    width: 100%;
    height: calc(100% - 40px);
    margin-top: 40px;
  }
  .login-enter{
      position: absolute;
      top: 0;
      left: 0;
  }
  .login-enter-to{
      position:absolute;
      top: 0;
      left: 0;
  }
  .login-enter-active{
      transition: 2s;
  }
  .login-leave{
      position: absolute;
      top: 0;
      left: 0;
      z-index: 99999;
  }
  .login-leave-to{
      position: absolute;
      top: 0;
      left: 0;
  }
  .login-leave-active{
      transition: 2s;
  }
</style>
