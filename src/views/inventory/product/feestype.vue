<template>
	<el-dialog width="885px" v-dialogDrag title="产品类别管理" :visible.sync="showFees" center>
		<div @click="closeAdd">
			<div class="feesMain">
				<!--一级类目-->
				<div class="feesType">
					<p>品类</p>
					<div class="typeBox">
						<ul>
							<li :class="{ch:idKey1===val.id}" v-for="(val,key) in categoryList" :key="key" @click="idKey1=val.id">
								<div>
									<span>{{val.categoryName}}</span>
									<i @click.stop="remove([val.id],'idKey1',val.id,key,categoryList,getCategoryList)" class="remo iconfont shanchu"></i>
								</div>
							</li>
						</ul>
						<div class="addremove">
							<div @click.stop="getPlatformData(0,'categoryList')" class="divleft"><i class="iconfont shuaxin"></i></div>
							<!--<div @click="removeCategoryAll" class="divright"><i class="iconfont icon-shanchu"></i></div>-->
						</div>
					</div>
				</div>
				<!--二级类目-->
				<div class="feesType">
					<p>树种</p>
					<div class="typeBox">
						<ul>
							<li :class="{ch:idKey2===val.id}" v-for="(val,key) in treesList" :key="key" @click="idKey2 = val.id">
								<div>
									<span>{{val.categoryName}}</span>
									<i @click.stop="openModify($event,val.categoryName)" class="xiu iconfont xiugai"></i>
									<i @click.stop="remove([val.id],'idKey2',val.id,key,treesList,getTreesList)" class="remo iconfont shanchu"></i>
								</div>
								<label>
									<input type="text" v-model="text" @blur="modify($event,val.id,val);closeModify($event)">
								</label>
							</li>
							<li class="add">
								<label>
									<input @click.stop="" type="text" v-model="text" @blur='addCategory(idKey1,2,treesList)'>
								</label>
							</li>
						</ul>
						<div class="addremove">
							<div @click.stop="openAdd(0)" class="divleft"><i class="iconfont xinjian"></i></div>
							<div @click.stop="getPlatformChildData(idKey1,'treesList',categoryList)" class="divleft"><i class="iconfont shuaxin"></i></div>
							<div @click="removeAll(treesList,getTreesList)" class="divright"><i class="iconfont shanchu"></i></div>
						</div>
					</div>
				</div>
				<!--三级-->
				<div class="feesType">
					<p>品牌</p>
					<div class="typeBox">
						<ul>
							<li class="imgli" :class="{ch:idKey3===val.id}" v-for="(val,key) in brandList" :key="key" @click="idKey3=val.id">
								<div>
									<span>{{val.categoryName}}</span>
								<!-- 	<div class="img_div" @click="openCropper(val)">
										<img :src="val.icon|imgUrl">
									</div> -->
									<i @click="openModify($event,val.categoryName)" class="xiu iconfont xiugai"></i>
									<i @click.stop="remove([val.id],'idKey3',val.id,key,brandList,getCategoryList)" class="remo iconfont shanchu"></i>
								</div>
								<label>
									<input type="text" v-model="text" @blur="modify($event,val.id,val);closeModify($event)">
								</label>
							</li>
							<li class="add">
								<label>
									<input @click.stop="" type="text" v-model="text" @blur='addCategory(idKey2,3,brandList)'>
								</label>
							</li>
						</ul>
						<div class="addremove">
							<div @click.stop="openAdd(1)" class="divleft"><i class="iconfont xinjian"></i></div>
							<div @click="removeAll(brandList,getBrandList)" class="divright"><i class="iconfont shanchu"></i></div>
						</div>
					</div>
				</div>
				<!--四级-->
				<div class="feesType">
					<p>等级</p>
					<div class="typeBox">
						<ul>
							<li :class="{ch:idKey4===val.id}" v-for="(val,key) in lvList" :key="key" @click="idKey4=val.id">
								<div>
									<span>{{val.categoryName}}</span>
									<i @click="openModify($event,val.categoryName)" class="xiu iconfont xiugai"></i>
									<i @click.stop="remove([val.id],'idKey4',val.id,key,lvList,getCategoryList)" class="remo iconfont shanchu"></i>
								</div>
								<label>
									<input type="text" v-model="text" @blur="modify($event,val.id,val);closeModify($event)">
								</label>
							</li>
							<li class="add">
								<label>
									<input @click.stop="" type="text" v-model="text" @blur='addCategory(idKey3,4,lvList)'>
								</label>
							</li>
						</ul>
						<div class="addremove">
							<div @click.stop="openAdd(2)" class="divleft"><i class="iconfont xinjian"></i></div>
							<div @click="removeAll(lvList,getLvList)" class="divright"><i class="iconfont shanchu"></i></div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div style="margin-top:30px;text-align:center">
			<el-button type="primary" @click="showFees=false;$emit('re')">确定</el-button>
		</div>
    <!-- 截图框 -->
    <xcropper ref="cropper" ></xcropper>
	</el-dialog>
