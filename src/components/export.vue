<template>
  <el-dialog width="600px" title="导入导出" center :visible.sync="visible" v-dialogDrag>
    <div class="export_top">
      <div class="export_top_item">
        <span>1</span>
        <div @click="openMould"><i class="iconfont excel"></i></div>
        <p>下载产品模板</p>
      </div>
      <div class="export_top_item">
        <span>2</span>
        <div @click="openFile"><i class="iconfont daoru_"></i></div>
        <p>导入产品</p>
      </div>
      <input type="file" ref="files" style="position:absolute; clip:rect(0 0 0 0);" @click="$event.target.value=''" @change="readFile($event)">
    </div>
    <div class="export_bottom">
      <p>说明：下载EXCEL模板文件后，输入数据，然后再导入数据</p>
    </div>
    <!-- 下载产品模板 -->
    <el-dialog width="600px" title='选择模板' center :visible.sync="downVisible" v-dialogDrag append-to-body>
      <div class="down_top clearfix">
        <div class="down_top_item" :class="{active:active==1}" @click="active=1"><i></i>实木板材</div>
        <div class="down_top_item" :class="{active:active==2}" @click="active=2"><i></i>原木材</div>
        <div class="down_top_item" :class="{active:active==3}" @click="active=3"><i></i>木配城</div>
        <div class="down_top_item" :class="{active:active==4}" @click="active=4"><i></i>人造板</div>
        <div class="down_top_item" :class="{active:active==5}" @click="active=5"><i></i>名贵材</div>
      </div>
      <div style="text-align:center;margin:10px">
        <el-button type="primary" plain @click="downVisible=false">取消</el-button>
        <el-button type="primary" @click="down">确定</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>
<script>
import XLSX from 'xlsx'
export default {
  props:['type'],
  data(){
    return {
      visible:false,
      downVisible:false,
      active:1,
      files:[
        {href:'/static/caigou/shimubancai.xlsx',downName:'实木板材'},
        {href:'/static/caigou/yuanmucai.xlsx',downName:'原木材'},
        {href:'/static/caigou/mupeicheng.xlsx',downName:'木配城'},
        {href:'/static/caigou/renzaoban.xlsx',downName:'人造板'},
        {href:'/static/caigou/mingguicai.xlsx',downName:'名贵材'}
      ],
      files1:[
        {href:'/static/store/shimubancai.xlsx',downName:'实木板材'},
        {href:'/static/store/yuanmucai.xlsx',downName:'原木材'},
        {href:'/static/store/mupeicheng.xlsx',downName:'木配城'},
        {href:'/static/store/renzaoban.xlsx',downName:'人造板'},
        {href:'/static/store/mingguicai.xlsx',downName:'名贵材'}
      ]
    }
  },
  methods:{
    /**
     * 打开
     * @method open
     */
    open(){
      this.visible = true;
    },
    /**
     * 关闭
     * @method close
     */
     close(){
       this.visible = false;
     },
    /**
     * 打开选择模板窗口
     * @method openMould
     */
    openMould(){
      this.downVisible = true;
    },
    /**
     * 下载模板
     * @method down
     */
    down(){
      let file = {};
      if(this.type === 'store'){
        file = this.files1[this.active-1];
      }else{
        file = this.files[this.active-1];
      }
      let aDom = document.createElement('a');
      aDom.href = file.href;
      aDom.download = file.downName;
      aDom.onclick = ()=>{
		    this.downVisible = false;
      };
		  aDom.click();
    },
    /**
     * 打开选择文件框
     * @method openFile
     */
    openFile(){
      this.$refs.files.click();
    },
    /**
     * 读取文件
     * @method readFile
     */
    readFile(file){
      var files = file.target.files;
      var reader = new FileReader();
      reader.onload =(e)=>{
        try {
          var data = e.target.result,
          workbook = XLSX.read(data, {type: 'binary'})
        } catch (e) {
          console.log('文件类型不正确');
          return;
        }
        this.proData(workbook)
      }
      reader.readAsBinaryString(files[0])
    },
    /**
     * 处理数据
     * @method proData
     */
    proData(data){
      let e = data.Sheets[data.SheetNames[0]];
      let j = [];
      let s = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
      let sIndex = 0;
      let tempArr = [];
      let objTemp = {};
      let obj = {};
      while(e[strs(sIndex)+'2']){
        let names = strs(sIndex);
        objTemp[names] = e[names+'2'].v;
        obj[e[names+'2'].v] = '';
        sIndex++;
      }
      for(let i in e){
        if(i.indexOf('!')!=-1) continue;
        let num = i.replace(/[a-zA-Z]+/, "");
        let str = i.replace(/[0-9]+/,'');
        if(num>=3){
          if(tempArr[num-3]){
            tempArr[num-3][objTemp[str]] = e[i].v;
          }else{
            tempArr.push(JSON.parse(JSON.stringify(obj)));
            tempArr[num-3][objTemp[str]] = e[i].v;
          }
        }
      }
      //输出数据
      this.$emit('cb',tempArr,data.SheetNames[0])
      function strs (i){
        let na = ''
        let y = i%26;
        let ss = parseInt(i/26);
        na = s[y];
        if(ss>0){
          na = strs(ss-1) + na;
        }
        return na;
      }
    },
  }
}
</script>
<style lang="scss" scoped>
.export_top{
  height: 220px;
  border-bottom: 1px solid #ccc;
  margin: 0 50px;
  .export_top_item{
    float: left;
    width: 50%;
    height: 100%;
    text-align: center;
    span{
      display: block;
      width: 25px;
      height: 25px;
      border-radius: 50%;
      background-color: #2ee092;
      color: #ffffff;
      line-height: 25px;
      margin: 0 auto;
    }
    div{
      width:100px;
      height: 100px;
      border: 2px solid rgb(70, 182, 246);
      margin: 20px auto;
      cursor: pointer;
      i{
        color: rgb(70, 182, 246);
        font-size: 60px;
        line-height: 98px;
      }
      &:hover{
        background-color: rgb(70, 182, 246);
        i{
          color: #ffffff;
        }
      }
    }
  }
}
.export_bottom{
  height: 100px;
  margin: 0 80px;
  line-height: 70px;
  color: #999;
}
.down_top{
  margin:10px 50px 0;
  height: 80px;
  text-align: center;
  .down_top_item{
    display: inline-block;
    padding: 0 10px;
    height: 25px;
    line-height: 25px;
    margin:0 5px;
    cursor: pointer;
    border-radius: 4px;
    &:hover{
      background-color: rgb(70, 182, 246);
      color: #ffffff;
    }
  }
  .down_top_item.active{
    background-color: rgb(70, 182, 246);
    color: #ffffff;
  }
}
</style>

