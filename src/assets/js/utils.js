export default {
	install(Vue, options) {
		Vue.prototype.time = function(data,type){
			let date = new Date(data);
			let Y = date.getFullYear();
			let M = date.getMonth() + 1;
			let D = date.getDate();
			let h = date.getHours();
			let m = date.getMinutes();
			let s = date.getSeconds();
			let w = 
			M = M>=10?M:'0'+M;
			D = D>=10?D:'0'+D;
			h = h>=10?h:'0'+h;
			m = m>=10?m:'0'+m;
			s = s>=10?s:'0'+s;
			switch (type){
				case 'y-m-d' : return Y + '-' + M + '-' + D;
				case 'ymdhms' : return '' + Y + M + D + h + m + s;
        case 'Y/M/D h/m/s' : return Y + '/' + M + '/' + D + ' ' + h + ':' + m + ':' + s;
				case "y-m": return Y + '-' + M;
				case "y-w": return Y + '-' + getWeek(date);
			};
			function getWeek(dt){
				let d1 = new Date(dt);
				let d2 = new Date(dt);
				d2.setMonth(0);
				d2.setDate(1);
				let rq = d1-d2;
				let days = Math.ceil(rq/(24*60*60*1000));
				let num = Math.ceil(days/7);
				return num;
			}
		};
		Vue.prototype.getWH = function(data) {
			let {
				nums,
				width
			} = data;
			let MaxW = parseInt(width / 230);
			if (MaxW > nums) MaxW = nums;
			let MinH = Math.ceil(nums / MaxW);
			let w = MaxW * 230;
			let h = MinH * 185;
			return {
				w,
				h
			}
		};
		Vue.prototype.proData = function(str) {
			if (str && str !== '') {
				let arr = str.split(',');
				let obj = {};
				for (let i in arr) {
					if (arr[i] !== '') {
						obj[arr[i].split(':')[0]] = arr[i].split(':')[1];
					}
				}
				return obj;
			} else {
				return {};
			}
		};
		Vue.prototype.uniq = function(array) {
			var temp = [];
			for (var i = 0; i < array.length; i++) {
				//如果当前数组的第i项在当前数组中第一次出现的位置是i，才存入数组；否则代表是重复的
				if (array.indexOf(array[i]) == i) {
					temp.push(array[i])
				}
			}
			return temp;
		};
		function unique(arr) {
			return [...new Set(arr)]
		};
	}
}
