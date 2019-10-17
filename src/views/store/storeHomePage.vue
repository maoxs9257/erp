<template lang="html">
	<div class="subhome">
		<div class="subhome_content">
			<div class="subhome_content_top">
				<p class="top_title">本月概况</p>
				<div class="top_options_box">
					<div class="top_option">
						<ym-round maxDeg='270' color="#32D248">
							<p class='p1'>232154</p>
							<p>出库</p>
						</ym-round>
					</div>
					<div class="top_option">
						<ym-round maxDeg='270' color="#F86F5A">
							<p class='p1'>232154</p>
							<p>入库</p>
						</ym-round>
					</div>
					<div class="top_option">
						<ym-round maxDeg='270' color="#FFA300">
							<p class='p1'>232154</p>
							<p>仓库</p>
						</ym-round>
					</div>
				</div>
			</div>
			<div class="subhome_content_fot">
				<router-link :to="{ name: 'outStoreHome'}">
					<img src="../../assets/imgs/out.png" alt="">
					<p>出库</p>
				</router-link>
				<router-link :to="{ name: 'inStoreHome'}">
					<img src="../../assets/imgs/in.png" alt="">
					<p>入库</p>
				</router-link>
				<router-link :to="{ name: 'storeManageHome'}">
					<img src="../../assets/imgs/store.png" alt="">
					<p>仓库</p>
				</router-link>
				<router-link :to="{ name: 'storeCount'}">
					<img src="../../assets/imgs/out.png" alt="">
					<p>统计</p>
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
