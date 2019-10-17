<template>
	<div class="cheader">
		<p class="headertitle" v-text='title'></p>
		<router-link class="headerback" :to='to' @click.native='$emit("back")'><i class="iconfont fanhui"></i>返回</router-link>
		<slot></slot>
	</div>
</template>
<script>
export default{
	props:[
		"title",
		"to"
	],

};
</script>
<style lang="scss" scoped>
	.cheader{
		height: 70px;
		position: relative;
		.headertitle{
			line-height: 70px;
			color: #666666;
			font-size: 16px;
			text-align: center;
		}
		.headerback{
			position: absolute;
			top: 20px;
			left: 0px;
			display: block;
			color: #409EFF;
			font-size: 14px;
			i{
				margin-right: 2px;
			}
		}
	}
</style>
