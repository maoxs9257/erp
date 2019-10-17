<template lang="html">
	<div class="listModule">
		<div class="list_header">
			<ym-hbt :to='{name:"storeManageHome"}' title='仓库管理'></ym-hbt>
		</div>
		<div class="list_setbar">
			<div class="list_setbar_options">
				<div class="option" @click='isTable = !isTable'>
					<div class="option_yuan"><i class="iconfont" :class="isTable?'jiugongge':'liebiao'"></i></div>
				</div>
				<div class="option" @click="getData">
					<div class="option_yuan"><i class="iconfont shuaxin"></i></div>
					<span class="option_txt">刷新</span>
				</div>
				<div class="option" @click="openNewStore">
					<div class="option_yuan"><i class="iconfont xinjian"></i></div>
					<span class="option_txt">新建</span>
				</div>
				<div class="search_input">
					<i class="iconfont sousuo"></i>
					<input type="text" @change="screenInp" v-model="screenText" class="search_input_placeholder" placeholder="仓库名/仓管/手机号">
				</div>
			</div>
		</div>
		<div class="list_main" :class="{se:isSelect}">
			<div class="list_main_table" v-if='isTable'>
				<div class="table">
					<el-table :data='storeData' height='100%'>
						<el-table-column type='selection'></el-table-column>
						<el-table-column label='仓库名称'>
							<template slot-scope='scope'>
								<a href="javascript:void(0)" @click='openStore(scope.row.id)'>{{scope.row.name}}</a>
							</template>
						</el-table-column>
						<el-table-column label='仓管人员' prop='createName'></el-table-column>
						<el-table-column label='仓管地址' prop='address'></el-table-column>
						<el-table-column label='联系方式' prop='phone'></el-table-column>
					</el-table>
				</div>
				<div class="table_fot">
					<span>总数：{{storeData.length}}</span>
				</div>
			</div>
			<div class="list_main_card" v-if='!isTable'>
				<div class="card">
          <ul class="card_ul">
            <li class="card_li" v-for='(val,key) in storeData' :key='key'>
              <div class="card_li_con">
                <div class="content" @click='openStore(val.id)'>
                  <div class="content_left">
                    <img :src="val.image|imgUrl" alt="">
                  </div>
                  <div class="content_right">
                    <div class="content_right_row row1">
                      <span class="v">{{val.name}}</span>
                    </div>
                    <div class="content_right_row row2">
                      <span class="v">{{val.createName}}</span>
                    </div>
                    <div class="content_right_row row2">
                      <span class="v">{{val.address}}</span>
                    </div>
                    <div class="content_right_row row2">
                      <span class="s" >{{val.phone}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
				</div>
				<div class="card_fot">
					<span>总数：{{storeData.length}}</span>
				</div>
			</div>
		</div>
		<!-- 新建仓库 -->
		<el-dialog class='newStore' width='560px' title='新建仓库' center :visible.sync='newVisible' v-dialogDrag>
			<div style="margin:0 100px">
				<el-form label-width='100px' :inline="true" ref='ruleForm' :rules='rules' :model='newStore'>
					<el-form-item label='仓库名称' prop='name'>
						<el-input size='mini' v-model='newStore.name'></el-input>
					</el-form-item>
					<el-form-item label="仓管人员" prop="userId">
						<div class="dept" @click="openUser">{{user.userName}}</div>
					</el-form-item>
					<el-form-item label='绑定部门' prop='deptName'>
						<div class="dept" @click='openDepartment'>{{newStore.deptName}}</div>
					</el-form-item>
					<el-form-item label='联系电话' prop='phone'>
						<el-input size='mini' v-model='newStore.phone'></el-input>
					</el-form-item>
					<el-form-item label='仓库地址' prop='address'>
						<el-input size='mini' v-model='newStore.address'></el-input>
					</el-form-item>
					<el-form-item label='备注说明'>
						<el-input size='mini' v-model='newStore.memo'></el-input>
					</el-form-item>
				</el-form>
			</div>
			<div style="margin-top:10px;text-align:center">
				<el-button type='primary' plain @click='closeNewStore'>取消</el-button>
				<el-button type='primary' @click='submitForm'>确定</el-button>
			</div>
		</el-dialog>
		<!-- 员工列表 -->
		<el-dialog width="700px" title="员工列表" center :visible.sync="userVisible" v-dialogDrag>
			<div class="table_style">
				<el-table border highlight-current-row :data="userList" height="400px" @current-change="handleCurrentChange">
					<el-table-column type="index"></el-table-column>
					<el-table-column label="名字" prop="userName"></el-table-column>
					<el-table-column label="电话" prop="mobile"></el-table-column>
				</el-table>
			</div>
			<div style="text-align: center;margin-top: 30px;">
				<el-button type="primary" plain @click="userVisible=false">取消</el-button>
				<el-button type="primary" @click="makeSureUser">确定</el-button>
			</div>
		</el-dialog>
		<!-- 选择部门 -->
		<department ref='dep' @cb='setDept'></department>
		<!-- 仓库详情 -->
		<el-dialog :title='store.name' center width='750px' :visible.sync='storeVisible' v-dialogDrag>
			<div class="storeMain">
				<div class="storeMain_left">
					<div class="imgbox">
						<img :src="store.image|imgUrl" alt="">
						<i class="iconfont icon-shuaxin" @click='openCropper'>更新图片</i>
					</div>
				</div>
				<div class="storeMain_right">
					<div class="item">
						<span class="n">仓库地址：</span>
						<span class="v">{{store.address}}</span>
					</div>
					<div class="item">
						<span class="n">绑定部门：</span>
						<span class="v">{{store.deptMap|deptMap}}</span>
					</div>
					<div class="item">
						<span class="n">联系人：</span>
						<span class="v">{{store.createName}}</span>
					</div>
					<div class="item">
						<span class="n">联系手机：</span>
						<span class="v">{{store.phone}}</span>
					</div>
					<div class="item">
						<span class="n">库存数量：</span>
						<span class="v">{{store.storePriceAmountDto|getStockNum}}</span>
					</div>
					<div class="item">
						<span class="n">库存成本：</span>
						<span class="v">{{store.storePriceAmountDto?store.storePriceAmountDto.storeMoney:''|eMoney}}</span>
					</div>
					<div class="item">
						<span class="n">翻包费：</span>
						<span class="v">{{store.ActionPayments|filterFPrice}}</span>
					</div>
					<div class="item">
						<span class="n">拆包费：</span>
						<span class="v">{{store.ActionPayments|filterCPrice}}</span>
					</div>
					<div class="item">
						<span class="n">卸柜单价：</span>
						<span class="v">{{store.storeHandingPrices|filterHandingPrice}}</span>
					</div>
					<div class="item">
						<span class="n">收费时段：</span>
						<span class="v">{{store.storeSavePricelist|getDate}}</span>
					</div>
					<div class="item">
						<span class="n">收费标准：</span>
						<span class="v">{{store.storeSavePricelist|getPrice}}</span>
					</div>
					<div class="item">
						<span class="n">应付金额：</span>
						<span class="v">{{store.amountPrice|eMoney}}</span>
					</div>
					<div class="item">
						<span class="n">期初欠款：</span>
						<span class="v">{{store.arrearage|eMoney}}</span>
					</div>
					<div class="item">
						<span class="n">备注：</span>
						<span class="v">{{store.memo}}</span>
					</div>
				</div>
			</div>
			<div class="storeFot">
				<div class="storeFot_item one" @click='openModify(store)'>
					<i class="iconfont xiugai"></i>
					<p>修改信息</p>
				</div>
				<div class="storeFot_item two" @click="$router.push({name:'newCheck',query:{deptId:store.id}})">
					<i class="iconfont cangku-kucunpandian"></i>
					<p>库存盘点</p>
				</div>
				<div class="storeFot_item three" @click="openRemoveStore(store)">
					<i class="iconfont shanchu"></i>
					<p>删除仓库</p>
				</div>
			</div>
		</el-dialog>
		<!-- 图片上传 -->
		<xcropper ref='cropper'></xcropper>
		<!-- 修改仓库 -->
		<el-dialog title='修改仓库' center width='650px' :visible.sync='modifyVisible' v-dialogDrag>
			<div class="modifyStore">
				<div class="modifyStore_item">
					<span class="n">名称：</span>
					<el-input class='v' size='mini' v-model="modify.name"></el-input>
				</div>
				<div class="modifyStore_item">
					<span class="n">仓管员：</span>
					<div class="divv" @click="openUser">{{modify.createName}}</div>
				</div>
				<div class="modifyStore_item">
					<span class="n">绑定部门：</span>
					<div class="divv" @click='openModifyDept'>{{modify.deptMap|deptMap}}</div>
				</div>
				<div class="modifyStore_item">
					<span class="n">仓库地址：</span>
					<el-input class='v' size='mini' v-model="modify.address"></el-input>
				</div>
				<div class="modifyStore_item">
					<span class="n">联系手机：</span>
					<el-input class='v' size='mini' v-model="modify.phone"></el-input>
				</div>
				<div class="modifyStore_item">
					<span class="n">翻包费</span>
					<div class="divv" @click="openFan">{{modify.ActionPayments|filterFPrice}}</div>
				</div>
				<div class="modifyStore_item">
					<span class="n">拆包费</span>
					<div class="divv" @click="openChai">{{modify.ActionPayments|filterCPrice}}</div>
				</div>
				<div class="modifyStore_item">
					<span class="n">收费时段：</span>
					<div class="divv" @click='openSavePrice'>{{modify.storeSavePricelist|getDate}}</div>
				</div>
				<div class="modifyStore_item">
					<span class="n">收费标准：</span>
					<div class="divv" @click='openSavePrice'>{{modify.storeSavePricelist|getPrice}}</div>
				</div>
				<div class="modifyStore_item">
					<span class="n">卸柜单价：</span>
					<div class="divv" @click='openHand(modify.storeHandingPrices)'>{{modify.storeHandingPrices|filterHandingPrice}}</div>
				</div>
				<div class="modifyStore_item">
					<span class="n">备注：</span>
					<el-input class='v' size='mini' v-model="modify.memo"></el-input>
				</div>
			</div>
			<div style="text-align:center;padding-top:10px">
				<el-button type='primary' plain @click='close'>取消</el-button>
				<el-button type='primary' @click='modifyInfo'>确定</el-button>
			</div>
		</el-dialog>
		<!-- 选择部门 -->
		<department ref='dept' @cb='modifyDept'></department>
		<!-- 仓储费设置 -->
		<el-dialog title='仓储费规格设置' width='700px' center :visible.sync='savePriceVisible' v-dialogDrag>
			<div class="savePrice_one">
				<span>计量单位</span>
				<el-select size='mini' v-model="unit" @change='changeUnit' placeholder="请选择">
					<el-option v-for='(val,key) in priceUnit' :key='key' :label='val|unitName' :value='val'></el-option>
				</el-select>
			</div>
			<div class="savePrice_two">
				<ul>
					<li><span>收费时间段</span><span>室内仓库</span><span>室外仓库</span><span style="width:10%;">删除</span></li>
					<li v-for='(val,key) in priceData' :key='key'>
						<span>{{key}}</span>
						<span>
							<el-input-number size='mini' v-model="val.indoor.price" :min="0"></el-input-number>
						</span>
						<span>
							<el-input-number size='mini' v-model="val.outdoor.price" :min="0"></el-input-number>
						</span>
						<span class="remove" style="width:10%">
							<i class="iconfont shanchu" @click="removeSavePrice(val)"></i>
						</span>
					</li>
				</ul>
			</div>
			<div class="savePrice_three">
				<span>新增时段</span>
				<span class="start">{{startDate}}</span>
				<span>----</span>
				<el-input-number size='mini' v-model="endDate" :min="startDate+1" label="描述文字"></el-input-number>
				<el-button style='float:right' size='mini' type='primary' @click='addSavePrice'>添加</el-button>
			</div>
			<div style="text-align:center;margin-top:30px">
				<el-button type='primary' plain @click='savePriceVisible=false'>取消</el-button>
				<el-button type='primary' @click='modifySavePrice'>确定</el-button>
			</div>
		</el-dialog>
		<!-- 卸柜价格设置 -->
		<el-dialog title='卸柜价格设置' width='600px' center :visible.sync='handingVisible' v-dialogDrag>
			<div class="handing">
				卸柜价格：
				<span v-for='(val,key) in storeHandingPrices' :key="key">{{val.price}}<i class="iconfont shanchu" @click="removeHangingPrice(val,key)"></i></span>
			</div>
			<div class="addHanding">
				<span>新增价格</span>
				<el-input-number size='mini' style='width:400px' v-model="handingPrice" :min="0"></el-input-number>
				<el-button size='mini' @click='addHandingPrice'>确定</el-button>
			</div>
		</el-dialog>
		<!-- 拆包费 -->
		<el-dialog width="600px" title='拆包费' center :visible.sync="chaiVisible" v-dialogDrag>
			<div class="handing">
					拆包费：
					<span v-if="val.type===1" v-for='(val,key) in storeChaiPrice' :key="key">{{val.price}}<i @click="removeChai(val,key)" class="iconfont shanchu"></i></span>
				</div>
				<div class="addHanding">
					<span>新增价格</span>
					<el-input-number size='mini' style='width:400px' v-model="chaiPrice" :min="0"></el-input-number>
					<el-button type="primary" size='mini' @click="addChaiPrice">确定</el-button>
				</div>
			</el-dialog>
		</el-dialog>
		<!-- 翻包费 -->
		<el-dialog width="600px" title='翻包费' center :visible.sync="fanVisible" v-dialogDrag>
			<div class="handing">
				翻包费：
				<span v-if="val.type===0" v-for='(val,key) in storeFanPrice' :key="key">{{val.price}}<i @click="removeFan(val,key)" class="iconfont shanchu"></i></span>
			</div>
			<div class="addHanding">
				<span>新增价格</span>
				<el-input-number size='mini' style='width:400px' v-model="fanPrice" :min="0"></el-input-number>
				<el-button type="primary" size='mini' @click="addFanPrice">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import headBackTitle from '@/components/headBackTitle.vue'
	import department from '@/components/department.vue'
	import xcropper from '@/components/xcropper.vue'
	export default {
		components: {
			"ym-hbt": headBackTitle,
			"department":department,
			"xcropper":xcropper,
		},
		data() {
			return {
				isTable: true,
				isSelect: false,
				newVisible: false,
				storeVisible:false,
				date: null,
				select: null,
				tenantId: JSON.parse(this.$store.state.token).tenantId,
				userId:JSON.parse(this.$store.state.token).id,
		    role: JSON.parse(this.$store.state.role),
				companyId:JSON.parse(sessionStorage.getItem('youmuUser')).companyId,
				storeData: [],
				newStore:{
					name:'',
					deptName:'',
					phone:'',
					address:''
				},
				rules:{
					name:[{required:true,message:'请输入仓库名称',trigger:'blur'},{ min:2,max:20, message:'长度在2到20个字符',trigger:'blur'}],
					userId:[{required:true,message:'请选择仓管员',trigger:'change'}],
					deptName:[{required:true,message:'请选择部门',trigger:'change'}],
					phone:[{required:true,message:'请输入手机号',trigger:'blur'}],
					address:[{required:true,message:'请输入地址',trigger:'blur'}]
				},
				store:{},
				modify:{},
				modifyVisible:false,
				savePriceVisible:false,
				priceUnit:['G','number','cubic','ton'],
				unit:'number',
				priceData:{},
				startDate:0,
				endDate:'',
				handingVisible:false,
				storeHandingPrices:[],
				handingPrice:0,
		    screenText:'',
				userList:[],
				userVisible:false,
				user:{},
				fanVisible:false,
				storeFanPrice:[],
				fanPrice:0,
				chaiVisible:false,
				storeChaiPrice:[],
				chaiPrice:0,
			}
		},
		methods: {
			// 打开新建仓库窗口
			openNewStore(){
        if(!this.role.erp_store_new) return this.$message.error('没有权限');
				this.newVisible = true;
				this.newStore = {};
			},
			// 关闭新建仓库窗口
			closeNewStore(){
				this.newVisible = false;
			},
			// 打开员工列表
			openUser(){
				let loading = this.$loading({lock: true, text: '获取员工信息', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let params = {companyId:this.companyId};
				this.$axios.get('/api/erpCompany/showUserInfo',{params})
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						this.userList = res.data.data;
						this.userVisible = true;
					}else{
						this.$message.error('获取员工失败')
					}
				},()=>{this.$message.error('获取员工失败')})
			},
			// 员工单选
			handleCurrentChange(val){
				this.userCopy = val;
			},
			// 确定选择员工
			makeSureUser(){
				if(this.userCopy){
					this.user = this.userCopy;
					this.newStore.userId = this.userCopy.id;
					this.modify.createName = this.userCopy.userName;
					this.modify.creatorId = this.userCopy.id;
					this.userVisible = false;
				}else{
					this.$message.error('请选择员工')
				}
			},
			// 检验表格
			submitForm(){
				this.$refs.ruleForm.validate((valid) => {
          if (valid) {
						this.createStore();
          } else {
            return false;
          }
        });
			},
			// 创建仓库
			createStore(){
				let loading = this.$loading({lock: true, text: '数据更新中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let data = {
					creatorId:this.newStore.userId,
					tenantId:this.tenantId,
					name:this.newStore.name,
					phone:this.newStore.phone,
					address:this.newStore.address,
					memo:this.newStore.memo,
					deptId:this.newStore.id,
					location:'0,0',
					savePrice:'{ton:0,cubic:0,number:0}'
				};
				this.$axios.post('/api/storeTable/createStoreTable',data)
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						this.closeNewStore();
						this.getData();
					}else{
						this.$message.error('创建仓库失败');
					}
				},()=>{loading.close();this.$message.error('创建仓库失败');})
			},
			// 打开选择部门窗口
			openDepartment(){
				this.$refs.dep.open();
			},
			// 设置部门
			setDept(data){
				if(data){
					this.$set(this.newStore,'deptName',data.name);
					this.$set(this.newStore,'id',data.id);
				}else{
					this.newStore.deptName = null;
					this.newStore.id = null
				}
				if(this.newStore.deptName == null) {
					this.newStore.deptName = '未指定';
				}
			},
			// 打开仓库详情
			openStore(id){
				let loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let params = {
					tenantId: this.tenantId,
					id: id
				};
				this.$axios.get('/api/storeTable/showStoreTableInfor',{params})
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						this.storeVisible = true;
						this.store = res.data.data;
						this.getFCPrice(id)
					}else{
						this.$message.error('获取仓库信息失败')
					}
				},()=>{loading.close();})
			},
			// 获取翻包费，拆包费
			getFCPrice(id,type){
				let params = {
					tenantId:this.tenantId,
					warestoreId:id,
					type:type
				}
				this.$axios.get('/api/storeCostPrice/showStoreCostPrice',{params})
				.then(res=>{
					if(res.data&&res.data.data){
						this.$set(this.store,'ActionPayments',res.data.data)
					}
				})
			},
			// 打开图片
			openCropper(){
				let option = {
					title:'仓库图片',
					msg:'建议图片大小：2M'
				};
				this.$refs.cropper.open(option,(data)=>{
					this.store.image = data
          this.modifyStore({image:data},()=>{})
				});
			},
			// 修改仓库
			modifyStore(option,callback){
				let data = {
					id:this.store.id,
					tenantId:this.tenantId,
				};
				Object.assign(data,option);
				this.$axios.post('/api/storeTable/modifyStoreTableInfor',data)
				.then(res=>{
					if(res.data&&res.data.data){
						this.$message.success('修改成功')
					}else{
						this.$message.error('修改失败')
					}
					callback(res.data.data);
				},()=>{this.$message.error('修改失败');callback(false)})
			},
			// 打开修改仓库
			openModify(data){
				if(!this.role.erp_store_mod) return this.$message.error('没有权限');
				this.modifyVisible = true;
				this.modify = JSON.parse(JSON.stringify(data));
				this.storeSavePricelist = JSON.parse(JSON.stringify(this.modify.storeSavePricelist))
			},
			// 打开修改部门窗口
			openModifyDept(){
				this.$refs.dept.open();
			},
			// 修改仓库部门
			modifyDept(data){
				this.modify.deptMap = {[data.id]:data.name}
			},
			// 打开仓储费设置窗口
			openSavePrice(){
				this.savePriceVisible = true;
				let data = this.storeSavePricelist;
				let temp = {};
				for(let i in data){
					if(temp[data[i].unit]){
						let key = data[i].fromDate + '-' + data[i].toDate + '天';
						let o = {[data[i].type]:data[i]};
						temp[data[i].unit][key]=Object.assign(o,temp[data[i].unit][key])
					}else{
						let key = data[i].fromDate + '-' + data[i].toDate + '天';
						let o = {[data[i].type]:data[i]};
						temp[data[i].unit] = {[key]:o};
					}
				}
				console.log(temp)
				this.savePrice = temp;
				this.changeUnit();
			},
			// 选择价格单位
			changeUnit(){
				this.priceData = this.savePrice[this.unit];
				this.setStartSate(this.priceData);
			},
			// 确定起始日期
			setStartSate(data){
				let num = 0;
				for(let i in data){
					for(let n in data[i]){
						num = data[i][n].toDate>num?data[i][n].toDate:num;
					}
				}
				this.startDate = ++num;
				this.endDate = ++num;
			},
			// 添加仓储费
			addSavePrice(){
				let obj = {
					creatorId: this.userId,
					fromDate:this.startDate,
					toDate:this.endDate,
					type: null,
					price: 0,
					status: null,
					warestoreId: this.modify.id,
					memo: '',
					id: 0,
					unit:this.unit,
				}
				let obj1 = JSON.parse(JSON.stringify(obj));
				let obj2 = JSON.parse(JSON.stringify(obj));
				obj1.type = 'indoor'
				this.storeSavePricelist.push(obj1)
				obj2.type = 'outdoor'
				this.storeSavePricelist.push(obj2)
				this.openSavePrice();
			},
			// 修改仓储费
			modifySavePrice(){
				let loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let data = this.storeSavePricelist;
				for(let i in data){
					data[i].warestoreId = this.modify.id
				}
				this.$axios.post('/api/storeTable/createStoreSavePrice',data)
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						this.modify.storeSavePricelist = JSON.parse(JSON.stringify(this.storeSavePricelist));
						this.store.storeSavePricelist = JSON.parse(JSON.stringify(this.storeSavePricelist));
						this.savePriceVisible = false;
					}else{
						this.$message.error('修改失败');
					}
				},()=>{loading.close();this.$message.error('修改失败');})
			},
			// 删除仓储费
			removeSavePrice(val){
				let loading = this.$loading({lock: true, text: '删除仓储费', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let data = [];
				for(let i in val){
					data.push({id:val[i].id,status:0})
				}
				this.$axios.post('/api/storeTable/createStoreSavePrice',data)
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						for(let i in val){
							for(let n=0;n<this.storeSavePricelist.length;n++){
								if(this.storeSavePricelist[n].id==val[i].id){
									this.storeSavePricelist.splice(n,1);
									n--;
								}
							}
						}
						this.openSavePrice()
					}else{
						this.$message.error('删除仓储费失败')
					}
				},()=>{loading.close();this.$message.error('删除仓储费失败')})
			},
			// 打开卸柜设置
			openHand(data){
				this.handingVisible = true;
				this.storeHandingPrices = JSON.parse(JSON.stringify(data))
			},
			// 添加卸柜费
			addHandingPrice(){
				if(!this.handingPrice) return this.$message.error('请输入卸柜费');
				for(let i in this.storeHandingPrices){
					if(this.storeHandingPrices[i].price == this.handingPrice){
						return this.$message.error('卸柜费已存在')
					}
				}
				let loading = this.$loading({lock: true, text: '添加卸柜费', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let data = [{
					creatorId:this.userId,
					id:0,
					price:this.handingPrice,
					warestoreId:this.modify.id,
					name:'卸柜费'
				}]
				this.$axios.post('/api/storeTable/createStoreHandingPrice',data)
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						let price = res.data.data[0];
						this.storeHandingPrices.push(price);
						this.modify.storeHandingPrices.push(price);
						this.store.storeHandingPrices.push(price);
						this.handingPrice = 0;
					}else{
						this.$message.error('添加卸柜费失败')
					}
				},()=>{loading.close();this.$message.error('添加卸柜费失败')})
			},
			// 删除卸柜费
			removeHangingPrice(val,index){
				let loading = this.$loading({lock: true, text: '删除卸柜费', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let data = [{id:val.id,status:0}];
				this.$axios.post('/api/storeTable/modifyStoreHandingPrice',data)
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						this.storeHandingPrices.splice(index,1);
						this.modify.storeHandingPrices.splice(index,1);
						this.store.storeHandingPrices.splice(index,1);
					}else{
						this.$message.error('删除卸柜费失败')
					}
				},()=>{loading.close();this.$message.error('删除卸柜费失败')})
			},
			// 打开翻包费
			openFan(){
				let loading = this.$loading({lock: true, text: '获取翻包费', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let params = {
					tenantId:this.tenantId,
					warestoreId:this.modify.id,
				}
				this.$axios.get('/api/storeCostPrice/showStoreCostPrice',{params})
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						this.storeFanPrice = res.data.data;
						this.fanPrice = 0;
						this.fanVisible = true;
					}else{
						this.$message.error('获取翻包费失败')
					}
				},()=>{loading.close();this.$message.error('获取翻包费失败')})
			},
			// 添加翻包费
			addFanPrice(){
				if(!this.fanPrice) return this.$message.error('请输入翻包费');
				for(let i in this.storeFanPrice){
					if(this.storeFanPrice[i].type===0&&this.fanPrice==this.storeFanPrice[i].price){
						return this.$message.error('已有翻包费');
					}
				};
				let loading = this.$loading({lock: true, text: '添加翻包费', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let data = [{
					name:'翻包费',
					type:0,
					price:this.fanPrice,
					warestoreId:this.modify.id,
					creatorId:this.userId,
					tenantId:this.tenantId,
				}];
				this.$axios.post('/api/storeCostPrice/addStoreCostPrice',data)
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						this.storeFanPrice.push(res.data.data[0]);
						this.store.ActionPayments.push(res.data.data[0]);
						this.modify.ActionPayments.push(res.data.data[0]);
						this.fanPrice = 0;
					}else{
						this.$message.error('添加翻包费失败')
					}
				},()=>{loading.close();this.$message.error('添加翻包费失败')})
			},
			// 删除翻包费
			removeFan(val,index){
				let loading = this.$loading({lock: true, text: '删除翻包费', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let data = [{
					id:val.id,
					status:0
				}];
				this.$axios.post('/api/storeCostPrice/modifyStoreCostPrice',data)
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						this.storeFanPrice.splice(index,1);
						this.store.ActionPayments.splice(index,1);
						this.modify.ActionPayments.splice(index,1);
					}else{
						this.$message.error('删除翻包费失败')
					}
				},()=>{loading.close();this.$message.error('删除翻包费失败')})
			},
			// 打开拆包费
			openChai(){
				let loading = this.$loading({lock: true, text: '获取拆包费', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let params = {
					tenantId:this.tenantId,
					warestoreId:this.modify.id,
				}
				this.$axios.get('/api/storeCostPrice/showStoreCostPrice',{params})
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						this.storeChaiPrice = res.data.data;
						this.chaiVisible = true;
					}else{
						this.$message.error('获取拆包费失败')
					}
				},()=>{loading.close();this.$message.error('获取拆包费失败')})
			},
			// 添加拆包费
			addChaiPrice(){
				if(!this.chaiPrice) return this.$message.error('请输入拆包费');
				for(let i in this.storeChaiPrice){
					if(this.storeChaiPrice[i].type===1&&this.chaiPrice==this.storeChaiPrice[i].price){
						return this.$message.error('已有拆包费');
					}
				};
				let loading = this.$loading({lock: true, text: '添加拆包费', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let data = [{
					name:'拆包费',
					type:1,
					price:this.chaiPrice,
					warestoreId:this.modify.id,
					creatorId:this.userId,
					tenantId:this.tenantId,
				}];
				this.$axios.post('/api/storeCostPrice/addStoreCostPrice',data)
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						this.storeChaiPrice.push(res.data.data[0]);
						this.store.ActionPayments.push(res.data.data[0]);
						this.modify.ActionPayments.push(res.data.data[0]);
						this.chaiPrice = 0;
					}else{
						this.$message.error('添加拆包费失败')
					}
				},()=>{loading.close();this.$message.error('添加拆包费失败')})
			},
			// 删除拆包费
			removeChai(val,index){
				let loading = this.$loading({lock: true, text: '删除拆包费', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let data = [{
					id:val.id,
					status:0
				}];
				this.$axios.post('/api/storeCostPrice/modifyStoreCostPrice',data)
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						this.storeChaiPrice.splice(index,1);
						this.store.ActionPayments.splice(index,1);
						this.modify.ActionPayments.splice(index,1);
					}else{
						this.$message.error('删除拆包费失败')
					}
				},()=>{loading.close();this.$message.error('删除拆包费失败')})
			},
			// 关闭修改
			close(){
				this.modifyVisible = false;
			},
			// 修改仓库信息
			modifyInfo(){
				if(!this.role.erp_store_mod) return this.$message.error('没有权限');
				let loading = this.$loading({lock: true, text: '修改仓库', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let depId = '';
				for(let i in this.modify.deptMap){
					depId += i +','
        }
				let data = {
					address:this.modify.address,
					id:this.modify.id,
					memo:this.modify.memo,
					name:this.modify.name,
					phone:this.modify.phone,
			    deptId:depId,
					creatorId:this.modify.creatorId,
				};
				this.modifyStore(data,(v)=>{
					if(v){
						this.store = JSON.parse(JSON.stringify(this.modify));
						this.modifyVisible = false;
						this.getData();
					}
				});
			},
      // 获取数据
			getData() {
		    let loading = this.$loading({lock: true, text: '数据更新中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
		    let params = {tenantId:this.tenantId};
        this.$axios.get('/api/storeTable/showStoreTableInfor',{params})
        .then(res=>{
        	loading.close();
        	if(res.data&&res.data.data){
            this.metaData = res.data.data;
            this.screenInp();
          }else{
        		this.$message.error('获取数据失败');
          }
        },()=>{loading.close();this.$message.error('获取数据失败')});
			},
      // 筛选
		  screenInp(){
				let data = [...this.metaData];
				if(this.screenText!==''){
					let arr = [];
					data.forEach((val)=>{
						if(val.name.indexOf(this.screenText)!=-1||(val.createName && val.createName.indexOf(this.screenText)!=-1)||(val.phone&&val.phone.indexOf(this.screenText)!=-1)){
							arr.push(val)
            }
          });
          this.storeData = arr;
        }else{
					this.storeData = data;
        }
      },
			// 打开删除仓库
			openRemoveStore(data){
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.removeStore(data);
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});          
				});
			},
			// 删除仓库
			removeStore(data){
				let loading = this.$loading({lock: true, text: '删除仓库', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let params = {id:data.id};
				this.$axios.get('/api/storeTable/deleteStoreTableById',{params})
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						this.storeVisible = false;
						this.getData();
					}else{
						this.$message.error('删除仓库失败')
					}
				},()=>{loading.close();this.$message.error('删除仓库失败')})
			},
		},
		mounted() {
			this.getData();
		},
		filters:{
			deptMap:function(data){
				for(let i in data){
					return data[i];
				};
				return '';
			},
			getStockNum: function(data) {
				let str = ''
				if (!data) return;
				if (data.cubicCount) str += data.cubicCount + 'P / '
				if (data.numberCount) str += data.numberCount + 'm³ / '
				if (data.tonCount) str += data.tonCount + 'T'
				return str
			},
			filterFPrice: function(data) {
				var str = ''
				if (data&&data.length>0) {
					var arr = [];
					for (var i in data) {
						if (data[i].type === 0) arr.push(data[i].price)
					}
					for (var i in arr) {
						str += arr[i] + (i == arr.length - 1 ? '' : " / ")
					}
				}
				return str;
			},
			filterCPrice: function(data) {
				var str = ''
				if (data&&data.length>0) {
					var arr = [];
					for (var i in data) {
						if (data[i].type === 1) arr.push(data[i].price)
					}
					for (var i in arr) {
						str += arr[i] + (i == arr.length - 1 ? '' : " / ")
					}
				}
				return str;
			},
			filterHandingPrice: function(data) {
				let str = ''
				if (data) {
					let min = 0
					let max = 0
					for (var i in data) {
						if (i == 0) {
							min = max = data[i].price
						} else {
							if (min > data[i].price) min = data[i].price;
							if (max < data[i].price) max = data[i].price;
						}
					}
					str = '' + min + '-' + max
				}
				return str
			},
			getDate: function(data) {
				var str = ''
				if (data) {
					let min = 0
					let max = 0
					for (var i in data) {
						if (i == 0) {
							min = data[i].fromDate
							max = data[i].toDate
						} else {
							if (min > data[i].fromDate) min = data[i].fromDate
							if (max < data[i].toDate) max = data[i].toDate
						}
					}
					str = min + '-' + max
				}
				return str;
			},
			getPrice: function(data) {
				var str = ''
				if (data) {
					let min = 0
					let max = 0
					for (var i in data) {
						if (i == 0) {
							min = max = data[i].price
						} else {
							if (min > data[i].price) min = data[i].price
							if (max < data[i].price) max = data[i].price
						}
					}
					str = min + '-' + max
				}
				return str;
			},
			unitName:function(data){
				let str = '';
				if (data == 'ton') str = '每吨（T）';
				if (data == 'number') str = '每立方（m³）';
				if (data == 'cubic') str = '每片（P）';
				if (data == 'G') str = '每根（G）';
				return str;
			}
		}
	};

