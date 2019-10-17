<template lang="html">
	<div class="bill">
		<div class="bill_header">
			<ym-hbt :to='{name:"inStoreHome"}' title='直接入库'></ym-hbt>
		</div>
		<div class="bill_mi">
			<span class='bill_set'>设置</span>
			<div class="bill_mi_item" @click="getH">
				<el-checkbox v-model="checkTime">时间</el-checkbox>
			</div>
			<div class="bill_mi_item" @click="getH">
				<el-checkbox v-model="checkPrice">价格</el-checkbox>
			</div>
			<div class="bill_mi_item" @click="getH">
				<el-checkbox v-model="checkMemo">备注</el-checkbox>
			</div>
		</div>
		<div class="bill_main">
			<div class="bill_main_top">
				<div class="bill_infos clearfix">
					<div class="bill_info">
						<i class="ic iconfont icon-hetong"></i>
						<el-select v-model="storeKey" placeholder="选择仓库">
							<el-option v-for='(val,key) in storeList' :key='key' :label="val.name" :value="key"></el-option>
						</el-select>
					</div>
					<div class="bill_info" v-if='checkTime'>
						<el-date-picker v-model="time" type="date" value-format="timestamp" placeholder="选择日期"></el-date-picker>
					</div>
					<div class="bill_info" v-if='checkPrice'>
						<el-select v-model="priceKey" placeholder="选择卸柜费">
							<el-option v-for='(val,key) in priceList' :key='key' :label="val.price" :value="key"></el-option>
						</el-select>
					</div>
					<div class="bill_info" v-if='checkMemo'>
						<input class="bill_info_input" type="text" v-model='memo' placeholder="备注">
					</div>
				</div>
				<div class="bill_infos clearfix">
					<div class="bill_info">
						<i class="ic iconfont icon-hetong"></i>
						<div class="bill_info_div" @click='openExp'>库存导入产品</div>
					</div>
					<div class="bill_info">
						<div class="bill_info_div">其他入库</div>
					</div>
				</div>
			</div>
			<div class="bill_main_fot" :style="{height:'calc(100% - '+h+'px)'}">
				<div class="bill_table">
					<el-table :data='tableData' height='100%'>
						<el-table-column label='序号' type='index'></el-table-column>
						<el-table-column label="包号" prop="包号"></el-table-column>
						<el-table-column label="柜号" prop="柜号"></el-table-column>
						<el-table-column show-overflow-tooltip v-for='(val,key) in tableConfig' :label='val' :prop='val' :key='key'></el-table-column>
					</el-table>
				</div>
				<div class="bill_create_btn">
					<button type="button" @click="createExcalInStore">创建进货单</button>
				</div>
			</div>
		</div>
    <!-- 导入导出 -->
    <export ref="exp" type="store" @cb="getExcalData"></export>
    <!-- 导入结果 -->
    <el-dialog width="670px" title="导入结果" center :visible.sync="resultVisible" v-dialogDrag>
      <div class='result_top'>
        <div class='result_top_item'>
          <span>成功</span>
          <div class='progress'>
            <el-progress :text-inside="true" :stroke-width="15" :percentage="successProgress"></el-progress>
          </div>
          <span class='look' @click='successVisible=true'>查看</span>
        </div>
        <div class='result_top_item'>
          <span>失败</span>
          <div class='progress'>
            <el-progress :text-inside="true" :stroke-width="15" :percentage="errorProgress" status="exception"></el-progress>
          </div>
          <span class='look' @click='errorVisible=true'>查看</span>
        </div>
      </div>
      <div style='text-align:center;margin:10px'>
        <el-button size='small' type='primary' plain @click='resultVisible=false'>取消</el-button>
        <el-button size='small' type='primary' @click='addExcalData'>确定</el-button>
      </div>
      <!-- 成功结果 -->
      <el-dialog width='1000px' title='成功数据' center :visible.sync='successVisible' v-dialogDrag append-to-body>
        <div class="table_style">
          <el-table border :data='success' height='500px'>
            <el-table-column show-overflow-tooltip v-for='(val,key) in success[0]' :key='key' :label='key' :prop='key'></el-table-column>
          </el-table>
        </div>
      </el-dialog>
      <!-- 失败结果 -->
      <el-dialog width='1000px' title='问题数据' center :visible.sync='errorVisible' v-dialogDrag append-to-body>
        <div class="table_style">
          <el-table border :data='error' height='500px'>
            <el-table-column show-overflow-tooltip v-for='(val,key) in error[0]' :key='key' :label='key' :prop='key'></el-table-column>
          </el-table>
        </div>
      </el-dialog>
    </el-dialog>
	</div>
</template>

