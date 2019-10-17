import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
	//全局变量
	state:{
		//登陆状态
		token:undefined,
		headBack:undefined,
		role:undefined,
    news:{},
		setJson:{},
		id:null
	},

	mutations:{
		// 登陆
		login (state, value) {
		   state.token = value;
		   sessionStorage.setItem("youmuUser",value);
		},
		// 退出登陆
		loginout (state) {
		   state.token = null;
		   sessionStorage.removeItem("youmuUser");
		},
		setHeadBack(state,value){
			state.token = value;
			sessionStorage.setItem("headBack",value);
		},
		removeHeadBack(state){
			state.headBack = null;
			sessionStorage.removeItem('headBack');
		},
		//保存权限
		saveRole(state,value){
			let data = JSON.parse(value);
			let obj = {};
			for(let i in data.menuList){obj[data.menuList[i].permission]=true;}
			state.role = obj;
			sessionStorage.setItem("role",JSON.stringify(obj));
		},
		//删除权限
		removeRole(state){
			state.role = null;
			sessionStorage.removeItem('role');
		},
    // 设置消息数量
    setNews(state,num){
		  state.news = num;
    },
		// 修改设置数据
		setSetJson(state,value){
			state.setJson = JSON.stringify(value);
			sessionStorage.setItem('set',JSON.stringify(value));
		},
		setId(state,value){
			state.id = value;
			 sessionStorage.setItem('setId',JSON.stringify(value));
		}
	}
});

export default store
