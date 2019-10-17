<template lang="html">
	<div class="module">
		<div class="module_right">
			<span class="module_set_btn" @click='openSet'>
				<i class="iconfont cebian-shezhi"></i>
			</span>
			<div class="module_right_main">
				<div class="item">
					<span>{{inSum | eMoney}}</span>
					<p>借入总额</p>
				</div>
				<div class="item">
					<span>{{outSum | eMoney}}</span>
					<p>借出总额</p>
				</div>
			</div>
		</div>
		<div class="module_main">
			<p class="module_main_title">借入借出</p>
			<div class="module_options" ref='options'>
				<div class="options_box clearfix" :style="{width:w+'px',height:h+'px'}">
					<div class="option" v-if='optionsData[0].show'>
						<a @click='$refs.ch1.open()'>
							<ym-round>
								<i class="iconfont caiwu-jieruguanli"></i>
							</ym-round>
							<span class="option_name">借入管理</span>
						</a>
					</div>
					<div class="option" v-if='optionsData[1].show'>
						<a @click='$refs.ch2.open()'>
							<ym-round>
								<i class="iconfont caiwu-jiechuguanli"></i>
							</ym-round>
							<span class="option_name">借出管理</span>
						</a>
					</div>
				</div>
			</div>
		</div>
		<!-- 设置 -->
		<ym-hos ref='setDia' :data='optionsData' @updata='changeOptions'></ym-hos>
		<!-- 选择弹窗 -->
		<ym-choice ref='ch1' title='借入管理'>
			<ym-choiceoption title='新建借入' @open='seeRoleIn' icon='caiwu-xinjianjieru' slot='one'></ym-choiceoption>
			<ym-choiceoption title='借入列表' @open="goTo({name:'loanInList'})" icon='caiwu-jieruliebiao' slot='two'></ym-choiceoption>
		</ym-choice>
		<ym-choice ref='ch2' title='借出管理'>
			<ym-choiceoption title='新建借出' @open='seeRoleOut' icon='caiwu-xinjianjiechu' slot='one'></ym-choiceoption>
			<ym-choiceoption title='借出列表' @open="goTo({name:'loanOutList'})" icon='caiwu-jiechuliebiao' slot='two'></ym-choiceoption>
		</ym-choice>
		<!-- 借入借出弹窗 -->
		<ym-loanin ref='loanin' @re='$refs.ch1.close();getToloanIn()'></ym-loanin>
		<ym-loanout ref='loanout' @re='$refs.ch2.close();getToloanOut()'></ym-loanout>
	</div>
</template>

<script>
	import round from '@/components/round.vue'
	import homeOptionSet from '@/components/homeOptionSet.vue'
	import choice from '@/components/choice.vue'
	import choiceOption from '@/components/choiceOption.vue'
	import loanIn from "@/components/loanin.vue"
	import loanOut from '@/components/loanout.vue'
	export default {
		data() {
			return {
				w: 0,
				h: 0,
				nums: 2,
				screenWidth: 0,
				optionsData: [
					{name:'借入管理',icon:'caiwu-jieruguanli',show:true},
					{name:'借出管理',icon:'caiwu-jiechuguanli',show:true}
				],
				tenantId: JSON.parse(this.$store.state.token).tenantId,
				inSum: 0,
				outSum: 0,
				role: JSON.parse(this.$store.state.role),
			}
		},
		mounted() {
			this.screenWidth = document.body.offsetWidth;
			window.onresize = () => {
				this.screenWidth = document.body.offsetWidth;
			};
			this.getToloanIn();
			this.getToloanOut();
		},
		methods: {
			goTo(name) {
        this.$router.push(name)
			},
			seeRoleIn() {
				if (!this.role.erp_loan_new) {
					this.$message.error('没有权限')
				} else {
					this.$refs.loanin.open()
				}
			},
			seeRoleOut() {
				if (!this.role.erp_loan_new) {
					this.$message.error('没有权限')
				} else {
					this.$refs.loanout.open()
				}
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
			},
      getToloanIn(){
				let params = {
					tenantId:this.tenantId,
          type:3
        };
				this.$axios.get('/apa/financeTable/showFinanceInfo',{params})
        .then(res=>{
        	if(res.data&&res.data.data){
        		let num = 0;
        		let data = res.data.data;
        		data.forEach((val)=>{
        			num += parseFloat(val.remainingSum)
            });
        		this.inSum = num;
          }else{
        		this.inSum = 0;
          }
        })
      },
      getToloanOut(){
				let params = {
					tenantId:this.tenantId,
          type:4
        };
				this.$axios.get('/apa/financeTable/showFinanceInfo',{params})
        .then(res=>{
        	if(res.data&&res.data.data){
        		let num = 0;
        		let data = res.data.data;
        		data.forEach((val)=>{
        			num += parseFloat(val.remainingSum)
            });
        		this.outSum = num;
          }else{
        		this.outSum = 0;
          }
        })
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
			'ym-loanin': loanIn,
			'ym-loanout': loanOut,
		}
	};
</script>
