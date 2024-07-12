<script>
import Table_serverside from '~/components/datatable/Table_serverside.vue';
import PageLayout from "~/components/common/PageLayout";
import ModalDiscount from "./ModalDiscount";
import CommonModal from "@/components/common/Modal";
import DiscountDetail from '../list/detail';
import list_default from "@/mixin/list_default";

export default {
    mixins : [list_default],
	 components: {
		  Table_serverside,
		  PageLayout,
      ModalDiscount,
      CommonModal,
      DiscountDetail
	 },
	 data() {
		  return {
				title: "할인",
            cu_modalName : 'ModalDiscount',
				filters : {
            name: '',
            code: '',
            type: '',
            visitId: '',
            discountAccountId: '',
            clientId: '',
            clientName: '',
            mainZoneId: '',
            mainZoneName: '',
					  page: 1
				},
				tableProperty : {
					 perPage: 50,
					 currentPage: 1,
					 fields: [
                    {key: "carnum_local", label: "차량번호"},
					{key: "name", label: "이름"},
              {key: "code", label: "관리 코드"},
              {key: "visit_id_local", label: "방문 UID"},
              {key: "reservation", label: "예약"},
              {key: "discountAccountId", label: "발급 권원인 할인 계정 UID"},
              {key: "client", label: "할인을 제공하는 고객사"},
              {key: "mainZone", label: "기본 주차장"},
              {key: "autoApplied", label: "자동 발급 여부"},
              {key: "created", label: "등록일",type:'date'},
					 ],
					 excelName: '할인'
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
           name: filters.name,
           code: filters.code,
           type: filters.type,
           visitId: filters.visitId,
           discountAccountId: filters.discountAccountId,
           clientId: filters.clientId,
           clientName: filters.clientName,
           mainZoneId: filters.mainZoneId,
           mainZoneName: filters.mainZoneName,
           sort: 'created,DESC'
        }

				return new Promise(async function (resolve, reject) {
					 try{


						  let res = await mainapi.invokeAPI_GET('/api/v1/discounts', payload)

						  if(res.data.code !== $const.ApiSuccessCode.GET){
								tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg)
						  }

						  let data = res.data.data;

						  data.items.forEach(function (value) {
                              value.carnum_local =  value.visit && value.visit.carNumber ? value.visit.carNumber : '차량번호 없음';
                              value.visit_id_local = value.visit && value.visit.id ? value.visit.id : '방문 UID 없음';
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
		  },
      show_CU_Modal() {
        // this.$refs.ref_ModalDiscount.show();
      },
      TableRefreshAfterChange(deleteFlag) {
          if (deleteFlag) {
              this.$refs.c_modal.hide_modal();
          }
        this.$refs.ref_talble.refresh();
      },
      openDetail(userId) {
        this.current_id = userId;
        this.$refs.c_modal.show_modal();
      }
	 }
};
</script>

<template>
	 <div>
		  <PageLayout :title="title" :page-loading="pageLoading">
        <div class="mb-2">
<!--          <button class="btn btn-dark" @click="show_CU_Modal">할인 등록</button>-->
<!--          <ModalDiscount ref="ref_ModalDiscount" :callback="TableRefreshAfterChange"/>-->
        </div>
				<Table_serverside ref="ref_talble"
										:tableProperty="tableProperty" :filters="filters"
										:min-width="2000" :get-list="getList">
					 <template #filter>
              <input type="text" class="form-control" v-model="filters.name" placeholder="이름"/>
              <input type="text" class="form-control" v-model="filters.code" placeholder="관리코드"/>
             <select type="text" class="form-select" v-model="filters.type">
               <option value="">종류</option>
               <option v-for="(value, key) in discountType" :value="key" :key="key">{{ value }}</option>
             </select>
              <input type="text" class="form-control" v-model="filters.visitId" placeholder="방문 UID"/>
              <input type="text" class="form-control" v-model="filters.discountAccountId" placeholder="발급 권원인 할인 계정 UID"/>
              <input type="text" class="form-control" v-model="filters.clientId" placeholder="할인을 제공하는 고객사 ID"/>
              <input type="text" class="form-control" v-model="filters.clientName" placeholder="할인을 제공하는 고객사 이름"/>
              <input type="text" class="form-control" v-model="filters.mainZoneId" placeholder="기본 주차장 ID"/>
              <input type="text" class="form-control" v-model="filters.mainZoneName" placeholder="기본 주차장 이름"/>
					 </template>
					 <template #carnum_local="{data}">
                      <a href="#" @click.prevent="openDetail(data.item.id)">
                            {{ data.value }}
                      </a>
					 </template>
                  <template #client="{data}">
                        {{ data.value | toGetName }}
                  </template>
                  <template #mainZone="{data}">
                        {{ data.value | toGetName }}
                  </template>
                  <template #visit_id_local="{data}">
                        {{ data.value }}
                  </template>
                  <template #discountAccountId="{data}">
                        {{ data.value }}
                  </template>

                  <template #autoApplied="{data}">
                        {{ data.value ? '자동 발급' : 'X' }}
                  </template>
				</Table_serverside>
		  </PageLayout>

     <CommonModal ref="c_modal" :size="'xl'">
       <DiscountDetail :current-id="current_id" :after-delete="TableRefreshAfterChange"/>
     </CommonModal>
	 </div>
</template>

<style></style>
