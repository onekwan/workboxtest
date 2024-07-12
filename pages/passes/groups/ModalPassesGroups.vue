<script>
import {required} from "vuelidate/lib/validators";
import modal_default from "@/mixin/modal_default";

// 필수값 받음
let origin_format = {
    "name": "",
	 "enterMsg": "",
	 "exitMsg": "",
	 "autoRefill" : "NONE",
	 "refillPoints": 1
};

function isGreaterThanZero(value){
	 let passed = tool_app.vuelidate.isGreaterThanZero(value);
	 return passed;
}

export default {
    mixins : [modal_default],
	 data() {
		  return {
				api_data: {
					 ...origin_format
				}
		  };
	 },
    validations: {
        api_data : {
            name: {required},
				refillPoints : {isGreaterThanZero}
        }
    },
	 created() {

	 },
	 computed: {},
	 mounted() {

	 },
	 methods: {
        reset() {
            this.api_data = {...origin_format};
        },
        setPageData() {
            for (let prop in this.api_data) {
				    if(prop ==='refillPoints'){
						  if(this.pageData[prop]){
								this.api_data[prop] = this.pageData[prop];
						  }else{
								this.api_data[prop] = 1;
						  }
					 }else{
						  this.api_data[prop] = this.pageData[prop];
					 }
            }
        },
		  async api_request() {
				if (this.api_flag) {
					 tool_app.dialog_alert("데이터 전송중입니다.");
					 return;
				}

				this.api_flag = true;
				this.api_submitted = true;

				if (this.checkInValidation({
					 create : ['name'],
					 edit : ['name']
				})) {
					 this.api_flag = false;
					 return;
				}

				let payLoad = tool_app.getApiData(this.api_data);
				payLoad.refillPoints = parseInt(payLoad.refillPoints);


            if (this.mode === 'edit') {
                let fields = [];
                for (let prop in this.api_data) {
                    fields.push(prop);
                }
                payLoad.fields = fields;
            }

            if(payLoad.autoRefill==='NONE') payLoad.refillPoints = 1;

            let msg = this.mode === 'edit' ? '수정' : '등록';
				try{

                let url = this.mode === 'edit' ? '/api/v1/pass-groups/' + this.pageData.id : '/api/v1/pass-groups';

					 let res = await mainapi.invokeAPI(url, payLoad,this.mode === 'edit' ? 'PATCH' : 'POST');

                let successCode = this.mode === 'edit' ? $const.ApiSuccessCode.PATCH : $const.ApiSuccessCode.POST;
					 if(res.data.code !== successCode){
						  throw res.data.msg;
						  return false;
					 }

					 this.hide();
					 this.api_submitted = false;
					 this.api_flag = false;
					 if (this.callback) this.callback();
					 tool_app.dialog_success(`정기권 그룹 ${msg}이 완료되었습니다.`);
				}catch (e) {
					 tool_app.log(e)
					 tool_app.dialog_alert(`정기권 그룹 ${msg}에 실패하였습니다.`+"<br/>" + tool_app.ErrorMsg(e));
				}finally {
					 this.api_flag = false;
				}

		  },
		  onChangeAutoRefill(){
				if(this.api_data.autoRefill==='NONE'){
					 this.api_data.refillPoints = 1;
				}
		  }
	 }
};
</script>

<template>
	 <div class="d-inline">
		  <b-modal ref="modal" id="modal-standard" :title="'정기권 그룹 ' + (mode === 'edit' ? '수정' : '등록')" title-class="font-18">
				<b-spinner v-show="api_flag" variant="secondary" role="status" class="modal_spinner"></b-spinner>
				<b-container>
					 <label class="mb-2 required">속성 그룹 이름</label>
					 <input type="text" class="form-control" v-model="api_data.name" :class="{ 'is-invalid': api_submitted && $v.api_data.name.$error }"/>
                  <div
                          v-if="api_submitted && $v.api_data.name.$error"
                          class="invalid-feedback"
                  >
																<span v-if="!$v.api_data.name.required"
                                                >필수 입력값입니다.</span>
                  </div>

					 <label class="mt-3 mb-2">입차 메시지</label>
					 <input type="text" class="form-control" v-model="api_data.enterMsg"/>

					 <label class="mt-3 mb-2">출차 메시지</label>
					 <input type="text" class="form-control" v-model="api_data.exitMsg"/>

					 <label class="mt-3 mb-2">자동 충전 방식(필수)</label>
					 <select class="form-select" v-model="api_data.autoRefill" @change="onChangeAutoRefill">
						  <option v-for="(value, key) in passAutoRefill" :value="key" :key="key">{{value}}</option>
						</select>



					 <label class="mt-3 mb-2">자동 충전량</label>
					 <input type="text" class="form-control" v-model="api_data.refillPoints" v-mask="'########'" :disabled="api_data.autoRefill==='NONE'"/>
						<p class="text-muted mb-0">월정기권,일일권은 분 단위, 기간권은 개수 단위 입니다.</p>
				</b-container>
				<template #modal-footer>
					 <div class="w-100" style="text-align:right">
						  <button class="btn btn-secondary" @click="hide">취소</button>
                      <button class="btn" :class="mode==='edit' ? 'btn-warning' : 'btn-info'"
                              @click="api_request">{{ mode === 'edit' ? '수정' : '등록' }}
                      </button>
					 </div>
				</template>
		  </b-modal>

	 </div>
</template>
