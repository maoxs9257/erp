<template>
	<div class="count">
		<div class="countbox">
			<div class="countitem" @click="openOutStore(null);active=null">
				<i class="iconfont cangku-chukutongji"></i>
				<p>出库统计</p>
			</div>
			<div class="countitem" @click="openInStore(null);inActive=null">
				<i class="iconfont cangku-rukutongji"></i>
				<p>入库统计</p>
			</div>
			<div class="countitem" @click="openCargo">
				<i class="iconfont cangku-huoquantongji"></i>
				<p>货权统计</p>
			</div>
			<div class="countitem" @click="openStorePrice">
				<i class="iconfont cangku-cangchufeitongji"></i>
				<p>仓储费统计</p>
			</div>
		</div>
    <!-- 出库统计 -->
    <el-dialog width="1000px" title="出库统计" center :visible.sync="outStoreVisible" v-dialogDrag>
      <div class="main">
        <div class="main_left">
          <div class="main_tab">
            <el-button type="text" :class="{active:active==='0'}" @click="openOutStore(0);active='0'">本周</el-button>
            <el-button type="text" :class="{active:active==='1'}" @click="openOutStore(1);active='1'">本月</el-button>
            <el-button type="text" :class="{active:active==='2'}" @click="openOutStore(2);active='2'">上月</el-button>
          </div>
          <div class="main_table table_style">
            <el-table :data="outStoreData" border height="100%">
              <el-table-column prop="catoryName" label="品类" show-overflow-tooltip></el-table-column>
              <el-table-column prop="brandName" label="品牌" show-overflow-tooltip></el-table-column>
              <el-table-column prop="等级" label="等级" show-overflow-tooltip></el-table-column>
              <el-table-column prop="amounts" label="数量" show-overflow-tooltip></el-table-column>
              <el-table-column prop="price" label="金额" show-overflow-tooltip></el-table-column>
              <el-table-column label="更多">
                <template slot-scope="scope">
                  <a href="javascript:void(0)" @click="openOutDetail(scope.row.productId)">详情</a>
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
        </div>
      </div>
    </el-dialog>
    <!-- 出库详情 -->
    <el-dialog width="680px" title="出库详情" center :visible.sync="outDetailVisible" v-dialogDrag>
      <div class="table_style">
        <el-table :data="outDetailData" border height="400px">
          <el-table-column label="仓库" prop="storeName"></el-table-column>
          <el-table-column label="金额" prop="price"></el-table-column>
          <el-table-column label="数量" prop="amounts"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!-- 入库统计 -->
    <el-dialog width="1000px" title="入库统计" center :visible.sync="inStoreVisible" v-dialogDrag>
      <div class="main">
        <div class="main_left">
          <div class="main_tab">
            <el-button type="text" :class="{active:inActive==='0'}" @click="openInStore(0);inActive='0'">本周</el-button>
            <el-button type="text" :class="{active:inActive==='1'}" @click="openInStore(1);inActive='1'">本月</el-button>
            <el-button type="text" :class="{active:inActive==='2'}" @click="openInStore(2);inActive='2'">上月</el-button>
          </div>
          <div class="main_table table_style">
            <el-table :data="inStoreData" border height="100%" highlight-current-row @current-change="handleCurrentChange">
              <el-table-column prop="catoryName" label="品类" show-overflow-tooltip></el-table-column>
              <el-table-column prop="brandName" label="品牌" show-overflow-tooltip></el-table-column>
              <el-table-column prop="等级" label="等级" show-overflow-tooltip></el-table-column>
              <el-table-column prop="amounts" label="数量" show-overflow-tooltip></el-table-column>
              <el-table-column prop="price" label="金额" show-overflow-tooltip></el-table-column>
              <el-table-column label="更多">
                <template slot-scope="scope">
                  <a href="javascript:void(0)" @click="openInDetail(scope.row.productId)">详情</a>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="main_right" style="margin-top: 40px;height:calc(100% - 40px)">
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
    <!-- 入库详情 -->
    <el-dialog width="680px" title="入库详情" center :visible.sync="inDetailVisible" v-dialogDrag>
      <div class="table_style">
        <el-table :data="inDetailData" border height="400px">
          <el-table-column label="仓库" prop="storeName"></el-table-column>
          <el-table-column label="金额" prop="price"></el-table-column>
          <el-table-column label="数量" prop="amounts"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!-- 货权统计 -->
    <el-dialog width="900px" title="货权统计" center :visible.sync="cargoVisible" v-dialogDrag>
      <el-tabs v-model="activeStore" @tab-click="storeClick">
        <el-tab-pane v-for="val in storeList" :label="val.name" :name="val.id" :key="val.id">
          <div class="main table_style">
            <el-table border :data="cargoData" height="100%">
              <el-table-column label="开证公司" prop="issuingName"></el-table-column>
              <el-table-column label="入库数量" prop="inFormAmount"></el-table-column>
              <el-table-column label="待赎数量" prop='redeemAmounts'></el-table-column>
              <el-table-column label="货权数量" prop='propertyAmount'></el-table-column>
              <el-table-column label="更多">
                <template slot-scope="scope">
                  <a @click="openDialog5(scope.row.issuingId)">详情</a>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!-- 仓储费统计 -->
    <el-dialog width="900px" title="仓储费统计" center :visible.sync="storePriceVisible" v-dialogDrag>
      <el-tabs v-model="activeId" @tab-click="priceClick">
        <el-tab-pane v-for="val in storeList" :label="val.name" :name="val.id" :key="val.id">
          <div class="main">
            <div class="main_left table_style">
              <el-table border :data="storePriceData" height="100%">
                <el-table-column label="月份" align='center' prop="times"></el-table-column>
                <el-table-column label="费用合计" align='center' prop="totalePrice"></el-table-column>
                <el-table-column label="仓储费" align='center' prop='warehouseChargesPrice'></el-table-column>
                <el-table-column label="卸柜费" align='center' prop='handingPrice'></el-table-column>
                <el-table-column label="其他费用" align='center' prop='otherPrice'></el-table-column>
                <el-table-column label="更多" align='center'>
                  <template slot-scope="scope">
                    <a @click="openPriceDetail(scope.row.times)">详情</a>
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
    <!-- 仓储费统计详情 -->
    <el-dialog width="1000px" title="仓储费统计详情" center :visible.sync="priceDetailVisible" v-dialogDrag>
      <div class="main table_style">
        <el-table border height="100%" :data="priceDetailData">
          <el-table-column label="日期" prop="ctime"></el-table-column>
          <el-table-column label="室内仓储费"><template slot-scope="scope"><a href="javascript:void(0)" @click="openInDoor(scope.row)">{{scope.row.saveMoney}}</a></template></el-table-column>
          <el-table-column label="室外仓储费"><template slot-scope="scope"><a href="javascript:void(0)" @click="openOutDoor(scope.row)">{{scope.row.outSavePrice}}</a></template></el-table-column>
          <el-table-column label="卸柜费"><template slot-scope="scope">{{scope.row.map|filter1}}</template></el-table-column>
          <el-table-column label="装柜费"><template slot-scope="scope">{{scope.row.map|filter2}}</template></el-table-column>
          <el-table-column label="改包费"><template slot-scope="scope">{{scope.row.map|filter3}}</template></el-table-column>
          <el-table-column label="翻包费"><template slot-scope="scope">{{scope.row.map|filter4}}</template></el-table-column>
          <el-table-column label="合计"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!-- 室内仓储详单 -->
    <el-dialog width="1000px" title="室内仓储详单" center :visible.sync="inDoorVisible" v-dialogDrag>
      <el-tabs v-model="activeCrtory" @tab-click="getInDoorData">
        <el-tab-pane label="实木板材" name="2"></el-tab-pane>
        <el-tab-pane label="原木材" name="1"></el-tab-pane>
        <el-tab-pane label="木配城" name="4"></el-tab-pane>
        <el-tab-pane label="人造板" name="5"></el-tab-pane>
        <el-tab-pane label="名贵材" name="3"></el-tab-pane>
      </el-tabs>
      <div class="main table_style">
        <el-table border height="100%" :data="indoorPrice">
          <el-table-column label="时间" prop="ctime"></el-table-column>
          <el-table-column label="阶段">
            <template slot-scope="scope">{{scope.row.fromDate}}-{{scope.row.toDate}}天</template>
          </el-table-column>
          <el-table-column label="入库件数" prop="inNumber"></el-table-column>
          <el-table-column label="数量" prop="inAmount"></el-table-column>
          <el-table-column label="出库件数" prop="outNumber"></el-table-column>
          <el-table-column label="数量" prop="outAmount"></el-table-column>
          <el-table-column label="在库件数" prop="onNumber"></el-table-column>
          <el-table-column label="数量" prop="onAmount"></el-table-column>
          <el-table-column label="单价" prop=""></el-table-column>
          <el-table-column label="金额" prop=""></el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!-- 室外仓储详单 -->
    <el-dialog width="1000px" title="室外仓储详单" center :visible.sync="outDoorVisible" v-dialogDrag>
      <el-tabs v-model="activeCrtory" @tab-click="getOutDoorData">
        <el-tab-pane label="实木板材" name="2"></el-tab-pane>
        <el-tab-pane label="原木材" name="1"></el-tab-pane>
        <el-tab-pane label="木配城" name="4"></el-tab-pane>
        <el-tab-pane label="人造板" name="5"></el-tab-pane>
        <el-tab-pane label="名贵材" name="3"></el-tab-pane>
      </el-tabs>
      <div class="main table_style">
        <el-table border height="100%" :data="outDoorPrice">
          <el-table-column label="时间" prop="ctime"></el-table-column>
          <el-table-column label="阶段">
            <template slot-scope="scope">{{scope.row.fromDate}}-{{scope.row.toDate}}天</template>
          </el-table-column>
          <el-table-column label="入库件数" prop="inNumber"></el-table-column>
          <el-table-column label="数量" prop="inAmount"></el-table-column>
          <el-table-column label="出库件数" prop="outNumber"></el-table-column>
          <el-table-column label="数量" prop="outAmount"></el-table-column>
          <el-table-column label="在库件数" prop="onNumber"></el-table-column>
          <el-table-column label="数量" prop="onAmount"></el-table-column>
          <el-table-column label="单价" prop=""></el-table-column>
          <el-table-column label="金额" prop=""></el-table-column>
        </el-table>
      </div>
    </el-dialog>
		<!-- 类别统计 -->
		<el-dialog width="800px" v-dialogDrag title="产品类别统计" :visible.sync="showDialog1" @opened="drawData">
			<div class="dialog1Box">
				<div class="boxleft">
					<p>品类</p>
					<div id="chart1"></div>
					<p>总金额:{{price | eMoney}}￥</p>
				</div>
				<div class="boxleft">
					<p>{{productName===""?"品名":productName}}</p>
					<div id="chart2"></div>
				</div>
			</div>
		</el-dialog>
		<!-- 品牌统计 -->
		<el-dialog width="800px" v-dialogDrag title="品牌统计" :visible.sync="showDialog2" @opened="drawDataBrandName">
			<div class="dialog2Box">
				<div id="chart3"></div>
			</div>
		</el-dialog>
		<!-- 入库统计 弹窗 -->
		<el-dialog width="1000px" v-dialogDrag title="入库统计" :visible.sync="showDialog3">
			<div class="outmain">
				<div class="mainbar">
					<div class="midi"></div>
					<a href="javascript:void(0)" :class="{active:timeId===0}" class="sel">本周</a>
					<a href="javascript:void(0)" :class="{active:timeId===1}" class="sel">本月</a>
					<a href="javascript:void(0)" :class="{active:timeId===2}" class="sel">上月</a>
					<div class="sel">
						<span v-show="value===''">日期选择</span>
						<el-date-picker class='selinput' :class="{opcity:value===''}" v-model="value" type="daterange" @change="getData">
						</el-date-picker>
					</div>
					<div class="selin">
						<i class="iconfont icon-sousuo"></i>
						<input type="text">
					</div>
				</div>
				<div class="maintable tableStyle">
					<el-table :data="inTableDatas" border height="100%" highlight-current-row @current-change="handleCurrentChange">
						<el-table-column prop="catoryName" label="品类" show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop="brandName" label="品牌"  show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop="等级" label="等级" show-overflow-tooltip></el-table-column>
						<el-table-column prop="amounts" label="数量" show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop="price" label="金额" show-overflow-tooltip>
						</el-table-column>
						<el-table-column label="更多">
							<template slot-scope="scope">
								<a href="javascript:void(0)" @click="openDetail(scope.row,'storeInForm/InFormStatisticsParticulars')">详情</a>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</div>
			<div class="outaside">
				<a href="javascript:void(0)"><i class="iconfont dayin"></i>
					<p>打印</p>
				</a>
				<a href="javascript:void(0)"><i class="iconfont daochu"></i>
					<p>导出</p>
				</a>
				<a href="javascript:void(0)" @click="openLei(inTableDatas)"><i class="iconfont jinxiaocun-yejitongji"></i>
					<p>类别统计</p>
				</a>
				<a href="javascript:void(0)" @click="openPin(inTableDatas)"><i class="iconfont icon-tongji"></i>
					<p>品牌统计</p>
				</a>
			</div>
		</el-dialog>
		<!-- 货权统计详情 弹窗 -->
		<el-dialog width="850px" v-dialogDrag title="货权统计" :visible.sync="showDialog5">
			<div class="dialog5box tableStyle">
				<el-table border :data="huoDetailData" height="100%">
					<el-table-column show-overflow-tooltip label="入库时间" align='center' prop="issuingName">
						<template slot-scope="scope">
							{{scope.row.storeInfornTime | getDay}}
						</template>
					</el-table-column>
					<el-table-column show-overflow-tooltip label="合同号" align='center' prop="contractSn"></el-table-column>
					<el-table-column show-overflow-tooltip label="提单号" align='center' prop='orderSn'></el-table-column>
					<el-table-column show-overflow-tooltip label="订单总库存" align='center' prop='inFormAmount'></el-table-column>
					<el-table-column show-overflow-tooltip label="剩余库存数量" align='center' prop='propertyAmount'></el-table-column>
					<el-table-column show-overflow-tooltip label="货权数量" align='center' prop='propertyAmount'></el-table-column>
				</el-table>
			</div>
		</el-dialog>

		<!--卸柜费-->
		<el-dialog width="990px" v-dialogDrag title="卸柜费" :visible.sync="showDialog10" center>
			<div class="dialog10Box">

			</div>
		</el-dialog>
	</div>
