<script>
import Table_serverside from '~/components/datatable/Table_serverside.vue';
import PageLayout from "~/components/common/PageLayout";
import ModalManagers from "./ModalManagers";
import CommonModal from "@/components/common/Modal";
import ManagersDetail from '../list/detail';
import list_default from "@/mixin/list_default";


export default {
    mixins : [list_default],
    components: {
        Table_serverside,
        PageLayout,
        ModalManagers,
        CommonModal,
        ManagersDetail
    },
    data() {
        return {
            title: "관리사",
            cu_modalName : 'ModalManagers',
            filters: {
					 name : '',
					 type : '',
					 suspended : '',
                page: 1
            },
            tableProperty: {
                perPage: 50,
                currentPage: 1,
                fields: [
                    // {key: "username_local", label: "계정명"},
						  {key: "name", label: "이름"},
						  {key: "phone", label: "전화번호"},
						  {key: "suspended", label: "사용정지된 일시"},
						  {key: "type", label: "유형"},
						  {key: "created", label: "등록일",type:'date'},
						  {key: "modified", label: "변경일",type:'date'}
                ],
                excelName: '관리사',
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
					 suspended: filters.suspended,
                sort: 'created,DESC'
            }

            return new Promise(async function (resolve, reject) {
                try {


                    let res = await mainapi.invokeAPI_GET('/api/v1/managers', payload)

                    if (res.data.code !== $const.ApiSuccessCode.GET) {
                        tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg)
                    }

                    let data = res.data.data;

                    data.items.forEach(function (value) {
								value.username_local = value.masterUsernameTag ? value.masterUsernameTag.name : '-';
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
                        <button class="btn btn-dark" @click="show_CU_Modal">관리사 등록</button>
                        <ModalManagers ref="ref_ModalManagers" :callback="TableRefreshAfterChange"/>
                  </div>
                  <Table_serverside ref="ref_talble"
                                    :tableProperty="tableProperty" :filters="filters"
                                    :min-width="2000" :get-list="getList">
                        <template #filter>
										<input type="text" class="form-control" v-model="filters.name" placeholder="관리사 이름"/>
										<select class="form-select" v-model="filters.type">
												<option value="">유형</option>
												<option v-for="(value, key) in managerType" :value="key" :key="key">{{ value }}</option>
										</select>
										<select class="form-select" v-model="filters.suspended">
												<option value="">사용 정지 여부</option>
												<option value="true">사용중지</option>
												<option value="false">사용중</option>
										</select>

                        </template>
                        <template #name="{data}">
                              <a href="#" @click.prevent="openDetail(data.item.id)">
                                    {{ data.value }}
                              </a>
                        </template>
								<template #type="{data}">
									{{ managerType[data.value] }}
								</template>
                  </Table_serverside>
            </PageLayout>

            <CommonModal ref="c_modal" :size="'xl'">
                  <ManagersDetail :current-id="current_id" :after-delete="TableRefreshAfterChange"/>
            </CommonModal>
      </div>
</template>

<style></style>
