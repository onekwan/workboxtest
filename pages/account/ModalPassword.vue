<script>
import {required} from "vuelidate/lib/validators";
import {mapState} from "vuex";

let origin_format = {
    "currentPassword" : "",
    "modifyingPassword": ""
}
export default {
    data() {
        return {
            api_submitted: false,
            api_flag: false,
            api_data: {
                ...origin_format
            },
            usertypes: $const.userType,
            companyTypes: $const.companyType,
            unusedCompanyType: false,
            unusedUserType: false,
            confirm_password: ''
        };
    },

    created() {
        let currentUser = this.$store.getters['auth/currentUser'];

    },
    computed: {
        ...mapState('auth', {
            currentUser: state => state.currentUser
        })
    },
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
            this.confirm_password = '';
        },
        async api_request() {
            if (this.api_flag) {
                tool_app.dialog_alert("데이터 전송중입니다.");
                return;
            }

            if (this.api_data.modifyingPassword !== this.confirm_password) {
                tool_app.dialog_alert("비밀번호 확인이 일치하지 않습니다.");
                return;
            }

            this.api_flag = true;
            this.api_submitted = true;

            let payLoad = tool_app.getApiData(this.api_data);

            let msg = '변경';
            try {

                let res = await mainapi.invokeAPI(`/api/v1/users/${this.currentUser.id}/password`, payLoad, 'PUT');

                if (res.data.code !== $const.ApiSuccessCode.PUT) {
                    throw res.data.msg;
                    return false;
                }

                this.hide();
                this.api_submitted = false;
                this.api_flag = false;
                tool_app.dialog_success(`비밀번호 ${msg}이 완료되었습니다.`);
            } catch (e) {
                tool_app.log(e)
                tool_app.dialog_alert(`비밀번호 ${msg}에 실패하였습니다.` + "<br/>" + e.msg ? e.msg : e);
            } finally {
                this.api_flag = false;
            }

        }
    }
};
</script>

<template>
      <div class="d-inline">
            <b-modal ref="modal" id="modal-standard" :title="'비밀번호 변경'"
                     title-class="font-18">
                  <b-spinner v-show="api_flag" variant="secondary" role="status" class="modal_spinner"></b-spinner>
                  <b-container>
                        <label class="mb-2">현재 비밀번호 *</label>
                        <input type="password" class="form-control" v-model="api_data.currentPassword"/>

                        <label class="mb-2 mt-3">새 비밀번호 *</label>
                        <input type="password" class="form-control" v-model="api_data.modifyingPassword"/>

                        <label class="mt-3 mb-2">새 비밀번호 확인*</label>
                        <input type="password" class="form-control" v-model="confirm_password"/>
                  </b-container>
                  <template #modal-footer>
                        <div class="w-100" style="text-align:right">
                              <button class="btn btn-secondary" @click="hide">취소</button>
                              <button class="btn btn-info" @click="api_request">변경하기
                              </button>
                        </div>
                  </template>
            </b-modal>

      </div>
</template>
