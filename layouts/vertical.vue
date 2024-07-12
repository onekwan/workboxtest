<script>
import {mapState} from "vuex";

export default {
	 name: "vertical",
	 created() {
		  document.body.removeAttribute("data-layout");
		  document.body.removeAttribute("data-topbar");
	 },
	 methods: {
		  toggleRightSidebar() {
				document.body.classList.toggle("right-bar-enabled");
		  },
		  hideRightSidebar() {
				document.body.classList.remove("right-bar-enabled");
		  },
		  toggleMenu() {
				document.body.classList.toggle("sidebar-enable");


				//document.querySelector(".sidebar-menu-scroll").className += document.querySelector(".sidebar-menu-scroll").className + "active";


				// if (window.screen.width >= 992) {
				//   // eslint-disable-next-line no-unused-vars
				//   this.$router.afterEach((routeTo, routeFrom) => {
				//     document.body.classList.remove("sidebar-enable");
				//     document.body.classList.remove("vertical-collpsed");
				//   });
				//   document.body.classList.toggle("vertical-collpsed");
				// } else {
				//   // eslint-disable-next-line no-unused-vars
				//   this.$router.afterEach((routeTo, routeFrom) => {
				//     document.body.classList.remove("sidebar-enable");
				//   });
				//   document.body.classList.remove("vertical-collpsed");
				// }
				// this.isMenuCondensed = !this.isMenuCondensed;
				//   if(document.querySelector('.vertical-menu').offsetWidth <= 70){
				// 		let buttonList = document.getElementsByClassName('flexBtn');
				// 		for(let i = 0; i<buttonList.length;i++){
				// 			buttonList[i].style.display = 'none';
				// 		}
				//   }else{
				// 		let buttonList = document.getElementsByClassName('flexBtn');
				// 		for(let i = 0; i<buttonList.length;i++){
				// 			 buttonList[i].style.display = 'inline-block';
				// 		}
				//   }

		  },
	 },
	 data() {
		  return {};
	 },
	 computed: mapState(["layout"]),
};
</script>

<template>
	 <!-- Begin page -->
	 <div id="layout-wrapper">
		  <Topbar/>
		  <Sidebar :type="layout.leftSidebarType" :width="layout.layoutWidth"/>
		  <!-- ============================================================== -->
		  <!-- Start right Content here -->
		  <!-- ============================================================== -->
		  <div class="main-content">
				<div class="page-content">
					 <div class="container-fluid">
						  <Nuxt/>
					 </div>
				</div>
				<!-- End Page-content -->
				<Footer/>
		  </div>
		  <!-- end main content-->

	 </div>
	 <!-- END layout-wrapper -->
</template>
