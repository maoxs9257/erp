import Vue from 'vue';
//时间格式过滤器
Vue.filter('time',function(data,type){
  if(!data) return '';
	let date = new Date(data);
	let Y = date.getFullYear();
	let M = date.getMonth() + 1;
	let D = date.getDate();
	let h = date.getHours();
	let m = date.getMinutes();
	let s = date.getSeconds();
	M = M>=10?M:'0'+M;
	D = D>=10?D:'0'+D;
	h = h>=10?h:'0'+h;
	m = m>=10?m:'0'+m;
	s = s>=10?s:'0'+s;
	switch (type){
		case 'y-m-d' : return Y + '-' + M + '-' + D;
		case 'ymdhms' : return '' + Y + M + D + h + m + s;
	}
});
Vue.filter('eMoney',function(data){
	if(data){
	  data = Math.floor(parseFloat(data));
		return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	}else{
		return 0;
	}
});
Vue.filter("imgUrl",function(data){
	return 'https://uwood.oss-cn-qingdao.aliyuncs.com/shop/'+data;
});
