<template>
	<div class="bill">
		<div class="bill_header">
			<v-header title="新建调拨" :to="{name:'storeManageHome'}"></v-header>
		</div>
		<div class="bill_mi">
			<div class="bill_mi_item">
				<el-checkbox v-model="checkTime">时间</el-checkbox>
			</div>
			<div class="bill_mi_item">
				<el-checkbox v-model="checkMemo">备注</el-checkbox>
			</div>
		</div>
		<div class="bill_main">
			<div class="bill_main_top">
				<div class="bill_infos clearfix">
					<div class="bill_info">
						<i class="ic iconfont cangku"></i>
						<el-select v-model="outStore" placeholder="调出仓库" @change='inspectOutStore'>
							<el-option :label="val.name" :value="val.id" v-for="(val,key) in storeList" :key="key"></el-option>
						</el-select>
					</div>
					<div class="bill_info">
            <i class="ic iconfont cangku"></i>
						<el-select v-model="inStore" placeholder="调入仓库" @change='inspectInStore'>
							<el-option :label="val.name" :value="val.id" v-for="(val,key) in storeList" :key="key"></el-option>
						</el-select>
					</div>
					<div class="bill_info">
            <i class="ic iconfont riqi"></i>
						<el-date-picker prefix-icon='n' clear-icon='n' v-model="date" type="date" placeholder="选择日期"></el-date-picker>
					</div>
					<div class="bill_info">
						<el-input v-model="memo" placeholder="备注"></el-input>
					</div>
				</div>
				<div class="bill_infos clearfix">
					<div class="bill_info">
						<div class="bill_info_div"  @click="openCheck">选择包</div>
					</div>
				</div>
			</div>
			<div class="bill_main_fot" :style="{height:'calc(100% - '+h+'px)'}">
				<div class="bill_table">
					<el-table  height="100%" :data="tableData">
						<el-table-column type="index" label="序号"></el-table-column>
						<el-table-column prop="packageNo" label="包号" show-overflow-tooltip></el-table-column>
						<el-table-column :label="val" v-for=" (val,key) in tableConfig" :key="key" show-overflow-tooltip>
							<template slot-scope="scope">{{scope.row[val]}}</template>
						</el-table-column>
						<el-table-column label="操作" align="center">
							<template slot-scope="scope">
								<i class="iconfont shanchu" @click="removeData(scope.$index)"></i>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="bill_create_btn">
					<button type="button" @click='post'>创建进货单</button>
				</div>
			</div>
		</div>
		<el-dialog width='1100px' title='选择包件' center :visible.sync="visible" v-dialogDrag>
			<div style="height:50px">
				<div class="dialog_tool">
					<div class="dialog_items">
						<div class="dialog_item fi">
							<el-select v-model="crtoryId" :disabled='lock' @change="goodsList=[];getGoodsList()" placeholder="请选择">
								<el-option v-for='(val,key) in crtoryList' :key='key' :label="val.categoryName" :value="val.id"></el-option>
							</el-select>
						</div>
						<div :class="{fi:option[val]}" v-for='(val,key) in tableConfig' :key='key' v-show='val!="品类"&&val!="湿度"&&val!="产地"&&val!="水份"' class="dialog_item">
							<el-select v-model="option[val]" :placeholder="val" @change="selectData" clearable>
								<el-option v-for='(v,k) in select[val]' :key='k' :label="v" :value="v"></el-option>
							</el-select>
						</div>
						<div class="dialog_item">
							<span class="clear_btn" @click=''>清楚过滤</span>
						</div>
						<div class="dialog_item" style="float:right">
							<span>已选商品</span>
							<span class="sp">{{multipleSelection.length}}</span>
						</div>
					</div>
				</div>
			</div>
			<div style="height:500px" class="table_style selectGoods">
				<el-table :data='goodsList' ref="multipleTable" style="width:100%" height="500" border @selection-change="handleSelectionChange">
					<el-table-column type="selection"></el-table-column>
					<el-table-column show-overflow-tooltip label="包号" prop="packageNo"></el-table-column>
					<el-table-column show-overflow-tooltip label='品类' prop='品类' key='2'></el-table-column>
					<el-table-column show-overflow-tooltip v-if='crtoryId===4||crtoryId===5' label='产品' prop='产品' key='3'></el-table-column>
					<el-table-column show-overflow-tooltip label='树种' prop='树种' key='4'></el-table-column>
					<el-table-column show-overflow-tooltip label='品牌' prop='品牌' key='5'></el-table-column>
					<el-table-column show-overflow-tooltip v-if='crtoryId===3' label='形态' prop='形态' key='6'></el-table-column>
					<el-table-column show-overflow-tooltip label='等级' prop='等级' key='7'></el-table-column>
					<el-table-column show-overflow-tooltip v-if='crtoryId===1' label='口径' prop='口径' key='8'></el-table-column>
					<el-table-column show-overflow-tooltip v-if='crtoryId!==1' label='厚度' prop='厚度' key='9'></el-table-column>
					<el-table-column show-overflow-tooltip v-if='crtoryId!==1&&crtoryId!==5' label='宽度' prop='宽度'  key='10'></el-table-column>
					<el-table-column show-overflow-tooltip v-if='crtoryId!==5' label='长度' prop='长度' key='11'></el-table-column>
					<el-table-column show-overflow-tooltip v-if='crtoryId!==1&&crtoryId!==2' label='数量' prop='数量' key='12'></el-table-column>
					<el-table-column show-overflow-tooltip v-if='crtoryId===2' label='立方数' prop='立方数'  key='13'></el-table-column>
					<el-table-column show-overflow-tooltip v-if='crtoryId===1' label='根数' prop='根数' key='14'></el-table-column>
					<el-table-column show-overflow-tooltip v-if='crtoryId===1||crtoryId===2' label='产地' prop='产地' key='15'></el-table-column>
					<el-table-column show-overflow-tooltip v-if='crtoryId===1||crtoryId===2' label='水份' prop='水份' key='16'></el-table-column>
				</el-table>
			</div>
			<div style="text-align:center;margin-top:30px">
				<el-button type='primary' plain @click='visible=false'>取消</el-button>
				<el-button type='primary' @click='sureData'>确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import header from "@/components/headBackTitle.vue";
	export default {
		data() {
			return {
				storeList: [],
				outStore: '',
				inStore: '',
				date: '',
				memo: '',
				crtoryList: [],
				crtoryId: '',
				tableData: [],
				tenantId: JSON.parse(this.$store.state.token).tenantId,
				userId: JSON.parse(this.$store.state.token).id,
		    role: JSON.parse(this.$store.state.role),
				screenWidth:'',
				h:0,
				checkTime:true,
				checkMemo:true,
				visible:false,
				lock:false,
				tableConfig:[],
				select:{},
				option:{},
				goodsList:[],
				multipleSelection:[],
			}
		},
		methods: {
			/**
			* 获取仓库列表
			* @method getStoreList
			*/
			getStoreList() {
				const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let params = {tenantId: this.tenantId};
				this.$axios.get('/api/storeExchangeForm/showStoreTableInfor',{params})
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						this.storeList = res.data.data
					}else{
						this.$message.error('获取数据失败')
					}
				},()=>{loading.close();this.$message.error('获取数据失败')})
			},
			/**
			* 判断是否与调入仓库相同
			* @method inspectOutStore
			*/
			inspectOutStore() {
				if (this.outStore === this.inStore) {
					this.$alert('调出仓库不能与调入仓库相同', '操作错误', {
						confirmButtonText: '确定',
						callback: action => {
							this.outStore = ''
						}
					})
				}
				this.tableData = [];
				this.lock = false;
			},
			/**
			* 判断是否与调入仓库相同
			* @method inspectInStore
			*/
			inspectInStore() {
				if (this.outStore === this.inStore) {
					this.$alert('调入仓库不能与调出仓库相同', '操作错误', {
						confirmButtonText: '确定',
						callback: action => {
							this.inStore = ''
						}
					})
				}
			},
			/**
			* 打开选择包弹窗
			* @method openCheck
			*/
			openCheck(){
				if(!this.outStore) return this.$message.error('请选择仓库');
				const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				this.$axios.get('/api/storeExchangeForm/showCrtoryInfo')
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						this.visible = true;
						this.crtoryList = res.data.data;
						if(!this.crtoryId){this.crtoryId = 2}
						this.getGoodsList();
					}else{
						this.$message.error('获取类目失败')
					}
				},()=>{loading.close();this.$message.error('获取类目失败')})
			},
			/**
			 * 获取包信息列表
			 * @method getGoodsList
			 */
			getGoodsList(){
				let params = {
					tenantId: this.tenantId,
					warestoreId: this.outStore,
					catoryId: this.crtoryId,
					spState: 1,
				}
				this.$axios.get('/api/storeExchangeForm/showPackage',{params})
				.then(res=>{
					if(res.data&&res.data.data){
						let data = res.data.data;
						for(let i in data){
							data[i] = Object.assign(data[i],this.strToObj(data[i].attibuteValue))
						}
						this.metaData = data;
						this.option={};
						this.selectData();
					}else{
						this.goodsList = [];
						this.select = {};
						this.$message.error('没有数据')
          }
				})
			},
			/**
			 * 生成筛选项
			 * @method createSelect
			 */
			createSelect(data){
				let tableConfig = [];
				switch(this.crtoryId){
					case 1 : tableConfig = this.GLOBAL_.tableConfig['原木材']; break;
					case 2 : tableConfig = this.GLOBAL_.tableConfig['实木板材']; break;
					case 3 : tableConfig = this.GLOBAL_.tableConfig['名贵材']; break;
					case 4 : tableConfig = this.GLOBAL_.tableConfig['木配城']; break;
					case 5 : tableConfig = this.GLOBAL_.tableConfig['人造板']; break;
					default : tableConfig = [];
				}
				let select = {};
				for(let i in tableConfig){
					select[tableConfig[i]]=[];
				}
				for(let i in data){
					for(let n in tableConfig){
						select[tableConfig[n]].push(data[i][tableConfig[n]])
					}
				}
				for(let i in select){
					select[i] = this.uniq(select[i])
				}
				this.tableConfig = tableConfig;
				this.select = select;
			},
			/**
			 * 筛选
			 * @method selectData
			 */
			selectData(){
				let data = JSON.parse(JSON.stringify(this.metaData));
				for(let i in this.option){
					for(let n=0;n<data.length;n++){
						if(this.option[i]&&data[n][i]!=this.option[i]){
							data.splice(n,1);
							n--;
						}
					}
				}
				this.goodsList = data;
				this.createSelect(data);
				setTimeout(()=>{
					this.toggleSelection();
				})
			},
			/**
			 * 字符串转对象
			 * @method strToObj
			 */
			strToObj(data) {
				let arr = data.split(',');
				let obj = {};
				for (let i in arr) {
					if (arr[i] !== '') {
						obj[arr[i].split(":")[0]] = arr[i].split(":")[1]
					}
				}
				return obj
			},
			/**
			 * 选中数据
			 * @method handleSelectionChange
			 */
			handleSelectionChange(data){
				this.multipleSelection = data;
			},
			/**
			 * 确定调拨数据
			 * @method sureData
			 */
			sureData(){
				if(this.multipleSelection.length==0) return this.$message.error('选中数据');
				this.tableData = this.multipleSelection
				this.lock = true;
				this.visible = false;
			},
			/**
			 * 检查数据是否选中
			 */
			toggleSelection() {
				for(let i in this.goodsList){
					for(let n in this.tableData){
						if(this.goodsList[i].id==this.tableData[n].id){
							this.$refs.multipleTable.toggleRowSelection(this.goodsList[i],true)
						}
					}
				}
			},
      /**
       * 删除所选数据
       * @method removeData
       * */
      removeData(index){
      	this.tableData.splice(index,1);
      },


			//创建
			post() {
      	if(!this.role.erp_allocation_new) return this.$message.error('没有权限');
      	if(!this.outStore) return this.$message.error('选择调出仓库');
      	if(!this.inStore) return this.$message.error('选择调入仓库');
      	if(!this.date) return this.$message.error('选择时间');
      	if(!this.tableData.length>0) return this.$message.error('选择调拨数据');
				let postData = {};
				let date = Date.parse(new Date(this.date));
				postData.storeExchangeForm = {
					creatorId: this.userId,
					tenantId: this.tenantId,
					fromWarestoreId: this.outStore,
					toWarestoreId: this.inStore,
					packageNum: this.tableData.length,
					storeOutTime: date,
					memo: this.memo
				};
				postData.storeExchangeFormDetailList = [];
				for (let i in this.tableData) {
					let obj = {
						boxNo: 'null',
						fromWarestoreId: this.outStore,
						toWarestoreId: this.instore,
						packageId: this.tableData[i].id,
						storeOutTime: date,
						memo: this.memo,
						creatorId: this.userId
					};
					postData.storeExchangeFormDetailList.push(obj)
				}
				this.$axios({
					method: 'post',
					url: '/api/storeExchangeForm/createStoreExchangeForm',
					data: postData
				}).then(res => {
					if (res && res.data.data) {
						this.$router.push({
							name: 'allocationDeta',
							query: {
								allotId: res.data.data,
								backurl: 'newAllocation'
							}
						})
					}
				})
			}
		},
		mounted: function() {
			this.getStoreList();
			this.screenWidth = document.body.offsetWidth;
			window.onresize = () => {
				this.screenWidth = document.body.offsetWidth;
			}
		},
		components: {
			"v-header": header,
		},
		watch: {
			screenWidth: function() {
				this.h = document.getElementsByClassName('bill_main_top')[0].offsetHeight;
			},
		},
	};
</script>
<style lang="scss" scoped>
.dialog_tool .dialog_item .sp{
	color: #FFFFFF;
	background-color: #00A0E9;
	padding: 0 2px;
	border-radius: 4px;
	cursor: pointer;
}
</style>
