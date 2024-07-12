<script>
import Table_serverside from '~/components/datatable/Table_serverside.vue';
import PageLayout from "~/components/common/PageLayout";
import CommonModal from "@/components/common/Modal";
import PassGroupDetail from '../groups/detail';
import ModalPassesGroups from "./ModalPassesGroups";
import PassDetail from "../list/detail.vue";
import list_default from "@/mixin/list_default";

export default {
    mixins : [list_default],
	 components: {
        PassDetail,
		  Table_serverside,
		  PageLayout,
		  CommonModal,
		  PassGroupDetail,
		  ModalPassesGroups
	 },
	 data() {
		  return {
				title: "정기권 속성 그룹",
            cu_modalName : 'ModalPassesGroups',
				filters: {
					 name : '',
					 autoRefill : '',
					 page: 1
				},
				tableProperty: {
					 perPage: 50,
					 currentPage: 1,
					 fields: [
                    {key: "name", label: "그룹명"},
						  {key: "autoRefill", label: "정기권 계정 자동 충전 방식."},
						  {key: "refillPoints", label: "자동 충전량(분)", tdClass: 'text-right'},
						  {key: "enterMsg", label: "입차 메시지"},
						  {key: "exitMsg", label: "출차 메시지"},
						  {key: "created", label: "생성일",type:'date'},
						  {key: "modified", label: "수정일",type:'date'}
					 ],
					 excelName: '관리자'
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
				let filters = opt.filters;
				let payload = {
					 page: opt.page - 1,
					 size: opt.perPage,
					 sort: 'created,DESC',
					 name : filters.name,
					 autoRefill : filters.autoRefill
				}

				return new Promise(async function (resolve, reject) {
					 try {


						  let res = await mainapi.invokeAPI_GET('/api/v1/pass-groups', payload)

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
					 <button class="btn btn-dark" @click="show_CU_Modal">정기권 속성 그룹 등록</button>
					 <ModalPassesGroups ref="ref_ModalPassesGroups" :callback="TableRefreshAfterChange"/>
				</div>
				<Table_serverside ref="ref_talble"
										:tableProperty="tableProperty" :filters="filters"
										:min-width="2000" :get-list="getList">
					 <template #filter>
                      <input class="form-control" v-model="filters.name" placeholder="정기권 그룹 이름"/>
							 <select class="form-select" v-model="filters.autoRefill">
								<option value="">자동 충전 방식</option>
								<option v-for="(value, key) in passAutoRefill" :value="key" :key="key">{{ value }}</option>
							</select>

					 </template>
					 <template #name="{data}">
                      <a href="#" @click.prevent="openDetail(data.item.id)">
                            {{ data.value }}
                      </a>
					 </template>

                  <template #autoRefill="{data}">
                        {{ passAutoRefill[data.value] }}
                  </template>


                  <template #refillPoints="{data}">
                        {{ data.value | three_comma }}
                  </template>
				</Table_serverside>
		  </PageLayout>

		  <CommonModal ref="c_modal" :size="'xl'">
				<PassGroupDetail :current-id="current_id" :after-delete="TableRefreshAfterChange"/>
		  </CommonModal>
	 </div>
</template>

<style></style>
