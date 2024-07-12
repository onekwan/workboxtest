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
            title: "결제 상세정보",
            orderList : []
        };
    },
    props: ['pageType'],
    middleware: "authentication",
    mounted() {

          if(this.$route.path.indexOf('/ut/shop/payments_tenant') > -1){
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
                const res = await mainapi.invokeAPI_GET('/api/v1/product-payments/' + this.page_id, {}, 'GET')

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
            if(data.orders && Array.isArray(data.orders) && data.orders.length > 0){
                  for(let i = 0; i < data.orders.length; i++){
                        this.orderList.push({
                              data : {
                                    id : data.orders[i].id,
                                    name : this.productType[data.orders[i].type]
                              },
                              type : data.orders[i].type === 'DISCOUNT' ? 'discountProductDetail' : 'passProductDetail',
                        });
                  }
            }
            return data;
        }
    }
};
</script>

<template>
      <PageLayout :title="title" :page-loading="pageLoading">
            <b-row>
                  <b-col cols="8">
                        <div v-if="pageType==='admin'">

                        </div>
                  </b-col>
                  <b-col cols="4" class="text-right">
                        <CopyUrl :detail_id="page_id" />
                  </b-col>
            </b-row>
            <b-col cols="12">
                  <div class="card-body">
                        <dl class="row detail_page_striped">
                              <dt class="col-sm-3">UID</dt>
                              <dd class="col-sm-9">{{ detailData.id | emptyCheck}}</dd>

                              <dt class="col-sm-3">이름</dt>
                              <dd class="col-sm-9">{{ detailData.name | emptyCheck}}</dd>

                              <dt class="col-sm-3">주문 정보</dt>
                              <dd class="col-sm-9">
                                    <link-page v-for="item in orderList"
                                          :type="item.type" :key="item.data.id"
                                          :linked="item.data"/>
                              </dd>

                              <dt class="col-sm-3">고객사</dt>
                              <dd class="col-sm-9">
                                    <link-page :type="'clientDetail'" :linked="detailData.client"/>
                              </dd>

                              <dt class="col-sm-3">기본 주차장</dt>
                              <dd class="col-sm-9">
                                    <link-page :type="'zoneDetail'" :linked="detailData.mainZone"/>
                              </dd>

                              <dt class="col-sm-3">결제액</dt>
                              <dd class="col-sm-9">{{ detailData.billedAmt | three_comma}} 원</dd>

                              <dt class="col-sm-3">실제 결제액</dt>
                              <dd class="col-sm-9">{{ detailData.payedAmt | three_comma}} 원</dd>

                              <dt class="col-sm-3">결제 수단</dt>
                              <dd class="col-sm-9">{{ payMethods[detailData.payMethod] | emptyCheck}}</dd>

                              <dt class="col-sm-3">결제 수단 번호</dt>
                              <dd class="col-sm-9">{{ detailData.payMethodNo | emptyCheck}}</dd>

                              <dt class="col-sm-3">결제 승인 번호</dt>
                              <dd class="col-sm-9">{{ detailData.authCode | emptyCheck}}</dd>

                              <dt class="col-sm-3">결제 승인 날짜</dt>
                              <dd class="col-sm-9">{{ detailData.authDate | emptyCheck}}</dd>

                              <dt class="col-sm-3">결제 승인 시각</dt>
                              <dd class="col-sm-9">{{ detailData.authTime | emptyCheck}}</dd>

                              <dt class="col-sm-3">결제 일시</dt>
                              <dd class="col-sm-9">{{ detailData.payed | emptyCheck}}</dd>

                              <dt class="col-sm-3">결제 설비</dt>
                              <dd class="col-sm-9">{{ detailData.payMachine | emptyCheck}}</dd>

                              <dt class="col-sm-3">결제 응답 원문</dt>
                              <dd class="col-sm-9">{{ detailData.payRawData | emptyCheck}}</dd>

                              <dt class="col-sm-3">등록 일시</dt>
                              <dd class="col-sm-9">{{ detailData.created | emptyCheck}}</dd>

                              <dt class="col-sm-3">취소 일시</dt>
                              <dd class="col-sm-9">{{ detailData.cancelled | emptyCheck}}</dd>
                        </dl>
                  </div>
            </b-col>
      </PageLayout>
</template>

<style></style>
