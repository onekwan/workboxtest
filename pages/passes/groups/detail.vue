<script>
import PageLayout from "~/components/common/PageLayout";
import ModalPassesGroups from "./ModalPassesGroups.vue";
import CopyUrl from "~/components/common/CopyUrl";
import detail_default from "@/mixin/detail_default";


export default {
      mixins: [detail_default],
    components: {
          ModalPassesGroups,
          PageLayout,
          CopyUrl
    },
    data() {
        return {
            title: "정기권 그룹 상세정보",
            cu_modalName: 'ModalPassesGroups',
              apiPath: '/api/v1/pass-groups/',
            deleteMsgTitle: '정기권 그룹'

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
            data.autoRefill_local = data.autoRefill ? $const.passAutoRefill[data.autoRefill] : ''

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
                        <ModalPassesGroups ref="ref_ModalPassesGroups" :page-data="detailData" mode="edit"
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
                              <dt class="col-sm-3">UID</dt>
                              <dd class="col-9">{{ detailData.id | emptyCheck }}</dd>

                              <dt class="col-sm-3">이름</dt>
                              <dd class="col-9">{{ detailData.name | emptyCheck }}</dd>

                              <dt class="col-sm-3">입차 메시지</dt>
                              <dd class="col-9">{{ detailData.enterMsg | emptyCheck }}</dd>

                              <dt class="col-sm-3">출차 메시지</dt>
                              <dd class="col-9">{{ detailData.exitMsg | emptyCheck }}</dd>

                              <dt class="col-sm-3">자동 충전 방식</dt>
                              <dd class="col-9">{{ detailData.autoRefill_local | emptyCheck }}</dd>

                              <dt class="col-sm-3">자동 충전량(분)</dt>
                              <dd class="col-9">{{ detailData.refillPoints | three_comma }}</dd>

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
