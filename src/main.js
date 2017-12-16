import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import axios from 'axios'
import routeConfig from './router'
import * as APIS from './api.js'
import qs from 'qs'; //使用qs模块转换payload参数为formdata请求参数

// 添加请求拦截器
axios.interceptors.request.use(function(config) {
    // 在发送请求之前做些什么
    config.data = qs.stringify(config.data);
    return config;
}, function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function(response) {
    // 对响应数据做点什么
    return response;
}, function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

import {
    timeToNow,
    jsonFormat,
    dateFormat,
    numberinteger,
} from './filters';

Vue.use(VueRouter);

Vue.filter('timeToNow', timeToNow);
Vue.filter('dateFormat', dateFormat);
Vue.filter('numberinteger', numberinteger);


Vue.prototype.API = APIS;
Vue.prototype.$http = axios;

const router = new VueRouter({
    routes: routeConfig,
})
router.beforeEach((to, from, next) => {
    next();
})

router.afterEach(transition => {

});

new Vue({
    el: '#app',
    template: '<App/>',
    router,
    components: {
        App
    }
}).$mount('#app');