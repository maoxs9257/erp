<template lang="html">
  <div class="listModule">
    <div class="list_header">
      <ym-hbt :to='{name:"saleHome"}' title='退货列表'></ym-hbt>
    </div>
    <div class="list_setbar">
      <div class="list_setbar_options">
        <div class="option" @click='isTable = !isTable'>
          <div class="option_yuan"><i class="iconfont" :class="isTable?'jiugongge':'liebiao'"></i></div>
        </div>
        <div class="option" @click="getReturnList">
          <div class="option_yuan"><i class="iconfont shuaxin"></i></div>
          <span class="option_txt">刷新</span>
        </div>
        <div class="option" @click='isSelect = !isSelect'>
          <div class="option_yuan"><i class="iconfont shaixuan"></i></div>
          <span class="option_txt">筛选</span>
        </div>
				<div class="option">
				  <div class="option_yuan"><i class="iconfont cebian-shezhi"></i></div>
				  <span class="option_txt">设置</span>
				</div>
        <div class="search_input">
          <i class="iconfont sousuo"></i>
          <input type="text" name="" value="">
        </div>
      </div>
      <div class="list_setbar_selections">
        <div class="selection now">今天</div>
        <div class="selection">今天</div>
        <div class="selection" :class="{now:date,now1:date}">
          <el-date-picker v-model="date" type="daterange" start-placeholder="选择时间"></el-date-picker>
        </div>
        <div class="selection">
          <el-select v-model="select" placeholder="请选择">
            <el-option label="item.labessssl" value="item.value"></el-option>
          </el-select>
        </div>
        <span class="clear">清除</span>
      </div>
    </div>
    <div class="list_main" :class="{se:isSelect}">
      <div class="list_main_table" v-show='isTable'>
        <div class="table">
					<el-table :data='returnList' height='100%'>
						<el-table-column type='selection'></el-table-column>
						<el-table-column show-overflow-tooltip label='退货单号' prop='returnSellSn'>
							<template slot-scope='scope'>
								<router-link :to="{name:'returnDeta',query:{id:scope.row.id,backName:'returnGoods'}}">{{scope.row.returnSellSn}}</router-link>
							</template>
						</el-table-column>
						<el-table-column show-overflow-tooltip label='退货时间' prop='createTime'></el-table-column>
						<el-table-column show-overflow-tooltip label='退货车号' prop='carNo'></el-table-column>
						<el-table-column show-overflow-tooltip label='销售员' prop=''></el-table-column>
						<el-table-column show-overflow-tooltip label='客户' prop=''></el-table-column>
						<el-table-column show-overflow-tooltip label='数量' prop='orderNum'></el-table-column>
						<el-table-column show-overflow-tooltip label='金额' prop='returnPrice'></el-table-column>
						<el-table-column show-overflow-tooltip label='是否含税' prop=''></el-table-column>
						<el-table-column label='备注' align="center">
							<template slot-scope='scope'>
								<el-tooltip :content="scope.row.memo" placement="top">
									<i v-if="scope.row.memo" class="iconfont beizhu"></i>
								</el-tooltip>
							</template>
						</el-table-column>
					</el-table>
        </div>
        <div class="table_fot">
          <span>总数：{{returnList.length}}</span>
        </div>
      </div>
      <div class="list_main_card" v-show='!isTable'>
        <div class="card">
					<ul class="card_ul">
						<li class="card_li" v-for='(val,key) in returnList' :key='key'>
							<div class="card_li_con">
								<div class="content" @click="$router.push({name:'returnDeta',query:{id:val.id,backName:'returnGoods'}})">
									<div class="content_top">
										<span class="content_top_round" :class="{ss:val.审核==2}"></span>
										<span class="content_top_title">{{val.returnSellSn}}</span>
									</div>
									<div class="content_fot">
										<div class="content_fot_item">
											<span class="n">退货车号:</span>
											<span>{{val.carNo}}</span>
										</div>
										<div class="content_fot_item">
											<span class="n">销售员:</span>
											<span class='s'>{{val.orderAmount}}</span>
										</div>
										<div class="content_fot_item">
											<span class="n">数量:</span>
											<span>{{val.orderNum}}</span>
										</div>
									</div>
								</div>
							</div>
						</li>
					</ul>
        </div>
        <div class="card_fot">
          <span>总数：</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import headBackTitle from '@/components/headBackTitle.vue'
export default {
  components:{
    "ym-hbt":headBackTitle,
  },
  data(){
    return{
      isTable:true,
      isSelect:true,
      date:null,
      select:null,
			tenantId:JSON.parse(this.$store.state.token).tenantId,
			returnList:[],
    }
  },
	methods:{
		seeNewReturn(){

		},
		//获取退货开单列表
		getReturnList(){
			this.$axios({
				method:'get',
				url:'/api/productCategory/showReturnSellFormInfo',
				tenantId:this.tenantId,
			}).then(res=>{
				if(res&&res.data.data){
					this.returnList = res.data.data;
				}else{
					this.returnList = [];
				}
			})
		},
		//
	},
  mounted(){
    setTimeout(()=>{
      this.isSelect = false;
    },1500);
		this.getReturnList();
  }
}
</script>

<style lang="scss" scoped>
  @import "@/assets/css/jxc/card.scss";
	.listModule .card .card_li .card_li_con{
		padding-bottom: 75%;
	}
  .content_fot .content_fot_item{
    height: 33.333%;
  }
</style>
