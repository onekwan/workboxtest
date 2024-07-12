<script>
import Table_serverside from '~/components/datatable/Table_serverside.vue';
import PageLayout from "~/components/common/PageLayout";
import ModalDiscountAccount from "./ModalDiscountAccount.vue";
import CommonModal from "@/components/common/Modal";
import PageDetail from './detail';
import list_default from "@/mixin/list_default";

export default {
      mixins : [list_default],
    components: {

        Table_serverside,
        PageLayout,
          ModalDiscountAccount,
        CommonModal,
        PageDetail
    },
    data() {
        return {
            title: "할인 계정",
              cu_modalName : 'ModalDiscountAccount',
            filters: {
                tenantId: '',
                  tenantName: '',
                  visitId: '',
                  discountId: '',
                  discountName : '',
                page: 1
            },
            tableProperty: {
                perPage: 50,
                currentPage: 1,
                  fields: [
                        {key: "id", label: "아이디"},
                        {key: "type", label: "유형"},
                        {key: "status", label: "상태"},
                        {key: "tenant", label: "입주사"},
                        {key: "reservation", label: "예약"},
                        {key: "visit", label: "방문"},
                        {key: "discount", label: "발급한 할인"},
                        {key: "points", label: "변동량"},
                        {key: "balance", label: "잔여량"},
                        {key: "monthlyPoints", label: "이달 사용 개수"},
                        {key: "created", label: "등록일",type:'date'}
                  ],
                excelName: '입주사'
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
                  tenantId: filters.tenantId,
                  discountId: filters.discountId,
                  tenantName: filters.tenantName,
                  discountName: filters.discountName,
                  visitId: filters.visitId,
                page: opt.page - 1,
                size: opt.perPage,
                sort: 'created,DESC'
            }

            return new Promise(async function (resolve, reject) {
                try {

                    let res = await mainapi.invokeAPI_GET('/api/v1/discount-accounts', payload)

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
                        <button class="btn btn-dark" @click="show_CU_Modal">할인 계정 등록</button>
                        <ModalDiscountAccount ref="ref_ModalDiscountAccount" :callback="TableRefreshAfterChange"/>
                  </div>
                  <Table_serverside ref="ref_talble"
                                    :tableProperty="tableProperty" :filters="filters"
                                    :min-width="2000" :get-list="getList">
                        <template #filter>
                              <input type="text" class="form-control" v-model="filters.tenantId" placeholder="입주사 ID"/>
                              <input type="text" class="form-control" v-model="filters.tenantName" placeholder="입주사 이름"/>
                              <input type="text" class="form-control" v-model="filters.discountId" placeholder="할인 ID"/>
                              <input type="text" class="form-control" v-model="filters.discountName" placeholder="할인 이름"/>
                              <input type="text" class="form-control" v-model="filters.visitId" placeholder="방문 ID"/>
                        </template>
                        <template #id="{data}">
                              <div style="color: blue; text-decoration: underline; cursor: pointer;"
                                   @click="openDetail(data.item.id)">
                                    {{ data.value }}
                              </div>
                        </template>
                        <template #type="{data}">
                              {{ passAccountType[data.value] }}
                        </template>
                        <template #points="{data}">
                              {{ data.value | three_comma }}
                        </template>
                        <template #balance="{data}">
                              {{ data.value | three_comma }}
                        </template>

                  </Table_serverside>
            </PageLayout>

            <CommonModal ref="c_modal" :size="'xl'">
                  <PageDetail :current-id="current_id" :after-delete="TableRefreshAfterChange"/>
            </CommonModal>
      </div>
</template>

<style></style>
