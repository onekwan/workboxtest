<script>
import {menuItems, non_resident, tenant} from "../components/menu";

export default {
	 data() {
		  return {};
	 },
	 middleware: "authentication",
	 mounted() {
        this.userType = this.$store.state.auth.currentUser.type;
        this.companyType = this.companyType = this.$store.getters["auth/getCompanyType"];;
        if (this.companyType === null && this.userType === "NONE") {
            this.$router.push('ut');
        } else if (this.companyType === "DEVELOPER" || this.companyType === "OPERATOR" || this.companyType === "MAINTAINER") {
            this.$router.push('passes/list');
        }else if (this.companyType === "TENANT") {
            this.$router.push('ut');
        }
	 }
};
</script>

<template>
	 <div>
	 </div>
</template>

<style></style>
