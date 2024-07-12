<script>
import {required} from "vuelidate/lib/validators";
import {mapState} from "vuex";
import modal_default from "@/mixin/modal_default";

let origin_format = {
    "id": "",
    "name": "",
	 "clientId": "",
    "version": "",
    "url": "",
	 status : '',
	 healthStatus : ''
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
				id : {required},
				clientId : {required},
				status: {required},
				healthStatus: {required}
		  }
	 },
    created() {

    },
	 mounted() {

	 },
	 methods: {
        reset() {
            this.api_data = {...origin_format};
        },
        setPageData() {
            for (let prop in this.api_data) {
                this.api_data[prop] = this.pageData[prop];
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
					 create : ['name','id', 'clientId'],
					 edit : ['name','status','healthStatus']
				})) {
					 this.api_flag = false;
					 return;
				}


				let payLoad = tool_app.getApiData(this.api_data);

            if (this.mode === 'edit') {
                let fields = [];
                for (let prop in payLoad) {
                    fields.push(prop);
                }
                payLoad.fields = fields;
            }else{
					 delete payLoad.status;
					 delete payLoad.healthStatus;
				}

            let msg = this.mode === 'edit' ? '수정' : '등록';
				try{

                let url = this.mode === 'edit' ? '/api/v1/sites/' + this.pageData.id : '/api/v1/sites';
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
					 tool_app.dialog_success(`사업장 ${msg}이 완료되었습니다.`);
				}catch (e) {
					 tool_app.log(e)
					 tool_app.dialog_alert(`사업장 ${msg}에 실패하였습니다.` + "<br/>" + e.msg ? e.msg : e);
				}finally {
					 this.api_flag = false;
				}

		  },
		  inputValidate(event){
            const input = event.target.value;
            const validInput = input.replace(/[^a-z0-9]/g, ''); // 영어 소문자와 숫자만 허용

            if (input !== validInput) {
                event.target.value = validInput;
            }
		  },
        keydownValidate(event){

            const input = event.target.value;

            if (input.length >= 6 && event.key !== 'Backspace' && event.key !== 'Delete') {
                event.preventDefault(); // 최대 6자리를 초과하지 않도록 입력 막기
            }



		  }
	 }
};
</script>

<template>
	 <div class="d-inline">
		  <b-modal ref="modal" id="modal-standard" :title="'사업장 ' + (mode === 'edit' ? '수정' : '등록')" title-class="font-18">
				<b-spinner v-show="api_flag" variant="secondary" role="status" class="modal_spinner"></b-spinner>
				<b-container>
				    <label class="mt-3 mb-2 required">고객사</label>
                <custom-search-select v-model="api_data.clientId" :type="'clients'" :disabled="this.mode==='edit'"
                                        :init-data="this.pageData && this.pageData.client ? this.pageData.client : null"
												  :is-invalid="api_submitted && $v.api_data.clientId.$error"
                                        value-field="id" label-field="name"></custom-search-select>
					 <div v-if="api_submitted && $v.api_data.clientId.$error" class="invalid-feedback">
						  <span v-if="!$v.api_data.clientId.required">필수 입력값입니다.</span>
					 </div>


					 <label class="mb-2 mt-3 required">아이디</label>
					 <input type="text" class="form-control" v-model="api_data.id"
							  @keydown="keydownValidate($event)" @input="inputValidate($event)"
							  :class="{ 'is-invalid': api_submitted && $v.api_data.id.$error }"/>
					 <div v-if="api_submitted && $v.api_data.id.$error" class="invalid-feedback">
						  <span v-if="!$v.api_data.id.required">필수 입력값입니다.</span>
					 </div>

					 <label class="mt-3 mb-2 required">이름</label>
					 <input type="text" class="form-control" v-model="api_data.name" :class="{ 'is-invalid': api_submitted && $v.api_data.name.$error }"/>
					 <div v-if="api_submitted && $v.api_data.name.$error" class="invalid-feedback">
						  <span v-if="!$v.api_data.name.required">필수 입력값입니다.</span>
					 </div>

					 <label class="mt-3 mb-2">버전</label>
					 <input type="text" class="form-control" v-model="api_data.version"/>

					 <label class="mt-3 mb-2">URL</label>
					 <input type="text" class="form-control" v-model="api_data.url"/>

					 <div v-if="mode==='edit'">
						  <label class="mt-3 mb-2 required">상태</label>
						  <select class="form-select" v-model="api_data.status" :class="{ 'is-invalid': api_submitted && $v.api_data.status.$error }">
								<option value="">상태를 선택하세요.</option>
								<option v-for="(value, key) in siteStatus" :value="key" :key="key">{{value}}</option>
						  </select>
						  <div v-if="api_submitted && $v.api_data.status.$error" class="invalid-feedback">
								<span v-if="!$v.api_data.status.required">필수 입력값입니다.</span>
						  </div>


						  <label class="mt-3 mb-2 required">연결 상태</label>
						  <select class="form-select" v-model="api_data.healthStatus" :class="{ 'is-invalid': api_submitted && $v.api_data.healthStatus.$error }">
								<option value="">연결 상태를 선택하세요.</option>
								<option v-for="(value, key) in siteHealthStatus" :value="key" :key="key">{{value}}</option>
						  </select>
						  <div v-if="api_submitted && $v.api_data.healthStatus.$error" class="invalid-feedback">
								<span v-if="!$v.api_data.healthStatus.required">필수 입력값입니다.</span>
						  </div>
					 </div>
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
