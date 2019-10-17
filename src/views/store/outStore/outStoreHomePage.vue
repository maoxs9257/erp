<template lang="html">
	<div class="module">
		<div class="module_right">
			<span class="module_set_btn" @click='openSet'>
				<i class="iconfont cebian-shezhi"></i>
			</span>
			<div class="module_right_main">
				<div class="item" v-if="asideData.orderQuantity">
					<span>{{asideData.orderQuantity}}</span>
					<p>本月出库</p>
				</div>
				<div class="item" v-if="asideData.tonCount||asideData.numberCount||asideData.cubicCount">
					<span v-if="asideData.tonCount">{{asideData.tonCount}}t</span>
					<span v-if="asideData.numberCount">{{asideData.numberCount}}p</span>
					<span v-if="asideData.cubicCount">{{asideData.cubicCount}}m³</span>
					<p>出库数量</p>
				</div>
				<div class="item" v-if="asideData.storeMoney">
					<span>{{asideData.storeMoney|eMoney}}</span>
					<p>库存金额</p>
				</div>
			</div>
		</div>
		<div class="module_main">
			<p class="module_main_title">出库管理</p>
			<div class="module_options" ref='options'>
				<div class="options_box clearfix" :style="{width:w+'px',height:h+'px'}">
					<div class="option" v-if='optionsData[0].show'>
						<a @click="goTo({name:'preOutList'})">
							<ym-round>
								<i class="iconfont cangku-chukuliebiao"></i>
							</ym-round>
							<span class="option_name">预出库列表</span>
						</a>
					</div>
					<div class="option" v-if='optionsData[1].show'>
						<a @click="goTo({name:'outList'})">
							<ym-round>
								<i class="iconfont cangku-chukuliebiao"></i>
							</ym-round>
							<span class="option_name">出库列表</span>
						</a>
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
				tenantId: JSON.parse(this.$store.state.token).tenantId,
				w: 0,
				h: 0,
				nums: 2,
				screenWidth: 0,
				optionsData: [
					{name:'预出库列表',icon:'cangku-chukuliebiao',show:true},
					{name:'出库列表',icon:'cangku-chukuliebiao',show:true}
				],
				asideData: {},
				role: JSON.parse(this.$store.state.role),
			}
		},
		mounted() {
			this.getData();
			this.screenWidth = document.body.offsetWidth;
			window.onresize = () => {
				this.screenWidth = document.body.offsetWidth;
			}
		},
		methods: {
			goTo(name) {
        this.$router.push(name);
			},
			getData() {
				let params = {tenantId:this.tenantId};
				this.$axios.get('/api/storeOutForm/{tenantId}',{params})
        .then(res=>{
        	if(res.data&&res.data.data){
        		this.asideData = res.data.data;
          }else{
        		this.asideData = {};
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
			'ym-hos': homeOptionSet
		}
	}
</script>
