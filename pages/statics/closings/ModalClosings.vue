<script>
import {required} from "vuelidate/lib/validators";
import {mapState} from "vuex";
import Date_StartEnd from "@/components/common/Date_StartEnd.vue";
import modal_default from "@/mixin/modal_default";

// 필수값 받음
let origin_format = {
    "name": "",
    "code": "",
    "passFormId": "",
    "passGroupId": "",
    "description": "",
    "passStart": "",
    "passEnd": "",
    "unitPrice": 0,
    "totalQuota": 0,
    "tenantMaxQuota": 0,
    "orderMaxQuota": 0,
    "orderStart": "",
    "orderEnd": "",
    "tenantGroupId": []
}

export default {
      mixins : [modal_default],
      components : {
            Date_StartEnd
      },
    data() {
        return {
            api_data: {
                ...origin_format
            }
        };
    },
      validations: {
            api_data : {
                  name : {required},
                  code : {required},
                  passFormId : {required},
                  passStart : {required},
                  passEnd : {required},
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
                      {path: 'pass-forms', payload: {}}, {path: 'pass-groups', payload: {}}, {
                            path: 'tenant-groups',
                            payload: {}
                      }
                ])
          }
    },
    computed: {
          ...mapState({
                option_pass_forms: state => state.selectBoxOptions.pass_forms,
                option_pass_groups: state => state.selectBoxOptions.pass_groups,
                option_tenant_groups: state => state.selectBoxOptions.tenant_groups

          }),
          disabledWrite() {
                return this.api_load_passForm === true || this.api_data.passFormId === '';
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
                let flag = tool_app.covertDetailToEdit(prop, this.api_data, this.pageData);
                if (flag) continue;
                if (prop === 'timetable') {
                    if (this.pageData.timetable !== null) {
                        this.api_data.timetable = this.pageData.timetable;
                        this.select_limit_timeTable = 'limit';
                        this.$refs.ref_setTimeTable.setTimeTable(this.pageData.timetable);
                    }
                } else {
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

            if(this.api_data.passStart && this.api_data.passEnd){
                  if (moment(this.api_data.passStart).isAfter(this.api_data.passEnd)) {
                        tool_app.dialog_alert("정기권 시작일시가 종료일시보다 이후입니다.");
                        this.api_flag = false;
                        return;
                  }
            }

            if(this.api_data.orderStart && this.api_data.orderEnd){
                  if (moment(this.api_data.orderStart).isAfter(this.api_data.orderEnd)) {
                        tool_app.dialog_alert("구매 시작일시가 종료일시보다 이후입니다.");
                        this.api_flag = false;
                        return;
                  }
            }



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
            try {

                let url = this.mode === 'edit' ? '/api/v1/pass-products/' + this.pageData.id : '/api/v1/pass-products';

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
                tool_app.dialog_success(`정기권 상품 ${msg}이 완료되었습니다.`);
            } catch (e) {
                tool_app.log(e)
                tool_app.dialog_alert(`정기권 상품 ${msg}에 실패하였습니다.` + "<br/>" + tool_app.ErrorMsg(e));
            } finally {
                this.api_flag = false;
            }

        },
        async loadPassForm() {
                try {
                      if(this.mode==='edit') return false;
                      if (this.api_load_passForm) {
                            tool_app.dialog_alert("데이터 전송중입니다.");
                            return;
                      }
                      this.api_flag = true;
                      this.api_load_passForm = true;


                      const res = await mainapi.invokeAPI_GET('/api/v1/pass-forms/' + this.api_data.passFormId, {}, 'GET')

                      if (res.data.code !== $const.ApiSuccessCode.GET) {
                            tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg)
                            return;
                      }

                      let data = res.data.data;

                      let setPropList = ['enterMsg', 'exitMsg', 'price']
                      for (let prop in this.api_data) {
                            if(prop==='passFormId') continue;
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
                      this.api_load_passForm = false;
                }
          }
    }
};
</script>

