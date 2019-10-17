<template lang="html">
  <div class="module">
    <div class="module_right">
      <span class="module_set_btn" @click='openSet'>
        <i class="iconfont cebian-shezhi"></i>
      </span>
      <div class="module_right_main">
        <div class="item" v-if="data.purposeDayNum">
          <span>{{data.purposeDayNum}}</span>
          <p>今日</p>
        </div>
        <div class="item" v-if="data.payableAmount">
          <span>{{data.payableAmount|eMoney}}</span>
          <p>本月应付金额</p>
        </div>
        <div class="item" v-if="data.purposeAmountAmount">
          <span>{{data.purposeAmountAmount|eMoney}}</span>
          <p>本月采购金额</p>
        </div>
      </div>
    </div>
    <div class="module_main">
      <p class="module_main_title">采购进货</p>
      <div class="module_options" ref='options'>
        <div class="options_box clearfix" :style="{width:w+'px',height:h+'px'}">
          <div class="option" v-if='optionsData[0].show'>
            <router-link :to="{name:'openPurchase'}">
              <ym-round>
                <i class="iconfont jinxiaocun-hetongkaidan"></i>
              </ym-round>
              <span class="option_name">合同开单</span>
            </router-link>
          </div>
          <div class="option" v-if='optionsData[1].show'>
            <router-link :to="{name:'purchaseList'}">
              <ym-round>
                <p class="nnp" v-if="news>0">{{news}}</p>
                <i class="iconfont jinxiaocun-hetongdanliebiao"></i>
              </ym-round>
              <span class="option_name">合同单列表</span>
            </router-link>
          </div>
          <div class="option" v-if='optionsData[4].show'>
            <router-link :to="{ name: 'openGoods'}">
              <ym-round>
                <i class="iconfont jinxiaocun-jinhuodankaidan"></i>
              </ym-round>
              <span class="option_name">进货单开单</span>
            </router-link>
          </div>
          <div class="option" v-if='optionsData[5].show'>
            <router-link :to="{name:'goodsList'}">
              <ym-round>
                <p class="nnp" v-if="news1>0">{{news1}}</p>
                <i class="iconfont jinxiaocun-jinhuodanliebiao"></i>
              </ym-round>
              <span class="option_name">进货单列表</span>
            </router-link>
          </div>
          <div class="option" v-if='optionsData[2].show'>
            <router-link :to="{name:'openClear'}">
              <ym-round>
                <i class="iconfont jinxiaocun-qingguankaidan"></i>
              </ym-round>
              <span class="option_name">清关开单</span>
            </router-link>
          </div>
          <div class="option" v-if='optionsData[3].show'>
            <router-link :to="{name:'clearList'}">
              <ym-round>
                <p class="nnp" v-if="news2>0">{{news2}}</p>
                <i class="iconfont jinxiaocun-qingguandanliebiao"></i>
              </ym-round>
              <span class="option_name">清关单列表</span>
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
  data(){
    return{
      w:0,
      h:0,
      nums:6,
      screenWidth:0,
      optionsData:[
        {name:'采购开单',icon:'jinxiaocun-hetongkaidan',show:true},
        {name:'采购单列表',icon:'jinxiaocun-hetongdanliebiao',show:true},
        {name:'清关开单',icon:'jinxiaocun-qingguankaidan',show:true},
        {name:'清关单列表',icon:'jinxiaocun-qingguandanliebiao',show:true},
        {name:'进货单开单',icon:'jinxiaocun-jinhuodankaidan',show:true},
        {name:'进货单列表',icon:'jinxiaocun-jinhuodanliebiao',show:true}
      ],
			role:JSON.parse(this.$store.state.role),
		  tenantId: JSON.parse(this.$store.state.token).tenantId,
      data:{},
    }
  },
  computed:{
    news:function () {
      let data = this.$store.state.news.purposeContract;
      let num = data?data.length:0;
      return num
    },
    news1:function () {
      let data = this.$store.state.news.purposeForm;
      let num = data?data.length:0;
      return num
    },
    news2:function () {
      let data = this.$store.state.news.clearance;
      let num = data?data.length:0;
      return num
    },
  },
  mounted(){
    this.screenWidth = document.body.offsetWidth;
    window.onresize= ()=>{
      this.screenWidth = document.body.offsetWidth;
    };
    this.getAsideData();
  },
  methods:{
  	getAsideData(){
  		let params = {tenantId:this.tenantId};
  		this.$axios.get('/apt/purposeForm/purposeFormRight',{params})
      .then(res=>{
      	if(res.data&&res.data.data){
          let data = res.data.data;
          let obj = {};
          for(let i in data){
          	obj[data[i].split(':')[0]] = data[i].split(':')[1]
          }
          this.data = obj;
        }else{
      		this.data = {}
        }
      })
    },
    openSet(){
      this.$refs.setDia.open();
    },
    changeOptions(data){
      this.optionsData = data;
      let num = 0;
      for(let i in data){
        if(data[i].show){
          num++;
        }
      }
      this.nums = num;
    },
    setWH(){
      let nums = this.nums;
      let width = this.$refs.options.offsetWidth;
      let {w,h} = this.getWH({nums,width});
      this.w = w;
      this.h = h;
    }
  },
  watch:{
    screenWidth:function(){
      this.setWH();
    },
    nums:function(){
      this.setWH();
    }
  },
  components:{
    'ym-round':round,
    'ym-hos':homeOptionSet
  }
}
</script>
