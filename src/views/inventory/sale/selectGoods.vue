<template>
  <el-dialog title="选择商品" :visible.sync='visible' v-dialogDrag center width='1100px' v-loading='loading'>
    <div style="height: 50px;">
      <div class="dialog_tool">
        <div class="dialog_items">
          <div class="dialog_item fi sale_goods_select">
            <el-select v-model="crtoryId" @change='selectedGoods=[];getGoods()' :disabled='lock' placeholder="请选择">
              <el-option label="实木板材" :value="2"></el-option>
							<el-option label="原木材" :value="1"></el-option>
							<el-option label="人造板" :value="5"></el-option>
							<el-option label="木配城" :value="4"></el-option>
							<el-option label="名贵材" :value="3"></el-option>
            </el-select>
          </div>
          <div v-if="val.show" :class="{fi:option[val.key]}" v-for='(val,key) in selections' :key='key' class="dialog_item">
            <el-select v-model="option[val.key]" :placeholder="val.name" @change='screen' clearable>
              <el-option v-for='(v,k) in options[val.key]' :key='k' :label="v" :value="v"></el-option>
            </el-select>
          </div>
          <div class="dialog_item">
            <span v-if="clearShow" class="clear_btn" @click='clearOption'>清楚过滤</span>
          </div>
					<div class="dialog_item" style="float:right;">
					  <span>已选商品</span>
					  <span class="sp" v-if="sss" @click="haveSearch">{{sum}}</span>
					  <span class="spp" v-if="!sss" @click="screen">{{sum}}</span>
					</div>
					<div class="dialog_item" style="float:right">
						<span class="set_btn" @click="setVisible=true">设置</span>
					</div>
        </div>
      </div>
    </div>
    <div style="height:500px" class="table_style selectGoods sale_goods_table">
      <el-table :data='goodsList' style="width:100%" height='500' border v-loading='tableLoad' :row-class-name='inspect'>
        <el-table-column type='index' key='1'></el-table-column>
        <el-table-column v-if="tableShow[val]" v-for="(val,key) in tableConfig" :key="val" :label="val" :prop="val"></el-table-column>
        <el-table-column v-if="tableShow.warestoreName" label='仓库' prop='warestoreName' key='17'></el-table-column>
        <el-table-column label='可选' prop='goodsNum' fixed='right'></el-table-column>
        <el-table-column label='数量' prop='saleNum' fixed='right' width='102px'>
          <template slot-scope='scope'>
            <el-input-number style="width: 80px" class="input-number input__inner" size='small' v-model="scope.row.saleNum" :min="0" @change='numChange(scope.row)' :max="scope.row.goodsNum"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label='价格' prop='salePrice' fixed='right' width="102px">
          <template slot-scope='scope'>
            <el-input-number style="width: 80px" class="input-number input__inner" :precision="2" size='small' v-model="scope.row.salePrice" :min="0"></el-input-number>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="text-align:center;margin-top:30px;">
      <el-button type='primary' plain @click='close'>取消</el-button>
      <el-button type='primary' @click='outGoods'>确定</el-button>
    </div>
		<!-- 设置 -->
		<el-dialog width="800px" title='设置' center :visible.sync='setVisible' v-dialogDrag append-to-body>
			<el-tabs v-model="activeName">
				<el-tab-pane label="表格字段" name="first">
					<options :data='tableOptions' @cb='updataTableOptions' @close='setVisible=false'></options>
				</el-tab-pane>
				<el-tab-pane label="筛选字段" name="second">
					<options :data='selections' @cb='updataSelections' @close='setVisible=false'></options>
				</el-tab-pane>
			</el-tabs>
		</el-dialog>
  </el-dialog>
</template>

<script>
	import options from '@/components/options.vue'
