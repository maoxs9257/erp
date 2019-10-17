<template lang="html">
	<div class="listModule">
		<div class="list_header">
			<ym-hbt :to='{name:"repayHome"}' title='开证公司应付'></ym-hbt>
		</div>
		<div class="list_setbar">
			<div class="list_setbar_options">
				<div class="option" @click='isTable = !isTable'>
					<div class="option_yuan"><i class="iconfont" :class="isTable?'jiugongge':'liebiao'"></i></div>
				</div>
				<div class="option" @click="refresh">
					<div class="option_yuan"><i class="iconfont shuaxin"></i></div>
					<span class="option_txt">刷新</span>
				</div>
				<div class="option" @click='openNew'>
					<div class="option_yuan"><i class="iconfont xinjian"></i></div>
					<span class="option_txt">新建</span>
				</div>
				<div class="option" @click='isSelect = !isSelect'>
					<div class="option_yuan"><i class="iconfont shaixuan"></i></div>
					<span class="option_txt">筛选</span>
				</div>
				<div class="option" @click='setVisible=true'>
					<div class="option_yuan"><i class="iconfont cebian-shezhi"></i></div>
					<span class="option_txt">设置</span>
				</div>
				<div class="search_input">
					<i class="iconfont sousuo"></i>
          <input type="text" class="search_input_placeholder" v-model="option.companyName" @change="screenBar" placeholder="开证公司/联系人/手机号">
				</div>
			</div>
			<div class="list_setbar_selections">
        <div class="selection">创建时间</div>
        <div class="selection" :class="{now:option.dateState===0}" @click='option.dateState=0;optionTime=null;screen()'>今天</div>
        <div class="selection" :class="{now:option.dateState===1}" @click='option.dateState=1;optionTime=null;screen()'>7天</div>
        <div class="selection" :class="{now:option.dateState===2}" @click='option.dateState=2;optionTime=null;screen()'>30天</div>
        <div class="selection" :class="{now:optionTime}">
          <el-date-picker v-model="optionTime" @change="screenTime" type="daterange" range-separator="/" start-placeholder="选择时间"></el-date-picker>
        </div>
        <div class="selection" v-if='val.show' :class="{now:option[val.key]}" v-for='(val,key) in selections' :key='key'>
          <el-select v-model="option[val.key]" :placeholder="val.name" @change='screen' clearable>
            <el-option v-if='v&&v!==""' v-for='(v,k) in options[val.key]' :label="v" :value="v" :key='k'></el-option>
          </el-select>
        </div>
        <span class="clear" v-if='clearShow' @click="removeOption">清除</span>
			</div>
		</div>
		<div class="list_main" :class="{se:isSelect}">
			<div class="list_main_table" v-if='isTable'>
				<div class="table">
					<el-table :data='dataList' height='100%' v-loadMethod='load' modname='.el-table__body-wrapper' loadmore='loadmore'>
						<el-table-column show-overflow-tooltip label='序号' type='index'></el-table-column>
						<el-table-column show-overflow-tooltip label='开证公司' prop='companyName'>
							<template slot-scope='scope'>
								<a href="javascript:void(0)" @click='openOpen(scope.row.id)'>{{scope.row.companyName}}</a>
							</template>
						</el-table-column>
						<el-table-column v-if='tableShow.displayName' show-overflow-tooltip label='联系人' prop='displayName'></el-table-column>
						<el-table-column v-if='tableShow.phone' show-overflow-tooltip label='手机号' prop='phone'></el-table-column>
						<el-table-column v-if='tableShow.qq' show-overflow-tooltip label='QQ' prop='qq'></el-table-column>
						<el-table-column v-if='tableShow.memo' show-overflow-tooltip label='备注' prop='memo'></el-table-column>
					</el-table>
				</div>
				<div class="table_fot">
					<span>总数：{{total}}</span>
				</div>
			</div>
			<div class="list_main_card" v-if='!isTable'>
				<div class="card" v-loadMethod='load' loadmore='loadmore'>
					<ul class="card_ul">
						<li class="card_li" v-for='(val,key) in dataList' :key='key'>
							<div class="card_li_con">
								<div class="content" @click="openOpen(val.id)">
									<div class="content_left">
										<img :src="val.avatar|imgUrl">
									</div>
									<div class="content_right">
										<div class="content_right_row row1">
											<span class="v">{{val.companyName}}</span>
										</div>
										<div class="content_right_row row2">
											<span class="v">{{val.displayName}}</span>
										</div>
										<div class="content_right_row row2">
											<span class="v">{{val.phone}}</span>
										</div>
										<div class="content_right_row row2">
											<span class="v">{{val.qq}}</span>
										</div>
									</div>
								</div>
							</div>
						</li>
					</ul>
				</div>
				<div class="card_fot">
					<span>总数：{{total}}</span>
				</div>
			</div>
		</div>
		<!-- 详情 -->
    <el-dialog width="800px" title="开证公司" center :visible.sync="visible" v-dialogDrag>
      <el-tabs v-model="tabs" @tab-click="handleClick">
        <el-tab-pane label="公司信息" name="1">
          <div class="main">
            <div class="main_top">
              <div class="main_img">
                <img :src="infoData.avatar|imgUrl" alt="">
                <i class="iconfont" @click="openCropper">上传图片</i>
              </div>
              <div class="main_info">
                <div class="main_info_item">
                  <span class="n">开证公司:</span>
                  <span class="v">{{infoData.companyName}}</span>
                </div>
                <div class="main_info_item">
                  <span class="n">联系地址:</span>
                  <span class="v">{{infoData.address}}</span>
                </div>
                <div class="main_info_item">
                  <span class="n">联系人:</span>
                  <span class="v">{{infoData.displayName}}</span>
                </div>
                <div class="main_info_item">
                  <span class="n">手机号:</span>
                  <span class="v">{{infoData.phone}}</span>
                </div>
                <div class="main_info_item">
                  <span class="n">QQ:</span>
                  <span class="v">{{infoData.qq}}</span>
                </div>
                <div class="main_info_item">
                  <span class="n">Email:</span>
                  <span class="v">{{infoData.email}}</span>
                </div>
                <div class="main_info_item">
                  <span class="n">代理费:</span>
                  <span class="v">{{infoData.agentRate}}</span>
                </div>
                <div class="main_info_item">
                  <span class="n">银行费:</span>
                  <span class="v">{{infoData.bankRate}}</span>
                </div>
                <div class="main_info_item">
                  <span class="n">保险费:</span>
                  <span class="v">{{infoData.insureRate}}</span>
                </div>
                <div class="main_info_item">
                  <span class="n">应付金额:</span>
                  <span class="v">{{infoData.shouldCost}}</span>
                </div>
                <div class="main_info_item">
                  <span class="n">计息时段:</span>
                  <span class="v">{{infoData.companyDelivery}}</span>
                </div>
                <div class="main_info_item">
                  <span class="n">初期欠款:</span>
                  <span class="v">{{infoData.initialArrears}}</span>
                </div>
                <div class="main_info_item">
                  <span class="n">备注:</span>
                  <span class="v">{{infoData.memo}}</span>
                </div>
              </div>
            </div>
            <div class="main_foot">
              <div class="main_foot_item" @click="openPayMoney">
                <i class="iconfont jinxiaocun-xiaoshoukaidan"></i>
                <p>付款</p>
              </div>
              <div class="main_foot_item" @click="">
                <i class="iconfont fasongduizhangdan"></i>
                <p>发送对账单</p>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="资料修改" name="2">
          <div class="main">
            <div class="main_form">
              <el-form :model='midefyInfo' label-width="100px" :inline="true" :rules='rules' ref='form' size="mini">
                <el-form-item label='开公司' prop='companyName'>
                  <el-input size='small' v-model='midefyInfo.companyName'></el-input>
                </el-form-item>
                <el-form-item label='联系人员' prop='displayName'>
                  <el-input size='small' v-model='midefyInfo.displayName'></el-input>
                </el-form-item>
                <el-form-item label='手机号' prop='phone'>
                  <el-input size='small' v-model='midefyInfo.phone'></el-input>
                </el-form-item>
                <el-form-item label='联系地址' prop='address'>
                  <el-input size='small' v-model='midefyInfo.address'></el-input>
                </el-form-item>
                <el-form-item label='QQ'>
                  <el-input size='small' v-model='midefyInfo.qq'></el-input>
                </el-form-item>
                <el-form-item label='Email'>
                  <el-input size='small' v-model='midefyInfo.email'></el-input>
                </el-form-item>
                <el-form-item label='代理费' prop='agentRate'>
                  <el-input size='small' v-model='midefyInfo.agentRate'></el-input>
                </el-form-item>
                <el-form-item label='银行费' prop='bankRate'>
                  <el-input size='small' v-model='midefyInfo.bankRate'></el-input>
                </el-form-item>
                <el-form-item label='保险费' prop='insureRate'>
                  <el-input size='small' v-model='midefyInfo.insureRate'></el-input>
                </el-form-item>
                <el-form-item label='初期欠款' prop='initialArrears'>
                  <el-input size='small' v-model='midefyInfo.initialArrears'></el-input>
                </el-form-item>
                <el-form-item label='备注'>
                  <el-input size='small' v-model='midefyInfo.memo'></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div style="margin-top: 30px;text-align: center">
              <el-button type="primary" plain @click="visible=false">取消</el-button>
              <el-button type="primary" @click="submitForm">确定</el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="利率设置" name="3">
          <div class="main">
            <div class="main_set">
              <el-table :data="rateData" height="100%">
                <el-table-column label="阶段">
                  <template slot-scope="scope">
										<span v-if="scope.$index>0">{{scope.row.fromDate}}----{{scope.row.toDate}}</span>
										<span v-if="scope.$index==0">入库前</span>
									</template>
                </el-table-column>
                <el-table-column label="利率">
                  <template slot-scope="scope">
                    <el-input-number size="mini" v-model="scope.row.rate" :min="0" :precision="4"></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="50">
                  <template slot-scope="scope"><i v-if="rateData.length>1&&rateData.length-1===scope.$index" class="iconfont guanbi" @click="removeRate(scope.row.rid)"></i></template>
                </el-table-column>
              </el-table>
            </div>
            <div class="main_add" v-if="rateData.length>0">
              <span style="margin-right: 20px">时间段：</span>
              <el-input-number size="mini" v-model="formDate" :min="1" :disabled="true"></el-input-number>
              <span style="margin: 0 10px">-----</span>
              <el-input-number size="mini" v-model="toDate" :min="formDate+1"></el-input-number>
              <span style="margin: 0 10px 0 30px">利率：</span>
              <el-input-number size="mini" v-model="rate" :min="0" :precision="4"></el-input-number>
              <el-button style="margin-left: 20px" type="primary" size="mini" @click="addRate(true)">确定</el-button>
            </div>
						<div class="main_add" v-if="rateData.length===0">
							<span style="margin-right: 20px">时间段：</span>
							<span style="margin: 0 130px">入库前</span>
							<span style="margin: 0 10px 0 30px">利率：</span>
							<el-input-number class="input-number" size="mini" v-model="rate" :min="0" :precision="4"></el-input-number>
							<el-button style="margin-left: 20px" type="primary" size="mini" @click="addRate(false)">确定</el-button>
						</div>
            <div style="margin-top: 30px;text-align: center">
              <el-button type="primary" plain @click='visible=false'>取消</el-button>
              <el-button type="primary" @click="modifyRate">确定</el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="开证记录" name="4">
          <div class="main">
            <el-table :data="openData" height="100%">
              <el-table-column label="序号" type="index"></el-table-column>
              <el-table-column show-overflow-tooltip label="采购单号" prop="orderSn"></el-table-column>
              <el-table-column label="采购时间" prop="createTime">
                <template slot-scope="scope">{{scope.row.createTime|time('y-m-d')}}</template>
              </el-table-column>
              <el-table-column label="外部单号" prop="outterNo"></el-table-column>
              <el-table-column show-overflow-tooltip label="供应商" prop="supportCompanyName"></el-table-column>
              <el-table-column label="采购金额" prop="buyAmountPrice"></el-table-column>
              <el-table-column label="采购数量" prop="purposeAmount"></el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="开证统计" name="5">
          <div class="main">
            <div class="main_table">
              <el-table :data="tong" height="100%">
                <el-table-column label="序号" type="index"></el-table-column>
                <el-table-column label="年份" prop="yearTime"></el-table-column>
                <el-table-column label="月份" prop="monthTime"></el-table-column>
                <el-table-column label="数量" prop="num"></el-table-column>
                <el-table-column label="金额" prop="totalPrice"></el-table-column>
              </el-table>
            </div>
            <div class="main_echart"></div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
		<!-- 采购应付款 -->
		<el-dialog width="720px" class="paymoney" title='批量付款' center :visible.sync='payVisible' v-dialogDrag>
      <el-form :inline="true" label-width="100px" size="small">
        <el-form-item label="付款金额">
          <el-input v-model="totalPrice" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="付款账号">
          <el-select v-model="accKey" placeholder="请选择">
            <el-option v-for='(val,key) in account' :label="val.name" :value="key" :key='key'></el-option>
          </el-select>
        </el-form-item>
      </el-form>
			<el-table :data='payList' height='350' @selection-change="handleSelectionChange">
				<el-table-column show-overflow-tooltip type='selection'></el-table-column>
				<el-table-column show-overflow-tooltip label='采购单号' prop='orderSn'></el-table-column>
				<el-table-column show-overflow-tooltip label='外部单号' prop='outterNo'></el-table-column>
				<el-table-column show-overflow-tooltip label='待付金额' prop="amountReceivable"></el-table-column>
				<el-table-column label='本次付款金额'>
					<template slot-scope='scope'>
            <el-input-number size="mini" v-model="scope.row.payPrice" :min="0" :max="scope.row.amountReceivable" @change="sumPrice"></el-input-number>
					</template>
				</el-table-column>
			</el-table>
      <div style="margin-top:30px;text-align: center">
        <el-button type="primary" plain @click="payVisible=false">取消</el-button>
        <el-button type="primary" @click="payMoney">确定</el-button>
      </div>
		</el-dialog>
    <!-- 新建开公司 -->
    <newcompany :type='3' ref='newCompany' @cb='refresh'></newcompany>
    <!-- 设置弹窗 -->
    <el-dialog title='设置' center :visible.sync='setVisible' width='800px' v-dialogDrag>
      <div>
        <el-tabs v-model="activeName">
          <el-tab-pane label="表格字段" name="first">
            <options :data='tableOptions' @cb='updataTableOptions' @close='setVisible=false'></options>
          </el-tab-pane>
          <el-tab-pane label="筛选字段" name="second">
            <options :data='selections' @cb='updataSelections' @close='setVisible=false'></options>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
    <!-- 截图框 -->
    <xcropper ref="cropper"></xcropper>
	</div>
