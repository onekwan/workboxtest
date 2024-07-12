<script>
import Search_keypad from './Search_keypad';
import Result_search from "./Result_search";
import Discount_fee from "./Discount_fee";

import axios from "axios";

export default {
	 components: {Search_keypad,Result_search,Discount_fee},
    data() {
        return {
				title: "웹쿠폰",
				CarNum : "",
				currentComponent : 'Search_keypad',
				currentComponentIdx : 1,
				searchCarList : [],
				currentCar : {},
				loading : false,
				windowHeight : 'auto',
				windowWidth : 'auto',
				usePosParkingLot : this.$store.getters['auth/isPosParking'] // 포스연동주차장
        };
    },
    middleware: "authentication",
	 mounted() {
		  if(this.$isMobile()){
				let width = this.$refs.webcoupon.clientWidth;
				let padding = parseInt((this.windowWidth - width)/2);
				let PageContent = document.querySelector('.page-content');

				this.$refs.webcoupon.style.width= window.innerWidth + "px";
				this.$refs.webcoupon.style.marginLeft = (-padding) + "px";

				let top_header_height = 55;
				let content_padding_top = getComputedStyle(PageContent).paddingTop;
				PageContent.style.height = this.windowHeight + 'px';
			   this.$refs.webcoupon.style.marginTop = (-(parseInt(content_padding_top)-top_header_height)) + "px";


				// if(windowHeight<758){
				// 	 this.window_height = (windowHeight - 611) + 'px';
				// }

				// if(this.windowHeight<611 || tool_app.checkIphone()){
				if(true){
					 PageContent.style.height = 'auto';
				}
		  }
	 },
	 created() {
		  this.windowHeight = window.innerHeight;
		  this.windowWidth = window.innerWidth;
	 },
	 methods : {
		  onClick_toHome(){
				this.currentComponent = 'Search_keypad';
				this.$store.dispatch('webdiscount/resetInfo');
		  },
		  changeComponent(page){
				this.currentComponent = page;
		  },
		  loading_spinner(mode){
				if(mode==='show'){
					 this.loading = true;
				}else{
					 this.loading = false;
				}
		  },
		  SET_CURRENT_CAR(obj){
				let vm = this;
				return new Promise(async function(resolve,reject){
					 try{


                    const res = await mainapi.invokeAPI_GET('/api/v1/visits/' + obj.id, {}, 'GET')

                    if (res.data.code !== $const.ApiSuccessCode.GET) {
                        tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg)
                    }
                    const data = res.data.data


						  vm.$store.commit('webdiscount/SET_CURRENT_CAR', data);

						  resolve(data);
					 }catch (e) {
						  tool_app.log(e);
						  reject();
					 }
				})
		  }
	 },
	 watch : {

	 }
};
</script>

<template>
	 <div class="webcoupon" ref="webcoupon" :class="!this.$isMobile() ? 'pc': ''">
		  <div class="loading_box" v-show="loading">
				<div class="pos">
					 <b-spinner variant="success" role="status"></b-spinner>
				</div>
		  </div>
		  <div class="wp_header clearfix">
				<div class="tit01 float-start">할인 등록</div>
				<button class="btn btn-lg btn-secondary float-end" @click="onClick_toHome">처음으로</button>
		  </div>
		  <component :is="currentComponent" ref="child" v-bind:windowHeight="windowHeight"></component>
	 </div>
</template>

<style>
</style>
