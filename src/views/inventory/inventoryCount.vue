<template>
	<div class="count">
		<div class="countbox">
			<div class="countitem" @click="openSale">
        <i class="iconfont jinxiaocun-xiaoshoutongji"></i>
        <p>进销存</p>
			</div>
			<div class="countitem" @click="openPurchase">
				<i class="iconfont jinxiaocun-caigoutongji"></i>
				<p>采购统计</p>
			</div>
			<div class="countitem" @click="openAchievement">
				<i class="iconfont jinxiaocun-yejitongji"></i>
				<p>业绩统计</p>
			</div>
<!-- 			<div class="countitem" @click="openStock">
				<i class="iconfont cebian-kucunhuizong"></i>
				<p>库存汇总</p>
			</div> -->
		</div>
    <!-- 销售统计 -->
    <el-dialog width="900px" title="销售统计" center :visible.sync="saleVisible" v-dialogDrag>
      <el-tabs v-model="activeSale" @tab-click="saleClick">
        <el-tab-pane label="销售日报" name="1">
					<div class="main_time">
						<el-button type="text" :class="{active:saleOption.dateState===0}" @click='saleOption.dateState=0;getDaySale();'>本月</el-button>
						<el-button type="text" :class="{active:saleOption.dateState===1}" @click='saleOption.dateState=1;getDaySale();'>上月</el-button>
						<el-button type="text" @click='saleOption.dateState=null;getDaySale()' v-if="!!saleOption.dateState||saleOption.dateState===0">清除</el-button>
					</div>
          <div class="main">
            <div class="main_left table_style">
              <el-table :data="daySaleData" border height="100%">
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
                    <a href="javascript:void(0)" @click="openDaySale(scope.row.summaryTime)">详细</a>
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
              <el-table :data="monthSaleData" border height="100%">
                <el-table-column label="月份" prop="month"></el-table-column>
                <el-table-column label="销售金额">
                  <template slot-scope="scope">{{scope.row.sellQuota|eMoney}}</template>
                </el-table-column>
                <el-table-column label="销售毛利">
                  <template slot-scope="scope">{{scope.row.sellUnitPrice|eMoney}}</template>
                </el-table-column>
                <el-table-column label="销售数量" prop="sellOrderNum"></el-table-column>
                <el-table-column label="更多">
                  <template slot-scope="scope">
                    <a href="javascript:void(0)" @click="openMonthSale(scope.row.year,scope.row.month)">详细</a>
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
					<div class="main_time">
						<el-button type="text" :class="{active:saleOption1.dateState===0}" @click="saleOption1.dateState=0;getCustomerSale();">本月</el-button>
						<el-button type="text" :class="{active:saleOption1.dateState===1}" @click="saleOption1.dateState=1;getCustomerSale();">上月</el-button>
						<el-button type="text" @click="saleOption1.dateState=null;getCustomerSale();" v-if="!!saleOption1.dateState||saleOption1.dateState===0">清除</el-button>
					</div>
          <div class="main">
            <div class="main_left table_style">
              <el-table :data="customerSaleData" border height='100%'>
                <el-table-column label="客户名称" show-overflow-tooltip prop="companyName"></el-table-column>
                <el-table-column label="订单数量" prop="sellOrderNum"></el-table-column>
                <el-table-column label="销售金额">
                  <template slot-scope="scope">{{scope.row.sellQuota|eMoney}}</template>
                </el-table-column>
                <el-table-column label="销售毛利">
                  <template slot-scope="scope">{{scope.row.sellUnitPrice|eMoney}}</template>
                </el-table-column>
                <el-table-column label="更多">
                  <template slot-scope="scope"><a href="javascript:void(0)" @click="openCustomerSale(scope.row.id)">更多</a></template>
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
					<div class="main_time">
						<el-button type="text">本周</el-button>
						<el-button type="text">本月</el-button>
						<el-button type="text">上月</el-button>
					</div>
          <div class="main">
            <div class="main_left table_style">
              <el-table :data="customerBackData" border height="100%">
                <el-table-column prop="data" show-overflow-tooltip label="客户名称">
                  <template slot-scope="scope">{{scope.row.companyName}}</template>
                </el-table-column>
                <el-table-column prop="num" label="回款金额">
                  <template slot-scope="scope">{{scope.row.receivableAmount | eMoney}}</template>
                </el-table-column>
                <el-table-column prop="xiao" label="回款笔数">
                  <template slot-scope="scope">{{scope.row.orderSum}}</template>
                </el-table-column>
                <el-table-column prop="gen" label="更多">
                  <template slot-scope="scope"><a href="javascript:void(0)" @click="openPay(scope.row.contactId)">更多</a></template>
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
    <!-- 销售日报详情 -->
    <el-dialog width="960px" title="日报详情" center :visible.sync="daySaleVisible" v-dialogDrag>
      <div class="table_style">
        <el-table :data="daySaleTable" border height='400px'>
          <el-table-column show-overflow-tooltip prop="date" label="销售单号">
            <template slot-scope="scope">
              <a href="javascript:void(0)" @click="getOrder(scope.row.orderNo)">{{scope.row.orderNo}}</a>
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
    <!-- 销售月报详情 -->
    <el-dialog width="960px" title="月报详情" center :visible.sync="monthSaleVisible" v-dialogDrag>
      <div class="table_style">
        <el-table :data="monthSaleTable" border height='400px'>
          <el-table-column show-overflow-tooltip prop="date" label="销售单号">
            <template slot-scope="scope">
              <a href="javascript:void(0)" @click="getOrder(scope.row.orderNo)">{{scope.row.orderNo}}</a>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="销售时间">
            <template slot-scope="scope">{{scope.row.createTime|time('y-m-d')}}</template>
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
    <el-dialog width="960px" title="客户销售详情" center :visible.sync="customerSaleVisible" v-dialogDrag>
      <div class="table_style">
        <el-table :data="customerSaleTable" border height='400px'>
          <el-table-column prop="date" label="销售单号">
            <template slot-scope="scope">
              <a href="javascript:void(0)" @click="getOrder(scope.row.orderNo)">{{scope.row.orderNo}}</a>
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
    <el-dialog width="960px" title="收款详情" center :visible.sync="payVisible" v-dialogDrag>
      <div class="table_style">
        <el-table :data="payTable" border height='400px'>
          <el-table-column prop="date" label="销售单号">
            <template slot-scope="scope">
              <a href="javascript:void(0)" @click="getOrder(scope.row.orderNo)">{{scope.row.orderNo}}</a>
            </template>
          </el-table-column>
          <el-table-column label="销售时间">
            <template slot-scope="scope">{{scope.row.createTime|time('y-m-d')}}</template>
          </el-table-column>
          <el-table-column label="销售员">
            <template slot-scope="scope">{{scope.row.userName}}</template>
          </el-table-column>
          <el-table-column label="销售数量">
            <template slot-scope="scope">{{scope.row.orderPackages}}</template>
          </el-table-column>
          <el-table-column label="待收金额">
            <template slot-scope="scope">{{scope.row.receivableAmount | eMoney}}</template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!-- 采购统计 -->
    <el-dialog width="900px" title="采购统计" center :visible.sync="purchaseVisible" v-dialogDrag>
      <el-tabs v-model="activePurchase" @tab-click="purchaseClick">
        <el-tab-pane label="采购月报" name="1">
          <div class="main">
            <div class="main_left table_style">
              <el-table :data="purchaseMonthData" border height="100%">
                <el-table-column prop="monthNum" label="月份"></el-table-column>
                <el-table-column label="采购金额" prop="buyAmountPrice"></el-table-column>
                <el-table-column label="采购数量" prop="buyPackageNum"></el-table-column>
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
					<div class="main_time">
						<el-button type="text">本周</el-button>
						<el-button type="text">本月</el-button>
						<el-button type="text">上月</el-button>
					</div>
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
					<div class="main_time">
						<el-button type="text">本周</el-button>
						<el-button type="text">本月</el-button>
						<el-button type="text">上月</el-button>
					</div>
          <div class="main">
            <div class="main_left table_style">
              <el-table :data="supplierData" border height="100%">
                <el-table-column prop="companyName" label="供应商名称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="companyName" label="联系人" show-overflow-tooltip></el-table-column>
                <el-table-column prop="buyPackageNum" label="采购数量"></el-table-column>
                <el-table-column prop="buyAmountPrice" label="采购数量"></el-table-column>
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
    <!-- 业绩统计 -->
    <el-dialog width="900px" title="业绩统计" center :visible.sync="achievementVisible" v-dialogDrag>
      <el-tabs v-model="activeAchievement" @tab-click="achievementClick">
        <el-tab-pane label="个人业绩" name="1">
					<div class="main_time">
						<el-button type="text">本周</el-button>
						<el-button type="text">本月</el-button>
						<el-button type="text">上月</el-button>
					</div>
          <div class="main">
            <div class="main_left table_style">
              <el-table :data="personAchievementData" border height="100%">
                <el-table-column label="销售员" prop="userName"></el-table-column>
                <el-table-column label="订单数量" prop="sellOrderNum"></el-table-column>
                <el-table-column label="销售毛利" prop="sellUnitPrice"></el-table-column>
                <el-table-column label="销售数量" prop="sellNum"></el-table-column>
                <el-table-column label="更多">
                  <template slot-scope="scope">
                    <a href="javascript:void(0)" @click="openPersonAchievement(scope.row.creatorId)">详细</a>
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
					<div class="main_time">
						<el-button type="text">本周</el-button>
						<el-button type="text">本月</el-button>
						<el-button type="text">上月</el-button>
					</div>
          <div class="main">
            <div class="main_left table_style">
              <el-table :data="backMoney" border height="100%">
                <el-table-column prop="userName" label="销售员"></el-table-column>
                <el-table-column prop="orderPackages" label="回款数量"></el-table-column>
                <el-table-column prop="receivableAmount" label="回款金额"></el-table-column>
                <el-table-column label="更多">
                  <template slot-scope="scope">
                    <a href="javascript:void(0)" @click="openBackMoney(scope.row.creatorId)">更多</a>
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
        <el-table :data="personAchievementTable" border height='400px'>
          <el-table-column prop="date" label="销售单号">
            <template slot-scope="scope">
              <a href="javascript:void(0)" @click="getOrder(scope.row.orderNo)">{{scope.row.orderNo}}</a>
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
    <el-dialog width="960px" title="回款业绩" center :visible.sync="backMoneyVisible" v-dialogDrag>
      <div class="table_style">
        <el-table :data="backMoneyData" border height='400px'>
          <el-table-column prop="date" label="销售单号">
            <template slot-scope="scope">
              <a href="javascript:void(0)" @click="getOrder(scope.row.orderNo)">{{scope.row.orderNo}}</a>
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
    <!-- 库存统计 -->
    <el-dialog width="900px" title="库存统计" center :visible.sync="stockVisible" v-dialogDrag>
      <div class="tabs_right" v-if="activeStock==='1'">
        <el-select size="mini" v-model="catoryId" @change="getStockData(catoryId)" placeholder="请选择">
          <el-option label="实木板材" value="2"></el-option>
          <el-option label="原木材" value="1"></el-option>
          <el-option label="人造板" value="5"></el-option>
          <el-option label="木配城" value="4"></el-option>
          <el-option label="名贵材" value="3"></el-option>
        </el-select>
      </div>
      <div class="tabs_right" v-if="activeStock==='2'">
        <el-select size="mini" v-model="catoryId" @change="getLineData(catoryId)" placeholder="请选择">
          <el-option label="实木板材" value="2"></el-option>
          <el-option label="原木材" value="1"></el-option>
          <el-option label="人造板" value="5"></el-option>
          <el-option label="木配城" value="4"></el-option>
          <el-option label="名贵材" value="3"></el-option>
        </el-select>
      </div>
      <el-tabs v-model="activeStock" @tab-click="stockClick">
        <el-tab-pane label="现货库存" name="1">
          <div class="main">
            <div class="main_left table_style">
              <el-table :data="stockData" border height="100%">
                <el-table-column align="center" label="仓库" prop="storeName"></el-table-column>
                <el-table-column align="center" v-for="(val,key) in tableConfig" :key="val" :label="val" :prop="val"></el-table-column>
                <el-table-column align="center" label="库存件数" prop="packageNum"></el-table-column>
                <el-table-column align="center" label="库存数量" prop="amount"></el-table-column>
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
        <el-tab-pane label="在途库存" name="2">
          <div class="main">
            <div class="main_left table_style">
              <el-table :data="lineData" border height="100%">
                <el-table-column align="center" v-for="(val,key) in tableConfig" :key="key" :label="val" :prop="val"></el-table-column>
                <el-table-column align="center" label="相关单号" prop="orderSn" show-overflow-tooltip></el-table-column>
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
    <!-- 销售单详情 -->
    <el-dialog width="900px" title="销售详情单" center :visible.sync="orderVisible" v-dialogDrag>
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
        <el-table :data="orderTable" height="300px">
          <el-table-column type="index" label="序号" width="50" show-overflow-tooltip></el-table-column>
          <el-table-column :label="item" :prop="item" show-overflow-tooltip v-for="(item, key) in tableConfig" :key="key">
          </el-table-column>
          <el-table-column label="单价" prop="price" show-overflow-tooltip></el-table-column>
          <el-table-column label="数量" prop="goodsNum" show-overflow-tooltip></el-table-column>
          <el-table-column label="数量" prop="totalAmount" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
    </el-dialog>
	</div>