</template>
<style lang="scss">
	.selinput.el-date-editor .el-range__icon,
	.selinput.el-date-editor .el-range__close-icon {
		display: none;
	}
	.selinput.el-date-editor .el-range-separator {
		line-height: 18px;
	}
	.selinput.el-date-editor .el-range-input {
		width: 44%;
	}
	.selinput .el-input__icon {
		line-height: 18px;
	}
	.selinput .el-input--suffix .el-input__inner {
		padding-right: 15px;
	}
	.selinput .el-input__suffix {
		right: 0;
	}
	.selinput .el-input__inner {
		padding: 0;
		height: 18px;
		line-height: 18px;
		border: 0;
		display: inline-block;
		outline: none;
		text-align: center;
		width: 80px;
	}

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
<style scoped="scoped" lang="scss">
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

	.el-range-editor.el-input__inner {
		padding: 0;
		height: 18px;
		line-height: 18px;
		border: 0;
		display: inline-block;
		top: 0;
		left: 0;
		width: 167px;
	}
	.opcity.el-range-editor.el-input__inner {
		width: 62px;
		position: absolute;
		opacity: 0;
	}
	.count {
		background-color: #f2f2f2;
		height: 100%;
		text-align: center;
    .countbox {
      position: absolute;
      width: 484px;
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
	.tableDetail {
		float: left;
		width: 870px;
		.tableDetailBox {
			height: 549px;
			overflow: auto;
			a {
				color: #00A0E9;
			}
		}
	}
	.dialog8box {
		.dialog8Top {
			height: 29px;
			border-bottom: 1px solid #ddd;
			li {
				float: left;
				height: 27px;
				line-height: 27px;
				padding: 0 5px;
				border-top: 2px solid #fff;
				border-left: 1px solid #ffffff;
				border-right: 1px solid #ffffff;
			}

			li.c {
				border-top: 2px solid #00A0E9;
				border-left: 1px solid #ddd;
				border-right: 1px solid #ddd;
				border-bottom: 1px solid #ffffff;
			}
		}

		.dialog8Fot {
			height: 478px;
		}
	}
	/* 货权统计 */
	.tabsBox {
		height: 40px;
		overflow: hidden;
	}
	.tableBox {
		height: 515px;
		overflow: hidden;

		.tableBoxMain {
			width: 770px;
			height: 515px;
			float: left;

			.tableContent {
				height: 100%;

				a {
					color: #477be4;
				}
			}
		}
	}
	.dialog5box {
		height: 440px;
	}
	/* 出库统计 */
	.outmain {
		width: 870px;
		height: 548px;
		float: left;
		.mainbar {
			height: 77px;
			text-align: left;
			position: relative;
			.sel {
				display: inline-block;
				color: #666;
				font-size: 12px;
				line-height: 18px;
				padding: 0 7px;
				position: relative;
			}
			.active {
				border-radius: 4px;
				border: #00a0e9 solid 1px;
			}
			.selin {
				position: absolute;
				right: 0;
				top: calc(50% - 15px);
				height: 30px;
				i {
					position: absolute;
					top: 7px;
					left: 6px;
				}
				input {
					width: 121px;
					height: 28px;
					border: #d9d9d9 solid 1px;
					border-radius: 15px;
					outline: none;
					padding: 0 12px 0 25px;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					&:focus {
						border: #00a0e9 solid 1px;
					}
				}
			}
		}
		.maintable {
			height: 471px;
			overflow: auto;
			a {
				color: #477be4;
			}
		}
	}
	.outaside {
		width: 70px;
		height: 548px;
		border-left: #E5E5E5 solid 1px;
		float: left;
		background-color: #fffee9;
		a {
			color: #666;
			font-size: 12px;
			display: inline-block;
			width: 50px;
			padding-top: 5px;
			padding-bottom: 5px;
			border: #fffee9 solid 1px;
			margin-top: 10px;
			i {
				font-size: 24px;
			}
			p {
				line-height: 18px;
			}
			&:hover {
				border: #e9e9e9 solid 1px;
				background-color: #e9e9e9;
				border-radius: 4px;
			}
		}
	}
	/* 出库统计详情 */
	.xqDialog {
		width: 620px;
		height: 447px;
		margin: 0 auto;
		padding-top: 28px;
		overflow: auto;

		li {
			height: 37px;
			border-bottom: #e0e0e0 solid 1px;
			line-height: 37px;
			color: #666;
			padding: 0 10px;

			span {
				float: left;
			}

			.span1 {
				width: 200px;
				text-align: left;
			}

			.span2 {
				width: 300px;
				text-align: right;
			}

			.span3 {
				width: 100px;
				text-align: right;
			}
		}

		li:first-child {
			height: 40px;
			line-height: 40px;
		}

	}
	/* 类别统计 弹窗 */
	.dialog1Box {
		height: 490px;
		width: 560px;
		margin: 0 auto;

		.boxleft {
			float: left;
			margin: 0 10px;
			width: 260px;

			p {
				font-size: 14px;
				color: #666;
				margin: 30px 0;
			}

			#chart1,
			#chart2 {
				width: 260px;
				height: 260px;
			}
		}
	}
	/* 品类统计 弹窗 */
	.dialog2Box {
		width: 400px;
		margin: 0 auto;

		#chart3 {
			width: 400px;
			height: 400px;
		}
	}