</script>

<style>
	.dep .el-dialog {
		width: 600px;
	}
	.savePrice_three .el-input-number span{
		display: none;
	}
	.savePrice_two .el-input-number span{
		display: none;
	}
	.addHanding .el-input-number span{
		display: none;
	}
</style>

<style lang="scss" scoped>
  @import "@/assets/css/jxc/wldw/customer.scss";
  .listModule .card_li .card_li_con {
    padding-bottom: 60%;
  }


	.newStore .is-error .dept {
		border:1px solid #F56C6C;
	}
	.newStore .dept{
		border:1px solid #DCDFE6;
		height:28px;
		width: 178px;
		border-radius: 5px;
		margin-top: 5px;
		line-height: 25px;
		padding: 0 10px;
		font-size: 12px;
	}
	.dep_main {
		height: 200px;
		padding: 0 80px;
		.dep_main_item {
			width: 80px;
			height: 20px;
			text-align: center;
			cursor: pointer;
		}
		.dep_main_left {
			float: left;
			height: 100%;
			width: 100px;
		}
		.dep_main_right {
			float: left;
			height: 100%;
			width: calc(100% - 100px);
		}
	}
	.storeFot{
		height: 110px;
    text-align: center;
		.storeFot_item{
      display: inline-block;
			width: 110px;
			height:110px;
      border-radius: 50%;
      margin-left: 40px;
      margin-right: 40px;
			cursor: pointer;
			text-align: center;
			color:#a0a0a0;
      background-color: #f0f7ff;
			i{
				font-size: 40px;
				line-height: 70px;
			}
		}
		.storeFot_item:hover{
			color: #ffffff;
		}
		.storeFot_item.one:hover{
			background-color: #af77c5;
		}
		.storeFot_item.two:hover{
			background-color: rgb(102, 188, 237);
		}
		.storeFot_item.three:hover{
			background-color: rgb(241, 122, 97)
		}
	}
	.storeMain{
		height: 400px;
		.storeMain_left{
			float: left;
			width: 200px;
			height: 100%;
			position:relative;
			.imgbox{
				position:absolute;
				top:30px;
				left:50%;
				transform:translateX(-50%);
				width:120px;
				height:120px;
				border-radius:50%;
				overflow:hidden;
				border:1px solid #999;
				img{
					width:100%;
					height:100%;
				}
				i{
					position:absolute;
					top:0;
					left:0;
					width:100%;
					height:100%;
					text-align:center;
					line-height:120px;
					color:#fff;
					font-size:18px;
					background-color:rgba(0,0,0,0.5);
					display:none;
					cursor:pointer;
				}
				&:hover i{
					display:block;
				}
			}
		}
		.storeMain_right{
			float: left;
			width: calc(100% - 200px);
			height: 100%;
			padding-top:30px;
			.item{
				float:left;
				width:50%;
				height:24px;
				padding-right:5%;
				line-height:24px;
				margin-bottom:25px;
				span{
					display:inline-block;
				}
				span.n{
					width:80px;
					overflow:hidden;
					text-align:right;
				}
				span.v{
					width:calc(100% - 90px);
					text-overflow:ellipsis;
					overflow:hidden;
					white-space:nowrap;
				}
			}
		}
	}
	.modifyStore{
		overflow:hidden;
		.modifyStore_item{
			float:left;
			width:50%;
			margin-bottom:30px;
			.n{
				display:inline-block;
				width:80px;
				text-align:right;
			}
			.v{
				width:200px;
			}
			.divv{
				display:inline-block;
				border:1px solid #DCDFE6;
				border-radius:5px;
				width:200px;
				height:28px;
				line-height:24px;
				vertical-align:middle;
				padding:0 10px;
			}
		}
	}
	.savePrice_one{
		padding-bottom: 20px;
	}
	.savePrice_two{
		padding-bottom: 20px;
		height:350px;
		li{
			border-bottom:1px solid #ddd;
			height:33px;
			line-height:30px;
			&:last-child{
				.remove{
					display: block;
				}
			}
			span{
				float:left;
				width:30%;
			}
			.remove{
				display: none;
				i{
					font-size: 20px;
					cursor: pointer;
					&:hover{
						color: #409EFF;
					}
				}
			}
		}
	}
	.savePrice_three{
		.start{
			display:inline-block;
			width:130px;
			text-align:center;
			border:1px solid #ddd;
			border-radius:5px;
			line-height:26px;
			margin-left:117px;
		}
	}
	.handing{
		height:300px;
		span{
			padding:5px 20px 5px 5px;
			margin-right:10px;
			display:inline-block;
			font-size:14px;
			line-height:20px;
			border-radius:5px;
			position: relative;
			&:hover{
				background-color:#00dd00;
				color:#fff;
				i{
					display: block;
				}
			}
			i{
				position: absolute;
				right: 0;
				top: 5px;
				font-size: 19px;
				display: none;
				cursor: pointer;
			}
		}
	}
</style>
