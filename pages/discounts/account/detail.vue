<script>
import PageLayout from "~/components/common/PageLayout";
import ModalDiscountAccount from "./ModalDiscountAccount.vue";
import CopyUrl from "~/components/common/CopyUrl";
import detail_default from "@/mixin/detail_default";


export default {
      mixins: [detail_default],
    components: {
          ModalDiscountAccount,
        PageLayout,
        CopyUrl
    },
    data() {
        return {
            title: "할인 계정 상세정보",
            cu_modalName: 'ModalDiscountAccount',
              apiPath: '/api/v1/discount-accounts/',
            deleteMsgTitle: '할인 계정'
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

            return data;
        }
    }
};
</script>

<template>
      <PageLayout :title="title" :page-loading="pageLoading">
            <b-row>
                  <b-col cols="8">
<!--                        <button class="btn btn-warning" @click="show_CU_Modal">수정</button>-->
                        <ModalDiscountAccount ref="ref_ModalDiscountAccount" :page-data="detailData" mode="edit"
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
                              <dd class="col-sm-9">{{ detailData.id | emptyCheck}}</dd>

                              <dt class="col-sm-3">유형</dt>
                              <dd class="col-sm-9">{{ passAccountType[detailData.type] | emptyCheck}}</dd>

                              <dt class="col-sm-3">상태</dt>
                              <dd class="col-sm-9">{{ detailData.status | emptyCheck}}</dd>

                              <dt class="col-sm-3">입주사</dt>
                              <dd class="col-sm-9">
                                    <link-page :type="'tenantDetail'" :linked="detailData.tenant"/>
                              </dd>

                              <dt class="col-sm-3">예약</dt>
                              <dd class="col-sm-9">{{ detailData.reservation | emptyCheck}}</dd>

                              <dt class="col-sm-3">방문</dt>
                              <dd class="col-sm-9">
                                    <link-page :type="'visitDetail'" :linked="detailData.visit"/>
                              </dd>

                              <dt class="col-sm-3">발급한 할인</dt>
                              <dd class="col-sm-9">{{ detailData.discount | emptyCheck}}</dd>

                              <dt class="col-sm-3">변동량</dt>
                              <dd class="col-sm-9">{{ detailData.points | three_comma}}</dd>

                              <dt class="col-sm-3">잔여량</dt>
                              <dd class="col-sm-9">{{ detailData.balance | three_comma}}</dd>

                              <dt class="col-sm-3">이달 사용 개수</dt>
                              <dd class="col-sm-9">{{ detailData.monthlyPoints | three_comma}}</dd>

									 <dt class="col-sm-3">등록자</dt>
									 <dd class="col-9">
										  <link-page :type="'userDetail'" :linked="{id:detailData.creatorId,name:detailData.creatorName}"/>
									 </dd>

                              <dt class="col-sm-3">등록 일시</dt>
                              <dd class="col-sm-9">{{ detailData.created | emptyCheck}}</dd>
                        </dl>
                  </div>
            </b-col>
      </PageLayout>
</template>

<style></style>
