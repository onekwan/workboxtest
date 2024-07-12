<script>
import PageLayout_noWhiteBg from "~/components/common/PageLayout_noWhiteBg";
import {mapState} from "vuex";
import PG_module from "@/pages/pg/index.vue";
import mixin_const from "@/mixin/mixin_const";

export default {
      mixins: [mixin_const],
    components: {
        PageLayout_noWhiteBg,
          PG_module
    },
    data() {
        return {
            title: "상품 결제",
            selected_payMethod: '',
            isMobile: this.$isMobile(),
            pageLoading: true,
            api_flag: false,
            payMethods: [],

            detailData: {},
            mainZoneID: null
        };
    },
    middleware: "authentication",
      created(){
          for(let prop in $const.payMethods){
                let disabled = false;
                if(prop==='CARD'){
                      this.payMethods.push({
                            name : $const.payMethods[prop],
                            key : prop,
                            disabled : false
                      })
                }
                // if(prop !== 'CARD'){
                //       disabled = true;
                // }
                // this.payMethods.push({
                //       name : $const.payMethods[prop],
                //       key : prop,
                //       disabled : disabled
                // })
          }

      },
    mounted() {
        this.getDetail();
    },
    computed: {
        ...mapState('product', {
            orderId: state => state.orderId
        })
    },
    methods: {
        async getDetail() {
            this.pageLoading = true;

            try {
                const res = await mainapi.invokeAPI_GET('/api/v1/orders/' + this.orderId, {}, 'GET')

                if (res.data.code !== $const.ApiSuccessCode.GET) {
                    tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg)
                }
                const data = res.data.data;
                this.detailData = data;
                this.$store.commit('product/SET_CURRENT_PRODUCT', data);

                {

                    let url = this.detailData.type === 'PASS' ? '/api/v1/pass-products/' : '/api/v1/discount-products/';
                    url = url + this.detailData.product.id;
                    const res = await mainapi.invokeAPI_GET(url, {}, 'GET')
                    if (res.data.code !== $const.ApiSuccessCode.GET) {
                        tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg)
                    }

                    const data = res.data.data;
                    let FormId = this.detailData.type === 'PASS' ? data.passForm.id : data.discountForm.id;

                    //정기권 시작일 종료일 받고

                    {
                        let url = this.detailData.type === 'PASS' ? '/api/v1/pass-forms/' : '/api/v1/discount-forms/';
                        const res = await mainapi.invokeAPI_GET(url + FormId, {}, 'GET')

                        if (res.data.code !== $const.ApiSuccessCode.GET) {
                            tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg)
                        }
                        const data = res.data.data;
                        this.mainZoneID = data.mainZone.id;
                        //메인존 아이디 받고
                    }


                }
                this.pageLoading = false;
            } catch (e) {
                tool_app.dialog_alert(e);
            } finally {
                this.pageLoading = false;
            }
        },
          loadPaymentModule() {
              this.$refs.pg_module.open_module({
                    type : 'nicepay',
                    data : this.detailData,
                    mainZoneId : this.mainZoneID,
                    PayMethod : this.selected_payMethod
              });
          },
        async orderCancel() {
            if (this.api_flag) {
                tool_app.dialog_alert("데이터 전송중입니다.");
                return;
            }
            this.api_flag = true;

            try {
                const res = await mainapi.invokeAPI('/api/v1/orders/' + this.detailData.id, {}, 'DELETE');

                if (res.data.code !== $const.ApiSuccessCode.DELETE) {
                    throw res.data.msg;
                    return false;
                }
                tool_app.dialog_success(`주문을 취소했습니다.`);
                this.$router.push('/');
            } catch (e) {
                tool_app.dialog_alert(`주문 취소에 실패하였습니다.` + "<br/>" + tool_app.ErrorMsg(e));
            } finally {
                this.api_flag = false;
            }
        },
    }
};
</script>

