<script>
import Table_serverside from '~/components/datatable/Table_serverside.vue';
import PageLayout from "~/components/common/PageLayout";

export default {
	 components: {
		  Table_serverside,
		  PageLayout
	 },
	 data() {
		  return {
				title: "요금제",
				pageLoading : false,
				filters : {
					 //필터 원형, 초기화를 위해
					 reservation: '',
					 daterange: {
						  startDate: '',
						  endDate: ''
					 },
					 orderid: '',
					 delvid: '',
					 shipnumber: '',
					 osts: '',
					 ptype: '',
					 pmtype: '',
					 shipmethod: '',
					 phone: '',
					 spoint: '',
					 epoint: '',
					 size: '',
					 bulk: '',
					 page: 1
				},
				tableProperty : {
					 perPage: 50,
					 currentPage: 1,
					 fields: [
						  {key: "created", label: "created"},
						  {key: "creatorId", label: "creatorId"},
						  {key: "creatorName", label: "creatorName"},
						  {key: "id", label: "id"},
						  {key: "modified", label: "modified"},
						  {key: "modifierId", label: "modifierId"},
						  {key: "modifierName", label: "modifierName"},
						  {key: "name", label: "name"},
						  {key: "phone", label: "phone"},
						  {key: "suspended", label: "suspended"},
						  {key: "type", label: "type"}
					 ],
					 excelName: '관리자'
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
					 page : opt.page-1,
					 size : opt.perPage
				}

				return new Promise(async function (resolve, reject) {
					 try{


						  let res = await mainapi.invokeAPI_GET('/api/v1/fee-plans', payload)

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
				<Table_serverside ref="ref_talble"
										:tableProperty="tableProperty" :filters="filters"
										:min-width="2000" :get-list="getList">
					 <template #filter>

					 </template>
					 <template #id="{data}">
						  <div style="color: blue; text-decoration: underline; cursor: pointer;">
								{{ data.value }}
						  </div>
					 </template>

				</Table_serverside>
		  </PageLayout>
	 </div>
</template>

<style></style>
