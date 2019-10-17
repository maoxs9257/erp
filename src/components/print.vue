<template>
	<div>
		<el-dialog class="print" v-dialogDrag :visible.sync="showPrint" title="打印预览" center>
			<div class="printTop">
				<div class="printTopBar">
					<button class="barItem" @click="printHtml">
						<i class="iconfont icon-dayin"></i>
						<p>打印</p>
					</button>
					<button class="barItem" @click="openSet">
						<i class="iconfont icon-chilun"></i>
						<p>设置</p>
					</button>
					<button class="barItem" @click="toExcal">
						<i class="iconfont icon-daochu1"></i>
						<p>导出</p>
					</button>
				</div>
				<div class="barPage">
					<div @click="prePage"><i class="iconfont icon-back"></i></div>
					<div @click="nextPage"><i class="iconfont icon-back-copy"></i></div>
				</div>
			</div>
			<div class="printFoot">
				<div class="printFootMain">
					<div class="printBox">
						<!-- 打印内容 -->
						<div id="print">
							<div class="printHead" style="position: relative;">
								<div ref='img1' style="position: absolute;width: 200px;right: 0;"></div>
								<h3>{{print.headData.companyName}}</h3>
								<h5>{{print.headData.billName}}</h5>
								<ul>
									<li v-show="print.headData.address"><span>地址：</span><span>{{print.headData.address}}</span></li>
									<li v-show="print.headData.phone"><span>电话：</span><span>{{print.headData.phone}}</span></li>
									<li v-show="print.headData.stroe"><span>仓库：</span><span>{{print.headData.stroe}}</span></li>
									<li v-show="print.headData.href"><span>网址：</span><span>{{print.headData.href}}</span></li>
								</ul>
								<ul class="headInfo">
									<li v-for="(val,key) in print.tableInfo" :key="key" v-show="val.show"><span>{{val.title}}：</span><span>{{val.value}}</span></li>
								</ul>
							</div>
							<div class="printTable">
								<table class="tt" style="width: 100%;"></table>
							</div>
							<div class="printbottom">
								<ul>
									<li v-for="(val,key) in print.footData" :key="key" v-show="val.show"><span>{{val.title}}:</span><span>{{val.value}}</span></li>
								</ul>
							</div>
						</div>
					</div>
					<!-- 打印内容 -->
					<div style="height: 0;overflow: hidden;" ref="print"></div>
					<div class="printBox1" id="printTable" style="display: none;">
						<div class="page" style="width: 210mm;height: 297mm;margin: 0 auto;">
							<div class="printTableHead" ref='h' style="position: relative;">
								<div ref='img2' style="position: absolute;width: 200px;right: 0;"></div>
								<p style="text-align: center;font-size: 20px;line-height: 30px;margin: 0;">{{print.headData.companyName}}</p>
								<p style="text-align: center;font-size: 16px;line-height: 25px;margin: 0;">{{print.headData.billName}}</p>
								<ul style="padding: 5px 0;border-bottom: #666 solid 1px;margin: 0;">
									<li style="line-height: 20px;font: 14px;" v-show="print.headData.address"><span>地址：</span><span>{{print.headData.address}}</span></li>
									<li style="line-height: 20px;font: 14px;" v-show="print.headData.phone"><span>电话：</span><span>{{print.headData.phone}}</span></li>
									<li style="line-height: 20px;font: 14px;" v-show="print.headData.stroe"><span>仓库：</span><span>{{print.headData.stroe}}</span></li>
									<li style="line-height: 20px;font: 14px;" v-show="print.headData.href"><span>网址：</span><span>{{print.headData.href}}</span></li>
								</ul>
								<ul class="headInfo" style="padding: 5px 0;margin: 0;">
									<li style="float:left;width:50%;line-height:20px;font-size:14px;" v-for="(val,key) in print.tableInfo" :key="key" v-show="val.show">
										<span>{{val.title}}：</span><span>{{val.value}}</span>
									</li>
									<div style="clear: both;"></div>
								</ul>
							</div>
							<div class="printTable">
								<table style="width: 100%;font-size: 14px;border-collapse: collapse;border-spacing: 0;"></table>
							</div>
							<div class="printTableFoot" style="padding:2px 0;">
								<ul style="padding:5px 0;">
									<li style="float:left;width:50%;line-height:20px;font:14px;" v-for="(val,key) in print.footData" :key="key" v-show="val.show"><span>{{val.title}}:</span><span>{{val.value}}</span></li>
									<div style="clear: both;"></div>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</el-dialog>
		<!-- 打印设置  -->
		<el-dialog class="printSet" v-dialogDrag :visible.sync="showPrintSet" title="打印设置" center>
			<div class="printSetBox" >
				<div class="upImg" id="imgbox" @click="upImg">
					选择印章
				</div>
				<input type="file" id="imgData" @change="selectImg($event)" style="display: none;">
				<div class="printSet1">
					<h3>{{printObj.headData.companyName}}</h3>
					<p>{{printObj.headData.billName}}</p>
					<button class="printBtn" @click="openSetHead"><i class="iconfont icon-xiugai"></i>抬头设置</button>
				</div>
				<ul class="printSet2">
					<li v-show="printObj.headData.phone" style="width: 100%;"><span>电话：</span><span>{{printObj.headData.phone}}</span></li> <br>
					<li v-show="printObj.headData.href" style="width: 100%;"><span>网址：</span><span>{{printObj.headData.href}}</span></li> <br>
					<li v-show="printObj.headData.stroe" style="width: 100%;"><span>仓库：</span><span>{{printObj.headData.stroe}}</span></li> <br>
					<li v-show="printObj.headData.address"  style="width: 100%;"><span>地址：</span><span>{{printObj.headData.address}}</span></li>
				</ul>
				<ul class="printSet3">
					<li v-for="(val,key) in printObj.tableInfo" :key="key" v-show="val.show"><span>{{val.title}}</span></li>
					<button class="printBtn" @click="openSetZi"><i class="iconfont icon-xiugai"></i>字段设置</button>
				</ul>
				<div class="printSet4">
					<table>
						<tr><th>序号</th><th v-for="(val,key) in tableShowData" :key="key" v-show="val">{{key}}</th></tr>
						<tr><td></td><td v-for="(val,key) in tableShowData" :key="key" v-show="val"></td></tr>
					</table>
					<button class="printBtn" @click="openSetTable"><i class="iconfont icon-xiugai"></i>表头设置</button>
				</div>
				<ul class="printSet3">
					<li v-for="(val,key) in printObj.footData" :key='key' v-show="val.show"><span>{{val.title}}：</span></li>
					<button class="printBtn" @click="openSetFoot"><i class="iconfont icon-xiugai"></i>字段设置</button>
				</ul>
			</div>
			<div class="printfootBtn">
				<button @click="setSure">确定</button>
				<button @click="setClose">取消</button>
			</div>
		</el-dialog>
		<!-- 抬头设置 -->
		<el-dialog class="printheadSet" v-dialogDrag :visible.sync="showPrintHeadSet" title="设置抬头信息" center>
			<div class="setmain">
				<div class="setMainItem">
					<label for="">单据名称：</label>
					<input type="text" v-model="headSetData.billName">
				</div>
				<div class="setMainItem">
					<label for="">公司名称：</label>
					<input type="text" v-model="headSetData.companyName">
				</div>
			</div>
			<div class="setmain">
				<div class="setMainItem">
					<label for="">电话传真：</label>
					<input type="text" v-model="headSetData.phone">
				</div>
				<div class="setMainItem">
					<label for="">网址：</label>
					<input type="text" v-model="headSetData.href">
				</div>
				<div class="setMainItem">
					<label for="">仓库：</label>
					<input type="text" v-model="headSetData.stroe">
				</div>
				<div class="setMainItem">
					<label for="">地址：</label>
					<input type="text" v-model="headSetData.address">
				</div>
			</div>
			<div class="printfootBtn">
				<button @click="setHeadSure">确定</button>
				<button @click="setHeadClose">取消</button>
			</div>
		</el-dialog>
		<!-- 字段设置 -->
		<el-dialog class="printZiduanSet" v-dialogDrag :visible.sync="showPrintZiSet" title="字段设置" center>
			<div class="selectItem">
				<span>已选</span>
				<div class="itemBox">
					<div v-for="(val,key) in ziduanData" :key='key' v-show="val.show"><i class="iconfont icon-diandian"></i>{{val.title}}<a @click="val.show=false"><i class="iconfont icon-x1"></i></a></div>
				</div>
			</div>
			<div class="selectItem">
				<span>可选</span>
				<div class="item1Box">
					<div @click="val.show=true" v-for="(val,key) in ziduanData" v-show="!val.show" :key='key'><i class="iconfont icon-shizi"></i>{{val.title}}</div>
				</div>
			</div>
			<div class="printfootBtn">
				<button @click="setZiSure">确定</button>
				<button @click="setZiClose">取消</button>
			</div>
		</el-dialog>
		<!-- 表头设置 -->
		<el-dialog class="printTableSet" v-dialogDrag :visible.sync="showPrintTableSet" title="表头设置" center>
			<div class="selectItem">
				<span>已选</span>
				<div class="itemBox">
					<div v-for="(val,key) in tableSetData" :key='key' v-show="val"><i class="iconfont icon-diandian"></i>{{key}}<a @click="tableSetData[key]=false"><i class="iconfont icon-x1"></i></a></div>
				</div>
			</div>
			<div class="selectItem">
				<span>可选</span>
				<div class="item1Box">
					<div @click="tableSetData[key]=true" v-for="(val,key) in tableSetData" v-show="!val" :key='key'><i class="iconfont icon-shizi"></i>{{key}}</div>
				</div>
			</div>
			<div class="printfootBtn">
				<button @click="setTableSure">确定</button>
				<button @click="setTableClose">取消</button>
			</div>
		</el-dialog>
		<!-- 末尾字段设置 -->
		<el-dialog class="printFootSet" v-dialogDrag :visible.sync="showPrintFootSet" title="字段设置" center>
			<div class="selectItem">
				<span>已选</span>
				<div class="itemBox">
					<div v-for="(val,key) in footSetData" :key='key' v-show="val.show"><i class="iconfont icon-diandian"></i>{{val.title}}<a @click="val.show=false"><i class="iconfont icon-x1"></i></a></div>
				</div>
			</div>
			<div class="selectItem">
				<span>可选</span>
				<div class="item1Box">
					<div @click="val.show=true" v-for="(val,key) in footSetData" v-show="!val.show" :key='key'><i class="iconfont icon-shizi"></i>{{val.title}}</div>
				</div>
			</div>
			<div class="printfootBtn">
				<button @click="setFootSure">确定</button>
				<button @click="setFootClose">取消</button>
			</div>
		</el-dialog>
	</div>
	