</template>

<script>
	import xcropper from '@/components/xcropper'
	export default {
		components: {
		  "xcropper":xcropper
		},
		data() {
			return {
				tenantId: JSON.parse(this.$store.state.token).tenantId,
				showFees: false,
				text: '',
				categoryList: [],
				treesList: [],
				brandList: [],
				lvList: [],
				idKey1: '',
				idKey2: '',
				idKey3: '',
				idKey4: '',
				path: 'https://uwood.oss-cn-qingdao.aliyuncs.com/shop/',
				src: '',
				role: JSON.parse(this.$store.state.role),
			};
		},
		methods: {
			//打开弹窗
			open() {
				if (!this.role.erp_product_look) {
					this.$message.error('非法访问');
				} else {
					this.showFees = true;
					this.getCategoryList()
				}
			},
			//获取类目信息
			getCategoryList() {
				this.$axios({
					method: 'get',
					url: '/api/categoryTable/showCategoryTable',
					params: {
						tenantId: this.tenantId
					}
				}).then(res => {
					if (res && res.data.data) {
						this.categoryList = res.data.data;
						this.idKey1 = this.categoryList[0].id
					} else {
						this.categoryList = [];
						this.idKey1 = '';
					}
				})
			},
			//获取树种信息列表
			getTreesList() {
				this.$axios({
					method: 'get',
					url: '/api/categoryTable/showCategoryByParentId',
					params: {
						tenantId: this.tenantId,
						parentId: this.idKey1
					}
				}).then(res => {
					if (res && res.data.data) {
						this.treesList = res.data.data;
						this.idKey2 = this.treesList[0].id
					} else {
						this.treesList = [];
						this.idKey2 = ''
					}
				})
			},
			//获取品牌信息列表
			getBrandList() {
				this.$axios({
					method: 'get',
					url: '/api/categoryTable/showCategoryByParentId',
					params: {
						tenantId: this.tenantId,
						parentId: this.idKey2
					}
				}).then(res => {
					if (res && res.data.data) {
						this.brandList = res.data.data;
						this.idKey3 = this.brandList[0].id
					} else {
						this.brandList = [];
						this.idKey3 = ''
					}
				})
			},
			//获取等级信息
			getLvList() {
				this.$axios({
					method: 'get',
					url: '/api/categoryTable/showCategoryByParentId',
					params: {
						tenantId: this.tenantId,
						parentId: this.idKey3
					}
				}).then(res => {
					if (res && res.data.data) {
						this.lvList = res.data.data;
						this.idKey4 = this.lvList[0].id
					} else {
						this.lvList = []
					}
				})
			},
			//添加类目
			addCategory(id, lv, data) {
				if (!this.text) return;
				this.$axios({
					method: 'post',
					url: '/api/categoryTable/addCategoryTable',
					data: {
						categoryName: this.text,
						display: 1,
						level: lv,
						parentId: id,
						tenantId: this.tenantId,
						seoKeywords: this.text,
					}
				}).then(res => {
					if (res && res.data.data) {
						if (data.length === 0) {
							this['idKey' + lv] = res.data.data.id
						}
						data.push(res.data.data)
					}
					this.closeAdd()
				})
			},
			//修改类目
			modify(el, id, data) {
				if (!this.text) return;
				this.$axios({
					method: "post",
					url: '/api/categoryTable/modifyCategoryTable',
					data: {
						id: id,
						categoryName: this.text,
						seoKeywords: this.text,
						seoDescription: this.text
					}
				}).then(res => {
					if (res && res.data.data) {
						data.categoryName = this.text
					}
					el.target.style.display = 'none'
				})
			},
			//删除类目
			remove(arr, idkey, id, key, data, callback) {
				if (!this.role.erp_product_del) {
					this.$message.error('没有删除权限');
					return;
				}
				this.$confirm('此操作将删除本条数据, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$axios({
						method: 'post',
						url: '/api/categoryTable/deleteCategoryTable',
						data: arr
					}).then(res => {
						if (res && res.data) {
							if (this[idkey] === id) {
								callback();
								data.splice(key, 1)
								if (data[0]) {
									this[idkey] = data[0].id;
								}
							} else {
								data.splice(key, 1);
							}
						}
					})
				})
			},
			//删除全都类目
			removeAll(data, callback) {
				if (!this.role.erp_product_del) {
					this.$message.error('没有删除权限');
					return;
				}
				this.$confirm('此操作将删除所有数据, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arr = [];
					for (let i in data) {
						arr.push(data[i].id)
					}
					this.$axios({
						method: 'post',
						url: '/api/categoryTable/deleteCategoryTable',
						data: arr
					}).then(res => {
						if (res && res.data) {
							callback()
						}
					})
				})
			},
			//获取平台一级数据
			getPlatformData(id, list) {
				this.$axios({
					method: 'get',
					url: '/api/categoryTable/selectCategoryErp'
				}).then(res => {
					if (res && res.data.data) {
						this.synchroPlatformData(res.data.data, id, list)
					}
				})
			},
			//获取平台子集数据
			getPlatformChildData(id, list, data) {
				let name = '';
				for (let i in data) {
					if (data[i].id === id) {
						name = data[i].categoryName;
						break;
					}
				}
				this.$axios({
					method: 'get',
					url: '/api/categoryTable/showCategoryByName',
					params: {
						tenantId: this.tenantId,
						categoryName: name
					}
				}).then(res => {
					if (res && res.data.data) {
						this.synchroPlatformData(res.data.data, id, list)
					}
				})
			},
			//同步平台以及数据
			synchroPlatformData(data, id, list) {
				let arr = this.proPlatformData(data, this.categoryList);
				let att = [];
				for (let i in arr) {
					let obj = {
						categoryName: arr[i].categoryName,
						parentId: id,
						seoKeywords: arr[i].categoryName,
						seoDescription: arr[i].categoryName,
						tenantId: this.tenantId
					};
					att.push(obj)
				}
				this.$axios({
					method: 'post',
					url: '/api/categoryTable/addCategoryTableList',
					data: att
				}).then(res => {
					if (res && res.data.data) {
						this[list] = this[list].concat(res.data.data)
					}
				})
			},
			//处理同步数据
			proPlatformData(data, arr) {
				for (let i in arr) {
					let str = arr[i].categoryName;
					for (let n = 0; n < data.length; n++) {
						let str1 = data[n].categoryName;
						if (str === str1) {
							data.splice(n, 1);
							n--
						}
					}
				}
				return data
			},
			//修改图片
      openCropper(value){
				let option = {
          title:'修改logo',
          msg:'大小不超过2M',
          autoCropWidth:240,
          autoCropHeight:90,
          fixedNumber:[8,3],
        };
				this.$refs.cropper.open(option,(val)=>{
          const loading = this.$loading({lock: true, text: '修改信息', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
          let data = {
            id:value.id,
			      icon:val
          };
          this.$axios.post('/api/categoryTable/modifyCategoryTable',data)
          .then(res=>{
          	loading.close();
          	if(res.data&&res.data.data){
				      value.icon = val;
            }else{
              this.$message.error('修改图片失败')
            }
          },()=>{loading.close();this.$message.error('修改图片失败')})
        })
      },
			//打开添加栏
			openAdd(i) {
				//添加权限
				if (!this.role.erp_product_new) {
					this.$message.error('没有添加权限');
				} else {
					this.closeAdd();
					let dom = document.getElementsByClassName('add')[i];
					this.text = '';
					dom.style.display = 'block';
					dom.getElementsByTagName('input')[0].focus();
				}
			},
			//关闭添加栏
			closeAdd() {
				let dom = document.getElementsByClassName('add');
				for (let i in dom) {
					if (dom[i].style) {
						dom[i].style.display = 'none'
					}
				}
			},
			//打开修改栏
			openModify(el, s) {
				//验证修改权限
				if (!this.role.erp_product_mod) {
					this.$message.error('没有修改权限');
				} else {
					let dom = el.target.parentNode.parentNode;
					dom.getElementsByTagName('input')[0].style.display = 'block';
					dom.getElementsByTagName('input')[0].focus();
					this.text = s
				}
			},
			//关闭修改栏
			closeModify(el) {
				el.target.style.display = 'none'
			},
		},
		watch: {
			idKey1: function() {
				if (this.idKey1 === '') {
					this.idKey2 = '';
					this.treesList = [];
				} else {
					this.lvList = [];
					this.brandList = [];
					this.getTreesList()
				}
			},
			idKey2: function() {
				if (this.idKey2 === '') {
					this.idKey3 = '';
					this.brandList = []
				} else {
					this.lvList = [];
					this.getBrandList()
				}
			},
			idKey3: function() {
				if (this.idKey3 === '') {
					this.idKey4 = '';
					this.lvList = []
				} else {
					//调用4
					this.getLvList()
				}
			}
		},
		filters: {
			filtSrc: (data) => {
				if (data) {
					return 'https://uwood.oss-cn-qingdao.aliyuncs.com/shop/' + data
				} else {
					return false;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.feesMain {
		width: 825px;
		margin: 0 auto;
		overflow: hidden;

		.feesType {
			float: left;
			width: 200px;
			margin: 0 3px;
			height: 481px;
			overflow: hidden;

			p {
				text-align: center;
				margin: 10px 0;
			}

			.typeBox {

				height: 440px;
				border: 1px solid #ddd;

				ul {
					height: 415px;
					padding: 2px;
					overflow: auto;

					li {
						height: 28px;
						line-height: 28px;
						margin-bottom: 1px;
						position: relative;

						span {
							width: 140px;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							display: inline-block;
              padding-left: 8px;
              padding-right: 8px;
            }

						&:hover {
							background-color: rgb(232, 240, 253);

							.xiu {
								display: inline-block;
							}

							.remo {
								display: inline-block;
							}
						}

						.xiu {
							position: absolute;
							right: 30px;
							color: #00A0E9;
							display: none;
						}

						.remo {
							position: absolute;
							right: 10px;
							color: #F27A61;
							display: none;
						}

						input {
							position: absolute;
							top: 0;
							left: 0;
							width: 100%;
							height: 100%;
							line-height: 26px;
							padding: 0;
							border-radius: 4px;
							border: 1px solid #00A0E9;
							outline: none;
							display: none;
						}

						input:focus {
							display: block;
						}
					}

					.add {
						position: relative;
						display: none;

						input {
							display: block;
							padding-right: 25px;
							box-sizing: border-box;
						}

						i {
							position: absolute;
							right: 5px;
							cursor: pointer;

							&:hover {
								color: #00A0E9;
							}
						}
					}

					.ch {
						background-color: rgb(215, 227, 249);

						&:hover {
							background-color: rgb(215, 227, 249);
						}
					}

					.imgli {
						height: 40px;
						line-height: 40px;

						.img_div {
							position: absolute;
							top: 5px;
							right: 5px;
							height: 30px;
							width: 80px;
						}

						img {
							position: absolute;
							width: 80px;
							top: 0;
							right: 0;
						}

						img[src=""],
						img:not([src]) {
							opacity: 0;
						}

						&:hover {
							.img_div {
								background: #fff;
							}
						}

						span {
							width: 115px;
						}

						.xiu {
							// right: 110px;
						}

						.remo {
							// right: 90px;
						}

						&:hover {
							span {
								width: 70px;
							}
						}
					}
				}

				.addremove {
					height: 22px;
					border-top: 1px solid #ddd;

					.divleft {
						float: left;
						height: 22px;
						width: 22px;
						border-right: 1px solid #ddd;
						line-height: 22px;
						text-align: center;
						color: #666;
						cursor: pointer;

						i {
							font-size: 14px;
						}
					}

					.divright {
						float: right;
						height: 22px;
						width: 22px;
						border-left: 1px solid #ddd;
						line-height: 22px;
						text-align: center;
						color: #666;
						cursor: pointer;
					}
				}
			}
		}
	}

	.feesFot {
		height: 35px;
		text-align: center;

		button {
			background-color: #fff;
			outline: none;
			border: 1px solid #666;
			color: #666;
			width: 88px;
			height: 28px;
			border-radius: 4px;

			&:nth-child(1) {
				color: #00A0E9;
				border: 1px solid #00A0E9;
			}
		}
	}
</style>

