<template lang="html">
	<div class="subhome">
		<div class="subhome_content">
			<div class="subhome_content_top">
				<p class="top_title">财务概况</p>
				<div class="top_options_box">
					<div class="top_option">
						<ym-round maxDeg='270' color="#32D248">
							<p class='p1'>232154</p>
							<p>应收款</p>
						</ym-round>
					</div>
					<div class="top_option">
						<ym-round maxDeg='270' color="#F86F5A">
							<p class='p1'>232154</p>
							<p>应付款</p>
						</ym-round>
					</div>
					<div class="top_option">
						<ym-round maxDeg='270' color="#FFA300">
							<p class='p1'>232154</p>
							<p>借入</p>
						</ym-round>
					</div>
				</div>
			</div>
			<div class="subhome_content_fot">
				<router-link :to="{ name: 'chargeHome'}">
					<img src="../../assets/imgs/jizhang.png" alt="">
					<p>收支记账</p>
				</router-link>
				<router-link :to="{ name: 'repayHome'}">
					<img src="../../assets/imgs/repay.png" alt="">
					<p>应收应付</p>
				</router-link>
				<router-link :to="{ name: 'accountHome'}">
					<img src="../../assets/imgs/zhanghu.png" alt="">
					<p>资金账户</p>
				</router-link>
				<router-link :to="{ name: 'toloanHome'}">
					<img src="../../assets/imgs/jiedai.png" alt="">
					<p>借入借出</p>
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