<template>
      <PageLayout_noWhiteBg :title="title" :page-loading="pageLoading">
            <b-row>
                  <b-col cols="12">
                        <h5>주문정보</h5>
                        <b-card>
                              <dl class="row mb-0">
                                    <dt class="col-sm-3">주문 UID</dt>
                                    <dd class="col-sm-9">{{ detailData.id | emptyCheck }}</dd>

                                    <dt class="col-sm-3">상품 유형</dt>
                                    <dd class="col-sm-9">{{ productType[detailData.type] | emptyCheck }}</dd>

                                    <dt class="col-sm-3">상품</dt>
                                    <dd class="col-sm-9">{{ detailData.product | toTextIdName }}</dd>

                                    <dt class="col-sm-3">주문 개수</dt>
                                    <dd class="col-sm-9">{{ detailData.qty | three_comma }}</dd>

                                    <dt class="col-sm-3">단가</dt>
                                    <dd class="col-sm-9">{{ detailData.unitPrice | three_comma }} 원</dd>

                                    <dt class="col-sm-3">주문액</dt>
                                    <dd class="col-sm-9">{{ detailData.price | three_comma }} 원</dd>

                                    <dt class="col-sm-3">정기권 상품의 경우 차량번호(암호화)</dt>
                                    <dd class="col-sm-9">{{ detailData.carNumber | emptyCheck }}</dd>

                                    <dt class="col-sm-3">주문 입주사</dt>
                                    <dd class="col-sm-9">{{ detailData.orderer | toTextIdName }}</dd>

                                    <dt class="col-sm-3">승인 필요 여부</dt>
                                    <dd class="col-sm-9">{{ detailData.approvalRequired }}</dd>

                                    <dt class="col-sm-3">승인자 UID</dt>
                                    <dd class="col-sm-9">{{ detailData.approverId  | emptyCheck }}</dd>

                                    <dt class="col-sm-3">승인자 이름</dt>
                                    <dd class="col-sm-9">{{ detailData.approverName  | emptyCheck }}</dd>

                                    <dt class="col-sm-3">승인 일시</dt>
                                    <dd class="col-sm-9">{{ detailData.approved  | emptyCheck }}</dd>

                                    <dt class="col-sm-3">관련 결재</dt>
                                    <dd class="col-sm-9">{{ detailData.payment | emptyCheck }}</dd>

                                    <dt class="col-sm-3">등록자 UID</dt>
                                    <dd class="col-sm-9">{{ detailData.creatorId  | emptyCheck }}</dd>

                                    <dt class="col-sm-3">등록자 이름</dt>
                                    <dd class="col-sm-9">{{ detailData.creatorName  | emptyCheck }}</dd>

                                    <dt class="col-sm-3">등록 일시</dt>
                                    <dd class="col-sm-9">{{ detailData.created  | emptyCheck }}</dd>

                              </dl>
                        </b-card>
                        <h5>
                              총 구매금액
                        </h5>
                        <div class="card">
                              <div class="card-body">
                                    <b-row>
                                          <b-col cols="6">
                                                <span class="bold">총 금액</span>
                                          </b-col>
                                          <b-col cols="6" class="text-right">
                                                <span class="font-size-18 text-primary bold">{{
																		  detailData.price | three_comma
                                                      }} 원</span>
                                          </b-col>
                                    </b-row>
                              </div>
                        </div>
                        <h5>결제수단</h5>
                        <b-card>
                              <label v-for="item in payMethods" style="display: block" class="mb-2" :key="item.key"><input
                                      type="radio" class="mr-5" :value="item.key" name="radio_payType" :disabled="item.disabled"
                                      v-model="selected_payMethod"/>{{ item.name }}</label>
                        </b-card>
                        <div class="mt-3 text-right">
                              <button type="button" class="btn btn-secondary" @click="orderCancel">취소</button>
                              <button type="button" class="btn btn-info" @click="loadPaymentModule">결제하기</button>
                        </div>
                  </b-col>
            </b-row>
            <PG_module ref="pg_module"/>
      </PageLayout_noWhiteBg>
</template>

<style scoped>

</style>
