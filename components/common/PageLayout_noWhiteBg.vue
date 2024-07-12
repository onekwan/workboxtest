<template>
	 <div class="grid">
		  <div class="row">
				<div class="col-12"><h2 style="font-size:18px">{{title}}</h2></div>
				<div class="col-12 mt-3">
					 <div v-if="pageError!==true">
						  <div>
								<div v-show="pageLoading!==true" class="page_wrapper">
									 <!--						  <h5 class="page_title"><i v-show="backArrow" class="pi pi-angle-left" style="font-size: 2rem;cursor:pointer" @click="moveBack()"></i>{{title}}</h5>-->
									 <div class="page_container">
										  <slot>

										  </slot>
									 </div>
									 <div class="page_api_spinner" v-show="page_api_spinner">
										  <b-spinner variant="success" type="grow" label="Spinning"></b-spinner>
									 </div>
								</div>
								<div v-show="pageLoading===true" class="spinner_box">
									 <b-spinner variant="dark" type="grow" label="Spinning"></b-spinner>
								</div>
						  </div>
					 </div>
					 <div class="card" v-if="pageError===true">
						  <div class="page_init_error text-center" style="padding:20px 0">
								페이지 정보를 불러오는데 실패하였습니다.
						  </div>
					 </div>
				</div>
		  </div>

	 </div>
</template>

<script>
export default {
	 name: "PageLayout",
	 props : ['title','pageLoading','pageError','page_api_spinner','backArrow'],
	 mounted() {
	 },
	 methods : {
		  moveBack(){
				this.$router.go(-1);
		  }
	 }
}
</script>

<style scoped>
.page_wrapper{position:relative}
.page_api_spinner{
	 display:flex;
	 justify-items: center;align-items: center;
	 position:absolute;top:0;left:0;width:100%;height:100%;
	 background-color:rgba(255,255,255,0.5);
}
.page_title{
	 display:flex;
	 align-items:center
}
.spinner_box{
	 display:flex;
	 justify-content: center;
	 align-items: center;
	 height:500px;
}
</style>
