<script>

import {mapState} from "vuex";
import modal_default from "@/mixin/modal_default";

let origin_format = {
    "userIdList": []
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
          if (this.mode !== 'edit') {
                this.setSelectBoxOptions([
                      {path: 'users', payload: {companyType: 'NONE'}}
                ])
          }
    },
    computed: mapState({
        option_no_resident: state => state.selectBoxOptions.no_resident
    }),
    mounted() {

    },
    methods: {
        show() {
            this.reset();
            this.$refs['modal'].show();
        },
        reset() {
            this.api_data = {...origin_format};
        },
        async api_request(del) {
            if (this.api_flag) {
                tool_app.dialog_alert("데이터 전송중입니다.");
                return;
            }

            if (del) {
                let cf = await tool_app.confirm('삭제하시겠습니까?');
                if (!cf.isConfirmed) return false;
            }

            this.api_flag = true;
            this.api_submitted = true;

            let payLoad = tool_app.getApiData(this.api_data);

            payLoad.userIdList = tool_app.emptyArrayNull(payLoad.userIdList);

            let msg = del ? '삭제가' : '등록이';
            try {
                let url = del ? '/api/v1/products/none-resident/pop/' : '/api/v1/products/none-resident/push/';
                let res = await mainapi.invokeAPI(url + this.pageData.id, payLoad, 'PUT');

                if (res.data.code !== $const.ApiSuccessCode.PUT) {
                    throw res.data.msg;
                    return false;
                }

                this.hide();
                this.api_submitted = false;
                this.api_flag = false;
                if (this.callback) this.callback();
                tool_app.dialog_success(`비거주자  ${msg} 완료되었습니다.`);
            } catch (e) {
                tool_app.log(e)
                tool_app.dialog_alert(`비거주자 ${msg} 실패하였습니다.` + "<br/>" + tool_app.ErrorMsg(e));
            } finally {
                this.api_flag = false;
            }

        }
    }
};
</script>

<template>
      <div class="d-inline">
            <b-modal ref="modal" id="modal-standard" title="구매 가능한 비거주자 회원 등록 및 삭제" title-class="font-18">
                  <b-spinner v-show="api_flag" variant="secondary" role="status" class="modal_spinner"></b-spinner>
                  <b-container>
                        <label class="mt-3 mb-2">선택한 비거주자 회원</label>
                        <custom-multi-select v-model="api_data.userIdList" :options="option_no_resident"
                                             label="name" value-field="id" :multiple="true"
                                             placeholder="회원을 선택해주세요."/>
                  </b-container>
                  <template #modal-footer>
                        <div class="w-100" style="text-align:right">
                              <button class="btn btn-secondary" @click="hide">취소</button>
                              <button class="btn btn-danger" @click="api_request(true)">삭제하기</button>
                              <button class="btn btn-info" @click="api_request(false)">등록하기</button>
                        </div>
                  </template>
            </b-modal>

      </div>
</template>
