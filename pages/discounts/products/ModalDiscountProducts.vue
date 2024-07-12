<script>
import {required} from "vuelidate/lib/validators";
import {mapState} from "vuex";
import Date_StartEnd from "@/components/common/Date_StartEnd.vue";
import mixin_const from "@/mixin/mixin_const";
import modal_default from "@/mixin/modal_default";

let origin_format = {
    name: '',
    code: '',
    discountFormId: '',
    description: '',
    hidden: false,
    approvalRequired: false,
    unitPrice: 0,
    totalQuota: 0,
    tenantMaxQuota: 0,
    orderMaxQuota: 0,
    orderStart: '',
    orderEnd: '',
    tenantGroupId: []
}

// let origin_format = {
//   "name": "충전식 할인권",
//   "code": "D-2024-03",
//   "discountFormId": "albtrs-20240227-105337-y2vka3p8c",
//   "description": "이 할인권은 입주사 1사당 1개만 무료로 제공됩니다.",
//   "hidden": false,
//   "approvalRequired": false,
//   "unitPrice": 0,
//   "totalQuota": 100,
//   "tenantQuota": 10,
//   "orderMaxQuota": 1,
//   "orderStart": "2024-01-20 00:00:00",
//   "orderEnd": "2024-01-25 00:00:00",
//   "tenantGroupId": [
//     "albtrs-20240306-140714-83ntjc5ca"
//   ]
// }

export default {
    mixins : [modal_default],
    components : {
        Date_StartEnd
	 },
	 data() {
		  return {
				api_data: {
					 ...origin_format
				},
            api_load_discountForm : false
		  };
	 },
    validations: {
        api_data : {
            name : {required},
            code : {required},
            discountFormId : {required},
            unitPrice : {required},
            totalQuota : {required},
            tenantMaxQuota : {required},
            orderMaxQuota : {required},
            orderStart : {required},
            orderEnd : {required}
        }
    },
    created() {
        if (this.mode !== 'edit') {
            this.setSelectBoxOptions([
                {path: 'discount-forms', payload: {}}, {
                    path: 'tenant-groups',
                    payload: {}
                }
            ])
        }
    },
    computed: mapState({
        option_discount_forms: state => state.selectBoxOptions.discount_forms,
        option_tenant_groups: state => state.selectBoxOptions.tenant_groups

    }),
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

            this.$v.$touch();
            if (this.$v.api_data.$invalid) {
                this.api_flag = false;
                return;
            }


				let payLoad = tool_app.getApiData(this.api_data);

				payLoad.tenantGroupId = tool_app.emptyArrayNull(payLoad.tenantGroupId);
				payLoad.unitPrice = parseInt(payLoad.unitPrice);
				payLoad.totalQuota = parseInt(payLoad.totalQuota);
				payLoad.tenantMaxQuota = parseInt(payLoad.tenantMaxQuota);
				payLoad.orderMaxQuota = parseInt(payLoad.orderMaxQuota);


            if (this.mode === 'edit') {
                let fields = [];
                for (let prop in this.api_data) {
                    fields.push(prop);
                }
                payLoad.fields = fields;
            }

            let msg = this.mode === 'edit' ? '수정' : '등록';
				try{
                let url = this.mode === 'edit' ? '/api/v1/discount-products/' + this.pageData.id : '/api/v1/discount-products';

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
                tool_app.dialog_success(`할인 상품 ${msg}이 완료되었습니다.`);
				}catch (e) {
					 tool_app.log(e)
                tool_app.dialog_alert(`할인 상품 ${msg}에 실패하였습니다.` + "<br/>" + tool_app.ErrorMsg(e));
				}finally {
					 this.api_flag = false;
				}

		  },
        async loadPassForm() {
            try {
                if(this.mode==='edit') return false;
                if (this.api_load_discountForm) {
                    tool_app.dialog_alert("데이터 전송중입니다.");
                    return;
                }

                if(this.api_data.discountFormId===''){
                    this.reset();
                    return;
                }

                this.api_flag = true;
                this.api_load_discountForm = true;


                const res = await mainapi.invokeAPI_GET('/api/v1/discount-forms/' + this.api_data.discountFormId, {}, 'GET')

                if (res.data.code !== $const.ApiSuccessCode.GET) {
                    tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg);
                    return;
                }

                let data = res.data.data;


                for (let prop in this.api_data) {
                    if(prop==='discountFormId') continue;
                    if(prop==='name') continue;
                    let flag = tool_app.covertDetailToEdit(prop, this.api_data, data);
                    if (flag) continue;

                    if(prop==='unitPrice'){
                        this.api_data[prop] = data['price']
                    }else{
                        if(data[prop]){
                            this.api_data[prop] = data[prop];
                        }
                    }

                }

            } catch (e) {
                tool_app.dialog_alert(e);
            } finally {
                this.api_flag = false;
                this.api_load_discountForm = false;
            }
        }
	 }
};
</script>

