<template lang="html">
	<div class="listModule">
		<div class="list_header">
			<ym-hbt :to='{name:"saleHome"}' title='销售部门'></ym-hbt>
		</div>
		<div class="list_setbar">
			<div class="list_setbar_options">
				<div class="option" v-if="multipleSelection.length==0" @click='isTable = !isTable'>
					<div class="option_yuan"><i class="iconfont" :class="isTable?'jiugongge':'liebiao'"></i></div>
				</div>
				<div class="option" v-if="multipleSelection.length==0" @click="getData">
					<div class="option_yuan"><i class="iconfont shuaxin"></i></div>
					<span class="option_txt">刷新</span>
				</div>
				<div class="option" v-if="multipleSelection.length==0" @click="openNew">
					<div class="option_yuan"><i class="iconfont xinjian"></i></div>
					<span class="option_txt">新建</span>
				</div>
				<div class="option" v-if="multipleSelection.length>0" @click="exportExcel">
					<div class="option_yuan"><i class="iconfont shanchu"></i></div>
					<span class="option_txt">导出</span>
				</div>
				<div class="search_input">
					<i class="iconfont sousuo"></i>
					<input type="text" @change="getData" v-model="likeName" placeholder="销售部门/负责人/电话" class="search_input_placeholder">
				</div>
			</div>
			<div class="list_setbar_selections"></div>
		</div>
		<div class="list_main" :class="{se:isSelect}">
			<div class="list_main_table" v-if='isTable'>
				<div class="table">
					<el-table :data="depList" height='100%' @selection-change="handleSelectionChange">
						<el-table-column type='selection'></el-table-column>
						<el-table-column label='销售部门'>
							<template slot-scope='scope'>
								<a href="javascript:void(0)" @click="openDepDeta(scope.row)">{{scope.row.name}}</a>
							</template>
						</el-table-column>
						<el-table-column label="负责人" prop="userName"></el-table-column>
						<el-table-column label="电话" prop="phone"></el-table-column>
						<el-table-column label='绑定账户' prop="acountName"></el-table-column>
					</el-table>
				</div>
				<div class="table_fot">
					<span>总数：{{depList.length}}</span>
				</div>
			</div>
			<div class="list_main_card" v-if='!isTable'>
				<div class="card">
					<ul class="card_ul">
						<li class="card_li" v-for='(val,key) in depList' :key='key'>
							<div class="card_li_con">
								<div class="content" @click="openDepDeta(val)">
									<div class="content_left">
										<img src="../../../assets/imgs/logo.png" alt="">
									</div>
									<div class="content_right">
										<div class="content_right_row row1">
											<span class="v">{{val.name}}</span>
										</div>
										<div class="content_right_row row2">
											<span class="n">负责人：</span>
											<span class="v">{{val.userName}}</span>
										</div>
										<div class="content_right_row row2">
											<span class="n">电话：</span>
											<span class="v">{{val.phone}}</span>
										</div>
										<div class="content_right_row row2">
											<span class="n">账户：</span>
											<span class="v">{{val.acountName}}</span>
										</div>
									</div>
								</div>
							</div>
						</li>
					</ul>
				</div>
				<div class="card_fot">
					<span>总数：{{depList.length}}</span>
				</div>
			</div>
		</div>
		<!-- 新建 -->
		<el-dialog width="500px" title="新建部门" center :visible.sync="addVisible" v-dialogDrag>
			<div style="padding: 0 30px;">
				<el-form label-width="80px" ref='form' :rules="rules" :model="addForm">
					<el-form-item label="名字" prop="name">
						<el-input v-model="addForm.name"></el-input>
					</el-form-item>
					<el-form-item label="负责人" prop="userId">
						<el-select style="width: 100%;" v-model="addForm.userId">
							<el-option v-for="(val,key) in user" :key="key" :label="val.userName" :value="val.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="电话" prop="phone">
						<el-input v-model="addForm.phone"></el-input>
					</el-form-item>
					<el-form-item label="绑定账户" prop="accountId">
						<el-select style="width: 100%;" v-model="addForm.accountId">
							<el-option v-for="(val,key) in account" :key="key" :label="val.name" :value="val.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="备注">
						<el-input v-model="addForm.memo"></el-input>
					</el-form-item>
				</el-form>
			</div>
			<div style="text-align:center;margin-top:30px;">
				<el-button type="primary" plain @click='addVisible=false'>取消</el-button>
				<el-button type="primary" @click='submitForm'>确定</el-button>
			</div>
		</el-dialog>
		<!-- 部门详情 -->
		<el-dialog width="600px" title="部门详情" center :visible.sync="depDetaVisible" v-dialogDrag>
			<div class="dep_top">
				<div class="dep_top_item">
					<span>部门名称:</span>{{depInfo.name}}
				</div>
				<div class="dep_top_item">
					<span>负责人:</span>{{depInfo.userName}}
				</div>
				<div class="dep_top_item">
					<span>电话:</span>{{depInfo.phone}}
				</div>
				<div class="dep_top_item">
					<span>绑定账户:</span>{{depInfo.acountName}}
				</div>
				<div class="dep_top_item">
					<span>备注:</span>{{depInfo.memo}}
				</div>
			</div>
			<div class="dep_fot">
				<div class="dep_fot_item item1" @click="openModify(depInfo)">
					<i class="iconfont xiugai"></i>
					<span>修改信息</span>
				</div>
				<div class="dep_fot_item item3" @click="openDepUser(depInfo.id)">
					<i class="iconfont kehu"></i>
					<span>员工列表</span>
				</div>
			</div>
		</el-dialog>
		<!-- 修改信息 -->
		<el-dialog width="500px" title="修改信息" center :visible.sync="modifyVisible" v-dialogDrag>
			<div style="padding: 0 30px;">
				<el-form label-width="80px" ref='modifyForm' :rules="rules" :model="modifyForm">
					<el-form-item label="名字" prop="name">
						<el-input v-model="modifyForm.name"></el-input>
					</el-form-item>
					<el-form-item label="负责人" prop="userId">
						<el-select style="width: 100%;" v-model="modifyForm.userId">
							<el-option v-for="(val,key) in user" :key="key" :label="val.userName" :value="val.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="电话" prop="phone">
						<el-input v-model="modifyForm.phone"></el-input>
					</el-form-item>
					<el-form-item label="绑定账户" prop="accountId">
						<el-select style="width: 100%;" v-model="modifyForm.accountId">
							<el-option v-for="(val,key) in account" :key="key" :label="val.name" :value="val.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="备注">
						<el-input v-model="modifyForm.memo"></el-input>
					</el-form-item>
				</el-form>
			</div>
			<div style="text-align:center;margin-top:30px;">
				<el-button type="primary" plain @click='modifyVisible=false'>取消</el-button>
				<el-button type="primary" @click="modifyDep">确定</el-button>
			</div>
		</el-dialog>
		<!-- 员工列表 -->
		<el-dialog width="800px" title="员工列表" center :visible.sync="userVisible" v-dialogDrag>
			<div>
				<el-table :data="userList" height="400px">
					<el-table-column type="index"></el-table-column>
					<el-table-column label="名字" prop="userName"></el-table-column>
					<el-table-column label="电话" prop="mobile"></el-table-column>
					<el-table-column label="Email" prop="email"></el-table-column>
				</el-table>
			</div>
			<div style="text-align: center;margin-top: 30px;">
				<el-button type="primary" @click="userVisible=false">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import headBackTitle from '@/components/headBackTitle.vue'
	export default {
		components: {
			"ym-hbt": headBackTitle,
		},
		data() {
			return {
				isTable: true,
				isSelect: false,
				tenantId: JSON.parse(this.$store.state.token).tenantId,
				companyId:JSON.parse(sessionStorage.getItem('youmuUser')).companyId,
				depList: [],
				addVisible:false,
				addForm:{},
				account:[],
				user:[],
				rules:{
					name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
					userId:[{ required: true, message: '请选择负责人', trigger: 'change' }],
					phone:[{ required: true, message: '请输入电话', trigger: 'blur' }],
					accountId:[{ required: true, message: '请选择账户', trigger: 'change' }],
				},
				depDetaVisible:false,
				depInfo:{},
				multipleSelection:[],
				modifyForm:{},
				modifyVisible:false,
				userVisible:false,
				userList:[],
				likeName:'',
			}
		},
		methods: {
			// 获取数据
			getData() {
				let loading = this.$loading({lock: true, text: '数据更新中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let params = {tenantId: this.tenantId,likeName:this.likeName};
				this.$axios.get('/aps/sell/showDepart',{params})
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						this.depList = res.data.data;
					}else{
						this.$message.error('获取数据失败')
					}
				},()=>{loading.close();this.$message.error('获取数据失败')})
			},
			// 打开新建
			openNew(){
				let loading = this.$loading({lock: true, text: '数据更新中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				this.$axios.all([this.getAccount(),this.getUser()])
				.then(this.$axios.spread((acc,user)=>{
					loading.close();
					if(acc.data&&acc.data.data&&user.data&&user.data.data){
						this.account = acc.data.data;
						this.user = user.data.data;
						this.addVisible = true;
					}else{
						this.$message.error('获取信息失败')
					}
				}),()=>{loading.close();this.$message.error('获取信息失败')})
			},
			// 获取账户
			getAccount(){
				let params = {tenantId:this.tenantId};
				return this.$axios.get('/apa/financeTable/showPaymentAccount',{params});
			},
			// 获取员工
			getUser(){
				let params = {companyId:this.companyId};
				return this.$axios.get('/api/erpCompany/showUserInfo',{params});
			},
			// 表单验证
			submitForm(){
				this.$refs.form.validate((valid) => {
					if (valid) {
						this.addDep();
					} else {
						return this.$message.error('请检查信息');
					}
				});
			},
			// 新建部门
			addDep(){
				let loading = this.$loading({lock: true, text: '数据更新中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let data = {
					accountId:this.addForm.accountId,
					companyId:this.companyId,
					memo:this.addForm.memo,
					name:this.addForm.name,
					userId:this.addForm.userId,
					phone:this.addForm.phone,
					sort:0,
				};
				this.$axios.post('/aps/sell/addToCompanyDepart',data)
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						this.addVisible = false;
						this.likeName = null;
						this.getData();
					}else{
						this.$message.error('添加部门失败')
					}
				},()=>{loading.close();this.$message.error('添加部门失败')})
			},
			// 打开部门详情
			openDepDeta(val){
				let loading = this.$loading({lock: true, text: '数据更新中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let params = {id:val.id};
				this.$axios.get('/aps/sell/showDeptInfo',{params})
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						this.depDetaVisible = true;
						this.depInfo = res.data.data;
						this.depInfo.userName = val.userName;
					}else{
						this.$message.errorr('获取数据失败')
					}
				},()=>{loading.close();this.$message.error('获取数据失败')})
			},
			// 表格选中
			handleSelectionChange(data){
				this.multipleSelection = data;
			},
			// 导出
			exportExcel() {
				if (this.multipleSelection.length === 0) return this.$message.error('请选择导出的部门');
				let {
					export_json_to_excel
				} = require('../../../assets/excel/Export2Excel');
				require.ensure([], () => {
					var tHeader = ['部门','负责人','电话','绑定账户'];
					var filterVal = ['name','userName','phone','acountName'];
					var list = this.multipleSelection;
					var data = list.map(v => filterVal.map(j => v[j]));
					export_json_to_excel(tHeader, data, '部门列表');
				})
			},
			// 打开修改弹窗
			openModify(val){
				let loading = this.$loading({lock: true, text: '数据更新中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				this.$axios.all([this.getAccount(),this.getUser()])
				.then(this.$axios.spread((acc,user)=>{
					loading.close();
					if(acc.data&&acc.data.data&&user.data&&user.data.data){
						this.account = acc.data.data;
						this.user = user.data.data;
						this.modifyVisible = true;
						this.modifyForm = {...val};
					}else{
						this.$message.error('获取信息失败')
					}
				}),()=>{loading.close();this.$message.error('获取信息失败')})
			},
			// 修改部门
			modifyDep(){
				let loading = this.$loading({lock: true, text: '数据更新中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let data = {
					id:this.modifyForm.id,
					userId:this.modifyForm.userId,
					phone:this.modifyForm.phone,
					accountId:this.modifyForm.accountId,
					memo:this.modifyForm.memo,
					name:this.modifyForm.name
				}
				this.$axios.post('/aps/sell/modifyDept',data)
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						this.modifyVisible = false;
						this.depDetaVisible = false;
						this.getData();
					}else{
						this.$message.error('修改失败')
					}
				},()=>{loading.close();this.$message.error('修改失败')})
			},
			// 获取部门员工
			openDepUser(id){
				let loading = this.$loading({lock: true, text: '数据更新中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let params = {deptId:id};
				this.$axios.get('/aps/sell/showDeptPerson',{params})
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						this.userList = res.data.data;
						this.userVisible = true;
					}else{
						this.$message.error('获取员工列表失败')
					}
				},()=>{loading.close();this.$message.error('获取员工列表失败')})
			},
		},
		mounted() {
			this.getData();
		}
	};
</script>

<style lang="scss" scoped>
	@import "@/assets/css/jxc/wldw/customer.scss";
	.listModule .card_li .card_li_con {
		padding-bottom: 60%;
	}
	.dep_top{
		height: 150px;
		.dep_top_item{
			width: 50%;
			float: left;
			height: 30px;
			line-height: 30px;
			padding: 0 20px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			span{
				display: inline-block;
				width: 80px;
			}
		}
	}
	.dep_fot{
		height: 100px;
		text-align: center;
		.dep_fot_item{
			display: inline-block;
			width: 90px;
			height: 90px;
			border-radius: 50%;
			background-color: #F1F7FF;
			padding-top: 15px;
			margin: 0 40px;
			color: #999;
			cursor: pointer;
			i{
				font-size: 40px;
				line-height: 35px;
			}
			span{
				display: inline-block;
			}
		}
		.item1:hover{
			color: #FFFFFF;
			background-color: #AF77C5;
		}
		.item3:hover{
			color: #FFFFFF;
			background-color: #F17A61;
		}
	}
</style>
