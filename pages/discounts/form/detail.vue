<script>
import PageLayout from "~/components/common/PageLayout";
import ModalDiscountForm from "./ModalDiscountForm";
import CopyUrl from "~/components/common/CopyUrl";
import detail_default from "@/mixin/detail_default";

export default {
   mixins: [detail_default],
  components: {
    PageLayout,
    ModalDiscountForm,
    CopyUrl
  },
  data() {
    return {
      title: "할인 유형 상세정보",
      cu_modalName: 'ModalDiscountForm',
      apiPath: '/api/v1/discount-forms/',
      deleteMsgTitle : '할인 유형'
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
      data.type_local = data.type ? this.passType[data.type] : '';
      data.sector_local = data.sector ? this.discountSector[data.sector] : '';
      data.autoRefill_local = data.autoRefill ? this.passAutoRefill[data.autoRefill] : ''

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
        <ModalDiscountForm ref="ref_ModalDiscountForm" :page-data="detailData" mode="edit"
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

          <dt class="col-sm-3">이름</dt>
          <dd class="col-9">{{ detailData.name | emptyCheck }}</dd>

          <dt class="col-sm-3">관리 코드</dt>
          <dd class="col-9">{{ detailData.code | emptyCheck }}</dd>

          <dt class="col-sm-3">종류</dt>
          <dd class="col-9">{{ detailData.type_local | emptyCheck }}</dd>

          <dt class="col-sm-3">구매액에 따른 할인</dt>
          <dd class="col-9">{{ detailData.bundle | emptyCheck }}</dd>

          <dt class="col-sm-3">할인 유형을 특정하는 패턴</dt>
          <dd class="col-9">{{ detailData.pattern | emptyCheck }}</dd>

          <dt class="col-sm-3">부문</dt>
          <dd class="col-9">{{ detailData.sector_local | emptyCheck }}</dd>

          <dt class="col-sm-3">고객사에게 무료로 제공되는지 여부</dt>
          <dd class="col-9">{{ detailData.free | emptyCheck }}</dd>

          <dt class="col-sm-3">적용 방식</dt>
          <dd class="col-9">{{ detailData.method_local | emptyCheck }}</dd>

          <dt class="col-sm-3">할인 값1</dt>
          <dd class="col-9">{{ detailData.val | emptyCheck }}</dd>

          <dt class="col-sm-3">할인 값2</dt>
          <dd class="col-9">{{ detailData.val2 | emptyCheck }}</dd>

          <dt class="col-sm-3">추가 할인</dt>
          <dd class="col-9">{{ detailData.bonus | emptyCheck }}</dd>

          <dt class="col-sm-3">포인트형 옵션</dt>
          <dd class="col-9">
				  <pretty-json :text="detailData.keys" />
			 </dd>


          <dt class="col-sm-3">할인 제한 UID</dt>
          <dd class="col-9">{{ detailData.discountLimitId | emptyCheck }}</dd>

          <dt class="col-sm-3">권장 판매 가격</dt>
          <dd class="col-9">{{ detailData.price | emptyCheck }}</dd>

          <dt class="col-sm-3">1회분의 충전량</dt>
          <dd class="col-9">{{ detailData.refillAmt | emptyCheck }}</dd>

          <dt class="col-sm-3">자동 충전 방식</dt>
          <dd class="col-9">{{ detailData.autoRefill_local | emptyCheck }}</dd>

          <dt class="col-sm-3">할인을 제공하는 고객사</dt>
          <dd class="col-9">
            <link-page :type="'clientDetail'" :linked="detailData.client"/>
          </dd>

          <dt class="col-sm-3">기본 주차장</dt>
          <dd class="col-9">
            <link-page :type="'zoneDetail'" :linked="detailData.mainZone"/>
          </dd>

          <dt class="col-sm-3">적용 가능한 주차장 그룹</dt>
          <dd class="col-9">

            <link-page :type="'zoneGroupDetail'" :linked="detailData.zoneGroup"/>
          </dd>

          <dt class="col-sm-3">부가 사항</dt>
          <dd class="col-9">{{ detailData.details | emptyCheck}}</dd>

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
