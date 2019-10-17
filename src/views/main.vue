<template lang="html">
  <div>
    <router-view class="left_nav"></router-view>
    <router-view class="right_main" name='main'></router-view>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
  .left_nav{
    float: left;
    width: 170px;
    height: 100%;
    background-color:#e0e9f6;
  }
  .right_main{
    width: calc(100% - 170px);
    height: 100%;
    float: right;
  }
</style>
