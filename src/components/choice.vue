<template lang="html">
  <el-dialog class="choice" :title='title' :visible.sync='show' center v-dialogDrag>
    <div class="choice_main">
      <slot name="one"></slot>
      <slot name="two"></slot>
      <slot></slot>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props:['title'],
  data(){
    return{
      show:false,
    }
  },
  methods:{
    open(){
      this.show = true;
    },
    close(){
      this.show = false;
    }
  }
};
</script>
<style lang="scss">
.choice .el-dialog{
  width: 710px;
  height: 400px;
}
.choice .el-dialog__body{
  height: 346px;
}
</style>
<style lang="scss" scoped>
  .choice_main{
    height: 144px;
    position: absolute;
    top: 100px;
    width: 650px;
    text-align: center;
    animation: upMove 0.5s ease-in;
    overflow: hidden;
  }
  @keyframes upMove{
    0% {top:300px}
    100% {top: 100px}
  }
</style>