export default {
	components: {
		"options":options
	},
  data(){
    return {
      visible:false,
      crtoryId:2,
      lock:false,
      tenantId:JSON.parse(this.$store.state.token).tenantId,
      goodsList:[],
      loading:false,
      tableLoad:false,
      options:{},
      option:{},
      meta:[],
      selectedGoods:[],
      sum:0,
			sss:true,
			setVisible:false,
			activeName:'first',
    }
  },
	computed:{
		clearShow:function(){
			for(let k in this.option){
				if(this.option[k]||this.option[k]===0){
					return true;
				}
			}
			return false;
		},
		tableConfig:function(){
			switch (this.crtoryId){
				case 2:
					return this.GLOBAL_.tableConfig.实木板材;
				case 1:
					return this.GLOBAL_.tableConfig.原木材;
				case 5:
					return this.GLOBAL_.tableConfig.人造板;
				case 4:
					return this.GLOBAL_.tableConfig.木配城;
				case 3:
					return this.GLOBAL_.tableConfig.名贵材;
				default:
					return [];
			}
		},
		selections:function(){
			if(this.crtoryId){
				return JSON.parse(this.$store.state.setJson).selection.SG[this.crtoryId+''];
			}else{
				return [];
			}
		},
		tableOptions:function(){
			if(this.crtoryId){
				return JSON.parse(this.$store.state.setJson).tableOptions.SG[this.crtoryId+''];
			}else{
				return [];
			}
		},
		tableShow:function() {
		  let temp = {};
		  this.tableOptions.forEach((val)=>{
		    temp[val.key]=val.show
		  })
		  return temp;
		}
	},
  methods:{
    // 打开选择商品窗口
    open(data,crtoryId){
      this.visible = true;
      this.crtoryId = crtoryId?crtoryId:2;
      this.lock = crtoryId?true:false;
      this.selectedGoods = JSON.parse(JSON.stringify(data));
      this.sumNum();
      this.getGoods();
    },
    // 关闭选择商品窗口
    close(){
      this.visible = false;
    },
    // 获取商品
    getGoods(){
      this.tableLoad = true;
      let params ={
        tenantId:this.tenantId,
        catoryId:this.crtoryId,
      };
      this.$axios.get('/api/lockForm/showStoreTableInfor',{params})
      .then(res=>{
        this.tableLoad = false;
        if(res.data&&res.data.data){
          let data = res.data.data;
          let temp = [];
          data.forEach(val=>{
            if(val.packageNumber>val.lockedNumber){
              val.goodsNum = val.packageNumber - val.lockedNumber;
              val.saleNum = 0;
              val.salePrice = 0;
              val = Object.assign(val,this.stringToObject(val.attributeValue));
              temp.push(val)
            }
          });
          this.meta = this.matching(temp);
          this.screen();
        }else{
          this.goodsList = [];
          this.createSelect();
        }
      },()=>{this.goodsList=[];this.tableLoad = false;})
    },
    // 字符传转对象
    stringToObject(string){
      let tempArr = string.split(',');
      let tempObj = {};
      tempArr.forEach(val=>{
        tempObj[val.split(':')[0]] = val.split(':')[1]
      })
      return tempObj;
    },
    // 筛选对象
    createSelect(){
      let temp = {};
      this.selections.forEach(val=>{
				if(val.key){
					temp[val.key] = [];
					this.goodsList.forEach(v=>{
					  temp[val.key].push(v[val.key])
					})
					temp[val.key] = this.uniq(temp[val.key])
				}
      })
      this.options = temp;
    },
    // 删选
    screen(){
      let data = [...this.meta];
			for(let k in this.option){
				for(let i=0;i<data.length;i++){
          if(data[i][k]!==this.option[k]&&!!this.option[k]){
            data.splice(i,1);
            i--;
            continue;
          }
        }
      }
      this.goodsList = data;
      this.createSelect();
      this.sss = true;
    },
    // 清楚筛选
    clearOption(){
      this.option = {};
      this.screen();
    },
    // 选择项匹配
    matching(data){
      for(let i in this.selectedGoods){
        for(let k in data){
          if(this.selectedGoods[i].id===data[k].id){
            data.splice(k,1,this.selectedGoods[i])
          }
        }
      }
			return data;
    },
    // 选择改变
    numChange(data){
      if(data.saleNum>0){
        for(let i in this.selectedGoods){
          if(this.selectedGoods[i].id===data.id){
            this.selectedGoods.splice(i,1,data);
            this.sumNum();
            return ;
          }
        }
        this.selectedGoods.push(data);
      }else{
        for(let i in this.selectedGoods){
          if(this.selectedGoods[i].id===data.id){
            this.selectedGoods.splice(i,1);
            break;
          }
        }
      }
      this.sumNum();
    },
    // 计算已选商品数量
    sumNum(){
      let num = 0;
      this.selectedGoods.forEach(val=>{
        num += val.saleNum;
      })
      this.sum = num;
    },
    // 检查数量价格
    inspect({row,rowIndex}){
      return row.saleNum>0?row.salePrice>0?'':'err':'';
    },
    // 输出商品
    outGoods(){
      for(let i in this.selectedGoods){
        if(!this.selectedGoods[i].salePrice>0){
          return this.$message.error('请输入商品价格');
        }
      }
      this.$emit('cb',this.selectedGoods,this.crtoryId);
      this.visible = false;
    },
    // 已选
    haveSearch(){
      let arr = [];
      let data = this.meta;
      for(let i in data){
      	if(data[i].saleNum>0&&data[i].salePrice){
      		arr.push(data[i])
        }
      };
      this.goodsList = arr;
      this.sss = false;
    },
		// 更新筛选字段
		updataSelections(data){
			let setJson = JSON.parse(this.$store.state.setJson);
			setJson.selection.SG[this.crtoryId] = data;
			this.$store.commit('setSetJson',setJson);
			this.clearOption();
			this.upSetJson(setJson);
		},
		// 
		updataTableOptions(data){
			let setJson = JSON.parse(this.$store.state.setJson);
			setJson.tableOptions.SG[this.crtoryId] = data;
			this.$store.commit('setSetJson',setJson);
			this.upSetJson(setJson);
		},
		// 上传设置数据
		upSetJson(val){
			let data = {
				settingText:JSON.stringify(val),
				tenantId:this.tenantId,
				userId:this.userId
			}
			this.$axios.post('/api/userSettingTable/modifyUserSettingTable',data)
		},
  }
}
</script>
<style>
  .selectGoods .el-table--scrollable-x .el-table__body-wrapper{
    height: 459px !important;
  }
  .selectGoods .el-table__fixed-right .el-table__fixed-body-wrapper{
    top:40px !important;
    height: 459px !important;
  }
  .el-table .err{
    background: oldlace;
  }
  .sale_goods_select .el-input__inner{
    width: 84px !important;
  }
  .sale_goods_select .el-input__suffix{
    right: 3px !important;
  }
  .dialog_item input::-webkit-input-placeholder{
    color:#666;
  }
  .dialog_item input:-moz-placeholder{
    color:#666;
  }
  .dialog_item input::-moz-placeholder{
    color:#666;
  }
  .dialog_item input:-ms-input-placeholde{
    color: #666;
  }
</style>
<style lang="css" scoped>
	.dialog_item .sp{
		color: #FFFFFF;
		background-color: #409EFF;
		padding:0 3px;
		border-radius: 5px;
		cursor: pointer;
	}
	.dialog_item .spp{
		color: #FFFFFF;
		background-color: red;
		padding:0 3px;
		border-radius: 5px;
		cursor: pointer;
	}
</style>
