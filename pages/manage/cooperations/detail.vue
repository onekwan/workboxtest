<script>
import PageLayout from "~/components/common/PageLayout";
import CopyUrl from "~/components/common/CopyUrl";
import ModalCooperations from "@/pages/manage/cooperations/ModalCooperations.vue";
import ModalDiscountForm from "@/pages/discounts/form/ModalDiscountForm.vue";
import detail_default from "@/mixin/detail_default";

export default {
      mixins: [detail_default],
    components: {
          ModalDiscountForm,
        PageLayout,
        CopyUrl,
          ModalCooperations
    },
    data() {
        return {
            title: "외부 서비스 상세정보",
            cu_modalName: 'ModalCooperations',
              apiPath: '/api/v1/cooperations/',
            deleteMsgTitle: '외부 서비스'
        };
    },
    middleware: "authentication",
    mounted() {

    },
    methods: {
        async getDetail() {
            this.pageLoading = true;

            try {
                const res = await mainapi.invokeAPI_GET(this.apiPath + this.pageId, {}, 'GET')

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
            data.type_local = $const.cooperationsType[data.type];
            return data;
        }
    }
};
</script>

<template>
      <PageLayout :title="title" :page-loading="pageLoading">
            <b-row>
                  <b-col cols="8">
                        <div>
                              <button class="btn btn-warning" @click="show_CU_Modal">수정</button>
                              <SpinnerButton :loading="api_delete_flag" @click="deleteDetail" variant="danger">삭제
                              </SpinnerButton>
                              <ModalCooperations ref="ref_ModalCooperations" :page-data="detailData" mode="edit" :callback="refreshAfterChange"/>
                        </div>
                  </b-col>
                  <b-col cols="4" class="text-right">
                        <CopyUrl :detail_id="pageId"/>
                  </b-col>
            </b-row>

            <b-col cols="12">
                  <div class="card-body">
                        <dl class="row detail_page_striped">
                              <dt class="col-sm-3">서비스 이름</dt>
                              <dd class="col-9">{{ detailData.name | emptyCheck }}</dd>

                              <dt class="col-sm-3">UID</dt>
                              <dd class="col-9">{{ detailData.id | emptyCheck }}</dd>

                              <dt class="col-sm-3">유형</dt>
                              <dd class="col-9">{{ detailData.type_local | emptyCheck }}</dd>

                              <dt class="col-sm-3">연동 정보</dt>
                              <dd class="col-9">{{ detailData.data }}</dd>

                              <dt class="col-sm-3">등록자 UID</dt>
                              <dd class="col-9">{{ detailData.creatorId | emptyCheck }}</dd>

                              <dt class="col-sm-3">등록자 이름</dt>
                              <dd class="col-9">{{ detailData.creatorName | emptyCheck }}</dd>

                              <dt class="col-sm-3">등록 일시</dt>
                              <dd class="col-9">{{ detailData.created | emptyCheck }}</dd>

                              <dt class="col-sm-3">변경자 UID</dt>
                              <dd class="col-9">{{ detailData.modifierId | emptyCheck}}</dd>

                              <dt class="col-sm-3">변경자 이름</dt>
                              <dd class="col-9">{{ detailData.modifierName | emptyCheck}}</dd>

                              <dt class="col-sm-3">변경 일시</dt>
                              <dd class="col-9">{{ detailData.modified | emptyCheck}}</dd>
                        </dl>
                  </div>
            </b-col>
      </PageLayout>
</template>

<style></style>
