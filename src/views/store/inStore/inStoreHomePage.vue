<template lang="html">
	<div class="module">
		<div class="module_right">
			<span class="module_set_btn" @click='openSet'>
				<i class="iconfont cebian-shezhi"></i>
			</span>
			<div class="module_right_main">
				<div class="item" v-if="asideData.orderQuantity">
					<span>{{asideData.orderQuantity}}</span>
					<p>本月入库</p>
				</div>
				<div class="item" v-if="asideData.tonCount||asideData.numberCount||asideData.cubicCount">
					<span v-if="asideData.tonCount">{{asideData.tonCount}}t</span>
					<span v-if="asideData.numberCount">{{asideData.numberCount}}p</span>
					<span v-if="asideData.cubicCount">{{asideData.cubicCount}}m³</span>
					<p>入库数量</p>
				</div>
				<div class="item" v-if="asideData.storeMoney">
					<span>{{asideData.storeMoney|eMoney}}</span>
					<p>入库金额</p>
				</div>
			</div>
		</div>
		<div class="module_main">
			<p class="module_main_title">入库管理</p>
			<div class="module_options" ref='options'>
				<div class="options_box clearfix" :style="{width:w+'px',height:h+'px'}">
					<div class="option" v-if='optionsData[0].show'>
						<a @click='$refs.ch1.open()'>
							<ym-round>
								<i class="iconfont cangku-xinjianruku"></i>
							</ym-round>
							<span class="option_name">新建入库</span>
						</a>
					</div>
					<div class="option" v-if='optionsData[1].show'>
						<router-link :to="{ name: 'inList'}">
							<ym-round>
                <p class="nnp" v-if="news>0">{{news}}</p>
								<i class="iconfont cangku-rukuliebiao"></i>
							</ym-round>
							<span class="option_name">入库列表</span>
						</router-link>
					</div>
				</div>
			</div>
		</div>
		<!-- 设置 -->
		<ym-hos ref='setDia' :data='optionsData' @updata='changeOptions'></ym-hos>
		<!-- 选择弹窗 -->
		<ym-choice ref='ch1' title='新建入库'>
			<ym-choiceoption title='采购单入库' url='newPutIn' icon='caigoudanruku' slot='one'></ym-choiceoption>
			<ym-choiceoption title='直接入库' url='excalPutIn' icon='zhijieruku' slot='two'></ym-choiceoption>
			<ym-choiceoption title='退货入库' url='returnPutIn' icon='tuihuoruku'></ym-choiceoption>
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
				nums: 2,
				screenWidth: 0,
				optionsData: [
					{name:'新建入库',icon:'cangku-xinjianruku',show:true},
					{name:'入库列表',icon:'cangku-rukuliebiao',show:true},
				],
				asideData: {},
		    tenantId: JSON.parse(this.$store.state.token).tenantId,
			}
		},
    computed:{
      news:function () {
        let data = this.$store.state.news.storeInForm;
		    return data ? data.length : 0;
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
        this.$axios.get('/api/storeInForm/{tenantId}',{params})
        .then(res=>{
        	if(res.data&&res.data.data){
        		this.asideData = res.data.data;
          }else{
        		this.asideData = {};
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
				let {w,h} = this.getWH({nums, width});
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
			'ym-hos': homeOptionSet,
			'ym-choice': choice,
			'ym-choiceoption': choiceOption
		},
		filters: {
			noNull: function(data) {
				if (!data) return '';
				return data;
			}
		}
	}
</script>
