<template>
	<el-dialog append-to-body width="660px" v-dialogDrag title="费用类别管理" :visible.sync="showFees" center>
		<div @click="close">
			<div class="feesMain">
        <div class="feesType">
          <p>费用一级类目</p>
          <div class="typeBox">
            <ul>
              <li @click="getSmallType(key)" v-for="(val,key) in bigType" :key="key" :class="{ch:bigKey===key}">
                <div>
                  <span>{{val.name}}</span>
                  <i @click="midefy($event)" class="xiu iconfont xiugai"></i>
                  <i @click="removeFeestype(val)" class="remo iconfont shanchu"></i>
                </div>
                <label>
                  <input type="text" v-model="text" @keyup.enter="change(val,$event)" @blur="closeMidefy($event)">
                </label>
              </li>
              <li class="add">
                <label>
                  <input @click.stop="" type="text" v-model="text" @keyup.enter="addOneFeestype">
                </label>
                <i @click.stop="addOneFeestype" class="iconfont xuanzhong"></i>
              </li>
            </ul>
            <div class="addremove">
              <div @click.stop="openAdd(0)" class="divleft"><i class="iconfont xinjian"></i></div>
              <div @click="removeAll(bigType)" class="divright"><i class="iconfont shanchu"></i></div>
            </div>
          </div>
        </div>
        <div class="feesType">
          <p>费用二级类目</p>
          <div class="typeBox">
            <ul>
              <li v-for="(val,key) in smallType" :key='key'>
                <div>
                  <span>{{val.name}}</span>
                  <i @click="midefy($event)" class="xiu iconfont xiugai"></i>
                  <i @click="removeFeestype(val)" class="remo iconfont shanchu"></i>
                </div>
                <label>
                  <input type="text" v-model="text" @keyup.enter="change(val,$event)" @blur="closeMidefy($event)">
                </label>
              </li>
              <li class="add">
                <label>
                  <input @click.stop="" type="text" v-model="text" @keyup.enter="addTwoFesstype">
                </label>
                <i @click.stop="addTwoFesstype" class="iconfont xuanzhong"></i>
              </li>
            </ul>
            <div class="addremove">
              <div @click.stop="openAdd(1)" class="divleft"><i class="iconfont xinjian"></i></div>
              <div @click="removeAll(smallType)" class="divright"><i class="iconfont shanchu"></i></div>
            </div>
          </div>
        </div>
      </div>
		</div>
		<div style="margin-top:20px;text-align: center">
      <el-button type="primary" @click="showFees=false">确定</el-button>
		</div>
	</el-dialog>
</template>
<script>
	export default {
		// props:["fessData"],
		data() {
			return {
				tenantId:JSON.parse(this.$store.state.token).tenantId,
				showFees: false,
				bigType:[],
				smallType:[],
				bigKey:0,
				text:'',
			};
		},
		methods: {
      //打开费用类别
      open() {
        this.showFees = true;
        this.getFeesData()
      },
      //获取费用类别信息
      getFeesData() {
        this.$axios({
          method: 'get',
          url: '/apa/financeTable/showExpenseCategoryInfo',
          params: {
            tenantId: this.tenantId
          }
        }).then(res => {
          console.log(res);
          if (res && res.data.data) {
            this.bigType = res.data.data;
            this.getSmallType(this.bigKey)
          }else{
            this.bigType = []
          }
        })
      },
      //确定小类数据
      getSmallType(key) {
        this.smallType = this.bigType[key].expenseCategoryDtoList;
        this.bigKey = key
      },
      //打开添加栏
      openAdd(i) {
        this.text = '';
        document.getElementsByClassName('add')[i].style.display = 'block';
        document.getElementsByClassName('add')[i].getElementsByTagName('input')[0].focus()
      },
      //关闭添加栏
      close() {
        document.getElementsByClassName('add')[0].style.display = 'none';
        document.getElementsByClassName('add')[1].style.display = 'none'
      },
      //添加新的一级类目
      addOneFeestype() {
        this.$axios({
          method: 'post',
          url: '/apa/financeTable/addExpenseCategory',
          data: {
            creatorId: this.userId,
            memo: this.text,
            name: this.text,
            partentId: 0,
            tenantId: this.tenantId
          }
        }).then(res => {
          if(res&&res.data.data){
            document.getElementsByClassName('add')[0].style.display = 'none';
            this.getFeesData()
          }
        })
      },
      //添加二级类目
      addTwoFesstype() {
        console.log(this.bigType[this.bigKey].id);
        this.$axios({
          method: 'post',
          url: '/apa/financeTable/addExpenseCategory',
          data: {
            creatorId: this.userId,
            memo: this.text,
            name: this.text,
            partentId: this.bigType[this.bigKey].id,
            tenantId: this.tenantId
          }
        }).then(res => {
          if(res&&res.data.data){
            document.getElementsByClassName('add')[1].style.display = 'none';
            this.getFeesData()
          }

        })
      },
      //修改类目
      midefy(el){
        let dom = el.target.parentNode.parentNode;
        dom.getElementsByTagName('input')[0].style.display='block';
        dom.getElementsByTagName('input')[0].focus()
      },
      //修改类目
      change(data,el){
        this.$axios({
          method:'post',
          url:'/apa/financeTable/modifyExpenseCategory',
          data:{
            id:data.id,
            memo:this.text,
            name:this.text,
            tenantId:this.tenantId
          }
        }).then(res=>{
          if(res&&res.data.data){
            let dom = el.target;
            dom.style.display='none';
            this.getFeesData()
          }
        })
      },
      //关闭修改栏
      closeMidefy(el){
        el.target.style.display = 'none'
      },
      //删除费用类别
      removeFeestype(data){
        this.$axios({
          method:'post',
          url:'/apa/financeTable/deleteExpenseCategory',
          data:{
            id:data.id,
            status:0
          }
        }).then(res=>{
          console.log(res);
          if(res&&res.data.data){
            this.getFeesData()
          }
        })
      },
      removeAll(data){
        let arr = [];
        for(let i in data){
          arr.push(data[i].id)
        }
        this.$axios({
          method:'post',
          url:'/apa/financeTable/deleteExpenseCategoryByIds',
          data:arr
        }).then(res=>{
          console.log(res);
          if(res&&res.data.data){
            this.getFeesData()
          }
        })
      }
    }
	};
</script>
<style lang="scss" scoped>
	.feesMain {
		height: 490px;
		width: 600px;
		margin: 0 auto;

		.feesType {
			float: left;
			width: 280px;
			margin: 0 10px;
			height: 480px;
			overflow: hidden;

			p {
				text-align: center;
				margin: 10px 0;
			}

			.typeBox {

				height: 439px;
				border: 1px solid #ddd;

				ul {
					height: 413px;
					padding: 2px;

					li {
						height: 28px;
						line-height: 28px;
						margin-bottom: 1px;
						position: relative;

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
							height: 26px;
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
