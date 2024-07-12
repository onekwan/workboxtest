<script>
import PageLayout from "~/components/common/PageLayout";
import ModalClosings from "./ModalClosings";
import CopyUrl from "~/components/common/CopyUrl";
import detail_default from "@/mixin/detail_default";

export default {
    mixins: [detail_default],
	 components: {
		  PageLayout,
		  ModalClosings,
      CopyUrl
	 },
	 data() {
		  return {
				title: "정기권 유형 상세정보",
				cu_modalName: 'ModalClosings',
            apiPath: '/api/v1/closings/',
				deleteMsgTitle: '정기권 유형'
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

				data.autoRefill_local = data.autoRefill ? this.passAutoRefill[data.autoRefill] : '';

				data.timetable_local = tool_app.descTimetable(data.timetable)

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
                      <ModalClosings ref="ref_ModalClosings" :page-data="detailData" mode="edit" :callback="refreshAfterChange"/>
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
						  <dd class="col-9">{{ detailData.id | emptyCheck}}</dd>

						  <dt class="col-sm-3">이름</dt>
						  <dd class="col-9">{{ detailData.name | emptyCheck }}</dd>

						  <dt class="col-sm-3">종류</dt>
						  <dd class="col-9">{{ detailData.type_local | emptyCheck }}</dd>

						  <dt class="col-sm-3">관리 코드</dt>
						  <dd class="col-9">{{ detailData.code | emptyCheck }}</dd>

						  <dt class="col-sm-3">정기권 그룹</dt>
						  <dd class="col-9">{{ detailData.passGroup | toTextIdName }}</dd>

						  <dt class="col-sm-3">주간 입차 허용 시간표</dt>
						  <dd class="col-9">
								  {{detailData.timetable_local | toTextTimeTable}}
						  </dd>

						  <dt class="col-sm-3">공휴일 입차 허용 시간표</dt>
						  <dd class="col-9">{{ detailData.holiday | emptyCheck }}</dd>

						  <dt class="col-sm-3">권장 판매 가격</dt>
						  <dd class="col-9">{{ detailData.price | three_comma }} 원</dd>

						  <dt class="col-sm-3">입차 설비 그룹</dt>
						  <dd class="col-9">
								  {{detailData.enterMachineGroup | toTextItemsName}}
						  </dd>

						  <dt class="col-sm-3">입차 메시지</dt>
						  <dd class="col-9">{{ detailData.enterMsg | emptyCheck }}</dd>

						  <dt class="col-sm-3">출차 메시지</dt>
						  <dd class="col-9">{{ detailData.exitMsg | emptyCheck }}</dd>

						  <dt class="col-sm-3">정기권 계정 자동 충전</dt>
						  <dd class="col-9">{{ detailData.autoRefill_local | emptyCheck }}</dd>

						  <dt class="col-sm-3">정기권 계정 자동 충전량</dt>
						  <dd class="col-9">{{ detailData.refillPoints | emptyCheck }}</dd>

						  <dt class="col-sm-3">정기권을 제공하는 고객사</dt>
                      <dd class="col-9">
                            <a href="#" @click="linkOpen('/#/parkinglot_setting/clients/', detailData.client)">
                                  {{ detailData.client | toGetName }}
                            </a>
                      </dd>

						  <dt class="col-sm-3">기본 주차장</dt>
                      <dd class="col-9">
                            <a href="#" @click="linkOpen('/#/parkinglot_setting/zones/', detailData.mainZone)">
                                  {{ detailData.mainZone | toGetName }}
                            </a>
                      </dd>

						  <dt class="col-sm-3">적용 가능한 주차장 그룹</dt>
						  <dd class="col-9">{{ detailData.zoneGroup | ArrayToTextItemsName }}</dd>

						  <dt class="col-sm-3">외부에서 발행한 정기권인 경우 그 서비스</dt>
						  <dd class="col-9">{{ detailData.externalType | emptyCheck }}</dd>

						  <dt class="col-sm-3">외부에서 발행된 정기권인 경우 전송된 아이디</dt>
						  <dd class="col-9">{{ detailData.externalId | emptyCheck }}</dd>

						  <dt v-if="detailData.type==='TIMELY'" class="col-sm-3">입주사가 하루에 발급할 수 있는 최대 개수</dt>
						  <dd v-if="detailData.type==='TIMELY'" class="col-9">{{ detailData.maxCntInDay | three_comma }}</dd>

						  <dt v-if="detailData.type==='TIMELY'" class="col-sm-3">입주사가 한 달에 발급할 수 있는 최대 개수</dt>
						  <dd v-if="detailData.type==='TIMELY'" class="col-9">{{ detailData.maxCntInMonth | three_comma }}</dd>

						  <dt v-if="detailData.type==='TIMELY'" class="col-sm-3">입주사가 하루에 발급할 수 있는 최대 포인트(분)</dt>
						  <dd v-if="detailData.type==='TIMELY'" class="col-9">{{ detailData.maxPointsInDay | three_comma }}</dd>

						  <dt v-if="detailData.type==='TIMELY'" class="col-sm-3">입주사가 한 달에 발급할 수 있는 최대 포인트(분)</dt>
						  <dd v-if="detailData.type==='TIMELY'" class="col-9">{{ detailData.maxPointsInMonth | three_comma }}</dd>

						  <dt v-if="detailData.type==='TIMELY'" class="col-sm-3">입주사가 한 방문에 발급할 수 있는 최대 포인트(분)</dt>
						  <dd v-if="detailData.type==='TIMELY'" class="col-9">{{ detailData.maxPointsPerVisit | three_comma }}</dd>

						  <dt class="col-sm-3"> 부가 사항</dt>
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
