// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// import router from './router'
import router from './route'
import store from './store'
import axios from 'axios'
//请求拦截
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.interceptors.request.use((config) => {
	if (config.url.substr(0, 4) === '/api') {
		config.url = 'http://192.168.0.116:8066' + config.url.substr(4);
	}
	if (config.url.substr(0, 4) === '/apt') {
		config.url = 'http://192.168.0.116:7066' + config.url.substr(4);
	}
	if (config.url.substr(0, 4) === '/aps') {
		config.url = 'http://192.168.0.116:7077' + config.url.substr(4);
	}
	if (config.url.substr(0, 4) === '/apa') {
		config.url = 'http://192.168.0.116:7076' + config.url.substr(4);
	}
	if (config.url.substr(0, 4) === '/log') {
		config.url = 'http://192.168.0.116:9999' + config.url.substr(4);
	}
	if (config.url.substr(0, 4) === '/app') {
		config.url = 'http://192.168.0.116:8099' + config.url.substr(4);
	}
	return config;
});
Vue.prototype.$axios = axios;

//ElementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//公共数据
import global_ from './components/Global.vue'
//公共工具方法
import utils from './assets/js/utils.js'
//全局过滤器
import './assets/js/filter.js'

import directive from './assets/js/directives.js'

//全局样式
import './assets/css/reset.css'
import './assets/css/common.css'


import SlideVerify from './lib/index'

Vue.prototype.GLOBAL_ = global_;
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;
Vue.use(utils);
Vue.use(ElementUI);
Vue.use(SlideVerify);


/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	store,
	components: {
		App
	},
	template: '<App/>'
})
