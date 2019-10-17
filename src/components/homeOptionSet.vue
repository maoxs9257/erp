<template lang="html">
  <el-dialog width="500px" :class="{more:dataCopy.length>3}" title='设置' center :visible.sync='show' v-dialogDrag>
    <div class="dialog_main">
      <div class="options">
        <div class="option" v-for='(val,key) in dataCopy' :key='key' @click='val.show = !val.show'>
          <i class="ic iconfont" :class="val.icon"></i>
          <span>{{val.name}}</span>
          <i v-show='val.show' class="b iconfont xuanze"></i>
        </div>
      </div>
    </div>
    <div style='margin-top:10px;text-align:center'>
      <el-button type='primary' plain @click='close'>取消</el-button>
      <el-button type='primary' @click='sure'>确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props:['data'],
  data(){
    return{
      show:false,
      dataCopy:JSON.parse(JSON.stringify(this.data)),
    }
  },
  methods:{
    open(){
      this.show = true;
    },
    close(){
      this.show = false;
    },
    sure(){
      let data = JSON.parse(JSON.stringify(this.dataCopy));
      this.$emit('updata',data);
      this.show = false;
    }
  }
};
</script>

<style lang="scss" scoped>
  .dialog_main{
    text-align: center;
    overflow: auto;
    .options{
      display: inline-block;
      max-width: 390px;
    }
    .option{
      width: 90px;
      height: 90px;
      border:1px solid #fff;
      float: left;
      margin:0 20px 20px;
      cursor: pointer;
      position: relative;
      background-color: #f5f5f5;
      padding-top: 16px;
      &:hover{
        border:1px solid #409EFF;
      }
      .b{
        position: absolute;
        right: 0;
        bottom: 0;
        height: 20px;
        line-height: 20px;
        font-size: 20px;
        color: #409EFF;
      }
      .ic{
        font-size: 44px;
        line-height: 36px;
        display: block;
        color: #999999;
      }
      span{
        font-size: 14px;
        line-height: 25px;
        color: #999999;
      }
    }
  }
</style>
