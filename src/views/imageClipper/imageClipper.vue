<template>
	<div class="clipper-container" ref="clipper">
		<canvas ref="canvas" style="visibility: hidden;"></canvas>

		<!-- 裁剪部分 -->
		<div class="clipper-part">
			<div class="pCanvas-container">
				<canvas ref="pCanvas" style="width:100%;height:100%"></canvas>
			</div>
		</div>

		<!-- 底部操作栏 -->

		<!-- 背景遮罩 -->
		<div class="mask" :class="{opacity: maskShow}"></div>

		<!-- 手势操作层 -->
		<div class="gesture-mask" ref="gesture"></div>
	</div>
</template>

<style lang="scss" scoped>
	.clipper-container {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 4;
		line-height: 0;
		background-color: #000;
		.clipper-part {
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			z-index: 100;
			z-index: 102;
			.pCanvas-container {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			}
		}
		.action-bar {
			box-sizing: content-box;
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			z-index: 100;
			top: auto;
			z-index: 103;
			height: 60px;
			line-height: 60px;
			button {
				display: block;
				padding: 0 15px;
				line-height: 60px;
				font-size: 16px;
				color: #fff;
				background: none;
				border: none;
				outline: 0;
				&.btn-cancel {
					float: left;
				}
				&.btn-ok {
					float: right;
				}
			}
		}
		.mask {
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			z-index: 100;
			z-index: 101;
			transition: opacity 500ms;
			opacity: 1;
			&.opacity {
				opacity: 1;
			}
		}
		.gesture-mask {
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			z-index: 100;
			/*bottom: 61px;*/
			bottom: 0;
			z-index: 103;
		}
	}
</style>

