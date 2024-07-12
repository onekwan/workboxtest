<script>
import PageLayout_noWhiteBg from "~/components/common/PageLayout_noWhiteBg";
import {mapState} from "vuex";
import InfiniteLoading from 'vue-infinite-loading';
import mixin_const from "@/mixin/mixin_const";

export default {
      mixins: [mixin_const],
    components: {
        PageLayout_noWhiteBg,
        InfiniteLoading
    },
    data() {
        return {
            title: '구매할 상품을 선택해 주세요.',
            filters: {
                name: '',
                type: '',
                code: '',
                page: 1
            },
            pageLoading: false,
            currentPage: 1,
            perPage: 10,
            dataList: []

        };
    },
    middleware: "authentication",

    created() {
        this.$store.commit('product/CLEAR_DATA', {});
    },
    mounted() {
        this.getList();
    },
    methods: {
        async getList(scroll) {
            let vm = this;
            return new Promise(async function (resolve, reject) {
                if (!scroll) {
                    vm.pageLoading = true;
                }

                let payload = {
                    page: vm.currentPage - 1,
                    size: vm.perPage,
                    sort: 'created,DESC',
                    name: vm.filters.name,
                    type: vm.filters.type,
                    code: vm.filters.code
                }
                try {
                    let res = await mainapi.invokeAPI_GET('/api/v1/products', payload)

                    if (res.data.code !== $const.ApiSuccessCode.GET) {
                        tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg)
                    }
                      if (!scroll) {
                            vm.dataList = [];
                      }
                    let data = res.data.data;

                    data.items.forEach(function (value) {
                        let remainQuota = value.totalQuota - value.orderCnt;
                        value.availableQuota_local = Math.min(remainQuota, value.orderMaxQuota);
                        if (vm.$store.getters["auth/getCompanyType"] === 'TENANT') value.availableQuota_local = Math.min(value.tenantMaxQuota, value.availableQuota_local);

                        if (value.type === 'PASS') {
                            let url = '/api/v1/pass-products/' + value.id;
                            value.passStart = "";
                            value.passEnd = ""
                            mainapi.invokeAPI_GET(url, {}).then(function (res) {
                                let data = res.data.data;
                                try {
                                    if (vm.$store.getters['product/currentProduct'] && value.id === vm.$store.getters['product/currentProduct'].id) {
                                        vm.$store.commit('product/SET_PASS_DATE', {
                                            passStart: data.passStart,
                                            passEnd: data.passEnd
                                        });
                                    } else {
                                        value.passStart = data.passStart;
                                        value.passEnd = data.passEnd;
                                    }
                                } catch (e) {

                                }
                            })
                        }
                    })
                    vm.dataList.push(...data.items);
                    resolve(data.items.length);
                } catch (e) {
                    reject(0);
                    tool_app.dialog_alert(e);
                } finally {
                    vm.pageLoading = false;
                }
            })
        },
        goTo_purchase(pid, item) {

            if (moment().isBetween(item.orderStart, item.orderEnd)) {
                this.$store.commit('product/SET_CURRENT_PRODUCT', item);
                this.$router.push({
                    path: "/ut/shop/order"
                })
            } else {
                tool_app.dialog_alert('구매 가능한 기간이 아닙니다.');
            }
        },
        show_search_form() {
            let current_class = this.$refs.search_form.className;
            if (current_class.indexOf("d-none") > -1 && current_class.indexOf("d-md-block") > -1) {
                this.$refs.search_form.className = "search_box d-block d-md-block";
            } else {
                this.$refs.search_form.className = "search_box d-none d-md-block";
            }
        },
        async infiniteHandler($state) {
            if (this.currentPage === 1 && this.dataList.length < this.perPage) {
                $state.complete();
                return false;
            }

            this.currentPage += 1;
            try {
                let res = await this.getList(true);

                $state.loaded();
                if (res === 0) {
                    $state.complete();
                }
            } catch (e) {
                $state.complete();
            }
        },
    }

};
</script>

