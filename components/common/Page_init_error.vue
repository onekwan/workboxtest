<template>
	 <b-card v-show="visible">
		  <div class="page_init_error text-center" style="padding:20px 0">
				페이지 정보를 불러오는데 실패하였습니다.
		  </div>
	 </b-card>
</template>

<script>
export default {
	 name: "Page_init_error",
	 props : ['visible'],
	 mounted() {
		  tool_app.log(this.visible);
	 }
}
</script>

<style scoped>

</style>