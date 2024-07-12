

<script>
import {mapState} from 'vuex';
export default {
	 name: "Result_search",
	 data() {
		  return {
				title: "검색 결과",
				CarNum : "",
				currentComponent : '',
				carNum : '',

		  };
	 },
	 computed: {
		  ...mapState('webdiscount', {
				searchCarList : state => state.searchCarList
		  })
	 },
	 mounted() {
			tool_app.log(this.windowHeight)
	 },
	 props : ['windowHeight'],
	 methods : {
		  async select_car(id,carNumber){
				let vm = this;
				try{
					 vm.$parent.loading_spinner('show');

					 let res = await vm.$parent.SET_CURRENT_CAR({id:id,carNumber:carNumber});

                vm.$parent.changeComponent('Discount_fee');

				}catch(e){
					 tool_app.dialog_alert((e ? e : ''));
					 tool_app.log(e);
				}finally {
					 vm.$parent.loading_spinner('hide');
				}

		  }
	 }
}
</script>
<template>
	 <div class="inner" :style="{height:windowHeight+'px'}">
		  <div class="search_list">
				<ul>
					 <li v-for="item in searchCarList">
						  <div @click="select_car(item.id,item.carNumber)">
								<h3>{{item.carNumber }}</h3>
								<p class="time">{{item.entered }}</p>
						  </div>
					 </li>
				</ul>
		  </div>
	 </div>
</template>
