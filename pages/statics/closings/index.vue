<script>
import Table_serverside from '~/components/datatable/Table_serverside.vue';
import PageLayout from "~/components/common/PageLayout";
import ModalClosings from "@/pages/statics/closings/ModalClosings.vue";
import CommonModal from "@/components/common/Modal";
import DetailPage from './detail';
import list_default from "@/mixin/list_default";


export default {
    mixins : [list_default],
	 components: {
		  Table_serverside,
		  PageLayout,
		  ModalClosings,
		  CommonModal,
		  DetailPage
	 },
	 data() {
		  return {
				title: "마감",
            cu_modalName : 'ModalClosings',
				filters : {
					 endDate : '',
					 workerName : '',
					 mainMachineId : '',
					 mainMachineName : '',
					 clientId : '',
					 clientName : '',
					 siteId : '',
					 siteName : '',
					 zoneId : '',
					 zoneName : '',
					 page: 1
				},
				tableProperty : {
					 perPage: 50,
					 currentPage: 1,
					 fields: [

						  {key: "id", label: "아이디"},
						  {key: "start", label: "집계 시작 일",type:'date'},
						  {key: "end", label: "집계 종료 일",type:'date'},
						  {key: "worker", label: "근무자"},
{key: "mainMachine", label: "主설비"},
{key: "client", label: "고객사"},
{key: "site", label: "주차 현장"},
{key: "zone", label: "주차장"},
{key: "totalPayCnt", label: "전체 결제 횟수"},
{key: "totalPayAmt", label: "전체 결제액"},
{key: "payFreeCnt", label: "무료 출차 횟수"},
{key: "totalDiscountCnt", label: "전체 할인 횟수"},
{key: "totalDiscountAmt", label: "전체 할인액"},
{key: "totalEnterCnt", label: "전체 입차 횟수"},
{key: "totalExitCnt", label: "전체 출차 횟수"},

{key: "created", label: "등록일",type:'date'},

{key: "modified", label: "변경일",type:'date'}

					 ],
					 excelName: '마감'
				}
		  };
	 },
	 middleware: "authentication",
	 mounted() {
		  let vm = this;
	 },
	 computed: {

	 },
	 methods: {
		  async getList(opt) {
				// opt 구성
				// page
				// perPage
				// filters
				let filters = opt.filters;
				let payload = {
                    endDate : filters.endDate,
					 						  workerName : filters.workerName,
					 						  mainMachineId : filters.mainMachineId,
					 						  mainMachineName : filters.mainMachineName,
					 						  clientId : filters.clientId,
					 						  clientName : filters.clientName,
					 						  siteId : filters.siteId,
					 						  siteName : filters.siteName,
					 						  zoneId : filters.zoneId,
					 						  zoneName : filters.zoneName,

					 page : opt.page-1,
					 size : opt.perPage
				}

				return new Promise(async function (resolve, reject) {
					 try{

						  let res = await mainapi.invokeAPI_GET('/api/v1/closings', payload)

						  if(res.data.code !== $const.ApiSuccessCode.GET){
								tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg)
						  }

						  let data = res.data.data;

						  data.items.forEach(function (value) {

						  })

						  resolve({
								data: data.items,
								totalCount: data.itemCnt,
								page: data.page + 1
						  });

					 }catch (e) {
						  tool_app.dialog_alert(e);
					 }

				});
		  }
	 }
};
</script>

<template>
	 <div>
		  <PageLayout :title="title" :page-loading="pageLoading">
              <div class="mb-2">
                    <button class="btn btn-dark" @click="show_CU_Modal">정기권 유형 등록</button>
                    <ModalClosings ref="ref_ModalClosings" :callback="TableRefreshAfterChange"/>
              </div>
				<Table_serverside ref="ref_talble"
										:tableProperty="tableProperty" :filters="filters"
										:min-width="2000" :get-list="getList">
					 <template #filter>
                      <date-picker v-model="filters.endDate" type="datetime" lang="ko"
                                   value-type="format" format="YYYY-MM-DDTHH:mm:ss" placeholder="집계 시작 일시"/>
							 <input type="text" v-model="filters.workerName" class="form-control" placeholder="근무자"/>
							 <input type="text" v-model="filters.mainMachineId" class="form-control" placeholder="主설비 UID"/>
							 <input type="text" v-model="filters.mainMachineName" class="form-control" placeholder="主설비 이름"/>
							 <input type="text" v-model="filters.clientId" class="form-control" placeholder="고객사 아이디"/>
							 <input type="text" v-model="filters.clientName" class="form-control" placeholder="고객사 이름"/>
							 <input type="text" v-model="filters.siteId" class="form-control" placeholder="사업장 아이디"/>
							 <input type="text" v-model="filters.siteName" class="form-control" placeholder="사업장 이름"/>
							 <input type="text" v-model="filters.zoneId" class="form-control" placeholder="주차장 아이디"/>
							 <input type="text" v-model="filters.zoneName" class="form-control" placeholder="주차장 이름"/>
					 </template>
					 <template #id="{data}">
						  <div style="color: blue; text-decoration: underline; cursor: pointer;">
								{{ data.value }}
						  </div>
					 </template>

				</Table_serverside>
		  </PageLayout>
          <CommonModal ref="c_modal" :size="'xl'">
                <DetailPage :current-id="current_id" :after-delete="TableRefreshAfterChange"/>
          </CommonModal>
	 </div>
</template>

<style></style>
