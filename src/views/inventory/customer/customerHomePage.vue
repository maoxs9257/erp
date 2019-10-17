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
			<p class="module_main_title">往来单位</p>
			<div class="module_options" ref='options'>
				<div class="options_box clearfix" :style="{width:w+'px',height:h+'px'}">
					<div class="option" v-if='optionsData[0].show&&role.erp_customer_look'>
						<router-link :to="{name:'customerO'}">
							<ym-round>
								<i class="iconfont jinxiaocun-kehuguanli"></i>
							</ym-round>
							<span class="option_name">客户管理</span>
						</router-link>
					</div>
					<div class="option" v-if='optionsData[1].show&&role.erp_supplier_look'>
						<router-link :to="{name:'supplierO'}">
							<ym-round>
								<i class="iconfont jinxiaocun-gongyingshangguanli"></i>
							</ym-round>
							<span class="option_name">供应商管理</span>
						</router-link>
					</div>
					<div class="option" v-if='optionsData[2].show&&role.erp_open_look'>
						<router-link :to="{ name: 'openO'}">
							<ym-round>
								<i class="iconfont jinxiaocun-kaizhenggongsiguanli"></i>
							</ym-round>
							<span class="option_name">开证公司管理</span>
						</router-link>
					</div>
					<div class="option" v-if='optionsData[3].show&&role.erp_clear_look'>
						<router-link :to="{ name: 'clearO'}">
							<ym-round>
								<i class="iconfont jinxiaocun-qingguangongsiguanli"></i>
							</ym-round>
							<span class="option_name">清关公司管理</span>
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
				nums: 4,
				screenWidth: 0,
				optionsData: [{name:'客户管理',icon:'jinxiaocun-kehuguanli',show: true},
					{name:'供应商管理',icon:'jinxiaocun-gongyingshangguanli',show:true},
					{name:'开公司管理',icon:'jinxiaocun-kaizhenggongsiguanli',show:true},
					{name:'清关公司管理',icon:'jinxiaocun-qingguangongsiguanli',show:true}
				],
				role: JSON.parse(this.$store.state.role),
		    tenantId: JSON.parse(this.$store.state.token).tenantId,
		    data:{},
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
          	data.forEach((val)=>{
          		if(val) {obj[val.split(':')[0]] = val.split(':')[1];}
            });
          	this.data = obj;
          }else{
            this.data = {};
          }
        })
      },
			goTo(name, code) {
				if (!this.role[code]) {
					this.$message.error('非法访问');
				} else {
					this.$router.push(name)
				}
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
