<template>
  <el-dialog append-to-body width="744px" v-dialogDrag :visible.sync="show" title="图片剪裁" center>
    <div class="cropperBox">
      <div class="cropperTop">
        <div class="imgCropper">
          <p v-if="!showCropper" @click="openFile">点击上传图片</p>
          <vueCropper
            v-if="showCropper"
            ref="cropper"
            :img="option.img"
            :outputSize="option.outputSize"
            :outputType="option.outputType"
            :info="true"
            :full="option.full"
            :canMove="option.canMove"
            :canMoveBox="option.canMoveBox"
            :original="option.original"
            :autoCrop="option.autoCrop"
            :autoCropWidth="option.autoCropWidth"
            :autoCropHeight="option.autoCropHeight"
            :fixedBox="option.fixedBox"
            @realTime="realTime">
          </vueCropper>
          <p class="otherimg" @click="openFile" v-if="showCropper">重新选择图片</p>
        </div>
        <div class="previewImg">
          <p>预览</p>
          <div class="preview" :style="{width:w+'px',height:h+'px'}">
            <div :style="{width:w+'px',height:h+'px'}">
              <img :src="previews.url" :style="previews.img">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="margin-top:30px;text-align:center">
      <el-button type='primary' plain @click="show=false">取消</el-button>
      <el-button type="primary" @click="finish">确定</el-button>
    </div>
    <input @change="checkImg($event)" type="file" id="file" style="filter:alpha(opacity=0);opacity:0;width: 0;height: 0;display:none" accept="image/png, image/jpeg, image/gif, image/jpg">
  </el-dialog>
</template>

<script>
  import { VueCropper }  from 'vue-cropper'
  export default {
    props:['w','h'],
    data(){
      return{
        show:false,
        showCropper:false,
        option: {
          img: '',
          outputSize:1, //剪切后的图片质量（0.1-1）
          full: false,//输出原图比例截图 props名full
          outputType: 'png',
          canMove: true,
          original: false,
          canMoveBox: true,
          autoCrop: true,
          autoCropWidth: parseInt(this.w),
          autoCropHeight: parseInt(this.h),
          fixedBox: true
        },
        previews:{},
        fileName:'',
        name:'123',
        id:'',
				src:'',
      }
    },
    methods:{
      open(id,data){
        this.show = true;
        this.showCropper = false;
        this.id=id;
				this.src = data.icon
      },
      //打开文件选择
      openFile(){
        this.previews={};
        document.getElementById('file').click()
      },
      //选择图片
      checkImg(el){
        let that = this;
        let img = el.target.files[0];
        console.log(img);
        this.fileName = img.name;
        let filereader = new FileReader();
        filereader.readAsDataURL(img);
        filereader.onload = function (event) {
          let srcpath = event.target.result;
          that.option.img = srcpath;
        };
        this.showCropper = true;
      },
      //预览
      realTime(data){
        this.previews = data
      },
      //图片上传
      finish(){
        this.$refs.cropper.getCropData((data)=>{
          let img = this.dataURLtoFile(data,'123.png');
          console.log(img);
          let formData = new FormData();
          formData.append('file',img);
          this.$emit('callback',formData,this.id,this.name);
          this.previews = {};
          this.show=false
        })
      },
      //
      post(data){
        console.log(data)
      },

      dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
      }
    },
		filters: {
			filtSrc: (data) => {
				if (data) {
					return 'https://uwood.oss-cn-qingdao.aliyuncs.com/shop/' + data
				} else {
					return false;
				}
			}
		},
    components:{
      VueCropper,
    }
  };
</script>
<style lang="scss" scoped>
.cropperBox{
  width: 100%;
  text-align: center;
  .cropperTop{
    width: 100%;
    height: 360px;
    padding-top: 40px;
    .imgCropper{
      width: 300px;
      height: 300px;
      border: 1px solid #ddd;
      display: inline-block;
      margin: 0 20px;
      vertical-align: top;
      p{
        margin:130px 100px;
        line-height: 20px;
        &:hover{
          color: #00A0E9;
        }
      }
      .otherimg{
        margin-top: 10px;
        &:hover{
          color: #00A0E9;
        }
      }
    }
    .previewImg{
      width: 300px;
      height: 300px;
      display: inline-block;
      margin: 0 20px;
      vertical-align: top;
      p{
        height: 20px;
        color: #666;
      }
      .preview{
        width: 200px;
        height: 140px;
        overflow: hidden;
        margin:  50px auto;
        border: 1px solid #ddd;
      }
    }
  }
  .cropperFot{
    height: 30px;
    text-align: center;
    button{
      width: 100px;
      height: 28px;
      margin: 0 10px;
      background-color: #ffffff;
      border: 1px solid #ddd;
      border-radius: 5px;
      color: #666;
      &:nth-child(1){
        border: 1px solid #00A0E9;
        color: #00A0E9;
        &:hover{
          background-color: #00A0E9;
          color: #fff;
        }
      }
    }
  }
}
</style>
