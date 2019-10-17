<template lang="html">
  <div class="bill">
    <div class="bill_header">
      <ym-hbt :to='{name:"saleHome"}' :title='radio=="1"?"销售开单":"退货开单"'></ym-hbt>
    </div>
    <div class="bill_mi">
      <span class='bill_set' v-if="radio==1" @click="setVisible=true">设置</span>
      <div class="bill_mi_item">
        <el-radio v-model="radio" label="1">销售单</el-radio>
      </div>
      <div class="bill_mi_item">
        <el-radio v-model="radio" label="2">退货单</el-radio>
      </div>
      <div class="bill_mi_item" v-if='radio==1'>
        <el-checkbox v-model="checks.dan">外部单号</el-checkbox>
      </div>
      <div class="bill_mi_item" v-if='radio==1'>
        <el-checkbox v-model="checks.zhu">备注</el-checkbox>
      </div>
    </div>
    <!-- 销售单 -->
    <div class="bill_main" v-if='radio==1'>
      <div class="bill_main_top">
        <div class="bill_infos clearfix">
          <div class="bill_info" @click='openCustomer'>
            <i class="ic iconfont kehu"></i>
            <div class="bill_info_div">{{customer.fullName?customer.fullName:'选择客户'}}</div>
          </div>
          <div class="bill_info">
            <i class="ic iconfont chepai1"></i>
            <input class="bill_info_input" type="text" v-model='carNo' placeholder="车牌">
          </div>
          <div class="bill_info" v-if='checks.dan'>
            <i class="ic iconfont cebain-xiaoshouguanli"></i>
            <input class="bill_info_input" type="text" v-model='orderNo' placeholder="外部单号">
          </div>
          <div class="bill_info" v-if='checks.zhu'>
            <input class="bill_info_input" type="text" v-model='memo' placeholder="备注">
          </div>
        </div>
        <div class="bill_infos clearfix">
          <div class="bill_info" @click='openGoods'>
            <i class="ic iconfont chanpin"></i>
            <div class="bill_info_div">{{tableList|packageNum}}</div>
          </div>
          <div class="bill_info">
            <i class="ic iconfont shui"></i>
            <el-select v-model="isTax" placeholder="是否含税">
              <el-option label="含税" value="1"></el-option>
              <el-option label="不含税" value="2"></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div :style="{height:'calc(100% - '+h+'px)'}" class="bill_main_fot">
        <div class="bill_table table_fixed">
          <el-table :data='tableList' height="100%">
            <el-table-column type='index' label='序号' align='center'></el-table-column>
            <el-table-column show-overflow-tooltip v-if="tableShow[val]" align='center' v-for='(val,key) in tableConfig' :key='key' :label='val' :prop='val'></el-table-column>
            <el-table-column v-if="tableShow.warestoreName" align='center' label='仓库' prop='warestoreName'></el-table-column>
            <el-table-column align='center' label='数量' width='70' fixed='right'>
              <template slot-scope='scope'>
                <el-input-number style="width: 50px" class="input-number input__inner" v-model='scope.row.saleNum' :min='1' :max='scope.row.goodsNum' size="mini"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column align='center' label='价格' width='100' fixed='right'>
              <template slot-scope='scope'>
                <el-input-number style="width: 80px" class="input-number input__inner" :precision="2" size='mini' v-model="scope.row.salePrice" :min="0"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column align='center' label='操作' width='48' fixed='right'>
              <template slot-scope='scope'>
                <i @click='removeGoods(scope.$index)' class="iconfont shanchu"></i>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="bill_create_btn">
          <button @click='createSale' type="button">创建销售单</button>
        </div>
      </div>
    </div>
    <!-- 退货单 -->
    <div class="bill_main return" v-if='radio==2'>
      <div class="bill_main_top">
        <div class="bill_infos clearfix">
          <div class="bill_info" @click='openSale'>
            <i class="ic iconfont cebain-xiaoshouguanli"></i>
            <div class="bill_info_div">{{sale?sale.orderNo:'选择销售单'}}</div>
          </div>
          <div class="bill_info">
            <i class="ic iconfont riqi"></i>
            <el-date-picker v-model="reTime" type="date" value-format="timestamp" placeholder="时间"></el-date-picker>
          </div>
          <div class="bill_info">
            <input class="bill_info_input" v-model='returnMemo' type="text" placeholder="备注">
          </div>
        </div>
        <div class="bill_infos clearfix">
          <div class="bill_info">
            <i class="ic iconfont chepai1"></i>
            <input class="bill_info_input" v-model='returnCarNo' type="text" placeholder="退货车号">
          </div>
        </div>
      </div>
      <div :style="{height:'calc(100% - '+h+'px)'}" class="bill_main_fot">
        <div class="bill_table">
          <el-table :data='returnList' height='100%'>
            <el-table-column  align='center' label='包号' prop='packageNo'></el-table-column>
            <el-table-column  align='center' v-for='(val,key) in saleConfig' :key='key' :label='val' :prop='val'></el-table-column>
            <el-table-column label='单价' prop='price' align='center' width='100'>
							<template slot-scope='scope'>
								<input class="in" v-model="scope.row.price">
							</template>
						</el-table-column>
            <el-table-column label='金额' prop='salePrice' align='center' width='120'>
							<template slot-scope='scope'>{{scope.row.amount*scope.row.price}}</template>
						</el-table-column>
            <el-table-column label='备注' align='center'>
              <template slot-scope='scope'>
                <el-tooltip v-if='scope.row.memo' :content='scope.row.memo' placement="top">
                  <i class="iconfont icon-zhuyi"></i>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="bill_create_btn">
          <button type="button" @click='createReturn'>创建退货单</button>
        </div>
      </div>
    </div>
    <!-- 选择客户 -->
    <custpmer ref='customer' @cb='selectCustomer' @create='createCustomer'></custpmer>
    <!-- 新建客户 -->
    <newcustomer ref='newcustomer' @fin='createCustomerFinish'></newcustomer>
    <!-- 添加商品 -->
    <selectgoods ref='goods' @cb='getGoods'></selectgoods>
    <!-- 销售单列表 -->
    <el-dialog width="1000px" title="销售单列表" center :visible.sync="saleVisible" v-dialogDrag>
      <div class="table_style">
        <el-table :data='saleList' border height='400px' highlight-current-row @current-change="saleSelect" v-loading='loading'>
          <el-table-column align='center' label='销售单号' width='150' prop='orderNo' show-overflow-tooltip></el-table-column>
          <el-table-column align='center' label='销售时间' width='120'>
            <template slot-scope='scope'>{{scope.row.sellTime|time('y-m-d')}}</template>
          </el-table-column>
          <el-table-column align='center' label='销售部门' width='80' prop='deptName'></el-table-column>
          <el-table-column align='center' label='客户名称' prop='contactName' show-overflow-tooltip></el-table-column>
          <el-table-column align='center' label='数量' width='60' prop='orderPackages'></el-table-column>
          <el-table-column align='center' label='金额' width='100' prop='orderAmount'></el-table-column>
          <el-table-column align='center' label='是否含税' width='80' prop='isTax'>
            <template slot-scope='scope'>{{scope.row.isTax?scope.row.isTax==1?'含税':'不含税':'null'}}</template>
          </el-table-column>
          <el-table-column align='center' label='出库' width='60' prop='state'>
            <template slot-scope="scope">
              <i class="el-icon-success" :class="{active:scope.row.state===7}"></i>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 30px;text-align: center">
          <el-button type="primary" plain @click="saleVisible=false">取消</el-button>
          <el-button type="primary" @click='checkSale'>确定</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 销售单详情 -->
    <el-dialog width="1000px" title='销售单详情' center :visible.sync='returnVisible' v-dialogDrag>
      <div class="return_sale_main">
        <el-table :data='saleData' width='100%' height='100%' @selection-change='saleCheck' ref='multipleTable'>
          <el-table-column type='selection' width="55"></el-table-column>
          <el-table-column label='包号' prop='packageNo' show-overflow-tooltip></el-table-column>
          <el-table-column v-for='(val,key) in saleConfig' :key='key' :label='val' :prop='val'></el-table-column>
        </el-table>
      </div>
      <div class="dialog_fot">
        <button type="button" class='sure' @click='setTableList'>确定</button>
        <button type="button" class='pass' @click='returnVisible=false'>取消</button>
      </div>
    </el-dialog>
    <!-- 设置 -->
    <el-dialog title='设置' center :visible.sync='setVisible' width='800px' v-dialogDrag>
      <div>
        <el-tabs v-model="activeName">
          <el-tab-pane label="表格字段" name="first">
            <options v-if="setVisible" :data='tableOptions' @cb='updataTableOptions' @close='setVisible=false'></options>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import headBackTitle from '@/components/headBackTitle.vue'
