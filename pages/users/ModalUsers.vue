<script>
import {required} from "vuelidate/lib/validators";
import modal_default from "@/mixin/modal_default";

let origin_format = {
    "username": "",
    "name": "",
    "password": "",
    "companyId": "",
    "type": "",
    "phone": ""
}

export default {
    mixins : [modal_default],
    data() {
        return {
            api_data: {
                ...origin_format
            },
            unusedUserType: false,
				companyType : ''
        };
    },
	 validations: {
		  api_data : {
				"username": {required},
				"name": {required},
				"password": {required},
				"companyId": {required},
				"type": {required},
				"phone" : {required}
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
            if (this.pageType === 'clients') {
                this.companyType = 'CLIENT';
            } else if (this.pageType === "managers") {
					 this.companyType ='MANAGER'
            } else if(this.pageType === 'tenants'){
                  this.companyType = 'TENANT';
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

				let creatColArr = ['username','name','password','companyId','type'];
				if(this.pageType === 'noresidents'){
					 creatColArr = ['username','name','password','phone'];
				}

				if (this.checkInValidation({
					 create : creatColArr,
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
            }else{
                  //비거주자 생성
                  if(this.pageType === 'noresidents'){
                        payLoad = {
                              username: payLoad.username,
                              name: payLoad.name,
                              phone: payLoad.phone,
                              password: payLoad.password
                        }
                  }
            }

            let msg = this.mode === 'edit' ? '수정' : '등록';
            try {
                let url = this.mode === 'edit' ? '/api/v1/users/' + this.pageData.id : '/api/v1/users';

                url = this.pageType === 'noresidents' && this.mode !== 'edit' ? '/api/v1/users/non-resident' : url;
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
                tool_app.dialog_success(`사용자 ${msg}이 완료되었습니다.`);
            } catch (e) {
                tool_app.log(e)
                tool_app.dialog_alert(`사용자 ${msg}에 실패하였습니다.` + "<br/>" + e.msg ? e.msg : e);
            } finally {
                this.api_flag = false;
            }

        },
          onChangeCompanyType(){
                  this.api_data.companyId = '';
          }
    }
};
</script>

<template>
      <div class="d-inline">
            <b-modal ref="modal" id="modal-standard" :title="'사용자 ' + (mode === 'edit' ? '수정' : '등록')"
                     title-class="font-18">
                  <b-spinner v-show="api_flag" variant="secondary" role="status" class="modal_spinner"></b-spinner>
                  <b-container>
                        <div  v-if="mode !== 'edit'">
                              <label class="mb-2 required">아이디</label>
                              <input type="text" class="form-control" v-model="api_data.username"
												 :class="{ 'is-invalid': api_submitted && $v.api_data.username.$error }"
										/>
									 <div v-if="api_submitted && $v.api_data.username.$error" class="invalid-feedback">
										  <span v-if="!$v.api_data.username.required">필수 입력값입니다.</span>
									 </div>
                        </div>

							 <label class="mt-3 mb-2 required" v-if="mode !== 'edit'">비밀번호</label>
							 <limited-input v-if="mode !== 'edit'" v-model="api_data.password"
												 :is-invalid="api_submitted && $v.api_data.password.$error"
							 />
							 <div v-if="api_submitted && $v.api_data.password.$error" class="invalid-feedback">
								  <span v-if="!$v.api_data.password.required">필수 입력값입니다.</span>
							 </div>

                        <label class="mt-3 mb-2 required">이름</label>
                        <input type="text" class="form-control" v-model="api_data.name"
										 :class="{ 'is-invalid': api_submitted && $v.api_data.name.$error }"
								/>
							 <div v-if="api_submitted && $v.api_data.name.$error" class="invalid-feedback">
								  <span v-if="!$v.api_data.name.required">필수 입력값입니다.</span>
							 </div>

                        <label class="mt-3 mb-2 required" v-if="mode !== 'edit' && pageType!=='noresidents'">
                              <span v-if="pageType === 'clients'">고객사</span>
                              <span v-else-if="pageType === 'tenants'">입주사</span>
                              <span v-else-if="pageType === 'managers'">관리자</span>
                               회사
                        </label>
                        <custom-search-select v-model="api_data.companyId" v-if="mode !== 'edit' && pageType!=='noresidents'"
                                              :type="companyType.toLowerCase()+'s'" :disabled="!companyType"
															 :is-invalid="api_submitted && $v.api_data.companyId.$error"
                                              value-field="id" label-field="name"></custom-search-select>
							 <div v-if="api_submitted && $v.api_data.companyId.$error" class="invalid-feedback">
								  <span v-if="!$v.api_data.companyId.required">필수 입력값입니다.</span>
							 </div>

                        <label class="mt-3 mb-2 required" v-if="mode !== 'edit' && pageType!=='noresidents'">유형</label>
                        <select class="form-select" v-model="api_data.type" v-if="mode !== 'edit' && pageType!=='noresidents'"
										  :class="{ 'is-invalid': api_submitted && $v.api_data.type.$error }" :disabled="unusedUserType">
                              <option v-for="(value, key) in userType_create" :value="key" :key="key">{{ value }}</option>
                        </select>
							 <div v-if="api_submitted && $v.api_data.type.$error" class="invalid-feedback">
								  <span v-if="!$v.api_data.type.required">필수 입력값입니다.</span>
							 </div>

                        <label class="mt-3 mb-2" :class="pageType === 'noresidents' ? 'required' : ''">전화번호</label>
                        <input type="text" class="form-control" v-model="api_data.phone"
										 :class="{ 'is-invalid': api_submitted && $v.api_data.phone.$error }"
								/>
							 <div v-if="api_submitted && $v.api_data.phone.$error" class="invalid-feedback">
								  <span v-if="!$v.api_data.phone.required">필수 입력값입니다.</span>
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
