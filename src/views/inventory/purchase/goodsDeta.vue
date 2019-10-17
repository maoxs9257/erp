<template lang="html">
	<div class="deta">
		<div class="deta_header">
			<ym-hbt :to='{name:back}' title='进货单详情'></ym-hbt>
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
				<div class="bar bar_left" @click="openDeleteGoods" v-if="!detaInfo.state||detaInfo.state<4">
					<i class="iconfont shanchu"></i>
					<span v-show='!short'>删除</span>
				</div>
				<div class="bar bar_right" @click='short=!short'>
					<i v-if="!short" class="el-icon-arrow-right"></i>
					<i v-if="short" class="el-icon-arrow-left"></i>
				</div>
			</div>
			<div class="clearfix"></div>
			<div class="deta_mid_round">
				<div class="option round round1" v-if='detaInfo.state == 1' @click='openShenhe'>审核</div>
				<div class="option round round2" v-if='detaInfo.state!= 1'>已审核</div>
				<div class="option"><i class="iconfont zhankai"></i></div>
				<div class="option round round1" v-if='detaInfo.needClear!=0&&(detaInfo.state==1||detaInfo.state==2)'>清关</div>
				<div class="option round round2" v-if='detaInfo.needClear!=0&&detaInfo.state>=4&&detaInfo.clearancePrice-detaInfo.clearancePayment==0'>已清关</div>
				<div class="option round round3" v-if='detaInfo.needClear!=0&&detaInfo.state>=4&&detaInfo.clearancePrice-detaInfo.clearancePayment>0&&detaInfo.clearancePayment>0'>已清关</div>
				<div class="option round round4" v-if='detaInfo.needClear!=0&&detaInfo.state>=4&&detaInfo.clearancePayment==0&&detaInfo.clearancePrice>0'>已清关</div>
				<div class="option round round1" v-if='detaInfo.needClear==0&&detaInfo.state!=4' @click="queren">确认</div>
				<div class="option round round2" v-if='detaInfo.needClear==0&&detaInfo.state>=4'>已清关</div>
				<div class="option"><i class="iconfont zhankai"></i></div>
				<div class="option round round1" v-if='detaInfo.state<6'>入库</div>
				<div class="option round round2" v-if='detaInfo.state>=6'>已入库</div>
			</div>
			<div class="deta_mid_main">
				<div class="deta_mid_infos">
					<div class="deta_infos_row">
						<div class="deta_row_item">
							<span class="n">采购单号：</span>
							<span class="v">{{detaInfo.contractId}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">提单号：</span>
							<span class="v">{{detaInfo.outterNo}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">供应商：</span>
							<span class="v">{{detaInfo.supportCompanyName}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">开证公司：</span>
							<span class="v">{{detaInfo.openCompanyName?detaInfo.openCompanyName:'无'}}</span>
						</div>
					</div>
					<div class="deta_infos_row">
						<div class="deta_row_item">
							<span class="n">采购数量：</span>
							<span class="v">{{detaInfo.purposeAmount}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">采购成本：</span>
							<span class="v">{{(detaInfo.buyAmountPrice*(1+parseFloat(detaInfo.agentRate)+parseFloat(detaInfo.taxRate))).toFixed(2)}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">保证金：</span>
							<span class="v">{{detaInfo.bond}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">采购币种：</span>
							<span class="v">{{detaInfo.moneyType}}</span>
						</div>
					</div>
					<div class="deta_infos_row">
						<div class="deta_row_item">
							<span class="n">付汇时间：</span>
							<span class="v">{{detaInfo.rateTime|time('y-m-d')}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">汇率：</span>
							<span class="v">{{detaInfo.moneyRate}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">代理费率：</span>
							<span class="v">{{detaInfo.agentRate}}</span>
						</div>
						<div class="deta_row_item">
							<span class="n">创建人：</span>
							<span class="v">{{detaInfo.creatorName}}</span>
						</div>
					</div>
					<div class="deta_infos_row">
						<div class="deta_row_item">
							<span class="n">备注：</span>
							<span class="v">{{detaInfo.memo==="null"?"":detaInfo.memo}}</span>
						</div>
					</div>
				</div>
				<div class="deta_mid_table">
					<el-table :data='detaTable' height='100%' v-loadMethod='load' modname='.el-table__body-wrapper' loadmore='loadmore'>
						<el-table-column type='index' label='序号' width='70px'></el-table-column>
						<el-table-column v-if="tableShow.packageNo" align='center' show-overflow-tooltip label='包号' prop='packageNo'></el-table-column>
						<el-table-column v-if='val!="数量"&&tableShow[val]' align='center' show-overflow-tooltip v-for='(val,key) in tabConfig'
						 :key='key' :label='val' :prop='val'></el-table-column>
						<el-table-column v-if="tableShow.price" label="单价">
							<template slot-scope="scope">{{Math.floor(scope.row.moneyPrice)}}</template>
						</el-table-column>
						<el-table-column align='center' show-overflow-tooltip label='备注'>
							<template slot-scope='scope'>
								<el-tooltip :content="scope.row.memo" placement="top">
									<i v-if='scope.row.memo' class="iconfont beizhu"></i>
								</el-tooltip>
							</template>
						</el-table-column>
						<el-table-column label="操作" width="80" v-if='detaInfo.state==1'>
							<template slot-scope="scope">
								<i class="icon_btn iconfont xiugai" @click="openModify(scope.row)"></i>
								<i class="icon_btn iconfont shanchu" @click="openDeleteGoodsList(scope.row.id)"></i>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div style="padding: 0 30px;line-height: 40px;" v-if="!detaInfo.state||detaInfo.state<4">
					<el-button size="mini" type="primary" @click="openAdd">添加</el-button>
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
		<!-- 审核弹窗 -->
		<el-dialog width="400px" title="进货单审核" center :visible.sync="shenVisible" v-dialogDrag>
			<div style="text-align:center;padding: 20px 0;">
				<el-button type="primary" @click="shenHe">审核通过</el-button>
				<el-button type="danger" @click="shenHeN">审核拒绝</el-button>
			</div>
		</el-dialog>
		<!-- 打开添加弹窗 -->
		<el-dialog width="600px" title="添加弹窗" center :visible.sync="addVisible" v-dialogDrag>
			<div style="">
				<el-form label-width="80px" :model="addGoods" ref="form" size="mini" :inline="true">
					<el-form-item label="品类">
						<el-input style="width:178px" v-model="addGoods.品类" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="产品" v-if="addGoods.品类=='木配城'||addGoods.品类=='人造板'" prop="产品" :rules="{required:true,message:'产品不能为空',trigger:'blur'}">
						<el-input style="width:178px" v-model="addGoods.产品"></el-input>
					</el-form-item>
					<el-form-item label="树种" prop="树种" :rules="{required:true,message:'树种不能为空',trigger:'blur'}">
						<el-input style="width:178px" v-model="addGoods.树种"></el-input>
					</el-form-item>
					<el-form-item label="品牌" prop="品牌" :rules="{required:true,message:'品牌不能为空',trigger:'blur'}">
						<el-input style="width:178px" v-model="addGoods.品牌"></el-input>
					</el-form-item>
					<el-form-item label="形态" prop="形态" :rules="{required:true,message:'形态不能为空',trigger:'blur'}" v-if="addGoods.品类=='名贵材'">
						<el-input style="width:178px" v-model="addGoods.形态"></el-input>
					</el-form-item>
					<el-form-item label="等级" prop="等级" :rules="{required:true,message:'等级不能为空',trigger:'blur'}">
						<el-input style="width:178px" v-model="addGoods.等级"></el-input>
					</el-form-item>
					<el-form-item label="厚度" prop="厚度" :rules="{required:true,message:'厚度不能为空',trigger:'blur'}" v-if="addGoods.品类!='原木材'">
						<el-input-number class="input-number input__inner" style="width:178px" :min="0" v-model="addGoods.厚度"></el-input-number>
					</el-form-item>
					<el-form-item label="宽度" prop="宽度" :rules="{required:true,message:'宽度不能为空',trigger:'blur'}" v-if="addGoods.品类!='原木材'&&addGoods.品类!='人造板'">
						<el-input-number class="input-number input__inner" style="width:178px" :min="0" v-model="addGoods.宽度"></el-input-number>
					</el-form-item>
					<el-form-item label="口径" prop="口径" :rules="{required:true,message:'口径不能为空',trigger:'blur'}" v-if="addGoods.品类=='原木材'">
						<el-input-number class="input-number input__inner" style="width:178px" :min="0" v-model="addGoods.口径"></el-input-number>
					</el-form-item>
					<el-form-item label="长度" prop="长度" :rules="{required:true,message:'长度不能为空',trigger:'blur'}" v-if="addGoods.品类!='人造板'">
						<el-input-number class="input-number input__inner" style="width:178px" :min="0" v-model="addGoods.长度"></el-input-number>
					</el-form-item>
					<el-form-item label="片数" prop="片数" :rules="{required:true,message:'片数不能为空',trigger:'blur'}" v-if="addGoods.品类=='实木板材'">
						<el-input-number class="input-number input__inner" style="width:178px" :min="0" v-model="addGoods.片数"></el-input-number>
					</el-form-item>
					<el-form-item label="立方数" prop="立方数" :rules="{required:true,message:'立方数不能为空',trigger:'blur'}" v-if="addGoods.品类=='实木板材'">
						<el-input-number class="input-number input__inner" style="width:178px" :min="0" v-model="addGoods.立方数"></el-input-number>
					</el-form-item>
					<el-form-item label="根数" prop="根数" :rules="{required:true,message:'根数不能为空',trigger:'blur'}" v-if="addGoods.品类=='原木材'">
						<el-input-number class="input-number input__inner" style="width:178px" :min="0" v-model="addGoods.根数"></el-input-number>
					</el-form-item>
					<el-form-item label="数量" prop="数量" :rules="{required:true,message:'数量不能为空',trigger:'blur'}" v-if="addGoods.品类!='实木板材'&&addGoods.品类!='原木材'">
						<el-input-number class="input-number input__inner" style="width:178px" :min="0" v-model="addGoods.数量"></el-input-number>
					</el-form-item>
					<el-form-item label="产地" prop="产地" :rules="{required:true,message:'产地不能为空',trigger:'blur'}" v-if="addGoods.品类=='实木板材'||addGoods.品类=='原木材'">
						<el-input style="width:178px" v-model="addGoods.产地"></el-input>
					</el-form-item>
					<el-form-item label="水份" prop="水份" :rules="{required:true,message:'水份不能为空',trigger:'blur'}" v-if="addGoods.品类=='实木板材'||addGoods.品类=='原木材'">
						<el-input style="width:178px" v-model="addGoods.水份"></el-input>
					</el-form-item>
					<el-form-item label="包号" prop="包号" :rules="{required:true,message:'包号不能为空',trigger:'blur'}">
						<el-input style="width:178px" v-model="addGoods.包号"></el-input>
					</el-form-item>
					<el-form-item label="箱号" prop="箱号" :rules="{required:true,message:'箱号不能为空',trigger:'blur'}">
						<el-input style="width:178px" v-model="addGoods.箱号"></el-input>
					</el-form-item>
					<el-form-item label="单位" prop="unti" :rules="{required:true,message:'单位不能为空',trigger:'blur'}" v-if="addGoods.品类=='木配城'">
						<el-select style="width:178px" v-model="addGoods.unti" placeholder="请选择">
							<el-option v-for='item in unitList' :key='item.name' :label="item.name" :value="item.ab"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="价格" prop="price" :rules="{required:true,message:'价格不能为空',trigger:'blur'}">
						<el-input-number class="input-number input__inner" style="width:178px" :min="0" v-model="addGoods.price"></el-input-number>
					</el-form-item>
					<el-form-item label="备注">
						<el-input style="width:178px" v-model="addGoods.memo"></el-input>
					</el-form-item>
				</el-form>
			</div>
			<div style="margin-top:30px;text-align:center">
				<el-button type="primary" plain @click="addVisible=false">取消</el-button>
				<el-button type="primary" @click="submitForm">确定</el-button>
			</div>
		</el-dialog>
		<!-- 修改 -->
		<el-dialog width="640px" title="修改详情" center :visible.sync="modifyVisible" v-dialogDrag>
			<el-form :model="modifyData" ref="modifyForm" :inline="true" size="mini" label-width="80px">
				<el-form-item v-for="(val,key) in tabConfig" :key="key" :label="val">
					<el-input style="width:180px;" disabled v-model="modifyData[val]"></el-input>
				</el-form-item>
				<el-form-item label="包号">
					<el-input style="width:180px;" disabled v-model="modifyData.packageNo"></el-input>
				</el-form-item>
				<el-form-item label="箱号">
					<el-input style="width:180px;" disabled v-model="modifyData.boxNo"></el-input>
				</el-form-item>
				<el-form-item label="单位" v-if='modifyData.品类=="木配城"'>
					<el-select v-model="unti" placeholder="请选择">
						<el-option v-for='item in unitList' :key='item.name' :label="item.name" :value="item.ab"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="价格" prop="price" :rules="[{required:true,message:'请输入价格',trigger:'blur'}]">
					<el-input-number :min="0" style="width:180px;" class="input-number input__inner" v-model="modifyData.moneyPrice"></el-input-number>
				</el-form-item>
				<el-form-item label="备注">
					<el-input v-model="modifyData.memo"></el-input>
				</el-form-item>
			</el-form>
			<div style="margin-top:30px;text-align:center;">
				<el-button type="primary" plain @click="modifyVisible=false">取消</el-button>
				<el-button type="primary" @click="submitModify">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import headBackTitle from '@/components/headBackTitle.vue'
	import options from '@/components/options.vue'
	export default {
		components: {
			"ym-hbt": headBackTitle,
			"options": options
		},
		data() {
			return {
				back: this.$route.query.backUrl,
				id: this.$route.query.id,
				short: false,
				detaTable: [],
				detaInfo: {},
				tabConfig: [],
				tenantId: JSON.parse(this.$store.state.token).tenantId,
				userId: JSON.parse(this.$store.state.token).id,
				role: JSON.parse(this.$store.state.role),
				pageNum: 1,
				loadmore: false,
				activeName: 'first',
				setVisible: false,
				shenVisible: false,
				shenBackVisible: false,
				addVisible: false,
				unitList: this.GLOBAL_.unit,
				unti: '',
				addGoods: {},
				modifyVisible:false,
				modifyData:{},
			}
		},
		computed: {
			tableShow: function() {
				let temp = {};
				this.tableOptions.forEach((val) => {
					temp[val.key] = val.show
				});
				return temp;
			},
			tableOptions: function() {
				if (this.detaTable[0]) {
					return JSON.parse(this.$store.state.setJson).tableOptions.GD[this.detaTable[0].品类];
				} else {
					return [];
				}
			}
		},
		methods: {
			// 获取数据
			getData(pageNum, pageSize, callback) {
				let params = {
					purposeId: this.id,
					pageNum: pageNum,
					pageSize: pageSize
				};
				this.$axios.get('/apt/purposeForm/showPurposeFormDetailInfo', {
						params
					})
					.then(res => {
						if (res.data && res.data.data) {
							this.meta = res.data.data;
							for (let i in res.data.data) {
								this.getDetaInfo(i);
								this.getDetaTable(res.data.data[i].dataList);
								callback(res.data.data[i])
								break;
							}
							
						}
					})
			},
			// 无限加载
			load(callback) {
				this.getData(this.pageNum++, 30, (data) => {
					this.loadmore = data.pages>data.pageNo
					callback();
				})
			},
			//
			getDetaInfo(str) {
				let s = str.indexOf('(');
				let e = str.lastIndexOf(')');
				str = str.substring(s + 1, e);
				let arr = str.split(',');
				let obj = {}
				for (let i in arr) {
					obj[arr[i].split('=')[0].replace(/(^\s*)/g, "")] = arr[i].split('=')[1];
				}
				this.detaInfo = obj;
			},
			//
			getDetaTable(arr) {
				for (let i in arr) {
					Object.assign(arr[i], this.proData(arr[i].attributeValue))
				}
				this.detaTable = this.detaTable.concat(arr);
				this.tabConfig = this.GLOBAL_.tableConfig[arr[0].品类];
			},
			// 打开审核弹窗
			openShenhe() {
				this.shenVisible = true;
			},
			//审核通过
			shenHe() {
				if (!this.role.erp_stock_mod) return this.$message.error('没有权限');
				const loading = this.$loading({
					lock: true,
					text: '数据加载中...',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				this.$axios({
					method: 'post',
					url: '/apt/purposeForm/modifyPurposeCheck',
					data: {
						opType: 8,
						operatorId: this.userId,
						purposeOrderId: this.id,
						tenantId: this.tenantId,
					}
				}).then(res => {
					loading.close();
					if (res.data && res.data.data) {
						this.detaTable = [];
						this.pageNum = 1;
						this.load(null);
						this.shenVisible = false;
						this.$message.success('审核通过')
					} else {
						this.$message.error('审核失败')
					}
				}, () => {
					loading.close();
					this.$message.error('审核失败')
				})
			},
			// 审核拒绝
			shenHeN() {
				this.$message.success('审核拒绝');
				this.shenVisible = false;
			},
			//确认
			queren() {
				if (!this.role.erp_stock_mod) return this.$message.error('没有权限');
				this.$axios({
					method: 'post',
					url: '/apt/purposeForm/modifyPurposeFormLine',
					data: {
						id: this.id,
						updateTime: new Date(),
						state: 4,
					}
				}).then(r => {
					if (r && r.data.data) {
						this.pageNum = 1;
						this.detaTable = [];
						this.getData(this.pageNum++, 30, (data) => {
							this.loadmore = data.pages>data.pageNo
						})
					}
				})
			},
			// 更新表格字段
			updataTableOptions(data) {
				let setJson = JSON.parse(this.$store.state.setJson);
				setJson.tableOptions.GD[this.detaTable[0].品类] = data;
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
			// 进货单删除
			openDeleteGoods(){
				if (!this.role.erp_stock_del) return this.$message.error('没有权限');
				this.$confirm('此操作将永久删除, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.deleteGoods();
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});          
				});
			},
			deleteGoods() {
				const loading = this.$loading({
					lock: true,
					text: 'Loading',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				let data = {
					purposeOrderId: this.id,
					opType: 7,
					tenantId: this.tenantId,
					operatorId: this.userId,
				};
				this.$axios.post('/apt/purposeForm/deletedPurposeInfoById', data)
					.then(res => {
						loading.close();
						if (res.data && res.data.data) {
							this.$message.success('删除进货单成功');
							this.$router.push({
								name: this.back
							})
						} else {
							this.$message.error('删除进货单失败')
						}
					}, () => {
						loading.close();
						this.$message.error('删除进货单失败')
					})
			},
			// 进货单详情删除
			openDeleteGoodsList(id){
				if (!this.role.erp_stock_del) return this.$message.error('没有权限');
				if (!this.role.erp_stock_mod) return this.$message.error('没有权限');
				this.$confirm('此操作将永久删除, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.deleteGoodsList(id);
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});          
				});
			},
			deleteGoodsList(id) {
				const loading = this.$loading({
					lock: true,
					text: 'Loading',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				let data = [id];
				this.$axios.post('/apt/purposeForm/deletePurposeDetailList', data)
					.then(res => {
						loading.close();
						if (res.data && res.data.data) {
							this.$message.success('删除成功');
							this.pageNum = 1;
							this.detaTable = [];
							this.getData(this.pageNum++, 30, (data) => {
								this.loadmore = data.pages>data.pageNo
							})
						} else {
							this.$message.error('删除失败')
						}
					}, () => {
						loading.close();
						this.$message.error('删除失败')
					})
			},
			// 打开新建弹窗
			openAdd() {
				if (this.tabConfig.length > 0) {
					this.addGoods = {};
					this.addVisible = true;
					this.addGoods.品类 = this.detaTable[0].品类;
				} else {
					this.$message.error('不确定类目，无法添加')
				}
			},
			submitForm() {
				this.$refs.form.validate((valid) => {
					if (valid) {
						this.addGoodsData();
					} else {
						return false;
					}
				});
			},
			// 添加包
			addGoodsData() {
				let goodsData = { ...this.addGoods};

				let catoryId = '';
				if (goodsData.品类 == '实木板材') {
					goodsData.unti = 'm³';
					goodsData.amount = goodsData.立方数;
					catoryId = 2;
				} else if (goodsData.品类 == '原木材') {
					goodsData.unti = 'G';
					goodsData.amount = goodsData.根数;
					catoryId = 1;
				} else if (goodsData.品类 == '名贵材') {
					goodsData.unti = 'T';
					goodsData.amount = goodsData.数量;
					catoryId = 3;
				} else if (goodsData.品类 == '人造板') {
					goodsData.unti = 'P';
					goodsData.amount = goodsData.数量;
					catoryId = 5;
				} else {
					goodsData.amount = goodsData.数量;
					catoryId = 4;
				}

				let arr = [];

				let attributeValue = [];
				this.tabConfig.forEach((val) => {
					if (goodsData[val] || goodsData[val] === 0) {
						attributeValue.push(val + ':' + goodsData[val])
					}
				});

				let obj = {
					attributeValue: attributeValue,
					orderSn: this.detaInfo.outterNo,
					price: goodsData.price, // 换算前
					oldPrice: goodsData.price* this.detaInfo.moneyRate, // 换算后
					state: 1,
					tenantId: this.tenantId,
					boxNo: goodsData.箱号,
					packageNo: goodsData.包号,
					catoryId: catoryId,
					catoryName: goodsData.品类,
					brandName: goodsData.品牌,
					memo: goodsData.memo,
					unti: goodsData.unti
				};
				if (goodsData.品类 == '原木材') {
					// 需要拆包
					obj.amount = 1;
					for (let x = 0; x < goodsData.amount; x++) {
						arr.push(obj)
					}
				} else {
					// 不需要拆包
					obj.amount = goodsData.amount;
					arr.push(obj);
				}
				this.getBaoId(arr, catoryId);
			},
			// 获取包id
			getBaoId(arr, catoryId) {
				const loading = this.$loading({
					lock: true,
					text: 'Loading',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				let data = {
					categoryId: catoryId,
					creatorId: this.userId,
					packageImportDtoList: arr,
					tenantId: this.tenantId
				};
				this.$axios.post('/api/storeInForm/purposeImportExcel', data)
					.then(res => {
						loading.close();
						if (res.data && res.data.data) {
							this.newGoodsData(res.data.data);
						} else {
							this.$message.error('获取包id失败')
						}
					}, () => {
						loading.close();
						this.$message.error('获取包id失败')
					})
			},
			// 添加数据
			newGoodsData(arr) {
				const loading = this.$loading({
					lock: true,
					text: 'Loading',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				let data = [];
				arr.forEach((val) => {
					let obj = {
						boxNo: val.boxNo,
						moneyPrice: val.price, //换算前
						buyPrice: val.oldPrice, // 换算后
						creatorId: this.userId,
						memo: val.memo,
						moneyRate: this.detaInfo.moneyRate,
						moneyType: this.detaInfo.moneyType,
						packageId: val.packageId,
						taxFee: 0,
						taxed: 0,
						unit: val.unti,
						agentFee: val.oldPrice * this.detaInfo.agentRate,
						fullPrice: val.oldPrice * (parseFloat(this.detaInfo.agentRate) + 1),
						purposeFormId:this.id,
					};
					data.push(obj)
				})
				this.$axios.post('/apt/purposeForm/addPurposeDetailList', data)
					.then(res => {
						loading.close();
						if (res.data && res.data.data) {
							this.addVisible = false;
							this.pageNum = 1;
							this.detaTable = [];
							this.getData(this.pageNum++, 30, (data) => {
								this.loadmore = data.pages>data.pageNo
							})
						} else {
							this.$message.error('添加失败')
						}
					}, () => {
						loading.close();
						this.$message.error('添加失败')
					})
			},
			// 打开修改
			openModify(data){
				this.modifyVisible = true;
				this.modifyData = { ...data };
			},
			// 表单验证
			submitModify(){
				this.$refs.modifyForm.validate((valid) => {
					if (valid) {
						this.modifyGoods();
					} else {
						return false;
					}
				});
			},
			// 修改详情
			modifyGoods(){
				const loading = this.$loading({
					lock: true,
					text: '数据加载中...',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				let data = {
					id:this.modifyData.id,
					moneyPrice:this.modifyData.moneyPrice,
					buyPrice:this.modifyData.moneyPrice*this.detaInfo.moneyRate,
					fullPrice:this.modifyData.moneyPrice*this.detaInfo.moneyRate * (parseFloat(this.detaInfo.agentRate) + 1),
					agentFee:this.modifyData.moneyPrice*this.detaInfo.moneyRate * this.detaInfo.agentRate,
					memo:this.modifyData.memo
				}
				this.$axios.post('/apt/purposeForm/modifyPurposeFormDetail',data)
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data){
						this.modifyVisible = false;
						this.pageNum = 1;
						this.detaTable = [];
						this.getData(this.pageNum++, 30, (data) => {
							this.loadmore = data.pages>data.pageNo
						})
					}else{
						this.$message.error('修改失败')
					}
				},()=>{loading.close();this.$message.error('修改失败')})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.deta_mid_main {
		height: calc(100% - 140px);
	}

	.deta .deta_mid .deta_mid_table {
		height: calc(100% - 241px);
	}

	.deta_mid_bar.short {
		width: 180px;
	}
</style>
