<template>
  <el-dialog v-if='visible' width="760px" :title='title' center :visible.sync='visible' v-dialogDrag>
    <div class="customer_top">
      <div class="dialog_tool">
        <div class="dialog_search_copy">
          <i class="iconfont sousuo"></i>
          <input type="text" v-model="option.companyName" @change="screen" :placeholder="(type===1?'供应商':type===3?'开证公司':'清关公司')+'/联系人/手机号'">
        </div>
        <button class="dialog_tool_btn" type="button" @click="creataCompany">{{btnName}}</button>
      </div>
    </div>
    <div class="customer_main table_style">
      <el-table v-if="dataV" :data='dataList' border height="100%" width="100%" highlight-current-row @current-change='currentChange' v-loadMethod='load' modname='.el-table__body-wrapper' loadmore='loadmore'>
        <el-table-column :label='type===1?"供应商":type===3?"开证公司":"清关公司"' prop='companyName' show-overflow-tooltip></el-table-column>
        <el-table-column label='联系人员' prop='displayName' show-overflow-tooltip></el-table-column>
        <el-table-column label='手机号' prop="phone" show-overflow-tooltip></el-table-column>
        <el-table-column label='备注' width='80' align="center">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.memo" placement="top-start">
              <i class="iconfont icon-zhuyi"></i>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style='margin-top:30px;text-align:center'>
      <el-button type='primary' plain @click='close'>取消</el-button>
      <el-button type='primary'  @click='fin'>确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props:['type'],
  data(){
    return {
      visible:false,
      dataList:[],
      tenantId:JSON.parse(this.$store.state.token).tenantId,
      loadmore:false,
      pageNum:1,
      option:{},
      selectData:null,
		  dataV:false,
    }
  },
  computed:{
    title:function(){
      return this.type===1?'选择供应商':this.type===2?'选择清关公司':'选择开证公司'
    },
    btnName:function(){
      return this.type===1?'新建供应商':this.type===2?'新建清关公司':'新建开证公司'
    }
  },
  methods:{
    /**
    * 打开供应商窗口
    * @method open
    */
    open(){
      this.pageNum = 1;
      this.visible = true;
      this.dataList= [];
      this.dataV = false;
      this.refresh();
    },
    /**
    * 关闭供应商窗口
    * @method close
    */
    close(){
      this.visible = false;
    },
    /**
    * 获取数据
    * @method getData
    */
    getData(pageNum,pageSize,options,callback){
      let params = {
        tenantId: this.tenantId,
        contactType: this.type,
        pageNum:pageNum,
        pageSize:pageSize
      };
      params = Object.assign(params,options);
      this.$axios.get('/aps/customerCompany/showOpenEvidencePage',{params})
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
    * 无线加载
    * @method load
    */
    load(callback){
      this.getData(this.pageNum++,20,this.option,(data)=>{
        callback();
        this.loadmore = data.pages>data.pageNo
      })
    },
    /**
    * 刷新
    * @method refresh
    */
    refresh(){
      const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
      this.option = {dateState:''};
      this.dataList = [];
      this.pageNum = 1;
      this.getData(this.pageNum++,20,this.option,(data)=>{
        loading.close();
        this.loadmore = data.pages>data.pageNo;
        this.dataV = true;
        if(data){
          this.$message.success('刷新完成')
        }else{
          this.$message.error('刷新失败')
        }
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
    * 选择公司
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
      this.$emit('create')
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
