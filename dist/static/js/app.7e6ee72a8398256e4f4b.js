webpackJsonp([10,8],{0:function(t,e,n){"use strict";function o(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e.default=t,e}function a(t){return t&&t.__esModule?t:{default:t}}var i=n(260),r=a(i),u=n(256),s=(a(u),n(581)),c=a(s),l=n(562),p=a(l),f=n(580),d=a(f),m=n(226),h=a(m),g=n(255),v=a(g),w=n(253),y=o(w),b=n(521),M=a(b),x=n(254);h.default.interceptors.request.use(function(t){return t.data=M.default.stringify(t.data),t},function(t){return r.default.reject(t)}),h.default.interceptors.response.use(function(t){return t},function(t){return r.default.reject(t)}),c.default.use(d.default),c.default.filter("timeToNow",x.timeToNow),c.default.filter("dateFormat",x.dateFormat),c.default.filter("numberinteger",x.numberinteger),c.default.prototype.MA=x.MA,c.default.prototype.toast=(0,x.toast)(),c.default.prototype.API=y,c.default.prototype.$http=h.default;var A=new d.default({mode:"history",routes:v.default});A.beforeEach(function(t,e,n){if(isLoadAllImgs)n();else{var o=setInterval(function(){isLoadAllImgs&&(n(),clearInterval(o))},50);loader.start()}}),A.afterEach(function(t){}),new c.default({el:"#app",template:"<App/>",router:A,components:{App:p.default}}).$mount("#app")},244:function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"app",data:function(){return{auto:!0,isloadImgs:!1,preloadingImgs:["https://wx.nullexcept.com/s_static/img/1.jpg","https://wx.nullexcept.com/s_static/img/2.jpg","https://wx.nullexcept.com/s_static/img/3.jpg","https://wx.nullexcept.com/s_static/img/4.jpg"]}},mounted:function(){var t=this;t.setShare()},methods:{share:function(t,e,n,o){wx.onMenuShareTimeline({title:t,link:e,imgUrl:n,success:function(){},cancel:function(){}}),wx.onMenuShareAppMessage({title:t,desc:o,link:e,imgUrl:n,type:"link",dataUrl:"",success:function(){},cancel:function(){}}),wx.onMenuShareQQ({title:t,desc:o,link:e,imgUrl:n,success:function(){},cancel:function(){}})},setShare:function(){var t=this,e=(new Date).getTime(),n=encodeURIComponent(window.location.href.split("#")[0]);t.$http.post("v1/em?action=query_config_parm&timestamp="+e+"&url="+n,{}).then(function(e){200==e.data.code&&(wx.config({debug:!1,appId:"wx42c67be9af7fa426",timestamp:e.data.timestamp,nonceStr:e.data.noncestr,signature:e.data.signature,jsApiList:["checkJsApi","onMenuShareTimeline","onMenuShareAppMessage","onMenuShareQQ"]}),wx.error(function(t){console.log("验证失败")}),wx.ready(function(){console.log("ready"),wx.checkJsApi({jsApiList:["checkJsApi","onMenuShareTimeline","onMenuShareAppMessage","onMenuShareQQ"],success:function(e){var n="平安黑科技邀您来感受",o="https://wx.nullexcept.com",a="https://wx.nullexcept.com/static/img/wz_02.21f4fe7.png",i="这个黑科技亮瞎了我的";t.share(n,o,a,i)}})}))}).catch(function(t){console.log(t)})}},components:{}}},253:function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n="v1/me?action=";e.compare=n+"compare"},254:function(t,e,n){"use strict";function o(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0}),e.numberinteger=e.countFormat=e.dateFormat=e.jsonFormat=e.isLogin=e.timeToNow=e.MA=e.toast=void 0;var a=n(258),i=o(a);e.toast=function t(){var e=!1,t=document.getElementById("toast");return function(n){if(e)return!1;e=!0,t.innerHTML=n,t.classList.add("toast-ain");var o=function n(){t.classList.remove("toast-out"),t.classList.remove("toast-ain"),t.removeEventListener("webkitAnimationEnd",n),e=!1},a=function e(){setTimeout(function(){t.removeEventListener("webkitAnimationEnd",e),t.addEventListener("webkitAnimationEnd",o,!1),t.classList.add("toast-out")},2222)};t.addEventListener("webkitAnimationEnd",a,!1)}},e.MA=function(t,e){t.addEventListener("webkitAnimationEnd",function(){e&&e()},!1)},e.timeToNow=function(t){var e=parseFloat(new Date-new Date(t))/1e3,n=void 0;return e&&(n=e>60&&e<3600?parseInt(e/60,10)+"分钟前":e>=3600&&e<86400?parseInt(e/3600,10)+"小时前":e>=86400&&e<2592e3?parseInt(e/86400,10)+"天前":e>=2592e3&&e<31536e3?parseInt(e/2592e3,10)+"个月前":e>=31536e3?parseInt(e/31536e3,10)+"年前":parseInt(e,10)+"秒前"),n},e.isLogin=function(t,e){try{8888==t&&(console.log("请登录！"),window.localStorage.removeItem("userInfo"),e.$router.replace("/login"))}catch(t){}},e.jsonFormat=function(t){try{return JSON.parse(t)}catch(e){return t}},e.dateFormat=function(t,e){if(""==t||"undefined"==typeof t)return"";t=Number(t),t=new Date(t);var n={M:t.getMonth()+1,d:t.getDate(),h:t.getHours(),m:t.getMinutes(),s:t.getSeconds(),q:Math.floor((t.getMonth()+3)/3),S:t.getMilliseconds()};return e=e.replace(/([yMdhmsqS])+/g,function(e,o){var a=n[o];return void 0!==a?(e.length>1&&(a="0"+a,a=a.substr(a.length-2)),a):"y"===o?(t.getFullYear()+"").substr(4-e.length):e}),"NaN-aN-aN aN:aN:aN"==e||"1970-01-01 08:00:00"==e?"":e},e.countFormat=function(t){return t=t<10?"0"+t:""+t,t.substr(0,2)},e.numberinteger=function(t){if(t)return(0,i.default)(t).toFixed(2)}},255:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=[{path:"/",name:"首页",component:function(t){n.e(2,function(e){var n=[e(567)];t.apply(null,n)}.bind(this))}},{path:"/vr",name:"全景图",component:function(t){n.e(4,function(e){var n=[e(570)];t.apply(null,n)}.bind(this))}},{path:"/eyes",name:"黑科技就在眼前",component:function(t){n.e(5,function(e){var n=[e(565)];t.apply(null,n)}.bind(this))}},{path:"/ai",name:"查看AI故事",component:function(t){n.e(7,function(e){var n=[e(563)];t.apply(null,n)}.bind(this))}},{path:"/imagerecognition",name:"图像识别",component:function(t){n.e(0,function(e){var n=[e(566)];t.apply(null,n)}.bind(this))}},{path:"/userinfo",name:"录入用户信息",component:function(t){n.e(3,function(e){var n=[e(569)];t.apply(null,n)}.bind(this))}},{path:"/luckdraw",name:"抽奖页面",component:function(t){n.e(6,function(e){var n=[e(568)];t.apply(null,n)}.bind(this))}},{path:"/demo",name:"demo",component:function(t){n.e(1,function(e){var n=[e(564)];t.apply(null,n)}.bind(this))}},{path:"*",redirect:"/"}]},511:function(t,e){},562:function(t,e,n){var o,a;n(511),o=n(244);var i=n(571);a=o=o||{},"object"!=typeof o.default&&"function"!=typeof o.default||(a=o=o.default),"function"==typeof a&&(a=a.options),a.render=i.render,a.staticRenderFns=i.staticRenderFns,t.exports=o},571:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[n("transition",{attrs:{name:"bounce"}},[n("router-view")],1)],1)},staticRenderFns:[]}}});