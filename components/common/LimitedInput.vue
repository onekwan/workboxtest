<template>
<!--  <a :href="'/#'+currentPath + id" target="_blank">-->
<!--    {{name}}-->
<!--  </a>-->
	 <div :class="[isInvalid ? 'is-invalid' : '']">
		  <input type="text" class="form-control" v-model="input_value"  :disabled="disabled"
					@input="filterInput" :class="[isInvalid ? 'is-invalid' : '']"
		  />
	 </div>
</template>

<script>
import Multiselect from "vue-multiselect";

export default {
  data() {
    return {
		  input_value : ''
    }
  },
  props: ['value','disabled','isInvalid'],
  watch : {
		value(){
			this.init_data();
      }
  },
  created() {
		this.init_data();
  },
  methods: {
		init_data(){
			 if(this.value === null || this.value === undefined) {
				  this.input_value = this.value;
			 }
		},
		filterInput(event) {
			 // 정규식을 사용하여 영어, 숫자 및 특수 문자만 허용
			 const regex = /^[a-zA-Z0-9!@#$%^&*()_+[\]{};':"\\|,.<>/?`~\-=\s]*$/;
			 if (!regex.test(event.target.value)) {
				  // 정규식에 맞지 않는 문자가 입력되면 이전 값으로 되돌림
				  if(this.inputValue === undefined || this.inputValue === null){
						this.inputValue = '';
				  }
				  event.target.value = this.inputValue;
			 } else {
				  // 정규식에 맞는 경우 입력값을 업데이트
				  this.inputValue = event.target.value;
				  this.$emit('input', this.inputValue);
			 }
		}
  }
}
</script>
