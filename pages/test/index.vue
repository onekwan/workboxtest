<script>
import Table_serverside from '~/components/datatable/Table_serverside.vue';
import PageLayout from "~/components/common/PageLayout";
import ModalPassesForm from "./ModalPassesForm";
import CommonModal from "@/components/common/Modal";
import PassFormDetail from './detail';
import list_default from "@/mixin/list_default";

export default {
      mixins : [list_default],
	 layout : 'empty',
    components: {
        Table_serverside,
        ModalPassesForm,
        PageLayout,
        CommonModal,
        PassFormDetail
    },
    data() {
        return {
            title: "테스트 페이지",
              cu_modalName : 'ModalPassesForm',
            filters: {
                name: '',
                type: '',
                code: '',
                clientId: '',
                mainZoneId: '',
                page: 1
            },
            tableProperty: {
                perPage: 50,
                currentPage: 1,
                fields: [
                    {key: "name", label: "유형명"},
                      {key: "type", label: "종류"},
                      {key: "code", label: "관리 코드"},
                      {key: "price", label: "판매 가격", tdClass: 'text-right'},
                      {key: "client_local", label: "정기권을 제공하는 고객사"},
                      {key: "mainZone_local", label: "기본 주차장"},
                      {key: "created", label: "생성일",type:'date'},
                      {key: "modified", label: "수정일",type:'date'}
                ],
                excelName: '정기권 유형'
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
                  code : filters.code,
                  clientId : filters.clientId,
                  mainZoneId : filters.mainZoneId
            }

            return new Promise(async function (resolve, reject) {
                try {
                    let res = await mainapi.invokeAPI_GET('/api/v1/pass-forms', payload)

                    if (res.data.code !== $const.ApiSuccessCode.GET) {
                        tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg)
                    }

                    let data = res.data.data;

                    data.items.forEach(function (value) {
                        value.client_local = value.client ? value.client.name : '-';
                        value.mainZone_local = value.mainZone ? value.mainZone.name : '-';
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
        },
		  async buttonTest(){


				let payLoad = {
					 name : 'test',
					 parikingid : 12314123
				}

				try {
					 let res = await mainapi.invokeAPI('/api/v1/pass-forms/', payLoad, 'POST');

					 if (res.data.code !== $const.ApiSuccessCode.POST) {
						  throw res.data.msg;
						  return false;
					 }


					 tool_app.dialog_success(`성공`);
				} catch (e) {
					 tool_app.log(e)
					 tool_app.dialog_alert(`실패` + "<br/>" + tool_app.ErrorMsg(e));
				} finally {
					 this.api_flag = false;
				}
		  }
    }
};
</script>

<template>
      <div>
            <PageLayout :title="title" :page-loading="pageLoading">
                  <div class="mb-2">
							   <button class="btn btn-info" @click="buttonTest">테스트 버튼입니다.</button>
                        <button class="btn btn-dark" @click="show_CU_Modal">정기권 유형 등록</button>
                        <ModalPassesForm ref="ref_ModalPassesForm" :callback="TableRefreshAfterChange"/>
                  </div>
                  <Table_serverside ref="ref_talble"
                                    :tableProperty="tableProperty" :filters="filters"
                                    :min-width="2000" :get-list="getList">
                        <template #filter>
                              <input class="form-control" v-model="filters.name" placeholder="정기권 유형 이름"/>
                              <select class="form-select" v-model="filters.type">
                                    <option value="">종류</option>
                                    <option v-for="(name, key) in passType" :value="key" :key="key">{{name}}</option>
                              </select>
                              <input class="form-control" v-model="filters.code" placeholder="관리 코드"/>
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
                        <template #price="{data}">
                              {{ data.value | three_comma }}원
                        </template>
                  </Table_serverside>
            </PageLayout>

            <CommonModal ref="c_modal" :size="'xl'">
                  <PassFormDetail :current-id="current_id" :after-delete="TableRefreshAfterChange"/>
            </CommonModal>
      </div>
</template>

<style></style>