</style>
<script>
	import echarts from "echarts"
	export default {
		data() {
			return {
				tenantId: JSON.parse(this.$store.state.token).tenantId,
				userId: JSON.parse(this.$store.state.token).id,
				value: '',
				outDialog: false,
				xxDialog: false,
				showDialog1: false,
				showDialog2: false,
				showDialog3: false,
				showDialog4: false,
				showDialog5: false,
				showDialog6: false,
				showDialog7: false,
				showDialog8: false,
				showDialog9: false,
				showDialog10: false,
				outTableDatas: [],
				inTableDatas: [],
				tableDatas: [],
				tableDataDetail: [],
				huoData: [],
				huoDetailData: [],
				priceData: [],
				optionArr: [],
				priceDetail: [],
				currentRow: null,
				timeId: 0,
				titleName: '',
				price: 0,
				productName: '',
				storeList: [],
				storeId: '',
				storePriceId: '',
				priceDetails: [],
				ctoryList: [],
				ctoryid: '',
				dialog8Data: {},
				savePrice: [],
				dialog9Data: {},

        outStoreVisible:false,
        outStoreData:[],
        active:null,
        outDetailVisible:false,
        outDetailData:[],
        inStoreVisible:false,
        inStoreData:[],
        inActive:null,
        inDetailVisible:false,
        inDetailData:[],
        cargoVisible:false,
        activeStore:null,
        cargoData:[],
        storePriceVisible:false,
        activeId:null,
        storePriceData:[],
        priceDetailVisible:false,
        priceDetailData:[],
        inDoorVisible:false,
        activeCrtory:null,
        indoorPrice:[],
        outDoorVisible:false,
        outDoorPrice:[],
			}
		},
		methods: {
      // 打开出库统计
      openOutStore(stat){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {tenantId:this.tenantId,stat:stat};
        this.$axios.get('/api/storeOutForm/showStoreOutFormStatistics',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.outStoreVisible = true;
            let data = res.data.data;
            for(let i in data){
              if(data[i].productMallDto){
                data[i].catoryName =data[i].productMallDto.catoryName;
                data[i].brandName =data[i].productMallDto.brandName;
                if(data[i].productMallDto.attributeMap){
                  Object.assign(data[i],data[i].productMallDto.attributeMap)
                }
              }
            }
            this.outStoreData = data;
          }else{
            this.outStoreData = [];
            this.$message.error('获取数据失败')
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      // 打开出库详情
      openOutDetail(id){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {
          tenantId:this.tenantId,
          productId:id
        };
        this.$axios.get('/api/storeOutForm/OutFormStatisticsParticulars',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.outDetailVisible = true;
            this.outDetailData = res.data.data;
          }else{
            this.$message.error('数据获取失败')
          }
        },()=>{loading.close();this.$message.error('数据获取失败')})
      },
      // 打开入库统计
      openInStore(stat){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {
          tenantId:this.tenantId,
          stat:stat
        };
        this.$axios.get('/api/storeInForm/showStoreInFormStatistics',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.inStoreVisible = true;
            let data = res.data.data;
            for(let i in data){
              if(data[i].productMallDto){
                data[i].catoryName =data[i].productMallDto.catoryName;
                data[i].brandName =data[i].productMallDto.brandName;
                if(data[i].productMallDto.attributeMap){
                  Object.assign(data[i],data[i].productMallDto.attributeMap)
                }
              }
            }
            this.inStoreData = data;
          }else{
            this.inStoreData= [];
            this.$message.error('获取数据失败')
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      // 打开入库详情
      openInDetail(id){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {
          tenantId:this.tenantId,
          productId:id
        };
        this.$axios.get('/api/storeInForm/InFormStatisticsParticulars',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.inDetailVisible = true;
            this.inDetailData = res.data.data;
          }else{
            this.$message.error('获取数据失败');
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      // 打开货权统计
      openCargo(){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {tenantId:this.tenantId};
        this.$axios.get('/api/storeOutForm/showStoreTable',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.cargoVisible = true;
            this.storeList = res.data.data;
            if(this.storeList[0]){
              this.activeStore = this.storeList[0].id;
              this.storeClick();
            }
          }else{
            this.$message.error('获取数据失败 ')
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      storeClick(){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params ={
          tenantId:this.tenantId,
          warestoreId:this.activeStore
        };
        this.$axios.get('/api/storeSavePrice/showPropertyInGoods',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.cargoData = res.data.data;
          }else{
            this.$message.error('获取数据失败')
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})

      },
      // 打开仓储费
      openStorePrice(){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {tenantId:this.tenantId};
        this.$axios.get('/api/storeOutForm/showStoreTable',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.storePriceVisible = true;
            this.storeList = res.data.data;
            if(this.storeList[0]){
              this.activeId = this.storeList[0].id;
              this.priceClick();
            }
          }else{
            this.$message.error('获取数据失败 ')
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      // 获取仓储费数据
      priceClick(){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {
          tenantId:this.tenantId,
          warestoreId:this.activeId
        };
        this.$axios.get('/api/storeTable/showStoreSavePriceInfo',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.storePriceData = res.data.data;
          }else{
            this.storePriceData = [];
            this.$message.error('获取数据失败')
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})

      },
      // 打开仓储费统计信息
      openPriceDetail(time){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {
          tenantId:this.tenantId,
          warestoreId:this.activeId,
          conTime:time+'-01'
        };
        this.$axios.get('/api/storeSavePrice/showStatisticalStatement',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.priceDetailVisible = true;
            this.priceDetailData = this.proStorePrice(res.data.data);
          }else{
            this.priceDetailData = [];
            this.$message.error('获取数据失败')
          }
        },()=>{loading.close();this.$message.errord('获取数据失败')})
      },
      // 仓储费数据处理
      proStorePrice(data){
        let arr = [];
        for(let i in data){
          if(data[i].type==='indoor'){
            arr.push(data[i])
          }
        }
        for(let i in data){
          if(data[i].type==='outdoor'){
            for(let n in arr){
              if(arr[n].ctime===data[i].ctime){
                arr[n].outSavePrice = data[i].saveMoney;
                arr[n].outId = data[i].id;
              }
            }
          }
        }
        return arr;
      },
      // 打开室内仓储详单
      openInDoor(data){
        this.inDoorVisible = true;
        this.activeCrtory = '2';
        this.indoor = data;
        this.getInDoorData();
      },
      // 获取室内仓储详单数据
      getInDoorData(){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {
          warehouseListId:this.indoor.id,
          warestoreId:this.indoor.warestoreId,
          conTime:this.indoor.conTime,
          tenantId: this.tenantId,
          type:'indoor',
          categoryId:this.activeCrtory
        };
        this.$axios.get('/api/storeSavePrice/showStoreDayPrice',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.indoorPrice = this.proSavePrice(res.data.data);
          }else{
            this.$message.error('获取数据失败')
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      // 打开室外仓储详单
      openOutDoor(data){
        this.outDoorVisible = true;
        this.activeCrtory  = '2';
        this.outdoor = data;
        this.getOutDoorData();
      },
      // 获取室外仓储详单数据
      getOutDoorData(){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {
          warehouseListId:this.indoor.outId,
          warestoreId:this.indoor.warestoreId,
          conTime:this.indoor.conTime,
          tenantId: this.tenantId,
          type:'outdoor',
          categoryId:this.activeCrtory
        };
        this.$axios.get('/api/storeSavePrice/showStoreDayPrice',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.outDoorPrice = this.proSavePrice(res.data.data);
          }else{
            this.$message.error('获取数据失败')
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      //处理仓储费数据
      proSavePrice(data) {
        let arr = [];
        for (let index = 0; index < data.storeDaySavePriceDtoList.length; index++) {
          let obj = {};
          if (index === 0) {
            obj = Object.assign(data, data.storeDaySavePriceDtoList[0])
          } else {
            obj = data.storeDaySavePriceDtoList
          }
          arr.push(obj)
        }
        return arr
      },

        //获取室内仓储费数据
        getInSave(data) {
            this.$axios({
                method: 'get',
                url: '/api/storeSavePrice/showStoreDayPrice',
                params: {
                    warehouseListId: data.id,
                    warestoreId: data.warestoreId,
                    conTime: data.ctime,
                    tenantId: this.tenantId,
                    type: data.type,
                    categoryId: this.ctoryid
                }
            }).then(res => {
                if (res && res.data.data) {
                    this.savePrice = this.proSavePrice(res.data.data)
                }
            })
        },


			//打开室内仓储费
			openDialog8(data) {
				this.showDialog8 = true;
				this.dialog8Data = data;
				this.dialog8Data.id = data.inId;
				this.dialog8Data.type = 'indoor';
				this.getCrtoryList(this.dialog8Data);
			},
			//打开室外仓储费
			openDialog9(data) {
				this.showDialog9 = true;
				this.dialog9Data = data;
				this.getCrtoryList(this.dialog9Data)
			},
			//切换类目
			changeTab(id, data) {
				this.ctoryid = id;
				this.getInSave(data)
			},
			//获取类目信息
			getCrtoryList(data) {
				this.$axios({
					method: 'get',
					url: '/api/storeExchangeForm/showCrtoryInfo',
					params: {
						tenantId: this.tenantId
					}
				}).then(res => {
					if (res && res.data.data) {
						this.ctoryList = res.data.data;
						this.ctoryid = this.ctoryList[0].id;
						this.getInSave(data)
					}
				})
			},


			//打开卸柜费
			openDialog10(data) {
				this.showDialog10 = true;
			},
			//打开货权统计弹窗  获取仓库数据
			openGoodsDialog() {
				this.showDialog4 = true;
				//获取仓库列表
				this.getStore()
			},


			//获取货权详细信息
			openDialog5(id) {
				this.showDialog5 = true;
				this.$axios({
					method: 'get',
					url: '/api/storeSavePrice/showPropertyInGoods',
					params: {
						tenantId: this.tenantId,
						warestoreId: this.storeId,
						issuingId: id
					}
				}).then(res => {
					this.huoDetailData = res.data.data
				})
			},


			//根据时间获取出库统计数据
			getOutData(id) {
				this.$axios({
					method: "get",
					url: "/api/storeOutForm/showStoreOutFormStatistics",
					params: {
						tenantId: this.tenantId,
						stat: id
					}
				}).then(res => {
					this.outTableDatas = this.proTableData(res.data.data)
				})
			},

			//根据时间区间获取出库统计数据
			getData() {
				this.$axios({
					method: "get",
					url: "/api/storeOutForm/showStoreOutFormStatistics",
					params: {
						tenantId: this.tenantId,
					}
				}).then(res => {
					this.outTableDatas = this.proTableData(res.data.data)
				})
			},

			//统计信息处理    出库入库公用
			proTableData(data) {
				var tableData = []
				for (var i in data) {
					var obj = {
						catoryName: data[i].productMallDto ? data[i].productMallDto.catoryName : '',
						productName: data[i].productMallDto ? data[i].productMallDto.attributeMap.品名 : '',
						brandName: data[i].productMallDto ? data[i].productMallDto.brandName : '',
						lv: data[i].productMallDto ? data[i].productMallDto.attributeMap.等级 : '',
						amounts: data[i].amounts,
						price: data[i].price,
						productId: data[i].productId
					}
					tableData.push(obj)
				}
				return tableData
			},



			//打开类别统计 弹窗
			openLei(data) {
				this.tableDatas = data
				this.showDialog1 = true
			},
			//打开品类统计 弹窗
			openPin(data) {
				this.tableDatas = data
				this.showDialog2 = true
			},
			//统计图数据 整理
			drawData() {
				var data = this.tableDatas
				var obj = {}
				var arr = []
				for (var i in data) {
					if (obj[data[i].catoryName]) {
						obj[data[i].catoryName] += parseInt(data[i].price)
					} else {
						obj[data[i].catoryName] = parseInt(data[i].price)
					}
				}
				var num = 0
				for (var i in obj) {
					var newobj = {
						name: i,
						value: obj[i]
					}
					arr.push(newobj)
					num += obj[i]
				}
				this.price = num

				this.drawLine(arr)
			},
			//统计图 品名
			drawDataName(name) {
				this.productName = name
				var data = this.tableDatas
				var obj = {}
				var arr = []
				for (var i in data) {
					if (data[i].catoryName === name) {
						if (obj[data[i].productName]) {
							obj[data[i].productName] += parseInt(data[i].price)
						} else {
							obj[data[i].productName] = parseInt(data[i].price)
						}
					}
				}
				for (var i in obj) {
					var newobj = {
						name: i,
						value: obj[i]
					}
					arr.push(newobj)
				}
				this.drawLine1(arr)
			},
			//品牌统计数据
			drawDataBrandName() {
				var data = this.tableDatas
				var obj = {}
				var arr = []
				for (var i in data) {
					if (obj[data[i].brandName]) {
						obj[data[i].brandName] += parseInt(data[i].price)
					} else {
						obj[data[i].brandName] = parseInt(data[i].price)
					}
				}
				for (var i in obj) {
					var newobj = {
						name: i,
						value: obj[i]
					}
					arr.push(newobj)
				}
				this.drawBrandName(arr)
			},




			//统计图
			drawLine(data) {
				let chart1 = echarts.init(document.getElementById('chart1'))
				chart1.setOption({
					series: {
						type: 'pie',
						data: data
					}
				})
				var that = this
				chart1.on("click", function(params) {
					that.drawDataName(params.name)
				})
			},
			drawLine1(data) {
				let chart2 = echarts.init(document.getElementById('chart2'))
				chart2.setOption({
					series: {
						type: 'pie',
						data: data
					}
				})
			},
			drawBrandName(data) {
				let chart3 = echarts.init(document.getElementById("chart3"))
				chart3.setOption({
					series: {
						type: "pie",
						data: data
					}
				})
			},

			handleCurrentChange(val) {
				this.currentRow = val;
			}
		},
		filters: {
			getNum: function(data) {
				if (!data) return;
				return data.replace(/\:ton/, 't').replace(/\:cubic/, 'm³')

			},
			getJieDuan: function(obj) {
				if (typeof obj !== 'object') return;
				return obj.fromDate + '-' + obj.toDate + '天'
			},
			//鞋柜费
			filter1(obj) {
				let data = obj.卸柜费;
				if (!data[0]) return 0;
				return data[0].totalPrice
			},
			filter2(obj) {
				let data = obj.装柜费;
				if (!data[0]) return 0;
				return data[0].totalPrice
			},
			filter3(obj) {
				let data = obj.拆包费;
				if (!data[0]) return 0;
				return data[0].totalPrice
			},
			filter4(obj) {
				let data = obj.翻包费;
				if (!data[0]) return 0;
				return data[0].totalPrice
			}
		}
	}
</script>
