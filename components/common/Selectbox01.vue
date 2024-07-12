<template>
	 <div class="custom_spinner">
		  <div class="tit" :style="styleObject02"><slot name="title"></slot></div>
		  <select class="form-select form-control-lg xlg" v-model="selectedLocal" :style="styleObject">
				<slot name="options"></slot>
		  </select>
	 </div>

</template>

<script>
// 입주사 할인권 등록 셀렉트 박스
export default {
	 //자식 -> 부모 데이터 전송
	 name: "Selectbox01",
	 props: ['selected','fontSize'],
	 model: {
		  prop: 'selected',
		  event: 'selectedchange'
	 },
	 data() {
		  return {
				styleObject : {},
				styleObject02 : {}
		  };
	 },
	 computed: {
		  selectedLocal: {
				get: function() {
					 return this.selected
				},
				set: function(value) {
					 this.$emit('selectedchange', value)
				}
		  }
	 },
	 mounted() {
			if(this.fontSize === 'small'){
				 this.styleObject = {
					  fontSize : '14px',
					  padding: '12px 8px',
					  paddingRight : '30px'
				 }
				 this.styleObject02 = {
					  fontSize : '14px', top:'13px'
				 }
			}
	 },
	 methods : {

	 }
}
</script>

<style scoped>
	.custom_spinner{position:relative;}
	.tit{position:absolute;top: 11px;left: 12px;font-size:18px;color:#333}
	.xlg{font-size:20px;padding:8px;padding-right:30px}
	select{text-align: right;}
	option{text-align: right;font-size:18px}
	select { text-align-last: right; }
	option { width:100%;direction: rtl; }

</style>
