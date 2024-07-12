<script>
import Table_serverside from '~/components/datatable/Table_serverside.vue';
import PageLayout from "~/components/common/PageLayout";
import DiscountLimitDetail from "./detail.vue";
import ModalDiscountLimit from "./ModalDiscountLimit.vue";
import CommonModal from "@/components/common/Modal";
import list_default from "@/mixin/list_default";

export default {
	 mixins: [list_default],
	 components: {
		  ModalDiscountLimit,
		  DiscountLimitDetail,
		  Table_serverside,
		  PageLayout,
		  CommonModal,
	 },
	 data() {
		  return {
				title: "할인 제한",
				cu_modalName: 'ModalDiscountLimit',
				filters: {
					 clientId: '',
					 clientName: '',
					 page: 1
				},
				tableProperty: {
					 perPage: 50,
					 currentPage: 1,
					 fields: [

						  {key: "id", label: "아이디"},
						  {key: "client", label: "고객사"},
						  {key: "afterExit", label: "출차 후 재발급 가능 시간"},
						  {key: "monthsForCntPerCar", label: "차량별 발급 제한할 때 기준 월 수"},
						  {key: "maxCntPerCarInMonths", label: "monthsForCntPerCar개월 동안 발급할 수 있는 최대 할인 수"},
						  {key: "daysForCntPerCar", label: "차량별 발급 제한할 때 기준 일 수"},
						  {key: "maxCntPerCarInDays", label: "daysForCntPerCar일 동안 발급할 수 있는 최대 할인 수"},
						  {key: "maxCntPerCarOnWeek", label: "차량별로 요일마다 발급할 수 있는 최대 수"},
						  {key: "maxCntPerVisit", label: "방문별로 기간마다 최대 발급 수"},
						  {key: "maxTimePerVisit", label: "방문별로 기간마다 최대 할인 시간"},
						  {key: "maxAmtPerVisit", label: "방문별로 기간마다 최대 할인 금액"},
						  {key: "maxRatePerVisit", label: "방문별로 기간마다 최대 할인 비율"},
						  {key: "maxCmplCntPerVisit", label: "방문별로 무료로 입주사에게 제공되는 할인을 발급할 수 있는 최대 개수"},
						  {key: "maxCmplTimePerVisit", label: "방문별로 무료로 입주사에게 제공되는 할인을 발급할 수 있는 최대 시간"},
						  {key: "maxPvtCntForPub", label: "공공할인이 발행된 경우 발행할 수 있는 민간 할인 최대 개수"},
						  {key: "timetable", label: "주간 발급 가능 시간표"},
						  {key: "holiday", label: "휴일 발급 가능 시간표"},
						  {key: "created", label: "등록 일시", type: 'date'},
						  {key: "modified", label: "변경 일시", type: 'date'}

					 ],
					 excelName: '할인 제한'
				}
		  };
	 },
	 middleware: "authentication",
	 mounted() {
		  let vm = this;
	 },
	 computed: {},
	 methods: {
		  async getList(opt) {
				// opt 구성
				// page
				// perPage
				// filters
				let filters = opt.filters ? opt.filters : null;
				let payload = {
					 page: opt.page - 1,
					 size: opt.perPage,
					 clientId: filters.clientId,
					 clientName: filters.clientName,
					 sort: 'created,DESC'
				}

				return new Promise(async function (resolve, reject) {
					 try {


						  let res = await mainapi.invokeAPI_GET('/api/v1/discount-limits', payload)

						  if (res.data.code !== $const.ApiSuccessCode.GET) {
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

					 } catch (e) {
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
					 <button class="btn btn-dark" @click="show_CU_Modal">할인 제한 등록</button>
					 <ModalDiscountLimit ref="ref_ModalDiscountLimit" :callback="TableRefreshAfterChange"/>
				</div>
				<Table_serverside ref="ref_talble"
										:tableProperty="tableProperty" :filters="filters"
										:min-width="2000" :get-list="getList">
					 <template #filter>
						  <input type="text" v-model="filters.clientId" class="form-control" placeholder="고객사 UID"/>
						  <input type="text" v-model="filters.clientName" class="form-control"
									placeholder="고객사 이름"/>
					 </template>
					 <template #id="{data}">
						  <a href="#" @click.prevent="openDetail(data.item.id)">
								{{ data.value }}
						  </a>
					 </template>
					 <template #client="{data}">
						  {{ data.value | toGetName }}
					 </template>

				</Table_serverside>
		  </PageLayout>
		  <CommonModal ref="c_modal" :size="'xl'">
				<DiscountLimitDetail :current-id="current_id" :after-delete="TableRefreshAfterChange"/>
		  </CommonModal>
	 </div>
</template>

<style></style>