</template>
<script>
	import headBackTitle from '@/components/headBackTitle.vue'
  import newCompany from '../../inventory/customer/newCompany'
  import options from '@/components/options.vue'
  import xcropper from "@/components/xcropper"
	export default {
		components: {
			"ym-hbt": headBackTitle,
      "newcompany":newCompany,
      "options":options,
      "xcropper":xcropper
		},
		data() {
      let checkPhone = (rule, value, callback)=>{
        if (!(/^1[3456789]\d{9}$/.test(value))) {
          callback(new Error('请输入正确的手机号'));
        } else {
          callback();
        }
      };
      let checkNumber = (rule,value,callback)=>{
        value = value - 0;
        if(value===value&&Object.prototype.toString.call(value) === '[object Number]'){
          callback();
        }else{
          callback(new Error('请输入数字'));
        }
      };
			return {
				isTable: true,
				isSelect: true,
				userId: JSON.parse(this.$store.state.token).id,
				payVisible: false,
				midefyInfo: {},
				accKey: '',
        tenantId: JSON.parse(this.$store.state.token).tenantId,
        pageNum:1,
        option:{dateState:null},
        loadmore:false,
        dataList:[],
        total:0,
        options:{},
        setVisible:false,
        activeName:'first',
        visible:false,
        tabs:'1',
        infoData:{},
        rules:{
          companyName:[{required:true,message:'请输入名称',trigger:'blur'},{min:2,max:20,message:'长度在2 - 20 个字符之间',trigger:'blur'}],
          displayName:[{required:true,message:'请输入联系人名称',trigger:'blur'},{min:2,max:10,message:'长度在2 - 10 个字符之间',trigger:'blur'}],
          phone:[{required:true,message:'请输入电话',trigger:'blur'},{ validator: checkPhone, trigger: 'blur' }],
          address:[{required:true,message:'请输入地址',trigger:'blur'},{min:2,max:20,message:'长度在2 - 20 个字符之间',trigger:'blur'}],
          initialArrears:[{required:true,message:'请输入初期欠款',trigger:'blur'},{ validator: checkNumber, trigger: 'blur' }],
          agentRate:[{required:true,message:'请输入代理费率',trigger:'blur'},{ validator: checkNumber, trigger: 'blur' }],
          bankRate:[{required:true,message:'请输入银行费率',trigger:'blur'},{ validator: checkNumber, trigger: 'blur' }],
          insureRate:[{required:true,message:'请输入保险费率',trigger:'blur'},{ validator: checkNumber, trigger: 'blur' }],
        },
        rateData:[],
        formDate:0,
        toDate:0,
        rate:0,
        openData:[],
        tong:[],
        payPrice:0,
        account:[],
        payList:[],
        payData:[],
        totalPrice:0,
		    optionTime:'',
			}
		},
    computed:{
      clearShow:function(){
        for(let k in this.option){
          if(this.option[k]){
            return true;
          }
        }
        return false;
      },
      tableShow:function() {
        let temp = {};
        this.tableOptions.forEach((val)=>{
          temp[val.key]=val.show
        });
        return temp;
      },
			selections:function(){
				return JSON.parse(this.$store.state.setJson).selection.ROP;
			},
			tableOptions:function(){
				return JSON.parse(this.$store.state.setJson).tableOptions.ROP;
			}
    },
		methods: {
      /**
      * 获取数据
      * @method getData
      */
      getData(pageNum,pageSize,options,callback){
        let params = {
          tenantId: this.tenantId,
          contactType: 3,
          pageNum:pageNum,
          pageSize:pageSize,
        };
        params = Object.assign(params,options);
        this.$axios.get('/aps/customerCompany/showOpenEvidencePage',{params})
        .then(res=>{
          if(res.data && res.data.data){
            this.dataList = this.dataList.concat(res.data.data.dataList);
            this.total = res.data.data.total;
          }
          callback?callback(res.data.data):null
        },()=>{
          callback?callback(false):null
        })
      },
      /**
      * 获取筛选项
      * @method getOptions
      */
      getOptions(options){
        let params = {
          tenantId:this.tenantId ,
          contactType: 3,
        };
        params = Object.assign(params,options);
        this.$axios.get('/aps/customerCompany/showOpenEvidenceList',{params})
        .then(res=>{
          if(res.data&&res.data.data){
            let data = res.data.data;
            let temp = {
              email:[],
            };
            data.forEach((val)=>{
              temp.email.push(val.email)
            });
            temp.email = this.uniq(temp.email);
            this.options = temp;
          }
        })
      },
      /**
      * 无限加载
      * @method load
      */
      load(callback){
        this.getData(this.pageNum++,30,this.option,(data)=>{
          callback();
          this.loadmore = data.pages>data.pageNo
        })
      },
      /**
      * 刷新
      * @method refresh
      */
      refresh(){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        this.option = {dateState:null};
        this.dataList = [];
        this.pageNum = 1;
        this.getData(this.pageNum++,30,this.option,(data)=>{
          loading.close();
          this.loadmore = data.pages>data.pageNo;
          if(data){
            this.getOptions(this.option);
            this.$message.success('刷新完成')
          }else{
            this.$message.error('刷新失败')
          }
        })
      },
      /**
      * 搜索框
      * @method screenBar
      */
      screenBar(){
        window.clearTimeout(this.timer);
        this.timer = setTimeout(()=>{
          this.screen();
        },500)
      },
      /**
      * 筛选数据
      * @method screen
      */
      screen(){
        this.dataList = [];
        this.pageNum = 1;
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        this.getData(this.pageNum++,30,this.option,()=>{
          loading.close();
          this.getOptions(this.option);
        })
      },
      // 搜素时间
      screenTime(){
        this.option.dateState = null;
        this.$set(this.option,'dateTime',this.time(this.optionTime[0], 'Y/M/D h/m/s') + ',' + this.time(this.optionTime[1], 'Y/M/D h/m/s'));
        this.screen();
      },
      /**
      * 清楚选项
      * @method removeOption
      */
      removeOption(){
        this.option={dateState:null,dateTime:null};
        this.optionTime = null;
        this.screen();
      },
      /**
      * 更新筛选项字段
      * @method updataSelections
      */
      updataSelections(data){
        let setJson = JSON.parse(this.$store.state.setJson);
        setJson.selection.ROP = data;
        this.$store.commit('setSetJson', setJson);
        this.refresh();
        this.upSetJson(setJson);
      },
      /**
      * 表格字段更新
      * @method updataTableOptions
      */
      updataTableOptions(data){
        let setJson = JSON.parse(this.$store.state.setJson);
        setJson.tableOptions.ROP = data;
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
      /**
      * 新建开证公司
      * @click openNew
      */
      openNew(){
        this.$refs.newCompany.open()
      },
      /**
      * 打开开证公司详情
      * @method openOpen
      */
      openOpen(id){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {id:id};
        this.$axios.get('/aps/customerCompany/showPartnerContact',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.visible = true;
            this.tabs = '1';
            this.infoData = res.data.data;
            this.midefyInfo = JSON.parse(JSON.stringify(this.infoData));
          }else{
            this.$message.error('获取信息失败')
          }
        },()=>{loading.close();this.$message.error('获取信息失败')})
      },
      /**
      * 验证表格
      * @method submitForm
      */
      submitForm(){
        this.$refs.form.validate((val)=>{
          if(val){
            this.modifyOpen();
          }else{
            this.$message.error('请验证信息是否填写正确');
          }
        })
      },
      /**
      * 修改开证公司
      * @method modifyOpen
      */
      modifyOpen(){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let data = {
          companyName: this.midefyInfo.companyName,
          displayName: this.midefyInfo.displayName,
          phone: this.midefyInfo.phone,
          address: this.midefyInfo.address,
          qq: this.midefyInfo.qq,
          email: this.midefyInfo.email,
          agentRate: this.midefyInfo.agentRate,
          bankRate: this.midefyInfo.bankRate,
          insureRate: this.midefyInfo.insureRate,
          initialArrears: this.midefyInfo.initialArrears,
          shouldCost: this.midefyInfo.shouldCost,
          memo: this.midefyInfo.memo,
          id: this.midefyInfo.id,
          tenantId: this.tenantId,
          updateTime: new Date(),
        };
        this.$axios.post('/aps/customerCompany/modifyPartnerCantact',data)
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.visible = false;
            this.refresh();
          }else{
            this.$message.error('修改失败')
          }
        },()=>{loading.close();this.$message.error('修改失败')})
      },
      /**
      * @method handleClick
      */
      handleClick(){
        if(this.tabs === '3') this.getStageRate();
        if(this.tabs === '4') this.getOpen();
        if(this.tabs === '5') this.getTong();
      },
      /**
      * 获取利率
      * @method getStageRate
      */
      getStageRate(){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {contactId: this.infoData.id};
        this.$axios.get('/aps/customerCompany/showCompanyDeliveryRate',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.rateData = res.data.data;
            this.getStartDay(res.data.data);
          }else{
            this.$message.error('获取利率失败')
          }
        },()=>{loading.close();this.$message.error('获取利率失败')})
      },
      /**
      * 获取起始天数
      * @method getStartDay
      */
      getStartDay(data){
        let num = 0;
        for(let i in data){
          if(num < data[i].toDate){
            num = data[i].toDate;
          }
        }
        this.formDate = num + 1;
        this.toDate = num + 2;
      },
      /**
      * 添加利率
      * @method addRate
      */
      addRate(){
				if (!this.role.erp_open_mod) return this.$message.error('没有权限');
				if (first&&this.formDate >= this.toDate) return this.$message.error('时间段设置错误');
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let data = {};
        if(first){
        	data = {
        		companyDayRate: {
        			creatorId: this.userId,
        			fromDate: this.formDate,
        			rate: this.rate,
        			status: 1,
        			tenantId: this.tenantId,
        			toDate: this.toDate
        		},
        		companyDeliveryMode: {
        			contactId: this.infoData.id,
        			creatorId: this.userId,
        			name: '付汇后' + this.formDate + '天——' + this.toDate + '天',
        			status: 1,
        			tenantId: this.tenantId,
        		}
        	}
        }else{
        	data = {
        		companyDayRate: {
        			creatorId: this.userId,
        			fromDate: 0,
        			rate: this.rate,
        			status: 1,
        			tenantId: this.tenantId,
        			toDate: 0
        		},
        		companyDeliveryMode: {
        			contactId: this.infoData.id,
        			creatorId: this.userId,
        			name: '入库前',
        			status: 1,
        			tenantId: this.tenantId,
        		}
        	}
        };
        this.$axios.post('/aps/customerCompany/addCompanyDeliveryModeDto',data)
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.getStageRate();
            this.rate = 0;
          }else{
            this.$message.error('添加失败');
          }
        },()=>{loading.close();this.$message.error('添加失败')})
      },
      /**
      * 删除利率
      * @method removeRate
      */
      removeRate(id){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let data = {
          id: id,
          status: 0,
        };
        this.$axios.post('/aps/customerCompany/modifyCompanyDeliveryModeRate',[data])
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.getStageRate();
          }else{
            this.$message.error('删除失败')
          }
        },()=>{loading.close();this.$message.error('删除失败')})
      },
      /**
      * 确定修改利率
      * @method modifyRate
      */
      modifyRate(){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let data = [];
        for(let i in this.rateData){
          let obj = {
              id:this.rateData[i].rid,
              rate:this.rateData[i].rate,
          };
          data.push(obj);
        }
        this.$axios.post('/aps/customerCompany/modifyCompanyDeliveryModeRate',data)
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.visible = false;
          }else{
            this.$message.error('修改失败')
          }
        },()=>{loading.close();this.$message.error('修改失败')})
      },
      /**
      * 获取开证记录
      * @method getOpen
      */
      getOpen(){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {
          issuingId: this.infoData.id,
          type: 3
        };
        this.$axios.get('/apt/purposeForm/showIssuingPurpose',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.openData = res.data.data;
          }else{
            this.$message.error('获取开证记录失败')
          }
        },()=>{loading.close();this.$message.error('获取开证记录失败')})
      },
      /**
      * 获取开证统计
      * @method getTong
      */
      getTong(){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {
          issuingId: this.infoData.id,
          type: 3
        };
        this.$axios.get('/apt/purposeForm/showIssuingPurposeSummary',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.tong = res.data.data;
          }else{
            this.$message.error('获取统计失败')
          }
        },()=>{loading.close();this.$message.error('获取统计失败')})
      },
      /**
      * 打开采购应付
      * @method openPayMoney
      */
      openPayMoney(){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        this.$axios.all([this.getAccount(),this.getList()])
        .then(this.$axios.spread((acct,list)=>{
          loading.close();
          if(acct.data&&acct.data.data&&list.data&&list.data.data){
            this.payVisible = true;
            this.account = acct.data.data;
            let data = list.data.data;
            data.forEach((val)=>{
              val.payPrice = 0;
            });
            this.payList = data;
          }else{
            this.$message.error('获取信息失败');
          }
        }),()=>{loading.close();this.$message.error('获取信息失败')})
      },
      /**
      * 获取账号信息
      * @method getAccount
      */
      getAccount(){
        let params = {tenantId:this.tenantId};
        return this.$axios.get('/apa/financeTable/showPaymentAccount',{params});
      },
      /**
      * 获取采购记录单
      * @method getList
      */
      getList(){
        let params = {issuingId: this.infoData.id,};
        return this.$axios.get('/apt/purposeForm/showIssuingPay',{params});
      },
      /**
      * 选中付款单
      * @method handleSelectionChange
      */
      handleSelectionChange(val){
        this.payData = val;
        this.sumPrice();
      },
      /**
      * 计算总金额
      * @method sumPrice
      */
      sumPrice(){
        let data = this.payData;
        let num = 0;
        for(let i in data){
          num += data[i].payPrice;
        }
        this.totalPrice = num;
      },
      /**
       * 付款
       * @method payMoney
       */
      payMoney(){
        if(this.payData.length===0) return this.$message.error('没有选择采购单');
        if(!this.accKey&&this.accKey!==0) return this.$message.error('请选择账户');
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let data = [];
        for(let i in this.payData){
          let obj = {
            financeTable:{
              creatorId:this.userId,
              formPaymentAccountId:this.account[this.accKey].id,
              fromAccountName:this.account[this.accKey].name,
              fromAccountType:this.account[this.accKey].displayName,
              money:this.payData[i].payPrice,
              pushTime:new Date(),
              reffer:this.payData[i].id,
              tenantId:this.tenantId,
              toAccountName:'undefined',
              toAccountType:'undefined',
              type:10
            },
            purposeFormPayment:{
              contactId:this.payData[i].issuingId,
              contractId:this.payData[i].contractId,
              creatorId:this.userId,
              payAmount:this.payData[i].payPrice,
              payTime:new Date(),
              paymentAccountId:this.account[this.accKey].id,
              purposeFormId:this.payData[i].id,
              tenantId:this.tenantId
            },
          };
          if(this.payData[i].payPrice===this.payData[i].amountReceivable){
            obj.state = 9;
          }else{
            obj.state = 1;
          };
          data.push(obj);
        }
        this.$axios.post('/apa/financeTable/issuingPayment',data)
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.payVisible = false;
            this.$message.success('付款成功')
          }else{
            this.$message.error('付款失败')
          }
        },()=>{loading.close();this.$message.error('付款失败')})
      },
      //打开截图框
      openCropper(){
        let option = {
          title:'修改logo',
          msg:'大小不超过2M',
          autoCropWidth:200,
          autoCropHeight:200,
          fixedNumber:[1,1],
        };
        this.$refs.cropper.open(option,(val)=>{
          const loading = this.$loading({lock: true, text: '修改客户信息', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
          let data = {
            id:this.infoData.id,
            tenantId:this.tenantId,
            avatar:val
          };
          this.$axios.post('/aps/customerCompany/modifyPartnerCantact',data)
          .then(res=>{
            loading.close();
            if(res.data&&res.data.data){
              this.infoData.avatar = val;
              this.refresh();
            }else{
              this.$message.error('修改头像失败');
            }
          },()=>{loading.close();this.$message.error('修改头像失败')})
        })
      }
		},
		mounted() {
			setTimeout(() => {
				this.isSelect = false;
			}, 1500);
			this.getOptions({});
		}
	};
