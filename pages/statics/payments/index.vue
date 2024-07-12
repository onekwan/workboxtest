<script>
import Table_serverside from '~/components/datatable/Table_serverside.vue';
import PageLayout from "~/components/common/PageLayout";
import ModalPayment from "./ModalPayment.vue";
import CommonModal from "@/components/common/Modal";
import paymentDetail from './detail';
import detailPage from "@/pages/tenants/orders/detail.vue";
import list_default from "@/mixin/list_default";

export default {
      mixins : [list_default],
    components: {
          detailPage,
        Table_serverside,
        PageLayout,
        ModalPayment,
        CommonModal,
        paymentDetail
    },
    data() {
        return {
            title: "결제",
              cu_modalName : 'ModalPayment',
            filters: {
                name: '',
                clientId: '',
                clientName: '',
                zoneId: '',
                zoneName: '',
                page: 1
            },
            tableProperty: {
                perPage: 50,
                currentPage: 1,
                fields: [
                    {key: "name", label: "이름"},
                      {key: "client", label: "고객사"},
                      {key: "mainZone", label: "주차장"},
                      {key: "billedAmt", label: "결제액", tdClass: 'text-right'},
                      {key: "payedAmt", label: "실제 결제액", tdClass: 'text-right'},
                      {key: "payMethod", label: "결제 수단"},
                      {key: "payMethodNo", label: "결제 수단 번호"},
                      {key: "authCode", label: "결제 승인 번호"},
                      {key: "payed", label: "결제 일시"},
                      {key: "authDate", label: "결제 승인"},
                      {key: "payMachine", label: "결제 설비"},
                      {key: "created", label: "등록일",type:'date'}
                ],
                excelName: '결제'
            },
              pageType : ''
        };
    },
    middleware: "authentication",
    mounted() {
        let vm = this;
    },
    created() {
        this.pageType = this.$route.params.type;

        if (this.$route.params.type === 'tenant') {
            this.pageType = 'tenant';
            this.title = '결제 내역';
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
                  sort: 'payed,DESC',
                name: filters.name,
                clientId: filters.clientId,
                clientName: filters.clientName,
                zoneId: filters.zoneId,
                zoneName: filters.zoneName
            }

            return new Promise(async function (resolve, reject) {
                try {
                    let res = await mainapi.invokeAPI_GET('/api/v1/product-payments', payload)

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
                        <button class="btn btn-dark" @click="show_CU_Modal">결제 등록</button>
                        <ModalPayment ref="ref_ModalPayment" :callback="TableRefreshAfterChange"/>
                  </div>
                  <Table_serverside ref="ref_talble"
                                    :tableProperty="tableProperty" :filters="filters"
                                    :min-width="2000" :get-list="getList">
                        <template #filter>
                              <input class="form-control" v-model="filters.name" placeholder="아이디"/>
                              <input class="form-control" v-model="filters.clientId" placeholder="고객사 아이디"/>
                              <input class="form-control" v-model="filters.clientName" placeholder="고객사 이름"/>
                              <input class="form-control" v-model="filters.zoneId" placeholder="주차장 아이디"/>
                              <input class="form-control" v-model="filters.zoneName" placeholder="주차장 이름"/>
                        </template>
                        <template #name="{data}">
                              <a href="#" @click.prevent="openDetail(data.item.id)">
                                    {{ data.value }}
                              </a>
                        </template>
                        <template #type="{data}">
                              {{ productType[data.value] }}
                        </template>
                        <template #payMethod="{data}">
                              {{ payMethods[data.value] }}
                        </template>
                        <template #client="{data}">
                              {{ data.value | toGetName }}
                        </template>
                        <template #mainZone="{data}">
                              {{ data.value | toGetName }}
                        </template>
                        <template #billedAmt="{data}">
                              {{ data.value | three_comma }} 원
                        </template>
                        <template #payedAmt="{data}">
                              {{ data.value | three_comma }} 원
                        </template>

                        <template #authDate="{data}">
                              {{ data.value | DateFormatDash }} {{ data.item.authTime | TimeFormatColon }}
                        </template>
                  </Table_serverside>
            </PageLayout>
            <CommonModal ref="c_modal" :size="'xl'">
                  <paymentDetail :current-id="current_id" :after-delete="TableRefreshAfterChange" :page-type="pageType"/>
            </CommonModal>
      </div>
</template>

<style></style>
