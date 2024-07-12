<script>
import Table_serverside from '~/components/datatable/Table_serverside.vue';
import PageLayout from "~/components/common/PageLayout";
import CommonModal from "@/components/common/Modal";
import DiscountFormDetail from '../form/detail';
import ModalDiscountForm from "./ModalDiscountForm";
import list_default from "@/mixin/list_default";

export default {
    mixins: [list_default],
    components: {
        Table_serverside,
        PageLayout,
        CommonModal,
        DiscountFormDetail,
        ModalDiscountForm
    },
    data() {
        return {
            title: "할인 유형",
            cu_modalName: 'ModalDiscountForm',
            filters: {
                name: '',
                code: '',
                type: '',
                sector: '',
                method: '',
                clientId: '',
                clientName: '',
                page: 1,
            },
            tableProperty: {
                perPage: 50,
                currentPage: 1,
                fields: [
                    {key: "name", label: "이름"},

                    {key: "code", label: "관리 코드"},
                    {key: "type", label: "종류"},
                    {key: "client", label: "할인을 제공하는 고객사"},
                    {key: "mainZone", label: "기본 주차장"},
                    {key: "created", label: "등록일",type:'date'},
                    {key: "modified", label: "변경일",'type':'date'},
                ],
                excelName: '할인 유형'
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
                code: filters.code,
                type: filters.type,
                sector: filters.sector,
                method: filters.method,
                clientId: filters.clientId,
                clientName: filters.clientName,
                sort: 'created,DESC'
            }

            return new Promise(async function (resolve, reject) {
                try {


                    let res = await mainapi.invokeAPI_GET('/api/v1/discount-forms', payload)

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
                        <button class="btn btn-dark" @click="show_CU_Modal">할인 유형 등록</button>
                        <ModalDiscountForm ref="ref_ModalDiscountForm" :callback="TableRefreshAfterChange"/>
                  </div>
                  <Table_serverside ref="ref_talble"
                                    :tableProperty="tableProperty" :filters="filters"
                                    :min-width="2000" :get-list="getList">
                        <template #filter>
                              <input type="text" v-model="filters.name" class="form-control" placeholder="이름"/>
                              <input type="text" v-model="filters.code" class="form-control" placeholder="관리 코드"/>
                              <select v-model="filters.type" class="form-select">
                                    <option value="">종류</option>
                                    <option v-for="(value, key) in discountType" :value="key" :key="key">{{ value }}</option>
                              </select>
                              <select v-model="filters.sector" class="form-select">
                                    <option value="">부문</option>
                                    <option v-for="(value, key) in discountSector" :value="key" :key="key">{{ value }}</option>
                              </select>
                              <select v-model="filters.method" class="form-select">
                                    <option value="">적용 방식</option>
                                    <option v-for="(value, key) in discountMethod" :value="key" :key="key">{{ value }}</option>
                              </select>
                              <input type="text" v-model="filters.clientId" class="form-control" placeholder="고객사 UID"/>
                              <input type="text" v-model="filters.clientName" class="form-control"
                                     placeholder="고객사 이름"/>
                        </template>
                        <template #name="{data}">
                              <a href="#" @click.prevent="openDetail(data.item.id)">
                                    {{ data.value }}
                              </a>
                        </template>
                        <template #type="{data}">
                              {{ discountType[data.value] }}
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
                  <DiscountFormDetail :current-id="current_id" :after-delete="TableRefreshAfterChange"/>
            </CommonModal>
      </div>
</template>

<style></style>
