<template lang="html">
	<div class="module">
		<div class="module_right">
			<span class="module_set_btn" @click='openSet'>
				<i class="iconfont cebian-shezhi"></i>
			</span>
			<div class="module_right_main">
				<div class="item">
					<span>{{num}}</span>
					<p>账户数量</p>
				</div>
				<div class="item">
					<span>{{sumPrice|eMoney}}</span>
					<p>总金额</p>
				</div>
			</div>
		</div>
		<div class="module_main">
			<p class="module_main_title">资金账户</p>
			<div class="module_options" ref='options'>
				<div class="options_box clearfix" :style="{width:w+'px',height:h+'px'}">
					<div class="option" v-if='optionsData[0].show'>
						<router-link :to="{name:'account'}">
							<ym-round>
								<i class="iconfont cebian-zijinzhanghao"></i>
							</ym-round>
							<span class="option_name">资金账户</span>
						</router-link>
					</div>
					<div class="option" v-if='optionsData[1].show'>
						<router-link :to="{name:'transfer'}">
							<ym-round>
								<i class="iconfont caiwu-zhanghaozhuanzhang"></i>
							</ym-round>
							<span class="option_name">账号转账</span>
						</router-link>
					</div>
					<div class="option" v-if='optionsData[2].show'>
						<router-link :to="{name:'flow'}">
							<ym-round>
								<i class="iconfont caiwu-caiwuliushui"></i>
							</ym-round>
							<span class="option_name">财务流水</span>
						</router-link>
					</div>
				</div>
			</div>
		</div>
		<!-- 设置 -->
		<ym-hos ref='setDia' :data='optionsData' @updata='changeOptions'></ym-hos>
	</div>
</template>

<script>
	import round from '@/components/round.vue'
	import homeOptionSet from '@/components/homeOptionSet.vue'
	export default {
		data() {
			return {
				w: 0,
				h: 0,
				nums: 3,
				screenWidth: 0,
				optionsData: [
					{name:'资金账户',icon:'cebian-zijinzhanghao',show:true},
          {name:'账号转账',icon:'caiwu-zhanghaozhuanzhang',show:true},
          {name:'财务流水',icon:'caiwu-caiwuliushui',show:true}
        ],
				num: 0,
				sumPrice: 0,
				tenantId: JSON.parse(this.$store.state.token).tenantId,
				role: JSON.parse(this.$store.state.role),
			}
		},
		mounted() {
			this.screenWidth = document.body.offsetWidth;
			window.onresize = () => {
				this.screenWidth = document.body.offsetWidth;
			};
			this.getData();
		},
		methods: {
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
			getData() {
				let params = {tenantId:this.tenantId};
				this.$axios.get('/apa/financeTable/showPaymentAccount',{params})
        .then(res=>{
        	if(res.data&&res.data.data){
            let data = res.data.data;
            let sumPrice = 0;
            this.num = data.length;
            data.forEach((val)=>{
            	sumPrice += parseFloat(val.remainingSum)
            });
            this.sumPrice = sumPrice;
          }else{
        		this.num = 0;
        		this.sumPrice = 0;
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
			'ym-hos': homeOptionSet
		}
	}
</script>
