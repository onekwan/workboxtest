<script>
import PageLayout from "~/components/common/PageLayout";
import ModalClients from "./ModalClients.vue";
import CopyUrl from "~/components/common/CopyUrl";
import detail_default from "@/mixin/detail_default";


export default {
      mixins: [detail_default],
    components: {
        PageLayout,
        ModalClients,
        CopyUrl
    },
    data() {
        return {
            title: "고객사 상세정보",
            cu_modalName: 'ModalClients',
              apiPath: '/api/v1/clients/',
            deleteMsgTitle: '고객사'
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
            data.type_local = $const.companyType[data.type];
            data.status_local = $const.clientStatus[data.status];

            return data;
        }
    }
};
</script>

<template>
      <PageLayout :title="title" :page-loading="pageLoading">
            <b-row>
                  <b-col cols="8">
                        <button class="btn btn-warning" @click="show_CU_Modal">수정</button>
                        <ModalClients ref="ref_ModalClients" :page-data="detailData" mode="edit"
                                      :callback="refreshAfterChange"/>
                        <SpinnerButton :loading="api_delete_flag" @click="deleteDetail" variant="danger">삭제
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

                              <dt class="col-sm-3">사업자등록번호</dt>
                              <dd class="col-9">{{ detailData.registrationNumber | emptyCheck }}</dd>

                              <dt class="col-sm-3">ceo 명</dt>
                              <dd class="col-9">{{ detailData.ceoName | emptyCheck }}</dd>

                              <dt class="col-sm-3">대표자 명</dt>
                              <dd class="col-9">{{ detailData.representativeName | emptyCheck }}</dd>

                              <dt class="col-sm-3">대표 전화번호</dt>
                              <dd class="col-9">{{ detailData.representativePhone | emptyCheck }}</dd>

                              <dt class="col-sm-3">대표 메일</dt>
                              <dd class="col-9">{{ detailData.representativeEmail | emptyCheck }}</dd>

                              <dt class="col-sm-3">유형</dt>
                              <dd class="col-9">{{ detailData.type_local | emptyCheck }}</dd>

                              <dt class="col-sm-3">상태</dt>
                              <dd class="col-9">{{ detailData.status_local | emptyCheck }}</dd>

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
