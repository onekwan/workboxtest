<script>
import ImageSlider from "./image_slider";

export default {
	 components: {
		  ImageSlider
	 },
	 data() {
		  return {
				in_imgs: [],
				out_imgs: [],
				currentIndexInCarImage: 0,
				currentIndexOutCarImage: 0,
				isShowImageSlider: false,
				imageToShow: '',
				imageData : {}
		  };
	 },
	 props : ['parking', 'setOutImgsLpr','page_id'],
	 watch : {
		  imageList(){
				this.setImageList();
		  },
		  page_id(){
				this.getImages();
		  }
	 },
	 created() {
		this.getImages();
	 },
	 mounted: function () {

	 },
	 middleware: "authentication",
	 methods: {
		  async getImages() {
				if(!this.page_id) return false;
				this.imageLoading = true;
				try {
					 const res = await mainapi.invokeAPI_GET(`/api/v1/visits/${this.page_id}/images`, {}, 'GET')

					 if (res.data.code !== $const.ApiSuccessCode.GET) {
						  tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg)
					 }
					 const data = res.data.data

					 tool_app.log('********************************************************');
					 tool_app.log(data)

					 this.imageData = data;
					 this.setImageList();
				} catch (e) {
					 tool_app.dialog_alert(e);
				} finally {
					 this.imageLoading = false;
				}
		  },
		  setImageList(){
				let vm = this;
				for(let prop in this.imageData){
					 if(this.imageData[prop]){
						  let data = {
								url: this.imageData[prop]
						  }
						  if(prop === 'out'){
								vm.out_imgs.push(data);
						  }else{
								vm.in_imgs.push(data)
						  }
					 }
				}
		  },
		  nextMoveImage(img_List, status) {
				status === 'in'
						? this.currentIndexInCarImage = (this.currentIndexInCarImage + 1) % img_List.length
						: this.currentIndexOutCarImage = (this.currentIndexOutCarImage + 1) % img_List.length;
		  },
		  prevMoveImage(img_List, status) {
				if (status === 'in') {
					 this.currentIndexInCarImage = this.currentIndexInCarImage - 1;
					 if (this.currentIndexInCarImage < 0) {
						  this.currentIndexInCarImage = img_List.length - 1;
					 }
				} else {
					 this.currentIndexOutCarImage = this.currentIndexOutCarImage - 1;
					 if (this.currentIndexOutCarImage < 0) {
						  this.currentIndexOutCarImage = img_List.length - 1;
					 }
				}
		  },
		  toggleImageSlider(value, imageToShow) {
				this.isShowImageSlider = value;
				this.imageToShow = imageToShow;
		  }
	 },
};
</script>

<template>
	 <div>
		  <div class="card" v-if="in_imgs.length>0">
				<div class="img_box">
					 <img
							 :src="in_imgs[0] ? in_imgs[currentIndexInCarImage].url : require('~/assets/images/custom/noimage.png')"
							 @click="toggleImageSlider(!!in_imgs[0], 'in')"
							 :style="{width:'100%', cursor: in_imgs[0] ? 'pointer' : ''}"
							 alt="입차사진"
					 />
					 <div class="circle left" v-show="currentIndexInCarImage !== 0">
						  <a href="#" class="arrow_area" @click.prevent="prevMoveImage(in_imgs, 'in')">
						  </a>
					 </div>

					 <div class="circle right" v-show="currentIndexInCarImage < in_imgs.length-1">
						  <a href="#" class="arrow_area" @click.prevent="nextMoveImage(in_imgs, 'in')">
						  </a>
					 </div>
					 <span>입차 사진</span>
				</div>
				<hr class="my-0"/>
				<b-container class="mt-3">
					 <!--								{{in_imgs}}-->
					 <p>입구 LPR</p>
<!--					 <p class="text-muted" v-if="parking.DateTime_CarIn">{{-->
<!--								in_imgs[0] ? in_imgs[0].FacilityName : ""-->
<!--						  }} |-->
<!--						  {{ parking.DateTime_CarIn ? $options.filters.local_time(parking.DateTime_CarIn) : "" }}</p>-->
<!--					 <div class="pb-3 button_bundle" v-if="in_imgs[0] && in_imgs[0].Facility_ExternalID">-->
<!--						  <button type="button" class="btn btn-dark wrap_btn"-->
<!--									 data-flag="false">-->
<!--								차단기 한번 열기-->
<!--								<b-spinner variant="danger" role="status" class="in_spinner"></b-spinner>-->
<!--						  </button>-->
<!--						  <button type="button" class="btn btn-dark wrap_btn"-->

<!--									 data-flag="false">-->
<!--								차단기 닫기-->
<!--								<b-spinner variant="danger" role="status" class="in_spinner"></b-spinner>-->
<!--						  </button>-->
<!--					 </div>-->
				</b-container>
		  </div>
		  <div class="card" v-if="out_imgs.length>0">

				<div class="img_box">
					 <img
							 :src="out_imgs[0] ? out_imgs[currentIndexOutCarImage].url : require('~/assets/images/custom/noimage.png')"
							 @click="toggleImageSlider(!!out_imgs[0], 'out')"
							 :style="{width:'100%', cursor: out_imgs[0] ? 'pointer' : ''}"
							 alt="출차사진"
					 />
					 <div class="circle left" v-show="currentIndexOutCarImage !== 0">
						  <a href="#" class="arrow_area" @click.prevent="prevMoveImage(out_imgs, 'out')">
						  </a>
					 </div>
					 <div class="circle right" v-show="currentIndexOutCarImage < out_imgs.length-1">
						  <a href="#" class="arrow_area" @click.prevent="nextMoveImage(out_imgs, 'out')">
						  </a>
					 </div>
					 <span>출차 사진</span>
				</div>
				<hr class="my-0"/>
				<b-container class="mt-3">
					 <p>출구 LPR</p>
<!--					 <p class="text-muted" v-if="parking.DateTime_CarOut">-->
<!--						  {{ out_imgs[0] ? out_imgs[0].FacilityName : "" }} |-->
<!--						  {{-->
<!--								parking.DateTime_CarOut ? $options.filters.local_time(parking.DateTime_CarOut) : ""-->
<!--						  }}</p>-->
<!--					 <div class="pb-3 button_bundle" v-if="out_imgs[0] && out_imgs[0].Facility_ExternalID">-->
<!--						  <button type="button" class="btn btn-dark wrap_btn"-->

<!--									 data-flag="false">-->
<!--								차단기 한번 열기-->
<!--								<b-spinner variant="danger" role="status" class="in_spinner"></b-spinner>-->
<!--						  </button>-->
<!--						  <button type="button" class="btn btn-dark wrap_btn"-->

<!--									 data-flag="false">-->
<!--								차단기 닫기-->
<!--								<b-spinner variant="danger" role="status" class="in_spinner"></b-spinner>-->
<!--						  </button>-->
<!--					 </div>-->
				</b-container>
		  </div>
		  <ImageSlider
				  :imgList="imageToShow === 'in'
       ? in_imgs.map(item => item.url)
       : out_imgs.map(item => item.url)"
				  v-show="isShowImageSlider"
				  @close-image-slider="toggleImageSlider"
		  />
	 </div>
</template>
