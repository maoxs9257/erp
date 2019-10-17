<template lang="html">
	<div class="module">
		<div class="module_right">
			<span class="module_set_btn" @click='openSet'>
				<i class="iconfont cebian-shezhi"></i>
			</span>
		</div>
		<div class="module_main">
			<p class="module_main_title">产品管理</p>
			<div class="module_options" ref='options'>
				<div class="options_box clearfix" :style="{width:w+'px',height:h+'px'}">
					<div class="option" v-if='optionsData[0].show'>
						<a @click='open'>
							<ym-round>
								<i class="iconfont jinxiaocun-chanpinshezhi"></i>
							</ym-round>
							<span class="option_name">产品设置</span>
						</a>
					</div>
				</div>
			</div>
		</div>
		<!-- 设置 -->
		<ym-hos ref='setDia' :data='optionsData' @updata='changeOptions'></ym-hos>
		<!-- 产品类别 -->
		<ym-fees ref='feestype' @re=''></ym-fees>
	</div>
</template>

<script>
	import round from '@/components/round.vue'
	import homeOptionSet from '@/components/homeOptionSet.vue'
	import feestype from '@/views/inventory/product/feestype.vue'
	export default {
		data() {
			return {
				w: 0,
				h: 0,
				nums: 1,
				screenWidth: 0,
				optionsData: [{
					name: '产品设置',
					icon: 'jinxiaocun-chanpinshezhi',
					show: true
				}],
        role:JSON.parse(this.$store.state.role),
			}
		},
		mounted() {
			this.screenWidth = document.body.offsetWidth;
			window.onresize = () => {
				this.screenWidth = document.body.offsetWidth;
			}
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
				let {
					w,
					h
				} = this.getWH({
					nums,
					width
				});
				this.w = w;
				this.h = h;
			},
      // 打开产品管理
      open(){
        if(this.role.erp_product_look){
          this.$refs.feestype.open();
        }else{
          this.$message.error('没有权限')
        }
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
			'ym-fees': feestype
		}
	}
</script>
