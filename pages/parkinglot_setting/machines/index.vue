<script>
import Table_serverside from '~/components/datatable/Table_serverside.vue';
import PageLayout from "~/components/common/PageLayout";
import ModalMachines from "./ModalMachines";
import CommonModal from "@/components/common/Modal";
import MachineDetail from '../machines/detail';
import list_default from "@/mixin/list_default";

export default {
      mixins : [list_default],
    components: {
        Table_serverside,
        PageLayout,
        ModalMachines,
        CommonModal,
        MachineDetail
    },
    data() {
        return {
            title: "설비",
              cu_modalName : 'ModalMachines',
            filters: {
                name: '',
                type: '',
                code: '',
                siteId: '',
                siteName: '',
                zoneId: '',
                zoneName: '',
                maintainerId: '',
                maintainerName: '',
            },
            tableProperty: {
                perPage: 50,
                currentPage: 1,
                fields: [
                    {key: "name", label: "설비 이름"},
                      {key: "type_local", label: "설비 유형"},
                      {key: "code", label: "관리 코드"},
                      {key: "model", label: "모델(버전)"},
                      {key: "protocol", label: "설비 제어 방식"},
                      {key: "status_local", label: "설비 상태"},
                      {key: "maintainer", label: "유지보수사"},
                      {key: "site", label: "사업장"},
                      {key: "zone", label: "주차장"},
                      {key: "created", label: "생성일",type:'date'},
                      {key: "modified", label: "수정일",type:'date'}
                ],
                excelName: '설비'
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
            let filters = opt.filters ? opt.filters : null;
            let payload = {
                page: opt.page - 1,
                size: opt.perPage,
                name: filters.name,
                type: filters.type,
                code: filters.code,
                siteId: filters.siteId,
                siteName: filters.siteName,
                zoneId: filters.zoneId,
                zoneName: filters.zoneName,
                maintainerId: filters.maintainerId,
                maintainerName: filters.maintainerName,
                sort: 'created,DESC'
            }

            return new Promise(async function (resolve, reject) {
                try {

                    let res = await mainapi.invokeAPI_GET('/api/v1/machines', payload)

                    if (res.data.code !== $const.ApiSuccessCode.GET) {
                        tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg)
                    }

                    let data = res.data.data;

                    data.items.forEach(function (value) {
                        value.type_local = value.type ? $const.machineType[value.type] : '';
                        value.status_local = value.status ? $const.machineStatus[value.status] : '';
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
                        <button class="btn btn-dark" @click="show_CU_Modal">설비 등록</button>
                        <ModalMachines ref="ref_ModalMachines" :callback="TableRefreshAfterChange"/>
                  </div>
                  <Table_serverside ref="ref_talble"
                                    :tableProperty="tableProperty" :filters="filters"
                                    :min-width="2000" :get-list="getList">
                        <template #filter>
                              <input type="text" v-model="filters.name" placeholder="설비 이름" class="form-control"/>
                              <select type="text" class="form-select" v-model="filters.type">
                                    <option value="">유형</option>
                                    <option v-for="(value, key) in machineType" :value="key" :key="key">{{ value }}</option>
                              </select>
                              <input type="text" v-model="filters.code" placeholder="관리 코드" class="form-control"/>
                              <input type="text" v-model="filters.siteId" placeholder="주차 사업장 아이디"
                                     class="form-control"/>
                              <input type="text" v-model="filters.siteName" placeholder="주차 사업장 이름"
                                     class="form-control"/>
                              <input type="text" v-model="filters.zoneId" placeholder="주차장 아이디" class="form-control"/>
                              <input type="text" v-model="filters.zoneName" placeholder="주차장 이름" class="form-control"/>
                              <input type="text" v-model="filters.maintainerId" placeholder="유지보수사 아이디"
                                     class="form-control"/>
                              <input type="text" v-model="filters.maintainerName" placeholder="유지보수사 이름"
                                     class="form-control"/>
                        </template>
                        <template #name="{data}">
                              <a href="#" @click.prevent="openDetail(data.item.id)">
                                    {{ data.value }}
                              </a>
                        </template>

                        <template #maintainer="{data}">
									 <link-page :type="'maintainerDetail'" :linked="data.value"></link-page>
                        </template>
							 <template #site="{data}">
								  <link-page :type="'siteDetail'" :linked="data.value"></link-page>
							 </template>
							 <template #zone="{data}">
								  <link-page :type="'zoneDetail'" :linked="data.value"></link-page>
							 </template>


                  </Table_serverside>
            </PageLayout>

            <CommonModal ref="c_modal" :size="'xl'">
                  <MachineDetail :current-id="current_id" :after-delete="TableRefreshAfterChange"/>
            </CommonModal>
      </div>
</template>

<style></style>
