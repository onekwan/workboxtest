<script>
import Table_serverside from '~/components/datatable/Table_serverside.vue';
import PageLayout from "~/components/common/PageLayout";
import ModalTenants from "./ModalTenants";
import CommonModal from "@/components/common/Modal";
import PageDetail from './detail';
import list_default from "@/mixin/list_default";

export default {
      mixins : [list_default],
    components: {
        Table_serverside,
        PageLayout,
        ModalTenants,
        CommonModal,
        PageDetail
    },
    data() {
        return {
            title: "입주사",
              cu_modalName : 'ModalTenants',
            filters: {
                name: '',
                siteId: '',
                siteName: '',
                zoneId: '',
                zoneName: '',
                tenantGroupId: '',
                tenantGroupName: '',
                suspended: '',
                page: 1
            },
            tableProperty: {
                perPage: 50,
                currentPage: 1,
                fields: [
                    // {key: "username_local", label: "계정명"},
                      {key: "name", label: "입주사명"},
                      {key: "phone", label: "핸드폰번호"},
                      {key: "site", label: "사업장 정보"},
                      {key: "building", label: "동(건물)"},
                      {key: "room", label: "방 번호"},
                      {key: 'suspended', label: '사용 정지된 일시'},
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
                name: filters.name,
                siteId: filters.siteId,
                siteName: filters.siteName,
                zoneId: filters.zoneId,
                zoneName: filters.zoneName,
                tenantGroupId: filters.tenantGroupId,
                tenantGroupName: filters.tenantGroupName,
                suspended: filters.suspended,
                page: opt.page - 1,
                size: opt.perPage,
                sort: 'created,DESC'
            }

            return new Promise(async function (resolve, reject) {
                try {

                    let res = await mainapi.invokeAPI_GET('/api/v1/tenants', payload)

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
                        <button class="btn btn-dark" @click="show_CU_Modal">입주사 등록</button>
                        <ModalTenants ref="ref_ModalTenants" :callback="TableRefreshAfterChange"/>
                  </div>
                  <Table_serverside ref="ref_talble"
                                    :tableProperty="tableProperty" :filters="filters"
                                    :min-width="2000" :get-list="getList">
                        <template #filter>
                              <input type="text" class="form-control" v-model="filters.name" placeholder="입주사 이름" />
                              <input type="text" class="form-control" v-model="filters.siteId" placeholder="사업장 ID" />
                              <input type="text" class="form-control" v-model="filters.siteName" placeholder="사업장 이름" />
                              <input type="text" class="form-control" v-model="filters.zoneId" placeholder="주차장 ID" />
                              <input type="text" class="form-control" v-model="filters.zoneName" placeholder="주차장 이름" />
                              <input type="text" class="form-control" v-model="filters.tenantGroupId" placeholder="입주사 그룹 ID" />
                              <input type="text" class="form-control" v-model="filters.tenantGroupName" placeholder="입주사 그룹 이름" />
                              <select class="form-select" v-model="filters.suspended">
                                    <option value="">사용 정지 여부</option>
                                    <option value="true">정지</option>
                                    <option value="false">정상</option>
                              </select>
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
                  <PageDetail :current-id="current_id" :after-delete="TableRefreshAfterChange"/>
            </CommonModal>
      </div>
</template>

<style></style>
