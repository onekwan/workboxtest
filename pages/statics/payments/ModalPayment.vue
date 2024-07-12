<script>
import {required} from "vuelidate/lib/validators";
import {mapState} from "vuex";
import modal_default from "@/mixin/modal_default";

let origin_format = {
    name: '',
    orderIds: '',
    clientId: '',
    mainZoneId: '',
    billedAmt: 0,
    payedAmt: 0,
    payMethod: '',
    payMethodNo: '',
    authCode: '',
    authDate: '',
    authTime: '',
    payed: '',
    payMachineId: '',
    payRawData: '',
    created: ''
}

export default {
      mixins : [modal_default],
    components: {},
    data() {
        return {
            api_data: {
                ...origin_format
            }
        };
    },
    props: ["callback", "pageData", "mode"
    ],
    created() {
        if (this.mode !== 'edit') {
            this.setSelectBoxOptions([
                {path: 'clients', payload: {}}, {path: 'zones', payload: {}}, {path: 'machines', payload: {}}
            ])
        }
    },
    computed: mapState({
        option_clients: state => state.selectBoxOptions.clients,
        option_zones: state => state.selectBoxOptions.zones,
        option_machines: state => state.selectBoxOptions.machines
    }),
    mounted() {

    },
    methods: {
        show() {
            this.reset();
            this.$refs['modal'].show();
        },
        hide() {
            this.$refs['modal'].hide();
        },
        reset() {
            this.api_data = {...origin_format};
        },
        async api_request() {
            if (this.api_flag) {
                tool_app.dialog_alert("데이터 전송중입니다.");
                return;
            }

            this.api_flag = true;
            this.api_submitted = true;


            let payLoad = tool_app.getApiData(this.api_data);
            payLoad.orderIds = tool_app.makeArrayForCreateApi(payLoad.orderIds);
            payLoad.billedAmt = parseInt(payLoad.billedAmt);
            payLoad.payedAmt = parseInt(payLoad.payedAmt);
            payLoad.payMachineId = null;

            let _payRawData = tool_app.makeJSONStringData(payLoad.payRawData);
            if (_payRawData === null) {
                tool_app.dialog_alert("부가 사항이 JSON 형식이 아닙니다.");
                this.api_flag = false;
                return;
            }
            payLoad.payRawData = _payRawData;

            let msg = this.mode === 'edit' ? '수정' : '등록';
            try {

                let url = this.mode === 'edit' ? '/api/v1/product-payments/' + this.pageData.id : '/api/v1/product-payments';
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
                tool_app.dialog_success(`결제 ${msg}이 완료되었습니다.`);
            } catch (e) {
                tool_app.log(e)
                tool_app.dialog_alert(`결제 ${msg}에 실패하였습니다.` + "<br/>" + e.msg ? e.msg : e);
            } finally {
                this.api_flag = false;
            }

        }
    }
};
</script>

<template>
      <div class="d-inline">
            <b-modal ref="modal" id="modal-standard" title="결제 등록" title-class="font-18" size="lg">
                  <b-spinner v-show="api_flag" variant="secondary" role="status" class="modal_spinner"></b-spinner>
                  <b-container>
                        <b-row>
                              <b-col cols="12">
                                    <label class="mb-2 mt-3">결제 이름 *</label>
                                    <input type="text" class="form-control" v-model="api_data.name"/>

                                    <label class="mb-2 mt-3">주문 ID*</label>
                                    <input type="text" class="form-control" v-model="api_data.orderIds"/>
                                    <p class="text-muted">* 콤마로 구분하여 적어주세요.</p>

                                    <label class="mb-2 mt-3">고객사 *</label>
                                    <custom-multi-select v-model="api_data.clientId" :options="option_clients"
                                                         label="name" value-field="id"
                                                         placeholder="고객사를 선택해주세요."/>


                                    <label class="mb-2 mt-3">주차장 *</label>
                                    <custom-multi-select v-model="api_data.mainZoneId" :options="option_zones"
                                                         label="name" value-field="id"
                                                         placeholder="주차장을 선택해주세요."/>


                                    <label class="mb-2 mt-3">결제액 *</label>
                                    <input type="text" class="form-control" v-model="api_data.billedAmt"
                                           v-mask="'###############'"/>

                                    <label class="mb-2 mt-3">실제 결제액 *</label>
                                    <input type="text" class="form-control" v-model="api_data.payedAmt"
                                           v-mask="'###############'"/>

                                    <label class="mb-2 mt-3">결제 수단 *</label>
                                    <select class="form-select" v-model="api_data.payMethod">
                                          <option v-for="(value, key) in payMethods" :value="key" :key="key">{{ value }}
                                          </option>
                                    </select>

                                    <div v-show="api_data.payMethod==='CARD'">
                                          <label class="mb-2 mt-3">결제 수단 번호(암호화) *</label>
                                          <input type="text" class="form-control" v-model="api_data.payMethodNo"/>
                                    </div>


                                    <label class="mb-2 mt-3">결제 승인 번호 *</label>
                                    <input type="text" class="form-control" v-model="api_data.authCode"/>

                                    <label class="mb-2 mt-3">결제 승인 날짜 *</label>
                                    <date-picker v-model="api_data.authDate"
                                                 format="YYYYMMDD" value-type="format"
                                                 :first-day-of-week="1" lang="ko"
                                    ></date-picker>

                                    <label class="mb-2 mt-3">결제 승인 시각 *</label>
                                    <date-picker v-model="api_data.authTime" type="time" value-type="format"
                                                 format="HHmmss"></date-picker>

                                    <label class="mb-2 mt-3">결제 일시 *</label>
                                    <date-picker
                                            v-model="api_data.payed"
                                            type="datetime"
                                            lang="ko"
                                            value-type="format" format="YYYY-MM-DD HH:mm:ss"
                                    ></date-picker>

                                    <label class="mb-2 mt-3">결제 설비 *</label>
                                    <custom-multi-select v-model="api_data.payMachineId" :options="option_machines"
                                                         label="name" value-field="id"
                                                         placeholder="결제 설비를 선택해주세요."/>


                                    <label class="mb-2 mt-3">결제 응답 원문 *</label>
                                    <input type="text" class="form-control" v-model="api_data.payRawData"/>

                                    <label class="mb-2 mt-3">등록 일시 *</label>
                                    <date-picker
                                            v-model="api_data.created"
                                            type="datetime"
                                            lang="ko"
                                            value-type="format" format="YYYY-MM-DD HH:mm:ss"
                                    ></date-picker>
                              </b-col>
                        </b-row>


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
