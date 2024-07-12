<script>
import Table_serverside from '~/components/datatable/Table_serverside.vue';
import PageLayout from "~/components/common/PageLayout";
import ModalOrders from "./ModalOrders.vue";
import CommonModal from "@/components/common/Modal";
import detailPage from './detail';
import list_default from "@/mixin/list_default";

export default {
      mixins : [list_default],
    components: {
        Table_serverside,
        PageLayout,
        ModalOrders,
        CommonModal,
        detailPage
    },
    data() {
        return {
            title: "정기권/할인 구매",
              cu_modalName : 'ModalOrders',
            filters: {
                type: '',
                productId: '',
                ordererId: '',
                page: 1
            },
            tableProperty: {
                perPage: 50,
                currentPage: 1,
                fields: [
                    {key: "carNumber", label: "차량 번호"},
                      {key: "type", label: "상품 유형"},
                      {key: "qty", label: "주문 개수", tdClass: 'text-right'},
                      {key: "price", label: "주문액", tdClass: 'text-right'},
                      {key: "product", label: "상품명"},
                      {key: "orderer", label: "주문 입주사"},
                      {key: "created", label: "등록일",type:'date'}
                ],
                excelName: '정기권'
            },
            pageType: ''
        };
    },
    middleware: "authentication",
    mounted() {
        let vm = this;
    },
    created() {
        this.pageType = this.$route.params.type;


        if (this.$route.params.type === 'tenant' ) {
            this.pageType = 'tenant';
            this.title = '주문 내역';

            this.tableProperty.fields = this.tableProperty.fields.filter(function (value) {
                return value.key !== 'id';
            });

        } else {
            this.pageType = 'admin';
        }

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
                type: filters.type,
                productId: filters.productId,
                ordererId: filters.ordererId
            }

            return new Promise(async function (resolve, reject) {
                try {
                    let res = await mainapi.invokeAPI_GET('/api/v1/orders', payload)

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
                  <div class="mb-2" v-if="pageType==='admin'">
                        <button class="btn btn-dark" @click="show_CU_Modal">주문 등록</button>
                        <ModalOrders ref="ref_ModalOrders" :callback="TableRefreshAfterChange"/>
                  </div>
                  <Table_serverside ref="ref_talble"
                                    :tableProperty="tableProperty" :filters="filters"
                                    :min-width="2000" :get-list="getList">
                        <template #filter>
                              <select class="form-select" v-model="filters.type">
                                    <option value="">상품 유형</option>
                                    <option v-for="(name, key) in productType" :value="key" :key="key">{{ name }}</option>
                              </select>
                              <input class="form-control" v-model="filters.productId" placeholder="상품 ID"/>
                              <input class="form-control" v-model="filters.ordererId" placeholder="주문 입주사 ID"/>
                        </template>
                        <template #carNumber="{data}">
                              <a href="#" @click.prevent="openDetail(data.item.id)">
                                    {{ data.value ? data.value : '할인권' }}
                              </a>
                        </template>
                        <template #type="{data}">
                              {{ productType[data.value] }}
                        </template>
                        <template #product="{data}">
                              {{ data.value | toGetName }}
                        </template>
                        <template #orderer="{data}">
                              {{ data.value | toGetName }}
                        </template>
                        <template #id="{data}">
                              {{ data.value }}
                        </template>
                        <template #qty="{data}">
                              {{ data.value | three_comma }} 개
                        </template>
                        <template #price="{data}">
                              {{ data.value | three_comma }} 원
                        </template>
                  </Table_serverside>
            </PageLayout>
            <CommonModal ref="c_modal" :size="'xl'">
                  <detailPage :current-id="current_id" :after-delete="TableRefreshAfterChange" :page-type="pageType"/>
            </CommonModal>
      </div>
</template>

<style></style>