</script>
<style>
  .main_add .el-input-number span{
    display: none;
  }
  .main_set .el-input-number span{
    display: none;
  }
  .paymoney .el-input-number span{
    display: none;
  }
</style>
<style lang="scss" scoped>
  .main{
    height: 400px;
    .main_top{
      height: 290px;
      position: relative;
      .main_img{
        position: absolute;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        top: 20px;
        left: 50px;
        border: 1px solid #cccccc;
        overflow: hidden;
        &:hover{
          i{
            display: block;
          }
        }
        img{
          width:100%;
          height: 100%;
        }
        i{
          position: absolute;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0,0,0,0.5);
          color: #cccccc;
          text-align: center;
          line-height: 95px;
          cursor: pointer;
          display: none;
          font-weight: bold;
        }
      }
      .main_info{
        margin-left: 200px;
        height: 100%;
        .main_info_item{
          float: left;
          width: 50%;
          height: 30px;
          padding-left: 20px;
          padding-right: 20px;
          line-height: 30px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-top: 10px;
          span{
            display: inline-block;
          }
          .n{
            width: 80px;
            text-align: right;
          }
        }
      }
    }
    .main_foot{
      height: 110px;
      text-align:center;
      padding-top: 13px;
      border-top: 1px solid #e5e5e5;
      .main_foot_item{
        display: inline-block;
        width: 95px;
        height: 95px;
        border-radius: 50%;
        margin-left: 20px;
        margin-right: 20px;
        cursor:pointer;
        color: #666666;
        padding-top: 13px;
        &:hover{
          background-color: #409EFF;
          color: #ffffff;
        }
        i{
          font-size: 40px;
          line-height: 40px;
        }
      }
    }
    .main_form{
      height: 330px;
      padding:0 58px;
    }
    .main_set{
      height: 280px;
    }
    .main_add{
      height: 50px;
      line-height: 50px;
      text-align: center;
    }
    .main_table{
      height: 200px;
    }
    .main_echart{
      height: 200px;
    }
  }
	.content_left {
		float: left;
		width: 40%;
		height: 100%;
		background: #fff;
		position: relative;
		img {
			width: 50px;
			height: 50px;
			border-radius: 50%;
			position: absolute;
			left: calc(50% - 25px);
			top: calc(50% - 25px);
		}
	}
	.content_right {
		float: left;
		width: 60%;
		height: 100%;
		background: #f9f9fb;
		padding: 0 10px;
    .content_right_row {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 14px;
      color: #666666;
      line-height: 20px;
    }
    .row1{
      margin-top: 15px;
      margin-bottom: 10px;
    }
    .row2{
      margin-bottom: 5px;
    }
	}
	.listModule .card_li .card_li_con {
		padding-bottom: 60%;
	}
</style>
