<script>
import {required} from "vuelidate/lib/validators";
import modal_default from "@/mixin/modal_default";

let origin_format = {
      type : '',
      productId : '',
      qty : '',
      carNumber : ''
}

export default {
      mixins : [modal_default],
    components: {

    },
    data() {
        return {
            api_data: {
                ...origin_format
            }
        };
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


            let payLoad = tool_app.getApiData(this.api_data);
            payLoad.qty = parseInt(payLoad.qty);
            if(payLoad.type==="DISCOUNT"){
                  delete payLoad.carNumber;
            }


            let msg = this.mode === 'edit' ? '수정' : '등록';
            try {

                let url = this.mode === 'edit' ? '/api/v1/orders/' + this.pageData.id : '/api/v1/orders';
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
                tool_app.dialog_success(`주문 ${msg}이 완료되었습니다.`);
            } catch (e) {
                tool_app.log(e)
                tool_app.dialog_alert(`주문 ${msg}에 실패하였습니다.` + "<br/>" + e.msg ? e.msg : e);
            } finally {
                this.api_flag = false;
            }

        }
    }
};
</script>

<template>
      <div class="d-inline">
            <b-modal ref="modal" id="modal-standard" title="주문 등록" title-class="font-18" size="lg">
                  <b-spinner v-show="api_flag" variant="secondary" role="status" class="modal_spinner"></b-spinner>
                  <b-container>
                        <b-row>
                              <b-col cols="12">
                                    <label class="mb-2">상품 유형 *</label>
                                    <select class="form-select" v-model="api_data.type">
                                          <option v-for="(value, key) in productType" :value="key" :key="key">{{ value }}
                                          </option>
                                    </select>
                                    <p class="text-muted">* 상품 UID와 맞는 유형을 선택해 주세요.</p>

                                    <label class="mt-3 mb-2">상품 UID *</label>
                                    <input type="text" class="form-control" v-model="api_data.productId"/>

                                    <label class="mt-3 mb-2">주문 개수 *</label>
                                    <input type="text" class="form-control" v-model="api_data.qty" v-mask="'###############'"/>

                                    <label class="mt-3 mb-2">차량번호(정기권 상품일 경우) *</label>
                                    <input type="text" class="form-control" v-model="api_data.carNumber"/>
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
