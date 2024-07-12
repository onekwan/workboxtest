<script>
import Table_serverside from '~/components/datatable/Table_serverside.vue';
import PageLayout from "~/components/common/PageLayout";
import ModalCooperations from "@/pages/manage/cooperations/ModalCooperations.vue";
import CommonModal from "@/components/common/Modal";
import detailPage from './detail';
import list_default from "@/mixin/list_default";

export default {
      mixins : [list_default],
    components: {
        Table_serverside,
        PageLayout,
        ModalCooperations,
        CommonModal,
        detailPage
    },
    data() {
        return {
            title: "외부 서비스",
              cu_modalName : 'ModalCooperations',
              cooperationsType : $const.cooperationsType,
            filters: {
                name: '',
                type: '',
                zoneId: '',
                page: 1
            },
            tableProperty: {
                perPage: 50,
                currentPage: 1,
                fields: [
                      {key: "name", label: "서비스 이름"},
                    {key: "type", label: "유형"},
                    {key: "data", label: "연동 정보"},
                    {key: "created", label: "생성일",type:'date'},
                    {key: "modified", label: "수정일",type:'date'},
                ],
                excelName: '외부 서비스'
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
                  type: filters.type,
                  zoneId: filters.zoneId,
                page: opt.page - 1,
                size: opt.perPage
            }

            return new Promise(async function (resolve, reject) {
                try {

                    let res = await mainapi.invokeAPI_GET('/api/v1/cooperations', payload)

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
                        <button class="btn btn-dark" @click="show_CU_Modal">외부 서비스 등록</button>
                        <ModalCooperations ref="ref_ModalCooperations" :callback="TableRefreshAfterChange"/>
                  </div>
                  <Table_serverside ref="ref_talble"
                                    :tableProperty="tableProperty" :filters="filters"
                                    :min-width="2000" :get-list="getList">
                        <template #filter>
                              <input class="form-control" v-model="filters.name" placeholder="서비스 이름"/>
                              <select class="form-select" v-model="filters.type">
                                    <option value="">유형</option>
                                    <option v-for="(name, key) in cooperationsType" :value="key" :key="key">{{ name }}</option>
                              </select>
                              <input class="form-control" v-model="filters.zoneId" placeholder="주차장 ID"/>

                        </template>
                        <template #name="{data}">
                              <a href="#" @click.prevent="openDetail(data.item.id)">
                                    {{ data.value }}
                              </a>
                        </template>
                        <template #id="{data}">
                              {{ data.value }}
                        </template>

                  </Table_serverside>
            </PageLayout>
            <CommonModal ref="c_modal" :size="'xl'">
                  <detailPage :current-id="current_id" :after-delete="TableRefreshAfterChange"/>
            </CommonModal>
      </div>
</template>

<style></style>
