<script>
import PageLayout from "~/components/common/PageLayout";
import ModalDiscountLimit from "./ModalDiscountLimit";
import CopyUrl from "~/components/common/CopyUrl";
import detail_default from "@/mixin/detail_default";

export default {
   mixins: [detail_default],
  components: {
    PageLayout,
    ModalDiscountLimit,
    CopyUrl
  },
  data() {
    return {
      title: "할인 제한 상세정보",
      cu_modalName: 'ModalDiscountLimit',
      apiPath: '/api/v1/discount-limits/',
      deleteMsgTitle : '할인 제한'
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
        <button class="btn btn-warning" @click="show_CU_Modal">수정</button>
        <SpinnerButton :loading="api_delete_flag" @click="deleteDetail" variant="danger">삭제</SpinnerButton>
        <ModalDiscountLimit ref="ref_ModalDiscountLimit" :page-data="detailData" mode="edit"
                           :callback="refreshAfterChange"/>
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

          <dt class="col-sm-3">고객사</dt>
          <dd class="col-9">
				  <link-page :type="'clientDetail'" :linked="detailData.client"/>
			 </dd>

          <dt class="col-sm-3">출차 후 재발급 가능 시간</dt>
          <dd class="col-9">{{ detailData.afterExit | emptyCheck }}</dd>

          <dt class="col-sm-3">차량별 발급 제한할 때 기준 월 수</dt>
          <dd class="col-9">{{ detailData.monthsForCntPerCar | emptyCheck }}</dd>

          <dt class="col-sm-3">monthsForCntPerCar개월 동안 발급할 수 있는 최대 할인 수</dt>
          <dd class="col-9">{{ detailData.maxCntPerCarInMonths | emptyCheck }}</dd>

          <dt class="col-sm-3">차량별 발급 제한할 때 기준 일 수</dt>
          <dd class="col-9">{{ detailData.daysForCntPerCar | emptyCheck }}</dd>

          <dt class="col-sm-3">daysForCntPerCar일 동안 발급할 수 있는 최대 할인 수</dt>
          <dd class="col-9">{{ detailData.maxCntPerCarInDays | emptyCheck }}</dd>

          <dt class="col-sm-3">차량별로 요일마다 발급할 수 있는 최대 수</dt>
          <dd class="col-9">{{ detailData.maxCntPerCarOnWeek | emptyCheck }}</dd>

          <dt class="col-sm-3">방문별로 기간마다 최대 발급 수</dt>
          <dd class="col-9">{{ detailData.maxCntPerVisit | emptyCheck }}</dd>

          <dt class="col-sm-3">방문별로 기간마다 최대 발급 수</dt>
          <dd class="col-9">{{ detailData.maxCntPerVisitWeekly | emptyCheck }}</dd>

          <dt class="col-sm-3">방문별로 기간마다 최대 할인 시간</dt>
          <dd class="col-9">{{ detailData.maxTimePerVisit | emptyCheck }}</dd>

          <dt class="col-sm-3">방문별로 기간마다 최대 할인 시간</dt>
          <dd class="col-9">{{ detailData.maxTimePerVisitWeekly | emptyCheck }}</dd>

          <dt class="col-sm-3">방문별로 기간마다 최대 할인 금액</dt>
          <dd class="col-9">{{ detailData.maxAmtPerVisit | emptyCheck }}</dd>

          <dt class="col-sm-3">방문별로 기간마다 최대 할인 금액</dt>
          <dd class="col-9">{{ detailData.maxAmtPerVisitWeekly | emptyCheck }}</dd>

          <dt class="col-sm-3">방문별로 기간마다 최대 할인 비율</dt>
          <dd class="col-9">{{ detailData.maxRatePerVisit | emptyCheck }}</dd>

          <dt class="col-sm-3">방문별로 기간마다 최대 할인 비율</dt>
          <dd class="col-9">{{ detailData.maxRatePerWeekly | emptyCheck }}</dd>

				<dt class="col-sm-3">방문별로 무료로 입주사에게 제공되는 할인을 발급할 수 있는 최대
					 개수</dt>
				<dd class="col-9">{{ detailData.maxCmplCntPerVisit | emptyCheck }}</dd>

				<dt class="col-sm-3">방문별로 무료로 입주사에게 제공되는 할인을 발급할 수 있는 최대
					 개수</dt>
				<dd class="col-9">{{ detailData.maxCmplCntPerWeekly | emptyCheck }}</dd>

				<dt class="col-sm-3">방문별로 무료로 입주사에게 제공되는 할인을 발급할 수 있는 최대
					 시간</dt>
				<dd class="col-9">{{ detailData.maxCmplTimePerVisit | emptyCheck }}</dd>

				<dt class="col-sm-3">방문별로 무료로 입주사에게 제공되는 할인을 발급할 수 있는 최대
					 시간</dt>
				<dd class="col-9">{{ detailData.maxCmplTimePerWeekly | emptyCheck }}</dd>

				<dt class="col-sm-3">공공할인이 발행된 경우 발행할 수 있는 민간 할인 최대 개수</dt>
				<dd class="col-9">{{ detailData.maxPvtCntForPub | emptyCheck }}</dd>

				<dt class="col-sm-3">공공할인이 발행된 경우 발행할 수 있는 민간 할인 최대 개수</dt>
				<dd class="col-9">{{ detailData.maxPvtCntForPubWeekly | emptyCheck }}</dd>

				<dt class="col-sm-3">주간 발급 가능 시간표. null이면 제한이 없는 것으로 본다. 비었으
					 면 항상 허용하지 않는 것이다</dt>
				<dd class="col-9">{{ detailData.timetable | toTextTimeTable }}</dd>

				<dt class="col-sm-3">휴일 발급 가능 시간표. null이면 제한이 없는 것으로 본다. 비었으
					 면 항상 허용하지 않는 것이다.</dt>
				<dd class="col-9">{{ detailData.holiday | emptyCheck }}</dd>

				<dt class="col-sm-3">등록자</dt>
				<dd class="col-9">
					 <link-page :type="'userDetail'" :linked="{id:detailData.creatorId,name:detailData.creatorName}"/>
				</dd>

          <dt class="col-sm-3">등록 일시</dt>
          <dd class="col-9">{{ detailData.created | emptyCheck}}</dd>

				<dt class="col-sm-3">변경자</dt>
				<dd class="col-9">
					 <link-page :type="'userDetail'" :linked="{id:detailData.modifierId,name:detailData.modifierName}"/>
				</dd>

          <dt class="col-sm-3">변경 일시</dt>
          <dd class="col-9">{{ detailData.modified | emptyCheck}}</dd>
        </dl>
      </div>
    </b-col>
  </PageLayout>
</template>

<style></style>
