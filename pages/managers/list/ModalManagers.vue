<script>
import {required} from "vuelidate/lib/validators";
import modal_default from "@/mixin/modal_default";

let origin_format = {
    "name": "",
    "type": "",
    "phone": "",
    "masterUsername": "",
    "masterPassword": ""
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
				type : {required},
				masterUsername : {required},
				masterPassword : {required}
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
					 create : ['name','type','masterUsername','masterPassword'],
					 edit : ['name']
				})) {
					 this.api_flag = false;
					 return;
				}


            let payLoad = tool_app.getApiData(this.api_data);

            if (this.mode === 'edit') {
                payLoad = {
                    name: payLoad.name,
                    phone: payLoad.phone
                }
                let fields = [];
                for (let prop in payLoad) {
                    fields.push(prop);
                }
                payLoad.fields = fields;
            }


            let msg = this.mode === 'edit' ? '수정' : '등록';
            try {
                let url = this.mode === 'edit' ? '/api/v1/managers/' + this.pageData.id : '/api/v1/managers';
                let res = await mainapi.invokeAPI(url, payLoad, this.mode === 'edit' ? 'PATCH' : 'POST');

                let successCode = this.mode === 'edit' ? $const.ApiSuccessCode.PATCH : $const.ApiSuccessCode.POST;
                if (res.data.code !== successCode) {
                    throw res.data.msg;
                    return false;
                }

                this.hide();
                this.api_submitted = false;
                this.api_flag = false;
                if (this.callback) this.callback();
                tool_app.dialog_success(`관리사 ${msg}이 완료되었습니다.`);
            } catch (e) {
                tool_app.log(e)
                tool_app.dialog_alert(`관리사 ${msg}에 실패하였습니다.` + "<br/>" + e.msg ? e.msg : e);
            } finally {
                this.api_flag = false;
            }
        }
    }
};
</script>

<template>
      <div class="d-inline">
            <b-modal ref="modal" id="modal-standard" :title="'관리사 ' + (mode === 'edit' ? '수정' : '등록')"
                     title-class="font-18">
                  <b-spinner v-show="api_flag" variant="secondary" role="status" class="modal_spinner"></b-spinner>
                  <b-container>
                        <label class="mt-3 mb-2 required">이름</label>
                        <input type="text" class="form-control" v-model="api_data.name"
										 :class="{ 'is-invalid': api_submitted && $v.api_data.name.$error }"/>
							 <div v-if="api_submitted && $v.api_data.name.$error" class="invalid-feedback">
									 <span v-if="!$v.api_data.name.required">필수 입력값입니다.</span>
							 </div>

                        <label v-if="mode !=='edit'" class="mt-3 mb-2 required">유형</label>
                        <select v-if="mode !=='edit'" class="form-select" v-model="api_data.type" :class="{ 'is-invalid': api_submitted && $v.api_data.type.$error }">
                              <option value="">유형을 선택하세요.</option>
                              <option v-for="(value, key) in managerType" :value="key" :key="key">{{ value }}</option>
                        </select>
							 <div v-if="api_submitted && $v.api_data.type.$error" class="invalid-feedback">
								  <span v-if="!$v.api_data.type.required">필수 입력값입니다.</span>
							 </div>

                        <label class="mt-3 mb-2">전화번호</label>
                        <input type="text" class="form-control" v-model="api_data.phone"/>

								  <label v-if="mode !=='edit'" class="mt-3 mb-2 required">관리사 마스터 계정 아이디</label>
								  <input v-if="mode !=='edit'" type="text" class="form-control" :class="{ 'is-invalid': api_submitted && $v.api_data.masterUsername.$error }"
											v-model="api_data.masterUsername"/>
							 <div v-if="api_submitted && $v.api_data.masterUsername.$error" class="invalid-feedback">
								  <span v-if="!$v.api_data.masterUsername.required">필수 입력값입니다.</span>
							 </div>

								  <label v-if="mode !=='edit'" class="mt-3 mb-2 required">관리사 마스터 계정 비밀번호</label>
							     <limited-input v-if="mode !== 'edit'" v-model="api_data.masterPassword" :is-invalid="api_submitted && $v.api_data.masterPassword.$error"/>
							 <div v-if="api_submitted && $v.api_data.masterPassword.$error" class="invalid-feedback">
								  <span v-if="!$v.api_data.masterPassword.required">필수 입력값입니다.</span>
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
