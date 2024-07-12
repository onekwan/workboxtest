<script>
import Table_serverside from '~/components/datatable/Table_serverside.vue';
import PageLayout from "~/components/common/PageLayout";
import ModalDiscountProducts from "./ModalDiscountProducts";
import CommonModal from "@/components/common/Modal";
import DiscountProductsDetail from './detail.vue'
import list_default from "@/mixin/list_default";


export default {
    mixins : [list_default],
	 components: {
		  Table_serverside,
		  PageLayout,
		  ModalDiscountProducts,
      CommonModal,
      DiscountProductsDetail
	 },
	 data() {
		  return {
				title: "할인권 상품",
            cu_modalName : 'ModalDiscountProducts',
				filters : {
           name: '',
           code: '',
           discountFormId: '',
           orderCnt: '',
           orderStart: '',
           orderEnd: '',
					 page: 1
				},
				tableProperty : {
					 perPage: 50,
					 currentPage: 1,
					 fields: [
              {key: "name", label: "이름"},
              {key: "code", label: "관리 코드"},
              {key: "discountForm", label: "할인권 유형"},

              {key: "approvalRequired", label: "구매 승인 필요 여부"},
              {key: "unitPrice", label: "단가", tdClass: 'text-right'},
              {key: "totalQuota", label: "전체 구매 가능량", tdClass: 'text-right'},
              {key: "tenantMaxQuota", label: "입주사 별 최대 구매 개수", tdClass: 'text-right'},
              {key: "orderMaxQuota", label: "주문 별 최대 구매 개수", tdClass: 'text-right'},
              {key: "orderCnt", label: "주문 개수", tdClass: 'text-right'},
              {key: "orderStart", label: "구매 시작 일시"},
              {key: "orderEnd", label: "구매 종료 일시"},
                    {key: "description", label: "설명"},
                    {key: "created", label: "생성일",type:'date'},
                    {key: "modified", label: "수정일",type:'date'}
					 ],
					 excelName: '할인권 상품'
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
				let filters = opt.filters;
				let payload = {
					 page: opt.page - 1,
					 size: opt.perPage,
           name: filters.name,
           code: filters.code,
           discountFormId: filters.discountFormId,
           orderCnt: filters.orderCnt,
           orderStart: filters.orderStart,
           orderEnd: filters.orderEnd,
					 sort: 'created,DESC'
				}

				return new Promise(async function (resolve, reject) {
					 try{


						  let res = await mainapi.invokeAPI_GET('/api/v1/discount-products', payload)

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
		  },
		  show_CU_Modal() {
				this.$refs.ref_ModalPassProducts.show();
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
					 <button class="btn btn-dark" @click="show_CU_Modal">할인 상품 등록</button>
					 <ModalDiscountProducts ref="ref_ModalPassProducts" :callback="TableRefreshAfterChange"/>
				</div>
				<Table_serverside ref="ref_talble"
										:tableProperty="tableProperty" :filters="filters"
										:min-width="2000" :get-list="getList">
					 <template #filter>
              <input type="text" v-model="filters.name" class="form-control" placeholder="이름"/>
              <input type="text" v-model="filters.code" class="form-control" placeholder="관리 코드"/>
              <input type="text" v-model="filters.discountFormId" class="form-control" placeholder="할인권 유형"/>
              <input type="text" v-model="filters.orderCnt" class="form-control" placeholder="주문 개수"/>
             <date-picker v-model="filters.orderStart" type="datetime" lang="ko"
               value-type="format" format="YYYY-MM-DDTHH:mm:ss" placeholder="구매 시작 일시"/>
             <date-picker v-model="filters.orderEnd" type="datetime" lang="ko"
               value-type="format" format="YYYY-MM-DDTHH:mm:ss" placeholder="구매 종료 일시"/>
					 </template>
					 <template #name="{data}">
                      <a href="#" @click.prevent="openDetail(data.item.id)">
                            {{ data.value }}
                      </a>
					 </template>
                  <template #discountForm="{data}">
                        {{ data.value | toGetName }}
                  </template>

                  <template #unitPrice="{data}">
                        {{ data.value | three_comma }} 원
                  </template>

                  <template #totalQuota="{data}">
                        {{ data.value | three_comma }}
                  </template>

                  <template #tenantMaxQuota="{data}">
                        {{ data.value | three_comma }}
                  </template>

                  <template #orderMaxQuota="{data}">
                        {{ data.value | three_comma }}
                  </template>

                  <template #approvalRequired="{data}">
                        {{ data.value ? '승인 필요' : 'X' }}
                  </template>

				</Table_serverside>
		  </PageLayout>

     <CommonModal ref="c_modal" :size="'xl'">
       <DiscountProductsDetail :current-id="current_id" :after-delete="TableRefreshAfterChange"/>
     </CommonModal>
	 </div>
</template>

<style></style>