<template>
      <div>
            <div class="mb-3">
                  <div :class="'col-12 d-md-none text-right'">
                        <button type="button" class="btn btn-light btn-outline-secondary" @click="show_search_form">
                              <i class="fas fa-search"></i>
                        </button>
                  </div>
                  <div ref="search_form" :class="'search_box d-none d-md-block'">
                        <div :class="'row row-cols-md-auto justify-content-end gx-3 gy-2 align-items-center'">
                              <div>
                                    <select class="form-select" v-model="filters.type">
                                          <option value="">상품 유형</option>
                                          <option v-for="(value, key) in productType" :value="key" :key="key">{{ value }}</option>
                                    </select>
                              </div>
                              <div>
                                    <input type="text" class="form-control" v-model="filters.name" placeholder="상품명">
                              </div>
                              <div>
                                    <input type="text" class="form-control" v-model="filters.code" placeholder="관리 코드">
                              </div>
                              <div>
                                    <button class="btn btn-dark" @click="getList(false)">검색</button>
                              </div>
                        </div>
                  </div>
            </div>
            <PageLayout_noWhiteBg :title="title" :page-loading="pageLoading">
                  <b-row>
                        <b-col cols="12" md="6" v-for="item in dataList" @click="goTo_purchase(item.id,item)" :key="item.id">
                              <b-card class="hover_anim cursor-pointer">
                                    <b-card-title>
                                          <b-row>
                                                <b-col cols="8" class="font-size-18">{{ item.name }}</b-col>
                                                <b-col cols="4" class="text-right font-size-18">
                                                      {{ item.unitPrice | three_comma }} 원
                                                </b-col>
                                          </b-row>
                                    </b-card-title>
                                    <b-card-body class="pb-0">
                                          <dl class="row mb-0">
                                                <dt class="col-sm-5">상품 유형</dt>
                                                <dd class="col-sm-7">{{ productType[item.type] | emptyCheck }}</dd>

                                                <dt class="col-sm-5">관리 코드</dt>
                                                <dd class="col-sm-7">{{ item.code | emptyCheck }}</dd>

                                                <dt class="col-sm-5">시작일</dt>
                                                <dd class="col-sm-7">{{ item.passStart  | emptyCheck }}</dd>

                                                <dt class="col-sm-5">종료일</dt>
                                                <dd class="col-sm-7">{{ item.passEnd  | emptyCheck }}</dd>

                                                <dt class="col-sm-5">주문 가능량</dt>
                                                <dd class="col-sm-7">{{ item.availableQuota_local | three_comma }}</dd>

                                                <dt class="col-sm-5">구매시작일</dt>
                                                <dd class="col-sm-7">{{ item.orderStart  | emptyCheck }}</dd>

                                                <dt class="col-sm-5">구매종료일</dt>
                                                <dd class="col-sm-7">{{ item.orderEnd  | emptyCheck }}</dd>
                                          </dl>
                                    </b-card-body>
                              </b-card>
                        </b-col>
                        <b-col cols="12" v-show="dataList.length === 0">
                              <div class="empty_box">
                                    구매할 수 있는 상품이 없습니다.
                              </div>
                        </b-col>
                  </b-row>
                  <infinite-loading @infinite="infiniteHandler">
                        <template #no-results>
                              <span></span>
                        </template>
                        <template #no-more>
                              <div class="infinite-list-item">
                                    <div class="infinite-list-item-content">
                                          <div class="infinite-list-item-text">
                                                <span>마지막 상품입니다.</span>
                                          </div>
                                    </div>
                              </div>
                        </template>
                        <template #spinner>
                              <b-spinner variant="success"></b-spinner>
                        </template>

                  </infinite-loading>
            </PageLayout_noWhiteBg>
      </div>


</template>

<style></style>
