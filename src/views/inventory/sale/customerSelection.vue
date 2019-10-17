<template>
  <el-dialog width='760px' title='选择客户' center :visible.sync='customerVisible' v-dialogDrag>
    <div class="customer_top">
      <div class="dialog_tool">
        <div class="dialog_search_copy">
          <i class="iconfont sousuo"></i>
          <input type="text" class="search_input_placeholder" v-model='option.phone' @change="screen" placeholder="客户名称/联系人/手机号">
        </div>
        <button class="dialog_tool_btn" @click='creataCompany' type="button">新建客户</button>
      </div>
    </div>
    <div class="customer_main table_style">
      <el-table :data='dataList' border height="400px" v-loadMethod='load' modname='.el-table__body-wrapper' loadmore='loadmore' highlight-current-row @current-change="currentChange">
        <el-table-column label='客户名称' prop='fullName' align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label='联系人员' prop='displayName' align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label='手机号' prop="phone" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label='应收账款' prop="orderReceivable" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label='备注' align="center">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.memo" placement="top-start">
              <i class="iconfont icon-weiwancheng"></i>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="text-align:center;margin-top:30px;">
      <el-button type='primary' plain @click='close'>取消</el-button>
      <el-button type='primary' @click='fin'>确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data(){
    return {
      customerVisible:false,
      dataList:[],
      pageNum:1,
      tenantId: JSON.parse(this.$store.state.token).tenantId,
      selectData:null,
      option:{},
		  role:JSON.parse(this.$store.state.role),
    }
  },
  methods:{
    /**
    * 打开客户弹窗
    * @method open
    */
    open(){
      this.customerList = [];
      this.customerVisible = true;
    },
    /**
    * 关闭客户窗口
    * @method close
    */
    close(){
      this.customerVisible = false;
    },
    /**
    * 获取数据
    * @method getData
    */
    getData(pageNum,pageSize,options,callback){
      let params = {
        tenantId:this.tenantId,
        pageNum:pageNum,
        pageSize:pageSize
      };
      params = Object.assign(params,options);
      this.$axios.get('/aps/customerCompany/showCustomerCompanyPage',{params})
        .then(res=>{
          if(res.data&&res.data.data){
            this.dataList = this.dataList.concat(res.data.data.dataList);
          }
          callback?callback(res.data.data):null
        },()=>{
          callback?callback(false):null
        })
    },
    /**
    * 无限加载
    * @method load
    **/
    load(callback){
      this.getData(this.pageNum++,20,this.option,(data)=>{
        callback();
        this.loadmore = data.pages>data.pageNo
      })
    },
    /**
    * 筛选数据
    * @method screen
    */
    screen(){
      this.dataList = [];
      this.pageNum = 1;
      for(let k in this.option){if(!this.option[k]&&this.option[k]!==0)delete this.option[k]};
      const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
      this.getData(this.pageNum++,20,this.option,(data)=>{
        loading.close();
        this.loadmore = data.pages>data.pageNo
      })
    },
    /**
     * 刷新客户列表数据
     * @method refresh
     * */
    refresh(){
      const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
      //重新请求数据
      this.dataList = [];
      this.pageNum = 1;
      this.option = {};
      this.getData(this.pageNum++,20,{},(data)=>{
        loading.close();
        this.loadmore = data.pages>data.pageNo;
        if(data){
          this.$message.success('刷新完成')
        }else{
          this.$message.error('刷新失败')
        }
      })
    },
    /**
    * 选择客户
    * @method currentChange
    */
    currentChange(data){
      this.selectData = data;
    },
    /**
    * 输出选择
    * @method fin
    */
    fin(){
      if(this.selectData){
        this.$emit('cb',this.selectData);
        this.close();
      }else{
        this.$message.error('请选择公司')
      }
    },
    /**
    * 新建
    * @method creataCompany
    */
    creataCompany(){
      if(this.role.erp_customer_new){
		    this.$emit('create')
      }else{
      	this.$message.error('没有权限')
      }
    }
  }
}
</script>

<style lang="css" scoped>
.customer_top{
  height: 50px;
}
.customer_main{
  height: 400px;
}
</style>
