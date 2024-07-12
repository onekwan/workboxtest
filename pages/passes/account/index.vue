<script>
import Table_serverside from '~/components/datatable/Table_serverside.vue';
import PageLayout from "~/components/common/PageLayout";
import ModalPassAccount from "./ModalPassAccount.vue";
import CommonModal from "@/components/common/Modal";
import PageDetail from './detail';
import ManagersDetail from "../../managers/list/detail.vue";
import list_default from "@/mixin/list_default";

export default {
      mixins : [list_default],
    components: {
          ManagersDetail,
        Table_serverside,
        PageLayout,
        ModalPassAccount,
        CommonModal,
        PageDetail
    },
    data() {
        return {
            title: "정기권 계정",
              cu_modalName : 'ModalPassAccount',
            filters: {
                tenantId: '',
                passId: '',
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
                      {key: "pass", label: "정기권"},
                      {key: "points", label: "변동량", tdClass: 'text-right'},
                      {key: "balance", label: "잔여량", tdClass: 'text-right'},
                      {key: "created", label: "등록일",type:'date'},
                      {key: "modified", label: "변경일",type:'date'}
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
                  passId: filters.passId,
                page: opt.page - 1,
                size: opt.perPage,
                sort: 'created,DESC'
            }

            return new Promise(async function (resolve, reject) {
                try {

                    let res = await mainapi.invokeAPI_GET('/api/v1/pass-accounts', payload)

                    if (res.data.code !== $const.ApiSuccessCode.GET) {
                        tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg)
                    }

                    let data = res.data.data;

                    data.items.forEach(function (value) {
                        value.username_local = value.masterUserNameTag ? value.masterUserNameTag.name : '-';
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
                        <button class="btn btn-dark" @click="show_CU_Modal">정기권 계정 등록</button>
                        <ModalPassAccount ref="ref_ModalPassAccount" :callback="TableRefreshAfterChange"/>
                  </div>
                  <Table_serverside ref="ref_talble"
                                    :tableProperty="tableProperty" :filters="filters"
                                    :min-width="2000" :get-list="getList">
                        <template #filter>
                              <input type="text" class="form-control" v-model="filters.tenantId" placeholder="입주사 ID"/>
                              <input type="text" class="form-control" v-model="filters.passId" placeholder="정기권 ID"/>
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
                        <template #tenant="{data}">
                              {{ data.value | toGetName }}
                        </template>
                        <template #pass="{data}">
                              {{ data.value | toGetPropExID }}
                        </template>

                  </Table_serverside>
            </PageLayout>

            <CommonModal ref="c_modal" :size="'xl'">
                  <PageDetail :current-id="current_id" :after-delete="TableRefreshAfterChange"/>
            </CommonModal>
      </div>
</template>

<style></style>
