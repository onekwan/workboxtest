<template>
	 <div>
		  <multiselect
				  label="visible_name"
				  track-by="Facility_ExternalID"
				  v-model="selected_add_tenant"
				  :options="add_tenant_options"
				  :close-on-select="false"
				  :multiple="true"
					@input="changeMultiSelect"
				  :taggable="false"
				  :placeholder="AllSelCheck ? '모든 입구 LPR 선택 되었습니다.' : '설정할 입구 LPR을 선택해 주세요.'"
				  selectLabel=""
				  :disabled="loading_tenants || AllSelCheck"
		  >
				<span slot="noResult"></span>
		  </multiselect>
		  <label style="cursor: pointer">
				<input type="checkbox" @change="changeAllCheck" v-model="AllSelCheck" ref="facilityCheckBox"/> 모든 입구 LPR 허용
		  </label>
	 </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";
export default {
	 components : {
		  Multiselect
	 },
	 props: ['selected','value'],
	 computed: {
		  return_tenant_list : {
				get: function() {
					 return this.value
				},
				set: function(value) {
					 this.$emit('input', value)
				}
		  }
	 },
	 name: "SelectFacility",
	 data() {
		  return {
				selected_add_tenant : [],
				add_tenant_options: [],
				loading_tenants : true,
				AllSelCheck : false
		  }
	 },
	 created() {
		  this.getList();
	 },
	 mounted() {
		  //this.selectAll()
	 },
	 methods: {
		  async getList() {
				let vm = this;
				mainapi.invokeAPI('/parkinglot/facility/gate-mode/list', {})
						.then(function (res) {
							 let data = res.data.Data;
							 let resArr = [];

							 data.forEach(function (value) {
								  if(value.FacilityKind==='lpr_carin' || value.FacilityKind==='lpr_carin_inner'){
										value.visible_name = value.FacilityName + " (" + (value.FacilityKind==='lpr_carin' ? '입구LPR정면' : '입구LPR후면') + ")";
										if(value.FacilityKind==='lpr_carin_inner') value.visible_name = value.FacilityName + "(입구LPR내부)";
										resArr.push(value)
								  }
							 })
							 vm.add_tenant_options = resArr;
							 vm.loading_tenants = false;

							 if(Array.isArray(vm.return_tenant_list) && vm.return_tenant_list.length>0){
								  let tempArr = [];
								  vm.return_tenant_list.forEach(function(value){
										for(let i =0;i<vm.add_tenant_options.length;i++){
											 if(vm.add_tenant_options[i].Facility_ExternalID === value){
												  tempArr.push(vm.add_tenant_options[i])
											 }
										}
								  })
								  vm.selected_add_tenant = tempArr;
								  vm.return_tenant_list = tempArr;
							 }else{
								  vm.AllSelCheck = true;
								  vm.selectAll();
							 }
						}).catch(function (err) {
								tool_app.log(err);
						  })
		  },
		  changeMultiSelect(){
				let arr = this.selected_add_tenant;
				this.return_tenant_list = arr;
		  },
		  changeAllCheck(){
				this.selected_add_tenant=[];
				if(!this.AllSelCheck){
					 this.return_tenant_list=[];
					 this.selected_add_tenant=[];
				}
				else{
					 this.selectAll();
				}
		  },
		  selectAll(){
				this.return_tenant_list = '*';
		  }

	 }
}
</script>

<style>
.multiselect--disabled{opacity: 0.8 !important;}
span.multiselect__placeholder {
	 color: #333 !important;
}
</style>
