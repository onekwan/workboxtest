<script>
import Table_serverside from '~/components/datatable/Table_serverside.vue';
import PageLayout from "~/components/common/PageLayout";
import ModalSites from "./ModalSites";
import CommonModal from "@/components/common/Modal";
import SiteDetail from '../sites/detail'
import list_default from "@/mixin/list_default";

export default {
      mixins : [list_default],
    components: {
        Table_serverside,
        PageLayout,
        ModalSites,
        CommonModal,
        SiteDetail
    },
    data() {
        return {
            title: "사업장",
              cu_modalName : 'ModalSites',
            filters: {
                name: '',
                clientName: '',
                active: '',
                page: 1
            },
            tableProperty: {
                perPage: 50,
                currentPage: 1,
                fields: [
                      {key: "id", label: "아이디"},
                      {key: "name", label: "이름"},
                      {key: "version", label: "버전"},
                      {key: "client", label: "고객사"},
                      {key: "active", label: "활성화여부"},
                      {key: "url", label: "url"},
                      {key: "healthStatus", label: "상태"},
                      {key: "healthChecked", label: "마지막상태 체크일시"},
                      {key: "created", label: "등록일",type: 'date'},
                      {key: "modified", label: "변경일",type:'date'}
                ],
                excelName: '사업장'
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
                clientName: filters.clientName,
                active: filters.active,
                sort: 'created,DESC'
            }

            return new Promise(async function (resolve, reject) {
                try {

                    let res = await mainapi.invokeAPI_GET('/api/v1/sites', payload)

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
                        <button class="btn btn-dark" @click="show_CU_Modal">사업장 등록</button>
                        <ModalSites ref="ref_ModalSites" :callback="TableRefreshAfterChange"/>
                  </div>
                  <Table_serverside ref="ref_talble"
                                    :tableProperty="tableProperty" :filters="filters"
                                    :min-width="2000" :get-list="getList">
                        <template #filter>
                              <input class="form-control" type="text" v-model="filters.name" placeholder="사업장 이름"/>
                              <input class="form-control" type="text" v-model="filters.clientName"
                                     placeholder="고객사 이름"/>
                              <select class="form-select" v-model="filters.active">
                                    <option value="">활성화 여부</option>
                                    <option :value="true">활성화</option>
                                    <option :value="false">비활성화</option>
                              </select>
                        </template>
                        <template #name="{data}">
                              <a href="#" @click.prevent="openDetail(data.item.id)">
                                    {{ data.value }}
                              </a>
                        </template>

                        <template #healthStatus="{data}">
                              {{ siteHealthStatus[data.value] }}
                        </template>
                        <template #client="{data}">
                              {{ data.value | toGetName }}
                        </template>
                        <template #active="{data}">
                              {{ data.value ? '활성화' :'X' }}
                        </template>


                  </Table_serverside>
            </PageLayout>

            <CommonModal ref="c_modal" :size="'xl'">
                  <SiteDetail :current-id="current_id" :after-delete="TableRefreshAfterChange"/>
            </CommonModal>
      </div>
</template>

<style></style>
