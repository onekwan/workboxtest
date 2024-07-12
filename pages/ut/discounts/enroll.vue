<script>
import Webcoupon from '@/components/webcoupon/Main'

export default {
	 authId : "43",
	 authType : "TENANT",
	 components : {
		  Webcoupon
	 },
    data() {
        return {
				title: "할인권 등록",
				CarNum : ""
        };
    },
    middleware: "authentication",
	 mounted() {
		  document.querySelector('.footer').style.display = 'none';
		  document.querySelector('.page-content').style.paddingBottom = 0;
	 },
	 beforeDestroy() {
		  document.querySelector('.footer').style.display = 'block';
		  document.querySelector('.page-content').style.paddingBottom = '220px';
		  document.querySelector('.page-content').style.height = 'auto';
	 },
	 methods : {

	 }
};
</script>

<template>
<div>
<!--	 <PageHeader :title="title" />-->
	 <div>
		  <b-col cols="12">
				<Webcoupon set-title="할인권"/>
		  </b-col>
	 </div>
</div>
</template>

<style>

</style>
