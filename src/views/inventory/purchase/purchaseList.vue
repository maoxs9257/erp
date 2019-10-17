<template lang="html">
  <div class="listModule">
    <div class="list_header">
      <ym-hbt :to='{name:"purchaseHome"}' title='合同单列表'></ym-hbt>
    </div>
    <div class="list_setbar">
      <div class="list_setbar_options">
        <div class="option" v-if='multipleSelection.length==0' @click='isTable = !isTable'>
          <div class="option_yuan"><i class="iconfont" :class="isTable?'jiugongge':'liebiao'"></i></div>
        </div>
        <div class="option" v-if='multipleSelection.length==0' @click='refresh'>
          <div class="option_yuan"><i class="iconfont shuaxin"></i></div>
          <span class="option_txt">刷新</span>
        </div>
        <div class="option" v-if='multipleSelection.length==0' @click='isSelect = !isSelect'>
          <div class="option_yuan"><i class="iconfont shaixuan"></i></div>
          <span class="option_txt">筛选</span>
        </div>
        <div class="option" v-if='multipleSelection.length==0' @click='setVisible=true'>
          <div class="option_yuan"><i class="iconfont cebian-shezhi"></i></div>
          <span class="option_txt">设置</span>
        </div>
        <div class="option" v-if='multipleSelection.length!==0' @click="exportExcel">
					<div class="option_yuan"><i class="iconfont daochu1"></i></div>
					<span class="option_txt">导出</span>
				</div>
				<div class="option" v-if='multipleSelection.length!==0&&removeShow' @click="removeList">
					<div class="option_yuan"><i class="iconfont shanchu"></i></div>
					<span class="option_txt">删除</span>
				</div>
        <div class="search_input">
          <i class="iconfont sousuo"></i>
          <input type="text" class="search_input_placeholder" v-model='option.contractSn' @change='screenBar' placeholder="合同号/供应商">
        </div>
      </div>
      <div class="list_setbar_selections">
        <div class="selection" :class="{now:option.dateState===0}" @click='option.dateState=0;screen()'>今天</div>
        <div class="selection" :class="{now:option.dateState===1}" @click='option.dateState=1;screen()'>7天</div>
        <div class="selection" :class="{now:option.dateState===2}" @click='option.dateState=2;screen()'>30天</div>
        <div class="selection" v-if='selections[0].show' :class="{now:option[selections[0].key]||option[selections[0].key]===0}">
					<el-select v-model="option[selections[0].key]" :placeholder="selections[0].name" @change='screen' clearable>
						<el-option v-if='v&&v!==""||v===0' v-for='(v,k) in options[selections[0].key]' :label="approveStateList[v]" :value="v" :key='k'></el-option>
					</el-select>
				</div>
        <div class="selection" v-if='selections[1].show' :class="{now:option[selections[1].key]}">
					<el-select v-model="option[selections[1].key]" :placeholder="selections[1].name" @change='screen' clearable>
						<el-option v-if='v&&v!==""' v-for='(v,k) in options[selections[1].key]' :label="stateList[v]" :value="v" :key='k'></el-option>
					</el-select>
				</div>
        <span class="clear" v-if='clearShow' @click='removeOption'>清除</span>
      </div>
    </div>
    <div class="list_main" :class="{se:isSelect}">
      <div class="list_main_table" v-if='isTable'>
        <div class="table">
          <el-table :data='dataList' height='100%' @selection-change="handleSelectionChange" v-loadMethod='load' modname='.el-table__body-wrapper' loadmore='loadmore'>
            <el-table-column type='selection'></el-table-column>
            <el-table-column label='合同号' show-overflow-tooltip>
              <template slot-scope='scope'>
                <a href="javascript:void(0)" @click="goTo({name:'purchaseDeta',query:{id:scope.row.contractSn,backUrl:'purchaseList'}},'erp_purchase_look')">{{scope.row.contractSn}}</a>
              </template>
            </el-table-column>
            <el-table-column v-if='tableShow.createTime' label='日期' show-overflow-tooltip>
              <template slot-scope='scope'>{{scope.row.createTime|time('y-m-d')}}</template>
            </el-table-column>
            <el-table-column v-if='tableShow.outterNo' label='外部单号' prop='outterNo' show-overflow-tooltip></el-table-column>
            <el-table-column v-if='tableShow.supportName' label='采购供应商' prop='supportName' show-overflow-tooltip></el-table-column>
            <el-table-column v-if='tableShow.amount' label='采购数量' prop='amount' show-overflow-tooltip></el-table-column>
            <el-table-column v-if='tableShow.totalPrice' label='采购金额' prop='totalPrice'></el-table-column>
            <el-table-column v-if='tableShow.prepayPrice' label='保证金' prop='prepayPrice'></el-table-column>
            <el-table-column v-if='tableShow.approveState' align="center" label='审核'>
              <template slot-scope='scope'>
                <i class="iconfont weijinhang icon_noFinish" v-if="scope.row.approveState!=2"></i>
                <i class="iconfont yiwancheng1 icon_finish" v-if="scope.row.approveState==2"></i>
              </template>
            </el-table-column>
            <el-table-column v-if='tableShow.state' align="center" label='付款'>
              <template slot-scope='scope'>
                <i class="iconfont weijinhang icon_noFinish" v-if="scope.row.state!=3"></i>
                <i class="iconfont yiwancheng1 icon_finish" v-if="scope.row.state==3"></i>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="table_fot">
          <span>总数：{{total}}</span>
        </div>
      </div>
      <div class="list_main_card" v-if='!isTable'>
        <div class="card" v-loadMethod='load' loadmore='loadmore'>
          <ul class="card_ul">
            <li class="card_li" v-for='(val,key) in dataList'>
              <div class="card_li_con">
                <div class="content" @click="goTo({name:'purchaseDeta',query:{id:val.contractSn,backUrl:'purchaseList'}},'erp_purchase_look')">
                  <div class="content_top">
                    <span class="content_top_round" :class="{ac:val.approveState==2}"></span>
                    <span class="content_top_title">{{val.contractSn}}</span>
                  </div>
                  <div class="content_fot">
                    <div class="content_fot_item">
                      <span class="n">数量</span>
                      <span class="v">{{val.amount}}</span>
                    </div>
                    <div class="content_fot_item">
                      <span class="n">金额</span>
                      <span class='v' style="color:#E77762">{{val.totalPrice}}</span>
                    </div>
                    <div class="content_fot_item">
                      <span class="n">保证金</span>
                      <span class="v" style="color:#E77762">{{val.prepayPrice}}</span>
                    </div>
                    <div class="content_fot_item">
                      <span class="n">付款状态</span>
                      <span class="v">{{val.state==5?'已确认':'未确认'}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="card_fot">
          <span>总数：{{total}}</span>
        </div>
      </div>
    </div>
    <!-- 设置 -->
		<el-dialog title='设置' center :visible.sync='setVisible' width='800px' v-dialogDrag>
			<div>
				<el-tabs v-model="activeName">
			    <el-tab-pane label="表格字段" name="first">
			    	<options :data='tableOptions' @cb='updataTableOptions' @close='setVisible=false'></options>
			    </el-tab-pane>
			    <el-tab-pane label="筛选字段" name="second">
						<options :data='selections' @cb='updataSelections' @close='setVisible=false'></options>
			    </el-tab-pane>
			  </el-tabs>
			</div>
		</el-dialog>
  </div>
</template>

<script>
import headBackTitle from '@/components/headBackTitle.vue'
import options from '@/components/options.vue'
export default {
  components:{
    "ym-hbt":headBackTitle,
    "options":options
  },
  data(){
    return{
      isTable:true,
      isSelect:true,
      date:null,
      select:null,
      tenantId:JSON.parse(this.$store.state.token).tenantId,
      dataList:[],
			role:JSON.parse(this.$store.state.role),
      total:0,
      pageNum:1,
      loadmore:false,
      options:{},
      option:{dateState:null},
      supportList:{},
      stateList:{1:'未付款',3:'已付款'},
      approveStateList:{0:'无需审核',1:'待审核',2:'通过',3:'拒绝'},
      setVisible:false,
      activeName:'first',
      multipleSelection:[]
    }
  },
  computed:{
    clearShow:function(){
      for(let k in this.option){
        if(this.option[k]||this.option[k]===0){
          return true;
        }
      }
      return false;
    },
    tableShow:function() {
      let temp = {};
      this.tableOptions.forEach((val)=>{
        temp[val.key]=val.show
      })
      return temp;
    },
		selections: function() {
			return JSON.parse(this.$store.state.setJson).selection.PL;
		},
		tableOptions:function(){
			return JSON.parse(this.$store.state.setJson).tableOptions.PL;
		},
		removeShow:function(){
			let data = this.multipleSelection;
			for(let i in data){
				if(data[i].approveState==2){
					return false;
				}
			}
			return true;
		}
  },
  methods:{
    /**
    * 获取供应商数据
    * @method getData
    * @param pageNum 页码
    * @param pageSize 页面大小
    * @param options 筛选项
    */
    getData(pageNum,pageSize,options,callback){
      let params = {
        tenantId: this.tenantId,
        status:1,
        pageNum:pageNum,
        pageSize:pageSize,
      }
      params = Object.assign(params,options);
      this.$axios.get('/apt/purposeForm/showPurposeFormPage',{params})
      .then(res=>{
        if(res.data&&res.data.data){
          this.dataList = this.dataList.concat(res.data.data.dataList)
          this.total = res.data.data.total;
        }
        callback?callback(res.data.data):null
      },()=>{
        callback?callback(false):null
      })
    },
    /**
    * 获取筛选项
    * @method getOptions
    */
    getOptions(options){
      let params = {
        tenantId: this.tenantId,
        status:1
      }
      params = Object.assign(params,options);
      this.$axios.get('/apt/purposeForm/showPurposeFormCondition',{params})
      .then(res=>{
        if(res.data&&res.data.data){
          let data = res.data.data;
          let temp = {
            approveState:[],
            state:[],
          };
          data.forEach((val)=>{
            temp.approveState.push(val.approveState);
            temp.state.push(val.state)
          });
          temp.approveState = this.uniq(temp.approveState);
          temp.state = this.uniq(temp.state);
          this.options = temp;
        }
      })
    },
    /**
    * 无限加载
    * @method load
    */
    load(callback){
      this.getData(this.pageNum++,30,this.option,(data)=>{
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
      this.getData(this.pageNum++,30,this.option,(data)=>{
        loading.close();
        this.loadmore = data.pages>data.pageNo;
        if(data){
          this.getOptions(this.option);
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
      this.getData(this.pageNum++,30,this.option,()=>{
        loading.close();
        this.getOptions(this.option);
      })
    },
    /**
    * 搜索框
    * @method screenBar
    */
    screenBar(){
      window.clearTimeout(this.timer)
      this.timer = setTimeout(()=>{
        this.screen();
      },500)
    },
    /**
    * 清楚选项
    * @method removeOption
    */
    removeOption(){
      this.option={dateState:''};
      this.refresh();
    },
    /**
    * 更新筛选项字段
    * @method updataSelections
    */
    updataSelections(data){
      let setJson = JSON.parse(this.$store.state.setJson);
      setJson.selection.PL = data;
      this.$store.commit('setSetJson', setJson);
      this.refresh();
			this.upSetJson(setJson);
    },
    /**
    * 表格字段更新
    * @method updataTableOptions
    */
    updataTableOptions(data){
      let setJson = JSON.parse(this.$store.state.setJson);
      setJson.tableOptions.PL = data;
      this.$store.commit('setSetJson', setJson);
			this.upSetJson(setJson);
    },
		// 上传设置数据
		upSetJson(val) {
			let data = {
				settingText: JSON.stringify(val),
				tenantId: this.tenantId,
				userId: this.userId
			}
			this.$axios.post('/api/userSettingTable/modifyUserSettingTable', data)
		},
    /**
     * 表格选中
     * @method handleSelectionChange
     * */
    handleSelectionChange(data){
      this.multipleSelection = data;
    },
    /**
    * 导出供应商
    * @method exportExcel
    **/
    exportExcel(){
      if(this.multipleSelection.length===0) return this.$message.error('请选择导出的供应商');
      let { export_json_to_excel }=require('../../../assets/excel/Export2Excel');
      require.ensure([],()=>{
          var tHeader=['合同号','日期','采购供应商','采购数量','采购金额','保证金'];
          var filterVal=['contractSn','createTime','supportName','amount','totalPrice','prepayPrice'];
          var list=this.multipleSelection;
          var data=list.map(v=>filterVal.map(j=>v[j]));
          export_json_to_excel(tHeader,data,'合同单列表');
  　　})
    },
		// 删除
		removeList(){
			const loading = this.$loading({lock: true, text: '删除合同单', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
			let data = [];
			this.multipleSelection.forEach((val)=>{
				data.push(val.id)
			})
			this.$axios.post('/apt/purposeForm/deletePurposeContract',data)
			.then(res=>{
				loading.close();
				if(res.data&&res.data.data){
					this.refresh();
				}else{
					this.$message.error('删除失败')
				}
			},()=>{loading.close();})
		},
		goTo(name,code){
			if(!this.role[code]){
				this.$message.error('没有权限');
			}else{
				this.$router.push(name);
			}
		},
  },
  mounted(){
    setTimeout(()=>{
      this.isSelect = false;
    },1500);
    this.getOptions({})
  },
}
</script>

<style lang="scss" scoped>
  @import "@/assets/css/jxc/card.scss";
.listModule .card_li .card_li_con{
  padding-bottom: 75%;
}
  .content_fot .content_fot_item{
    height: 25%;
  }
</style>