import custpmer from './customerSelection'
import selectgoods from './selectGoods'
import newcustomer from '../customer/newcustomer'
import options from '@/components/options.vue'
export default {
  components:{
    "ym-hbt":headBackTitle,
    "custpmer":custpmer,
    "selectgoods":selectgoods,
    "newcustomer":newcustomer,
	  "options":options
  },
  data(){
    return{
      checks:{
        dan:true,
        zhu:true
      },
      radio:'1',
      isTax:null,
      h:0,
      screenWidth:0,
      customerVisible:false,
      comVisible:false,
      tenantId:JSON.parse(this.$store.state.token).tenantId,
      userId:JSON.parse(this.$store.state.token).id,
      loading:false,
      customerList:null,
      customer:{},
      crtoryList:[],
      crtoryId:null,
      lockCrtoryId:null,
      mateData:[],
      goodsList:[],
      num:0,
      tableList:[],
      data:null,
      saleVisible:false,
      saleList:[],
      carNo:null,
      memo:null,
      orderNo:null,
      sale:null,
      returnVisible:false,
      saleData:[],
      saleConfig:[],
      returnList:[],
      returnCarNo:'',
      returnMemo:'',
      prodisabled:false,
			reTime:'',
			preferentialAmount:'',
			role:JSON.parse(this.$store.state.role),
		  setVisible:false,
		  activeName:'first',
    }
  },
  computed:{
    tableConfig:function(){
      switch (this.crtoryId) {
        case 1: return this.GLOBAL_.tableConfig['原木材'];
        case 2: return this.GLOBAL_.tableConfig['实木板材'];
        case 3: return this.GLOBAL_.tableConfig['名贵材'];
        case 4: return this.GLOBAL_.tableConfig['木配城'];
        case 5: return this.GLOBAL_.tableConfig['人造板'];
        default:return [];
      }
    },
	  tableShow:function() {
		  let temp = {};
		  this.tableOptions.forEach((val)=>{
			  temp[val.key]=val.show
		  });
		  return temp;
	  },
		tableOptions:function(){
			return this.crtoryId?JSON.parse(this.$store.state.setJson).tableOptions.OS[this.crtoryId]:[{"key":"warestoreName","name":"仓库","show":true}];
		}
  },
  methods:{
    /**
    * 打开客户窗口
    * @method openCustomer
    */
    openCustomer(){
      this.$refs.customer.open();
    },
    /**
    * 选择客户
    * @method selectCustomer
    */
    selectCustomer(data){
      this.customer = data;
    },
    /**
    * 打开选择商品窗口
    * @method openGoods
    */
    openGoods(){
      this.$refs.goods.open(this.tableList,this.crtoryId)
    },
    /**
    * 接受商品
    * @method getGoods
    */
    getGoods(data,crtoryId){
      this.crtoryId = crtoryId;
      this.tableList = data;
    },
    /**
    * 删除商品
    * @method removeGoods
    */
    removeGoods(index){
      this.tableList.splice(index,1);
      if(this.tableList.length===0){
        this.crtoryId = null;
      }
    },
    /**
    * 打开新建客户窗口
    * @method createCustomer
    */
    createCustomer(){
      this.$refs.newcustomer.open();
    },
    /**
    *
    * @method createCustomerFinish
    */
    createCustomerFinish(){
      this.$refs.customer.refresh();
    },
    /**
    * 创建销售单
    * @method createSale
    */
    createSale(){
      if(!this.role.erp_sale_new) return this.$message.error('没有销售权限');
      if(!this.customer.contactId) return this.$message.error('请选择客户');
      if(!this.carNo) return this.$message.error('请输入车号');
      if(this.tableList.length === 0) return this.$message.error('请选择产品');
      if(!this.isTax) return this.$message.error('请选择是否含税');
		  const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
      let num=0,price=0,arr=[];
      this.tableList.forEach(val=>{
        num += val.saleNum;
        price += val.saleNum*val.salePrice*val.amount;
        let obj = {
          packageId:val.id,
          creatorId:this.userId,
          warestoreId:val.warestoreId,
          salePrice:val.amount*val.salePrice,
          goodsNum:val.saleNum
        };
        arr.push(obj)
      });
      let data = {
        contactId:this.customer.contactId,
        carNo:this.carNo,
        checkApproveState:1,
        creatorId:this.userId,
        isTax:parseInt(this.isTax),
        memo:this.memo,
        openApproveStatet:1,
        orderNumber:this.orderNo,
        orderPackages:num,
        orderAmount:price,
        prepayAmount:0,
        receivableAmount:price,
        preferentialAmount:0,
        content:'',
        tenantId:this.tenantId,
        state:1,
        sellFormDetailList:arr,
		    sellType:0,
      };
      this.$axios.post('/aps/sell/addToSellForm',data)
      .then(res=>{
      	loading.close();
        if(res.data&&res.data.data){
          this.$router.push({
            name:'saleDeta',
            query:{
              id:res.data.data,
              backName:'openSale'
            }
          })
        }else{
        	this.$message.error('创建销售单失败')
        }
      },()=>{loading.close();this.$message.error('创建销售单失败')})
    },
	  /**
	   * 表格字段更新
	   * @method updataTableOptions
	   */
	  updataTableOptions(data){
			this.setVisible = false;
			if(!this.crtoryId) return;
		  let setJson = JSON.parse(this.$store.state.setJson);
		  setJson.tableOptions.OS[this.crtoryId] = data;
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
    /*
    * 退货
    * */

    // 打开销售列表
    openSale(){
      const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
      let params = {tenantId:this.tenantId};
      this.$axios.get('aps/sell/showSellsList',{params})
      .then(res=>{
        loading.close();
        if(res.data&&res.data.data){
          this.saleVisible = true;
          this.saleList = res.data.data;
        }else{
          this.$message.error('获取数据失败')
        }
      },()=>{loading.close();this.$message.error('获取数据失败')})
    },
    //选择销售单
    saleSelect(val){
      this.current = val;
    },
    // 确定选择的销售单
    checkSale(){
      if(this.current){
        this.salecopy = this.current;
        this.saleVisible = false;
        this.openReturn();
      }else{
        this.$message('请选则销售单')
      }
    },
    openReturn(){
      this.returnVisible = true;
      this.checkList = null;
			this.saleData = [];
      this.$axios({
        method:'get',
        url:'/api/storeDaySavePrice/shwoSellCheckDetail',
        params:{
          sellFormId:this.salecopy.id
        }
      }).then(res=>{
        if(res.data.data){
          this.saleData = this.proSaleData(res.data.data);
					for(let i in this.saleData){
						this.saleData[i].立方数 = this.saleData[i].amount;
					}
          for(let i in this.saleData){
            if(this.saleData[i].品类){
              this.saleConfig=this.GLOBAL_.tableConfig[this.saleData[i].品类];
              break;
            }
          }
        }else{
          this.saleData = [];
        }
      })
    },
    proSaleData(data){
      for(let i in data){
        Object.assign(data[i],this.proData(data[i].attributeValue))
      }
      console.log(data);
      return data;
    },
    //
    saleCheck(val){
      this.checkList = val;
    },
    //确定
    setTableList(){
      console.log(this.checkList);
      if(!this.checkList||this.checkList.length==0){
        this.$message('选择数据')
      }else{
				this.sale = JSON.parse(JSON.stringify(this.salecopy))
        this.returnList = this.checkList;
        this.returnVisible = false;
      }
    },
    //创建退货单
    createReturn(){
      //判断能否建立退货单
			let returnPrice = 0;
			for(let i in this.returnList){
				returnPrice += this.returnList[i].price*this.returnList[i].amount;
			}
      let data = {}
      data.returnSellForm = {
        carNo:this.returnCarNo,
        contactId:this.sale.contactId,
        creatorId:this.userId,
        memo:this.returnMemo,
        openApproveStatet:1,
        sellFormId:this.sale.id,
        state:1,
        tenantId:this.tenantId,
        warestoreId:this.sale.warestoreId,
				refundPrice:0,
				returnPrice:returnPrice,
				returnTime:this.reTime,
				orderNum:this.returnList.length,
      }
      let arr = [];
      for(let i in this.returnList){
        let obj = {
          goodsId:this.returnList[i].goodsId,
          goodsNum:this.returnList[i].amount,
          goodsPrice:this.returnList[i].price,
          warestoreId:this.returnList[i].warestoreId,
          memo:this.returnList[i].memo
        }
        arr.push(obj);
      }
      data.returnSellFormDetail=arr;
      let att = [];
      for(let i in this.returnList){
        let obj = {
          memo:this.returnList[i].memo,
          packageId:this.returnList[i].packageId,
          packagePrice:this.returnList[i].price,
          returnPrice:this.returnList[i].price*this.returnList[i].amount,
          warestoreId:this.returnList[i].warestoreId
        }
        att.push(obj)
      }
      data.returnSellFormPackage = att;
      this.$axios({
        method:'post',
        url:'/api/productCategory/addReturnSellFormInfo',
        data:data
      }).then(res=>{
        if(res.data.data){
          this.$router.push({name:'returnDeta',params:{id:res.data.data,backUrl:'returnGoods'}})
        }
      })
    }
  },
  mounted(){
    this.screenWidth = document.body.offsetWidth;
    window.onresize=()=>{
      this.screenWidth = document.body.offsetWidth;
    };
    if(this.$route.params.data){
    	let data = {...this.$route.params.data};
    	data.fullName = data.companyName;
    	data.contactId = data.id;
    	this.customer = data;
    }else{
      this.customer = {};
    }
  },
  watch:{
    screenWidth:function(){
      this.h = document.getElementsByClassName('bill_main_top')[0].offsetHeight;
    },
    radio:function(){
      setTimeout(()=>{
        this.h = document.getElementsByClassName('bill_main_top')[0].offsetHeight;
      })
    },
    checks:{
      handler:function(){
        setTimeout(()=>{
          this.h = document.getElementsByClassName('bill_main_top')[0].offsetHeight;
        })
      },
      deep:true
    }
  },
	filters:{
		packageNum:function(data){
			if(data.length){
				let num = 0;
				data.forEach((val)=>{
					num += parseInt(val.saleNum)
				})
				return "已选择商品"+num+"件";
			}else{
				return "选择商品"
			}
		}
	}
}
</script>

<style lang="scss">

.el-input.is-disabled .el-input__inner{
  background: #ffffff;
  color: #000000;
}

.return .el-table{
  background: none;
}
.return .el-table th,.return .el-table tr{
  background: none;
}
.bill .bill_main.return{
  background-color: rgb(253, 243, 242);
}
.bill .bill_main.return input{
  background-color: rgb(253, 243, 242);
}
.el-table .err{
  background: oldlace;
}
.table_fixed .el-table__fixed-right .el-table__fixed-body-wrapper{
  top: 40px !important;
}
</style>
<style lang="scss" scoped>
  i.active{
    color: #46b6f6;
  }

	.bill_table .in{
		width: 80px;
		border: 1px solid #fdf3f2;
		background: #fdf3f2;
	}
	.bill_table tr input.in:hover{
		border:1px solid rgb(255, 203, 125);
		background: rgb(255, 247, 235);
	}
	.bill_table tr input.in:focus{
		border:1px solid rgb(255, 203, 125);
		background: rgb(255, 247, 235);
	}
	.bill_table tr:hover .in{
		background: #f5f7fa;
		border:1px solid #f5f7fa;
	}
  .return_sale_main{
    height: 490px;
    padding: 0 30px;
  }
</style>
