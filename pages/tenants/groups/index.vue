<script>
import Table_serverside from '~/components/datatable/Table_serverside.vue';
import PageLayout from "~/components/common/PageLayout";
import ModalTenantGroups from "./ModalTenantGroups";
import CommonModal from "@/components/common/Modal";
import GroupDetail from '../groups/detail';
import PageDetail from "../list/detail.vue";
import list_default from "@/mixin/list_default";

export default {
      mixins : [list_default],
    components: {
          PageDetail,
        Table_serverside,
        PageLayout,
        ModalTenantGroups,
        CommonModal,
        GroupDetail
    },
    data() {
        return {
            title: "입주사 그룹",
              cu_modalName : 'ModalTenantGroups',
            filters: {
                name: '',
                siteId: '',
                siteName: '',
                tenantId: '',
                tenantName: '',
                page: 1
            },
            tableProperty: {
                perPage: 50,
                currentPage: 1,
                fields: [
                    {key: "name", label: "그룹명"},
                      {key: "site", label: "사업장"},
                      {key: "created", label: "등록일",type:'date'},
                      {key: "modified", label: "변경일",type:'date'}
                ],
                excelName: '입주사 그룹'
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
                name: filters.name,
                siteId: filters.siteId,
                siteName: filters.siteName,
                tenantId: filters.tenantId,
                tenantName: filters.tenantName,
                page: opt.page - 1,
                size: opt.perPage,
                sort: 'created,DESC'
            }

            return new Promise(async function (resolve, reject) {
                try {

                    let res = await mainapi.invokeAPI_GET('/api/v1/tenant-groups', payload)

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
                        <button class="btn btn-dark" @click="show_CU_Modal">입주사 그룹 등록</button>
                        <ModalTenantGroups ref="ref_ModalTenantGroups" :callback="TableRefreshAfterChange"/>
                  </div>
                  <Table_serverside ref="ref_talble"
                                    :tableProperty="tableProperty" :filters="filters"
                                    :min-width="2000" :get-list="getList">
                        <template #filter>
                              <input type="text" v-model="filters.name" class="form-control" placeholder="그룹명"/>
                              <input type="text" v-model="filters.siteId" class="form-control" placeholder="사업장 ID"/>
                              <input type="text" v-model="filters.siteName" class="form-control" placeholder="사업장 이름"/>
                              <input type="text" v-model="filters.tenantId" class="form-control" placeholder="입주사 ID"/>
                              <input type="text" v-model="filters.tenantName" class="form-control" placeholder="입주사 이름"/>
                        </template>
                        <template #name="{data}">
                              <a href="#" @click.prevent="openDetail(data.item.id)">
                                    {{ data.value }}
                              </a>
                        </template>
                        <template #site="{data}">
                              {{ data.value | toGetName }}
                        </template>
                  </Table_serverside>
            </PageLayout>
            <CommonModal ref="c_modal" :size="'xl'">
                  <GroupDetail :current-id="current_id" :after-delete="TableRefreshAfterChange"/>
            </CommonModal>
      </div>
</template>

<style></style>