<template>
	 <div class="d-inline">
		  <b-modal ref="modal" id="modal-standard" :title="'할인 상품 ' + (mode === 'edit' ? '수정' : '등록')" title-class="font-18">
				<b-spinner v-show="api_flag" variant="secondary" role="status" class="modal_spinner"></b-spinner>
				<b-container>
                  <label class=" mb-2">할인권 유형(필수)</label>
                  <!-- <custom-multi-select v-model="api_data.discountFormId" :options="option_discount_forms" :disabled="mode==='edit'"
                                       label="name" value-field="id" :class="{ 'is-invalid': api_submitted && $v.api_data.discountFormId.$error }"
                                       @input="loadPassForm"
                                       placeholder="할인 유형을 선택해주세요."/> -->

                                       
                    <custom-search-select v-model="api_data.discountFormId" 
                            :init-data="this.pageData && this.pageData.discountForm ? this.pageData.discountForm : null"
                            :type="'discountform'"  @input="loadPassForm" :disabled="mode==='edit'"
                            :is-invalid="api_submitted && $v.api_data.discountFormId.$error"
                            value-field="id" label-field="name"></custom-search-select>


                  <div
                          v-if="api_submitted && $v.api_data.discountFormId.$error"
                          class="invalid-feedback"
                  >
																<span v-if="!$v.api_data.discountFormId.required"
                                                >필수 입력값입니다.</span>
                  </div>

					 <label class="mt-3 mb-2">할인권 상품 이름(필수)</label>
					 <input type="text" class="form-control" v-model="api_data.name" :class="{ 'is-invalid': api_submitted && $v.api_data.name.$error }"/>
                  <div
                          v-if="api_submitted && $v.api_data.name.$error"
                          class="invalid-feedback"
                  >
																<span v-if="!$v.api_data.name.required"
                                                >필수 입력값입니다.</span>
                  </div>

					 <label class="mt-3 mb-2">관리 코드(필수)</label>
					 <input type="text" class="form-control" v-model="api_data.code" :class="{ 'is-invalid': api_submitted && $v.api_data.code.$error }"/>
                  <div
                          v-if="api_submitted && $v.api_data.code.$error"
                          class="invalid-feedback"
                  >
																<span v-if="!$v.api_data.code.required"
                                                >필수 입력값입니다.</span>
                  </div>



					 <label class="mt-3 mb-2">단가(필수)</label>
					 <input type="text" class="form-control" v-model="api_data.unitPrice" :class="{ 'is-invalid': api_submitted && $v.api_data.unitPrice.$error }"/>
                  <div
                          v-if="api_submitted && $v.api_data.unitPrice.$error"
                          class="invalid-feedback"
                  >
																<span v-if="!$v.api_data.unitPrice.required"
                                                >필수 입력값입니다.</span>
                  </div>

					 <label class="mt-3 mb-2">전체 구매 가능량(필수)</label>
					 <input type="text" class="form-control" v-model="api_data.totalQuota" :class="{ 'is-invalid': api_submitted && $v.api_data.totalQuota.$error }"/>
                  <div
                          v-if="api_submitted && $v.api_data.totalQuota.$error"
                          class="invalid-feedback"
                  >
																<span v-if="!$v.api_data.totalQuota.required"
                                                >필수 입력값입니다.</span>
                  </div>

					 <label class="mt-3 mb-2">입주사별 최대 구매 개수(필수)</label>
					 <input type="text" class="form-control" v-model="api_data.tenantMaxQuota" :class="{ 'is-invalid': api_submitted && $v.api_data.tenantMaxQuota.$error }"/>
                  <div
                          v-if="api_submitted && $v.api_data.tenantMaxQuota.$error"
                          class="invalid-feedback"
                  >
																<span v-if="!$v.api_data.tenantMaxQuota.required"
                                                >필수 입력값입니다.</span>
                  </div>

					 <label class="mt-3 mb-2">주문별 최대 구매 개수(필수)</label>
					 <input type="text" class="form-control" v-model="api_data.orderMaxQuota" :class="{ 'is-invalid': api_submitted && $v.api_data.orderMaxQuota.$error }"/>
                  <div
                          v-if="api_submitted && $v.api_data.orderMaxQuota.$error"
                          class="invalid-feedback"
                  >
																<span v-if="!$v.api_data.orderMaxQuota.required"
                                                >필수 입력값입니다.</span>
                  </div>

					 <label class="mt-3 mb-2">구매 시작 일시(필수)</label>
                  <Date_StartEnd v-model="api_data.orderStart" init-type="start" :invalid="api_submitted && $v.api_data.orderStart.$error"/>
                  <div
                          v-if="api_submitted && $v.api_data.orderStart.$error"
                          class="invalid-feedback"
                  >
																<span v-if="!$v.api_data.orderStart.required"
                                                >필수 입력값입니다.</span>
                  </div>

					 <label class="mt-3 mb-2">구매 종료 일시(필수)</label>
                  <Date_StartEnd v-model="api_data.orderEnd" init-type="end" :invalid="api_submitted && $v.api_data.orderEnd.$error"/>
                  <div
                          v-if="api_submitted && $v.api_data.orderEnd.$error"
                          class="invalid-feedback"
                  >
																<span v-if="!$v.api_data.orderEnd.required"
                                                >필수 입력값입니다.</span>
                  </div>

					 <label class="mt-3 mb-2">입주사 그룹 아이디</label>
                  <custom-multi-select v-model="api_data.tenantGroupId" :options="option_tenant_groups"
                                       label="name" value-field="id" :multiple="true"
                                       placeholder=""/>

					 <b-form-checkbox v-model="api_data.hidden"
											:true-value="true" :false-value="false" class="mt-4"
					 >
						  관리사 이외에 비노출 여부
					 </b-form-checkbox>

					 <b-form-checkbox v-model="api_data.approvalRequired"
											:true-value="true" :false-value="false" class="mt-4"
					 >
						  구매 승인 필요 여부
					 </b-form-checkbox>

					 <label class="mt-3 mb-2">비고</label>
					 <input type="text" class="form-control" v-model="api_data.description"/>


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