<script>
	import headBackTitle from '@/components/headBackTitle.vue'
  import ex from '@/components/export.vue';
	export default {
		components: {
			"ym-hbt": headBackTitle,
      "export":ex
		},
		data() {
			return {
				h: 0,
				screenWidth: 0,
				checkTime: true,
				checkPrice: true,
				checkMemo: true,
				storeList: [],
				storeKey: '',
				priceList: [],
				priceKey: '',
				time: '',
				memo: '',
				activeName: '',
				tableList: [],
				tabConfig: [],
				tenantId: JSON.parse(this.$store.state.token).tenantId,
				userId: JSON.parse(this.$store.state.token).id,
		    role: JSON.parse(this.$store.state.role),
        success:[],
        error:[],
        successProgress:0,
        errorProgress:0,
        resultVisible:false,
        successVisible:false,
        errorVisible:false,
        catoryName:null,
        tableData:[],
        tableConfig:[],
			}
		},
		methods: {
			//获取仓库列表
			getStoreList() {
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {tenantId:this.tenantId};
        this.$axios.get('/api/storeInForm/showStoreInfor',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.storeList = res.data.data;
          }else{
            this.storeList = [];
            this.$message.error('获取数据失败')
          }
        },()=>{loading.close();this.$message.error('获取数据失败')});
			},
      // 打开导入弹窗
      openExp(){
        this.$refs.exp.open();
      },
      // 接收导入数据
			getExcalData(data,name){
				let success = [];
				let error = [];
				data.forEach((val)=>{
					if(val.品类===name&&val.树种&&val.品牌&&val.等级){
						switch (name){
							case "实木板材":
								if(!!val.厚度&&!!val.宽度&&!!val.长度&&!!val.片数&&typeof val.立方数==="number"&&typeof val.成本单价==="number"){
									success.push(val)
								}else{
									error.push(val)
								};
								break;
							case "原木材":
								if(!!val.口径&&!!val.长度&&!!val.立方数&&typeof val.根数==="number"&&typeof val.成本单价==="number"){
									success.push(val)
								}else{
									error.push(val)
								};
								break;
							case "名贵材":
								if(!!val.形态&&!!val.厚度&&!!val.宽度&&!!val.长度&&typeof val.数量==="number"&&typeof val.成本单价==="number"){
									success.push(val)
								}else{
									error.push(val)
								}
								break;
							case "木配城":
								if(!!val.产品&&!!val.厚度&&!!val.宽度&&!!val.长度&&typeof val.数量==="number"&&typeof val.成本单价==="number"&&!!val.单位){
									success.push(val)
								}else{
									error.push(val)
								}
								break;
							case "人造板":
								if(!!val.产品&&!!val.厚度&&!!val.规格&&typeof val.数量==="number"&&typeof val.成本单价==="number"){
									success.push(val)
								}else{
									error.push(val)
								}
								break;
							default :
								error.push(val)
						}
					}else{
						error.push(data[i])
					}
				})
				this.success = success;
				this.error = error;
				this.successProgress = (success.length/data.length*100).toFixed(2)-0;
				this.errorProgress = (error.length/data.length*100).toFixed(2)-0;
				this.resultVisible = true;
			},
      getExcalData1(data,name){
        let success = [];
        let error = [];
        for(let i in data){
          if(data[i].品类===name&&typeof data[i].成本单价 ==='number'){
            let tableConfig = this.GLOBAL_.tableConfig[name];
            let arr = [];
            for(let n in tableConfig){
            	if(tableConfig[n]!=='立方数'){
				        arr.push(tableConfig[n]+':'+data[i][tableConfig[n]])
              }
            }
            data[i].attributeValue=arr;
            data[i].packageNo = 'BN'+ parseInt(Math.random()*100000);
            data[i].brandName = data[i].品牌;
            data[i].catoryName = name;
            data[i].contractSn = data[i].合同号;
            data[i].issuingId=0;
            data[i].issuingName='';
            data[i].memo=this.memo;
            data[i].tenantId=this.tenantId;
            data[i].boxNo = data[i].柜号;
            data[i].price = data[i].成本单价;
            switch (name) {
              case '实木板材' :
                if(data[i].树种&&data[i].品牌&&data[i].等级!=='undefined'&&typeof data[i].厚度 === 'number'&&typeof data[i].宽度 === 'number'
                  &&typeof data[i].长度 ==='number'&&typeof data[i].立方数 ==='number'&&typeof data[i].片数 === 'number'&&data[i].产地&&data[i].水份){
                  data[i].amount = data[i].立方数;
                  data[i].packageNo = data[i].包号;
                  data[i].catoryId = 2;
                  data[i].unti='m³';
                  success.push(data[i]);
                }else{
                  error.push(data[i]);
                }
                break;
              case '原木材':
                if(data[i].树种&&data[i].品牌&&data[i].等级!=='undefined'&&typeof data[i].口径 ==='number'&&typeof data[i].长度 ==='number'&&typeof data[i].根数 ==='number'
                  &&data[i].产地&&data[i].水份){
                  data[i].amount = data[i].根数;
                  data[i].catoryId = 1;
                  data[i].unti="G";
                  success.push(data[i])
                }else{
                  error.push(data[i])
                }
                break;
              case '木配城' :
                if(data[i].产品&&data[i].树种&&data[i].品牌&&data[i].等级&&typeof data[i].厚度==='number'&&typeof data[i].宽度==='number'&&typeof data[i].长度==='number'&&typeof data[i].数量==='number'){
                  data[i].amount = data[i].数量;
                  data[i].catoryId = 4;
                  success.push(data[i])
                }else{
                  error.push(data[i])
                }
                break;
              case '人造板':
                if(data[i].产品&&data[i].树种&&data[i].品牌&&data[i].等级&&typeof data[i].厚度==='number'&&typeof data[i].数量==='number'){
                  data[i].amount = data[i].数量;
                  data[i].catoryId = 5;
                  data[i].unti = 'P';
                  success.push(data[i])
                }else{
                  error.push(data[i])
                }
                break;
              case '名贵材':
                if(data[i].树种&&data[i].品牌&&data[i].形态&&data[i].等级&&typeof data[i].厚度==='number'&&typeof data[i].宽度==='number'&&typeof data[i].长度==='number'&&typeof data[i].数量==='number'){
                  data[i].amount = data[i].数量;
                  data[i].catoryId = 3;
                  data[i].unti='m³';
                  success.push(data[i])
                }else{
                  error.push(data[i])
                }
                break;
              default : error.push(data[i])
            }
          }else{
            error.push(data[i])
          }
        }
        this.success = success;
        this.error = error;
        this.successProgress = (success.length/data.length*100).toFixed(2)-0;
        this.errorProgress = (error.length/data.length*100).toFixed(2)-0;
        this.resultVisible = true;
      },
      // 确定导入数据
      addExcalData(){
				let data = [...this.success];
        if(data.length===0) return this.$message.error('没有数据');
        if(!this.catoryName||this.catoryName===data[0].品类){
          this.catoryName = data[0].品类;
          this.tableConfig = this.GLOBAL_.tableConfig[this.catoryName];
					data.forEach((val)=>{
						let attributeValue = [];
						for(let n in this.tableConfig){
							if(this.tableConfig[n]!=='立方数'){
						    attributeValue.push(this.tableConfig[n]+':'+val[this.tableConfig[n]])
						  }
						}
						val.attributeValue = attributeValue;
						val.packageNo = 'BN'+ parseInt(Math.random()*100000);
						val.brandName = val.品牌;
						val.catoryName = this.catoryName;
						val.contractSn = val.合同号;
						val.issuingId=0;
						val.issuingName='';
						val.memo=val.memo;
						val.tenantId=this.tenantId;
						val.boxNo = val.柜号;
						val.price = val.成本单价;
						switch (this.catoryName){
							case "实木板材":
								val.amount = val.立方数;
								val.packageNo = val.包号;
								val.catoryId = 2;
								val.unti='m³';
								break;
							case "原木材":
								val.amount = val.根数;
								val.catoryId = 1;
								val.unti="G";
								break;
							case "木配城":
								val.amount = val.数量;
								val.catoryId = 4;
								val.unti=val.单位;
								break;
							case "人造板":
								val.amount = val.数量;
								val.catoryId = 5;
								val.unti = 'P';
								break;
							case "名贵材":
								val.amount = val.数量;
								val.catoryId = 3;
								val.unti='m³';
								break;
						}
					})
          this.tableData = [
              ...this.tableData,
              ...this.success
          ];
          this.resultVisible=false;
          this.$refs.exp.close();
        }else{
          this.$message.error('导入数据与已选数据类目规格不同，不能添加。')
        }
      },

      // 创建入库单
      createExcalInStore(){
				if(!this.role.erp_instore_new) return this.$message.error('没有权限');
        if(this.storeKey ==='') return this.$message.error('请选择仓库');
        if(this.priceKey==='') return this.$message.error('请选择卸柜费');
        if(this.tableData.length===0) return this.$message.error('没有入库数据');
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let guiNum = 0;
        let obj = {};
        for(let i in this.tableData){
          obj[this.tableData[i].柜号]='';
          this.tableData[i].warestoreId = this.storeList[this.storeKey].id
        }
        for(let i in obj){guiNum++};
        let data = {
          storeActionPayment:{
            actionType:1,
            creatorId:this.userId,
            formId:0,
            handingPriceId:this.priceList[this.priceKey].id,
            memo: this.priceList[this.priceKey].memo,
            num:guiNum,
            payName: this.priceList[this.priceKey].name,
            price: this.priceList[this.priceKey].price,
            tenantId: this.tenantId,
            warestoreId: this.storeList[this.storeKey].id
          },
          storeInForm:{
            approveState: 1,
            boxNum:guiNum,
            contractId:0,
            creatorId: this.userId,
            memo: this.memo,
            packageNum:this.tableData.length,
            state: 1,
            status: 1,
            storageType: 4,
            storeInTime: this.time,
            supportId: 0,
            tenantId: this.tenantId,
            warestoreId: this.storeList[this.storeKey].id
          },
          packageImportDtoList:this.tableData,
          storeInFormDetail:this.tableData,
        };
        this.$axios.post('/api/storeInForm/createStoreInFormImport',data)
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.$router.push({
              name: 'inDeta',
              query: {
                  backUrl: 'excalPutIn',
                  id: res.data.data
              }
            })
          }else{
            this.$message.error('获取数据失败')
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
			getH() {
				setTimeout(() => {
					this.h = document.getElementsByClassName('bill_main_top')[0].offsetHeight;
				})
			},
		},
		mounted() {
			this.screenWidth = document.body.offsetWidth;
			window.onresize = () => {
				this.screenWidth = document.body.offsetWidth;
			}
			this.getStoreList();
		},
		watch: {
			screenWidth: function() {
				this.h = document.getElementsByClassName('bill_main_top')[0].offsetHeight;
			},
			storeKey: function() {
				this.priceList = this.storeList[this.storeKey].storeHandingPrices;
				this.priceKey = ''
			},
		}
	}
