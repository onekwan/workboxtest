<script>
import modal_default from "@/mixin/modal_default";

let origin_format = {
    "type": "WITHDRAW",
    "status": "RECENT",
    "tenantId": "",
    "passId": "",
    "points": 0,
    "balance": 0
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


            let payLoad = tool_app.getApiData(this.api_data);
            payLoad.points = parseInt(payLoad.points);
            payLoad.balance = parseInt(payLoad.balance);

            if (this.mode === 'edit') {
                let fields = [];
                for (let prop in payLoad) {
                    fields.push(prop);
                }
                payLoad.fields = fields;
            }

            let msg = this.mode === 'edit' ? '수정' : '등록';
            try {
                let url = this.mode === 'edit' ? '/api/v1/pass-accounts/' + this.pageData.id : '/api/v1/pass-accounts';
                let res = await mainapi.invokeAPI(url, payLoad, this.mode === 'edit' ? 'PATCH' : 'POST');

                let successCode = this.mode === 'edit' ? $const.ApiSuccessCode.PATCH : $const.ApiSuccessCode.POST;
                if (res.data.code !== successCode) {
                    throw res.data.msg;

                }

                this.hide();
                this.api_submitted = false;
                this.api_flag = false;
                if (this.callback) this.callback();
                tool_app.dialog_success(`정기권 계정 ${msg}이 완료되었습니다.`);
            } catch (e) {
                tool_app.log(e)
                tool_app.dialog_alert(`정기권 계정 ${msg}에 실패하였습니다.` + "<br/>" + e.msg ? e.msg : e);
            } finally {
                this.api_flag = false;
            }

        }
    }
};
</script>

<template>
      <div class="d-inline">
            <b-modal ref="modal" id="modal-standard" :title="'정기권 계정 ' + (mode === 'edit' ? '수정' : '등록')"
                     title-class="font-18">
                  <b-spinner v-show="api_flag" variant="secondary" role="status" class="modal_spinner"></b-spinner>
                  <b-container>
                        <label class="mb-2">유형 *</label>
                        <select class="form-select" v-model="api_data.type">
                              <option v-for="(value, key) in passAccountType" :value="key" :key="key">{{ value }}</option>
                        </select>

                        <label class="mt-3 mb-2">상태 *</label>
                        <select class="form-select" v-model="api_data.status">
                              <option v-for="(value, key) in visitAccountType" :value="key" :key="key">{{ value }}</option>
                        </select>

                        <label class="mt-3 mb-2">입주사 ID *</label>
                        <input type="text" class="form-control" v-model="api_data.tenantId"/>

                        <label class="mt-3 mb-2">정기권 ID *</label>
                        <input type="text" class="form-control" v-model="api_data.passId"/>

                        <label class="mt-3 mb-2">변동량 *</label>
                        <input type="text" class="form-control" v-model="api_data.points"/>

                        <label class="mt-3 mb-2">잔여량 *</label>
                        <input type="text" class="form-control" v-model="api_data.balance"/>
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
