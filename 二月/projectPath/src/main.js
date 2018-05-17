// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import router from './router'
import App from './App'
import   './common/resetSize.js'
import  '@/common/common.css'
import axios from 'axios'
import Vuex from 'vuex'
import moment from 'moment';
import { AlertPlugin} from 'vux'
Vue.use(AlertPlugin);
moment.locale('zh-cn');
Vue.use(Vuex)
import qs from 'qs';
// axios.defaults.baseURL = 'http://172.16.0.111:8080/'

Vue.prototype.$http = axios
Vue.prototype.$moment = moment;
// Vue.use(require('vue-wechat-title'))
FastClick.attach(document.body)

Vue.config.productionTip = false

const store = new Vuex.Store({
	state:{
		openid:111
	}
}) // 这里你可能已经有其他 module

store.registerModule('vux', { // 名字自己定义
  state: {
    isLoading: false
  },
  mutations: {
    updateLoadingStatus (state, payload) {
      state.isLoading = payload.isLoading
    }
  }
})

router.beforeEach(function (to, from, next) {
  store.commit('updateLoadingStatus', {isLoading: true})
  next()
})

router.afterEach(function (to) {
  store.commit('updateLoadingStatus', {isLoading: false})
})

axios.interceptors.request.use(function (config) {
	if (config.method=="post"){
        config.data = qs.stringify(config.data);
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
  if (config.url != "/api/charging/charging" && config.url != "/api/user/login"){
    store.commit('updateLoadingStatus', { isLoading: true });
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
  store.commit('updateLoadingStatus', {isLoading: false})
  return response;
}, function (error) {
  return Promise.reject(error);
});

Vue.prototype.$msgbox = function (title,msg) {
  this.$vux.alert.show({
    title:title,
    content: msg
  });
}
/* eslint-disable no-new */
new Vue({
  render: h => h(App),
  store,
  router:router,
}).$mount('#app-box')