</template>

<script>

export default{
	props:["printData","print"],
	data(){
		return {
			showPrint:false,
			showPrintSet:false,
			showPrintHeadSet:false,
			showPrintZiSet:false,
			showPrintTableSet:false,
			showPrintFootSet:false,
			datasrc:'',
			data:[],
			nowPage:0,
			pageSize:0,
			headSetData:{},   //抬头信息 设置
			ziduanData:{},
			tableShowData:{},
			tableSetData:{},
			footSetData:{},
			pages:{1:0},
			page:1,
			printObj:JSON.parse(JSON.stringify(this.print)),
			
		}
	},
	methods:{
		//选择图章 npg
		upImg(){
			document.getElementById('imgData').click()
		},
		selectImg(el){
			if(window.FileReader){
				let that = this
				var file = el.target.files[0]
				var filereader = new FileReader()
				filereader.onload = function (event) {
					var srcpath = event.target.result;
					this.datasrc = srcpath
					console.log(this.datasrc)
					var img = document.createElement('img')
					img.src = srcpath;
					document.getElementById('imgbox').innerHTML=''
					document.getElementById('imgbox').appendChild(img)
					let img1 = img.cloneNode(true)
					img1.style.width = '100px'
					that.$refs.img1.append(img1)
					that.$refs.img2.append(img1.cloneNode(true))
				}
				filereader.readAsDataURL(file)
			}
		},
		//表尾设置
		openSetFoot(){
			this.footSetData = JSON.parse(JSON.stringify(this.printObj.footData))
			this.showPrintFootSet = true
		},
		setFootSure(){
			this.$set(this.printObj,'footData',this.footSetData)
			this.showPrintFootSet = false
		},
		setFootClose(){
			this.showPrintFootSet = false
		},
		//表头设置
		openSetTable(){
			this.tableSetData = JSON.parse(JSON.stringify(this.tableShowData))
			this.showPrintTableSet = true
		},
		setTableSure(){
			this.tableShowData = JSON.parse(JSON.stringify(this.tableSetData))
			this.showPrintTableSet = false
		},
		setTableClose(){
			this.showPrintTableSet = false
		},
		//字段设置
		openSetZi(){
			this.ziduanData = JSON.parse(JSON.stringify(this.printObj.tableInfo))
			this.showPrintZiSet = true
		},
		setZiSure(){
			this.$set(this.printObj,'tableInfo',this.ziduanData)
			this.showPrintZiSet = false
		},
		setZiClose(){
			this.showPrintZiSet = false
		},
		//抬头信息设置
		openSetHead(){
			this.headSetData = JSON.parse(JSON.stringify(this.printObj.headData))
			this.showPrintHeadSet=true
		},
		setHeadSure(){
			this.$set(this.printObj,'headData',this.headSetData)
			this.showPrintHeadSet=false
		},
		setHeadClose(){
			this.showPrintHeadSet=false
		},
		//打开设置弹窗
		openSet(){
			for(var i in this.printTable[0]){
				this.tableShowData[this.printTable[0][i].title]=true
			}
			this.showPrintSet=true
		},
		setSure(){
			this.print = JSON.parse(JSON.stringify(this.printObj))
			this.showPrintSet=false
		},
		setClose(){
			this.showPrintSet=false
		},
		//打印预览区域
		Render(page){
			let hei = this.getTableContentHeight()
			let index = this.pages[page]
			let table=document.getElementsByClassName('tt')[0]
			table.innerHTML=""
			//建立表头
			let tr = document.createElement('tr')
			tr.innerHTML='<th>序号</th>'
			for(var key in this.printTable[0]){
				let th = document.createElement('th')
				th.innerHTML=this.printTable[0][key].title
				tr.append(th)
			}
			table.append(tr)
			//渲染表格
			for(;index<this.printTable.length;index++){
				let TR = document.createElement('tr')
				TR.innerHTML='<td>'+(index+1)+"</td>"
				for(var i in this.printTable[index]){
					let td = document.createElement('td')
					td.innerHTML=this.printTable[index][i].value
					TR.append(td)
				}
				table.append(TR)
				if(this.getTableHeight()>hei){
					this.pages[page+1]=index
					this.removeLastChild(table)
					return
				}
			}
		},
		//获取表格内容区高度
		getTableContentHeight(){
			let printHead = document.getElementsByClassName('printHead')[0]
			let printbottom = document.getElementsByClassName('printbottom')[0]
			let print = document.getElementById('print')
			let printHeadHei
			let printbottomHei
			let printHei
			if(printHead){
				printHeadHei = printHead.offsetHeight
			} 
			if(printbottom){
				printbottomHei = printbottom.offsetHeight
			}
			if(print){
				printHei = print.offsetHeight
			} 
			
			return printHei - printHeadHei - printbottomHei
		},
		//获取表格高度
		getTableHeight(){
			return document.getElementsByClassName('printTable')[0]?document.getElementsByClassName('printTable')[0].offsetHeight:0
		},
		//删除最后子元素
		removeLastChild(dom){
			let lastChild = dom.lastElementChild?dom.lastElementChild:dom.lastChild
			dom.removeChild(lastChild)
		},
		//打印区域渲染
		printHtml(){
			let hei = this.getTableContentHeight()
			let print = this.$refs.print
			
			print.innerHTML=''
			this.newPage()
			
			let dom = this.$refs.print.lastElementChild?this.$refs.print.lastElementChild:this.$refs.print.lastChild
			let table = dom.getElementsByTagName('table')[0]
			
			for(var i=0;i<this.printTable.length;i++){
				let tr = document.createElement('tr')
				let td = document.createElement('td')
				
				tr.innerHTML = "<td style='border: #666 solid 1px;line-height: 20px;'>" +(parseInt(i)+1)+ "</td>"
				for(var key in this.printTable[i]){
					let td = document.createElement('td')
					td.innerHTML = this.printTable[i][key].value
					td.style.border="#666 solid 1px"
					td.style.padding="4px 5px"
					td.style.lineHeight='20px'
					tr.append(td)
				}
				table.append(tr)
				if(table.offsetHeight>hei){
					let fen = document.createElement('div')
					
					fen.style.pageBreakAfter='always'
					fen.style.pageBreakBefore='always'
					print.append(fen)
					
					this.newPage()
					dom = print.lastElementChild?print.lastElementChild:print.lastChild
					table = dom.getElementsByTagName('table')[0]
				}
			}
			//打印
			this.doPrint()
		},
		//建立新页
		newPage(){
			let print = this.$refs.print
			let printTableHead = document.getElementsByClassName('printTableHead')[0].cloneNode(true)
			let printTableFoot = document.getElementsByClassName('printTableFoot')[0].cloneNode(true)
			let page = document.createElement('div')
			let div = document.createElement('div')
			let table = document.createElement('table')
			let tr = document.createElement('tr')
			
			table.style.width='100%'
			table.style.fontSize='14px'
			table.style.borderCollapse='collapse'
			table.style.borderSpacing='0'
			
			tr.innerHTML="<th style='border: #666 solid 1px;line-height: 20px;'>序号</th>"
			for(var i in this.printTable[0]){
				let th = document.createElement('th')
				th.innerHTML=this.printTable[0][i].title
				th.style.border=' #666 solid 1px'
				th.style.lineHeight='20px'
				tr.append(th)
			}
			table.append(tr)
			
			div.append(table)
			page.style.width='210mm'
			page.style.height='297mm'
			page.style.margin="0 auto"
						
			page.append(printTableHead)
			page.append(div)
			page.append(printTableFoot)
			print.append(page)
			
			
		},
		//打印
		doPrint(){	
			var printStr = "<html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8'><style>li{list-style: none;}</style></head><body >";
			var content = "";
			var str = this.$refs.print.innerHTML; 
			content = content + str;
			printStr = printStr+content+"</body></html>";                                              
			var pwin=window.open("Print.htm","print"); 
			pwin.document.write(printStr);
			pwin.document.close("Print.htm");                   
			pwin.print();

		},
		//下一页
		nextPage(){
				this.page++
				this.Render(this.page)
			
		},
		//上一页
		prePage(){
			if(this.page>1){
				this.page--
				this.Render(this.page)
			}
		},
		//导出
		toExcal(){
			var str ='<tr><th>序号</th>'
			for(var i in this.printTable[0]){
				str+= '<th>'+this.printTable[0][i].title + '</th>'
			}
			str += '</tr>'
			for(var i in this.printTable){
				str+='<tr><td>'+(parseInt(i)+1)+'</td>'
				for(var k in this.printTable[i]){
					str+='<td>'+this.printTable[i][k].value+'</td>'
				}
				str+= "</tr>"
			}
			var uri = "data:application/vnd.ms-excel;base64,"
			var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office"xmlns:x="urn:schemas-microsoft-com:office:excel"xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name></x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>'+str+'</table></body></html>';
			var link = document.createElement("A");
			link.href = uri + base64(template);
			link.download ='优木出库单' + this.getYMDHMS() + ".xls";
			link.target = '_blank';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			function base64 (s) { return window.btoa(unescape(encodeURIComponent(s))) }
		},
		open(){
			this.showPrint = true
			// this.printData=this.printObj
			this.printTable = this.printData
		},
	},
	watch:{
		printData:function(){
			this.$nextTick(function(){
				this.Render(1)
			})
		}
	}
};
</script>
<style>
	.print .el-dialog{
		width: 1000px;
		height: 650px;

	}
	.printSet .el-dialog{
		width: 770px;
		height: 650px;
	}
	.printheadSet .el-dialog{
		width: 750px;
		height: 600px;
	}
	.printZiduanSet .el-dialog{
		width: 600px;
		height: 500px;
	}
	.print.el-dialog__wrapper .el-dialog .el-dialog__header{
		background-color: rgb(247,247,247);
	}
	
