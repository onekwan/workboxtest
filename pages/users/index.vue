<script>
import Table_serverside from '~/components/datatable/Table_serverside.vue';
import PageLayout from "~/components/common/PageLayout";
import ModalUsers from "./ModalUsers.vue";
import CommonModal from "@/components/common/Modal";
import PageDetail from './detail.vue'
import list_default from "@/mixin/list_default";

export default {
      mixins : [list_default],
    components: {
        Table_serverside,
        PageLayout,
        ModalUsers,
        CommonModal,
        PageDetail
    },
    data() {
        return {
            title: "사용자",
              cu_modalName : 'ModalUsers',
				companyLinkType : '',
            filters: {
                name: '',
                type: '',
                suspended: '',
                companyType: '',
                page: 1
            },
            tableProperty: {
                perPage: 50,
                currentPage: 1,
                fields: [
                      // {key: "username", label: "계정명"},
                      {key: "name", label: "이름"},
                      {key: "type", label: "유형"},
                      {key: "phone", label: "전화번호"},
                      {key: "company", label: "회사"},
                      {key: "companyType", label: "회사 유형"},
                      {key: "suspended", label: "사용 정지된 일시"},
                      {key: "created", label: "생성일",type:'date'},
                      {key: "modified", label: "수정일",type:'date'},
                ],
                excelName: '사용자'
            },
            pageType: '',
            visible_selectCompanyType: false,
            visible_userType: true,
              _companyType : []
        };
    },
    middleware: "authentication",
    mounted() {
        let vm = this;


    },
    created() {
        let vm = this;
        function deleteColm(){
              vm.tableProperty.fields.forEach(function (value, index) {
                    if (value.key === 'companyType') {
                          vm.tableProperty.fields.splice(index, 1);
                    }
              });
        }
          this._companyType = this.companyType;
        switch (this.$route.name) {
            case "client_users_list" :
                this.title = "고객사 사용자";
                this.filters.companyType = 'CLIENT'
                this.pageType = 'clients';
					 this.companyLinkType = 'clientDetail';
                deleteColm();
                break;
            case "managers_users_list" :
                this.title = "관리사 사용자";
                this.pageType = 'managers';
                this.visible_selectCompanyType = true;
                this.visible_userType = false;
                  this._companyType = {
                        DEVELOPER: '개발사',
                        OPERATOR: '운영사',
                        MAINTAINER: '유지보수사',
                  }
						this.companyLinkType = 'maintainerDetail';
                break;
            case "tenants_noresident_list" :
                this.title = "비거주자";
                this.pageType = 'noresidents';
                this.visible_selectCompanyType = false;
                this.visible_userType = false;

					 this.companyLinkType = 'noresidantDetail';
                  deleteColm();

					 this.tableProperty.fields.splice(1, 1);
					 this.tableProperty.fields.splice(2, 1);
                break;

            case "tenants_resident_list" :
                this.title = "입주사 사용자";
                this.pageType = 'tenants';
                this.visible_selectCompanyType = false;
                this.visible_userType = false;
					 this.companyLinkType = 'tenantDetail';
                  deleteColm();
                break;
        }


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
                name: filters.name,
                type: filters.type,
                suspended: filters.suspended,
                companyType: filters.companyType,
                sort: 'created,DESC'
            }

            if (this.pageType === 'clients') {
                payload.companyType = 'CLIENT';
            } else if (this.pageType === 'managers') {
                //payload.type = this.pageType;
                  if(payload.companyType === ''){
                        payload.companyType ='MANAGER';
                  }
            }else if(this.pageType === 'tenants'){
                  payload.companyType = 'TENANT'

            }else if(this.pageType==='noresidents'){
                  payload.companyType = 'NONE'
            }

            return new Promise(async function (resolve, reject) {
                try {

                    let res = await mainapi.invokeAPI_GET('/api/v1/users', payload)

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
        },
        show_CU_Modal() {
            this.$refs.ref_ModalUsers.show();
        },
        TableRefreshAfterChange(deleteFlag) {
            if (deleteFlag) {
                this.$refs.c_modal.hide_modal();
            }
            this.$refs.ref_talble.refresh();
        },
        openDetail(userId) {
            this.current_id = userId;
            this.$refs.c_modal.show_modal();
        }
    }
};
</script>

<template>
      <div>
            <PageLayout :title="title" :page-loading="pageLoading">
                  <div class="mb-2">
                        <button class="btn btn-dark" @click="show_CU_Modal">사용자 등록</button>
                        <ModalUsers ref="ref_ModalUsers" :callback="TableRefreshAfterChange" :page-type="pageType"/>
                  </div>
                  <Table_serverside ref="ref_talble"
                                    :tableProperty="tableProperty" :filters="filters"
                                    :min-width="2000" :get-list="getList">
                        <template #filter>
                              <input class="form-control" type="text" v-model="filters.name" placeholder="사용자 이름"/>

                              <select class="form-select" v-model="filters.type" v-if="visible_userType">
                                    <option value="">유형</option>
                                    <option v-for="(value, key) in userType" :value="key" :key="key">{{ value }}</option>
                              </select>
                              <select class="form-select" v-model="filters.companyType"
                                      v-if="visible_selectCompanyType">
                                    <option value="">회사 유형</option>
                                    <option v-for="(value, key) in _companyType" :value="key" :key="key">{{ value }}</option>
                              </select>

                              <select class="form-select" v-model="filters.suspended">
                                    <option value="">사용 정지 여부</option>
                                    <option :value="true">사용 정지</option>
                                    <option :value="false">사용중</option>
                              </select>
                        </template>
                        <template #name="{data}">
                              <a href="#" @click.prevent="openDetail(data.item.id)">
                                    {{ data.value }}
                              </a>
                        </template>

                        <template #type="{data}">
                              {{ userType[data.value] }}
                        </template>

                        <template #companyType="{data}">
                              {{ data.item.company ? companyType[data.item.company.type] : '' }}
                        </template>
                        <template #company="{data}">
									 <link-page v-if="companyLinkType !== 'noresidantDetail'" :type="companyLinkType" :linked="data.value"></link-page>
                        </template>

                  </Table_serverside>
            </PageLayout>

            <CommonModal ref="c_modal" :size="'xl'">
                  <PageDetail :current-id="current_id" :after-delete="TableRefreshAfterChange" :page-type="pageType"/>
            </CommonModal>
      </div>
</template>

<style></style>
