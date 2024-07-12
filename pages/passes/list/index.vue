<script>
import Table_serverside from '~/components/datatable/Table_serverside.vue';
import PageLayout from "~/components/common/PageLayout";
import ModalPasses from "./ModalPasses";
import CommonModal from "@/components/common/Modal";
import PassDetail from '../list/detail';
import list_default from "@/mixin/list_default";

export default {
      mixins : [list_default],
    components: {
        Table_serverside,
        PageLayout,
        ModalPasses,
        CommonModal,
        PassDetail
    },
    data() {
        return {
            title: "정기권",
              cu_modalName : 'ModalPasses',
            filters: {
                name: '',
                type: '',
                status: '',
                code: '',
                carNumber: '',
                holderName: '',
                origin: '',
                clientId: '',
                mainZoneId: '',
                page: 1
            },
            tableProperty: {
                perPage: 50,
                currentPage: 1,
                fields: [
                    {key: "name", label: "정기권 이름"},
                      {key: "carNumber", label: "차량 번호"},
                      {key: "type", label: "종류"},
                      {key: "status", label: "상태"},
                      {key: "origin", label: "발행 경로"},
                      {key: "code", label: "관리 코드"},
                      {key: "carModel", label: "차량 모델"},
                      {key: "holderName", label: "정기권자 이름"},
                      {key: "phone", label: "정기권자 전화번호"},
                      {key: "payed", label: "구매 일시"},
                      {key: "start", label: "시작 일시"},
                      {key: "end", label: "종료 일시"},
                      {key: "client", label: "정기권을 제공하는 고객사"},
                      {key: "mainZone", label: "기본 주차장"},
                      {key: "created", label: "등록일",type:'date'},
                      {key: "modified", label: "변경일",type:'date'}
                ],
                excelName: '정기권'
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
                sort: 'created,DESC',
                  name: filters.name,
                  type: filters.type,
                  status: filters.status,
                  code: filters.code,
                  carNumber:  filters.carNumber,
                  holderName: filters.holderName,
                  origin: filters.origin,
                  clientId: filters.clientId,
                  mainZoneId: filters.mainZoneId
            }

            return new Promise(async function (resolve, reject) {
                try {
                    let res = await mainapi.invokeAPI_GET('/api/v1/passes', payload)

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
                        <button class="btn btn-dark" @click="show_CU_Modal">정기권 등록</button>
                        <ModalPasses ref="ref_ModalPasses" :callback="TableRefreshAfterChange"/>
                  </div>
                  <Table_serverside ref="ref_talble"
                                    :tableProperty="tableProperty" :filters="filters"
                                    :min-width="2000" :get-list="getList">
                        <template #filter>
                              <input class="form-control" v-model="filters.name" placeholder="정기권 이름"/>

                              <select class="form-select" v-model="filters.type">
                                    <option value="">종류</option>
                                    <option v-for="(name, key) in passType" :value="key" :key="key">{{name}}</option>
                              </select>
                              <select class="form-select" v-model="filters.status">
                                    <option value="">상태</option>
                                    <option v-for="(name, key) in passStatus" :value="key" :key="key">{{name}}</option>
                              </select>

                              <input class="form-control" v-model="filters.code" placeholder="관리 코드"/>
                              <input class="form-control" v-model="filters.carNumber" placeholder="차량번호"/>
                              <input class="form-control" v-model="filters.holderName" placeholder="정기권자 이름"/>
                              <select class="form-select" v-model="filters.origin" placeholder="발행 경로">
                                    <option value="">발행 경로</option>
                                    <option v-for="(name, key) in passOrigin" :value="key" :key="key">{{name}}</option>
                              </select>

                              <input class="form-control" v-model="filters.clientId" placeholder="고객사 ID"/>
                              <input class="form-control" v-model="filters.mainZoneId" placeholder="기본 주차장 ID"/>
                        </template>
                        <template #name="{data}">
                              <a href="#" @click.prevent="openDetail(data.item.id)">
                                    {{ data.value }}
                              </a>
                        </template>

                        <template #type="{data}">
                              {{ passType[data.value] }}
                        </template>
                        <template #status="{data}">
                              {{ passStatus[data.value] }}
                        </template>
                        <template #origin="{data}">
                              {{ passOrigin[data.value] }}
                        </template>
                        <template #client="{data}">
                              {{ data.value | toGetName }}
                        </template>
                        <template #mainZone="{data}">
                              {{ data.value | toGetName }}
                        </template>

                  </Table_serverside>
            </PageLayout>
            <CommonModal ref="c_modal" :size="'xl'">
                  <PassDetail :current-id="current_id" :after-delete="TableRefreshAfterChange"/>
            </CommonModal>
      </div>
</template>

<style></style>
