<script>
import PageLayout from "~/components/common/PageLayout";
import ModalSites from "./ModalSites.vue";
import CopyUrl from "~/components/common/CopyUrl";
import detail_default from "@/mixin/detail_default";


export default {
      mixins: [detail_default],
    components: {
        PageLayout,
        ModalSites,
        CopyUrl
    },
    data() {
        return {
            title: "주차 사업장 상세정보",
               cu_modalName: 'ModalSites',
              apiPath: '/api/v1/sites/',
                deleteMsgTitle: '주차 사업장',
              api_flag_button : false
        };
    },
    middleware: "authentication",
    mounted() {

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
            data.healthStatus_local = $const.siteHealthStatus[data.type];
            return data;
        },
        async changeToken() {
            try {

                if (this.api_flag_button) {
                    tool_app.dialog_alert("데이터 전송중입니다.");
                    return;
                }

                let cf = await tool_app.confirm("토큰을 변경 하시겠습니까?");
                if (!cf.isConfirmed) return false;


                this.api_flag_button = true;


                const res = await mainapi.invokeAPI(`/api/v1/sites/${this.detailData.id}/access-token`, {}, 'PUT')

                if (res.data.code !== $const.ApiSuccessCode.PUT) {
                    throw res.data.msg;
                    return false;
                }

                tool_app.dialog_success('토큰 변경이 완료되었습니다.');

                this.getDetail();
            } catch (e) {
                tool_app.log(e)
                tool_app.dialog_alert('토큰 변경에 실패하였습니다.<br/>' + tool_app.ErrorMsg(e));
            } finally {
                this.api_flag_button = false;
            }
        },
          async changeActive(active) {
                try {

                      if (this.api_flag_button) {
                            tool_app.dialog_alert("데이터 전송중입니다.");
                            return;
                      }

                      let cf = await tool_app.confirm("활성화 상태를 변경 하시겠습니까?");
                      if (!cf.isConfirmed) return false;


                      this.api_flag_button = true;


                      const res = await mainapi.invokeAPI(`/api/v1/sites/${this.detailData.id}/active`, {active:!active}, 'PUT')

                      if (res.data.code !== $const.ApiSuccessCode.PUT) {
                            throw res.data.msg;
                            return false;
                      }

                      tool_app.dialog_success('활성화 상태 변경이 완료되었습니다.');

                      this.getDetail();
                } catch (e) {
                      tool_app.log(e)
                      tool_app.dialog_alert('활성화 상태 변경에 실패하였습니다.<br/>' + tool_app.ErrorMsg(e));
                } finally {
                      this.api_flag_button = false;
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
                        <ModalSites ref="ref_ModalSites" :page-data="detailData" mode="edit"
                                    :callback="refreshAfterChange"/>
                        <SpinnerButton :loading="api_delete_flag" @click="deleteDetail" variant="danger">삭제
                        </SpinnerButton>
                        <SpinnerButton :loading="api_flag_button" @click="changeToken" variant="dark">토큰 변경
                        </SpinnerButton>
                        <SpinnerButton :loading="api_flag_button" @click="changeActive(detailData.active)" :variant="detailData.active ? 'dark' : 'info'">
                              {{ detailData.active ? '비활성화로' : '활성화로' }} 변경
                        </SpinnerButton>

                  </b-col>
                  <b-col cols="4" class="text-right">
                        <CopyUrl :detail_id="page_id"/>
                  </b-col>
            </b-row>

            <b-col cols="12">
                  <div class="card-body">
                        <dl class="row detail_page_striped">
                              <dt class="col-sm-3">아이디</dt>
                              <dd class="col-9">{{ detailData.id | emptyCheck }}</dd>

                              <dt class="col-sm-3">이름</dt>
                              <dd class="col-9">{{ detailData.name | emptyCheck }}</dd>

                              <dt class="col-sm-3">버전</dt>
                              <dd class="col-9">{{ detailData.version | emptyCheck }}</dd>

                              <dt class="col-sm-3">고객사</dt>
                              <dd class="col-9">
                                    <link-page :type="'clientDetail'" :linked="detailData.client"/>
                              </dd>

                              <dt class="col-sm-3">활성화여부</dt>
                              <dd class="col-9">{{ detailData.active }}</dd>

                              <dt class="col-sm-3">url</dt>
                              <dd class="col-9">{{ detailData.url | emptyCheck }}</dd>

                              <dt class="col-sm-3">accessToken</dt>
                              <dd class="col-9">

                                    {{ detailData.accessToken | emptyCheck }}
											 <CopyIconForText :copy_text="detailData.accessToken"/>
                              </dd>

                              <dt class="col-sm-3">oldAccessToken</dt>
                              <dd class="col-9">
                                    {{ detailData.oldAccessToken | emptyCheck }}
											 <CopyIconForText :copy_text="detailData.oldAccessToken"/>
                              </dd>


									 <dt class="col-sm-3">상태</dt>
									 <dd class="col-9">{{ siteStatus[detailData.status] | emptyCheck }}</dd>

                              <dt class="col-sm-3">연결 상태</dt>
                              <dd class="col-9">{{ siteHealthStatus[detailData.healthStatus] | emptyCheck }}</dd>

                              <dt class="col-sm-3">마지막 연결 상태 체크 일시</dt>
                              <dd class="col-9">{{ detailData.healthChecked | emptyCheck }}</dd>

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
