<script>
import Table_serverside from '~/components/datatable/Table_serverside.vue';
import PageLayout from "~/components/common/PageLayout";
import ModalPassProducts from "./ModalPassProducts";
import CommonModal from "@/components/common/Modal";
import ProductDetail from './detail';
import DateRangePicker from "@/components/common/DateRangePicker";
import list_default from "@/mixin/list_default";

export default {
      mixins : [list_default],
    components: {
        Table_serverside,
        PageLayout,
        ModalPassProducts,
        CommonModal,
        ProductDetail,
          DateRangePicker
    },
    data() {
        return {
            title: "정기권 상품",
              cu_modalName : 'ModalPassProducts',
            filters: {
                name: '',
                code: '',
                passFormId: '',
                passGroupId: '',
                passStart: '',
                passEnd: '',
                totalQuota: '',
                orderCnt: '',
                orderStart: '',
                orderEnd: '',
                page: 1
            },
            tableProperty: {
                perPage: 50,
                currentPage: 1,
                fields: [
                    {key: "name", label: "상품명"},
                      {key: "code", label: "관리 코드"},
                      {key: "passFormid_local", label: "정기권 유형 UID"},
                      {key: "passGroupId_local", label: "정기권 속성 그룹 UID"},
                      {key: "passStart", label: "정기권 시작일",type:'date'},
                      {key: "passEnd", label: "정기권 종료일",type:'date'},
                      {key: "unitPrice", label: "가격", tdClass: 'text-right'},
                      {key: "totalQuota", label: "전체 구매 가능량", tdClass: 'text-right'},
                      {key: "tenantMaxQuota", label: "입주사별 최대 구매 개수", tdClass: 'text-right'},
                      {key: "orderMaxQuota", label: "주문별 최대 구매 개수", tdClass: 'text-right'},
                      {key: "orderStart", label: "구매 시작 일시"},
                      {key: "orderEnd", label: "구매 종료 일시"},
                      {key: "created", label: "생성일",type:'date'},
                      {key: "modified", label: "수정일",type:'date'}
                ],
                excelName: '관리자'
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

              //alert(moment(filters.passStart).isValid());
            let payload = {
                page: opt.page - 1,
                size: opt.perPage,
                sort: 'created,DESC',
                name: filters.name,
                code: filters.code,
                passFormId: filters.passFormId,
                passGroupId: filters.passGroupId,
                passStart:filters.passStart,
                passEnd: filters.passEnd,
                totalQuota: filters.totalQuota,
                orderCnt: filters.orderCnt,
                orderStart: filters.orderStart,
                orderEnd: filters.orderEnd
            }

            return new Promise(async function (resolve, reject) {
                try {


                    let res = await mainapi.invokeAPI_GET('/api/v1/pass-products', payload)

                    if (res.data.code !== $const.ApiSuccessCode.GET) {
                        tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg)
                    }

                    let data = res.data.data;

                    data.items.forEach(function (value) {
                        value.passFormid_local = value.passForm.id ? value.passForm.id : '';
                        value.passGroupId_local = value.passGroup.id ? value.passGroup.id : '';
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
                        <button class="btn btn-dark" @click="show_CU_Modal">정기권 상품 등록</button>
                        <ModalPassProducts ref="ref_ModalPassProducts" :callback="TableRefreshAfterChange"/>
                  </div>
                  <Table_serverside ref="ref_talble"
                                    :tableProperty="tableProperty" :filters="filters"
                                    :min-width="2000" :get-list="getList">
                        <template #filter>
                              <input type="text" class="form-control" v-model="filters.name" placeholder="정기권 상품 이름"/>
                              <input type="text" class="form-control" v-model="filters.code" placeholder="관리 코드"/>
                              <input type="text" class="form-control" v-model="filters.passFormId"
                                     placeholder="정기권 유형 UID"/>
                              <input type="text" class="form-control" v-model="filters.passGroupId"
                                       placeholder="정기권 속성 그룹 UID"/>


<!--                              <b-input-group size="lg" prepend="정기권 사용기간">-->
<!--                                    <DateRangePicker @date-picker-change="changeDateRange"-->
<!--                                                     :empty-init="true"-->
<!--                                                     v-bind:start-date="filters.passStart"-->
<!--                                                     v-bind:end-date="filters.passEnd"/>-->
<!--                              </b-input-group>-->

                              <date-picker
                                    v-model="filters.passStart"
                                    type="datetime"
                                    lang="ko"
                                    value-type="format" format="YYYY-MM-DDTHH:mm:ss"
                                    placeholder="정기권 시작일시"
                              ></date-picker>
                              <date-picker
                                    v-model="filters.passEnd"
                                    type="datetime"
                                    lang="ko"
                                    value-type="format" format="YYYY-MM-DDTHH:mm:ss"
                                    placeholder="정기권 종료일시"
                              ></date-picker>


                              <input type="text" class="form-control" v-model="filters.totalQuota"
                                     placeholder="전체 구매 가능량"/>
                              <input type="text" class="form-control" v-model="filters.orderCnt" placeholder="주문 개수"/>
                              <date-picker
                                    v-model="filters.orderStart"
                                    type="datetime"
                                    lang="ko"
                                    value-type="format" format="YYYY-MM-DDTHH:mm:ss"
                                    placeholder="구매 시작 일시"
                              ></date-picker>

                              <date-picker
                                    v-model="filters.orderEnd"
                                    type="datetime"
                                    lang="ko"
                                    value-type="format" format="YYYY-MM-DDTHH:mm:ss"
                                    placeholder="구매 종료 일시"
                              ></date-picker>
                        </template>
                        <template #name="{data}">
                              <a href="#" @click.prevent="openDetail(data.item.id)">
                                    {{ data.value }}
                              </a>
                        </template>
                        <template #unitPrice="{data}">
                              {{ data.value | three_comma }} 원
                        </template>

                        <template #totalQuota="{data}">
                              {{ data.value | three_comma }}
                        </template>

                        <template #tenantMaxQuota="{data}">
                              {{ data.value | three_comma }}
                        </template>

                        <template #orderMaxQuota="{data}">
                              {{ data.value | three_comma }}
                        </template>
                  </Table_serverside>
            </PageLayout>
            <CommonModal ref="c_modal" :size="'xl'">
                  <ProductDetail :current-id="current_id" :after-delete="TableRefreshAfterChange"/>
            </CommonModal>
      </div>
</template>

<style></style>
