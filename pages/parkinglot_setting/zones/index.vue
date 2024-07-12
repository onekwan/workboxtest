<script>
import Table_serverside from '~/components/datatable/Table_serverside.vue';
import PageLayout from "~/components/common/PageLayout";
import ModalZones from "./ModalZones";
import CommonModal from "@/components/common/Modal";
import ZoneDetail from '../zones/detail'
import list_default from "@/mixin/list_default";

export default {
      mixins : [list_default],
    components: {
        Table_serverside,
        PageLayout,
        ModalZones,
        CommonModal,
        ZoneDetail
    },
    data() {
        return {
            title: "주차장",
              cu_modalName : 'ModalZones',
            filters: {
                name: '',
                clientId: '',
                clientName: '',
                siteId: '',
                siteName: '',
                operatorId: '',
                operatorName: '',
            },
            tableProperty: {
                perPage: 50,
                currentPage: 1,
                fields: [
                      {key: "id", label: "아이디"},
                    {key: "name", label: "이름"},
                    {key: "site", label: "사업장"},
                    {key: "outerZone", label: " 외부 주차장"},
                    {key: "client", label: "고객사"},
                    {key: "phone", label: "전화 번호"},
                    {key: "operator", label: "운영사"},

                    {key: "created", label: "등록일", type:'date'},

                    {key: "modified", label: "변경일", type:'date'}
                ],
                excelName: '주차장'
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
                clientId: filters.clientId,
                clientName: filters.clientName,
                siteId: filters.siteId,
                siteName: filters.siteName,
                operatorId: filters.operatorId,
                operatorName: filters.operatorName,
                page: opt.page - 1,
                size: opt.perPage,
                sort: 'created,DESC'
            }

            return new Promise(async function (resolve, reject) {
                try {

                    let res = await mainapi.invokeAPI_GET('/api/v1/zones', payload)

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
                        <button class="btn btn-dark" @click="show_CU_Modal">주차장 등록</button>
                        <ModalZones ref="ref_ModalZones" :callback="TableRefreshAfterChange"/>
                  </div>
                  <Table_serverside ref="ref_talble"
                                    :tableProperty="tableProperty" :filters="filters"
                                    :min-width="2000" :get-list="getList">
                        <template #filter>
                              <input type="text" v-model="filters.name" class="form-control" placeholder="이름"/>
                              <input type="text" v-model="filters.clientId" class="form-control" placeholder="고객사 ID"/>
                              <input type="text" v-model="filters.clientName" class="form-control" placeholder="고객사 이름"/>
                              <input type="text" v-model="filters.siteId" class="form-control" placeholder="사업장 ID"/>
                              <input type="text" v-model="filters.siteName" class="form-control" placeholder="사업장 이름"/>
                              <input type="text" v-model="filters.operatorId" class="form-control" placeholder="운영사 ID"/>
                              <input type="text" v-model="filters.operatorName" class="form-control" placeholder="운영사 이름"/>
                        </template>
                        <template #name="{data}">
                              <nuxt-link :to="`/parkinglot_setting/zones/` + data.item.id">
                                    {{ data.value }}
                              </nuxt-link>
                        </template>
                        <template #site="{data}">
                              {{ data.value | toGetSiteIdName}}
                        </template>
                        <template #outerZone="{data}">
                              {{ data.value | toGetSiteIdName}}
                        </template>
                        <template #client="{data}">
                              {{ data.value | toGetName }}
                        </template>
                        <template #operator="{data}">
                              {{ data.value | toGetName }}
                        </template>

                  </Table_serverside>
            </PageLayout>


            <CommonModal ref="c_modal" :size="'xl'">
                  <ZoneDetail :current-id="current_id" :after-delete="TableRefreshAfterChange" />
            </CommonModal>
      </div>
</template>

<style></style>
