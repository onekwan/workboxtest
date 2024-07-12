<script>
import PageLayout from "~/components/common/PageLayout";
import ModalZone_groups from "./ModalZone_groups.vue";
import CopyUrl from "~/components/common/CopyUrl";
import detail_default from "@/mixin/detail_default";
import AttachList from "../../../components/common/AttachList.vue";
import ModalAddZone from "./ModalAddZone.vue";

export default {
  mixins: [detail_default],
  components: {
    ModalZone_groups,
    PageLayout,
    CopyUrl,
		AttachList,
		ModalAddZone
  },
  data() {
    return {
      title: "주차장 그룹 상세정보",
      cu_modalName: 'ModalZone_groups',
      apiPath: '/api/v1/zone-groups/',
      deleteMsgTitle: '주차장 그룹'
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
		async addZone(){
			 this.$refs['ref_ModalAddZone'].show();
		},
		async deleteZone(id){
			// 삭제할거냐고 물어본 후 확인 누르면 진행하기
			 let cf = await tool_app.confirm(`주차장을 삭제하시겠습니까?`);
			 if (!cf.isConfirmed) return false;

			 try {
				  let payload = {
						zoneIdList: [id]
				  }
				  const res = await mainapi.invokeAPI(`/api/v1/zone-groups/${this.detailData.id}/detach`, payload, 'POST')
				  if (res.data.code !== $const.ApiSuccessCode.PUT) {
						tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg)
				  } else {
						tool_app.dialog_success('주차장 그룹 삭제가 완료되었습니다.');
						this.getDetail();
				  }
			 } catch (e) {
				  tool_app.dialog_alert(e);
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
        <ModalZone_groups ref="ref_ModalZone_groups" :page-data="detailData" mode="edit"
                    :callback="refreshAfterChange"/>
			 		  <ModalAddZone ref="ref_ModalAddZone" :page-data="detailData" :callback="refreshAfterChange"/>
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

          <dt class="col-sm-3">고객사</dt>
          <dd class="col-9">
            <link-page :type="'clientDetail'" :linked="detailData.client"/>
          </dd>

          <dt class="col-sm-3">주차장 목록</dt>
          <dd class="col-9">
<!--            <link-page :type="'zoneGroupDetail'" :linked="detailData.zoneGroup"/>-->
				  <AttachList :list="detailData.zones" :addFunc="addZone" :delFunc="deleteZone" />
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
