<template lang="html">
	<div class="module">
		<div class="module_right">
			<span class="module_set_btn" @click='openSet'>
				<i class="iconfont cebian-shezhi"></i>
			</span>
			<div class="module_right_main">
        <div class="item" v-if="info.tonCount||info.numberCount||info.cubicCount">
          <span v-if="info.tonCount">{{info.tonCount}}T</span>
          <span v-if="info.numberCount">{{info.numberCount}}P</span>
          <span v-if="info.cubicCount">{{info.cubicCount}}m³</span>
          <p>库存数量</p>
        </div>
        <div class="item" v-if="info.storeMoney">
          <span>{{info.storeMoney|eMoney}}</span>
          <p>库存金额</p>
        </div>
			</div>
		</div>
		<div class="module_main">
			<p class="module_main_title">仓库库存</p>
			<div class="module_options" ref='options'>
				<div class="options_box clearfix" :style="{width:w+'px',height:h+'px'}">
					<div class="option" v-if='optionsData[0].show'>
						<router-link :to="{ name: 'stockQuery'}">
							<ym-round>
								<i class="iconfont jinxiaocun-cangkuchaxun"></i>
							</ym-round>
							<span class="option_name">仓库查询</span>
						</router-link>
					</div>
					<div class="option" v-if='optionsData[1].show'>
						<router-link :to="{ name: 'stockFlow'}">
							<ym-round>
								<i class="iconfont jinxiaocun-kucunliushui"></i>
							</ym-round>
							<span class="option_name">库存流水</span>
						</router-link>
					</div>
					<div class="option" v-if='optionsData[2].show'>
						<router-link :to="{ name: 'stockLock'}">
							<ym-round>
								<i class="iconfont jinxiaocun-kucunsuoding"></i>
							</ym-round>
							<span class="option_name">库存锁定</span>
						</router-link>
					</div>
					<div class="option" v-if='optionsData[3].show'>
						<router-link :to="{ name: 'lockList'}">
							<ym-round>
                <p class="nnp" v-if="news>0">{{news}}</p>
								<i class="iconfont jinxiaocun-suodingliebiao"></i>
							</ym-round>
							<span class="option_name">锁定列表</span>
						</router-link>
					</div>
					<div class="option" v-if='optionsData[4].show'>
						<router-link :to="{ name: 'onRoadList'}">
							<ym-round>
								<i class="iconfont jinxiaocun-zaitumingxi"></i>
							</ym-round>
							<span class="option_name">在途明细</span>
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
		    info:{},
				optionsData: [
					{name:'仓库查询',icon:'jinxiaocun-cangkuchaxun',show:true},
					{name:'库存流水',icon:'jinxiaocun-kucunliushui',show:true},
					{name:'库存锁定',icon:'jinxiaocun-kucunsuoding',show:true},
					{name:'锁定列表',icon:'jinxiaocun-suodingliebiao',show:true},
					{name:'在途明细',icon:'jinxiaocun-zaitumingxi',show:true}
				],
		    tenantId: JSON.parse(this.$store.state.token).tenantId,
			}
		},
    computed:{
      news:function () {
        let data = this.$store.state.news.lockForm;
		    return data ? data.length : 0
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
      getData() {
        let params = {tenantId:this.tenantId};
        this.$axios.get('/api/storePackage/storePriceAmount',{params})
          .then(res=>{
            if(res.data&&res.data.data){
              this.info = res.data.data;
            }else{
              this.info = {};
            }
          });
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
