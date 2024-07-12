<script>
import PageLayout from "~/components/common/PageLayout";
import ModalZones from "./ModalZones.vue";
import CopyUrl from "~/components/common/CopyUrl";
import detail_default from "@/mixin/detail_default";

export default {
  mixins: [detail_default],
  components: {
    ModalZones,
    PageLayout,
    CopyUrl
  },
  data() {
    return {
      title: "주차장 상세정보",
      cu_modalName: 'ModalZones',
      apiPath: '/api/v1/zones/',
      listUrl : '/parkinglot_setting/zones',
      deleteMsgTitle: '주차장'
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
      data.whenExitOnNoOperation_local = $const.whenExitOnNoOperation[data.whenExitOnNoOperation];
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
        <ModalZones ref="ref_ModalZones" :page-data="detailData" mode="edit"
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
          <dd class="col-9">{{ detailData.id | emptyCheck}}</dd>

          <dt class="col-sm-3">이름</dt>
          <dd class="col-9">{{ detailData.name | emptyCheck }}</dd>

          <dt class="col-sm-3">사업장</dt>
          <dd class="col-9">
            <link-page :type="'siteDetail'" :linked="detailData.site"/>
          </dd>

          <dt class="col-sm-3">주차장 내 주차장일 경우, 외부 주차장</dt>
          <dd class="col-9">
            <link-page :type="'zoneDetail'" :linked="detailData.outerZone"/>
          </dd>

          <dt class="col-sm-3">고객사</dt>
          <dd class="col-9">
            <link-page :type="'clientDetail'" :linked="detailData.client"/>
          </dd>

          <dt class="col-sm-3">대표자</dt>
          <dd class="col-9">{{ detailData.ceo | emptyCheck }}</dd>

          <dt class="col-sm-3">사업자 등록번호</dt>
          <dd class="col-9">{{ detailData.bizNumber | emptyCheck }}</dd>

          <dt class="col-sm-3">주소</dt>
          <dd class="col-9">{{ detailData.address | emptyCheck }}</dd>

          <dt class="col-sm-3">전화 번호</dt>
          <dd class="col-9">{{ detailData.phone | emptyCheck }}</dd>

          <dt class="col-sm-3">부가가치세율</dt>
          <dd class="col-9">{{ detailData.vatRate | emptyCheck }} %</dd>

          <dt class="col-sm-3">은행 이름</dt>
          <dd class="col-9">{{ detailData.bankName | emptyCheck }}</dd>

          <dt class="col-sm-3">예금주</dt>
          <dd class="col-9">{{ detailData.bankHolder | emptyCheck }}</dd>

          <dt class="col-sm-3">계좌번호(암호화)</dt>
          <dd class="col-9">{{ detailData.bankNumber | emptyCheck }}</dd>

          <dt class="col-sm-3">운영사</dt>
          <dd class="col-9">{{ detailData.operator | toTextIdName }}</dd>

          <dt class="col-sm-3">유지보수사</dt>
          <dd class="col-9">{{ detailData.maintainers | toTextIdName }}</dd>

          <dt class="col-sm-3">국가코드(ISO 3166-1)</dt>
          <dd class="col-9">{{ detailData.country | emptyCheck }}</dd>

          <dt class="col-sm-3">시간대(ISO 8601)</dt>
          <dd class="col-9">{{ detailData.timezone | emptyCheck }}</dd>

          <dt class="col-sm-3">위도</dt>
          <dd class="col-9">{{ detailData.lat | emptyCheck }}</dd>

          <dt class="col-sm-3">경도</dt>
          <dd class="col-9">{{ detailData.lon | emptyCheck }}</dd>

          <dt class="col-sm-3">전체 주차 면수</dt>
          <dd class="col-9">{{ detailData.totalSpaceCnt | three_comma }}</dd>

          <dt class="col-sm-3">차량이 주차된 주차 면수</dt>
          <dd class="col-9">{{ detailData.seizsedSpaceCnt | three_comma}}</dd>

          <dt class="col-sm-3">발급 가능한 월정기권 개수</dt>
          <dd class="col-9">{{ detailData.monthlyPassCnt | three_comma }}</dd>

          <dt class="col-sm-3">주차면 단위로 관리하는지 여부</dt>
          <dd class="col-9">{{ detailData.spaceWiseManaging }}</dd>

          <dt class="col-sm-3">운영시간 안내</dt>
          <dd class="col-9">{{ detailData.operationTimes | emptyCheck }}</dd>

          <dt class="col-sm-3">월정기권을 가진 차량만 주차 가능</dt>
          <dd class="col-9">{{ detailData.monthlyPassOnly }}</dd>

          <dt class="col-sm-3">현금 처리 버튼 노출 여부</dt>
          <dd class="col-9">{{ detailData.cashExposed }}</dd>

          <dt class="col-sm-3">경차 처리 버튼 노출 여부</dt>
          <dd class="col-9">{{ detailData.smallCarExposed }}</dd>

          <dt class="col-sm-3">대형 처리 버튼 노출 여부</dt>
          <dd class="col-9">{{ detailData.largeCarExposed }}</dd>

          <dt class="col-sm-3">주차 요금을 미납으로 처리할 수 있는지 여부</dt>
          <dd class="col-9">{{ detailData.unpayExposed  }}</dd>

          <dt class="col-sm-3">이전 미납 요금을 현 요금에 추가할 지 여부</dt>
          <dd class="col-9">{{ detailData.addPrevUnpayedAllowed }}</dd>

          <dt class="col-sm-3">캠핑차량 주차 허용</dt>
          <dd class="col-9">{{ detailData.camperAllowed  }}</dd>

          <dt class="col-sm-3">영수증에 근무자 이름을 표시</dt>
          <dd class="col-9">{{ detailData.workerOnReceipt }}</dd>

          <dt class="col-sm-3">공공 할인 발급 여부를 저장해 두는 기간</dt>
          <dd class="col-9">{{ detailData.pubDcCachingDays | emptyCheck }}</dd>

          <dt class="col-sm-3">수동으로 차단기 제어 명령을 내릴 때 반드시 사유를 적게 할</dt>
          <dd class="col-9">{{ detailData.memoWhenCmdOnGate  }}</dd>

          <dt class="col-sm-3">공무로 입차한 경우 공무 내용 기록 필요</dt>
          <dd class="col-9">{{ detailData.memoWhenOfficial }}</dd>

          <dt class="col-sm-3">운영 시간이 아닐 때 출차하는 차량에 대한 과금 처리 방식</dt>
          <dd class="col-9">{{ detailData.whenExitOnNoOperation_local | emptyCheck }}</dd>

          <dt class="col-sm-3">같은 번호의 이전 미출차 차량을 출차 처리하지 않고 그냥 두기</dt>
          <dd class="col-9">{{ detailData.ignorePrevNotExited }}</dd>

          <dt class="col-sm-3">handleNotExitedBefore 기간을 넘은 미출차 차량의 처리 방법</dt>
          <dd class="col-9">{{ detailData.handleNotExitedAs | emptyCheck }}</dd>

          <dt class="col-sm-3">handleNotExitedBefore 기간을 넘은 미출차 차량을 자동으로 처리할 시각</dt>
          <dd class="col-9">{{ detailData.handleNotExitedAt | emptyCheck }}</dd>

          <dt class="col-sm-3">며칠 동안 미출차 한 차량을 처리할 것인지 여부. 단위가 日임</dt>
          <dd class="col-9">{{ detailData.handleNotExitedBefore | emptyCheck }}</dd>

          <dt class="col-sm-3">만차시 입차 차단</dt>
          <dd class="col-9">{{ detailData.closeWhenFull | emptyCheck }}</dd>

          <dt class="col-sm-3">만차시 정기권 차량만 입출차</dt>
          <dd class="col-9">{{ detailData.passOnlyWhenFull }}</dd>

          <dt class="col-sm-3">실제 여부와 상관없이 만차로 설정</dt>
          <dd class="col-9">{{ detailData.fullForced }}</dd>

          <dt class="col-sm-3">모든 입출차에 100% 할인 쿠폰 일괄 적용</dt>
          <dd class="col-9">{{ detailData.freeForced }}</dd>

          <dt class="col-sm-3"> 무인 정산기 자동 리부팅 시각</dt>
          <dd class="col-9">{{ detailData.kioskRebooting | emptyCheck }}</dd>

          <dt class="col-sm-3">회차를 0원으로 결제처리한다. 출차 시간이 부여된다</dt>
          <dd class="col-9">{{ detailData.payZeroWhenQuickOut }}</dd>

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
