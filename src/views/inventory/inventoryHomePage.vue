<template lang="html">
	<div class="subhome">
		<div class="subhome_content">
			<div class="subhome_content_top">
				<p class="top_title">本月概况</p>
				<div class="top_options_box">
					<div class="top_option">
						<ym-round maxDeg='270' color="#32D248">
							<p class='p1'>{{data.sellPrice|eMoney}}</p>
							<p>销售</p>
						</ym-round>
					</div>
					<div class="top_option">
						<ym-round maxDeg='270' color="#F86F5A">
							<p class='p1'>{{data.buyAmountPrice|eMoney}}</p>
							<p>采购支出</p>
						</ym-round>
					</div>
					<div class="top_option">
						<ym-round maxDeg='270' color="#FFA300">
							<p class='p1'>{{(data.sellPrice-data.buyAmountPrice)|eMoney}}</p>
							<p>营业利润</p>
						</ym-round>
					</div>
				</div>
			</div>
			<div class="subhome_content_fot">
				<router-link :to="{ name: 'productHome'}">
					<img src="../../assets/imgs/chanpin.png" alt="">
					<p>产品</p>
				</router-link>
				<router-link :to="{ name: 'customerHome'}">
					<img src="../../assets/imgs/kehu.png" alt="">
					<p>客户</p>
				</router-link>
				<router-link :to="{ name: 'saleHome'}">
					<img src="../../assets/imgs/xiaoshou.png" alt="">
					<p>销售</p>
				</router-link>
				<router-link :to="{ name: 'purchaseHome'}">
					<img src="../../assets/imgs/caigou.png" alt="">
					<p>采购</p>
				</router-link>
			</div>
		</div>
	</div>
</template>

<script>
	import round from '@/components/round.vue'
	export default {
		components: {
			"ym-round": round
		},
		data() {
			return {
				tenantId: JSON.parse(this.$store.state.token).tenantId,
		    data: {},
				role: JSON.parse(this.$store.state.role),
			}
		},
		methods: {
			getData() {
				let params = {tenantId:this.tenantId };
				this.$axios.get('/apt/purposeForm/purposeSellMonth',{params})
        .then(res=>{
          if(res.data&&res.data.data[0]){
            this.data = res.data.data[0];
          }else{
            this.data={}
          }
        })
			}
		},
		mounted() {
			this.getData();
		},
	}
</script>

<style lang="scss">
	.subhome .top_option .round span {
		border-top: 3px solid #11bf67;
		border-left: 3px solid #11bf67;
		border-right: 3px solid #f8f8f8;
		border-bottom: 3px solid #f8f8f8;
	}
</style>
