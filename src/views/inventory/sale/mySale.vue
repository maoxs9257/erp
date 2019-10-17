<template lang="html">
  <div class="listModule">
    <div class="list_header">
      <ym-hbt :to='{name:"saleHome"}' title='我的销售'></ym-hbt>
    </div>
    <div class="list_setbar">
      <div class="list_setbar_options">
        <div class="option" v-if='multipleSelection.length===0' @click='isTable = !isTable'>
          <div class="option_yuan"><i class="iconfont" :class="isTable?'jiugongge':'liebiao'"></i></div>
        </div>
        <div class="option" v-if='multipleSelection.length===0' @click='refresh'>
          <div class="option_yuan"><i class="iconfont shuaxin"></i></div>
          <span class="option_txt">刷新</span>
        </div>
        <div class="option" v-if='multipleSelection.length===0' @click='isSelect = !isSelect'>
          <div class="option_yuan"><i class="iconfont shaixuan"></i></div>
          <span class="option_txt">筛选</span>
        </div>
        <div class="option" v-if='multipleSelection.length!==0' @click='exportExcel'>
          <div class="option_yuan"><i class="iconfont daochu"></i></div>
          <span class="option_txt">导出</span>
        </div>
        <div class="option" v-if='multipleSelection.length===0' @click='setVisible=true'>
          <div class="option_yuan"><i class="iconfont cebian-shezhi"></i></div>
          <span class="option_txt">设置</span>
        </div>
        <div class="search_input">
          <i class="iconfont sousuo"></i>
          <input type="text" class="search_input_placeholder" v-model='option.orderNo' @change='screenBar' placeholder="销售单号">
        </div>
      </div>
      <div class="list_setbar_selections">
        <div class="selection" :class="{now:option.stat===0}" @click='option.stat=0;screen()'>今天</div>
        <div class="selection" :class="{now:option.stat===1}" @click='option.stat=1;screen()'>7天</div>
        <div class="selection" :class="{now:option.stat===2}" @click='option.stat=2;screen()'>30天</div>
        <div class="selection" v-if='selections[0].show' :class="{now:option[selections[0].key]}">
          <el-select v-model="option[selections[0].key]" :placeholder="selections[0].name" @change='screen' clearable>
            <el-option v-if='v&&v!==""' v-for='(v,k) in options[selections[0].key]' :label="contactIdList[v]" :value="v" :key='k'></el-option>
          </el-select>
        </div>
        <div class="selection" v-if='selections[1].show' :class="{now:option[selections[1].key]||option[selections[1].key]===0}">
          <el-select v-model="option[selections[1].key]" :placeholder="selections[1].name" @change='screen' clearable>
            <el-option v-if='v&&v!==""||v===0' v-for='(v,k) in options[selections[1].key]' :label="isTaxList[v]" :value="v" :key='k'></el-option>
          </el-select>
        </div>
        <div class="selection" v-if='selections[2].show' :class="{now:option[selections[2].key]||option[selections[2].key]===0}">
          <el-select v-model="option[selections[2].key]" :placeholder="selections[2].name" @change='screen' clearable>
            <el-option v-if='v&&v!==""||v===0' v-for='(v,k) in options[selections[2].key]' :label="openApproveStateList[v]" :value="v" :key='k'></el-option>
          </el-select>
        </div>
        <div class="selection" v-if='selections[3].show' :class="{now:option[selections[3].key]||option[selections[3].key]===0}">
          <el-select v-model="option[selections[3].key]" :placeholder="selections[3].name" @change='screen' clearable>
            <el-option v-if='v&&v!==""||v===0' v-for='(v,k) in options[selections[3].key]' :label="v" :value="v" :key='k'></el-option>
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
            <el-table-column label='销售单号' show-overflow-tooltip>
              <template slot-scope='scope'>
                <router-link :to="{name:'saleDeta',query:{id:scope.row.id,backName:'mySale'}}">{{scope.row.orderNo}}</router-link>
              </template>
            </el-table-column>
            <el-table-column v-if='tableShow.createTime' label='销售时间' show-overflow-tooltip>
              <template slot-scope='scope'>{{scope.row.createTime|time('y-m-d')}}</template>
            </el-table-column>
            <el-table-column v-if='tableShow.deptName' label='销售部门' prop='deptName' show-overflow-tooltip></el-table-column>
            <el-table-column v-if='tableShow.creatorName' label='销售员' prop='creatorName' show-overflow-tooltip></el-table-column>
            <el-table-column v-if='tableShow.contactName' label='客户名称' prop='contactName' show-overflow-tooltip></el-table-column>
            <el-table-column v-if='tableShow.orderPackages' label='数量' width='50' prop='orderPackages' show-overflow-tooltip></el-table-column>
            <el-table-column v-if='tableShow.orderAmount' label='金额' width='90' prop='orderAmount' show-overflow-tooltip></el-table-column>
            <el-table-column v-if='tableShow.isTax' label='是否含税'>
              <template slot-scope='scope'>{{scope.row.isTax?scope.row.isTax==1?"含税":"不含税":"null"}}</template>
            </el-table-column>
            <el-table-column v-if='tableShow.openApproveStatet' align="center" label='审核' width='50'>
              <template slot-scope='scope'>
                <i class="iconfont weijinhang icon_noFinish" v-if="scope.row.openApproveStatet!=2"></i>
                <i class="iconfont yiwancheng1 icon_finish" v-if="scope.row.openApproveStatet==2"></i>
              </template>
            </el-table-column>
            <el-table-column v-if='tableShow.checkApproveState' align="center" label='理货' width='50'>
              <template slot-scope='scope'>
                <i class="iconfont weijinhang icon_noFinish" v-if="scope.row.checkApproveState!=2"></i>
                <i class="iconfont yiwancheng1 icon_finish" v-if="scope.row.checkApproveState==2"></i>
              </template>
            </el-table-column>
            <el-table-column v-if='tableShow.checkApproveState' align="center" label='确认' width='50'>
              <template slot-scope='scope'>
                <i class="iconfont weijinhang icon_noFinish" v-if="scope.row.state!=3&&scope.row.state!=7"></i>
                <i class="iconfont yiwancheng1 icon_finish" v-if="scope.row.state==3||scope.row.state==7"></i>
              </template>
            </el-table-column>
            <el-table-column v-if='tableShow.checkApproveState' align="center" label='收款' width='50'>
              <template slot-scope='scope'>
                <i class="iconfont weijinhang icon_noFinish" v-if="scope.row.receivableAmount!=9"></i>
                <i class="iconfont yiwancheng1 icon_finish" v-if="scope.row.receivableAmount==9"></i>
              </template>
            </el-table-column>
            <el-table-column v-if='tableShow.checkApproveState' align="center" label='出库' width='50'>
              <template slot-scope='scope'>
                <i class="iconfont weijinhang icon_noFinish" v-if="scope.row.state!=7"></i>
                <i class="iconfont yiwancheng1 icon_finish" v-if="scope.row.state==7"></i>
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
            <li class="card_li" v-for='(val,key) in dataList' :key="key">
              <div class="card_li_con">
                <div class="content" @click="$router.push({name:'saleDeta',params:{id:val.id,backName:'mySale'}})">
                  <div class="content_top">
                    <span class="content_top_round"></span>
                    <span class="content_top_title">{{val.contactName}}</span>
                  </div>
                  <div class="content_fot">
                    <div class="content_fot_item">
                      <span>{{val.creatorName}}</span>
                    </div>
                    <div class="content_fot_item">
                      <span class="n">销售单号:</span>
                      <span class="v">{{val.orderNo}}</span>
                    </div>
                    <div class="content_fot_item">
                      <span class="n">预售金额:</span>
                      <span class='s v'>{{val.orderAmount}}</span>
                    </div>
                    <div class="content_fot_item">
                      <span class="n">理货状态:</span>
                      <span class="v">{{val.openApproveStatet==2?'已审核':'未审核'}}</span>
                    </div>
                    <div class="content_fot_item">
                      <span class="n">确认状态:</span>
                      <span class="v">{{val.checkApproveState==2?'已理货':'未理货'}}</span>
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
    <el-dialog width="800px" title="设置" center :visible.sync="setVisible" v-dialogDrag>
      <el-tabs v-model="activeName">
        <el-tab-pane label="表格字段" name="first">
          <options :data='tableOptions' @cb='updataTableOptions' @close='setVisible=false'></options>
        </el-tab-pane>
        <el-tab-pane label="筛选字段" name="second">
          <options :data='selections' @cb='updataSelections' @close='setVisible=false'></options>
        </el-tab-pane>
      </el-tabs>
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
      tenantId:JSON.parse(this.$store.state.token).tenantId,
		  userId: JSON.parse(this.$store.state.token).id,
		  dataList:[],
		  total:0,
		  loadmore:false,
		  pageNum:1,
		  option:{},
		  options:{},
		  contactIdList:{},
		  isTaxList:{1:'含税',2:'不含税'},
		  openApproveStateList:{0:'无需审核',1:'待审核',2:'审核通过',3:'审核拒绝'},
		  activeName:'first',
		  setVisible:false,
		  multipleSelection:[],
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
			});
			return temp;
		},
		selections:function(){
			return JSON.parse(this.$store.state.setJson).selection.MS;
		},
		tableOptions:function(){
			return JSON.parse(this.$store.state.setJson).tableOptions.MS;
		},
	},
  methods:{
    // 获取数据
    getData(pageNum,pageSize,options,callback){
    	let params = {
    		tenantId: this.tenantId,
        pageNum:pageNum,
        pageSize:pageSize,
		    creatorId:this.userId
      };
    	params = Object.assign(params,options);
    	this.$axios.get('/aps/sell/showSellsListPage',{params})
      .then(res=>{
      	if(res.data&&res.data.data){
      		this.dataList = this.dataList.concat(res.data.data.dataList);
      		this.total = res.data.data.total;
        }
      	callback?callback(res.data.data):null;
      },()=>{callback?callback(false):null})
    },
    // 获取筛选数据
    getOptions(options){
    	let params = {
    		tenantId:this.tenantId,
        creatorId: this.userId
      };
    	params = Object.assign(params,options);
      this.$axios.get('/aps/sell/showSellsList',{params})
      .then(res=>{
      	if(res.data&&res.data.data){
      		let data = res.data.data;
      		let temp = {
            contactId:[],
            isTax:[],
            openApproveState:[],
            checkApproveState:[]
          };
      		let contactIdList = {};
					console.log(data);
      		data.forEach((val)=>{
      			temp.contactId.push(val.contactId);
      			temp.isTax.push(val.isTax);
      			temp.openApproveState.push(val.openApproveStatet);
      			temp.checkApproveState.push(val.checkApproveState);
      			contactIdList[val.contactId] = val.contactName;
          });
      		temp.contactId = this.uniq(temp.contactId);
      		temp.isTax = this.uniq(temp.isTax);
      		temp.openApproveState = this.uniq(temp.openApproveState);
      		temp.checkApproveState = this.uniq(temp.checkApproveState);
      		this.options = temp;
      		this.contactIdList = contactIdList;
        }
      })
    },
    // 无限加载
    load(callback){
    	this.getData(this.pageNum++,30,this.option,(data)=>{
    		callback();
    		this.loadmore = data.pages>data.pageNo;
      })
    },
    // 刷新
    refresh(){
		  const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
      this.option = {stat:null};
      this.dataList = [];
      this.pageNum = 1;
      this.getData(this.pageNum++,30,this.option,(data)=>{
      	loading.close();
      	if(data){
      		this.$message.success('刷新完成');
        }else{
      		this.$message.error('刷新失败');
        }
      })
	  },
    // 筛选数据
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
    // 搜素框
    screenBar(){
    	window.clearTimeout(this.timer);
    	this.timer = setTimeout(()=>{
    		this.screen();
      },500)
    },
    // 清楚选项
    removeOption(){
    	this.option = {stat:''};
    	this.refresh();
    },
    // 更新筛选字段
	  updataSelections(data){
		  let setJson = JSON.parse(this.$store.state.setJson);
		  setJson.selection.MS = data;
		  this.$store.commit('setSetJson', setJson);
		  this.refresh();
		  this.upSetJson(setJson);
	  },
    // 表格字段更新
	  updataTableOptions(data){
		  let setJson = JSON.parse(this.$store.state.setJson);
		  setJson.tableOptions.MS = data;
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
    // 表格选中
	  handleSelectionChange(data){
		  this.multipleSelection = data;
	  },
    // 导出个人销售单
	  exportExcel(){
		  if(this.multipleSelection.length===0) return this.$message.error('请选择导出的销售单');
		  let { export_json_to_excel }=require('../../../assets/excel/Export2Excel');
		  require.ensure([],()=>{
			  var tHeader=['销售单号','销售时间','销售部门','销售员','客户名称','数量','金额','是否含税','审核','理货'];
			  var filterVal=['orderNo','createTime','deptName','creatorName','contactName','orderPackages','orderAmount','isTax','openApproveStatet','checkApproveState'];
			  var list=this.multipleSelection;
			  var data=list.map(v=>filterVal.map(
				  j=>{
					  if(j==='isTax'){
						  return v[j]===1?'含税':'不含税'
					  }else if(j==='openApproveStatet'){
						  return v[j]===0?'无需审核':v[j]===1?'待审核':v[j]===2?'审核通过':'审核拒绝'
					  }else if(j==='checkApproveState'){
						  return v[j]===0?'无需审核':v[j]===1?'待审核':v[j]===2?'审核通过':'审核拒绝'
					  }else{
						  return v[j]
					  }
				  }
			  ));
			  export_json_to_excel(tHeader,data,'个人销售单列表');
		  })
	  },
  },
  mounted(){
  	this.getOptions({});
    setTimeout(()=>{
      this.isSelect = false;
    },1500)
  }
}
</script>
<style lang="scss" scoped>
  @import "@/assets/css/jxc/card.scss";
  .list_main_card .card_li_con{
    padding-bottom: 87%;
  }
  .content_fot .content_fot_item{
    height: 20%;
  }
</style>
