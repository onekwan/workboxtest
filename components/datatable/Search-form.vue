<script>
export default {
	 props : ["size","gutter",'hideFilterBox'],
	 data() {
		  return {
				active : true
		  }
	 },
	 computed: {
		  // a computed getter
		  iconClass() {
				// `this` points to the component instance
				return this.active ? 'pi pi-fw pi-angle-down' : 'pi pi-fw pi-angle-up'
		  }
	 },
	 methods: {
		  toggleActive(){
				this.active = !this.active;
		  },
		  show_search_form(){
				let current_class = this.$refs.search_form.className;
				if(current_class.indexOf("d-none") >-1 && current_class.indexOf("d-md-block") >-1){
					 this.$refs.search_form.className = "search_box d-block d-md-block";
				}else{
					 this.$refs.search_form.className = "search_box d-none d-md-block";
				}
		  }
	 }
};
</script>

<template>
<!--	 <div :class="gutter ? 'gutter' : ''">-->
<!--		  <div :class="'col-12 d-'+size+'-none text-right'">-->
<!--				<button type="button" class="btn btn-light btn-outline-secondary" @click="show_search_form">-->
<!--					 <i class="fas fa-search"></i>-->
<!--				</button>-->
<!--		  </div>-->
<!--		  <div ref="search_form" :class="'search_box d-none d-'+size+'-block'">-->
<!--				<div :class="'row row-cols-'+size+'-auto justify-content-end gx-3 gy-2 align-items-center'">-->
<!--					 <div :class="'d-'+size+'-none'"><br/></div>-->

<!--				</div>-->
<!--		  </div>-->
<!--	 </div>-->
	 <div>
		  <div :class="'col-12 d-md-none text-right'">
				<button type="button" class="btn btn-light btn-outline-secondary" @click="show_search_form">
					 <i class="fas fa-search"></i>
				</button>
		  </div>
		  <div ref="search_form" :class="'search_box d-none d-md-block'">
				<div :class="'row row-cols-md-auto justify-content-end gx-3 gy-2 align-items-center'">
					 <div :class="'d-'+size+'-none'"><br/></div>
					 <slot name="filter"></slot>
				    <slot name="button"></slot>
				</div>
		  </div>
	 </div>

<!--	 <div class="search_form_wrapper" :class="active ? 'open' : 'close'" v-if="!hideFilterBox">-->
<!--		  <h5 class="title" @click="toggleActive">필터 <i :class="iconClass"></i></h5>-->
<!--				<div v-show="active">-->
<!--					 <div ref="search_form" class="search_form">-->
<!--						  <slot name="filter">-->

<!--						  </slot>-->
<!--					 </div>-->
<!--					 <slot name="button">-->

<!--					 </slot>-->
<!--				</div>-->
<!--	 </div>-->
</template>
<style scoped lang="scss">
.search_box{
	 .form-control{width:auto;margin-right:5px}
	 .form-select{width:auto;margin-right:5px}
    .mx-datepicker {
        width: auto !important;
        margin-right:5px
    }
	 .input-group{width:auto;margin-right:5px}
}
@media (max-width: 767px) {
	 .search_box{
        .form-control{width:100%;margin-right:0}
        .form-select{width:100%;margin-right:0}
        .input-group{width:100%;margin-right:0}
        .mx-datepicker {
            width: 100% !important
        }
	 }
}
.search_form_wrapper{
	 position:relative;
	 border:1px solid #ddd;
	 border-radius:10px;
	 padding-bottom: 10px;

	 &.close{
		  padding-bottom: 0;
		  .title{
				border-radius: 10px;
		  }
	 }
	 .title{
		  font-size: 14px;
		  width:100%;
		  border-radius: 10px 10px 0 0;
		  background-color: aliceblue;
		  cursor: pointer;
		  padding: 5px 10px;
		  text-align: center;
		  margin:0
	 }
}
.search_form{
	 display: flex;
	 flex-wrap: wrap;
	 width:100%;
	 /*justify-content: flex-end;*/
	 justify-content: center;
	 align-items: center;
	 gap:10px;
	 padding:10px 10px 10px;
}

.v-enter-active,
.v-leave-active {
	 transition: all 0.5s ease;
}

.v-enter-from,
.v-leave-to {
	 height: 0;
	 opacity: 0;
}
</style>
