<script>
import PageLayout from "~/components/common/PageLayout";
import ModalTenants from "./ModalTenants";
import CopyUrl from "~/components/common/CopyUrl";
import detail_default from "@/mixin/detail_default";



export default {
  mixins: [detail_default],
  components: {
    PageLayout,
    ModalTenants,
    CopyUrl
  },
  data() {
    return {
      title: "입주사 상세정보",
      cu_modalName: 'ModalTenants',
      apiPath: '/api/v1/tenants/',
      deleteMsgTitle: '입주사',
		  api_active_flag : false
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
    },
		async toggleActive(){
			 if (this.api_active_flag) {
				  tool_app.dialog_alert("데이터 전송중입니다.");
				  return;
			 }

			 this.api_active_flag = true;

			 let payLoad = {
				  suspended: this.detailData.suspended === null ? moment().format("YYYY-MM-DD HH:mm:ss") : null
			 };
			 payLoad.fields = ['suspended'];

			 let msg = this.detailData.suspended === null ? '비활성화' : '활성화';
			 try {
				  let url = '/api/v1/tenants/' + this.detailData.id;

				  let res = await mainapi.invokeAPI(url, payLoad, 'PATCH');

				  let successCode = $const.ApiSuccessCode.PATCH;
				  if (res.data.code !== successCode) {
						throw res.data.msg;
						return false;
				  }

				  this.api_active_flag = false;
				  this.getDetail();
				  tool_app.dialog_success(`입주사 ${msg}가 완료되었습니다.`);
			 } catch (e) {
				  tool_app.log(e)
				  tool_app.dialog_alert(`입주사 ${msg}에 실패하였습니다.` + "<br/>" + e.msg ? e.msg : e);
			 } finally {
				  this.api_active_flag = false;
			 }
		}
  }
};
</script>

<template>
  <PageLayout :title="title" :page-loading="pageLoading">
    <b-row>
      <b-col cols="8">
        <button class="btn btn-warning" @click="show_CU_Modal">수정</button>
        <ModalTenants ref="ref_ModalTenants" :page-data="detailData" mode="edit"
                       :callback="refreshAfterChange"/>
        <SpinnerButton :loading="api_delete_flag" @click="deleteDetail" variant="danger">삭제
        </SpinnerButton>
			 <SpinnerButton :loading="api_active_flag" @click="toggleActive" :variant="detailData.suspended === null ? 'warning' : 'info'">
				  {{ detailData.suspended === null ? '비활성화' : '활성화' }}
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

          <dt class="col-sm-3">전화번호</dt>
          <dd class="col-9">{{ detailData.phone_local  | emptyCheck}}</dd>

          <dt class="col-sm-3">사업장</dt>
          <dd class="col-9">
            <link-page :type="'siteDetail'" :linked="detailData.site"/>
          </dd>

          <dt class="col-sm-3">동(건물)</dt>
          <dd class="col-9">{{ detailData.building | emptyCheck }}</dd>

          <dt class="col-sm-3">방 번호</dt>
          <dd class="col-9">{{ detailData.room | emptyCheck }}</dd>

          <dt class="col-sm-3">속해 있는 입주사 그룹</dt>
          <dd class="col-9">
            <link-page :type="'tenantGroupDetail'" :linked="detailData.tenantGroups"/>
          </dd>

          <dt class="col-sm-3">입주사에게 적용된 할인 제한</dt>
          <dd class="col-9">{{ detailData.discountLimitId | emptyCheck }}</dd>

          <dt class="col-sm-3">사용 정지된 일시</dt>
          <dd class="col-9">{{ detailData.suspended  | emptyCheck}}</dd>

				<dt class="col-sm-3">등록자</dt>
				<dd class="col-9">
					 <link-page :type="'userDetail'" :linked="{id:detailData.creatorId,name:detailData.creatorName}"/>
				</dd>

          <dt class="col-sm-3">등록 일시</dt>
          <dd class="col-9">{{ detailData.created  | emptyCheck}}</dd>

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
