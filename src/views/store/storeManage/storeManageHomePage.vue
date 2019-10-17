<template lang="html">
	<div class="module">
		<div class="module_right">
			<span class="module_set_btn" @click='openSet'>
				<i class="iconfont cebian-shezhi"></i>
			</span>
			<div class="module_right_main">
				<div class="item" v-if="info.orderQuantity">
					<span>{{info.orderQuantity}}</span>
					<p>仓库数量</p>
				</div>
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
			<p class="module_main_title">仓库管理</p>
			<div class="module_options" ref='options'>
				<div class="options_box clearfix" :style="{width:w+'px',height:h+'px'}">
					<div class="option" v-if='optionsData[0].show'>
						<router-link :to="{name:'storeManage'}">
							<ym-round>
								<i class="iconfont cebian-cangkuguanli"></i>
							</ym-round>
							<span class="option_name">仓库管理</span>
						</router-link>
					</div>
					<div class="option" v-if='optionsData[1].show'>
						<a @click='$refs.ch1.open()'>
							<ym-round>
								<i class="iconfont cangku-kucuntiaobo"></i>
							</ym-round>
							<span class="option_name">库存调拨</span>
						</a>
					</div>
					<div class="option" v-if='optionsData[2].show'>
						<a @click='$refs.ch2.open()'>
							<ym-round>
								<i class="iconfont cangku-kucunpandian"></i>
							</ym-round>
							<span class="option_name">库存盘点</span>
						</a>
					</div>
				</div>
			</div>
		</div>
		<!-- 设置 -->
		<ym-hos ref='setDia' :data='optionsData' @updata='changeOptions'></ym-hos>
		<!-- 选择弹窗 -->
		<ym-choice ref='ch1' title='库存调拨'>
			<ym-choiceoption title='新建库存调拨' url='newAllocation' icon='xinjiankucuntiaobo' slot='one'></ym-choiceoption>
			<ym-choiceoption title='库存调拨列表' url='allocationList' icon='kucuntiaoboliebiao' slot='two'></ym-choiceoption>
		</ym-choice>
		<ym-choice ref='ch2' title='库存盘点'>
			<ym-choiceoption title='新建库存盘点' url='newCheck' icon='xinjinkucunpandian' slot='one'></ym-choiceoption>
			<ym-choiceoption title='库存盘点列表' url='checkList' icon='kucunpandianliebiao' slot='two'></ym-choiceoption>
		</ym-choice>
	</div>
</template>

<script>
	import round from '@/components/round.vue'
	import homeOptionSet from '@/components/homeOptionSet.vue'
	import choice from '@/components/choice.vue'
	import choiceOption from '@/components/choiceOption.vue'
	export default {
		data() {
			return {
				w: 0,
				h: 0,
				nums: 3,
				screenWidth: 0,
				optionsData: [{name:'仓库管理',icon:'cebian-cangkuguanli',show:true},
					{name:'库存调拨',icon:'cangku-kucuntiaobo',show:true},
					{name:'库存盘点',icon:'cangku-kucunpandian',show:true}
				],
				tenantId: JSON.parse(this.$store.state.token).tenantId,
				info: {},
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
			'ym-choice': choice,
			'ym-choiceoption': choiceOption
		}
	}
</script>
