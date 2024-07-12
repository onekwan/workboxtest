<template>
	 <div>
		  <div class="text-right">
				<button class="btn btn-success btn-sm mt-2" @click="openModal">
					 {{ disabled ? '설정 내용 확인' : '설정' }}
				</button>
		  </div>

		  <b-modal ref="modal" id="modal-standard" title="타임테이블 설정" title-class="font-18">
				<b-container>
					 <table class="table table-bordered custom_table03 mb-0">
						  <colgroup>
								<col style="width:10%">
								<col style="width:30%">
								<col style="width:60%">
						  </colgroup>
						  <!-- <thead>
						  <tr colspan="3">Timetable</tr>
						  </thead> -->
						  <tbody>
						  <tr v-for="(item, index) in dataList" :key="index">
								<td>
									 <input type="checkbox" v-model="checkedList" name="chbox" :value='index' :disabled="disabled">
								</td>
								<td>
									 <select class="form-select" v-model="item.dayOfWeek" :disabled="disabled">
										  <option v-for="(value, key) in week_label" :key="key" :value="key">{{value}}</option>
									 </select>
								</td>
								<td>
									 <div class="timeArea">
										  <div style="width:45%">
												<date-picker v-model="item.start" type="time"  value-type="format" format="HH:mm:ss" :disabled="disabled"></date-picker>
										  </div>
										  <div style="width:10%" class="text-center">~</div>
										  <div style="width:45%">
												<date-picker v-model="item.end" type="time"  value-type="format" format="HH:mm:ss" :disabled="disabled"></date-picker>
										  </div>
									 </div>
								</td>
						  </tr>
						  </tbody>
					 </table>
					 <div v-if="dataList.length === 0" class="text-center mt-3">
						  <p v-if="disabled">설정된 데이터가 없습니다.</p>
						  <p v-else>추가 버튼을 눌러 스케줄을 생성해주세요.</p>
					 </div>
					 <div class="text-right" v-if="!disabled">
						  <button class="btn btn-success btn-sm mt-2" @click="deleteRow">선택 삭제</button>
						  <button class="btn btn-success btn-sm mt-2" @click="addRow">추가</button>
					 </div>
				</b-container>
				<template #modal-footer>
					 <div class="w-100" style="text-align:right">
						  <button class="btn btn-secondary" @click="closeModal">확인</button>
					 </div>
				</template>
		  </b-modal>
	 </div>
</template>

<script>
export default {
	 name: "SetTimeTable",
	 props : ['disabled'],
	 data(){
		return {
			 week_ko : $const.week,
			 week_en : $const.WEEK_E,
			 week_label : $const.WEEK_EtoK,
			 dataList : [],
			 checkedList : []
		}
	 },
	 mounted() {
	 },
	 methods : {
		  openModal() {
				this.$refs.modal.show();
		  },
		  async closeModal() {
				const validationResult = this.checkValidation();
				if (!validationResult.result) {
					const confirmed = await tool_app.confirm(validationResult.message + '\n그래도 닫으시겠습니까?');
					if (!confirmed) {
						return;
					}
				}
				this.$refs.modal.hide();
		  },
		  checkValidation(){
				//dataList의 값들이 dayOfWeek와 start,end의 기간이 중복되지 않는지 확인
				let dupl = false;
				for(let i=0; i<this.dataList.length; i++) {
					 for(let j=i+1; j<this.dataList.length; j++) {
						  if(this.dataList[i].dayOfWeek == this.dataList[j].dayOfWeek) {
								if(this.dataList[i].start <= this.dataList[j].start && this.dataList[i].end >= this.dataList[j].start) {
									 dupl = true;
								}
								if(this.dataList[i].start <= this.dataList[j].end && this.dataList[i].end >= this.dataList[j].end) {
									 dupl = true;
								}
								if(this.dataList[i].start >= this.dataList[j].start && this.dataList[i].end <= this.dataList[j].end) {
									 dupl = true;
								}
						  }
					 }
				}

				//빈 값이 있는지 체크하고 있으면 return false
				let emptyFlag = false;
				for(let i=0; i<this.dataList.length; i++) {
					 if(this.dataList[i].dayOfWeek == '' || this.dataList[i].start == '' || this.dataList[i].end == '') {
						  emptyFlag = true;
					 }
				}

				// 에러 객체 만들어서 메시지 넣어서 return

				let msg = '';
		      let result = true;
				if(dupl) {
					 msg += '중복된 시간이 있습니다.';
					 result = false;
				}else if(emptyFlag) {
					 msg += '빈 값이 있습니다.';
					 result = false;
				}


				return {
					 result : result,
					 message : msg
				}
		  },
		  getJSONdata(){
				return JSON.stringify(this.dataList);
		  },
		  setTimeTable(data){
				this.dataList = tool_app.deepCopy(data);
		  },
		  addRow(){
				this.dataList.push({
					 dayOfWeek : '',
					 start : '00:00:00',
					 end : '23:59:59'
				});
		  },
		  deleteRow(){
				this.checkedList.sort(function(a,b){
					 return b-a;
				});
				for(let i=0; i<this.checkedList.length; i++) {
					 this.dataList.splice(this.checkedList[i], 1);
				}
				this.checkedList = [];
		  },
		  testCheckValidation(){
				console.log(this.checkValidation());
		  }
	 }
}
</script>

<style scoped>
.timeArea{
	 display: flex;
	 justify-items: center;
}
</style>



