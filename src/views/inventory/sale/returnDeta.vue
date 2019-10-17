<template>
	<div class="deta">
		<div class="deta_header">
			<ym-hbt :to='{name:backName}' title='退货单详情'></ym-hbt>
		</div>
		<div class="deta_mid">
			<div class="deta_mid_bar" :class="{short:short}">
				<div class="bar bar_left" @click="setVisible=true">
				  <i class="iconfont cebian-shezhi"></i>
				  <span v-show='!short'>设置</span>
				</div>
				<div class="bar bar_left">
				  <i class="iconfont daochu"></i>
				  <span v-show='!short'>导出</span>
				</div>
        <div class="bar bar_right" @click='short=!short'>
          <i v-if="!short" class="el-icon-arrow-right"></i>
          <i v-if="short" class="el-icon-arrow-left"></i>
        </div>
			</div>
			<div class="clearfix"></div>
			<div class="deta_mid_round">
				<div class="option round round1" v-if='infoData.openApproveStatet==1' @click="shenHe">审核</div>
				<div class="option round round2" v-if='infoData.openApproveStatet==2'>审核</div>
				<div class="option"><i class="iconfont zhankai"></i></div>
				<div class="option round">入库</div>
				<div class="option"><i class="iconfont zhankai"></i></div>
				<div class="option round">退款</div>
			</div>
			<div class="deta_mid_main">
				<div class="deta_mid_infos">
					<div class="deta_infos_row">
						<div class="deta_row_item">
							<span class="n">退货单号：</span>
							<span class="v">{{infoData.returnSellSn}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">退货车号：</span>
							<span class="v">{{infoData.carNo}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">销售单号：</span>
							<span class="v">{{infoData.orderNo}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">销售员：</span>
							<span class="v">{{infoData.displayName}}</span>
						</div>
					</div>
					<div class="deta_infos_row">
						<div class="deta_row_item">
							<span class="n">客户名称：</span>
							<span class="v">{{infoData.displayName}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">联系电话：</span>
							<span class="v">{{infoData.phone}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">退货金额：</span>
							<span class="v">{{infoData.returnPrice}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">已退金额：</span>
							<span class="v">{{infoData.refundPrice}}</span>
						</div>
					</div>
					<div class="deta_infos_row">
						<div class="deta_row_item">
							<span class="n">待退金额：</span>
							<span class="v">{{infoData.returnPrice - infoData.refundPrice}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">退货时间：</span>
							<span class="v">{{infoData.returnTime|time('y-m-d')}}</span>
						</div>
					</div>
				</div>
				<div class="deta_mid_table">
					<el-table :data='tableData' height='100%'>
						<el-table-column label='序号' type='index'></el-table-column>
						<el-table-column v-if="tableShow[val]" v-for='(val,key) in tabConfig' :key='key' :label='val' :prop='val' show-overflow-tooltip></el-table-column>
						<el-table-column label='退货价格' prop='returnPrice'></el-table-column>
					</el-table>
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
				short:false,
				id:this.$route.query.id,
				backName:this.$route.query.backName,
				infoData:{},
				tabConfig:[],
				tableData:[],
				userId:JSON.parse(this.$store.state.token).id,
				tenantId:JSON.parse(this.$store.state.token).tenantId,
        setVisible:false,
        activeName:'first',
        tableOptions:[]
			}
		},
	  computed:{
		  tableShow:function() {
			  let temp = {};
			  this.tableOptions.forEach((val)=>{
				  temp[val.key]=val.show
			  });
			  return temp;
		  }
	  },
		methods:{
			getData(){
				this.$axios({
					method:'get',
					url:'/api/productCategory/showReturnSellFormInfoDetail',
					params:{
						returnSellFormId:this.id,
					}
				}).then(res=>{
					if(res&&res.data.data){
						let data = res.data.data;
						for (let i in data){
							this.infoData = this.setInfoData(i);
							this.tableData = this.setTableData(data[i]);
							break;
						}
					}
				})
			},
			setInfoData(str){
				let s = str.indexOf('(');
				let e = str.lastIndexOf(')');
				str = str.substring(s+1,e);
				let obj = {};
				let arr = str.split(',')
				for(let i in arr){
					obj[arr[i].split('=')[0].replace(/\s/,'')] = arr[i].split('=')[1]
				}
				console.log(obj);
				return obj;
			},
			setTableData(arr){
				for(let i in arr){
					Object.assign(arr[i],this.proData(arr[i].attributeValue))
				}
				this.tabConfig = this.GLOBAL_.tableConfig[arr[0].品类];
				this.setTableOptions();
				return arr;
			},
			//审核
			shenHe(){
				this.$axios({
					method:'post',
					url:'/api/productCategory/auditorReturnSellFormo',
					data:{
						returnSellForm:{
							id:this.id,
							openApproveStatet:2,
							openApproveTime:new Date(),
							openApproverId:this.userId,
							tenantId:this.tenantId,
						},
						returnSellLog:{
							operatorId:this.userId,
							sellOrderId:this.id,
							tenantId:this.tenantId,
							opType:5,
						}
					}
				}).then(res=>{
					if(res&&res.data.data){
						this.getData();
					}
				})
			},
      // 设置数据
      setTableOptions(){
        let data = this.tabConfig;
        let tableOptions = [];
        data.forEach((val)=>{
        	tableOptions.push({key:val,name:val,show:true})
        });
        this.tableOptions = tableOptions;
      },
      // 更新数据
      updataTableOptions(data){
        this.tableOptions = JSON.parse(JSON.stringify(data));
      },

		},
		mounted(){
			this.getData();
		}
	}
</script>

<style lang="scss" scoped>
	.deta_mid_bar.short{
		width: 160px;
	}
	.deta_mid_main{
		height: calc(100% - 140px);
	}
	.deta_mid_table{
		height: calc(100% - 201px);
	}
</style>
