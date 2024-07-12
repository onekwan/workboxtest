<script>
import Table_serverside from '~/components/datatable/Table_serverside.vue';
import PageLayout from "~/components/common/PageLayout";
import CommonModal from "@/components/common/Modal";
import DiscountGroupDetail from '../groups/detail';
import ModalDiscountGroups from "./ModalDiscountGroups";
import list_default from "@/mixin/list_default";

export default {
    mixins : [list_default],
	 components: {
		  Table_serverside,
		  PageLayout,
      CommonModal,
      DiscountGroupDetail,
      ModalDiscountGroups
	 },
	 data() {
		  return {
				title: "할인 속성 그룹",
            cu_modalName : 'ModalDiscountGroups',
				filters : {
					maxCntPerVisit: '',
          maxValPerVisit: '',
          maxCntInDay: '',
          maxValInDay: '',
				},
				tableProperty : {
					 perPage: 50,
					 currentPage: 1,
					 fields: [
							 {key: "id", label: "아이디"},
							 {key: "maxCntPerVisit", label: "방문당 대상 할인 유형들의 최대 발급 개수"},
							 {key: "maxValPerVisit", label: "방문당 대상 할인 유형들의 최대값"},
							 {key: "maxCntInDay", label: "차량당 1일 대상 할인 유형들의 최대 발급 개수"},
							 {key: "maxValInDay", label: "차량당 1일 대상 할인 유형들의 최대값"},
							 {key: "created", label: "등록일",type:'date'},
							 {key: "modified", label: "변경일",type:'date'},
					 ],
					 excelName: '할인 속성 그룹'
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
        let filters = opt.filters ? opt.filters : null;
				let payload = {
					 page : opt.page-1,
           size : opt.perPage,
            maxCntPerVisit: filters.maxCntPerVisit,
            maxValPerVisit: filters.maxValPerVisit,
            maxCntInDay: filters.maxCntInDay,
            maxValInDay: filters.maxValInDay,
            sort: 'created,DESC'
				}

				return new Promise(async function (resolve, reject) {
					 try{


						  let res = await mainapi.invokeAPI_GET('/api/v1/discount-groups', payload)

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
          <button class="btn btn-dark" @click="show_CU_Modal">할인 속성 그룹 등록</button>
          <ModalDiscountGroups ref="ref_ModalDiscountGroups" :callback="TableRefreshAfterChange"/>
        </div>
				<Table_serverside ref="ref_talble"
										:tableProperty="tableProperty" :filters="filters"
										:min-width="2000" :get-list="getList">
					 <template #filter>
             <input type="text" class="form-control" v-model="filters.maxCntPerVisit" placeholder="방문당 대상 할인 유형들의 최대 발급 개수"/>
             <input type="text" class="form-control" v-model="filters.maxValPerVisit" placeholder="방문당 대상 할인 유형들의 최대값"/>
             <input type="text" class="form-control" v-model="filters.maxCntInDay" placeholder="차량당 1일 대상 할인 유형들의 최대 발급 개수"/>
             <input type="text" class="form-control" v-model="filters.maxValInDay" placeholder="차량당 1일 대상 할인 유형들의 최대값"/>
					 </template>
					 <template #id="{data}">
             			<span style="color: blue; text-decoration: underline; cursor: pointer;" @click="openDetail(data.value)">
								{{ data.value }}
						  </span>

					 </template>
				</Table_serverside>
		  </PageLayout>
     <CommonModal ref="c_modal" :size="'xl'">
       <DiscountGroupDetail :current-id="current_id" :after-delete="TableRefreshAfterChange"/>
     </CommonModal>
	 </div>
</template>

<style></style>
