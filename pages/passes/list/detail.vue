<script>
import PageLayout from "~/components/common/PageLayout";
import ModalPasses from "./ModalPasses";
import CopyUrl from "~/components/common/CopyUrl";
import detail_default from "@/mixin/detail_default";

export default {
      mixins: [detail_default],
    components: {
        PageLayout,
        ModalPasses,
        CopyUrl
    },
    data() {
        return {
            title: "정기권 상세정보",
            cu_modalName: 'ModalPasses',
              apiPath: '/api/v1/passes/',
            deleteMsgTitle: '정기권'

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
        }
    }
};
</script>

<template>
      <PageLayout :title="title" :page-loading="pageLoading">
            <b-row>
                  <b-col cols="8">
                        <button class="btn btn-warning" @click="show_CU_Modal">수정</button>
                        <ModalPasses ref="ref_ModalPasses" :page-data="detailData" mode="edit"
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

                              <dt class="col-sm-3">종류</dt>
                              <dd class="col-9">{{ detailData.type_local | emptyCheck }}</dd>

                              <dt class="col-sm-3">상태</dt>
                              <dd class="col-9">{{ detailData.status_local | emptyCheck }}</dd>

                              <dt class="col-sm-3">관리 코드</dt>
                              <dd class="col-9">{{ detailData.code | emptyCheck }}</dd>

                              <dt class="col-sm-3">차량 번호(암호화)</dt>
                              <dd class="col-9">{{ detailData.carNumber | emptyCheck }}</dd>

                              <dt class="col-sm-3">차량 모델</dt>
                              <dd class="col-9">{{ detailData.carModel | emptyCheck }}</dd>

                              <dt class="col-sm-3">정기권자 이름</dt>
                              <dd class="col-9">{{ detailData.carModel | emptyCheck }}</dd>

                              <dt class="col-sm-3">정기권자 전화번호</dt>
                              <dd class="col-9">{{ detailData.phone | emptyCheck }}</dd>

                              <dt class="col-sm-3">정기권자 주소</dt>
                              <dd class="col-9">{{ detailData.address | emptyCheck }}</dd>

                              <dt class="col-sm-3">소속 부서</dt>
                              <dd class="col-9">{{ detailData.position | ArrayToText }}</dd>

                              <dt class="col-sm-3">발행 경로</dt>
                              <dd class="col-9">{{ detailData.origin_local | emptyCheck }}</dd>

                              <dt class="col-sm-3">구매 금액</dt>
                              <dd class="col-9">{{ detailData.payedAmt | three_comma }} 원</dd>

                              <dt class="col-sm-3">구매 일시</dt>
                              <dd class="col-9">{{ detailData.payed | emptyCheck }}</dd>

                              <dt class="col-sm-3">시작 시간</dt>
                              <dd class="col-9">{{ detailData.start | emptyCheck }}</dd>

                              <dt class="col-sm-3">종료 일시</dt>
                              <dd class="col-9">{{ detailData.end | emptyCheck }}</dd>

                              <dt class="col-sm-3">정기권 유형 UID</dt>
                              <dd class="col-9">
                                   <link-page type="passFormDetail" :linked="detailData.passFormId"></link-page>
                              </dd>

                              <dt class="col-sm-3">정기권 그룹</dt>
                              <dd class="col-9">
                                    <link-page type="passGroupDetail" :linked="detailData.passGroup"></link-page>
                              </dd>

                              <dt class="col-sm-3">주간 입차 허용 시간표</dt>
                              <dd class="col-9">{{ detailData.timetable_local | toTextTimeTable }}</dd>

                              <dt class="col-sm-3">공휴일 입차 허용 시간표</dt>
                              <dd class="col-9">{{ detailData.holiday | emptyCheck }}</dd>

                              <dt class="col-sm-3">입차 설비 그룹</dt>
                              <dd class="col-9">{{
                                          detailData.enterMachineGroup | toTextItemsName
                                    }}
                              </dd>

                              <dt class="col-sm-3">입차 메시지</dt>
                              <dd class="col-9">{{ detailData.enterMsg | emptyCheck }}</dd>

                              <dt class="col-sm-3">출차 메시지</dt>
                              <dd class="col-9">{{ detailData.exitMsg | emptyCheck }}</dd>

                              <dt class="col-sm-3">정기권을 제공하는 고객사</dt>
                              <dd class="col-9">
                                    <link-page type="clientDetail" :linked="detailData.client"></link-page>

                              </dd>

                              <dt class="col-sm-3">기본 주차장</dt>
                              <dd class="col-9">
                                    <link-page type="zoneDetail" :linked="detailData.mainZone"></link-page>
                              </dd>

                              <dt class="col-sm-3">적용 가능한 주차장 그룹</dt>
                              <dd class="col-9">
                                  <link-page type="zoneGroupDetail" :linked="detailData.zoneGroup"></link-page>
                              </dd>

                              <dt class="col-sm-3">특기 사항</dt>
                              <dd class="col-9">{{ detailData.memo | emptyCheck }}</dd>

                              <dt class="col-sm-3">부가 사항</dt>
                              <dd class="col-9">{{ detailData.details | emptyCheck }}</dd>

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