<template>
      <div class="d-inline">
            <b-modal ref="modal" id="modal-standard" :title="'정기권 상품 ' + (mode === 'edit' ? '수정' : '등록')"
                     title-class="font-18">
                  <b-spinner v-show="api_flag" variant="secondary" role="status" class="modal_spinner"></b-spinner>
                  <b-container>
                        <label class="mt-3 mb-2">정기권 유형(필수)</label>
                        <custom-multi-select v-model="api_data.passFormId" :options="option_pass_forms"
                                             label="name" value-field="id" @input="loadPassForm"
                                             :disabled="mode==='edit'"  :class="{ 'is-invalid': api_submitted && $v.api_data.passFormId.$error }"
                                             placeholder="정기권 유형을 선택해주세요."/>
                        <div
                              v-if="api_submitted && $v.api_data.passFormId.$error"
                              class="invalid-feedback"
                        >
																<span v-if="!$v.api_data.passFormId.required"
                                                >필수 입력값입니다.</span>
                        </div>

                        <label class="mb-2 mt-3">정기권 상품 이름(필수)</label>
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




<!--                        <label class="mt-3 mb-2">정기권 속성 그룹</label>-->
<!--                        <custom-multi-select v-model="api_data.passGroupId" :options="option_pass_groups"-->
<!--                                             label="name" value-field="id"-->
<!--                                             placeholder="정기권 속성 그룹을 선택해주세요."/>-->


                        <label class="mt-3 mb-2">정기권 시작일시(필수)</label>
                        <Date_StartEnd v-model="api_data.passStart" init-type="start" :invalid="api_submitted && $v.api_data.passStart.$error"/>
                        <div
                              v-if="api_submitted && $v.api_data.passStart.$error"
                              class="invalid-feedback"
                        >
																<span v-if="!$v.api_data.passStart.required"
                                                >필수 입력값입니다.</span>
                        </div>


                        <label class="mt-3 mb-2">정기권 종료일시(필수)</label>
                        <Date_StartEnd v-model="api_data.passEnd" init-type="end" :invalid="api_submitted && $v.api_data.passEnd.$error "/>
                        <div
                              v-if="api_submitted && $v.api_data.passEnd.$error"
                              class="invalid-feedback"
                        >
																<span v-if="!$v.api_data.passEnd.required"
                                                >필수 입력값입니다.</span>
                        </div>


                        <label class="mt-3 mb-2">단가(필수)</label>
                        <input type="text" class="form-control" v-model="api_data.unitPrice" v-mask="'########'" :class="{ 'is-invalid': api_submitted && $v.api_data.unitPrice.$error }"/>
                        <div
                              v-if="api_submitted && $v.api_data.unitPrice.$error"
                              class="invalid-feedback"
                        >
																<span v-if="!$v.api_data.unitPrice.required"
                                                >필수 입력값입니다.</span>
                        </div>

                        <label class="mt-3 mb-2">전체 구매 가능량(필수)</label>
                        <input type="text" class="form-control" v-model="api_data.totalQuota" v-mask="'########'" :class="{ 'is-invalid': api_submitted && $v.api_data.totalQuota.$error }"/>
                        <div
                              v-if="api_submitted && $v.api_data.totalQuota.$error"
                              class="invalid-feedback"
                        >
																<span v-if="!$v.api_data.totalQuota.required"
                                                >필수 입력값입니다.</span>
                        </div>

                        <label class="mt-3 mb-2">입주사별 최대 구매 개수(필수)</label>
                        <input type="text" class="form-control" v-model="api_data.tenantMaxQuota" v-mask="'########'" :class="{ 'is-invalid': api_submitted && $v.api_data.tenantMaxQuota.$error }"/>
                        <div
                              v-if="api_submitted && $v.api_data.tenantMaxQuota.$error"
                              class="invalid-feedback"
                        >
																<span v-if="!$v.api_data.tenantMaxQuota.required"
                                                >필수 입력값입니다.</span>
                        </div>

                        <label class="mt-3 mb-2">주문별 최대 구매 개수(필수)</label>
                        <input type="text" class="form-control" v-model="api_data.orderMaxQuota" v-mask="'########'" :class="{ 'is-invalid': api_submitted && $v.api_data.orderMaxQuota.$error }"/>
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


                        <label class="mt-3 mb-2">입주사 그룹</label>
                        <custom-multi-select v-model="api_data.tenantGroupId" :options="option_tenant_groups"
                                             label="name" value-field="id" :multiple="true"
                                             placeholder=""/>

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
