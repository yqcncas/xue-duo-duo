<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	/* 顶部阴影 */
	page::after {
		content: "";
		position: fixed;
		top: 0;
		/*  #ifdef H5 */
		top: 44px;
		/*  #endif  */
		left: 0;
		box-shadow: inset 0 4upx 8upx 0 rgb(244, 244, 244);
		z-index: 9;
		width: 750upx;
		height: 8upx;
	}
	page{
		width: 100%;
		height: 100%;
		background-color: rgba(246,246,246);
	}
	
	.line-30 {
		height: 30rpx;
		background-color: #f7f7f7;
	}
	
	.right-arrow {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.right-arrow::after {
		content: "";
		width: 15upx;
		height: 15upx;
		border-top: 4upx solid #ccc;
		border-right: 4upx solid #ccc;
		transform: rotate(45deg);
	}
	swiper .wx-swiper-dot.wx-swiper-dot-active,
	swiper .a-swiper-dot.a-swiper-dot-active,
	swiper .uni-swiper-dot.uni-swiper-dot-active {
		opacity: 1;
		background: #FE5E50;
	}
</style>
