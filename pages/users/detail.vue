<script>
import PageLayout from "~/components/common/PageLayout";
import ModalUsers from "./ModalUsers.vue";
import ModalPassword from "./ModalPassword.vue";
import CopyUrl from "~/components/common/CopyUrl";
import detail_default from "@/mixin/detail_default";


export default {
      mixins: [detail_default],
    components: {
        PageLayout,
        ModalUsers,
        ModalPassword,
        CopyUrl
    },
    data() {
        return {
            title: "사용자 상세정보",
            cu_modalName: 'ModalUsers',
              apiPath: '/api/v1/users/',
            deleteMsgTitle: '사용자',
              api_active_flag : false,
				api_clearlock_flag : false
        };
    },

    middleware: "authentication",
    mounted() {

        if (this.openType === 'page') {
            switch (this.$route.name) {
                case "client_users_detail" :
                    this.pageType = 'CLIENT';
                    break;
                case "managers_users_detail" :
                    this.pageType = 'MASTER';
                    break;
                case "tenants_noresident_detail" :
                    this.pageType = 'NORESIDENT';
                    break;
                case "tenants_resident_detail" :
                    this.pageType = 'RESIDENT';
                    break;
            }
        }
    },
    methods: {
        async getDetail() {
            this.pageLoading = true;

            try {
                const res = await mainapi.invokeAPI_GET(this.apiPath + this.page_id, {}, 'GET')

                if (res.data.code !== $const.ApiSuccessCode.GET) {
                    tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg)
                }
                const data = res.data.data
                this.detailData = this.manipulate_Data(data);
            } catch (e) {
                tool_app.dialog_alert(e);
            } finally {
                this.pageLoading = false;
            }
        },
        manipulate_Data(data) {
            return data;
        },
        show_passwordChange_Modal() {
            this.$refs.ref_ModalPassword.show();
        },
          async toggleActive(){
                if (this.api_active_flag) {
                      tool_app.dialog_alert("데이터 전송중입니다.");
                      return;
                }

                this.api_active_flag = true;

                let payLoad = {
                        suspended: this.detailData.suspended === null ? moment().format("YYYY-MM-DD HH:mm:ss") : null
                };
                payLoad.fields = ['suspended'];

                let msg = this.detailData.suspended === null ? '비활성화' : '활성화';
                try {
                      let url = '/api/v1/users/' + this.detailData.id;

                      let res = await mainapi.invokeAPI(url, payLoad, 'PATCH');

                      let successCode = $const.ApiSuccessCode.PATCH;
                      if (res.data.code !== successCode) {
                            throw res.data.msg;
                            return false;
                      }

                      this.api_active_flag = false;
                      this.getDetail();
                      tool_app.dialog_success(`사용자 ${msg}가 완료되었습니다.`);
                } catch (e) {
                      tool_app.log(e)
                      tool_app.dialog_alert(`사용자 ${msg}에 실패하였습니다.` + "<br/>" + e.msg ? e.msg : e);
                } finally {
                      this.api_active_flag = false;
                }
          },
		  async clear_passwordlock(){
				if (this.api_clearlock_flag) {
					 tool_app.dialog_alert("데이터 전송중입니다.");
					 return;
				}

				this.api_clearlock_flag = true;

				try {
					 let res = await mainapi.invokeAPI(`/api/v1/users/${this.detailData.id}/password/lock`, {}, 'DELETE');

					 let successCode = $const.ApiSuccessCode.DELETE;
					 if (res.data.code !== successCode) {
						  throw res.data.msg;
						  return false;
					 }

					 this.api_clearlock_flag = false;
					 this.getDetail();
					 tool_app.dialog_success(`비밀번호 잠금 해제가 완료되었습니다.`);
				} catch (e) {
					 tool_app.log(e)
					 tool_app.dialog_alert(`비밀번호 잠금 해제에 실패하였습니다.` + "<br/>" + e.msg ? e.msg : e);
				} finally {
					 this.api_clearlock_flag = false;
				}
		  }
    }
};
</script>

<template>
      <PageLayout :title="title" :page-loading="pageLoading">
            <b-row>
                  <b-col cols="8">
                        <button class="btn btn-warning" @click="show_CU_Modal">수정</button>
                        <ModalUsers ref="ref_ModalUsers" :page-data="detailData" mode="edit"
                                    :callback="refreshAfterChange"/>
                        <SpinnerButton :loading="api_delete_flag" @click="deleteDetail" variant="danger"
                                       v-if="pageType !== 'MASTER'">삭제
                        </SpinnerButton>
                        <SpinnerButton :loading="api_active_flag" @click="toggleActive" :variant="detailData.suspended === null ? 'warning' : 'info'">
                              {{ detailData.suspended === null ? '비활성화' : '활성화' }}
                        </SpinnerButton>
                        <button class="btn btn-dark" @click="show_passwordChange_Modal">비밀번호 변경하기</button>
							 <SpinnerButton :loading="api_clearlock_flag" @click="clear_passwordlock" variant="secondary">
								  비밀번호 잠금 해제
							 </SpinnerButton>
                        <ModalPassword ref="ref_ModalPassword" :page-data="detailData" :page-type="pageType"/>
                  </b-col>
                  <b-col cols="4" class="text-right">
                        <CopyUrl :detail_id="page_id"/>
                  </b-col>
            </b-row>

            <b-col cols="12">
                  <div class="card-body">
                        <dl class="row detail_page_striped">
                              <dt class="col-sm-3">UID</dt>
                              <dd class="col-9">{{ detailData.id | emptyCheck }}</dd>

                              <dt class="col-sm-3">이름</dt>
                              <dd class="col-9">{{ detailData.name | emptyCheck }}</dd>

                              <dt class="col-sm-3">계정명</dt>
                              <dd class="col-9">{{ detailData.username | emptyCheck }}</dd>

                              <dt class="col-sm-3">유형</dt>
                              <dd class="col-9">{{ userType[detailData.type] | emptyCheck }}</dd>

                              <dt class="col-sm-3">전화번호</dt>
                              <dd class="col-9">{{ detailData.phone | emptyCheck }}</dd>

                              <dt class="col-sm-3">회사 UID</dt>
                              <dd class="col-9">{{ detailData.companyId | emptyCheck }}</dd>

                              <dt class="col-sm-3">회사 유형</dt>
                              <dd class="col-9">{{ companyType[detailData.companyType] | emptyCheck }}</dd>

                              <dt class="col-sm-3">사용 정지된 일시</dt>
                              <dd class="col-9">{{ detailData.suspended | emptyCheck }}</dd>

									 <dt class="col-sm-3">등록자</dt>
									 <dd class="col-9">
										  <link-page :type="'userDetail'" :linked="{id:detailData.creatorId,name:detailData.creatorName}"/>
									 </dd>

                              <dt class="col-sm-3">등록 일시</dt>
                              <dd class="col-9">{{ detailData.created | emptyCheck }}</dd>

									 <dt class="col-sm-3">변경자</dt>
									 <dd class="col-9">
										  <link-page :type="'userDetail'" :linked="{id:detailData.modifierId,name:detailData.modifierName}"/>
									 </dd>

                              <dt class="col-sm-3">변경 일시</dt>
                              <dd class="col-9">{{ detailData.modified | emptyCheck }}</dd>
                        </dl>
                  </div>
            </b-col>
      </PageLayout>
</template>

<style></style>
