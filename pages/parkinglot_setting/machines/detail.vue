<script>
import PageLayout from "~/components/common/PageLayout";
import ModalMachines from "./ModalMachines";
import CopyUrl from "~/components/common/CopyUrl";
import detail_default from "@/mixin/detail_default";


export default {
  mixins: [detail_default],
  components: {
    PageLayout,
    ModalMachines,
    CopyUrl
  },
  data() {
    return {
      title: "설비 상세정보",
      cu_modalName: 'ModalMachines',
      apiPath: '/api/v1/machines/',
      deleteMsgTitle: '설비'
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
      data.type_local = $const.machineType[data.type];
      data.status_local = $const.machineStatus[data.status];

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
        <ModalMachines ref="ref_ModalMachines" :page-data="detailData" mode="edit"
                               :callback="refreshAfterChange"/>
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

          <dt class="col-sm-3">유형</dt>
          <dd class="col-9">{{ detailData.type_local | emptyCheck }}</dd>

          <dt class="col-sm-3">관리 코드</dt>
          <dd class="col-9">{{ detailData.code | emptyCheck }}</dd>

          <dt class="col-sm-3">주차 사업장</dt>
          <dd class="col-9">
            <link-page :type="'siteDetail'" :linked="detailData.site"/>
          </dd>

          <dt class="col-sm-3">설비가 설치된 주차장</dt>
          <dd class="col-9">
            <link-page :type="'zoneDetail'" :linked="detailData.zone"/>
          </dd>

          <dt class="col-sm-3">유지보수사</dt>
          <dd class="col-9">
            <link-page :type="'maintainerDetail'" :linked="detailData.maintainer"/>
          </dd>

          <dt class="col-sm-3">모델(버전)</dt>
          <dd class="col-9">{{ detailData.model | emptyCheck }}</dd>

          <dt class="col-sm-3">설비 제어 방식</dt>
          <dd class="col-9">{{ detailData.protocol | emptyCheck }}</dd>

          <dt class="col-sm-3">설비 상태</dt>
          <dd class="col-9">{{ detailData.status_local | emptyCheck }}</dd>

          <dt class="col-sm-3">마지막 상태 체크 일시</dt>
          <dd class="col-9">{{ detailData.statusChecked | emptyCheck }}</dd>

          <dt class="col-sm-3">위도</dt>
          <dd class="col-9">{{ detailData.lat | emptyCheck }}</dd>

          <dt class="col-sm-3">경도</dt>
          <dd class="col-9">{{ detailData.lon | emptyCheck }}</dd>

          <dt class="col-sm-3">설비에 장착된 장치</dt>
          <dd class="col-9">
				  <pretty-json :text="detailData.devices" />
			 </dd>

          <dt class="col-sm-3">부가 사항</dt>
          <dd class="col-9">
				  <pretty-json :text="detailData.details" />
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
