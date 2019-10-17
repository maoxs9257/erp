<template lang="html">
	<div class="module">
		<div class="module_right">
			<span class="module_set_btn" @click='openSet'>
				<i class="iconfont cebian-shezhi"></i>
			</span>
			<div class="module_right_main">
				<div class="item" v-if="data.sellNum">
					<span>{{data.sellNum}}</span>
					<p>今日订单</p>
				</div>
				<div class="item" v-if="data.DayAmount">
					<span>{{data.DayAmount|eMoney}}</span>
					<p>今日销售</p>
				</div>
				<div class="item" v-if="data.MonthAmount">
					<span>{{data.MonthAmount|eMoney}}</span>
					<p>本月销售</p>
				</div>
			</div>
		</div>
		<div class="module_main">
			<p class="module_main_title">销售管理</p>
			<div class="module_options" ref='options'>
				<div class="options_box clearfix" :style="{width:w+'px',height:h+'px'}">
					<div class="option" v-if='optionsData[0].show'>
						<router-link :to="{name:'openSale'}">
							<ym-round>
								<i class="iconfont jinxiaocun-xiaoshoukaidan"></i>
							</ym-round>
							<span class="option_name">销售开单</span>
						</router-link>
					</div>
					<div class="option" v-if='optionsData[1].show'>
						<router-link :to="{name:'saleList'}">
							<ym-round>
                <p class="nnp" v-if="news>0">{{news}}</p>
								<i class="iconfont jinxiaocun-xiaoshouliebiao"></i>
							</ym-round>
							<span class="option_name">销售列表</span>
						</router-link>
					</div>
					<div class="option" v-if='optionsData[2].show'>
						<router-link :to="{name:'mySale'}">
							<ym-round>
								<i class="iconfont jinxiaocun-wodexiaoshou"></i>
							</ym-round>
							<span class="option_name">我的销售</span>
						</router-link>
					</div>
<!--					<div class="option" v-if='optionsData[3].show'>-->
<!--						<router-link :to="{name:'mySale'}">-->
<!--							<ym-round>-->
<!--								<i class="iconfont jinxiaocun-daijiaofudingdan"></i>-->
<!--							</ym-round>-->
<!--							<span class="option_name">待交付订单</span>-->
<!--						</router-link>-->
<!--					</div>-->
					<div class="option" v-if='optionsData[3].show'>
						<router-link :to="{name:'saleDep'}">
							<ym-round>
								<i class="iconfont jinxiaocun-xiaoshoubumen"></i>
							</ym-round>
							<span class="option_name">销售部门</span>
						</router-link>
					</div>
					<div class="option" v-if='optionsData[4].show'>
						<router-link :to="{name:'returnGoods'}">
							<ym-round>
								<i class="iconfont jinxiaocun-tuihuoliebiao"></i>
							</ym-round>
							<span class="option_name">退货列表</span>
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
					{name:'销售开单',icon:'jinxiaocun-xiaoshoukaidan',show:true},
					{name:'销售列表',icon:'jinxiaocun-xiaoshouliebiao',show:true},
					{name:'我的销售',icon:'jinxiaocun-wodexiaoshou',show:true},
					{name:'销售部门',icon:'jinxiaocun-xiaoshoubumen',show:true},
					{name:'退货列表',icon:'jinxiaocun-tuihuoliebiao',show:true}
				],
				role: JSON.parse(this.$store.state.role),
		    tenantId: JSON.parse(this.$store.state.token).tenantId,
        data:{},
			}
		},
    computed:{
      news:function () {
        let data = this.$store.state.news.sellForm;
		    return data ? data.length : 0
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
        this.$axios.get('/apt/purposeForm/sellRight',{params})
        .then(res=>{
        	if(res.data&&res.data.data){
            let data= res.data.data;
            let obj = {};
            data.forEach((val)=>{
            	if(val){
            		obj[val.split(':')[0]] = val.split(":")[1];
              }
            });
            this.data = obj
          }else{
            this.data = {}
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
