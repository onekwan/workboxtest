<template>
<!--	 <Button  :class="'p-button-'+variant" style="position:relative;justify-content: center;" :disabled="loading">-->
<!--		  <ProgressSpinner v-show="loading" strokeWidth="12" style="position:absolute;top:50%;left:50%;width:20px;height:20px;margin-left:-10px;margin-top:-10px"/>-->
<!--		  <slot>-->

<!--		  </slot>-->
<!--	 </Button>-->
	 <b-button :variant="variant" :disabled="loading" class="btn_wrap" @click="$emit('click')">
		  <b-spinner small v-show="loading" class="spinner_custom"></b-spinner>
		  <slot></slot>
	 </b-button>
</template>

<script>
import { onMounted } from "vue";

export default {
	 data() {
		  return {

		  }
	 },
	 components: {},
	 props: ['loading','variant'],
	 methods: {

	 },
	 mounted() {

	 }
};
</script>
<style scoped>
.btn_wrap{position:relative}
.spinner_custom{position:absolute;top:50%;left:50%;width:25px;height:25px;font-size:18px;margin-left: -12px;margin-top: -12px}
</style>
