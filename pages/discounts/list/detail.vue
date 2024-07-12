<script>
import PageLayout from "~/components/common/PageLayout";
import CopyUrl from "~/components/common/CopyUrl";
import detail_default from "@/mixin/detail_default";

export default {
    mixins: [detail_default],
    components: {
        PageLayout,
        CopyUrl
    },
    data() {
        return {
            title: "할인 상세정보",
            apiPath: '/api/v1/discounts/',
            deleteMsgTitle: '할인'
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
            data.type_local = $const.discountType[data.type];
            data.sector_local = $const.discountSector[data.sector];
            data.method_local = $const.discountMethod[data.method];
            data.matchingType_local = $const.discountMatchingType[data.matchingType];
            return data;
        }
    }
};
</script>

<template>
      <PageLayout :title="title" :page-loading="pageLoading">
            <b-row>
                  <b-col cols="8">
                        <SpinnerButton :loading="api_delete_flag" @click="deleteDetail" variant="danger">삭제</SpinnerButton>
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

                            <dt class="col-sm-3">방문 UID</dt>
                            <dd class="col-9">
                                <link-page :type="'visitDetail'" :linked="detailData.visit" name-property="carNumber"/>
                            </dd>

                            <dt class="col-sm-3">예약</dt>
                            <dd class="col-9">{{ detailData.reservation | emptyCheck }}</dd>

                            <dt class="col-sm-3">발급 권원인 할인 계정 UID</dt>
                            <dd class="col-9">
										  <link-page :type="'discountAccountDetail'" :linked="detailData.discountAccountId"/>
									 </dd>

                            <dt class="col-sm-3">발급 유형 UID</dt>
                            <dd class="col-9">{{ detailData.discountFormId | emptyCheck }}</dd>

                            <dt class="col-sm-3">종류</dt>
                            <dd class="col-9">{{ detailData.type_local | emptyCheck }}</dd>

                            <dt class="col-sm-3">구매액에 따른 할인</dt>
                            <dd class="col-9">{{ detailData.bundle | emptyCheck }}</dd>

                            <dt class="col-sm-3">부문</dt>
                            <dd class="col-9">{{ detailData.sector_local | emptyCheck }}</dd>

                            <dt class="col-sm-3">적용 방식</dt>
                            <dd class="col-9">{{ detailData.method_local | emptyCheck }}</dd>

                            <dt class="col-sm-3">할인 값</dt>
                            <dd class="col-9">{{ detailData.val | emptyCheck }}</dd>

                            <dt class="col-sm-3">할인 값2</dt>
                            <dd class="col-9">{{ detailData.val2 | emptyCheck }}</dd>

                            <dt class="col-sm-3">추가 할인</dt>
                            <dd class="col-9">{{ detailData.bonus | emptyCheck }}</dd>

                            <dt class="col-sm-3">할인을 제공하는 고객사</dt>
                            <dd class="col-9">
                                <link-page :type="'clientDetail'" :linked="detailData.client"/>
                            </dd>

                            <dt class="col-sm-3">기본 주차장</dt>
                            <dd class="col-9">
                                <link-page :type="'zoneDetail'" :linked="detailData.mainZone"/>
                            </dd>

                            <dt class="col-sm-3">실제 할인이 반영된 금액</dt>
                            <dd class="col-9">{{ detailData.discountedAmount | emptyCheck }}</dd>

                            <dt class="col-sm-3">바코드 등을 이용해 발급할 때 그 유형</dt>
                            <dd class="col-9">{{ detailData.matchingType_local | emptyCheck }}</dd>

                            <dt class="col-sm-3">바코드 등을 이용해 발급할 때, 그 코드</dt>
                            <dd class="col-9">{{ detailData.matchingCode | emptyCheck }}</dd>

                            <dt class="col-sm-3">외부에서 발행된 경우 그 서비스</dt>
                            <dd class="col-9">{{ detailData.externalType | emptyCheck }}</dd>

                            <dt class="col-sm-3">외부에서 발행된 경우 전송된 아이디</dt>
                            <dd class="col-9">{{ detailData.externalId | emptyCheck }}</dd>

                            <dt class="col-sm-3">특기 사항</dt>
                            <dd class="col-9">{{ detailData.memo | emptyCheck }}</dd>

                            <dt class="col-sm-3">부가 사항</dt>
                            <dd class="col-9">{{ detailData.details | emptyCheck }}</dd>

                            <dt class="col-sm-3">자둉 발급 여부</dt>
                            <dd class="col-9">{{ detailData.autoApplied | emptyCheck }}</dd>

									 <dt class="col-sm-3">등록자</dt>
									 <dd class="col-9">
										  <link-page :type="'userDetail'" :linked="{id:detailData.creatorId,name:detailData.creatorName}"/>
									 </dd>

                            <dt class="col-sm-3">등록 일시</dt>
                            <dd class="col-9">{{ detailData.created | emptyCheck }}</dd>
                        </dl>
                  </div>
            </b-col>
      </PageLayout>
</template>

<style></style>
