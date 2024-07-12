<script>
import {mapState} from "vuex";

import Vertical from "./vertical";
import Notifications from 'vue-notification';
import Vue from 'vue';
// import * as Sentry from "@sentry/vue";


export default {
	 components: {
		  Vertical
	 },
	 data(){
		  return {
				tokenValid : true
		  }
	 },
	 created() {

	 },
	 computed: mapState(["layout"]),
	 mounted() {
		  let vm= this;
		  document.body.classList.remove("authentication-bg");



	 },
	 methods : {

	 }
};
</script>

<template>
	 <div>
		  <div v-show="tokenValid">
				<!-- Begin page -->
				<Vertical
						v-if="layout.layoutType === 'vertical'"
						:layout="layout.layoutType"
				>
					 <Nuxt/>

				</Vertical>
		  </div>
		  <div v-show="!tokenValid">
				<b-spinner variant="secondary" role="status" class="modal_spinner main_spinner"></b-spinner>
		  </div>
		  <div id="full_spinner" class="full_spinner">
				<b-spinner variant="warning" role="status" style="width:100px;height:100px"></b-spinner>
		  </div>
	 </div>
</template>
