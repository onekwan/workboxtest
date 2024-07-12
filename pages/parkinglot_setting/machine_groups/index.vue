<script>
import Table_serverside from '~/components/datatable/Table_serverside.vue';
import PageLayout from "~/components/common/PageLayout";
import CommonModal from "@/components/common/Modal";
import MachineGroupDetail from '../machine_groups/detail';
import ModalMachineGroups from "./ModalMachineGroups";
import list_default from "@/mixin/list_default";

export default {
    mixins : [list_default],
	 components: {
		  Table_serverside,
		  ModalMachineGroups,
		  PageLayout,
      CommonModal,
      MachineGroupDetail
	 },
	 data() {
		  return {
				title: "설비 그룹",
            cu_modalName : 'ModalMachineGroups',
				filters : {
					 name : '',
					 active : false
				},
				tableProperty : {
					 perPage: 50,
					 currentPage: 1,
					 fields: [
                    {key: "name", label: "이름"},
              {key: "created", label: "등록일",type:'date'},
              {key: "modified", label: "변경일",type:'date'},
					 ],
					 excelName: '설비 그룹'
				},
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
           name : filters.name,
					 sort : 'created,DESC'
				}

				return new Promise(async function (resolve, reject) {
					 try{

						  let res = await mainapi.invokeAPI_GET('/api/v1/machine-groups', payload)

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
					 <button class="btn btn-dark" @click="show_CU_Modal">설비 그룹 등록</button>
					 <ModalMachineGroups ref="ref_ModalMachineGroups" :callback="TableRefreshAfterChange" />
				</div>
				<Table_serverside ref="ref_talble"
										:tableProperty="tableProperty" :filters="filters"
										:min-width="2000" :get-list="getList">
					 <template #filter>
             <input type="text" v-model="filters.name" class="form-control" placeholder="이름"/>
					 </template>
					 <template #name="{data}">
                      <a href="#" @click.prevent="openDetail(data.item.id)">
                            {{ data.value }}
                      </a>
					 </template>

				</Table_serverside>
		  </PageLayout>

     <CommonModal ref="c_modal" :size="'xl'">
       <MachineGroupDetail :current-id="current_id" :after-delete="TableRefreshAfterChange"/>
     </CommonModal>
	 </div>
</template>

<style></style>
