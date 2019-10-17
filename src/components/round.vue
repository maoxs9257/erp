<template lang="html">
  <div class="round">
    <div class="round_left">
      <span :style="{transform:'rotate('+leftdeg+'deg)',borderTopColor:color,borderLeftColor:color}"></span>
    </div>
    <div class="round_right">
      <span :style="{transform:'rotate('+rightdeg+'deg)',borderTopColor:color,borderLeftColor:color}"></span>
    </div>
    <div class="round_main">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props:['maxDeg','sp','color'],
  data(){
    return{
      leftdeg:135,
      rightdeg:-45,
      deg:0
    }
  },
  mounted(){
    this.init();
  },
  methods:{
    init(){
      this.leftdeg = 135;
      this.rightdeg = -45;
      this.ani()
    },
    ani(){
      let deg = 360;
      let sp = 5;
      if(this.maxDeg) deg = this.maxDeg;
      if(this.sp) sp = this.sp;
      if(this.deg<deg){
        this.deg += 3;
        this.deg>180?this.leftdeg=this.deg-45:this.rightdeg=this.deg-45;
        setTimeout(()=>{
          this.ani();
        },sp)
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.round{
  width: 110px;
  height: 110px;
  position: relative;
  .round_main{
    position: absolute;
    width:100%;
    height: 100%;
    text-align: center;
  }
  .round_left{
    float: left;
    width: 55px;
    height: 110px;
    overflow: hidden;
    span{
      float: left;
    }
  }
  .round_right{
    float: right;
    width: 55px;
    height: 110px;
    overflow: hidden;
    span{
      float: right;
    }
  }
  span{
    display: block;
    width: 110px;
    height: 110px;
    border-radius: 50%;
    border-top: 1px solid #11bf67;
    border-left: 1px solid #11bf67;
    border-right: 1px solid #f8f8f8;
    border-bottom: 1px solid #f8f8f8;
  }
  p.nnp{
    position: absolute;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background-color: #cf3a3a;
    top: 5px;
    right:5px;
    color: #ffffff;
    font-size: 14px;
    line-height: 22px;
    animation: in 1s;
  }
}
@keyframes in {
  0% {
    display: none;
    width: 0px;
    height: 0px;
  }
  50% {
    display: block;
    width: 0;
    height: 0;
  }
  100% {
    display: block;
    width: 22px;
    height: 22px;
  }
}
</style>
