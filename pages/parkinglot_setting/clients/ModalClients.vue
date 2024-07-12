<script>
import {required} from "vuelidate/lib/validators";
import modal_default from "@/mixin/modal_default";

let origin_format = {
    "name": "",
    "ceoName": "",
    "registrationNumber": "",
    "representativeName": "",
    "representativePhone": "",
    "representativeEmail": "",
    "masterUsername": "",
    "masterPassword": "",
      operatorId : ''
}
export default {
      mixins : [modal_default],
    data() {
        return {
            api_data: {
                ...origin_format
            },
            selected_status: '',
        };
    },
	 validations: {
		  api_data : {
				name: {required},
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
            if (this.mode === 'edit') {
                  this.selected_status = this.pageData.status;
            }
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


				if(this.mode === 'edit' && !this.selected_status){
					 tool_app.dialog_alert("상태 값을 입력해주세요.");
					 this.api_flag = false;
					 return;
				}

				if (this.checkInValidation({
					 create : ['name','masterUsername','masterPassword'],
					 edit : ['name']
				})) {
					 this.api_flag = false;
					 return;
				}


            let payLoad = tool_app.getApiData(this.api_data);

            if (this.mode === 'edit') {
                payLoad = {
                    name: payLoad.name,
						  ceoName : payLoad.ceoName,
						  status : this.selected_status
                }
                let fields = [];
                for (let prop in payLoad) {
                    fields.push(prop);
                }
                payLoad.fields = fields;
            }

            try {
                let res = await mainapi.invokeAPI('/api/v1/clients', payLoad, 'POST');

                if (res.data.code !== $const.ApiSuccessCode.POST) {
                    throw res.data.msg;
                    return false;
                }

                this.hide();
                this.api_submitted = false;
                this.api_flag = false;
                if (this.callback) this.callback();
                tool_app.dialog_success("계정 등록이 완료되었습니다.");
            } catch (e) {
                tool_app.log(e)
                tool_app.dialog_alert("계정 등록에 실패하였습니다.<br/>" + e.msg ? e.msg : e);
            } finally {
                this.api_flag = false;
            }

        }
    }
};
</script>

<template>
      <div class="d-inline">
            <b-modal ref="modal" id="modal-standard"  :title="'고객사 ' + (mode === 'edit' ? '수정' : '등록')" title-class="font-18">
                  <b-spinner v-show="api_flag" variant="secondary" role="status" class="modal_spinner"></b-spinner>
                  <b-container>
                        <label v-if="mode === 'edit'" class="mb-2 required">상태</label>
                        <select v-if="mode === 'edit'" class="form-select mb-3" v-model="selected_status">
                              <option v-for="(value, key) in clientStatus" :value="key" :key="key">{{ value }}</option>
                        </select>

                        <label class="mb-2 required">이름</label>
                        <input type="text" class="form-control" v-model="api_data.name"
										 :class="{ 'is-invalid': api_submitted && $v.api_data.name.$error }"
								/>
							  <div v-if="api_submitted && $v.api_data.name.$error" class="invalid-feedback">
								  <span v-if="!$v.api_data.name.required">필수 입력값입니다.</span>
							  </div>


                        <label class="mt-3 mb-2">CEO 명</label>
                        <input type="text" class="form-control" v-model="api_data.ceoName"/>


							 <div v-if="mode!=='edit'">
								  <label class="mt-3 mb-2">사업자등록번호</label>
								  <input type="text" class="form-control" v-model="api_data.registrationNumber"/>

								  <label class="mt-3 mb-2">담당자 명</label>
								  <input type="text" class="form-control" v-model="api_data.representativeName"/>

								  <label class="mt-3 mb-2">전화번호</label>
								  <input type="text" class="form-control" v-model="api_data.representativePhone"/>

								  <label class="mt-3 mb-2">메일</label>
								  <input type="text" class="form-control" v-model="api_data.representativeEmail"/>

								  <label class="mt-3 mb-2 required" v-if="mode !== 'edit'">고객사 마스터 계정 아이디</label>
								  <input type="text" v-if="mode !== 'edit'" class="form-control" :class="{ 'is-invalid': api_submitted && $v.api_data.masterUsername.$error }"
											v-model="api_data.masterUsername"/>
								  <div v-if="api_submitted && $v.api_data.masterUsername.$error" class="invalid-feedback">
										<span v-if="!$v.api_data.masterUsername.required">필수 입력값입니다.</span>
								  </div>

								  <label v-if="mode !== 'edit'" class="mt-3 mb-2 required">고객사 마스터 비밀번호</label>
								  <limited-input v-if="mode !== 'edit'" v-model="api_data.masterPassword"  :is-invalid="api_submitted && $v.api_data.masterPassword.$error"/>
								  <div v-if="api_submitted && $v.api_data.masterPassword.$error" class="invalid-feedback">
										<span v-if="!$v.api_data.masterPassword.required">필수 입력값입니다.</span>
								  </div>
							 </div>


                  </b-container>
                  <template #modal-footer>
                        <div class="w-100" style="text-align:right">
                              <button class="btn btn-secondary" @click="hide">취소</button>
                              <button class="btn btn-info" @click="api_request">등록</button>
                        </div>
                  </template>
            </b-modal>
      </div>
</template>
