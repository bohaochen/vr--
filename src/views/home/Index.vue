<template>
	<div class="content roundAnimate">
		<div class="bg"></div>
		<div class="bg-gr"></div>

		<img src="/static/img/qiu.png" class="qiu" />
		<img src="/static/img/qiu_gr.png" class="qiu qiu-gr" />

		<img src="/static/img/pn_logo_03.png" class="logo" />

		<img src="/static/img/wzh3j_01.png" class="sanjiao animated" v-show="hkjAni" :class="{slideInDown:hkjAni}">
		<img src="/static/img/wz_01.png" class="heikeji animated" v-show="hkjAni" :class="{slideInDown:hkjAni}" />
		<img src="/static/img/wz_01_gr.png" class="heikeji-gr animated" v-show="hkjAni" :class="{slideInDown:hkjAni}" />

		<img ref="sanjiao" src="/static/img/wz_02.png" class="heikeji animated" v-show="hkjAni" :class="{slideInDown:hkjAni}" />
		<img src="/static/img/wz_02_gr.png" class="heikeji-gr animated" v-show="hkjAni" :class="{slideInDown:hkjAni}" />

		<img src="/static/img/gx_01.png" class="guangxiao animated" v-show="gxAni" />

		<img src="/static/img/zj_01.png" class="jingweidu" />

		<div class="btns" v-show="gxAni">
			<!-- <div class="btns hidden"> -->
			<img src="/static/img/jt_04.png" class="jiantou psv-marker-jiantou" />
			<img src="/static/img/btn_06.png" @click="goToVr" class="btn2" />
			<img src="/static/img/btn_04.png" @click="goToAi" class="btn1" />
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				hkjAni: true,
				gxAni: false,
				btnAni: false
			};
		},
		mounted() {
			//页面加载完成回调
			this.animateEnd("sanjiao", "gxAni", function() {
				console.log("光线来了");
			});
			this.malfunction();
			this.wxLogin();
		},
		methods: {
			wxLogin() {
				let self = this;
				let url = window.location.href.split('?')[0];
				let code = self.$route.query.code;
				if(code == null || code == '' || !code) {
					window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx42c67be9af7fa426&redirect_uri=' + encodeURIComponent(url) + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
				} else {
					self.$http.post("v1/em?action=oauth2&code=" + code, {})
						.then(function(response) {
							if(response.data.code == 200) {
								console.log(response.data.openid); //用户ID
								window.localStorage.setItem("openid", response.data.openid);
							}
						})
						.catch(function(error) {
							console.log(error);
						});
				}
			},
			goToVr() {
				//页面跳转
				let self = this;
				// 带查询参数，变成 /register?plan=private
				self.$router.push({
					path: "vr",
					query: {
						code: self.$route.query.code,
					}
				});
			},

			goToAi() {
				//页面跳转
				let self = this;
				// 带查询参数，变成 /register?plan=private
				self.$router.push({
					path: "ai",
					query: {
						isIndex: 0,
						code: self.$route.query.code,
					}
				});
			},

			animateEnd(refName, show_age, callback) {
				let self = this;
				//获取页面ref属性DOM(类似于查找id)
				let _rect = self.$refs[refName];
				//监听动画执行回调
				self.MA(_rect, function() {
					console.log("动画执行完毕！");
					if(callback) {
						callback();
					}
					self[show_age] = true;
				});
			},
			malfunction() {
				//"信号干扰出场"
				var num = 1;
				play();

				function play() {
					setTimeout(function() {
						if(num == 1) {
							document.getElementsByClassName("bg-gr")[0].className =
								"bg-gr opacity1";
							document.getElementsByClassName("qiu-gr")[0].className =
								"qiu qiu-gr opacity2";
							document.getElementsByClassName("qiu")[0].className =
								"qiu opacity3";
							document.getElementsByClassName("jingweidu")[0].className =
								"jingweidu opacity3";
						}
						if(num == 5) {
							document.getElementsByClassName("heikeji-gr")[0].className =
								"heikeji-gr chandong";
							document.getElementsByClassName("heikeji-gr")[1].className =
								"heikeji-gr chandong";
							document.getElementsByClassName("bg-gr")[0].className =
								"bg-gr chandong";
						}
						if(num < 6) {
							document.getElementsByClassName("content")[0].className =
								" content " + ("malfunction" + num);
							num++;
							play();
						} else {
							document.getElementsByClassName("content")[0].className = "content";
						}
					}, 500);
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	.content {
		width: 100%;
		height: 100%;
		background-color: #000000;
		overflow: hidden;
		position: relative;
		.bg {
			width: 100%;
			height: 100%;
			background: url(/static/img/bg.jpg) 50%/cover;
			position: absolute;
			top: 0;
			z-index: 1;
			/*// animation: myfirst 2s linear 0.5s infinite alternate;
			// -moz-animation: myfirst 2s linear 0.5s infinite alternate;
			// -webkit-animation: myfirst 2s linear 0.5s infinite alternate;
			// -o-animation: myfirst 2s linear 0.5s infinite alternate;*/
		}
		.bg-gr {
			width: 100%;
			height: 100%;
			background: url(/static/img/bg_gr.jpg) 50%/cover;
			position: absolute;
			top: 0;
			opacity: 0;
			z-index: 2;
		}
		.guangxiao {
			width: 90%;
			margin-left: 5%;
			height: auto;
			position: absolute;
			animation: guangxiao 0.3s linear 1 alternate;
			top: 0;
			z-index: 3;
		}
		.heikeji {
			width: 90%;
			margin-left: 5%;
			height: auto;
			position: absolute;
			animation-timing-function: ease;
			animation-duration: 3.5s;
			top: 0;
			z-index: 3;
		}
		.heikeji-gr {
			width: 90%;
			margin-left: 5%;
			height: auto;
			opacity: 0;
			position: absolute;
			top: 0;
			z-index: 2;
		}
		.jingweidu {
			width: 90%;
			margin-left: 5%;
			margin-top: 5%;
			height: auto;
			position: absolute;
			top: 0;
			opacity: 0.2;
			z-index: 4;
		}
		.hidden {
			display: none;
		}
		.logo {
			width: 26%;
			position: absolute;
			top: 2.5%;
			right: 20px;
			z-index: 2;
		}
		.btns {
			width: 100%;
			position: absolute;
			bottom: 5%;
			z-index: 2;
			/*// opacity: 0;*/
			animation-fill-mode: forwards;
			animation: fuxian 1s;
			.jiantou {
				position: absolute;
				width: 7%;
				top: 0;
				z-index: 2;
				left: 50%;
				margin-left: -3%;
				transform: translate3d(0, -100%, 0);
				-moz-transform: translate3d(0, -100%, 0);
				-webkit-transform: translate3d(0, -100%, 0);
				-o-transform: translate3d(0, -100%, 0);
			}
			.btn1,
			.btn2 {
				width: 66%;
				display: block;
				margin: auto;
				pointer-events: auto;
			}
		}
		.sanjiao {
			width: 90%;
			margin-left: 5%;
			height: auto;
			position: absolute;
			top: 0;
			z-index: 2;
			animation-duration: 2s;
		}
		.qiu {
			width: 90%;
			margin-left: 5%;
			margin-top: 5%;
			height: auto;
			position: absolute;
			top: 0;
			opacity: 0.2;
			z-index: 2;
		}
		.qiu-gr {
			width: 100%;
			margin-top: -5%;
			opacity: 0;
		}
	}
	
	.malfunction1 {
		/*// animation: malfunction1 0.0025s linear 400 alternate;*/
		animation: malfunction1 0.1s linear 10 alternate;
	}
	
	.malfunction2 {
		/*// animation: malfunction2 0.001s linear 1000 alternate;*/
		animation: malfunction2 0.1s linear 10 alternate;
	}
	
	.malfunction3 {
		animation: malfunction3 0.1s linear 10;
	}
	
	.malfunction4 {
		animation: malfunction4 0.15s linear 3 alternate;
	}
	
	.malfunction5 {
		animation: malfunction5 0.15s linear 4 alternate;
	}
	
	.opacity1 {
		animation: opacity1 2s linear 2;
	}
	
	.opacity2 {
		animation: opacity2 2s linear 1;
	}
	
	.opacity3 {
		animation: opacity3 1s linear 2;
		animation-fill-mode: forwards;
	}
	
	.chandong {
		animation: chandong 0.025s linear 8 alternate;
	}
	
	@keyframes guangxiao {
		0% {
			opacity: 0;
			transform: rotate(9deg) scale(1.3);
		}
		100% {
			opacity: 1;
			transform: rotate(0deg) scale(1);
		}
	}
	
	@keyframes fudong {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
	
	@keyframes opacity1 {
		0% {
			opacity: 0;
		}
		1% {
			opacity: 0.1;
		}
		15% {
			opacity: 0.2;
		}
		16% {
			opacity: 0;
		}
		34% {
			opacity: 0;
		}
		36% {
			opacity: 0.3;
		}
		38% {
			opacity: 0;
		}
		100% {
			opacity: 0;
		}
	}
	
	@keyframes opacity2 {
		0% {
			opacity: 0;
		}
		1% {
			opacity: 0.03;
		}
		15% {
			opacity: 0.08;
		}
		16% {
			opacity: 0;
		}
		99% {
			opacity: 0;
		}
	}
	
	@keyframes opacity3 {
		0% {
			opacity: 0.1;
		}
		100% {
			opacity: 1;
		}
	}
	
	@keyframes chandong {
		0% {
			transform: translate(20px, 0) scale(1);
			opacity: 0.2;
		}
		30% {
			transform: translate(40px, 3px) scale(1);
			opacity: 0.6;
		}
		70% {
			transform: translate(-20px, -3px) scale(1);
			opacity: 0.4;
		}
		100% {
			transform: translate(10px, 3px) scale(1);
			opacity: 0.4;
		}
	}
	
	@keyframes sanjiaoFD {
		from {
			transform: translate3d(0, 5px, 0);
			-moz-transform: translate3d(0, 5px, 0);
			-webkit-transform: translate3d(0, 5px, 0);
			-o-transform: translate3d(0, 5px, 0);
		}
		to {
			transform: translate3d(0, -5px, 0);
			-moz-transform: translate3d(0, -5px, 0);
			-webkit-transform: translate3d(0, -5px, 0);
			-o-transform: translate3d(0, -5px, 0);
		}
	}
	
	@keyframes myfirst {
		from {
			opacity: 1;
		}
		to {
			opacity: 0.6;
		}
	}
	
	@keyframes malfunction1 {
		0% {
			transform: translate(2px, 0) scale(1);
		}
		100% {
			transform: translate(-3px, 0px) scale(1);
		}
	}
	
	@keyframes malfunction2 {
		0% {
			transform: translate(-4px, 0px) scale(1);
		}
		100% {
			transform: translate(2px, 0px) scale(1.01);
		}
	}
	
	@keyframes malfunction3 {
		0% {
			transform: translate(-7px, 0) scale(1.01);
		}
		100% {
			transform: translate(0, 0) scale(1);
		}
	}
	
	@keyframes malfunction4 {
		0% {
			transform: translate(-2px, 1px);
		}
		100% {
			transform: translate(2px, 0px);
		}
	}
	
	@keyframes malfunction5 {
		0% {
			transform: translate(2px, 0);
		}
		100% {
			transform: translate(-1px, 0px);
		}
	}
</style>