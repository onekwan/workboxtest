<template>
	 <section>
		  <div
				  class="overlay"
				  @click="closeImageSlider"
		  >
				<div class="header" ref="headerRef">
					 <img @click="closeImageSlider" src="~/assets/images/imgslider/closex.svg"/>
				</div>
				<div
						class="img_wrapper"
						ref="img_wrapper_ref"
				>
					 <div class="loading_wrapper">
						  <b-spinner
								  v-show="loading"
								  variant="success"
								  role="status"
								  class="in_spinner"
						  />
					 </div>
					 <div class="img_box" :style="imageBoxStyle">
						  <img
								  ref="imgRef"
								  :src="imgList[currentIndex]"
								  :style="imageStyle"
								  alt="입출차 이미지"
								  @load="onLoad"
						  />
						  <a href="#" class="arrow left" @click.prevent="prevMoveImage" v-show="currentIndex !== 0">
								<img src="~/assets/images/imgslider/arrow_left.svg"/>
						  </a>
						  <a href="#" class="arrow right"  @click.prevent="nextMoveImage" v-show="currentIndex < imgList.length-1">
								<img src="~/assets/images/imgslider/arrow_right.svg"/>
						  </a>
					 </div>

				</div>
		  </div>
	 </section>
</template>

<script>
export default {
	 name: "image_slider",
	 props: {
		  imgList: {
				type: Array,
				required: true,
				default: [require('~/assets/images/custom/noimage.png')],
		  },
	 },
	 data() {
		  return {
				currentIndex: 0,
				loading: true,
				imageBoxStyle: {
					 width: '',
					 height: '',
				},
				imageStyle : {
					 opacity : 0
				}
		  }
	 },
	 methods: {
		  closeImageSlider: function ($e) {
				if ($e.target === $e.currentTarget
						|| $e.target === this.$refs.img_wrapper_ref
						|| $e.target === this.$refs.headerRef
				) {
					 this.$emit('close-image-slider', false, '');
				}
		  },
		  nextMoveImage: function () {
				let beforeUrl = this.imgList[this.currentIndex];
				this.currentIndex = (this.currentIndex + 1) % this.imgList.length;

				// 이미지 한장일 때 onLoad 함수가 호출이 안돼서 로딩토글이 안없어짐 대체 왜 ???
				if (this.imgList.length > 1) {
					 if(beforeUrl===this.imgList[this.currentIndex])
						  this.loading = false;
					 else
						  this.loading = true;
				}
		  },
		  prevMoveImage: function () {
				let beforeUrl = this.imgList[this.currentIndex];
				this.currentIndex = this.currentIndex - 1;
				if (this.currentIndex < 0) {
					 this.currentIndex = this.imgList.length - 1;
				}

				if (this.imgList.length > 1) {
					 if(beforeUrl===this.imgList[this.currentIndex])
						  this.loading = false;
					 else
						  this.loading = true;
				}
		  }
		  ,
		  onLoad: function () {
				this.calcImageSize();
				this.loading = false;
		  }
		  ,
		  calcImageSize: function () {
				this.imageStyle.opacity = 0;
				const width = this.$refs.imgRef.naturalWidth;
				const height = this.$refs.imgRef.naturalHeight;
				const wWidth = window.innerWidth;
				const wHeight = window.innerHeight;

				let ratioHW = height / width;
				let ratioWH = width / height;
				if(wWidth >= wHeight){
					 if (width > height) {
						  this.imageBoxStyle.width = wWidth * 0.7;
						  this.imageBoxStyle.height = this.imageBoxStyle.width * ratioHW;
						  if(this.imageBoxStyle.height>wHeight){
								this.imageBoxStyle.height = wHeight*0.8;
								this.imageBoxStyle.width = this.imageBoxStyle.height * ratioWH;
						  }
					 } else {

						  this.imageBoxStyle.height = wHeight * 0.8;
						  this.imageBoxStyle.width = this.imageBoxStyle.height * ratioWH;
					 }
				}else{
					 this.imageBoxStyle.width = wWidth * 0.7;
					 this.imageBoxStyle.height = this.imageBoxStyle.width * ratioHW + 'px';
				}

				this.inputPixel(this.imageBoxStyle);
				this.imageStyle.opacity = 1;
		  },
		  inputPixel(obj){
				for(let prop in obj){
					 obj[prop] = obj[prop] + 'px';
				}
		  }
	 }
}
</script>

<style lang="scss" scoped>
@mixin base-button {
	 color: white;
	 font-size: 2.6rem;
	 border: none;
	 background-color: transparent;
}

section {
	 position: fixed;
	 width: 100%;
	 height: 100vh;
	 top: 0;
	 left: 0;
	 z-index: 1022;
	 user-select: none;

	 .overlay {
		  width: 100%;
		  height: 100%;
		  background-color: rgba(0, 0, 0, 0.76);
		  position: relative;
	 }
}

.header {
	 //text-align: right;
	 position: absolute;
	 top: 15px;
	 right: 15px;
	 z-index: 1;

	 button {
		  @include base-button;
		  margin: 0 1vw;

		  @media screen and (max-width: 768px) {
				font-size: 1.6rem;
		  }

		  &:hover {
				color: #0d6efd;
		  }
	 }
}

.loading_wrapper {
	 position: absolute;
	 top: 50%;
	 left: 50%;
	 transform: translate(-50%, -50%);
}



.img_navigator_wrapper {
	 position: absolute;
	 top: 50%;
	 transform: translateY(-50%);
	 width: 100%;
	 font-weight: bold;
	 display: flex;
	 justify-content: space-between;



}

.img_wrapper {
	 display: flex;
	 position: relative;
	 justify-content: center;
	 align-items: center;
	 width: 100%;
	 height: 100%;
	 .img_box{
		  $width : 48px;
		   position: relative;
			img{width:100%;height:100%}
		  .arrow{

				position: absolute;width:$width;height:48px;
				top:50%;margin-top:-24px;
				text-align: center;cursor: pointer;
				&.left{left:-($width+20)}
				&.right{right:-($width+20)}


		  }

		  @media (max-width: 720px) {
				.arrow{
					 &.left{left:-($width)}
					 &.right{right:-($width)}
				}
		  }


	 }
}


</style>
