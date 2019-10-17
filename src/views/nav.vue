<template lang="html">
  <div class="nav">
    <div class="nav_item" v-for="(val,key) in navData" :key='key'>
      <p class="nav_item_top">{{key}}</p>
      <div class="nav_item_fot" v-for='(v,k) in val' :key='k'>
        <router-link :to="{name:v.url}">
          <i class="iconfont" :class="v.icon"></i>
          <span class="sp">{{v.name}}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      navData:null,
    }
  },
  beforeRouteEnter (to,from,next){
    next(vm => {
      vm.setData(to.meta.key)
    })
  },
  methods:{
    setData(key){
      this.navData = this.GLOBAL_.navConfig[key]
    }
  }
}
</script>

<style lang="scss" scoped>
  .nav{
    height: 100%;
    padding-top: 20px;
    .nav_item_top{
      line-height: 46px;
      font-size: 14px;
      padding-left: 30px;
      color: #666;
    }
    .nav_item_fot{
      height: 40px;
      line-height: 40px;
      overflow: hidden;
      a{
        display: inline-block;
        width: 100%;
        padding-left: 34px;
        .iconfont{
          color:#666;
          font-size: 22px;
          vertical-align: middle;
        }
        .sp{
          color: #666;
          vertical-align: middle;
        }
        &:hover{
          background-color: #cedbef;
        }
      }
      a.router-link-active{
        background-color: #50b9ff;
        .iconfont{
          color: #ffffff;
        }
        .sp{
          color: #ffffff;
        }
      }
    }
  }
</style>
