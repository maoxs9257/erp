<template lang="html">
	<div class="module">
		<div class="module_right">
			<span class="module_set_btn" @click='openSet'>
				<i class="iconfont cebian-shezhi"></i>
			</span>
			<div class="module_right_main">
        <div class="item" v-if="data.customerNum">
          <span>{{data.customerNum}}</span>
          <p>客户</p>
        </div>
        <div class="item" v-if="data.receivableAmount">
          <span>{{data.receivableAmount|eMoney}}</span>
          <p>应收总额</p>
        </div>
        <div class="item" v-if="data.payableAmount">
          <span>{{data.payableAmount|eMoney}}</span>
          <p>应付总额</p>
        </div>
			</div>
		</div>
		<div class="module_main">
			<p class="module_main_title">应收应付</p>
			<div class="module_options" ref='options'>
				<div class="options_box clearfix" :style="{width:w+'px',height:h+'px'}">
					<div class="option" v-if='optionsData[0].show'>
						<router-link :to="{ name: 'customer'}">
							<ym-round>
								<i class="iconfont caiwu-kehuyingshou"></i>
							</ym-round>
							<span class="option_name">客户应收</span>
						</router-link>
					</div>
					<div class="option" v-if='optionsData[1].show'>
						<router-link :to="{ name: 'supplier'}">
							<ym-round>
								<i class="iconfont caiwu-gongyingshangyingshou"></i>
							</ym-round>
							<span class="option_name">供应商应付</span>
						</router-link>
					</div>
					<div class="option" v-if='optionsData[2].show'>
						<router-link :to="{ name: 'open'}">
							<ym-round>
								<i class="iconfont caiwu-kaizhenggongsiyingfu"></i>
							</ym-round>
							<span class="option_name">开公司应付</span>
						</router-link>
					</div>
					<div class="option" v-if='optionsData[3].show'>
						<router-link :to="{ name: 'clear'}">
							<ym-round>
								<i class="iconfont caiwu-qingguangongsiyingfu"></i>
							</ym-round>
							<span class="option_name">清关公司应付</span>
						</router-link>
					</div>
					<div class="option" v-if='optionsData[4].show'>
						<router-link :to="{ name: 'store'}">
							<ym-round>
								<i class="iconfont caiwu-cangchugongsiyingfu"></i>
							</ym-round>
							<span class="option_name">仓储公司应付</span>
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
				nums: 5,
				screenWidth: 0,
				optionsData: [
					{name:'客户应收',icon:'caiwu-kehuyingshou',show:true},
					{name:'供应商应付',icon:'caiwu-gongyingshangyingshou',show:true},
					{name:'开公司应付',icon:'caiwu-kaizhenggongsiyingfu',show:true},
					{name:'清关公司应付',icon:'caiwu-qingguangongsiyingfu',show:true},
					{name:'仓储公司应付',icon:'caiwu-cangchugongsiyingfu',show:true}
				],
		    data:{},
		    tenantId: JSON.parse(this.$store.state.token).tenantId,
			}
		},
		mounted() {
			this.screenWidth = document.body.offsetWidth;
			window.onresize = () => {
				this.screenWidth = document.body.offsetWidth;
			};
			this.getAsideData();
		},
		methods: {
      getAsideData(){
        let params = {tenantId:this.tenantId};
        this.$axios.get('/apt/purposeForm/reciprocatingRight',{params})
          .then(res=>{
            if(res.data&&res.data.data){
              let data = res.data.data;
              let obj = {};
              data.forEach(val=>{
              	if(val) obj[val.split(':')[0]] = val.split(':')[1];
              });
              this.data = obj;
            }else{
              this.data = {};
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
				let {
					w,
					h
				} = this.getWH({
					nums,
					width
				});
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
