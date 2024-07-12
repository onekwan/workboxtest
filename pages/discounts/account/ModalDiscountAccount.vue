<script>
import {required} from "vuelidate/lib/validators";
import {mapState} from "vuex";
import modal_default from "@/mixin/modal_default";

let origin_format = {
      type : 'WITHDRAW',
      status : 'RECENT',
      tenantId : '',
      reservationId : '',
      visitId : '',
      discountId : '',
      points : 0,
      balance : 0,
      monthlyPoints : 0
}

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
				status: {required},
				type: {required},
				tenantId : {required},
				points : {required,isGreaterThanZero}
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
                      let flag =  tool_app.covertDetailToEdit(prop, this.api_data ,this.pageData);
                      if(flag) continue;
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
					 create : ['type','status','tenantId','points'],
					 edit : ['type','status','tenantId','points']
				})) {
					 this.api_flag = false;
					 return;
				}


            let payLoad = tool_app.getApiData(this.api_data);
            payLoad.points = parseInt(payLoad.points);
            payLoad.balance = parseInt(payLoad.balance);
            payLoad.monthlyPoints = parseInt(payLoad.monthlyPoints);

            if (this.mode === 'edit') {
                let fields = [];
                for (let prop in payLoad) {
                    fields.push(prop);
                }
                payLoad.fields = fields;
            }

            let msg = this.mode === 'edit' ? '수정' : '등록';
            try {
                let url = this.mode === 'edit' ? '/api/v1/discount-accounts/' + this.pageData.id : '/api/v1/discount-accounts';
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
                tool_app.dialog_success(`할인 계정 ${msg}이 완료되었습니다.`);
            } catch (e) {
                tool_app.log(e)
                tool_app.dialog_alert(`할인 계정 ${msg}에 실패하였습니다.` + "<br/>" + e.msg ? e.msg : e);
            } finally {
                this.api_flag = false;
            }

        }
    }
};
</script>

<template>
      <div class="d-inline">
            <b-modal ref="modal" id="modal-standard" :title="'할인 계정 ' + (mode === 'edit' ? '수정' : '등록')"
                     title-class="font-18">
                  <b-spinner v-show="api_flag" variant="secondary" role="status" class="modal_spinner"></b-spinner>
                  <b-container>
                        <label class="mb-2 required">유형</label>
                        <select class="form-select" v-model="api_data.type">
                              <option v-for="(value, key) in passAccountType" :value="key" :key="key">{{ value }}</option>
                        </select>

                        <label class="mt-3 mb-2 required">상태</label>
                        <select class="form-select" v-model="api_data.status">
                              <option v-for="(value, key) in visitAccountType" :value="key" :key="key">{{ value }}</option>
                        </select>

                        <label class="mt-3 mb-2 required">입주사</label>
							 <custom-search-select v-model="api_data.tenantId" :type="'tenants'" :is-site-name="true"
														  :init-data="this.pageData && this.pageData.tenant ? this.pageData.tenant : null"
														  value-field="id" label-field="name"></custom-search-select>


							 <label class="mt-3 mb-2 required">변동량</label>
							 <input type="text" class="form-control" v-model="api_data.points"/>


                        <label class="mt-3 mb-2">예약 UID</label>
                        <input type="text" class="form-control" v-model="api_data.reservationId"/>

                        <label class="mt-3 mb-2">방문 UID</label>
                        <input type="text" class="form-control" v-model="api_data.visitId"/>

                        <label class="mt-3 mb-2">할인 UID</label>
                        <input type="text" class="form-control" v-model="api_data.discountId"/>



                        <label class="mt-3 mb-2">잔여량</label>
                        <input type="text" class="form-control" v-model="api_data.balance"/>

                        <label class="mt-3 mb-2">이달 사용 개수</label>
                        <input type="text" class="form-control" v-model="api_data.monthlyPoints"/>
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