</template>
<style lang="scss">
	.main_time .el-button--text{
	  color: #666666;
	  &:hover{
	    color:#409EFF;
	  }
	}
	.main_time .el-button--text.active{
	  color:#409EFF;
	}
</style>
<style scoped="scoped" lang="scss">
	
	.main_time{
		height: 40px;
	}
  .main{
    height: 500px;
    .main_left{
      float: left;
      height: 100%;
      width:calc(100% - 70px);
      .main_tab{
        height: 40px;
      }
      .main_table{
        height: calc(100% - 40px);
      }
    }
    .main_right{
      float: left;
      height: 100%;
      width: 70px;
      border-top: 1px solid #E5E5E5;
      border-right: 1px solid #E5E5E5;
      border-bottom: 1px solid #E5E5E5;
      padding-top: 20px;
			background-color:#FFFEE9;
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
  .tabs_right{
    position: absolute;
    right: 30px;
    top: 5px;
    z-index: 5;
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
	.count {
		background-color: #f2f2f2;
		height: 100%;
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
<script>
	export default {
		data() {
			return {
				tenantId: JSON.parse(this.$store.state.token).tenantId,
        saleVisible:false,
        activeSale:'1',
				saleOption:{dateState:null},
				saleOption1:{dateState:null},
        daySaleData:[],
        monthSaleData:[],
        customerSaleData:[],
        customerBackData:[],
        daySaleVisible:false,
        daySaleTable:[],
        monthSaleVisible:false,
        monthSaleTable:[],
        customerSaleVisible:false,
        customerSaleTable:[],
        payVisible:false,
        payTable:[],
        purchaseVisible:false,
        activePurchase:'1',
        purchaseMonthData:[],
        purchaseList:[],
        supplierData:[],
        achievementVisible:false,
        activeAchievement:'1',
        personAchievementData:[],
        backMoney:[],
        personVisible:false,
        personAchievementTable:[],
        backMoneyVisible:false,
        backMoneyData:[],
        stockVisible:false,
        activeStock:'1',
        catoryId:'2',
        tableConfig:[],
        stockData:[],
        lineData:[],
        orderVisible:false,
        orderInfo:{},
        orderTable:[],
			}
		},
		methods: {
      // 打开销售统计
      openSale(){
        this.saleVisible = true;
        this.activeSale = '1';
        setTimeout(()=>{this.getDaySale()});
      },
      saleClick(){
        if(this.activeSale === '1') this.getDaySale();
        if(this.activeSale === '2') this.getMonthSale();
        if(this.activeSale === '3') this.getCustomerSale();
        if(this.activeSale === '4') this.getCustomerBackMoney();
      },
      // 获取销售日报数据
      getDaySale(){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {tenantId:this.tenantId};
				params = Object.assign(params,this.saleOption);
        this.$axios.get('/apt/purposeForm/showSellSummary',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.daySaleData = res.data.data;
          }else{
            this.$message.error('获取数据失败')
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      // 获取销售月报数据
      getMonthSale(){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {tenantId:this.tenantId};
        this.$axios.get('/apt/purposeForm/showUserMonthSell',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.monthSaleData = res.data.data;
          }else{
            this.$message.error('获取数据失败')
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      // 获取客服销售数据
      getCustomerSale(){
        const loading = this.$loading({lock: true, text: '获取客服销售', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {tenantId:this.tenantId};
				params = Object.assign(params,this.saleOption1);
        this.$axios.get('/apt/purposeForm/showSellContactByMonth',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.customerSaleData = res.data.data;
          }else{
            this.$message.error('获取数据失败')
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      // 获取客户收款数据
      getCustomerBackMoney(){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {tenantId:this.tenantId};
        this.$axios.get('/apt/purposeForm/showContactPrice',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.customerBackData = res.data.data;
          }else{
            this.$message.close('获取数据失败');
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      // 打开日报详情
      openDaySale(time){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {
          time:this.time(new Date(time),'y-m-d'),
          tenantId:this.tenantId
        };
        this.$axios.get('/apt/purposeForm/showUserSellDay',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.daySaleVisible = true;
            this.daySaleTable = res.data.data;
          }else{
            this.$message.error('获取数据失败');
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      // 打开月报详情
      openMonthSale(year,month){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {
          time:year + '-' + (month>9?month:'0'+month),
          tenantId:this.tenantId
        };
        this.$axios.get('/apt/purposeForm/showUserSellDay',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.monthSaleVisible=true;
            this.monthSaleTable = res.data.data;
          }else{
            this.$message.error('获取数据失败')
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      // 打开客户详情
      openCustomerSale(id){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {contactId:id};
        this.$axios.get('/apt/purposeForm/showContactSellInfo',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.customerSaleVisible = true;
            this.customerSaleTable = res.data.data;
          }else{
            this.$message.error('获取数据失败')
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      // 打开收款详情
      openPay(id){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {contactId:id};
        this.$axios.get('/apt/purposeForm/showByContactInfo',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.payVisible = true;
            this.payTable = res.data.data;
          }else{
            this.$message.error('获取数据失败')
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      // 打开采购统计
      openPurchase(){
        this.purchaseVisible = true;
        this.activePurchase = '1';
        setTimeout(()=>{this.getPurchaseMonth()});
      },
      purchaseClick(){
        if(this.activePurchase === '1') this.getPurchaseMonth();
        if(this.activePurchase === '2') this.getPurchase();
        if(this.activePurchase === '3') this.getSupplierData();
      },
      // 获取采购月报数据
      getPurchaseMonth(){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {tenantId:this.tenantId};
        this.$axios.get('/apt/purposeForm/showPurposeMonth',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.purchaseMonthData = res.data.data;
          }else{
            this.$message.error('获取数据失败')
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      // 获取产品采购数据
      getPurchase(){
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
      // 获取供应商报表数据
      getSupplierData(){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {tenantId:this.tenantId};
        this.$axios.get('/apt/purposeForm/showContactSummary',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.supplierData = res.data.data;
          }else{
            this.$message.error('获取数据失败')
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      // 打开业绩统计
      openAchievement(){
        this.achievementVisible = true;
        this.activeAchievement = '1';
        setTimeout(()=>{this.getPersonAchievement()});
      },
      achievementClick(){
        if(this.activeAchievement === '1') this.getPersonAchievement();
        if(this.activeAchievement === '2') this.getBackMoney();
      },
      // 获取个人业绩数据
      getPersonAchievement(){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {tenantId:this.tenantId};
        this.$axios.get('/apt/purposeForm/showSellCreator',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.personAchievementData = res.data.data;
          }else{
            this.$message.error('获取数据失败');
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      // 获取回款业绩数据
      getBackMoney(){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {tenantId:this.tenantId};
        this.$axios.get('/apt/purposeForm/showUserReceviableAmountSellSummary',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.backMoney = res.data.data.data;
          }else{
            this.$message.error('获取数据失败')
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      // 打开个人业绩单
      openPersonAchievement(id){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {creator:id};
        this.$axios.get('/apt/purposeForm/showCreatorSellForm',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.personVisible = true;
            this.personAchievementTable = res.data.data.data;
          }else{
            this.$message.error('获取数据失败');
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      // 打开回款业绩单
      openBackMoney(id){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params ={creatorId:id};
        this.$axios.get('/apt/purposeForm/showUserReceviableAmountSellList',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.backMoneyVisible = true;
            this.backMoneyData = res.data.data.data;
          }else{
            this.$message.error('获取数据失败')
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      // 打开库存统计
      openStock(){
        this.stockVisible = true;
        this.activeStock = '1';
        setTimeout(()=>{this.getStockData(this.catoryId)});
      },
      stockClick(){
        if(this.activeStock === '1') this.getStockData(this.catoryId);
        if(this.activeStock === '2') this.getLineData(this.catoryId);
      },
      // 获取现货库存数据
      getStockData(id){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {
          tenantId:this.tenantId,
          catoryId:id
        };
        this.$axios.get('/api/storePackage/showStroePackageQuery',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            switch (id) {
              case '1' : this.tableConfig = this.GLOBAL_.tableConfig['原木材']; break;
              case '2' : this.tableConfig = this.GLOBAL_.tableConfig['实木板材']; break;
              case '3' : this.tableConfig = this.GLOBAL_.tableConfig['名贵材']; break;
              case '4' : this.tableConfig = this.GLOBAL_.tableConfig['木配城']; break;
              case '5' : this.tableConfig = this.GLOBAL_.tableConfig['人造板']; break;
            }
            let data = res.data.data;
            for(let i in data){
              let arr = data[i].attibuteValue.split(',');
              for(let n in arr){
                data[i][arr[n].split(':')[0]] = arr[n].split(':')[1];
              }
            }
            this.stockData = data;
          }else{
            this.stockData=[];
            this.$message.error('获取数据失败')
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      // 获取在途库存数据
      getLineData(id){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {
          tenantId:this.tenantId,
          catoryId:id
        };
        this.$axios.get('/api/storePackage/showStoreOnPassageInfo',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            switch (id) {
              case '1' : this.tableConfig = this.GLOBAL_.tableConfig['原木材']; break;
              case '2' : this.tableConfig = this.GLOBAL_.tableConfig['实木板材']; break;
              case '3' : this.tableConfig = this.GLOBAL_.tableConfig['名贵材']; break;
              case '4' : this.tableConfig = this.GLOBAL_.tableConfig['木配城']; break;
              case '5' : this.tableConfig = this.GLOBAL_.tableConfig['人造板']; break;
            }
            let data = res.data.data;
            for(let i in data){
              let arr = data[i].attributeValue.split(',');
              for(let n in arr){
                data[i][arr[n].split(':')[0]] = arr[n].split(':')[1];
              }
            }
            this.lineData = data;
          }else{
            this.$message.error('获取数据失败')
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      // 获取销售单数据
      getOrder(orderNo){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {orderNo:orderNo};
        this.$axios.get('/aps/sell/showSellFormInfo',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.orderVisible = true;
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
		},
	}
</script>
