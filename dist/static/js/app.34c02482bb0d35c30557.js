webpackJsonp([10,8],{0:function(e,t,n){"use strict";function o(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}function a(e){return e&&e.__esModule?e:{default:e}}var i=n(260),r=a(i),u=n(256),c=(a(u),n(581)),s=a(c),l=n(562),p=a(l),d=n(580),f=a(d),m=n(226),h=a(m),g=n(255),v=a(g),w=n(253),y=o(w),b=n(521),M=a(b),_=n(254);h.default.interceptors.request.use(function(e){return e.data=M.default.stringify(e.data),e},function(e){return r.default.reject(e)}),h.default.interceptors.response.use(function(e){return e},function(e){return r.default.reject(e)}),s.default.use(f.default),s.default.filter("timeToNow",_.timeToNow),s.default.filter("dateFormat",_.dateFormat),s.default.filter("numberinteger",_.numberinteger),s.default.prototype.MA=_.MA,s.default.prototype.toast=(0,_.toast)(),s.default.prototype.API=y,s.default.prototype.$http=h.default;var x=new f.default({mode:"history",routes:v.default});x.beforeEach(function(e,t,n){if(isLoadAllImgs)n();else{var o=setInterval(function(){isLoadAllImgs&&(n(),clearInterval(o))},50);loader.start()}}),x.afterEach(function(e){}),new s.default({el:"#app",template:"<App/>",router:x,components:{App:p.default}}).$mount("#app")},244:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"app",data:function(){return{auto:!0,isloadImgs:!1,preloadingImgs:["https://wx.nullexcept.com/s_static/img/1.jpg","https://wx.nullexcept.com/s_static/img/2.jpg","https://wx.nullexcept.com/s_static/img/3.jpg","https://wx.nullexcept.com/s_static/img/4.jpg"]}},mounted:function(){var e=this;e.setShare()},methods:{wxLogin:function(){var e=this,t=window.location.href.split("?")[0],n=e.$route.query.code;null==n||""==n?window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx42c67be9af7fa426&redirect_uri="+encodeURIComponent(t)+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect":e.$http.post("v1/em?action=oauth2&code="+n,{}).then(function(e){200==e.data.code&&(console.log(e.data.openid),window.localStorage.setItem("openid",e.data.openid),alert(e.data.openid))}).catch(function(e){console.log(e)})},share:function(e,t,n,o){wx.onMenuShareTimeline({title:e,link:t,imgUrl:n,success:function(){},cancel:function(){}}),wx.onMenuShareAppMessage({title:e,desc:o,link:t,imgUrl:n,type:"link",dataUrl:"",success:function(){},cancel:function(){}}),wx.onMenuShareQQ({title:e,desc:o,link:t,imgUrl:n,success:function(){},cancel:function(){}})},setShare:function(){var e=this,t=(new Date).getTime(),n=encodeURIComponent(window.location.href.split("#")[0]);e.$http.post("v1/em?action=query_config_parm&timestamp="+t+"&url="+n,{}).then(function(t){200==t.data.code&&(wx.config({debug:!1,appId:"wx42c67be9af7fa426",timestamp:t.data.timestamp,nonceStr:t.data.noncestr,signature:t.data.signature,jsApiList:["checkJsApi","onMenuShareTimeline","onMenuShareAppMessage","onMenuShareQQ"]}),wx.error(function(e){console.log("验证失败")}),wx.ready(function(){console.log("ready"),wx.checkJsApi({jsApiList:["checkJsApi","onMenuShareTimeline","onMenuShareAppMessage","onMenuShareQQ"],success:function(t){var n="平安黑科技邀您来感受",o="https://wx.nullexcept.com",a="https://wx.nullexcept.com/static/img/wz_02.21f4fe7.png",i="这个黑科技亮瞎了我的";e.share(n,o,a,i)}})}))}).catch(function(e){console.log(e)})}},components:{}}},253:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n="v1/me?action=";t.compare=n+"compare"},254:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.numberinteger=t.countFormat=t.dateFormat=t.jsonFormat=t.isLogin=t.timeToNow=t.MA=t.toast=void 0;var a=n(258),i=o(a);t.toast=function e(){var t=!1,e=document.getElementById("toast");return function(n){if(t)return!1;t=!0,e.innerHTML=n,e.classList.add("toast-ain");var o=function n(){e.classList.remove("toast-out"),e.classList.remove("toast-ain"),e.removeEventListener("webkitAnimationEnd",n),t=!1},a=function t(){setTimeout(function(){e.removeEventListener("webkitAnimationEnd",t),e.addEventListener("webkitAnimationEnd",o,!1),e.classList.add("toast-out")},2222)};e.addEventListener("webkitAnimationEnd",a,!1)}},t.MA=function(e,t){e.addEventListener("webkitAnimationEnd",function(){t&&t()},!1)},t.timeToNow=function(e){var t=parseFloat(new Date-new Date(e))/1e3,n=void 0;return t&&(n=t>60&&t<3600?parseInt(t/60,10)+"分钟前":t>=3600&&t<86400?parseInt(t/3600,10)+"小时前":t>=86400&&t<2592e3?parseInt(t/86400,10)+"天前":t>=2592e3&&t<31536e3?parseInt(t/2592e3,10)+"个月前":t>=31536e3?parseInt(t/31536e3,10)+"年前":parseInt(t,10)+"秒前"),n},t.isLogin=function(e,t){try{8888==e&&(console.log("请登录！"),window.localStorage.removeItem("userInfo"),t.$router.replace("/login"))}catch(e){}},t.jsonFormat=function(e){try{return JSON.parse(e)}catch(t){return e}},t.dateFormat=function(e,t){if(""==e||"undefined"==typeof e)return"";e=Number(e),e=new Date(e);var n={M:e.getMonth()+1,d:e.getDate(),h:e.getHours(),m:e.getMinutes(),s:e.getSeconds(),q:Math.floor((e.getMonth()+3)/3),S:e.getMilliseconds()};return t=t.replace(/([yMdhmsqS])+/g,function(t,o){var a=n[o];return void 0!==a?(t.length>1&&(a="0"+a,a=a.substr(a.length-2)),a):"y"===o?(e.getFullYear()+"").substr(4-t.length):t}),"NaN-aN-aN aN:aN:aN"==t||"1970-01-01 08:00:00"==t?"":t},t.countFormat=function(e){return e=e<10?"0"+e:""+e,e.substr(0,2)},t.numberinteger=function(e){if(e)return(0,i.default)(e).toFixed(2)}},255:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=[{path:"/",name:"首页",component:function(e){n.e(2,function(t){var n=[t(567)];e.apply(null,n)}.bind(this))}},{path:"/vr",name:"全景图",component:function(e){n.e(4,function(t){var n=[t(570)];e.apply(null,n)}.bind(this))}},{path:"/eyes",name:"黑科技就在眼前",component:function(e){n.e(5,function(t){var n=[t(565)];e.apply(null,n)}.bind(this))}},{path:"/ai",name:"查看AI故事",component:function(e){n.e(7,function(t){var n=[t(563)];e.apply(null,n)}.bind(this))}},{path:"/imagerecognition",name:"图像识别",component:function(e){n.e(0,function(t){var n=[t(566)];e.apply(null,n)}.bind(this))}},{path:"/userinfo",name:"录入用户信息",component:function(e){n.e(3,function(t){var n=[t(569)];e.apply(null,n)}.bind(this))}},{path:"/luckdraw",name:"抽奖页面",component:function(e){n.e(6,function(t){var n=[t(568)];e.apply(null,n)}.bind(this))}},{path:"/demo",name:"demo",component:function(e){n.e(1,function(t){var n=[t(564)];e.apply(null,n)}.bind(this))}},{path:"*",redirect:"/"}]},511:function(e,t){},562:function(e,t,n){var o,a;n(511),o=n(244);var i=n(571);a=o=o||{},"object"!=typeof o.default&&"function"!=typeof o.default||(a=o=o.default),"function"==typeof a&&(a=a.options),a.render=i.render,a.staticRenderFns=i.staticRenderFns,e.exports=o},571:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("transition",{attrs:{name:"bounce"}},[n("router-view")],1)],1)},staticRenderFns:[]}}});