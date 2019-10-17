<template>
  <el-dialog v-loading='loading' title='选择部门' width='500px' :visible.sync='visible' v-dialogDrag append-to-body>
    <div class="main">
      <div class="item" :class="{active:!!selectData&&0===selectData.id}" @click='clearDept'>未指定</div>
      <div class="item" :class="{active:!!selectData&&val.id===selectData.id}" @click='checkDept(val)' v-for='(val,key) in dept' :key='key'>{{val.name}}</div>
    </div>
    <div style="margin-top:30px;text-align:center">
      <el-button size='small' type='primary' plain @click='close'>取消</el-button>
      <el-button size='small' type='primary' @click='setDept'>确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data(){
    return {
      visible:false,
      tenantId:JSON.parse(this.$store.state.token).tenantId,
      loading:false,
      dept:[],
      selectData:null,
    }
  },
  methods:{
    /**
    * 打开选择部门
    * @method open
    */
    open(){
      this.visible=true;
      this.dept = [];
      this.getData();
    },
    /**
    * 关闭选择部门
    * @method close
    */
    close(){
      this.visible = false;
    },
    /**
    * 获取部门数据
    * @method getData
    */
    getData(){
      this.loading = true;
      let params = {
        tenantId: this.tenantId
      };
      this.$axios.get('/api/storeTable/shwoDeptList',{params})
      .then(res=>{
        this.loading = false;
        if(res.data&&res.data.data){
          this.dept = res.data.data;
        }
      },()=>{this.loading=false;})
    },
    /**
    * 选择部门
    * @method checkDept
    */
    checkDept(data){
      this.selectData = data;
    },
    /**
    * 清空部门
    * @method clearDept
    */
    clearDept(){
      this.selectData = {deptName:'无部门',id:0};
    },
    /**
    * 返回部门
    * @method setDept
    */
    setDept(){
      let data = JSON.parse(JSON.stringify(this.selectData))
      this.$emit('cb',data);
      this.close();
    }
  }
};
</script>

<style lang="css" scoped>
.item{
  display: inline-block;
  padding: 5px 15px;
  margin-bottom: 10px;
  margin-right: 5px;
  border-radius: 5px;
  cursor:pointer;
}
.item:hover{
  background-color: #409EFF;
  color: #ffffff;
}
.item.active{
  background-color: #67C23A;
  color: #ffffff;
}
</style>
