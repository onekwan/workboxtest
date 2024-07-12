<script>
import PageLayout from "~/components/common/PageLayout";
import ModalPassProducts from "./ModalPassProducts.vue";
import ModalNoResidents from "./ModalNoResidents.vue";
import CopyUrl from "~/components/common/CopyUrl";
import detail_default from "@/mixin/detail_default";

export default {
      mixins: [detail_default],
    components: {
        PageLayout,
        ModalPassProducts,
        ModalNoResidents,
        CopyUrl
    },
    data() {
        return {
            title: "정기권 상품 상세정보",
            cu_modalName: 'ModalPassProducts',
              apiPath: '/api/v1/pass-products/',
            deleteMsgTitle: '정기권 상품',
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
            data.type_local = this.passType[data.type];
            data.status_local = this.passStatus[data.status];
            data.origin_local = this.passOrigin[data.origin];
            data.timetable_local = tool_app.descTimetable(data.timetable);

            return data;
        },
        show_modalAddnoResidents() {
            this.$refs.ref_ModalNoResidents.show();
        }
    }
};
</script>

<template>
      <PageLayout :title="title" :page-loading="pageLoading">
            <b-row>
                  <b-col cols="8">
                        <button class="btn btn-warning" @click="show_CU_Modal">수정</button>
                        <ModalPassProducts ref="ref_ModalPassProducts" :page-data="detailData" mode="edit"
                                           :callback="refreshAfterChange"/>
                        <SpinnerButton :loading="api_delete_flag" @click="deleteDetail" variant="danger">삭제
                        </SpinnerButton>
                        <button class="btn btn-dark" @click="show_modalAddnoResidents">구매 가능한 비거주자 등록/삭제</button>
                        <ModalNoResidents ref="ref_ModalNoResidents" :page-data="detailData" :callback="refreshAfterChange"/>
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

                              <dt class="col-sm-3">관리 코드</dt>
                              <dd class="col-9">{{ detailData.code | emptyCheck }}</dd>


                              <dt class="col-sm-3">정기권 유형</dt>
                              <dd class="col-9">
                                    <link-page type="passFormDetail" :linked="detailData.passForm"></link-page>
                              </dd>

                              <dt class="col-sm-3">정기권 속성 그룹</dt>
                              <dd class="col-9">
                                  <link-page type="passGroupDetail" :linked="detailData.passGroup"></link-page>
                              </dd>

                              <dt class="col-sm-3">설명</dt>
                              <dd class="col-9">{{ detailData.description | emptyCheck }}</dd>

                              <dt class="col-sm-3">정기권 시작 일시</dt>
                              <dd class="col-9">{{ detailData.passStart | emptyCheck }}</dd>

                              <dt class="col-sm-3">정기권 종료 일시</dt>
                              <dd class="col-9">{{ detailData.passEnd | emptyCheck }}</dd>

                              <dt class="col-sm-3">관리사 이외에 비노출 여부</dt>
                              <dd class="col-9">{{ detailData.hidden | toTextBoolean }}</dd>

                              <dt class="col-sm-3">구매 승인 필요 여부</dt>
                              <dd class="col-9">{{ detailData.approvalRequired | toTextBoolean }}</dd>

                              <dt class="col-sm-3">단가</dt>
                              <dd class="col-9">{{ detailData.unitPrice | three_comma }}</dd>

                              <dt class="col-sm-3">전체 구매 가능량</dt>
                              <dd class="col-9">{{ detailData.totalQuota | three_comma }}</dd>

                              <dt class="col-sm-3">입주사 별 최대 구매 개수</dt>
                              <dd class="col-9">{{ detailData.tenantMaxQuota | three_comma }}</dd>

                              <dt class="col-sm-3">주문 별 최대 구매 개수</dt>
                              <dd class="col-9">{{ detailData.orderMaxQuota | three_comma }}</dd>

                              <dt class="col-sm-3">주문 개수</dt>
                              <dd class="col-9">{{ detailData.orderCnt | three_comma }}</dd>

                              <dt class="col-sm-3">구매 시작 일시</dt>
                              <dd class="col-9">{{ detailData.orderStart | emptyCheck }}</dd>

                              <dt class="col-sm-3">구매 종료 일시</dt>
                              <dd class="col-9">{{ detailData.orderEnd | emptyCheck }}</dd>

                              <dt class="col-sm-3">상품을 구매할 수 있는 입주사 그룹</dt>
                              <dd class="col-9">
                                  <link-page type="tenantGroupDetail" :linked="detailData.tenantGroup"></link-page>
                              </dd>

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
