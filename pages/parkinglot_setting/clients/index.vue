<script>
import Table_serverside from '~/components/datatable/Table_serverside.vue';
import PageLayout from "~/components/common/PageLayout";
import ModalClients from "./ModalClients";
import CommonModal from "@/components/common/Modal";
import ClientDetail from '../clients/detail';
import ManagersDetail from "../../managers/list/detail.vue";
import list_default from "@/mixin/list_default";

export default {
      mixins : [list_default],
    components: {
          ManagersDetail,
        Table_serverside,
        PageLayout,
        ModalClients,
        CommonModal,
        ClientDetail
    },
    data() {
        return {
            title: "고객사",
              cu_modalName : 'ModalClients',
            filters: {
                name: '',
                type: '',
                status: '',
                active: false
            },
            tableProperty: {
                perPage: 50,
                currentPage: 1,
                fields: [
                      {key: "name", label: "이름"},
                      // {key: "type", label: "유형"},
                      {key: "status", label: "상태"},
                      {key: "created", label: "등록일",type: 'date'},
                      {key: "modified", label: "변경일",type: 'date'}
                ],
                excelName: '고객사'
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
                name: filters.name,
                type: filters.type,
                status: filters.status,
                sort: 'created,DESC'
            }

            return new Promise(async function (resolve, reject) {
                try {

                    let res = await mainapi.invokeAPI_GET('/api/v1/clients', payload)

                    if (res.data.code !== $const.ApiSuccessCode.GET) {
                        tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg)
                    }

                    let data = res.data.data;

                    data.items.forEach(function (value) {
                          value.username_local = value.masterUsernameTag ? value.masterUsernameTag.name : '-';
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
                        <button class="btn btn-dark" @click="show_CU_Modal">고객사 등록</button>
                        <ModalClients ref="ref_ModalClients" :callback="TableRefreshAfterChange"/>
                  </div>
                  <Table_serverside ref="ref_talble"
                                    :tableProperty="tableProperty" :filters="filters"
                                    :min-width="2000" :get-list="getList">
                        <template #filter>
                              <input type="text" v-model="filters.name" placeholder="고객사 이름" class="form-control">


                        </template>
                        <template #name="{data}">
                              <a href="#" @click.prevent="openDetail(data.item.id)">
                                    {{ data.value }}
                              </a>
                        </template>
                        <template #type="{data}">
                              {{ companyType[data.value] }}
                        </template>

                        <template #status="{data}">
                              {{clientStatus[data.value]}}
                        </template>

                  </Table_serverside>
            </PageLayout>

            <CommonModal ref="c_modal" :size="'xl'">
                  <ClientDetail :current-id="current_id" :after-delete="TableRefreshAfterChange"/>
            </CommonModal>
      </div>
</template>

<style></style>
