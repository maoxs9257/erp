<template lang="html">
	<div class="set_main">
		<p class="set_main_title">工具设置</p>
		<div class="set_main_content">
			<div class="content_item" @click="openRule">
				<i class="iconfont jinxiaocun-quanxian"></i>
				<p>账户权限</p>
			</div>
		</div>
		<div class="set_page" :class="{activePage:page}">
			<ym-rule ref='rule' v-if='pages==1' @close='pages=null;page=false'></ym-rule>
		</div>
	</div>
</template>

<script>
	import accRule from '@/views/set/accRule.vue'
	export default {
		components: {
			"ym-rule": accRule,
		},
		data() {
			return {
				page: false,
				pages: null,
			}
		},
		methods: {
			openRule() {
				this.pages = 1;
				this.page = true;
				setTimeout(() => {
					this.$refs.rule.getData;
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.set_main {
		background: #f2f2f2;
		position: relative;

		.set_main_title {
			font-size: 18px;
			text-align: center;
			margin-top: 25px;
		}

		.set_main_content {
			position: absolute;
			height: 155px;
			top: calc(50% - 77px);
			width: 175px;
			left: calc(50% - 87px);

			.content_item {
				width: 175px;
				height: 155px;
        padding-top: 24px;
				text-align: center;
				cursor: pointer;
        background-color: #ffffff;
        border-radius: 5px;
        border: 2px solid #ffffff;
        box-shadow: 0 8px 20px 0 rgba(0, 0, 0, 0.08);
				i {
					font-size: 70px;
					line-height: 70px;
          color: #3986EF;
				}
				&:hover {
          border: 2px solid #3986EF;
				}
			}
		}
		.set_page {
			position: absolute;
			background: #fff;
			width: 100%;
			height: 100%;
			top: 0;
			left: 100%;
		}

		.set_page.activePage {
			left: 0;
			animation: right 0.5s linear;
		}
	}

	@keyframes right {
		0% {
			left: 100%;
		}

		100% {
			left: 0%;
		}
	}

	@keyframes left {
		0% {
			left: 0%;
		}

		100% {
			left: 100%;
		}
	}
</style>
