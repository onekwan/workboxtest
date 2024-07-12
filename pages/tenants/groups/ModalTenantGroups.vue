<script>
import {required} from "vuelidate/lib/validators";
import {mapState} from "vuex";
import modal_default from "@/mixin/modal_default";

let origin_format = {
    "name": "",
    "siteId": "",
    "autoRefill": "NONE",
    "refillPoints": null
}

export default {
      mixins : [modal_default],
    data() {
        return {
            api_data: {
                ...origin_format
            },
				searchTenantPayload : {},
				tenantIds:[]
        };
    },
	 validations: {
		  api_data : {
				name: {required},
				siteId : {required}
		  }
	 },
    mounted() {

    },
    methods: {
        reset() {
            this.api_data = {...origin_format};
        },
        setPageData() {
            for (let prop in this.api_data) {
                let flag = tool_app.covertDetailToEdit02(prop, this.api_data, this.pageData);
                if (flag) continue;
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
					 create : ['name','siteId'],
					 edit : ['name']
				})) {
					 this.api_flag = false;
					 return;
				}

            let payLoad = this.api_data;

            if (this.mode === 'edit') {
                payLoad = {
                    name: payLoad.name,
                    autoRefill: payLoad.autoRefill,
                    refillPoints: payLoad.refillPoints,
						  tenantIdList : tool_app.emptyArrayNull(this.tenantIds)
                }
                let fields = [];
                for (let prop in payLoad) {
                    fields.push(prop);
                }
                payLoad.fields = fields;
            }

              let msg = this.mode === 'edit' ? '수정' : '등록';
            try {
                  let url = this.mode === 'edit' ? '/api/v1/tenant-groups/' + this.pageData.id : '/api/v1/tenant-groups';
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
                  tool_app.dialog_success(`입주사 그룹 ${msg}이 완료되었습니다.`);
            } catch (e) {
                tool_app.log(e)
                  tool_app.dialog_alert(`입주사 그룹 ${msg}에 실패하였습니다.` + "<br/>" + e.msg ? e.msg : e);
            } finally {
                this.api_flag = false;
            }

        },
		  beforeSearchTenant(){
				if(!this.api_data.siteId){
					 tool_app.dialog_alert('사업장을 먼저 선택해주세요.')
					 return false;
				}else{

				}
		  },
		  changeSite(value,item){
				this.searchTenantPayload = {
					 siteId: this.api_data.siteId
				}
				this.api_data.tenantIds = [];
		  }
    }
};
</script>

<template>
      <div class="d-inline">
            <b-modal ref="modal" id="modal-standard" :title="'입주사 그룹' + (mode === 'edit' ? '수정' : '등록')" title-class="font-18">
                  <b-spinner v-show="api_flag" variant="secondary" role="status" class="modal_spinner"></b-spinner>
                  <b-container>
							 <label class="mb-2 required">사업장</label>
							 <custom-search-select v-model="api_data.siteId" :type="'sites'" @input="changeSite" :disabled="mode==='edit'"
														  :init-data="this.pageData && this.pageData.site ? this.pageData.site : null"
														  :is-invalid="api_submitted && $v.api_data.siteId.$error"
														  value-field="id" label-field="name"></custom-search-select>
							 <div v-if="api_submitted && $v.api_data.siteId.$error" class="invalid-feedback">
								  <span v-if="!$v.api_data.siteId.required">필수 입력값입니다.</span>
							 </div>


                        <label class="mt-3 mb-2 required">입주사 그룹 이름</label>
                        <input type="text" class="form-control" v-model="api_data.name"
										 :class="{ 'is-invalid': api_submitted && $v.api_data.name.$error }"
								/>
							 <div v-if="api_submitted && $v.api_data.name.$error" class="invalid-feedback">
								  <span v-if="!$v.api_data.name.required">필수 입력값입니다.</span>
							 </div>

                        <label class="mt-3 mb-2">자동 충전 방식</label>
                        <select class="form-select" v-model="api_data.autoRefill">
                              <option v-for="(value, key) in passAutoRefill" :value="key" :key="key">{{ value }}</option>
                        </select>

                        <label class="mt-3 mb-2">자동 충전 량</label>
                        <input type="text" class="form-control" v-model="api_data.refillPoints"/>

							 <div v-if="mode === 'edit'">
								  <label class="mt-3 mb-2 required">입주사</label>
								  <custom-search-select v-model="tenantIds" :type="'tenants'" :multiple="true" :isSiteName="true"
																:before-search="beforeSearchTenant" :payload="searchTenantPayload"
																value-field="id" label-field="name"></custom-search-select>
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
