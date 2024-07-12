<script>
export default {
	 data() {
		  return {};
	 },
	 middleware: "authentication",
	 mounted() {

		  // let menuItem = this.$store.getters["auth/get_menuItems"];
		  //
		  //
		  // let companyType = this.$store.getters["auth/currentUser"].CompanyType;
		  //
		  // let targetMenu = null;
		  //
		  // if (companyType === 'OPERATING' || companyType === 'CONTROL' || companyType === 'HEAD') {
			// 	targetMenu = '/in_out_logs';
		  // }
		  //
		  // if (targetMenu) {
			// 	this.$router.push(targetMenu);
		  // } else if (menuItem.length) {
			// 	if (Array.isArray(menuItem[0].subItems) && menuItem[0].subItems.length) {
			// 		 this.$router.push(menuItem[0].subItems[0].link);
			// 	} else {
			// 		 this.$router.push(menuItem[0].link);
			// 	}
		  // }

	 }
};
</script>

<template>
	 <div>
			 정기권 상품 보유현황이 들어가야 할 자리
	 </div>
</template>

<style></style>