</style>
<style lang="scss" >
	.page{
		page-break-before: auto;
        page-break-after: always;
	}
	//字段设置
	.selectItem{
		width: 520px;
		height: 180px;
		padding-top: 20px;
		border-bottom: #999 solid 1px;
		margin: 0 auto;
		position: relative;
		span{
			position: absolute;
			top: 25px;
			left: 0;
			font-size: 14px;
			color: #666;
		}
		.itemBox{
			margin-left: 55px;
			div{
				float: left;
				width: 130px;
				height: 23px;
				border: #00A0E9 solid 1px;
				border-radius: 4px;
				margin-right: 5px;
				margin-bottom: 5px;
				&:hover{
					a{
						display: block;
					}
				}
				i{
					font-size: 14px;
					line-height: 23px;
				}
				a{
					float: right;
					width: 17px;
					height: 17px;
					border-radius: 50%;
					text-align: center;
					margin-top: 3px;
					margin-right: 3px;
					cursor: pointer;
					display: none;
					&:hover{
						background-color: #FFA21B;
						i{
							color: #fff;
						}
					}
					i{
						line-height: 17px;
						font-size: 12px;
					}
				}
			}
		}
		.item1Box{
			margin-left: 55px;
			div{
				float: left;
				width: 90px;
				height: 30px;
				color: #666;
				line-height: 30px;
				font-size: 14px;
				padding-right: 5px;
				margin: 0 10px 10px 0;
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
				cursor: pointer;
				&:hover{
					background-color: rgb(51,214,112);
					color: #fff;
					
				}
				i{
					color: #fff;
					line-height: 30px;
					margin: 0 10px;
					font-size: 14px;
				}
			}
		}
	}
	//抬头信息设置
	.setmain{
		width: 630px;
		padding-bottom: 20px;
		padding-top: 10px;
		margin: 0 auto;
		border-bottom: #999 solid 1px;
		&:after{
			content: "";
			height: 0;
			overflow: hidden;
			display: block;
			clear: both;
		}
		&:nth-child(2){
			margin-bottom: 20px;
		}
		.setMainItem{
			float: left;
			width: 50%;
			height: 35px;
			line-height: 35px;
			font-size: 14px;
			margin-top: 20px;
			color: #666;
			label{
				display: inline-block;
				width: 80px;
				text-align: right;
			}
			input{
				width: 198px;
				height: 20px;
				border: #666 solid 1px;
				line-height: 20px;
				outline: none;
				padding: 0 3px;
				border-radius: 4px;
				&:focus{
					border-color: #00A0E9;
				}
			}
		}
	}
	
	//打印设置
	.printSetBox{
		height: 540px;
		width: 600px;
		margin: 0 auto;
		position: relative;
		border-bottom: #666 solid 1px;
		.upImg{
			position: absolute;
			width: 100px;
			height: 100px;
			top: 57px;
			right: 0;
			border: #666 dashed 1px;
			font-size: 18px;
			color: #666;
			line-height: 100px;
			text-align: center;
			img{
				width: 100px;
				height: 100px;
			}
		}
		.printSet1{
			width: 600px;
			height: 85px;
			margin: 0 auto;
			position: relative;
			h3{
				text-align: center;
				line-height: 30px;
				font-size: 16px;
			}
			p{
				text-align: center;
				font-size: 14px;
				line-height: 20px;
				margin-top: 10px;
			}
			button{
				position: absolute;
				top: 4px;
				right: 0;
			}
		}
		.printSet2{
			width: 600px;
			margin: 5px auto;
			border-bottom: #666 solid 1px;
			padding-bottom: 5px;
			&:after{
				height: 0;
				content: "";
				overflow: hidden;
				display: block;
				clear: both;
			}
			li{
				float: left;
				width: 33%;
				height: 20px;
				line-height: 20px;
				font-size: 14px;
			}
		}
		.printSet3{
			width: 600px;
			margin: 5px auto;
			padding-bottom: 30px;
			position: relative;
			&:after{
				content: '';
				height: 0;
				overflow: hidden;
				display: block;
				clear: both;
			}
			li{
				float: left;
				width: 25%;
				height: 20px;
				font-size: 14px;
				line-height: 20px;
			}
			button{
				position: absolute;
				left: 0;
				bottom: 2px;
			}
		}
		.printSet4{
			width: 600px;
			margin: 5px auto;
			padding-bottom: 30px;
			position: relative;
			button{
				position: absolute;
				left: 0;
				bottom: 2px;
			}
			table{
				margin: 5px 0;
				width: 100%;
				th{
					border: #666 solid 1px;
					line-height: 25px;
				}
				td{
					border: #666 solid 1px;
					line-height: 25px;
					height: 25px;
				}
			}
		}
	}
	
	.printBtn{
		width: 98px;
		height: 23px;
		border: #ddd solid 1px;
		background-color: #fff;
		font-size: 14px;
		line-height: 20px;
		padding: 0;
		border-radius: 3px;
		color: #666;
		outline: none;
		i{
			margin: 0 5px;
			font-size: 14px;
			color: #03A9F4;
			margin-left: -5px;
		}
	}
	.printfootBtn{
		height: 50px;
		text-align: center;
		line-height: 50px;
		button{
			display: inline-block;
			width: 98px;
			height: 28px;
			border: #00A0E9 solid 1px;
			border-radius: 4px;
			background-color: #fff;
			color: #00A0E9;
			margin: 0 10px;
			outline: none;
		}
		button:nth-child(2){
			border-color: #999;
			color: #999;
		}
	}
	//打印栏
	.printTop{
		height: 59px;
		padding: 0 20px;
		position: relative;
		border-bottom: #d4d4d4 solid 1px;
		.printTopBar{
			height: 59px;
			.barItem{
				width: 45px;
				height: 55px;
				margin: 2px 5px;
				border-radius: 4px;
				border: 0;
				outline: none;
				background-color: #fff;
				&:hover{
					background-color: #ddd;
				}
				i{
					font-size: 22px;
					color: #666;
				}
			}
		}
		.barPage{
			position: absolute;
			top: 2px;
			right: 20px;
			height: 59px;
			div{
				float: left;
				width: 44px;
				height: 55px;
				line-height: 55px;
				border-radius: 5px;
				text-align: center;
				&:hover{
					background-color: #ddd;
				}
				i{
					font-size: 20px;
				}
			}
			span{
				float: left;
				line-height: 55px;
				padding: 0 10px;
				font-size: 14px;
				color: #666;
			}
		}
	}
	//打印预览
	.printFoot{
		height:555px;
		.printFootMain{
			width: 1000px;
			height: 555px;
			overflow: auto;
			margin: 0 auto;
			.printBox{
				width: 210mm;
				height: 297mm;
				margin: 10mm auto;
				padding: 40px;
				
				box-shadow: #000000 1px 1px 10px;
			}
			.printBox1{
				width: 210mm;
				margin: 40px auto;
				padding: 40px;
				box-shadow: #000000 1px 1px 10px;
			}
		}
	}
	//打印内容预览
	#print{
		width: 100%;
		height: 100%;
		
		overflow: hidden;
		.printHead{
			h3{
				text-align: center;
				font-size: 20px;
				line-height: 30px;
			}
			h5{
				text-align: center;
				font-size: 16px;
				line-height: 25px;
			}
			ul{
				padding: 5px 0;
				border-bottom: #666 solid 1px;
				li{
					line-height: 20px;
					font-size: 14px;
				}
			}
			.headInfo{
				border: 0;
				li{
					float: left;
					width: 50%;
					
				}
				&:after{
					height: 0;
					content: '';
					overflow: hidden;
					display: block;
					clear: both;
				}
			}
		}
		.printbottom{
			padding: 2px 0;
			ul{
				padding: 5px 0;
				li{
					float: left;
					width: 50%;
					font-size: 12px;
					line-height: 20px;
				}
				&:after{
					height: 0;
					content: '';
					overflow: hidden;
					display: block;
					clear: both;
				}
			}
		}
		.printTable{
			table{
				border: #666 solid 1px;
				tr{
					border: #666 solid 1px;
					font-size: 14px;
					th{
						border: #666 solid 1px;
						padding: 4px 2px;
						line-height: 20px;
						vertical-align: middle;
					}
					td{
						border: #666 solid 1px;
						padding: 4px 5px;
						line-height: 20px;
						vertical-align: middle;
					}
				}
			}
		}
	}
</style>
