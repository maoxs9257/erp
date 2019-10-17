<template lang="html">
  <div class="choice_option">
    <router-link :to="{ name: url}" @click.native='$emit("open")'>
      <i class="iconfont" :class="icon"></i>
    </router-link>
    <span>{{title}}</span>
  </div>
</template>

<script>
export default {
  props:['url','title','icon']
};
</script>

<style lang="scss" scoped>
  .choice_option{
    width: 104px;
    display: inline-block;
    margin:0 40px;
    a{
      display: block;
      width: 104px;
      height: 104px;
      border-radius: 50%;
      border-width: 1px;
      border-style: solid;
      border-color: #dddddd;
      i{
        font-size: 50px;
        line-height: 104px;
      }
    }
    span{
      font-size: 14px;
      line-height: 60px;
    }
    &:nth-child(1){
      a:hover{
        border-color: #00ac55;
      }
      i{
        color: #00ac55;
      }
    }
    &:nth-child(2){
      a:hover{
        border-color: #f27a61;
      }
      i{
        color: #f27a61;
      }
    }
    &:nth-child(3){
      a:hover{
        border-color: #0088cc;
      }
      i{
        color: #0088cc;
      }
    }
  }
</style>
