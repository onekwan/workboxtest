

<script>
export default {
	 data() {
		  return {
				title: "키패드",
				CarNum : "",
				currentComponent : '',
				wp_height : 'auto',
				notice : '',
				api_flag : false,
		  };
	 },
	 middleware: "authentication",
	 mounted() {
			//tool_app.dialog_alert('차량이 조회되지 않습니다.')

		  if(this.windowHeight<758){
				this.wp_height = (this.windowHeight - 611) + 'px';
		  }

		  if(this.windowHeight<611){
				this.wp_height = 'auto';
		  }
	 },
	 created() {
		this.CarNum = '';
	 },
	 props : ['windowHeight'],
	 methods : {
		  onClick_Keypad_Number(e,item){
				this.CarNum += item;
		  },
		  async onClick_Keypad_Search(){
				let vm = this;
				if(vm.api_flag) return false;
				vm.api_flag = true;

            let payload = {
                carNumber4: vm.CarNum.trim(),
                exited: false,
                page: 0,
                size: 20,
                sort: 'created,DESC'
            }

				try{
					 vm.$parent.loading_spinner('show');

                let res = await mainapi.invokeAPI_GET('/api/v1/visits', payload)

                if (res.data.code !== $const.ApiSuccessCode.GET) {
                    tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg)
                }

                let data = res.data.data.items;

					 if(!Array.isArray(data) || data.length<=0){
						  tool_app.dialog_alert('검색된 차량이 없습니다.');
						  return false;
					 }
					 vm.$store.commit('webdiscount/SET_SEARCH_LIST',data);
					 vm.$parent.changeComponent('Result_search');
				}catch(e){
					 tool_app.dialog_alert((e ? e : ''));
					 tool_app.log(e);
				}finally {
					 vm.$parent.loading_spinner('hide');
					 vm.api_flag = false;
				}
		  },
		  onClick_Keypad_backspace(){
				if(this.CarNum.length<=0) return false;
				this.CarNum = this.CarNum.slice(0,this.CarNum.length-1);
		  },
		  onClick_carnum_inp(){
				if(!this.$isMobile()){
					 this.$refs.carnum_inp.focus();
				}
		  },
		  formatingText(text){
				let temp = text.split(/\n/);
				let res = '';
				temp.forEach(function(value){
					 res += '<p>' + value + '</p>';
				})
				return res;
		  }
	 },
	 watch : {
		  CarNum : function (val) {
				let className = this.$refs.search_btn.className;
				let vm = this;
				if(val.length>=3){
					 if(className.indexOf('on') < 0){
						  this.$refs.search_btn.className = this.$refs.search_btn.className + ' on'
					 }
				}else{
					 this.$refs.search_btn.className = this.$refs.search_btn.className.replaceAll(' on', '');
				}

				if(val.length===4){
					 setTimeout(function(){ //마지막 숫자 화면에 노출 되는것 명시해주기 위해
						  vm.onClick_Keypad_Search();
					 },100)
				}
		  }
	 }
}
</script>
<template>
	 <div class="inner">
		  <div class="keypad_input01" @click="onClick_carnum_inp">
				<div class="cover"></div>
				<span class="plh" v-show="CarNum.length===0">차량 번호 4자리</span>
				<input type="text" ref="carnum_inp" class="inp_cont" v-model="CarNum" v-mask="'####'">
		  </div>
		  <div id="num_keypad" class="keypad_type01">
				<div class="btn_sec" v-for="(item, index) in [1,2,3,4,5,6,7,8,9]">
					 <button type="button"
								v-bind:dataText="item" @click="onClick_Keypad_Number($event, item)">{{ item }}
					 </button>
				</div>
				<div class="btn_sec">
					 <button type="button" class="del"
								@click="onClick_Keypad_backspace($event)">
						  <i class="fas fa-backspace"></i>
					 </button>
				</div>
				<div class="btn_sec">
					 <button type="button"
								@click="onClick_Keypad_Number($event,0)">0
					 </button>
				</div>
				<div class="btn_sec">
					 <button type="button" class="search" ref="search_btn"
								@click="onClick_Keypad_Search($event)">차량조회
					 </button>
				</div>
		  </div>
		  <div class="liner"></div>
		  <div class="wp_foot" :style="{height:wp_height}" v-html="formatingText(notice)" style="word-break: break-all">

		  </div>
	 </div>
</template>

<style scoped>

</style>
