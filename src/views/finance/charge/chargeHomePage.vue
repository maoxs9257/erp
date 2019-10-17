<template lang="html">
	<div class="module">
		<div class="module_right">
			<span class="module_set_btn" @click='openSet'>
				<i class="iconfont cebian-shezhi"></i>
			</span>
			<div class="module_right_main">
				<div class="item" v-if="out">
					<span>{{out|eMoney}}</span>
					<p>本月支出</p>
				</div>
				<div class="item" v-if="inm">
					<span>{{inm|eMoney}}</span>
					<p>本月收入</p>
				</div>
			</div>
		</div>
		<div class="module_main">
			<p class="module_main_title">收支记账</p>
			<div class="module_options" ref='options'>
				<div class="options_box clearfix" :style="{width:w+'px',height:h+'px'}">
					<div class="option" v-if='optionsData[0].show'>
						<a @click='$refs.ch1.open()'>
							<ym-round>
								<i class="iconfont caiwu-jizhangzhichu"></i>
							</ym-round>
							<span class="option_name">记账支出</span>
						</a>
					</div>
					<div class="option" v-if='optionsData[1].show'>
						<a @click='$refs.ch2.open()'>
							<ym-round>
								<i class="iconfont caiwu-jizhangshouru"></i>
							</ym-round>
							<span class="option_name">记账收入</span>
						</a>
					</div>
				</div>
			</div>
		</div>
		<!-- 设置 -->
		<ym-hos ref='setDia' :data='optionsData' @updata='changeOptions'></ym-hos>
		<!-- 选择弹窗 -->
		<ym-choice ref='ch1' title='记账支出'>
			<ym-choiceoption @open='seeNewRoleout' icon='caiwu-xinjianzhichu' slot='one' title='新建支出'></ym-choiceoption>
			<ym-choiceoption @open="goTo({name:'outMoney'})" icon='caiwu-zhichuliebiao' slot='two' title='支出列表'></ym-choiceoption>
		</ym-choice>
		<ym-choice ref='ch2' title='记账收入'>
			<ym-choiceoption @open='seeNewRolein' icon='caiwu-xinjianshouru' slot='one' title='新建收入'></ym-choiceoption>
			<ym-choiceoption @open="goTo({name:'inMoney'})" icon='caiwu-shouruliebiao' slot='two' title='收入列表'></ym-choiceoption>
		</ym-choice>
		<!-- 收入 -->
		<ym-inm ref='inmoney' @re="getIn"></ym-inm>
		<ym-outm @re="getOut" ref='outmoney'></ym-outm>
	</div>
</template>

<script>
	import round from '@/components/round.vue'
	import homeOptionSet from '@/components/homeOptionSet.vue'
	import choice from '@/components/choice.vue'
	import choiceOption from '@/components/choiceOption.vue'
	import inMoney from '@/components/inMoney.vue'
	import outMoney from '@/components/outMoney.vue'
	export default {
		data() {
			return {
				w: 0,
				h: 0,
				nums: 2,
				screenWidth: 0,
				optionsData: [
          {name:'记账支出',icon:'caiwu-jizhangzhichu',show:true},
					{name:'记账收入',icon:'caiwu-jizhangshouru',show:true}
				],
				asideData: {},
				inm: 0,
				out: 0,
				role: JSON.parse(this.$store.state.role),
		    tenantId: JSON.parse(this.$store.state.token).tenantId,
			}
		},
		mounted() {
			this.screenWidth = document.body.offsetWidth;
			window.onresize = () => {
				this.screenWidth = document.body.offsetWidth;
			};
			this.getIn();
		  this.getOut();
		},
		methods: {
			goTo(name) {
        this.$router.push(name)
			},
			seeNewRolein() {
				if (!this.role.erp_inout_new) {
					this.$message.error('没有新建权限');
				} else {
					this.$refs.inmoney.open(null)
				}
			},
			seeNewRoleout() {
				if (!this.role.erp_inout_new) {
					this.$message.error('没有新建权限');
				} else {
					this.$refs.outmoney.open(null)
				}
			},
      // 获取收入数据
      getIn(){
        let params = {
        	tenantId : this.tenantId,
          stat:2,
          type:1
        };
        this.$axios.get('/apa/financeTable/showFinancialAccounting',{params})
        .then(res=>{
          if(res.data&&res.data.data){
            let data = res.data.data;
            let sum = 0;
            data.forEach(val=>{
              sum += parseFloat(val.money)
            });
            this.inm = sum;
          }else{
            this.inm = 0;
          }
        })
      },
      // 获取支出数据
      getOut(){
        let params = {
          tenantId:this.tenantId,
          stat:2,
          type:2
        };
        this.$axios.get('/apa/financeTable/showFinancialAccounting',{params})
        .then(res=>{
          if(res.data&&res.data.data){
            let data = res.data.data;
            let sum = 0;
            data.forEach(val=>{
            	sum += parseFloat(val.money)
            });
            this.out = sum;
          }else{
          	this.out = 0
          }
        })
      },
			openSet() {
				this.$refs.setDia.open();
			},
			changeOptions(data) {
				this.optionsData = data;
				let num = 0;
				for (let i in data) {
					if (data[i].show) {
						num++;
					}
				}
				this.nums = num;
			},
			setWH() {
				let nums = this.nums;
				let width = this.$refs.options.offsetWidth;
				let {w,h} = this.getWH({nums,width});
				this.w = w;
				this.h = h;
			}
		},
		watch: {
			screenWidth: function() {
				this.setWH();
			},
			nums: function() {
				this.setWH();
			}
		},
		components: {
			'ym-round': round,
			'ym-hos': homeOptionSet,
			'ym-choice': choice,
			'ym-choiceoption': choiceOption,
			'ym-inm': inMoney,
			'ym-outm': outMoney
		},
	}
</script>
