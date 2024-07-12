<script>
import PageLayout from "~/components/common/PageLayout";
import CopyUrl from "~/components/common/CopyUrl";
import detail_default from "@/mixin/detail_default";


export default {
      mixins: [detail_default],
    components: {
        PageLayout,
        CopyUrl
    },
    data() {
        return {
            title: "주문 상세정보",
              apiPath: '/api/v1/orders/',
            deleteMsgTitle: '주문'
        };
    },
    middleware: "authentication",
    mounted() {


        if(this.$route.path.indexOf('/ut/shop/orders_tenant') > -1){
            this.pageType = 'tenant';
        }
        if(this.pageType === 'admin' && !this.isUserAdmin()){
              tool_app.dialog_alert('잘못된 접근 입니다.')
              this.$router.push({
                  path: '/'
              })
        }
    },
    methods: {
        async getDetail() {
            this.pageLoading = true;

            try {
                const res = await mainapi.invokeAPI_GET('/api/v1/orders/' + this.page_id, {}, 'GET')

                if (res.data.code !== $const.ApiSuccessCode.GET) {
                    tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg)
                }
                const data = res.data.data
                this.detailData = this.manipulate_Data(data);
            } catch (e) {
                tool_app.dialog_alert(e);
            } finally {
                this.pageLoading = false;
            }
        },
        manipulate_Data(data) {
            data.type_local = this.productType[data.type];
            return data;
        },
        goToPay() {
            this.$store.commit('product/SET_ORDER_ID', this.detailData.id);

            this.$router.push({
                path: '/ut/shop/payment'
            })
        }
    }
};
</script>

<template>
      <PageLayout :title="title" :page-loading="pageLoading">
            <b-row>
                  <b-col cols="8">
                        <div v-if="pageType==='admin'">
                              <SpinnerButton :loading="api_delete_flag" @click="deleteDetail" variant="danger">삭제
                              </SpinnerButton>
                        </div>
                  </b-col>
                  <b-col cols="4" class="text-right">
                        <CopyUrl :detail_id="page_id"/>
                  </b-col>
            </b-row>
            <b-row v-if="pageType==='tenant'">
                  <b-col cols="12">
                        <b-button variant="info" v-if="detailData.payment===null" @click="goToPay">결제하기</b-button>
                  </b-col>
            </b-row>
            <b-col cols="12">
                  <div class="card-body">
                        <dl class="row detail_page_striped">
                              <dt class="col-sm-3">UID</dt>
                              <dd class="col-9">{{ detailData.id | emptyCheck }}</dd>

                              <dt class="col-sm-3">상품 유형</dt>
                              <dd class="col-9">{{ detailData.type_local | emptyCheck }}</dd>

                              <dt class="col-sm-3">상품</dt>
                              <dd class="col-9">
                                    <link-page :type="detailData.type === 'DISCOUNT' ? 'discountProductDetail' : 'passProductDetail' " :linked="detailData.product"/>
                              </dd>

                              <dt class="col-sm-3">주문 개수</dt>
                              <dd class="col-9">{{ detailData.qty | three_comma }}</dd>

                              <dt class="col-sm-3">단가</dt>
                              <dd class="col-9">{{ detailData.unitPrice | three_comma }} 원</dd>

                              <dt class="col-sm-3">주문액</dt>
                              <dd class="col-9">{{ detailData.price | three_comma }} 원</dd>

                              <dt class="col-sm-3">차량번호</dt>
                              <dd class="col-9">{{ detailData.carNumber | emptyCheck }}</dd>

                              <dt class="col-sm-3">주문 입주사</dt>
                              <dd class="col-9">
                                    <link-page :type="'tenantDetail'" :linked="detailData.orderer"/>
                              </dd>

                              <dt class="col-sm-3">승인 필요 여부</dt>
                              <dd class="col-9">{{ detailData.approvalRequired ? '필요' : '불필요' }}</dd>

                              <dt class="col-sm-3">승인자 UID</dt>
                              <dd class="col-9">{{ detailData.approverId | emptyCheck }}</dd>

                              <dt class="col-sm-3">승인자 이름</dt>
                              <dd class="col-9">{{ detailData.approverName | emptyCheck }}</dd>

                              <dt class="col-sm-3">승인 일시</dt>
                              <dd class="col-9">{{ detailData.approved | emptyCheck }}</dd>

                              <dt class="col-sm-3">관련 결재</dt>
                              <dd class="col-9">
                                    <link-page :type="'paymentDetail'" :linked="detailData.payment"/>
                              </dd>

									 <dt class="col-sm-3">등록자</dt>
									 <dd class="col-9">
										  <link-page :type="'userDetail'" :linked="{id:detailData.creatorId,name:detailData.creatorName}"/>
									 </dd>

                              <dt class="col-sm-3">등록 일시</dt>
                              <dd class="col-9">{{ detailData.created | emptyCheck }}</dd>
                        </dl>
                  </div>
            </b-col>
      </PageLayout>
</template>

<style></style>
