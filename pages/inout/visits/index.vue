<script>
import Table_serverside from '~/components/datatable/Table_serverside.vue';
import PageLayout from "~/components/common/PageLayout";
import ModalVisits from "./ModalVisits.vue";
import CommonModal from "@/components/common/Modal";
import PageDetail from "./detail.vue";
import list_default from "@/mixin/list_default";

export default {
      mixins : [list_default],
    components: {
        Table_serverside,
        PageLayout,
        ModalVisits,
        CommonModal,
        PageDetail
    },
    data() {
        return {
            title: "입출차",
              cu_modalName : 'ModalVisits',
              pageType : 'inout',
            filters: {
                carNumber: '',
                carNumber4: '',
                type: '',
                status: '',
                siteId: '',
                siteName: '',
                zoneId: '',
                zoneName: '',
                exited: '',
                page: 1
            },
            tableProperty: {
                perPage: 50,
                currentPage: 1,
                fields: [
                    {key: "carNumber", label: "차량 번호(암호화)"},
                      // {key: "id", label: "아이디"},
                      {key: "type", label: "방문 유형"},
                      {key: "status", label: "상태"},
                      {key: "site", label: "주차 사업장"},
                      {key: "zone", label: "주차장"},
                      {key: "entered", label: "입차 일시"},
                      {key: "exited", label: "출차 일시"},
                      {key: "payed", label: "결제 일시"},
                      {key: "payMethod", label: "결제 방법"},
                      {key: "payedFee", label: "결제액"},
                      {key: "externalType", label: "외부 서비스"},
                      {key: "created", label: "생성일",type:'date'},
                      {key: "modified", label: "수정일",type:'date'}

                ],
                excelName: '입출차'
            }
        };
    },
    middleware: "authentication",
      created() {

            if(this.$route.name === 'nocarout_list'){
                  this.title = "미출차";
                  this.pageType = 'nocarout';
            }


      },
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
                carNumber: filters.carNumber,
                carNumber4: filters.carNumber4,
                type: filters.type,
                status: filters.status,
                siteId: filters.siteId,
                zoneId: filters.zoneId,
                exited: this.pageType === 'nocarout' ? false : filters.exited,
                page: opt.page - 1,
                size: opt.perPage,
                sort: 'created,DESC'
            }

            return new Promise(async function (resolve, reject) {
                try {


                    let res = await mainapi.invokeAPI_GET('/api/v1/visits', payload)

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
                        <button v-if="pageType!=='nocarout'" class="btn btn-dark" @click="show_CU_Modal">방문 등록</button>
                        <ModalVisits ref="ref_ModalVisits" :callback="TableRefreshAfterChange"/>
                  </div>
                  <Table_serverside ref="ref_talble"
                                    :tableProperty="tableProperty" :filters="filters"
                                    :min-width="2000" :get-list="getList">
                        <template #filter>
                              <input type="text" class="form-control" v-model="filters.carNumber" placeholder="차량번호"/>
                              <input type="text" class="form-control" v-model="filters.carNumber4"
                                     placeholder="차량번호(4자리)"/>
                              <select class="form-select" v-model="filters.type">
                                    <option value="">방문 유형</option>
                                    <option v-for="(value, key) in visitType" :value="key" :key="key">{{ value }}</option>
                              </select>
                              <select class="form-select" v-model="filters.status">
                                    <option value="">상태</option>
                                    <option v-for="(value, key) in visitStatus" :value="key" :key="key">{{ value }}</option>
                              </select>
                              <input type="text" class="form-control" v-model="filters.siteId" placeholder="사업장 ID"/>
                              <input type="text" class="form-control" v-model="filters.siteName" placeholder="사업장 이름"/>
                              <input type="text" class="form-control" v-model="filters.zoneId" placeholder="주차장 ID"/>
                              <input type="text" class="form-control" v-model="filters.zoneName" placeholder="주차장 이름"/>
                              <select class="form-select" v-model="filters.exited" v-if="pageType!=='nocarout'">
                                    <option value="">출차 여부</option>
                                    <option value="true">출차</option>
                                    <option value="false">미출차</option>
                              </select>
                        </template>
                        <template #carNumber="{data}">
                              <a href="#" @click.prevent="openDetail(data.item.id)">
                                    {{ data.value }}
                              </a>
                        </template>
                        <template #type="{data}">
                              {{ visitType[data.value] }}
                        </template>
                        <template #site="{data}">
                              {{ data.value | toGetName }}
                        </template>
                        <template #zone="{data}">
                              {{ data.value | toGetName }}
                        </template>
                        <template #status="{data}">
                              {{ visitStatus[data.value] }}
                        </template>
                        <template #enterType="{data}">
                              {{ visitEnterType[data.value] }}
                        </template>
                        <template #exitType="{data}">
                              {{ visitExitType[data.value] }}
                        </template>
                        <template #payMethod="{data}">
                              {{ payMethods[data.value] }}
                        </template>
                  </Table_serverside>
            </PageLayout>
            <CommonModal ref="c_modal" :size="'xl'">
                  <PageDetail :current-id="current_id" :after-delete="TableRefreshAfterChange"/>
            </CommonModal>
      </div>
</template>

<style></style>