</script>
<style lang="scss">
	.download .el-dialog {
		width: 640px;
		height: 400px;
		top: calc(50% - 200px);
		left: calc(50% - 320px);
	}

	.outtype .el-dialog {
		width: 610px;
		height: 360px;
		top: calc(50% - 180px);
		left: calc(50% - 305px);
	}

	.inload .el-dialog {
		width: 580px;
		height: 280px;
		left: calc(50% - 290px);
		top: calc(50% - 140px);
	}

	.success .el-dialog {
		width: 900px;
		height: 540px;
		top: calc(50% - 270px);
		left: calc(50% - 450px);
	}
</style>
<style lang="scss" scoped>
  .result_top{
    margin: 20px 50px 50px;
    .result_top_item{
      margin-bottom: 20px;
      .progress{
        display: inline-block;
        width: 400px;
        margin: 0 20px;
      }
      .look{
        cursor: pointer;
        &:hover{
          color: rgb(70, 182, 246);
        }
      }
    }
  }


	.bill_table_tabs {
		height: 40px;
		overflow: hidden;
	}

	.bill_table_main {
		height: calc(100% - 54px);
	}

	.inload_title {
		text-align: center;
	}

	.inload_row {
		height: 40px;
		line-height: 40px;
		padding: 0 50px;
		margin: 20px 0;

		.inload_bar {
			display: inline-block;
			height: 8px;
			width: 300px;
			background: #ddd;
			vertical-align: middle;
			overflow: hidden;
			border-radius: 4px;

			div {
				width: 50%;
				height: 8px;
				background: #33d670;
			}
		}
	}

	.out_main {
		height: 190px;
		margin: 40px 110px;

		.topItem {
			width: 100px;
			height: 30px;
			padding: 0 10px;
			float: left;
			margin: 10px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			cursor: pointer;

			span {
				color: #666;
				font-size: 14px;
				line-height: 30px;
			}

			i {
				font-size: 14px;
				color: #fff;
			}
		}

		.active {
			background-color: #33d670;

			span {
				color: #fff;
			}

			i {
				color: #fff;
			}
		}
	}

	.download_main {
		height: 260px;
		width: 450px;
		margin: 0 auto;
		border-bottom: 1px solid #dddddd;

		.download_main_float {
			float: left;
			width: 50%;
			height: 100%;
			text-align: center;

			span {
				background: #00AC55;
				display: inline-block;
				width: 24px;
				height: 24px;
				border-radius: 50%;
				color: #ffffff;
				line-height: 24px;
				margin: 20px 0;
			}

			div {
				width: 106px;
				height: 106px;
				border: 2px solid #00AC55;
				margin: 0 auto;
				cursor: pointer;

				i {
					font-size: 50px;
					line-height: 106px;
					color: #00AC55;
				}
			}

			p {
				margin: 20px 0;
			}
		}
	}

	.download_p {
		margin-top: 20px;
		line-height: 20px;
		text-align: center;
	}
</style>
