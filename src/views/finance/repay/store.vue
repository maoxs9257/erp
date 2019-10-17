<template lang="html">
	<div class="listModule">
		<div class="list_header">
			<ym-hbt :to='{name:"repayHome"}' title='仓储公司应付'></ym-hbt>
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
				<div class="option" @click='isSelect = !isSelect'>
					<div class="option_yuan"><i class="iconfont shaixuan"></i></div>
					<span class="option_txt">筛选</span>
				</div>
				<div class="search_input">
					<i class="iconfont icon-sousuo"></i>
					<input type="text" name="" value="">
				</div>
			</div>
			<div class="list_setbar_selections">

			</div>
		</div>
		<div class="list_main" :class="{se:isSelect}">
			<div class="list_main_table" v-show='isTable'>
				<div class="table">
          <el-table :data="storeData" height="100%">
            <el-table-column type="index"></el-table-column>
            <el-table-column label="仓库名称" >
              <template slot-scope='scope'>
                <a href="javascript:void(0)" @click='openStore(scope.row.id)'>{{scope.row.name}}</a>
              </template>
            </el-table-column>
            <el-table-column label="仓管人员" prop='createName'></el-table-column>
            <el-table-column label='仓管地址' prop='address'></el-table-column>
            <el-table-column label='联系方式' prop='phone'></el-table-column>
          </el-table>
				</div>
				<div class="table_fot">
					<span>总数：{{storeData.length}}</span>
				</div>
			</div>
			<div class="list_main_card" v-show='!isTable'>
				<div class="card">

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
      <div style="margin-top:30px;text-align:center">
        <el-button type='primary' plain @click='newVisible=false'>取消</el-button>
        <el-button type='primary' @click='submitForm'>确定</el-button>
      </div>
    </el-dialog>
    <!-- 选择部门 -->
    <department ref='dep' @cb='setDept'></department>
    <!-- 仓库详情 -->
    <el-dialog width="750px" title="仓库详情" center :visible.sync="storeVisible" v-dialogDrag>
      <div class="main_top">
        <div class="img_box">
          <img :src="store.image|imgUrl" alt="">
          <i class="iconfont icon-shuaxin" @click='openCropper'>更新图片</i>
        </div>
        <div class="main_center">
          <div class="center_item">
            <span class="n">仓库地址：</span>
            <span class="v">{{store.address}}</span>
          </div>
          <div class="center_item">
            <span class="n">绑定部门：</span>
            <span class="v">{{store.deptMap|deptMap}}</span>
          </div>
          <div class="center_item">
            <span class="n">联系人：</span>
            <span class="v">{{store.createName}}</span>
          </div>
          <div class="center_item">
            <span class="n">联系手机：</span>
            <span class="v">{{store.phone}}</span>
          </div>
          <div class="center_item">
            <span class="n">库存数量：</span>
            <span class="v">{{store.storePriceAmountDto|getStockNum}}</span>
          </div>
          <div class="center_item">
            <span class="n">库存成本：</span>
            <span class="v">{{store.storePriceAmountDto?store.storePriceAmountDto.storeMoney:''|eMoney}}</span>
          </div>
          <div class="center_item">
            <span class="n">翻包费：</span>
            <span class="v">{{store.storeActionPayments|filterFPrice}}</span>
          </div>
          <div class="center_item">
            <span class="n">拆包费：</span>
            <span class="v">{{store.storeActionPayments|filterCPrice}}</span>
          </div>
          <div class="center_item">
            <span class="n">卸柜单价：</span>
            <span class="v">{{store.storeHandingPrices|filterHandingPrice}}</span>
          </div>
          <div class="center_item">
            <span class="n">收费时段：</span>
            <span class="v">{{store.storeSavePricelist|getDate}}</span>
          </div>
          <div class="center_item">
            <span class="n">收费标准：</span>
            <span class="v">{{store.storeSavePricelist|getPrice}}</span>
          </div>
          <div class="center_item">
            <span class="n">应付金额：</span>
            <span class="v">{{store.amountPrice|eMoney}}</span>
          </div>
          <div class="center_item">
            <span class="n">期初欠款：</span>
            <span class="v">{{store.arrearage|eMoney}}</span>
          </div>
          <div class="center_item">
            <span class="n">备注：</span>
            <span class="v">{{store.memo}}</span>
          </div>
        </div>
      </div>
      <div class="main_foot">
        <div class="main_foot_item one">
          <i class="iconfont jinxiaocun-xiaoshoukaidan"></i>
          <p>付款</p>
        </div>
        <div class="main_foot_item two" @click="openModify">
          <i class="iconfont xiugai"></i>
          <p>修改信息</p>
        </div>
        <div class="main_foot_item three">
          <i class="iconfont cangku-kucunpandian"></i>
          <p>库存盘点</p>
        </div>
      </div>
    </el-dialog>
    <!-- 图片上传 -->
    <xcropper ref='cropper'></xcropper>
    <!-- 修改仓库 -->
    <el-dialog width="650px" title="修改仓库" center :visible.sync="modifyVisible" v-dialogDrag>
      <div class="modify_main">
        <div class="modify_main_item">
          <span class="n">名称：</span>
          <el-input class='v' size='mini' v-model="modify.name"></el-input>
        </div>
        <div class="modify_main_item">
          <span class="n">绑定部门：</span>
          <div class="divv" @click='openModifyDept'>{{modify.deptMap|deptMap}}</div>
        </div>
        <div class="modify_main_item">
          <span class="n">仓库地址：</span>
          <el-input class='v' size='mini' v-model="modify.address"></el-input>
        </div>
        <div class="modify_main_item">
          <span class="n">联系手机：</span>
          <el-input class='v' size='mini' v-model="modify.phone"></el-input>
        </div>
        <div class="modify_main_item">
          <span class="n">收费阶段：</span>
          <div class="divv" @click='openSavePrice'>{{modify.storeSavePricelist|getDate}}</div>
        </div>
        <div class="modify_main_item">
          <span class="n">收费标准：</span>
          <div class="divv" @click='openSavePrice'>{{modify.storeSavePricelist|getPrice}}</div>
        </div>
        <div class="modify_main_item">
          <span class="n">卸柜单价：</span>
          <div class="divv" @click='openHand(modify.storeHandingPrices)'>{{modify.storeHandingPrices|filterHandingPrice}}</div>
        </div>
        <div class="modify_main_item">
          <span class="n">备注：</span>
          <el-input class='v' size='mini' v-model="modify.memo"></el-input>
        </div>
      </div>
      <div style="margin-top: 30px;text-align: center">
        <el-button type="primary" plain @click="modifyVisible=false">取消</el-button>
        <el-button type="primary" @click="modifyStore">确定</el-button>
      </div>
    </el-dialog>
    <!-- 选择部门 -->
    <department ref='dept' @cb='modifyDept'></department>
    <!-- 仓储费设置 -->
    <el-dialog width="700px" title="仓储费规格设置" center :visible.sync="savePriceVisible" v-dialogDrag>
      <div class="save_top">
        <span>计量单位</span>
        <el-select size='mini' v-model="unit" placeholder="请选择" @change="changeUnit">
          <el-option v-for='(val,key) in priceUnit' :key='key' :label='val|unitName' :value='val'></el-option>
        </el-select>
      </div>
      <div class="save_main">
        <ul>
          <li><span>收费时间段</span><span>室内仓库</span><span>室外仓库</span></li>
          <li v-for='(val,key) in priceData' :key='key'>
            <span>{{key}}</span>
            <span>
							<el-input-number size='mini' v-model="val.indoor.price" :min="0"></el-input-number>
						</span>
            <span>
							<el-input-number size='mini' v-model="val.outdoor.price" :min="0"></el-input-number>
						</span>
          </li>
        </ul>
      </div>
      <div class="save_add">
        <span>新增时段</span>
        <span class="start">{{startDate}}</span>
        <span>----</span>
        <el-input-number size='mini' v-model="endDate" :min="startDate+1" label="描述文字"></el-input-number>
        <el-button style='float:right' size='mini' type='primary' @click='addSavePrice'>添加</el-button>
      </div>
      <div style="margin-top: 30px;text-align: center">
        <el-button type="primary" plain @click="savePriceVisible=false">取消</el-button>
        <el-button type="primary" @click="modifySavePrice">确定</el-button>
      </div>
    </el-dialog>
    <!-- 卸柜费设置 -->
    <el-dialog width="600px" title="卸柜费设置" center :visible.sync="handingVisible">
      <div class="handing">
        卸柜价格：
        <span v-for='(val,key) in storeHandingPrices'>{{val.price}}<i class="iconfont guanbi"></i></span>
      </div>
      <div class="addHanding">
        <span>新增价格</span>
        <el-input-number size='mini' style='width:400px' v-model="handingPrice" :min="0"></el-input-number>
        <el-button size='mini' type="primary" @click='addHandingPrice'>确定</el-button>
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
        tenantId: JSON.parse(this.$store.state.token).tenantId,
        userId:JSON.parse(this.$store.state.token).id,
				isTable: true,
				isSelect: true,
        newVisible:false,
        storeData:[],
        rules:{
          name:[{required:true,message:'请输入仓库名称',trigger:'blur'},{ min:2,max:20, message:'长度在2到20个字符',trigger:'blur'}],
          deptName:[{required:true,message:'请选择部门',trigger:'change'}],
          phone:[{required:true,message:'请输入手机号',trigger:'blur'}],
          address:[{required:true,message:'请输入地址',trigger:'blur'}]
        },
        newStore:{
          name:'',
          deptName:'',
          phone:'',
          address:''
        },
        storeVisible:false,
        store:{},
        modifyVisible:false,
        modify:{},
        savePriceVisible:false,
        priceUnit:['G','number','cubic','ton'],
        unit:'number',
        priceData:[],
        startDate:0,
        endDate:0,
        handingVisible:false,
        storeHandingPrices:[],
        handingPrice:'',
			}
		},
    methods:{
      /**
      * 获取数据
      * @method getData
      */
      getData(){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {tenantId: this.tenantId};
        this.$axios.get('/api/storeTable/showStoreTableInfor',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.storeData = res.data.data;
          }else{
            this.$message.error('获取信息失败')
          }
        },()=>{loading.close();this.$message.error('获取信息失败')})
      },
      /**
      * 新建仓库
      * @method openNewStore
      */
      openNewStore(){
        this.newVisible = true;
        this.newStore = {};
      },
      /**
      * 打开选择部门窗口
      * @method openDepartment
      */
      openDepartment(){
        this.$refs.dep.open();
      },
      /**
      * 设置部门
      * @method setDept
      */
      setDept(data){
        if(data){
          this.$set(this.newStore,'deptName',data.name);
          this.$set(this.newStore,'id',data.id);
        }else{
          this.newStore.deptName = null;
          this.newStore.id = null
        }
      },
      /**
      * 检验表格
      * @method submitForm
      */
      submitForm(){
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.createStore();
          } else {
            return false;
          }
        });
      },
      /**
      * 创建仓库
      * @method createStore
      */
      createStore(){
        let loading = this.$loading({lock: true, text: '数据更新中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let data = {
          creatorId:this.userId,
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
              this.newVisible = false;
              this.getData();
            }else{
              this.$message.error('创建仓库失败');
            }
          },()=>{loading.close();this.$message.error('创建仓库失败');})
        },
      /**
      * 打开仓库详情
      * @method openStore
      */
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
            this.modify = JSON.parse(JSON.stringify(this.store));
          }else{
            this.$message.error('获取详情失败')
          }
        },()=>{loading.close();this.$message.error('获取详情失败')})
      },
      /**
      * 打开图片
      * @method openCropper
      */
      openCropper(){
        let option = {
          title:'仓库图片',
          msg:'建议图片大小：2M'
        };
        this.$refs.cropper.open(option,(val)=>{
          let data = {
            id:this.store.id,
            tenantId:this.tenantId,
            image:val
          };
          this.$axios.post('/api/storeTable/modifyStoreTableInfor',data)
          .then(res=>{
            if(res.data&&res.data.data){
              this.store.image = val
            }else{
              this.$message.error('修改图片失败')
            }
          },()=>{this.$message.error('修改图片失败')})
        });
      },
      /**
      * 打开修改
      * @method openModify
      */
      openModify(){
        this.modifyVisible = true;
        this.storeSavePricelist = JSON.parse(JSON.stringify(this.modify.storeSavePricelist))
      },
      /**
      * 打开选择部门
      * @method openModifyDept
      */
      openModifyDept(){
        this.$refs.dept.open();
      },
      /**
      * 修改仓库部门
      * @method modifyDept
      */
      modifyDept(data){
        this.modify.deptMap = {[data.id]:data.name}
      },
      /**
      * 打开仓储费设置弹窗
      * @method openSavePrice
      */
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
        this.savePrice = temp;
        this.changeUnit();
      },
      /**
      * 选择价格单位
      * @method changeUnit
      */
      changeUnit(){
        this.priceData = this.savePrice[this.unit];
        this.setStartSate(this.priceData);
      },
      /**
      * 确定起始日期
      * @method setStartSate
      */
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
      /**
      * 添加仓储费阶段
      * @method addSavePrice
      */
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
        };
        let obj1 = JSON.parse(JSON.stringify(obj));
        let obj2 = JSON.parse(JSON.stringify(obj));
        obj1.type = 'indoor';
        this.storeSavePricelist.push(obj1);
        obj2.type = 'outdoor';
        this.storeSavePricelist.push(obj2);
        this.openSavePrice();
      },
      /**
      * 修改仓储费
      * @method modifySavePrice
      */
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
      /**
      * 打开卸柜费设置窗口
      * @method openHand
      */
      openHand(data){
        this.handingVisible = true;
        this.storeHandingPrices = JSON.parse(JSON.stringify(data))
      },
      /**
      * 添加卸柜费
      * @method addHandingPrice
      */
      addHandingPrice(){
        for(let i in this.storeHandingPrices){
          if(this.storeHandingPrices[i].price == this.handingPrice){
            return this.$message.error('卸柜费已存在')
          }
        }
        let loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let data = [{
          creatorId:this.userId,
          id:0,
          price:this.handingPrice,
          warestoreId:this.modify.id,
          name:'卸柜费'
        }];
        this.$axios.post('/api/storeTable/createStoreHandingPrice',data)
          .then(res=>{
            loading.close();
            this.storeHandingPrices.push({price:this.handingPrice});
            this.modify.storeHandingPrices.push({price:this.handingPrice});
            this.store.storeHandingPrices.push({price:this.handingPrice});
          },()=>{loading.close();this.$message.error('添加卸柜费失败')})
        },
      /**
      * 修改仓库
      * @method modifyStore
      */
      modifyStore(){
        let loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let data = {
          address:this.modify.address,
          memo:this.modify.memo,
          name:this.modify.name,
          phone:this.modify.phone,
          deptMap:this.modify.deptMap,
          id:this.store.id,
          tenantId:this.tenantId,
        };
        this.$axios.post('/api/storeTable/modifyStoreTableInfor',data)
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
              this.store = JSON.parse(JSON.stringify(this.modify));
              this.modifyVisible = false;
          }else{
            this.$message.error('修改仓库失败')
          }
        },()=>{loading.close();this.$message.error('修改仓库失败')})
      }

    },
		mounted() {
			setTimeout(() => {
				this.isSelect = false;
			}, 1500);
      this.getData();
		},
    filters:{
      deptMap:function(data){
        for(let i in data){
          return data[i];
        }
        return '';
      },
      getStockNum: function(data) {
        let str = '';
        if (!data) return;
        if (data.cubicCount) str += data.cubicCount + 'P / ';
        if (data.numberCount) str += data.numberCount + 'm³ / ';
        if (data.tonCount) str += data.tonCount + 'T';
        return str
      },
      filterFPrice: function(data) {
        var str = '';
        if (data) {
          var arr = [];
          for (var i = 0, len = data.length; i < len; i++) {
            if (data[i].payName == '翻包费') arr.push(data[i].price)
          }
          arr = reArr(arr)
          for (var i = 0, length = arr.length; i < length; i++) {
            str += arr[i] + (i == length - 1 ? '' : " / ")
          }
        }
        return str;

        function reArr(arr) {
          var arr2 = arr.sort();
          var res = [arr2[0]];
          for (var i = 1; i < arr2.length; i++) {
            if (arr2[i] !== res[res.length - 1]) res.push(arr2[i]);
          }
          return res;
        }
      },
      filterCPrice: function(data) {
        var str = ''
        if (data) {
          var arr = [];
          for (var i = 0, len = data.length; i < len; i++) {
            if (data[i].payName == '拆包费') arr.push(data[i].price)
          }
          arr = reArr(arr)
          for (var i = 0, length = arr.length; i < length; i++) {
            str += arr[i] + (i == length - 1 ? '' : " / ")
          }
        }
        return str;

        function reArr(arr) {
          var arr2 = arr.sort();
          var res = [arr2[0]];
          for (var i = 1; i < arr2.length; i++) {
            if (arr2[i] !== res[res.length - 1]) res.push(arr2[i]);
          }
          return res;
        }
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
        var str = '';
        if (data) {
          let min = 0;
          let max = 0;
          for (var i in data) {
            if (i == 0) {
              min = max = data[i].price
            } else {
              if (min > data[i].price) min = data[i].price;
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
	}
</script>
<style>
  .save_main .el-input-number span{
    display: none;
  }
  .save_add .el-input-number span{
    display: none;
  }
  .addHanding .el-input-number span{
    display: none;
  }
</style>
<style lang="scss" scoped>
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
  .main_top{
    height: 400px;
    position: relative;
    .img_box{
      position: absolute;
      top: 40px;
      left: 50px;
      width:90px;
      height: 90px;
      border-radius: 50%;
      overflow: hidden;
      &:hover i{
        display: block;
      }
      img{
        width: 100%;
        height: 100%;
      }
      i{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        text-align: center;
        line-height: 90px;
        color: #ffffff;
        background-color: rgba(0,0,0,0.5);
        cursor: pointer;
        display: none;
      }
    }
    .main_center{
      margin-left: 190px;
      height: 100%;
      .center_item{
        float: left;
        width: 50%;
        height: 24px;
        padding-right: 5%;
        margin-top: 25px;
        line-height: 24px;
        span{
          display: inline-block;
        }
        span.n{
          width: 80px;
          text-align: right;
          vertical-align: middle;
        }
        span.v{
          width:calc(100% - 90px);
          line-height: 24px;
          vertical-align: middle;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
    }
  }
  .main_foot{
    height: 110px;
    text-align: center;
    .main_foot_item{
      display: inline-block;
      width: 110px;
      height: 110px;
      color: #a0a0a0;
      cursor: pointer;
      margin: 0 30px;
      border-radius: 50%;
      background-color: #f0f7ff;
      i{
        font-size: 40px;
        line-height: 70px;
      }
    }
    .main_foot_item:hover{
      color: #ffffff;
    }
    .main_foot_item.one:hover{
      background-color: #af77c5;
    }
    .main_foot_item.two:hover{
      background-color: rgb(102, 188, 237);
    }
    .main_foot_item.three:hover{
      background-color: rgb(241, 122, 97)
    }
  }
  .modify_main{
    overflow: hidden;
    .modify_main_item{
      float: left;
      width: 50%;
      margin-bottom: 15px;
      span.n{
        display: inline-block;
        width: 80px;
        text-align: right;
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
  .save_top{
    padding-bottom: 20px;
  }
  .save_main{
    height:350px;
    padding-bottom: 20px;
    li{
      border-bottom:1px solid #ddd;
      height:33px;
      line-height:30px;
      span{
        float:left;
        width:33%;
      }
      span.remove{
        display:none;
      }
    }
    li:last-child span.remove{
      display:block;
    }
  }
  .save_add{
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
          display: inline;
        }
      }
      i{
        position: absolute;
        right: 4px;
        cursor: pointer;
        display: none;
      }
    }
  }
</style>