<script>
	export default {
		name: 'imageClipper',
		props: {
			img: String, //url或dataUrl
			clipperImgWidth: {
				type: Number,
				default: 840
			},
			clipperImgHeight: {
				type: Number,
				default: 840
			}
		},
		watch: {
			img() {
				this.loadImgQueue.push(this.img);
				this._loadImg();
			}
		},
		data() {
			return {
				quality: 0.5,
				originXDiff: 0, //裁剪canvas与原图canvas坐标原点上的差值
				originYDiff: 0,

				maskShow: true,
				maskShowTimer: null,

				ctx: null,
				pCtx: null,
				actionBarHeight: 0,
				loadImgQueue: [], //加载图片队列
				$img: null,
				imgLoaded: false,
				imgLoading: false,
				imgStartWidth: null,
				imgStartHeight: null,
				imgCurrentWidth: null,
				imgCurrentHeight: null,
				imgX: null, //img对于canvas的坐标
				imgY: null,
				imgScale: 1, //图片目前的缩放倍数 范围是1-5
				imgMinScale: 1,
				imgMaxScale: 5,
				imgScaleStep: 60, //缩放步长，每60px加减0.1

				//图片canvas宽高
				cWidth: 0,
				cHeight: 0
			}
		},
		mounted() {
			//			setTimeout(() => {
			//				this._initClipper();
			//			}, 10);
		},
		beforeDestroy() {
			let $gesture = this.$refs.gesture;

			$gesture.ontouchstart = null;
			$gesture.ontouchmove = null;
			$gesture.outouchend = null;
		},
		methods: {
			_initClipper(imgUrl) {
				//console.log(imgUrl);
				this.$nextTick(function() {
					this.loadImgQueue.push(imgUrl);
					this._initCanvas();
					this._loadImg();
					this._initEvent();
				})
			},
			_initCanvas() {
				let $canvas = this.$refs.canvas,
					$pCanvas = this.$refs.pCanvas,
					clipperClientRect = this.$refs.clipper.getBoundingClientRect(),
					clipperWidth = parseInt(this.clipperImgWidth / window.devicePixelRatio),
					clipperHeight = parseInt(this.clipperImgHeight / window.devicePixelRatio);

				this.ctx = $canvas.getContext('2d');
				this.pCtx = $pCanvas.getContext('2d');

				//判断clipperWidth与clipperHeight有没有超过容器值
				if(clipperWidth < 0 || clipperWidth > clipperClientRect.width) {
					clipperWidth = 840
				}

				if(clipperHeight < 0 || clipperHeight > clipperClientRect.height) {
					clipperHeight = 840
				}

				//因为canvas在手机上会被放大，因此里面的内容会模糊，这里根据手机的devicePixelRatio来放大canvas，然后再通过设置css来收缩，因此关于canvas的所有值或坐标都要乘以devicePixelRatio
				$canvas.style.width = clipperClientRect.width + 'px';
				$canvas.style.height = clipperClientRect.height + 'px';
				$canvas.width = this._ratio(clipperClientRect.width);
				$canvas.height = this._ratio(clipperClientRect.height);

				$pCanvas.style.width = clipperClientRect.width + 'px';
				$pCanvas.style.height = clipperClientRect.height + 'px';
				$pCanvas.width = this._ratio(clipperClientRect.width);
				$pCanvas.height = this._ratio(clipperClientRect.height); //计算两个canvas原点的x y差值
				let cClientRect = $canvas.getBoundingClientRect(),
					pClientRect = $pCanvas.getBoundingClientRect();

				this.originXDiff = pClientRect.left - cClientRect.left;
				this.originYDiff = pClientRect.top - cClientRect.top;
				//				this.cWidth = cClientRect.width;
				//				this.cHeight = cClientRect.height;
				this.cWidth = $canvas.width;
				this.cHeight = $canvas.height;
			},
			_initEvent() {
				let $gesture = this.$refs.gesture,
					cClientRect = this.$refs.canvas.getBoundingClientRect(),
					scx = 0, //对于单手操作是移动的起点坐标，对于缩放是图片距离两手指的中点最近的图标。
					scy = 0,
					fingers = {}; //记录当前有多少只手指在触控屏幕

				//one finger
				let iX = this.imgX,
					iY = this.imgY;

				//two finger
				let figureDistance = 0,
					pinchScale = this.imgScale;

				$gesture.addEventListener('touchstart', e => {
					if(!this.imgLoaded) {
						return;
					}

					if(e.touches.length === 1) {
						let finger = e.touches[0];

						scx = finger.pageX;
						scy = finger.pageY;
						iX = this.imgX;
						iY = this.imgY;
						fingers[finger.identifier] = finger;
					} else if(e.touches.length === 2) {
						let finger1 = e.touches[0],
							finger2 = e.touches[1],
							f1x = finger1.pageX - cClientRect.left,
							f1y = finger1.pageY - cClientRect.top,
							f2x = finger2.pageX - cClientRect.left,
							f2y = finger2.pageY - cClientRect.top;

						scx = parseInt((f1x + f2x) / 2);
						scy = parseInt((f1y + f2y) / 2);
						figureDistance = this._pointDistance(f1x, f1y, f2x, f2y);
						fingers[finger1.identifier] = finger1;
						fingers[finger2.identifier] = finger2;

						//判断变换中点是否在图片中，如果不是则去离图片最近的点
						if(scx < this.imgX) {
							scx = this.imgX;
						}
						if(scx > this.imgX + this.imgCurrentWidth) {
							scx = this.imgX + this.imgCurrentHeight;
						}
						if(scy < this.imgY) {
							scy = this.imgY;
						}
						if(scy > this.imgY + this.imgCurrentHeight) {
							scy = this.imgY + this.imgCurrentHeight;
						}
					}
				}, false);
				$gesture.addEventListener('touchmove', e => {
					e.preventDefault();

					if(!this.imgLoaded) {
						return;
					}

					this.maskShowTimer && clearTimeout(this.maskShowTimer);
					this.maskShow = false;

					if(e.touches.length === 1) {
						let f1x = e.touches[0].pageX,
							f1y = e.touches[0].pageY;
						this._drawImage(iX + f1x - scx, iY + f1y - scy, this.imgCurrentWidth, this.imgCurrentHeight);
					} else if(e.touches.length === 2) {
						let finger1 = e.touches[0],
							finger2 = e.touches[1],
							f1x = finger1.pageX - cClientRect.left,
							f1y = finger1.pageY - cClientRect.top,
							f2x = finger2.pageX - cClientRect.left,
							f2y = finger2.pageY - cClientRect.top,
							newFigureDistance = this._pointDistance(f1x, f1y, f2x, f2y),
							scale = this.imgScale + parseFloat(((newFigureDistance - figureDistance) / this.imgScaleStep).toFixed(1));

						fingers[finger1.identifier] = finger1;
						fingers[finger2.identifier] = finger2;

						if(scale !== pinchScale) {
							//目前缩放的最小比例是1，最大是5
							if(scale < this.imgMinScale) {
								scale = this.imgMinScale;
							} else if(scale > this.imgMaxScale) {
								scale = this.imgMaxScale;
							}

							pinchScale = scale;
							this._scale(scx, scy, scale);
						}
					}
				}, false);
				$gesture.addEventListener('touchend', e => {
					if(!this.imgLoaded) {
						return;
					}

					this.imgScale = pinchScale;

					//从finger删除已经离开的手指
					let touches = Array.prototype.slice.call(e.changedTouches, 0);

					touches.forEach(item => {
						delete fingers[item.identifier];
					});

					//迭代fingers，如果存在finger则更新scx,scy,iX,iY，因为可能缩放后立即单指拖动
					let i,
						fingerArr = [];

					for(i in fingers) {
						if(fingers.hasOwnProperty(i)) {
							fingerArr.push(fingers[i]);
						}
					}

					if(fingerArr.length > 0) {
						scx = fingerArr[0].pageX;
						scy = fingerArr[0].pageY;
						iX = this.imgX;
						iY = this.imgY;
					} else {
						this.maskShowTimer = setTimeout(() => {
							this.maskShow = true;
						}, 300);
					}

					//做边界值检测
					let x = this.imgX,
						y = this.imgY,
						pClientRect = this.$refs.pCanvas.getBoundingClientRect();

					if(x > pClientRect.left + pClientRect.width) {
						x = pClientRect.left
					} else if(x > 600 || x < -600) {
						x = 1
						y = 1
					}

					if(y > pClientRect.top + pClientRect.height) {
						y = pClientRect.top;
					} else if(y > 600 || y < -600) {
						x = 1
						y = 1
					}

					if(this.imgX !== x || this.imgY !== y) {
						this._drawImage(x, y, this.imgCurrentWidth, this.imgCurrentHeight);
					}
				});
			},
			_loadImg() {
				if(this.imgLoading || this.loadImgQueue.length === 0) {
					return;
				}

				let img = this.loadImgQueue.shift();

				if(!img) {
					return;
				}

				let $img = new Image(),
					onLoad = e => {
						$img.removeEventListener('load', onLoad, false);
						this.$img = $img;
						this.imgLoaded = true;
						this.imgLoading = false;

						this._initImg($img.width, $img.height);
						this.$emit('loadSuccess', e);
						this.$emit('loadComplete', e);
						this._loadImg();
					},
					onError = e => {
						$img.removeEventListener('error', onError, false);
						this.$img = $img = null;
						this.imgLoading = false;

						this.$emit('loadError', e);
						this.$emit('loadComplete', e);
						this._loadImg();
					};

				this.$emit('beforeLoad');
				this.imgLoading = true;
				this.imgLoaded = false;
				$img.src = this.img;
				$img.crossOrigin = 'Anonymous'; //因为canvas toDataUrl不能操作未经允许的跨域图片，这需要服务器设置Access-Control-Allow-Origin头
				$img.addEventListener('load', onLoad, false);
				$img.addEventListener('error', onError, false);
			},
			_initImg(w, h) {
				let eW = null,
					eH = null,
					maxW = this.cWidth,
					maxH = this.cHeight - this.actionBarHeight;

				//如果图片的宽高都少于容器的宽高，则不做处理
				if(w <= maxW && h <= maxH) {
					eW = w;
					eH = h;
				} else if(w > maxW && h <= maxH) {
					eW = maxW;
					eH = parseInt(h / w * maxW);
				} else if(w <= maxW && h > maxH) {
					eW = parseInt(w / h * maxH);
					eH = maxH;
				} else {
					//判断是横图还是竖图
					if(h > w) {
						eW = parseInt(w / h * maxH);
						eH = maxH;
					} else {
						eW = maxW;
						eH = parseInt(h / w * maxW);
					}
				}

				if(eW <= maxW && eH <= maxH) {
					//记录其初始化的宽高，日后的缩放功能以此值为基础
					this.imgStartWidth = eW;
					this.imgStartHeight = eH;
					this._drawImage((maxW - eW) / 2, (maxH - eH) / 2, eW, eH);
				} else {
					this._initImg(eW, eH);
				}
			},
			_drawImage(x, y, w, h) {
				this._clearCanvas();
				this.imgX = parseInt(x);
				this.imgY = parseInt(y);
				this.imgCurrentWidth = parseInt(w);
				this.imgCurrentHeight = parseInt(h);

				//更新canvas
				this.ctx.drawImage(this.$img, this._ratio(x), this._ratio(y), this._ratio(w), this._ratio(h));

				//更新pCanvas，只需要减去两个canvas坐标原点对应的差值即可
				this.pCtx.drawImage(this.$img, this._ratio(x - this.originXDiff), this._ratio(y - this.originYDiff), this._ratio(w), this._ratio(h));
			},
			_clearCanvas() {
				let $canvas = this.$refs.canvas,
					$pCanvas = this.$refs.pCanvas;

				$canvas.width = $canvas.width;
				$canvas.height = $canvas.height;
				$pCanvas.width = $pCanvas.width;
				$pCanvas.height = $pCanvas.height;
			},
			_ratio(size) {
				//				return parseInt(window.devicePixelRatio * size);
				return parseInt(size);
			},
			_pointDistance(x1, y1, x2, y2) {
				return parseInt(Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)));
			},
			_scale(x, y, scale) {
				let newPicWidth = parseInt(this.imgStartWidth * scale),
					newPicHeight = parseInt(this.imgStartHeight * scale),
					newIX = parseInt(x - newPicWidth * (x - this.imgX) / this.imgCurrentWidth),
					newIY = parseInt(y - newPicHeight * (y - this.imgY) / this.imgCurrentHeight);

				this._drawImage(newIX, newIY, newPicWidth, newPicHeight);
			},
			_clipper() {
				let imgData = null;

				try {
					imgData = this.$refs.pCanvas.toDataURL("image/png", this.quality);
				} catch(e) {
					console.error('请在response header加上Access-Control-Allow-Origin，否则canvas无法裁剪未经许可的跨域图片');
				}
				this.$emit('ok', imgData);
			},
			_cancel() {
				this.$emit('cancel');
			},

			//public
			getBase64(dataURL) {
				return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
			}
		}
	}
</script>