<script>
import PageLayout_noWhiteBg from "~/components/common/PageLayout_noWhiteBg";
import {mapState} from "vuex";
import mixin_const from "@/mixin/mixin_const";

export default {
      mixins: [mixin_const],
    components: {
        PageLayout_noWhiteBg
    },
    data() {
        return {
            title: "결제 완료",
            paymentID : null,
            isMobile: this.$isMobile(),
            pageLoading: true,
            detailData: {}
        };
    },
    middleware: "authentication",
      created() {
         this.paymentID = this.$route.params.id;
      },
      mounted() {
        this.getDetail()
    },
    computed: {

    },
    methods: {
        async getDetail() {
            this.pageLoading = true;

            try {
                const res = await mainapi.invokeAPI_GET('/api/v1/product-payments/' + this.paymentID, {}, 'GET')

                if (res.data.code !== $const.ApiSuccessCode.GET) {
                    tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg)
                }
                const data = res.data.data;
                this.detailData = data;
                this.pageLoading = false;
            } catch (e) {
                tool_app.dialog_alert(e);
            } finally {
                this.pageLoading = false;
            }
        }
    }
};
</script>

<template>
      <PageLayout_noWhiteBg :title="title" :page-loading="pageLoading">
            <b-row>
                  <b-col cols="12">
                        <b-card>
                              <h3 class="text-center">결제가 완료되었습니다.</h3>
                        </b-card>
                  </b-col>
                  <b-col cols="12" class="mt-5">
                        <h5>결제 정보</h5>
                        <b-card>
                              <dl class="row mb-0">
                                    <dt class="col-sm-3">UID</dt>
                                    <dd class="col-sm-9">{{ detailData.id | emptyCheck}}</dd>

                                    <dt class="col-sm-3">이름</dt>
                                    <dd class="col-sm-9">{{ detailData.name | emptyCheck}}</dd>

                                    <dt class="col-sm-3">주문</dt>
                                    <dd class="col-sm-9">{{ detailData.orders | toOrderInfo}}</dd>

                                    <dt class="col-sm-3">고객사</dt>
                                    <dd class="col-sm-9">{{ detailData.client | toTextIdName}}</dd>

                                    <dt class="col-sm-3">기본 주차장</dt>
                                    <dd class="col-sm-9">{{ detailData.mainZone | toTextIdName}}</dd>

                                    <dt class="col-sm-3">결제액</dt>
                                    <dd class="col-sm-9">{{ detailData.billedAmt | three_comma}} 원</dd>

                                    <dt class="col-sm-3">실제 결제액</dt>
                                    <dd class="col-sm-9">{{ detailData.payedAmt | three_comma}} 원</dd>

                                    <dt class="col-sm-3">결제 수단</dt>
                                    <dd class="col-sm-9">{{ payMethods[detailData.payMethod] | emptyCheck}}</dd>

                                    <dt class="col-sm-3">결제 수단 번호(암호화)</dt>
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
                              </dl>
                        </b-card>
                  </b-col>
            </b-row>
      </PageLayout_noWhiteBg>
</template>

<style scoped>
.list-group .list-group-item:hover {
    background-color: #5b73e8;
    color: #ffffff;
}
</style>
