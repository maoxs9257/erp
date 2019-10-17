<template>
	<div class="count">
		<div class="countbox">
			<div class="countitem" @click="openSale">
				<i class="iconfont jinxiaocun-xiaoshoutongji"></i>
				<p>销售统计</p>
			</div>
			<div class="countitem" @click="openStore">
				<i class="iconfont jinxiaocun-caigoutongji"></i>
				<p>库存与采购</p>
			</div>
			<div class="countitem" @click="openBudget">
				<i class="iconfont caiwu-shouzhijizhang"></i>
				<p>收支记账</p>
			</div>
			<div class="countitem" @click="openFlow">
				<i class="iconfont caiwu-xianjinliuliangbiao"></i>
				<p>现金流量表</p>
			</div>
			<div class="countitem" @click="openAchievement">
				<i class="iconfont caiwu-yingyeyejibiao"></i>
				<p>经营业绩表</p>
			</div>
			<div class="countitem" @click="openOpening">
				<i class="iconfont caiwu-kaizhengtongji"></i>
				<p>开证统计</p>
			</div>
		</div>
    <!-- 销售统计 -->
    <el-dialog width="900px" title="销售统计" center :visible.sync="saleVisible" v-dialogDrag>
      <el-tabs v-model="activeName" @tab-click="saleClick">
        <el-tab-pane label="销售日报" name="1">
          <div class="main">
            <div class="main_left table_style">
              <el-table :data="saleDayList" border height="100%">
                <el-table-column label="日期">
                  <template slot-scope="scope">{{scope.row.summaryTime|time('y-m-d')}}</template>
                </el-table-column>
                <el-table-column label="销售金额">
                  <template slot-scope="scope">{{scope.row.sellQuota|eMoney}}</template>
                </el-table-column>
                <el-table-column label="销售毛利">
                  <template slot-scope="scope">{{scope.row.sellUnitPrice|eMoney}}</template>
                </el-table-column>
                <el-table-column label="销售数量">
                  <template slot-scope="scope">{{scope.row.sellOrderNum}}</template>
                </el-table-column>
                <el-table-column label="更多">
                  <template slot-scope="scope">
                    <a href="javascript:void(0)" @click="getDayInfo(scope.row.summaryTime)">详细</a>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="main_right">
              <div class="main_right_item">
                <i class="iconfont dayin"></i>
                <p>打印</p>
              </div>
              <div class="main_right_item">
                <i class="iconfont daochu"></i>
                <p>导出</p>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="销售月报" name="2">
          <div class="main">
            <div class="main_left table_style">
              <el-table :data="saleMouthList" border height="100%">
                <el-table-column label="月份">
                  <template slot-scope="scope">{{scope.row.month}}</template>
                </el-table-column>
                <el-table-column label="销售金额">
                  <template slot-scope="scope">{{scope.row.sellQuota | eMoney}}</template>
                </el-table-column>
                <el-table-column label="销售毛利">
                  <template slot-scope="scope">{{scope.row.sellUnitPrice | eMoney}}</template>
                </el-table-column>
                <el-table-column label="销售数量">
                  <template slot-scope="scope">{{scope.row.sellOrderNum}}</template>
                </el-table-column>
                <el-table-column label="更多">
                  <template slot-scope="scope">
                    <a href="javascript:void(0)" @click="getMonthInfo(scope.row.year,scope.row.month)">详细</a>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="main_right">
              <div class="main_right_item">
                <i class="iconfont dayin"></i>
                <p>打印</p>
              </div>
              <div class="main_right_item">
                <i class="iconfont daochu"></i>
                <p>导出</p>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="客户销售" name="3">
          <div class="main">
            <div class="main_left table_style">
              <el-table :data="saleCustomer" border height='100%'>
                <el-table-column label="客户名称" show-overflow-tooltip>
                  <template slot-scope="scope">{{scope.row.companyName}}</template>
                </el-table-column>
                <el-table-column label="订单数量">
                  <template slot-scope="scope">{{scope.row.sellOrderNum}}</template>
                </el-table-column>
                <el-table-column label="销售金额">
                  <template slot-scope="scope">{{scope.row.sellQuota|eMoney}}</template>
                </el-table-column>
                <el-table-column label="销售毛利">
                  <template slot-scope="scope">{{scope.row.sellUnitPrice|eMoney}}</template>
                </el-table-column>
                <el-table-column label="更多">
                  <template slot-scope="scope"><a href="javascript:void(0)" @click="getCustomerSaleInfo(scope.row.id)">更多</a></template>
                </el-table-column>
              </el-table>
            </div>
            <div class="main_right">
              <div class="main_right_item">
                <i class="iconfont dayin"></i>
                <p>打印</p>
              </div>
              <div class="main_right_item">
                <i class="iconfont daochu"></i>
                <p>导出</p>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="客户收款" name="4">
          <div class="main">
            <div class="main_left table_style">
              <el-table :data="customerPay" border height="100%">
                <el-table-column prop="data" show-overflow-tooltip label="客户名称">
                  <template slot-scope="scope">{{scope.row.companyName}}</template>
                </el-table-column>
                <el-table-column label="回款金额">
                  <template slot-scope="scope">{{scope.row.receivableAmount|eMoney}}</template>
                </el-table-column>
                <el-table-column label="回款笔数" prop="orderSum"></el-table-column>
                <el-table-column label="更多">
                  <template slot-scope="scope"><a href="javascript:void(0)" @click="getPayInfo(scope.row.contactId)">更多</a></template>
                </el-table-column>
              </el-table>
            </div>
            <div class="main_right">
              <div class="main_right_item">
                <i class="iconfont dayin"></i>
                <p>打印</p>
              </div>
              <div class="main_right_item">
                <i class="iconfont daochu"></i>
                <p>导出</p>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!-- 日报详情 -->
    <el-dialog width="900px" title="日报详情" center :visible.sync="dayVisible" v-dialogDrag>
      <div class="table_style">
        <el-table :data="dayList" border height='400px'>
          <el-table-column show-overflow-tooltip prop="date" label="销售单号">
            <template slot-scope="scope">
              <a href="javascript:void(0)" @click="getSaleOrder(scope.row.orderNo)">{{scope.row.orderNo}}</a>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="销售时间">
            <template slot-scope="scope">{{scope.row.createTime|time('y-m-d')}}</template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="销售部门" prop="deptName"></el-table-column>
          <el-table-column show-overflow-tooltip label="销售员" prop="creatorName"></el-table-column>
          <el-table-column show-overflow-tooltip label="销售金额" prop="salePrice"></el-table-column>
          <el-table-column show-overflow-tooltip label="成本金额" prop="costPrice"></el-table-column>
          <el-table-column show-overflow-tooltip label="订单毛利" prop="unitPrice"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!-- 月报详情 -->
    <el-dialog width="900px" title="月报详情" center :visible.sync="monthVisible" v-dialogDrag>
      <div class="table_style">
        <el-table :data="monthList" border height='400px'>
          <el-table-column show-overflow-tooltip prop="date" label="销售单号">
            <template slot-scope="scope">
              <a href="javascript:void(0)" @click="getSaleOrder(scope.row.orderNo)">{{scope.row.orderNo}}</a>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="销售时间">
            <template slot-scope="scope">{{scope.row.createTime | time('y-m-d')}}</template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="销售部门" prop="deptName"></el-table-column>
          <el-table-column show-overflow-tooltip label="销售员" prop="creatorName"></el-table-column>
          <el-table-column show-overflow-tooltip label="销售金额">
            <template slot-scope="scope">{{scope.row.salePrice|eMoney}}</template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="成本金额">
            <template slot-scope="scope">{{scope.row.costPrice|eMoney}}</template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="订单毛利">
            <template slot-scope="scope">{{scope.row.unitPrice|eMoney}}</template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!-- 客户销售详情 -->
    <el-dialog width="900px" title="客户销售详情" center :visible.sync="customerVisible" v-dialogDrag>
      <div class="table_style">
        <el-table :data="customerList" border height="400px">
          <el-table-column prop="date" label="销售单号">
            <template slot-scope="scope">
              <a href="javascript:void(0)" @click="getSaleOrder(scope.row.orderNo)">{{scope.row.orderNo}}</a>
            </template>
          </el-table-column>
          <el-table-column label="销售时间">
            <template slot-scope="scope">{{scope.row.createTime|time('y-m-d')}}</template>
          </el-table-column>
          <el-table-column label="销售员" prop="userName"></el-table-column>
          <el-table-column label="销售数量" prop="orderPackages"></el-table-column>
          <el-table-column label="销售金额">
            <template slot-scope="scope">{{scope.row.salePrice|eMoney}}</template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!-- 收款详情 -->
    <el-dialog width="900px" title="收款详情" center :visible.sync="payVisible" v-dialogDrag>
      <div class="table_style">
        <el-table :data="payList" border height='400px'>
          <el-table-column prop="date" label="销售单号">
            <template slot-scope="scope">
              <a href="javascript:void(0)" @click="getSaleOrder(scope.row.orderNo)">{{scope.row.orderNo}}</a>
            </template>
          </el-table-column>
          <el-table-column label="销售时间">
            <template slot-scope="scope">{{scope.row.createTime|time('y-m-d')}}</template>
          </el-table-column>
          <el-table-column label="销售员" prop="userName"></el-table-column>
          <el-table-column label="销售数量" prop="orderPackages"></el-table-column>
          <el-table-column label="待收金额">
            <template slot-scope="scope">{{scope.row.receivableAmount|eMoney}}</template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!-- 销售单详情 -->
    <el-dialog width="900px" title="销售单详情" center :visible.sync="saleOrderVisible" v-dialogDrag>
      <div class="order_info">
        <div class="order_info_item">
          <span>销售单号：</span>
          <span>{{orderInfo.orderNo}}</span>
        </div>
        <div class="order_info_item">
          <span>车号：</span>
          <span>{{orderInfo.carNo}}</span>
        </div>
        <div class="order_info_item">
          <span>销售员：</span>
          <span>{{orderInfo.creatorName}}</span>
        </div>
        <div class="order_info_item">
          <span>销售时间：</span>
          <span>{{orderInfo.sellTime|time('y-m-d')}}</span>
        </div>
      </div>
      <div class="order_info">
        <div class="order_info_item">
          <span>客户名称：</span>
          <span>{{orderInfo.fullName}}</span>
        </div>
        <div class="order_info_item">
          <span>联系电话：</span>
          <span>{{orderInfo.phone}}</span>
        </div>
        <div class="order_info_item">
          <span>收货人：</span>
          <span>{{orderInfo.displayName}}</span>
        </div>
        <div class="order_info_item">
          <span>发货信息：</span>
          <span>{{orderInfo.address}}</span>
        </div>
      </div>
      <div class="order_info">
        <div class="order_info_item">
          <span>销售金额：</span>
          <span>{{orderInfo.orderAmount}}</span>
        </div>
        <div class="order_info_item">
          <span>已收金额：</span>
          <span>{{orderInfo.prepayAmount}}</span>
        </div>
        <div class="order_info_item">
          <span>待收金额：</span>
          <span>{{orderInfo.receivableAmount}}</span>
        </div>
      </div>
      <div class="order_table">
        <el-table :data="orderTable" height='300px'>
          <el-table-column type="index" label="序号" width="50" show-overflow-tooltip></el-table-column>
          <el-table-column :label="item" :prop="item" show-overflow-tooltip v-for="(item, key) in tableConfig" :key="key">
          </el-table-column>
          <el-table-column label="单价" width="90" show-overflow-tooltip prop="price">
          </el-table-column>
          <el-table-column label="数量" width="90" show-overflow-tooltip prop="goodsNum">
          </el-table-column>
          <el-table-column label="数量" width="90" show-overflow-tooltip prop="totalAmount">
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!-- 采购统计 -->
    <el-dialog width="900px" title="库存采购" center :visible.sync="storeVisible" v-dialogDrag>
      <el-tabs v-model="activeStore" @tab-click="storeClick">
        <el-tab-pane label="采购月报" name="1">
          <div class="main">
            <div class="main_left table_style">
              <el-table :data="monthReportList" border height="100%">
                <el-table-column prop="monthNum" label="月份"></el-table-column>
                <el-table-column prop="buyAmountPrice" label="采购金额"></el-table-column>
                <el-table-column prop="buyPackageNum" label="采购数量"></el-table-column>
              </el-table>
            </div>
            <div class="main_right">
              <div class="main_right_item">
                <i class="iconfont dayin"></i>
                <p>打印</p>
              </div>
              <div class="main_right_item">
                <i class="iconfont daochu"></i>
                <p>导出</p>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="产品采购" name="2">
          <div class="main">
            <div class="main_left table_style">
              <el-table :data="purchaseList" border height="100%">
                <el-table-column prop="categoryName" label="品类"></el-table-column>
                <el-table-column prop="typeName" label="品名"></el-table-column>
                <el-table-column prop="buyPackageNum" label="采购数量"></el-table-column>
                <el-table-column prop="buyAmountPrice" label="采购金额"></el-table-column>
              </el-table>
            </div>
            <div class="main_right">
              <div class="main_right_item">
                <i class="iconfont dayin"></i>
                <p>打印</p>
              </div>
              <div class="main_right_item">
                <i class="iconfont daochu"></i>
                <p>导出</p>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="供应商报表" name="3">
          <div class="main">
            <div class="main_left table_style">
              <el-table :data="supplierList" border height="100%">
                <el-table-column prop="data" label="供应商名称" show-overflow-tooltip>
                  <template slot-scope="scope">{{scope.row.companyName}}</template>
                </el-table-column>
                <el-table-column prop="num" label="联系人" show-overflow-tooltip>
                  <template slot-scope="scope">{{scope.row.companyName}}</template>
                </el-table-column>
                <el-table-column prop="xiao" label="采购数量">
                  <template slot-scope="scope">{{scope.row.buyPackageNum}}</template>
                </el-table-column>
                <el-table-column prop="mao" label="采购数量">
                  <template slot-scope="scope">{{scope.row.buyAmountPrice}}</template>
                </el-table-column>
              </el-table>
            </div>
            <div class="main_right">
              <div class="main_right_item">
                <i class="iconfont dayin"></i>
                <p>打印</p>
              </div>
              <div class="main_right_item">
                <i class="iconfont daochu"></i>
                <p>导出</p>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!-- 收支记账 -->
    <el-dialog width="900px" title="收支记账" center :visible.sync="budgetVisible" v-dialogDrag>
      <el-tabs v-model="activeBudget" @tab-click="budgetClick">
        <el-tab-pane label="记账支出" name="1">
          <div class="main">
            <div class="main_left">
              <div class="main_tab">
                <el-button type="text" :class="{active:active===1}" @click="getBudgetData(2,1);active=1">本周</el-button>
                <el-button type="text" :class="{active:active===2}" @click="getBudgetData(2,2);active=2">本月</el-button>
                <el-button type="text" :class="{active:active===3}" @click="getBudgetData(2,3);active=3">上月</el-button>
              </div>
              <div class="main_table table_style">
                <el-table border height='100%' :data="budgetData">
                  <el-table-column label='类别' prop='name'></el-table-column>
                  <el-table-column label='金额' width='400px'>
                    <template slot-scope='scope'>
                      <span style="display: inline-block;width:60px">{{scope.row.money}}</span>
                      <el-progress style="width: 310px;display: inline-block" :percentage="parseFloat(scope.row.money/budgetSum*100).toFixed(1)-0"></el-progress>
                    </template>
                  </el-table-column>
                  <el-table-column label='其他'>
                    <template slot-scope='scope'>
                      <a href="javascript:void(0)" @click='openEchart(scope.row.id,2)'>详情</a>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div class="main_right" style="margin-top:40px;height:calc(100% - 40px)">
              <div class="main_right_item">
                <i class="iconfont dayin"></i>
                <p>打印</p>
              </div>
              <div class="main_right_item">
                <i class="iconfont daochu"></i>
                <p>导出</p>
              </div>
              <div class="main_right_item">
                <i class="iconfont cebian-tongji"></i>
                <p>统计</p>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="记账收入" name="2">
          <div class="main">
            <div class="main_left">
              <div class="main_tab">
                <el-button type="text" :class="{active:active===1}" @click="getBudgetData(1,1);active=1">本周</el-button>
                <el-button type="text" :class="{active:active===2}" @click="getBudgetData(1,2);active=2">本月</el-button>
                <el-button type="text" :class="{active:active===3}" @click="getBudgetData(1,3);active=3">上月</el-button>
              </div>
              <div class="main_table table_style">
                <el-table border height='100%' :data="budgetData">
                  <el-table-column label='类别' prop='name'></el-table-column>
                  <el-table-column label='金额' width='400px'>
                    <template slot-scope='scope'>
                      <span style="display: inline-block;width:60px">{{scope.row.money}}</span>
                      <el-progress style="width: 310px;display: inline-block" :percentage="parseFloat(scope.row.money/budgetSum*100).toFixed(1)-0"></el-progress>
                    </template>
                  </el-table-column>
                  <el-table-column label='其他'>
                    <template slot-scope='scope'>
                      <a href="javascript:void(0)" @click='openEchart(scope.row.id,1)'>详情</a>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div class="main_right" style="margin-top:40px;height:calc(100% - 40px)">
              <div class="main_right_item">
                <i class="iconfont dayin"></i>
                <p>打印</p>
              </div>
              <div class="main_right_item">
                <i class="iconfont daochu"></i>
                <p>导出</p>
              </div>
              <div class="main_right_item">
                <i class="iconfont cebian-tongji"></i>
                <p>统计</p>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!-- 收支统计图 -->
    <el-dialog width="600px" title="收支统计图" center :visible.sync="censusVisible" v-dialogDrag>
      <div id="echart1"></div>
    </el-dialog>
    <!-- 现金流量表 -->
    <el-dialog width="950px" title="现金流量表" center :visible.sync="flowVisible" v-dialogDrag>
      <div class="main">
        <div class="main_left">
          <div class="main_tab"></div>
          <div class="main_table tabel table_style">
            <table>
              <tr>
                <th style="width:150px">项目名称</th>
                <th style="width:150px">本期发生额</th>
                <th>图示</th>
                <th style="width:100px">说明</th>
              </tr>
              <tr>
                <td @click='isup1=!isup1'><i :class="{up:isup1}" class="iconfont icon-zhankai1-copy"></i>现金流入</td>
                <td>{{inMoney}}</td>
                <td>
                  <div :style="{'width':inMoney/(inMoney+1)*100+'%'}"></div>
                </td>
                <td></td>
              </tr>
              <tr v-if='isup1' class="subtr" v-for='(val,key) in inData' :key='val.type'>
                <td>{{val.type|getType}}</td>
                <td>{{val.money}}</td>
                <td>
                  <div :style="{'width':val.money/inMoney*100+'%'}"></div>
                </td>
                <td></td>
              </tr>
              <tr>
                <td @click='isup2=!isup2'><i :class="{up:isup2}" class="iconfont icon-zhankai1-copy"></i>现金流出</td>
                <td>{{outMoney}}</td>
                <td>
                  <div :style="{'width':outMoney/(outMoney+1)*100+'%'}"></div>
                </td>
                <td></td>
              </tr>
              <tr v-show='isup2' class="subtr" v-for="(val,key) in outData" :key='val.type'>
                <td>{{val.type|getType}}</td>
                <td>{{val.money}}</td>
                <td>
                  <div :style="{'width':val.money/outMoney*100+'%'}"></div>
                </td>
                <td><i class="iconfont icon-tishi"></i></td>
              </tr>
              <tr>
                <td>现金流入净额</td>
                <td>{{inMoney-outMoney}}</td>
                <td></td>
                <td></td>
              </tr>
            </table>
          </div>
        </div>
        <div class="main_right">
          <div class="main_right_item">
            <i class="iconfont dayin"></i>
            <p>打印</p>
          </div>
          <div class="main_right_item">
            <i class="iconfont daochu"></i>
            <p>导出</p>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 经营业绩表 -->
    <el-dialog width="900px" title="经营业绩表" center :visible.sync="achievementVisible" v-dialogDrag>
      <el-tabs v-model="activeAchievement" @tab-click="achievementClick">
        <el-tab-pane label="个人业绩" name="1">
          <div class="main">
            <div class="main_left table_style">
              <el-table :data="personalData" border height="100%">
                <el-table-column label="销售员" prop="userName"></el-table-column>
                <el-table-column label="订单数量" prop="sellOrderNum"></el-table-column>
                <el-table-column label="销售毛利" prop="sellUnitPrice"></el-table-column>
                <el-table-column label="销售数量" prop="sellNum"></el-table-column>
                <el-table-column label="更多">
                  <template slot-scope="scope">
                    <a href="javascript:void(0)" @click="openPersonal(scope.row.creatorId)">详细</a>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="main_right">
              <div class="main_right_item">
                <i class="iconfont dayin"></i>
                <p>打印</p>
              </div>
              <div class="main_right_item">
                <i class="iconfont daochu"></i>
                <p>导出</p>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="回款业绩" name="2">
          <div class="main">
            <div class="main_left table_style">
              <el-table :data="moneyBackData" border height="100%">
                <el-table-column label="销售员" prop="userName"></el-table-column>
                <el-table-column label="回款数量" prop="orderPackages"></el-table-column>
                <el-table-column label="回款金额" prop="receivableAmount"></el-table-column>
                <el-table-column label="更多">
                  <template slot-scope="scope">
                    <a href="javascript:void(0)" @click="openMoneyBack(scope.row.creatorId)">更多</a>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="main_right">
              <div class="main_right_item">
                <i class="iconfont dayin"></i>
                <p>打印</p>
              </div>
              <div class="main_right_item">
                <i class="iconfont daochu"></i>
                <p>导出</p>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!-- 个人业绩 -->
    <el-dialog width="960px" title="个人业绩" center :visible.sync="personVisible" v-dialogDrag>
      <div class="table_style">
        <el-table :data="personTable" border height='400px'>
          <el-table-column prop="date" label="销售单号">
            <template slot-scope="scope">
              <a href="javascript:void(0)">{{scope.row.orderNo}}</a>
            </template>
          </el-table-column>
          <el-table-column label="销售时间">
            <template slot-scope="scope">{{scope.row.createTime|time('y-m-d')}}</template>
          </el-table-column>
          <el-table-column label="销售员" prop="userName"></el-table-column>
          <el-table-column label="销售数量" prop="orderPackages"></el-table-column>
          <el-table-column label="销售金额">
            <template slot-scope="scope">{{scope.row.receivableAmount|eMoney}}</template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!-- 回款业绩 -->
    <el-dialog width="960px" title="回款业绩" center :visible.sync="moneyBackVisible" v-dialogDrag>
      <div class="table_style">
        <el-table :data="moneyBackTable" border height='400px'>
          <el-table-column label="销售单号">
            <template slot-scope="scope">
              <a href="javascript:void(0)">{{scope.row.orderNo}}</a>
            </template>
          </el-table-column>
          <el-table-column label="销售时间">
            <template slot-scope="scope">{{scope.row.createTime|time('y-m-d')}}</template>
          </el-table-column>
          <el-table-column label="销售员" prop="userName"></el-table-column>
          <el-table-column label="销售数量" prop="orderPackages"></el-table-column>
          <el-table-column label="待收金额">
            <template slot-scope="scope">{{scope.row.receivableAmount|eMoney}}</template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!-- 开证统计 -->
    <el-dialog width="900px" title="开证统计" center :visible.sync="openingVisible" v-dialogDrag>
      <el-tabs v-model="activeOpen" @tab-click="openClick">
        <el-tab-pane v-for="val in openCompany" :label="val.companyName" :name="val.id+''" :key="val.id">
          <div class="main">
            <div class="main_left table_style">
              <el-table :data='openData' border height='100%'>
                <el-table-column type='index'></el-table-column>
                <el-table-column show-overflow-tooltip label='提单号' prop='orderSn'></el-table-column>
                <el-table-column show-overflow-tooltip label='采购数量' prop='purposeAmount'></el-table-column>
                <el-table-column show-overflow-tooltip label='采购金额' prop='moneyAmountPrice'></el-table-column>
                <el-table-column show-overflow-tooltip label='采购币种' prop='moneyType'></el-table-column>
                <el-table-column show-overflow-tooltip label='结算状态'>
                  <template slot-scope='scope'>{{scope.row.bondPayment==scope.row.buyAmountPrice?'已结清':'未结清'}}</template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label='更多'>
                  <template slot-scope='scope'>
                    <a href="javascript:void(0)" @click="getOpenDetail(scope.row.id)">详情</a>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="main_right">
              <div class="main_right_item">
                <i class="iconfont dayin"></i>
                <p>打印</p>
              </div>
              <div class="main_right_item">
                <i class="iconfont daochu"></i>
                <p>导出</p>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!-- 开证详情 -->
    <el-dialog width="720px" title="开证详情" center :visible.sync="openDetailVisible" v-dialogDrag>
      <div class="main">
        <div class="main_left detail">
          <table>
            <thead><tr><th>类目</th><th>详情</th></tr></thead>
            <tbody>
            <tr>
              <td>采购合同号</td>
              <td></td>
            </tr>
            <tr>
              <td>采购提单号</td>
              <td>{{openDetail.orderSn}}</td>
            </tr>
            <tr>
              <td>开证公司</td>
              <td>{{openDetail.openCompanyName}}</td>
            </tr>
            <tr>
              <td>采购数量</td>
              <td>{{openDetail.purposeAmount}}</td>
            </tr>
            <tr>
              <td>采购件数</td>
              <td>{{openDetail.buyPackageNum}}</td>
            </tr>
            <tr>
              <td>采购金额</td>
              <td>{{openDetail.moneyAmountPrice}}</td>
            </tr>
            <tr>
              <td>采购币种</td>
              <td>{{openDetail.moneyType}}</td>
            </tr>
            <tr>
              <td>付汇汇率</td>
              <td>{{openDetail.moneyRate}}</td>
            </tr>
            <tr>
              <td>采购人民币金额</td>
              <td>{{openDetail.buyAmountPrice}}</td>
            </tr>
            <tr>
              <td>采购预付保证金</td>
              <td>{{openDetail.bond}}</td>
            </tr>
            <tr>
              <td>付税日期</td>
              <td>{{openDetail.vatTime|time('y-m-d')}}</td>
            </tr>
            <tr>
              <td>增值税金额</td>
              <td><a href="javascript:void(0)" @click="openDialog5(openDetail.id)">{{openDetail.vatAmount}}</a></td>
            </tr>
            <tr>
              <td>是否垫税</td>
              <td></td>
            </tr>
            <tr>
              <td>开证代理费</td>
              <td>{{openDetail.agentRate*openDetail.buyAmountPrice}}</td>
            </tr>
            <tr>
              <td>资金占用利息</td>
              <td></td>
            </tr>
            <tr>
              <td>入库时间</td>
              <td>{{openDetail.storeInTime|time('y-m-d')}}</td>
            </tr>
            <tr>
              <td>结算周期</td>
              <td></td>
            </tr>
            <tr>
              <td>提货平均单价</td>
              <td></td>
            </tr>
            <tr>
              <td>结算总金额</td>
              <td></td>
            </tr>
            <tr>
              <td>订单状态</td>
              <td></td>
            </tr>
            <tr>
              <td>待赎货权金额</td>
              <td></td>
            </tr>
            <tr>
              <td>已售货物毛利润</td>
              <td></td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="main_right">
          <div class="main_right_item">
            <i class="iconfont dayin"></i>
            <p>打印</p>
          </div>
          <div class="main_right_item">
            <i class="iconfont daochu"></i>
            <p>导出</p>
          </div>
        </div>
      </div>
    </el-dialog>

		<!-- 利息详情 -->
		<el-dialog width="730px" title='利息详情' center :visible.sync="showDialog5" v-dialogDrag>
			<div class="dialog5_main">
				<table>
					<thead>
						<tr>
							<th>日期</th>
							<th>类型</th>
							<th>收付款金额</th>
							<th>计息金额</th>
							<th>利息</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for='(val,key) in lixi' :key='key'>
							<td>{{val.createTime | time('y-m-d')}}</td>
							<td>{{val.type==1?'付款':'代付'}}</td>
							<td>{{val.money}}</td>
							<td>{{val.ratePrice}}</td>
							<td>{{val.interest}}</td>
						</tr>
						<tr>
							<td>待赎金额</td>
							<td colspan='2'></td>
							<td>利息合计</td>
							<td>{{sumLixi}}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import echart from "echarts"
	export default {
		data() {
			return {
				showDialog5: false,
				isup1: false,
				isup2: false,
				lixi: [],
				sumLixi: 0,
        tenantId: JSON.parse(this.$store.state.token).tenantId,
        saleVisible:false,
        activeName:'1',
        saleDayList:[],
        saleMouthList:[],
        saleCustomer:[],
        customerPay:[],
        dayVisible:false,
        dayList:[],
        monthVisible:false,
        monthList:[],
        customerVisible:false,
        customerList:[],
        payVisible:false,
        payList:[],
        saleOrderVisible:false,
        orderInfo:{},
        orderTable:[],
        tableConfig:[],
        activeStore:'1',
        storeVisible:false,
        monthReportList:[],
        purchaseList:[],
        supplierList:[],
        budgetVisible:false,
        activeBudget:'1',
        budgetData:[],
        budgetSum:0,
        active:null,
        censusVisible:false,
        flowVisible:false,
        inMoney:0,
        inData:[],
        outMoney:0,
        outData:[],
        achievementVisible:false,
        activeAchievement:'1',
        personalData:[],
        moneyBackData:[],
        personVisible:false,
        personTable:[],
        moneyBackVisible:false,
        moneyBackTable:[],
        openingVisible:false,
        activeOpen:1,
        openData:[],
        openCompany:[],
        openDetailVisible:false,
        openDetail:{},
			}
		},
		methods: {
      // 打开销售统计
      openSale(){
        this.activeName = '1';
        this.saleVisible = true;
        this.getSaleDayData();
      },
      saleClick(){
        if(this.activeName==='1') return this.getSaleDayData();
        if(this.activeName==='2') return this.getSaleMouthData();
        if(this.activeName==='3') return this.getSaleCustomerData();
        if(this.activeName==='4') return this.getCustomerPayData();
      },
      // 获取销售日报数据
      getSaleDayData(){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {tenantId:this.tenantId};
        this.$axios.get('/apt/purposeForm/showSellSummary',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.saleDayList = res.data.data;
          }else{
            this.$message.error('获取数据失败')
          }
        },()=>{loading.close();this.$message.error('获取信息失败')})
      },
      // 获取销售月报数据
      getSaleMouthData(){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {tenantId:this.tenantId};
        this.$axios.get('/apt/purposeForm/showUserMonthSell',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.saleMouthList = res.data.data;
          }else{
            this.$message.error('获取数据失败')
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      // 获取客户销售数据
      getSaleCustomerData(){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {tenantId:this.tenantId};
        this.$axios.get('/apt/purposeForm/showSellContactByMonth',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.saleCustomer = res.data.data;
          }else{
            this.$message.error('获取数据失败')
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      // 获取客户收款数据
      getCustomerPayData(){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {tenantId:this.tenantId};
        this.$axios.get('/apt/purposeForm/showContactPrice',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.customerPay = res.data.data;
          }else{
            this.$message.error('获取数据失败');
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      // 获取日报详情数据
      getDayInfo(time){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {time:this.time(new Date(time),'y-m-d')};
        this.$axios.get('/apt/purposeForm/showUserSellDay',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.dayVisible = true;
            this.dayList = res.data.data;
          }else{
            this.$message.error('获取数据失败')
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      // 获取月报详情数据
      getMonthInfo(year,month){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {time:year + '-' + (month>9?month:'0'+month)};
        this.$axios.get('/apt/purposeForm/showUserSellDay',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.monthVisible = true;
            this.monthList = res.data.data;
          }else{
            this.$message.error('获取数据失败')
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      // 获取客户销售详情数据
      getCustomerSaleInfo(id){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {contactId:id};
        this.$axios.get('/apt/purposeForm/showContactSellInfo',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.customerVisible = true;
            this.customerList = res.data.data;
          }else{
            this.$message.error('获取数据失败')
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      // 获取收款详情数据
      getPayInfo(id){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {contactId:id};
        this.$axios.get('/apt/purposeForm/showByContactInfo',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.payVisible = true;
            this.payList = res.data.data;
          }else{
            this.$message.error('获取数据失败')
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      // 获取销售单数据
      getSaleOrder(orderNo){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {orderNo:orderNo};
        this.$axios.get('/aps/sell/showSellFormInfo',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.saleOrderVisible = true;
            let data = [];
            let info = {};
            for(let i in res.data.data){
              data = res.data.data[i];
              info = i;
            }
            for(let i in data){
              data[i] = Object.assign(data[i],this.strToObj(data[i].arrtibuteValue))
            }
            if(data[0])  this.tableConfig = this.GLOBAL_.tableConfig[data[0].品类];
            info=info.substring(13).replace(')','');
            let arr = info.split(',');
            let obj = {};
            for(let i in arr){
              obj[arr[i].split('=')[0].replace(/(^\s*)|(\s*$)/g, "")] = arr[i].split('=')[1];
            }
            this.orderInfo = obj;
            this.orderTable = data;
          }else{
            this.$message.error('获取数据失败')
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      strToObj(str){
        let arr = str.split(',');
        let obj = {};
        for(let i in arr){
          obj[arr[i].split(':')[0]] = arr[i].split(':')[1]
        }
        return obj;
      },
      // 打开库存仓库
      openStore(){
        this.activeStore = '1';
        this.storeVisible = true;
        this.getMonthReport();
      },
      storeClick(){
        if(this.activeStore === '1') this.getMonthReport();
        if(this.activeStore === '2') this.getPurchaseCensus();
        if(this.activeStore === '3') this.getSupplierCensus();
      },
      // 获取采购月报数据
      getMonthReport(){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {tenantId:this.tenantId};
        this.$axios.get('/apt/purposeForm/showPurposeMonth',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.monthReportList = res.data.data;
          }else{
            this.$message.error('获取数据失败');
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      // 获取采购统计数据
      getPurchaseCensus(){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {tenantId:this.tenantId};
        this.$axios.get('/apt/purposeForm/showProducrtSummary',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
              this.purchaseList = res.data.data;
          }else{
            this.$message.error('获取数据失败')
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      // 获取供应商报表
      getSupplierCensus(){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {tenantId:this.tenantId};
        this.$axios.get('/apt/purposeForm/showContactSummary',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.supplierList = res.data.data;
          }else{
            this.$message.error('获取数据失败')
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      // 打开收支记账
      openBudget(){
        this.budgetVisible = true;
        this.activeBudget = '1';
        setTimeout(()=>{
          this.getBudgetData(2,null);
          this.active = null;
        });
      },
      budgetClick(){
        if(this.activeBudget === '1') this.getBudgetData(2,null);
        if(this.activeBudget === '2') this.getBudgetData(1,null);
        this.active = null;
      },
      // 获取收支记账信息
      getBudgetData(type,stat){
        let loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {
          tenantId: this.tenantId,
          type:type,
          stat:stat
        };
        this.$axios.get('/apa/financeTable/showFinancialAccounting',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.budgetData = res.data.data;
            let sum = 0;
            for(let i in this.budgetData){
              sum += this.budgetData[i].money;
            }
            this.budgetSum = sum;
          }else{
            this.budgetData = [];
            this.budgetSum = 0;
            this.$message.error('获取数据失败');
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      // 获取账单详情信息  打开详情
      openEchart(id,type){
        let loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {
          tenantId: this.tenantId,
          id: id,
          type: type
        };
        this.$axios.get('/apa/financeTable/showFinancialAccountingDetail',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.censusVisible = true;
            setTimeout(()=>{this.buildEchart(res.data.data)});
          }else{
            this.$message.error('获取数据失败')
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      // 收支统计饼状图
      buildEchart(data){
        let arr = [];
        for(let i in data){
          arr.push({
            name:data[i].name,
            value:data[i].money
          })
        };
        let chart = echart.init(document.getElementById('echart1'));
        chart.setOption({
          series: {
            type: 'pie',
            data: arr
          }
        })
      },
      // 打开现金流量表
      openFlow(){
        let loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {
          tenantId:this.tenantId,
          type:'1,2,3,4,5,6,7,8,9,10,11,12,13,14,15'
        };
        this.$axios.get('/apa/financeTable/showFinancialGroupByType',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.flowVisible = true;
            let data = res.data.data;
            let inData = [];
            let inMoney = 0;
            let outData = [];
            let outMoney = 0;
            for(let i in data){
              switch (data[i].type) {
                case 1:
                case 3:
                case 5:
                case 7:
                case 9:
                case 11:
                  inData.push(data[i]);
                  inMoney += data[i].money;
                  break;
                case 2:
                case 4:
                case 6:
                case 8:
                case 10:
                case 12:
                case 13:
                case 14:
                case 15:
                  outData.push(data[i]);
                  outMoney += data[i].money;
                  break;
                default :break;
              }
            }
            this.inMoney = inMoney;
            this.outMoney = outMoney;
            this.inData = inData;
            this.outData = outData;
            console.log(inData);
            console.log(outData);
          }else{
            this.$message.error('获取数据失败')
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      // 打开经营业绩表
      openAchievement(){
        this.achievementVisible = true;
        this.activeAchievement = '1';
        setTimeout(()=>{this.getPersonal();});
      },
      achievementClick(){
        if(this.activeAchievement === '1') this.getPersonal();
        if(this.activeAchievement === '2') this.getMoneyBackData();
      },
      // 获取个人业绩表
      getPersonal(){
        let loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {tenantId:this.tenantId};
        this.$axios.get('/apt/purposeForm/showSellCreator',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.personalData = res.data.data;
          }else{
            this.$message.error('获取数据失败')
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      // 获取回款绩效
      getMoneyBackData(){
        let loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {tenantId:this.tenantId};
        this.$axios.get('/apt/purposeForm/showUserReceviableAmountSellSummary',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.moneyBackData = res.data.data.data;
              console.log(this.moneyBackData)
          }else{
            this.$message.error('获取数据失败')
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      // 打开个人业绩详情
      openPersonal(id){
        let loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {creator:id};
        this.$axios.get('/apt/purposeForm/showCreatorSellForm',{params})
        .then(res=>{
          loading.close();
          console.log(res);
          if(res.data&&res.data.data){
            this.personVisible = true;
            this.personTable = res.data.data.data;
          }else{
            this.$message.error('获取数据失败')
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      // 打开回款业绩详情
      openMoneyBack(id){
        let loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {creatorId:id};
        this.$axios.get('/apt/purposeForm/showUserReceviableAmountSellList',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.moneyBackVisible = true;
            this.moneyBackTable = res.data.data.data;
          }else{
            this.$message.error('获取数据失败')
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      // 打开开证统计
      openOpening(){
        let loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {
          tenantId: this.tenantId,
          contactType: 3,
        };
        this.$axios.get('/aps/customerCompany/showOpenEvidence',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.openingVisible = true;
            this.openCompany = res.data.data;
            if(this.openCompany[0]){
              this.activeOpen = this.openCompany[0].id+'';
              this.getOpening(this.openCompany[0].id);
            }
          }else{
            this.$message.error('获取信息失败');
          }
        },()=>{loading.close();this.$message.error('获取信息失败')})
      },
      openClick(){
        this.getOpening(this.activeOpen);
      },
      // 获取开证公司的开证记录
      getOpening(id){
        let loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {issuingId:id,type:3};
        this.$axios.get('/apt/purposeForm/showIssuingPurpose',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.openData = res.data.data;
          }else{
            this.$message.error('获取数据失败');
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      // 获取开证详情
      getOpenDetail(id){
        let loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {purposeId:id};
        this.$axios('/apt/purposeForm/showPurposeFormDetailInfo',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.openDetailVisible = true;
            for(let i in res.data.data){
              this.openDetail = this.setOpDeta(i);
            }
          }else{
            this.$message.error('获取数据失败')
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      setOpDeta(str) {
        let s = str.indexOf('(');
        let e = str.lastIndexOf(')');
        str = str.substring(s + 1, e);
        let arr = str.split(',');
        let obj = {};
        for (let i in arr) {
          obj[arr[i].split('=')[0].replace(/(^\s*)/g, "")] = arr[i].split('=')[1];
        }
        console.log(obj);
        return obj;
      },

			//打开利息详情
			openDialog5(id) {
				this.showDialog5 = true;
				this.$axios({
					method: 'get',
					url: '/apt/purposeForm/showPurposeInterestDetails',
					params: {
						purposeFormId: id,
					}
				}).then(res => {
					if (res.data.data) {
						this.lixi = res.data.data;
						let sumLixi = 0;
						for (let i in this.lixi) {
							sumLixi += parseFloat(this.lixi[i].interest);
						}
						this.sumLixi = sumLixi;
					}
				})
			},
		},
		filters: {
			getType: function(data) {
				switch (data) {
					case 1:
						return '记账收入';
					case 2:
						return '记账支出';
					case 3:
						return '资金接入';
					case 4:
						return '资金借出';
					case 7:
						return '借出收款';
					case 8:
						return '借入还款';
					case 9:
						return '销售收入';
					case 10:
						return '采购支出';
					case 11:
						return '其他收入';
					case 12:
						return '其他支出';
          case 13:
            return '仓储费';
          case 14:
            return '卸柜费和仓库其他费用';
          case 15:
            return '合同付保证金';
          default:
            return '未知';
				}
			}
		}

	};
</script>
<style lang="scss">
  .main_tab .el-button--text{
    color: #666666;
    &:hover{
      color:#409EFF;
    }
  }
  .main_tab .el-button--text.active{
    color:#409EFF;
  }
</style>
<style lang="scss" scoped>
  .main{
    height: 500px;
    .main_left{
      width: calc(100% - 70px);
      height: 100%;
      float: left;
      overflow: auto;
      .main_tab{
        height: 40px;
      }
      .main_table{
        height: calc(100% - 40px);
      }
    }
    .main_right{
      width: 70px;
      height: 100%;
      float: left;
      border-top: 1px solid #EBEEF5;
      border-right: 1px solid #EBEEF5;
      border-bottom: 1px solid #EBEEF5;
      padding-top: 20px;
      background-color: #FFFEE9;
      .main_right_item{
        width:50px;
        margin: 0 auto 10px;
        text-align: center;
        cursor: pointer;
        padding-bottom: 5px;
        border-radius: 4px;
        &:hover{
          background-color: #e9e9e9;
        }
        i{
          font-size: 24px;
        }
      }
    }
  }
  .order_info{
    overflow: hidden;
    border-bottom: 1px solid #cccccc;
    padding-bottom: 5px;
    padding-top: 5px;
    .order_info_item{
      float: left;
      height: 30px;
      width: 25%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 30px;
    }
  }
  #echart1{
    height: 400px;
  }
  .detail table {
    width: 100%;
    th {
      height: 40px;
      background: #8fc34b;
      border: 1px solid #ddd;
      width: 50%;
      text-align: center;
      color: #ffffff;
    }
    td {
      height: 40px;
      border: 1px solid #ddd;
      text-align: center;
    }
  }
  .tabel {
    height: 530px;
    overflow: auto;

    table {
      width: 100%;

      tr {
        height: 30px;
        line-height: 30px;
        transition: 0.5s;

        div {
          height: 8px;
          border-radius: 5px;
          background-color: rgb(243, 157, 72);
        }

        th {
          background-color: #8fc34b;
          border: 1px solid #ddd;
          color: #fff;
        }

        td {
          border: 1px solid #ddd;
          padding: 0 30px;
          position: relative;

          i {
            font-size: 14px;
            color: #666;
            position: absolute;
            top: 0;
            left: 10px;
            transition: 1s;
            transform-origin: 50% 50%;
          }

          .up {
            transform: rotate(180deg);

          }
        }
      }

      .subtr {
        text-align: center;

        i {
          position: relative;
        }
      }
    }
  }
	.count {
		text-align: center;
    .countbox {
      position: absolute;
      width: 726px;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      .countitem {
        width: 150px;
        height: 150px;
        border-radius: 4px;
        border: 2px solid #ffffff;
        margin: 44px;
        box-sizing: content-box;
        overflow: hidden;
        float: left;
        cursor: pointer;
        box-shadow: 0 8px 20px 0 rgba(0,0,0,0.08);
        background-color: #ffffff;
        &:hover {
          border:2px solid #69aeff;
        }
        i{
          font-size: 60px;
          line-height: 65px;
          float: left;
          width:100%;
          padding-top:28px;
          color: #3986EF;
        }
        p{
          line-height: 26px;
          color:#666666;
          font-size: 14px;
          float: left;
          width: 100%;
        }
      }
    }
	}
</style>
