<template>
  <div class="warp">
    <div class="warp_top">
      <div class="it">已选字段:</div>
      <div class="item" v-show='val.show' v-for='(val,key) in newOptions' :key='key'>
        {{val.name}}
        <i class="el-icon-error" @click='remove(val)'></i>
      </div>
    </div>
    <div class="warp_bottom">
      <div class="it">可选字段:</div>
      <div class="item" v-show='!val.show' v-for='(val,key) in newOptions' :key='key' @click='add(val)'>
        <i class="iconfont xinjian"></i>
        {{val.name}}
      </div>
    </div>
    <div class="warp_btn">
      <el-button type="primary" plain @click='close'>取消</el-button>
      <el-button type="primary" @click='sure'>确定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props:['data'],
  data(){
    return{
      newOptions:JSON.parse(JSON.stringify(this.data))
    }
  },
  methods:{
    /**
    * 取消
    * @method close
    */
    close(){
      this.$emit('close')
    },
    /**
    * 确定
    * @method sure
    */
    sure(){
      this.$emit('cb',this.newOptions);
      this.close();
    },
    /**
    * 删除选项
    * @method remove
    */
    remove(data){
      data.show = false;
    },
    /**
    * 添加选项
    * @method add
    */
    add(data){
      data.show = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.warp{
  height: 450px;
  .warp_btn{
    text-align: center;
    margin-top: 10px
  }
  .warp_top{
    padding-top: 20px;
    height: 200px;
    .item{
      position: relative;
      display: inline-block;
      margin-right: 10px;
      margin-bottom:10px;
      border: 1px solid #409EFF;
      width: 100px;
      height: 24px;
      padding-left: 8px;
      border-radius: 3px;
      color: #888;
      line-height: 22px;
      font-size: 14px;
      i{
        position: absolute;
        right: 3px;
        line-height: 22px;
        display: none;
        &:hover{
          color: #409EFF;
        }
      }
      &:hover i{
        display: inline;
      }
    }
  }
  .warp_bottom{
    padding-top: 30px;
    height: 200px;
    border-top: 1px solid #ddd;
    line-height: 30px;

    .item{
      position: relative;
      display: inline-block;
      padding-left: 25px;
      padding-right: 10px;
      margin-right: 10px;
      margin-bottom: 10px;
      i{
        position: absolute;
        left: 6px;
        font-size: 18px;
        color: #ffffff;
        display: none;
      }
      &:hover{
        background-color: rgb(51, 214, 112);
        color: #ffffff;
        i{
          display: inline;
        }
      }
    }
  }
  .it{
    display: inline-block;
    width: 105px;
    margin-bottom: 10px;
  }
}
</style>
